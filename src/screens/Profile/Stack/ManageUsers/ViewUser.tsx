import React from 'react';
import { View, Animated, Platform } from 'react-native';

import {
  Email,
  ManageUser,
  PeoplesSvg,
  Phone,
  ProfileUser,
} from '../../../../assets';
import { GapView, MyTitle, ProfileSectionlist } from '../../../../components';
import { WINDOW_WIDTH } from '../../../../constants';
import { UserResponse } from '../../../../types/userControllerApiResponse';
import { parsePhoneNumber } from 'libphonenumber-js';

export default function ViewUsers({
  setFlag,
  user = null,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  user?: UserResponse | null | undefined;
  contentOpacity?: any;
}) {
  return (
    <View style={{ flex: 1, marginTop: 0 }}>
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
          <MyTitle text="User Information" />
        </Animated.View>
      </View>
      <GapView />
      <View>
        <ProfileSectionlist
          scroll={false}
          cardWidth={'40%'}
          data={[
            {
              title: 'User Information',
              onIconPress: () => setFlag('modAcc'),
              data: [
                {
                  title: 'Full Name',
                  value: user?.firstName + ' ' + user?.lastName,
                  onPress: () => console.log('no effect'),
                },
                {
                  title: 'Email',
                  value: user?.email ?? '-',
                  onPress: () => console.log('no effect'),
                },
                {
                  title: 'Phone',
                  value: user?.phone!
                    ? parsePhoneNumber(user?.phone!).formatInternational()
                    : '-',
                  onPress: () => console.log('no effect'),
                },
                {
                  title: 'Role',
                  value: user?.userType.name ?? '-',
                  onPress: () => console.log('no effect'),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}
