import { addUserStats, fetchUserStatsById } from '../database/db';



// Function to fetch user data from the local SQLite database
const fetchUserData = (setClickCount, setClickPower, setUserId) => {
  fetchUserStatsById()
    .then(userStats => {
      console.log('Fetched User Stats:', userStats);
      if (userStats) {
        setClickPower(userStats.clickPower !== null ? userStats.clickPower : 1);  // Set to 1 if null
        setClickCount(userStats.clickCount !== null ? userStats.clickCount : 0);  // Set to 0 if null
        setUserId(userStats.userId ?? null); // Set userId if available
      } else {
        console.log('No user data found. Setting defaults.');
        setClickPower(1);
        setClickCount(0);
        setUserId(null);
      }
    })
    .catch(err => {
      console.error('Error fetching user data:', err);
      setClickPower(1);
      setClickCount(0);
      setUserId(null); // Handle errors with default values
    });
};




// Function to sync user data with the cloud (MongoDB)
const syncUserDataWithCloud = (clickCount, clickPower, userId, setUserId) => {
  // Fetch user credentials from SQLite before proceeding
  fetchUserStatsById()
    .then(userStats => {
      if (userStats && userStats.username && userStats.password) {
        // Now that we have the credentials, proceed with the cloud sync
        const userStatsToSync = {
          clickCount,
          clickPower,
          username: userStats.username,  // Get username from the local database
          password: userStats.password,  // Get password from the local database
        };

        fetch('https://alert-diode-435106-c2.ew.r.appspot.com/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userStatsToSync),
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(text => {
                console.error('Error response from server:', text);
                throw new Error('Error syncing data: ' + text);
              });
            }
            return response.json();
          })
          .then(data => {
            if (data.userId) {
              setUserId(data.userId); // Make sure setUserId is properly passed and used here
              // Save updated user ID in local DB
              addUserStats(clickCount, clickPower, data.userId, userStats.username, userStats.password)
                .then(() => console.log('User stats and credentials saved locally'))
                .catch(err => console.error('Error saving user stats locally:', err));
            } else {
              console.error('Error syncing user data: ', data.message);
            }
          })
          .catch(err => console.error('Error syncing user data with cloud:', err));
      } else {
        console.error('Username or password not found in the local database.');
      }
    })
    .catch(err => console.error('Error fetching user stats:', err));
};





const fetchUserDataFromCloud = (userId, setClickCount, setClickPower, setUserId, username, password) => {
  console.log("fetchUserDataFromCloud called with:", { userId, username, password });

  // Step 1: If userId is missing, fetch credentials from SQLite
  if (!userId && (!username || !password)) {
    console.log("Fetching missing credentials from SQLite");

    // Fetch credentials from the local database
    fetchUserStatsById()
      .then(userStats => {
        if (userStats && userStats.username && userStats.password) {
          console.log("Fetched username and password from SQLite", userStats);

          // Retry fetching data with fetched credentials
          fetchUserDataFromCloud(null, setClickCount, setClickPower, setUserId, userStats.username, userStats.password);
        } else {
          console.error('Error: No username or password found in SQLite.');
        }
      })
      .catch(err => console.error('Error fetching credentials from SQLite:', err));
    return;
  }

  // Step 2: If userId is still missing, use the credentials to fetch it from MongoDB
  if (!userId && (username && password)) {
    console.log("No userId found, fetching userId using username and password");

    // Fetch userId using credentials
    fetch(`https://alert-diode-435106-c2.ew.r.appspot.com/user/findByCredentials?username=${username}&password=${password}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.userId) {
          console.log('Fetched userId from cloud:', data.userId);
          setUserId(data.userId);

          // Now fetch the user data with userId
          fetchAndStoreUserDataByUserId(data.userId, setClickCount, setClickPower);
        } else {
          console.error('Error: No user found with the provided credentials.');
        }
      })
      .catch(err => console.error('Error fetching user ID from cloud:', err));
  } else if (userId) {
    // Step 3: If userId is available, just fetch the user data using userId
    console.log("userId found, fetching user data by userId:", userId);
    fetchAndStoreUserDataByUserId(userId, setClickCount, setClickPower);
  } else {
    console.error('Error: Missing userId or credentials for fetching user data.');
  }
};





const fetchAndStoreUserDataByUserId = (userId, setClickCount, setClickPower) => {
  fetch(`https://alert-diode-435106-c2.ew.r.appspot.com/user/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(userData => {
      console.log('Fetched User Data from Cloud:', userData);

      // Update local state
      setClickCount(userData.clickCount);
      setClickPower(userData.clickPower);

      // Optionally, update local SQLite database with the fetched data
      // addUserStats(userData.clickCount, userData.clickPower, userData._id, userData.username, userData.password);
    })
    .catch(err => console.error('Error fetching user data from cloud:', err));
};
const fetchUserIdFromCloud = (username, password, setUserId, callback) => {
  // Check if username and password are provided
  if (!username || !password) {
    console.log("Fetching missing credentials from SQLite");

    // Fetch credentials from the local SQLite database
    fetchUserStatsById()
      .then(userStats => {
        if (userStats && userStats.username && userStats.password) {
          console.log("Fetched username and password from SQLite", userStats);

          // Retry fetching userId from MongoDB using the credentials from SQLite
          fetchUserIdFromCloud(userStats.username, userStats.password, setUserId, callback);  // Pass the callback here
        } else {
          console.error('Error: No username or password found in SQLite.');
        }
      })
      .catch(err => console.error('Error fetching credentials from SQLite:', err));
    
    return; // Return early to prevent proceeding without credentials
  }
  // If username and password are available, fetch userId from MongoDB
  fetch(`https://alert-diode-435106-c2.ew.r.appspot.com/user/findByCredentials?username=${username}&password=${password}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          console.error('Error response from server:', text);
          throw new Error('Error fetching userId: ' + text);
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.userId) {
        // Successfully fetched userId from the server
        console.log('Fetched userId from cloud:', data.userId);
        setUserId(data.userId);  // Set the userId in the local state or SQLite

        // Check if the callback function exists before invoking it
        if (callback && typeof callback === 'function') {
          callback(data.userId);  // Pass the userId back through the callback
        }
      } else {
        console.error('Error: No userId found with the provided credentials.');
      }
    })
    .catch(err => console.error('Error fetching userId from cloud:', err));
};



// Helper function to fetch user data using userId
const fetchUserDataByUserId = (userId, setClickCount, setClickPower) => {
  fetch(`https://alert-diode-435106-c2.ew.r.appspot.com/user/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(userData => {
      console.log('Fetched User Data from Cloud:', userData);
      setClickCount(userData.clickCount);
      setClickPower(userData.clickPower);
    })
    .catch(err => console.error('Error fetching user data from cloud:', err));
};


export { fetchUserData, syncUserDataWithCloud, fetchUserDataFromCloud, fetchUserDataByUserId, fetchUserIdFromCloud };