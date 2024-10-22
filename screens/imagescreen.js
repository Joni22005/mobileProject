import React, { useState } from 'react';
import { fetchUserStatsById, addUserStats } from '../database/db';
import styles from '../styles/styles.js';
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  Easing,
} from 'react-native';

const ImageScreen = ({ clickCount, setClickCount, clickPower, userId }) => {
  const [animations, setAnimations] = useState([]);

  const handleImageClick = (event) => {
    const { locationY } = event.nativeEvent;
    const newClickCount = clickCount + clickPower;
    setClickCount(newClickCount);

    // Fetch user stats to ensure username and password are preserved
    fetchUserStatsById()
      .then(userStats => {
        if (userStats && userStats.username && userStats.password) {
          // Update the user stats with the new clickCount, while preserving username and password
          addUserStats(newClickCount, clickPower, userId, userStats.username, userStats.password)
            .then(() => console.log('Click count updated, user stats preserved'))
            .catch(err => console.error('Error updating click count:', err));
        } else {
          console.error('Username or password is missing from the local database');
        }
      })
      .catch(err => console.error('Error fetching user stats:', err));

    // Create a new animation for the clicked image
    const newAnimation = {
      id: Date.now(),
      position: new Animated.Value(0),
      opacity: new Animated.Value(1),
    };

    // Start the animation sequence
    Animated.parallel([ // Change to parallel for simultaneous animations
      Animated.timing(newAnimation.position, {
        toValue: -150, // Move up significantly
        duration: 400, // Move duration
        easing: Easing.inOut(Easing.ease), // Easing function for smoothness
        useNativeDriver: false,
      }),
      Animated.timing(newAnimation.opacity, {
        toValue: 0, // Fade out
        duration: 400, // Make it fade out over the same duration as the movement
        easing: Easing.inOut(Easing.ease), // Easing function for smoothness
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Remove the animation after it completes
      setAnimations(prevAnimations =>
        prevAnimations.filter(animation => animation.id !== newAnimation.id)
      );
    });

    // Add the new animation to the state immediately
    setAnimations(prevAnimations => [...prevAnimations, newAnimation]);
  };

  return (
    <View style={styles.imageScreen}>
      {/* Click count displayed at the top right */}
      <Text style={styles.clickCountText}>Rejections: {clickCount}</Text>
      
      <Pressable
        onPress={handleImageClick}
        style={[styles.imageContainer, { marginTop: 420 }]} // Position of dorime image
      >
        <Image
          source={require('../assets/dorime.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </Pressable>
      
      {/* Render animated dorime images */}
      {animations.map(animation => (
        <Animated.View
          key={animation.id}
          style={[
            styles.dorime,
            {
              position: 'absolute',
              top: '50%', // Start at the vertical center
              left: '25%', // Center horizontally (adjust as needed)
              transform: [{ translateY: animation.position }], // Only vertical movement
              opacity: animation.opacity, // Set the opacity
            },
          ]}
          pointerEvents="none" // Disable interaction with this animated view
        >
          <Image
            source={require('../assets/dorime.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      ))}
    </View>
  );
};

export default ImageScreen;
