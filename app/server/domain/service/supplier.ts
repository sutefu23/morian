
import { Supplier } from "@domain/entity/stock"
import { SupplierRepository } from "@domain/repository/interface"

export class SupplierService{
  private supplierRepository: SupplierRepository
  constructor(supplierRepo: SupplierRepository){
    this.supplierRepository = supplierRepo
  }
  async createSupplier(supplier: Supplier){
    return await this.supplierRepository.create(supplier)
  }

  async updateSupplier(id: number, supplier: Partial<Supplier>){
    return await this.supplierRepository.update(id, supplier)
  }
  async findSupplierById(id:number){
    const data = await this.supplierRepository.findById(id)
    if(data instanceof Error){
      return data as Error
    }
    if (!data.enable){
      return null
    }
    return await this.supplierRepository.findById(id)
  }
  async getSupplierList(){
    const data = await this.supplierRepository.findAll()
    if(data instanceof Error){
      return data as Error
    }
    return data.filter(d => d.enable)
  }
}