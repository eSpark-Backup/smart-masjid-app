import { Theme, useTheme } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  PermissionsAndroid,
} from 'react-native';
import II from 'react-native-vector-icons/Ionicons';
import { useHookstate } from '@hookstate/core';
import MI from 'react-native-vector-icons/MaterialIcons';
import { PERMISSIONS, checkMultiple } from 'react-native-permissions';

import { CountryFlags, WINDOW_WIDTH } from '../../constants';
import MyText from '../MyText';
import { SearchWhite } from '../../assets';
import GapView from '../GapView';
import { CountryPickerModal } from '..';
import { externalStore } from '../../store/ExternalStore';
import { CountryCodes } from '../../types';
import { _requestUserLocationPermission } from '../../utils/functions';

interface MyInputProps {
  isDivider?: boolean;
  dividerColor?: string;
  dividerWidth?: number;
  isPhoneCode?: boolean;
  phoneCodeValue: string;
  isDropDown?: boolean;
  onDropPress?: () => void;
  onPhoneCodeChange?: (country: CountryCodes) => void;
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
  onCurrentLocationPress?: () => void;
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
    onPhoneCodeChange,
    onSearch,
    onFocus,
    onBlur,
    onDropPress,
    onCurrentLocationPress,
    value,
    error,
    isSecure,
    disabled,
    phoneCodeContainerStyle,
  } = props;
  const theme: Theme = useTheme();
  const styles = useMemo(() => getStyles(theme, props), []);
  const [text, setText] = useState(value);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<any>(null);
  const countries = useHookstate(externalStore.countryCodes).get();
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    if (isPhoneCode) {
      const data = countries?.find(country =>
        phoneCodeValue?.includes(country?.code),
      );
      console.log('🚀 ~ file: index.tsx:87 ~ useEffect ~ data:', data);
      setCurrentCountry(data ?? countries[0]);
      onPhoneCodeChange?.(data ?? countries[0]);
    }
  }, [phoneCodeValue]);

  useEffect(() => {
    setText(value);
  }, [value]);

  const checkLocation = async () => {
    try {
      if (Platform.OS == 'ios') {
        checkMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]).then(statuses => {
          console.log(statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]);
          if (
            statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] == 'granted' ||
            statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] == 'granted'
          ) {
            setLocationPermission(true);
          } else {
            _requestUserLocationPermission();
          }
        });
      } else {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted) {
          setLocationPermission(true);
        } else {
          setLocationPermission(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchBar) {
      checkLocation();
    }
  }, [checkLocation, searchBar]);

  const handleTextChange = (newText: string) => {
    setText(newText);

    if (props.onChangeText) {
      props.onChangeText(newText);
    }
  };

  const UnknownFlag = () => {
    return (
      <View
        style={{
          height: 15,
          width: 24,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyText text="?" textStyle={{ color: '#fff' }} size={12} />
      </View>
    );
  };

  // @ts-ignore
  const Flag = CountryFlags[currentCountry?.iso_code] ?? UnknownFlag;

  return (
    <View style={{ justifyContent: 'center' }}>
      <CountryPickerModal
        onSetValue={e => {
          setCurrentCountry(e);
          onPhoneCodeChange?.(e);
        }}
        visibleState={showCountryPicker}
        onCross={() => setShowCountryPicker(false)}
      />
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
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.9}
            style={[styles.phoneCodeContainer, phoneCodeContainerStyle ?? {}]}>
            <Flag height={24} width={24} />
            <GapView mode="horizontal" length={5} />
            <II name="caret-down-sharp" size={10} color="#3E3E3E" />
          </TouchableOpacity>
        )}
        <View style={isDropDown ? { flexDirection: 'row', ...dropStyle } : {}}>
          <View>
            <TextInput
              editable={!disabled}
              autoComplete="off"
              autoCorrect={false}
              keyboardType={isPhoneCode ? 'number-pad' : 'default'}
              placeholder={placeholder}
              style={[styles.inputStyle, inputStyle]}
              onChangeText={handleTextChange}
              value={
                isPhoneCode
                  ? text?.replace(currentCountry?.code ?? '+1', '')
                  : text
              }
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
          <>
            <MI
              disabled={!locationPermission}
              name="my-location"
              style={{
                alignSelf: 'center',
                right: 70,
                position: 'absolute',
                color: !locationPermission ? '#d0d0d0' : theme.colors.primary,
              }}
              onPress={onCurrentLocationPress}
              size={20}
            />
            <TouchableOpacity
              onPress={() => onSearch?.(text ?? '')}
              activeOpacity={0.9}
              style={[styles.searchBarContainer]}>
              <SearchWhite />
            </TouchableOpacity>
          </>
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
    },
    inputStyle: {
      paddingHorizontal: 20,
      width: WINDOW_WIDTH - 45 - (isPhoneCode ? 80 : 0) - (searchBar ? 44 : 0),
      color: colors.text,
      top: Platform.OS == 'ios' ? 17 : 0,
    },
    phoneCodeContainer: {
      width: 80,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRightWidth: 0.2,
      borderRightColor: '#9E9F9F',
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
  phoneCodeValue: '',
  onPhoneCodeChange: (code: CountryCodes) => {},
  onChangeText: (value: string) => {},
  containerStyle: {},
  inputStyle: {},
  placeholder: 'Placeholder Text',
  title: '',
  searchBar: false,
  onSearch: () => {},
};
