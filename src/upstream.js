"use strict"
import configurations from './utils/configs.js';

async function mongoQuery(connClient, dbName, collectionName, query) {
  const db = connClient.db(dbName);
  const collection = db.collection(collectionName);
  const result = await collection.findOne(query);
  return result;
}

async function mysqlQuery(connClient, query) {
  let result = null;
  await connClient.promise().query(query)
    .then( ([rows,fields]) => {
      result = rows;
    })
    .catch(console.log)
  return result;
}

function setupAPIs(app, conn, apis) {  
  /* APIs */
  apis.spec.forEach(apiSpec => {
    let method = apiSpec.method || 'get';
    function createUpstreamCall(dependent) {
      let connection = conn[dependent.name || 'http']
      switch(connection.kind) {
        case 'mongo':
          let mongoResult = mongoQuery(connection.client, dependent.db, dependent.collection, dependent.query);
          return mongoResult;
          break;
        case 'mysql':
          let mysqlResult = mysqlQuery(connection.client, dependent.query);
          return mysqlResult;
          break;
        case 'http':
          return connection.client.get('http://'+dependent.path);
          break;
      }
    }

    function sendResponse(res, apiSpec) {
      if(apiSpec.scripts?.onResponse) {
        eval(apiSpec.scripts.onResponse)
      }

      if(!apiSpec.response) {
        res.end();
      }

      if(apiSpec.response?.json) {
        res.status(apiSpec.response?.status || 200)
           .header(apiSpec.response?.headers)
           .type('text/json')
           .json(JSON.parse(eval('`'+apiSpec.response?.json+'`')));
      } else if(apiSpec.response?.text) {
        res.status(apiSpec.response?.status || 200)
           .header(apiSpec.response?.headers)
           .send(eval('`'+apiSpec.response?.text+'`'));
      }else if(apiSpec.response?.data) {
        res.status(apiSpec.response?.status || 200)
           .header(apiSpec.response?.headers)
           .send(eval('`'+apiSpec.response?.data+'`'));
      } else {
        res.status(apiSpec.response?.status || 200)
          .header(apiSpec.response?.headers)
          .send({
            'response': apiSpec.dependents.map((x)=>x.response)
          });
      }

    }
    
    app[method](`${apis.metadata.prefix}${apiSpec.path}`, (req, res) => {
      // Run onRequest script before firing dependent APIs
      function onRequestScript(apiSpec) {
        if(apiSpec.scripts?.onRequest)
          eval(apiSpec.scripts.onRequest)
      };
      onRequestScript(apiSpec);
  
      const latency = configurations.getRandomLatency();
      setTimeout(() => {
        // Trigger dependent Services.
        if(apiSpec.dependents?.length) {
          Promise
          .all(apiSpec.dependents.map(createUpstreamCall))
          .then((results) => {
            apiSpec.dependents.map((x, i)=>x.response=results[i])
            sendResponse(res, apiSpec);
          });
        } else {
          sendResponse(res, apiSpec);
        }
      }, latency);
    });

  });
}


const upstream = {
  setupAPIs,
};
export default upstream;