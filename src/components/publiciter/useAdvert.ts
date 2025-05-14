import { useState } from "react";

const useAdvert = (initialMessage) => {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState(initialMessage);

  const closeAdvert = () => {
    setIsVisible(false);
  };

  const updateMessage = (newMessage) => {
    setMessage(newMessage);
    setIsVisible(true);
  };

  return { isVisible, message, closeAdvert, updateMessage };
};

export default useAdvert;
