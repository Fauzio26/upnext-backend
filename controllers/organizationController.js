/**
 * @swagger
 * /organization/profile:
 *   get:
 *     summary: Ambil profil organisasi yang sedang login
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil organisasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "org_123"
 *                 name:
 *                   type: string
 *                   example: "Organisasi Contoh"
 *                 email:
 *                   type: string
 *                   example: "org@example.com"
 *                 profilePic:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../profilepic.jpg"
 *                 bannerPic:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../bannerpic.jpg"
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /organization/profile:
 *   patch:
 *     summary: Update profil organisasi yang sedang login
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Organisasi Baru"
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: File gambar profil baru (jpg/png)
 *               bannerPic:
 *                 type: string
 *                 format: binary
 *                 description: File gambar banner baru (jpg/png)
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "org_123"
 *                 name:
 *                   type: string
 *                   example: "Organisasi Baru"
 *                 email:
 *                   type: string
 *                   example: "org@example.com"
 *                 profilePic:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../newprofilepic.jpg"
 *                 bannerPic:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../newbannerpic.jpg"
 *       500:
 *         description: Terjadi kesalahan server saat update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /organization:
 *   get:
 *     summary: Ambil daftar semua organisasi aktif
 *     tags: [Organization]
 *     responses:
 *       200:
 *         description: Daftar organisasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "org_123"
 *                   name:
 *                     type: string
 *                     example: "Organisasi Contoh"
 *                   email:
 *                     type: string
 *                     example: "org@example.com"
 *                   profilePic:
 *                     type: string
 *                     example: "https://res.cloudinary.com/.../profilepic.jpg"
 *                   bannerPic:
 *                     type: string
 *                     example: "https://res.cloudinary.com/.../bannerpic.jpg"
 *                   membershipProof:
 *                     type: string
 *                     example: "https://res.cloudinary.com/.../membershipproof.jpg"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-22T10:00:00+07:00"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-22T12:00:00+07:00"
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /organization/{id}:
 *   get:
 *     summary: Ambil data organisasi berdasarkan ID
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID organisasi yang ingin diambil
 *         required: true
 *         schema:
 *           type: string
 *           example: "org_123"
 *     responses:
 *       200:
 *         description: Data organisasi ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "org_123"
 *                 name:
 *                   type: string
 *                   example: "Organisasi Contoh"
 *                 email:
 *                   type: string
 *                   example: "org@example.com"
 *                 profilePic:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../profilepic.jpg"
 *                 bannerPic:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../bannerpic.jpg"
 *                 membershipProof:
 *                   type: string
 *                   example: "https://res.cloudinary.com/.../membershipproof.jpg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-22T10:00:00+07:00"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-22T12:00:00+07:00"
 *       404:
 *         description: Organisasi tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /organization/{id}:
 *   patch:
 *     summary: Update data organisasi berdasarkan ID
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID organisasi yang ingin diupdate
 *         required: true
 *         schema:
 *           type: string
 *           example: "org_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Organisasi Baru"
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newstrongpassword123"
 *     responses:
 *       200:
 *         description: Organisasi berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization updated"
 *                 organization:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "org_123"
 *                     name:
 *                       type: string
 *                       example: "Organisasi Baru"
 *                     email:
 *                       type: string
 *                       example: "newemail@example.com"
 *       500:
 *         description: Terjadi kesalahan server saat update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /organization/{id}:
 *   delete:
 *     summary: Hapus organisasi secara soft delete dan hapus gambar dari Cloudinary
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID organisasi yang ingin dihapus
 *         required: true
 *         schema:
 *           type: string
 *           example: "org_123"
 *     responses:
 *       200:
 *         description: Organisasi berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization successfully deleted"
 *       404:
 *         description: Organisasi tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Terjadi kesalahan server saat penghapusan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Terjadi kesalahan"
 *         error:
 *           type: string
 *           example: "Detail error message"
 */


import { PrismaClient } from '@prisma/client';
import { getPublicIdFromUrl } from '../utils/cloudinary-urls.js';
import { deleteResource } from '../utils/cloudinary-delete.js';
import { streamUpload } from '../utils/cloudinary-upload.js';
import { nowWIB } from '../utils/time.js';
import { toWIB } from '../utils/time.js';
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
    dataToUpdate.updatedAt = nowWIB();

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
    const organizationsWIB = organizations.map((org) => ({
      ...org,
      createdAt: toWIB(org.createdAt),
    }));
    res.json(organizationsWIB);
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
    dataToUpdate.updatedAt = nowWIB();

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

    await prisma.organization.update({
      where: { id },
      data: { deletedAt: nowWIB() },
    });

    res.json({ message: 'Organization successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
