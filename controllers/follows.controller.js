const createError = require('http-errors');
const db = require('../utils/connectDB');

module.exports = {
    toggleFollow: async (req, res, next) => {
        try {
            const { followed_uid } = req.body;
            const { uid: follower_uid } = req.user;

            if (!follower_uid) throw createError.BadRequest('User ID is required');
            if (!followed_uid) throw createError.BadRequest('Followed User ID is required');

            // Check if the follow relationship already exists
            const checkQuery = 'SELECT * FROM follows WHERE follower_uid = ? AND followed_uid = ?';
            const checkValues = [follower_uid, followed_uid];
            const [existingFollow] = await db.execute(checkQuery, checkValues);

            if (existingFollow.length > 0) {
                // If the follow relationship exists, delete it
                const deleteQuery = 'DELETE FROM follows WHERE follower_uid = ? AND followed_uid = ?';
                const deleteValues = [follower_uid, followed_uid];
                await db.execute(deleteQuery, deleteValues);

                res.status(200).json({
                    message: 'Follow removed successfully'
                });
            } else {
                // If the follow relationship doesn't exist, create a new one
                const insertQuery = 'INSERT INTO follows (follower_uid, followed_uid) VALUES (?, ?)';
                const insertValues = [follower_uid, followed_uid];
                await db.execute(insertQuery, insertValues);

                res.status(201).json({
                    message: 'Follow added successfully'
                });
            }
        } catch (err) {
            next(err);
        }
    }
}
