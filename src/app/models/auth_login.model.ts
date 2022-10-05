import { AuthLoginConfig } from "./auth_login_config.model";

export interface AuthLogin {
  token: string;
  lang: string;
  config: AuthLoginConfig;
}
