import React, { useState } from 'react';
import './rl.css'
const RegisterScreen = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Perform user registration logic here
    // Simulate a successful registration for demonstration purposes
    onRegister(username, password);
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterScreen;