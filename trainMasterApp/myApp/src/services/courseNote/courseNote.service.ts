import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { CourseNote, CreateCourseNote } from "../types";


export const CourseNoteService = {
  async addDiscussion(payload: CreateCourseNote): Promise<CourseNote> {
    try {
      const data = await routes.courseNotes.addNote(payload);
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },
  async getAllFromCourseId(courseId: number): Promise<CourseNote[]> {
    try {
      const { data } = await routes.courseNotes.getAllFromCourseId(courseId.toString());
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  }
};
