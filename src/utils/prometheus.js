/**
 * Prometheus
 */

const client = require('prom-client');

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

module.exports = {
    APICounter,
    hcCounter
};
 