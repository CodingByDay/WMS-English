import DataAccess from "../utility/DataAccess";
import { useSelector, useDispatch } from 'react-redux'

import $ from 'jquery'; 
import Select from 'react-select'
import PopupService from '../services/PopupService';
import { useEffect, useState } from "react";
import { MdAdd} from "react-icons/md";
import ListingService from "../services/ListingService";


export default function IssuedGoods(props) { 
    // States

    const [documentTypes, setDocumentTypes] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [buyer, setBuyer] = useState([]);

    // Chosen states

    const [byOrder, setByOrder] = useState(true);
    const [document, setDocument] = useState("")
    const [warehouse, setWarehouse] = useState("")
    const [client, setClient] = useState("")
    const [date, setDate] = useState(new Date().toLocaleDateString())

    const [selectedType, setSelectedType] = useState(null)
    const [selectedWarehouse, setSelectedWarehouse] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)


    var bufferElements = [];
    const userId = useSelector((state) => state.user.userId)
  
    
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
  


    useEffect(() => {
        var documentTypes =  PopupService.getAllDocumentTypeOfEvent("P").then(response => { 
            var types = [];
            types.push({value: "", code: "", label: "", properties: [], header: true});
            for (var i = 0; i < response.Items.length; i++) {
                var type = DataAccess.getData(response.Items[i], "Code", "StringValue");
                var name = DataAccess.getData(response.Items[i], "Name", "StringValue");
                var together = type + "|" + name;

                var properties = [type, name]

                types.push({value: together, label:together, code: type, header: false, properties: properties});           }     
                setDocumentTypes(types);
        }); 

        var warehouses =  PopupService.getWarehouses(userId).then(response => {  
        var warehouses = onlyWarehouses(response);
        setWarehouses(warehouses); 

        

    }); 


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


    



    function onlyWarehouses(data) { 
        var returnArray = [];
        returnArray.push({value:"", label:""})

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



    async function createHeadDocument ()  {

    // date
    var dateValue = date;




    if(!props.order) {
      var documentData = document;
      var warehouseData = warehouse;
      var objectForAPI = {};
      if (!byOrder) {
            objectForAPI = {DocumentType: documentData, Date: dateValue, Type: "P", WhareHouse: warehouseData, ByOrder: byOrder, LinkKey: "", Receiver: client, Issuer: client}
      } else {
            objectForAPI = {DocumentType: documentData, Date: dateValue, Type: "P", WhareHouse: warehouseData, ByOrder: byOrder, LinkKey: ""}
      }
       if(window.confirm('Ali želite kreirati dokument?')) {
            var data =  PopupService.setMoveHead(objectForAPI).then(response => { 
            props.close();

        }); 
       }
    } else {


        // P == Prevzem sicer izdaja I



        var documentData = document;
        var warehouseData = warehouse;
        var objectForAPI = {};
        var note = $('#acNote').val();
        var order = ""


        objectForAPI = { 
            DocumentType: documentData, 
            Type: "P",
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

    function getCheckBox() {
        if(!props.order) {
            return <div><label htmlFor="byOrder">Po naročilo</label>
            <input type="checkbox" onChange={toggleCheck} checked={byOrder} id='byOrder' /></div>
        }
    }


    function getClient() {
        if(props.order) {
            return   <Select styles={customStyles} className='select-filters-add' value={selectedClient} onChange={(e) => onChangeBuyer(e)} placeholder={"Buyer"} options={buyer} id='buyer' />
        }
    }

    function getNote() {
        if(props.order) {
            return  <div styles={customStyles} className="form-group2">
                    <label htmlFor="acNote">Remark</label>
                    <textarea className="form-control" id="acNote" rows="3"></textarea>
            </div>
        }
    }



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





    return ( 

        <div className='layout-issued-goods-container'>
        <div className='layout-issued-goods-header-checkbox'>
            {getCheckBox()}
        </div>
        <div className='layout-issued-goods'>



        <div className='left-column'>
        <Select styles={customStyles} className='select-filters-add' getOptionLabel={(option) => option.code} getOptionValue={(option) => option.code} formatOptionLabel={formatOptionLabel} value={selectedType} onChange={(e) => onChangeType(e)} placeholder={"Document type"} options={documentTypes}  id='documentType'/>
        <Select styles={customStyles} className='select-filters-add' value={selectedWarehouse} onChange={(e) => onChangeWarehouse(e)} placeholder={"Warehouse"} options={warehouses} id='warehouse'  />
        </div>
        <div className='right-column'>


        <div id="date-picker-example" onChange={(e) => onDateChange(e)}  className="md-form md-outline input-with-post-icon datepicker" inline="true">
    
        <input styles={customStyles} placeholder="Choose the date" type="date" id="documentDate" className="form-control" />

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