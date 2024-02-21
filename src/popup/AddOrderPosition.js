import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TransactionService from '../services/TransactionService';
import ListingService from '../services/ListingService';
import { useSelector, useDispatch } from 'react-redux'
import DataAccess from "../utility/DataAccess";

const AddOrderPosition = (props) => {
  const [idents, setIdents] = useState([]);
  const [selectedIdent, setSelectedIdent] = useState(null);
  const [quantity, setQuantity] = useState('');
  const order = useSelector((state) => state.data.orderKey)
  const userId = useSelector((state) => state.user.userId)
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {

        // Get idents
        const response = await TransactionService.getIdents();
        const identObjects = response.data.map((ident) => ({ label: ident, value: ident }));
        setIdents([{ label: '', value: '' }, ...identObjects]);

        // Get the list of warehouses
        const responseWarehouses = await TransactionService.getWarehouses()

        var warehousesReturn = []
        for (var i = 0; i < responseWarehouses.Items.length; i++) {


          var warehouseObj = DataAccess.getData(responseWarehouses.Items[i], "Name", "StringValue");
          warehousesReturn.push({value: warehouseObj, label:warehouseObj});   
               
        } 

        setWarehouses(warehousesReturn);


      } catch (error) {
        // Error handling
      }
    };

    fetchData();
  }, []);

  const handleAddOrderPosition = () => {



    
    if (selectedIdent) {

      var toSend = {
        Key: props.current,
        Qty: quantity,
        Ident: selectedIdent.value,
        Clerk:  localStorage.getItem('name')
      }


      ListingService.createPosition(toSend).then(response => { 

          if (response.Success) {
            window.showAlert("Information", "Created successfully", "success")
          } else {
            window.showAlert("Information", "Error", "error")
          }
          onClose();
          props.communicate("position", "render")
        // close and render
     }); 

      // Clear the state after adding
      setSelectedIdent(null);
      setQuantity('');


    }
  };

  if (!props.isVisible || props.current == -1) {

    return null;
  }

  function setSelectedLocationEvent(e) {
    setSelectedLocation({value:e.value, label:e.value})
  }

  function setSelectedWarehouseEvent(e) { 

    const fetchData = async () => {

              const responseLocations = await TransactionService.getLocations(e.value);
              var locationsReturn = []
              for (var i = 0; i < responseLocations.Items.length; i++) {      
                    var locationsObj = DataAccess.getData(responseLocations.Items[i], "Name", "StringValue");
                    locationsReturn.push({value: locationsObj, label:locationsObj});                       
              } 
              setLocations(locationsReturn);
      
    }

    setSelectedWarehouse({value:e.value, label:e.value})

    fetchData() 

  }




   function onClose() {
    props.onClose();
  }
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <button className="popup-close-btn" onClick={onClose} >
            X
          </button>
        </div>
        <div className="popup-body">
          <label htmlFor="ident">Ident:</label>

          <Select
            placeholder="Ident"
            id="identListControl"
            options={idents}
            value={selectedIdent}
            onChange={(selectedOption) => setSelectedIdent(selectedOption)}
          />


          <label htmlFor="quantity">Quantity:</label>

          <input
            type="number"
            id="quantity"
            className="popup-input"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />


          <div className="center-button">
            <center><span onClick={handleAddOrderPosition} className="actions smallerr">
              Dodaj
            </span>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrderPosition;