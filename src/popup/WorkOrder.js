import DataAccess from "../utility/DataAccess";

import $ from 'jquery'; 
import Select from 'react-select'
import PopupService from '../services/PopupService';
import { useEffect, useState } from "react";
import { MdAdd} from "react-icons/md";
import TransactionService from "../services/TransactionService";

export default function WorkOrder(props) { 
    const [workOrders, setWorkOrders] = useState([]);
    useEffect(() => {
        var orders = [];
        var documentTypes =  PopupService.getAllWorkOrders("I").then(response => { 
            for (var i = 0; i < response.length; i++) { 
                orders.push({label: response[i].Key, value: response[i].Key})
            }
            setWorkOrders(orders);
        }); 
    }, []);
    if(props.show) {
        $("#edit").css("display", "block");
    } else {
        $("#edit").css("display", "none");
    }

    async function createHeadDocument ()  {

        /* 
            tbOpenQty.Text = workOrder.GetDouble("OpenQty").ToString(CommonData.GetQtyPicture());
            tbClient.Text = workOrder.GetString("Consignee");
            tbIdent.Text = workOrder.GetString("Ident");
            tbName.Text = workOrder.GetString("Name");
        */

        var consignee = document.getElementById("clientPopup").value;
        var ident = document.getElementById("identPopup").value;
        var qty = document.getElementById("openQtyPopup").value; 

        

        window.swal({
            title: 'Potrditev',
            text: "Ali ste sigurni da želite kreirati dokument?",
            icon: 'warning',
            buttons: ["Ne", "Ja, krairaj"],
          }).then((result) => {
            if (result) {     
                var data =  PopupService.setMoveHead({ Type: "W", Consignee: consignee, Ident: ident, OpenQty: qty }).then(response => { 
                    props.close();
                    props.render();    
                });                 
            }
          })    


         
         
    }

    function changeWorkOrder(e) {
        
            var data =  PopupService.getWorkOrderDetail(e.value).then(response => { 
            var client = DataAccess.getData(response, "Consignee", "StringValue");
            var ident = DataAccess.getData(response, "Ident", "StringValue");
            var name = DataAccess.getData(response, "Name", "StringValue");
            var qty = DataAccess.getData(response, "OpenQty", "DoubleValue");
            var key = DataAccess.getData(response, "Key", "DoubleValue");

            var clientField = document.getElementById("clientPopup");
            var identField = document.getElementById("identPopup");
            var nameField = document.getElementById("namePopup");
            var qtyField = document.getElementById("openQtyPopup");
            
            if(typeof client === "undefined") {
                client = "";
            }

            if(typeof ident === "undefined") {
                ident = "";
            }

            if(typeof name === "undefined") {
                name = "";
            }

            if(typeof qty === "undefined") {
                qty = "";
            }

            clientField.value = client;
            identField.value = ident;
            nameField.value = name;
            qtyField.value = qty;
            
        }); 
    }

    return ( 

    <div className='add-container-workorder'> 


       <center>
            <Select className='select-filters' onChange={changeWorkOrder} options={workOrders} placeholder={"Delovni nalog"} id='workOrder' />
       </center>

       <div className="outer-container-workorder">

            <div className="left-workorder">
                <input type="text" id="clientPopup" placeholder='Naročnik' className="form-control" />
                <input type="text" id="identPopup" placeholder='Ident' className="form-control" />
            </div>

            <div className="right-workorder">
                <input type="text" id="namePopup" placeholder='Naziv' className="form-control" />
                <input type="text" id="openQtyPopup" placeholder = 'Odprta količina' className="form-control" />
            </div>

       </div> 
                <center>

            <span className='actions smallerr' onClick={createHeadDocument} id='createDocument'>   
                
            <p>Confirm</p>
                <MdAdd />
            </span>

            </center> 
    </div>
    
    ); 
    };