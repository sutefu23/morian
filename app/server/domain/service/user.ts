import { User } from "@domain/entity/user"
import { UserRepository } from "@domain/repository/interface"

export class UserService{
  private userRepository: UserRepository
  constructor(userRepo: UserRepository){
    this.userRepository = userRepo
  }
  async createUser(user: User){
    const data = await this.userRepository.create(user)
    if(data instanceof Error){
      return data
    }
  }

  async updateUser(id: number, user: Partial<User>){
    const data = await this.userRepository.update(id, user)
    if(data instanceof Error){
      return data
    }
  }

  async getUserById(id: number){
    return await this.userRepository.findById(id)
  }
}