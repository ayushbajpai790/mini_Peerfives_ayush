// src/components/NewUser.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewUser = () => {
  const [userName, setUserName] = useState('');
  const history = useNavigate();

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleSave = () => {
    fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: userName,
        }),
      })
        .then(response => response.json())
        .then(data => {
          history('/');
        })
        .catch(error => {
          console.error('Error creating user:', error);
        });
  };

  const handleCancel = () => {
    history('/');
  };

  return (
    <div>
      <h2>Create New User</h2>
      <label>Name:</label>
      <input type="text" value={userName} onChange={handleUserNameChange} />

      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default NewUser;
