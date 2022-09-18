const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const dbconfigs = require('../config/db.config');

const verfyToken = (req, res, next) => {
  console.log('Initial state');
  if (req.headers && req.headers.authorization) {
    console.log('Inside if');
    console.log(req.headers.authorization.split(' ')[1]);
    jwt.verify(req.headers.authorization.split(' ')[1], dbconfigs.secretKey, function (err, decode) {
      if (err) {
        res.status(403).send({ message: 'Invalid JWT passed' });
        next();
      }

      console.log('Verfied stage');
      UserModel.findById(decode.id)
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    });
  } else {
    res.status(403).send({ message: 'Invalid JWT Passed' });
    next();
  }
};

module.exports = verfyToken;
