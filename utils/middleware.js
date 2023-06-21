// middleware login
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { locationSchema } = require("../utils/schemas");

// joi validator
// middleware joi
module.exports.validateLocation = (req, res, next) => {
    // joi schema
    const { error } = locationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async function(req, res, next) {
    const { id } = req.params;
    const location = await Campground.findById(id);
    if (!location.author.equals(req.user._id)) {
        req.flash("error", "access denied!");
        return res.redirect(`/locations/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async function(req, res, next) {
    const { id, _id } = req.params;
    const review = await Review.findById(_id);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "access denied!");
        return res.redirect(`/locations/${id}`);
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in fisrt!");
        return res.redirect("/admin/login");
    }
    next();
};

// logout middleware
// middleware usado junto con method-override para prevenir la get request en /logout
// middleware funcional para otro tipo de rutas DELETE/PUT/PATCH
// usandose desde una anchor tag href="/route?_method=METHOD"
module.exports.logout = (req, res, next) => {
    if (req.query._method === "POST") {
        req.method = "POST";
        req.url = req.path;
    }
    next();
};

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};