const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

// models
const User = require('./model/user');
const AdminUser = require('./model/admin');

// routes
const authRoutes = require('./routes/auth');
const authAdminRoutes = require('./routes/authAdmin');
const userRoutes = require('./routes/user');
const adminUserRoutes = require('./routes/admin');

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
// ✅ Enable CORS for localhost:3000
app.use(cors({
    origin: 'http://localhost:3000'
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

app.use(
    session({
        name: "goedangFutsalSession",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use('user-local', new LocalStrategy(User.authenticate()));
passport.use('admin-local', new LocalStrategy(AdminUser.authenticate()));

passport.serializeUser((user, done) => {
    done(null, { id: user.id, type: user.type });
});

passport.deserializeUser(async (obj, done) => {
    try {
        let user;
        if (obj.type === 'user') {
            user = await User.findById(obj.id);
        } else if (obj.type === 'admin') {
            user = await AdminUser.findById(obj.id);
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
})

app.get('/health', (req, res) => {
    res.json({ message: 'api connected' });
});

app.use('/auth', authRoutes);
app.use('/auth-admin', authAdminRoutes);
app.use('/users', userRoutes);
app.use('/admins', adminUserRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
