import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const useNotificationSocket = (apiUrl, token, onNotification) => {
  useEffect(() => {
    if (!token) return;

    const socket = io(apiUrl, { auth: { token } });

    socket.on('notification', (notification) => {
      const newNotification = { ...notification, status: 'unread' };
      if (typeof onNotification === 'function') {
        onNotification(newNotification);
        toast(notification.title);
      }
    });

    return () => socket.disconnect();
  }, [apiUrl, token, onNotification]);

  return null; 
};

export default useNotificationSocket;