const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

function computeGrade(score) {
  if (score >= 70) return { grade: 'A', gradePoint: 5.0 };
  if (score >= 60) return { grade: 'B', gradePoint: 4.0 };
  if (score >= 50) return { grade: 'C', gradePoint: 3.0 };
  if (score >= 45) return { grade: 'D', gradePoint: 2.0 };
  if (score >= 40) return { grade: 'E', gradePoint: 1.0 };
  return { grade: 'F', gradePoint: 0.0 };
}

router.get('/', async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: { student: true, course: true },
      orderBy: { id: 'desc' },
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    const gradeDistribution = await prisma.enrollment.groupBy({
      by: ['grade'],
      _count: { grade: true },
      orderBy: { grade: 'asc' },
    });
    res.json({ totalStudents, totalCourses, totalEnrollments, gradeDistribution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { studentId, courseId, score } = req.body;
  const numScore = parseFloat(score);
  if (numScore < 0 || numScore > 100) return res.status(400).json({ error: 'Score must be between 0 and 100' });
  const { grade, gradePoint } = computeGrade(numScore);
  try {
    const enrollment = await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: parseInt(studentId), courseId: parseInt(courseId) } },
      update: { score: numScore, grade, gradePoint },
      create: { studentId: parseInt(studentId), courseId: parseInt(courseId), score: numScore, grade, gradePoint },
      include: { student: true, course: true },
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.enrollment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Grade removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;