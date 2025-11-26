// Centraliza rotas do backend
export const PATHS = {
  profile: "/profile",
  login: "/auth/login",
  courses: "/courses",
  coursesSearch: "/courses/GetByName",
  courseEnrolled:"/courses/GetByUserId",
  coursesActivities:"/course-activities",
  exams:"/exams",
  history:"exam-histories/user",
  faq:"/faqs",
  departament:"/departments/by-user",
  examResult:"/exam-histories/adicionar",
  courseResource:"/course-attachments-ativi",
  courseDiscussion:"/discussions",
} as const;