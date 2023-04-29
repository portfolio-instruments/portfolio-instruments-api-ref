import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.2',
    info: {
      title: 'Portfolio Instruments API',
      version,
      contact: {
        name: 'MicroFish91',
        url: 'https://github.com/MicroFish91/Portfolio-Instruments-API',
      },
      license: {
        name: 'GPL-3.0 License',
        url: 'https://github.com/MicroFish91/Portfolio-Instruments-API/blob/main/LICENSE',
      },
    },
    components: {
      securitySchemas: {
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
    servers: [
      {
        url: 'http://localhost:3001/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.portfolioinstruments.com/v1',
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes.ts', './src/modules/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
