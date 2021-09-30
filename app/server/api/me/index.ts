import { User } from "$/domain/entity/user";
import { AuthHeader } from "$/types";
export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: User|Error
  }
}
