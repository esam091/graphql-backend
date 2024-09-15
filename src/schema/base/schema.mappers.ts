export interface UserMapper {
  id: number
  username: string
  dateOfBirth: Date
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface ShopMapper {
  id: number
  name: string
  address: string
  createdAt: Date
  userId: number
}

export interface ProductMapper {
  id: number
  name: string
  description: string
  price: number
  stock: number
  createdAt: Date
  isActive: boolean
  shopId: number
}
