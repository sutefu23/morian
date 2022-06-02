import { User } from "@domain/entity/user"
import { IUserRepository } from "@domain/repository/interface"
import bcrypt from 'bcrypt'
import { DEFAULT_USER_PASS , API_SALT} from 'envValues'

export class UserService{
  private userRepository: IUserRepository
  constructor(userRepo: IUserRepository){
    this.userRepository = userRepo
  }
  async createUser(user: User){
    const data = (async () => {
      if(user.pass && user.pass?.length > 0 ){
        return await this.userRepository.create({...user,pass: bcrypt.hashSync(user.pass, API_SALT) })
      }else{
        return await this.userRepository.create(user)
      }
    })()    
    if(data instanceof Error){
      return data
    }
    return data
  }

  async updateUser(id: number, user: Partial<User>){
    const data = (async () => {
      if(user.pass && user.pass?.length > 0 ){
        return await this.userRepository.update(id, {...user,pass: bcrypt.hashSync(user.pass, API_SALT) })
      }else{
        return await this.userRepository.update(id, user)
      }
    })()
    if(data instanceof Error){
      return data
    }
    return data
  }

  async getUserList(enable?:boolean){
    const data = await this.userRepository.findAll(enable)
    if(data instanceof Error){
      return data
    }
    return data
  }

  async getUserById(id: number){
    return await this.userRepository.findById(id)
  }
}