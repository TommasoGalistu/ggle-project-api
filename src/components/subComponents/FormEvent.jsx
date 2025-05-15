import { useState } from "react"
import { catchDateISO, getHourAndMinute, getTimezoneOffsetFormatted, invertDataString } from "../../utils/utils"

function FormEvent({date, events, workHour = ['T09:00:00.000', 'T22:00:00.000'], service}){
    const [showHour, setShowHour] = useState(false)
    // ore settate di default dall'amministratore
    const [startWork, endWork] = workHour
    // data italianizzata da visualizzare
    const dateVisible = invertDataString(date, '-');
    const arrOrari = generateTimeSlots(`${date}${startWork}`,`${date}${endWork}`, 900000)
    const eventsFilter = filterEvent(events)
    const orariForSelect = filterHourFreeForSelect(eventsFilter, arrOrari)

    function generateTimeSlots(startISO, endISO, serviseMill) {
        let start = new Date(startISO);
        let end = new Date(endISO);
        const slots = [];
        
        
        while ((start.getTime() + serviseMill) <= end.getTime()) {
            const next = new Date(start.getTime() + serviseMill);

                slots.push({
                    start: start,
                    end: next
                });

                start = next;
        }
        console.log(slots)
        return slots;
    }

    function filterEvent(allEvents){
        return allEvents.filter(event => {
            return `${new Date(event.start).getDate()}/${new Date(event.start).getMonth()}/${new Date(event.start).getFullYear()}` == `${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()}`
        })
    }

    function filterHourFreeForSelect(eventsFiltred, allWorksHour){
        let i = 0;
        let inEvent = false;
        
        if(eventsFiltred.length){
            
            return allWorksHour.filter(timeSlot =>{
                
                let startOption = getHourAndMinute(timeSlot.start);
                let startEventBooked = getHourAndMinute(eventsFiltred[i].start)

                if(startOption == startEventBooked){
                    // se gli orari coincidono non devo segnare l'evento e segnalo che sono dentro all'evento già segnato
                    inEvent = true
                    return false;
                }else if(inEvent){
                    // quando l'inizio dell'evento coincide con la fine allora ricomincio a segnare gli orari
                    if(startOption == getHourAndMinute(eventsFiltred[i].end)){
                        inEvent = false;
                        (eventsFiltred.length -1) > i ? i++ : ''
                        return true
                    }
                    return false
                }
                return getHourAndMinute(timeSlot.start) != getHourAndMinute(eventsFiltred[i].start) ? getHourAndMinute(timeSlot.start):''
            })
        }else{
            return allWorksHour.map(timeSlot =>{
                
                return getHourAndMinute(timeSlot.start)
            })
        }
    }
    
    console.log('orari for select: ',orariForSelect)

    
    // let selectOption = events

    


    return (
        <>
            {dateVisible && <spam>Data selezionata: {dateVisible}</spam>}
                    <form >
                        <input type="radio" onChange={() => setShowHour(showHour => true)} name="type_time" />
                        <label for="type_time">Fascia oraria</label><br />
                        <input type="radio" onChange={() => setShowHour(showHour => false)} name="type_time" />
                        <label for="type_time">Giornata intera</label><br />
                        {showHour && <select name="hour" id="hour">
                            <option value="">- Seleziona -</option>
                        </select>}
                        <br />
                        <button type="submit">Avanti</button>
                    </form>
        </>
    )
}

export default FormEvent