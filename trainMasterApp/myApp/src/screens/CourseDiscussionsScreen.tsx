import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import AppHeader from "../components/header/AppHeader";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { styles as s } from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";

type Discussion = {
  id: string;
  studentName: string;
  role: string;
  question: string;
  answer: string;
  date: string; // dd/mm/aaaa
};

export default function CourseDiscussionsScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = "#000000";

  const nav = useNavigation<any>();
  const route = useRoute<any>();

  const course = route.params?.course;

  const [message, setMessage] = React.useState("");
  const [discussions, setDiscussions] = React.useState<Discussion[]>([
    {
      id: "1",
      studentName: "Pedro Henrique",
      role: "Instrutor/Monitor",
      question: "Pergunta: Não entendi como criar uma table no Html",
      answer: "Resposta: Revise a aula 1 no momento 10:00 do vídeo",
      date: "10/05/2022",
    },
    {
      id: "2",
      studentName: "Maria Helena",
      role: "Instrutor/Monitor",
      question: "Pergunta: Como posso carregar link do Javascript?",
      answer:
        "Resposta: Revise a aula 2 completa e pratique novamente os exercícios.",
      date: "10/05/2022",
    },
    {
      id: "3",
      studentName: "Maria Aline",
      role: "Instrutor/Monitor",
      question: "Pergunta: Como criar uma classe no CSS?",
      answer:
        "Resposta: Revise a aula 3 e verifique os materiais complementares na sessão recursos.",
      date: "10/05/2022",
    },
  ]);

  function handleAddDiscussion() {
    const trimmed = message.trim();
    if (!trimmed) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString("pt-BR");

    const newItem: Discussion = {
      id: String(Date.now()),
      studentName: "Você",
      role: "Aluno(a)",
      question: `Pergunta: ${trimmed}`,
      answer: "Resposta: Aguarde um instrutor responder sua dúvida.",
      date: dateStr,
    };

    setDiscussions((prev) => [newItem, ...prev]);
    setMessage("");
  }

  return (
    <View style={{ flex: 1, backgroundColor: hardBg }}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <ScrollView
        contentContainerStyle={[s.body, s.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Título + botão Voltar (igual padrão anterior) */}
        <View style={local.titleWrapper}>
          <Pressable style={local.backButton} onPress={() => nav.goBack()}>
            <Text style={local.backButtonText}>Voltar</Text>
          </Pressable>

          <Text style={[s.overviewTitle, { color: hardText }]}>
            {course?.name ?? "Fundamentos da Web"}
          </Text>
        </View>

        {/* Subtítulo “Discussões” */}
        <Text style={local.subtitleCenter}>Discussões</Text>

        {/* Caixa de texto para dúvida */}
        <TextInput
          style={local.input}
          placeholder="Digite aqui sua dúvida..."
          placeholderTextColor="#777777"
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />

        {/* Botão Adicionar (somente ele aqui; Voltar já está no topo) */}
        <View style={local.addRow}>
          <TouchableOpacity
            style={local.addButton}
            onPress={handleAddDiscussion}
          >
            <Text style={local.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de perguntas frequentes */}
        <Text style={[local.sectionTitle, { marginTop: 24 }]}>
          Perguntas mais frequentes :
        </Text>

        <View style={{ marginTop: 8 }}>
          {discussions.map((item) => (
            <View key={item.id} style={local.card}>
              {/* Topo: avatar + nome/role + data */}
              <View style={local.cardHeader}>
                <View style={local.avatarBlock}>
                  <View style={local.avatarCircle}>
                    <Text style={local.avatarInitial}>
                      {item.studentName.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 6 }}>
                    <Text style={local.studentName}>{item.studentName}</Text>
                    <Text style={local.role}>{item.role}</Text>
                  </View>
                </View>

                <Text style={local.date}>{item.date}</Text>
              </View>

              {/* Pergunta / Resposta */}
              <Text style={local.question}>{item.question}</Text>
              <Text style={local.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const local = StyleSheet.create({
  titleWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 6,
  },
  backButton: {
    position: "absolute",
    left: 0,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "600",
  },
  subtitleCenter: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#E1E1E1",
    borderRadius: 4,
    minHeight: 140,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#000000",
  },
  addRow: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  addButton: {
    backgroundColor: "#50C2C9",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000000",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  avatarBlock: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F2D6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7A3BB4",
  },
  studentName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
  },
  role: {
    fontSize: 10,
    color: "#555555",
  },
  date: {
    fontSize: 11,
    fontWeight: "600",
    color: "#000000",
  },
  question: {
    marginTop: 4,
    fontSize: 12,
    color: "#000000",
  },
  answer: {
    marginTop: 2,
    fontSize: 12,
    color: "#000000",
  },
});
