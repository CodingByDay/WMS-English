
import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import Select from 'react-select'
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays, addYears, format, isWeekend } from 'date-fns';
import { MdOutlineSearch, MdDateRange,MdDownload, MdOutlineCancel, MdDeleteOutline, MdEdit, MdAdd, MdOutlineMerge, MdOutlineKey, MdOutlineQrCode } from "react-icons/md";
import  SortingService  from '../services/SortingService'
import { flushSync } from 'react-dom';
import { Modal, Input } from 'antd';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function EditOrderPosition(props) {

const [quantity, setQuantity] = useState(0);

useEffect(() => {
  if (props.shown) {
    if(props.object.childNodes) {
       setQuantity(props.object.childNodes[6]?.innerHTML);
    } else {
      props.close();
    }
  }
}, [props.shown, props.quantity, props.object]);





  function isFloat(n) {
    return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
  }

  const handleOk = () => {
    
       props.close()
  
        if(quantity == null) {
              return;
        }
        if (quantity &&isFloat(quantity)) 
        {    
              props.communicate("position", "update", quantity);
        } else {
              window.showAlert("Informacija", "Morate vpisati pravilno količino", "error")
              return; 
        }
  };
  const handleInputChange = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <div>
     
      <Popup
        position="right center"
        open={props.shown}   
        onClose={props.close} 
      >

      <div className='quantity-form-update'>
        <label htmlFor="quantity">Quantity:</label>
        <Input id="quantity" value={quantity} onChange={handleInputChange} className="form-control" placeholder="Enter the quantity" />  
      </div>

        <center><span className='actions smallerr' onClick={handleOk} id='updateQuantity'>          
             <p>Confirm</p>
                          <MdAdd />
                </span>
        </center> 

      </Popup>


    </div>
  );
}

export default EditOrderPosition;