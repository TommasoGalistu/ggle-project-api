import { createContext, useState } from "react";



export const ContextData = createContext();

export const ContextProvider = ({children}) => {
    const [isLoggin, setIsLoggin] = useState(false);
    const [visibleElement, setVisibleElement] = useState(true);
    const [message, setMessage] = useState()
    // rotte libere
    const url = import.meta.env.VITE_MONGO_API_URL
    const urlRegister = url + import.meta.env.VITE_REGISTER
    const urlLogin = url + import.meta.env.VITE_LOGIN
    const urlGetAllAdmin = url + import.meta.env.VITE_LIST_USER;
    const urlGoogleAuth = url + import.meta.env.VITE_GGLE_AUTH;
    const urlCalendarUser = url + import.meta.env.VITE_CALENDAR_USER;

    // dopo aver creato la tabella importerò tutto da db
    const typeServices = [
        {
            name: "Taglio capelli",
            duration: 1800000//30 minuti
        },
        {
            name: "Lezione Loris",
            duration: 3600000//60 minuti
        },
        {
            name: "Affitto campo tennis",
            duration: 5400000//90 minuti
        }
    ]
    // rotte protette
    const urlAuth = import.meta.env.VITE_MONGO_BASEAPI_USER + import.meta.env.VITE_AUTH

    const userPage = () =>{

    }

    return <>
        <ContextData.Provider value={{typeServices, urlCalendarUser, userPage, visibleElement, urlRegister, setMessage, message, urlLogin, urlAuth,setIsLoggin,urlGetAllAdmin, urlGoogleAuth}}>
            {children}
        </ContextData.Provider>
    </>
}