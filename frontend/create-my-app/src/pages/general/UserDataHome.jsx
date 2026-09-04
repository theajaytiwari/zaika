import React, { useEffect, useState } from 'react';
import FoodReelsHome from "../../components/Foodreelshome";
import { fetchUserReels } from "../../api/foodApi";


const PLACEHOLDER_GRADIENT = "linear-gradient(165deg, #3a220a 0%, #a85d10 55%, #f2a93b 100%)";

function toFeedItem(reel) {
  return {
    id: reel.id,
    restaurant: reel.restaurantName,
    foodPartnerId: reel.foodPartnerId,
    verified: false,
    dishName: reel.dishName,
    caption: reel.description,
    price: reel.price,
    likes: reel.likes,
    comments: reel.comments,
    gradient: PLACEHOLDER_GRADIENT,
    videoUrl: reel.videoUrl,
  };
}

function UserDataHome() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetchUserReels()
      .then((reels) => setDishes(reels.map(toFeedItem)))
      .catch(() => {});
  }, []);

  return <FoodReelsHome dishes={dishes.length ? dishes : undefined} />;
}

export default UserDataHome;