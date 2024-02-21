
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import Select from 'react-select'
import StockService  from '../services/StockService';
import $ from 'jquery'; 
import Table from '../table/Table';
import DataAccess from "../utility/DataAccess";
import TableForgeDashboard from './TableForgeDashboard';

export default function Stock() { 

    checkUID () 


    const [warehouses, setWarehouses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [idents, setidents] = useState([]);
    const [ident, setIdent] = useState();
    const [location, setLocation] = useState();
    const [warehouse, setWarehouse] = useState();
    const [data, setData] = useState([]);




    useEffect(() => {

    StockService.getWarehouses().then(response => {  
        var warehouses = onlyWarehouses(response);
        setWarehouses(warehouses);     
    }); 
   
    StockService.getIdents().then(response => {  
        var identsFinal = [];
        identsFinal.push({value: "", label: ""}); 

        for (var i = 0; i < response.length; i++) {  
          try {
              identsFinal.push({value: response[i], label: response[i]}); 
          } catch (e) {
            continue;
          }
        }

        setidents(identsFinal);


    });
      }, []);

      

    function onlyWarehouses(data) { 
        var returnArray = [];
        returnArray.push({value: "", label: ""}); 

        for (var i = 0; i < data.Items.length; i++) {  
            returnArray.push({value: data.Items[i].Properties.Items[0].StringValue, label: data.Items[i].Properties.Items[0].StringValue});           
        }

        return returnArray;
    }


    function isUUID ( uuid ) {
      let s = "" + uuid;
      s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
      if (s === null) {
        return false;
      }
        return true;
     } 
  

    function checkUID () {
      const cookies = new Cookies();
      var cookie = cookies.get('uid');
      if (typeof cookie !== "undefined") {     
        if(isUUID(cookie)) {     
          return;
        } 
    } else {
          window.location.href = "/";
      }
    }
    const customStyles = {
      dropdown: (provided) => ({
        ...provided,
        zIndex: 9999, // Set a higher z-index value
      }),
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
      })
    };
    

  const fetchData = async (sql, params) => {



      StockService.executeSQLQuery(sql, params)
      .then(result => {
        setData(result)
      })
  };




    const handleInventory = (e) => {  

      

      var usedFilters = []
      var params = [];
      var sql = "SELECT acWarehouse, acIdent, anQty, acLocation FROM uWMSStock";
      if(typeof warehouse !== "undefined" && warehouse !== null) {
        usedFilters.push("warehouse");
      }
      if(typeof location !== "undefined" && location !== null) {
        usedFilters.push("location");
      }
      if(typeof ident !== "undefined" && ident !== null) {
        usedFilters.push("ident");
      }

      if(usedFilters.length != 0) {
        sql += " WHERE";
      } 
      for(var i = 0; i < usedFilters.length; i++) {
          if(i == 0) {
            if(usedFilters[i] == "warehouse") {
              sql += " acWarehouse = @warehouse";
              var parameter = { Name: "warehouse", Type: "String", Value: warehouse.value  };
              params.push(parameter);     
            } else if(usedFilters[i] == "location") {
              sql += " acLocation = @location";
              var parameter = { Name: "location", Type: "String", Value: location.value   };
              params.push(parameter);   
            } else if(usedFilters[i] == "ident") {
              sql += " acIdent = @ident";
              var parameter = { Name: "ident", Type: "String", Value: ident.value   };
              params.push(parameter);   
            }
          } else {
            if(usedFilters[i] == "warehouse") {
              sql += " AND acWarehouse = @warehouse";
              var parameter = { Name: "warehouse", Type: "String", Value: warehouse.value   };
              params.push(parameter);   
            } else if(usedFilters[i] == "location") {
              sql += " AND acLocation = @location";
              var parameter = { Name: "location", Type: "String", Value: location.value   };
              params.push(parameter);   
            } else if(usedFilters[i] == "ident") {
              sql += " AND acIdent = @ident";
              var parameter = { Name: "ident", Type: "String", Value: ident.value   };
              params.push(parameter);   
            }
          } 
       }
       sql += ";";
       fetchData(sql, params);
    }





    function handleIdentChange(event) { 
      if(event.value!="") {
        setIdent(event); 
      } else {
        setIdent(null);
      }
    }

    function handleLocationChange(event) {
      if(event.value!="") {
        setLocation(event); 
      } else {
        setLocation(null);
      }
    }

    function handleWarehouseChange(event) { 
        if(event.value!="") {
          setWarehouse(event); 
        } else {
          setWarehouse(null);
        }
        StockService.getLocations(event.value).then(response => {  
        var locations = [];
        locations.push({value: "", label: ""}); 

            for (var i = 0; i < response.Items.length; i++) {  
                locations.push({value: response.Items[i].Properties.Items[0].StringValue, label: response.Items[i].Properties.Items[0].StringValue});
            }
            setLocations(locations);        
        }); 
    }

    // Set up the value for the back button 
    localStorage.setItem('back', "dashboard")
    const name = "stock"
    
    return ( 

        <div>
     
        <Header />   


        <div className ="stock-container-filters">  

        <Select className='select-filters-stock' styles={customStyles} placeholder={"Warehouse"} value={warehouse} onChange={handleWarehouseChange} options={warehouses} id='warehouseStock' />
        <Select className='select-filters-stock' styles={customStyles} placeholder={"Location"} value={location}  onChange={handleLocationChange} options={locations} id='locationStock'/>
        <Select className='select-filters-stock' styles={customStyles} placeholder={"Ident"} value={ident} onChange={handleIdentChange} options={idents} id='identStock'/>



        <span className='actions smallerr stock' styles={customStyles} onClick={handleInventory}>Show</span>

        </div>

        <TableForgeDashboard name={name} tableData = {data} />

      

        <Footer />

        </div>

    ); 
} 