const P5History = require("../models/P5History");
const db = require("../db");
exports.getP5History = (req, res) => {
  const userId = req.params.id;

  const sql = "SELECT * FROM P5History WHERE UserID = ?";
  const values = [userId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching P5 history:", err);
      res.status(500).json({ error: "Failed to fetch P5 history" });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.createP5Transaction = (req, res) => {
  const { userId, amount } = req.body;
  const sql =
    "INSERT INTO P5History (UserID, DateTime, Amount, GivenToUserID) VALUES (?, NOW(), ?, ?)";
  const values = [userId, amount, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating P5 transaction:", err);
      res.status(500).json({ error: "Failed to create P5 transaction" });
    } else {
      res.status(201).json({ message: "P5 transaction created successfully" });
    }
  });
};

exports.deleteP5Transaction = (req, res) => {
  const userId = req.params.id;
  const transactionId = req.params.transactionId;
  const getTransactionSql =
    "SELECT Amount, GivenToUserID FROM P5History WHERE ID = ?";
  db.query(getTransactionSql, [transactionId], (err, result) => {
    if (err) {
      console.error("Error fetching P5 transaction:", err);
      res.status(500).json({ error: "Failed to fetch P5 transaction" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "P5 transaction not found" });
      } else {
        const amount = result[0].Amount;
        const recipientUserId = result[0].GivenToUserID;
        const updateSenderBalanceSql =
          "UPDATE Users SET P5Balance = P5Balance + ? WHERE ID = ?";
        const updateRecipientBalanceSql =
          "UPDATE Users SET P5Balance = P5Balance - ? WHERE ID = ?";

        db.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            res.status(500).json({ error: "Failed to begin transaction" });
          } else {
            db.query(
              updateSenderBalanceSql,
              [amount, userId],
              (err, result) => {
                if (err) {
                  console.error("Error updating sender balance:", err);
                  db.rollback(() =>
                    res
                      .status(500)
                      .json({ error: "Failed to update sender balance" })
                  );
                } else {
                  db.query(
                    updateRecipientBalanceSql,
                    [amount, recipientUserId],
                    (err, result) => {
                      if (err) {
                        console.error("Error updating recipient balance:", err);
                        db.rollback(() =>
                          res
                            .status(500)
                            .json({
                              error: "Failed to update recipient balance",
                            })
                        );
                      } else {
                        const deleteTransactionSql =
                          "DELETE FROM P5History WHERE ID = ?";
                        db.query(
                          deleteTransactionSql,
                          [transactionId],
                          (err, result) => {
                            if (err) {
                              console.error(
                                "Error deleting P5 transaction:",
                                err
                              );
                              db.rollback(() =>
                                res
                                  .status(500)
                                  .json({
                                    error: "Failed to delete P5 transaction",
                                  })
                              );
                            } else {
                              db.commit((err) => {
                                if (err) {
                                  console.error(
                                    "Error committing transaction:",
                                    err
                                  );
                                  db.rollback(() =>
                                    res
                                      .status(500)
                                      .json({
                                        error: "Failed to commit transaction",
                                      })
                                  );
                                } else {
                                  res.status(204).send(); // Successfully deleted
                                }
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  });
};
