# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Supabase admin setup

- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment.
- Apply `supabase_schema.sql` in the Supabase SQL editor.
- After creating users in Supabase Auth, assign roles using the `user_roles` table. Example (replace `<user_uuid>` with the user's id):

```sql
INSERT INTO public.user_roles (user_id, role) VALUES ('<user_uuid>', 'admin');
```

Use the Supabase dashboard to find the `auth.users` id for your admin account. This RBAC setup allows multiple admins and avoids hardcoding emails in the frontend or policies.
- The app uses a magic-link email login for admin: click "Admin Login", enter the admin email, and follow the link sent to your inbox.

Security notes: the frontend uses the anon key and Row Level Security (RLS) on `resume_profile` so public users can read but only users with role `admin` in `user_roles` can modify data.
