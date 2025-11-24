import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {getAllOrders, updateOrderStatus} from '../../database/db';

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    setOrders(await getAllOrders());
  };

  const changeStatus = async (id: number) => {
    await updateOrderStatus(id, 'completed'); // Demo chuyển sang hoàn thành
    load();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({item}: any) => (
          <View style={styles.item}>
            <Text>
              Đơn #{item.id} - User: {item.username}
            </Text>
            <Text style={{fontWeight: 'bold', color: 'red'}}>
              {item.totalPrice.toLocaleString()} đ
            </Text>
            <Text>TT: {item.status}</Text>
            {item.status === 'pending' && (
              <TouchableOpacity
                onPress={() => changeStatus(item.id)}
                style={styles.btn}>
                <Text style={{color: 'white'}}>Duyệt đơn</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  btn: {
    marginTop: 5,
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
});
export default OrderManagement;
