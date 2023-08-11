
const express = require('express');
const router = express.Router();
const UserController = require('./controllers/UserController');
const P5Controller = require('./controllers/p5Controller');
const RewardController = require('./controllers/RewardController');

router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.get('/users/:id',UserController.getUserById);
router.get('/users/:id/p5', P5Controller.getP5History);
router.post('/users/:id/p5', P5Controller.createP5Transaction);
router.delete('/users/:id/p5/:transactionId', P5Controller.deleteP5Transaction);

router.get('/users/:id/rewards', RewardController.getRewardHistory);
router.get('/users/:id/rewards/new', RewardController.getUsersExceptSelf);
router.post('/users/:id/rewards/new', RewardController.createRewardTransaction);



module.exports = router;
