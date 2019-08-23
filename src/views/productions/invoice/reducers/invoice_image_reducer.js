import {
  INVOICE_IMAGE_RESET_STATE,
  INVOICE_RECIEVE_IMAGE_URI,
  INVOICE_SELECT_IMAGE,
  INVOICE_UPDATE_POSITION
} from '../constants/invoice_constant';

import clone from 'clone';

const initialState = {
  image_selected: '',
  image_uris: [],
  s2_images: [],
  ocr_datas: [],
  ocr_item: [],
  show_thumbnail: false,
  words_position: [],
  image_index: 0
};

const invoice_image = (state = clone(initialState), action) => {
  switch (action.type) {
    case INVOICE_RECIEVE_IMAGE_URI:
      return {
        ...state,
        image_selected: action.image_selected,
        image_uris: clone(action.image_uris),
        ocr_datas: clone(action.ocr_datas),
        ocr_item: clone(action.ocr_item),
        s2_images: clone(action.s2_images),
        show_thumbnail: action.show_thumbnail
      };
    case INVOICE_UPDATE_POSITION:
      return {
        ...state,
        words_position: clone(action.words_position)
      };
    case INVOICE_SELECT_IMAGE:
      return {
        ...state,
        image_selected: action.image_selected,
        ocr_item: clone(action.ocr_item),
        image_index: action.image_index
      };
    case INVOICE_IMAGE_RESET_STATE:
      return clone(initialState);
    default:
      return state;
  }
};
export default invoice_image;
