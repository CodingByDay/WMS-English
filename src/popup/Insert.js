import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TransactionService from '../services/TransactionService';
import ListingService from '../services/ListingService';
import { useSelector, useDispatch } from 'react-redux'
import DataAccess from "../utility/DataAccess";
import SettingsService from '../services/SettingsService';
import Swal from 'sweetalert2';

const Insert = (props) => {
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [inputValues, setInputValues] = useState({});


  function extractDropdownPairs(data) {
    const dropdownPairs = {};
    data.value.forEach((column) => {
      if (column.type === 'dropdown') {
        dropdownPairs[column.accessor] = column.sourceSelect || '';
      }

    });
  
    return dropdownPairs;
  }
  const getValue = (inputName) => inputValues[inputName] || '';

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

    const connectData = async () => {
      var finalOptions = {};
      if(props.isVisible) {
      try {
        var pairs = extractDropdownPairs(props.selectedTable)
        SettingsService.executeSQLQueryBatch(pairs)
        .then(result => {
            var data = result;
            for(var i = 0; i < props.selectedTable.value.length; i++) {
                var current = props.selectedTable.value[i];
                var currentData = data[current.accessor];
                var type = current.type;
                var emptyOption = { value: '', label: '', id: '' }
                if(type === "dropdown") {
                  const options = currentData.map(item => {
                    const value = current.columnOrder.map(field => item[field]).join('|');
                    return { value, label: value, id: item[current.dropdownId] };
                  });
                  
                  finalOptions[current.accessor] = [emptyOption, ...options];

                }
            }


            setDropdownOptions(finalOptions);
        })
        .catch(error => {
          console.error("Error:", error);
        });

        
      } catch (error) {
        // Handle errors
        console.error('Error fetching dropdown options:', error);
      }

    }
    };



  

  if (!props.isVisible) {
     return null;
  } if (Object.keys(dropdownOptions).length === 0) {
    connectData()
  }

   function onClose() {
    setSelectedOptions({})
    setInputValues({})
    props.onClose();
  }
  const handleSelectChange = (accessor, selected) => {

    setSelectedOptions({
      ...selectedOptions,
      [accessor]: {value: selected.id, label: selected.id},
    });
  };



  const sendData = () => {


    var insertQuery = props.selectedTable.insertQuery;
    var columns = props.selectedTable.value;



    for (let i = 0; i < columns.length; i++) {
        var column = columns[i];
        var type = column.type;
        var accessor = column.accessor;
        if(accessor!="nothing") {
            if(type == "text") {

              var theValue = getValue(accessor);
              var theValueInsideQuery = "@" + accessor;
              insertQuery = insertQuery.replace(theValueInsideQuery, theValue);

            } else if(type == "dropdown") {

                var theValue = selectedOptions[accessor].value;
                var theValueInsideQuery = "@" + accessor;
                insertQuery = insertQuery.replace(theValueInsideQuery, theValue);
                

            } else if(type == "checkbox") {

                var theValue = selectedOptions[accessor];
                var theValueInsideQuery = "@" + accessor;
                insertQuery = insertQuery.replace(theValueInsideQuery, theValue);              
            }
        }    
    }

 


      SettingsService.insertSQLQuery(insertQuery)
      .then(result => {
          props.refresh();
          var data = result;

          if(data) {
              onClose();
          } else {
            Swal.fire(
              'Napaka!',
              'Zapis ni bil zapisan.',
              'error'
            );
            onClose();
          }

         
      })
   

      
    


  };




  return (
    <div className="popup-overlay insert">
      <div className="popup-content insert">
        <div className="popup-header insert">
          <button className="popup-close-btn insert" onClick={onClose} >
            X
          </button>
        </div>
        <div className="popup-body insert">
        {props.selectedTable.value.map((column) => (
           column.type !== 'nothing' && (
            <div key={column.accessor} className="form-group insert">
              <label htmlFor={column.accessor}>{column.Header}:</label>
              {column.type === 'dropdown' ? (
               <Select
               id={column.accessor}
               placeholder={column.dropdownPlaceholder}
               name={column.accessor}
               options={dropdownOptions[column.accessor] || []}
               value={selectedOptions[column.accessor]}
               onChange={(selected) => handleSelectChange(column.accessor, selected)}
             />
              ) : (
                <input
                type={column.type === 'checkbox' ? 'checkbox' : 'text'}
                id={column.accessor}
                name={column.accessor}
                className={column.type === 'checkbox' ? 'form-check-input' : 'form-control'}
                value={getValue(column.accessor)} // Set the value from state
                onChange={handleInputChange} // Update the state on change
              />
              )}
            </div>
           )
          ))}


          <div className="center-button">
            <center><span onClick={sendData}  className="actions smallerr">
              Dodaj
            </span>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insert;