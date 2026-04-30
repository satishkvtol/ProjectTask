import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get all colleges + search and filter
router.get('/', async (req, res) => {
  try {
    const { search, location, maxFees } = req.query;
    
    const where: any = {};
    if (search) {
      where.name = { contains: search as string };
    }
    if (location) {
      where.location = { contains: location as string };
    }
    if (maxFees) {
      where.fees = { lte: parseInt(maxFees as string) };
    }

    const colleges = await prisma.college.findMany({ where });
    res.json(colleges.map(c => ({...c, courses: JSON.parse(c.courses)})));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single college by ID
router.get('/:id', async (req, res) => {
  try {
    const college = await prisma.college.findUnique({
      where: { id: req.params.id }
    });
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.json({...college, courses: JSON.parse(college.courses)});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get multiple colleges for comparison
router.post('/compare', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of college ids' });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } }
    });
    res.json(colleges.map(c => ({...c, courses: JSON.parse(c.courses)})));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save a college (Requires auth)
router.post('/:id/save', authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user!.userId;
    const collegeId = req.params.id as string;

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: { userId, collegeId }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'College already saved' });
    }

    const saved = await prisma.savedCollege.create({
      data: { userId, collegeId }
    });
    
    res.json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a saved college (Requires auth)
router.delete('/:id/save', authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user!.userId;
    const collegeId = req.params.id as string;

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: { userId, collegeId }
      }
    });
    
    res.json({ message: 'College removed from saved list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get saved colleges (Requires auth)
router.get('/saved/me', authenticateToken, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user!.userId;
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: { college: true }
    });
    res.json(saved.map(s => ({...s.college, courses: JSON.parse(s.college.courses)})));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
