import bcrypt from 'bcrypt'
import { API_SALT } from '$/envValues'
import { UserRepository } from "../repository/interface"

export class AuthService{
  private userRepository: UserRepository
  
  constructor(userRepo: UserRepository){
    this.userRepository = userRepo
  }
  public async isValidUser(id: number, pass: string){
    const user = await this.userRepository.findById(id)
    if(user instanceof Error){
      return user
    }
    return user.pass == AuthService.encrypt(pass)
  }
  public static encrypt(pass: string): string{
    return bcrypt.hashSync(pass, API_SALT)
  }
}