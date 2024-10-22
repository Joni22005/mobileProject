import React, { useState, useEffect } from 'react';
import { AppRegistry, Dimensions } from 'react-native';
import { init } from './database/db.js';
import ImageScreen from './screens/imagescreen.js';
import UpgradeScreen from './screens/upgradescreen.js';
import LoginScreen from './screens/loginscreen.js';
import styles from './styles/styles.js';
import { fetchUserData, syncUserDataWithCloud, fetchUserDataFromCloud, fetchUserIdFromCloud } from './userfunctions/userfunctions.js';
import {
  ScrollView,
  ImageBackground,
  View,
  Image, // Import the Image component
} from 'react-native';

const App = () => {
  const [clickCount, setClickCount] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const screenWidth = Dimensions.get('window').width; // Get screen width

  useEffect(() => {
    init()
      .then(() => {
        console.log('Database initialized');
        fetchUserData(setClickCount, setClickPower, setUserId, setUsername, setClickCount);
      })
      .catch(err => {
        console.error('Database initialization failed:', err);
      });
  }, []);

  const handleImageClick = () => {
    const newClickCount = clickCount + clickPower;
    setClickCount(newClickCount);
  };

  return (
    <ImageBackground 
      source={require('./assets/background.png')} // Background image of the park
      style={styles.background}
    >
      <Image 
        source={require('./assets/table.png')} // Table image
        style={styles.tableImage} 
      />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={{ width: screenWidth }}>
          <LoginScreen 
            setUsername={setUsername}
            setPassword={setPassword}
            clickCount={clickCount}
            clickPower={clickPower}
            setClickCount={setClickCount}
            setClickPower={setClickPower}
            fetchUserDataByUserId={() => fetchUserDataByUserId(userId, setClickCount, setClickPower)}
            fetchUserIdFromCloud={fetchUserIdFromCloud}
            userId={userId}
            setUserId={setUserId}
            syncUserDataWithCloud={() => syncUserDataWithCloud(clickCount, clickPower, userId, setUserId, username, setUsername, password, setPassword)} 
            fetchUserDataFromCloud={() => fetchUserDataFromCloud(userId, setClickCount, setClickPower, username, setUsername, password, setPassword)}
          />
        </View>

        <View style={{ width: screenWidth }}>
          <ImageScreen 
            clickCount={clickCount} 
            setClickCount={setClickCount}
            handleImageClick={handleImageClick}
            clickPower={clickPower} 
          />
        </View>

        <View style={{ width: screenWidth }}>
          <UpgradeScreen 
            clickCount={clickCount} 
            setClickCount={setClickCount} 
            clickPower={clickPower} 
            setClickPower={setClickPower} 
            fetchUserData={fetchUserData}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

AppRegistry.registerComponent('App', () => App);
export default App;
