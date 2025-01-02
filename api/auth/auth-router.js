const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../../data/dbConfig')
const validation = require("./auth-middleware.js")
const jwt = require("jsonwebtoken") //Readup on jwt

router.post('/register', validation, async (req, res) => {

  try {

    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const newUser = { username, password: hash }
    await db('users').insert(newUser)

    const lastUser = await db('users')
      .select('id', 'username', 'password')
      .orderBy('id', 'desc')
      .first()


    res.status(201).json(lastUser)
  }
  catch (err) {
    res.status(400).send(err)
  }


});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(401).json({ message: "username and password required" });
    }

    const user = await db("users").where("username", username).first();

    // Authentication
    if (user && bcrypt.compareSync(password, user.password)) {
      const payload = {
        id: user.id,
        username: user.username
      };
      const secret = process.env.JWT_SECRET || '123';
      const token = jwt.sign(payload, secret, { expiresIn: '5m' });

      res.json({
        message: `welcome, ${username}`,
        token,
      });
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({ message: "internal server error" });
  }
})


module.exports = router;