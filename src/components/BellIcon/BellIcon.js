import React from 'react';

const BellIcon = ({ unreadCount }) => (
  <div className="bell-icon">
    <i className="fas fa-bell"></i>
    <span>{unreadCount}</span>
  </div>
);

export default BellIcon;
