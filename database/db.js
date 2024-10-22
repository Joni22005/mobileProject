import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'click.db' });

export const init = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS userStats (
                    id INTEGER PRIMARY KEY,
                    clickCount INTEGER,
                    clickPower INTEGER,
                    userId TEXT,
                    username TEXT,
                    password TEXT
                )`,
                [],
                () => {
                    console.log('Table created successfully');
                    // Initialize user stats if not present
                    tx.executeSql(
                        'INSERT OR IGNORE INTO userStats (id, clickCount, clickPower, username, password) VALUES (?, ?, ?, ?, ?)',
                        [1, 0, 1, '', ''], // Default values
                        () => resolve(),
                        (tx, error) => {
                            console.error('Error initializing user stats:', error);
                            reject(error);
                        }
                    );
                },
                (tx, error) => {
                    console.error('Error creating table:', error);
                    reject(error);
                }
            );
        });
    });
};

export const addUserStats = async (clickCount, clickPower, userId, username, password) => {
    try {
      await db.transaction(async tx => {
        await tx.executeSql(
          'INSERT OR REPLACE INTO userStats (id, clickCount, clickPower, userId, username, password) VALUES (?, ?, ?, ?, ?, ?)',
          [1, clickCount, clickPower, userId, username, password], // Ensure all values are passed correctly
          (_, result) => {
            console.log("User stats added/updated successfully");
          },
          (_, error) => {
            console.error('Error updating user stats in database:', error);
            throw error;
          }
        );
      });
    } catch (error) {
      console.error('Error saving user stats:', error);
      throw error;
    }
  };
  



  export const fetchUserStatsById = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM userStats WHERE id = ?',
          [1],
          (tx, results) => {
            if (results.rows.length > 0) {
              const userStats = results.rows.item(0);
              console.log("Fetched user stats from SQLite:", userStats);
  
              // Ensure that clickCount is correctly assigned
              if (typeof userStats.clickCount === 'string') {
                console.error('Error: clickCount is not a number.');
                // Manually correct it here if needed, like:
                resolve({ ...userStats, clickCount: parseInt(userStats.clickCount, 10) || 0 });
              } else {
                resolve(userStats);
              }
            } else {
              console.log("No user stats found in SQLite");
              resolve(null);
            }
          },
          (tx, error) => {
            console.error('Error fetching user stats from SQLite:', error);
            reject(error);
          }
        );
      });
    });
  };
  


export const updateUserStats = (id, newClickCount, clickPower, username, password) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE userStats SET clickCount = ?, clickPower = ?, username = ?, password = ? WHERE id = ?',
                [newClickCount, clickPower, username, password, id],
                (_, result) => resolve(result),
                (_, error) => {
                    console.error('SQL Error:', error); // Log the error for debugging
                    reject(error);
                }
            );
        });
    });
};
export const addUserCredentials = async (username, password) => {
    try {
        await db.transaction(async tx => {
            await tx.executeSql(
                'INSERT OR REPLACE INTO userStats (id, username, password) VALUES (?, ?, ?)',
                [1, username, password],  // Save username and password for user with id=1
                (_, result) => {
                    console.log("User credentials added/updated successfully");
                },
                (_, error) => {
                    console.error('Error updating user credentials in database:', error);
                    throw error;
                }
            );
        });
    } catch (error) {
        console.error('Error saving user credentials:', error);
        throw error;
    }
};