import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from '../services/logging.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url, body, query } = req;

    res.on('finish', () => {
      this.logDetails({
        method,
        url,
        queryParams: query,
        requestBody: body,
        responseStatus: res.statusCode,
      });
    });

    next();
  }

  private logDetails(details: {
    method: string;
    url: string;
    queryParams: Record<string, any>;
    requestBody: Record<string, any>;
    responseStatus: number;
  }): void {
    const { method, url, queryParams, requestBody, responseStatus } = details;

    const logMessage = [
      `HTTP ${method} ${url}`,
      `Query Params: ${JSON.stringify(queryParams)}`,
      `Request Body: ${JSON.stringify(requestBody)}`,
      `Response Status: ${responseStatus}`,
    ].join(' | ');

    this.loggingService.log(logMessage);
  }
}
