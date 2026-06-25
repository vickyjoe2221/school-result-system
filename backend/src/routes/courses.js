const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { courseCode, courseTitle, creditUnit, semester, session } = req.body;
  try {
    const course = await prisma.course.create({
      data: { courseCode: courseCode.toUpperCase(), courseTitle, creditUnit: parseInt(creditUnit), semester, session },
    });
    res.status(201).json(course);
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'Course code already exists' });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;