
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                                API BASE URL                                */
/* -------------------------------------------------------------------------- */

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -------------------------------------------------------------------------- */
/*                              AXIOS INSTANCE                                */
/* -------------------------------------------------------------------------- */

const apik = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*                         RESPONSE INTERCEPTOR                               */
/* -------------------------------------------------------------------------- */

apik.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - possibly expired session");
    }

    return Promise.reject(error);
  }
);

export default apik;
