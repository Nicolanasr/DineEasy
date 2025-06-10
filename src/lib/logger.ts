// src/lib/logger.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private log(level: LogLevel, message: string, data?: unknown, context?: string) {
    // Create entry for potential future logging enhancements (structured logging, etc.)
    // For now, we use direct console logging
    const timestamp = new Date().toISOString();
    const logData = { level, message, data, timestamp, context };

    // In production, only log warnings and errors
    if (!this.isDevelopment && !['warn', 'error'].includes(level)) {
      return;
    }

    // Format output
    const prefix = context ? `[${context}]` : '';
    const formattedMessage = `${prefix} ${message}`;

    // Use logData for structured logging in development
    if (this.isDevelopment && data) {
      switch (level) {
        case 'debug':
          console.debug('🐛', formattedMessage, data);
          break;
        case 'info':
          console.info('ℹ️', formattedMessage, data);
          break;
        case 'warn':
          console.warn('⚠️', formattedMessage, data);
          break;
        case 'error':
          console.error('❌', formattedMessage, data);
          break;
      }
    } else {
      // Simple logging without data
      switch (level) {
        case 'debug':
          console.debug('🐛', formattedMessage);
          break;
        case 'info':
          console.info('ℹ️', formattedMessage);
          break;
        case 'warn':
          console.warn('⚠️', formattedMessage);
          break;
        case 'error':
          console.error('❌', formattedMessage);
          break;
      }
    }

    // Store logData for potential future use (analytics, remote logging, etc.)
    void logData;
  }

  debug(message: string, data?: unknown, context?: string) {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string) {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: unknown, context?: string) {
    this.log('error', message, data, context);
  }

  // Context-specific loggers
  sessionLogger = {
    debug: (message: string, data?: unknown) => this.debug(message, data, 'Session'),
    info: (message: string, data?: unknown) => this.info(message, data, 'Session'),
    warn: (message: string, data?: unknown) => this.warn(message, data, 'Session'),
    error: (message: string, data?: unknown) => this.error(message, data, 'Session'),
  };

  cartLogger = {
    debug: (message: string, data?: unknown) => this.debug(message, data, 'Cart'),
    info: (message: string, data?: unknown) => this.info(message, data, 'Cart'),
    warn: (message: string, data?: unknown) => this.warn(message, data, 'Cart'),
    error: (message: string, data?: unknown) => this.error(message, data, 'Cart'),
  };

  participantLogger = {
    debug: (message: string, data?: unknown) => this.debug(message, data, 'Participant'),
    info: (message: string, data?: unknown) => this.info(message, data, 'Participant'),
    warn: (message: string, data?: unknown) => this.warn(message, data, 'Participant'),
    error: (message: string, data?: unknown) => this.error(message, data, 'Participant'),
  };

  apiLogger = {
    debug: (message: string, data?: unknown) => this.debug(message, data, 'API'),
    info: (message: string, data?: unknown) => this.info(message, data, 'API'),
    warn: (message: string, data?: unknown) => this.warn(message, data, 'API'),
    error: (message: string, data?: unknown) => this.error(message, data, 'API'),
  };
}

export const logger = new Logger();