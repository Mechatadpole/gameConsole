const router = require('express').Router(); //brings in express and router
const User = require('../db').import('../models/user'); // brings in the sequelized database and then from there imports the user model into the file.
const bcrypt = require('bcryptjs'); // Password hashing
const jwt = require('jsonwebtoken'); // For generating a secret token to use for authentication.

//! SIGN UP ROUTE *********************************
//TODO: When creating a user in postman, pass in the following into the body section:
// {
//    "user": {
//          "username": "example",
//          "email": "example@example.com",
//          "password": "example"
//            }
// }
//**************************************************
router.post('/createuser', (req, res) => {
    // console.log(req.body.user.password);
    User.create({
        username: req.body.user.username,
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 10)
    })
        .then(
            createSuccess = (user) => {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                res.json({
                    user: user,
                    message: 'User created',
                    sessionToken: token
                });
            },
            function createError(err) {
                res.send(500, err.message);
            }
        );
});

//! LOGIN ROUTE ***********************************
//TODO: When logging in a user in postman, pass in the following into the body section:
//? {
//?   "email": "example@example.com",
//?   "password": "example"
//? }
//! Logging in as a user does not require the full user object to be passed. Just the information to check if the email submitted exists, then checking the password to see if it is the same tied to that email.
router.post('/login', function (req, res) {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, matches) {
                    if (matches) {
                        var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                        res.json({
                            user: user,
                            message: "Successfully Authenticated",
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "502, oopsie daisy" });
                    }
                });
            } else {
                res.status(500).send({ error: "Failed to Authenticate, email or password is incorrect" });
            }
        },
            function (err) {
                res.status(501).send({ error: "Apologies m'lady, it appears as though this user is non-existent. Perhaps... You could create whoever you just tried to login as." });
            }
        );
});


//! UPDATE USER ROUTE *******************************
// TODO: Use this format in postman when testing the update user route.
//* {
//*  "user": {
//*    "username": "example",
//*    "email": "example@example.com",
//*    "password": "example",
//*    "profilePic": "https://i.imgur.com/izzpeRb.jpg"
//*     }
//* }
//? profilePic needs to be a link to an image that is shorter than 255 characters.
//? Passing in the entire user object as any feild can be updated if requested. The owner variable is only there to be a refference to the user's specific id. which is used in the api url as well.
router.put('/update/:id', function (req, res) {
    var username = req.body.user.username;
    var email = req.body.user.email;
    var password = req.body.user.password;
    var profilePic = req.body.user.profilePic;
    var owner = req.params.id;

    User.update({
        username: username,
        email: email,
        password: password,
        profilePic: profilePic
    },
        { where: { id: owner } }
    ).then(
        function updateSuccess(updatedUser) {
            res.json({
                username: username,
                email: email,
                password: password,
                profilePic: profilePic
            });
        },
        function updateError(err) {
            res.send(500, err.message);
        }
    );
});


// Delete User
// TODO: Delete all scores tied to user
router.delete('/delete/:id', function (req, res) {
    var owner = req.params.id;
    User.destroy({
        where: { id: owner }
    }).then(
        function deleteUserSuccess(owner) {
            res.send('You have deleted yourself');
        },
        function deleteUserError(err) {
            res.send(500, err.message);
        }
    );
});


module.exports = router;