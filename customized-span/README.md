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
curl -X GET http://localhost:$ORDER_SERVICE_POST/orders/1
```

2. Step 2: Go to the Zipkin dashboard at http://localhost:${ZIPKIN_PORT}/zipkin, then query to visualize your trace
![Trace](./visualize-trace.png)

## How it work

### Creating your own span

Below is the example of creating custom span.

```js
  app.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  // start span for HTTP Request
  const span = tracer.startSpan(`GET /shipments`, {
    attributes: {
      [SemanticAttributes.HTTP_METHOD]: "GET",
      [SemanticAttributes.HTTP_FLAVOR]: "1.1",
      [SemanticAttributes.HTTP_URL]: "http://shipment-service:3002/shipments",
    },
    kind: api.SpanKind.SERVER
  });

  span.setAttribute("order.id", orderId);


  try {
    const { data: shipments } = await axios.get(`http://shipment-service:3002/shipments?orderId=${orderId}`);

    if (shipments) {
      span.setAttribute("http.status_code", 200);
      // update status of span when the work is done
      span.setStatus({ code: api.SpanStatusCode.OK });

      span.end()

      res.json({
        id: orderId,
        type: 'order',
        attributes: {
          shipments,
        }
      });
    }
  } catch (err) {
    console.log(err);

    // recordException converts the error into a span event.
    span.recordException(err);
    // update status of span to error when it encounters an error
    span.setStatus({ code: api.SpanStatusCode.ERROR });
    return res.json({
      error: 'Internal Server Error'
    });
  }
})
