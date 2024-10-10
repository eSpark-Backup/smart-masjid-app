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
} from '../../../../../../api/masjidController';
import {
  GapView,
  LogoutModal,
  MyText,
  MyTitle,
  TimeSheet,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import {
  JumuahTimings,
  SalahTimings,
} from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';
import { userStore } from '../../../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { Publish } from '../../../../../../assets';
import { globalStore } from '../../../../../../store/GlobalStates';
import { GlobalProps } from '../../../../../../types';
import { GetMonthlySchedule } from '../../../../../../api/userController';

export default function History({
  contentOpacity = 0,
  setFlag,
  masjidId,
}: {
  contentOpacity?: any;
  setFlag: (value: string) => void;
  masjidId?: number;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const userData = useHookstate(userStore.userData).get();
  const monthlyScheduleData = useHookstate(userStore.monthlySchedule).get();
  const schedule = useHookstate(userStore.monthlySchedule);

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

  const onDateChange = (e: Date) => {
    setCurrentDate(e);
    state.globalLoading.set(true);
    getSalahTimingsOfMasjid(
      userData?.masjid?.id.toString() as string,
      moment(e).startOf('month').format('YYYY-MM-DD') as string,
      'MONTH',
    ).then((timings: SalahTimings[] | undefined) => {
      convertTimings(timings);
      state.globalLoading.set(false);
    });

    // const currentIndex = data.findIndex((value: IPrayerTimeForPeriod) => {
    //   return value.date == moment(e).format('YYYY-MM-DD');
    // });

    // if (currentIndex != -1) {
    //   slider.current?.scrollToIndex({
    //     index: currentIndex,
    //     animated: true,
    //   });
    // }
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

  const getScheduleData = async () => {
    const res = await GetMonthlySchedule(
      userData?.masjid.id!,
      currentDate.getMonth() + 1,
      currentDate.getFullYear(),
    );
    if (res) {
      schedule.set(res);
      setFlag('HistSett');
    } else {
      schedule.set(null);
      setFlag('HistSett');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <LogoutModal
        visible={prompt2}
        message={`Monthly Schedule sent successfully.\n\nWould you like to download the PDF as well?`}
        onAllowed={() => {
          setPrompt2(false);
          isPermitted();
        }}
        onClose={() => setPrompt2(false)}
      />
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
              // success
            })
            .catch(error => {
              // error
              console.log('err view error', error);
              // showMessage({
              //   message: 'PDF Generated Successfully',
              //   description: 'to: ' + file.filePath.slice(19),
              //   type: 'success',
              //   icon: 'auto',
              // });
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
        {/* <OverlayLoader isShow={loading} /> */}
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
            // currentDate={currentDate.getMonth}
            currentDate={moment()
              .year(currentDate.getFullYear())
              .month(currentDate.getMonth())
              .date(1)
              .toDate()}
            onDateChange={onDateChange}
            dateFormat={'Monthly'}
          />
          <View
            style={{
              position: 'absolute',
              right: 20,
              flexDirection: 'row',
            }}>
            {/* <TouchableOpacity onPress={() => setPrompt1(true)}>
              <Mail />
            </TouchableOpacity>
            <GapView mode="horizontal" />
            <TouchableOpacity onPress={isPermitted}>
              <Download />
            </TouchableOpacity> */}
            <GapView mode="horizontal" />
            <TouchableOpacity onPress={getScheduleData}>
              <Publish />
            </TouchableOpacity>
          </View>
        </View>
        {adhaTime?.length < 1 && !state.globalLoading.get() ? (
          <MyText
            textStyle={{ textAlign: 'center', marginVertical: 10 }}
            text="No schedule of current month to show!"
          />
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
