import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { InfoCircle, MuteSvg, VolumUpGreen } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import MyTimePicker from '../MyTimePicker';
import TextLabel from '../TextLabel';
import moment from 'moment';
import Tooltip from '../Tooltip';

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
  const [toggleMute, setToggleMute] = useState(true);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      key={`${item?.name}-${index}`}
      style={!edit ? {} : [styles.editContentRow]}>
      <View style={[styles.contentRow, { marginVertical: edit ? 0 : 10 }]}>
        {Object.keys(item)?.map((key: any, index) => {
          if (key == 'onChange') return;
          return (
            <React.Fragment key={index}>
              {index != 0 && edit ? (
                <>
                  {(type == 'F' && item[key]?.search(':') != -1) ||
                  type == 'J' ? (
                    <MyTimePicker
                      onTimeChanged={item?.onChange}
                      initialValue={item[key]}
                    />
                  ) : (
                    <View>
                      <TextInput
                        defaultValue={item[key]}
                        onChangeText={item?.onChange}
                        maxLength={2}
                        keyboardType={'decimal-pad'}
                        style={{
                          fontSize: 16,
                          borderWidth: 0.5,
                          color: colors.text,
                          borderColor: '#3E3E3E',
                          borderRadius: 3,
                          height: 40,
                          width: 155,
                          textAlign: 'center',
                        }}
                      />
                    </View>
                  )}
                  {/* {type == 'F' && item[key]?.search(':') != -1 ? (
                    <MyTimePicker
                      onTimeChanged={item?.onChange}
                      initialValue={item[key]}
                    />
                  ) : (
                    <View style={[styles.contentCol, { flexDirection: 'row' }]}>
                      <TextInput
                        defaultValue={item[key]}
                        onChangeText={item?.onChange}
                        maxLength={2}
                        keyboardType={'decimal-pad'}
                        style={{
                          borderWidth: 0.5,
                          color: colors.text,
                          borderColor: '#3E3E3E',
                          borderRadius: 3,
                          height: 40,
                          width: 40,
                          textAlign: 'center',
                        }}
                      />
                      <GapView mode="horizontal" />
                      <MyText text="Mins" />
                    </View>
                  )} */}
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
  data: DataProps[];
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
            <MyText text={value} size={16} textStyle={{ fontWeight: '700' }} />
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
      {data?.map((item: any, index) => (
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
      ))}
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
    // paddingHorizontal: 10,
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
    // paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editContentRow: {
    marginVertical: 5,
    borderRadius: 12,
    // paddingHorizontal: 10,
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
