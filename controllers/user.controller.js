const createError = require('http-errors');
const db = require('../utils/connectDB');

module.exports = {
    getFeed: async (req, res, next) => {
        try {
            const { uid } = req.user;

            // Fetch user details
            const user = await db.execute(`SELECT * FROM users WHERE uid = ?`, [uid]).then(result => {
                if (result[0].length > 0) return result[0][0];
                return undefined;
            });
            if (!user) throw createError.BadRequest("A user with this user ID does not exist");

            const result = {
                uid: user.uid,
                username: user.username,
                email: user.email,
            };

            // Fetch follower and follow counts
            const [count_followers, count_follows] = await Promise.all([
                db.execute(`SELECT COUNT(*) AS followers_count FROM follows WHERE followed_uid = ?`, [uid]).then(result => {
                    return result[0][0].followers_count;
                }),
                db.execute(`SELECT COUNT(*) AS follows_count FROM follows WHERE follower_uid = ?`, [uid]).then(result => {
                    return result[0][0].follows_count;
                })
            ]);

            result.followers = count_followers;
            result.follows = count_follows;

            // Fetch posts from users followed by the user including count of likes
            const posts = await db.execute(`
                SELECT 
                    posts.*, 
                    COUNT(likes.pid) AS likes_count 
                FROM 
                    posts
                LEFT JOIN 
                    likes ON likes.pid = posts.pid
                JOIN 
                    follows ON follows.followed_uid = posts.uid
                WHERE 
                    follows.follower_uid = ?
                GROUP BY 
                    posts.pid
                ORDER BY 
                    posts.created_at DESC
            `, [uid]).then(result => {
                return result[0];
            });

            result.posts = posts;

            res.status(200).json({
                message: 'Feed retrieved successfully',
                data: result
            });
        } catch (err) {
            next(err);
        }
    },

    findUsers: async (req, res, next) => {
        try {
            const { searchQuery } = req.params;

            if (!searchQuery) {
                throw createError.BadRequest('Search query is required');
            }

            const query = `
                SELECT * 
                FROM users 
                WHERE LOWER(uid) LIKE LOWER(?) OR LOWER(username) LIKE LOWER(?)
            `;
            const values = [`%${searchQuery}%`, `%${searchQuery}%`];

            const [users] = await db.execute(query, values);

            res.status(200).json({
                message: 'Users retrieved successfully',
                users: users
            });
        } catch (err) {
            next(err);
        }
    }, 

    getUserProfile: async (req, res, next) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                throw createError.BadRequest('User ID is required');
            }

            const userQuery = `
                SELECT uid, username, email 
                FROM users 
                WHERE uid = ?
            `;
            const userValues = [userId];

            const postQuery = `
                SELECT pid, content 
                FROM posts 
                WHERE uid = ?
            `;
            const postValues = [userId];

            const followerCountQuery = `
                SELECT COUNT(*) as followerCount 
                FROM follows 
                WHERE followed_uid = ?
            `;
            const followerCountValues = [userId];

            const followingCountQuery = `
                SELECT COUNT(*) as followingCount 
                FROM follows 
                WHERE follower_uid = ?
            `;
            const followingCountValues = [userId];

            const totalLikesQuery = `
                SELECT SUM(likes_count) as totalLikes 
                FROM posts 
                WHERE uid = ?
            `;
            const totalLikesValues = [userId];

            const [user] = await db.execute(userQuery, userValues);
            if (user.length === 0) {
                throw createError.NotFound('User not found');
            }

            const [posts] = await db.execute(postQuery, postValues);
            const [followerCount] = await db.execute(followerCountQuery, followerCountValues);
            const [followingCount] = await db.execute(followingCountQuery, followingCountValues);
            const [totalLikes] = await db.execute(totalLikesQuery, totalLikesValues);

            const userProfile = {
                uid: user[0].uid,
                username: user[0].username,
                email: user[0].email,
                posts: posts,
                followerCount: followerCount[0].followerCount,
                followingCount: followingCount[0].followingCount,
                totalLikes: totalLikes[0].totalLikes || 0
            };

            res.status(200).json({
                message: 'User profile retrieved successfully',
                userProfile: userProfile
            });
        } catch (err) {
            next(err);
        }
    }
};
