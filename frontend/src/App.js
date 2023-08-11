import logo from './logo.svg';
import './App.css';
import UsersList from './components/UserList';
import {BrowserRouter, Routes,Route } from 'react-router-dom';
import NewUser from './components/NewUser';
import ViewUser from './components/ViewUser';
import P5History from './components/P5History';
import NewReward from './components/NewReward';
import RewardHistory from './components/RewardHistory';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<UsersList/>}/>
      <Route path="/new" element={<NewUser/>}/>
      <Route path="/:id" element={<ViewUser/>}/>
      <Route path="/:id/p5" element={<P5History/>}/>
      <Route path="/:id/rewards/new" element={<NewReward/>}/>
      <Route path="/:id/rewards/" element={<RewardHistory/>}/>
    </Routes>
    </BrowserRouter>


  );
}

export default App;
