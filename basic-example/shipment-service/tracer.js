const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { Resource } = require('@opentelemetry/resources');
const { ResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const init = () => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [ResourceAttributes.SERVICE_NAME]: 'order-service',
    })
  });

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

  provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new ZipkinExporter({
        serviceName: 'shipment-service',
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
}

module.exports = init;
