import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminRevenue: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Revenue tracking uses profiles table as single source of truth for all subscription data.</p>
      </CardContent>
    </Card>
  );
};