// Users.js
import React, { useState, useEffect } from 'react';
import SettingsService from '../services/SettingsService';
import UserTable from './UserTable'; // Import the UserTable component
import Header from '../dashboard/Header';
import Footer from '../dashboard/Footer';
import TableForge from './TableForge';
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import {store} from '../store/store'

function System() {

  const [data, setData] = useState([]);
  const [refreshTrigger, setRefresh] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      
      try {
        SettingsService.executeSQLQuery("SELECT * FROM uWMSSetting;", [])
        .then(result => {
          setData(result)
        })
        .catch(error => {
          console.error("Error:", error);
        });

      } catch (error) {
      }
    };
    fetchData();
  }, [refreshTrigger]);

  
  var users = [];

  const tableName = 'system';



  const refresh = () => {

    setRefresh(!refreshTrigger);


  }



  return (
    <div>

    <Header />

    <div className="Users">
   
      <div className="users-container-table">
         <TableForge refresh={refresh} name={tableName} tableData = {data} />
      </div>
      
    </div>

    <Footer />
    
    </div>
  );
}

export default System;
