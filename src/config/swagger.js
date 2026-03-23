const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevFinder API',
      version: '1.0.0',
      description: 'API documentation for DevFinder application',
      contact: {
        name: 'API Support',
        email: 'support@devfinder.com',
      },
    },
    servers: [
        {
          description: 'Development server',
          url: 'http://localhost:2000',
        },
        {
          description: 'Production server',
          url: 'https://api.devfinder.com',
        },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in cookie',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/app.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;