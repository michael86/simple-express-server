const express = require("express");
const { getToken, deleteUser, removeToken } = require("../mysql/queries");
const router = express.Router();

router.delete("/", async (req, res) => {
  const { email } = req.body;

  if (!email || (email && typeof email !== "string")) {
    res.send({ status: 0, err: "invalid body sent" });
  }

  const result = await req.asyncMySQL(getToken(email));

  if (!result[0]) {
    res.send({ status: 0, err: "user not found" });
    return;
  }

  if (result[0].token !== req.headers.token) {
    res.send({ status: 0, err: "not authorized to delete this user" });
    return;
  }

  await req.asyncMySQL(deleteUser(email));
  await req.asyncMySQL(removeToken(req.headers.token));

  //Did attempt to join the two queries into one, but could only get it to delete from one table.
  //DELETE users FROM users
  //LEFT JOIN logins ON users.id = logins.user_id
  //WHERE email = "${email}"`;

  res.send({ status: 1 });
});

module.exports = router;
