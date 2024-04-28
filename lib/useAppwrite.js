import { StyleSheet, Text, View, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'

const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchData = async () => {
      setIsLoading(true);
  
      try {
        const response = await fn();
        setData(response);
      } catch (error) {
        console.log("useAppwrite");
        Alert.alert('Error', error.meassage);
      }
      finally{
        setIsLoading(false);
      }
    }
    useEffect(() => {
      fetchData();
    }, [])

    const refetch = () => {
        fetchData();
    }
    
    return {data, isLoading, refetch}
}

export default useAppwrite

const styles = StyleSheet.create({})