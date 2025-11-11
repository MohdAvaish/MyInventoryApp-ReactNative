// app/index.js
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [stockList, setStockList] = useState([]);

  // Yeh function har baar screen khulne par data load karega
  useFocusEffect(
    React.useCallback(() => {
      loadStockItems();
    }, [])
  );

  const loadStockItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@stockList');
      if (jsonValue !== null) {
        setStockList(JSON.parse(jsonValue));
      } else {
        setStockList([]); // Agar kuch na mile toh list khaali rakho
      }
    } catch (e) {
      console.error('Failed to load items.', e);
    }
  };

  const deleteItem = async (id) => {
    try {
      const updatedList = stockList.filter((item) => item.id !== id);
      setStockList(updatedList);
      const jsonValue = JSON.stringify(updatedList);
      await AsyncStorage.setItem('@stockList', jsonValue);
      Alert.alert('Success', 'Item deleted successfully.');
    } catch (e) {
      console.error('Failed to delete item.', e);
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
      <Text style={styles.title}>Dashboard</Text>
      <Link href="/create" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.buttonText}>ADD ITEM IN STOCK</Text>
        </Pressable>
      </Link>

      <Text style={styles.headingText}>All Items in the stock</Text>
      <FlatList
        data={stockList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No items in stock.</Text>}
      />
    </SafeAreaView>
  );
}

// Styles (CSS jaisa)
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