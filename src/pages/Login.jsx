import { useContext, useEffect, useState } from "react"
import { ContextData } from "../data/context"
import { Link, useNavigate } from "react-router-dom";
import { validInput } from "../utils/utils";
import { useFetchWithLoading } from "../utils/hook";

function Login(){
    const {message, urlLogin} = useContext(ContextData)
    const [errors, setErrors] = useState([]);
    const fetchData = useFetchWithLoading();
    const navigate = useNavigate();


    useEffect(() =>{
            
        },[errors]);


    function clearAndFetch(e){
        e.preventDefault();
        const form = e.target;
        const error = [];
        let data = {}
        const validInputBool = validInput(form.email.value) && validInput(form.password.value);


        if(validInputBool){
            data = {
                email: form.email.value,
                password: form.password.value,
            };

            login(data)
        }
    }

    async function login(data){
        console.log('login inizio')
        const response = await fetchData(urlLogin, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
        const message = response;
        
        if(message.error){
            setErrors(errors => [message.error])
            return;
        }

        
        navigate('/admin')
        
    }
    return (

            <div className="contLogin">
                <form onSubmit={clearAndFetch}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email"/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password"/>
                    <button type="submit">Login</button>
                </form>
                {message}

                <Link to="/register">Non sei ancora iscritto? Registrati</Link>
                <ul>
                    {errors && errors.map(error => <li>{error}</li>)}
                </ul>
            
            </div>
    )
}

export default Login;