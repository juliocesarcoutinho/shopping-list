/**
 * Infrastructure Layer - HTTP Client
 *
 * HTTP client configuration and API service implementations.
 */

import { env } from '../config/env';

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
}

export class ApiHttpClient implements HttpClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: never, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: never, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    const headers = { ...this.defaultHeaders, ...config?.headers };

    const fetchConfig: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    try {
      const response = await fetch(fullUrl, fetchConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`HTTP request failed: ${method} ${fullUrl}`, error);
      throw error;
    }
  }
}

// Singleton instance usando configuração de ambiente
export const apiClient = new ApiHttpClient(env.apiUrl);
