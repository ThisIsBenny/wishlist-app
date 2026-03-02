import { prisma } from '../../services'
import {
  Wishlist,
  WishlistItem,
  WishlistCreateInput,
  WishlistUpdateInput,
} from '@/types'

interface WishlistWhereInput {
  public?: boolean
}

export default {
  getAll: async (where?: WishlistWhereInput): Promise<Wishlist[]> => {
    return (await prisma.client.wishlist.findMany({
      where,
      include: { items: false },
    })) as Wishlist[]
  },
  getBySlugUrlText: async (value: string, includeItems = false) => {
    return await prisma.client.wishlist.findUnique({
      where: {
        slugUrlText: value,
      },
      include: { items: includeItems },
    })
  },
  create: async (payload: WishlistCreateInput) => {
    return await prisma.client.wishlist.create({
      data: payload,
    })
  },
  update: async (id: string, payload: WishlistUpdateInput) => {
    return await prisma.client.wishlist.update({
      where: {
        id: id,
      },
      data: payload,
    })
  },
  delete: async (id: string) => {
    return await prisma.client.wishlist.delete({
      where: {
        id: id,
      },
    })
  },
  createItem: async (wishlistId: string, payload: WishlistItem) => {
    const wishlist = await prisma.client.wishlist.update({
      where: {
        id: wishlistId,
      },
      data: {
        items: {
          create: {
            ...payload,
          },
        },
      },
      include: { items: true },
    })
    return wishlist.items.pop()
  },
  updateItem: async (itemId: number, payload: WishlistItem) => {
    return await prisma.client.item.update({
      where: {
        id: itemId,
      },
      data: {
        ...payload,
      },
    })
  },
  deleteItem: async (itemId: number) => {
    return await prisma.client.item.delete({
      where: {
        id: itemId,
      },
    })
  },
}
