const Router = require('express').Router();
const FollowsController = require('../controllers/follows.controller');

// using the auth middleware to protect the routes
Router.use(require('../middlewares/auth.middleware').isUserAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Follows
 *   description: Endpoints related to user follow/unfollow actions
 */

/**
 * @swagger
 * /follows/toggle:
 *   post:
 *     summary: Toggle follow/unfollow a user
 *     tags: [Follows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - access_token
 *               - followed_uid
 *             properties:
 *               access_token:
 *                 type: string
 *                 example: "yourAccessTokenHere"
 *               followed_uid:
 *                 type: string
 *                 example: "followedUserId123"
 *     responses:
 *       200:
 *         description: Follow removed successfully
 *       201:
 *         description: Follow added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
Router.post('/toggle', FollowsController.toggleFollow);

module.exports = Router;
