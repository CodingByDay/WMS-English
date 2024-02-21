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
    const [selectedType, setSelectedType] = useState(null)
    const [selectedWarehouse, setSelectedWarehouse] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)

    const DynamicFormatOptionLabel = ({ label, properties, header, code, exists}) => (


    
        <div>
          {properties && properties.length && !exists ? (
            <div style={{ display: 'flex', margin: '0', padding: '0'  }}>
              {properties.map((property, index) => (
                  ( !header ) ? (
                  <div key={index} style={{ minWidth: '300', paddingLeft: '3px', paddingRight: '3px', fontSize: '80%', color: 'gray', marginRight: '0px', whiteSpace: 'nowrap' }}>
                  {property}
                  </div>
              ): (
                  <div key={index} style={{ fontWeight: '600',  minWidth: '300', paddingLeft: '5px', paddingRight: '3px', fontSize: '80%', color: 'black', marginRight: '0px', whiteSpace: 'nowrap' }}>
                    {property}
                  </div>
                )         
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '100%' }}>
              {code}
            </div>
          )}
        </div>
      );
      
      
      
    
      const formatOptionLabel = ({ label, properties, header, code }) => {
    
        var exists = false;
  
        if(code && selectedType) {
          exists  = selectedType.code === code || false;
        }
  
      
        // Return the component with the processed data
        return (
          <DynamicFormatOptionLabel properties={properties} exists ={exists}  label={label} code={code}  header={header} />
       );
      };
  
    useEffect(() => {

        var documentTypes =  PopupService.getAllDocumentTypeOfEvent("I").then(response => { 
            var types = [];
            types.push({value: "", code: "", label: "", properties: [], header: true});
            for (var i = 0; i < response.Items.length; i++) {
                var type = DataAccess.getData(response.Items[i], "Code", "StringValue");
                var name = DataAccess.getData(response.Items[i], "Name", "StringValue");
                var together = type + "|" + name;


                var properties = [type, name]

                types.push({value: together, label:together, code: type, header: false, properties: properties});               }     
                setDocumentTypes(types);
        }); 

        var warehouses =  PopupService.getWarehouses(userId).then(response => {  
        var warehouses = onlyWarehouses(response);
        setWarehouses(warehouses); 

    }); 

    const customStyles = {
        control: (base) => ({
          ...base,
          width: '15em', // Width of the control
        }),
        menu: (base) => ({
          ...base,
          width: '15em', // Width of the dropdown menu
        }),
        option: (provided) => ({
          ...provided,
          whiteSpace: 'nowrap', // Prevent line breaks
          overflow: 'hidden', // Hide overflowing text
          textOverflow: 'ellipsis', // Display ellipsis for overflowed text
        }),
      };



    var subjects =  PopupService.getSubjects().then(response => { 
            window.subjects = response;
            var subjectsList = [];   
            subjectsList.push({value:"", label:""})
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
        returnArray.push({value: "", label: ""})
        for (var i = 0; i < data.Items.length; i++) {  
            returnArray.push({value: data.Items[i].Properties.Items[0].StringValue, label: data.Items[i].Properties.Items[0].StringValue});           
        }

        return returnArray;
    }

  
    function onChangeType(e) {
        if(e.value=="") {
            setSelectedType(null);
        } else {
        setDocument(e.code)
        setSelectedType(e);
        }
    }


    function onChangeWarehouse(e) {
        if(e.value=="") {
            setSelectedWarehouse(null);

        } else {
        setWarehouse(e.value)
        setSelectedWarehouse({value: e.value, label: e.value});
        }
    }



    function onChangeBuyer(e) {
        if (e.value == "") {

        setSelectedClient(null);

        } else {
        setClient(e.value)
        setSelectedClient({value: e.value, label: e.value});
        }
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
    const customStyles = {
        control: (base) => ({
          ...base,
          width: '15em', // Width of the control
        }),
        menu: (base) => ({
          ...base,
          width: '15em', // Width of the dropdown menu
        }),
        option: (provided) => ({
          ...provided,
          whiteSpace: 'nowrap', // Prevent line breaks
          overflow: 'hidden', // Hide overflowing text
          textOverflow: 'ellipsis', // Display ellipsis for overflowed text
        }),
      };

    function getClient() {
        if(props.order) {
            return <Select styles={customStyles}  className='select-filters' value={selectedClient}  onChange={(e) => onChangeBuyer(e)} placeholder={"Supplier"} options={buyer} id='buyer' />
        }
    }

    function getNote() {
        if(props.order) {
            return  <div className="form-group2">
                    <label htmlFor="acNote">Remark</label>
                    <textarea className="form-control" id="acNote" rows="3"></textarea>
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

                // I in P is switched at orders

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
        
            
                    var data =  ListingService.createOrder(objectForAPI).then(response => { 
                        cleanFields();
                        if(response.Success) {
                          window.showAlert("Information", "Created successfully", "success")
                          props.close();
                            props.render();
                        } else {
                          window.showAlert("Information", "Error", "error")
                          props.close();
                            props.render();
                        }
                }); 

                
            

        }
      }
      function cleanFields() {
        setSelectedType(null)
        setSelectedWarehouse(null)
        setSelectedClient(null)
        $('#acNote').val("")

    }
      function toggleCheck() {
        setByOrder(!byOrder)
     }

     function onDateChange(e) {
        setDate(e.target.value)
    }



    return ( 

       
        <div className='layout-issued-goods-container'>
        <div className='layout-issued-goods-header-checkbox'>
            {getCheckBox()}
        </div>
        <div className='layout-issued-goods'>



        <div className='left-column'>
        <Select className='select-filters'

styles={customStyles} 
        getOptionLabel={(option) => option.code} getOptionValue={(option) => option.code} formatOptionLabel={formatOptionLabel} value={selectedType} onChange={(e) => onChangeType(e)} placeholder={"Document type"} options={documentTypes}  id='documentType'/>
        <Select
styles={customStyles} 
        className='select-filters' value={selectedWarehouse} onChange={(e) => onChangeWarehouse(e)} placeholder={"Warehouse"} options={warehouses} id='warehouse'  />
        </div>
        <div className='right-column'>


        <div id="date-picker-example" onChange={(e) => onDateChange(e)}  className="md-form md-outline input-with-post-icon datepicker" inline="true">

        <input placeholder="Choose the date" styles={customStyles}  type="date" id="documentDate" className="form-control" />

        </div>

        

        {getClient()}
        </div>
        
        </div>



        <div className="bottom-part">

        {getNote()}


       <center><span className='actions smallerr' onClick={createHeadDocument} id='createDocument'>          
             <p>Confirm</p>
             <MdAdd />
             </span>
        </center> 




  
        </div></div>
        ); 
}


