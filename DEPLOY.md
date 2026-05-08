# Cloudflare Deploy

This project deploys to:

- `https://clip-hunter.online`

## Manual deploy

```bash
npx wrangler deploy --keep-vars --domains clip-hunter.online
```

## GitHub Actions

Push to `main` triggers:

- [deploy-cloudflare.yml](./.github/workflows/deploy-cloudflare.yml)

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Current Cloudflare account id used for deploy:

- `ae04d1d543477edb535f561e480ce4bc`

## Runtime config

Non-secret vars are defined in [wrangler.jsonc](./wrangler.jsonc):

- `BACKEND_URL=https://dashboard.clip-hunter.online`
- `MOCK_DISCORD_ID=765432198765432100`
- `MOCK_USERNAME=Test Creator`

Secret configured in Cloudflare Worker:

- `DASHBOARD_API_KEY`
