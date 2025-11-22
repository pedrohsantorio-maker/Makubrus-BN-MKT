
'use client';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';

export function Header() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div>
    </div>
  );
}
