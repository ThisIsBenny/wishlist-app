export interface WishlistItem {
  id: string
  title: string
  url: string
  imageSrc: string
  description: string
  comment: string
  bought: boolean
  wishlistId: boolean
}
export interface Wishlist {
  id?: string
  title: string
  description: string
  imageSrc: string
  slugUrlText: string
  items: WishlistItem[]
}
export interface TileProp {
  title: string
  imageSrc: string
}
