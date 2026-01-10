// src/utils/logger.ts

// Log levels with priority
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4,
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;

// Log entry structure
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  module: string;
  action: string;
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

// Logger configuration
interface LoggerConfig {
  maxLogs: number;           // Maximum logs to store
  minLevel: LogLevel;        // Minimum level to log
  storageKey: string;        // LocalStorage key
  enableConsole: boolean;    // Also log to console
}

const DEFAULT_CONFIG: LoggerConfig = {
  maxLogs: 500,
  minLevel: 'DEBUG',
  storageKey: 'app_logs',
  enableConsole: true,
};

class Logger {
  private config: LoggerConfig;
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique log ID
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get current user ID from storage
  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        return JSON.parse(user).id;
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  // Check if level should be logged
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.config.minLevel];
  }

  // Get logs from storage
  getLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem(this.config.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  }

  // Save logs to storage
  private saveLogs(logs: LogEntry[]): void {
    try {
      // Keep only the latest logs if exceeding max
      const trimmedLogs = logs.slice(-this.config.maxLogs);
      localStorage.setItem(this.config.storageKey, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('Failed to save logs:', error);
      // If storage is full, remove older logs and try again
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        const reducedLogs = logs.slice(-Math.floor(this.config.maxLogs / 2));
        localStorage.setItem(this.config.storageKey, JSON.stringify(reducedLogs));
      }
    }
  }

  // Core log method
  private log(
    level: LogLevel,
    module: string,
    action: string,
    message: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      module,
      action,
      message,
      metadata,
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
    };

    // Console logging with colors
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Save to localStorage
    const logs = this.getLogs();
    logs.push(logEntry);
    this.saveLogs(logs);
  }

  // Console logging with colors
  private logToConsole(entry: LogEntry): void {
    const colors = {
      ERROR: 'color: #EF4444; font-weight: bold',
      WARN: 'color: #F59E0B; font-weight: bold',
      INFO: 'color: #10B981; font-weight: bold',
      DEBUG: 'color: #3B82F6; font-weight: bold',
      TRACE: 'color: #6B7280; font-weight: bold',
    };

    console.log(
      `%c[${entry.level}] %c${entry.timestamp} %c[${entry.module}] %c${entry.action}: ${entry.message}`,
      colors[entry.level],
      'color: #6B7280',
      'color: #8B5CF6',
      'color: inherit',
      entry.metadata || ''
    );
  }

  // Public logging methods
  error(module: string, action: string, message: string, metadata?: Record<string, any>): void {
    this.log('ERROR', module, action, message, metadata);
  }

  warn(module: string, action: string, message: string, metadata?: Record<string, any>): void {
    this.log('WARN', module, action, message, metadata);
  }

  info(module: string, action: string, message: string, metadata?: Record<string, any>): void {
    this.log('INFO', module, action, message, metadata);
  }

  debug(module: string, action: string, message: string, metadata?: Record<string, any>): void {
    this.log('DEBUG', module, action, message, metadata);
  }

  trace(module: string, action: string, message: string, metadata?: Record<string, any>): void {
    this.log('TRACE', module, action, message, metadata);
  }

  // Clear all logs
  clearLogs(): void {
    localStorage.removeItem(this.config.storageKey);
    this.info('Logger', 'CLEAR_LOGS', 'All logs cleared');
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.getLogs().filter((log) => log.level === level);
  }

  // Get logs by module
  getLogsByModule(module: string): LogEntry[] {
    return this.getLogs().filter((log) => log.module === module);
  }

  // Get logs by date range
  getLogsByDateRange(startDate: Date, endDate: Date): LogEntry[] {
    return this.getLogs().filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }

  // Get session ID
  getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
export const logger = new Logger();

// Module-specific logger factory
export const createModuleLogger = (moduleName: string) => ({
  error: (action: string, message: string, metadata?: Record<string, any>) =>
    logger.error(moduleName, action, message, metadata),
  warn: (action: string, message: string, metadata?: Record<string, any>) =>
    logger.warn(moduleName, action, message, metadata),
  info: (action: string, message: string, metadata?: Record<string, any>) =>
    logger.info(moduleName, action, message, metadata),
  debug: (action: string, message: string, metadata?: Record<string, any>) =>
    logger.debug(moduleName, action, message, metadata),
  trace: (action: string, message: string, metadata?: Record<string, any>) =>
    logger.trace(moduleName, action, message, metadata),
});

export default logger;