import type { NotificationItem } from "../../features/notifications/notifications.types";

type NotificationsPanelProps = {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
};

function formatNotificationTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationsPanelProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-[1190] bg-black/20"
        onClick={onClose}
      />

      <div className="fixed right-3 top-20 z-[1200] w-[20rem] max-w-[calc(100%-1.5rem)] rounded-3xl border border-black/5 bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
              Notiser
            </p>
            <h3 className="text-lg font-semibold text-stone-900">
              Senaste händelser
            </h3>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition hover:bg-stone-200"
          >
            ✕
          </button>
        </div>

        {notifications.length > 0 ? (
          <>
            <button
              onClick={onMarkAllAsRead}
              className="mb-3 w-full rounded-2xl bg-stone-100 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
            >
              Markera alla som lästa
            </button>

            <div className="max-h-[18rem] space-y-2 overflow-y-auto pr-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl p-3 transition ${
                    notification.isRead
                      ? "bg-stone-50"
                      : "border border-stone-200 bg-white shadow-sm"
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-stone-900">
                      {notification.title}
                    </p>

                    {!notification.isRead && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Ny
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-stone-600">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-stone-400">
                    {formatNotificationTime(notification.createdAt)}
                  </p>

                  {!notification.isRead && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="mt-3 text-sm font-medium text-green-700 transition hover:text-green-800"
                    >
                      Markera som läst
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
            Inga notiser ännu.
          </div>
        )}
      </div>
    </>
  );
}