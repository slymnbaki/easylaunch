// Otomatik vergi raporu/export scripti
const fs = require('fs');
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const payments = await Payment.find();
  const csv = [
    'email,amount,method,network,status,createdAt',
    ...payments.map(p => `${p.userEmail},${p.amount},${p.paymentMethod},${p.paymentNetwork},${p.status},${p.createdAt.toISOString()}`)
  ].join('\n');
  fs.writeFileSync('payments-report.csv', csv);
  console.log('payments-report.csv oluşturuldu!');
  process.exit(0);
})();
