import type { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import config from '../config';
import Logger from '../utils/Logger';
import swaggerSpec from './swaggerSpec';

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
