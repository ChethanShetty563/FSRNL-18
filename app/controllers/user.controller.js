const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbconfigs = require('../config/db.config');

exports.register = (req, res) => {
  const { name, email, password, about } = req.body;

  const user = new UserModel({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    about,
  });
  user
    .save()
    .then((data) => {
      res.send({ message: 'User Registered successfully' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((data) => {
    if (!data) {
      res.status(404).send({ message: 'Email Not found' });
    }

    var isPasswordValid = bcrypt.compareSync(password, data.password);

    if (!isPasswordValid) {
      res.status(401).send({ message: 'Invalid Password' });
    }

    var token = jwt.sign({ id: data.id }, dbconfigs.secretKey);

    res.send({
      message: 'Login Successfull',
      user: {
        id: data._id,
        email: data.email,
        name: data.name,
      },
      token: token,
    });
  });
};

exports.getAllUsers = (req, res) => {
  UserModel.find({})
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUser = (req, res) => {
  const id = req.params.id;

  // console.log(req.user.id);
  // console.log(id);

  if (id === req.user.id) {
    UserModel.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: `No User found with this id ${id}` });
        }

        res.send({
          user: {
            id: data.id,
            name: data.name,
            about: data.about,
            following: data.following,
            followers: data.followers,
          },
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(403).send({ message: 'User is not allowed to get this info' });
  }
};

exports.updateUser = (req, res) => {
  const id = req.params.id;

  if (!req.body) {
    res.status(400).send({ message: 'data cannot be empty' });
  }

  UserModel.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `No User found with this id ${id}` });
      }

      res.send(data);
    })
    .catch((err) => {
      req.status(500).send({ message: err.message });
    });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;

  UserModel.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `No User found with this id ${id}` });
      }

      res.send({ message: 'User deleted Successfully' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteAll = (req, res) => {
  UserModel.deleteMany({})
    .then((data) => {
      res.send({ message: `${data.deletedCount} users got deleted` });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
