# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Install dependencies:

```bash
npm install
```

Copy environment variables (optional — defaults are in `nuxt.config.ts`):

```bash
cp .env.example .env
```

## Local HTTPS (hihesab.test)

The dev server runs on `https://hihesab.test:3000` and talks to the Laravel API at `http://api.hihesab.test`. You need local TLS certificates and hosts entries before starting the app.

### Prerequisites

- Install [mkcert](https://github.com/FiloSottile/mkcert)
- Trust the local CA once: `mkcert -install`

### Hosts file

Add these lines to your hosts file:

- **Windows:** `C:\Windows\System32\drivers\etc\hosts`
- **macOS / Linux:** `/etc/hosts`

```
127.0.0.1 hihesab.test
127.0.0.1 api.hihesab.test
```

### SSL certificates

Certs are read from `docker/certs/` in `nuxt.config.ts`:

```bash
mkdir -p docker/certs
mkcert -cert-file docker/certs/hihesab.test.pem -key-file docker/certs/hihesab.test-key.pem hihesab.test
```

To cover both the frontend and API with one certificate:

```bash
mkcert -cert-file docker/certs/hihesab.test.pem -key-file docker/certs/hihesab.test-key.pem hihesab.test api.hihesab.test
```

Cert files are gitignored (`docker/certs/.gitignore`).

If the cert files are missing, the dev server starts without HTTPS on `http://hihesab.test:3000`.

### Nuxt HTTPS config

`nuxt.config.ts` loads the key/cert from `docker/certs/` when present and binds the dev server to `hihesab.test:3000`:

```ts
const certKey = './docker/certs/hihesab.test-key.pem'
const certCert = './docker/certs/hihesab.test.pem'

...(fs.existsSync(certKey) && fs.existsSync(certCert)
  ? {
      devServer: {
        https: {
          key: fs.readFileSync(certKey, 'utf8'),
          cert: fs.readFileSync(certCert, 'utf8'),
        },
        host: 'hihesab.test',
        port: 3000,
      },
    }
  : {
      devServer: {
        host: 'hihesab.test',
        port: 3000,
      },
    }),
```

API URLs can be overridden with `NUXT_PUBLIC_BASE_URL` and `NUXT_PUBLIC_API_BASE` (see `.env.example`).

## Development Server

Start the development server on `https://hihesab.test:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview the production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
