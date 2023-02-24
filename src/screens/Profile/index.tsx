import React from 'react';
import { ScrollView } from 'react-native';

import { About, AccountGear, Help, MasjidGear, Privacy } from '../../assets';
import {
  GapView,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
} from '../../components';
import { Wrapper } from '../../containers';

export default function Profile() {
  return (
    <Wrapper bgImageSpacer={false} showFooter={false}>
      <ProfileAvatar />
      <MyDivider
        style={{ alignSelf: 'center', top: 22 }}
        height={2}
        backgroundColor={'#9E9F9F'}
      />
      <GapView length={20} />
      <ProfileSectionlist
        data={[
          {
            title: 'User Information',
            data: [
              {
                title: 'Manage Account',
                icon: <AccountGear />,
                onPress: () => console.log('press hoa account'),
              },
              {
                title: 'Manage Masjid',
                icon: <MasjidGear />,
                onPress: () => console.log('press hoa masjid'),
              },
            ],
          },
        ]}
        footerData={[
          {
            title: 'Help',
            icon: <About />,
            onPress: () => console.log('pressed'),
          },
          {
            title: 'Privacy',
            icon: <Privacy />,
            onPress: () => console.log('pressed'),
          },
          {
            title: 'About us',
            icon: <Help />,
            onPress: () => console.log('pressed'),
          },
        ]}
      />
    </Wrapper>
  );
}
