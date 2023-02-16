import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, Alert } from 'react-native';
import { WINDOW_WIDTH } from '../../constants';
import MyDivider from '../MyDivider';
import MyInput from '../MyInput';
import MyText from '../MyText';
import II from 'react-native-vector-icons/Ionicons';

interface Item {
  id: number;
  name: string;
}
var items: Item[] = [
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

export default function MyDropdown() {
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
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyInput
          onChangeText={onSearch}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          placeholder="Please Select"
          value={selectedItem?.name ?? ''}
        />
        <II name="caret-down-sharp" style={{right: 20}} />
      </View>
      <MyDivider style={{ alignSelf: 'center' }} />
      {show && (
        <View
          style={{
            width: WINDOW_WIDTH - 45,
            height: 100,
            alignSelf: 'center',
          }}>
          <FlatList
            data={data}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedItem(item);
                    setShow(false);
                  }}
                  style={{ padding: 5 }}>
                  <MyText text={item.name} />
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => {
              return <MyDivider height={0.25} />;
            }}
          />
        </View>
      )}
    </>
  );
}
