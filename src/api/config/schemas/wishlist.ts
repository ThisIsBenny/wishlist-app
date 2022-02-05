export const wishlistItemRequestSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'imageSrc'],
  properties: {
    title: { type: 'string' },
    url: { type: 'string' },
    imageSrc: { type: 'string' },
    description: { type: 'string' },
    comment: { type: 'string' },
    bought: { type: 'boolean' },
  },
}

export const wishlistItemResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    url: { type: 'string' },
    imageSrc: { type: 'string' },
    description: { type: 'string' },
    comment: { type: 'string' },
    bought: { type: 'boolean' },
    wishlistId: { type: 'string' },
  },
}

export const wishlistRequestSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'imageSrc', 'slugUrlText'],
  properties: {
    title: { type: 'string' },
    imageSrc: { type: 'string' },
    description: { type: 'string' },
    slugUrlText: { type: 'string' },
  },
}
export const wishlistResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    imageSrc: { type: 'string' },
    description: { type: 'string' },
    slugUrlText: { type: 'string' },
    items: {
      type: 'array',
      items: wishlistItemResponseSchema,
    },
  },
}
