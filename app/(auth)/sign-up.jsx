import { ScrollView, StyleSheet, Text, View, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField';
import {Link, router} from 'expo-router'
import {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";

import {images} from '../../constants'

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setform] = useState({
    username:'',
    email:'',
    password:'',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async ()=>{
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error','Please fill in all fields');
    }

    setIsSubmitting(true)
    try{
      const result = await createUser( form.email, form.password, form.username);
      // console.log(response)
      setUser(result);
      setIsLoggedIn(true);

      //set it to global state
      router.replace('/home');
    }catch(error){
      console.log("sign-up.js");
      Alert.alert('Error',error.message);
    }
    finally{
      setIsSubmitting(false)
    }
  }
  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[115px] h-[35px]"
          />
          <Text className="text=2xl text-white text-semibold mt-10 font-psemibold">
            Sign Up to Aora
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText ={(e)=>setform({...form, username: e})}
            otherStyles ="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText ={(e)=>setform({...form, email: e})}
            otherStyles ="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText ={(e)=>setform({...form, password: e})}
            otherStyles ="mt-7"
          />
          <CustomButton
            title="Sign Up "
            handlePress={submit}
            containerStyles="mt-8"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an Account?
            </Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({})