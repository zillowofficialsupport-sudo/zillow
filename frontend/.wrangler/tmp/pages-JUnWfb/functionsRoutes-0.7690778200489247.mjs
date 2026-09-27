import { onRequestGet as __api_imagekit_auth_js_onRequestGet } from "/workspaces/Villow/frontend/functions/api/imagekit-auth.js"

export const routes = [
    {
      routePath: "/api/imagekit-auth",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_imagekit_auth_js_onRequestGet],
    },
  ]