import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
  TextStyle,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { CrossSvg } from '../../assets';
import { CountryFlags, WINDOW_HEIGHT } from '../../constants';
import { useHookstate } from '@hookstate/core';
import { externalStore } from '../../store/ExternalStore';
import { CountryCodes } from '../../types';
import MyText from '../MyText';
import GapView from '../GapView';
import { Theme, useTheme } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

export default function CountryModal({
  visibleState = false,
  onCross = () => {},
  textStyle = {},
  onSetValue = e => {},
  searchPlaceholder = 'Enter Country Name ',
  EmptyMessage = 'No Country Available',
  isSearch = true,
}: {
  visibleState: boolean;
  onCross?: () => void;
  textStyle?: TextStyle;
  onSetValue?: (e: CountryCodes) => void;
  searchPlaceholder?: string;
  EmptyMessage?: string;
  isSearch?: true;
}) {
  const countries = useHookstate(externalStore.countryCodes).get();
  const [data, setData] = useState(countries);
  const { colors }: Theme = useTheme();
  
  const close = (e: CountryCodes) => {
    onSetValue(e);
    onCross();
  };

  const onSearch = (text: string) => {
    if (!text) {
      setData(countries);
    } else {
      setData(
        countries.filter(country =>
          country.country.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }
  };
  const UnknownFlag = () => {
    return (
      <View
        style={{
          height: 15,
          width: 24,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyText text="?" textStyle={{ color: '#fff' }} size={12} />
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      visible={visibleState}
      onRequestClose={onCross}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.crossView}>
            <TouchableOpacity activeOpacity={0.8} onPress={onCross}>
              <CrossSvg height={25} width={25} />
            </TouchableOpacity>
            {isSearch && (
              <View style={styles.inputserach}>
                <TextInput
                  onChangeText={onSearch}
                  style={[styles.inputStyle]}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#cacaca"
                />
              </View>
            )}
          </View>
          {data?.length !== 0 ? (
            <FlatList
              contentContainerStyle={[styles.listView, { width: width - 50 }]}
              data={data}
              renderItem={({ item, index }) => {
                // @ts-ignore
                const Flag = CountryFlags[item.iso_code] ?? UnknownFlag;
                return (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => close(item)}>
                    <Flag height={26} width={26} />
                    <GapView mode="horizontal" length={5} />
                    <MyText text={`(${item.code})`} />
                    <GapView mode="horizontal" length={5} />
                    <Text style={[styles.defaultTextStyle, textStyle]}>
                      {item.country}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <Text style={[styles.defaultTextStyleEmpty]}>{EmptyMessage}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputserach: {
    marginTop: -8,
    marginLeft: 8,
    borderBottomWidth: 0.5,
    width: '90%',
  },
  inputStyle: {
    width: '95%',
    marginTop: Platform.OS === 'ios' ? 15 : 1,
    marginLeft: 6,
    fontSize: 15,
    color: '#474747',
    borderColor: '#474747',
  },
  listView: {
    paddingLeft: 30,
  },
  crossView: {
    marginLeft: 20,
    marginTop: StatusBar.currentHeight,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 22,
    width: 22,
    bottom: Platform.OS == 'ios' ? 10 : -5,
  },
  defaultTextStyle: {
    fontSize: 16,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  defaultTextStyleEmpty: {
    alignSelf: 'center',
    flex: 1,
    fontSize: 16,
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
