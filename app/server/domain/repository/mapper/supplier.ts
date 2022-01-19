import { Supplier as EntitySupplier, furiganaType, zipType, telType, PrefectureType } from "@domain/entity/stock";
import { FieldNotFoundError, ValidationError } from "@domain/type/error";
import { Supplier as PrismaSupplier } from "$prisma/client"

export const dbModelToEntity = (model: PrismaSupplier): EntitySupplier|FieldNotFoundError|ValidationError => {

  const furigana = furiganaType.getInstance(model.furigana)
  if(furigana instanceof Error){
    throw furigana
  }

  const address = model.address ? model.address : undefined

  const zip = ((data:string|null) => {
    if(data){
      const zip = zipType.getInstance(data)
      if(zip instanceof Error){
        throw zip
      }  
      return zip
    }
  })(model.zip)


  const prefecture = ((data:string|null) => {
    if(data){
      const prefecture = PrefectureType.getInstance(data)
      if(prefecture instanceof Error){
        throw prefecture
      }  
      return prefecture
    }
  })(model.prefecture)

  const tel = ((dataTel:string|null) => {
    if(dataTel){
      const tel = telType.getInstance(dataTel)
      if(tel instanceof Error){
        throw tel
      }  
      return tel
    }
  })(model.tel)

  const fax = ((modelFax:string|null) => {
    if(modelFax){
      const fax = telType.getInstance(modelFax)
      if(fax instanceof Error){
        throw fax
      }  
      return fax
    }
  })(model.fax)

  const supplier = {
    ...model,
    furigana,
    zip,
    prefecture,
    address,
    tel,
    fax
  }
  return supplier
}
