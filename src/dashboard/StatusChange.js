import DataAccess from "../utility/DataAccess";

import $ from 'jquery'; 
import Select from 'react-select'
import PopupService from '../services/PopupService';
import { useEffect, useState } from "react";
import { MdAdd} from "react-icons/md";
import ListingService from "../services/ListingService";
import TransactionService from "../services/TransactionService";
import { useSelector, useDispatch } from 'react-redux'




export default function StatusChange(props) { 


    const [statusList, setStatusList] = useState([]);
    const [status, setStatus] = useState("");

    const [orderKey, setOrderKey] = useState();
    const order = useSelector((state) => state.data.orderKey)
    const userId = useSelector((state) => state.user.userId)

    useEffect(() => {

        setOrderKey(order);
        setStatusList([{value: "1", label: "Vpisan"}, {value: "2", label: "Potrjen"}, {value: "3", label: "Delno izdan"}, {value: "Z", label: "Zaključen"}, {value: "X", label: "Storno"}])
}, []);



 




        
    
    function onChangeStatus(e) {
       setStatus(e.value)
    }

    function closeWindow() {
        $(".chooseStatus").css("display", "none");
    }

    function changeStatus() {
       
        ListingService.changeStatus(order, status, userId).then(response => { 
          
         }); 
           
    }

    return ( 
        <div className="chooseStatus">

                   <div className="header_part" onClick={closeWindow}>
                        <h1 id='close_add_header'>X</h1>
                   </div>

                    <div className="changeStatusOuter">

                    <div className="main-part">
                         <Select className='select-filterss' placeholder={"Status"}  onChange={(e) => onChangeStatus(e)} options={statusList} id='statusChange'/>
                    </div>


                    <center><span className='actions smallerr status' onClick={changeStatus} id='createDocument'>   
                           
             <p>Confirm</p>
             <MdAdd />
             </span></center> 

        </div>     


        </div>
    ); 
}


