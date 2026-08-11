/* ==========================================================================
   Joytree Support — Collection metadata
   Icon + description for each NAV group in content.js. Article counts are
   derived at render time from NAV itself, so they never go stale.
   ========================================================================== */

const COLLECTION_META = {
  start: {
    desc: 'What Joytree is, how it works, and how to ship your first deploy.',
    icon: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'
  },
  dashboard: {
    desc: 'A tour of the Command Center and how to make it your own.',
    icon: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>'
  },
  deploy: {
    desc: 'Deploying from GitHub or a folder, redeploys, rollbacks, and build logs.',
    icon: '<path d="M12 13v8"/><path d="m8 17 4-4 4 4"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>'
  },
  projects: {
    desc: 'Managing live projects, environment variables, and runtime logs.',
    icon: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/>'
  },
  databases: {
    desc: 'Postgres, MySQL, MongoDB, Redis, Query Studio, and migrations.',
    icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>'
  },
  domains: {
    desc: 'Custom domains, DNS records, verification, and TLD registration.',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
  },
  agent: {
    desc: 'The AI agent that diagnoses failed builds and opens fixes automatically.',
    icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>'
  },
  developer: {
    desc: 'Generate a hosted REST API from a plain-English description.',
    icon: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'
  },
  github: {
    desc: 'Linking your GitHub account, repositories, branches, and webhooks.',
    icon: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>'
  },
  ssh: {
    desc: 'Adding and managing SSH keys for authenticated Git operations.',
    icon: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>'
  },
  account: {
    desc: 'API keys, billing, workspace activity, and getting help.',
    icon: '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>'
  },
  cli: {
    desc: 'Installing the joytree command and the full command reference.',
    icon: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'
  },
  mcp: {
    desc: 'Connecting Joytree to Claude and other MCP-compatible tools.',
    icon: '<path d="M9 3v4"/><path d="M15 3v4"/><path d="M9 21v-4"/><path d="M15 21v-4"/><rect x="4" y="7" width="16" height="10" rx="2"/>'
  },
  api: {
    desc: 'The REST API that powers the dashboard, CLI, and MCP server.',
    icon: '<rect x="2" y="3" width="20" height="6" rx="1.5"/><rect x="2" y="15" width="20" height="6" rx="1.5"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>'
  },
  troubleshoot: {
    desc: 'Fixes for the most common issues — deploys, sign-in, DNS, databases, billing.',
    icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
  }
};

