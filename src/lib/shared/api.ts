import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { redirect } from "next/navigation";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  httpsAgent: agent,
});

axiosInstance.interceptors.request.use(async (config) => {
  // const session = await getSessionBasedOnContext();
  // console.log("Token--------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",session?.accessToken)
  // if (session?.accessToken) {
  //   config.headers.Authorization = `Bearer ${session.accessToken}`;
  // }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // const session = await getSessionBasedOnContext();
      // if (!session?.refreshToken) {
      //   //   redirect(generateKeycloakLoginUrl());
      //   return;
      // }

      try {
        //   const newTokens = await handleTokenRefresh(session.refreshToken);
        //   await signIn("keycloak", {
        //     accessToken: newTokens.accessToken,
        //     refreshToken: newTokens.refreshToken,
        //     redirect: false,
        //     callbackUrl: window.location.href,
        //   });

        //   if (originalRequest.headers) {
        //     originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        //   }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Erreur de rafraîchissement :", refreshError);
        redirect("/auth/logout");
      }
    }

    return Promise.reject(error);
  }
);

export const api = () => {
  return axiosInstance;
};
