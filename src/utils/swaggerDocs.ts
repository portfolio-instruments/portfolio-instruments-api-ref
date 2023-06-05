import type { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import config from '../config';
import Logger from './Logger';

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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
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

function swaggerDocs(app: Express) {
  // Swagger page
  app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/v1/docs.json', (_: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  Logger.info(`Docs available at ${config.HOSTNAME}:${config.PORT}/v1/docs`);
}

export default swaggerDocs;
