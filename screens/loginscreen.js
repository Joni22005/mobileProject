import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { addUserCredentials } from '../database/db';  // Import the function to save credentials
import styles from '../styles/styles.js';

const LoginScreen = ({ syncUserDataWithCloud, fetchUserDataFromCloud, fetchUserIdFromCloud, clickCount, setClickCount, setClickPower, clickPower, userId, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fetchedUserId, setFetchedUserId] = useState(null);  // State to store fetched userId

  const handleSync = () => {
    syncUserDataWithCloud(clickCount, clickPower, userId, setUserId);
  };

  const handleLogin = () => {
    if (username && password) {
      // Save credentials locally first
      addUserCredentials(username, password)
        .then(() => {
          console.log('Credentials saved successfully');

          // Fetch the userId without overwriting any data
          fetchUserIdFromCloud(username, password, (userId) => {
            if (userId) {
              setFetchedUserId(userId);  // Store the fetched userId in state
              setUserId(userId);          // Update userId in state
              setIsLoggedIn(true);        // Set the user as logged in
            } else {
              console.error('Failed to fetch userId from cloud');
            }
          });
        })
        .catch(err => {
          console.error('Error saving credentials:', err);
        });
    } else {
      console.log('Please enter both username and password');
    }
  };

  const handleRegister = () => {
    if (username && password) {
      fetch('https://alert-diode-435106-c2.ew.r.appspot.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Registration successful:', data);

            // Save the registered user's credentials in the local SQLite database
            addUserCredentials(username, password)
              .then(() => {
                console.log('User credentials saved locally in SQLite');
                // Optionally log in the user immediately after registration
                setIsLoggedIn(true);
              })
              .catch(err => {
                console.error('Error saving user credentials in SQLite:', err);
              });
          } else {
            console.log('Registration failed:', data.message);
          }
        })
        .catch(error => {
          console.error('Error registering user:', error);
        });
    } else {
      console.log('Please enter both username and password');
    }
  };

  // Function to handle logging out
  const handleLogout = () => {
    setUsername('');            // Clear username
    setPassword('');            // Clear password
    setIsLoggedIn(false);        // Set logged-in status to false
    setClickCount(0);
    setClickPower(1);
    setUserId(null);             // Clear userId
    setFetchedUserId(null);      // Clear fetchedUserId
    console.log('User logged out successfully');
  };

  // Use useEffect to fetch user data when logged in
  useEffect(() => {
    if (isLoggedIn && fetchedUserId) {
      fetchUserDataFromCloud(fetchedUserId, clickCount, clickPower, setUserId, username, password);
    }
  }, [isLoggedIn, fetchedUserId]);  // Dependencies to trigger the effect

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLoggedIn ? `Hello, ${username}` : 'Please login or register'}
      </Text>

      {!isLoggedIn ? (
        <>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
          />

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Sync Data Button */}
          <TouchableOpacity onPress={handleSync} style={styles.button}>
            <Text style={styles.buttonText}>Sync Data</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LoginScreen;
