
import React, { useState, useEffect } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';

const NewReward = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [rewardAmount, setRewardAmount] = useState(0);
  const [userP5Balance, setUserP5Balance] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}/rewards/new`) 
      .then(response => response.json())
      .then(data => {
        setUsersList(data)
      })
      .catch(error => {
        console.error('Error fetching users list and P5 balance:', error);
      });
      fetch(`http://localhost:8000/api/users/${id}`) 
      .then(response => response.json())
      .then(data => {
        setUserP5Balance(data.Reward);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [id]);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleRewardAmountChange = (event) => {
    setRewardAmount(event.target.value);
  };

  const handleSubmit = () => {
    if (rewardAmount > 0 && rewardAmount <= 100 && rewardAmount <= userP5Balance) {
    
        fetch(`http://localhost:8000/api/users/${id}/rewards/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipientId: selectedUser,
            amount: rewardAmount,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Reward created:', data);
            navigate(`/users/${id}/rewards`); 
          })
          .catch(error => {
            console.error('Error creating reward:', error);
          });
      }
console.log("he")

  };

  const handleCancel = () => {
    navigate(`/${id}/rewards`);
  };

  const isSubmitDisabled = rewardAmount > 100 || rewardAmount <= 0 || rewardAmount > userP5Balance;

  return (
    <div>
      <h2>Create New Reward</h2>
      <label>Select User:</label>
      <select value={selectedUser} onChange={handleUserChange}>
        <option value="" disabled>Select a user</option>
        {usersList.map((user) => (
          <option key={user.ID} value={user.ID}>{user.Name}</option>
        ))}
      </select>

      <label>Reward Amount:</label>
      <input type="number" value={rewardAmount} onChange={handleRewardAmountChange} max={100} />

      <p>User's P5 Balance: {userP5Balance}</p>

      <button onClick={handleSubmit} disabled={isSubmitDisabled}>Submit</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default NewReward;
