import fs from 'fs';
import yaml from 'js-yaml';
import chalk from 'chalk';

const _ENV = process.env;
const confFile = _ENV.CONF_FILE ? _ENV.CONF_FILE : './configuration/service-definition.yaml'

const default_configs = {
  latency_min: 0, 
  latency_max: 0, 
  port: 80, 
  name: 'unnamed',
  zipkin: 'http://localhost:9411/api/v1/spans'
};

const file = fs.readFileSync(confFile, 'utf8')
const documents = yaml.loadAll(file);

const configs = {
  ...default_configs,
  ...documents.filter(x=>x?.kind==='Configuration')[0].spec,
};
const connections = documents.filter(x=>x?.kind=='Connection')
const apis = documents.filter(x=>x?.kind=='APIs')[0]

console.log(chalk.bold("--- Service Configuration " + '-'.repeat(process.stdout.columns/2-26)) + "\n")
console.log(chalk.bold(`Config file: ${confFile}`));
console.log(chalk.bold("⚙️  Configs:"), Object.keys(configs).length)
console.log(JSON.stringify(configs, null, 4))
console.log('')
console.log(chalk.bold("🔗 Connections:"), connections.length)
console.log(JSON.stringify(connections.map((x=>`${x.metadata.name} [${x.metadata.kind}] => ${x.spec.host}:${x.spec.port}`)), null, 4))
console.log('')
console.log(chalk.bold("☄️  APIs:"), apis.spec.length)
console.log(JSON.stringify(apis.spec.map((x=>`${apis.metadata.prefix}${x.path}`)), null, 4))
console.log('\n'+chalk.bold('-'.repeat(process.stdout.columns/2)))

console.log(configs);
function getRandomLatency() {
  const min = Math.ceil(configs.latency_min);
  const max = Math.floor(configs.latency_max);
  const latency = Math.floor(Math.random() * (max - min + 1) + min); // The maximum is exclusive and the minimum is inclusive
  return latency;
}

const configurations = {
  configs,
  connections, 
  apis,
  getRandomLatency
};

export default configurations;
