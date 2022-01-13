
import { Supplier } from "@domain/entity/stock"
import { ISupplierRepository } from "@domain/repository/interface"
import { SupplierDTO, SupplierToDTO, DTOtoSupplier } from "../dto/supplier"

export class SupplierService{
  private supplierRepository: ISupplierRepository
  constructor(supplierRepo: ISupplierRepository){
    this.supplierRepository = supplierRepo
  }
  async createSupplier(supplierData: SupplierDTO){
    const supplier = DTOtoSupplier(supplierData)
    const data = await this.supplierRepository.create(supplier)
    if(data instanceof Error){
      return data
    }
    return SupplierToDTO(data)
  }

  async updateSupplier(id: number, supplier: Partial<Supplier>){
    const data = await this.supplierRepository.update(id, supplier)
    if(data instanceof Error){
      return data
    }
    return SupplierToDTO(data)
  }
  async findSupplierById(id:number){
    const data = await this.supplierRepository.findById(id)
    if(data instanceof Error){
      return data as Error
    }
    if (!data.enable){
      return null
    }
    return SupplierToDTO(data)
  }
  async getSupplierList(){
    const data = await this.supplierRepository.findAll()
    if(data instanceof Error){
      return data as Error
    }
    return data.filter(d => d.enable)
  }
}