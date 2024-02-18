import React, {useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import CoinList from './CoinList';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import PortfolioTab from './PortfolioTab'; // Import the PortfolioTab component
import DiscoveryTab from './DiscoveryTab'; // Import the DiscoveryTab component
import styled from 'styled-components';




const Container = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 36px;
  margin: 20px 0;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2980b9;
  }
`;

const Balance = styled.div`
  margin: 20px 0;
  font-size: 18px;
`;

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([
    { username: 'demo1', password: 'password1', coins: {} },
    { username: 'demo2', password: 'password2', coins: {} },
    { username: 'demo3', password: 'password3', coins: {} },
    { username: 'demo4', password: 'password4', coins: {} },
    { username: 'demo5', password: 'password5', coins: {} },
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const initialBalance = 10000;
  const userWallet = { 'DRAKE': 0, 'KANYE': 0, 'MABU': 0 };

  const starter = [
    { name: 'Aubrey Drake Graham', symbol: 'DRAKE', price: 150.25, marketcap: 150250, imageurl: "https://hips.hearstapps.com/hmg-prod/images/drake_photo_by_prince_williams_wireimage_getty_479503454.jpg" },
    { name: 'Kanye Omari West', symbol: 'KANYE', price: 2750.30, marketcap: 2570300, imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg/1200px-Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg" },
    { name: 'Mathematical Disrespect', symbol: 'MABU', price: 3300.10, marketcap: 3300100, imageurl: "http://t2.gstatic.com/images?q=tbn:ANd9GcQL013wPzhUy9F2qEv6ebofvmeDCyizTkzD16cX1luPJ26cSvJpBs6d2GtaTuF6rcPYmhVRpQ" },
  ];

  const [balance, setBalance] = useState(initialBalance);
  const [userCoins, setUserCoins] = useState(userWallet);
  const [initialCoins, setCoinsGlobal] = useState(starter);

  const [activeTab, setActiveTab] = useState('coinList');

  const handleRegister = (username, password) => {
    setUsers([...users, { username, password, balance: initialBalance, coins: {} }]);
    setIsRegistered(true);
    setCurrentUser({ username, password, balance: initialBalance, coins: {} });
  };


  const handleLogin = (username, password) => {
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const updateBalance = (amount, coinName, boughtOrSold) => {
    setBalance((prevBalance) => prevBalance + amount);

    const updatedUserCoins = { ...userCoins };
    updatedUserCoins[coinName] = updatedUserCoins[coinName] + boughtOrSold;
    setUserCoins(updatedUserCoins);

    setTransactions((prevTransactions) => [
      ...prevTransactions,
      { amount, coinName, timestamp: new Date() },
    ]);
  };

  const updateGlobalCoins = (newCoins) => {
    setCoinsGlobal(newCoins);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTransactions([]);
  };

  

  const renderActiveTab = () => {
    if (activeTab === 'coinList') {
      return (
        <CoinList
          balance={balance}
          updateBalance={updateBalance}
          userCoins={userCoins}
          curCoins={initialCoins}
          updateFunction={updateGlobalCoins}
        />
      );
    } else if (activeTab === 'portfolio') {
      return <PortfolioTab userCoins={userCoins} curCoins={initialCoins} />;
    }
    else if (activeTab === 'discovery') {
      return <DiscoveryTab />;
    }
  };

  return (
    <Container>
      <Header>ArtistX</Header>
      <TabButtons>
        <Button onClick={() => setActiveTab('coinList')}>Coin List</Button>
        <Button onClick={() => setActiveTab('portfolio')}>Portfolio</Button>
        <Button onClick={() => setActiveTab('discovery')}>Discovery</Button>
      </TabButtons>
      {isLoggedIn ? (
        <>
          <Button onClick={handleLogout}>Logout</Button>
          <h5></h5>
          {renderActiveTab()}
        </>
      ) : isRegistered ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <RegisterScreen onRegister={handleRegister} />
      )}
    </Container>
  );
}

export default App;
