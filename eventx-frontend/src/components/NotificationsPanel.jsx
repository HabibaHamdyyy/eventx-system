import React from "react";

const NotificationsPanel = ({ notifications = [] }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
      <ul className="mt-2 space-y-2">
        {notifications.length === 0 && (
          <li className="text-gray-600">You're all caught up.</li>
        )}
        {notifications.map((n, idx) => (
          <li key={idx} className="text-gray-800">
            {n.message || String(n)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;


