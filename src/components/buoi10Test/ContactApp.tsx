
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

type Contact = { id: number; name: string; phone: string };

const ContactApp = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Linh", phone: "0889333444" },
    { id: 2, name: "Hung", phone: "883920542" },
    { id: 3, name: "Thanh", phone: "32532526" },
    { id: 4, name: "Mai", phone: "0912345678" },
    { id: 5, name: "An", phone: "0977111222" },
  ]);

  const [searchText, setSearchText] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // 🟡 Lọc danh sách liên hệ theo tên
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 🟣 Chọn liên hệ để sửa
  const handleEdit = (id: number) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setEditId(id);
      setName(contact.name);
      setPhone(contact.phone);
    }
  };

  // 🟢 Lưu sửa liên hệ
  const handleSaveEdit = () => {
    if (editId === null) return;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === editId ? { ...c, name: name.trim(), phone: phone.trim() } : c
      )
    );
    setEditId(null);
    setName("");
    setPhone("");
  };

  // 🟩 Thêm liên hệ mới
  const handleAddContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ tên và số điện thoại!");
      return;
    }

    const newContact: Contact = {
      id: contacts.length ? contacts[contacts.length - 1].id + 1 : 1,
      name: name.trim(),
      phone: phone.trim(),
    };

    setContacts((prev) => [...prev, newContact]); // ✅ Cập nhật mảng
    setName("");
    setPhone("");
  };

  // 🔴 Xóa liên hệ
  const handleDelete = (id: number) => {
    Alert.alert("Xóa liên hệ", "Bạn có chắc muốn xóa liên hệ này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () =>
          setContacts((prev) => prev.filter((contact) => contact.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📒 Quản Lý Danh Bạ </Text>

      {/* Ô nhập tên và số điện thoại */}
      <TextInput
        style={styles.input}
        placeholder="🌸 Nhập tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="📱 Nhập số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Nút thêm hoặc lưu sửa */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: editId ? "#fcb900" : "#ff66b2" },
        ]}
        onPress={editId ? handleSaveEdit : handleAddContact}
      >
        <Text style={styles.addText}>{editId ? "💾 LƯU" : "+ THÊM"}</Text>
      </TouchableOpacity>

      {/* Ô tìm kiếm */}
      <TextInput
        style={styles.search}
        placeholder="🔍 Tìm kiếm..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Danh sách liên hệ */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isMatch =
            searchText.trim() !== "" &&
            item.name.toLowerCase().includes(searchText.toLowerCase());
          return (
            <View style={[styles.card, isMatch && styles.highlightCard]}>
              <Text style={[styles.cardText, isMatch && styles.highlightText]}>
                👤 {item.name} - {item.phone}
              </Text>

              <View style={styles.actionContainer}>
                {/* Nút sửa */}
                <TouchableOpacity
                  onPress={() => handleEdit(item.id)}
                  style={styles.editButton}
                >
                  <Text style={{ fontSize: 18 }}>✏️</Text>
                </TouchableOpacity>

                {/* Nút xóa */}
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ContactApp;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffe6f2", padding: 20 },
  title: {
    fontSize: 26,
    textAlign: "center",
    color: "#ff4da6",
    fontWeight: "700",
    marginVertical: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ffccdf",
  },
  addButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  addText: { color: "#fff", fontWeight: "700" },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#ffd6eb",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: { color: "#333", fontSize: 16 },
  actionContainer: { flexDirection: "row" },
  editButton: { paddingHorizontal: 8 },
  deleteButton: { paddingHorizontal: 8 },
  highlightCard: {
    backgroundColor: "#ee59a3ff",
    borderWidth: 2,
    borderColor: "#ff4da6",
  },
  highlightText: { fontWeight: "700", color: "#fffbfdff" },
});
