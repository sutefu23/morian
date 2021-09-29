import { User } from "@domain/entity/user"
import { UserRepository } from "@domain/repository/interface"

export class UserService{
  private userRepository: UserRepository
  constructor(userRepo: UserRepository){
    this.userRepository = userRepo
  }
  async createUser(user: User){
   await this.userRepository.create(user)
  }

  async updateUser(id: number, user: Partial<User>){
    await this.userRepository.update(id, user)
  }

  async validUser(id: number, pass: string, encrypt: (arg:string, salt?:string) => string):Promise<boolean|Error>{
    const dbUser = await this.userRepository.findById(id)
    if(dbUser instanceof Error){
      return dbUser
    }
    return dbUser.enable && dbUser.pass === encrypt(pass)
  }

}