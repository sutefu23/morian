import { ISupplierRepository } from '@domain/repository/interface'
import { SupplierDTO, SupplierToDTO, DTOtoSupplier } from '../dto/supplier'

export class SupplierService {
  private supplierRepository: ISupplierRepository
  constructor(supplierRepo: ISupplierRepository) {
    this.supplierRepository = supplierRepo
  }
  async createSupplier(supplierData: SupplierDTO) {
    const supplier = DTOtoSupplier(supplierData)
    const data = await this.supplierRepository.create(supplier)
    if (data instanceof Error) {
      return data
    }
    return SupplierToDTO(data)
  }

  async updateSupplier(id: number, supplierData: Partial<SupplierDTO>) {
    const { name, furigana, enable } = supplierData
    if (!supplierData)
      return new Error('アップデートするデータが存在しません。')
    if (!name) return new Error('名称は必須です。')
    if (!furigana) return new Error('フリガナは必須です。')
    if (!enable) return new Error('使用可否は必須です。')
    const supplier = DTOtoSupplier({
      ...supplierData,
      ...{ id, name, furigana, enable }
    })
    const data = await this.supplierRepository.update(id, supplier)
    if (data instanceof Error) {
      return data
    }
    return SupplierToDTO(data)
  }
  async findSupplierById(id: number) {
    const data = await this.supplierRepository.findById(id)
    if (data instanceof Error) {
      return data as Error
    }
    if (!data.enable) {
      return null
    }
    return SupplierToDTO(data)
  }
  async filterSuppliers(name: string) {
    const data = await this.supplierRepository.filterName(name)
    if (data instanceof Error) {
      return data as Error
    }
    return data.map((d) => SupplierToDTO(d))
  }
  async getSupplierList(enable?: boolean) {
    const data = await this.supplierRepository.findAll(enable)
    if (data instanceof Error) {
      return data as Error
    }
    return data.map((d) => SupplierToDTO(d))
  }
}
