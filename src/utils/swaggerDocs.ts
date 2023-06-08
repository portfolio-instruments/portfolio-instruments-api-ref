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
    tags: [
      {
        name: 'Healthcheck',
      },
      {
        name: 'Session',
      },
      {
        name: 'User',
      },
      {
        name: 'Account',
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
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer',
                },
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      parameters: {
        skipParam: {
          in: 'query',
          name: 'skip',
          description: 'Specify the number of items to skip or offset in the paginated results',
          required: false,
          schema: {
            type: 'integer',
          },
        },
        takeParam: {
          in: 'query',
          name: 'take',
          description: 'Specify the maximum number of items to take or retrieve in a single page or request',
          required: false,
          schema: {
            type: 'integer',
          },
        },
        cursorParam: {
          in: 'query',
          name: 'cursor',
          description: 'Specify the ID from which to start paginating',
          required: false,
          schema: {
            type: 'integer',
          },
        },
        sortParam: {
          in: 'query',
          name: 'sort',
          description:
            'Specify a sorting schema in the following format: "id,-name". There are two fields to populate - (1) the sort direction ("-" or "") and (2) the corresponding field name. Note that sorting in ascending order requires omitting the "+" sign (it is a reserved url character). Additional fields should be separated by a ",".',
          required: false,
          schema: {
            type: 'string',
          },
        },
        expandParam: {
          in: 'query',
          name: 'expand',
          description: 'Specify the fields to expand in the following format: "settings,account". Additional fields should be separated by a ",".',
          required: false,
          schema: {
            type: 'string',
          },
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
