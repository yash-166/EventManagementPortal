// import React from 'react';
// import { IoIosNotifications } from "react-icons/io";

// const NotificationPanel = () => {
//   const notificationCount = 5; // Hardcoded notification count

//   return (
//     <div
//       className="relative flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-md cursor-pointer hover:bg-gray-200 
//                  w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
//       style={{ padding: "2px" }}
//       aria-label="Notifications"
//     >
//       <IoIosNotifications className="text-gray-600 text-xl sm:text-2xl lg:text-3xl" />
//       {notificationCount > 0 && (
//         <span
//           className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 rounded-full bg-blue-500 text-white 
//                      text-xs sm:text-sm lg:text-base font-bold"
//           aria-label={`${notificationCount} new notifications`}
//         >
//           {notificationCount}
//         </span>
//       )}
//     </div>
//   );
// };

// export default NotificationPanel;





import { useState } from 'react';
import { IoIosNotifications } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle notification bar
  const notifications = [
    { id: 1, message: "New message from Alice" },
    { id: 2, message: "Your order has been shipped" },
    { id: 3, message: "Reminder: Meeting at 3 PM" },
    { id: 4, message: "Your password was changed" },
    { id: 5, message: "New comment on your post" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Notification Icon */}
      <div
        className="relative flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-md cursor-pointer hover:bg-gray-200 
                   w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
        style={{ padding: "2px" }}
        onClick={handleToggle}
        aria-label="Notifications"
      >
        <IoIosNotifications className="text-gray-600 text-xl sm:text-2xl lg:text-3xl" />
        {notifications.length > 0 && (
          <span
            className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 rounded-full bg-blue-500 text-white 
                       text-xs sm:text-sm lg:text-base font-bold"
            aria-label={`${notifications.length} new notifications`}
          >
            {notifications.length}
          </span>
        )}
      </div>

      {/* Notification Bar */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">Notifications</h3>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={handleClose}
              aria-label="Close Notifications"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
