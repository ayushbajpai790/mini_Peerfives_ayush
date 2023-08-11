
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  
  }, []);
  console.log(users)

  return (
    <div>
      <h2>Users List</h2>
      <Link to="/new">Create New User</Link>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>P5 balance</th>
            <th>Reward balance</th>
            <th>Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.ID}>
              <td>{index + 1}</td>
              <td>{user.Name}</td>
              <td>{user.P5}</td>
              <td>{user.Reward}</td>
              <td>
                <Link to={`/${user.ID}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
