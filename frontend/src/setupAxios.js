// // src/setupAxios.js
// import axios from "axios";

// // 1) Base URL for ALL axios calls (relative or absolute)
// axios.defaults.baseURL = "http://localhost:8000";

// // 2) Attach token to every request on the default axios
// axios.interceptors.request.use((config) => {
//   // support both patterns: authToken or legacy user.token
//   const token =
//     localStorage.getItem("authToken") ||
//     (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 3) Optional: auto-logout on 401
// axios.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("currentUser");
//       // window.location.href = "/login"; // enable if you want auto-redirect
//     }
//     return Promise.reject(err);
//   }
// );

// // 4) IMPORTANT: patch axios.create so *any* created instance also gets interceptors
// const originalCreate = axios.create.bind(axios);
// axios.create = function patchedCreate(config = {}) {
//   const instance = originalCreate({
//     baseURL: "http://localhost:8000", // enforce same base
//     ...config,
//   });

//   instance.interceptors.request.use((cfg) => {
//     const token =
//       localStorage.getItem("authToken") ||
//       (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).token);

//     if (token) {
//       cfg.headers.Authorization = `Bearer ${token}`;
//     }
//     return cfg;
//   });

//   instance.interceptors.response.use(
//     (res) => res,
//     (err) => {
//       if (err?.response?.status === 401) {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("currentUser");
//         // window.location.href = "/login";
//       }
//       return Promise.reject(err);
//     }
//   );

//   return instance;
// };
