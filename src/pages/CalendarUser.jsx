import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchWithLoading } from "../utils/hook";
import { ContextData } from "../data/context";
import MyCalendar from "./MyCalendar";
import { invertDataString } from "../utils/utils";
import FormEvent from "../components/subComponents/FormEvent";


function CalendarUser(){
    const { id } = useParams();
    const { urlCalendarUser,  typeServices} = useContext(ContextData)
    const [events, setEvent] = useState([])
    const [open, setOpen] = useState(false)
    const [date, setData] = useState(false)
    const [services, setServices] = useState(typeServices)
    const fetchData = useFetchWithLoading();

    useEffect(()=>{
        getCalendarUser()
    },[])

    async function getCalendarUser() {
        try{
            const res = await fetchData(`${urlCalendarUser}/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            
            setEvent(res.map(event => { 
                return {
                    "title": event.summary,
                    "start": event.start.dateTime ?? event.start.date,
                    "end":event.end.dateTime ?? event.end.date

                }
            }))
            

        }catch(e){
            console.log('error in calendarUser: ' + e);
        }

        
    }
    console.log(events)
    function createEvent(dateCalendar){
        setOpen(openOld => !openOld)
        console.log('datecalendar ',dateCalendar)
        setData(dateCalendar)
        
    }
    
    
    
    return (
        <>
            <div className="contCalendar">
                <div className="calendar">
                    {events && <MyCalendar events={events} openCreateEvent={createEvent} setCloseCreateEvent={setOpen}></MyCalendar>}
                    
                </div>
                <div className={`bookingHour ${open ? "open" : ""}`}>
                    {(date)  && <FormEvent date={date} events={events} service={services[0]}></FormEvent>}
                </div>

            </div>
        </>
    )
}

export default CalendarUser