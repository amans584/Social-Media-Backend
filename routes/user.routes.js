const Router = require('express').Router();
const UserController = require('../controllers/user.controller');
const { isUserAuthenticated } = require('../middlewares/auth.middleware');

Router.use(isUserAuthenticated);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints related to user operations
 */

/**
 * @swagger
 * /users/getFeed:
 *   get:
 *     summary: Get user feed
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feed retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "user123"
 *                     username:
 *                       type: string
 *                       example: "username"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     followers:
 *                       type: integer
 *                       example: 10
 *                     follows:
 *                       type: integer
 *                       example: 20
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           pid:
 *                             type: string
 *                             example: "post123"
 *                           content:
 *                             type: string
 *                             example: "Post content"
 *                           likes_count:
 *                             type: integer
 *                             example: 5
 */

Router.get('/getFeed', UserController.getFeed);

/**
 * @swagger
 * /users/search/{searchQuery}:
 *   get:
 *     summary: Search for users
 *     tags: [User]
 *     parameters:
 *       - name: searchQuery
 *         in: path
 *         required: true
 *         description: Search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: string
 *                         example: "user123"
 *                       username:
 *                         type: string
 *                         example: "username"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 */

Router.get('/search/:searchQuery', UserController.findUsers);

/**
 * @swagger
 * /users/getProfile/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user profile to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *                 userProfile:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "user123"
 *                     username:
 *                       type: string
 *                       example: "username"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           pid:
 *                             type: string
 *                             example: "post123"
 *                           content:
 *                             type: string
 *                             example: "Post content"
 *                     followerCount:
 *                       type: integer
 *                       example: 10
 *                     followingCount:
 *                       type: integer
 *                       example: 20
 *                     totalLikes:
 *                       type: integer
 *                       example: 50
 */

Router.get('/getProfile/:userId', UserController.getUserProfile);

module.exports = Router;
