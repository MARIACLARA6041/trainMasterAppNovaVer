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
import { CourseNoteService } from "../services/courseNote/courseNote.service";
import { CourseNote, CreateCourseNote } from "../services/types";
import { useFocusEffect } from "@react-navigation/native";
import { authService } from "../services/auth/auth.service";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";


type CourseNotesRouteProp = RouteProp<AprendizadoStackParamList, "CourseNotes">;


export default function CourseNotesScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = !isDark ? "#000000" : "#FFFFFF";
  const nav = useNavigation<any>();
  const route = useRoute<CourseNotesRouteProp>();
  const { courseId, courseName } = route.params;

  const [noteText, setNoteText] = React.useState("");
  const [notes, setNotes] = React.useState<CourseNote[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await CourseNoteService.getAllFromCourseId(courseId);
      setNotes(data);
    } catch (error) {
      console.error("Erro ao carregar anotações:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };


  async function handleAddNote() {
    const trimmed = noteText.trim();
    if (!trimmed || !courseId) return;
    const userId = authService.requireUserId();
    const payload: CreateCourseNote = {
      courseId: courseId,
      studentId: userId, // 👉 ideal trocar por id real do usuário logado
      title: "Anotação",
      content: trimmed,
      isPrivate: true,
    };

    try {
      await CourseNoteService.addDiscussion(payload);
      setNoteText("");
      loadNotes(); // recarrega lista após salvar
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      if (courseId) {
        loadNotes();
      }
    }, [courseId])
  );


  return (
    <View style={{ flex: 1, backgroundColor: hardBg }}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <ScrollView
        contentContainerStyle={[s.body, s.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Título do curso + botão Voltar (título realmente centralizado) */}
        <View style={local.titleWrapper}>
          <Pressable style={local.backButton} onPress={() => nav.goBack()}>
            <Text style={local.backButtonText}>Voltar</Text>
          </Pressable>

          <Text style={[s.overviewTitle, { color: hardText }]}>
            {courseName}
          </Text>
        </View>

        {/* Subtítulo “+ Anotações” */}
        <Text style={[local.subtitleCenter, { marginBottom: 16 ,color: hardText }]}>
          + Anotações
        </Text>

        {/* Caixa de texto para nova anotação */}
        <TextInput
          style={local.noteInput}
          placeholder="Digite aqui sua anotação..."
          placeholderTextColor="#777777"
          multiline
          textAlignVertical="top"
          value={noteText}
          onChangeText={setNoteText}
        />

        {/* Botão Adicionar alinhado à direita */}
        <View style={local.addRow}>
          <TouchableOpacity
            style={local.addButton}
            onPress={handleAddNote}
          >
            <Text style={local.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de anotações */}
        <Text style={[local.sectionTitle, { marginTop: 24 ,color: hardText }]}>
          Anotações :
        </Text>

        <View style={{ marginTop: 8 }}>
          {loading ? (
            <Text style={{ textAlign: "center", color: hardText }}>
              Carregando anotações...
            </Text>
          ) : notes.length === 0 ? (
            <Text style={{ textAlign: "center", color: hardText }}>
              Nenhuma anotação ainda.
            </Text>
          ) : (
            notes.map((note) => (
              <View key={note.id} style={local.noteCard}>
                <View style={local.noteCardHeader}>
                  <Text style={local.noteText}>{note.content}</Text>
                  <Text style={local.noteDate}>
                    {new Date(note.createdAt).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </View>
            ))
          )}

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
    marginBottom: 4,
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
  },

  noteInput: {
    marginTop: 8,
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

  noteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#000000",
  },
  noteDate: {
    marginLeft: 12,
    fontSize: 11,
    color: "#000000",
    fontWeight: "600",
  },
});
