const User = require('../../models/user');
const passport = require('passport');

function authController() {
    return {
        login(req, res) {                        
            res.render('path/login');
        },
        postLogin(req,res,next){

            const {email,password} = req.body
            // Validate request
            if ( !email || !password) {
                req.flash('error', 'All fields are required');
               
                return res.redirect('/login');
            }

            passport.authenticate('local',(err, user, info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.login(user,(err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }

                    if (user.email == "admin@gmail.com" && user.password == 654) {
                        return res.redirect('/admin/order')
                    }

                    return res.redirect('/')
                })

            })(req,res,next)

        },

        register(req, res) {                        
            res.render('path/register');
        },

        postRegister(req, res) {
            const { name, email, password } = req.body;

            // Validate request
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }

            // Check if email exists
            User.exists({ email: email }).then((result) => {
                if (result) {
                    req.flash('error', 'Email Already exist');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Create a user
                const user = new User({
                    name,
                    email,
                    password
                });

                user.save().then((user) => {
                    // Login
                    return res.redirect('/login');
                }).catch(err => {
                    console.error(err);
                    req.flash('error', 'Something went wrong');
                    return res.redirect('/register');
                });
            }).catch(err => {
                console.error(err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            });
        },
        logout(req, res) {
                        req.logout((err) => { // Add callback function to handle errors
                            if (err) {
                                console.error('Error logging out:', err);
                                req.flash('error', 'Failed to logout');
                            } else {
                                req.flash('success_msg', 'You are logged out');
                            }
                            return res.redirect('/login');
                        });
                    }
    };
}

module.exports = authController;