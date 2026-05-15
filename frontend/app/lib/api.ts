const API_BASE_URL = 'https://mind11.onrender.com';
const DEFAULT_TIMEOUT = 10000;

export interface Player {
  id: string;
  name: string;
  team: string;
  teamColor: string;
  teamSecondary: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  nationality: string;
  isOverseas: boolean;
  battingStyle: 'Right' | 'Left';
  bowlingStyle: string;
  orangeCap: boolean;
  purpleCap: boolean;
  captainExperience: boolean;
  matches: number;
  runs: number;
  wickets: number;
  imageUrl: string;
  cardGlow: string;
  attributes: Record<string, boolean | string>;
}

export interface RecommendationPreferences {
  budget?: number;
  maxOverseas?: number;
  requiredRoles?: Player['role'][];
  preferredTeams?: string[];
  excludeTeams?: string[];
  minMatches?: number;
  requireCaptain?: boolean;
  requireOrangeCap?: boolean;
  requirePurpleCap?: boolean;
  attributes?: Record<string, boolean>;
}

export interface RecommendationResponse {
  success: boolean;
  players?: Player[];
  count?: number;
  error?: string;
  message?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', undefined, true);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError('Invalid response format from server');
  }
}

export async function recommendPlayers(
  preferences: RecommendationPreferences,
  timeout: number = DEFAULT_TIMEOUT
): Promise<Player[]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/recommend`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      },
      timeout
    );

    const result: RecommendationResponse = await handleResponse<RecommendationResponse>(response);

    if (!result.success) {
      throw new ApiError(result.error || result.message || 'Recommendation failed');
    }

   if (!result.players) {
  throw new ApiError('No player recommendations returned');
}

return result.players;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new ApiError('Unable to connect to server. Please check your connection.', undefined, true);
      }
      throw new ApiError(error.message);
    }

    throw new ApiError('An unexpected error occurred');
  }
}

export interface ApiService {
  recommendPlayers: typeof recommendPlayers;
}

export const api: ApiService = {
  recommendPlayers,
};

export default api;
