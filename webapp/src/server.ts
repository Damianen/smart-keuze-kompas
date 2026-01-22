import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import helmet from 'helmet';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Security headers
const isProd = process.env['NODE_ENV'] === 'production';

app.use(
  helmet({
    strictTransportSecurity: isProd
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false, // don’t send HSTS in dev over http

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],

        // If you can, try to remove 'unsafe-inline' later.
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],

        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:"],

        // Only allow your real API domain(s) in prod
        connectSrc: isProd
          ? ["'self'", "https://api.yourdomain.com"]
          : ["'self'", "http://localhost:3000", "https:"],

        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        frameSrc: ["'none'"],

        // Only if your whole site is HTTPS
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },

    frameguard: { action: 'deny' }, // (helmet option name is frameguard)
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
);
app.disable('x-powered-by');
/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    immutable: true,
    index: false,
    redirect: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
