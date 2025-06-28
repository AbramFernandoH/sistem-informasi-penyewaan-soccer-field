require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cron = require('node-cron');
const cleanupPendingBookings = require('./jobs/cleanupPendingBookings');

// routes
const authRoutes = require('./routes/auth');
const authAdminRoutes = require('./routes/authAdmin');
const userRoutes = require('./routes/user');
const adminUserRoutes = require('./routes/admin');
const assetRoutes = require('./routes/asset');
const fieldRoutes = require('./routes/field');
const scheduleRoutes = require('./routes/schedule');
const reportRoutes = require('./routes/report');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const cartRoutes = require('./routes/cart');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 8080;

const dbUrl =
    process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/goedang_futsal";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection error!"));
db.once("open", () => console.log("Database connected"));

app.use(express.json());
// parse url encoded string into query string with qs library
app.use(express.urlencoded({ extended: true }));
// parse req.cookie
app.use(cookieParser());
// ✅ Enable CORS for localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // so we dont have to save the session on mongo every single time, we specify the update time for session, in this case 1 day in seconds
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
});

store.on("error", function (e) {
    console.log(e);
});

app.get('/health', (req, res) => {
    res.json({ message: 'api connected' });
});

app.use('/auth', authRoutes);
app.use('/auth-admin', authAdminRoutes);
app.use('/users', userRoutes);
app.use('/admins', adminUserRoutes);
app.use('/assets', assetRoutes);
app.use('/fields', fieldRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/reports', reportRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/carts', cartRoutes);
app.use('/dashboard', dashboardRoutes);

// Run at minute 0 of every hour
cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running cleanupPendingBookings job every hour...');
    await cleanupPendingBookings();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
