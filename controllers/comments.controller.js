const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');
const db = require('../utils/connectDB');

module.exports = {
    createComment: async (req, res, next) => {
        try {
            
            const { pid, content } = req.body;
            const { uid } = req.user;

            if (!uid) throw createError.BadRequest('User ID is required');
            if (!pid) throw createError.BadRequest('Post ID is required');
            if (!content) throw createError.BadRequest('Comment content is required');

            const cid = uuidv4();
            const query = 'INSERT INTO comments (cid, pid, uid, content) VALUES (?, ?, ?, ?)';
            const values = [cid, pid, uid, content];

            await db.execute(query, values);

            res.status(201).json({
                message: 'Comment created successfully',
                cid: cid
            });

        } catch (err) {
            next(err);
        }
    },

    getCommentsForPost: async (req, res, next) => {
        try {
            const { pid } = req.params;

            if (!pid) throw createError.BadRequest('Post ID is required');

            const query = 'SELECT * FROM comments WHERE pid = ? ORDER BY created_at DESC';
            const values = [pid];

            const [comments] = await db.execute(query, values);

            res.status(200).json({
                message: 'Comments retrieved successfully',
                comments: comments
            });
        } catch (err) {
            next(err);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const { cid } = req.params;

            if (!cid) throw createError.BadRequest('Comment ID is required');

            const query = 'DELETE FROM comments WHERE cid = ?';
            const values = [cid];

            const result = await db.execute(query, values);

            if (result[0].affectedRows === 0) {
                throw createError.NotFound('Comment not found');
            }

            res.status(200).json({
                message: 'Comment deleted successfully'
            });
        } catch (err) {
            next(err);
        }
    },

    updateComment: async (req, res, next) => {
        try {
            const { cid } = req.params;
            const { content } = req.body;

            if (!cid) throw createError.BadRequest('Comment ID is required');
            if (!content) throw createError.BadRequest('Updated content is required');

            const query = 'UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE cid = ?';
            const values = [content, cid];

            const result = await db.execute(query, values);

            if (result[0].affectedRows === 0) {
                throw createError.NotFound('Comment not found or no change in content');
            }

            res.status(200).json({
                message: 'Comment updated successfully'
            });
        } catch (err) {
            next(err);
        }
    }
}