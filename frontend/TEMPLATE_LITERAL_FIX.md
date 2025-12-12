# Template Literal Fix Script

## Problem

The user accidentally removed `$` from template literals `${variable}` when replacing dollar signs for currency.

## Pattern to Find

`{variable}` inside template strings (backticks)

## Should Be

`${variable}` inside template strings

## Files to Fix (Based on Error Logs)

All files that had `${` changed to `{` need to be reverted.

### Quick Fix Command

Use VS Code Find & Replace with Regex:

**Find:** `` `([^`]*){([^}]+)}([^`]*)` ``
**Replace:** `` `$1\${$2}$3` ``

This will find template literals with missing `$` and restore them.

## Manual Fix List

Go through each file and restore `$` in template literals:

- Dashboard layout
- Match pages
- Tournament pages
- Blog pages
- Admin pages
- Spectator pages
- Bonus page
- All component files

## Important

- Only restore `$` in template literals (between backticks)
- Do NOT restore `$` for currency values
- Currency should remain as `₦` (Naira symbol)
