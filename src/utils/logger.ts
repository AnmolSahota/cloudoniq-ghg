const STORAGE_KEY = 'analytics_logs';

export interface AnalyticsLogEntry {
  userId?: string;
  url: string;
  entryTime: string;
  exitTime?: string;
}

interface ActivePage {
  id: string;
  url: string;
  entryTime: string;
  startPerf: number;
}

class AnalyticsLogger {
  private activePages: Map<string, ActivePage> = new Map();
  private lastEntryTimestamp = 0;

  /* ===================== SECURITY HELPERS ===================== */

  private logSecurity(message: string, extra?: unknown): void {
    console.warn(
      `🔐 SECURITY ${message}`,
      extra ?? ''
    );
  }

  private checkSecurity(): void {
    // Non-HTTPS access
    if (location.protocol !== 'https:') {
      this.logSecurity('Non-HTTPS page access detected', location.href);
    }

    // localStorage availability
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
    } catch {
      this.logSecurity('localStorage is unavailable or blocked');
    }
  }

  /* ===================== PERFORMANCE HELPERS ===================== */

  private logPerformance(message: string, duration?: number): void {
    console.info(
      `⚡ PERFORMANCE ${message}${duration ? ` | ${duration.toFixed(2)}ms` : ''}`
    );
  }

  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) return JSON.parse(user).id;
    } catch {
      return undefined;
    }
    return undefined;
  }

  private formatDateTime(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  private getLogs(): AnalyticsLogEntry[] {
    const start = performance.now();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    } finally {
      this.logPerformance('Read analytics logs', performance.now() - start);
    }
  }

  private saveLogs(logs: AnalyticsLogEntry[]): void {
    const start = performance.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-500)));
    } catch (error) {
      console.error('Failed to save analytics logs:', error);
    } finally {
      this.logPerformance('Write analytics logs', performance.now() - start);
    }
  }

  logPageEntry(url: string): string {
    this.checkSecurity();

    const nowPerf = performance.now();
    if (nowPerf - this.lastEntryTimestamp < 300) {
      this.logSecurity('Rapid page entry detected (possible abuse)', url);
    }
    this.lastEntryTimestamp = nowPerf;

    const id = `page_${Date.now()}`;
    const now = new Date();
    const entryTime = this.formatDateTime(now);

    this.activePages.set(id, {
      id,
      url,
      entryTime,
      startPerf: performance.now(),
    });

    const logs = this.getLogs();
    logs.push({
      userId: this.getCurrentUserId(),
      url,
      entryTime,
    });
    this.saveLogs(logs);

    console.log(
      `📊 ANALYTICS User entered: ${url} | Time: ${entryTime} | UserId: ${this.getCurrentUserId() || 'N/A'}`,
      'color: #3B82F6; font-weight: bold; background: #DBEAFE; padding: 2px 6px; border-radius: 3px;'
    );

    return id;
  }

  logPageExit(trackingId: string): void {
    const page = this.activePages.get(trackingId);
    if (!page) return;

    const now = new Date();
    const exitTime = this.formatDateTime(now);
    const duration = performance.now() - page.startPerf;

    if (duration > 10_000) {
      this.logPerformance('Slow page session detected', duration);
    }

    this.activePages.delete(trackingId);

    const logs = this.getLogs();
    const index = logs.findIndex(
      (log) => log.url === page.url && log.entryTime === page.entryTime && !log.exitTime
    );

    if (index !== -1) {
      logs[index].exitTime = exitTime;
      this.saveLogs(logs);
    }

    console.log(
      `📊 ANALYTICS User exited: ${page.url} | Exit: ${exitTime} | Duration: ${duration.toFixed(2)}ms | UserId: ${this.getCurrentUserId() || 'N/A'}`,
      'color: #3B82F6; font-weight: bold; background: #DBEAFE; padding: 2px 6px; border-radius: 3px;'
    );
  }

  getAnalyticsLogs(): AnalyticsLogEntry[] {
    return this.getLogs();
  }

  clearLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const logger = new AnalyticsLogger();
export default logger;
