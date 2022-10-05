import { AuthLoginConfig } from "./auth_login_config";

export interface AuthLogin {
  token: string;
  lang: string;
  config: AuthLoginConfig;
}
