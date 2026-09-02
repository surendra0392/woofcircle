# Contributing to WoofCircle

## Transfer / Assign Validation Rule

**Every endpoint that transfers or assigns an entity to another admin MUST validate both hierarchy AND role.** A single-layer check (hierarchy only or role only) is a bug.

### The Two Layers

```php
// Layer 1 — Hierarchy: target must be a subordinate or direct manager
$validIds = $admin->allSubordinates()->pluck('id');
if ($admin->manager_id) {
    $validIds->push($admin->manager_id);
}
if (! $validIds->contains($targetId)) {
    // reject — outside your reporting tree
}

// Layer 2 — Role: target must be eligible to receive this entity type
if (! in_array($targetAdmin->role, $allowedRoles)) {
    // reject — wrong role for this entity
}
```

### Using the Trait (Preferred)

The `HasTransferValidation` concern provides both checks as reusable methods:

```php
use App\Http\Controllers\Concerns\HasTransferValidation;

class SomeController extends Controller
{
    use HasTransferValidation;

    public function transfer(Request $request, Entity $entity)
    {
        // Handles hierarchy check + role validation in one call:
        $redirect = $this->validateTransferTarget(
            $request->assigned_to, config('roles.agent'), 'assigned_to', 'entity',
        );
        if ($redirect) return $redirect;

        $entity->update(['assigned_to' => $request->assigned_to]);
    }

    public function index()
    {
        // Filters the dropdown to only show eligible targets:
        $eligibleTargets = $this->eligibleTargets(config('roles.agent'));
        // ...
    }
}
```

### Role Lists: Always Use `config('roles.*')`

**Never hard-code role arrays.** All role lists are centralized in [`config/roles.php`](config/roles.php):

| Portal | Config Key | Used By |
|---|---|---|
| Agent | `config('roles.agent')` | `CheckFieldAgent`, `AgentDashboardController`, `InternalTicketController` |
| Support | `config('roles.support')` | `CheckSupportAgent`, `SupportTicketController` |
| HR | `config('roles.hr')` | `CheckHr`, `PayoutController`, `SupportTicketController` (escalation) |
| Admin Panel | `config('roles.admin')` | `CheckAdmin` |

If a new role is ever added to the system, the **only** place it needs to be added is `config/roles.php` — every guard, middleware, and transfer endpoint picks it up automatically.

### Exceptions

- **Self-assignment** (`auth('admin')->id()` on `claim()` methods) is inherently safe — you can only assign to yourself. No hierarchy or role check needed.
- **Unassign / null-out** (setting `assigned_to = null`) is also safe — no target to validate.

### Reference

See [`docs/transfer-role-validation.md`](docs/transfer-role-validation.md) for the full architecture doc with all 3 reference cases (Support, Agent, HR portals).

---

## Development Setup

<!-- Add project-specific setup instructions here as the project grows. -->

## Coding Standards

- PHP: Laravel Pint (`vendor/bin/pint`)
- TypeScript: ESLint + Prettier (`npm run lint`, `npm run format`)
- Run the full quality gate before committing: `php -l app/ && php artisan test && vendor/bin/phpstan analyse`
