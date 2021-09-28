import { createClient, RedisClient } from 'redis'
import { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_POST} from '$/envValues'
import bcrypt from 'bcrypt'
import { API_SALT } from '$/envValues'

export enum CACHE_TYPE{
    USER_SESSION = "user_session",
    PLANE = "plane",
}

class Client{
    private client:RedisClient
    constructor(){
        this.client = createClient(Number(REDIS_POST), REDIS_HOST )
        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }
    async get<T>(key:string):Promise<T | null | Error>{
        const encodeValue = await new Promise<string|null|Error>((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if(err){
                    reject(err)
                }
                resolve(reply)
            })
        })
        if(encodeValue instanceof Error){
            return new Error
        }
        if(encodeValue == null){
            return null
        }
        return JSON.parse(encodeValue)
    }

    set<T>(key:string, value: T, expire = undefined){
        const encodeValue = JSON.stringify(value)
        
        if(expire){
            return this.client.set(key, encodeValue, 'EX', expire)
        }else{
            return this.client.set(key, encodeValue)
        }
    }
    async del(key:string):Promise<boolean | Error>{

        const encodeValue = await new Promise<string|null|Error>((resolve, reject) => {
            this.client.del(key, (err, reply) => {
                if(err){
                    reject(err)
                }
                resolve(String(reply))
            })
        })
        if(encodeValue instanceof Error){
            return new Error
        }

        return encodeValue === "1"
    }

}
export default new Client()