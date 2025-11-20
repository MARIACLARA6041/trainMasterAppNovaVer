import React from "react";
import { View, Text, Image, StyleSheet, Pressable, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppHeader from "../../components/header/AppHeader";
import { useAppTheme } from "../../components/theme/ThemeProvider";

export type Mode = "exam" | "exercise";

export type Option = { id: string; text: string, isCorrect:boolean };
export type Question = {
  id: string;
  title?: string;
  imageUrl?: string;
  statement: string;
  points:number;
  options: Option[];
  multiple?: boolean; // se não vier, será deduzido do mode
};


export type QuestionRunnerProps = {
  mode: Mode;
  title?: string;
  progress: { current: number; total: number };
  question: Question;
  selected: string[];
  onChangeSelected: (ids: string[]) => void;
  onPrev: () => void;
  onNext: () => void;
  // 👇 novos controles de navegação
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string; // ex.: "Próximo" | "Verificar"
  hidePrev?: boolean; // para esconder o botão "Anterior" no início, se quiser
};

export default function QuestionRunner({
  mode,
  title,
  progress,
  question,
  selected,
  onChangeSelected,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  nextLabel = "Próximo",
  hidePrev = false,
}: QuestionRunnerProps) {
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#0B0B0B" : "#EFF4F3";
  const cardBg = isDark ? "#111" : "#FFFFFF";
  const text = isDark ? "#fff" : "#111827";

  const multiple = question.multiple ?? (mode === "exercise");
  const percent = Math.max(0, Math.min(100, (progress.current / progress.total) * 100));

  const toggle = React.useCallback((id: string) => {
    let next: string[];

    if (multiple) {
      // múltipla escolha: add/remove
      next = selected.includes(id)
        ? selected.filter(x => x !== id)
        : [...selected, id];
    } else {
      // única escolha: seleciona ou limpa
      next = selected[0] === id ? [] : [id];
    }

    onChangeSelected(next);
  }, [multiple, selected, onChangeSelected]);

  const renderOption = ({ item }: { item: Option }) => {
    const isOn = selected.includes(item.id);
    return (
      <Pressable
        style={[st.opt, { backgroundColor: cardBg }]}
        onPress={() => toggle(item.id)}
        android_ripple={{ color: "#e5e7eb" }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityState={{ selected: isOn }}
      >
        <View
          style={[
            st.optCheck,
            { borderColor: "#CBD5E1", backgroundColor: isOn ? "#e9eafc" : "transparent" },
          ]}
        >
          {isOn ? <View style={st.optDot} /> : null}
        </View>
        <Text style={[st.optText,{ color: text, flex: 1, flexShrink: 1, flexWrap: "wrap" }]} numberOfLines={2}>
          {item.text}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[st.container, { backgroundColor: hardBg }]}>
      <AppHeader userName="Lydia" onLogout={() => { }} />

      <FlatList
        data={question.options}
        keyExtractor={(o) => o.id}
        renderItem={renderOption}
        extraData={{ selected, nextDisabled, prevDisabled, nextLabel, percent }}

        // 👇 quando muda a questão, reseta a lista inteira (garante estado fresco)
        key={question.id}

        // 👇 garante que toques funcionem mesmo com teclado aberto
        keyboardShouldPersistTaps="handled"
        // 🔹 Tudo que vem antes das opções entra no Header:
        ListHeaderComponent={
          <>
            <Text style={[st.screenTitle, { color: text }]}>
              {title ?? (mode === "exam" ? "Prova" : "Questões")}
            </Text>

            <View style={st.progressWrap}>
              <Text style={[st.progressLabel, { color: text }]}>Progresso</Text>
              <View style={st.progressBar}>
                <View style={[st.progressFill, { width: `${percent}%` }]} />
              </View>
              <Text style={[st.progressRight, { color: text }]}>
                {progress.current}/{progress.total}
              </Text>
            </View>

            <View style={[st.card, { backgroundColor: cardBg }]}>
              {!!question.imageUrl && (
                <Image source={{ uri: question.imageUrl }} style={st.image} resizeMode="cover" />
              )}
              <Text style={[st.statement, { color: text }]}>{question.statement}</Text>
            </View>
          </>
        }
        // 🔹 Botões embaixo como Footer (rolam junto também):
        ListFooterComponent={
          <View style={st.actions}>
            {!hidePrev && (

              <Pressable
                style={({ pressed }) => [st.btnGhost, prevDisabled && st.btnDisabled, pressed && st.btnPressed]}
                disabled={prevDisabled}
                onPress={onPrev}
                hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
                pressRetentionOffset={{ top: 8, right: 8, bottom: 8, left: 8 }}
                accessibilityRole="button"
              >
                <Ionicons pointerEvents="none" name="arrow-back" size={18} color={prevDisabled ? "#9CA3AF" : "#111827"} />
                <Text pointerEvents="none" style={[st.btnGhostText, prevDisabled && { color: "#9CA3AF" }]}>
                  Anterior
                </Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [st.btnPrimary, nextDisabled && st.btnDisabled, pressed && st.btnPressed]}
              disabled={nextDisabled}
              onPress={onNext}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              pressRetentionOffset={{ top: 8, right: 8, bottom: 8, left: 8 }}
              accessibilityRole="button"
            >
              <Text pointerEvents="none" style={[st.btnPrimaryText, nextDisabled && { color: "#9CA3AF" }]}>
                {nextLabel}
              </Text>
              <Ionicons pointerEvents="none" name="arrow-forward" size={18} color={nextDisabled ? "#9CA3AF" : "#111827"} />
            </Pressable>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        // Qualidade de scroll melhor
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  screenTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 8,
  },
  progressWrap: { paddingHorizontal: 16, marginTop: 4, marginBottom: 12 },
  progressLabel: { fontWeight: "700", marginBottom: 6 },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#f6e7a9",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#f0c44c" },
  progressRight: { textAlign: "right", fontWeight: "700", marginTop: 4 },

  card: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  image: { width: "100%", height: 150, borderRadius: 10, marginBottom: 8 },
  statement: { fontSize: 14, fontWeight: "600" },

  opt: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  optCheck: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#2b2f6b" },
  optText: { fontWeight: "700" },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    minHeight: 44,
    marginBottom: 90,
    marginTop: 30
  },
  btnGhost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 24,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnGhostText: { color: "#111827", fontWeight: "800", marginLeft: 6 },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F4C241",
    borderRadius: 24,
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  btnPrimaryText: { color: "#111827", fontWeight: "800", marginRight: 6 },

  btnDisabled: { opacity: 0.6 },
  btnPressed: { opacity: 0.7 },
});