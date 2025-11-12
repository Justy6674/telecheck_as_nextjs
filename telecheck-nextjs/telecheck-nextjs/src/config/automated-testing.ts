// Automated Testing Configuration
// This configuration defines the automated testing schedules and parameters

export interface TestSchedule {
  id: string;
  name: string;
  description: string;
  schedule: string; // Cron expression
  enabled: boolean;
  edgeFunction: string;
  parameters?: Record<string, any>;
  notifications?: {
    email?: string[];
    slack?: string;
  };
}

export const testSchedules: TestSchedule[] = [
  {
    id: 'daily-data-integrity',
    name: 'Daily Data Integrity Check',
    description: 'Runs comprehensive data integrity tests every day at 2 AM AEST',
    schedule: '0 2 * * *', // 2:00 AM daily
    enabled: true,
    edgeFunction: 'automated-testing',
    parameters: {
      testType: 'data-integrity'
    },
    notifications: {
      email: ['admin@telecheck.com.au']
    }
  },
  {
    id: 'hourly-performance',
    name: 'Hourly Performance Monitoring',
    description: 'Checks system performance metrics every hour',
    schedule: '0 * * * *', // Every hour on the hour
    enabled: true,
    edgeFunction: 'automated-testing',
    parameters: {
      testType: 'performance'
    }
  },
  {
    id: 'weekly-compliance',
    name: 'Weekly Compliance Audit',
    description: 'Full compliance audit every Monday at 9 AM AEST',
    schedule: '0 9 * * 1', // 9:00 AM every Monday
    enabled: true,
    edgeFunction: 'compliance-check',
    parameters: {
      category: 'all'
    },
    notifications: {
      email: ['compliance@telecheck.com.au', 'admin@telecheck.com.au']
    }
  },
  {
    id: 'daily-subscription',
    name: 'Daily Subscription Validation',
    description: 'Validates all active subscriptions daily at 3 AM AEST',
    schedule: '0 3 * * *', // 3:00 AM daily
    enabled: true,
    edgeFunction: 'automated-testing',
    parameters: {
      testType: 'subscription'
    }
  },
  {
    id: 'weekly-production-readiness',
    name: 'Weekly Production Readiness Check',
    description: 'Comprehensive production readiness assessment every Sunday',
    schedule: '0 22 * * 0', // 10:00 PM every Sunday
    enabled: true,
    edgeFunction: 'production-readiness',
    parameters: {},
    notifications: {
      email: ['devops@telecheck.com.au']
    }
  },
  {
    id: 'disaster-data-refresh',
    name: 'Disaster Data Refresh',
    description: 'Updates disaster data from DisasterAssist twice daily',
    schedule: '0 6,18 * * *', // 6:00 AM and 6:00 PM daily
    enabled: true,
    edgeFunction: 'refresh-disaster-urls',
    parameters: {}
  }
];

// Alert thresholds for automated responses
export const alertThresholds = {
  performance: {
    queryTime: 500, // ms
    bulkOperationTime: 2000, // ms
    errorRate: 0.05, // 5%
  },
  compliance: {
    minimumScore: 80, // percentage
    criticalIssuesAllowed: 0,
  },
  dataIntegrity: {
    duplicateAGRNsAllowed: 0,
    missingURLsThreshold: 10,
    invalidDatesAllowed: 0,
  },
  availability: {
    minimumUptime: 99.9, // percentage
    maxResponseTime: 1000, // ms
  }
};

// Notification templates
export const notificationTemplates = {
  testFailure: {
    subject: '🚨 [TeleCheck] Automated Test Failure Alert',
    body: (testName: string, failures: number, details: string) => `
      Automated testing has detected issues that require immediate attention.

      Test Suite: ${testName}
      Failures: ${failures}
      Timestamp: ${new Date().toISOString()}

      Details:
      ${details}

      Please review the admin dashboard for full details.
    `
  },
  complianceWarning: {
    subject: '⚠️ [TeleCheck] Compliance Score Below Threshold',
    body: (score: number, category: string, issues: string[]) => `
      Compliance audit has detected scores below acceptable thresholds.

      Overall Score: ${score}%
      Category: ${category}
      Critical Issues:
      ${issues.map(issue => `- ${issue}`).join('\n')}

      Immediate action required to maintain compliance.
    `
  },
  performanceDegradation: {
    subject: '🐌 [TeleCheck] Performance Degradation Detected',
    body: (metric: string, current: number, threshold: number) => `
      System performance has degraded below acceptable levels.

      Metric: ${metric}
      Current Value: ${current}
      Threshold: ${threshold}

      Please investigate and optimize immediately.
    `
  }
};

// Test result storage configuration
export const storageConfig = {
  retentionDays: 90, // Keep test results for 90 days
  aggregationInterval: 'daily', // Aggregate results daily
  archiveLocation: 'test_results_archive',
  compressionEnabled: true
};

// Integration with monitoring services
export const monitoringIntegrations = {
  sentry: {
    enabled: false, // Enable when Sentry is configured
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    environment: import.meta.env.MODE || 'development'
  },
  datadog: {
    enabled: false,
    apiKey: import.meta.env.VITE_DATADOG_API_KEY || '',
    appKey: import.meta.env.VITE_DATADOG_APP_KEY || ''
  },
  slack: {
    enabled: false,
    webhookUrl: import.meta.env.VITE_SLACK_WEBHOOK_URL || '',
    channel: '#telecheck-alerts'
  }
};

// Export utility functions for test scheduling
export const getNextRunTime = (cronExpression: string): Date => {
  // This would use a cron parser library in production
  // For now, return a mock next run time
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
};

export const isTestDue = (schedule: TestSchedule): boolean => {
  // Check if test should run based on cron schedule
  // This would use a cron parser in production
  return schedule.enabled;
};

export const formatTestResults = (results: any): string => {
  // Format test results for notifications
  return JSON.stringify(results, null, 2);
};