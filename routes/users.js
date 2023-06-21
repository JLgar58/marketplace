const express = require("express");
const router = express.Router({ mergeParams: true }); // access to a non file params
const catchAsync = require("../utils/catchAsync");
const { checkReturnTo, logout } = require("../utils/middleware");
const passport = require("passport");
const Users = require("../controllers/users");

// libreria para rest apis para put/delete
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

// logout middleware
router.use(logout);

// router
//   .route("/register")
//   .get(Users.userRegisterForm)
//   .post(catchAsync(Users.userRegister));

router
    .route("/login")
    .get(Users.userLoginForm)
    .post(
        checkReturnTo,
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        Users.userLogin
    );

router.route("/logout").post(Users.userLogout);

module.exports = router;
