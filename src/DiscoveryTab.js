/*
import React, { useState } from 'react';

const DiscoveryTab = () => {
  const [artists, setArtists] = useState([
    {
      name: 'Taylor Swift',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGM0YjhkZmEtNGYxYy00OTk0LThlNDgtNGQzM2YwNjU0NDQzXkEyXkFqcGdeQXVyMTU3ODQxNDYz._V1_.jpg',
      followers: 25000000, // Replace with actual follower count
    },
    {
      name: 'Ed Sheeran',
      imageUrl: 'https://cdn.britannica.com/17/249617-050-4575AB4C/Ed-Sheeran-performs-Rockefeller-Plaza-Today-Show-New-York-2023.jpg',
      followers: 30000000, // Replace with actual follower count
    },
    {
      name: 'Ariana Grande',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Ariana_Grande_Grammys_Red_Carpet_2020.png',
      followers: 35000000, // Replace with actual follower count
    },
    {
        name: 'Post Malone',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb6be070445b03e0b63147c2c1',
        followers: 12000000, // Replace with actual follower count
      },
    // Add more artists with their names, image URLs, and followers
  ]);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle artist search
  const handleSearch = () => {
    const results = artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="discovery-tab">
      <h2>Discover Artists</h2>
      <input
        type="text"
        placeholder="Search for artists"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {searchResults.map((artist, index) => (
          <li key={index}>
            <img src={artist.imageUrl} alt={artist.name} height="350"/>
            <div>
              <p>Name: {artist.name}</p>
              <p>Followers: {artist.followers} on Spotify</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscoveryTab;



*/
import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';


const DiscoveryTab = () => {
  const CLIENT_ID = "a7901207a5a146cb9f8787604cd64707"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)
      console.log(token)

  }, [])

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
  }

  const recommend = () => {
    
    alert("Thanks for recommending this artist to be a coin!")
}

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: "artist"
        }
    })
    setArtists(data.artists.items)
}
const renderArtists = () => {
  return artists.map(artist => (
      <div key={artist.id}>
          {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          {artist.name}
          <h4></h4>
          <button onClick={recommend}>Recommend a Coin for this Artist</button>
          <h4></h4>
      </div>
  ))
}

  return (
      <div className="App">
          <header className="App-header">
              <h1>Find Artists on Spotify</h1>
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                      to Spotify</a>
                  : <button onClick={logout}>Logout</button>}
              {token ? 
                <form onSubmit={searchArtists}>
                  <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                  <button type={"submit"}>Search</button>
                </form>
                : <h2>Please Login</h2>
              }
              {renderArtists()}
          </header>
      </div>
  );
}

export default DiscoveryTab;


