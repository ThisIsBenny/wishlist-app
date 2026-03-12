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

export type WishlistCreateInput = Omit<Wishlist, 'items'> & {
  id?: string
}
export type WishlistUpdateInput = Partial<WishlistCreateInput>
export interface TileProp {
  title: string
  imageSrc: string
}
