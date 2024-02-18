import React, { useState } from 'react';
import './rl.css'
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Replace this with actual authentication logic
    // For demonstration purposes, we check against predefined users
    const isAuthenticated = checkAuthentication(username, password);

    if (isAuthenticated) {
      onLogin(username, password); // Pass username and password back to App.js
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const checkAuthentication = (enteredUsername, enteredPassword) => {
    // In a real app, this logic would be more secure
    // For demonstration, we check against predefined users
    const users = [
      { username: 'demo1', password: 'password1' },
      { username: 'demo2', password: 'password2' },
      { username: 'demo3', password: 'password3' },
      { username: 'demo4', password: 'password4' },
      { username: 'demo5', password: 'password5' },
    ];

    return users.some(
      (user) => user.username === enteredUsername && user.password === enteredPassword
    );
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginScreen;