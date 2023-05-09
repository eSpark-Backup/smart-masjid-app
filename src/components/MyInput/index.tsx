import { Theme, useTheme } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import II from 'react-native-vector-icons/Ionicons';
import { WINDOW_WIDTH } from '../../constants';
import MyText from '../MyText';
import { SearchWhite } from '../../assets';

interface MyInputProps {
  isDivider?: boolean;
  dividerColor?: string;
  dividerWidth?: number;
  isPhoneCode?: boolean;
  phoneCodeValue: string;
  isDropDown?: boolean;
  onDropPress?: () => void;
  onPhoneCodePress?: () => void;
  onChangeText?: (value: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  dropStyle?: ViewStyle;
  placeholder: string;
  placeholderColor?: string;
  title?: string;
  searchBar?: boolean;
  onSearch?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  error?: string;
  isSecure?: boolean;
  disabled?: boolean;
  phoneCodeContainerStyle?: ViewStyle;
}

export default function MyInput(props: MyInputProps) {
  const {
    isPhoneCode,
    isDropDown = false,
    dropStyle,
    phoneCodeValue,
    placeholder,
    containerStyle,
    inputStyle,
    title,
    searchBar,
    placeholderColor,
    onPhoneCodePress,
    onSearch,
    onFocus,
    onBlur,
    onDropPress,
    value,
    error,
    isSecure,
    disabled,
    phoneCodeContainerStyle,
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
    <View style={{ justifyContent: 'center' }}>
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
            style={[styles.phoneCodeContainer, phoneCodeContainerStyle ?? {}]}>
            <II name="caret-down-sharp" size={10} color="#fff" />
            <MyText textStyle={styles.phoneCodeText} text={phoneCodeValue} />
          </TouchableOpacity>
        )}
        <View style={isDropDown ? { flexDirection: 'row', ...dropStyle } : {}}>
          <View>
            <TextInput
              editable={!disabled}
              autoComplete="off"
              autoCorrect={false}
              placeholder={placeholder}
              style={[styles.inputStyle, inputStyle]}
              onChangeText={handleTextChange}
              value={text}
              placeholderTextColor={placeholderColor ?? '#9E9F9F'}
              onPressIn={onFocus}
              onSubmitEditing={onBlur}
              secureTextEntry={isSecure}
            />
            {error && (
              <MyText
                text={error}
                textStyle={{
                  color: 'red',
                  width: WINDOW_WIDTH - 110,
                  marginTop: 4,
                }}
              />
            )}
          </View>
          {isDropDown && (
            <II
              name="caret-down-sharp"
              style={{ alignSelf: 'center', right: 20 }}
              onPress={onDropPress}
            />
          )}
        </View>
        {searchBar && (
          <TouchableOpacity
            onPress={() => onSearch?.(text ?? '')}
            activeOpacity={0.9}
            style={[styles.searchBarContainer]}>
            <SearchWhite />
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
      height: 50,
      // width: WINDOW_WIDTH - 45 - (isPhoneCode ? 80 : 0) - (searchBar ? 44 : 0),
    },
    inputStyle: {
      paddingHorizontal: 20,
      width: WINDOW_WIDTH - 45 - (isPhoneCode ? 80 : 0) - (searchBar ? 44 : 0),
      color: colors.text,
      top: Platform.OS == 'ios' ? 17 : 0,
    },
    phoneCodeContainer: {
      backgroundColor: colors.primary,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      width: 80,
      // height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    searchBarContainer: {
      backgroundColor: colors.primary,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      width: 50,
      height: 50,
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
