import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const organizationId = req.user.id;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizationId,
      },
    });

    // If files exist, store banner and document URLs
    if (req.files) {
      const banners = req.files.banners || [];
      const documents = req.files.documents || [];

      for (const file of banners) {
        await prisma.banner.create({
          data: {
            url: `/uploads/banners/${file.filename}`,
            eventId: event.id,
          },
        });
      }

      for (const file of documents) {
        await prisma.document.create({
          data: {
            url: `/uploads/documents/${file.filename}`,
            eventId: event.id,
          },
        });
      }
    }

    return successResponse(res, 'Event created successfully', { event }, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to create event', error.message);
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        banners: true,
        documents: true,
        organization: true,
      },
    });
    return successResponse(res, 'All events fetched', events);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch events', error.message);
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        banners: true,
        documents: true,
        organization: true,
      },
    });

    if (!event) {
      return errorResponse(res, 'Event not found', null, 404);
    }

    return successResponse(res, 'Event fetched', event);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch event', error.message);
  }
};
