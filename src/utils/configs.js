const __ENV = process.env

const port = __ENV.PORT ? __ENV.PORT : "80"
const name = __ENV.NAME ? __ENV.NAME : "unnamed"
const targets = __ENV.TARGETS ? __ENV.TARGETS : ""
const latency_min = __ENV.LATENCY_MIN ? __ENV.LATENCY_MIN : 0
const latency_max = __ENV.LATENCY_MAX ? __ENV.LATENCY_MAX : 0

function getRandomLatency() {
  min = Math.ceil(latency_min);
  max = Math.floor(latency_max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is exclusive and the minimum is inclusive
}
  
module.exports = {
    port,
    name,
    targets,
    latency_min,
    latency_max,
    getRandomLatency
};
