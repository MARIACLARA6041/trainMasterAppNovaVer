import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { CourseDiscussions, CreateCourseDiscussionBody } from "../types";


export const CourseDiscussionService = {
  async addDiscussion(payload: CreateCourseDiscussionBody): Promise<CourseDiscussions> {
    try {
      const data = await routes.courseDiscussion.addDiscussion(payload);
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },
  async getAllFromCourseId(courseId: number): Promise<CourseDiscussions[]> {
    try {
      const { data } = await routes.courseDiscussion.getAllFromCourseId(courseId.toString());
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  }
};
