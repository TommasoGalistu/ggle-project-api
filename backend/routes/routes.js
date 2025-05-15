const express = require('express')
const userController = require('../controller/userController');
// const todoController = require('../controller/todoController');

const publicRouter = express.Router()
const privateRouter = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

// private router
privateRouter.use(authMiddleware)

privateRouter.get('/utente-autenticato', (req,res) =>{
    res.status(200).json({message: "sei autorizzato"});
})
// privateRouter.get('/logout', userController.logout)
// privateRouter.post('/add-todo', todoController.create)
// privateRouter.delete('/delete', todoController.delete)
// privateRouter.patch('/update', todoController.update)



// public router

publicRouter.post('/register', userController.register);
publicRouter.post('/login', userController.login);
publicRouter.get('/get-users', userController.getUsers);
publicRouter.get('/get-users/:id', userController.getUser);
publicRouter.post('/auth-ggle', userController.authGggle);
publicRouter.get('/calendar-user/:id', userController.getAdminCalendarEvents);

//router api indipendenti
publicRouter.get('/oauth2callback', userController.googleCallback);


module.exports = {publicRouter, privateRouter}; 
