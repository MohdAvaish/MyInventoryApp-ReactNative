// app/create.js
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateScreen() {
  const [itemName, setItemName] = useState('');
  const [stockAmt, setStockAmt] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter(); // Page badalne ke liye
  const params = useLocalSearchParams(); // Home screen se bheji hui ID lene ke liye

  useEffect(() => {
    // Agar params mein ID hai, matlab hum 'Edit' kar rahe hain
    if (params.id) {
      setIsEdit(true);
      loadItemData(params.id);
    }
  }, [params.id]);

  // Edit karne ke liye puraana data load karna
  const loadItemData = async (id) => {
    try {
      const jsonValue = await AsyncStorage.getItem('@stockList');
      const list = JSON.parse(jsonValue);
      const itemToEdit = list.find((item) => item.id === id);
      if (itemToEdit) {
        setItemName(itemToEdit.name);
        setStockAmt(itemToEdit.stock.toString());
      }
    } catch (e) {
      console.error('Failed to load item for edit.', e);
    }
  };

  const AddItemHandler = async () => {
    if (!itemName || !stockAmt) {
      Alert.alert('Error', 'Please fill both fields.');
      return;
    }

    try {
      const newItem = {
        id: isEdit ? params.id : Date.now().toString(), // Agar edit hai toh puraani ID, warna nayi
        name: itemName,
        stock: parseInt(stockAmt), // Number mein badal kar
      };

      const jsonValue = await AsyncStorage.getItem('@stockList');
      let list = jsonValue ? JSON.parse(jsonValue) : [];

      if (isEdit) {
        // Edit waala logic
        list = list.map((item) => (item.id === params.id ? newItem : item));
      } else {
        // Naya item add karne ka logic
        list.push(newItem);
      }

      const updatedJsonValue = JSON.stringify(list);
      await AsyncStorage.setItem('@stockList', updatedJsonValue);

      Alert.alert('Success', `Item ${isEdit ? 'updated' : 'added'} successfully.`);
      router.back(); // Waapas Home screen par jao
    } catch (e) {
      console.error('Failed to save item.', e);
      Alert.alert('Error', 'Failed to save item.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Item' : 'Add New Item'}</Text>
      
      <TextInput
        placeholder="Enter item name..."
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter stock amount..."
        value={stockAmt}
        onChangeText={setStockAmt}
        style={styles.input}
        keyboardType="numeric" // Taki sirf number keypad khule
      />
      <Pressable style={styles.addButton} onPress={AddItemHandler}>
        <Text style={styles.buttonText}>
          {isEdit ? 'EDIT ITEM IN STOCK' : 'ADD ITEM IN STOCK'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});