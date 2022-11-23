/**
 * Prometheus
 */

import client from 'prom-client';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const apiMetrics = require('prometheus-api-metrics');

const Counter = client.Counter;
const APICounter = new Counter({
    name: 'api_counter',
    help: 'API counter',
    labelNames: ['code'],
});

const hcCounter = new Counter({
    name: 'hc_counter',
    help: 'HC counter',
    labelNames: ['code'],
})

const prometheus = {
    APICounter,
    hcCounter,
    apiMetrics
}
export default prometheus;
 