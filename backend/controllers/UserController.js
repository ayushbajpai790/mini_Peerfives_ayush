// UserController.js
const User = require("../models/User");
const db = require("../db");
exports.getAllUsers = (req, res) => {
  const sql = "SELECT * FROM Users";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
    } else {
      const users = results.map(
        (row) => new User(row.ID, row.Name, row.P5Balance, row.RewardBalance)
      );
      res.status(200).json(users);
    }
  });
};

exports.createUser = (req, res) => {
  const { Name } = req.body;
  const newUser = new User(4, Name, 100.0, 0.0); // Set initial P5 and Reward balances to 0

  const sql =
    "INSERT INTO Users (ID, Name, P5Balance, RewardBalance) VALUES (?, ?, ?, ?)";
  const values = [newUser.ID, newUser.Name, newUser.P5, newUser.Reward];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Failed to create user" });
    } else {
      newUser.ID = result.insertId;
      res.status(201).json(newUser);
    }
  });
};
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const sql = "SELECT * FROM Users WHERE ID = ?";
  const values = [userId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      const user = new User(
        results[0].ID,
        results[0].Name,
        results[0].P5Balance,
        results[0].RewardBalance
      );
      res.status(200).json(user);
    }
  });
};
