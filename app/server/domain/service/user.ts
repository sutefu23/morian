import { User } from "@domain/entity/user"
import { IUserRepository } from "@domain/repository/interface"

export class UserService{
  private userRepository: IUserRepository
  constructor(userRepo: IUserRepository){
    this.userRepository = userRepo
  }
  async createUser(user: User){
    const data = await this.userRepository.create(user)
    if(data instanceof Error){
      return data
    }
    return data
  }

  async updateUser(id: number, user: Partial<User>){
    const data = await this.userRepository.update(id, user)
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