
'use client';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';

export function Header() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
        <CalendarDateRangePicker />
        <Button className="w-full md:w-auto">Download</Button>
      </div>
    </div>
  );
}
