import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { db, auth } from '../firebaseConfig'; 
import { signOut } from 'firebase/auth'; 
import { collection, onSnapshot, deleteDoc, doc, query, where } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setLoading(true);
      const q = query(collection(db, 'stock'), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setStockList(items);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setStockList([]);
      setLoading(false);
    }
  }, []);

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'stock', id));
      Alert.alert('Success', 'Item deleted successfully.');
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#DC3545',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#0052CC',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headingText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 2,
    color: '#333',
  },
  itemStock: {
    fontSize: 18,
    flex: 1,
    color: '#28a745',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: 'gray',
  },
});