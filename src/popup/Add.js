
import $ from 'jquery'; 
import { useNavigate  } from 'react-router-dom';
import Table from '../table/Table';
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import Select from 'react-select'
import _ from 'lodash';
import TransactionService from '../services/TransactionService';
import { Dropdown, Stack } from '@fluentui/react'
import DataAccess from '../utility/DataAccess';
import PopupService from '../services/PopupService';

const Add = forwardRef((props, ref) =>  { 

    const [ident, setIdent] = useState({});
    const [identList, setIdentsList] = useState([]);
    const [transactionData, setTransactionData] = useState({});
    const [orderData, setOrderData] = useState([]);
    const [documentTypeString, setDocumentTypeStringValue] = useState("");
    const [orderCurrent, setOrderCurrent] = useState([]);
    const [disabledOrder, setDisabledOrder] = useState(false);
    const [no, setNo] = useState({});
    const [keyOut, setKeyOut] = useState({});
    const [selectedIdent, setSelectedIdent] = useState({})
    const [editDisable, setEditDisable] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useImperativeHandle(ref, () => ({
        transferData() {
            // Calls the function from the parent.
            transferData()
        },
      }));
    useEffect(() => {

      

        var idents = TransactionService.getIdents().then(response=> { 

            var identObjects = []
            identObjects.push({value: '', label: ''})
            // This is the place to check if all of the idents are correctly rendered.
            for(var i=0;i<response.data.length;i++) {
              identObjects.push({label: response.data[i],  value: response.data[i]});
            }
            window.identity = identObjects;
            setIdentsList(identObjects);

          });




          if(typeof props.selected.childNodes!== "undefined") {

            // Continue here tomarow.

            var rowProperty = {};

            for(var i=0;i<props.selected.childNodes.length;i++) { 
                rowProperty[`${props.selected.childNodes[i]}`] = props.selected.childNodes[i].innerHTML;
            }    


            setTransactionData(rowProperty)
        }

      
           
        

}, [ident]);


function transferData() {

    try {

        var type = props.selected.childNodes[1].innerHTML;
        var order = props.selectedPosition.childNodes[1].innerHTML;
        var identFill = props.selectedPosition.childNodes[4].innerHTML;
        var qty = props.selectedPosition.childNodes[6].innerHTML;

        resetEditor()  

        setSelectedIdent( {value: `${identFill}`, label: `${identFill}` })


        if (type!="2000" || type!="2200") {
            setOrderCurrent( {value: `${order}`, label: `${order}`});
            orderEdit(order, identFill);
            disableFields();
            document.getElementById("realQty").value = qty;
            document.getElementById("addPositionButton").innerHTML = "Posodobi";
            setEditMode(true);
        }

    } catch (e) { 
        return;
    }
}
    function disableFields() {
        setEditDisable(true)
    }


    function findValueByClassWithinArray(array, classNameValue) {




        for (var i = 0; i < array.length; i++) {
            var currentObject = array[i];
            if(currentObject.className === classNameValue) {
                return currentObject.innerHTML;
            }
        }
        
        
        return "";
        
    }





    function onChangeIdent(e) {

        document.getElementById("positionNumber").value = "";
        document.getElementById("openQty").value = "";
        document.getElementById("deadlineDate").value = "";
        setIdent({label: e.value, value: e.value });
        setSelectedIdent({label: e.value, value: e.value});
        updateOrders(e.value);

    }



    function orderEdit(order, ident) {
        document.getElementById("positionNumber").value = "";
        document.getElementById("openQty").value = "";
        document.getElementById("deadlineDate").value = "";
        var ident = document.getElementById("identListControl").innerText;
        // Correct data gets to the service
        PopupService.getOrderDataFromIdentAndOrderNumber(order, ident).then(response => { 
            var qty = DataAccess.getData(response, "OpenQty", "DoubleValue");
            var deadline = new Date( DataAccess.getData(response, "DeliveryDeadline", "DateTimeValue")) .toLocaleDateString();
            var no = DataAccess.getData(response, "No", "IntValue");
            setNo(no);
            setKeyOut(DataAccess.getData(response, "Key", "StringValue"));
            document.getElementById("positionNumber").value = no;
            document.getElementById("openQty").value = qty;
            document.getElementById("deadlineDate").value = deadline;
            // Test the result
        });
    }

    function onChangeOrder(e) {
        
        setOrderCurrent({label: e.key + " poz. " + e.no, value: e.key+ " poz. " + e.no, key: e.key, no: e.no, deadline: e.deadline });
        document.getElementById("positionNumber").value = "";
        document.getElementById("openQty").value = "";
        document.getElementById("deadlineDate").value = "";
        var ident = document.getElementById("identListControl").innerText;
        // Correct data gets to the service
        PopupService.getOrderDataFromIdentAndOrderNumber(e.key, ident).then(response => { 
            var qty = DataAccess.getData(response, "OpenQty", "DoubleValue");
            var deadline = new Date( DataAccess.getData(response, "DeliveryDeadline", "DateTimeValue")) .toLocaleDateString();
            var no = DataAccess.getData(response, "No", "IntValue");
            setNo(no);
            setKeyOut(DataAccess.getData(response, "Key", "StringValue"));
            document.getElementById("positionNumber").value = no;
            document.getElementById("openQty").value = qty;
            document.getElementById("deadlineDate").value = deadline;
            // Test the result
        });
           
    }

    function updateOrders(identInternal) { 

        // Continue here.
        var type =  findValueByClassWithinArray(props.selected.childNodes, "DocumentType");

    

        TransactionService.getOrdersForIdent(identInternal, type).then(response => { 


           


            var items = []
            items.push({value: '', label: '', key: ''})

            for(var i = 0; i < response.Items.length;i++) {

                var item = response.Items[i];    
                var key = DataAccess.getData(item, "Key", "StringValue");
                var no = DataAccess.getData(item, "No", "IntValue");
                var deadline = DataAccess.getData(item, "DeliveryDeadline", "DateTimeValue" );
                items.push({label: key + " poz. " + no, value: key+ " poz. " + no, key: key, no: no, deadline: deadline});            

            }       
             
            setOrderData(items)

        });

    }

    var headId = 3;



    if(props.show) {

        
        $("#edit").css("display", "block");

        var rowProperty = {};
        if(typeof props.selected.childNodes!== "undefined") {  
            headId = findValueByClassWithinArray(props.selected.childNodes, "HeadID");
            var documentType = findValueByClassWithinArray(props.selected.childNodes, "DocumentType");
            // Missing value for String representation of the document.
            var client = findValueByClassWithinArray(props.selected.childNodes, "Receiver");
            var warehouse = findValueByClassWithinArray(props.selected.childNodes, "WharehouseName")
            var transactionIdElement = document.getElementById("transactionIdAdd");
            transactionIdElement.value = headId
            var typeAdd = document.getElementById("typeAdd");
            typeAdd.value = documentType
            var documentTypeAdd = document.getElementById("documentTypeAdd");
            var clientAdd = document.getElementById("clientAdd");
            clientAdd.value = client;
            var warehouseAdd = document.getElementById("warehouseAdd");
            warehouseAdd.value = warehouse;     


            if(props.document === "Medskladišnica") {
                $("#positionRow").css('visibility', 'hidden');
                $("#orderRow").css('visibility', 'hidden');
                $("#openQtyRow").css('visibility', 'hidden');
                $("#dateRow").css('visibility', 'hidden');
               // Continue here
            } 


        }
    } else {
            $("#edit").css("display", "none");
    }
  

    function CommitPositionSingular(old, data) {



        props.resetEditor();
        var key = old.key;
        var no = old.no;
        var transactionHeadID = data.transaction;


        PopupService.commitPosition({LinkKey: parseInt(key), LinkNo: no, Ident: data.ident.value, HeadID: document.getElementById("transactionIdAdd").value, Qty: document.getElementById("realQty").value}).then(response => { 

        });            
        var objectToCommit = {}
    }
    function isFloat(val) {
        var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
        if (!floatRegex.test(val))
            return false;
    
        val = parseFloat(val);
        if (isNaN(val))
            return false;
        return true;
    }

    function CommitPosition(e) {

        var openQty = document.getElementById("openQty").value;
        var realQty = document.getElementById("realQty").value;

        if(realQty === "0" || !isFloat(realQty)) {

            window.showAlert("Informacija", "Vnesite pravilno količino", "error");
            return;
        } 


        var positionNumber = document.getElementById("positionNumber").value;
        var deadlineDate = document.getElementById("deadlineDate").value;
        var warehouse = document.getElementById("warehouseAdd").value;
        var data = {open: openQty, real: realQty, position: positionNumber, deadlineDate: deadlineDate, ident: ident, order: orderData.value, serial: false, name:"", warehouse: warehouse, data: data};
        // getDocumentTypeStringBasedOnCode API call
        PopupService.getDocumentTypeStringBasedOnCode(document.getElementById("typeAdd").value).then(response => {           
            if(response.includes("Prenos")) {
                // This is the current working environment
                PopupService.hasSerialNumberIdent(ident.value).then(response => {           
                    data.serial = response.serial;
                    data.sscc = response.sscc;
                    data.headId = headId;
                    data.no = no;
                    data.key = keyOut;
                    props.addVisibility(orderCurrent, data, true);
            
                });           
                // This is the current working environment
            } else if(response.includes("Odpremni")) {
                PopupService.hasSerialNumberIdent(ident.value).then(response => {           
                    data.serial = response.serial;
                    data.sscc = response.sscc;
                    data.headId = headId;
                    data.no = no;
                    data.key = keyOut;
                    CommitPositionSingular(orderCurrent, data);                   
                });           
            } else if(response.includes("Naročilo")) {
                PopupService.hasSerialNumberIdent(ident.value).then(response => {           
                    data.serial = response.serial;
                    data.name = response.name;
                    data.sscc = response.sscc;
                    data.headId = headId;
                    data.no = no;
                    data.key = keyOut;
                    data.transaction = document.getElementById("transactionIdAdd").value;
                    // Multi column place for the data collection //
                    props.addVisibility(orderCurrent, data, true);
                });
            } else if(response.includes("Proizvodnja") || response.inlcudes("DN")) {
                // Delovni nalog
            } else if(response.includes("Inventura")) {
                // Inventura N
            }           

        });
        // Place to check for the serial number
        
    }
    function resetEditor() {
        setEditDisable(false);
        setEditMode(false);
        props.resetEdit();

    }


    return ( 

        <div className="edit" id='edit'>
     


        <div className="header_part" onClick={resetEditor}>
            <h1 id='close_add'>X</h1>
        </div>


        <div className="body_part">

        <div className="container-insist">
    <div className="row">



        <div className="col-md-3 mx-auto">

                <div className="form-group row">
                                <label htmlFor="transactionId">Transakcija</label>
                                <input type="text" className="form-control" id="transactionIdAdd" disabled />
                </div>
                
                <div className="form-group row">
                                <label htmlFor="inputFirstname">Tip</label>
                                <input type="text" className="form-control" id="typeAdd" disabled/>
                </div>
                
                <div className="form-group row">
                                <label htmlFor="inputFirstname">Naročnik</label>
                                <input type="text" className="form-control" id="clientAdd" disabled />
                </div>

                <div className="form-group row">
                                <label htmlFor="inputFirstname">Skladišče</label>
                                <input type="text" className="form-control" id="warehouseAdd" disabled />
                </div>


                <div className="form-group row">

                    <div className="col-sm-6">
                  
                    </div>
                    <div className="col-sm-6">


                    </div>
                </div>

                <div className='editable-group'>

                <div className="form-group row" id='identRow'>
                    <div className="col-sm-6">
                    <label htmlFor="inputFirstname">Ident</label>

                    <Select 
                        placeholder={"Ident"}
                        id='identListControl'
                        options={identList}          
                        value={selectedIdent}   
                        isDisabled = {editDisable}         
                        onChange={(e) => onChangeIdent(e)} 
                    />
                    </div>
                    <div className="col-sm-6" id='positionRow'>
                        <label htmlFor="inputAddressLine2">Pozicija</label>
                        <input type="text" className="form-control" id="positionNumber" disabled = {editDisable}   placeholder="Pozicija" />
                    </div>
                </div>

                <div className="form-group row" id='orderRow'>
                    <div className="col-sm-6">
                    <label htmlFor="inputCity">Naročilo</label>


                    <Select
                        placeholder="Naročilo"
                        id='orderInformationAdd'
                        options={orderData}
                        isDisabled = {editDisable}  
                        value={orderCurrent}     
                        onChange={onChangeOrder} 
                     />
   
            
                    </div>
                    <div className="col-sm-6" id='openQtyRow'>
                        <label htmlFor="inputState">Odprta količina</label>
                        <input type="text" className="form-control"    disabled = {editDisable}   id="openQty" placeholder="Količina" />
                    </div>

                </div>
                
                <div className="form-group row">

                    <div className="col-sm-6">
                    <label htmlFor="inputContactNumber">Količina</label>
                        <input type='text' className="form-control" id="realQty" placeholder="Količina" />
                    </div>


                    <div className="col-sm-6" id='dateRow'>
                        <label htmlFor="inputWebsite">Datum dobave</label>
                        <input type="text" className="form-control"    disabled = {editDisable}   id="deadlineDate" placeholder="Datum dobave" />
                    </div>

                </div>
                </div>

                <span className='actions smallerr' onClick={CommitPosition} id="addPositionButton" >Dodaj poziciju           
                </span>


        </div>
    </div>
    </div>



        </div>



        </div>

    ); 

} );

export default Add;
