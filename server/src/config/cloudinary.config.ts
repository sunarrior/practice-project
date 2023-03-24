import { v2 as cloudinary } from "cloudinary";

import EnvConfig from "./env.config";

cloudinary.config({
  cloud_name: EnvConfig.CLOUD_NAME,
  api_key: EnvConfig.API_KEY,
  api_secret: EnvConfig.API_SECRET,
});

export default cloudinary;
