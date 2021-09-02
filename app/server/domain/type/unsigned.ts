export class unsigned {
  static getInstance(val: number):unsigned | never{
    if(val < 0){
      throw new Error("マイナス値に出来ません。")
    }
    return val
  }
}