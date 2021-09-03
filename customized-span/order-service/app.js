
const api = require('@opentelemetry/api');
const {  SemanticAttributes } = require('@opentelemetry/semantic-conventions');
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');

const initTracer = require('./tracer');

const tracer = initTracer();

const express = require('express');
const app = express();
const port = process.env.ORDER_SERVICE_PORT || 3001;

app.use(bodyParser.json());

const url = 'mongodb://database:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'customized-span';

async function createOrder(orderData) {
  const span = tracer.startSpan(`DB.CREATE_DOCUMENT`, {
    attributes: {
      [SemanticAttributes.DB_MONGODB_COLLECTION]: 'orders',
      [SemanticAttributes.DB_CONNECTION_STRING]: `url/${dbName}`,
      document: orderData
    },
    kind: api.SpanKind.SERVER
  });

  try {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('orders');

    await collection.insertOne(orderData);

    span.setStatus({ code: api.SpanStatusCode.OK });

    span.end();

    return orderData;
  } catch (err) {
    span.setStatus({ code: api.SpanStatusCode.ERROR });

     throw err;
  }
}


app.post('/orders', async (req, res) => {
  // start span for HTTP Request
  const createOrderSpan = tracer.startSpan(`HANDLER.CREATE_ORDER`, {
    attributes: {},
    kind: api.SpanKind.SERVER
  });

  try {
    // Create a new context from the current context which has the span "active"
    const ctx = api.trace.setSpan(api.context.active(), createOrderSpan);

    // calling createOrder function with context whose parentSpan is createOrderSpan
    let order;
    api.context.with(ctx, async () => {
      order = await createOrder(req.body)
    });


    createOrderSpan.setStatus({ code: api.SpanStatusCode.OK });
    createOrderSpan.end();

    return res.json({
      data: order,
    });
  } catch (err) {
    console.log(err);
    // recordException converts the error into a span event.
    createOrderSpan.recordException(err);
    // update status of span
    createOrderSpan.setStatus({ code: api.SpanStatusCode.ERROR });
    return res.json({
      error: 'Internal Server Error'
    });
  }
})

app.listen(port, () => { console.log(`[order-service] Listening at http://localhost:${port}`)});
