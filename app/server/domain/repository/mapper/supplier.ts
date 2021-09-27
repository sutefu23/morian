import { Supplier as EntitySupplier, furiganaType, zipType, telType, PrefectureType } from "@domain/entity/stock";
import { FieldNotFoundError, ValidationError } from "@domain/type/error";
import { Supplier as PrismaSupplier } from "$prisma/client"

export const dbModelToEntity = (model: PrismaSupplier): EntitySupplier|FieldNotFoundError|ValidationError => {

  const furigana = furiganaType.getInstance(model.furigana)
  if(furigana instanceof Error){
    throw furigana
  }
  
  if(!model.zip){
    throw new FieldNotFoundError("zipが見つかりません")
  }

  const zip = zipType.getInstance(model.zip)
  if(zip instanceof Error){
    throw zip
  }

  if(!model.prefecture){
    throw new FieldNotFoundError("prefectureが見つかりません")
  }

  const prefecture = PrefectureType.getInstance(model.prefecture)
  if(prefecture instanceof Error){
    throw prefecture
  }

  if(!model.address){
    throw new FieldNotFoundError("addressが見つかりません")
  }

  if(!model.tel){
    throw new FieldNotFoundError("telが見つかりません")
  }

  const tel = telType.getInstance(model.tel)
  if(tel instanceof Error){
    throw tel
  }
  
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
    address: model.address,
    tel: tel,
    fax
  }
  return supplier
}
