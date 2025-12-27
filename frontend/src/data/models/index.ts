/**
 * Data Layer - Models
 *
 * DTOs and data transfer objects for external APIs and data sources.
 * These may differ from domain entities to handle API-specific formats.
 */

// Auth DTOs
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponseDto {
  id: number;
  email: string;
  name: string;
  provider: string;
  status: string;
  createdAt: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LogoutRequestDto {
  refreshToken: string;
}

export interface GoogleLoginRequestDto {
  idToken: string;
}

export interface GoogleLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserMeResponseDto {
  id: number;
  email: string;
  name: string;
  provider: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItemDto {
  id: string;
  name: string;
  quantity: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListDto {
  id: string;
  title: string;
  items: ShoppingItemDto[];
  created_at: string;
  updated_at: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface CreateShoppingListRequest {
  title: string;
}

export interface CreateShoppingItemRequest {
  name: string;
  quantity: number;
}

export interface UpdateShoppingItemRequest {
  name?: string;
  quantity?: number;
  is_completed?: boolean;
}
