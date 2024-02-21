import { useNavigate  } from 'react-router-dom';
import Select from 'react-select'
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays, addYears, format, isWeekend } from 'date-fns';
import { useEffect, useState } from "react";
import { MdOutlineSearch, MdDateRange,MdDownload, MdOutlineCancel, MdDeleteOutline, MdEdit, MdAdd, MdOutlineMerge, MdOutlineKey, MdOutlineQrCode } from "react-icons/md";
import  SortingService  from '../services/SortingService'
import { flushSync } from 'react-dom';
import EditOrderPosition from '../popup/EditOrderPosition';
import { Modal, Input } from 'antd';


export default function ListingPositionsButtons(props) { 

     const [selected, setSelected]  =useState ({})
     const [isEditShow, setEditShown] = useState (false)
    useEffect(() => {
        if(typeof props.selectedElement !== 'undefined') {
          setSelected(props.selectedElement);
        }
    }, [props.selectedElement]);




    function deleteOrderHead() {
       props.communicate("position", "delete");
    }

    function createPosition() {
          props.communicate("position", "create");
    }
   
    function isFloat(n) {
     return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
 }
    function editQty() {
     var qty = window.prompt("Spremenite količino. Odprta količina: 100")

     if(qty == null) {
          return;
     }

     if (qty &&isFloat(qty)) 
     {    
          props.communicate("position", "update");
     } else {
          window.showAlert("Informacija", "Morate vpisati pravilno količino", "error")
          return; 
     }

    }
    const showModal = () => {

        if(selected) {
          setEditShown(true);
        }
    }

    const hideModal = () => {


     setEditShown(false);
 }





    return ( 
        <div className="filters">

         <span className='actions smallerr' onClick={createPosition} id="addOrder">
              <p>Add</p>
              <MdAdd />
         </span>   


         <span className='actions smallerr' id="editOrder" onClick={showModal}>
          <p>Edit</p>
          <MdEdit />
          </span>

       
         <span className='actions smallerr' id="deleteOrder" onClick={deleteOrderHead}>
              <p>Delete</p>
              <MdDeleteOutline />
         </span>   
         <EditOrderPosition close={hideModal} shown = {isEditShow} object={selected} communicate = {props.communicate} />

        </div>


    ); 
} 