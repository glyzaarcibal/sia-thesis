// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Button,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import DatePicker from "react-native-modern-datepicker";
// import { getToday } from "react-native-modern-datepicker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useAuth } from "../../../context/AuthContext";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { default as Text } from "../../../components/CustomText";
// import BoldText from "../../../components/BoldText";
// import { useSelector } from "react-redux";

// const generateHourOptions = () =>
//   Array.from({ length: 12 }, (_, i) => (i + 1).toString());
// const generateMinuteOptions = () => ["00", "15", "30", "45"];

// // Using destructuring with default value for onUpdateReport prop
// const SleepTracker = ({ onUpdateReport = () => {}, navigation }) => {
//   const today = getToday(); // Returns a string in "YYYY/MM/DD" format
//   const [selectedDate, setSelectedDate] = useState(today);
//   const [isOpen, setIsOpen] = useState(false);

//   const [sleepHour, setSleepHour] = useState("10");
//   const [sleepMinute, setSleepMinute] = useState("00");
//   const [sleepPeriod, setSleepPeriod] = useState("PM");
//   const [wakeHour, setWakeHour] = useState("06");
//   const [wakeMinute, setWakeMinute] = useState("00");
//   const [wakePeriod, setWakePeriod] = useState("AM");
//   const user = useSelector((state) => state.user.user);

//   const [sleepData, setSleepData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { axiosInstanceWithBearer } = useAuth();

//   const loadSleepData = async () => {
//     try {
//       const response = await axiosInstanceWithBearer.get(
//         `/sleep-tracker/user/${user.id}/`
//       );
//       console.log("Loaded Sleep Data:", response.data); // Debug log

//       if (response.data) {
//         // Sort by date in descending order (latest first)
//         const sortedHistory = response.data.sort(
//           (a, b) => new Date(b.date) - new Date(a.date)
//         );
//         setSleepData(sortedHistory);
//       }
//     } catch (error) {
//       console.error("Error loading sleep history:", error);
//     }
//   };

//   useEffect(() => {
//     loadSleepData().then(() => setLoading(false));
//   }, []);

//   const calculateDuration = () => {
//     const parseTime = (hour, minute, period) => {
//       let h = parseInt(hour, 10);
//       let m = parseInt(minute, 10);
//       if (period === "PM" && h !== 12) h += 12;
//       if (period === "AM" && h === 12) h = 0;
//       return h * 60 + m;
//     };
//     let sleepMinutes = parseTime(sleepHour, sleepMinute, sleepPeriod);
//     let wakeMinutes = parseTime(wakeHour, wakeMinute, wakePeriod);
//     if (wakeMinutes < sleepMinutes) wakeMinutes += 24 * 60;
//     const durationMinutes = wakeMinutes - sleepMinutes;
//     const hours = Math.floor(durationMinutes / 60);
//     const minutes = durationMinutes % 60;
//     return `${hours}h ${minutes}m`;
//   };

//   const saveSleepData = async () => {
//     try {
//       console.log("Starting to save sleep data...");
//       console.log("Input values:", {
//         selectedDate,
//         sleepHour,
//         sleepMinute,
//         sleepPeriod,
//         wakeHour,
//         wakeMinute,
//         wakePeriod,
//       });

//       const formattedDate = selectedDate.replace(/\//g, "-");
//       console.log("Formatted date:", formattedDate);

//       const requestPayload = {
//         date: formattedDate,
//         sleep_time: `${sleepHour}:${sleepMinute} ${sleepPeriod}`,
//         wake_time: `${wakeHour}:${wakeMinute} ${wakePeriod}`,
//         duration: calculateDuration(),
//       };

//       console.log("Request payload:", JSON.stringify(requestPayload, null, 2));
//       console.log("Sending request to endpoint:", "/sleep-tracker/");

//       const response = await axiosInstanceWithBearer.post(
//         "/sleep-tracker/",
//         requestPayload
//       );

//       console.log("Sleep data saved successfully");
//       console.log("Response status:", response.status);
//       console.log("Response data:", JSON.stringify(response.data, null, 2));

//       loadSleepData();
//       if (onUpdateReport) onUpdateReport();
//     } catch (error) {
//       console.error("=== Error saving sleep data ===");
//       console.error("Error object:", error);

//       // Log the error response data if available
//       if (error.response) {
//         console.error("Response status:", error.response.status);
//         console.error("Response headers:", error.response.headers);
//         console.error(
//           "Response data:",
//           JSON.stringify(error.response.data, null, 2)
//         );
//       }

//       // Log the request that caused the error
//       if (error.config) {
//         console.error("Request URL:", error.config.url);
//         console.error("Request method:", error.config.method);
//         console.error(
//           "Request headers:",
//           JSON.stringify(error.config.headers, null, 2)
//         );
//         console.error("Request data:", error.config.data);
//       }

//       // Log if it's a network error
//       if (error.request && !error.response) {
//         console.error("Network error - No response received");
//         console.error("Request details:", error.request);
//       }

