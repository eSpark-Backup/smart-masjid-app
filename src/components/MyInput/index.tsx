import { Theme, useTheme } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import II from 'react-native-vector-icons/Ionicons';
import { WINDOW_WIDTH } from '../../constants';
import MyText from '../MyText';

interface MyInputProps {
  isDivider?: boolean;
  dividerColor?: string;
  dividerWidth?: number;
  isPhoneCode?: boolean;
  phoneCodeValue: string;
  onPhoneCodePress?: () => void;
  onChangeText?: (value: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  placeholder: string;
  title?: string;
  searchBar?: boolean;
  onSearch?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
}

export default function MyInput(props: MyInputProps) {
  const {
    isPhoneCode,
    phoneCodeValue,
    placeholder,
    containerStyle,
    inputStyle,
    title,
    searchBar,
    onPhoneCodePress,
    onSearch,
    onFocus,
    onBlur,
    value,
  } = props;
  const theme: Theme = useTheme();
  const styles = useMemo(() => getStyles(theme, props), []);
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);
  
  const handleTextChange = (newText: string) => {
    setText(newText);

    if (props.onChangeText) {
      props.onChangeText(newText);
    }
  };

  return (
    <View>
      {title != '' && (
        <MyText
          text={title ?? ''}
          size={16}
          textStyle={{ fontWeight: '400', color: '#3E3E3E' }}
        />
      )}
      <View style={[styles.container, containerStyle]}>
        {isPhoneCode && (
          <TouchableOpacity
            onPress={onPhoneCodePress}
            activeOpacity={0.9}
            style={[styles.phoneCodeContainer]}>
            <II name="caret-down-sharp" size={10} color="#fff" />
            <MyText textStyle={styles.phoneCodeText} text={phoneCodeValue} />
          </TouchableOpacity>
        )}
        <TextInput
          autoComplete="off"
          autoCorrect={false}
          placeholder={placeholder}
          style={[styles.inputStyle, inputStyle]}
          onChangeText={handleTextChange}
          value={text}
          placeholderTextColor={theme.colors.text}
          onPressIn={onFocus}
          onSubmitEditing={onBlur}
        />
        {searchBar && (
          <TouchableOpacity
            onPress={onSearch}
            activeOpacity={0.9}
            style={[styles.searchBarContainer]}>
            <II name="search-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (theme: Theme, props: MyInputProps) => {
  const { colors } = theme;
  const { isDivider, dividerColor, dividerWidth, searchBar, isPhoneCode } =
    props;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderBottomColor: isDivider ? dividerColor : 'transparent',
      borderBottomWidth: isDivider ? dividerWidth : 0,
      // width: WINDOW_WIDTH - 45 - (isPhoneCode ? 80 : 0) - (searchBar ? 44 : 0),
    },
    inputStyle: {
      paddingHorizontal: 20,
      width: WINDOW_WIDTH - 45 - (isPhoneCode ? 80 : 0) - (searchBar ? 44 : 0),
      color: colors.text
    },
    phoneCodeContainer: {
      backgroundColor: colors.primary,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      width: 80,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    searchBarContainer: {
      backgroundColor: colors.primary,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      width: 50,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
    },
    phoneCodeText: { color: '#fff', marginHorizontal: 10 },
  });
};

MyInput.defaultProps = {
  isDivider: false,
  dividerColor: '#9E9F9F',
  dividerWidth: 0.4,
  isPhoneCode: false,
  phoneCodeValue: '+1',
  onPhoneCodePress: () => {},
  onChangeText: (value: string) => {},
  containerStyle: {},
  inputStyle: {},
  placeholder: 'Placeholder Text',
  title: '',
  searchBar: false,
  onSearch: () => {},
};
