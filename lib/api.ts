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
    // Get JWT token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
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
  preferred_brand?: string;
  recaptcha_token?: string; // Anti-bot verification token
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

};

// ============================================================================
// Account API
// ============================================================================

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateAccountData {
  account_type: string;
  initial_deposit?: number;
}

export const accountAPI = {
  async getAccounts(): Promise<ApiResponse<Account[]>> {
    return fetchAPI<Account[]>("/api/accounts");
  },

  async createAccount(data: CreateAccountData): Promise<ApiResponse<Account>> {
    return fetchAPI<Account>("/api/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getAccountTransactions(accountId: string): Promise<ApiResponse<Transaction[]>> {
    return fetchAPI<Transaction[]>(`/api/accounts/${accountId}/transactions`);
  },
};

// ============================================================================
// Transaction API
// ============================================================================

export interface Transaction {
  id: string;
  account_id: string;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  merchant?: string;
  category?: string;
  created_at: string;
}

export interface Transfer {
  id: string;
  user_id: string;
  from_account_id: string;
  to_account_id?: string;
  to_external?: any;
  amount: number;
  transfer_type: string;
  status: string;
  created_at: string;
}

export interface TransferData {
  from_account_id: string;
  to_account_id?: string;
  to_external?: {
    account_number?: string;
    routing_number?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  amount: number;
  transfer_type?: string;
}

export const transferAPI = {
  async createTransfer(data: TransferData): Promise<ApiResponse<Transfer>> {
    return fetchAPI<Transfer>("/api/transfers", {
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
  card_number: string;
  card_type: string;
  card_brand?: string;
  cvv?: string;
  expiry_date?: string;
  credit_limit?: number;
  balance?: number;
  status: "active" | "locked" | "expired" | "approved";
  created_at: string;
  updated_at?: string;
}

export interface CardApplicationData {
  card_type: string;
  card_brand?: string;
  credit_limit?: number;
}

export const cardAPI = {
  async getCards(): Promise<ApiResponse<Card[]>> {
    return fetchAPI<Card[]>("/api/cards");
  },

  async applyCard(data: CardApplicationData): Promise<ApiResponse<Card>> {
    return fetchAPI<Card>("/api/cards/apply", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async lockCard(cardId: string, locked: boolean): Promise<ApiResponse<Card>> {
    return fetchAPI<Card>(`/api/cards/${cardId}/lock`, {
      method: "POST",
      body: JSON.stringify({ locked }),
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
// Bill API
// ============================================================================

export interface Bill {
  id: string;
  user_id: string;
  payee_name: string;
  account_number?: string;
  bill_type?: string;
  auto_pay: boolean;
  created_at: string;
}

export interface BillPaymentData {
  account_id: string;
  amount: number;
  payment_date?: string;
}

export interface BillPayment {
  id: string;
  user_id: string;
  bill_id: string;
  account_id: string;
  amount: number;
  payment_date: string;
  status: string;
  created_at: string;
}

export interface AddBillData {
  payee_name: string;
  account_number?: string;
  bill_type?: string;
  auto_pay?: boolean;
}

export const billAPI = {
  async getBills(): Promise<ApiResponse<Bill[]>> {
    return fetchAPI<Bill[]>("/api/bills");
  },

  async addBill(data: AddBillData): Promise<ApiResponse<Bill>> {
    return fetchAPI<Bill>("/api/bills", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async payBill(billId: string, data: BillPaymentData): Promise<ApiResponse<BillPayment>> {
    return fetchAPI<BillPayment>(`/api/bills/${billId}/pay`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// Check API
// ============================================================================

export interface Check {
  id: string;
  user_id: string;
  account_id: string;
  check_number?: string;
  amount: number;
  payee?: string;
  front_image_url?: string;
  back_image_url?: string;
  status: string;
  created_at: string;
}

export interface CheckOrder {
  id: string;
  user_id: string;
  account_id: string;
  design: string;
  quantity: number;
  price?: number;
  status: string;
  created_at: string;
}

export interface CheckDepositData {
  account_id: string;
  amount: number;
  check_number?: string;
}

export interface CheckOrderData {
  account_id: string;
  design?: string;
  quantity?: number;
  price?: number;
}

export const checkAPI = {
  async getChecks(): Promise<ApiResponse<Check[]>> {
    return fetchAPI<Check[]>("/api/checks");
  },

  async depositCheck(data: CheckDepositData): Promise<ApiResponse<Check>> {
    return fetchAPI<Check>("/api/checks/deposit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async orderChecks(data: CheckOrderData): Promise<ApiResponse<CheckOrder>> {
    return fetchAPI<CheckOrder>("/api/checks/order", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// Notification API
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title?: string;
  message: string;
  delivery_method?: string;
  read: boolean;
  created_at: string;
}

export const notificationAPI = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return fetchAPI<Notification[]>("/api/notifications");
  },
  
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  },
  
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return fetchAPI<void>("/api/notifications/mark-all-read", {
      method: "PUT",
    });
  },
};

// ============================================================================
// Settings API
// ============================================================================
export interface UserSettings {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: any;
  photo_url?: string;
  preferred_brand?: string;
  notification_preferences?: any;
}

export const settingsAPI = {
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    return fetchAPI<UserSettings>("/api/settings");
  },

  async updateSettings(data: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    return fetchAPI<UserSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// Beneficiaries API
// ============================================================================
export interface Beneficiary {
  id: string;
  user_id: string;
  full_name: string;
  relationship: string;
  email?: string;
  phone?: string;
  percentage: number;
  created_at: string;
}

export interface BeneficiaryData {
  full_name: string;
  relationship: string;
  email?: string;
  phone?: string;
  percentage: number;
}

export const beneficiariesAPI = {
  async getBeneficiaries(): Promise<ApiResponse<Beneficiary[]>> {
    return fetchAPI<Beneficiary[]>("/api/beneficiaries");
  },

  async addBeneficiary(data: BeneficiaryData): Promise<ApiResponse<Beneficiary>> {
    return fetchAPI<Beneficiary>("/api/beneficiaries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateBeneficiary(id: string, data: Partial<BeneficiaryData>): Promise<ApiResponse<Beneficiary>> {
    return fetchAPI<Beneficiary>(`/api/beneficiaries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteBeneficiary(id: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/api/beneficiaries/${id}`, {
      method: "DELETE",
    });
  },
};
