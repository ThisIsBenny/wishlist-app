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
          title: 'Mr Maria Lion "First Light" Lampe',
          url: 'https://babykochs.de/mr-maria-lion-first-light-lampe/',
          imageSrc:
            'https://babykochs.de/wp-content/uploads/2021/01/First-Light-Lion1.jpg',
          description:
            'Lion ist Teil der Serie "First Light - Miffy und Freunde" Kollektion, eine Nachtlampe, die als "kleiner Freund für ein kleines Wunder" entworfen wurde.',
          comment: '',
        },
        {
          title: 'Liewood Nachtlicht Winston Bär dove blue',
          url: 'https://babykochs.de/liewood-nachtlicht-baer/',
          imageSrc:
            'https://babykochs.de/wp-content/uploads/2021/01/Liewood-Nachtlicht-Winston-bear-dove-blue.jpg',
          description:
            'Mit dem Licht dieses süßen Bären fühlen sich Eure Kleinen in der Nacht ganz sicher und haben’s schön gemütlich.',
          comment: '',
        },
        {
          title: 'Baby- und Kleinkindbett',
          url: 'https://www.tchibo.de/baby-und-kleinkindbett-p400114225.html#modal-productimagegallery-modalGalleryImage-400886394',
          imageSrc:
            'https://www.tchibo.de/newmedia/art_img/MAIN-IMPORTED/f045f71ebabea9e4/baby-und-kleinkindbett.jpg',
          description:
            'Ein Bett, das mitwächst Zu einem erholsamen Schlaf und einer schönen Nacht gehört natürlich auch ein gutes Bett – das gilt auch für die Kleinsten.',
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
