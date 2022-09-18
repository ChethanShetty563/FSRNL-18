const userController = require('../controllers/user.controller');
const authcontrol = require('../middleware/authJWT');

module.exports = (app) => {
  app.post('/api/register', userController.register);
  app.get('/api/getAllUsers', userController.getAllUsers);
  app.get('/api/getUserById/:id', authcontrol, userController.getUser);
  app.put('/api/updateUser/:id', userController.updateUser);
  app.delete('/api/deleteUser/:id', userController.deleteUser);
  app.delete('/api/deleteall', userController.deleteAll);
  app.post('/api/login', userController.login);
};