export type Methods = {
  post: {
    reqBody: {
      id: number
      pass: string
    }
    resBody: {
      token: string
    }
  }
}
