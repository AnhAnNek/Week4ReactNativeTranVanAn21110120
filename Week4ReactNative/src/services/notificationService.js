import {get, handleResponse, post, put} from '../utils/httpRequest';

const SUFFIX_NOTIFICATION_API_URL = '/notifications';

const getNotificationsByUsername = async (username, page = 0, size = 10) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/get-by-username/${username}`;
  const response = await get(path, { params: { page, size } });
  return handleResponse(response, 200);
};

const sendNotification = async (sendNotificationRequest) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/send`;
  const response = await post(path, sendNotificationRequest);
  return handleResponse(response, 201);
};

const markNotificationAsRead = async (notificationId) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/mark-as-read/${notificationId}`;
  const response = await put(path);
  return handleResponse(response, 200);
};

const notificationService = {
  getNotificationsByUsername,
  sendNotification,
  markNotificationAsRead,
};

export default notificationService;
