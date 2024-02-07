/* eslint-disable import/order */
import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import layoutsPlugin from "@/plugins/layouts";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
import router from "@/router";
import "@core/scss/template/index.scss";
import "@styles/styles.scss";
import axios from "axios";
import { createPinia } from "pinia";
import { createApp } from "vue";

loadFonts();

// Create vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(layoutsPlugin);

let options = {
  realm: "efe",
  url: "https://sso.efe.cl/auth",
  clientId: "web_proveedores",
};

import Keycloak from "keycloak-js";

let keycloak = new Keycloak(options);

// async function refreshToken() {
//   return await keycloak.updateToken(30);
// }

// axios.interceptors.request.use(async (config) => {
//   config.headers.Authorization = `Bearer ${keycloak.token}`;
//   return config;
// });

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response.status === 401) {
//       const tokenRefrescado = await refreshToken();
//       if (tokenRefrescado) {
//         error.config.headers.Authorization = `Bearer ${keycloak.token}`;
//         return axios.request(error.config);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

keycloak
  .init({ onLoad: "login-required" })
  .then((auth) => {
    if (!auth) {
      localStorage.clear();
      sessionStorage.clear();
      return false;
    }
    //inicio
    app.config.globalProperties.$keycloak = keycloak;

    // Autorefresh del token
    setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            // console.log("Token refreshed");
          } else {
          }
        })
        .catch(() => {
          // console.error("Failed to refresh token");
        });
    }, 60000);

    // Interceptor para manejar 401 y refrescar el token
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await keycloakInstance.updateToken(30);
            originalRequest.headers.Authorization = `Bearer ${keycloakInstance.token}`;
            return axios(originalRequest);
          } catch (e) {
            //console.log("Error al refrescar el token", e);
          }
        }
        return Promise.reject(error);
      }
    );

    // Interceptor para agregar el token en el header de cada solicitud
    axios.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = "Bearer " + keycloak.token;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    //fin
    if (keycloak.token && keycloak.idToken) {
      let payload = {
        correo_usuario: keycloak.tokenParsed.email,
        rol_usuario: keycloak.tokenParsed.realm_access
          ? keycloak.tokenParsed.realm_access.roles[0]
          : "Proveedores",
        nombre_usuario: keycloak.tokenParsed.name,
        refresh_token: keycloak.refreshToken,
      };
      localStorage.setItem("userData", JSON.stringify(payload));
      keycloak.loadUserInfo().then((userInfo) => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      });
    }
    app.mount("#app");
  })
  .catch((err) => {
    // console.log("Err", err);
  });
