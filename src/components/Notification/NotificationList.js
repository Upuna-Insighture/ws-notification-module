import React, { useEffect, useState, useCallback } from 'react';
import './Notification.css';
import { formatDistanceToNow } from 'date-fns';
import NotificationService from '../../services/NotificationService';
import useNotificationSocket from '../../hooks/useNotificationSocket';

const NotificationList = ({ API_URL, token }) => {

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const pageSize = 5;

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await NotificationService.getNotifications(API_URL, token, currentPage, pageSize);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setTotalNotifications(data.totalNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [API_URL, token, currentPage, pageSize]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useNotificationSocket(API_URL, token, (newNotification) => {
    // setNotifications((prev) => [newNotification, ...prev].slice(0, pageSize));
    // setUnreadCount((prev) => prev + 1);
    fetchNotifications();
  });

  const [error, setError] = useState(null);
  const totalPages = Math.ceil(totalNotifications / pageSize);

  const markAsRead = async (id) => {
    await NotificationService.markAsRead(API_URL, token, id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, status: 'read' } : n))
    );
    setUnreadCount((prev) => prev - 1);
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead(API_URL, token);
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
    setUnreadCount(0);
  };

    const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (notifications.length === 0) return <p>No notifications available.</p>;

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>
          Notifications <span className="notification-count">{totalNotifications}</span>
        </h2>
        <span className="mark-all-link" onClick={handleMarkAllAsRead}>Mark All as Read</span>
      </div>

      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={`notification-item ${notification.status === 'unread' ? 'unread' : 'read'}`}
          onClick={() => markAsRead(notification._id)}
        >
          {notification.status === 'unread' && <span className="unread-dot" />}
          <div className="notification-content">
            <div className="notification-title-section">
              <p className="notification-title"><strong>{notification.title}</strong></p>
              <span className="notification-time">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="notification-message">{notification.message}</p>
          </div>
        </div>
      ))}

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default NotificationList;