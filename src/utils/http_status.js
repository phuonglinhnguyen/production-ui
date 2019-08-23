import * as constant from "../constants/index";

const http_status = response => {
  switch (response.status) {
    case 200:
      return constant.HTTP_STATUS_OK;
    case 201:
      return constant.HTTP_STATUS_CREATED;
    case 204:
      return constant.HTTP_STATUS_NO_CONTENT;
    case 400: {
      if (response.data && response.data.Error) {
        return response.data.Error;
      }
      return constant.HTTP_STATUS_BAD_REQUEST;
    }
    case 404:
      return constant.HTTP_STATUS_NOT_FOUND;
    case 405:
      return constant.HTTP_STATUS_METHOD_NOT_ALLOWED;
    case 409:
      return constant.HTTP_STATUS_CONFLICT;
    case -1:
      return constant.HTTP_STATUS_REASON_ONLY;
    default:
      return response.statusText || "";
  }
};

export default http_status;