//       // Log if it's another type of error
//       if (!error.response && !error.request) {
//         console.error("Error message:", error.message);
//         console.error("Error stack:", error.stack);
//       }

//       // You might want to display an error message to the user
//       // Example: setErrorMessage("Failed to save sleep data. Please try again.");
//     }
//   };

//   const deleteEntry = async (id) => {
//     const updatedHistory = sleepData.filter((entry) => entry.id !== id);
//     setSleepData(updatedHistory); // Fixed function name typo here
//     await AsyncStorage.setItem("sleepData", JSON.stringify(updatedHistory));
//     if (onUpdateReport) onUpdateReport(updatedHistory);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={{ marginBottom: 10 }}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <AntDesign name="arrowleft" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
//       <BoldText style={styles.title}>Sleep Tracker</BoldText>
//       <Text style={{ fontSize: 18, marginBottom: 10 }}>
//         Selected Date: {selectedDate}
//       </Text>

//       {/* Date Picker */}
//       <DatePicker
//         mode="calendar"
//         selected={selectedDate}
//         onDateChange={(date) => setSelectedDate(date)} // ✅ Updates selectedDate
//         options={{
//           backgroundColor: "#fff",
//           textHeaderColor: "#66BB6A",
//           textDefaultColor: "#000",
//           selectedTextColor: "#fff",
//           mainColor: "#66BB6A",
//           textSecondaryColor: "#aaa",
//         }}
//       />

//       <Text style={styles.text}>Sleep Time:</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={sleepHour}
//           onValueChange={setSleepHour}
//           style={styles.picker}
//         >
//           {generateHourOptions().map((hour) => (
//             <Picker.Item key={hour} label={hour} value={hour} />
//           ))}
//         </Picker>
//         <Picker
//           selectedValue={sleepMinute}
//           onValueChange={setSleepMinute}
//           style={styles.picker}
//         >
//           {generateMinuteOptions().map((minute) => (
//             <Picker.Item key={minute} label={minute} value={minute} />
//           ))}
//         </Picker>
//         <Picker
//           selectedValue={sleepPeriod}
//           onValueChange={setSleepPeriod}
//           style={styles.picker}
//         >
//           <Picker.Item label="AM" value="AM" />
//           <Picker.Item label="PM" value="PM" />
//         </Picker>
//       </View>

//       <Text style={styles.text}>Wake Time:</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={wakeHour}
//           onValueChange={setWakeHour}
//           style={styles.picker}
//         >
//           {generateHourOptions().map((hour) => (
//             <Picker.Item key={hour} label={hour} value={hour} />
//           ))}
//         </Picker>
//         <Picker
//           selectedValue={wakeMinute}
//           onValueChange={setWakeMinute}
//           style={styles.picker}
//         >
//           {generateMinuteOptions().map((minute) => (
//             <Picker.Item key={minute} label={minute} value={minute} />
//           ))}
//         </Picker>
//         <Picker
//           selectedValue={wakePeriod}
//           onValueChange={setWakePeriod}
//           style={styles.picker}
//         >
//           <Picker.Item label="AM" value="AM" />
//           <Picker.Item label="PM" value="PM" />
//         </Picker>
//       </View>

//       <Text style={styles.text}>Sleep Duration: {calculateDuration()}</Text>
//       <Button title="Save Sleep Data" onPress={saveSleepData} color="#66BB6A" />

//       <Text style={styles.historyTitle}>Sleep History</Text>

//       {loading ? (
//         <Text>Loading...</Text>
//       ) : (
//         <ScrollView style={styles.table} nestedScrollEnabled>
//           <View style={styles.row}>
//             <Text style={styles.headerCell}>Date</Text>
//             <Text style={styles.headerCell}>Sleep Time</Text>
//             <Text style={styles.headerCell}>Wake Time</Text>
//             <Text style={styles.headerCell}>Duration</Text>
//           </View>
//           {sleepData.length > 0 ? (
//             sleepData.map((entry) => (
//               <View key={entry.id} style={styles.row}>
//                 <Text style={styles.cell}>{entry.date}</Text>
//                 <Text style={styles.cell}>{entry.sleep_time}</Text>
//                 <Text style={styles.cell}>{entry.wake_time}</Text>
//                 <Text style={styles.cell}>{entry.duration}</Text>
//               </View>
//             ))
//           ) : (
//             <Text>No sleep history found.</Text>
//           )}
//         </ScrollView>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 24, textAlign: "center" },
//   pickerContainer: { flexDirection: "row" },
//   picker: { flex: 1 },
//   table: { marginTop: 10, borderWidth: 1, marginBottom: 20 },
//   row: { flexDirection: "row", borderBottomWidth: 1, padding: 5 },
//   cell: { flex: 1, textAlign: "center" },
//   headerCell: { flex: 1, fontWeight: "bold", textAlign: "center" },
//   text: { marginTop: 10, marginBottom: 5 },
//   historyTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 20,
//     marginBottom: 10,
//   },
// });

// export default SleepTracker;
