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
import { ArrowDown } from '../../assets';
import { useLayoutAnimation } from '../../utils/hooks/useLayoutAnimation';

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
  width = WINDOW_WIDTH - 40
}: {
  items: Item[];
  title?: string;
  placeholder?: string;
  placeholderColor?: string;
  onChangeValue?: (value: Item) => void;
  width?: number | string | undefined;
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
          onFocus={() => {
            useLayoutAnimation(200);
            setShow(true);
          }}
          onBlur={() => {
            useLayoutAnimation(200);
            setShow(false);
          }}
          placeholderColor={placeholderColor ?? '#000000'}
          placeholder={placeholder}
          value={selectedItem?.name ?? ''}
          isDivider={false}
          inputStyle={{
            borderWidth: 1,
            borderColor: '#9E9F9F',
            borderRadius: 12,
            marginTop: 8,
            width: width,
          }}
        />
        <ArrowDown
          onPress={() => {
            useLayoutAnimation(200);
            setShow(!show);
            Keyboard.dismiss();
          }}
          style={{ bottom: 15, right: title ? 35 : 15, position: 'absolute' }}
        />
      </View>
      {show && (
        <FlatList
          data={data}
          contentContainerStyle={{
            borderWidth: 1,
            borderColor: '#9E9F9F',
            borderRadius: 12,
            width: width ?? WINDOW_WIDTH - 45,
            marginTop: 5,
            alignSelf: 'center',
          }}
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
                }}
                style={{
                  height: 40,
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                }}>
                <MyText text={item.name} />
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={MyDivider}
        />
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
    // height: 100,
    // alignSelf: 'center',
  },
});
