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

    // Randomize final positions (X and Y) for tossing the paper
    const randomX = Math.random() * 300 - 150; // Random X between -150 and 150 (left/right)
    const randomY = -(Math.random() * 200 + 200); // Random Y between -200 and -400 (upward)

    // Create a new animation for the clicked image
    const newAnimation = {
      id: Date.now(),
      positionY: new Animated.Value(0), // Vertical movement (start at 0)
      positionX: new Animated.Value(0), // Horizontal movement (start at 0)
      opacity: new Animated.Value(1),
      scaleX: new Animated.Value(1), // Scale down for effect (width)
      scaleY: new Animated.Value(1), // Scale down for effect (height)
      rotate: new Animated.Value(0), // Rotation for and toss
      rejectedTextOpacity: new Animated.Value(1), // Keep the opacity visible from the start
      rejectedTextScale: new Animated.Value(0), // Scale for forceful stamp effect
    };

    // Start the stamping animation, followed by upward movement,  , and toss animations
    Animated.sequence([
      // Step 1: Forceful stamping animation (scale up and settle down for a quick stamp effect)
      Animated.parallel([
        Animated.timing(newAnimation.rejectedTextOpacity, {
          toValue: 1, // Fully visible
          duration: 50, // Very quick appearance for a forceful effect
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(newAnimation.rejectedTextScale, {
          toValue: 1.5, // Initially scale the text up to 1.5x size to simulate force
          duration: 100, // Super quick stamp effect
          easing: Easing.out(Easing.ease), // Quick in and out
          useNativeDriver: false,
        }),
        Animated.timing(newAnimation.rejectedTextScale, {
          toValue: 1, // Scale down to normal size
          duration: 100, // Settle down to normal size after scaling up
          easing: Easing.out(Easing.ease), // Quick settle down
          useNativeDriver: false,
        }),
      ]),

      // Step 2: Move upward from '58%' to '30%'
      Animated.timing(newAnimation.positionY, {
        toValue: -150, // Move up to '30%' (approx 150 pixels)
        duration: 300, // Short upward movement duration
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),

      // Step 3:  (shrink both X and Y unevenly)
      Animated.parallel([
        // Shrink the width (scaleX) unevenly for   effect
        Animated.timing(newAnimation.scaleX, {
          toValue: 0.1, //   to 10% of the original width
          duration: 500, //   duration
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        // Shrink the height (scaleY) unevenly for   effect
        Animated.timing(newAnimation.scaleY, {
          toValue: 0.1, //   to 10% of the original height
          duration: 500, //   duration
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        // Rotate slightly to simulate crumpling
        Animated.timing(newAnimation.rotate, {
          toValue: 1, // Slight rotation for   effect
          duration: 500, // Same duration as  
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),

      // Step 4: Toss the  d ball away
      Animated.parallel([
        // Vertical movement animation (random upward movement)
        Animated.timing(newAnimation.positionY, {
          toValue: randomY, // Move up randomly
          duration: 1000, // Longer duration for tossing
          easing: Easing.inOut(Easing.ease), // Easing function for smoothness
          useNativeDriver: false,
        }),
        // Horizontal movement (random left-right movement)
        Animated.timing(newAnimation.positionX, {
          toValue: randomX, // Move left or right randomly
          duration: 1000, // Same duration as Y movement
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        // Additional rotation for tossing the  d ball
        Animated.timing(newAnimation.rotate, {
          toValue: 2, // Add more rotation during the toss
          duration: 1000, // Same duration as toss
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        // Opacity animation (fade out)
        Animated.timing(newAnimation.opacity, {
          toValue: 0, // Fade out
          duration: 1000, // Make it fade out over the longer duration
          easing: Easing.inOut(Easing.ease), // Easing function for smoothness
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      // Remove the animation after it completes
      setAnimations(prevAnimations =>
        prevAnimations.filter(animation => animation.id !== newAnimation.id)
      );
    });

    // Add the new animation to the state immediately
    setAnimations(prevAnimations => [...prevAnimations, newAnimation]);
  };

  // Helper function to interpolate the rotation value to degrees
  const rotateInterpolation = (rotate) => {
    return rotate.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['0deg', '30deg', '360deg'], // Rotate during crumpling and tossing
    });
  };

  // Helper function to interpolate the scale for the stamping effect
  const scaleInterpolation = (scale) => {
    return scale.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 1], // Start small and scale to normal size
    });
  };

  // Choose image based on clickPower
  const imageSource = clickPower >= 100
    ? require('../assets/CV.png') // Use CV.png when clickPower >= 100
    : require('../assets/dorime.png'); // Default to dorime.png

  return (
    <View style={styles.imageScreen}>
      {/* Click count displayed at the top right */}
      <Text style={styles.clickCountText}>Rejections: {clickCount}</Text>
      
      <Pressable
        onPress={handleImageClick}
        style={[styles.imageContainer, { marginTop: 420 }]} // Position of dorime image
      >
        <Image
          source={imageSource} // Dynamically change image source based on clickPower
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
              top: '58%', // Starting position before upward movement
              left: '25%', // Center horizontally (adjust as needed)
              transform: [
                { translateY: animation.positionY }, // Vertical movement (upward and then tossing)
                { translateX: animation.positionX }, // Horizontal movement (random)
                { scaleX: animation.scaleX }, //   horizontally
                { scaleY: animation.scaleY }, //   vertically
                { rotate: rotateInterpolation(animation.rotate) }, // Rotate during crumpling and tossing
              ],
              opacity: animation.opacity, // Set the opacity
              perspective: 1000, 
            },
          ]}
          pointerEvents="none" // Disable interaction with this animated view
        >
          <Image
            source={imageSource} // Dynamically change image source for animated images as well
            style={styles.image}
            resizeMode="cover"
          />
          {/* Add animated Rejected text with outline effect */}
          <Animated.Text
            style={[
              styles.rejectedText,
              {
                opacity: animation.rejectedTextOpacity, // Animate the opacity
                transform: [
                  { scale: scaleInterpolation(animation.rejectedTextScale) }, // Animate the scale
                  { rotate: '-11deg' }, // Tilt the stamp to the left
                ],
                zIndex: 10, // Ensure it's above the image
                borderWidth: 2, // Simulate a stamped border
                borderColor: 'red', // Red outline
                color: 'red', // Red text color
                fontWeight: 'bold', // Bold to enhance the stamp effect
                padding: 5, // Add some padding to simulate space within the stamp
                position: 'absolute',
                top: 110, // Lower the stamp a bit more (increase the value to lower it)
              },
            ]}
          >
            Rejected
          </Animated.Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default ImageScreen;
