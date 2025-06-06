import { PrismaClient} from '@prisma/client';
import { deleteResource } from './cloudinary-delete.js';
import { nowWIB } from './time.js';

const prisma = new PrismaClient();

export const delEv = async (eventId) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, deletedAt: null },
    include: {
      banner: true,
      documents: true,
      photos: true,
    },
  });

  if (!event) return;

  if (event.banner) {
    await deleteResource(event.banner.publicId);
  }

  for (const doc of event.documents) {
    await deleteResource(doc.publicId, { resource_type: 'raw' });
  }

  for (const photo of event.photos) {
    await deleteResource(photo.publicId);
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { deletedAt: nowWIB() },
  });
};
