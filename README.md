# Froge-hono

[Froge](https://www.npmjs.com/package/froge) adapter for [Hono](https://www.npmjs.com/package/hono) web framework.

Supports Bun / Deno / NodeJS.

![froge-hono](froge-hono.webp)

```sh
npm i froge hono froge-hono
```

For NodeJS, also install the adapter:

```sh
npm i @hono/node-server
```

<a href="https://www.npmjs.com/package/froge-hono"><img alt="NPM Version" src="https://img.shields.io/npm/v/froge-hono"></a>
<a href="https://www.npmjs.com/package/froge-hono"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/froge-hono"></a>

## Usage

```typescript
import froge from "froge";
import { Hono } from "hono";

import createHonoServer from "froge-hono";

const server = froge().up({
    hello: () => 'Hello, World!',
}).use(ctx => {
    // Create Hono app as usual
    const app = new Hono();
    app.get('/hello', c => c.text(ctx.services.hello))

    // Adapter will handle start/stop with your Froge server
    return createHonoServer(app);
});

server.launch().then(() => console.log('Ready'));
```

## Configuration

Optional configuration is accepted as a second argument:

```typescript
// Example configuration with each option set to default
createHonoServer(app, {
    host: '0.0.0.0',
    port: '8080',
    bunIdleTimeout: 10,
})
```

Alternatively, some options may be set as environmental variables:

* `HTTP_HOST` - equivalent to `host` config option
* `HTTP_PORT` - equivalent to `port` config option
