import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { addUserCredentials } from '../database/db';  // Import the function to save credentials
import styles from '../styles/styles.js';

const LoginScreen = ({ syncUserDataWithCloud, fetchUserDataFromCloud, fetchUserIdFromCloud, clickCount, clickPower, userId, setUserId }) => {
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

  // Use useEffect to fetch user data when logged in
  useEffect(() => {
    if (isLoggedIn && fetchedUserId) {
      fetchUserDataFromCloud(fetchedUserId, clickCount, clickPower, setUserId, username, password);
    }
  }, [isLoggedIn, fetchedUserId]);  // Dependencies to trigger the effect

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLoggedIn ? `Hello, ${username}` : 'Please login'}
      </Text>

      {!isLoggedIn && (
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

          {/* Custom Button for Login */}
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Custom Button for Sync Data */}
      <TouchableOpacity onPress={handleSync} style={styles.button}>
        <Text style={styles.buttonText}>Sync Data</Text>
      </TouchableOpacity>

      {/* Custom Button for Fetch Cloud Data */}
      <TouchableOpacity onPress={() => fetchUserDataFromCloud(userId, clickCount, clickPower, setUserId, username, password)} style={styles.button}>
        <Text style={styles.buttonText}>Fetch Cloud Data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;