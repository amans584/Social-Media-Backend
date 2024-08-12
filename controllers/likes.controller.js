const createError = require('http-errors');
const db = require('../utils/connectDB');

module.exports = {
    toggleLike: async (req, res, next) => {
        try {
            const { pid } = req.body;
            const { uid } = req.user;

            if (!pid) throw createError.BadRequest('Post ID is required');
            if (!uid) throw createError.BadRequest('User ID is required');

            // Check if the user has already liked the post
            const checkQuery = 'SELECT * FROM likes WHERE pid = ? AND uid = ?';
            const checkValues = [pid, uid];
            const [existingLike] = await db.execute(checkQuery, checkValues);

            if (existingLike.length > 0) {
                // If the like exists, delete it
                const deleteQuery = 'DELETE FROM likes WHERE pid = ? AND uid = ?';
                const deleteValues = [pid, uid];
                await db.execute(deleteQuery, deleteValues);

                res.status(200).json({
                    message: 'Like removed successfully'
                });
            } else {
                // If the like doesn't exist, create a new one
                const insertQuery = 'INSERT INTO likes (pid, uid) VALUES (?, ?)';
                const insertValues = [pid, uid];
                await db.execute(insertQuery, insertValues);

                res.status(201).json({
                    message: 'Like added successfully'
                });
            }
        } catch (err) {
            next(err);
        }
    }
}
