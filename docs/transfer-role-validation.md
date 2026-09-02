# Transfer/Assign Endpoints: Hierarchy + Role Validation Rule

## The Rule

**Every endpoint that transfers or assigns an entity to another admin MUST validate both:**

1. **Hierarchy** — The target must be in the current admin's reporting tree (a subordinate or their direct manager)
2. **Role** — The target must have a role that is eligible to receive the assigned entity type

---

## The Bug That Prompted This

A support ticket could be transferred to an HR executive who had no workspace to resolve it. The hierarchy check passed (the HR exec was the admin's manager), but the role check was missing — the ticket became orphaned, and the HR staff had no way to process it in their portal.

The same pattern existed in two other places before it was caught:
- **PayoutController::transfer()** — payout could be assigned to a support agent
- **AgentDashboardController::transferProfile()** — a directory profile could be assigned to an HR admin

All three were fixed with the same two-layer pattern.

---

## The Pattern (Generic)

```php
private const ALLOWED_ROLES = ['role_a', 'role_b', 'superadmin'];

public function transfer(Request $request, Entity $entity)
{
    $admin = auth('admin')->user();

    // Layer 1: Hierarchy check
    $validTargets = $admin->allSubordinates()->pluck('id');
    if ($admin->manager_id) {
        $validTargets->push($admin->manager_id);
    }

    if (!$validTargets->contains($request->assigned_to)) {
        return redirect()->back()->withErrors([
            'assigned_to' => 'You cannot transfer outside your team hierarchy.',
        ]);
    }

    // Layer 2: Role check
    $targetAdmin = Admin::findOrFail($request->assigned_to);
    if (!in_array($targetAdmin->role, self::ALLOWED_ROLES)) {
        return redirect()->back()->withErrors([
            'assigned_to' => 'This user is not eligible to receive this entity.',
        ]);
    }

    $entity->update(['assigned_to' => $request->assigned_to]);
}
```

---

## Reference Cases

### 1. Support Portal — Ticket Transfer

**File:** `app/Http/Controllers/Support/SupportTicketController.php`

```php
private const SUPPORT_ROLES = [
    'support_manager', 'support_team_leader', 'support_agent', 'superadmin',
];

// Also has a separate HR_ROLES constant for the escalate-to-HR flow:
private const HR_ROLES = ['hr_director', 'hr_manager', 'hr_executive'];
```

The `transfer()` method validates `SUPPORT_ROLES` — only support agents can receive tickets. The `escalate()` method validates `HR_ROLES` — intentionally bypasses `SUPPORT_ROLES` for the "send to HR" path.

**Frontend corollary:** The `show()` method provides two separate filtered target lists:
- `eligibleTargets` — hierarchy members filtered by `SUPPORT_ROLES` (for the Transfer dropdown)
- `hrTargets` — hierarchy members filtered by `HR_ROLES` (for the Escalate to HR dropdown)

### 2. Agent Portal — Profile Transfer

**File:** `app/Http/Controllers/AgentDashboardController.php`

```php
private const AGENT_ROLES = [
    'state_head', 'district_head', 'area_manager', 'team_leader', 'field_agent', 'superadmin',
];
```

Matches `CheckFieldAgent::ALLOWED_ROLES`. Prevents profiles from being routed to HR or support admins who have no agent portal workspace.

**Frontend corollary:** The `index()` method filters `eligibleTargets` by `AGENT_ROLES` before passing to the dashboard page.

### 3. HR Portal — Payout Transfer

**File:** `app/Http/Controllers/Hr/PayoutController.php`

```php
private const PAYOUT_ROLES = ['hr_director', 'hr_manager', 'hr_executive', 'superadmin'];
```

Payouts are financial records — only HR-role admins can process them. The `transfer()` method validates against `PAYOUT_ROLES`. The `index()` method filters `eligibleTargets` by `PAYOUT_ROLES` for the frontend dropdown.

---

## Checklist for New Transfer Endpoints

When adding a new entity type that can be assigned or transferred between admins:

- [ ] Define a `self::X_ROLES` constant listing the eligible roles (include `'superadmin'` in every list)
- [ ] In the `transfer()` / assign method:
  - [ ] Validate hierarchy via `allSubordinates()->pluck('id')` + manager push
  - [ ] Validate role via `in_array($target->role, self::X_ROLES)`
  - [ ] Return a descriptive error for each check
- [ ] In the `index()` / `show()` method that provides the target dropdown:
  - [ ] Filter `eligibleTargets` by the same `X_ROLES` constant
  - [ ] Never expose non-eligible admins in the dropdown (prevents data visibility leaks)
- [ ] Review existing `claim()` endpoints — self-assignment via `auth('admin')->id()` is inherently safe (you can only assign to yourself), so hierarchy + role validation is unnecessary there
