const Router = require('express').Router();
const PostsController = require('../controllers/posts.controller');
const { isUserAuthenticated } = require('../middlewares/auth.middleware');

Router.use(isUserAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints related to posts
 */

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
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
 *                 example: "Lorem ipsum dolor sit amet..."
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
Router.post('/create', PostsController.createPost);

/**
 * @swagger
 * /posts/delete/{pid}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - name: pid
 *         in: path
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
Router.delete('/delete/:pid', PostsController.deletePost);

module.exports = Router;
