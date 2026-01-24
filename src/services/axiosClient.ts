import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const API_INFO_LOGS_KEY = 'api_info_logs';
const API_ERROR_LOGS_KEY = 'api_error_logs';
const API_WARN_LOGS_KEY = 'api_warn_logs';

export type APILogType = 'INFO' | 'WARN' | 'ERROR';

export interface APILogEntry {
  id: string;
  statusCode?: number;
  time: string;
  url: string;
  method: string;
  userId?: string;
  type: APILogType;
  duration?: number;
  message?: string;
  requestData?: any;
  responseData?: any;
  errorMessage?: string;
}

const WARNING_THRESHOLD = 2000; // ms
const MAX_LOGS_PER_TYPE = 200;
const requestTimings = new Map<string, number>();
const requestPayloads = new Map<string, any>();

const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const formatDateTime = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getCurrentUserId = (): string | undefined => {
  try {
    if (typeof window === 'undefined') return undefined;
    const user = localStorage.getItem('currentUser');
    if (user) return JSON.parse(user).id;
  } catch {
    return undefined;
  }
  return undefined;
};

const getLogType = (statusCode: number | undefined, duration: number): APILogType => {
  if (statusCode === undefined || statusCode >= 400) {
    return 'ERROR';
  }

  if (duration > WARNING_THRESHOLD) {
    return 'WARN';
  }

  return 'INFO';
};


const getErrorLabel = (statusCode: number | undefined, errorCode?: string): string => {
  if (!statusCode) {
    if (errorCode === 'ECONNABORTED') return 'TIMEOUT';
    if (errorCode === 'ERR_NETWORK') return 'NETWORK ERROR';
    return 'NETWORK ERROR';
  }

  const errorLabels: Record<number, string> = {
    400: 'BAD REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT FOUND',
    405: 'METHOD NOT ALLOWED',
    408: 'REQUEST TIMEOUT',
    422: 'VALIDATION ERROR',
    429: 'RATE LIMITED',
    500: 'SERVER ERROR',
    502: 'BAD GATEWAY',
    503: 'SERVICE UNAVAILABLE',
    504: 'GATEWAY TIMEOUT',
  };

  return errorLabels[statusCode] || `ERROR ${statusCode}`;
};

const getStorageKey = (type: APILogType): string => {
  switch (type) {
    case 'INFO':
      return API_INFO_LOGS_KEY;
    case 'WARN':
      return API_WARN_LOGS_KEY;
    case 'ERROR':
      return API_ERROR_LOGS_KEY;
    default:
      return API_INFO_LOGS_KEY;
  }
};

