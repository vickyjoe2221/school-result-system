Example:
| Course | Units | Grade | Grade Point | Weighted |
|--------|-------|-------|-------------|----------|
| SEN301 | 3     | A     | 5.0         | 15.0     |
| SEN302 | 2     | B     | 4.0         | 8.0      |
| SEN303 | 3     | C     | 3.0         | 9.0      |
| **Total** | **8** | — | —        | **32.0** |

**GPA = 32.0 / 8 = 4.00 (Second Class Upper)**

---

## 📱 Pages

| Page          | Route       | Description                           |
|---------------|-------------|---------------------------------------|
| Dashboard     | /           | Stats cards + grade distribution      |
| Students      | /students   | Register and manage students          |
| Courses       | /courses    | Add and manage courses                |
| Assign Grades | /grades     | Assign scores, view all grade records |
| Transcripts   | /transcript | Generate full transcript + GPA        |

---

## 🏗 Deployment

### Frontend — Netlify
- Base directory: `frontend`
- Build command: `npm ci && ./node_modules/.bin/react-scripts build`
- Publish directory: `build`

### Backend — Railway
- Root directory: `backend`
- Start command: `node src/index.js`
- Environment variable: `DATABASE_URL`

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 👨‍💻 Authors

Built by **Group 33**  
Lead City University — Software Engineering Department.

---

> *ResultPro — Automate results. Empower institutions.*