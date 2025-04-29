import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        bannerPic: true,
      },
    });
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { name } = req.body;
  const profilePic = req.files?.profilePic?.[0]?.path;
  const bannerPic = req.files?.bannerPic?.[0]?.path;

  try {
    const updated = await prisma.organization.update({
      where: { id: req.user.id },
      data: {
        name,
        profilePic,
        bannerPic,
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await prisma.organization.update({
      where: { id: req.user.id },
      data: { deleted: true },
    });
    res.json({ message: 'Account safely deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
