// thường được sử dụng để quản lý các biến môi trường và các cấu hình môi trường khác nhau.
// Những biến này bao gồm các giá trị như thông tin kết nối cơ sở dữ liệu, cổng máy chủ, khóa API, và các thiết
// lập khác mà bạn không muốn lưu trữ trực tiếp trong mã nguồn để bảo mật và dễ dàng quản lý.

import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,
  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,
  AUTHOR: process.env.AUTHOR,
  BUILD_MODE: process.env.BUILD_MODE,
};
