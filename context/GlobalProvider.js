import {createContext, useContext , useState, useEffect} from 'react';
import { getCurrentUser } from '../lib/appwrite';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider= ({children}) =>{

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      getCurrentUser()
      .then((res)=>{
        if(res){
            // console.log("GlobalPrivider.js > isLoggedIn > inside if: ",isLoggedIn);
            setIsLoggedIn(true);
            setUser(res);
        }

        // console.log("GlobalPrivider.js > isLoggedIn : ",isLoggedIn);
        // console.log("GlobalPrivider.js > user : ",user);
      })
      .catch((err) =>{
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
    }, [])
    

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;