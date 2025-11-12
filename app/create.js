// app/create.js
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../firebaseConfig'; // Firebase config ko import kiya
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'; // Firebase functions
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateScreen() {
  const [itemName, setItemName] = useState('');
  const [stockAmt, setStockAmt] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.id) {
      setIsEdit(true);
      loadItemData(params.id);
    }
  }, [params.id]);

  const loadItemData = async (id) => {
    try {
      // AsyncStorage ki jagah ab Firestore se item fetch karenge
      const docRef = doc(db, 'stock', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const item = docSnap.data();
        setItemName(item.name);
        setStockAmt(item.stock.toString());
      } else {
        console.log('No such document!');
      }
    } catch (e) {
      console.error('Error loading document: ', e);
    }
  };

  const AddItemHandler = async () => {
    if (!itemName || !stockAmt) {
      Alert.alert('Error', 'Please fill both fields.');
      return;
    }

    try {
      if (isEdit) {
        // Edit waala logic (Update)
        const itemRef = doc(db, 'stock', params.id);
        await updateDoc(itemRef, {
          name: itemName,
          stock: parseInt(stockAmt),
        });
        Alert.alert('Success', 'Item updated successfully.');
      } else {
        // Naya item add karne ka logic (Add)
        await addDoc(collection(db, 'stock'), {
          name: itemName,
          stock: parseInt(stockAmt),
        });
        Alert.alert('Success', 'Item added successfully.');
      }
      router.back(); // Waapas Home screen par jao
    } catch (e) {
      console.error('Error adding/updating document: ', e);
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
        keyboardType="numeric"
      />
      <Pressable style={styles.addButton} onPress={AddItemHandler}>
        <Text style={styles.buttonText}>
          {isEdit ? 'EDIT ITEM IN STOCK' : 'ADD ITEM IN STOCK'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

// Styles (Styles mein koi badlaav nahi hai)
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