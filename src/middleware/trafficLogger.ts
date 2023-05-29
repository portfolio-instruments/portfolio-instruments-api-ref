import type { NextFunction, Request, Response } from 'express';
import Logger from '../utils/Logger';

function trafficLogger(req: Request, res: Response, next: NextFunction): void {
  Logger.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - Ip: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
    Logger.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - Ip: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
  });

  next();
}

export default trafficLogger;
