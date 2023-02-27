import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EditTimeTable, MuteSvg } from '../../assets';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataProps {
  name?: string;
  azanTiming?: string;
  iqamahTiming?: string;
  khutbahTiming?: string;
}

export default function TimeTable({
  data,
  isMute = false,
  isEdit = false,
  headings = ['Salah', 'Adhan', 'Iqamah'],
  header = <></>,
}: {
  data: DataProps[];
  isMute?: boolean;
  isEdit?: boolean;
  headings?: string[];
  header?: React.ReactNode;
}) {
  return (
    <Card>
      <View style={styles.container}>
        {header}
        <View style={styles.headerRow}>
          {headings?.map(value => (
            <View key={value} style={styles.headerCol}>
              <TextLabel label={value} />
            </View>
          ))}
          {isMute && <View style={styles.headerIcon} />}
          {isEdit && <View style={styles.headerIcon} />}
        </View>
        <GapView />
        <MyDivider style={{ alignSelf: 'center', width: '99%' }} />
        {data?.map((item: any, index) => {
          return (
            <View key={`${item?.name}-${index}`} style={styles.contentRow}>
              {Object.keys(item)?.map((key: any) => (
                <View key={key} style={styles.contentCol}>
                  <MyText text={item[key]} size={16} />
                </View>
              ))}
              {isEdit && (
                <View style={styles.contentIcon}>
                  <EditTimeTable />
                </View>
              )}
              {isMute && (
                <View style={styles.contentIcon}>
                  <MuteSvg />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCol: { width: '30%', alignItems: 'center' },
  headerIcon: { width: '10%', alignItems: 'center' },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  contentCol: { width: '30%', alignItems: 'center' },
  contentIcon: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
