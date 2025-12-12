# Metrix Admin Panel Documentation

The Metrix Admin Panel is a comprehensive tool for managing the esports platform.

## 🚀 Getting Started

1. **Database Setup**: Run the SQL commands in `ADMIN_DATABASE_SCHEMA.md` in your Supabase SQL Editor.
2. **Access Control**: Run the SQL command in `ADMIN_SETUP.md` to make your account an admin.
3. **Login**: Go to `/admin` to access the dashboard.

## 📱 Features

### 1. Dashboard (`/admin`)

- **Real-time Metrics**: Total players, active tournaments, open disputes, revenue stats.
- **Quick Links**: Access strictly necessary areas quickly.
- **Recent Activity**: See what's happening on the platform at a glance.

### 2. User Management (`/admin/users`)

- **List View**: Search, filter by status (Active/Banned).
- **Detail View**: Full profile, earnings, transaction history, and tournament history.
- **Actions**: Ban/Unban users directly.

### 3. Spectator Management (`/admin/spectators`)

- **Applications**: Review and approve new spectators.
- **Active List**: Monitor performance (accuracy, matches verified).
- **Quality Control**: Identify underperforming spectators.

### 4. Tournament Management (`/admin/tournaments`)

- **Create**: Full form to launch new tournaments with custom rules, formats, and prizes.
- **Manage**: Start/End tournaments, delete if necessary (with cascading data deletion protection).
- **Monitor**: Track participants and status.

### 5. Matches & Disputes (`/admin/matches`)

- **Match Monitoring**: View all scheduled and ongoing matches.
- **Dispute Resolution**: Dedicated interface to review evidence (screenshots/videos) and rule on conflicts.
- **Actions**: Uphold or Reject disputes with admin notes.

### 6. Payments (`/admin/payments`)

- **Withdrawals**: Review and mark withdrawal requests as Paid or Rejected.
- **Revenue**: (Future) Detailed financial analytics.

### 7. Settings (`/admin/settings`)

- **Platform Configuration**: Adjust commission rates, spectator pay, and minimum withdrawal limits without code changes.

## 🔒 Security

- **Role-Based Access**: Only users with `is_admin: true` in their profile can access these pages.
- **Server-Side Verification**: All database actions are protected by RLS (Row Level Security) policies or Admin-only API functions.
