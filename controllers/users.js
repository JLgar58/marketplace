const User = require("../models/user");

module.exports.userRegisterForm = (req, res) => {
    res.render("users/register");
};

module.exports.userRegister = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({
            email,
            username,
        });
        const newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            if (err) next(err);
            req.flash("success", "Welcome to Marketplace!");
            res.redirect("/locations");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/admin/register");
    }
};

module.exports.userLoginForm = (req, res) => {
    if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo;
    }
    res.render("users/login");
};

module.exports.userLogin = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.returnTo || "/locations";
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
    req.logout((err) => {
        if (err) next(err);
        req.flash("success", "successfully logged out!");
        res.redirect("/");
    });
};
