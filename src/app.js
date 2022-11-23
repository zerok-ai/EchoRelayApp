import express from 'express'

import promCounters from './utils/prometheus.js';
import sysInfo from './utils/sysinfo.js';
import configurations from './utils/configs.js';

import handler from './connections.js'; 
import upstream from './upstream.js'; 

const { configs, apis, connections } = configurations;

const app = express()
const port = configs.port;
const name = configs.name;

app.use(promCounters.apiMetrics({
    metricsPrefix: configs.name.replace("-", "_")+"_"
}));

import zipkin from './utils/zipkin.js';
app.use(zipkin.zipkinMiddleware({
  tracer: zipkin.getTracer(configs.zipkin), 
  serviceName: name
}));
handler.setConfigs(configs);
handler.setTracer(zipkin);

const conn = handler.set(connections);
upstream.setupAPIs(app, conn, apis);

app.listen(port, () => {
	console.log('Server ready at http://'+ sysInfo.hostname + ':' + port);
});
