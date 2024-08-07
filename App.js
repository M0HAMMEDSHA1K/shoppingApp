import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, FlatList, Text, View, Button, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import store from './store';
import { addToCart, incrementQuantity, decrementQuantity, deleteQuantity } from './cartSlice';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  return (

    
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading1}>SHOPPING APP</Text>
      <FlatList style={styles.card}
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.product}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          {selectedProduct && (
            <>
              <Image source={{ uri: selectedProduct.image }} style={styles.image} />
              <Text style={styles.title}>{selectedProduct.title}</Text>
              <Text>{selectedProduct.description}</Text>
              <Text>${selectedProduct.price}</Text>
              <Button
                title="Add to Cart"
                onPress={() => {
                  dispatch(addToCart(selectedProduct));
                  closeModal();
                }}
              />
            </>
          )}
        </View>
      </Modal>
      <View style={styles.cart}>
      <Text style={styles.heading1}>YOUR CART</Text>
        {cart.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <Text>{item.title} (x{item.quantity})</Text>
            <Button title="+" onPress={() => dispatch(incrementQuantity(item))} />
            <Button title="-" onPress={() => dispatch(decrementQuantity(item))} />         
          </View>
        ))}
        
          <Button style={styles.delete1} title="Clear Cart" onPress={() => dispatch(deleteQuantity())} color="#f44336" />
       
        
      </View>
    </SafeAreaView>
  );
};

const App = () => (
  <Provider store={store}>
    <ProductList />
  </Provider>
);

const styles = StyleSheet.create({

  card:{
    // borderRadius:'20px',
    // backgroundColor:'red',
  },
  delete1:{
    padding:100,
    marginTop: 100,
  },
  heading1:{
    alignItems:'center',
    padding: 10,
    backgroundColor: 'aqua',
    fontWeight:'bold',
    justifyContent:'center',
    textAlign:'center',

  },
  container: {
    flex: 1,
    padding: 16,
  },
  product: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  productImage: {
    width: 150,
    height: 150,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 18,
    color: '#888',
  },
  modalView: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cart: {
    padding: 0,
    borderTopWidth: 5,
    borderTopColor: 'aqua',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 28,
  },
});

export default App;
