import React from 'react';
import {View, ImageBackground, ScrollView} from 'react-native';
import {HeaderBackgroundImage} from '../../assets';
import {styles} from './style';

// Wrap you screen code in Wrapper Component 
// Like This <Wrapper><YOUR_COMPONENT><YOUR_COMPONENT/></Wrapper>
const Wrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <View>
      <ScrollView>
        <View style={{flex: 1}}>
          <ImageBackground
            style={styles.imageBackgroundStyle}
            imageStyle={styles.imageStyle}
            source={HeaderBackgroundImage}>
            {children}
          </ImageBackground>
        </View>
      </ScrollView>
    </View>
  );
};

export default Wrapper;
