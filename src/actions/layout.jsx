import { UAC_ENDPOINT } from '../constants'
import { CHANGE_THEME, LAYOUT_CHANGE_VALUE_ITEM } from '../constants/actionTypes'
import { ACTION_NOTIFICATION_HIDE } from '../middlewares/announcement';

export const changeTheme = (name) => ({
  type: CHANGE_THEME,
  payload: name
})
export const changeTitle = (title, subTitle) => ({
  type: LAYOUT_CHANGE_VALUE_ITEM,
  payload: {
    title,
    subTitle
  }
})

export const closeAnnnouncement = () => ({
  type: ACTION_NOTIFICATION_HIDE
})

