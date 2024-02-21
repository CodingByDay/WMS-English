import React from "react"
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import  Loader  from "../loader/Loader";
import $ from 'jquery';
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from 'react-redux';
import {login} from '../features/user';
import TransactionService from '../services/TransactionService'
import DataAccess from "../utility/DataAccess";



export default function Auth(props) {


  const dispatch = useDispatch()



  var mobile = Math.min(window.screen.width, window.screen.height) < 768 || navigator.userAgent.indexOf("Mobi") > -1;

  function onKeyDownPassword(e) {
    if(e.key === "Enter") {
      handleClick();
    }
  }




  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      ((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & (15 >> c / 4)).toString(16)
    );
  }

    var password = ""  
    let navigate = useNavigate();
    const handleClick = async () => {
      $("#wrong").css("display", "none");

      $(".whole-auth").css("display", "none");

      $(".login").toggleClass("disabled");
      var loader = document.getElementById("loader");
      loader.style.display = "block";
      await axios.get(process.env.REACT_APP_API_URL + `/Services/Device/?mode=loginUser&password=${password}&i=web`)
      .then(response => {
       // $(".login").toggleClass("disabled");
          if(response.data.Items[1].Name === "Error") {
            setTimeout(function() {              
              loader.style.display = "none";
              $("#wrong").css("display", "block"); 
              $(".whole-auth").css("display", "block");
 
          }, 2000);                        
          } else {
              // Successful login 
              const cookies = new Cookies();
              cookies.set('uid', uuidv4(), { path: '/' });
  
              setTimeout(function() {        
                               
              $(".whole-auth").css("display", "block");

              TransactionService.getUsers().then(response => { 
              for (var i = 0; i < response.Items.length; i++) {

                var passwordGet =  DataAccess.getData(response.Items[i], "WMSPassword", "StringValue")
                 if(passwordGet == password) {
     
     
                     var name = DataAccess.getData(response.Items[i], "FullName", "StringValue");
                     var userId = DataAccess.getData(response.Items[i], "UserID", "IntValue");
                     // UserID
                     // FullName
                     dispatch(login([name, userId]));
                     localStorage.setItem('name', userId);
                     localStorage.setItem('back', "/")
                 }
     
               }
              // Redux state changes
              });

              navigate('/dashboard'); }, 2000);      
          }
      })
      .catch(error => {
        
      });
    }
    function onChangePassword(e) {
        password = e.target.value;
    }



    function showMobileAlert() {
      window.showAlert("Informacija", "Mobilne naprave niso podprte!", "error")
    }


    
  return (
    <div className="login"
    

    
    
    
    >
    <Loader />



    <div className="whole-auth">
    <div className="navbar auth">
            <center><div className='logo '>
                <img src='logo-wms.png'  className='logo' alt='Riko WMS' height={70} />
            </div></center>           
    </div>


    <div className="Auth-form-container">
  
        <div className="Auth-form-content">
          <center><h1 className="riko-blue">Log in</h1></center>
        
          
          <div className="form-group mt-3" id="password-div" >

            <label htmlFor="password" className="label-gray">ENTER THE PASSWORD</label>

            <input
              id = "password"
              onChange={(e)=> onChangePassword(e)}
              type="password"
              onKeyDown={onKeyDownPassword}
              className="form-control mt-1"
            
            />
            
          </div>
          <div className="alert alert-danger wrong" id="wrong" role="alert">
        Napačno geslo.
           </div>



          <div className="d-grid gap-2 mt-3">

            {!mobile &&
            
                <button className="btn btn-primary" id="loginButton"  onClick={handleClick}>
                Log in
                </button>
            
            
            }

            {mobile &&
            
                <button className="btn btn-primary" id="loginButton" onClick={() => {showMobileAlert()} }>
                Log in
                </button>
            
            }
          
          </div>
          
        </div>
   
    </div>
    </div>
    </div>

  )
}