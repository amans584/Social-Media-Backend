const {v4: uuidv4} = require('uuid');
const generatePostId = () => {return uuidv4();}
const createError = require('http-errors');

const db = require('../utils/connectDB');

module.exports = {
    createPost: async (req, res, next) => {
        try {
            const { content } = req.body;
            const { uid } = req.user;

            if (!uid) throw createError.BadRequest('User ID is required');
            if (!content) throw createError.BadRequest('Post content is required');

            const pid = generatePostId(); 
            const query = 'INSERT INTO posts (pid, uid, content) VALUES (?, ?, ?)';
            const values = [pid, uid, content];

            await db.execute(query, values);

            res.status(201).json({
                message: 'Post created successfully',
                pid: pid
            });

        } catch (err) {
            next(err);
        }
    },

    deletePost: async (req, res, next) => {
        try {
            const pid = req.params.pid;

            // Check if the post ID is provided
            if (!pid) throw createError.BadRequest('Post ID is required');

            // Delete the post from the database
            const query = 'DELETE FROM posts WHERE pid = ?';
            const values = [pid];

            const result = await db.execute(query, values);

            if (result[0].affectedRows === 0) {
                throw createError.NotFound('Post not found');
            }

            res.status(200).json({
                message: 'Post deleted successfully'
            });
        } catch (err) {
            next(err);
        }
    }
}