import { useContext, useEffect, useState } from "react"
import { useFetchWithLoading } from "../utils/hook";
import { ContextData } from "../data/context";
import { Link } from "react-router-dom";

function ListUser(){
    const fetchData = useFetchWithLoading();
    const {urlGetAllAdmin} = useContext(ContextData)
    const [listAdmin, setListAdmin] = useState([])
    useEffect(() =>{
        
        getAllAdmin()
    }, [])

    async function getAllAdmin(){
        try{

            const response = await fetchData(urlGetAllAdmin, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if(!response.length){
                throw new Error(response)
            }
            console.log('elenco admin ',response)
            setListAdmin(response)
        }catch(e){
            console.log('errori listUser: ',e)
        }


        }
    return (
        <>
            <div className="contAdmin">
                <ul>
                    {listAdmin && listAdmin.map(admin => <li key={admin._id}><Link to={`/elenco-admin/${admin._id}`}>{admin.name} {admin.surname}</Link></li>)}
                </ul>
            </div>
        </>
    )
}

export default ListUser