import { before, after, beforeEach, describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import createHonoServer from '../src';
import froge from 'froge';
import { Hono } from 'hono';

describe('froge-hono', () => {
    it('basic usage', async () => {
        const server = froge().configure({
            verbose: false,
        }).up({
            hello: () => 'Hello, World!',
        }).use(ctx => {
            const app = new Hono();
            app.get('/hello', c => c.text(ctx.services.hello))
            return createHonoServer(app);
        });
        await server.start();
        try {
            const resp = await fetch('http://localhost:8080/hello');
            assert.ok(resp.ok);
            const text = await resp.text();
            assert.equal(text, 'Hello, World!');
        } finally {
            await server.stop();
        }
    });
});
