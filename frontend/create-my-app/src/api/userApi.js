import axios from 'axios';
import { getApiUrl } from './config';

export async function fetchMyUserProfile() {
  const { data } = await axios.get(getApiUrl('/auth/user/me'), {
    withCredentials: true,
  });

  return data.user;
}

export async function logoutUser() {
  await axios.get(getApiUrl('/auth/user/logout'), {
    withCredentials: true,
  });
}
