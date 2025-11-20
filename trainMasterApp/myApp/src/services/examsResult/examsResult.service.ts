import { AxiosError } from "axios";
import { toApiError } from "../errors"; // Converte erros genéricos em um formato padrão de erro da aplicação
import { routes } from "../route";      // Centraliza as rotas da API (endpoints reais)
import { ExamAttemptBody } from "../types";


export const ExamResultService = {
        async postResult(payload:ExamAttemptBody) {
          try {
            // Quando o endpoint real existir, basta trocar aqui
            const { data } = await routes.examResults.postResult(payload);
            return data;
          } catch (e : any | AxiosError ) {
            throw toApiError(e);
          }
        },
};
