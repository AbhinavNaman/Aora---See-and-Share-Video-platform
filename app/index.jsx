import { StatusBar } from 'expo-status-bar';
import {  Text, View, ScrollView, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context'

import {images} from '../constants'
import CustomButton from '../components/CustomButton';

import {useGlobalContext} from '../context/GlobalProvider';

export default function App() {
  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect  href="/home"/>;
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View 
        className="w-full justify-center items-center h-full px-4"
        style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingTop: 10 }}
        >
          <Image 
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image 
            source={images.cards}
            className="max-w-[380px] h-[300px] w-full"
            resizeMode="contain"
          />
          
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              See and Share videos {' '}
              <Text className="text-secondary-200">
                 Aora
              </Text>
            </Text>
            <Image 
              source={images.path}
              // className="absolute w-[136px] h-[15px] -bottom-2 right-11 left-13"
              style={{
              position: 'absolute',
              width: 136,
              height: 15,
              top: '100%',
              left: '50%',
              marginTop: -7.5, // Half of the image height
              marginLeft: -68, // Half of the image width
            }}
              resizeMode='contain'
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Platform where you can see and share cat videos with other cat lovers around the globe
          </Text>
          <CustomButton
            title="continue with email"
            handlePress ={()=>router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar 
      backgroundColor='#161622'
       style='light'

       />
    </SafeAreaView>
    
  );
}


