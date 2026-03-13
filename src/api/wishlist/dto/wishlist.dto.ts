import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const WishlistItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().default(''),
  imageSrc: z.string().default(''),
  url: z.string().default(''),
  bought: z.boolean().default(false),
  wishlistId: z.string(),
})

export const WishlistSchema = z.object({
  id: z.string(),
  public: z.boolean(),
  title: z.string().min(1),
  slugUrlText: z.string().min(1),
  description: z.string().default(''),
  imageSrc: z.string().default(''),
  items: z.array(WishlistItemSchema).default([]),
})

export class WishlistDto extends createZodDto(WishlistSchema) {}

export const CreateWishlistSchema = WishlistSchema.omit({
  id: true,
  items: true,
}).strict()
export class CreateWishlistDto extends createZodDto(CreateWishlistSchema) {}

export const UpdateWishlistSchema = CreateWishlistSchema.partial().strict()
export class UpdateWishlistDto extends createZodDto(UpdateWishlistSchema) {}

export const CreateWishlistItemSchema = WishlistItemSchema.omit({
  id: true,
  wishlistId: true,
  bought: true,
})
  .extend({
    bought: z.boolean().default(false),
  })
  .strict()
export class CreateWishlistItemDto extends createZodDto(
  CreateWishlistItemSchema
) {}

export const UpdateWishlistItemSchema = WishlistItemSchema.omit({
  id: true,
  wishlistId: true,
})
  .partial()
  .strict()
export class UpdateWishlistItemDto extends createZodDto(
  UpdateWishlistItemSchema
) {}
