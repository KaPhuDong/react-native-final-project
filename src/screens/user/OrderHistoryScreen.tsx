/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {getOrderHistory} from '../../database/db';

const OrderHistoryScreen = ({route}: any) => {
  const {user} = route.params;
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getOrderHistory(user.id).then(setOrders);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item: any) => item.id.toString()}
        ListEmptyComponent={<Text>Chưa có đơn hàng nào</Text>}
        renderItem={({item}: any) => (
          <View style={styles.item}>
            <Text style={{fontWeight: 'bold'}}>Mã đơn: #{item.id}</Text>
            <Text>Ngày: {item.orderDate}</Text>
            <Text style={{color: 'red'}}>
              Tổng: {item.totalPrice.toLocaleString()} đ
            </Text>
            <Text>Trạng thái: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#fff'},
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 8,
  },
});
export default OrderHistoryScreen;
