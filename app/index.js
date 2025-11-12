// app/index.js
import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { db } from '../firebaseConfig'; // Firebase config ko import kiya
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; // Firebase functions
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state add kiya

  // Yeh function ab real-time mein data sunega
  useEffect(() => {
    setLoading(true);
    // 'stock' collection ko suno
    const unsubscribe = onSnapshot(collection(db, 'stock'), (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        // id ko data ke saath merge karo
        items.push({ id: doc.id, ...doc.data() });
      });
      setStockList(items);
      setLoading(false);
    });

    // Cleanup function (jab component band ho)
    return () => unsubscribe();
  }, []); // [] ka matlab yeh sirf ek baar run hoga

  const deleteItem = async (id) => {
    try {
      // AsyncStorage ki jagah ab Firestore se delete karenge
      await deleteDoc(doc(db, 'stock', id));
      Alert.alert('Success', 'Item deleted successfully.');
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemStock}>{item.stock}</Text>
      <Link
        href={{
          pathname: '/create',
          params: { id: item.id }, // Edit karne ke liye ID bhej rahe hain
        }}
        asChild>
        <Pressable style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
      </Link>
      <Pressable onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard (Cloud)</Text>
      <Link href="/create" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.buttonText}>ADD ITEM IN STOCK</Text>
        </Pressable>
      </Link>

      <Text style={styles.headingText}>All Items in the stock</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={stockList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No items in stock.</Text>}
        />
      )}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCCCC',
    backgroundColor: '#F9F9F9',
    marginBottom: 5,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    flex: 2,
  },
  itemStock: {
    fontSize: 18,
    flex: 1,
    color: 'green',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});