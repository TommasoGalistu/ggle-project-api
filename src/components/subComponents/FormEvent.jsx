import { useContext, useEffect, useRef, useState } from "react"
import { catchDateISO, getFormValuesAndCheck, getHourAndMinute, getTimezoneOffsetFormatted, invertDataString } from "../../utils/utils"
import { ContextData } from "../../data/context"
import { useFetchWithLoading } from "../../utils/hook"
import { useParams } from "react-router-dom"

function FormEvent({date, events, workHour = ['T09:00:00.000', 'T18:00:00.000'], service}){
    const [hourSelect, setHourSelect] = useState(null)
    const [selectHour, setSelectHour] = useState([])
    const [error, setError] = useState([])
    const [endEvent, setEndEvent] = useState(null)
    const [millService, setMillService] = useState(0)
    const [arrOrari, setArrOrari] = useState([])//fasce orarie comprese tra inizio e fine lavoro(default)
    const refForm = useRef()
    const [services, setServices] = useState(service)
    // ore settate di default dall'amministratore
    const [startWork, endWork] = workHour
    // data italianizzata da visualizzare
    const dateVisible = invertDataString(date, '-');
    
    const eventsFilter = filterEvent(events)
    const {urlCalendarUser} = useContext(ContextData)
    const fetchData = useFetchWithLoading();
    const { id } = useParams();
    

    useEffect(() =>{
        
        refForm.current.reset()
        //non si ri-renderizzano come dovrebbe, forzo un ulteriore reset dei dati
        setHourSelect(oldValue => null)
        setSelectHour(oldValue => [])
    },[date])

    
    function generateTimeSlots(startISO, endISO, serviseMill, service) {
        let start = new Date(startISO);
        let end = new Date(endISO);
        const slots = [];
        setMillService(old => service.duration)
        
        while ((start.getTime() + serviseMill) <= (end.getTime() - service.duration)) {
            const next = new Date(start.getTime() + serviseMill);

                slots.push({
                    start: start,
                    end: next
                });

                start = next;
        }
        
        setArrOrari(oldState => slots)

        
        filterHourFreeForSelect(eventsFilter, slots, service.duration)
        
        
        
    }

    function filterEvent(allEvents){
        return allEvents.filter(event => {
            return `${new Date(event.start).getDate()}/${new Date(event.start).getMonth()}/${new Date(event.start).getFullYear()}` == `${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()}`
        })
    }

    function filterHourFreeForSelect(eventsFiltred, allWorksHour, serviceTimeMill){
        let y = 0;
        const validSlots = [];
        // se il servizio non è di 24 ore filtro gli eventi con solo la data
        if(serviceTimeMill <= 86400000 ){
            eventsFiltred =eventsFiltred.filter(event => event.start.split('T').length > 1)
        }
        console.log(eventsFiltred, allWorksHour, serviceTimeMill)
        if(eventsFiltred.length){

            for (let i = 0; i < allWorksHour.length; i++) {
                const slotStart = new Date(allWorksHour[i].start).getTime();
                const slotEnd = slotStart + serviceTimeMill;

                const overlaps = eventsFiltred.some(event => {
                const eventStart = new Date(event.start).getTime();
                const eventEnd = new Date(event.end).getTime();

                    // verifica se c'è sovrapposizione tra slot e evento
                    return slotStart < eventEnd && slotEnd > eventStart;
                });

                if (!overlaps) {
                    validSlots.push(getHourAndMinute(slotStart));
                }
            }
            
            
                        
        }else{
            
            validSlots = allWorksHour.map(timeSlot =>{
                
                return getHourAndMinute(timeSlot.start)
            })
            
            
        }
        console.log('risultato: ',validSlots)
        setSelectHour(oldArrayHour => validSlots)
    }
    
    function createEndEvent(e){
        const dataEnd = new Date(`${date}T${e.target.value}`).getTime() + millService;
        setEndEvent(old => getHourAndMinute(new Date(dataEnd)))
        
    }
    
    
    // let selectOption = events
    function prepareData(e){
        e.preventDefault()
        if(endEvent == null){
            setError(old => ['Compila i campi richiesti'])
            return

        }
        //controllo dati ed invio richiesta
        let isFullOfDataEl = getFormValuesAndCheck(e.target)

        if(!isFullOfDataEl.valid){
            setError(old => ['Tutti i campi sono Obbligatori'])
            return
        }
        console.log(isFullOfDataEl.values)
        const data = {
            title: `${isFullOfDataEl.values.type_sevice} - ${isFullOfDataEl.values.name_client}`,
            start: `${date}T${isFullOfDataEl.values.hour_start}`,
            end: `${date}T${endEvent}`
        }

        sendDataCalendar(data)
        
    }

    async function sendDataCalendar(data){
        try{
            const res = await fetchData(`${urlCalendarUser}/${id}/${import.meta.env.VITE_ADD_EVENT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
    
            console.log(res)

        }catch(e){
            console.log(e)
        }
    }   
    


    return (
        <>
            {dateVisible && <spam>Data selezionata: {dateVisible}</spam>}
                    <form ref={refForm} onSubmit={prepareData}>
                        <label htmlFor="name_client">Inserisci il nome del cliente</label><br />
                        <input type="text" name="name_client" placeholder="Nome cliente"/><br />

                        <input type="radio" name="type_time" value="hour" onClick={() => setHourSelect(old => true)} />
                        <label htmlFor="type_time">Fascia oraria</label><br />
                        <input type="radio" name="type_time" value="day" onClick={() => setHourSelect(old => false)} />
                        <label htmlFor="type_time">Giornata intera</label><br />
                        <br />

                        {(services && hourSelect != null) && (
                            <>
                                {services.map((service, i) => (
                                    <div key={i}>
                                        <input value={service.name} onClick={() => generateTimeSlots(`${date}${startWork}`,`${date}${endWork}`, 900000, service)} type="radio" name="type_sevice" />
                                        <label htmlFor="type_sevice">{service.name}</label><br />
                                    </div>
                                    )
                                )}
                            </>
                            )    
                        }


                        
                        {(selectHour.length > 0 && hourSelect) && (
                            <div>
                                <select name="hour_start" id="hour" onChange={createEndEvent}>
                                    <option value="">- Seleziona -</option>
                                    {selectHour.map((select, i) =>{
                                        return <option key={i} value={select}>{select}</option>
                                    })}
                                </select><br />
                                {endEvent &&<spam>Orario di fine {endEvent}</spam>}
                                {/* <select name="hour_end" id="hour_end">
                                    <option></option>
                                </select> */}
                                   

                            </div>)
                        }
                        <br />

                        <button type="submit">Avanti</button>
                    </form>
        </>
    )
}

export default FormEvent