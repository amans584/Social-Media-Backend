const Router = require('express').Router();
const AuthController = require('../controllers/auth.conroller');
const { isUserAuthenticated } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - username
 *               - email
 *               - password
 *             properties:
 *               uid:
 *                 type: string
 *                 example: "string"
 *               username:
 *                 type: string
 *                 example: "string"
 *               email:
 *                 type: string
 *                 example: "string"
 *               password:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
Router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - password
 *             properties:
 *               uid:
 *                 type: string
 *                 example: "string"
 *               password:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
Router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the authentication token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
Router.post('/refresh', AuthController.refresh);

Router.use(isUserAuthenticated);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *           example: "Bearer <token>"
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access token is missing"
 */
Router.post('/logout', AuthController.logout);

module.exports = Router;
