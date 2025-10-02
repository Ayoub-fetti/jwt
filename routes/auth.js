const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/auth')

const router = express.Router();
const SECRET = "123456789";


router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashed]);
    res.json({ message: "User Created" });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.lenght === 0) return res.json({ error: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ error: "password incorrect" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
    res.json({ message: "user connected", token });
})

router.get('/user', authenticateToken, (req, res) => {
    const token = req.headers['authorization'];
    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        res.json(decoded.id);
    });
});

router.post('/logout', (req, res) => {
    res.json({ message: "Bye" });
})

module.exports = router;
