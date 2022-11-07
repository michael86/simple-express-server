const express = require("express");
const router = express.Router();
const {
  getUserIdByToken,
  getUserById,
  updateUser,
} = require("../mysql/queries");
const sha256 = require("sha256");

router.put("/", async (req, res) => {
  const { token } = req.headers;

  let { email, password, name } = req.body;

  if (!token) {
    res.send({ status: 0, err: "Token not provided" });
  }

  const result = await req.asyncMySQL(getUserIdByToken(token));

  if (!result[0]) {
    res.send({ status: 0, err: "Invalid token provided" });
    return;
  }

  if (
    (email && typeof email !== "string") ||
    (password && typeof password !== "string") ||
    (name && typeof name !== "string")
  ) {
    res.send({ status: 0, err: "Invalid body received. Types must be string" });
    return;
  }

  const user = await req.asyncMySQL(getUserById(result[0].userID));

  user[0].email = email ? email.trim() : user[0].email;
  user[0].password = password ? sha256(password) : user[0].password;
  user[0].name = name ? name.trim() : user[0].name;

  await req.asyncMySQL(updateUser(user[0]));

  res.send({ status: 1 });
});

module.exports = router;
