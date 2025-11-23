import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import AppHeader from "../components/header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { styles as s } from "./styles";

export default function CourseResourcesScreen() {
  const navigate = useNavigation();
  const { theme } = useAppTheme();
  const isDark = theme.name === "dark";
  const hardBg = isDark ? "#000" : "#F3F6F6";
  const hardText = isDark ? "#FFF" : "#000";

  return (
    <View style={[local.container, { backgroundColor: hardBg }]}>
      <AppHeader userName="Lydia" onLogout={() => console.log("Sair")} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TÍTULO CENTRAL COM BOTÃO VOLTAR */}
        <View style={local.titleWrapper}>
          <Pressable
            onPress={() => navigate.goBack()}
            style={local.backButton}
          >
            <Text style={local.backButtonText}>Voltar</Text>
          </Pressable>

          <Text style={[local.courseTitle, { color: hardText }]}>
            Fundamentos da Web
          </Text>
        </View>

        {/* Subtítulo */}
        <Text style={[local.subtitle, { color: hardText }]}>Recursos</Text>

        <Text style={[local.description, { color: hardText }]}>
          Aqui você pode encontrar todos os arquivos disponibilizados
          pelo instrutor para fazer o download
        </Text>

        {/* Material de apoio */}
        <Text style={[local.sectionTitle, { color: hardText }]}>
          Material de apoio:
        </Text>

        {/* LISTA */}
        <View style={{ marginTop: 10 }}>
          {[
            "Artigos",
            "Slides das aulas",
            "Material complementar",
          ].map((item) => (
            <View key={item} style={local.row}>
              <View style={local.bulletContainer}>
                <Text style={local.bullet}>•</Text>
                <Text style={[local.itemText, { color: hardText }]}>
                  {item}
                </Text>
              </View>

              <Ionicons
                name="download-outline"
                size={22}
                color={hardText}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const local = StyleSheet.create({
  container: {
    flex: 1,
  },

  titleWrapper: {
    marginTop: 10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  backButton: {
    position: "absolute",
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#C4C4C4",
    borderRadius: 6,
  },

  backButtonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "600",
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 4,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 26,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 26,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    paddingVertical: 12,
  },

  bulletContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  bullet: {
    fontSize: 22,
    marginRight: 8,
    marginTop: -4,
  },

  itemText: {
    fontSize: 14,
  },
});
