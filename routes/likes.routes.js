const Router = require('express').Router();
const LikesController = require('../controllers/likes.controller');

// using the auth middleware to protect the routes
Router.use(require('../middlewares/auth.middleware').isUserAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Endpoints related to post likes
 */

/**
 * @swagger
 * /likes/toggle:
 *   post:
 *     summary: Toggle like/unlike a post
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pid
 *             properties:
 *               pid:
 *                 type: string
 *                 example: "postId123"
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       201:
 *         description: Like added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
Router.post('/toggle', LikesController.toggleLike);

module.exports = Router;
