const queries = {
  createUser: (name, email, password) => {
    return `INSERT IGNORE users 
                (name, email, password)
                     VALUES
                        ("${name}", "${email}", "${password}");`;
  },

  checkCreds: (email, password) => {
    return `SELECT id
                FROM users
                    WHERE 
                        email = "${email}"
                            AND 
                                password = "${password}";`;
  },

  addToken: (user_id, token) => {
    return `INSERT INTO logins
                    (user_id, token)
                            VALUES
                                (${user_id}, "${token}");`;
  },

  removeToken: (token) => {
    return `DELETE FROM logins
                WHERE token = "${token}";`;
  },

  getUser: (token) => {
    return `SELECT name, email, users.entry_date FROM users
              JOIN logins
                ON users.id = logins.user_id
                  WHERE token = "${token}";`;
  },

  getToken: (email) => {
    return `SELECT users.id AS userID, logins.id AS loginID, token FROM users 
              JOIN logins 
                ON users.id = logins.user_id
                  WHERE email = "${email}"`;
  },

  deleteUser: (email) => {
    return `DELETE FROM users WHERE email = "${email}"`;
  },

  getUserIdByToken: (token) => {
    return `SELECT user_id AS userID FROM logins WHERE token = "${token}"`;
  },

  getUserById: (id) => {
    return `SELECT id, name, email, password FROM users WHERE id = "${id}"`;
  },

  updateUser: ({ id, email, password, name }) => {
    return `UPDATE users SET email = "${email}", password = "${password}", name ="${name}" WHERE id = "${id}"`;
  },
};

module.exports = queries;
