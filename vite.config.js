import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Serves the api/ folder during `npm run dev`, the way the production host
 * does, so the Schedule a Call form works locally without a second process.
 *
 * This runs in the Vite process only — it is never part of the browser bundle,
 * so the secrets it loads stay server-side.
 */
const apiRoutes = (env) => ({
  name: 'bootstack-api-dev',
  configureServer(server) {
    // The handler reads process.env; Vite keeps unprefixed vars out of the
    // client bundle, so they are only ever visible here.
    Object.assign(process.env, env);

    server.middlewares.use(async (req, res, next) => {
      if (!req.url || !req.url.startsWith('/api/')) return next();
      const route = req.url.split('?')[0].replace(/^\/api\//, '');
      try {
        const mod = await server.ssrLoadModule(`/api/${route}.js`);
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
          return res;
        };
        await mod.default(req, res);
      } catch (error) {
        console.error(`[api] ${route}`, error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Local API route failed.' }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  // '' prefix loads every var, not just VITE_ ones.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), apiRoutes(env)],
    server: { port: 5173, open: true },
    build: { outDir: 'dist', sourcemap: false },
  };
});
