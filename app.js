if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const secret = process.env.SECRET || "thisshouldbeabettersecret!";
const atlas = process.env.ATLAS || "mongodb://127.0.0.1:27017/marketplace";
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const User = require("./models/user");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

// libreria para rest apis para put/delete
const methodOverride = require("method-override");

// initialize sesssion
const store = mongoStore.create({
    mongoUrl: atlas,
    secret: secret,
    touchAfter: 24 * 3600,
});
store.on("error", (e) => {
    console.log("sesStore", e);
});

const sessionConfig = {
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: store,
};
// initialize flash
const flash = require("connect-flash");

// initialize routers
const campgrounds = require("./routes/campground");
const users = require("./routes/users");

const ExpressError = require("./utils/ExpressError");

const app = express();
const port = process.env.PORT || 3000;

// iniciando mongoose
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(atlas);
    return console.log("connection success!");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// blindar views directory
app.set("views", path.join(__dirname, "/views"));
// accesando/usando archivos estaticos
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
// usar la sobrescripcion de metodos
app.use(methodOverride("_method"));
// setting session
app.use(session(sessionConfig));
// setting flash
app.use(flash());
// setting passports
app.use(passport.initialize());
app.use(passport.session());
// To remove data using these defaults:
app.use(mongoSanitize());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// using passport
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next) => {
    // setting locals
    res.locals.success = req.flash("success"); // for any template not routes
    res.locals.error = req.flash("error"); // for any template not routes
    res.locals.currentUser = req.user;
    next();
});

app.route("/").get((req, res) => {
    res.render("home");
});

// routes
app.use("/locations", campgrounds);
app.use("/admin", users);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error", { err });
});

app.listen(port, [process.env.HOST_1, process.env.HOST], () => {
    console.log(`app listening on port ${port}`);
});