import bcrypt from 'bcrypt'
import { API_SALT } from '$/envValues'
import { IUserRepository } from '../repository/interface'
import { AuthHeader } from '$/types'
import { User } from '../entity/user'

export class AuthService {
  private userRepository: IUserRepository
  private static _instance: AuthService
  private static _user: User | null

  private constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public static getInstance(userRepository: IUserRepository): AuthService {
    if (!this._instance) {
      this._instance = new AuthService(userRepository)
    }

    return this._instance
  }

  public async isValidUser(id: number, pass: string) {
    const user = await this.userRepository.findById(id)
    if (user instanceof Error) {
      return user as Error
    }
    return user.pass == AuthService.encrypt(pass)
  }

  public async getUserFromToken(
    token: string,
    jwtDecodeFunc: (token: string) => { payload: { id: string } } | null
  ) {
    const decodedToken = jwtDecodeFunc(token)
    AuthService._user = await (async () => {
      if (decodedToken) {
        const me = await this.userRepository.findById(
          Number(decodedToken.payload.id)
        )
        if (me instanceof Error) {
          throw new Error(me.message)
        } else {
          return me
        }
      } else {
        return null
      }
    })()
    return AuthService._user
  }

  public static encrypt(pass: string): string {
    return bcrypt.hashSync(pass, API_SALT)
  }
  public static user(): User | null {
    return AuthService._user
  }
}
