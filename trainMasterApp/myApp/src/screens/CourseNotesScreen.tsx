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

type Note = {
  id: string;
  text: string;
  date: string; // dd/mm/aaaa
};

export default function CourseNotesScreen() {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000000" : "#FFFFFF";
  const hardText = "#000000"; // essa tela é clarinha
  const nav = useNavigation<any>();
  const route = useRoute<any>();

  const course = route.params?.course;

  const [noteText, setNoteText] = React.useState("");
  const [notes, setNotes] = React.useState<Note[]>([
    { id: "1", text: "Primeira anotação", date: "10/05/2022" },
    { id: "2", text: "Segunda anotação", date: "02/05/2022" },
    { id: "3", text: "Terceira anotação", date: "01/05/2025" },
  ]);

  function handleAddNote() {
    const trimmed = noteText.trim();
    if (!trimmed) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString("pt-BR"); // dd/mm/aaaa

    const newNote: Note = {
      id: String(Date.now()),
      text: trimmed,
      date: dateStr,
    };

    setNotes((prev) => [newNote, ...prev]); // adiciona no topo
    setNoteText("");
  }

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
            {course?.name ?? "Fundamentos da Web"}
          </Text>
        </View>

        {/* Subtítulo “+ Anotações” */}
        <Text style={[local.subtitleCenter, { marginBottom: 16 }]}>
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
        <Text style={[local.sectionTitle, { marginTop: 24 }]}>
          Anotações :
        </Text>

        <View style={{ marginTop: 8 }}>
          {notes.map((note) => (
            <View key={note.id} style={local.noteCard}>
              <View style={local.noteCardHeader}>
                <Text style={local.noteText}>{note.text}</Text>
                <Text style={local.noteDate}>{note.date}</Text>
              </View>
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
