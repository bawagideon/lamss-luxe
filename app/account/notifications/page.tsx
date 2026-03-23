import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="w-full max-w-2xl space-y-12">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
          NOTIFICATIONS
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto bg-gray-50 rounded-2xl border border-gray-100 p-12">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-200">
          <Bell className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-3">You&apos;re all caught up!</h3>
        <p className="text-gray-500 max-w-sm">
          You don&apos;t have any new notifications at this time. We&apos;ll let you know when there&apos;s an update on your orders or exclusive Lamssé drops.
        </p>
      </div>

    </div>
  );
}
