import { UserService } from "../service/user"
import bcrypt from 'bcrypt'
import { API_SALT } from '$/service/envValues'
import { UserRepository } from "../repository/interface"

export class AuthService{
  private userRepository: UserRepository
  private userService: UserService
  
  constructor(userRepo: UserRepository){
    this.userRepository = userRepo
  }
  
  public static login(id: number, pass: string){

  }
  public static encrypt(pass: string): string{
    return bcrypt.hashSync(pass, API_SALT)
  }
}