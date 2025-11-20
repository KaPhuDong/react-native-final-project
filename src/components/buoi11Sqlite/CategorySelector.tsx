import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Category} from './database';

interface Props {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void; // 👈 callback nhận ID
}

const CategorySelector: React.FC<Props> = ({
  categories,
  selectedId,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{marginVertical: 10}}>
      <View style={styles.container}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.button,
              selectedId === cat.id && styles.buttonSelected,
            ]}
            onPress={() => onSelect(cat.id)} // 👈 gọi callback, truyền ID lên cha
          >
            <Text
              style={[
                styles.text,
                selectedId === cat.id && styles.textSelected,
              ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: 10},
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  text: {
    color: '#333',
    fontSize: 14,
  },
  textSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategorySelector;
