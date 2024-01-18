import axios from 'axios';


const SettingsService  = {



  async  insertSQLQuery(sqlQuery, parameters) {
  
    const apiUrl = `${process.env.REACT_APP_API_URL}/Services/Device/?mode=sql&type=sel`; 

    const requestObject = {
      SQL: sqlQuery,
      Parameters: parameters,
    };
  
    try {

      const response = await axios.post(apiUrl, JSON.stringify(requestObject), {
        headers: {
          'Content-Type': 'application/json'
        }

      });


      console.log(response);


      if (response.data.Success) {

        return true;
      } else {

        return false;
      }
    } catch (error) {

      return false;
    }

  },



  async  deleteSQLQuery(sqlQuery, parameters) {

    const apiUrl = `${process.env.REACT_APP_API_URL}/Services/Device/?mode=sql&type=sel`; 

    const requestObject = {
      SQL: sqlQuery,
      Parameters: parameters,
    };
  
    try {

      const response = await axios.post(apiUrl, JSON.stringify(requestObject), {

        headers: {
          'Content-Type': 'application/json'
        }

      });
  
      if (response.data.Success) {

        return true;
      } else {

        return false;
      }
    } catch (error) {
      
      return false;
    }

  },





  async  executeSQLQuery(sqlQuery, parameters) {
    const apiUrl = `${process.env.REACT_APP_API_URL}/Services/Device/?mode=sql&type=sel`; 
    const requestObject = {
      SQL: sqlQuery,
      Parameters: parameters,
    };
  
    try {
      const response = await axios.post(apiUrl, JSON.stringify(requestObject), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.Success) {
        const dataPacket = response.data.Rows;
        const dataReturn = dataPacket.map(item => {
          const toAdd = {};
          for (const key in item.Items) {
            if (item.Items.hasOwnProperty(key)) {
              const value = item.Items[key];
              toAdd[key] = value;
            }
          }
          return toAdd;
        });
        
        return dataReturn;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  },


async executeSQLQueryBatch(data, parameters) {

  var toReturn = {}
  for(const accessor in data) {
    if (data.hasOwnProperty(accessor)) {

        const popupSelect = data[accessor];
        const apiUrl = `${process.env.REACT_APP_API_URL}/Services/Device/?mode=sql&type=sel`; 
        const requestObject = {
          SQL: popupSelect,

        };
      
        try {

          const response = await axios.post(apiUrl, JSON.stringify(requestObject), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      



          if (response.data.Success) {
            const dataPacket = response.data.Rows;
            const dataReturn = dataPacket.map(item => {
              const toAdd = {};
              for (const key in item.Items) {
                if (item.Items.hasOwnProperty(key)) {
                  const value = item.Items[key];
                  toAdd[key] = value;
                }
              }
              return toAdd;
            });  
            
            
            toReturn[accessor] = dataReturn;
          } else {
            toReturn[accessor] = [];

          }
        } catch (error) {
          toReturn[accessor] = [];
        }
  }}

  return toReturn;
  },










  

    async getSettingsData(url) {
      const response =  await axios.get(process.env.REACT_APP_API_URL + url)   
      return response.data;
    },



}



export default SettingsService