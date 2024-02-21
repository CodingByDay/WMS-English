import DataAccess from "../utility/DataAccess";

import $ from 'jquery'; 
import Select from 'react-select'
import PopupService from '../services/PopupService';
import { useEffect, useState } from "react";
import { MdAdd} from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux'

export default function Interwarehouse(props) { 

   
  // States

  const [documentTypes, setDocumentTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [buyer, setBuyer] = useState([]);

  const [selectedReceiver, setSelectedReceiver] = useState([]);
  const [selectedIssuer, setSelectedIssuer] = useState([]);

  const [receiveWarehouse, setReceiveWarehouse] = useState([]);
  const [issueWarehouse, setIssueWarehouse] = useState([]);

  const userId = useSelector((state) => state.user.userId)


  // Chosen states

  const [document, setDocument] = useState("")
  const [warehouse, setWarehouse] = useState("")
  const [client, setClient] = useState("")
  const [date, setDate] = useState("")


  useEffect(() => {
      var documentTypes =  PopupService.getAllDocumentTypeOfEvent("E|").then(response => { 
          var types = [];
          for (var i = 0; i < response.Items.length; i++) {
              var name = DataAccess.getData(response.Items[i], "Name", "StringValue");
              var receive = DataAccess.getData(response.Items[i], "ReceiveWarehouse", "StringValue");
              var issue = DataAccess.getData(response.Items[i], "IssueWarehouse", "StringValue");
              types.push({value: name, label: name, receive: receive, issue: issue});                       
          }     
          setDocumentTypes(types);
      }); 

      var warehouses =  PopupService.getWarehouses(userId).then(response => {  
      var warehouses = onlyWarehouses(response);
      setWarehouses(warehouses); 
      setReceiveWarehouse(warehouses); 
      setIssueWarehouse(warehouses); 

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
    var byClient = false;

    if($('#byOrder').is(":checked"))
      {
          byClient = true;
      }

     if(window.confirm('Ali želite kreirati dokument')) {
          var data =  PopupService.setMoveHead({ DocumentType: documentData, Type: "E", Issuer: selectedIssuer.label, Receiver: selectedReceiver.label, LinkKey: "" }).then(response => { 
          props.close();
          props.render();    
      }); 
     }


  }

function changeEvent(e) {
    $(".warehouses-container").show();
    var receive = {label: e.receive, value:e.receive};
    var issue = {label: e.issue, value:e.issue};

    setSelectedIssuer(issue);
    setSelectedReceiver(receive);




} 

  
    return ( 

        <div className='layout-interwarehouse-container'>
        <div className='layout-interwarehouse-checkbox'>


        <label htmlFor="byOrder" id="hiddenLabel">Po naročilo</label>
        <input type="checkbox" id="hiddenCheck"/>
    



        </div>

            <div className='layout-interwarehouse-goods'>
            <div className='left-column'>

        <Select className='select-filters' placeholder={"Tip transakcije"} onChange={changeEvent}  options={documentTypes} id='documentTypes'/>

        <div className='warehouses-container'>
            <Select className='select-filters interwarehouse' isDisabled={true} value={selectedIssuer} options={issueWarehouse} placeholder={"Izdajno skladišče"} id='issuingWarehouse'/>
            <Select className='select-filters interwarehouse' isDisabled={true} value={selectedReceiver} options={receiveWarehouse} placeholder={"Prejemno skladišče"} id='receivingWarehouse'/>
        </div>

      
        
        </div>
        <div id="date-picker-example" className="md-form md-outline input-with-post-icon datepicker" inline="true">
        <input placeholder="Izberite datum" type="date" id="date" className="form-control" />
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
} 