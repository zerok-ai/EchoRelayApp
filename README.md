# EchoRelayApp
Basic Node.js application to create a multi-tier service mesh. Services can echo and relay the traffic to downstream services. 

## Usage
### Minikube
```sh
$ minikube-deploy.sh
```

### Docker
```sh
$ docker-deploy.sh -u <docker-username> -t <image-tag>
```

## Environment Variables
| Variable name | Default | Description
|---|---|---
| PORT | 80 | Port to bind the service
| NAME | 'unnamed' | Name of the service 
| TARGETS |  '' |  Comma-seperated list of target endpoints to relay the request. 
| LATENCY_MIN | 0 | minimum latency to inject before sending response.
| LATENCY_MAX | 0 | maximum latency to inject before sending response.


## Application Behavior
- Application accespts the request at the bind port ('localhost:80/')
- Service makes the call to targets sequenntially in syncronous way and appends the response. 
- Response latency is added to each request as a random number between LATENCY_MIN & LATENCY_MAX values. 

### Response format: 
for request to service 1 having targets service2 & service3 response will be of format:

`type: Application/JSON`
```json
{"path":"service1 -> {service2 -> {},service3 -> {service4 -> {}}}"}
```
