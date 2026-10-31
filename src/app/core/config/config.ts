import { environment } from "../../../environments/environment";

const domain = environment.API_URL || window.location.origin;

export const configService = {
    url_api: `${domain}/api/`,
};