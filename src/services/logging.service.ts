import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class LoggingService {
  private readonly baseLogger = new Logger();
  private readonly logDir: string;
  private readonly logFile: string;

  constructor(private readonly configService: ConfigService) {
    this.logDir = this.configService.get<string>(
      'LOG_DIR',
      path.join(__dirname, '../../logs'),
    );

    this.logFile = path.join(this.logDir, 'app.log');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(message: string): void {
    this.writeToConsole('log', message);
    this.writeToFile('LOG', message);
  }

  error(message: string, trace?: string): void {
    this.writeToConsole('error', message, trace);
    this.writeToFile('ERROR', `${message}${trace ? ` - ${trace}` : ''}`);
  }

  warn(message: string): void {
    this.writeToConsole('warn', message);
    this.writeToFile('WARN', message);
  }

  debug(message: string): void {
    this.writeToConsole('debug', message);
    this.writeToFile('DEBUG', message);
  }

  verbose(message: string): void {
    this.writeToConsole('verbose', message);
    this.writeToFile('VERBOSE', message);
  }

  private writeToConsole(level: string, message: string, trace?: string): void {
    const logMessage = `${new Date().toISOString()} [${level}] ${message}${
      trace ? ` - ${trace}` : ''
    }`;
    if (level === 'ERROR' && trace) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  private writeToFile(level: string, message: string): void {
    const logMessage = `${new Date().toISOString()} [${level}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMessage, 'utf8');
  }
}
