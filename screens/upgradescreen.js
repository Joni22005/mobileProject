import React, { useState } from 'react';
import styles from '../styles/styles.js';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,  // Import Alert
} from 'react-native';

const UpgradeScreen = ({ clickCount, setClickCount, setClickPower }) => {
  const [upgrades, setUpgrades] = useState([
    { id: '1', name: 'Resume Revamp', price: 100, description: 'Polish your resume with an extra bullet point. Increases your click power by 1.', powerIncrease: 1, purchaseCount: 0 },
    { id: '2', name: 'Cover Letter Crusher', price: 500, description: 'Craft the ultimate cover letter! Increases your click power by 10.', powerIncrease: 10, purchaseCount: 0 },
    { id: '3', name: 'Networking Ninja', price: 5000, description: 'Master the art of networking at awkward office mixers. Increases your click power by 50.', powerIncrease: 50, purchaseCount: 0 },
    { id: '4', name: 'Interview Ace', price: 10000, description: 'Nail your interviews with laser-like precision. Increases your click power by 80.', powerIncrease: 80, purchaseCount: 0 },
    { id: '5', name: 'LinkedIn Legend', price: 20000, description: 'Your LinkedIn profile is flawless. You are now seen as a job-seeking deity. Increases your click power by 200.', powerIncrease: 200, purchaseCount: 0 },
    { id: '6', name: 'The Offer Letter', price: 5, description: 'Congratulations! You received a job offer and can finally stop clicking. Victory is yours!', powerIncrease: 0, purchaseCount: 0 },
  ]);

  const handleUpgradePurchase = (upgradeId) => {
    const upgrade = upgrades.find(up => up.id === upgradeId);
    if (clickCount >= upgrade.price) {
      setClickCount(prevCount => prevCount - upgrade.price);
      setClickPower(prevPower => prevPower + upgrade.powerIncrease);

      // Update purchase count
      setUpgrades(prevUpgrades =>
        prevUpgrades.map(up =>
          up.id === upgradeId ? { ...up, purchaseCount: up.purchaseCount + 1 } : up
        )
      );

      // Check if this is the last upgrade
      if (upgradeId === '6') { // Check if it's the last upgrade
        Alert.alert("Congrats!", "You got a job! You beat the game!!"); // Show alert
      }
    } else {
      alert('Not enough clicks to purchase this upgrade!');
    }
  };

  return (
    <View style={styles.upgradeScreen}>
      <Text style={styles.upgradeTitle}>Available Upgrades</Text>
      <FlatList
        data={upgrades}
        renderItem={({ item }) => (
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeName}>{item.name}</Text>
            <Text style={styles.upgradeDescription}>{item.description}</Text>
            <Text style={styles.upgradePrice}>Price: {item.price}</Text>
            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={() => handleUpgradePurchase(item.id)}
            >
              <Text style={styles.purchaseButtonText}>Purchase</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default UpgradeScreen;
