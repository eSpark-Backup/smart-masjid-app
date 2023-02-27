import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EditTimeTable, MuteSvg } from '../../assets';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataProps {
  name: string;
  azanTiming: string;
  iqamahTiming: string;
}

export default function TimeTable({
  data,
  isMute = false,
  isEdit = false,
}: {
  data: DataProps[];
  isMute?: boolean;
  isEdit?: boolean;
}) {
  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerCol}>
            <TextLabel label="Salah" />
          </View>
          <View style={styles.headerCol}>
            <TextLabel label="Adhan" />
          </View>
          <View style={styles.headerCol}>
            <TextLabel label="Iqamah" />
          </View>
          {isMute && <View style={styles.headerIcon} />}
          {isEdit && <View style={styles.headerIcon} />}
        </View>
        <GapView />
        <MyDivider style={{ alignSelf: 'center', width: '99%' }} />

        {data?.map((item, index) => {
          return (
            <View key={`${item?.name}-${index}`} style={styles.contentRow}>
              <View style={styles.contentCol}>
                <MyText text={item.name} size={16} />
              </View>
              <View style={styles.contentCol}>
                <MyText text={item.azanTiming} size={16} />
              </View>
              <View style={styles.contentCol}>
                <MyText text={item.iqamahTiming} size={16} />
              </View>
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
