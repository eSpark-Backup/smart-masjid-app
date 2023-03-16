import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { WINDOW_WIDTH } from '../../constants';
import MyDivider from '../MyDivider';
import MyInput from '../MyInput';
import MyText from '../MyText';
import II from 'react-native-vector-icons/Ionicons';

interface Item {
  id: number;
  name: string;
}

var dataItems: Item[] = [
  {
    id: 1,
    name: 'JavaScript',
  },
  {
    id: 2,
    name: 'Java',
  },
  {
    id: 3,
    name: 'Ruby',
  },
  {
    id: 4,
    name: 'React Native',
  },
  {
    id: 5,
    name: 'PHP',
  },
  {
    id: 6,
    name: 'Python',
  },
  {
    id: 7,
    name: 'Go',
  },
  {
    id: 8,
    name: 'Swift',
  },
];

export default function MyDropdown({
  items = dataItems,
  title = 'Title',
  placeholder = 'Please Select',
  placeholderColor,
  containerPadding = 15,
  onChangeValue = (value: Item) => {},
}: {
  items: Item[];
  title?: string;
  placeholder?: string;
  placeholderColor?: string;
  containerPadding?: number;
  onChangeValue?: (value: Item) => void;
}) {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [data, setData] = useState(items);

  const onSearch = (text: string) => {
    if (selectedItem != null) {
      setSelectedItem(null);
      setData([...items]);
      return;
    }
    if (text == '') {
      setData([...items]);
      return;
    }
    const updatedList = items?.filter(item =>
      item?.name?.toLowerCase()?.includes(text.toLowerCase()),
    );

    setData([...updatedList]);
  };

  return (
    <>
      <View
        style={{ ...styles.container, paddingHorizontal: containerPadding }}>
        <MyInput
          title={title}
          onChangeText={onSearch}
          containerStyle={{ marginTop: 5 }}
          dropStyle={{
            borderWidth: 1,
            borderColor: '#9E9F9F',
            borderRadius: 12,
            width: '100%',
          }}
          inputStyle={{ width: '100%' }}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          placeholderColor={placeholderColor ?? '#000000'}
          isDropDown={true}
          onDropPress={() => {
            setShow(!show);
            Keyboard.dismiss();
          }}
          placeholder={placeholder}
          value={selectedItem?.name ?? ''}
        />
      </View>
      {show && (
        <View style={styles.listItemContainer}>
          <FlatList
            data={data}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={`${item?.name}-${index}`}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedItem(item);
                    onChangeValue(item);
                    setShow(false);
                    console.log('hoa');
                  }}
                  style={{ padding: 5 }}>
                  <MyText text={item.name} />
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={MyDivider}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContainer: {
    width: WINDOW_WIDTH - 45,
    height: 100,
    alignSelf: 'center',
  },
});
