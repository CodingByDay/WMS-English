import { useNavigate  } from 'react-router-dom';

import { MdLogout, MdHome } from "react-icons/md";
import { GiReturnArrow } from "react-icons/gi";
import { MdArrowBackIos } from "react-icons/md";
import VersionInfo  from "../versioning/VersionInfo";
import Cookies from 'universal-cookie';


export default function Header(props) { 

    function handleLogout() { 
        const cookies = new Cookies();
        cookies.remove('uid', { path: '/' });
        navigate('/');
    }


      

  let navigate = useNavigate();

  const pathname = window.location.pathname;


  var button;
  var returnButton;

  if(pathname !== '/dashboard') {

    button =  <span className='actions' onClick={() => navigate('/dashboard')}>Menu  

    <MdHome />

    </span>


    returnButton = <span className='actions' onClick={() => navigate(-1)}>Go back  

    <MdArrowBackIos />

    </span>


  }
  

    function goBack() {
  
    }


    return ( 


        <div className="navbar">


            <div className='logo navbar' id='back-button' >
                <center><img src='logo-wms.png' className='logo' alt='Riko WMS' height={30} draggable="false"/></center>
            </div>
          
            <div className='logout'>
                <VersionInfo />
                {button}
                {returnButton}
                <span className='actions' onClick={() => handleLogout()}>Log out            
                <MdLogout />
                </span>
            </div>
        </div>




    ); 
} 