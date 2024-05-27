import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import http from 'http';
import { registerSocket } from 'server/registerSocket';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);
registerSocket(io);

const viteDevServer =
    process.env.NODE_ENV === 'production'
        ? undefined
        : await import('vite').then((vite) =>
              vite.createServer({
                  server: { middlewareMode: true },
              }),
          );

const remixHandler = createRequestHandler({
    //@ts-expect-error Record is not ServerBuild
    build: viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
        : await import('../build/server'),
});

if (viteDevServer) {
    app.use(viteDevServer.middlewares);
} else {
    // Vite fingerprints its assets so we can cache forever.
    app.use(
        '/assets',
        express.static('build/client/assets', {
            immutable: true,
            maxAge: '1y',
        }),
    );
}
app.use(express.static('build/client', { maxAge: '1h' }));

app.all('*', remixHandler);
server.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
