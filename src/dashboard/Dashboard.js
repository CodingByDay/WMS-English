import { useNavigate  } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Cookies from 'universal-cookie';
import $ from 'jquery'; 
import { useSelector, useDispatch } from 'react-redux'
import Analytics from './Analytics';
import {store} from '../store/store';
import ImportMenu from "../import/ImportMenu";

export function Dashboard() { 

  let navigate = useNavigate();

  checkUID ()



  function isUUID ( uuid ) {
    let s = "" + uuid;
    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
      return false;
    }
    return true;
   } 



  function checkUID () {
    const cookies = new Cookies();
    var cookie = cookies.get('uid');
    if (typeof cookie !== "undefined") {     
      if(isUUID(cookie)) {     
        return;
      } 
  } else {
    window.location.href = "/";
  }
   
  }


  /*
  <button className="btn btn-primary dashboard" id='settings-hover' onClick = { ()=>routeChange("settings") }>
    Nastavitve
    <img alt={""} src='settings.png' width={100} /> 
  </button>
  */



  function handleSettings () {
    $(".settings-divider").toggle();
    // Toggle the visibility
  }

  const routeChange = (option) => {
    let path = "/" + option;

    if(option === "logout") { 
      navigate("/");
    } else {
      navigate(path); 
    }
  }
    return ( 
      <div>
          <Header/>
     <div className='main-menu-design'>
    
       <div className = "menu"> 

            <button className="btn btn-primary dashboard" onClick = {()=>routeChange("listing")}>
              Orders
              <img alt={""} src='listing.png' width={100}/>
            </button>

            <button className="btn btn-primary dashboard" onClick = {()=>routeChange("transactions")}>
              Transactions
              <img alt={""} src='transaction.png' width={100} />
            </button>

            <button className="btn btn-primary dashboard" onClick = {()=>routeChange("stock")}>
              Stock
              <img alt={""} src='stock.png' width={100} />
            </button>

            <button className="btn btn-primary dashboard" onClick = {()=>routeChange("import")}>
              Import
              <img alt={""} src='import.png' width={100} />

            </button>

            <button className="btn btn-primary dashboard" onClick = {()=>routeChange("settings")}>
              Settings
              <img alt={""} src='settings.png' width={100} />
            </button>

            <button className="btn btn-primary dashboard" onClick = {()=>routeChange("analytics")} id='settings-hover' >
            Analytics
            <img alt={""} src='monitor-icon.png' id='analytics' width={50} />
            </button>         
           
            </div>      
      </div> 
      <Footer />
      </div> 
    
    ); 
} 