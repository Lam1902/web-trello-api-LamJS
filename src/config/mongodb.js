//lam1902
// 4VCvyKoUNhHzN2Ps
import { env } from "~/config/environment";
const MONGODB_URL = env.MONGODB_URI;
const DATABASE_NAME = env.DATABASE_NAME;
// const {MongoClinet, } = require('mongodb')
import { MongoClient, ServerApiVersion } from "mongodb";

// khởi tạo 1 đối tượng trelloDatabaseInstance là null vì chưa connect
let trelloDatabaseInstance = null;

//khởi tạo 1 đối tượng để connect tới mongodb
const mongoClinetInstance = new MongoClient(MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//kết nối tới DB
export const CONNECT_DB = async () => {
  //Gọi kê nối tới mongoDB atlas
  await mongoClinetInstance.connect();

  //Kết nối thành công thì lấy cục db ra và gán vào 1 biến
  trelloDatabaseInstance = mongoClinetInstance.db(DATABASE_NAME);
};

export const CLOSE_DB = async () => {
  await mongoClinetInstance.close();
};

// Gọi hàm lấy database
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error("Must connect to database");
  return trelloDatabaseInstance;
};
