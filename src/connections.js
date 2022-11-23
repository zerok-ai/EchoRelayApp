"use strict"
import axios from 'axios';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);


let connClients = {};
let zipkin = null;
let configs = null;

function getHTTPClient() {
  // return axios;
  return zipkin.wrappers.wrapAxios(axios, {
      tracer: zipkin.getTracer(),
      serviceName: configs.name
    });
}

function getMongoClient(connection) {
  const { MongoClient } = require('mongodb');
  const url = `mongodb://${connection.spec.host}:${connection.spec.port}`;
  const client = new MongoClient(url);
  return client;
}

function getMySQLClient(connection) {
  const Mysql2 = require('mysql2');
  const ZipkinMysql = zipkin.wrappers.wrapMySQL(Mysql2, zipkin.getTracer(), configs.name, configs.name);
  const connectionOptions = {
    user: connection.spec.username,
    password: connection.spec.password,
    host: connection.spec.host,
    port: connection.spec.port,
    database: connection.spec.db
  };
  const client = ZipkinMysql.createConnection(connectionOptions);
  return client;
}

function setConfigs(_configs) {
  configs = _configs;
}

function setTracer(_zipkin) {
  zipkin = _zipkin;
}

function set(connectionDefs) {
  connectionDefs.forEach((connection) => this.add(connection));
  connClients['http'] = {};
  connClients['http'].client = getHTTPClient();
  connClients['http'].kind = 'http';
  return connClients;
}

function add(connection) {
  switch (connection.metadata.kind) {
    case "mysql": 
      connClients[connection.metadata.name || 'mysql'] = {};
      connClients[connection.metadata.name || 'mysql'].client = getMySQLClient(connection);
      connClients[connection.metadata.name || 'mysql'].kind = 'mysql';
    break;
    case "redis": 
      console.log("No Client");
    break;
    case "mongo": 
      connClients[connection.metadata.name || 'mongo'] = {};
      connClients[connection.metadata.name || 'mongo'].client = getMongoClient(connection);
      connClients[connection.metadata.name || 'mongo'].kind = 'mongo';
    break;
  }
}

function get() {
  return connClients
}

const handler = {
  set,
  add,
  get,
  setConfigs,
  setTracer
};
export default handler;