const getLogs = (type: APILogType): APILogEntry[] => {
  try {
    if (typeof window === 'undefined') return [];
    const key = getStorageKey(type);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLog = (entry: APILogEntry): void => {
  try {
    if (typeof window === 'undefined') return;
    
    const key = getStorageKey(entry.type);
    const logs = getLogs(entry.type);
    
    logs.push(entry);
    
    const trimmedLogs = logs.slice(-MAX_LOGS_PER_TYPE);
    
    localStorage.setItem(key, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Failed to save API log:', error);
  }
};

const logToConsole = (entry: APILogEntry, errorLabel?: string): void => {
  const { type, statusCode, method, url, time, duration, userId, errorMessage } = entry;
  
  const durationStr = duration ? `${Math.round(duration)}ms` : 'N/A';
  const statusDisplay = statusCode?.toString() || 'NETWORK';
  
  const styles = {
    INFO: {
      icon: '✅',
      label: 'API SUCCESS',
      groupStyle: 'color: #059669; font-weight: bold;',
      labelStyle: 'color: #059669; font-weight: bold; background: #D1FAE5; padding: 2px 8px; border-radius: 4px;',
      detailStyle: 'color: #065F46;',
    },
    WARN: {
      icon: '⚠️',
      label: 'SLOW API',
      groupStyle: 'color: #D97706; font-weight: bold;',
      labelStyle: 'color: #D97706; font-weight: bold; background: #FEF3C7; padding: 2px 8px; border-radius: 4px;',
      detailStyle: 'color: #92400E;',
    },
    ERROR: {
      icon: '❌',
      label: errorLabel || 'API ERROR',
      groupStyle: 'color: #DC2626; font-weight: bold;',
      labelStyle: 'color: #DC2626; font-weight: bold; background: #FEE2E2; padding: 2px 8px; border-radius: 4px;',
      detailStyle: 'color: #991B1B;',
    },
  };

  const style = styles[type];
  const headerMsg = `${style.icon} ${style.label} [${statusDisplay}] ${method} ${url}`;

  if (type === 'ERROR') {
    console.groupCollapsed(headerMsg, style.labelStyle, 'color: #DC2626; font-weight: bold;');
    console.error(` URL: ${url}`, 'font-weight: bold;', 'color: inherit;');
    console.error(` Status: ${statusDisplay}`, 'font-weight: bold;', 'color: inherit;');
    console.error(` Duration: ${durationStr}`, 'font-weight: bold;', 'color: inherit;');
    console.error(` Time: ${time}`, 'font-weight: bold;', 'color: inherit;');
    console.error(` User ID: ${userId || 'N/A'}`, 'font-weight: bold;', 'color: inherit;');
    if (errorMessage){
      console.error(` Message: ${errorMessage}`, 'font-weight: bold;', 'color: inherit;');
    }
    if (entry.requestData) {
      console.error(' Request Data:', 'font-weight: bold;', entry.requestData);
    }
    if (entry.responseData) {
      console.error(' Response Data:', 'font-weight: bold;', entry.responseData);
    }
    console.groupEnd();
  } else if (type === 'WARN') {
    console.groupCollapsed(headerMsg, style.labelStyle, 'color: #D97706; font-weight: bold;');
    console.warn(` URL: ${url}`, 'font-weight: bold;', 'color: inherit;');
    console.warn(` Status: ${statusDisplay}`, 'font-weight: bold;', 'color: inherit;');
    console.warn(` Duration: ${durationStr} (Slow!)`, 'font-weight: bold;', 'color: #D97706;');
    console.warn(` Time: ${time}`, 'font-weight: bold;', 'color: inherit;');
    console.warn(` User ID: ${userId || 'N/A'}`, 'font-weight: bold;', 'color: inherit;');
    
  } else {
    console.groupCollapsed(headerMsg, style.labelStyle, 'color: #059669; font-weight: bold;');
    console.log(` URL: ${url}`, 'font-weight: bold;', 'color: inherit;');
    console.log(` Status: ${statusDisplay}`, 'font-weight: bold;', 'color: inherit;');
    console.log(` Duration: ${durationStr}`, 'font-weight: bold;', 'color: inherit;');
    console.log(` Time: ${time}`, 'font-weight: bold;', 'color: inherit;');
    console.log(` User ID: ${userId || 'N/A'}`, 'font-weight: bold;', 'color: inherit;');
  }
};

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    const requestId = generateId();
    config.headers['X-Request-ID'] = requestId;
    requestTimings.set(requestId, performance.now());
    
    if (config.data) {
      const maskedData = { ...config.data };
      if (maskedData.password) maskedData.password = '***hidden***';
      if (maskedData.confirmPassword) maskedData.confirmPassword = '***hidden***';
      requestPayloads.set(requestId, maskedData);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestId = response.config.headers['X-Request-ID'] as string;
    const startTime = requestTimings.get(requestId);
    const duration = startTime ? performance.now() - startTime : 0;
    
    requestTimings.delete(requestId);
    requestPayloads.delete(requestId);

    const statusCode = response.status;
    const url = response.config.url || '';
    const method = response.config.method?.toUpperCase() || 'GET';
    const time = formatDateTime(new Date());
    const userId = getCurrentUserId();

    const logType = getLogType(statusCode, duration);

    const logEntry: APILogEntry = {
      id: requestId,
      statusCode,
      time,
      url,
      method,
      userId,
      type: logType,
      duration: Math.round(duration),
      responseData: response.data,
    };

    saveLog(logEntry);

    logToConsole(logEntry);

    return response;
  },

  (error: AxiosError) => {
    const config = error.config;
    const requestId = config?.headers?.['X-Request-ID'] as string;
    const startTime = requestId ? requestTimings.get(requestId) : undefined;
    const duration = startTime ? performance.now() - startTime : 0;
    const requestData = requestId ? requestPayloads.get(requestId) : undefined;
    
    if (requestId) {
      requestTimings.delete(requestId);
      requestPayloads.delete(requestId);
    }

    const statusCode = error.response?.status;
    const url = config?.url || '';
    const method = config?.method?.toUpperCase() || 'GET';
    const time = formatDateTime(new Date());
    const userId = getCurrentUserId();
    const errorLabel = getErrorLabel(statusCode, error.code);

    let errorMessage = error.message;
    const responseData = error.response?.data as any;
    if (responseData?.message) {
      errorMessage = responseData.message;
    }

    const logEntry: APILogEntry = {
      id: requestId || generateId(),
      statusCode,
      time,
      url,
      method,
      userId,
      type: 'ERROR',
      duration: Math.round(duration),
      message: errorLabel,
      errorMessage,
      requestData,
      responseData,
    };

    saveLog(logEntry);
    logToConsole(logEntry, errorLabel);

    if (statusCode === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
    }

    return Promise.reject(error);
  }
);

export const getAllAPILogs = (): APILogEntry[] => {
  const infoLogs = getLogs('INFO');
  const warnLogs = getLogs('WARN');
  const errorLogs = getLogs('ERROR');
  
  return [...infoLogs, ...warnLogs, ...errorLogs].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
};

export const getAPIInfoLogs = (): APILogEntry[] => getLogs('INFO');
export const getAPIWarnLogs = (): APILogEntry[] => getLogs('WARN');
export const getAPIErrorLogs = (): APILogEntry[] => getLogs('ERROR');

export const getAPISummary = () => {
  const infoLogs = getLogs('INFO');
  const warnLogs = getLogs('WARN');
  const errorLogs = getLogs('ERROR');
  
  return {
    total: infoLogs.length + warnLogs.length + errorLogs.length,
    info: infoLogs.length,
    warn: warnLogs.length,
    error: errorLogs.length,
  };
};

export const clearAllAPILogs = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_INFO_LOGS_KEY);
    localStorage.removeItem(API_WARN_LOGS_KEY);
    localStorage.removeItem(API_ERROR_LOGS_KEY);
  }
};

