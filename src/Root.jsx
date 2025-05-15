import { Outlet } from "react-router-dom";

import Header from './components/Header'
import Footer from './components/Footer'
import Loading from "./pages/Loading";

function Root(){
  
    return <>
    
      <Loading></Loading>
      <Header></Header>
      <main>
        <Outlet />
      </main>
      
      <Footer></Footer>
    </>
}

export default Root;