import { useContext, useEffect, useState } from "react";
import { ContextData } from "../data/context";
import { Link, useLocation, useParams } from "react-router-dom";
import { useFetchWithLoading } from "../utils/hook";

function AccessAuthCalendar(){
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const {urlGetAllAdmin, urlGoogleAuth} = useContext(ContextData)
    const fetchData = useFetchWithLoading();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('msg');
    useEffect(() =>{
        GetUser()
    },[])

    async function GetUser(){
        try{
            const user = await fetchData(`${urlGetAllAdmin}/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            setUser(user)
            console.log('user: ',user)

        }catch(e){
            console.log('errore in calendarUser: ',e)
        }
    }

    async function generateRefreshToken(event){
        event.preventDefault();
        try{
            const res = await fetchData(urlGoogleAuth,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({id: user._id})
            })
            
            window.location.href = res.url

        }catch(e){
            console.log('errore richiesta refresh_token: ',e)
        }

        
    }
    return <div>
        {user && <h3>Calendario di {user.name} {user.surname}</h3>}
        {user && <h5>indirizzo email: {user.email}</h5>}
        {user && <button onClick={generateRefreshToken}>Collega Google</button>}
        {user && <Link to={`/calendario/${user._id}`}>Pagina per cliente</Link>}
        {message && <div>{message}</div>}
    </div>
}

export default AccessAuthCalendar;