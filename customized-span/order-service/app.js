
const axios = require('axios');
const api = require('@opentelemetry/api');
const {  SemanticAttributes } = require('@opentelemetry/semantic-conventions');

const initTracer = require('./tracer');

const tracer = initTracer();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;


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
      // update status of span
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
    // update status of span
    span.setStatus({ code: api.SpanStatusCode.ERROR });
    return res.json({
      error: 'Internal Server Error'
    });
  }
})

app.listen(port, () => { console.log(`[order-service] Listening at http://localhost:${port}`)});
