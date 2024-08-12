const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
async function main() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Drop tables if they exist
    await connection.query('DROP TABLE IF EXISTS likes');
    await connection.query('DROP TABLE IF EXISTS comments');
    await connection.query('DROP TABLE IF EXISTS posts');
    await connection.query('DROP TABLE IF EXISTS follows');
    await connection.query('DROP TABLE IF EXISTS logins');
    await connection.query('DROP TABLE IF EXISTS users');

    // Create tables
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            uid VARCHAR(50) PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            visible_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
        )`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS logins (
            uid VARCHAR(50) NOT NULL,
            refresh_token VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL,
            PRIMARY KEY (uid, refresh_token),
            FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE
        )`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS posts (
            pid VARCHAR(50) PRIMARY KEY,
            uid VARCHAR(50),
            content TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE
        )`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS comments (
            cid VARCHAR(50) PRIMARY KEY,
            pid VARCHAR(50),
            uid VARCHAR(50),
            content TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (pid) REFERENCES posts(pid) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE
        )`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS likes (
            pid VARCHAR(50),
            uid VARCHAR(50),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pid) REFERENCES posts(pid) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY (pid, uid)
        )`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS follows (
            follower_uid VARCHAR(50),
            followed_uid VARCHAR(50),
            FOREIGN KEY (follower_uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (followed_uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY (follower_uid, followed_uid)
        )`);

    console.log('Tables created successfully');

    // Release the connection back to the pool
    connection.release();
    process.exit(0)
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
