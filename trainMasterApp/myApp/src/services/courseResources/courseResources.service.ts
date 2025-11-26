
import { baseURL } from "../api";
import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { PATHS } from "../paths";
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { CourseResource } from "../types";


export const CourseResources = {
  async getAllByUserId(courseId: number): Promise<CourseResource[]> {
    try {
      const { data } = await routes.courseResource.getAllFromCourseId(courseId.toString());
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },
  downloadResource(courseId: number, resourceId: number) {
    try {
      //const { data } = await routes.courseResource.downloadResource(courseId.toString(),resourceId.toString());
      const qs = new URLSearchParams({ courseId: courseId.toString(), id: resourceId.toString() }).toString();
      const URL = (`${baseURL}${PATHS.courseResource}/download?${qs}`)
      return URL;
    } catch (e) {
      throw toApiError(e);
    }
  }
};
