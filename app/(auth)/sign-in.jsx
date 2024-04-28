import { ScrollView, StyleSheet, Text, View, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField';
import {Link, router} from 'expo-router'
import {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from "../../context/GlobalProvider";

import {images} from '../../constants'
import { signIn, getCurrentUser } from '../../lib/appwrite';

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setform] = useState({
    email:'',
    password:'',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async ()=>{
    if( !form.email || !form.password){
      Alert.alert('Error','Please fill in all fields');
    }

    setIsSubmitting(true)
    try{
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      console.log("auth > sign-in.js > result: " , result);
      //set it to global state
      setUser(result);
      setIsLoggedIn(true);

      // Alert.alert("Success", "User signed in successfully");

      router.replace('/home');
    }catch(error){
      console.log("auth > sign-in > submit")
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
            Login to Aora
          </Text>
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
            title="Sign In "
            handlePress={submit}
            containerStyles="mt-8"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              don't have an Account?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({})