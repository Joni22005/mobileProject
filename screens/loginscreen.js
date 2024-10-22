import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { addUserCredentials } from '../database/db';  // Import the function to save credentials
import styles from '../styles/styles.js';

const LoginScreen = ({ syncUserDataWithCloud, fetchUserDataFromCloud, fetchUserIdFromCloud, clickCount, clickPower, userId, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Add state for login status

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
          fetchUserIdFromCloud(username, password, (fetchedUserId) => {
            if (fetchedUserId) {
              setUserId(fetchedUserId);  // Update userId in state
              setIsLoggedIn(true);  // Set the user as logged in
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
