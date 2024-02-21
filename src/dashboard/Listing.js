import HeaderOrderListing from './HeaderOrderListing';
import OrderHeadsListing from './OrderHeadsListing';
import OrderPositions from './OrderPositions';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import ListingService from '../services/ListingService';
import Loader from '../loader/Loader';
import $ from 'jquery'; 
import ListingPositionsButtons from './ListingPositionsButtons';
import DataAccess from "../utility/DataAccess";
import StatusChange from "./StatusChange";
import { useSelector, useDispatch } from 'react-redux'
import * as redux from '../features/data';
import AddOrderPosition from '../popup/AddOrderPosition';
import TransactionService from '../services/TransactionService';

export default function Listing() { 
    checkUID ()
    const dispatch = useDispatch()


   
    const name = useSelector((state) => state.user.fullName)
    const [popupVisible, setPopupVisible] = useState(false);


    const [warehouses, setWarehouses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [idents, setIdents] = useState([]);


    const [isPositionSelected, setIsPositionSelected] = useState(false);
    const [isHeadOrderSelected, setIsHeadOrderSelected] = useState(false);


    const handlePopupClose = () => {
      setPopupVisible(false);
    };

    
    
  
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
  
    // orders
    const [orders, setOrders] = useState([]);
    // positions
    const [positions, setPositions] = useState([]);
    const [selectedHeadOrder, setSelectedHeadOrder] = useState();
    const [selectedPosition, setSelectedPosition] = useState();
    const [showStatusAlert, setShowStatusAlert] = useState(false)
    useEffect(() => {


      localStorage.setItem('back', "dashboard")
      var loader = document.getElementById("loader");

              loader.style.display = "block";
              $(".main-container").css ("display", "none");
              ListingService.getAllListings().then(response => { 
                
              setOrders(response);

              loader.style.display = "none";
              $(".main-container").css ("display", "block");
           });        
    }, []);

  async function getPositions(order) {
    ListingService.getAllPositions(order).then(response => { 
      response.Items = response.Items.sort(function(a, b) {
          var aValue = DataAccess.getData(a, "No", "IntValue")
          var bValue = DataAccess.getData(b, "No", "IntValue")
          return aValue - bValue;
      });


      var positions = [];


      for(var i = 0; i < response.Items.length; i++) {
        var itemID = DataAccess.getData(response.Items[i], "ItemID", "IntValue")
          if(itemID != 0) {
            positions.push(response.Items[i])
          } else {
           continue;
          }

      }

      response.Items = positions
      setPositions(response);  
    });
  }

  const [sort, setSort] = useState();
  const [refresh, setRefresh] = useState("refresh");
  const  childToParent = (data) => {

      if(data.childElementCount > 7)  {
          getPositions(data.childNodes[6].innerHTML)
          orders.selector = data.childNodes[6].innerHTML;
          setOrders(orders);
          setSelectedHeadOrder(data);
          dispatch(redux.order(data.childNodes[6].innerHTML));
          setIsHeadOrderSelected(true);        
      } else {

          var toChange = positions;
          toChange.selector = data.childNodes[3].innerHTML;
          // positions.selector = data.childNodes[2].innerHTML;
          setPositions([]);
          var positionsInner = {};
          Object.assign(positionsInner, positions);
          positionsInner.selector = data.childNodes[4].innerHTML;
          setPositions(positionsInner);
          setSelectedPosition(data);
          // Checking to see if the position is selected
          setIsPositionSelected(true);
      }
  }

  const getSortingObject = (sorting) => {
    setSort(sorting);
  }

    const communicate = (type, event, data) => {       

        if(type == "status") {
          if(typeof selectedHeadOrder != "undefined") {
            setShowStatusAlert(!showStatusAlert)
          }
        }

        if(type == "position" && event == "create") {
            setPopupVisible(!popupVisible) 
        }
        if(type == "position" && event == "update") {
          

          const key = selectedHeadOrder?.childNodes[6]?.innerHTML ?? -1;

          const itemID = selectedPosition?.childNodes[3]?.innerHTML ?? -1;
          const no = selectedPosition?.childNodes[4]?.innerHTML ?? -1;
          const ident = selectedPosition?.childNodes[1]?.innerHTML ?? -1;


        

        var objectToUpdate = {


          Key: key,
          Qty: data,
          ItemID: itemID,
          Clerk:  localStorage.getItem('name'),
          No: no,
          Ident: ident
          
        }


   

        ListingService.updatePosition(objectToUpdate).then(response => { 

          if (response.Success) {
            window.showAlert("Informacija", "Uspešno spremenjena pozicija!", "success")
          } else {
            window.showAlert("Informacija", "Napaka v podatkih!", "error")
          }
       
          getPositions(currentHead);
     })
         }

        if(type === 'head') {
          if(event ==="delete") {
            window.swal({
              title: 'Potrditev',
              text: "Ali ste sigurni da želite pobrisati naročilo?",
              icon: 'warning',
              buttons: ["Ne", "Ja, pobriši"],
      
            }).then((result) => {
      
              if (result) {
      
                ListingService.deleteHeadDocumentOrder(selectedHeadOrder.childNodes[6].innerHTML).then(response => { 
                    if(response.data.Success) {

                              ListingService.getAllListings().then(response => { 
                                setOrders(response);
                                window.showAlert("Informacija", "Uspešno pobrisano", "success")
                    }); 
                  }
               });    
              }
            })    
          } else if (event === "render") {
              renderComponent();
          }
        } else {
          if(event ==="delete") {
            window.swal({
              title: 'Confirm',
              text: "Are you sure you want to delete the position?",
              icon: 'warning',
              buttons: ["No", "Yes, delete"],
            }).then((result) => { 

                  if(result) {

                    const currentId = selectedPosition?.childNodes[3]?.innerHTML ?? -1;


                    ListingService.deletePosition(currentId).then(response => {                     
                      window.showAlert("Informacija", "Uspešno pobrisano", "success")
                      getPositions(currentHead);
                   }); 
                  }

            })    
          } else if (event ==="edit") {
            var editObject = {
              HeadID: selectedPosition
            }
          } else if (event ==="render") {

             getPositions(currentHead);

          }
        }
    }
    const currentHead = selectedHeadOrder?.childNodes[6]?.innerHTML ?? -1;

    const renderComponent = () => { 
      ListingService.getAllListings().then(response => { 
        setOrders(response);
     }); 
    }

  
    
    return ( 

        <div>


            <Loader />

            <div className='main-container'>

            <Header/>

            <div className='listing-bg' >

            <HeaderOrderListing render = {renderComponent} communicate = {communicate} getSortingObject = {getSortingObject} />

            <OrderHeadsListing  data = {orders} childToParent = {childToParent} sort={sort} />

            <ListingPositionsButtons selectedElement = {selectedPosition} selectedPosition = {isPositionSelected}  selectedHead = {isHeadOrderSelected} communicate = {communicate} />

            <OrderPositions data = {positions} childToParent = {childToParent} />   

            <AddOrderPosition current = {currentHead} isVisible={popupVisible} onClose={handlePopupClose} communicate = {communicate} warehouse = {warehouses} idents = {idents} locations = {locations} />


            {
                showStatusAlert && typeof selectedHeadOrder != "undefined"  && (
                  <StatusChange order = {selectedHeadOrder.childNodes[5].innerHTML} />
                )
            }
   

            <Footer />


        </div>
        



        </div>

        </div>

        

    ); 
} 