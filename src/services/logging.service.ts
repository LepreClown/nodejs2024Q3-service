import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import * as fs from 'node:fs';

const DEFAULT_FILE_MAX_SIZE = 10 * 1024 * 1024;
const DEFAULT_FILE_LVL = 2;

@Injectable()
export class LoggingService {
  private readonly logDir: string;
  private readonly logFile: string;
  private readonly logErrorFile: string;
  private readonly maxSizeFile: number;
  private readonly logFileLvl: number;

  constructor(private readonly configService: ConfigService) {
    this.logDir = this.configService.get<string>(
      'LOG_DIR',
      path.join(__dirname, '../../logs'),
    );

    this.logFile = path.join(this.logDir, 'app.log');
    this.logErrorFile = path.join(this.logDir, 'errors.log');
    this.logFileLvl = this.configService.get<number>(
      'LOG_FILE_LVL',
      DEFAULT_FILE_LVL,
    );
    this.maxSizeFile = this.configService.get<number>(
      'FILE_MAX_SIZE',
      DEFAULT_FILE_MAX_SIZE,
    );

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(message: string): void {
    if (this.shouldLog(1)) {
      this.writeToConsole('log', message);
      this.writeToFile('LOG', message, this.logFile);
    }
  }

  error(message: string, trace?: string): void {
    if (this.shouldLog(0)) {
      this.writeToConsole('error', message, trace);
      this.writeToFile(
        'ERROR',
        `${message}${trace ? ` - ${trace}` : ''}`,
        this.logFile,
      );
      this.writeToFile(
        'ERROR',
        `${message}${trace ? ` - ${trace}` : ''}`,
        this.logErrorFile,
      );
    }
  }

  warn(message: string): void {
    if (this.shouldLog(2)) {
      this.writeToConsole('warn', message);
      this.writeToFile('WARN', message, this.logFile);
    }
  }

  debug(message: string): void {
    if (this.shouldLog(3)) {
      this.writeToConsole('debug', message);
      this.writeToFile('DEBUG', message, this.logFile);
    }
  }

  verbose(message: string): void {
    if (this.shouldLog(4)) {
      this.writeToConsole('verbose', message);
      this.writeToFile('VERBOSE', message, this.logFile);
    }
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

  private writeToFile(level: string, message: string, filePath: string): void {
    const logMessage = `${new Date().toISOString()} [${level}] ${message}\n`;
    fs.appendFileSync(filePath, logMessage, 'utf8');
  }

  private shouldLog(level: number): boolean {
    return level <= this.logFileLvl;
  }
}
