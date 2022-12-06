import {
  furiganaType,
  PrefectureType,
  Supplier,
  telType,
  zipType
} from '@domain/entity/stock'

export type SupplierDTO = {
  readonly id: number
  readonly name: string
  readonly furigana: string
  readonly zip?: string | null | undefined
  readonly prefecture?: string | null | undefined
  readonly address?: string | null | undefined
  readonly tel?: string | null | undefined
  readonly fax?: string | null | undefined
  readonly enable: boolean
}

export const SupplierToDTO = (supplier: Supplier): SupplierDTO => {
  return {
    id: supplier.id,
    name: supplier.name,
    furigana: supplier.furigana.value,
    zip: supplier.zip ? supplier.zip.value : null,
    prefecture: supplier.prefecture ? supplier.prefecture.value : null,
    address: supplier.address ? supplier.address : null,
    tel: supplier.tel ? supplier.tel.value : null,
    fax: supplier.fax ? supplier.fax.value : null,
    enable: supplier.enable
  }
}

export const DTOtoSupplier = (data: SupplierDTO): Supplier => {
  const furigana = furiganaType.getInstance(data.furigana)
  if (furigana instanceof Error) {
    throw furigana
  }

  const address = data.address ? data.address : undefined

  const zip = ((data: string | null | undefined) => {
    if (data) {
      const zip = zipType.getInstance(data)
      if (zip instanceof Error) {
        throw zip
      }
      return zip
    }
  })(data.zip)

  const prefecture = ((data: string | null | undefined) => {
    if (data) {
      const prefecture = PrefectureType.getInstance(data)
      if (prefecture instanceof Error) {
        throw prefecture
      }
      return prefecture
    }
  })(data.prefecture)

  const tel = ((dataTel: string | null | undefined) => {
    if (dataTel) {
      const tel = telType.getInstance(dataTel)
      if (tel instanceof Error) {
        throw tel
      }
      return tel
    }
  })(data.tel)

  const fax = ((dataFax: string | null | undefined) => {
    if (dataFax) {
      const fax = telType.getInstance(dataFax)
      if (fax instanceof Error) {
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
    address,
    tel,
    fax
  }

  return supplier
}
