import { Link, useNavigate } from "react-router-dom";
import { sanitizeInput, validaPassword, validInput } from "../utils/utils";
import { useFetchWithLoading} from "../utils/hook";
import {  useContext, useEffect, useState } from "react";
import { ContextData } from "../data/context";

function Register(){
    const {urlRegister, setMessage} = useContext(ContextData);
    const navigate = useNavigate();
    console.log('urlRegister: '+urlRegister)
    const [errors, setErrors] = useState([]);
    const fetchData = useFetchWithLoading();

    function clearDataAndSendFetch(e) {
        console.log('inizio')
        e.preventDefault();

        const form = e.target;
        const error = [];
        const data = {
            username: form.username.value,
            name: form.name.value,
            surname: form.surname.value,
            email: form.email.value,
            password: form.password.value,
        };

        const confirmPas = form.confirmPassword.value;

        // 1. Validazione password
        const passwordValidation = validaPassword(data.password, confirmPas);
        if (passwordValidation !== true) {
            error.push(passwordValidation);
        }

        // 2. Validazione e sanitizzazione campi
        Object.entries(data).forEach(([key, value]) => {
            if (!validInput(value)) {
            error.push(`Il campo "${key}" deve avere almeno 3 caratteri.`);
            } else {
            data[key] = sanitizeInput(value); // Sanitizza se valido
            }
        });
        console.log(error)
        // 3. Gestione errori o invio
            setErrors(error);
        
            if(!error.length){

                register(data) 
            }

  
    }
    useEffect(() =>{
        
    },[errors]);
    async function register(dataObj){
        console.log('register inizio')
        const response = await fetchData(urlRegister, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(dataObj)
        })
        const message = response;
        console.log()
        if(message.error){
            setErrors(errors => [message.error])
            return;
        }

        setMessage("Email "+response.email+" è stata registrata. Effettua il Login.");
        navigate('/login')
        console.log('response finale ',response)
    }

    return <>
        <div className="contRegister">
            <form onSubmit={clearDataAndSendFetch}>
                <label htmlFor="username">username</label>
                <input type="text" name="username"/>
                <label htmlFor="name">Name</label>
                <input type="text" name="name"/>
                <label htmlFor="surname">Surname</label>
                <input type="text" name="surname"/>
                <label htmlFor="email">Email</label>
                <input type="text" name="email"/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password"/>
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="password" name="confirmPassword"/>
                <button type="submit">Register</button>
            </form>

            <Link to="/login">Sei già iscritto? Fai Login!!</Link>
            <ul>
                {errors && errors.map(error => <li>{error}</li>)}
            </ul>
            
        </div>
    </>
}

export default Register;