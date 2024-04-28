import {  View, FlatList, TouchableOpacity, Image } from 'react-native'
import React,{ useEffect} from 'react'
import EmptyState from '../../components/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context'

import { getUserPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import {useGlobalContext} from '../../context/GlobalProvider'
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';
import { signOut } from '../../lib/appwrite';
import { router } from 'expo-router';

const Profile = () => {
  const {user, setUser, setIsLoggedIn} = useGlobalContext();
  const {data: posts} = useAppwrite(()=> getUserPosts(user.$id));

  const logout = async ()=> {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
    //if you use push you can go back to the prev URL
    //using replace you cannot navigate back
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item)=> item.$id}
        renderItem={({item})=> (
          <VideoCard
            video={item}
          />
        )}
        ListHeaderComponent={()=>(
          <View className="w-full justify-center items-center mb-8 px-4 ">
            <TouchableOpacity 
              className="w-full items-end mb-6 mt-4 mr-4"
              onPress={logout}
              >
              <Image
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{uri: user?.avatar}}
                resizeMode='cover'
                className="w-[90%] h-[90%] rounded-lg"
              />
            </View>
            <InfoBox
              title={user?.username}
              subtitle={user?.email}
              containerStyle ='mt-5'
              titleStyles='text-lg mt-6'
            />
            <View className="mt-5 flex-row">
            <InfoBox
              title={posts.length || 0}
              subtitle="Posts"
              containerStyles ='mr-10'
              titleStyles='text-xl'
            />
            <InfoBox
              title={"1.2k"}
              subtitle="Followers"
              titleStyles='text-xl'
            />
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState
            title="No Videos Found"
            subtitle="No Videos Found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Profile