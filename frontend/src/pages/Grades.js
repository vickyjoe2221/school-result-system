import React, { useEffect, useState } from 'react';
import { getStudents, getCourses, getEnrollments, assignGrade, deleteEnrollment } from '../api';

function computeGradeLabel(score) {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  if (score >= 40) return 'E';
  return 'F';
}

export default function Grades() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [form, setForm] = useState({ studentId: '', courseId: '', score: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const [s, c, e] = await Promise.all([getStudents(), getCourses(), getEnrollments()]);
    setStudents(s.data); setCourses(c.data); setEnrollments(e.data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (!form.studentId || !form.courseId || form.score === '') return setError('All fields are required.');
    const score = parseFloat(form.score);
    if (score < 0 || score > 100) return setError('Score must be 0–100.');
    try {
      await assignGrade(form);
      setSuccess(`Grade assigned: ${computeGradeLabel(score)}`);
      setForm({ studentId: '', courseId: '', score: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign grade.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this grade entry?')) return;
    await deleteEnrollment(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Assign Grades</h1>
        <p>Record student scores — grades are auto-computed (Nigerian 5.0 scale)</p>
      </div>
      <div className="card">
        <div className="card-title">Assign / Update Grade</div>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Student</label>
            <select name="studentId" value={form.studentId} onChange={handleChange}>
              <option value="">Select student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.studentId} — {s.firstName} {s.lastName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Course</label>
            <select name="courseId" value={form.courseId} onChange={handleChange}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.courseCode} — {c.courseTitle}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Score (0–100)</label>
            <input name="score" type="number" min="0" max="100" value={form.score} onChange={handleChange} placeholder="Enter score" />
          </div>
          {form.score !== '' && (
            <div className="form-group">
              <label>Computed Grade</label>
              <div style={{ paddingTop: 10 }}>
                <span className={`grade-badge grade-${computeGradeLabel(parseFloat(form.score))}`}>
                  {computeGradeLabel(parseFloat(form.score))}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>Save Grade</button>
        </div>
      </div>
      <div className="card">
        <div className="card-title">All Grade Records ({enrollments.length})</div>
        {enrollments.length === 0 ? <div className="empty-state">No grades assigned yet.</div> : (
          <table>
            <thead>
              <tr><th>Student</th><th>Course</th><th>Score</th><th>Grade</th><th>Grade Point</th><th></th></tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id}>
                  <td>{e.student.studentId} — {e.student.firstName} {e.student.lastName}</td>
                  <td style={{ fontFamily: 'monospace' }}>{e.course.courseCode}</td>
                  <td>{e.score}</td>
                  <td><span className={`grade-badge grade-${e.grade}`}>{e.grade}</span></td>
                  <td>{e.gradePoint.toFixed(1)}</td>
                  <td><button className="btn btn-danger" onClick={() => handleDelete(e.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}