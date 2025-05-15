import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";


function MyCalendar({events, openCreateEvent, setCloseCreateEvent}){
    const [selectedDate, setSelectedDate] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showMenu, setShowMenu] = useState(false);
    

    function handleDateClick(info) {
        setSelectedDate(info.dateStr);
        setCloseCreateEvent(false)
        const rect = info.dayEl.getBoundingClientRect();
        setMenuPosition({
            x: rect.left,
            y: rect.top + rect.height, // posizione subito sotto la cella
        });

        setShowMenu(true);
    }
    function callOpenCreateEvent(){
        setShowMenu(false);
        openCreateEvent(selectedDate)
    }

    function handleCloseMenu() {
        setShowMenu(false);
    }

    // non funziona ma lo vedo dopo
    function handleCellMount(info) {
        const cellDate = info.date.toISOString().split("T")[0];
        console.log(cellDate === selectedDate)
        if (cellDate === selectedDate) {
            
            info.el.classList.add("selected-cell");
        } else {
        info.el.classList.remove("selected-cell");
        }
    };

    return (
        <>
        
        <FullCalendar
                        
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        selectable={true}
                        dayCellDidMount={handleCellMount}
                        dateClick={handleDateClick}
                        contentHeight="auto"
                        events={events}
                        
                        
                    />

                    {showMenu && <div id="contMenuCalendar" style={{
                                                        position: "absolute",
                                                        background: "white",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "8px",
                                                        padding: "10px",
                                                        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                                                        zIndex: 100,
                                                        top: menuPosition.y ,
                                                        left: menuPosition.x ,
                                                        display: "flex",
                                                        flexDirection: "column"
                                        
                                    }}>
                                    <button onClick={() => callOpenCreateEvent()}>Inserisci evento</button>
                                    <button onClick={handleCloseMenu}>Chiudi</button>
                                </div>}

                    
        </>
    )
}

export default MyCalendar;