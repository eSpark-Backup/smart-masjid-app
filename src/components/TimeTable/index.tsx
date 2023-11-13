import React, { LegacyRef, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import moment from 'moment';

import { MuteSvg, VolumUpGreen } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import MyTimePicker from '../MyTimePicker';
import Tooltip from '../Tooltip';
import { TextInputProps } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

interface DataProps {
  name?: string;
  azanTiming?: string;
  iqamahTiming?: string;
  khutbahTiming?: string;
  onChange?: (value: any) => void;
}

const RowItem = ({
  item,
  index,
  isEdit,
  isMute,
  onSubmitEditing,
  edit = false,
  type,
}: any) => {
  const { colors } = useTheme();
  const MyInput = useRef<TextInput>(null);
  const [toggleMute, setToggleMute] = useState(true);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      key={`${item?.name}-${index}`}
      style={!edit ? {} : [styles.editContentRow]}>
      <View style={[styles.contentRow, { marginVertical: edit ? 0 : 10 }]}>
        {Object.keys(item)?.map((key: any, index) => {
          if (key == 'onChange') return;
          console.log('key', index, item[key]);

          return (
            <React.Fragment key={index}>
              {index != 0 && edit ? (
                <>
                  {(type == 'F' && item[key] == '-') ||
                  item[key]?.search(':') != -1 ||
                  type == 'J' ? (
                    <MyTimePicker
                      onTimeChanged={item?.onChange}
                      initialValue={item[key]}
                    />
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => MyInput.current?.focus()}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 0.5,
                        borderColor: '#3E3E3E',
                        borderRadius: 3,
                        width: 155,
                        height: 40,
                      }}>
                      <TextInput
                        ref={MyInput}
                        defaultValue={item[key]}
                        onChangeText={item?.onChange}
                        maxLength={2}
                        keyboardType={'decimal-pad'}
                        style={{
                          fontSize: 16,
                          color: colors.text,
                          height: 40,
                          textAlign: 'center',
                          // fontWeight: '400',
                          fontFamily: 'Roboto-Regular',
                          paddingVertical: 10,
                        }}
                      />
                      <View
                        style={{
                          justifyContent: 'center',
                          height: 40,
                          marginLeft: Platform.OS == 'ios' ? 5 : 0,
                        }}>
                        <TextInput
                          editable={false}
                          defaultValue={'Mins'}
                          style={{
                            fontSize: 16,
                            color: colors.text,
                            height: 40,
                            textAlign: 'center',
                            // fontWeight: '400',
                            fontFamily: 'Roboto-Regular',
                            paddingVertical: 10,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View key={key} style={styles.contentCol}>
                  <MyText
                    text={
                      ['azanTiming', 'iqamahTiming'].includes(key)
                        ? moment(item[key], 'HH:mm:ss').format('LT')
                        : item[key]
                    }
                    size={16}
                    textStyle={{
                      textTransform: ['azanTiming', 'iqamahTiming'].includes(
                        key,
                      )
                        ? 'uppercase'
                        : 'capitalize',
                    }}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
        {isMute && (
          <View style={styles.contentIcon}>
            {toggleMute ? (
              <MuteSvg
                onPress={() => setToggleMute(!toggleMute)}
                height={16}
                width={16}
              />
            ) : (
              <VolumUpGreen
                onPress={() => setToggleMute(!toggleMute)}
                height={16}
                width={16}
              />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function TimeTable({
  data,
  isMute = false,
  isEdit = false,
  isInfo = false,
  headings = ['Salah', 'Adhan', 'Iqama'],
  header = <></>,
  onSubmitEditing = () => {
    console.log('submit');
  },
  editView = false,
  footer = <></>,
  type = 'F',
  containerStyle,
}: {
  data: (DataProps | false)[];
  isMute?: boolean;
  isEdit?: boolean;
  isInfo?: boolean;
  headings?: string[];
  header?: React.ReactNode;
  btnLabel?: string;
  onButtonPress?: () => void;
  onSubmitEditing?: () => void;
  editView?: boolean;
  footer?: React.ReactNode;
  type?: 'F' | 'D' | 'J';
  containerStyle?: ViewStyle;
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {header && (
        <>
          {header}
          <GapView />
        </>
      )}
      <View style={styles.headerRow}>
        {headings?.map(value => (
          <View key={value} style={styles.headerCol}>
            <MyText
              text={value}
              size={16}
              textStyle={{
                // fontWeight: '700',
                fontFamily: 'Roboto-Bold',
              }}
            />
          </View>
        ))}
        {isMute && !isInfo && <View style={styles.headerIcon} />}
        {isEdit && !isInfo && <View style={styles.headerIcon} />}
        {isInfo && (
          <View>
            <Tooltip
              position="top"
              content="Any Content"
              iconColor={'#006870'}
            />
          </View>
        )}
      </View>
      <GapView />
      <MyDivider style={{ alignSelf: 'center', width: '99%' }} />
      {data?.map(
        (item: any, index) =>
          item && (
            <RowItem
              key={`${index}`}
              item={item}
              index={index}
              isEdit={isEdit}
              isMute={isMute}
              onSubmitEditing={onSubmitEditing}
              edit={editView}
              type={type}
            />
          ),
      )}
      {footer && (
        <>
          <GapView length={15} />
          {footer}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F1F7F8',
    borderRadius: 12,
    width: WINDOW_WIDTH - 28,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCol: { width: '30%', alignItems: 'flex-start' },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  editContentRow: {
    marginVertical: 5,
    borderRadius: 12,
  },
  contentCol: { width: '30%', alignItems: 'flex-start' },
  contentIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
  },
  shadowContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowColor: 'grey',
    shadowRadius: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
