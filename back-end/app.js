// npm modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

// native modules
const path = require("path");

// local modules
const User = require('./model/user');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');
const citizenFeesRoutes = require('./routes/citizenFees');
const outcomeRoutes = require("./routes/outcome");

const app = express();

const dbUrl =
    process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/molina";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection error!"));
db.once("open", () => console.log("Database connected"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(flash());
app.use(flash());

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
        name: "cateringSession",
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
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.authUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    return res.redirect('/dashboard');
})

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/user', userRoutes);
app.use('/citizen-fees', citizenFeesRoutes);
app.use("/outcome", outcomeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`server running on port ${PORT}`) })
