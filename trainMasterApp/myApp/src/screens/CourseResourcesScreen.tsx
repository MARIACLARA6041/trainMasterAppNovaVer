import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from "react-native";
import AppHeader from "../components/header/AppHeader";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../components/theme/ThemeProvider";
import { AprendizadoStackParamList } from "../components/navigation/RootTabs";
import { CourseResource } from "../services";
import { CourseResources } from "../services/courseResources/courseResources.service";

type CourseResourcesRouteProp = RouteProp<AprendizadoStackParamList, "CourseResources">;


export default function CourseResourcesScreen() {
    const navigate = useNavigation();
    const { theme } = useAppTheme();
    const isDark = theme.name === "dark";
    const hardBg = isDark ? "#000" : "#F3F6F6";
    const hardText = isDark ? "#FFF" : "#000";

    const route = useRoute<CourseResourcesRouteProp>();
    const { courseId, courseName } = route.params;
    const [loading, setLoading] = useState(true);
    const [itens, setItens] = useState<CourseResource[]>([])

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const itens = await CourseResources.getAllByUserId(15);
                    setItens(itens);
                } catch (error) {
                    console.error("Erro ao carregar dados:", error);
                    setItens([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [])
    );

    const handleDownload = async (resourceId: number) => {
        try {
            const url = CourseResources.downloadResource(courseId, resourceId);
            const canOpen = await Linking.canOpenURL(url);
            if (!canOpen) {
                console.log("Não foi possível abrir a URL:", url);
                return;
            }
            await Linking.openURL(url);
        } catch (error) {
            console.error("Erro ao abrir recurso:", error);
        }
    };

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
                        {courseName}
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

                <View style={{ marginTop: 10 }}>
                    {loading ? (
                        <Text style={{ textAlign: "center", color: hardText }}>
                            Carregando recursos...
                        </Text>
                    ) : itens.length === 0 ? (
                        <Text style={{ textAlign: "center", color: hardText }}>
                            Nenhum recurso disponível ainda.
                        </Text>
                    ) : (
                        itens.map((item) => (
                            <View key={item.id} style={local.row}>
                                <View style={local.bulletContainer}>
                                    <Text style={local.bullet}>•</Text>

                                    <View>
                                        <Text style={[local.itemText, { color: hardText }]}>
                                            {item.title}
                                        </Text>

                                        {!!item.description && (
                                            <Text style={local.itemDescription}>
                                                {item.description}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <Pressable onPress={() => handleDownload(item.id)}>
                                    <Ionicons
                                        name="download-outline"
                                        size={22}
                                        color={hardText}
                                    />
                                </Pressable>
                            </View>
                        ))
                    )}
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
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
        color: "#0f172a",
        marginTop: 12,
        marginBottom: 8,
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

    itemDescription: {
        fontSize: 12,
        color: "#666",
    },
});
