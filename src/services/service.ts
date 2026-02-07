// import axios from 'axios';
import Cookies from "js-cookie";

export const config = {
  //TODO: need to change this base url when deploying to production
  // baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  baseURL: "http://44.222.35.138/api/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
};

export function authHeader() {
  // const userInfo = localStorage.getItem('userInfo');
  const userInfo = Cookies.get("userInfo");
  const token = userInfo ? JSON.parse(userInfo).token : null;

  if (token) {
    return "Bearer " + token;
  } else {
    return "";
  }
}

// const API = () => {
//   const getConfig: any = () => {
//     return api
//       ? {
//           ...config,
//           headers: {
//             ...config.headers,
//             Authorization: authHeader(),
//           },
//         }
//       : config;
//   };
//   return {
//     token: '',
//     get: (url: string, config = {}) =>
//       axios({ url, ...getConfig(), ...config }),
//     post: (url: string, data: any, config = {}) =>
//       axios({ url, method: 'POST', data, ...getConfig(), ...config }),
//     put: (url: string, data: any, config: any) =>
//       axios({ url, method: 'PUT', data, ...getConfig(), ...config }),
//     patch: (url: string, data: any, config: any) =>
//       axios({ url, method: 'PATCH', data, ...getConfig(), ...config }),
//     delete: (url: string) => axios({ url, method: 'DELETE', ...getConfig() }),
//     setToken: (token: string) => {
//       api.token = token;
//     },
//   };
// };
// const api = API();

// export default api;
