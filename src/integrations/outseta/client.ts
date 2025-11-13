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

const getOutsetaGlobal = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (window as any).Outseta ?? null;
};

/**
 * Outseta Client Class
 * Wrapper around Outseta global object for type safety
 */
export class OutsetaClient {
  static async getCurrentUser(): Promise<OutsetaUser | null> {
    try {
      const outseta = getOutsetaGlobal();
      if (!outseta) {
        throw new Error('Outseta not loaded');
      }
      return await outseta.getUser();
    } catch (error) {
      console.log('No authenticated user');
      return null;
    }
  }

  static async getCurrentAccount(): Promise<OutsetaAccount | null> {
    try {
      const outseta = getOutsetaGlobal();
      if (!outseta) {
        throw new Error('Outseta not loaded');
      }
      return await outseta.getAccount();
    } catch (error) {
      console.log('No account found');
      return null;
    }
  }

  static async login(email: string, password: string): Promise<void> {
    const outseta = getOutsetaGlobal();
    if (!outseta) {
      throw new Error('Outseta not loaded');
    }
    return await outseta.auth.login(email, password);
  }

  static async register(userData: any): Promise<void> {
    const outseta = getOutsetaGlobal();
    if (!outseta) {
      throw new Error('Outseta not loaded');
    }
    return await outseta.auth.register(userData);
  }

  static logout(): void {
    const outseta = getOutsetaGlobal();
    if (outseta) {
      outseta.logout();
    }
  }

  static async updateProfile(userData: Partial<OutsetaUser>): Promise<OutsetaUser> {
    const outseta = getOutsetaGlobal();
    if (!outseta) {
      throw new Error('Outseta not loaded');
    }
    return await outseta.profile.update(userData);
  }

  static async getInvoices(): Promise<any[]> {
    const outseta = getOutsetaGlobal();
    if (!outseta) {
      throw new Error('Outseta not loaded');
    }
    return await outseta.billing.getInvoices();
  }

  static updatePaymentMethod(): void {
    const outseta = getOutsetaGlobal();
    if (outseta) {
      outseta.billing.updatePaymentMethod();
    }
  }

  static async cancelSubscription(): Promise<void> {
    const outseta = getOutsetaGlobal();
    if (!outseta) {
      throw new Error('Outseta not loaded');
    }
    return await outseta.billing.cancelSubscription();
  }

  static openSupportTicket(): void {
    const outseta = getOutsetaGlobal();
    if (outseta?.support) {
      outseta.support.open();
    } else {
      console.warn('Outseta support widget not available');
    }
  }

  static closeSupportTicket(): void {
    const outseta = getOutsetaGlobal();
    if (outseta?.support) {
      outseta.support.close();
    }
  }
}

export default OutsetaClient;