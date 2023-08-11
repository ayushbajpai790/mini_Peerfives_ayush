// src/components/RewardHistory.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RewardHistory = () => {
  const { id } = useParams();
  const [rewardHistory, setRewardHistory] = useState([]);
  const [rewardBalance, setRewardBalance] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}/rewards`)
    .then(response => response.json())
    .then(data => {
      setRewardHistory(data);
    })
    .catch(error => {
      console.error('Error fetching reward history:', error);
    });

  fetch(`http://localhost:8000/api/users/${id}`) 
    .then(response => response.json())
    .then(data => {
      setRewardBalance(data.Reward);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, [id]);
console.log(rewardHistory)
  return (
    <div>
      <h2>Reward History</h2>
      <p>Rewards Balance: {rewardBalance}</p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date-Time</th>
            <th>Rewards received</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {rewardHistory.map((transaction, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{transaction.Datetime}</td>
              <td>{transaction.Amount}</td>
              <td>{transaction.GivenByUserID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardHistory;
