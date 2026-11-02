require('dotenv').config()
const express = require('express')
const connectDb = require('./config/mongodb')

connectDb();
const app = express()

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/room', require('./routes/roomRoutes'));
app.use('/api/bills', require('./routes/billRentRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/settlements', require('./routes/settlementRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/agreements', require('./routes/agreementRoutes'));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
