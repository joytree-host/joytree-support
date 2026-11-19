/* ==========================================================================
   JOYTREE Support — content model
   Support, not documentation: how to reach the team and fixes for the most
   common problems. How-to guides and feature references live in the docs at
   https://docs.joytree.site.
   NAV   = hierarchical sidebar (groups -> pages)
   PAGES = { key: { title, group, eyebrow, lede, md } }
   ========================================================================== */

const NAV = [
  {
    key: 'help', title: 'Contact us',
    children: [
      { key: 'account-support', title: 'Contact support' },
    ]
  },
  {
    key: 'troubleshoot', title: 'Troubleshooting',
    children: [
      { key: 'ts_deploy_failed', title: 'My deployment failed' },
      { key: 'ts_login_stuck', title: "Google sign-in isn't completing" },
      { key: 'ts_domain_not_verifying', title: "My domain won't verify" },
      { key: 'ts_db_cant_connect', title: "Can't connect to my database" },
      { key: 'ts_env_vars_not_showing', title: 'Environment variable not showing' },
      { key: 'ts_billing_question', title: 'A charge looks wrong' },
    ]
  },
];

const PAGES = {

  // ───────────────────────── Contact us ─────────────────────────
  'account-support': {
    title: 'Contact support', group: 'Contact us', eyebrow: 'Contact us',
    lede: 'Reach the JOYTREE team. Tell us what you are seeing and we will get back to you by email.',
    md: `
## Ways to reach us

- **Email** — [support@joytree.site](mailto:support@joytree.site)
- **WhatsApp Community** — [join the community](https://chat.whatsapp.com/CfTUZ0r6QlW6htOSR0erNv) to ask other JOYTREE users.
- **From the terminal** — send a message with the CLI. We reply to the email on your account.

\`\`\`bash
joytree support --message "Deploys for my-site have been stuck in 'building' for 20 minutes."
\`\`\`

## What to include

The more we know up front, the faster we can look at it:

- Your **project name**, and the deployment, database or session ID if it applies.
- What you **expected**, and what **happened instead**, with the exact error text if there is one.
- **When** it started, and the approximate time you last tried.
- The **email on your account**.

## Before you write

Many problems have a quick fix. Check the **[Troubleshooting](#/ts_deploy_failed)** articles first: failed deployments, sign-in, domain verification, database connections, environment variables and unexpected charges.

## Looking for a how-to guide?

Step-by-step guides and feature references live in the docs at **[docs.joytree.site](https://docs.joytree.site)**.
`
  },

  // ───────────────────────── Troubleshooting ─────────────────────────
  ts_deploy_failed: {
    title: 'My deployment failed. What do I check first?', group: 'Troubleshooting', eyebrow: 'Deployments',
    lede: 'The fastest ways to find out why a build failed and get it live again.',
    md: `
Most failed builds fall into a small number of categories, and the **Build status & logs** panel almost always tells you which one within the first few lines.

## 1. Read the log, not just the status

Open the failed deployment and expand the log stream. Look for the first \`error\` or non-zero exit code — everything after it is usually noise from the process shutting down, not the actual cause.

## 2. Common causes

- **Missing build/start command.** Static sites need a working build command that outputs to the right directory; server sites need a start command that actually launches a long-running process (not one that exits immediately).
- **Missing environment variable.** If your app throws on startup reading \`process.env.SOMETHING\`, add it under the project's **Environment Variables** tab and redeploy.
- **Wrong Node/Python/etc. version.** Check your framework preset matches what your app actually needs.
- **Dependency install failure.** A private package without credentials, or a lockfile mismatch, will fail at install time — this shows up early in the log.

## 3. Let the AI Agent take a look

From the failed deployment, choose **Fix with AI Agent**. It clones the repo, reads the exact build log, and opens a pull request with a fix — you review and merge it, then redeploy.

:::tip
If a deploy is stuck "Building" for an unusually long time rather than failing outright, it's very likely still legitimately working — large dependency installs or slow test suites can take several minutes. Give it a few minutes before assuming something's wrong.
:::

Still stuck? **[Contact support](#/account-support)** with the project name and we'll take a look.
`
  },

  ts_login_stuck: {
    title: "Google sign-in isn't completing. What's going on?", group: 'Troubleshooting', eyebrow: 'Account',
    lede: 'What to do if you get stuck after choosing your Google account.',
    md: `
Occasionally a sign-in attempt can get interrupted mid-way — you'll see the page reload back to the homepage with a long \`?code=...\` parameter still sitting in the address bar instead of landing in your dashboard.

## Why this happens

Google issues a one-time authorization code as part of sign-in. If the page reloads or navigates away before that code finishes being exchanged for a session, the code is already used up and can't be retried — the only fix is to start the sign-in again from a clean state.

## How to fix it

1. **Clear the stuck URL.** Navigate directly to [joytree.site](https://joytree.site) rather than reloading the page with the \`code=\` parameter still in it.
2. **Fully close the tab** rather than just refreshing, so nothing left over from the interrupted attempt is still running.
3. **Try signing in again.** You should see Google's account picker every time — if it silently signs you in without asking, see below.

## Signed in as the wrong account?

JOYTREE always asks Google to show the account chooser on sign-in, so you shouldn't be silently logged in as whichever Google account your browser last used. If this happens, sign out from within JOYTREE first, then also check you don't have multiple Google accounts signed into the same browser profile — signing out of the unwanted one at [accounts.google.com](https://accounts.google.com) forces the picker to appear.

Still can't get in? **[Contact support](#/account-support)** — include the approximate time you tried, and we can trace it from our side.
`
  },

  ts_domain_not_verifying: {
    title: "My custom domain won't verify. What should I check?", group: 'Troubleshooting', eyebrow: 'Domains',
    lede: 'DNS propagation, common record mistakes, and how to confirm what JOYTREE actually sees.',
    md: `
Domain verification checks that the DNS records JOYTREE asked you to add are actually visible from the public internet. A few things commonly cause a delay or a hard failure.

## 1. Give it time

DNS changes can take anywhere from a few minutes to 24–48 hours to propagate fully, depending on your registrar and the previous record's TTL. If you just added the record, that alone is the most common reason verification hasn't passed yet.

## 2. Double-check the record itself

- The record **type** matches exactly what JOYTREE asked for (usually \`CNAME\` for subdomains, \`A\`/\`ALIAS\`/\`ANAME\` for a bare root domain).
- The record **value** is copied exactly, with no trailing dot or extra whitespace.
- You added it to the **correct zone** — a common mistake is adding it under a registrar's default parking-page DNS instead of the zone actually serving your domain.
- There isn't a **conflicting record** (e.g. an existing \`A\` record on the same name) — most DNS providers won't let two conflicting records coexist and will silently keep the old one.

## 3. Check what JOYTREE currently sees

Use **Domains → \`[your domain]\` → Check DNS** in the dashboard, or \`joytree domains check <domain>\` in the CLI, to see exactly which records JOYTREE is resolving right now — this is more reliable than checking with a random online DNS tool, since propagation is different at every location.

:::tip
If you recently changed nameservers at your registrar, the old and new nameservers can both still be answering for a while during the transition. Re-run verification after a few hours rather than repeatedly right away.
:::

Still failing after 48 hours with correct records? **[Contact support](#/account-support)**.
`
  },

  ts_db_cant_connect: {
    title: "My app can't connect to its database. What's wrong?", group: 'Troubleshooting', eyebrow: 'Databases',
    lede: 'The most common causes of connection failures and timeouts.',
    md: `
## 1. Is the database actually running?

Stopped databases don't accept connections. Check its status on the **Databases** page — start it if it's stopped.

## 2. Are you using the right connection string?

Copy the connection string fresh from **Database → Connect** rather than reusing one you saved earlier — credentials rotate if you ever reset them, and an old copy will fail authentication silently in a way that looks like a network issue.

## 3. Environment variable injection

If your app reads the connection string from an environment variable (e.g. \`DATABASE_URL\`), confirm it's actually attached to the *project*, not just visible on the database's own page — attaching a database to a project auto-injects its connection variables, but a database created separately needs to be **linked** to the project first.

## 4. SSL requirements

Managed Postgres and MySQL require SSL by default. If your client library defaults to no SSL, connections will be rejected. Most connection strings from JOYTREE already include the right \`sslmode\`/\`ssl\` parameter — don't strip it out.

## 5. Redis specifically

Redis connections use a different port and protocol than SQL databases — double check you're not accidentally pointing a Redis client at the Postgres port or vice versa if you provisioned multiple databases around the same time.

Still stuck? **[Contact support](#/account-support)** with the database ID and the exact error your app is throwing.
`
  },

  ts_env_vars_not_showing: {
    title: 'I set an environment variable but my app still can\u2019t see it', group: 'Troubleshooting', eyebrow: 'Projects',
    lede: 'Why a saved environment variable might not show up at runtime yet.',
    md: `
## Redeploy after changing variables

Environment variables are injected at **container start**, not read live — if you add, edit, or delete a variable while the app is already running, it won't see the change until the next deploy. Trigger **New Version** (or push a commit if auto-deploy is on) after editing variables.

## Check for typos in the key name

Variable names are case-sensitive and exact. \`Database_URL\` and \`DATABASE_URL\` are two different variables — if your code reads one and the dashboard has the other, it'll look like the variable "isn't there."

## Build-time vs. runtime variables

Some frameworks (notably static-site generators and frontend build tools like Vite or Next.js's client bundle) **bake environment variables into the build output** at build time, not read them at runtime. If you're using a build-time-only variable convention (e.g. anything prefixed \`VITE_\` or \`NEXT_PUBLIC_\`), changing it always requires a fresh build — a plain restart isn't enough.

## Auto-injected variables

JOYTREE auto-injects a handful of platform variables (routing, proxy, and — if a database is linked — its connection string). These appear automatically and don't need to be set manually; setting your own variable with the same name will override the auto-injected one, which is sometimes the actual cause of unexpected behavior.

Still not resolving? **[Contact support](#/account-support)**.
`
  },

  ts_billing_question: {
    title: 'A charge on my account looks wrong. Who do I talk to?', group: 'Troubleshooting', eyebrow: 'Billing',
    lede: 'What to check yourself, and how to get a billing issue looked at.',
    md: `
## Check your plan and usage first

Most unexpected charges come from **usage-based add-ons** (extra database storage, bandwidth overages, additional custom domains beyond your plan's included count) rather than a billing error. Review **Settings → Billing → Usage** for a breakdown of what was charged and why.

## Duplicate or unexpected subscriptions

If you signed up more than once, or a teammate separately upgraded a shared workspace, you may be seeing two active subscriptions. **Settings → Billing → Subscription** shows everything currently active on the account.

## Still looks wrong?

**[Contact support](#/account-support)** with:
- The approximate date of the charge
- The amount
- Your account email

Billing issues are handled directly by a person, not automated — expect a response within one business day.
`
  },

};
