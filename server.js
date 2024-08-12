const express = require('express');
const app = express();
require('dotenv').config();

app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('morgan')('dev'));

// Import Swagger libraries
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swaggerConfig'); // Adjust the path if needed

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/', require('./routes'));

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || "Some server error"
    });
});

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`Server is running on port ${process.env.PORT}`);
    }
});
