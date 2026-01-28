// import axios from 'axios';
import Cookies from "js-cookie";

export const config = {
  //TODO: need to change this base url when deploying to production
  //baseURL: "http://localhost:4000/api/v1/",
  // DEV SERVER
  baseURL: "http://44.222.35.138/api/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
};

export function authHeader() {
  // const userInfo = localStorage.getItem('userInfo');
  const userInfo = Cookies.get("userInfo");
  const token = userInfo ? JSON.parse(userInfo).token : null;
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlNhcm9qaW5pIE1hcmlhIiwiZW1haWwiOiJqYXlha3VtYXJ0cnNAZ21haWwuY29tIiwic2Vzc2lvblRva2VuIjoiTVRFM05ETXhOak14TlRNMU16Yz0iLCJwaG9uZSI6Ijc4MjkwOTU3NzciLCJpYXQiOjE3NDMxNjMxNTMsImV4cCI6MTc0NTc1NTE1M30.wVROpIp2gGG8nfbokYAUt1jHatUCxpj4vyKo6ZdxZcg';
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
