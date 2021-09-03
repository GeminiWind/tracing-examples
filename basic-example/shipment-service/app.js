const initTracer = require('./tracer');

initTracer();

const express = require('express');
const app = express();
const port = process.env.SHIPMENT_SERVICE_PORT || 3002;


app.get('/shipments', async (req, res) => {
  const orderId = req.query.orderId;

  return res.json({
    data: [
      {
        id: 1,
        type: 'shipment',
        attributes: {
          orderId,
        }
      }
    ]
  })
})

app.listen(port, () => { console.log(`[shipment-service] Listening at http://localhost:${port}`)});
