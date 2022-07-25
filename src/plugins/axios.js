// axios
import axios from "axios";
import Vue from "vue";
import router from "../router";

const baseURL = process.env.VUE_APP_API_URL || "http://localhost:3000/api";

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL,
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

axiosIns.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    const accessToken =
      sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

    // eslint-disable-next-line no-param-reassign
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosIns.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalReq = error.config;

    if (status == 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userData");
      router.push({ name: "auth-login" });
    }

    return Promise.reject(error);
  }
);

Vue.prototype.$http = axiosIns;

export default axiosIns;
