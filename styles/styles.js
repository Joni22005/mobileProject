import {
    StyleSheet,
    Dimensions
  } from 'react-native';
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      color: '#fff',
      textAlign: 'center',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    input: {
      width: '80%',
      padding: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      backgroundColor: '#fff',
    },
    button: {
      width: '80%',
      padding: 15,
      marginVertical: 8,
      backgroundColor: '#6a0dad',
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      textTransform: 'uppercase',
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      resizeMode: 'cover',
    },
    tableImage: {
      position: 'absolute',
      bottom: 100,
      left: '50%',
      width: '80%',
      height: 'auto',
      transform: [{ translateX: -screenWidth * 0.4 }, { translateY: -50 }],
    },
    scrollView: {
      flex: 1,
    },
    buttonContainer: {
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'column',
    },
    imageScreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    clickCountText: {
      position: 'absolute',
      top: 20,
      right: 20,
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
    imageContainer: {
      width: '100%',
      alignItems: 'center',
    },
    image: {
      width: 200,
      height: 300,
    },
    counterText: {
      fontSize: 24,
      marginTop: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    dorime: {
      position: 'absolute',
      width: 225,
      height: 200,
    },
    screenText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    loggedInContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    loggedInText: {
      fontSize: 18,
      color: '#fff',
      marginBottom: 16,
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    logoutButton: {
      width: '80%',
      padding: 15,
      marginVertical: 8,
      backgroundColor: '#ff4444',
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    upgradeScreen: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    upgradeTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    upgradeCard: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      width: screenWidth * 0.9,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    upgradeName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    upgradeDescription: {
      fontSize: 16,
      color: '#555',
      marginVertical: 5,
    },
    upgradePrice: {
      fontSize: 18,
      fontWeight: '600',
      color: '#6a0dad',
      marginTop: 10,
    },
    purchaseButton: {
      backgroundColor: '#6a0dad',
      padding: 12,
      borderRadius: 10,
      marginTop: 10,
      alignItems: 'center',
    },
    purchaseButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    rejectedText: {
      position: 'absolute',
      top: '40%',
      left: '20%',
      fontSize: 24,
      color: 'red',
      fontWeight: 'bold',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
  
    // Updated Modal styles
    centeredModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay background
    },
    modalView: {
      width: screenWidth * 0.8, // Responsive width
      padding: 30,
      backgroundColor: 'white',
      borderRadius: 15,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#6a0dad',
      marginBottom: 15,
    },
    modalText: {
      fontSize: 18,
      textAlign: 'center',
      color: '#333',
      marginBottom: 20,
    },
    modalButton: {
      width: '100%',
      backgroundColor: '#6a0dad',
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      elevation: 2,
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
  export default styles;