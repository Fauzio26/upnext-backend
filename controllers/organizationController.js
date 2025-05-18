import { PrismaClient } from '@prisma/client';
import { getPublicIdFromUrl } from '../utils/cloudinary-urls.js';
import { deleteResource } from '../utils/cloudinary-delete.js';
import { streamUpload } from '../utils/cloudinary-upload.js';
import bcrypt from 'bcryptjs';


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
  const profilePicFile = req.files?.profilePic?.[0];
  const bannerPicFile = req.files?.bannerPic?.[0];

  const dataToUpdate = {};

  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.id },
    });

    if (name) dataToUpdate.name = name;

    if (profilePicFile?.buffer) {
      if (org.profilePic) {
        const publicId = getPublicIdFromUrl(org.profilePic);
        await deleteResource(publicId);
      }

      const uploadedProfilePic = await streamUpload(profilePicFile.buffer, {
        folder: 'organization_profile_pics',
        resource_type: 'image',
      });
      dataToUpdate.profilePic = uploadedProfilePic.secure_url;
    }

    if (bannerPicFile?.buffer) {
      if (org.bannerPic) {
        const publicId = getPublicIdFromUrl(org.bannerPic);
        await deleteResource(publicId);
      }

      const uploadedBannerPic = await streamUpload(bannerPicFile.buffer, {
        folder: 'organization_banner_pics',
        resource_type: 'image',
      });
      dataToUpdate.bannerPic = uploadedBannerPic.secure_url;
    }

    const updated = await prisma.organization.update({
      where: { id: req.user.id },
      data: dataToUpdate,
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        bannerPic: true,
        membershipProof: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await prisma.organization.findFirst({
      where: { id, deletedAt: null },
    });
    if (!organization) return res.status(404).json({ message: 'Organization not found' });
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const dataToUpdate = {};

    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({ message: 'Organization updated', organization: updatedOrg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const org = await prisma.organization.findUnique({
      where: { id },
    });

    if (!org) return res.status(404).json({ message: 'Organization not found' });

    // Hapus gambar dari Cloudinary jika ada
    if (org.profilePic) {
      const publicId = getPublicIdFromUrl(org.profilePic);
      await deleteResource(publicId);
    }

    if (org.bannerPic) {
      const publicId = getPublicIdFromUrl(org.bannerPic);
      await deleteResource(publicId);
    }

    if (org.membershipProof) {
      const publicId = getPublicIdFromUrl(org.membershipProof);
      await deleteResource(publicId);
    }

    // Tandai sebagai deleted (soft delete)
    await prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.json({ message: 'Organization successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
