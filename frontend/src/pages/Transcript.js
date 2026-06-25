import React, { useState, useEffect } from 'react';
import { getStudents, getTranscript } from '../api';

export default function Transcript() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { getStudents().then((r) => setStudents(r.data)); }, []);

  const handleView = async () => {
    if (!selectedId) return setError('Please select a student.');
    setError(''); setTranscript(null);
    try {
      const res = await getTranscript(selectedId);
      setTranscript(res.data);
    } catch (err) {
      setError('Failed to load transcript.');
    }
  };

  const getGPAClass = (gpa) => {
    const g = parseFloat(gpa);
    if (g >= 4.5) return 'First Class';
    if (g >= 3.5) return 'Second Class Upper';
    if (g >= 2.5) return 'Second Class Lower';
    if (g >= 1.5) return 'Third Class';
    return 'Fail';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Transcripts</h1>
        <p>View full academic result and computed GPA per student</p>
      </div>
      <div className="card">
        <div className="card-title">Select Student</div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Student</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Choose a student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.studentId} — {s.firstName} {s.lastName}</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleView}>Generate Transcript</button>
          {transcript && <button className="btn btn-ghost" onClick={() => window.print()}>Print</button>}
        </div>
      </div>
      {transcript && (
        <div className="card">
          <div className="card-title">Academic Transcript</div>
          <div className="transcript-header">
            <div className="transcript-field">Student ID: <span>{transcript.student.studentId}</span></div>
            <div className="transcript-field">Name: <span>{transcript.student.name}</span></div>
            <div className="transcript-field">Department: <span>{transcript.student.department}</span></div>
            <div className="transcript-field">Level: <span>{transcript.student.level} Level</span></div>
          </div>
          {transcript.results.length === 0 ? <div className="empty-state">No grades recorded yet.</div> : (
            <>
              <table>
                <thead>
                  <tr><th>Code</th><th>Title</th><th>Units</th><th>Score</th><th>Grade</th><th>Grade Point</th><th>Weighted</th></tr>
                </thead>
                <tbody>
                  {transcript.results.map((r) => (
                    <tr key={r.courseCode}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{r.courseCode}</td>
                      <td>{r.courseTitle}</td>
                      <td>{r.creditUnit}</td>
                      <td>{r.score}</td>
                      <td><span className={`grade-badge grade-${r.grade}`}>{r.grade}</span></td>
                      <td>{r.gradePoint.toFixed(1)}</td>
                      <td>{r.weightedPoint.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 16, padding: '12px 14px', background: '#f5f5f5', borderRadius: 6, fontSize: 13 }}>
                <strong>Total Credit Units:</strong> {transcript.summary.totalCreditUnits} &nbsp;|&nbsp;
                <strong>Total Weighted Points:</strong> {transcript.summary.totalWeightedPoints}
              </div>
              <div className="gpa-display">
                <div className="gpa-label">Cumulative Grade Point Average</div>
                <div className="gpa-number">{transcript.summary.gpa}</div>
                <div style={{ marginTop: 8, fontSize: 14, color: '#a3a3a3' }}>{getGPAClass(transcript.summary.gpa)}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}