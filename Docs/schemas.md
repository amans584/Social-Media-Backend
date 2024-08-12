Users
uid: UUID, Primary Key
username: VARCHAR(50), Unique, Not Null
email: VARCHAR(100), Unique, Not Null
password_hash: VARCHAR(255), Not Null
created_at: TIMESTAMP, Not Null, Default Current Timestamp
visible_at: TIMESTAMP, Not Null, Default Current Timestamp
updated_at: TIMESTAMP, Default null

Authentication
user_id: UUID, Foreign Key to Users(id)
token: TEXT, Not Null, Unique
created_at: TIMESTAMP, Not Null, Default Current Timestamp
expires_at: TIMESTAMP, Not Null

Posts
id: UUID, Primary Key
user_id: UUID, Foreign Key to Users(id)
content: TEXT, Not Null
created_at: TIMESTAMP, Not Null, Default Current Timestamp
updated_/at: TIMESTAMP, Not Null, Default Current Timestamp

Comments
id: UUID, Primary Key
post_id: UUID, Foreign Key to Posts(id)
user_id: UUID, Foreign Key to Users(id)
content: TEXT, Not Null
created_at: TIMESTAMP, Not Null, Default Current Timestamp
updated_at: TIMESTAMP, Not Null, Default Current Timestamp

Likes
id: UUID, Primary Key
post_id: UUID, Foreign Key to Posts(id)
user_id: UUID, Foreign Key to Users(id)
created_at: TIMESTAMP, Not Null, Default Current Timestamp

Follows
id: UUID, Primary Key
follower_id: UUID, Foreign Key to Users(id)
followed_id: UUID, Foreign Key to Users(id)
created_at: TIMESTAMP, Not Null, Default Current Timestamp


<!-- CREATE USERS -->

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS logins;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS follows;

CREATE TABLE users (
    uid VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    visible_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE logins (
    uid VARCHAR(50) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (uid, refresh_token),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE posts (
    pid VARCHAR(50) PRIMARY KEY,
    uid VARCHAR(50),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comments (
    cid VARCHAR(50) PRIMARY KEY,
    pid VARCHAR(50),
    uid VARCHAR(50),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pid) REFERENCES posts(pid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE likes (
    pid VARCHAR(50),
    uid VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pid) REFERENCES posts(pid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (pid, uid)
);

CREATE TABLE follows (
    follower_uid VARCHAR(50),
    followed_uid VARCHAR(50),
    FOREIGN KEY (follower_uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (followed_uid) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (follower_uid, followed_uid)
);
