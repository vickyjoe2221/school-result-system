const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { enrollments: { include: { course: true } } },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { studentId, firstName, lastName, email, department, level } = req.body;
  try {
    const student = await prisma.student.create({
      data: { studentId, firstName, lastName, email, department, level: parseInt(level) },
    });
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'Student ID or Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/transcript', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { enrollments: { include: { course: true } } },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    let totalWeightedPoints = 0;
    let totalCreditUnits = 0;

    const results = student.enrollments.map((e) => {
      const weightedPoints = e.gradePoint * e.course.creditUnit;
      totalWeightedPoints += weightedPoints;
      totalCreditUnits += e.course.creditUnit;
      return {
        courseCode: e.course.courseCode,
        courseTitle: e.course.courseTitle,
        creditUnit: e.course.creditUnit,
        score: e.score,
        grade: e.grade,
        gradePoint: e.gradePoint,
        weightedPoint: weightedPoints,
      };
    });

    const gpa = totalCreditUnits > 0 ? (totalWeightedPoints / totalCreditUnits).toFixed(2) : '0.00';

    res.json({
      student: {
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        department: student.department,
        level: student.level,
      },
      results,
      summary: { totalCourses: student.enrollments.length, totalCreditUnits, totalWeightedPoints: totalWeightedPoints.toFixed(2), gpa },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;