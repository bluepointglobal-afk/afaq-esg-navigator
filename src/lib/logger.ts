/**
 * Logger - Centralized client-side logging utility.
 * 
 * BMAD Task: T-007
 * Risk Addressed: 02_RISKS.md §5.2 - No Centralized Logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: unknown;
}

class Logger {
    private static instance: Logger;
    private isDevelopment = process.env.NODE_ENV === 'development';

    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private log(level: LogLevel, message: string, context?: LogContext) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        if (this.isDevelopment) {
            const consoleMethod = level === 'debug' ? 'debug' : level === 'info' ? 'info' : level === 'warn' ? 'warn' : 'error';
            if (context) {
                console[consoleMethod](prefix, message, context);
            } else {
                console[consoleMethod](prefix, message);
            }
        } else {
            // In production, we currently only log to console as a baseline.
            // This is the "canonical" implementation requested.
            // Future tasks could add Sentry or other providers here.
            if (level === 'error' || level === 'warn') {
                console[level](prefix, message, context || '');
            }
        }
    }

    public debug(message: string, context?: LogContext) {
        this.log('debug', message, context);
    }

    public info(message: string, context?: LogContext) {
        this.log('info', message, context);
    }

    public warn(message: string, context?: LogContext) {
        this.log('warn', message, context);
    }

    public error(message: string, error?: Error | string, context?: LogContext) {
        const errorContext = {
            ...(context || {}),
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : error
        };
        this.log('error', message, errorContext);
    }
}

export const logger = Logger.getInstance();
