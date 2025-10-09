/**
 * API service to connect with the Richemont backend
 * Backend location: C:\Users\User\Documents\Projects\sites\richemont\backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for JWT authentication
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.error || errorData.message || "Request failed",
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// ============================================================================
// Authentication API
// ============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: any;
  photo_url?: string;
  preferred_brand?: string;
  notification_preferences?: any;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  preferred_brand?: string;
}

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    return fetchAPI<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    return fetchAPI<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<ApiResponse<void>> {
    return fetchAPI<void>("/api/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return fetchAPI<User>("/api/auth/me");
  },

  async refreshToken(): Promise<ApiResponse<void>> {
    return fetchAPI<void>("/api/auth/refresh", {
      method: "POST",
    });
  },
};

// ============================================================================
// Account API
// ============================================================================

export interface Account {
  id: string;
  user_id: string;
  account_type: string;
  account_number: string;
  balance: number;
  currency: string;
  created_at: string;
}

export interface CreateAccountData {
  account_type: string;
  initial_deposit: number;
}

export const accountAPI = {
  async getAccounts(): Promise<ApiResponse<Account[]>> {
    return fetchAPI<Account[]>("/api/accounts");
  },

  async createAccount(data: CreateAccountData): Promise<ApiResponse<Account>> {
    return fetchAPI<Account>("/api/accounts/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// Transaction API
// ============================================================================

export interface Transaction {
  id: string;
  from_account: string;
  to_account: string;
  amount: number;
  type: "credit" | "debit";
  description?: string;
  merchant?: string;
  category?: string;
  timestamp: string;
  created_at: string;
  status: string;
}

export interface TransferData {
  from_account_id: string;
  to_account_id: string;
  amount: number;
}

export const transactionAPI = {
  async getTransactions(accountId?: string): Promise<ApiResponse<Transaction[]>> {
    const query = accountId ? `?account_id=${accountId}` : "";
    return fetchAPI<Transaction[]>(`/api/transactions${query}`);
  },

  async createTransfer(data: TransferData): Promise<ApiResponse<Transaction>> {
    return fetchAPI<Transaction>("/api/transfer", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// Card API
// ============================================================================

export interface Card {
  id: string;
  user_id: string;
  status: "active" | "locked";
  tier: "Gold" | "Platinum" | "Black";
  card_brand?: string;
  card_number: string;
  cvv?: string;
  expiry_date?: string;
  balance?: number;
  credit_limit?: number;
  created_at: string;
}

export const cardAPI = {
  async getCards(): Promise<ApiResponse<Card[]>> {
    return fetchAPI<Card[]>("/api/cards");
  },

  async requestCard(tier: string): Promise<ApiResponse<Card>> {
    return fetchAPI<Card>("/api/cards/request", {
      method: "POST",
      body: JSON.stringify({ tier }),
    });
  },

  async lockCard(cardId: string, locked: boolean): Promise<ApiResponse<void>> {
    return fetchAPI<void>("/api/cards/lock", {
      method: "POST",
      body: JSON.stringify({ card_id: cardId, locked }),
    });
  },
};

// ============================================================================
// Concierge API
// ============================================================================

export interface ConciergeMessage {
  id: string;
  user_id: string;
  message: string;
  response?: string;
  timestamp: string;
}

export const conciergeAPI = {
  async sendMessage(message: string): Promise<ApiResponse<ConciergeMessage>> {
    return fetchAPI<ConciergeMessage>("/api/concierge/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  async createRequest(request: {
    type: string;
    details: string;
  }): Promise<ApiResponse<any>> {
    return fetchAPI("/api/concierge/request", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

// ============================================================================
// Notification API
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const notificationAPI = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return fetchAPI<Notification[]>("/api/notifications");
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>("/api/notifications/read", {
      method: "POST",
      body: JSON.stringify({ notification_id: notificationId }),
    });
  },
};
