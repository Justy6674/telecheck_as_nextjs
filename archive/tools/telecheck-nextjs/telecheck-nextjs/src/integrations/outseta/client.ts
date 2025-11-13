/**
 * Outseta Integration Client
 * Handles authentication, subscriptions, and profile management
 */

export interface OutsetaUser {
  Uid: string;
  Email: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  PhoneWork: string;
  PhoneMobile: string;
  ProfileImageS3Url: string;
}

export interface OutsetaAccount {
  Uid: string;
  Name: string;
  BillingRenewalTerm: number;
  CurrentSubscription?: {
    Plan: {
      Uid: string;
      Name: string;
      MonthlyRate: number;
      PlanAddOns: any[];
    };
    AddOns: any[];
  };
}

declare global {
  interface Window {
    Outseta: {
      init: () => void;
      getUser: () => Promise<OutsetaUser>;
      getAccount: () => Promise<OutsetaAccount>;
      logout: () => void;
      auth: {
        login: (email: string, password: string) => Promise<void>;
        register: (userData: any) => Promise<void>;
        resetPassword: (email: string) => Promise<void>;
      };
      profile: {
        update: (userData: Partial<OutsetaUser>) => Promise<OutsetaUser>;
      };
      billing: {
        getInvoices: () => Promise<any[]>;
        updatePaymentMethod: () => void;
        cancelSubscription: () => Promise<void>;
      };
      support: {
        open: () => void;
        close: () => void;
      };
    };
  }
}

/**
 * Outseta Client Class
 * Wrapper around Outseta global object for type safety
 */
export class OutsetaClient {
  static async getCurrentUser(): Promise<OutsetaUser | null> {
    try {
      if (!window.Outseta) {
        throw new Error('Outseta not loaded');
      }
      return await window.Outseta.getUser();
    } catch (error) {
      console.log('No authenticated user');
      return null;
    }
  }

  static async getCurrentAccount(): Promise<OutsetaAccount | null> {
    try {
      if (!window.Outseta) {
        throw new Error('Outseta not loaded');
      }
      return await window.Outseta.getAccount();
    } catch (error) {
      console.log('No account found');
      return null;
    }
  }

  static async login(email: string, password: string): Promise<void> {
    if (!window.Outseta) {
      throw new Error('Outseta not loaded');
    }
    return await window.Outseta.auth.login(email, password);
  }

  static async register(userData: any): Promise<void> {
    if (!window.Outseta) {
      throw new Error('Outseta not loaded');
    }
    return await window.Outseta.auth.register(userData);
  }

  static logout(): void {
    if (window.Outseta) {
      window.Outseta.logout();
    }
  }

  static async updateProfile(userData: Partial<OutsetaUser>): Promise<OutsetaUser> {
    if (!window.Outseta) {
      throw new Error('Outseta not loaded');
    }
    return await window.Outseta.profile.update(userData);
  }

  static async getInvoices(): Promise<any[]> {
    if (!window.Outseta) {
      throw new Error('Outseta not loaded');
    }
    return await window.Outseta.billing.getInvoices();
  }

  static updatePaymentMethod(): void {
    if (window.Outseta) {
      window.Outseta.billing.updatePaymentMethod();
    }
  }

  static async cancelSubscription(): Promise<void> {
    if (!window.Outseta) {
      throw new Error('Outseta not loaded');
    }
    return await window.Outseta.billing.cancelSubscription();
  }

  static openSupportTicket(): void {
    if (window.Outseta && window.Outseta.support) {
      window.Outseta.support.open();
    } else {
      console.warn('Outseta support widget not available');
    }
  }

  static closeSupportTicket(): void {
    if (window.Outseta && window.Outseta.support) {
      window.Outseta.support.close();
    }
  }
}

export default OutsetaClient;