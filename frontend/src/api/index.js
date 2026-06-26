import axios from 'axios';

const API = axios.create({ baseURL: 'https://school-result-system-production-0287.up.railway.app/api' });

export const getStudents = () => API.get('/students');
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const getTranscript = (id) => API.get(`/students/${id}/transcript`);

export const getCourses = () => API.get('/courses');
export const createCourse = (data) => API.post('/courses', data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

export const getEnrollments = () => API.get('/enrollments');
export const assignGrade = (data) => API.post('/enrollments', data);
export const deleteEnrollment = (id) => API.delete(`/enrollments/${id}`);
export const getStats = () => API.get('/enrollments/stats');