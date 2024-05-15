const express = require('express');
const User = require('./model/user');
const router = express.Router();

// ? Render
router.get('/', (req, res) => {
    res.render('index');
});


// ? Get
router.get('/api/users', async (req, res) => {
    const users = await User.get();
    res.json(users);
});

// ? Get by id
router.get('/api/users/:id', async (req, res) => {
    const user = await User.getById(req.params);
    res.json(user);
});

// ? Create
router.post('/api/users', async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
});

// ? Update
router.put('/api/users/:id', async (req, res) => {
    console.log("hola");
    console.log(req.body)
    const user = await User.update(req.body);
    res.json(user);
});

// ? Delete
router.delete('/api/users/:id', async (req, res) => {
    await User.delete(req.params);
    res.json({message: 'User deleted'});
});


module.exports = router;