# Project Status: Domestic Official Site

Last reviewed: 2026-06-03

## Current Role

This project is the domestic edition of the Reallier official site for `intjsys.com`.
It is a low-frequency production site focused on domestic-facing display, compliance,
and official business presence. It should be treated as an independently maintained
website, not as an archive, disposable copy, or automatic mirror of `official-site-international`.

Primary purposes:

- Keep the ICP-related domestic site available and presentable.
- Provide a complete domestic-facing display site for brand, services, products, cases,
  contact, privacy, terms, and compliance pages.
- Preserve a working Docker deployment path for `intjsys.com`.
- Support occasional standalone redesign or page rebuilds when the domestic business
  narrative needs to change.

The international site is the baseline for public brand identity, visual language, and core
information architecture. The domestic edition deliberately ships a smaller, allowlisted
surface for the domestic audience. The build-time source of truth is
`data/domesticPolicy.mjs`.

## Production Notes

- Production image: `ccr.ccs.tencentyun.com/reallier/intjsys-official:latest`
- Public domain: `intjsys.com`
- Runtime style: Docker image behind Traefik
- Deployment script: `scripts/deploy.sh`
- Compose files: `compose.yml`, `compose.prod.yml`

Do not remove this project while the domain or ICP-related deployment still depends on it.

## Maintenance Rules

- Maintain this project as the allowlisted domestic display edition.
- Align the public visual shell and core information architecture with the international site.
- Do not mirror international modules outside `data/domesticPolicy.mjs`.
- When the site falls behind, prefer a focused standalone page rebuild over scattered
  patch-level copying.
- Keep the domestic site focused on display, conversion, contact, and compliance.
- Treat product names such as TalentAI and MindAI as promotional/showcase content on this
  site. Do not wire domestic-site CTAs directly to product service domains by default.
- Do not add international-site backend features here by default, including login,
  admin, comments, RAG/knowledge APIs, Prisma/database workflows, Signal, or private
  dashboards.
- Add experimental features only when they are required for the domestic production site.
- Before cleanup, confirm you are working in a local checkout, not on the production server.
- Before deploying, run a local build and confirm the Docker image can be rebuilt from source.

## Display Scope

Domestic-site display capability should cover these areas when the site is refreshed:

- Home page: brand, positioning, primary services, product matrix, credibility, and CTA.
- About page: company role, founder/team context, operating philosophy, and cooperation style.
- Services or capabilities: what the company delivers, who it is for, and how engagement works.
- Cases or product entries: selected products, experiments, or delivery examples suitable for
  domestic visitors.
- Contact page: clear contact channel, business inquiry path, and domestic-facing company details.
- Compliance pages: ICP-related footer, privacy policy, terms, and required public information.

Features outside this scope should be evaluated as separate product work rather than added
to the domestic official site by default.

## Safe Local Cleanup Candidates

The following are generally rebuildable in a local checkout, but should still be removed deliberately:

- `node_modules/`
- `.nuxt/`
- `.output/`
- `.vercel/`
- `.DS_Store`
- `build_log.txt`

Do not delete source files, deploy files, environment examples, content, public assets, Docker config, or compose files as part of cleanup.

## Secrets

Real `.env` files, private keys, and production credentials should stay out of git and out of general resource organization.
Keep examples such as `.env.production.example`, but store real values in the deployment environment or a private local secrets location.
