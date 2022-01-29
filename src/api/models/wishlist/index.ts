import { prisma } from '../../services'
import { Wishlist, WishlistItem } from '../../../types'

export default {
  getAll: async (): Promise<any> => {
    return await prisma.client.wishlist.findMany({
      include: { items: false },
    })
  },
  getBySlugUrlText: async (
    value: string,
    includeItems = false
  ): Promise<any> => {
    return await prisma.client.wishlist.findUnique({
      where: {
        slugUrlText: value,
      },
      include: { items: includeItems },
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateItem: async (itemId: number, payload: any) => {
    return await prisma.client.item.update({
      where: {
        id: itemId,
      },
      data: {
        ...payload,
      },
    })
  },
}
