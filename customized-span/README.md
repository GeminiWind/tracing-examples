# Basic example

## Prerequiste
- Docker
- Docker-compose
  
## Getting started

### Running project

Creating your config and change the value if needed
```
cp .env.example .env
```

The repository has already supported Docker to run everywhere. You can start up the repository by the following command

```bash
docker-compose config

docker-compose up
```

then wait a sec to pull the images

### Testing

1. Step 1: Run the following command to make a call to `order-service`

```bash
curl --location --request POST 'localhost:3001/orders' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Hello"
}'
```

2. Step 2: Go to the Zipkin dashboard at http://localhost:${ZIPKIN_PORT}/zipkin, then query to visualize your trace
![Trace](./visualize-trace.png)
