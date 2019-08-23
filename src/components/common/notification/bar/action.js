import {
    NOTIFICATION_BAR_HIDE_DIALOG,
    NOTIFICATION_BAR_SHOW_DIALOG
  } from "./constants";
  
  export const showNotificationBar = (level, title, content) => ({
    type: NOTIFICATION_BAR_SHOW_DIALOG,
    level,
    title,
    content
  });
  
  export const hideNotificationBar = () => ({
    type: NOTIFICATION_BAR_HIDE_DIALOG
  });
  