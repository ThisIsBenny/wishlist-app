import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const wishlistData: Prisma.WishlistCreateInput[] = [
  {
    title: 'Junior',
    imageSrc:
      'https://unsplash.com/photos/JZ51o_-UOY8/download?force=true&w=200',
    description: '',
    slugUrlText: 'junior',
    items: {
      create: [
        {
          title: 'Goldfish 40442 | BrickHeadz',
          url: 'https://www.lego.com/en-de/product/goldfish-40442',
          imageSrc:
            'https://www.lego.com/cdn/cs/set/assets/blt1fc37afef51cfa9f/40442.jpg?fit=bounds&format=jpg&quality=80&width=1500&height=1500&dpr=1',
          description:
            'Cute goldfish and fry, build-and-display BrickHeadz™ model',
          comment: '',
        },
      ],
    },
  },
  {
    title: 'Wedding',
    imageSrc:
      'https://unsplash.com/photos/8vaQKYnawHw/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjQ0MDQ4MTIy&force=true&w=200',
    description: 'We are getting married',
    slugUrlText: 'wedding',
  },
  {
    title: '40th birthday',
    imageSrc:
      'https://unsplash.com/photos/poH6OvcEeXE/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8NHx8YmlydGhkYXl8fDB8fHx8MTY0NDA1NDEzNA&force=true&w=200',
    description: 'We are getting married',
    slugUrlText: '40th-birthday',
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of wishlistData) {
    const wishlist = await prisma.wishlist.create({
      data: u,
    })
    console.log(`Created wishlist with id: ${wishlist.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
