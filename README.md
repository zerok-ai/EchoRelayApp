# EchoRelayApp
Basic Node.js application to create a multi-tier service mesh. Services can echo and relay the traffic to downstream services.

### Use Cases:
1. Basic mock server 
2. Introducing custom delay in upstream API call. 
3. Load Testing sequential API invocations across multiple services.

### Future plans
1. Adding custom mock APIs with built-in latency manipulation.
2. Providing a lambda function to be executed on API calls.
3. Support for asynchronous upstream calls

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
| TARGETS |  '' |  Comma-separated list of target endpoints to relay the request.
| LATENCY_MIN | 0 | minimum latency to inject before sending a response.
| LATENCY_MAX | 0 | maximum latency to inject before sending a response.


## Application Behavior
- Application accepts the request at the bind port ('localhost:80/')
- Service makes the call to targets sequentially in a synchronous way and appends the response.
- Response latency is added to each request as a random number between LATENCY_MIN & LATENCY_MAX values.

### Response format:
for request to service 1 having targets service2 & service3 response will be of format:

`type: Application/JSON`
```json
{"path":"service1 -> {service2 -> {},service3 -> {service4 -> {}}}"}
```
