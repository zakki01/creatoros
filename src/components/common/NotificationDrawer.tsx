import React from 'react';
import { X, CheckCheck, Bell, Sparkles, AlertCircle, FileCheck, CreditCard } from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { notifications, markNotificationAsRead, clearAllNotifications, role } = useAppState();

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(
    (n) => n.targetRole === role || n.targetRole === 'business'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <FileCheck className="w-4 h-4 text-emerald-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-indigo-400" />;
      case 'campaign':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-zinc-100 font-display">Notifications</h2>
              <Badge variant="brand" size="sm">
                {filteredNotifications.filter((n) => !n.read).length} new
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllNotifications}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 p-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs">
                No notifications right now.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.actionLink && onNavigateToTab) {
                      onNavigateToTab(notif.actionLink);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    !notif.read
                      ? 'bg-zinc-800/80 border-indigo-500/30 hover:border-indigo-500/60'
                      : 'bg-zinc-950/60 border-zinc-800/60 hover:border-zinc-700 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-200 truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
            <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-400" onClick={onClose}>
              Close Panel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
