import React, { useState } from 'react';
import axios from 'axios';
import './PortfolioTab.css';


const PortfolioTab = ({ userCoins, curCoins }) => {
  
  const [portfolio, setPortfolio] = useState(0);
  const handleClick = () => {
    axios.get('http://127.0.0.1:5000/api/getData')
      .then(response => {
        setList(response.data.artistList);
        setPortfolio(response.data.portfolio);
      })
      .catch(error => {
        setList("blocked");
      });
  };

  const [artistList, setList] = useState(null)
  if (artistList == null) {
    handleClick()
    return 1
  }

  const makeVotes = (coin) => {
    axios.get('http://127.0.0.1:5000/api/vote', {
      params: {
        artist: coin
      },
    })
      .then(response => {
        alert(response.data.message)
      })
      .catch(error => {
      });
  }

  return (
    <div>
      <h2>Your Portfolio</h2>
      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Coin</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Dividend</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {artistList.map((coin) => (
            <tr key={coin.growth}>
              <td>
                <img src={coin.image} alt={coin.name} width="400" />
              </td>
              <td>{coin.name}</td>
              <td>{coin.held}</td>
              <td>${coin.held * coin.price}</td>
              <td>${coin.div.toFixed(2)}</td>
              <td>
              <button onClick={() => {
                        makeVotes(coin.name);
                      }}>Upcoming Votes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Portfolio Value: ${portfolio.toFixed(2)}</p>
    </div>
  );
};

export default PortfolioTab;
