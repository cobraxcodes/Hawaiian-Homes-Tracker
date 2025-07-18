import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hawaiian Homes API',
      version: '1.0.0',
      description: 'API docs for Hawaiian Homes Tracker',
    },
    servers: [
      {
        url: 'http://localhost:10000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./server.js'], 
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
