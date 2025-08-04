const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const checkNotifications = require('./utils/checkNotifications');
const cron = require('node-cron');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


// Routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);
app.use('/api/auth', require('./routes/auth'));
const componentRoutes = require('./routes/components');
app.use('/api/components', componentRoutes);
const movementRoutes = require('./routes/movements');
app.use('/api/movements', movementRoutes);
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes); 
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req, res) => res.send('LIMS Backend API Running'));

// Run daily at 2 AM
cron.schedule('0 2 * * *', () => {
  console.log(' Running notification check...');
  checkNotifications();
});
// checkNotifications();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
