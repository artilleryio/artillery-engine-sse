# artillery-engine-sse

This engine adds support for load testing [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) APIs with Artillery.

**Note** - this is an early release and is not considered production-ready. Your feedback would be very appreciated.

# Features

- Open, hold and close connections to SSE-based URLs
- Set up custom event and message handlers

See [`test.yml`](./test.yml) for an example test script.

# Usage

1. Clone this repo, install dependencies with `npm install`.
2. Set up `NODE_PATH` so that Artillery can load this engine. Run the following command from inside this repo:

    ```
    export NODE_PATH=`pwd`/..
    ```

Artillery will be able to load the engine and test SSE endpoints now.

Run the bundled example ([`test.yml`](./test.yml))

1. `node sse-server.js`
2. `artillery run test.yml`

Example output which shows:

- The number of open SSE connections (`sse.open`)
- The number of custom `server-time` events processed (`sse.events.server-time`)
- The number of SSE messages received (`sse.message`)

```
All VUs finished. Total time: 20 seconds

--------------------------------
Summary report @ 10:53:48(+0000)
--------------------------------

custom_handler: ................................................................ 90
sse.events.server-time: ........................................................ 90
sse.message: ................................................................... 90
sse.open: ...................................................................... 10
vusers.completed: .............................................................. 10
vusers.created: ................................................................ 10
vusers.created_by_name.0: ...................................................... 10
vusers.failed: ................................................................. 0
vusers.session_length:
  min: ......................................................................... 10007.3
  max: ......................................................................... 10028.4
  median: ...................................................................... 9999.2
  p95: ......................................................................... 9999.2
  p99: ......................................................................... 9999.2
```

# Upcoming improvements

- Integrate SSE support directly into the official HTTP engine in Artillery instead of requiring a separate engine

# License

This code is distributed under the terms of the MPL v2.0 license.