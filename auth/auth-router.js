const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
     const token = genToken(saved);
     res.status(201).json({ created_user: saved, token: token });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = genToken(user);
        res
          .status(200)
          .json({ message: `Welcome ${user.username}`, token: token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(err => res.status(500).json({ message: "Could not login" }));
});

const genToken = user => {
  const payload = {
    userid: user.id,
    username: user.username
  };

  const options = {
    expiresIn: "24h"
  };

  const token = jwt.sign(payload, secrets.jwtSecrets, options);

  return token;
}

module.exports = router;