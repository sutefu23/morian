export const validLength = (length: number|string|undefined) => {
    if(length === undefined) return length
    if(Number.isInteger(Number(length))){
      return String(length)
    }else{
      if(length!=="長尺"){
        throw new Error("文字は「長尺」という文字列以外許容していません。")
      }
    }
}