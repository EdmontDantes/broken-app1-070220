const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    try {
      const { name, email, password } = body;
      let user = await User.findOne({ email });
    
      if (user) {
        req.flash('errors', 'User Already Exists');
        return res.redirect('/api/users/register');
      }
      user = await new User({ profile: { name }, email, password });
      await user.save();
      await req.login(user, (err) => {
        if (err) {
          return res.status(400).json({ confirmation: false, message: err });
        } else {
          res.redirect(301, '/');
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed', error });
    }
  },
  //   register: (req, res, next) => {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty())
  //       return res.status(422).json({ errors: errors.array() });
  //     User.findOne({ email: req.body.email }).then((user) => {
  //       if (user) {
  //         return res.status(401).json({ msg: 'User Already Exists' });
  //       } else {
  //         const user = new User();
  //         user.profile.name = req.body.name;
  //         user.email = req.body.email;
  //         user.password = req.body.password;
  //         user.save().then((user) => {
  //           req.login(user, (err) => {
  //             if (err) {
  //               return res
  //                 .status(400)
  //                 .json({ confirmation: false, message: err });
  //             } else {
  //               res.redirect('/');
  //             }
  //           });
  //         });
  //       }
  //     });
  //   }
  updateProfile: (params, id) => {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then((user) => {
          if (params.name) user.name = params.name;
          if (params.email) user.email = params.email;
          if (params.address) user.address = params.address;
          return user;
        })
        .then((user) => {
          user
            .save()
            .then((user) => {
              // return res.json({ user });
              resolve(user);
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  },
  updatepassword: (params, id) => {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then((user) => {
          const { oldPassword, newPassword, repeatNewPassword } = params;
          if (!oldPassword || !newPassword || !repeatNewPassword) {
            reject('All Inputs Must Be Filled');
          } else if (newPassword !== repeatNewPassword) {
            reject('New Password Do Not Match');
          } else {
            bcrypt
              .compare(oldPassword, user.password)
              .then((match) => {
                if (!match) {
                  reject('Password Not Updated');
                } else {
                  user.password = newPassword;
                  user
                    .save()
                    .then((user) => {
                      resolve(user);
                    })
                    .catch((err) => reject(err));
                }
              })
              .catch((err) => reject(err));
          }
        })
        .catch((err) => reject(err));
    });
  }
};
