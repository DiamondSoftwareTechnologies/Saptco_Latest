/******************************CNC Code *************************/
myApp.onPageInit('Home', function (page) {
    $$("#goToBusRent").on("click", function () {
        DeleteLocalData("CCRequestsList");
        DeleteLocalData("CCItemToUpdateIndex");
        DeleteLocalData("CCItemToUpdate");
    });
});


/************************ Rent Bus Details ***************************/
myApp.onPageInit('Rent_Bus_Details', function (page) {
    //change select style
    //$$("body").on("open", ".picker-modal", function ()
    //{
    //    $$(this).find(".toolbar").addClass("CandCToolbarStyle");
    //});

    $$(".div_click").on("click", function () {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function () {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function () {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    var all_forms = {};
    var RequestDateTime;
    var formData;
    var Locallly;
    var result = {};
    savedResults = localStorage.getItem("results");
    if (savedResults) {
        result = savedResults;
    }


    FillSalesOffices();

    function FillSalesOffices() {
        var salesOffices = GetLocalDataObject("salesOffices" + GetServiceLanguage());
        if (salesOffices == null) {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/CNC/SalesOffices",
                method: "Get",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },
                success: function (data, xhr, param) {
                    myApp.hidePreloader();
                    var salesOffices = JSON.parse(data);
                    // save returned object
                    SaveLocalObject("salesOffices" + GetServiceLanguage(), salesOffices);
                    var options = '';
                    var selected = "";

                    if (salesOffices.length == 1) {
                        selected = "selected";
                    }

                    for (var x = 0; x < salesOffices.length; x++) {
                        options += '<option ' + selected + 'value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                        '</option>';
                    }
                    myApp.smartSelectAddOption('.selectSalesOffice', options);
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else {
            var options = '';
            var selected = "";

            if (salesOffices.length == 1) {
                selected = "selected";
            }

            for (var x = 0; x < salesOffices.length; x++) {
                options += '<option ' + selected + ' value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                '</option>';
            }
            myApp.smartSelectAddOption('.selectSalesOffice', options);

            //resave the values from server
            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/CNC/SalesOffices",
                method: "Get",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },
                success: function (data, xhr, param) {
                    var salesOffices = JSON.parse(data);
                    // save returned object
                    SaveLocalObject("salesOffices" + GetServiceLanguage(), salesOffices);

                },
                error: function (xhr, status) {
                }
            });
        }
    }

    // Get buses types from server 
    GetBusTypes();

    function GetBusTypes() {
        //check in case the value was available in local storage, if not then retrive the data from server. 
        var BusTypesCollection = GetLocalDataObject("BusTypesCollection" + GetServiceLanguage());

        if (BusTypesCollection == null) {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/CNC/BusTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var BusTypesCollection = JSON.parse(data);
                        SaveLocalObject("BusTypesCollection" + GetServiceLanguage(), BusTypesCollection);
                        var options = '';

                        var selected = "";

                        if (BusTypesCollection.length == 1) {
                            selected = "selected";
                        }
                        for (var x = 0; x < BusTypesCollection.length; x++) {
                            options += '<option ' + selected + ' value="' + BusTypesCollection[x].Id + '">' + BusTypesCollection[x].LocalizedName +
                                '</option>';
                        }

                        myApp.smartSelectAddOption('.selectBus_Type', options);
                    },
                    error: function (xhr, status) {
                        myApp.hidePreloader();
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }
                });
        }
        else {
            var options = '';
            var selected = "";

            if (BusTypesCollection.length == 1) {
                selected = "selected";
            }
            for (var x = 0; x < BusTypesCollection.length; x++) {
                options += '<option ' + selected + ' value="' + BusTypesCollection[x].Id + '">' + BusTypesCollection[x].LocalizedName +
                    '</option>';
            }

            myApp.smartSelectAddOption('.selectBus_Type', options);

            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/CNC/BusTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        var BusTypesCollection = JSON.parse(data);
                        SaveLocalObject("BusTypesCollection" + GetServiceLanguage(), BusTypesCollection);

                    },
                    error: function (xhr, status) {
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
        dateFormat: 'yyyy-mm-dd',
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
        onOpen: function (p) {
            calendarDateFormatDepart.params.maxDate = _maxdate;
            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");

            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        }
    });


    $$("body").on("click", ".picker-calendar-day",
        function () {
            if (this.className.indexOf("disabled") == -1) {
                calendarDateFormatDepart.close();
            }
        });

    var calendarCloseButton = GetResourceText("Agree");

    // create time picker 
    var today = new Date();

    var pickerInline = myApp.picker({
        input: '#picker-date',
        //dateFormat: 'yyyy-MM-ddTHH:mm:ss',
        closeOnSelect: true,
        toolbar: true,
        toolbarCloseText: calendarCloseButton,
        //    container: '#picker-date-container',
        //    toolbar: false,
        rotateEffect: true,


        //(today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth()), today.getDate(), today.getFullYear(),
        value: ["10", "00"],

        //         onChange: function (picker, values, displayValues) {
        //             
        //             
        //        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
        //        if (values[1] > daysInMonth) {
        //            picker.cols[1].setValue(daysInMonth);
        //        }
        //    },

        formatValue: function (p, values, displayValues) {
            return values[0] + ':' + values[1] + ':00';
            //yyyy-MM-ddTHH:mm:ss
        },

        cols: [
//            
            // Hours
            {
                values: (function () {
                    var arr = [];
                    for (var i = 10; i <= 23; i++) {
                        arr.push(i < 10 ? '0' + i : i);
                    }
                    return arr;
                })(),
            },
            // Divider
            {
                divider: true,
                content: ':'
            },
            // Minutes
            {
                values: (function () {
                    var arr = ('00 05 10 15 20 25 30 35 40 45 50 55').split(' ');

                    return arr;
                })(),
            }
        ]
    });


    // create calendar instances
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();

    var today = new Date().setDate(currentDate.getDate());
    var _maxdate = new Date().setDate(currentDate.getDate() + 90);

    var CCItemToUpdate = GetLocalDataObject("CCItemToUpdate");

    if (CCItemToUpdate) {
        $$("#BusType").val(CCItemToUpdate.BusType);
        // set the selected list item text 
        $$(".BusTypeTextValue").text(getSmartSelectText("#BusType"));

        $$("#BusCount").val(CCItemToUpdate.BusCount);
        $$("#SalesOffice").val(CCItemToUpdate.SalesOffice);

        // set the selected list item text  
        $$(".salesOfficeTextValue").text(getSmartSelectText("#SalesOffice"));

        $$("#calendar-date-depart").val(CCItemToUpdate.RequestDate);
        $$("#calendar-date-depart").val(CCItemToUpdate.RequestDateTime.split("T")[0]);
        $$('.RequestDateTime').val(CCItemToUpdate.RequestDateTime.split("T")[1]);
    }
    else if (GetLocalDataObject("detailsData")) {
        CCItemToUpdate = GetLocalDataObject("detailsData")
        $$("#BusType").val(CCItemToUpdate.BusType);
        // set the selected list item text 
        $$(".BusTypeTextValue").text(getSmartSelectText("#BusType"));

        $$("#BusCount").val(CCItemToUpdate.BusCount);
        $$("#SalesOffice").val(CCItemToUpdate.SalesOffice);

        // set the selected list item text  
        $$(".salesOfficeTextValue").text(getSmartSelectText("#SalesOffice"));

        $$("#calendar-date-depart").val(CCItemToUpdate.RequestDate);
        $$("#calendar-date-depart").val(CCItemToUpdate.RequestDateTime.split("T")[0]);
        $$('.RequestDateTime').val(CCItemToUpdate.RequestDateTime.split("T")[1]);
    }

    function getSmartSelectText(smartSelectSelector) {
        var options = $$(smartSelectSelector).find("option");
        var queryResult = JSLINQ(options).Where(function (item) {
            return item.selected == true;
        });

        if (queryResult.items.length > 0) {
            return queryResult.items[0].text;
        }
        else {
            return "";
        }
    }

    // collect data from form and post form data
    $$('.form-to-json').on('click', function () {
        formData = myApp.formToJSON('#Rent_Detalies');

        //all_forms = JSON.parse(result);
        for (var key in formData) {
            all_forms[key] = formData[key];
        }

        var Details_Form =
            {
                BusType: $$("#BusType").val(),
                BusCount: $$("#BusCount").val(),
                SalesOffice: $$("#SalesOffice").val(),
                RequestDate: $$("#calendar-date-depart").val(),
                RequestDateTime: ($$("#calendar-date-depart").val() + "T" + $$('.RequestDateTime').val())
            }

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidatDetails(Details_Form);
        if (validationResult == ValidationSucessVal) {
            if (CCItemToUpdate) {
                $$.each(Details_Form, function (key, value) {
                    CCItemToUpdate[key] = value;
                });
                SaveLocalObject("CCItemToUpdate", CCItemToUpdate);
            }
            else {
                SaveLocalObject("detailsData", Details_Form);
            }
            mainView.router.load({url: 'Rent_bus_Location.html'});
        }
        else {
            var redLinks = $$('.validate').filter(function (index, el) {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });

});

//********************Start of rent bus Data Locations  ***********************//
myApp.onPageInit('Rent_bus_Location', function (page) {

    $$(".div_click").on("click", function () {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function () {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function () {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    var reqServiceType = "Bus";
    $$('input[type="checkbox"]').prop('checked', false);

    $$("#DepartFrom_icon").on("click", function () {
        var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "From");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_From);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_from);
        mainView.router.load({url: 'MapLocationSelect.html'});
    });

    $$("#googleMap").on("click", function () {
        var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "From");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_From);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_from);
        mainView.router.load({url: 'MapLocationSelect.html'});
    });

    $$("#Departto_icon").on("click", function () {
        var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "To");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_To);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_To);
        mainView.router.load({url: 'MapLocationSelect.html'});
    });
    $$("#googleMap2").on("click", function () {
        var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        localStorage.setItem("updatelocationfield", "To");
        localStorage.setItem("CenterSelectLocation" + reqServiceType, location_To);
        localStorage.setItem("CenterSelectLocationCord" + reqServiceType, Marker_To);
        mainView.router.load({url: 'MapLocationSelect.html'});
    });

    // check in case the the state is update
    var CCItemToUpdate = GetLocalDataObject("CCItemToUpdate");
    if (CCItemToUpdate) {

        localStorage.setItem("txtValuePickUpLocation" + reqServiceType, CCItemToUpdate.DirectionFrom);
        localStorage.setItem("txtPickUpLocation" + reqServiceType, CCItemToUpdate.FromCordination);// cordinates 
        localStorage.setItem("txtValueDistLocation" + reqServiceType, CCItemToUpdate.DirectionTo);
        localStorage.setItem("txtDistLocation" + reqServiceType, CCItemToUpdate.ToCordination);// cordinates 
        localStorage.setItem("pickupLocation" + reqServiceType, CCItemToUpdate.ServiceLocation);
    }

    $$("#btnSaveDataLocations").on('click', function () {
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        var requestBodyLocations =
            {
                DirectionFrom: $$("#DepartFrom").val(),
                DirectionTo: $$("#Departto").val(),
                ServiceLocation: $$("#Pickup_Location").val(),
                FromCordination: Marker_from,
                ToCordination: Marker_To
            }
        //r_Location: $$("#Customer_Location").val();

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateCandCLocationInfo(requestBodyLocations)

        if (ValidationSucessVal == validationResult) {
            if (CCItemToUpdate) {
                $$.each(requestBodyLocations, function (key, value) {
                    CCItemToUpdate[key] = value;
                });
                SaveLocalObject("CCItemToUpdate", CCItemToUpdate);
            }
            else {
                SaveLocalObject("CandCReservationMapInfo", requestBodyLocations);
            }
            mainView.router.load({url: 'CCRequestItemsList.html'});
        }
        else {
            var redLinks = $$('.validate').filter(function (index, el) {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    })
});

myApp.onPageAfterAnimation('Rent_bus_Location', function (page) {

    $$(".div_click").on("click", function () {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function () {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function () {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    var reqServiceType = "Bus";
    localStorage.setItem("reqServiceType", reqServiceType);

    var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
    var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
    var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
    var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);
    var pickupLocation = localStorage.getItem("pickupLocation" + reqServiceType);

    if (pickupLocation) {
        $$("#Pickup_Location").val(pickupLocation);
    }

    if (location_To != null && location_To != "undefined") {
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

    if (location_From != null && location_From != "undefined") {
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

    function drawMarkers() {

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];


        // myApp.alert("Marker is"+JSON.stringify(Marker_from));
        if (Marker_from != null) {
            var marker = new google.maps.Marker({
                position: getLatLngFromString(Marker_from),
                map: map
            });
            markers.push(marker);
        }

        var txtPickUpLocation = localStorage.getItem("txtPickUpLocation");
        if (Marker_To != null && (location_To != null && location_To != "undefined")) {
            var marker2 = new google.maps.Marker({
                position: getLatLngFromString(Marker_To),
                map: map2
            });
            markers.push(marker2);
        }
    }
});

//************************ End OF Rent Bus Detais ***************************//
//************************* CC Request ItemsList ************************************//
//Handle user requests List
myApp.onPageInit('CCRequestItemsList', function (page) {
    var CCRequestsList = GetLocalDataObject("CCRequestsList");
    var pageObject = mainView.activePage;
    if (pageObject.name == 'CCRequestItemsList') {
        if (CCRequestsList == null) {
            // create CC req list and add item to it.
            CCRequestsList = [];
            CCRequestsList.push(getSavedObject());
        }
        else {
            var itemIndex = GetLocalData("CCItemToUpdateIndex");
            if (itemIndex) {
                var updateIndex = Number(itemIndex);
                if (updateIndex >= 0 && updateIndex <= CCRequestsList.length - 1) {
                    CCRequestsList[updateIndex] = getSavedObject();
                }
                else {
                    CCRequestsList.push(getSavedObject());
                }
            }
            else {
                CCRequestsList.push(getSavedObject());
            }

        }
    }


    //save the CC request list to the storage
    SaveLocalObject("CCRequestsList", CCRequestsList);

    function getSavedObject() {

        var CCItemToUpdate = GetLocalDataObject("CCItemToUpdate");
        if (CCItemToUpdate) {
            return CCItemToUpdate;
        }
        else {
            var BusData = GetLocalDataObject("detailsData");
            var BusLocationData = GetLocalDataObject("CandCReservationMapInfo");

            var Data =
                {
                    BusType: BusData.BusType,
                    BusCount: BusData.BusCount,
                    SalesOffice: BusData.SalesOffice,
                    RequestDateTime: BusData.RequestDateTime,
                    DirectionFrom: BusLocationData.DirectionFrom,
                    DirectionTo: BusLocationData.DirectionTo,
                    ServiceLocation: BusLocationData.ServiceLocation,
                    FromCordination: BusLocationData.FromCordination.replace("(", "").replace(")", ""),
                    ToCordination: BusLocationData.ToCordination.replace("(", "").replace(")", "")
                }

            return Data;
        }
    }

    // draw the list
    DrawUiList();

    function DrawUiList() {
        var deleteItem = "";
        if (CCRequestsList.length > 1) {
            deleteItem = '<a href="#" class="deleteBtn swipeout-deleteBtn " >' + GetResourceText("Delete") + '</a>';
        }

        var itemListHtml = "";
        $$.each(CCRequestsList, function (key, value) {
            var li = '<li class="swipeout">' +
                '<div class="swipeout-content item-content">' +
                '<img src="img/SettingIcon.png" style="width:18px" />' +
                '<div>  &nbsp;' + value.RequestDateTime.replace("T", "-") + ' &nbsp; </div>' +
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
    $$("#ItemsListContainer").on("click", ".edit", function () {
        var changeIndex = $$(this).parent().data("index");
        var itemToUpdate = CCRequestsList[Number(changeIndex)];
        SaveLocalData("CCItemToUpdateIndex", changeIndex);
        SaveLocalObject("CCItemToUpdate", itemToUpdate);
        mainView.router.load({url: 'Rent_Bus_Details.html'});
    });


    // Delete click action.
    $$("#ItemsListContainer").on("click", ".deleteBtn", function () {
        var deleteIndex = $$(this).parent().data("index");

        myApp.modal({
            title: GetResourceText("alert"),
            text: GetResourceText("DeleteConfirm"),
            buttons: [
                {
                    text: GetResourceText("OkText"),
                    onClick: function () {
                        CCRequestsList.splice(deleteIndex, 1);
                        SaveLocalObject("CCRequestsList", CCRequestsList);
                        DrawUiList();
                    }
                },
                {
                    text: GetResourceText("Cnl_btn"),
                    onClick: function () {
                        DrawUiList();
                    }
                }
            ]
        })


    });


    $$("#ItemsListContainer").on("click", "li", function () {
        myApp.swipeoutOpen($$(this));
    });

    // add more services. 
    $$("#AddMore").click(function () {
        // delete the storage and reset the index storage
        DeleteLocalData("CCItemToUpdate");
        DeleteLocalData("detailsData");
        SaveLocalData("CCItemToUpdateIndex", "-1");
        mainView.router.load({url: 'Rent_Bus_Details.html'});
    });

    // Complete the request. 
    $$("#Continue").click(function () {
        DeleteLocalData("CCItemToUpdateIndex");
        DeleteLocalData("CCItemToUpdate");
        mainView.router.load({url: 'Rent_Bus_home.html'});
    });

});
//*
/***************** C & C personal information **************/
myApp.onPageInit('Rent_Bus_home', function (page) {
    var pre = GetLocalDataObject("storedprofile");

    if (pre != null) {

        var ZipCod = pre.MobileNumber.substr(0, 3);

        var MobileNumber8D = pre.MobileNumber.substring(3);
        pre.MobileNumber = MobileNumber8D;

        //alert(JSON.stringify(formData));

        myApp.formFromJSON('#Countinue_Form_Personal', pre);
        myApp.formFromJSON('#Countinue_Form_Comapany', pre);
        // myApp.formFromJSON('#other-form', pre);
    }
    else {
    }

    $$(".div_click").on("click", function () {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function () {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function () {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    $$("#txtCountryCode_pe").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr_pe');
        }
        else {
            myApp.smartSelectOpen('#countriesEn_pe');
        }
    });
    $$("#SmartSelectValuepickEn_pe").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_pe").val($$("#countriesSelect_pe").val());
    });

    $$("#SmartSelectValuepick_pe").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_pe").val($$("#countriesSelectAr_pe").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick_pe").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn_pe").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr_pe").val(reservationContactInfo.telCode);
        $$("#countriesSelect_pe").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode_pe").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode_pe").val("966");
    }
    else {
        $$("#countriesSelectAr_pe").val("966");
        $$("#countriesSelect_pe").val("966");
        $$("#txtCountryCode_pe").val("966");
    }
    //fax personal
    $$("#txtCountryCode_fx").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr_fx');
        }
        else {
            myApp.smartSelectOpen('#countriesEn_fx');
        }
    });
    $$("#SmartSelectValuepickEn_fx").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_fx").val($$("#countriesSelect_fx").val());
    });

    $$("#SmartSelectValuepick_fx").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_fx").val($$("#countriesSelectAr_fx").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick_fx").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn_fx").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr_fx").val(reservationContactInfo.telCode);
        $$("#countriesSelect_fx").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode_fx").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode_fx").val("966");
    }
    else {
        $$("#countriesSelectAr_fx").val("966");
        $$("#countriesSelect_fx").val("966");
        $$("#txtCountryCode_fx").val("966");
    }
    //phon com
    $$("#txtCountryCode_cph").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr_cph');
        }
        else {
            myApp.smartSelectOpen('#countriesEn_cph');
        }
    });
    $$("#SmartSelectValuepickEn_cph").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_cph").val($$("#countriesSelect_cph").val());
    });

    $$("#SmartSelectValuepick_cph").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_cph").val($$("#countriesSelectAr_cph").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick_cph").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn_cph").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr_cph").val(reservationContactInfo.telCode);
        $$("#countriesSelect_cph").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode_cph").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode_cph").val("966");
    }
    else {
        $$("#countriesSelectAr_cph").val("966");
        $$("#countriesSelect_cph").val("966");
        $$("#txtCountryCode_cph").val("966");
    }

    //fax com
    $$("#txtCountryCode_cfx").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr_cfx');
        }
        else {
            myApp.smartSelectOpen('#countriesEn_cfx');
        }
    });
    $$("#SmartSelectValuepickEn_cfx").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_cfx").val($$("#countriesSelect_cfx").val());
    });

    $$("#SmartSelectValuepick_cfx").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_cfx").val($$("#countriesSelectAr_cfx").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick_cfx").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn_cfx").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr_cfx").val(reservationContactInfo.telCode);
        $$("#countriesSelect_cfx").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode_cfx").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode_cfx").val("966");
    }
    else {
        $$("#countriesSelectAr_cfx").val("966");
        $$("#countriesSelect_cfx").val("966");
        $$("#txtCountryCode_cfx").val("966");
    }
    //ppe com
    $$("#txtCountryCode_CPP").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr_CPP');
        }
        else {
            myApp.smartSelectOpen('#countriesEn_CPP');
        }
    });
    $$("#SmartSelectValuepickEn_CPP").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_CPP").val($$("#countriesSelect_CPP").val());
    });

    $$("#SmartSelectValuepick_CPP").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_CPP").val($$("#countriesSelectAr_CPP").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick_CPP").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn_CPP").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr_CPP").val(reservationContactInfo.telCode);
        $$("#countriesSelect_CPP").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode_CPP").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode_CPP").val("966");
    }
    else {
        $$("#countriesSelectAr_CPP").val("966");
        $$("#countriesSelect_CPP").val("966");
        $$("#txtCountryCode_CPP").val("966");
    }

    $$('#btnPersone').on('click', function () {
        $$(".PassengerDetalies").show();
        $$(".ComapniesDetalies").hide();

        setOnewayView();
    });

    function setOnewayView() {
        $$('#btnPersone').removeClass("not-selected-tab");
        $$('#btnPersone').addClass("selected-tab");
        $$('#btnCompanies').removeClass("selected-tab");
        $$('#btnCompanies').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "0.3");
    }

    $$('#btnCompanies').on('click', function () {

        $$(".PassengerDetalies").hide();
        $$(".ComapniesDetalies").show();
        SetCompanyView();
    });

    function SetCompanyView() {
        $$('#btnCompanies').removeClass("not-selected-tab");
        $$('#btnCompanies').addClass("selected-tab");
        $$('#btnPersone').removeClass("selected-tab");
        $$('#btnPersone').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "1");
    }

    //prepare form data.
    var Locally_1 = [];
    var Locally_2 = [];
    var formData_1;
    var formData_2;
    var result = {};

    var All_Local = [];
    $$('.Countinue_Form_Personal').on('click', function () {
        formData_1 = myApp.formToJSON('#PassengerDetalies');

        localStorage.setItem("Personally", JSON.stringify(formData_1));

        Locally_1 = localStorage.getItem("Personally");

        for (var key in formData_1) {
            result[key] = formData_1[key];
        }

        var CNCRequestDetailes = GetLocalDataObject("CCRequestsList");
        localStorage.setItem("results", JSON.stringify(result));

        var Personal_Form =
            {
                RequestType: $$("#btnPersonelbl").val(),
                CustomerName: $$('#CustomerName').val(),
                CustomerMobileNo: $$('#txtCountryCode_pe').val() + $$('#CustomerMobileNo').val(),
                CustomerEmail: $$('#CustomerEmail').val(),
                CompanyName: "NA",
                CompanyPhone: "NA",
                CompanyFaxNo: "NA",
                ChannelCode: "005",
                CNCRequestDetailes: CNCRequestDetailes
            }


        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidatePersonal(Personal_Form);
        if (validationResult == ValidationSucessVal) {
            SaveLocalData("Personal_form_Data" + GetServiceLanguage(), Personal_Form);


            myApp.showPreloader(GetResourceText("Loading"));
            var dataString = JSON.stringify(Personal_Form);
            //alert(dataString);
            $$.ajax({
                method: "POST",
                url: "https://mobile.saptco.com.sa/Forms/CNC/Request",
                contentType: 'application/json',
                data: dataString,
                dataType: "json",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },

                success: function (data, status, xhr) {
                    myApp.hidePreloader();
                    mainView.router.load({url: 'BusSucess.html'});
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText("errorNotAbleRentBus"), GetResourceText('alert'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });

            // mainView.router.load({ url: 'Rent_Bus_Details.html' });

        }
        else {
            var redLinks = $$('.validate').filter(function (index, el) {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }


    });
    $$('.Continue_Form_Comapany').on('click', function () {
        formData_2 = myApp.formToJSON('#ComapniesDetalies');
        localStorage.setItem("Company", JSON.stringify(formData_2));
        Locally_2 = localStorage.getItem("Company");
        for (var key in formData_2) {
            result[key] = formData_2[key];
        }
        var CNCRequestDetailes = GetLocalDataObject("CCRequestsList");
        localStorage.setItem("results", JSON.stringify(result));
        var Company_Form =
            {
                RequestType: $$("#btnCompanieslbl").val(),
                CompanyName: $$('#CompanyName').val(),
                CompanyPhone: $$('#txtCountryCode_cph').val() + $$('#CompanyPhone').val(),
                CompanyFaxNo: $$('#txtCountryCode_cfx').val() + $$('#CompanyFaxNo').val(),
                CustomerName: $$("#passengerName").val(),
                CustomerMobileNo: $$("#txtCountryCode_CPP").val() + $$("#passengerPhone").val(),
                CustomerEmail: $$("#PassengerEmailAddress").val(),
                ChannelCode: "005",
                CNCRequestDetailes: CNCRequestDetailes

            }

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateCompany(Company_Form);
        if (validationResult == ValidationSucessVal) {
            SaveLocalData("Company_form_Data" + GetServiceLanguage(), Company_Form);
            //PostBus(Company_Form); 


            myApp.showPreloader(GetResourceText("Loading"));
            var dataString = JSON.stringify(Company_Form);
            //alert(dataString);
            $$.ajax({
                method: "POST",
                url: "https://mobile.saptco.com.sa/Forms/CNC/Request",
                contentType: 'application/json',
                data: dataString,
                dataType: "json",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },

                success: function (data, status, xhr) {
                    myApp.hidePreloader();
                    mainView.router.load({url: 'BusSucess.html'});
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText("errorNotAbleRentBus"), GetResourceText('alert'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });


            //            mainView.router.load({ url: 'Rent_Bus_Details.html' });

        }
        else {
            var redLinks = $$('.validate').filter(function (index, el) {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }

        //ValidationCompany();
        //mainView.router.load({ url: 'Rent_Bus_Details.html' });
    });

    FillRequestType();

    function FillRequestType() {
        var RequestTypes = GetLocalDataObject("RequestTypes" + GetServiceLanguage());
        if (RequestTypes == null) {
            myApp.showPreloader(GetResourceText("Loading"));
            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/CNC/RequestTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var RequestTypes = JSON.parse(data);
                        SaveLocalObject("RequestTypes" + GetServiceLanguage(), RequestTypes);
                        document.getElementById('btnPersonelbl').value = RequestTypes[0].Id;
                        document.getElementById('btnCompanieslbl').value = RequestTypes[1].Id;
                    },
                    error: function (xhr, status) {
                        myApp.hidePreloader();
                        myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    }
                });

        }
        else {
            document.getElementById('btnPersonelbl').value = RequestTypes[0].Id;
            document.getElementById('btnCompanieslbl').value = RequestTypes[1].Id;
        }

    }

    FillSalesOffices();

    function FillSalesOffices() {
        var salesOffices = GetLocalDataObject("salesOffices" + GetServiceLanguage());
        if (salesOffices == null) {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/CNC/SalesOffices",
                method: "Get",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },
                success: function (data, xhr, param) {
                    myApp.hidePreloader();
                    var salesOffices = JSON.parse(data);
                    // save returned object
                    SaveLocalObject("salesOffices" + GetServiceLanguage(), salesOffices);
                    var options = '';
                    var selected = "";
                    if (salesOffices.length == 1) {
                        selected = "selected";
                    }
                    for (var x = 0; x < salesOffices.length; x++) {
                        options += '<option ' + selected + ' value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                        '</option>';
                    }
                    myApp.smartSelectAddOption('.selectSalesOffice', options);
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else {
            var options = '';
            var selected = "";
            if (salesOffices.length == 1) {
                selected = "selected";
            }

            for (var x = 0; x < salesOffices.length; x++) {
                options += '<option ' + selected + ' value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                '</option>';
            }
            myApp.smartSelectAddOption('.selectSalesOffice', options);

            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/CNC/SalesOffices",
                method: "Get",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },
                success: function (data, xhr, param) {
                    var salesOffices = JSON.parse(data);
                    // save returned object
                    SaveLocalObject("salesOffices" + GetServiceLanguage(), salesOffices);

                },
                error: function (xhr, status) {
                }
            });
        }
    }

});
/*******************end of C & C personal info**************************/

myApp.onPageInit('BusSucess', function (page) {
    $$("#gohome").click(function () {
        mainView.router.load({url: 'Home.html'});
    });
});

//************************* End CNC Code *************************//