function handleSSEMessage(msg, context, events) {
  if (!context.vars?.x) {
    context.vars.x = 1;
  }
  context.vars.x++;
  events.emit('counter', 'custom_handler', 1);
}

function onServerTime(e, context, events) {
  events.emit('counter', 'sse.events.server-time', 1);
}

module.exports = {
  handleSSEMessage,
  onServerTime
}