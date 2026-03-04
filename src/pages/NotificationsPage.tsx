import { useApp } from '@/context/AppContext';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Notifications</h1><p className="text-sm text-muted-foreground">{unread} unread</p></div>
        {unread > 0 && <Button variant="outline" size="sm" onClick={() => notifications.forEach(n => markNotificationRead(n.id))}><CheckCheck className="w-4 h-4 mr-1" /> Mark all read</Button>}
      </div>
      {notifications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:bg-muted/30 ${!n.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'success' ? 'bg-gain' : n.type === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(n.timestamp).toLocaleString('en-IN')}</p>
              </div>
              {n.read && <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
