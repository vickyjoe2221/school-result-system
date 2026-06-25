import React, { useEffect, useState } from 'react';
import { getStats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((res) => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty-state">Loading...</div>;

  const gradeMap = {};
  if (stats?.gradeDistribution) {
    stats.gradeDistribution.forEach((g) => { gradeMap[g.grade] = g._count.grade; });
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of the school result processing system</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats?.totalStudents ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Courses</div>
          <div className="stat-value">{stats?.totalCourses ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grades Assigned</div>
          <div className="stat-value">{stats?.totalEnrollments ?? 0}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Grade Distribution</div>
        {stats?.gradeDistribution?.length > 0 ? (
          <table>
            <thead>
              <tr><th>Grade</th><th>Count</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => {
                const count = gradeMap[g] || 0;
                const pct = stats.totalEnrollments ? ((count / stats.totalEnrollments) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={g}>
                    <td><span className={`grade-badge grade-${g}`}>{g}</span></td>
                    <td>{count}</td>
                    <td>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No grades assigned yet.</div>
        )}
      </div>
    </div>
  );
}