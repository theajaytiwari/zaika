import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export async function fetchMyUserProfile() {
  const { data } = await axios.get(`${API_BASE_URL}/api/auth/user/me`, {
    withCredentials: true,
  });

  return data.user;
}

export async function logoutUser() {
  await axios.get(`${API_BASE_URL}/api/auth/user/logout`, {
    withCredentials: true,
  });
}
