# Splitify Shared-Living Mobile App

The app supports two role-specific mobile experiences. Navigation displays only
the route for the current role.

## Roommate/member

1. **Home** - Current balance, active bills, and recent activity.
2. **Bills** - Shared utility bills and cash/digital payment proof submissions.
3. **Attendance** - Set presence days from 0 to 30 and view prorated utility and
   meal share estimates.
4. **Maintenance** - Submit repair requests and follow their status and
   allocated per-roommate share.
5. **Settlement** - Net balance, peer settlement requests, and Raast/Easypaisa
   payment details.

## Admin

The restored admin mobile experience includes dashboard, bill management,
roommate/member management, maintenance allocation, payment setup, analytics,
and ledger audit routes.

## Authentication requirement

The login screen's Admin/Roommate role switch is a development-only preview.
It is hidden in release builds and does not authenticate anyone. Production
sign-in and signup remain disabled until a backend verifies credentials and
provides a trusted role claim. The backend must enforce authorization for all
admin data and operations; hiding a client-side route is not an authorization
boundary.

## UI conventions

- Teal `#0D9488` for primary actions and active navigation.
- Copper `#D97706` for due or pending states.
- Light canvas `#F8FAFC` with white cards and `#E2E8F0` borders.
- Use safe-area insets, compact bottom navigation, and tabular numerals for
  currency and day counts.

## Prototype data boundary

Roommate screens currently use demonstration balances and group records.
Payment proofs and maintenance photos can be selected locally, but are not
uploaded or persisted; payment verification and request allocation require a
connected backend before production use.
