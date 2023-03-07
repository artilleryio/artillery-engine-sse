const EventSource = require('eventsource');
const A = require('async');

class SSEEngine {
  constructor(script, events, helpers) {
    this.script = script;
    this.events = events;
    this.helpers = helpers;

    this.target = script.config?.target;
    this.eventSourceConfig = script.config?.engines?.['sse'] || {};

    return this;
  }

  createScenario(spec, events) {
    const self = this;

    return function vu(initialContext, vuDone) {
      const steps = [];
      for (const step of spec.flow) {
        if (step === 'open') {

          steps.push(function open(next) {
            // TODO: need to wait for state here / handle connection error, e.g. with invalid URL
            const es = new EventSource(self.target, self.eventSourceConfig);
            es.on('error', (err) => {
              if (err.status) {
                events.emit('counter', `sse.error.${err.status}`, 1)
              } else {
                events.emit('counter', 'sse.error', 1);
              }
            });

            es.on('message', (_msg) => {
              events.emit('counter', 'sse.message', 1);
            });

            if (spec.onMessage) {
              // TODO: Warn if no processor function
              if (self.script.config.processor?.[spec.onMessage]) {
                es.on('message', (msg) => {
                  self.script.config.processor[spec.onMessage].call(null, msg, initialContext, events);
                });
              }
            }

            if(spec.onEvent) {
              for(const handlerSpec of spec.onEvent) {
                // TODO: Warn if no processor function
                if (self.script.config.processor?.[handlerSpec.handler]) {
                  es.on(handlerSpec.eventName, (e) => {
                    self.script.config.processor[handlerSpec.handler].call(null, e, initialContext, events);
                  });
                }
              }
            }

            es.on('open', () => {
              events.emit('counter', 'sse.open', 1);
            });
            initialContext.es = es;

            events.emit('started');
            return next(null, initialContext);
          });

        };


        if (step.log) {
          steps.push(function log(context, callback) {
            console.log(self.helpers.template(step.log, context));
            return process.nextTick(function () { callback(null, context); });
          });
        }

        if (step.think) {
          steps.push(self.helpers.createThink(step, self.script.config.defaults?.think || {}));
        }

        if (step == 'close') {
          steps.push(function close(context, next) {
            context.es?.close();
            return next(null, context);
          });
        }
      } // for

      A.waterfall(steps, (err, context) => {
        vuDone(err, context);
      });
    }
  }
}

module.exports = SSEEngine;