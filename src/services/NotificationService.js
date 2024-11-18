import axios from 'axios';

const getNotifications = async (API_URL, token, page = 1, size = 5) => {
  return axios.get(`${API_URL}/api/notifications?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const markAsRead = async (API_URL, token, id) => {
  return axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const markAllAsRead = async (API_URL, token) => {
  return axios.put(`${API_URL}/api/notifications/mark-all-read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { getNotifications, markAsRead, markAllAsRead };