import { useTable, useGlobalFilter, usePagination } from 'react-table';
import { useDropzone } from 'react-dropzone';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ImportSheetChoice from './ImportSheetChoice';
import Locking from './Locking';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import { FaUnlock } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loader from '../loader/Loader';
import ImportService from '../services/ImportService';
import ExcelJS from 'exceljs';


const ImportWizzard = (props) => {

  const [fileContent, setFileContent] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [sheetNames, setSheetNames] = useState([]);
  const [workbook, setWorkbook] = useState({});
  const [columnStatus, setColumnStatus] = useState({});
  const [lockingVisibility, setLocking] = useState(false);
  const [currentLocking, setCurrentLocking] = useState({})
  const [locked, setLocked] = useState([]);
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const toggleColumnStatus = (columnId) => {

    setColumnStatus((prevStatus) => ({
      ...prevStatus,
      [columnId]: prevStatus[columnId] === 'unlocked' ? 'locked' : 'unlocked',
    }));
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };


  const closePopupLock = () => {
    setLocking(false);
  };

  const handleHeaderCellClick = (columnId) => {


    if(columnStatus[columnId] == "locked") {
      toggleColumnStatus(columnId)
      var currentColumn = columns.find((table) => table.accessor === columnId);
      currentColumn.connection = "";
      setColumns((prevColumns) => {
        const col = [...prevColumns];
        const index = col.findIndex((element) => element.accessor === currentColumn.accessor);
        col[index] = currentColumn;
        return col;
      });
    }


    var currentColumn = columns.find((table) => table.accessor === columnId);
    
    setCurrentLocking(currentColumn)
    setLocking(true);

  };

  const onChoiceReceived = (sheetName) => {

        setIsPopupOpen(false)

        
        const sheetNameString = sheetName;     
        const sheet = workbook.Sheets[sheetNameString];
        const excelData = XLSX.utils.sheet_to_json(sheet, 
        // Configuration of the xlsx file reading.
        { 
          header: 1, 
          raw: false, 
          dateNF: 'yyyy-mm-dd hh:mm:ss',
          cellText: false,
          rawNumbers: true
        });
        const headers = excelData[0];
        const tableColumns = headers.map((header) => ({ Header: header, accessor: header, connection: '' }));
        setColumns(tableColumns);

        // Get the maximum number of columns in any row
        const maxColumns = Math.max(...excelData.slice(1).map(row => row.length));

        // Make sure all rows have the same length
        const normalizedData = excelData.map(row => {
            // Pad missing pairs with empty strings
            const paddedRow = Array.from({ length: maxColumns }, (_, index) => row[index] || '');
            // Convert all values to strings
            return paddedRow.map(value => String(value));
        });
        // Transform the normalized data to an array of objects
        const transformedData = normalizedData.slice(1).map(row => {
            return row.reduce((obj, value, index) => {
            obj[headers[index]] = value;
            return obj;
            }, {});
        });
        const initialColumnStatus = {};
        headers.forEach((header) => {
            initialColumnStatus[header] = 'unlocked'; // You can use 'locked' to initialize as locked if needed
        });

        setColumnStatus(initialColumnStatus);


        setFileContent(transformedData); // Exclude the header row
  };





  const onChoiceReceivedLock = (column) => {
    setColumns((prevColumns) => {
      const col = [...prevColumns];
      const index = col.findIndex((element) => element.accessor === column.accessor);
      col[index] = column;
      return col;
    });


    setLocked((prevLocked) => {
        const col = [...prevLocked];
        col.push(column)
        return col;
    })



    setLocking(false)
    toggleColumnStatus(column.accessor)
  };





  const importData = () => {


    var unlocked = false;
    for(var i = 0; i < props.columns.length; i++) {
      var current = props.columns[i];
      if (current.required) {
        // Try to find the element.
        var isLocked = locked.findIndex(element => element.connection == current.Name) !== -1;
        if(!isLocked) {
          Swal.fire('Napaka!', 'Morate zakleniti vse obvezne podatkovne povezave.', 'error');
          return;
        }
      }
    }

    // Show the loader
    props.loader(true)
    // Begin work


    var columnsData = props.columns;
    var data = fileContent;

    for(var i = 0; i < columns.length; i++) {
        var connection = columns[i].connection;
        var accessor = columns[i].accessor;
        columnsData[columnsData.findIndex(column => column.Name == connection)].connection = accessor;            
    }

    var error = 0;
    var counter = 0;
    for(var i = 0; i < data.length; i++) {
        var params = [];
        var currentObject = data[i]
        for (var col = 0 ; col < columnsData.length ; col++) {
            var columnInformation = columnsData[col];
            var found = currentObject[columnInformation.connection]
            if (typeof found === "undefined") {            
                // Not found set to default value //
                var defaultValue = columnInformation.default;
                var type = columnInformation.Database;                    
                if(type == "Boolean") {
                  if(defaultValue == "1") {
                      defaultValue = true;
                  } else {
                      defaultValue = false;
                  }
                }
                if(type == "Int32") {
                  defaultValue = Number(defaultValue);
                }

                
                if (type == "DateTime") {                
                  // Reduntant but leave for the future modifications.             
                  defaultValue = defaultValue;                 
                }

                if(type == "Decimal") {
                  defaultValue = Number(defaultValue);
                }

                var parameter = { Name: columnInformation.Name, Type: type, Value: defaultValue  }
                params.push(parameter);   
            } else {
                var defaultValue = columnInformation.default;
                var type = columnInformation.Database;              
                if(type == "Boolean") {
                  if(found == "1") {
                      found = true;
                  } else {
                      found = false;
                  }
                }
                if(type == "Int32") {
                  found = Number(found);
                }

                if (type == "DateTime") {                
                    // Reduntant but leave for the future modifications.             
                    found = found;                 
                }

                if(type == "Decimal") {
                  found = Number(found);
                }

                var parameter = { Name: columnInformation.Name, Type: type, Value: found  }
                params.push(parameter); 
        }
      }
    
          // Import the row in the database //
          params = correctDependencies(params, columnsData);


      

        ImportService.insertSQLQuery(props.sql, params)
          .then(result => {
            counter += 1;

            if(!result) {
              error += 1;
            }

            if (counter == data.length) {
              props.loader(false)
              if(error > 0) {
                window.showAlert("Informacija", "Prišlo je do napake, nekateri podatki niso bili zapisani.", "error");
              } else {
                window.showAlert("Informacija", "Uvoz se končal brez napak", "success");
              }


              setFileContent([])
              cleanupWorkbook();

            }
          })   
        // Import the row in the database //
    }

   
      
    

}
     

function correctDependencies(params, columnsData) {

  var returnParameters = params;

  for (var i = 0; i < columnsData.length; i++) {
    var current = columnsData[i];
      if(current.hasDependency) {
          var foundParameter = returnParameters.find((element) => element.Name == current.Name);
          var dependedParameter = returnParameters.find((element) => element.Name == current.dependency.dependedOn)

          if(dependedParameter.Value == current.dependency.dependencySameAs) {        
            foundParameter.Value = current.dependency.valueIfDependencySame;
          } else {
            foundParameter.Value = current.dependency.else;
          }




          returnParameters[returnParameters.findIndex((element) => element.Name == current.Name)] = foundParameter;
      }
  }


  return returnParameters;
  }

  const cleanupWorkbook = () => {
    setWorkbook(null);
  };


  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;   
      // Check if the file is in Excel format
      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        const workbook = XLSX.read(content, {type:'binary',cellText:false,cellDates:true});
        setWorkbook(workbook);
        setSheetNames(workbook.SheetNames) 
        openPopup();      
      } else if (file.name.endsWith(".txt")){

      }
     
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
});

  const { 
    
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of 'rows', we use 'page' which represents the currently visible page
    prepareRow,
    state: { globalFilter, pageIndex, pageSize },
    setGlobalFilter,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    pageCount,
    setPageSize,

   } = useTable({
    columns: columns,
    data: fileContent,
    initialState: {
      pageSize: 5, // Set the initial page size to 5
    },
  },
  
    useGlobalFilter,
    usePagination // Add the usePagination hook
  
  
  
  
  );

  return (
    <div>

  

      <ImportSheetChoice sheets={sheetNames} onChosen = {onChoiceReceived} isOpen={isPopupOpen} onClose={closePopup} />
      <Locking columns={props.columns} column={currentLocking} onChosen = {onChoiceReceivedLock} isOpen={lockingVisibility} onClose={closePopupLock} />


      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Povlecite in spustite besedilno ali Excel datoteko ali pa kliknite, da jo izberete.</p>
      </div>

      {fileContent.length > 0 && (
        <>

<div className='lower-components'>
<div className='paginationControls'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}



        <div className="search-container">
      <div className="search-icon" >
        <FaSearch style={{ color: 'white', display: 'flex', alignItems: 'center' }} />
      </div>

        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{
            backgroundColor: '#081A45',
            color: 'white',
            border: 'none', // Remove the white border
            borderRadius: '5px',
            height: '2em',
            padding: '10px',
            transition: 'opacity 2.5s', // Apply a transition for a smooth appearance
          }}
        />

    </div>


        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} od {pageOptions.length}
          </strong>{' '}
        </span>
    
       
      </div>


          <table {...getTableProps()} style={{}} className='react-table-wizzard'>
          <thead>
            {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} onClick={() => handleHeaderCellClick(column.id)}>
                    <div>
                        {column.render('Header')}
                        {columnStatus[column.id] === 'unlocked' ? (
                        <FaUnlock
                            style={{ marginLeft: '5px', cursor: 'pointer', color: 'white'}}
                   
                        />
                        ) : (
                        <FaLock
                            style={{ marginLeft: '5px', cursor: 'pointer', color: 'white' }}
                            
                        />
                        )}
                      {" " + column.render('connection')}

                    </div>
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row) => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
                </tr>
            );
            })}
            </tbody>
          </table>


           <div className='export-button-div'>
          <button className='actions smallerr' onClick={() => importData()}>Uvozi podatke</button>
          </div>

          </div>

        </>
      )}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default ImportWizzard;
