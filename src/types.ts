import { Prisma } from '@prisma/client'

export { Prisma }

export interface WishlistItem {
  id?: number
  title: string
  url: string
  imageSrc: string
  description: string
  bought: boolean
  wishlistId?: string
}
export interface Wishlist {
  id?: string
  public: boolean
  title: string
  description: string
  imageSrc: string
  slugUrlText: string
  items?: WishlistItem[]
}

export type WishlistCreateInput = Prisma.WishlistCreateInput
export type WishlistUpdateInput = Prisma.WishlistUpdateInput
export interface TileProp {
  title: string
  imageSrc: string
}
