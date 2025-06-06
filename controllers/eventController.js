import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { streamUpload } from '../utils/cloudinary-upload.js';
import { deleteResource } from '../utils/cloudinary-delete.js';
import { delEv} from '../utils/delEventGeneral.js';

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  const { title, description, startDate, endDate, registLink } = req.body;
  const organizationId = req.user.id;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registLink,
        organizationId,
      },
    });

    // Upload banner
    if (req.files?.banner?.length) {
      const file = req.files.banner[0];
      const result = await streamUpload(file.buffer, {
        folder: 'event_banners',
        resource_type: 'image',
        allowed_formats: ['png', 'jpg', 'jpeg'],
      });

      await prisma.banner.create({
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          eventId: event.id,
        },
      });
    }

    // Upload documents
    if (req.files?.documents?.length) {
      for (const file of req.files.documents) {
        const result = await streamUpload(file.buffer, {
          folder: 'event_documents',
          resource_type: 'raw',
          use_filename: true,
          unique_filename: true,
          filename_override: file.originalname,
          access_mode: 'public',
        });

        await prisma.document.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            eventId: event.id,
          },
        });
      }
    }

    // Upload photos
    if (req.files?.photos?.length) {
      for (const file of req.files.photos) {
        const result = await streamUpload(file.buffer, {
          folder: 'event_photos',
          resource_type: 'image',
          allowed_formats: ['png', 'jpg', 'jpeg'],
        });

        await prisma.eventPhoto.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            eventId: event.id,
          },
        });
      }
    }

    return successResponse(res, 'Event created successfully', event, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to create event', error.message);
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      include: {
        banner: true,
        documents: true,
        photos: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return successResponse(res, 'All events fetched', { events });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to fetch events', error.message);
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        banner: true,
        documents: true,
        photos: true,
      },
    });

    if (!event) {
      return errorResponse(res, 'Event not found', null, 404);
    }

    return successResponse(res, 'Event fetched successfully', { event });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to fetch event', error.message);
  }
};

export const getEventsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

  const event = await prisma.event.findMany({
  where: {
    organizationId: userId,
    deletedAt: null, 
  },
  include: {
    banner: true,
    documents: true,
    photos: true,
  },
  orderBy: {
    startDate: 'desc',
  },
});

 if (!event) {
      return errorResponse(res, 'Event not found', null, 404);
    }

    return successResponse(res, 'Event fetched successfully', { event });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to fetch event', error.message);
  }
};

export const searchEvents = async (req, res) => {
  const { q } = req.query;

  try {
    const events = await prisma.event.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            title: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        banner: true,
        documents: true,
        photos: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return successResponse(res, 'Search results', { events });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Search failed', error.message);
  }
};


export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, registLink } = req.body;

  try {
    const event = await prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        banner: true,
        documents: true,
        photos: true,
      },
    });

    if (!event) {
      return errorResponse(res, 'Event not found', null, 404);
    }

    const dataToUpdate = {};
    if (title) dataToUpdate.title = title;
    if (description) dataToUpdate.description = description;
    if (startDate) dataToUpdate.startDate = new Date(startDate);
    if (endDate) dataToUpdate.endDate = new Date(endDate);
    if (registLink) dataToUpdate.registLink = registLink;

    await prisma.event.update({
      where: { id },
      data: dataToUpdate,
    });

    if (req.files?.banner?.length) {
      const file = req.files.banner[0];
      const result = await streamUpload(file.buffer, {
        folder: 'event_banners',
        resource_type: 'image',
        allowed_formats: ['png', 'jpg', 'jpeg'],
      });

      if (event.banner) {
        await deleteResource(event.banner.publicId);
        await prisma.banner.update({
          where: { id: event.banner.id },
          data: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        });
      } else {
        await prisma.banner.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            eventId: id,
          },
        });
      }
    }

    if (req.files?.documents?.length) {

      for (const doc of event.documents) {
        await deleteResource(doc.publicId, { resource_type: 'raw'})
        await prisma.document.delete({ where: { id: doc.id } })
      }
      for (const file of req.files.documents) {
        const result = await streamUpload(file.buffer, {
          folder: 'event_documents',
          resource_type: 'raw',
          use_filename: true,
          unique_filename: true,
          filename_override: file.originalname,
        });

        await prisma.document.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            eventId: id,
          },
        });
      }
    }

    if (req.files?.photos?.length) {
      for (const photo of event.photos) {
        await deleteResource(photo.publicId);
        await prisma.eventPhoto.delete({ where: { id: photo.id } });
      }
      for (const file of req.files.photos) {
        const result = await streamUpload(file.buffer, {
          folder: 'event_photos',
          resource_type: 'image',
        });

        await prisma.eventPhoto.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            eventId: id,
          },
        });
      }
    }

    return successResponse(res, 'Event updated successfully', event);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to update event', error.message);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await delEv(req.params.id);
    return successResponse(res, 'Event and uploads deleted');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to delete event', error.message);
  }
};