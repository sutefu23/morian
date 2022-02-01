import dotenv from 'dotenv'

dotenv.config()

const HOST = process.env.HOST ?? 'localhost:3000'
const API_JWT_SECRET = process.env.API_JWT_SECRET ?? ''
const API_SERVER_PORT = +(process.env.API_SERVER_PORT ?? '8080')
const API_BASE_PATH = process.env.API_BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''
const API_UPLOAD_DIR = process.env.API_UPLOAD_DIR ?? ''
const API_SALT = process.env.API_SALT ?? ''
const DEFAULT_USER_PASS = process.env.DEFAULT_USER_PASS ?? ''
const REDIS_USERNAME = process.env.REDIS_USERNAME ?? ''
const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? ''
const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost'
const REDIS_POST = process.env.REDIS_POST ?? '6379'
const NODE_ENV = process.env.NODE_ENV ?? 'development'

export {
  HOST,
  API_JWT_SECRET,
  API_SERVER_PORT,
  API_BASE_PATH,
  API_ORIGIN,
  API_UPLOAD_DIR,
  API_SALT,
  DEFAULT_USER_PASS,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_POST,
  NODE_ENV
}
