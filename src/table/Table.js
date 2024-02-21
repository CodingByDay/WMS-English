import TableHead from "./TableHead";
import TableBody from "./TableBody";
import { useState } from "react";
import tableData1 from "./tableData1.json";




const Table = (props) => {

const [tableData, setTableData] = useState(tableData1);

 const columnsOrder = [

  { label: "Chosen", accessor: "Chosen", type: "StringValue"},
  { label: "Warehouse", accessor: "Warehouse", type: "StringValue"},
  { label: "Consignee", accessor: "Consignee", type: "StringValue"},
  { label: "Deadline", accessor: "DeliveryDeadline", type: "DateTimeValue"},
  { label: "Status", accessor: "Status", type: "StringValue"},
  { label: "Document type", accessor: "DocumentType", type: "StringValue"},
  { label: "Key", accessor: "Key", type: "StringValue"},
  { label: "Receiver", accessor: "Receiver", type: "StringValue"}
  

 ];



const columnsPositions = [
  { label: "Chosen", accessor: "Chosen", type: "StringValue"},
    { label: "Ident", accessor: "Ident", type: "StringValue"},
    { label: "Name", accessor: "Name", type: "StringValue"},
    { label: "Item ID", accessor: "ItemID", type: "IntValue"},
    { label: "Position", accessor: "No", type: "IntValue"},
    { label: "Open", accessor: "OpenQty", type: "DoubleValue"},
    { label: "Ordered", accessor: "FullQty", type: "DoubleValue"}
  

    
]

const columnsTransaction = [
  { label: "Izbor", accessor: "Chosen", type: "StringValue"},
  { label: "ID", accessor: "HeadID", type: "IntValue"},
  { label: "Tip transakcije", accessor: "DocumentType", type: "StringValue"},
  { label: "Dokument", accessor: "Type", type: "StringValue"},
  { label: "Status", accessor: "Status", type: "StringValue"},
  { label: "P.D", accessor: "DocumentType", type: "DoubleValue"},
  { label: "ERP ključ", accessor: "Key", type: "StringValue"},
  { label: "Nalog za transakcijo", accessor: "LinkKey", type: "StringValue" },
  { label: "Stranka", accessor: "Receiver", type: "StringValue" },
  { label: "Skladišče", accessor: "WharehouseName", type: "StringValue" },
  { label: "Datum", accessor: "Date", type: "DateTimeValue" },
  { label: "Vnesel", accessor: "ClerkName", type: "StringValue" },
  { label: "Datum vnosa", accessor: "DateInserted", type: "DateTimeValue" }
 

]

const columnsTransactionPosition = [
  { label: "Izbor", accessor: "Chosen", type: "StringValue"},
  { label: "ID transakcije", accessor: "HeadID", type: "IntValue" },
  { label: "Ključ transakcije", accessor: "LinkKey", type: "StringValue" },
  { label: "Številka pozicije", accessor: "ItemID", type: "IntValue" },
  { label: "Serijska številka", accessor: "SerialNo", type: "StringValue" }, 
  { label: "Ident", accessor: "Ident", type: "StringValue" },
  { label: "Naziv identa", accessor: "IdentName", type: "StringValue" },
  { label: "WMS količina", accessor: "Qty", type: "DoubleValue" }
 

]


const columnsLocationComponent = [
  { label: "Lokacija", accessor: "Location", type: "StringValue" },
  { label: "Količina", accessor: "Quantity", type: "DoubleValue" },
]


const columnsStockComponent = [
  { label: "Ident", accessor: "Ident", type: "StringValue" },
  { label: "Lokacija", accessor: "Location", type: "StringValue" },
  { label: "Količina", accessor: "RealStock", type: "StringValue" },
]



    let columns;

    if (props.type === "order") {

      columns = columnsOrder;

    } else if(props.type === "position") {

      columns = columnsPositions;

    } else if(props.type === "transaction") { 

      columns = columnsTransaction;

    } else if (props.type === "positionsTransaction") {
      
      columns = columnsTransactionPosition;
      
    } else if (props.type === "locationComponent") { 

      columns = columnsLocationComponent;

    } else if (props.type === "stock" ) {

      columns = columnsStockComponent;

    }




 return (

    <div className={props.class}>
        <table className="table notStripped" id={props.passID}>
        <TableHead className="orders" columns={columns} />
        <TableBody table = {props.table} returnRow = {props.childToParent} className = "positions" columns={columns} sort = {props.sort} tableData={props.data}  />
      </table>
   </div>

 );
};

export default Table;