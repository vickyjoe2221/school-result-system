import React, { useEffect, useState } from 'react';
import { getStudents, createStudent, deleteStudent } from '../api';

const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Accounting', 'Medicine', 'Law', 'Other'];
const LEVELS = [100, 200, 300, 400, 500];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', firstName: '', lastName: '', email: '', department: '', level: '100' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => getStudents().then((r) => setStudents(r.data));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    const { studentId, firstName, lastName, email, department } = form;
    if (!studentId || !firstName || !lastName || !email || !department) return setError('All fields are required.');
    try {
      await createStudent(form);
      setSuccess('Student added successfully.');
      setForm({ studentId: '', firstName: '', lastName: '', email: '', department: '', level: '100' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student and all their grades?')) return;
    await deleteStudent(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        <p>Register and manage student records</p>
      </div>
      <div className="card">
        <div className="card-title">Add New Student</div>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Student ID</label>
            <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="e.g. LCU/22/0001" />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="student@email.com" />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select name="department" value={form.department} onChange={handleChange}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Level</label>
            <select name="level" value={form.level} onChange={handleChange}>
              {LEVELS.map((l) => <option key={l} value={l}>{l} Level</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>Add Student</button>
        </div>
      </div>
      <div className="card">
        <div className="card-title">All Students ({students.length})</div>
        {students.length === 0 ? <div className="empty-state">No students registered yet.</div> : (
          <table>
            <thead>
              <tr><th>Student ID</th><th>Name</th><th>Department</th><th>Level</th><th>Email</th><th></th></tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.studentId}</td>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.department}</td>
                  <td>{s.level} Level</td>
                  <td>{s.email}</td>
                  <td><button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}