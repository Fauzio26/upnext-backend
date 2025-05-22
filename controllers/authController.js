/**
 * @swagger
 * /organizations/signup:
 *   post:
 *     summary: Registrasi organisasi baru
 *     tags: [Organization]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - membershipProof
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Organization"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "org@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongpassword123"
 *               membershipProof:
 *                 type: string
 *                 format: binary
 *                 description: File bukti keanggotaan (png/jpg)
 *     responses:
 *       201:
 *         description: Organisasi berhasil didaftarkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Organization registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "My Organization"
 *                         email:
 *                           type: string
 *                           example: "org@example.com"
 *                         membershipProof:
 *                           type: string
 *                           example: "https://res.cloudinary.com/..."
 *       400:
 *         description: Request invalid email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /organizations/signin:
 *   post:
 *     summary: Login organisasi
 *     tags: [Organization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "org@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sign in successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Organisasi tidak ditemukan
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
 *           example: "Email already registered"
 *         error:
 *           type: string
 *           example: "Email already registered"
 */




import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { streamUpload } from '../utils/cloudinary-upload.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

const prisma = new PrismaClient();

export const signUpOrganization = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const membershipProofFile = req.file;

    if (!membershipProofFile) {
      return errorResponse(res, 'Membership proof file is required (png/jpg).', null, 400);
    }

    const existing = await prisma.organization.findUnique({ where: { email } });
    if (existing) {
      return errorResponse(res, 'Email already registered', null, 400);
    }

    const uploadedImage = await streamUpload(membershipProofFile.buffer, {
      folder: 'membership_proofs',
      resource_type: 'image',
      allowed_formats: ['png', 'jpg', 'jpeg'],
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await prisma.organization.create({
      data: {
        name,
        email,
        password: hashedPassword,
        membershipProof: uploadedImage.secure_url,
      },
    });

    const token = jwt.sign(
      { id: organization.id, email: organization.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return successResponse(res, 'Organization registered successfully', {
      token,
      user: {
        id: organization.id,
        name: organization.name,
        email: organization.email,
        membershipProof: organization.membershipProof,
      },
    }, 201);
  } catch (error) {
    return errorResponse(res, error.message, error.message);
  }
};

export const signInOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;

    const organization = await prisma.organization.findUnique({ where: { email } });
    if (!organization) return errorResponse(res, 'Organization not found', null, 404);

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) return errorResponse(res, 'Invalid credentials', null, 400);

    const token = jwt.sign(
      { id: organization.id, email: organization.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return successResponse(res, 'Sign in successful', { token });
  } catch (error) {
    return errorResponse(res, error.message, error.message);
  }
};
