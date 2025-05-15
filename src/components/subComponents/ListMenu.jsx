import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";


function ListMenu({icon, children, link, click}){
    return <>
        <li>
            {icon && <Link to={link} ><FontAwesomeIcon onClick={click} icon={icon} /></Link>}
            <span>{children}</span>
            
        </li>
    </>
}

export default ListMenu;