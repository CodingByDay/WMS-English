import DataAccess from "../utility/DataAccess";
import { useSelector, useDispatch } from 'react-redux'

import $ from 'jquery'; 
import Select from 'react-select'
import PopupService from '../services/PopupService';
import { useEffect, useState } from "react";
import { MdAdd} from "react-icons/md";

export default function Inventory(props) { 
    // States

    const [documentTypes, setDocumentTypes] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [buyer, setBuyer] = useState([]);

    // Chosen states

    const [document, setDocument] = useState("")
    const [warehouse, setWarehouse] = useState("")
    const [client, setClient] = useState("")
    const [date, setDate] = useState("")
    const userId = useSelector((state) => state.user.userId)


    useEffect(() => {
        var documentTypes =  PopupService.getAllDocumentTypeOfEvent("N").then(response => { 
            var types = [];
            for (var i = 0; i < response.Items.length; i++) {
                types.push({value: response.Items[i].Properties.Items[0].StringValue, label:response.Items[i].Properties.Items[0].StringValue});                       
            }     
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
                $("#buyer").css("display", "block");
            } else {
                $("#buyer").css("display", "none");
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



    async function createHeadDocument ()  {

      var documentData = document;
      var warehouseData = warehouse;
      var clientData = client;
      var dateData = date;
      var byClient = false


      if($('#byOrder').is(":checked"))
        {
            byClient = true;
        }

       if(window.confirm('Ali želite kreirati dokument')) {
                 var data =  PopupService.setMoveHead(
                    
                    
                    
                    {  
                        DocumentType: documentData, 
                        
                        Type: "N",
                        
                        WhareHouse: warehouseData,

                        LinkKey: "",

                        LinkNo: 0,

                        Date: dateData,

                    }
                    
                    
                    
                    
                    
                    
                    
                    ).then(response => { 

                    props.close();
                    props.render();                        
        }); 
       }


    }
    return ( 

        <div className='layout-inventory-container'>
        <div className='layout-inventory-checkbox'>
 
        </div>


        <div className='layout-inventory-goods'>

        <div className='left-column'>
       
       <center> <Select className='select-filters' onChange={(e) => onChangeType(e)} placeholder={"Tip dokumenta"} options={documentTypes}  id='documentType'/></center>
        <center><Select className='select-filters' onChange={(e) => onChangeWarehouse(e)} placeholder={"Skladišče"} options={warehouses} id='warehouse'  /></center>

        <center><input placeholder="Izberite datum" type="date" id="date" className="form-control" /></center>
            <center><span className='actions smallerr' onClick={createHeadDocument} id='createDocument'>          
             <p>Confirm</p>
             <MdAdd />
           </span></center> 
        </div>

     
        </div>
        </div>


        ); 
}


