import { useContext, useEffect, useState } from "react";
import { ContextData } from "../data/context";
import { useNavigate } from "react-router-dom";

export const useFetchWithLoading = () => {
    // const { showLoading, hideLoading, setIsLoggin } = useContext(ContextData);

    const fetchData = async (url, options = {}) => {
        console.log('url: ',url)
        try {
            // showLoading();
            const response = await fetch(url, {
                ...options,
                credentials: "include", // Mantiene la sessione
            });

            if (!response.ok) throw new Error(await response.text());
            // setIsLoggin(true)
            return await response.json();
        } catch ({message}) {
            // setIsLoggin(false)
            console.log(message)
            return JSON.parse(message);
            
            
        }finally {
            setTimeout(() =>{
                // hideLoading(); 
            }, 1000)
        }
    };

    return fetchData;
};

export const useAuth = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const {isLoggin, setIsLoggin, urlAuth} = useContext(ContextData)

    useEffect (() =>{
        const checkAuth = async () =>{
          
            try{
              const response = await fetch(urlAuth, {
                method: "GET",
                credentials: "include"
              })
              
              if(!response.ok){
                throw new Error(await response.text());
              }
    
              const data = await response.json()
              setIsLoggin(data.message)
              setIsAuthenticated(true) 
              console.log(data.message)
            }catch(error){
              console.log(error.message);
              setIsLoggin(false);
              setIsAuthenticated(false) 
              navigate('/login')
            }
        }
        checkAuth();
      },[urlAuth, setIsLoggin])
      
    return isAuthenticated;
};
