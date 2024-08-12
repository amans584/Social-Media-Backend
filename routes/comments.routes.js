const Router = require('express').Router();
const CommentsController = require('../controllers/comments.controller');

// using the auth middleware to protect the routes
Router.use(require('../middlewares/auth.middleware').isUserAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints related to comments
 */

/**
 * @swagger
 * /comments/getComments/{pid}:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *           example: "Bearer <access_token>"
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
Router.get('/getComments/:pid', CommentsController.getCommentsForPost);

/**
 * @swagger
 * /comments/create:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *           example: "Bearer <access_token>"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pid
 *               - content
 *             properties:
 *               pid:
 *                 type: string
 *                 example: "postId123"
 *               content:
 *                 type: string
 *                 example: "This is a comment"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
Router.post('/create', CommentsController.createComment);

/**
 * @swagger
 * /comments/delete/{cid}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *           example: "Bearer <access_token>"
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
Router.delete('/delete/:cid', CommentsController.deleteComment);

/**
 * @swagger
 * /comments/update/{cid}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *           example: "Bearer <access_token>"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated comment content"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found or no change in content
 */
Router.put('/update/:cid', CommentsController.updateComment);

module.exports = Router;
