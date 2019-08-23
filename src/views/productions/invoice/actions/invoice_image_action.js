import clone from 'clone';

import {
  INVOICE_RECIEVE_IMAGE_URI,
  INVOICE_SELECT_IMAGE,
  INVOICE_UPDATE_POSITION
} from '../constants/invoice_constant';

const getOcrData = records => {
  let ocr_datas = [];
  for (var key in records) {
    var element = records[key];
    ocr_datas = element.ocr_data;
  }
  return ocr_datas;
};

const getOcrItem = (ocr_datas, file_path) => {
  const ocr_item =
    ocr_datas.filter(_d => _d.file_path.includes(file_path))[0] || {};
  return ocr_item.s3_url || '';
};

const recieveImageUris = docInfo => dispatch => {
  const ocr_datas = getOcrData(docInfo[0].records) || [];
  const first_image = docInfo[0].doc_uri[0];
  const ocr_item = getOcrItem(ocr_datas, first_image);
  const images = docInfo[0].s2_url || [];
  const show_thumbnail = images.length > 1;
  return dispatch({
    type: INVOICE_RECIEVE_IMAGE_URI,
    image_selected: images[0],
    image_uris: docInfo[0].doc_uri,
    s2_images: images,
    ocr_datas: ocr_datas,
    ocr_item: ocr_item,
    show_thumbnail: show_thumbnail
  });
};

const updatePositionImage = (
  record_focused,
  section_focused,
  index_item,
  field_name
) => (dispatch, getState) => {
  const document_data = clone(
    getState().production.keying_invoice.invoice_document.document_data
  );
  const words_position = clone(
    getState().production.keying_invoice.invoice_image.words_position
  );

  const record_data = document_data[record_focused];
  const section_datas = record_data[section_focused];
  const section_item = section_datas[index_item];
  const field_value = section_item[field_name];
  let words = field_value.words || [];
  if (JSON.stringify(words) === JSON.stringify(words_position)) {
    return;
  }
  return dispatch({
    type: INVOICE_UPDATE_POSITION,
    words_position: words
  });
};

const selectImage = index_selected => (dispatch, getState) => {
  index_selected = parseInt(index_selected, 10);
  if (index_selected < 0) {
    return;
  }
  const {
    image_index,
    image_uris,
    s2_images,
    ocr_datas
  } = getState().production.keying_invoice.invoice_image;

  if (index_selected === image_index) {
    return;
  }
  let image_selected = image_uris[index_selected];
  let ocr_item = getOcrItem(ocr_datas, image_selected);
  return dispatch({
    type: INVOICE_SELECT_IMAGE,
    image_index: index_selected,
    image_selected: s2_images[index_selected],
    ocr_item: ocr_item
  });
};

export { recieveImageUris, updatePositionImage, selectImage };
