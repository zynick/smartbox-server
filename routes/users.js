// 'use strict';

// const express = require('express');
// const router = express.Router();

// router.get('/', (req, res) => {
//     res.render('users', {
//         title: 'Users API'
//     });
// });

// router.post('/login', (req, res) => {

//     const {
//         username,
//         password
//     } = req.body;

//     // temporary hardcode
//     function validate(username, password) {
//         return username === 'smartbox' && password === 'ilovesmartbox';
//     }

//     if (validate(username, password)) {
//         res.json({
//             ok: true
//         });
//     } else {
//         res.json({
//             ok: false,
//             message: 'invalide credentials'
//         });
//     }

// });

// module.exports = router;