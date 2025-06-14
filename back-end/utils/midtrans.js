const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
    isProduction: false, // set to true in production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY, // digunakan di frontend
});

module.exports = snap;
