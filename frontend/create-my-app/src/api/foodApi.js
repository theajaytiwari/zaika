import axios from 'axios';
import { getApiBaseUrl } from './config';

const API_BASE_URL = getApiBaseUrl();

const normalizeReel = (item, index) => {
  const videoUrl = item?.video || item?.videoUrl || item?.mediaUrl || item?.url || '';
  const description = item?.description || item?.caption || item?.story || item?.name || 'Freshly prepared favorites from our kitchen.';

  // The backend now returns an explicit foodPartnerId field — prefer it
  const fp = item?.foodPartner;
  let restaurantName = 'Featured kitchen';
  let foodPartnerId = item?.foodPartnerId || '';

  if (fp && typeof fp === 'object' && fp.restaurantName) {
    // Populated object
    restaurantName = fp.restaurantName;
    if (!foodPartnerId) foodPartnerId = fp._id?.toString?.() || fp._id || fp.id || '';
  } else if (fp && typeof fp === 'object' && (fp._id || fp.id)) {
    if (!foodPartnerId) foodPartnerId = fp._id?.toString?.() || fp.id || '';
  } else if (fp && !foodPartnerId) {
    // Raw ObjectId string
    foodPartnerId = fp.toString?.() || String(fp);
  }

  // Additional fallbacks
  if (!foodPartnerId) {
    foodPartnerId = item?.partner?._id || item?.partner?.id || (typeof item?.partner === 'string' ? item.partner : '') || '';
  }
  if (restaurantName === 'Featured kitchen') {
    restaurantName = item?.restaurantName || item?.partner?.restaurantName || 'Featured kitchen';
  }

  const dishName = item?.name || item?.dishName || item?.title || 'Chef special';

  return {
    id: item?._id || item?.id || `${index}-${restaurantName}`,
    videoUrl,
    description,
    restaurantName,
    foodPartnerId,
    dishName,
    price: item?.price ?? 0,
    likes: item?.likes ?? item?.likeCount ?? item?.stats?.likes ?? 1824,
    comments: item?.comments ?? item?.commentCount ?? item?.stats?.comments ?? 48,
    shares: item?.shares ?? item?.shareCount ?? item?.stats?.shares ?? 21,
  };
};

export async function fetchUserReels() {
  const { data } = await axios.get(`${API_BASE_URL}/api/food`, {
    withCredentials: true,
  });

  const foodItems = Array.isArray(data?.foodItems) ? data.foodItems : [];

  return foodItems.map(normalizeReel);
}

export async function fetchFoodPartnerProfile(id) {
  const { data } = await axios.get(`${API_BASE_URL}/api/food/partner/${id}`, {
    withCredentials: true,
  });
  return data.foodPartner;
}

export async function fetchMyFoodPartnerProfile() {
  const { data } = await axios.get(`${API_BASE_URL}/api/food/me`, {
    withCredentials: true,
  });
  return data.foodPartner;
}

export async function createFoodItem(formData) {
  const { data } = await axios.post(`${API_BASE_URL}/api/food`, formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.food;
}