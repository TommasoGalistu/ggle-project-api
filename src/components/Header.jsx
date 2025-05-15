
import ListMenu from "./subComponents/listMenu.jsx";
import Jambotron from "./subComponents/Jambotron.jsx";
import { useContext } from "react";
import { ContextData } from "../data/context.jsx";
import { Link } from "react-router-dom";



function Header(){

    const {userPage} = useContext(ContextData);


    return <>
        <header>
            <nav>
                <div className="upperHeader">
                    
                    <div className="menuNoResponsive">menu no responsive</div>
                    <div>
                        <img src="" alt="foto logo" />
                    </div>
                    <div>
                        <ul>
                            
                            <ListMenu icon={"fa-solid fa-user"} click={userPage} link="/register"></ListMenu>
                            
                        </ul>
                    </div>

                </div>
                <div className="bottomHeader">
                    <div className="contMenuBottomResNoRes">
                        <ul>
                            <Link to="/">Home</Link>
                            <Link to="/register">Register</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/admin">HomeUser</Link>
                            <Link to="/elenco-admin">ListUser</Link>
                            <Link></Link>
                        </ul>
                    </div>
                    <div className="contMenuBottomRes">
                        menu
                    </div>
                    <input type="text" placeholder="Ricerca" />
                </div>
            </nav>
            <Jambotron src={'fds'} alt={'nome della foto'}></Jambotron>
        </header>
    </>
}

export default Header;