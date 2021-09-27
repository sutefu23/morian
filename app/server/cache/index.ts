import { createClient, RedisClient } from 'redis'
import path from 'path'
import { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_POST} from '../envValues'
import bcrypt from 'bcrypt'
import { API_SALT } from 'envValues'

enum SCOPE{
    FILE,
    DIR,
    GROBAL
}

enum TYPE{
    USER_SESSION = "user_session",
    REPOSITORY = "repository",
}

type AnyObject<T> = {
    [K in keyof T]: T[K]
}

class Client{
    private client:RedisClient
    constructor(){
        this.client = createClient(Number(REDIS_POST), REDIS_HOST )
        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }
    async get<T>(key:string, type: TYPE, scope:SCOPE = SCOPE.FILE):Promise<string | AnyObject<T> | T[] | null | Error>{
        const caller = path.basename((new Error().stack??"").split('at ')[2].trim()).split(':')[0];
        const generatedKey = this.getKeyFromScope(key, caller, scope)

        const encodeValue = await new Promise<string|null|Error>((resolve, reject) => {
            this.client.get(generatedKey, (err, reply) => {
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
        return JSON.parse(encodeValue.replace(type,''))
    }

    set<T>(key:string, value: string|number|AnyObject<T>|Array<T>, type: TYPE, expire = null, scope:SCOPE = SCOPE.FILE){
        const caller = path.basename((new Error().stack??"").split('at ')[2].trim()).split(':')[0];
        const generatedKey = this.getKeyFromScope(key, caller, scope)
        const encodeValue = (() => {
            if(type == TYPE.USER_SESSION){
                return bcrypt.hashSync(JSON.stringify(value), API_SALT)
            }else{
                return JSON.stringify(value)
            }
        })()

        if(expire){
            return this.client.set(generatedKey, type + JSON.stringify(encodeValue), 'EX', expire)
        }else{
            return this.client.set(generatedKey, type + JSON.stringify(encodeValue))
        }
    }
    private getKeyFromScope(original_key: string, caller_stack: string, scope:SCOPE){
        switch (scope) {
            case SCOPE.FILE:{
                const file = (caller_stack).split("(")[1].replace("file:///","").replace('/','_')
                return original_key + file
            }
            case SCOPE.DIR:{
                const dirname = path.dirname(caller_stack).split("(")[1].replace("file:///","").replace('/','_')
                return original_key + dirname
            }
            case SCOPE.GROBAL:
                return original_key  
        }
    }
}
export const client = new Client()