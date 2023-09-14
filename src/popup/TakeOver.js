import DataAccess from "../utility/DataAccess";
import { useSelector, useDispatch } from 'react-redux'

import $ from 'jquery'; 
import Select from 'react-select'
import PopupService from '../services/PopupService';
import { useEffect, useState } from "react";
import { MdAdd} from "react-icons/md";
import ListingService from "../services/ListingService";
export default function TakeOver(props) { 
    // States

    const [documentTypes, setDocumentTypes] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [buyer, setBuyer] = useState([]);
    const [byOrder, setByOrder] = useState(true);

    // Chosen states

    const [document, setDocument] = useState("")
    const [warehouse, setWarehouse] = useState("")
    const [client, setClient] = useState("")
    const [date, setDate] = useState("")
    const userId = useSelector((state) => state.user.userId)

    useEffect(() => {



        var documentTypes =  PopupService.getAllDocumentTypeOfEvent("P").then(response => { 
            var types = [];
            for (var i = 0; i < response.Items.length; i++) {
                var type = DataAccess.getData(response.Items[i], "Code", "StringValue");
                var name = DataAccess.getData(response.Items[i], "Name", "StringValue");
                var together = type + "|" + name;
                types.push({value: together, label:together, code: type});                }     
                setDocumentTypes(types);
        }); 

        var warehouses =  PopupService.getWarehouses(userId).then(response => {  
        var warehouses = onlyWarehouses(response);
        setWarehouses(warehouses); 

    }); 


    var subjects =  PopupService.getSubjects().then(response => { 
            window.subjects = response;
            var subjectsList = [];   
       for(var i = 0; i < response.Items.length; i++) {
            var field = DataAccess.getData(response.Items[i], "ID", "StringValue");
            subjectsList.push({value: field, label: field});
       }
       setBuyer(subjectsList); 
    });




}, []);


$(function() {

    $("#byOrder").change(function() {

        if($(this).is(":checked")) {
            $("#buyer").css("display", "none");
        } else {
            $("#buyer").css("display", "block");
        }

    });

});




    function onlyWarehouses(data) { 
        var returnArray = [];

        for (var i = 0; i < data.Items.length; i++) {  
            returnArray.push({value: data.Items[i].Properties.Items[0].StringValue, label: data.Items[i].Properties.Items[0].StringValue});           
        }

        return returnArray;
    }

  

    function onChangeType(e) {
     
        setDocument(e.value)
    }


    function onChangeWarehouse(e) {
 
        setWarehouse(e.value)
    }



    function onChangeBuyer(e) {

        setClient(e.value)
    }


    function onDateChange(e) {
        setDate(e.target.value)
    }

    function getCheckBox() {
        if(!props.order) {
            return <div><label htmlFor="byOrder">Po naročilo</label>
            <input type="checkbox" onChange={toggleCheck} checked={byOrder} id='byOrder' /></div>
        }
    }


    function getClient() {
        if(props.order) {
            return <Select className='select-filters' onChange={(e) => onChangeBuyer(e)} placeholder={"Dobavitelj"} options={buyer} id='buyer' />
        }
    }

    function getNote() {
        if(props.order) {
            return  <div class="form-group2">
                    <label for="acNote">Opomba</label>
                    <textarea class="form-control" id="acNote" rows="3"></textarea>
            </div>
        }
    }

    async function createHeadDocument ()  {
        
                 var dateValue = date;

                if(!props.order) {
                    var documentData = document;
                    var warehouseData = warehouse;
                
                    var objectForAPI = {};
            
                    if (!byOrder) {
                        objectForAPI = {DocumentType: documentData, Type: "I", WhareHouse: warehouseData, ByOrder: byOrder, LinkKey: "", Receiver: client}
                    } else {
                        objectForAPI = {DocumentType: documentData, Type: "I", WhareHouse: warehouseData, ByOrder: byOrder, LinkKey: ""}
                    }
            
            
            
                    if(window.confirm('Ali želite kreirati dokument')) {
                        var data =  PopupService.setMoveHead(objectForAPI).then(response => { 
                        props.close();
                        props.render();    
                    }); 
                    }


        } else {

                var documentData = document;
                var warehouseData = warehouse;
                var objectForAPI = {};
                var note = $('#acNote').val();
                var order = ""

                // I in P zamnjenano na narocilih

                objectForAPI = { 
                    DocumentType: documentData, 
                    Type: "I",
                    Warehouse: warehouseData,  
                    Receiver: client,
                    Issuer: client,
                    Note: note,
                    Status: "1",
                    Date: dateValue,
                }
        
                if(window.confirm('Ali želite kreirati dokument')) {
                    var data =  ListingService.createOrder(objectForAPI).then(response => { 
                    console.log(response);
                    props.close();
                    props.render()
                }); 

                }
            

        }
      }

      function toggleCheck() {
        setByOrder(!byOrder)
     }

     function onDateChange(e) {
        console.log(e.target.value)
        setDate(e.target.value)
    }



    return ( 

        <div className='layout-takeover-container'>
        <div className='layout-takeover-checkbox'>

        {getCheckBox()}
        </div>


        <div className='layout-takeover-goods'>

        <div className='left-column'>


        <Select className='select-filters' onChange={(e) => onChangeType(e)} placeholder={"Tip"} options={documentTypes}  id='documentType'/>
        <Select className='select-filters' onChange={(e) => onChangeWarehouse(e)} placeholder={"Skladišče"} options={warehouses} id='warehouse'  />



        </div>

        <div className='right-column'>

        <div id="date-picker-example" onChange={(e) => onDateChange(e)}  class="md-form md-outline input-with-post-icon datepicker" inline="true">

        <input placeholder="Izberite datum" type="date" id="documentDate" class="form-control" />



      
        </div>
        {getClient()}
        </div>
        </div>
        {getNote()}
        <center><span className='actions smallerr takeover' onClick={createHeadDocument} id='createDocument'>          
             <p>Potrdi</p>
             <MdAdd />
             </span></center> 
        </div>


        ); 
}


