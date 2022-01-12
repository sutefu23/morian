import bcrypt from 'bcrypt'
import { API_SALT } from '$/envValues'
import { IUserRepository } from "../repository/interface"

export class AuthService{
  private userRepository: IUserRepository
  
  constructor(userRepository: IUserRepository){
    this.userRepository = userRepository
  }
  public async isValidUser(id: number, pass: string){
    const user = await this.userRepository.findById(id)
    if(user instanceof Error){
      return user as Error
    }
    return user.pass == AuthService.encrypt(pass)
  }
  public static encrypt(pass: string): string{
    return bcrypt.hashSync(pass, API_SALT)
  }
}