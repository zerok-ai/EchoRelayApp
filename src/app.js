'use strict';
const express = require('express')
const app = express()
const axios = require('axios');

var promCounters = require('./utils/prometheus');
var sysInfo = require('./utils/sysinfo');
var configs = require('./utils/configs');

const apiMetrics = require('prometheus-api-metrics');
app.use(apiMetrics({
    metricsPrefix: configs.name.replace("-", "_")+"_"
}));

const port = configs.port;

app.listen(port, () => {
	console.log('Server ready at http://'+ sysInfo.hostname + ':' + port);
	console.log('Supports Prometheus');
})

function createUpstreamCall(target) {
  console.log('>>', target)
  return axios.get('http://'+target);
}

/* APIs */
app.get('/hc', (req, res) => {
	promCounters.hcCounter.inc({ code: 200 });
	res.send({"success": true});
});

app.get('/', (req, res) => {
	promCounters.APICounter.inc({ code: 200 });
  const targets = configs.targets.split(',').filter(Boolean);
  const latency = configs.getRandomLatency()
  setTimeout(() => {
    Promise
    .all(targets.map(createUpstreamCall))
    .then((results) => {
      let curr_resp_path = results.map(result => result.data.path)
      const resp_str = configs.name + ' -> {' + curr_resp_path.join(',') + '}'
      console.log("path > ", resp_str);
      res.send({"path": resp_str });
    });
  }, latency);
});

