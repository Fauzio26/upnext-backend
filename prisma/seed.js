import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const organizations = [
  'BEM Fakultas Ilmu Komputer',
  'BEM FISIP',
  'HIMA Informatika',
  'BEM UPNVJ',
  'SENAT Fakultas Ilmu Komputer',
  'BEM Fakultas Hukum',
];

const sampleEvents = [
  {
    title: 'Webinar Nasional Teknologi 2025',
    description: 'Diskusi tentang AI dan tren teknologi terbaru.',
    category: 'WEBINAR',
  },
  {
    title: 'Pelatihan Public Speaking',
    description: 'Melatih kepercayaan diri dan komunikasi efektif.',
    category: 'PELATIHAN',
  },
  {
    title: 'Festival Budaya Nusantara',
    description: 'Perayaan seni dan budaya mahasiswa dari seluruh Indonesia.',
    category: 'FESTIVAL',
  },
  {
    title: 'Musyawarah Mahasiswa Nasional',
    description: 'Membahas arah gerakan mahasiswa se-Indonesia.',
    category: 'MUSYAWARAH',
  },
  {
    title: 'Kompetisi Esai Nasional',
    description: 'Kompetisi menulis esai tingkat nasional untuk mahasiswa.',
    category: 'KOMPETISI',
  },
  {
    title: 'Seminar Kewirausahaan Digital',
    description: 'Belajar strategi bisnis startup dari para pakar.',
    category: 'SEMINAR',
  },
  {
    title: 'Pentas Seni Malam Apresiasi',
    description: 'Pertunjukan seni dari UKM dan fakultas-fakultas.',
    category: 'PENTAS_SENI',
  },
  {
    title: 'Pameran Inovasi Mahasiswa',
    description: 'Menampilkan hasil karya inovatif dari mahasiswa seluruh Indonesia.',
    category: 'PAMERAN',
  },
  {
    title: 'Kajian Islam: Akhlak Mahasiswa',
    description: 'Kajian rutin untuk membahas nilai dan etika mahasiswa.',
    category: 'KAJIAN',
  },
  {
    title: 'Bakti Sosial Ramadhan',
    description: 'Kegiatan pengabdian kepada masyarakat menjelang lebaran.',
    category: 'BAKTI_SOSIAL',
  },
];

async function main() {
  console.log('Seeding database...');

  for (const orgName of organizations) {
    const email = orgName.toLowerCase().replace(/\s+/g, '-') + '@yahoo.com';
    const hashedPassword = await bcrypt.hash('password123', 10);

    const organization = await prisma.organization.create({
      data: {
        name: orgName,
        email,
        password: hashedPassword,
        membershipProof: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        profilePic: null,
        bannerPic: null,
      },
    });

    const numEvents = Math.floor(Math.random() * 3) + 1;
    const selectedEvents = sampleEvents.sort(() => 0.5 - Math.random()).slice(0, numEvents);

    for (const ev of selectedEvents) {
      const event = await prisma.event.create({
        data: {
          title: ev.title,
          description: ev.description,
          category: ev.category,
          startDate: new Date('2025-07-01T08:00:00Z'),
          endDate: new Date('2025-07-01T12:00:00Z'),
          organizationId: organization.id,
          banner: {
            create: {
              url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
              publicId: 'sample_banner',
            },
          },
          documents: {
            create: [
              {
                url: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                publicId: 'sample_doc',
              },
            ],
          },
          photos: {
            create: [
              {
                url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                publicId: 'sample_photo',
              },
            ],
          },
        },
      });

      console.log(` Created event "${event.title}" for ${orgName}`);
    }
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
