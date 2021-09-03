const axios = require('axios');

const initTracer = require('./tracer');
initTracer();

const express = require('express');
const app = express();
const port = process.env.ORDER_SERVICE_PORT || 3001;

app.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    const { data: shipments } = await axios.get(`${process.env.SHIPMENT_SERVICE_URL}/shipments?orderId=${orderId}`);

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
