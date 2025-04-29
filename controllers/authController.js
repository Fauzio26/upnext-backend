import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signUpOrganization = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existing = await prisma.organization.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const organization = await prisma.organization.create({
        data: { name, email, password: hashedPassword },
      });
  
      const token = jwt.sign(
        { id: organization.id, email: organization.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(201).json({
        message: 'Organization registered successfully',
        token,
        user: {
          id: organization.id,
          name: organization.name,
          email: organization.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const signInOrganization = async (req, res) => {
  const { email, password } = req.body;
  try {
    const organization = await prisma.organization.findUnique({ where: { email } });
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: organization.id, email: organization.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
