import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import ImportService from '../services/ImportService';


export default function AdditionalOrderInformation(props) {

const [warehouses, setWarehouses] = useState([])
const [documentTypes, setDocumentTypes] = useState([])
const [chosenType, setChosenType] = useState(null)
const [chosenWarehouse, setChosenWarehouse] = useState(null)


  useEffect(() => {

        var sqlWarehouses = "";
        var params = [];
        ImportService.getWarehouses().then(response => {  
          var warehouses = onlyWarehouses(response);   
          setWarehouses(warehouses);     
      });

        var documentTypes = [];
        documentTypes.push({value: '', id: '', label: '', properties: ["Tip", "Naziv"], header: true});
        documentTypes.push({value: 'Izdaja', id: 'I', label: 'Izdaja', properties: ["I", "Izdaja"], header: false});
        documentTypes.push({value: 'Prevzem', id: 'P', label: 'Prevzem', properties: ["P", "Prevzem"], header: false});
        setDocumentTypes(documentTypes);

  }, []);

  function setChosenState() {
    props.onChosen(chosenType, chosenWarehouse);
  }

  const DynamicFormatOptionLabel = ({ label, properties, header, selected, id}) => (


    
    <div>
      {properties && properties.length > 0 && !selected ? (
        <div style={{ display: 'flex', margin: '0', padding: '0'  }}>
          {properties.map((property, index) => (
              ( !header ) ? (
              <div key={index} style={{  paddingLeft: '3px', paddingRight: '3px', fontSize: '80%', color: 'gray', marginRight: '0px', whiteSpace: 'nowrap' }}>
              {property}
              </div>
          ): (
              <div key={index} style={{ fontWeight: '600',  paddingLeft: '5px', paddingRight: '3px', fontSize: '80%', color: 'black', marginRight: '0px', whiteSpace: 'nowrap' }}>
                {property}
              </div>
            )         
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '100%' }}>
          {id}
        </div>
      )}
    </div>
  );
  function onlyWarehouses(data) { 
    var returnArray = [];
    returnArray.push({value: "", label: ""}); 

    for (var i = 0; i < data.Items.length; i++) {  
        returnArray.push({value: data.Items[i].Properties.Items[0].StringValue, label: data.Items[i].Properties.Items[0].StringValue});           
    }

    return returnArray;
}


  const formatOptionLabel = ({ label, properties, header, id }) => {

    var exists = false;

    if(id!=null && chosenType!=null) {
         exists = chosenType.id ==  id;
    }

    // Return the component with the processed data
    return (
      <DynamicFormatOptionLabel properties={properties} id={id} label={label} header={header} selected = {exists} />
   );
  };

  function handleSelectChangeType(choice) {
    if(choice.id ==""){
      setChosenType(null)
    } else {
      setChosenType(documentTypes.find(element => element.properties[0] == choice.properties[0]))
    }
  }


  function handleSelectChangeWarehouse(choice) {
    if(choice.value == "") {
      setChosenWarehouse(null)
    } else {
     setChosenWarehouse(warehouses.find(element => element.value == choice.value))
    }
  }

  return (
    <div>
     
      <Popup
        position="right center"
        open={props.isOpen}
        onClose={props.onClose}
      >

        <div className="outer-order">

        <div className='header-order' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2em' }}>
            <h4>Izberite.</h4>
        </div>

        <div className='choices-order'style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5em', gap: '2em' }}>


        <div class="form-group">


        <label htmlFor="document-type-import">
                Tip dokumenta
        </label>

        <Select
               formatOptionLabel={formatOptionLabel}
               id="document-type-import"
               placeholder="Prevzeta vrednost"
               value={chosenType}
               onChange={(selected) => handleSelectChangeType(selected)}
               options={documentTypes}
        />



</div>

<div class="form-group">


        <label htmlFor="import-warehouse">
              Skladišče
        </label>


        <Select
                  id="warehouses-import"
                  placeholder="Prevzeta vrednost"
                  value={chosenWarehouse}
                  onChange={(selected) => handleSelectChangeWarehouse(selected)}
                  options={warehouses}
        />

</div>
        
        </div>
        <button className='actions smallerr' id='confirmAdditionalInformation' onClick={() => setChosenState("position")}>Confirm</button>



        </div>
        
      </Popup>


    </div>
  );
};
