import axios from "axios";
import decode from "jwt-decode";
import getNameStatus from "./http_status";
import { userLogout } from '@dgtx/coreui'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  API_ENDPOINT
} from "../constants";
export function setToken(access_token, refresh_token, dispatch) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

  configAxios(access_token, dispatch);
}

export function configAxios(access_token, dispatch) {
  axios.defaults.baseURL = API_ENDPOINT;
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

  // Add a request interceptor
  axios.interceptors.request.use(
    c => {
      if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() !== "development") {
        if (c.baseURL.includes('s2')) {
          delete c.headers.common.Authorization;
        }
      }

      return c;
    },
    error => {
      return Promise.reject(error);
    }
  );
  let error_unauthorized = [{ "message": "jwt expired", "code": 401, data: 'Unauthorized' },
  { "message": "jwt malformed", "code": 400, data: 'Bad Request' },
  { "message": "jwt signature is required", "code": 422, data: 'Unprocessable Entity' },
  { "message": "invalid signature", "code": 400, data: 'Bad Request' },
  { "message": "jwt audience invalid", "code": 400, data: 'Bad Request' },
  { "message": "jwt issuer invalid", "code": 400, data: 'Bad Request' },
  { "message": "jwt id invalid", "code": 400, data: 'Bad Request' },
  { "message": "jwt subject invalid", "code": 400, data: 'Bad Request' }
  ];
  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      if (error.response) {
        /**@description check Unauthorized  */
        let { data, status } = error.response;
        let er_au = error_unauthorized.filter(item => { return item.message === data && item.code === status })
        if (er_au.length > 0) {
          dispatch(userLogout());
        }

        return Promise.reject(new Error(getNameStatus(error.response)));
      }
      console.log(error.message);

      return Promise.resolve(error.message);
    }
  );
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  axios.defaults.headers.common["Authorization"] = "";
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

export function isTokenExpired(token) {
  if (!token || token === "undefined") {
    return true;
  }

  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

export function isAccessTokenExpired() {
  return isTokenExpired(getAccessToken());
}

export function isRefreshTokenExpired() {
  return isTokenExpired(getRefreshToken());
}

export function checkAuth(dispatch) {
  return Promise.resolve("Expired");
}
