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
import II from 'react-native-vector-icons/Ionicons';

import { WINDOW_WIDTH } from '../../constants';
import MyDivider from '../MyDivider';
import MyInput from '../MyInput';
import MyText from '../MyText';

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
  onChangeValue = (value: Item) => {},
}: {
  items: Item[];
  title?: string;
  placeholder?: string;
  placeholderColor?: string;
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
      <View style={styles.container}>
        <MyInput
          title={title}
          onChangeText={onSearch}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          placeholderColor={placeholderColor ?? '#000000'}
          placeholder={placeholder}
          value={selectedItem?.name ?? ''}
        />
        <II
          name="caret-down-sharp"
          style={{ right: 20, top: title ? 12 : 0 }}
          onPress={() => {
            setShow(!show);
            Keyboard.dismiss();
          }}
        />
      </View>
      <MyDivider
        style={{ alignSelf: 'center' }}
        height={0.5}
        backgroundColor="#3E3E3E"
      />
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
