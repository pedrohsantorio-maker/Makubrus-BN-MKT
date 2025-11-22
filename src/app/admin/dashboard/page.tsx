

import { Header } from '@/components/dashboard/header';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { ConversionFunnel } from '@/components/dashboard/conversion-funnel';
import { TrafficSourceCharts } from '@/components/dashboard/traffic-source-charts';
import { UserBehavior } from '@/components/dashboard/user-behavior';
import { LeadHistoryTable } from '@/components/dashboard/lead-history-table';
import { SmartAlerts } from '@/components/dashboard/smart-alerts';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Header />
        <SmartAlerts />
        <OverviewCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ConversionFunnel />
            <TrafficSourceCharts />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <UserBehavior />
            <LeadHistoryTable />
        </div>
      </main>
    </div>
  );
}
