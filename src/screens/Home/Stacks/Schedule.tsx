import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import moment from 'moment';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import FileViewer from 'react-native-file-viewer';

import {
  getJummahTimingsOfMasjid,
  getSalahTimingsOfMasjid,
} from '../../../api/masjidController';
import {
  GapView,
  LogoutModal,
  MyText,
  MyTitle,
  TimeSheet,
} from '../../../components';
import MyDatePicker from '../../../components/MyDatePicker';
import {
  JumuahTimings,
  SalahTimings,
} from '../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../utils/functions';
import { userStore } from '../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../constants';
import { Download } from '../../../assets';
import { globalStore } from '../../../store/GlobalStates';
import { GlobalProps } from '../../../types';
import { GetMonthlySchedule } from '../../../api/userController';

export default function Schedule({
  contentOpacity = 0,
  masjidId,
}: {
  contentOpacity?: any;
  masjidId?: number;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const userData = useHookstate(userStore.userData).get();
  const monthlyScheduleData = useHookstate(userStore.monthlySchedule).get();
  const [noMonthlyData, setNoMonthlyData] = useState<boolean | null>(null);
  const [adhaTime, setAdhaTime] = useState([]);
  const [jummaTime, setJummaTime] = useState<JumuahTimings[] | []>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [downloadPrompt, setDownloadPrompt] = useState(false);
  const [prompt2, setPrompt2] = useState(false);
  const [filePath, setFilePath] = useState('');

  useEffect(() => {
    state.globalLoading.set(true);
    getSalahTimingsOfMasjid(
      masjidId?.toString() ?? (userData?.masjid?.id.toString() as string),
      moment().startOf('month').format('YYYY-MM-DD'),
      'MONTH',
    ).then((timings: SalahTimings[] | undefined) => {
      convertTimings(timings);
      getJummahTimingsOfMasjid(
        masjidId?.toString() ?? (userData?.masjid?.id.toString() as string),
        moment().startOf('month').format('YYYY-MM-DD'),
      ).then((timings: JumuahTimings[] | undefined) => {
        setJummaTime(timings!);
        state.globalLoading.set(false);
      });
    });
  }, []);

  const onDateChange = async (e: Date) => {
    state.globalLoading.set(true);
    setCurrentDate(e);
    const getScheduleInfo = await GetMonthlySchedule(
      userData?.masjid?.id as number,
      moment(e).month() + 1,
      moment(e).year(),
    );
    if (getScheduleInfo) {
      getSalahTimingsOfMasjid(
        userData?.masjid?.id.toString() as string,
        moment(e).startOf('month').format('YYYY-MM-DD') as string,
        'MONTH',
      ).then((timings: SalahTimings[] | undefined) => {
        convertTimings(timings);
        getJummahTimingsOfMasjid(
          masjidId?.toString() ?? (userData?.masjid?.id.toString() as string),
          moment().startOf('month').format('YYYY-MM-DD'),
        ).then((timings: JumuahTimings[] | undefined) => {
          setJummaTime(timings!);
          setNoMonthlyData(false);
          state.globalLoading.set(false);
        });
      });
    } else {
      setAdhaTime([]);
      setJummaTime([]);
      setNoMonthlyData(true);
      state.globalLoading.set(false);
    }
  };

  const convertTimings = (timings: SalahTimings[] | undefined) => {
    let adhanTiming: any = timings?.map(item => {
      let time: any = {
        date: item.date,
      };
      item.salah.forEach(sItem => {
        time[sItem.name + ' Adhan'] = moment(
          sItem.adhanTime,
          'HH:mm:ss',
        ).format('hh:mm:ss');
        time[sItem.name + ' Iqama'] = moment(
          sItem.iqamaTime,
          'HH:mm:ss',
        ).format('hh:mm:ss');
      });
      return time;
    });
    setAdhaTime(adhanTiming);
  };

  const isPermitted = async () => {
    let deviceVersion = DeviceInfo.getSystemVersion();
    if (Platform.OS === 'android' && !Boolean(Number(deviceVersion) >= 11)) {
      try {
        let granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        console.log('granted', granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          state.globalLoading.set(true);
          downloadFile(monthlyScheduleData?.url!);
        }
      } catch (err) {
        console.log('Write permission err', err);
        return false;
      }
    } else {
      state.globalLoading.set(true);
      downloadFile(monthlyScheduleData?.url!);
    }
  };

  const downloadFile = (path: string) => {
    const url = path;

    const regex = /\/([^/]+)$/; // Match the last '/' and capture the text after it
    const matches = url.match(regex);
    const fileName = matches ? matches[0] : 'example.pdf';

    let filePath: string;
    if (Platform.OS == 'ios') {
      filePath = RNFS.DocumentDirectoryPath + fileName;
    } else {
      filePath = RNFS.DownloadDirectoryPath + fileName;
    }

    console.log('filePath', filePath);

    RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      background: true, // Enable downloading in the background (iOS only)
      discretionary: true, // Allow the OS to control the timing and speed (iOS only)
      progress: res => {
        // Handle download progress updates if needed
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Progress: ${progress.toFixed(2)}%`);
      },
    })
      .promise.then(response => {
        console.log('File downloaded!', response);
        setFilePath(filePath);
        setDownloadPrompt(true);
        state.globalLoading.set(false);
      })
      .catch(err => {
        console.log('Download error:', err);
        setDownloadPrompt(false);
        state.globalLoading.set(false);
      });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <LogoutModal
        visible={downloadPrompt}
        message={`Monthly Schedule downloaded successfully.\n\nWould you like to view the downloaded PDF?`}
        onAllowed={() => {
          FileViewer.open(filePath, {
            onDismiss() {
              setDownloadPrompt(false);
            },
          })
            .then(() => {
              setDownloadPrompt(false);
              // success
            })
            .catch(error => {
              setDownloadPrompt(false);
              // error
              console.log('err view error', error);
            });
        }}
        onClose={() => setDownloadPrompt(false)}
      />
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Monthly Schedule" />
        </Animated.View>
      </View>

      <View>
        <GapView />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: WINDOW_WIDTH,
          }}>
          <MyDatePicker
            minimumDate={moment().startOf('month').date(2).toDate()}
            maximumDate={moment().add(4, 'month').date(1).toDate()}
            disablePicker
            type="standard"
            currentDate={moment()
              .year(currentDate.getFullYear())
              .month(currentDate.getMonth())
              .date(1)
              .toDate()}
            onDateChange={onDateChange}
            dateFormat={'FullMonth'}
          />
          <View
            style={{
              position: 'absolute',
              right: 20,
              flexDirection: 'row',
            }}>
            <GapView mode="horizontal" />
            <TouchableOpacity onPress={() => isPermitted()}>
              {noMonthlyData == null && monthlyScheduleData?.url ? (
                <Download />
              ) : noMonthlyData == false ? (
                <Download />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
        {adhaTime?.length < 1 && !state.globalLoading.get() ? (
          <View
            style={{
              flex: 0.8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MyText
              textStyle={{
                textAlign: 'center',
              }}
              text="Monthly Schedule not published yet!"
            />
          </View>
        ) : (
          <TimeSheet
            data={convertResponseToData(adhaTime) ?? []}
            jummaData={jummaTime}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
