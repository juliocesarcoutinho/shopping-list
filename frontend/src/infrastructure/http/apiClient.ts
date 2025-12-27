/**
 * API Client - Cliente HTTP centralizado
 *
 * Configuração do Axios com interceptors, timeout e tratamento de erros
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { env } from '../config/env';

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  setAuthToken(token: string): void;
  removeAuthToken(): void;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: unknown;
}

export class ApiHttpClient implements HttpClient {
  private readonly axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor(baseURL: string, timeout: number = 30000) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      config => {
        // Adiciono token automaticamente se existir
        if (this.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Log de debug em desenvolvimento
        if (env.enableDebugLogs) {
          console.log(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }

        return config;
      },
      error => {
        if (env.enableDebugLogs) {
          console.error('Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      response => {
        // Log de sucesso em desenvolvimento
        if (env.enableDebugLogs) {
          console.log(`${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Log de erro em desenvolvimento
        if (env.enableDebugLogs) {
          console.error(`${error.response?.status} ${error.config?.url}`);
        }

        // Tratamento de erros específicos
        if (error.response) {
          const status = error.response.status;

          switch (status) {
            case 401:
              // TODO: Implementar refresh token aqui
              console.warn('Unauthorized - Token expirado ou inválido');
              // Possível logout automático ou refresh token
              break;

            case 403:
              console.warn('Forbidden - Sem permissão para acessar este recurso');
              break;

            case 404:
              console.warn('Not Found - Recurso não encontrado');
              break;

            case 429:
              console.warn('Too Many Requests - Rate limit excedido');
              break;

            case 500:
              console.error('Server Error - Erro interno do servidor');
              break;

            case 503:
              console.error('Service Unavailable - Serviço temporariamente indisponível');
              break;
          }
        } else if (error.request) {
          // Requisição foi feita mas sem resposta (timeout, sem conexão)
          console.error('Network Error - Sem resposta do servidor');
        } else {
          // Erro ao configurar a requisição
          console.error('Request Setup Error:', error.message);
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    const responseData = error.response?.data as { message?: string };

    return {
      message: responseData?.message || error.message || 'Erro desconhecido',
      status: error.response?.status,
      code: error.code,
      data: error.response?.data,
    };
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  removeAuthToken(): void {
    this.authToken = null;
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config as AxiosRequestConfig);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config as AxiosRequestConfig);
    return response.data;
  }
}

// Lazy singleton instance - será criado na primeira vez que for acessado
let _apiClient: ApiHttpClient | null = null;

export function getApiClient(): ApiHttpClient {
  if (!_apiClient) {
    _apiClient = new ApiHttpClient(env.apiUrl, env.apiTimeout);
  }
  return _apiClient;
}

// Export para compatibilidade (usa lazy initialization)
export const apiClient = new Proxy({} as ApiHttpClient, {
  get(_target, prop) {
    return (getApiClient() as any)[prop];
  },
});
