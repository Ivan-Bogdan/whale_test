const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./utils/jwtGenerator");
const validInfo = require("./middleware/validInfo");
const authorize = require("./middleware/authorize");

app.use(cors());
app.use(express.json()); //req.body

function validEmail(userEmail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
}

function validPhone(userEmail) {
  return /^(\+375|80|375)(29|25|44|33)(\d{3})(\d{2})(\d{2})$/.test(userEmail);
}
//routes

/* app.use("/auth", require("./routes/jwtAuth")); */

app.post("/signup", validInfo, async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_login = $1", [
      login,
    ]);
    if (user.rows.length > 0) {
      return res.status(401).json("Пользователь существует");
    }

    let type_login;
    if (validEmail(login)) {
      type_login = "mail";
    } else if (validPhone(login)) {
      type_login = "phone";
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO users (user_login, type_login, user_password) VALUES ($1, $2, $3) RETURNING *",
      [login, type_login, bcryptPassword]
    );

    const token = jwtGenerator(newUser.rows[0].user_id);
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("ERROR SERVER");
  }
});

app.post("/signin", validInfo, async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_login = $1", [
      login,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Неверные данные");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const token = jwtGenerator(user.rows[0].user_id);
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/info", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(3001, () => {
  console.log(`Server is starting on port 3001`);
});
