import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform, ToastAndroid } from "react-native";
import Toast from "react-native-root-toast";
import { ThemeContext } from "../ThemeContext";

import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Subject = {
  name: string;
  marks: string[];  //stores as string
};

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", marks: [""] },
  ]);

  const STORAGE_KEY = "student-subjects";

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          const parsed = JSON.parse(jsonValue);
          setSubjects(parsed);
        }
      } catch (e) {
        console.error("Failed to load subjects:", e);
      }
    };
    loadSubjects();
  }, []);

  useEffect(() => {
    const saveSubjects = async () => {
      try {
        const jsonValue = JSON.stringify(subjects);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      } catch (e) {
        console.error("Failed to save subjects:", e);
      }
    };
    saveSubjects();
  }, [subjects]);

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: "", marks: [""] }]);
  };

  const handleChangeSubjectName = (index: number, value: string) => {
    const updated = [...subjects];
    updated[index].name = value;
    setSubjects(updated);
  };

  const handleChangeMark = (
    subjectIndex: number,
    markIndex: number,
    value: string
  ) => {
    const updated = [...subjects];
    const marks = updated[subjectIndex].marks;

    if (value === "") {
      marks.splice(markIndex, 1);

      if (marks.length === 0) {
        marks.push("");
      }
    } else {
      if (!/^\d{0,2}(\.\d{0,2})?$/.test(value)) return;

      const numericValue = parseFloat(value);

      if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 10) {
        marks[markIndex] = value;
      }
    }

    updated[subjectIndex].marks = marks;
    setSubjects(updated);
  };

  const handleAddMark = (subjectIndex: number) => {
    const updated = [...subjects];
    updated[subjectIndex].marks.push("");
    setSubjects(updated);
  };

  const calculateSubjectAverage = (marks: string[]) => {
    const validMarks = marks
      .map((m) => parseFloat(m))
      .filter((m) => !isNaN(m) && m >= 0 && m <= 10);
    if (validMarks.length === 0) return null;
    const sum = validMarks.reduce((a, b) => a + b, 0);
    return sum / validMarks.length;
  };

  const calculateOverallAverage = () => {
    const subjectAverages = subjects
      .map((s) => calculateSubjectAverage(s.marks))
      .filter((avg) => avg !== null) as number[];

    if (subjectAverages.length === 0) return "N/A";

    const total = subjectAverages.reduce((a, b) => a + b, 0);
    return (total / subjectAverages.length).toFixed(2);
  };

  const handleReset = () => {
    Alert.alert(
      "Confirm Reset",
      "Are you sure you want to delete all subjects and marks?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setSubjects([{ name: "", marks: [""] }]);

              if (Platform.OS === "android") {
                ToastAndroid.show("Data Reset!", ToastAndroid.SHORT);
              } else {
                Toast.show("Data Reset!", {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM,
                });
              }
            } catch (e) {
              console.error("Failed to reset data:", e);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDark ? styles.darkBackground : styles.lightBackground,
      ]}
      style={isDark ? { backgroundColor: "#222" } : { backgroundColor: "#fff" }}
    >
      <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
        Marks average
      </Text>

      {subjects.map((subject, subjIndex) => (
        <View
          key={subjIndex}
          style={[
            styles.subjectContainer,
            isDark && { borderBottomColor: "#555" },
          ]}
        >
          <TextInput
            placeholder="Subject Name"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={subject.name}
            onChangeText={(text) => handleChangeSubjectName(subjIndex, text)}
            style={[
              styles.input,
              isDark && {
                backgroundColor: "#333",
                color: "#fff",
                borderColor: "#555",
              },
            ]}
          />

          {subject.marks.map((mark, markIndex) => (
            <TextInput
              key={markIndex}
              placeholder={`Mark ${markIndex + 1}`}
              placeholderTextColor={isDark ? "#aaa" : "#888"}
              value={mark}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleChangeMark(subjIndex, markIndex, text)
              }
              style={[
                styles.input,
                isDark && {
                  backgroundColor: "#333",
                  color: "#fff",
                  borderColor: "#555",
                },
                mark !== "" &&
                  !/^\d{1,2}(\.\d{1,2})?$/.test(mark) && {
                    borderColor: "red",
                  },
              ]}
            />
          ))}

          <Button
            title="Add Another Mark"
            onPress={() => handleAddMark(subjIndex)}
            color={isDark ? "#bbb" : undefined}
          />

          <Text style={[styles.subjectAverage, isDark && { color: "#ccc" }]}>
            Average:{" "}
            {(() => {
              const avg = calculateSubjectAverage(subject.marks);
              return avg !== null ? avg.toFixed(2) : "N/A";
            })()}
          </Text>
        </View>
      ))}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Add Another Subject"
          onPress={handleAddSubject}
          color={isDark ? "#bbb" : undefined}
        />
        <View style={{ height: 10 }} />
        <Button title="Reset All" color="red" onPress={handleReset} />
      </View>

      <Text style={[styles.overallAverage, isDark && { color: "#eee" }]}>
        Overall Average: {calculateOverallAverage()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subjectContainer: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    color: "#000",
    backgroundColor: "#fff",
  },
  subjectAverage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
    color: "#000",
  },
  overallAverage: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  darkBackground: {
    backgroundColor: "#222",
  },
  lightBackground: {
    backgroundColor: "#fff",
  },
  textDark: {
    color: "#000",
  },
  textLight: {
    color: "#fff",
  },
});
