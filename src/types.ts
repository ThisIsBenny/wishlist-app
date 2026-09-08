export interface WishlistItem {
  id?: number
  title: string
  url: string
  imageSrc: string
  description: string
  bought: boolean
  wishlistId?: string
  createdAt?: string
  updatedAt?: string
}
export interface Wishlist {
  id?: string
  userId: string
  public: boolean
  title: string
  description: string
  imageSrc: string
  slugUrlText: string
  createdAt?: string
  updatedAt?: string
  items?: WishlistItem[]
}

export type WishlistCreateInput = Omit<Wishlist, 'items' | 'userId'> & {
  id?: string
}
export type WishlistUpdateInput = Partial<WishlistCreateInput>
interface TileProp {
  title: string
  imageSrc: string
}
