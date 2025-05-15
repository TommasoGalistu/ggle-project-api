import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { GoogleOAuthProvider, hasGrantedAllScopesGoogle, useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { hasGrantedAnyScopeGoogle } from '@react-oauth/google';
import { useFetchWithLoading } from "../../utils/hook";

// Sostituisci questi con le TUE credenziali da Google Cloud Console
const CLIENT_ID = "16519806287-3rjslvfccml8fref9o348sobssufb3r9.apps.googleusercontent.com";
const API_KEY = "AIzaSyA3rCs7SkStqSKsbzn_i7uLfS5H9fKEDJk";
const SCOPES = "https://www.googleapis.com/auth/calendar";


function HomeUser() {
    const [token, setToken] = useState(null);
     const [events, setEvents] = useState([]);
    const fetchData = useFetchWithLoading()
    
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setToken(tokenResponse.access_token);
        },
        scope: SCOPES,
        onError: (err) => {
        console.error('Login error:', err);
        }
    });
const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
     useEffect(() => {
        if (!token) return;

        const initClient = () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        }).then(() => {
            return gapi.client.calendar.events.list({
                    calendarId: 'primary',
                    maxResults: 100,
                    singleEvents: true,
                    orderBy: 'startTime',
                    timeMin: new Date().toISOString(),
                    // q: "Vermifugo" // puoi inserire una parola chiave per filtrare i risultati
                    // timeZone: 'Europe/Rome'
            });
        }).then(response => {
            const events = response.result.items;
            setEvents(events);
            console.log('map',events.filter(event => event.summary == "Prova di evento"))
            console.log("Eventi:", events);
        }).catch(err => {
            console.error("Errore caricando eventi:", err);
        });
        };

        gapi.load("client", initClient);
  }, [token]);

    
    const credentialResponse = response =>{
    
        prova(response.credential)
    }
    // function prova(token){
    //     console.log(hasGrantedAnyScopeGoogle(token, "https://wwww.googleapis.com/auth/calendar"))
    // }


    return (
        <>
            <h1>Goole calendar</h1>
            
                <button onClick={() => login()}>Prova google</button>

                {/* <GoogleLogin onSuccess={credentialResponse}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        
                        />       */}
            
        </>
    );
}

export default HomeUser;
