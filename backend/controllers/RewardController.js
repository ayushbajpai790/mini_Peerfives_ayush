const RewardHistory = require("../models/RewardHistory");
const db = require("../db");
exports.getRewardHistory = (req, res) => {
  const { id } = req.params;
  console.log(id);
  const fetchRewardHistory = `
      SELECT RewardHistory.ID, RewardHistory.DateTime, RewardHistory.Amount, Users.Name AS GivenBy
      FROM RewardHistory
      INNER JOIN Users ON RewardHistory.GivenByUserID = Users.ID
      WHERE UserID = ?
      ORDER BY RewardHistory.DateTime DESC
    `;

  db.query(fetchRewardHistory, [id], (err, rewardHistoryResult) => {
    if (err) {
      console.error("Error fetching reward history:", err);
      return res.status(500).json({ error: "Failed to fetch reward history" });
    }
    console.log(rewardHistoryResult);
    const rewardHistory = rewardHistoryResult.map(
      (row) => new RewardHistory(row.ID, row.DateTime, row.Amount, row.GivenBy)
    );
    console.log(rewardHistory);
    return res.status(200).json(rewardHistory);
  });
};

exports.createRewardTransaction = (req, res) => {
        const { id } = req.params;
        const { recipientId, amount } = req.body;
        console.log("id",id)
      
        const fetchSenderP5Balance = 'SELECT P5Balance FROM Users WHERE ID = ?';
        db.query(fetchSenderP5Balance, [id], (err, senderResult) => {
          if (err) {
            console.error('Error fetching sender P5 balance:', err);
            return res.status(500).json({ error: 'Failed to create reward transaction' });
          }
      
          const senderP5Balance = senderResult[0].P5Balance;
          if (senderP5Balance < amount || amount <= 0 || amount > 100) {
            return res.status(400).json({ error: 'Invalid reward amount or insufficient balance' });
          }
          db.beginTransaction(err => {
            if (err) {
              console.error('Error beginning transaction:', err);
              return res.status(500).json({ error: 'Failed to create reward transaction' });
            }
            const updateSenderP5 = 'UPDATE Users SET P5Balance = P5Balance - ? WHERE ID = ?';
            db.query(updateSenderP5, [amount, id], (err, updateSenderResult) => {
              if (err) {
                db.rollback(() => {
                  console.error('Error updating sender P5 balance:', err);
                  return res.status(500).json({ error: 'Failed to create reward transaction' });
                });
              }
              const updateRecipientP5 = 'UPDATE Users SET P5Balance = P5Balance + ? WHERE ID = ?';
              db.query(updateRecipientP5, [amount, recipientId], (err, updateRecipientResult) => {
                if (err) {
                  db.rollback(() => {
                    console.error('Error updating recipient P5 balance:', err);
                    return res.status(500).json({ error: 'Failed to create reward transaction' });
                  });
                }
      
                const insertRewardTransaction = 'INSERT INTO RewardHistory (DateTime, Amount, GivenByUserID, UserID) VALUES (NOW(), ?, ?, ?)';
                db.query(insertRewardTransaction, [amount, id, recipientId], (err, insertResult) => {
                  if (err) {
                    db.rollback(() => {
                      console.error('Error inserting reward transaction:', err);
                      return res.status(500).json({ error: 'Failed to create reward transaction' });
                    });
                  }
      
                  // Commit the transaction
                  db.commit(err => {
                    if (err) {
                      db.rollback(() => {
                        console.error('Error committing transaction:', err);
                        return res.status(500).json({ error: 'Failed to create reward transaction' });
                      });
                    }
      
                    return res.status(201).json({ message: 'Reward transaction created successfully' });
                  });
                });
              });
            });
          });
        });
      };
exports.getUsersExceptSelf = (req, res) => {
    const { id } = req.params;
  
    const fetchUsers = `
      SELECT ID, Name FROM Users WHERE ID != ?
    `;
  
    db.query(fetchUsers, [id], (err, usersResult) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
  
      const users = usersResult.map(row => ({
        ID: row.ID,
        Name: row.Name
      }));
  
      return res.status(200).json(users);
    });
  };
  
