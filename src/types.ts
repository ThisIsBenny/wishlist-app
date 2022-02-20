export interface WishlistItem {
  id?: number
  title: string
  url: string
  imageSrc: string
  description: string
  bought: boolean
  wishlistId?: boolean
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
export interface TileProp {
  title: string
  imageSrc: string
}
