const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "123456",
  host: "localhost",
  post: 5432,
  database: "jwt_test",
});
module.exports = pool;
