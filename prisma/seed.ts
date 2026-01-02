import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const entries = [
    {
      date: '2024-01-01',
      title: 'Project Genesis',
      consequence: 'The first brick was laid in the digital void.',
      url: 'https://example.com/genesis',
    },
    {
      date: '2024-03-15',
      title: 'The Great Refactor',
      consequence: 'System complexity reduced by half through brutal simplification.',
      url: null,
    },
    {
      date: '2024-06-20',
      title: 'First Public Release',
      consequence: 'The world saw what we were building for the first time.',
      url: 'https://timeline.page/v1',
    },
    {
      date: '2024-09-10',
      title: 'Global Scale achieved',
      consequence: 'Infrastructure withstood the weight of ten thousand concurrent pulses.',
      url: null,
    },
    {
      date: '2025-01-01',
      title: 'The Year of Immutable Logs',
      consequence: 'We decided to never look back, only forward through the lens of time.',
      url: 'https://example.com/immutable',
    },
  ]

  for (const entry of entries) {
    await prisma.entry.create({
      data: entry,
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

