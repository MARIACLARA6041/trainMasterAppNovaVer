import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import QuestionRunner, { Question } from "../components/QuestionRunner/QuestionRunner";
import { ReviewParams } from "./ReviewAnswersScreen";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { Cronometro } from "../components/utils/cronometro";

/** ===========================
 * Params aceitos pela tela
 * =========================== */
export type QuestionFlowParams = {
  mode: "exam" | "exercise";     // define comportamento (single x multiple)
  title?: string;                // título da tela
  questions: Question[];        // opcional: pode passar dataset pronto por navegação
  startIndex?: number;           // índice inicial (default 0)
  examId?:number;
};



/** Resolve dataset final: por 'source' ou por 'questions' */
function resolveQuestions(override: Question[]) {
  return override;
}
type Nav = NativeStackNavigationProp<AprendizadoStackParamList, "QuestionFlow">;

type ResultadoAvaliação = {
    totalPerguntas: number;
    totalAcertos: number;
    percentualAcertos: number;
    score:number;
};

function contarAcertos(
    perguntas: Question[],
    respostas: Record<string, Array<number | string>>
): ResultadoAvaliação {
    let acertos = 0;
    let score = 0;
    for (const pergunta of perguntas) {
        // garante acesso pela chave string
        const respostasUsuarioRaw = respostas[String(pergunta.id)] ?? [];
        // normaliza para string para comparar sem erro de tipo
        const respostasUsuario = respostasUsuarioRaw.map(v => String(v));

        const corretas = pergunta.options
            .filter(o => o.isCorrect)
            .map(o => String(o.id)); // normaliza para string também

        const acertou =
            corretas.length === respostasUsuario.length &&
            corretas.every(id => respostasUsuario.includes(id));

        if (acertou){
            acertos++;
            score = score + pergunta.points;
        } 

    }

    const totalPerguntas = perguntas.length;
    const percentualAcertos =
        totalPerguntas > 0 ? Number(((acertos / totalPerguntas) * 100).toFixed(2)) : 0;

    return { totalPerguntas, totalAcertos: acertos, percentualAcertos, score };
}

export default function QuestionFlowScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<Record<string, QuestionFlowParams>, string>>();
  const {
    mode = "exam",
    title,
    questions: override,
    startIndex = 0,
    examId
  } = route.params ?? {};

  const QUESTIONS = React.useMemo(() => resolveQuestions(override), [override]);
  const [index, setIndex] = React.useState(Math.max(0, Math.min(startIndex, QUESTIONS.length - 1)));
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const selected = answers[question.id] ?? [];
  const cronometro = new Cronometro();
  cronometro.iniciar();
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const setSelectedForCurrent = (ids: string[]) => {
    setAnswers(prev => ({ ...prev, [question.id]: ids }));
  };

  const onPrev = () => setIndex(i => Math.max(0, i - 1));
  const onNext = () => {
    if (isLast) {
      cronometro.parar();
      const result = contarAcertos(QUESTIONS, answers);
      nav.navigate("ReviewAnswers", {
        mode,
        title: title ?? (mode === "exam" ? "Prova" : "Questões"),
        questions: QUESTIONS,
        answers,
        examId,
        correct: result.totalAcertos,
        passThreshold:70,
        percent:result.percentualAcertos,
        total:result.totalPerguntas,
        elapsedSec:cronometro.getSegundos(),
        startedAt:cronometro.getDataInicial(),
        finishedAt:cronometro.getDataFinal(),
        score: result.score
      } satisfies ReviewParams);
      return;
    }
    setIndex(i => Math.min(total - 1, i + 1));
  };

  const nextDisabled = selected.length === 0;

  return (
    <QuestionRunner
      mode={mode}
      title={title ?? (mode === "exam" ? "Prova" : "Questões")}
      progress={{ current: index + 1, total }}
      question={question}
      selected={selected}
      onChangeSelected={setSelectedForCurrent}
      onPrev={onPrev}
      onNext={onNext}
      prevDisabled={isFirst}
      nextDisabled={nextDisabled}
      nextLabel={isLast ? "Verificar" : "Próximo"}
      hidePrev={false} // mude para isFirst se quiser esconder o Anterior na primeira
    />
  );
}
