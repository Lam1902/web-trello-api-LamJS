// thường được sử dụng để quản lý các biến môi trường và các cấu hình môi trường khác nhau.
// Những biến này bao gồm các giá trị như thông tin kết nối cơ sở dữ liệu, cổng máy chủ, khóa API, và các thiết
// lập khác mà bạn không muốn lưu trữ trực tiếp trong mã nguồn để bảo mật và dễ dàng quản lý.

import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  AUTHOR: process.env.AUTHOR,
};
