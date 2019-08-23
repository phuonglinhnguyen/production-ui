import * as types from './actions';

import http_status from '../../../utils/http_status';

export const handleResponse = response => {
  // if (!response.ok) {
  //   throw http_status(response);
  // }
  // return response.json();
};

export const handleResponseList = response => {
  // if (!response.ok) {
  //   throw http_status(response);
  // }
  // return response.json();
};

export const handleExtractData = response => {
 
  if (response) return response.data;
};

export const sendHttpRequest = () => ({
  type: types.COMMON_SEND_HTTP_REQUEST
});

export const receiveHttpResponse = () => ({
  type: types.COMMON_RECEIVE_HTTP_RESPONSE
});

export const checkProcessing = state =>
  state.common.common_processing.is_processing;

export const openRequestSnackbar = status_text => ({
  type: types.COMMON_REQUEST_OPEN_SNACKBAR,
  status_text: status_text + '' || ''
});

export const openRespondSnackbar = (
  status_text,
  is_error,
  common_name,
  reason = '',
  is_redirect = true
) => ({
  type: types.COMMON_RESPOND_OPEN_SNACKBAR,
  status_text: status_text + '' || '',
  common_name: common_name || '',
  is_error: is_error || false,
  reason: reason,
  is_redirect: is_redirect
});

export const closeSnackbar = () => ({
  type: types.COMMON_CLOSE_SNACKBAR
});

export const handleError = (
  error,
  common_name,
  is_error = false,
  is_redirect = false
) => (dispatch: any, getState: any) => {
  const response = error.response || { status: -1 };
  if (
    response.status &&
    (response.status !== 404 ||
      response.status !== 409 ||
      response.status !== -1)
  ) {
    is_redirect = true;
  }
  dispatch(
    openRespondSnackbar(
      http_status(response),
      is_error,
      common_name,
      !response.data ? error : response.data.Error || response.data.message,
      is_redirect
    )
  );
};
