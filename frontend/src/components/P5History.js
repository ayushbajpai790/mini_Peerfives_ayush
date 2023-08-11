
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const P5History = () => {
  const { id } = useParams();
  const [p5History, setP5History] = useState([]);
  const [p5Balance, setP5Balance] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}/p5`)
    .then(response => response.json())
    .then(data => setP5History(data))
    .catch(error => {
      console.error('Error fetching P5 history:', error);
    });

    fetch(`http://localhost:8000/api/users/${id}`) 
    .then(response => response.json())
    .then(data => {
        console.log("d",data)
     setP5Balance(data.P5);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, [id]);
console.log(p5History)
  const handleDelete = (transactionId) => {

  };

  return (
    <div>
      <h2>P5 History</h2>
      <Link to={`/${id}/rewards/new`}>Create New Reward</Link>
      <p>P5 Balance: {p5Balance}</p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date-Time</th>
            <th>P5 given</th>
            <th>User Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {p5History.map((transaction, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{transaction.DateTime}</td>
              <td>{transaction.Amount}</td>
              <td>{transaction.GivenToUserID}</td>
              <td>
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default P5History;
