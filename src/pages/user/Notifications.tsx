import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

function Notifications() {
  const { notifications, markAsRead, clearAll } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button
          onClick={clearAll}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Tout marquer comme lu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4" />
            <p className="font-medium">Aucune notification</p>
            <p className="text-sm mt-2">Vous serez notifié des nouvelles activités ici</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className={`p-2 rounded-full ${
                    notification.read
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {notification.read ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;