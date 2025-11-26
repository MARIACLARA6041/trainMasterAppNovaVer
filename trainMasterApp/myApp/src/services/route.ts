import DepartmentScreen from "../screens/Department";
import { api } from "./api";
import { authService } from "./auth/auth.service";
import { PATHS } from "./paths";
import type { Course, CourseActivity, CourseDiscussions, CourseNote, CourseResource, CreateCourseDiscussionBody, CreateCourseNote, Exam, ExamAttemptBody, ExamHistoryItem, faq, LoginPayload, ProfilePayload } from "./types";



export const routes = {
  department: {
    getByUserId: async () => {
      const userId = authService.requireUserId().toString();
      return api.get(`${PATHS.departament}/${userId}`)
    }
  },
  profile: {
    add: async (payload: ProfilePayload) =>
      api.post(`${PATHS.profile}/adicionarPerfil`, payload),
    update: async (id: number, payload: ProfilePayload) =>
      api.put(`${PATHS.profile}/${id}`, payload),
    getById: async (id: number) => api.get(`${PATHS.profile}/${id}`),
    getLoggedProfile: async () => {
      const userId = authService.requireUserId().toString();
      return api.get(`${PATHS.profile}/${userId}`)
    }
  },
  examResults: {
    postResult: async (examPayload: ExamAttemptBody) => api.post(PATHS.examResult, examPayload),
  },
  auth: {
    login: async (payload: LoginPayload) => api.post(`${PATHS.login}`, payload),
    forgotPassword: async (payload: { email: string; newPassword: string }) =>
      api.post(`${PATHS.login}/ForgotPassword`, payload),
  },
  courseActivities: {
    getAll: async () => api.get<CourseActivity[]>(`${PATHS.coursesActivities}/all`),
    getAllQuestionsFromCourse: async (id: number) => api.get(`${PATHS.coursesActivities}/${id}/questions`),
    getAllExams: async () => api.get<Exam[]>(`${PATHS.exams}/all`),
  },
  history: {
    getAllByUserId: async () => {
      const userId = authService.requireUserId().toString();
      return api.get<ExamHistoryItem[]>(`${PATHS.history}/${userId}`);
    }
  },
  faq: {
    getAll: async () => api.get<faq[]>(PATHS.faq),
  },
  courses: {
    getAll: async () => api.get<Course[]>(PATHS.courses),
    getBySearch: async (search: string) => {
      const qs = new URLSearchParams({ name: search }).toString();
      return api.get<Course[]>(`${PATHS.coursesSearch}?${qs}`);
    },
    getEnrolled: async () => {
      const userId = authService.requireUserId().toString();
      const qs = new URLSearchParams({ userId: userId }).toString();// tem que vir do auth
      return api.get<Course[]>(`${PATHS.courseEnrolled}?${qs}`);
    }
  },
  courseResource: {
    getAllFromCourseId: async (courseId: string) => {
      const qs = new URLSearchParams({ courseId: courseId }).toString();
      return api.get<CourseResource[]>(`${PATHS.courseResource}/list?${qs}`)
    },
  },
  courseDiscussion: {
    addDiscussion: async (payload: CreateCourseDiscussionBody): Promise<CourseDiscussions> =>
      api.post(`${PATHS.courseDiscussion}/add`, payload),
    getAllFromCourseId: async (courseId: string) => {
      return api.get<CourseDiscussions[]>(`${PATHS.courseDiscussion}/bycourse/${courseId}`)
    },
  },
  courseNotes: {
    addNote: async (payload: CreateCourseNote): Promise<CourseNote> =>
      api.post(`${PATHS.courseNotes}`, payload),
    getAllFromCourseId: async (courseId: string) => {
      const userId = authService.requireUserId().toString();
      return api.get<CourseNote[]>(`${PATHS.courseNotes}/by-user/${userId}/course/${courseId}`)
    },
  },
};

export type Routes = typeof routes;
