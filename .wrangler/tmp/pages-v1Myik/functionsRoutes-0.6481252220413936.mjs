import { onRequestOptions as __api_email_capture_js_onRequestOptions } from "F:\\projects\\trinity-home-care-site\\functions\\api\\email-capture.js"
import { onRequestPost as __api_email_capture_js_onRequestPost } from "F:\\projects\\trinity-home-care-site\\functions\\api\\email-capture.js"
import { onRequest as __api_email_capture_js_onRequest } from "F:\\projects\\trinity-home-care-site\\functions\\api\\email-capture.js"

export const routes = [
    {
      routePath: "/api/email-capture",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_email_capture_js_onRequestOptions],
    },
  {
      routePath: "/api/email-capture",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_email_capture_js_onRequestPost],
    },
  {
      routePath: "/api/email-capture",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_email_capture_js_onRequest],
    },
  ]