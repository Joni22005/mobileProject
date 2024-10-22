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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  tableImage: {
    position: 'absolute',
    bottom: 100, // Adjust this value to position the table correctly above the ground
    left: '50%', // Center horizontally
    width: '80%', // Adjust width as necessary
    height: 'auto', // Maintain aspect ratio
    transform: [{ translateX: -screenWidth * 0.4 }, { translateY: -50 }], // Adjust positioning
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
    flex: 1, // Ensure the container fills the available space
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Allow absolutely positioned children
  },
  clickCountText: {
    position: 'absolute',
    top: 20, // Adjust this value as needed for padding
    right: 20, // Adjust this value as needed for padding
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Change the color as needed
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
  },
  loggedInContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  loggedInText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  logoutButton: {
    width: '80%',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    alignItems: 'center',
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
    color: '#6a0dad',
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
});

export default styles;
