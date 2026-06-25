import React, { useEffect, useState } from 'react';
import { getCourses, createCourse, deleteCourse } from '../api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseCode: '', courseTitle: '', creditUnit: '2', semester: 'First', session: '2023/2024' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => getCourses().then((r) => setCourses(r.data));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    const { courseCode, courseTitle, creditUnit, semester, session } = form;
    if (!courseCode || !courseTitle || !creditUnit || !semester || !session) return setError('All fields are required.');
    try {
      await createCourse(form);
      setSuccess('Course added successfully.');
      setForm({ courseCode: '', courseTitle: '', creditUnit: '2', semester: 'First', session: '2023/2024' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add course.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await deleteCourse(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Courses</h1>
        <p>Manage course catalogue and credit units</p>
      </div>
      <div className="card">
        <div className="card-title">Add New Course</div>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Course Code</label>
            <input name="courseCode" value={form.courseCode} onChange={handleChange} placeholder="e.g. SEN301" />
          </div>
          <div className="form-group">
            <label>Credit Units</label>
            <select name="creditUnit" value={form.creditUnit} onChange={handleChange}>
              {[1, 2, 3, 4, 6].map((u) => <option key={u} value={u}>{u} Units</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label>Course Title</label>
            <input name="courseTitle" value={form.courseTitle} onChange={handleChange} placeholder="e.g. Software Engineering Principles" />
          </div>
          <div className="form-group">
            <label>Semester</label>
            <select name="semester" value={form.semester} onChange={handleChange}>
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
            </select>
          </div>
          <div className="form-group">
            <label>Session</label>
            <input name="session" value={form.session} onChange={handleChange} placeholder="e.g. 2023/2024" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>Add Course</button>
        </div>
      </div>
      <div className="card">
        <div className="card-title">All Courses ({courses.length})</div>
        {courses.length === 0 ? <div className="empty-state">No courses added yet.</div> : (
          <table>
            <thead>
              <tr><th>Code</th><th>Title</th><th>Units</th><th>Semester</th><th>Session</th><th></th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.courseCode}</td>
                  <td>{c.courseTitle}</td>
                  <td>{c.creditUnit}</td>
                  <td>{c.semester} Semester</td>
                  <td>{c.session}</td>
                  <td><button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}