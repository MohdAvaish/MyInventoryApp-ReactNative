import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'; 
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

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You are not logged in!');
      router.replace('/login');
      return;
    }

    try {
      if (isEdit) {
        const itemRef = doc(db, 'stock', params.id);
        await updateDoc(itemRef, {
          name: itemName,
          stock: parseInt(stockAmt),
        });
        Alert.alert('Success', 'Item updated successfully.');
      } else {
        await addDoc(collection(db, 'stock'), {
          name: itemName,
          stock: parseInt(stockAmt),
          userId: user.uid,
        });
        Alert.alert('Success', 'Item added successfully.');
      }
      router.back(); 
    } catch (e) {
      console.error('Error adding/updating document: ', e);
      Alert.alert('Error', 'Failed to save item. Check permissions.');
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});