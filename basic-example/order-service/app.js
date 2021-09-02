const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { Resource } = require('@opentelemetry/resources');
const { ResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const axios = require('axios');

const provider = new NodeTracerProvider({
  resource: new Resource({
    [ResourceAttributes.SERVICE_NAME]: 'order-service',
  })
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new ZipkinExporter({
      serviceName: 'order-service',
      url: `${process.env.ZIPKIN_HOST}/api/v2/spans`,
    })
  )
);
provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

const express = require('express');
const app = express();
const port = process.env.ORDER_SERVICE_PORT || 3001;


app.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    const { data: shipments } = await axios.get(`http://shipment-service:3002/shipments?orderId=${orderId}`);

    res.json({
      id: orderId,
      type: 'order',
      attributes: {
        shipments,
      }
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: 'Internal Server Error'
    });
  }
})

app.listen(port, () => { console.log(`[order-service] Listening at http://localhost:${port}`)});
