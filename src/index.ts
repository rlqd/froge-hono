import froge from "froge";
import type { Hono } from "hono";
import type { Server } from "http";

interface HttpServerOptions {
    host?: string,
    port?: number,
}

export default function createHonoServer(app: Hono, options: HttpServerOptions = {}) {
    return froge().up({
        http: async ctx => {
            const config = {
                ...options,
                host: options.host ?? ctx.envs.HTTP_HOST.string('0.0.0.0'),
                port: options.port ?? ctx.envs.HTTP_PORT.port(8080),
            };
            let stop: () => Promise<void>;
            if (typeof Bun !== 'undefined') {
                const server = Bun.serve({
                    fetch: app.fetch,
                    hostname: config.host,
                    port: config.port,
                });
                stop = () => server.stop();
            } else if (typeof Deno !== 'undefined') {
                let server: Deno.HttpServer;
                await new Promise(resolve => {
                    server = Deno.serve({
                        hostname: config.host,
                        port: config.port,
                        onListen: resolve,
                    }, app.fetch)
                });
                stop = () => server!.shutdown();
            } else {
                let nodeAdapter;
                try {
                    nodeAdapter = require('@hono/node-server');
                } catch {
                    throw new Error('Please install "@hono/node-server" to use Hono with NodeJS');
                }
                let server: Server;
                await new Promise(resolve => {
                    server = nodeAdapter.serve({
                        fetch: app.fetch,
                        hostname: config.host,
                        port: config.port,
                    }, resolve);
                });
                stop = () => new Promise((resolve, reject) => server!.close(err => err ? reject(err) : resolve()));
            }
            ctx.log(`HTTP server is listening at http://${config.host}:${config.port}`);
            return {
                config,
                stop,
            };
        },
    }).down({
        http: async server => await server.stop(),
    });
};
