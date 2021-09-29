import { furiganaType, PrefectureType, Supplier, telType, zipType } from "@domain/entity/stock";
import { FieldNotFoundError } from '../type/error';

export type SupplierDTO = {
  readonly	id	:	number
  readonly	name	:	string
  readonly	furigana	:	string
  readonly	zip	:	string|null
  readonly	prefecture	:	string|null
  readonly	address	:	string|null
  readonly	tel	:	string|null
  readonly	fax	:	string|null
  readonly	enable	:	boolean
  
}

export const SupplierToDTO = (supplier: Supplier):SupplierDTO => {
  return {
    id	:	supplier.id,
    name	:	supplier.name,
    furigana	:	supplier.furigana.value,
    zip	:	supplier.zip.value,
    prefecture	:	supplier.prefecture.value,
    address	:	supplier.address,
    tel	:	supplier.tel.value,
    fax	:	supplier.fax ? supplier.fax.value : null,
    enable	:	supplier.enable	    
  }
}

export const DTOtoSupplier = (data: SupplierDTO): Supplier => {
  const furigana = furiganaType.getInstance(data.furigana)
  if(furigana instanceof Error){
    throw furigana
  }
  
  if(!data.zip){
    throw new FieldNotFoundError("zipが見つかりません")
  }

  const zip = zipType.getInstance(data.zip)
  if(zip instanceof Error){
    throw zip
  }

  if(!data.prefecture){
    throw new FieldNotFoundError("prefectureが見つかりません")
  }

  const prefecture = PrefectureType.getInstance(data.prefecture)
  if(prefecture instanceof Error){
    throw prefecture
  }

  if(!data.address){
    throw new FieldNotFoundError("addressが見つかりません")
  }

  if(!data.tel){
    throw new FieldNotFoundError("telが見つかりません")
  }

  const tel = telType.getInstance(data.tel)
  if(tel instanceof Error){
    throw tel
  }
  
  const fax = ((dataFax:string|null) => {
    if(dataFax){
      const fax = telType.getInstance(dataFax)
      if(fax instanceof Error){
        throw fax
      }  
      return fax
    }
  })(data.fax)

  const supplier = {
    ...data,
    furigana,
    zip,
    prefecture,
    address: data.address,
    tel: tel,
    fax
  }

  return supplier
}