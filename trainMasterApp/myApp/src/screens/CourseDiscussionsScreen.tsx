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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";
import { useFocusEffect } from "@react-navigation/native";
import { CourseDiscussions, CreateCourseDiscussionBody } from "../services/types";
import { CourseDiscussionService } from "../services/courseDiscussion/courseDiscussion.service";
import { authService } from "../services/auth/auth.service";


type CourseDiscussionRouteProp = RouteProp<AprendizadoStackParamList, "CourseDiscussion">;

export default function CourseDiscussionsScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = !isDark ? "#000000" : "#FFFFFF";

  const nav = useNavigation<any>();

  const route = useRoute<CourseDiscussionRouteProp>();
  const { courseId, courseName } = route.params;


  const [message, setMessage] = React.useState("");
  const [discussions, setDiscussions] = React.useState<CourseDiscussions[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const response = await CourseDiscussionService.getAllFromCourseId(courseId);
      setDiscussions(response);
    } catch (error) {
      console.error("Erro ao carregar discussões", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDiscussions();
    }, [courseId])
  );



  const handleAddDiscussion = async () => {
    if (!message.trim()) return;
    const userId = authService.requireUserId();
    const body: CreateCourseDiscussionBody = {
      courseId,
      authorUserId: userId, // aqui ideal: pegar do user logado
      title: "Pergunta",
      content: message,
      isLocked: false,
    };

    try {
      await CourseDiscussionService.addDiscussion(body);
      setMessage("");
      loadDiscussions(); // recarrega a lista após criar
    } catch (error) {
      console.error("Erro ao criar discussão:", error);
    }
  };


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
            {courseName}
          </Text>
        </View>

        {/* Subtítulo “Discussões” */}
        <Text style={[local.subtitleCenter, { color: hardText }]}>Discussões</Text>

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
        <Text style={[local.sectionTitle, { marginTop: 24, color: hardText }]}>
          Perguntas mais frequentes :
        </Text>

        <View style={{ marginTop: 8 }}>
          {loading ? (
            <Text style={{ textAlign: "center", color: hardText }}>
              Carregando discussões...
            </Text>
          ) : discussions.length === 0 ? (
            <Text style={{ textAlign: "center", color: hardText }}>
              Nenhuma discussão encontrada.
            </Text>
          ) : (
            discussions.map((item) => (
              <View key={item.id} style={local.card}>
                <View style={local.cardHeader}>
                  <View style={local.avatarBlock}>
                    <View style={local.avatarCircle}>
                      <Text style={local.avatarInitial}>
                        {item.title.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 6 }}>
                      <Text style={local.studentName}>
                        Usuário #{item.authorUserId}
                      </Text>
                      <Text style={local.role}>Discussão</Text>
                    </View>
                  </View>
                </View>

                <Text style={local.question}>
                  {item.title}
                </Text>

                <Text style={local.answer}>
                  {item.content}
                </Text>
              </View>
            )
            )
          )
          }

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
