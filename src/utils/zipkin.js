import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import wrapAxios from 'zipkin-instrumentation-axios';
const wrapMySQL = require('zipkin-instrumentation-mysql2');

const {Tracer, ExplicitContext, ConsoleRecorder} = require('zipkin');
const { BatchRecorder } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');
const CLSContext = require('zipkin-context-cls');

const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

let tracer = null;

function getTracer(zipkinPath) {
  if(tracer) 
    return tracer;
  const ctxImpl = new ExplicitContext();
  const recorder = new BatchRecorder({
    logger: new HttpLogger({
      endpoint: zipkinPath
    })
  });
  tracer = new Tracer({ctxImpl, recorder});
  return tracer;
}

const zipkin = {
  zipkinMiddleware,
  getTracer,
  wrappers: {
    wrapAxios,
    wrapMySQL
  }
}
export default zipkin;