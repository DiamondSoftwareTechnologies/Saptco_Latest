/***************************Home Cargo Click ***********************/
myApp.onPageInit('Home', function (page)
{
    $$("#goToCargo").on("click", function ()
    {
        DeleteLocalData("cargoRequestsList");
        DeleteLocalData("cargoItemToUpdateIndex");
        DeleteLocalData("cargoItemToUpdate");
    });
});
/***************************End Home Cargo Click *******************/

myApp.onPageInit('CargoReservationData', function (page)
{
    //change select style
    //$$("body").on("open", ".picker-modal", function ()
    //{
    //    $$(this).find(".toolbar").addClass("cargoToolbarStyle");
    //});

    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    });

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    FillReservationTypes();
    FillDirection();
    FillTrcukTypes();
    FillCities();

    // fill service Type:
    function FillReservationTypes()
    {
        //check in case the cargo date stored in the local storage , in case yes, then read the values from local storage , else read values from server.
        var cargoServiceTypes = GetLocalDataObject("CargoServiceTypes_" + GetServiceLanguage());

        if (cargoServiceTypes == null)
        {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
            {
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Intervals",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var cargoServiceTypes = JSON.parse(data);
                    SaveLocalObject("CargoServiceTypes_" + GetServiceLanguage(), cargoServiceTypes);
                    var options = '';
                    var selected = "";

                    if (cargoServiceTypes.length == 1)
                    {
                        selected = "selected";
                    }
                    for (var x = 0; x < cargoServiceTypes.length; x++)
                    {
                        options += '<option ' + selected + ' value="' + cargoServiceTypes[x].Id + '">' + cargoServiceTypes[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption("#servcies", options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            var selected = "";

            if (cargoServiceTypes.length == 1)
            {
                selected = "selected";
            }

            for (var x = 0; x < cargoServiceTypes.length; x++)
            {
                options += '<option ' + selected + ' value="' + cargoServiceTypes[x].Id + '">' + cargoServiceTypes[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption("#servcies", options);

            $$.ajax(
           {
               url: "https://mobile.saptco.com.sa/Forms/Cargo/Intervals",
               method: "Get",
               headers:
               {
                   'Accept-Language': GetServiceLanguage(),
                   Accept: 'application/json'
               },
               success: function (data, xhr, param)
               {
                   var cargoServiceTypes = JSON.parse(data);
                   SaveLocalObject("CargoServiceTypes_" + GetServiceLanguage(), cargoServiceTypes);
               },
               error: function (xhr, status)
               {
               }
           });
        }
    }

    // intialize date. 
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate());
    var _maxdate = new Date().setDate(currentDate.getDate() + 90);

    var calendarDateFormatDepart = myApp.calendar({
        input: '#calendar-date-depart',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true,
        minDate: today,
        maxDate: _maxdate,
        toolbar: true,
        toolbarCloseText: calendarCloseButton,
        toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '{{monthPicker}}' +
            '{{yearPicker}}' +
        '</div></div> ',
        onOpen: function (p)
        {
            calendarDateFormatDepart.params.maxDate = _maxdate;
            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");

            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        }
    });

    $$("body").on("click", ".picker-calendar-day",
  function ()
  {
      if (this.className.indexOf("disabled") == -1)
      {
          calendarDateFormatDepart.close();
      }
  });

    // fill cargo direction information
    function FillDirection()
    {
        // check in case the direction stored in local storage or not, in case not get the values from service
        var cargoDirection = GetLocalDataObject("CargoDirection" + GetServiceLanguage());

        if (cargoDirection == null)
        {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
            {
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Directions",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var cargoDirection = JSON.parse(data);
                    SaveLocalObject("CargoDirection" + GetServiceLanguage(), cargoDirection);
                    var options = '';
                    var selected = "";

                    if (cargoDirection.length == 1)
                    {
                        selected = "selected";
                    }
                    for (var x = 0; x < cargoDirection.length; x++)
                    {
                        options += '<option ' + selected + ' value="' + cargoDirection[x].Id + '">' + cargoDirection[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.selectDirection', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            var selected = "";

            if (cargoDirection.length == 1)
            {
                selected = "selected";
            }
            for (var x = 0; x < cargoDirection.length; x++)
            {
                options += '<option ' + selected + ' value="' + cargoDirection[x].Id + '">' + cargoDirection[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.selectDirection', options);

            $$.ajax(
            {
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Directions",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    var cargoDirection = JSON.parse(data);
                    SaveLocalObject("CargoDirection" + GetServiceLanguage(), cargoDirection);

                },
                error: function (xhr, status)
                {
                }
            });

        }
    }


    //Fill Truck Types
    function FillTrcukTypes()
    {
        var truckTypes = GetLocalDataObject("truckTypes" + GetServiceLanguage());

        if (truckTypes == null)
        {
            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms//Cargo/TruckTypes",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var truckTypes = JSON.parse(data);
                    SaveLocalObject("truckTypes" + GetServiceLanguage(), truckTypes);
                    var options = '';
                    var selected = "";

                    if (truckTypes.length == 1)
                    {
                        selected = "selected";
                    }
                    for (var x = 0; x < truckTypes.length; x++)
                    {
                        options += '<option ' + selected + ' value="' + truckTypes[x].Id + '">' + truckTypes[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.Truck', options);
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            var selected = "";

            if (truckTypes.length == 1)
            {
                selected = "selected";
            }
            for (var x = 0; x < truckTypes.length; x++)
            {
                options += '<option ' + selected + ' value="' + truckTypes[x].Id + '">' + truckTypes[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.Truck', options);

            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms//Cargo/TruckTypes",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    var truckTypes = JSON.parse(data);
                    SaveLocalObject("truckTypes" + GetServiceLanguage(), truckTypes);
                },
                error: function (xhr, status)
                { }
            });
        }
    }

    //Fill From And to Cities
    function FillCities()
    {
        var citiesCollection = GetLocalDataObject("citiesCollection" + GetServiceLanguage());

        if (citiesCollection == null)
        {
            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Cities",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var citiesCollection = JSON.parse(data);
                    SaveLocalObject("citiesCollection" + GetServiceLanguage(), citiesCollection);
                    var options = '';
                    var selected = "";

                    if (citiesCollection.length == 1)
                    {
                        selected = "selected";
                    }

                    for (var x = 0; x < citiesCollection.length; x++)
                    {
                        options += '<option ' + selected + ' value="' + citiesCollection[x].Id + '">' + citiesCollection[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.ongo', options);
                    myApp.smartSelectAddOption('.onreturn', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            var selected = "";

            if (citiesCollection.length == 1)
            {
                selected = "selected";
            }

            for (var x = 0; x < citiesCollection.length; x++)
            {
                options += '<option ' + selected + ' value="' + citiesCollection[x].Id + '">' + citiesCollection[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.ongo', options);
            myApp.smartSelectAddOption('.onreturn', options);

            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Cities",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    var citiesCollection = JSON.parse(data);
                    SaveLocalObject("citiesCollection" + GetServiceLanguage(), citiesCollection);
                },
                error: function (xhr, status)
                { }
            });
        }
    }
    var cargoItemToUpdate = GetLocalDataObject("cargoItemToUpdate");

    // in case there was information to update, fill the information in the table.
    if (cargoItemToUpdate)
    {
        $$("#going").val(cargoItemToUpdate.FromCity);
        $$("#going").parent().find(".item-after").text(getSmartSelectText("#going"));

        $$('#Return').val(cargoItemToUpdate.ToCity);
        $$("#Return").parent().find(".item-after").text(getSmartSelectText("#Return"));
        $$('#direction').val(cargoItemToUpdate.Direction);
        $$("#direction").parent().find(".item-after").text(getSmartSelectText("#direction"));
        $$('#TruckType').val(cargoItemToUpdate.TruckType);
        $$('#TruckType').parent().find(".item-after").text(getSmartSelectText("#TruckType"));
        $$('#Number').val(cargoItemToUpdate.TruckNo);
        $$('#calendar-date-depart').val(cargoItemToUpdate.RequestDate);
        $$("#type").val(cargoItemToUpdate.ItemType);
        $$("#type").parent().find(".item-after").text(getSmartSelectText("#type"));
        cargoItemToUpdate.ChannelCode = "005";
        $$("#servcies").val(cargoItemToUpdate.ServiceType);
        $$("#servcies").parent().find(".item-after").text(getSmartSelectText("#servcies"));
    }
    else if (GetLocalDataObject("cargoDataObjData"))
    {
        cargoItemToUpdate = GetLocalDataObject("cargoDataObjData");
        $$("#going").val(cargoItemToUpdate.FromCity);
        $$("#going").parent().find(".item-after").text(getSmartSelectText("#going"));

        $$('#Return').val(cargoItemToUpdate.ToCity);
        $$("#Return").parent().find(".item-after").text(getSmartSelectText("#Return"));
        $$('#direction').val(cargoItemToUpdate.Direction);
        $$("#direction").parent().find(".item-after").text(getSmartSelectText("#direction"));
        $$('#TruckType').val(cargoItemToUpdate.TruckType);
        $$('#TruckType').parent().find(".item-after").text(getSmartSelectText("#TruckType"));
        $$('#Number').val(cargoItemToUpdate.TruckNo);
        $$('#calendar-date-depart').val(cargoItemToUpdate.RequestDate);
        $$("#type").val(cargoItemToUpdate.ItemType);
        $$("#type").parent().find(".item-after").text(getSmartSelectText("#type"));
        cargoItemToUpdate.ChannelCode = "005";
        $$("#servcies").val(cargoItemToUpdate.ServiceType);
        $$("#servcies").parent().find(".item-after").text(getSmartSelectText("#servcies"));
    }


    function getSmartSelectText(smartSelectSelector)
    {
        var options = $$(smartSelectSelector).find("option");
        var queryResult = JSLINQ(options).Where(function (item)
        {
            return item.selected == true;
        });

        if (queryResult.items.length > 0)
        {
            return queryResult.items[0].text;
        }
        else
        {
            return "";
        }
    }
    $$("#btnSaveCargorequest").on("click", function ()
    {
        var cargoDataObjData =
               {
                   FromCity: parseInt($$("#going").val()),
                   ToCity: parseInt($$('#Return').val()),
                   Direction: parseInt($$('#direction').val()),
                   TruckType: parseInt($$('#TruckType').val()),
                   TruckNo: $$('#Number').val(),
                   RequestDate: $$('#calendar-date-depart').val(),
                   ItemType: $$("#type").val(),
                   ChannelCode: "005",
                   ServiceType: parseInt($$("#servcies").val())
               };


        // validate Object Data.

        $$('.validate').removeClass("Validation-error");
        var validationResult = validateCargoData(cargoDataObjData);

        // in case the data was valid, send the request to the server
        if (validationResult == ValidationSucessVal)
        {
            if (cargoItemToUpdate)
            {
                $$.each(cargoDataObjData, function (key, value)
                {
                    cargoItemToUpdate[key] = value;
                });
                SaveLocalObject("cargoItemToUpdate", cargoItemToUpdate);
            }
            else
            {
                SaveLocalObject('cargoDataObjData', cargoDataObjData);
            }
            mainView.router.load({ url: 'CargoReservationDataLocation.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
});
//********************Start of CARGO Data Locations  ***********************//

myApp.onPageInit('CargoReservationDataLocation', function (page)
{

    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    });

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    var reqServiceType = "Cargo";

    // check in case the the state is update
    var cargoItemToUpdate = GetLocalDataObject("cargoItemToUpdate");
    if (cargoItemToUpdate)
    {
        localStorage.setItem("txtValueDistLocation" + reqServiceType, cargoItemToUpdate.UnLoadLocationInfo);
        localStorage.setItem("txtDistLocation" + reqServiceType, cargoItemToUpdate.ToCordination);

        localStorage.setItem("txtValuePickUpLocation" + reqServiceType, cargoItemToUpdate.LoadLocationInfo);
        localStorage.setItem("txtPickUpLocation" + reqServiceType, cargoItemToUpdate.FromCordination);

        localStorage.setItem("pickupLocation" + reqServiceType, cargoItemToUpdate.ServiceLocation);
          if (cargoItemToUpdate.ServiceLocation != null && cargoItemToUpdate.ServiceLocation != "undfined")
    {
        $$("#Pickup_Location").val(cargoItemToUpdate.ServiceLocation);
    }
    }

    $$('input[type="checkbox"]').prop('checked', false);

    $$("#DepartFrom_icon").on("click", function ()
    {
        var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "From");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_From);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_from);
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#googleMap").on("click", function ()
    {
        var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "From");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_From);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_from);
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#Departto_icon").on("click", function ()
    {
        var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "To");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_To);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_To);
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });
    $$("#googleMap2").on("click", function ()
    {
        var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "To");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_To);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_To);
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#btnSaveCargoDataLocations").on('click', function ()
    {
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        var requestBodyLocations =
       {
           LoadLocationInfo: $$("#DepartFrom").val(),
           UnLoadLocationInfo: $$("#Departto").val(),
           ServiceLocation: $$("#Pickup_Location").val(),
           FromCordination: Marker_from,
           ToCordination: Marker_To
       };


        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateCargoReservationDataLocation(requestBodyLocations)

        if (ValidationSucessVal == validationResult)
        {
            if (cargoItemToUpdate)
            {
                $$.each(requestBodyLocations, function (key, value)
                {
                    cargoItemToUpdate[key] = value;
                });
                SaveLocalObject("cargoItemToUpdate", cargoItemToUpdate);
            }
            else
            {
                SaveLocalObject("CargoReservationMapInfo", requestBodyLocations);
            }
            mainView.router.load({ url: 'CargoRequestItemsList.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
        //var requestBodyLocations =
        //{
        //    DirectionFrom: $$("#DepartFrom").val(),
        //    DirectionTo: $$("#Departto").val(),
        //    DirectionLocation: $$("#Pickup_Location").val(),
        //    FromCordination: Marker_from,
        //    ToCordination: Marker_To
        //}
        //r_Location: $$("#Customer_Location").val();

        //$$('.validate').removeClass("Validation-error");
        //var validationResult = ValidateCargoReservationDataLocation(requestBodyLocations)

        //if (ValidationSucessVal == validationResult)
        //{
        //    SaveLocalObject("CargoReservationMapInfo", requestBodyLocations);
        //    mainView.router.load({ url: 'CargoRequestItemsList.html' });
        //}
        //else
        //{
        //    var redLinks = $$('.validate').filter(function (index, el)
        //    {
        //        return $$(this).attr('data-validation') == validationResult;
        //    });

        //    redLinks.addClass("Validation-error");
        //    // display error message
        //    myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
        //    $$(".modal-button-bold").text(GetResourceText('OkText'));
        //}
    })
});

myApp.onPageAfterAnimation('CargoReservationDataLocation', function (page)
{
    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    var reqServiceType = "Cargo";
    localStorage.setItem("reqServiceType", reqServiceType);
    var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
    var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
    var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
    var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

//    var ServiceLocation = localStorage.getItem("pickupLocation" + reqServiceType);
    //    myApp.alert(JSON.stringify(Marker_from) + "name of " + location_From);
    //    myApp.alert(JSON.stringify(Marker_To) + "name of " + location_To);

//    if (ServiceLocation != null && ServiceLocation != "undfined")
//    {
//        $$("#Pickup_Location").val(ServiceLocation);
//    }

    if (location_To != null && location_To != "undefined")
    {
        // $$("#DepartFrom").val()
        document.getElementById("Departto").value = location_To;
        var mapProp2 = {
            center: getLatLngFromString(Marker_To),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: false
        };

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);
    }

    if (location_From != null && location_From != "undefined")
    {
        // $$("#DepartFrom").val()
        document.getElementById("DepartFrom").value = location_From;
        //google.maps.event.addDomListener(window, 'load', initialize);
        window.onload = loadScript;

        var mapProp = {
            center: getLatLngFromString(Marker_from),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: false
        };


        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        drawMarkers();

    }
    var depart_field = $$("#DepartFrom").val();





    function drawMarkers()
    {

        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        markers = [];


        // myApp.alert("Marker is"+JSON.stringify(Marker_from));
        if (Marker_from != null)
        {
            var marker = new google.maps.Marker({
                position: getLatLngFromString(Marker_from),
                map: map
            });
            markers.push(marker);
        }

        var txtPickUpLocation = localStorage.getItem("txtPickUpLocation");
        if (Marker_To != null && (location_To != null && location_To != "undefined"))
        {
            var marker2 = new google.maps.Marker({
                position: getLatLngFromString(Marker_To),
                map: map2
            });
            markers.push(marker2);
        }
    }
});

/*************************************************/

//************************* CARGO Request ItemsList ************************************//
//Handle user requests List
myApp.onPageInit('CargoRequestItemsList', function (page)
{
    var cargoRequestsList = GetLocalDataObject("cargoRequestsList");
    var pageObject = mainView.activePage;

    if (pageObject.name == 'CargoRequestItemsList')
    {
        if (cargoRequestsList == null)
        {
            // create Cargo req list and add item to it.
            cargoRequestsList = [];
            cargoRequestsList.push(getSavedObject());
        }
        else
        {
            var itemIndex = GetLocalData("cargoItemToUpdateIndex");
            if (itemIndex)
            {
                var updateIndex = Number(itemIndex);
                if (updateIndex >= 0 && updateIndex <= cargoRequestsList.length - 1)
                {
                    cargoRequestsList[updateIndex] = getSavedObject();
                }
                else
                {
                    cargoRequestsList.push(getSavedObject());
                }
            }
            else
            {
                cargoRequestsList.push(getSavedObject());
            }

        }

    }


    //save the Cargo request list to the storage 
    SaveLocalObject("cargoRequestsList", cargoRequestsList);

    function getSavedObject()
    {
        var cargoItemToUpdate = GetLocalDataObject("cargoItemToUpdate");
        if (cargoItemToUpdate)
        {
            return cargoItemToUpdate;
        }
        else
        {
            var cargoDataObjData = GetLocalDataObject("cargoDataObjData");
            var cargoLocationData = GetLocalDataObject("CargoReservationMapInfo");

            var Data =
            {
                FromCity: cargoDataObjData.FromCity,
                ToCity: cargoDataObjData.ToCity,
                Direction: cargoDataObjData.Direction,
                TruckType: cargoDataObjData.TruckType,
                TruckNo: cargoDataObjData.TruckNo,
                RequestDate: cargoDataObjData.RequestDate,
                ItemType: cargoDataObjData.ItemType,
                LoadLocationInfo: cargoLocationData.LoadLocationInfo,
                UnLoadLocationInfo: cargoLocationData.UnLoadLocationInfo,
                ServiceLocation: cargoLocationData.ServiceLocation,
                ServiceType: cargoDataObjData.ServiceType,
                FromCordination: cargoLocationData.FromCordination.replace("(", "").replace(")", ""),
                ToCordination: cargoLocationData.ToCordination.replace("(", "").replace(")", "")
            };

            return Data;
        }
    }

    // draw the list
    DrawUiList();
    function DrawUiList()
    {
        var deleteItem = "";
        if (cargoRequestsList.length > 1)
        {
            deleteItem = '<a href="#" class="deleteBtn swipeout-deleteBtn " >' + GetResourceText("Delete") + '</a>';
        }
        var itemListHtml = "";
        $$.each(cargoRequestsList, function (key, value)
        {
            var li = '<li class="swipeout">' +
                       '<div class="swipeout-content item-content">' +
                          '<img src="img/SettingIcon.png" style="width:18px" />' +
                               '<div> &nbsp;' + value.RequestDate + ' &nbsp;</div>' +
                               '</div>' +
                           '<div class="swipeout-actions-' + GetResourceText("Swiper_direction") + '" data-index="' + key + '">' +
                           '<a href="#" class="edit mark bg-orange">' + GetResourceText("Edit") + '</a>' +
                      deleteItem +
                       '</div>' +
                    '</li>';
            itemListHtml += li;
        });

        $$("#ItemsListContainer").html(itemListHtml);
    }

    // update click action.
    $$("#ItemsListContainer").on("click", ".edit", function ()
    {
        var changeIndex = $$(this).parent().data("index");
        var itemToUpdate = cargoRequestsList[Number(changeIndex)];
        SaveLocalData("cargoItemToUpdateIndex", changeIndex);
        SaveLocalObject("cargoItemToUpdate", itemToUpdate);
        mainView.router.load({ url: 'CargoReservationData.html' });
    });


    // Delete click action.
    $$("#ItemsListContainer").on("click", ".deleteBtn", function ()
    {
        var deleteIndex = $$(this).parent().data("index");


        myApp.modal({
            title: GetResourceText("alert"),
            text: GetResourceText("DeleteConfirm"),
            buttons: [
              {
                  text: GetResourceText("OkText"),
                  onClick: function ()
                  {
                      cargoRequestsList.splice(deleteIndex, 1);
                      SaveLocalObject("cargoRequestsList", cargoRequestsList);
                      DrawUiList();
                  }
              },
              {
                  text: GetResourceText("Cnl_btn"),
                  onClick: function ()
                  {
                      DrawUiList();
                  }
              }
            ]
        })

    });

    //    // delete click action
    //    $$('.swipeout').on('deleted', function ()
    //    {
    //        // delete the storage and reset the index storage
    //        DeleteLocalData("cargoItemToUpdate");
    //        SaveLocalData("cargoItemToUpdateIndex", "-1");
    //        var deleteIndex = $$(this).parent().data("index");
    //        cargoRequestsList.splice(deleteIndex, 1);
    //        SaveLocalObject("cargoRequestsList", cargoRequestsList);
    //        DrawUiList();
    //    });

    $$("#ItemsListContainer").on("click", "li", function ()
    {
        myApp.swipeoutOpen($$(this));
    });

    // add more services. 
    $$("#AddMore").click(function ()
    {
        // delete the storage and reset the index storage
        DeleteLocalData("cargoItemToUpdate");
        DeleteLocalData("cargoDataObjData");
        SaveLocalData("cargoItemToUpdateIndex", "-1");
        mainView.router.load({ url: 'CargoReservationData.html' });
    });

    // Complete the request. 
    $$("#Continue").click(function ()
    {
        mainView.router.load({ url: 'CargoReservationRequest.html' });
    });

});
//************************************************************//

/*******************************Cargo ***************************/
myApp.onPageInit('CargoReservationRequest', function (page)
{
    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    });

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    var pre = GetLocalDataObject("storedprofile");

    if (pre != null)
    {
        //alert(JSON.stringify(pre));
        var ZipCod = pre.MobileNumber.substr(0, 3);

        var MobileNumber8D = pre.MobileNumber.substring(3);
        pre.MobileNumber = MobileNumber8D;

        //alert(JSON.stringify(formData));

        myApp.formFromJSON('#Fill_UP_Cargo', pre);
        myApp.formFromJSON('#Fill_Up_Form_Authoraized', pre);
        // myApp.formFromJSON('#other-form', pre);
    }



    $$("#txtCountryCode").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('#countriesAr');
        }
        else
        {
            myApp.smartSelectOpen('#countriesEn');
        }
    });
    $$("#SmartSelectValuepickEn").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode").val($$("#countriesSelect").val());
    });

    $$("#SmartSelectValuepick").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode").val($$("#countriesSelectAr").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr").val(reservationContactInfo.telCode);
        $$("#countriesSelect").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode").val("966");
    }
    else
    {
        $$("#countriesSelectAr").val("966");
        $$("#countriesSelect").val("966");
        $$("#txtCountryCode").val("966");
    }
    // Validate data and continue to next screen.
    $$('#btnGoToCargoDetails').click(function ()
    {
        //mainView.router.load({ url: 'CargoReservationData.html' });
        // Fill cargo request data
        // TODO: mobile number to add code


        var CargoRequestDetailes = GetLocalDataObject("cargoRequestsList");
        var cargoReqObjData =
                {
                    CustomerName: $$('#passengerName').val(),
                    CustomerMobileNo: $$("#txtCountryCode").val() + $$('#txtPhoneNUmber').val(),
                    CustomerEmail: $$('#txtEmailAddress').val(),
                    ChannelCode: "005",
                    CargoRequestDetailes: CargoRequestDetailes
                };

        // validate data.

        $$('.validate').removeClass("Validation-error");
        var validationResult = validateCargoRequest(cargoReqObjData);
        if (ValidationSucessVal == validationResult)
        {
            // save form data, and move to next screen
            SaveLocalObject('cargoReqObjData' + GetServiceLanguage(), cargoReqObjData);

            PostCrago(cargoReqObjData);
            /*post********/
            // mainView.router.load({ url: 'CargoReservationData.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }

    });


    function PostCrago(cargoReqObjData)
    {



        var jsonBody = JSON.stringify(cargoReqObjData);
        //myApp.alert(jsonBody);
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Forms/Cargo/Request";
        $$.ajax(
        {
            method: "POST",
            url: urlAjax,
            contentType: 'application/json',
            data: jsonBody,
            dataType: "json",
            headers:
            {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },
            success: function (data, status, xhr)
            {
                myApp.hidePreloader();
                mainView.router.load({ url: 'CargoSucess.html' });
            },
            error: function ()
            {
                myApp.hidePreloader();
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
            }
        });

    }

});

myApp.onPageInit('CargoSucess', function (page)
{
    $$("#gohome").click(function ()
    {
        mainView.router.load({ url: 'Home.html' });
    });
});
