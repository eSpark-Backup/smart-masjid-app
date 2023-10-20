import React, { useEffect, useMemo, useState } from 'react';
import { Theme, useTheme } from '@react-navigation/native';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  PermissionsAndroid,
  TextStyle,
} from 'react-native';
import II from 'react-native-vector-icons/Ionicons';
import { useHookstate } from '@hookstate/core';
import MI from 'react-native-vector-icons/MaterialIcons';
import { PERMISSIONS, checkMultiple } from 'react-native-permissions';
import crashlytics from '@react-native-firebase/crashlytics';

import { CountryFlags, WINDOW_WIDTH } from '../../constants';
import MyText from '../MyText';
import { SearchWhite } from '../../assets';
import GapView from '../GapView';
import { CountryPickerModal } from '..';
import { externalStore } from '../../store/ExternalStore';
import { CountryCodes } from '../../types';
import { _requestUserLocationPermission } from '../../utils/functions';
import { useLayoutAnimation } from '../../utils';
import systemSetting from 'react-native-system-setting';

interface MyInputProps {
  isDivider?: boolean;
  dividerColor?: string;
  dividerWidth?: number;
  isPhoneCode?: boolean;
  isMAccont?: boolean;
  phoneCodeValue: string;
  isDropDown?: boolean;
  onDropPress?: () => void;
  onPhoneCodeChange?: (country: CountryCodes) => void;
  onChangeText?: (value: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  dropStyle?: ViewStyle;
  placeholder: string;
  placeholderColor?: string;
  title?: string;
  searchBar?: boolean;
  helpSearch?: boolean;
  onSearch?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onCurrentLocationPress?: () => void;
  value?: string;
  error?: string;
  isSecure?: boolean;
  disabled?: boolean;
  selectMode?: boolean;
  phoneCodeContainerStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

export default function MyInput(props: MyInputProps) {
  const {
    isPhoneCode,
    isDropDown = false,
    phoneCodeValue,
    placeholder,
    containerStyle,
    inputStyle,
    title,
    searchBar,
    helpSearch,
    onPhoneCodeChange,
    onSearch,
    onFocus,
    onBlur,
    onCurrentLocationPress,
    value,
    error,
    isSecure,
    disabled,
    selectMode,
    phoneCodeContainerStyle,
    multiline,
    maxLength,
  } = props;
  const theme: Theme = useTheme();
  const styles = useMemo(() => getStyles(theme, props), [props]);
  const [text, setText] = useState(value);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<any>(null);
  const countries = useHookstate(externalStore.countryCodes).get();
  const [locationPermission, setLocationPermission] = useState(false);
  const [getFocused, setGetFocused] = useState(false);

  useEffect(() => {
    if (isPhoneCode) {
      const data = countries?.find(country =>
        phoneCodeValue?.includes(country?.code),
      );
      setCurrentCountry(data ?? countries[0]);
      onPhoneCodeChange?.(data ?? countries[0]);
    }
  }, [phoneCodeValue]);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    useLayoutAnimation(100);
  }, [getFocused]);

  const checkLocation = async () => {
    console.log('chala');
    try {
      if (Platform.OS == 'ios') {
        checkMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]).then(async statuses => {
          console.log(statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]);
          if (
            statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] == 'granted' ||
            statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] == 'granted'
          ) {
            const enable = await systemSetting.isLocationEnabled();
            if (enable) {
              setLocationPermission(true);
            } else {
              setLocationPermission(false);
            }
          } else {
            setLocationPermission(false);
          }
        });
      } else {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted) {
          const enable = await systemSetting.isLocationEnabled();
          if (enable) {
            setLocationPermission(true);
          } else {
            setLocationPermission(false);
          }
        } else {
          setLocationPermission(false);
        }
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.error(error);
    }
  };

  useEffect(() => {
    checkLocation();
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
          textStyle={{
            fontFamily: 'Roboto-Regular',
            color: '#3E3E3E',
          }}
        />
      )}
      <View
        style={[
          styles.container,
          containerStyle,
          { height: multiline ? undefined : 50 },
        ]}>
        {isPhoneCode && (
          <TouchableOpacity
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.9}
            style={[
              styles.phoneCodeContainer,
              { borderColor: getFocused ? theme.colors.primary : '#9E9F9F' },
              phoneCodeContainerStyle ?? {},
            ]}>
            <Flag height={24} width={24} />
            <GapView mode="horizontal" length={5} />
            <II name="caret-down-sharp" size={10} color="#3E3E3E" />
          </TouchableOpacity>
        )}
        {helpSearch || searchBar ? null : (
          <View
            style={{
              position: 'absolute',
              top:
                value || getFocused
                  ? isDropDown
                    ? -16
                    : -25
                  : isDropDown
                  ? 5
                  : multiline
                  ? 0
                  : 0,
              left: isPhoneCode ? 95 : 15,
              backgroundColor: 'transparent',
              zIndex: value || getFocused ? 1 : 0,
              height: 50,
              justifyContent: 'center',
            }}>
            <MyText
              textStyle={{
                color:
                  (value && isDropDown) || getFocused
                    ? theme.colors.primary
                    : '#9E9F9F',
                backgroundColor: theme.colors.background,
                paddingHorizontal: 5,
              }}
              text={placeholder}
            />
          </View>
        )}
        <View>
          <TextInput
            maxLength={maxLength}
            editable={selectMode && !disabled}
            autoComplete="off"
            autoCorrect={false}
            keyboardType={isPhoneCode ? 'number-pad' : 'default'}
            style={[
              styles.inputStyle,
              { borderColor: getFocused ? theme.colors.primary : '#9E9F9F' },
              inputStyle,
            ]}
            placeholder={helpSearch || searchBar ? placeholder : ''}
            placeholderTextColor={'#9E9F9F'}
            onChangeText={handleTextChange}
            onFocus={() => setGetFocused(true)}
            onBlur={() => setGetFocused(false)}
            value={
              isPhoneCode
                ? text?.replace(currentCountry?.code ?? '+1', '')
                : text
            }
            onPressIn={onFocus}
            onSubmitEditing={onBlur}
            secureTextEntry={isSecure}
            numberOfLines={4}
            multiline={multiline}
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
        {searchBar && (
          <>
            <MI
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
  const {
    isDivider,
    dividerColor,
    dividerWidth,
    searchBar,
    isPhoneCode,
    isMAccont,
    helpSearch,
  } = props;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderBottomColor: isDivider ? dividerColor : 'transparent',
      borderBottomWidth: isDivider ? dividerWidth : 0,
    },
    inputStyle: {
      fontFamily: 'Roboto-Regular',
      paddingHorizontal: 20,
      width:
        WINDOW_WIDTH -
        50 -
        (isMAccont ? 25 : 0) -
        (isPhoneCode ? 80 : 0) -
        (searchBar ? 44 : 0),
      color: colors.text,
      borderWidth: helpSearch || searchBar ? 0 : 1,
      borderRadius: 10,
      borderTopRightRadius: searchBar ? 0 : 10,
      borderBottomRightRadius: searchBar ? 0 : 10,
      borderTopLeftRadius: isPhoneCode ? 0 : 10,
      borderBottomLeftRadius: isPhoneCode ? 0 : 10,
      borderLeftWidth: isPhoneCode || helpSearch || searchBar ? 0 : 1,
      height: Platform.OS == 'ios' ? 50 : undefined,
    },
    phoneCodeContainer: {
      width: 80,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#9E9F9F',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
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
