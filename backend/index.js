const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());

const db = new sqlite3.Database("games.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      platform TEXT,
      region TEXT,
      price REAL,
      original_price REAL,
      discount_percent INTEGER,
      cashback REAL,
      likes INTEGER,
      image_url TEXT
    )
  `);

  db.run("DELETE FROM games");

  db.run(
    `INSERT INTO games (title, platform, region, price, original_price, discount_percent, cashback, likes, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "FIFA 23",
      "Xbox Series X",
      "GLOBAL",
      40.93,
      49.99,
      18,
      4.5,
      626,
      "https://m.media-amazon.com/images/I/810tn2wWrkL.jpg"
    ]
  );

  db.run(
    `INSERT INTO games (title, platform, region, price, original_price, discount_percent, cashback, likes, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "Red Dead Redemption 2",
      "PC / Steam",
      "GLOBAL",
      29.99,
      59.99,
      50,
      3.87,
      1039,
      "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg"
    ]
  );

  db.run(
    `INSERT INTO games (title, platform, region, price, original_price, discount_percent, cashback, likes, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "Split Fiction",
      "PC / Steam",
      "EUROPE",
      34.14,
      49.99,
      32,
      3.76,
      500,
      "https://m.media-amazon.com/images/I/81fquTm9oML._AC_UF1000,1000_QL80_.jpg"
    ]
  );

  db.run(
    `INSERT INTO games (title, platform, region, price, original_price, discount_percent, cashback, likes, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "Elden Ring",
      "PC / Steam",
      "GLOBAL",
      39.99,
      59.99,
      33,
      2.5,
      2500,
      "https://m.media-amazon.com/images/M/MV5BMWNlMDBiYzYtMWMyMC00Zjc5LTlhMjItMjRlMzBmYmVkOGM0XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg"
    ]
  );
});

app.get("/list", (req, res) => {
  const search = req.query.search || "";
  db.all(
    "SELECT * FROM games WHERE title LIKE ?",
    [`%${search}%`],
    (err, rows) => {
      res.json({ count: rows.length, items: rows });
    }
  );
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
