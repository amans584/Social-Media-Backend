const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Toddle Book API Docs',
            version: '1.0.0',
            description: 'API documentation for the Toddle Social Media application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: 'Development server'
            }
        ]
    },
    apis: ['./routes/*.js', './models/*.js'] // Adjust the paths according to your project structure
};

const specs = swaggerJsdoc(options);
module.exports = specs;
