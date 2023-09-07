import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Keyboard,
  Platform,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';

import { WINDOW_WIDTH } from '../../constants';
import MyDivider from '../MyDivider';
import MyInput from '../MyInput';
import MyText from '../MyText';
import { ArrowDown, ArrowUp } from '../../assets';
import { useLayoutAnimation } from '../../utils/hooks';
import { TouchableNativeFeedback } from 'react-native';

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
  width = WINDOW_WIDTH - 28,
  disabled = false,
  searchDisabled = false,
  defaultValue = null,
}: {
  items: Item[];
  title?: string;
  placeholder?: string;
  placeholderColor?: string;
  containerPadding?: number;
  onChangeValue?: (value: Item) => void;
  width?: number | string | undefined;
  disabled?: boolean;
  searchDisabled?: boolean;
  defaultValue?: Item | null;
}) {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(defaultValue);
  const [data, setData] = useState(items);

  useEffect(() => {
    if (defaultValue) setSelectedItem(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    useLayoutAnimation();
  }, [show]);

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

  const openDropDown = () => {
    if (disabled) return;
    useLayoutAnimation(200);
    setShow(!show);
    Keyboard.dismiss();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={openDropDown}
        style={{ ...styles.container, paddingHorizontal: containerPadding }}
        activeOpacity={0.6}>
        <MyInput
          disabled={disabled}
          title={title}
          isDropDown
          selectMode={!searchDisabled}
          onChangeText={onSearch}
          onFocus={() => {
            if (disabled) return;
            useLayoutAnimation(200);
            setShow(true);
          }}
          onBlur={() => {
            if (disabled) return;
            useLayoutAnimation(200);
            setShow(false);
          }}
          placeholderColor={placeholderColor ?? '#9E9F9F'}
          placeholder={placeholder}
          value={selectedItem?.name ?? ''}
          isDivider={false}
          inputStyle={{
            borderWidth: 1,
            borderColor: '#9E9F9F',
            borderRadius: 12,
            marginTop: 8,
            width: width,
            height: Platform.OS == 'ios' ? 40 : undefined,
            top: 0,
          }}
        />
        {show ? (
          <ArrowUp
            onPress={openDropDown}
            style={{
              bottom: 15,
              right: title ? 35 : 15,
              position: 'absolute',
              zIndex: 1,
            }}
          />
        ) : (
          <ArrowDown
            onPress={openDropDown}
            style={{
              bottom: 15,
              right: title ? 35 : 15,
              position: 'absolute',
              zIndex: 1,
            }}
          />
        )}
      </TouchableOpacity>
      {show && (
        <View style={{ flex: 0.05 }}>
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
                    if (disabled) return;
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContainer: {},
});
