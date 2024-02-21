import { useNavigate  } from 'react-router-dom';

import Header from '../dashboard/Header';
import Footer from '../dashboard/Footer';
import Cookies from 'universal-cookie';
import $ from 'jquery'; 
import { useSelector, useDispatch } from 'react-redux'
import {store} from '../store/store';

export function ImportMenu() { 

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

          <button className="btn btn-primary dashboard" onClick = {()=>routeChange("import-subjects")}>
            Subjects
            <img alt={""} src='rating-adjusted.png' width={100} />

          </button>

          <button className="btn btn-primary dashboard" onClick = {()=>routeChange("import-idents")}>
            Idents
            <img alt={""} src='stock.png' width={100} />

          </button>

          <button className="btn btn-primary dashboard" onClick = {()=>routeChange("import-orders")}>
            Orders
            <img alt={""} src='listing.png' width={100} />
         
          </button>

              
         
          </div>      
    </div> 
    <Footer />
    </div> 
  
  ); 
} 