
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
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLogs(logs: AnalyticsLogEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-500)));
    } catch (error) {
      console.error('Failed to save analytics logs:', error);
    }
  }

  logPageEntry(url: string): string {
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
      ` ANALYTICS User entered: ${url} | Time: ${entryTime} | UserId: ${this.getCurrentUserId() || 'N/A'}`,
      'color: #3B82F6; font-weight: bold; background: #DBEAFE; padding: 2px 6px; border-radius: 3px;',
      'color: inherit;'
    );

    return id;
  }

  logPageExit(trackingId: string): void {
    const page = this.activePages.get(trackingId);
    if (!page) return;

    const now = new Date();
    const exitTime = this.formatDateTime(now);

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
      `📊 ANALYTICS User exited: ${page.url} | Exit: ${exitTime} | UserId: ${this.getCurrentUserId() || 'N/A'}`,
      'color: #3B82F6; font-weight: bold; background: #DBEAFE; padding: 2px 6px; border-radius: 3px;',
      'color: inherit;'
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