// app/index.js
import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { db, auth } from '../firebaseConfig'; 
import { signOut } from 'firebase/auth'; 
import { collection, onSnapshot, deleteDoc, doc, query, where } from 'firebase/firestore'; // query aur where ko import kiya
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    // Check karo ki user login hai ya nahi
    const user = auth.currentUser;
    if (user) {
      setLoading(true);

      // Naya Kadam: Ek query (sawaal) banao
      // 'stock' collection mein jao, lekin sirf woh documents lao
      // 'jahaan' (where) 'userId' field current user ki ID ke barabar ho
      const q = query(collection(db, 'stock'), where("userId", "==", user.uid));

      // Ab poori collection ki jagah, sirf uss query (q) ko suno
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setStockList(items);
        setLoading(false);
      });
      
      return () => unsubscribe(); // Cleanup function
    } else {
      // Agar user login nahi hai (jo hona nahi chahiye _layout ki wajah se)
      setStockList([]);
      setLoading(false);
    }
  }, []); // [] ka matlab yeh sirf ek baar run hoga

  const deleteItem = async (id) => {
    try {
      // Humein yahaan user check karne ki zaroorat nahi
      // Kyunki Firebase Rules apne aap galat delete ko rok denge
      await deleteDoc(doc(db, 'stock', id));
      Alert.alert('Success', 'Item deleted successfully.');
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // _layout.js file apne aap user ko login screen par bhej degi
    } catch (error) {
      console.error('Logout Error', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemStock}>{item.stock}</Text>
      <Link
        href={{
          pathname: '/create',
          params: { id: item.id }, 
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
      <View style={styles.header}>
        <Text style={styles.title}>My Private Stock</Text>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
      
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#DC3545',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
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