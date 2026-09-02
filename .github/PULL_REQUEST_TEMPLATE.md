## Description

<!-- Briefly describe the purpose of this PR. -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation
- [ ] CI / Dev tooling

## Transfer / Assign Validation

> **If this PR adds or modifies any endpoint that transfers or assigns an entity (ticket, payout, profile, etc.) to another admin, the checklist below must be completed.** See [`CONTRIBUTING.md`](../CONTRIBUTING.md#transfer-role-validation-rule) for the full rule and [`docs/transfer-role-validation.md`](../docs/transfer-role-validation.md) for reference cases.

- [ ] The endpoint validates **hierarchy** — target is in the current admin's reporting tree (subordinate or direct manager)
- [ ] The endpoint validates **role** — target has an eligible role (use `config('roles.*')`, not a hard-coded array)
- [ ] The dropdown/selector that renders eligible targets is filtered by the same role list
- [ ] Self-assignment (`auth('admin')->id()`) is exempt from both checks

## How Has This Been Tested?

- [ ] PHP syntax check (`php -l`)
- [ ] PHPUnit tests pass (`php artisan test`)
- [ ] Manual testing performed

## Checklist

- [ ] My code follows the project's coding style
- [ ] I have added/updated tests to cover my changes
- [ ] All existing and new tests pass
