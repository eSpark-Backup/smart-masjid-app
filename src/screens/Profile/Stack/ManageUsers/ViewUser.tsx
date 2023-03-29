import React from 'react';
import { View } from 'react-native';
import { Email, Phone, ProfileUser } from '../../../../assets';
import { MyText, ProfileSectionlist } from '../../../../components';

export default function ViewUsers({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1, marginTop: 90 }}>
      <ProfileSectionlist
        scroll={false}
        data={[
          {
            title: 'User Information',
            onIconPress: () => setFlag('modAcc'),
            data: [
              {
                title: 'Full Name',
                value: 'Kulsum Mudassir',
                icon: <ProfileUser />,
                onPress: () => console.log('no effect'),
              },
              {
                title: 'Email',
                value: 'kulsum@xyz.com',
                icon: <Email />,
                onPress: () => console.log('no effect'),
              },
              {
                title: 'Phone',
                value: '+1-412 214 2457',
                icon: <Phone />,
                onPress: () => console.log('no effect'),
              },
            ],
          },
        ]}
      />
    </View>
  );
}
