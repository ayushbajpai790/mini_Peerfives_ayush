// src/components/ViewUser.js
import React, { useState, useEffect } from 'react';
import {  useParams, Link, useNavigate } from 'react-router-dom';

const ViewUser = () => {
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const history = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}`)
      .then(response => response.json())
      .then(data => setUserName(data.Name));
  
  }, [id]);

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleSave = () => {
history("/")
  };

  return (
    <div>
      <h2>View User</h2>
      <label>Name:</label>
      <input type="text" value={userName} onChange={handleUserNameChange} />

      <button onClick={handleSave}>Save</button>

      <Link to={`/${id}/p5`}>View P5 Balance</Link>
      <Link to={`/${id}/rewards`}>View Reward Balance</Link>
    </div>
  );
};

export default ViewUser;