export const clearAPILogs = (type: APILogType): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getStorageKey(type));
  }
};

export const printLogsSummary = (): void => {
  const summary = getAPISummary();
  
  console.log(' API LOGS SUMMARY', 'font-size: 14px; font-weight: bold; color: #1F2937;');
  console.log(` INFO: ${summary.info}`, 'color: #059669; font-weight: bold;', 'color: inherit;');
  console.log(` WARN: ${summary.warn}`, 'color: #D97706; font-weight: bold;', 'color: inherit;');
  console.log(` ERROR: ${summary.error}`, 'color: #DC2626; font-weight: bold;', 'color: inherit;');
  console.log(` TOTAL: ${summary.total}`, 'color: #1F2937; font-weight: bold;', 'color: inherit;');
};

export const printErrorLogs = (): void => {
  const errors = getAPIErrorLogs();
  
  console.log(' ERROR LOGS', 'font-size: 14px; font-weight: bold; color: #DC2626; background: #FEE2E2; padding: 4px 8px; border-radius: 4px;');
  
  if (errors.length === 0) {
    console.log(' No error logs found!', 'color: #059669;');
    return;
  }
  
  errors.forEach((log, index) => {
    console.group(`#${index + 1} [${log.statusCode || 'NETWORK'}] ${log.method} ${log.url}`, 'color: #DC2626;');
    console.log('Time:', log.time);
    console.log('Duration:', `${log.duration}ms`);
    console.log('Error:', log.errorMessage);
    console.log('User ID:', log.userId || 'N/A');
    if (log.requestData) console.log('Request:', log.requestData);
    if (log.responseData) console.log('Response:', log.responseData);
    console.groupEnd();
  });
};

export const printInfoLogs = (): void => {
  const infos = getAPIInfoLogs();
  
  console.log(' INFO LOGS', 'font-size: 14px; font-weight: bold; color: #059669; background: #D1FAE5; padding: 4px 8px; border-radius: 4px;');
  
  if (infos.length === 0) {
    console.log('📭 No info logs found!', 'color: #6B7280;');
    return;
  }
  
  infos.forEach((log, index) => {
    console.group(`#${index + 1} [${log.statusCode}] ${log.method} ${log.url}`, 'color: #059669;');
    console.log('Time:', log.time);
    console.log('Duration:', `${log.duration}ms`);
    console.log('User ID:', log.userId || 'N/A');
    console.groupEnd();
  });
};

export default axiosClient;