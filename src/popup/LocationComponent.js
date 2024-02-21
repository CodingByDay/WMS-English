
import $ from 'jquery'; 
import { useNavigate  } from 'react-router-dom';
import Table from '../table/Table';
import { useEffect, useState } from "react";
import Select from 'react-select'
import _ from 'lodash';
import TransactionService from '../services/TransactionService';
import { Dropdown, Stack } from '@fluentui/react'
import DataAccess from '../utility/DataAccess';
import PopupService from '../services/PopupService';
import { MdAdd, MdOutlineMerge, MdEdit, MdOutlineKey, MdOutlineQrCode, MdDeleteOutline} from "react-icons/md";


export default function LocationComponent (props) { 
    const [openOrder, setOpenOrder] = useState([]);
    const [locations, setLocations] = useState([])
    const [tableData, setTabledata] = useState([]);
    const [location, setLocation] = useState("")
    const [locationComponentAdd, setLocationComponentAdd] = useState();
    if (props.show) {
        $(".locationComponent").css("display", "block");
    } else {
        $(".locationComponent").css("display", "none");
    }


    useEffect(() => {

        document.getElementById("identLocationComponent").value = props.data.ident.value;
        document.getElementById("nameLocationComponent").value = props.data.name;
        document.getElementById("neededQtyLocationComponent").value = props.data.real;
        document.getElementById("differenceLocationComponent").value = parseInt(document.getElementById("neededQtyLocationComponent").value)  - parseInt(document.getElementById("qtyLocationComponent").value)
       

        var data =  TransactionService.getLocations(props.data.warehouse).then(response => { 
            var locations = [];

            for (var i = 0; i < response.Items.length; i++) {  
                locations.push({value: response.Items[i].Properties.Items[0].StringValue, label: response.Items[i].Properties.Items[0].StringValue});
            }

            setLocations(locations);     
      });


    },[]); 


    function changeAddLocation(e) {
        setLocationComponentAdd({label: e.value, value: e.value});
    }

    function closePopup(e) {
        $(".locationComponent").css("display", "none");
    }

    function addLocation(e) {
        var neededQty = document.getElementById("neededQtyLocationComponent").value;
        var qty = document.getElementById("qtyAddLocation").value;  
        var location = locationComponentAdd;
        var items = tableData;

        items.push({Quantity: parseFloat(qty), Location: location.value})

        var qtyCount = parseFloat("0.00");

        for(var i=0; i<items.length; i++) {
            qtyCount += parseFloat(items[i].Quantity)
        }

        if(qtyCount > neededQty) {
            Swal.fire('Napaka!', `Količina ne sme presegati ${neededQty}!!!`, 'error');

            items.splice(-1,1)
        } else if (qtyCount == neededQty) { 
            Swal.fire('Napaka!', `Količina je dosežena!`, 'error');
        }
        setTabledata(items);
      
    }


    function commitPositions (e) {
      
        var key = props.old.key;
        var no = props.old.no;
        var transactionHeadID = props.data.transaction;

        for (var i=0; i<tableData.length; i++) {
            var row = tableData[i];
            var location = row.Location;
            var qty = row.Quantity;
            PopupService.commitPosition({LinkKey: parseInt(key), LinkNo: no, Ident: props.data.ident.value, HeadID: transactionHeadID, Location: location, Qty: qty}).then(response => { 
              
          });
            
        }
    }

    return ( 
        <div id="locationComponent" className='locationComponent'>      
            <div className="header_part" onClick={closePopup}>
            <h1 id='close_add'>X</h1></div>
            <div className='outer_container'>
            <div className="bodyLocationComponent">
            <div className='left-part'>

            <div className="insistRow">
                <label htmlFor="identLocationComponent">Ident</label>
                <input type="text" className="form-control" id="identLocationComponent" placeholder="Ident" />
                    </div>
                    <div className="insistRow">
                        <label htmlFor="nameLocationComponent">Ident</label>
                        <input type="text" className="form-control" id="nameLocationComponent" placeholder="Naziv" />
                    </div>
                    <div className="insistRow">
                        <label htmlFor="neededQtyLocationComponent">Potrebna količina</label>
                        <input type="text" className="form-control" id="neededQtyLocationComponent" placeholder="Potrebna količina" />
                    </div>
                    <div className="insistRow">
                        <label htmlFor="neededQtyLocationComponent">Količina</label>
                        <input type="text" className="form-control" id="qtyLocationComponent" value="0" placeholder="Količina" />
                    </div>
                    <div className="insistRow">
                        <label htmlFor="neededQtyLocationComponent">Razlika</label>
                        <input type="text" className="form-control" id="differenceLocationComponent" placeholder="Razlika" />
                </div>
            </div>

            </div>



            <div className='add-location-container'>

                <Select  
                
                            options={locations}
                            placeholder={"Lokacija"}
                            onChange={changeAddLocation}
                            value={locationComponentAdd}
                            id='locationSelect'
                />



                <input 
                            placeholder = "Količina"
                            id='qtyAddLocation'
                            className='form-control'
                />



            <span className='actions smallerr' onClick={addLocation} id=''>Dodaj           
             <MdAdd />
             </span>
            </div>






            <div className='right-part'>

             <span 
              onClick={commitPositions} className='actions smallerr'id=''>Confirm         
             <MdEdit />
             </span> 

          

             <span className='actions smallerr' id=''>Briši               
             <MdDeleteOutline />
             </span>


            </div>

        </div>

        <Table className="location-component_table" table="location" data = {tableData} type = "locationComponent" class = "table_responsive_location-component" /> 

        </div>

      
        

    ); 

} 
