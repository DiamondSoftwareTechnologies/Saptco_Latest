/***************************Home Limo Click ***********************/
myApp.onPageInit('Home', function (page) {
    $$("#goToLimo").on("click", function () {
        DeleteLocalData("limoRequestsList");
        DeleteLocalData("limoItemToUpdateIndex");
        DeleteLocalData("limoItemToUpdate");
    });
});
/***************************End Home Limo Click *******************/

/***************************** Limo Code **************************/
//Handle creating a new order and updating . 
myApp.onPageInit('LimoReservationData', function (page) {
    ChangeGoogleMapsLanguage();
    //change select style
    $$("body").on("open", ".picker-modal", function () {
        $$(this).find(".toolbar").css("background-color", "#dbc255 !important");
        $$(this).find(".toolbar").find("a").css("color", "#ffffff");
        $$(this).find(".toolbar").css("color", "#ffffff !important");
    });

    $$(".div_click").on("click", function () {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function () {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function () {
            myApp.smartSelectOpen(element);
        }, 300);
    });

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
        closeOnSelect: true,
        toolbar: true,
        toolbarCloseText: calendarCloseButton,
        rotateEffect: true,

        value: ["08", "00"],


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
                    for (var i = 8; i <= 23; i++) {
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

    // intilaize form data from server. 
    GetServiceTypes();
    GetServiceDuration();
    GetPaymentTypes();
    GetCarTypes();
    GetCities();
    //GetLimoCorpContractType();


    // Contract Type ///// 
    function GetLimoCorpContractType() {
        var LimoCorpContractType = GetLocalDataObject("LimoCorpContractType" + GetServiceLanguage());
        if (LimoCorpContractType == null) {
            myApp.showPreloader(GetResourceText("Loading"));
            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/Limo/CorporateContractTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var LimoCorpContractType = JSON.parse(data);

                        SaveLocalObject("LimoCorpContractType" + GetServiceLanguage(), LimoCorpContractType);

                        var options = '';
                        var selected = "";
                        if (LimoCorpContractType.length == 1) {
                            selected = "selected";
                        }

                        for (var x = 0; x < LimoCorpContractType.length; x++) {
                            options += '<option ' + selected + ' value="' + LimoCorpContractType[x].Id + '" >' + LimoCorpContractType[x].LocalizedName +
                                '</option>';
                        }

                        myApp.smartSelectAddOption('.Contract_Type', options);

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
            if (LimoCorpContractType.length == 1) {
                selected = "selected";
            }

            for (var x = 0; x < LimoCorpContractType.length; x++) {
                options += '<option  ' + selected + ' value="' + LimoCorpContractType[x].Id + '">' + LimoCorpContractType[x].LocalizedName +
                    '</option>';
            }

            myApp.smartSelectAddOption('.Contract_Type', options);
        }
    }


    function GetServiceTypes() {
        var LimoServiceTypes = GetLocalDataObject("LimoServiceTypes" + GetServiceLanguage());
        if (LimoServiceTypes == null) {
            myApp.showPreloader(GetResourceText("Loading"));
            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/Limo/ServiceTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var LimoServiceTypes = JSON.parse(data);
                        SaveLocalObject("LimoServiceTypes" + GetServiceLanguage(), LimoServiceTypes);

                        var options = '';
                        var selected = "";
                        if (LimoServiceTypes.length == 1) {
                            selected = "selected";
                        }

                        for (var x = 0; x < LimoServiceTypes.length; x++) {
                            options += '<option  ' + selected + '  value="' + LimoServiceTypes[x].Id + '">' + LimoServiceTypes[x].LocalizedName +
                                '</option>';
                        }

                        myApp.smartSelectAddOption('.servicetype', options);

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
            if (LimoServiceTypes.length == 1) {
                selected = "selected";
            }
            for (var x = 0; x < LimoServiceTypes.length; x++) {
                options += '<option ' + selected + ' value="' + LimoServiceTypes[x].Id + '">' + LimoServiceTypes[x].LocalizedName +
                    '</option>';
            }

            myApp.smartSelectAddOption('.servicetype', options);
        }
    }

    function GetServiceDuration() {
        var LimoServiceDuration = GetLocalDataObject("LimoServiceDuration" + GetServiceLanguage());
        if (LimoServiceDuration == null) {
            myApp.showPreloader(GetResourceText("Loading"));
            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/Limo/ServiceDuration",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var LimoServiceDuration = JSON.parse(data);
                        SaveLocalObject("LimoServiceDuration" + GetServiceLanguage(), LimoServiceDuration);

                        var options = '';

                        for (var x = 0; x < LimoServiceDuration.length; x++) {
                            options += '<option value="' + LimoServiceDuration[x].Id + '">' + LimoServiceDuration[x].LocalizedName +
                                '</option>';
                        }

                        myApp.smartSelectAddOption('.ServiceDuration', options);

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
            for (var x = 0; x < LimoServiceDuration.length; x++) {
                options += '<option value="' + LimoServiceDuration[x].Id + '">' + LimoServiceDuration[x].LocalizedName +
                    '</option>';
            }

            myApp.smartSelectAddOption('.ServiceDuration', options);
        }
    }

    function GetCarTypes() {
        var LimoCarsTypes = GetLocalDataObject("LimoCarsTypes" + GetServiceLanguage());
        if (LimoCarsTypes == null) {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/Limo/CarTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var LimoCarsTypes = JSON.parse(data);
                        SaveLocalObject("LimoCarsTypes" + GetServiceLanguage(), LimoCarsTypes);

                        var options = '';

                        for (var x = 0; x < LimoCarsTypes.length; x++) {
                            options += '<option value="' + LimoCarsTypes[x].Id + '">' + LimoCarsTypes[x].LocalizedName +
                                '</option>';
                        }

                        myApp.smartSelectAddOption('.cars', options);

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
            for (var x = 0; x < LimoCarsTypes.length; x++) {
                options += '<option value="' + LimoCarsTypes[x].Id + '">' + LimoCarsTypes[x].LocalizedName +
                    '</option>';
            }
            myApp.smartSelectAddOption('.cars', options);
        }
    }

    function GetCities() {
        var limoCities = GetLocalDataObject("limoCities" + GetServiceLanguage());
        if (limoCities == null) {

            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/Limo/Cities",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var limoCities = JSON.parse(data);
                        SaveLocalObject("limoCities" + GetServiceLanguage(), limoCities);

                        var options = '';

                        for (var x = 0; x < limoCities.length; x++) {
                            options += '<option value="' + limoCities[x].Id + '">' + limoCities[x].LocalizedName +
                                '</option>';
                        }

                        myApp.smartSelectAddOption('.city', options);

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

            for (var x = 0; x < limoCities.length; x++) {
                options += '<option value="' + limoCities[x].Id + '">' + limoCities[x].LocalizedName +
                    '</option>';
            }

            myApp.smartSelectAddOption('.city', options);
        }
    }

    function GetPaymentTypes() {
        var LimoPaymentOptions = GetLocalDataObject("LimoPaymentOptions" + GetServiceLanguage());
        if (LimoPaymentOptions == null) {

            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/Limo/PaymentTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var LimoPaymentOptions = JSON.parse(data);
                        SaveLocalObject("LimoPaymentOptions" + GetServiceLanguage(), LimoPaymentOptions)

                        var options = '';
                        var selected = "";
                        if (LimoPaymentOptions.length == 1) {
                            selected = "selected";
                        }

                        for (var x = 0; x < LimoPaymentOptions.length; x++) {
                            options += '<option ' + selected + ' value="' + LimoPaymentOptions[x].Id + '">' + LimoPaymentOptions[x].LocalizedName +
                                '</option>';
                        }

                        myApp.smartSelectAddOption('.payment', options);

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
            if (LimoPaymentOptions.length == 1) {
                selected = "selected";
            }
            for (var x = 0; x < LimoPaymentOptions.length; x++) {
                options += '<option  ' + selected + ' value="' + LimoPaymentOptions[x].Id + '">' + LimoPaymentOptions[x].LocalizedName +
                    '</option>';
            }

            myApp.smartSelectAddOption('.payment', options);
        }
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

    // check in case Update item local storage is avaliable , and get the item ID. 
    var limoItemToUpdate = GetLocalDataObject("limoItemToUpdate");

    // in case there was information to update, fill the information in the table.
    if (limoItemToUpdate) {
        /* $$("#Contract_Type").val(limoItemToUpdate.ContractType);
         $$("#Contract_Type").parent().find(".item-after").text(getSmartSelectText("#Contract_Type"));*/
        $$("#serv_type").val(limoItemToUpdate.ServiceType);
        $$("#serv_type").parent().find(".item-after").text(getSmartSelectText("#serv_type"));
        $$("#serv_time").val(limoItemToUpdate.ServiceDuration);
        $$("#serv_time").parent().find(".item-after").text(getSmartSelectText("#serv_time"));
        $$("#car_type").val(limoItemToUpdate.CarType);
        $$("#car_type").parent().find(".item-after").text(getSmartSelectText("#car_type"));
        $$('#calendar-date-depart').val(limoItemToUpdate.RequestDateTime.split("T")[0]);
        $$('.RequestDateTime').val(limoItemToUpdate.RequestDateTime.split("T")[1]);
        $$("#cities").val(limoItemToUpdate.City);
        $$("#cities").parent().find(".item-after").text(getSmartSelectText("#cities"));
        $$("#pay_method").val(limoItemToUpdate.PaymentType);
        $$("#pay_method").parent().find(".item-after").text(getSmartSelectText("#pay_method"));

    }
    else if (GetLocalDataObject("LimoReservationInfo")) {
        limoItemToUpdate = GetLocalDataObject("LimoReservationInfo");
        $$("#serv_type").val(limoItemToUpdate.ServiceType);
        $$("#serv_type").parent().find(".item-after").text(getSmartSelectText("#serv_type"));
        $$("#serv_time").val(limoItemToUpdate.ServiceDuration);
        $$("#serv_time").parent().find(".item-after").text(getSmartSelectText("#serv_time"));
        $$("#car_type").val(limoItemToUpdate.CarType);
        $$("#car_type").parent().find(".item-after").text(getSmartSelectText("#car_type"));
        $$('#calendar-date-depart').val(limoItemToUpdate.RequestDateTime.split("T")[0]);
        $$('.RequestDateTime').val(limoItemToUpdate.RequestDateTime.split("T")[1]);
        $$("#cities").val(limoItemToUpdate.City);
        $$("#cities").parent().find(".item-after").text(getSmartSelectText("#cities"));
        $$("#pay_method").val(limoItemToUpdate.PaymentType);
        $$("#pay_method").parent().find(".item-after").text(getSmartSelectText("#pay_method"));
    }

    //save the information to the order
    $$("#btnSaveData").on('click', function () {
        var requestBody =
            {
                ServiceType: Number($$("#serv_type").val()),
                ServiceDuration: Number($$("#serv_time").val()),
                CarType: Number($$("#car_type").val()),
                RequestDateTime: ($$("#calendar-date-depart").val() + "T" + $$('.RequestDateTime').val()),
                City: Number($$("#cities").val()),
                RequestDate: $$('#calendar-date-depart').val(),
                PaymentType: Number($$("#pay_method").val())
            }

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoReservationData(requestBody);

        if (ValidationSucessVal == validationResult) {
            // check in case this is update process:
            if (limoItemToUpdate) {
                $$.each(requestBody, function (key, value) {
                    limoItemToUpdate[key] = value;
                });
                SaveLocalObject("limoItemToUpdate", limoItemToUpdate);
            }
            else {
                // else save new object.
                SaveLocalObject("LimoReservationInfo", requestBody);
            }

            mainView.router.load({url: 'LimoReservationDataLocations.html'});
            //postlimo(requestBody);
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

$$("#btnSaveData").on('click', function () {
    mainView.router.load({url: 'new_LimoReservationDataLocations.html'});
});

//*************************End of Limo Resevation Data ***************************//

//********************Start of Limo Resevation Data Locations  ***********************//

myApp.onPageInit('LimoReservationDataLocations', function (page) {
    var reqServiceType = "limo";
    //$$('input[type="checkbox"]').prop('checked', false);

    // check in case the the state is update
    var limoItemToUpdate = GetLocalDataObject("limoItemToUpdate");
    if (limoItemToUpdate) {
        localStorage.setItem("txtValueDistLocation" + reqServiceType, limoItemToUpdate.DirectionTo);
        localStorage.setItem("txtDistLocation" + reqServiceType, limoItemToUpdate.ToCordination);
        localStorage.setItem("txtValuePickUpLocation" + reqServiceType, limoItemToUpdate.DirectionFrom);
        localStorage.setItem("txtPickUpLocation" + reqServiceType, limoItemToUpdate.FromCordination);
        localStorage.setItem("pickupLocation" + reqServiceType, limoItemToUpdate.DirectionLocation);
        $$("#Pickup_Location").val(limoItemToUpdate.DirectionLocation);
    }

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

    $$("#btnSaveDataLocations").on('click', function () {
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        var requestBodyLocations =
            {
                DirectionFrom: $$("#DepartFrom").val(),
                DirectionTo: $$("#Departto").val(),
                DirectionLocation: $$("#Pickup_Location").val(),
                FromCordination: Marker_from,
                ToCordination: Marker_To
            }
        //r_Location: $$("#Customer_Location").val();

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoReservationDataLocation(requestBodyLocations)

        if (ValidationSucessVal == validationResult) {
            if (limoItemToUpdate) {
                $$.each(requestBodyLocations, function (key, value) {
                    limoItemToUpdate[key] = value;
                });
                SaveLocalObject("limoItemToUpdate", limoItemToUpdate);
            }
            else {
                // else save new object.
                SaveLocalObject("LimoReservationMapInfo", requestBodyLocations);
            }
            mainView.router.load({url: 'LimoRequestItemsList.html'});
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


myApp.onPageAfterAnimation('LimoReservationDataLocations', function (page) {
    var reqServiceType = "limo";
    localStorage.setItem("reqServiceType", reqServiceType);

    var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
    var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
    var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
    var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);
    //$$("#Pickup_Location").val(localStorage.getItem("pickupLocation" + reqServiceType));

    //    myApp.alert(JSON.stringify(Marker_from) + "name of " + location_From);
    //    myApp.alert(JSON.stringify(Marker_To) + "name of " + location_To);

    if (location_To != null && location_To != "undefined") {
        // $$("#DepartFrom").val()
        document.getElementById("Departto").value = location_To;
        //var mapProp2 = {
        //    center: getLatLngFromString(Marker_To),//(51.508742, -0.120850),//
        //    zoom: 13,
        //    disableDefaultUI: true,
        //    mapTypeId: google.maps.MapTypeId.ROADMAP,
        //    draggable: false
        //};

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        //map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);
    }

    if (location_From != null && location_From != "undefined") {
        // $$("#DepartFrom").val()
        document.getElementById("DepartFrom").value = location_From;
        ////google.maps.event.addDomListener(window, 'load', initialize);
        //window.onload = loadScript;

        //var mapProp = {
        //    center: getLatLngFromString(Marker_from),//(51.508742, -0.120850),//
        //    zoom: 13,
        //    disableDefaultUI: true,
        //    mapTypeId: google.maps.MapTypeId.ROADMAP,
        //    draggable: false
        //};


        //map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        //drawMarkers();

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
//********************End of Limo Resevation Data Locations  ***********************//

//************************* LimoRequestItemsList ************************************//
//Handle user requests List
myApp.onPageInit('LimoRequestItemsList', function (page) {
    var pageObject = mainView.activePage;
    var limoRequestsList = GetLocalDataObject("limoRequestsList");
    if (pageObject.name == 'LimoRequestItemsList') {
        if (limoRequestsList == null) {
            // create limo req list and add item to it.
            limoRequestsList = [];
            limoRequestsList.push(getSavedObject());
        }
        else {
            var itemIndex = GetLocalData("limoItemToUpdateIndex");
            if (itemIndex) {
                var updateIndex = Number(itemIndex);
                if (updateIndex >= 0 && updateIndex <= limoRequestsList.length - 1) {
                    limoRequestsList[updateIndex] = getSavedObject();
                }
                else {
                    limoRequestsList.push(getSavedObject());
                }
            }
            else {
                limoRequestsList.push(getSavedObject());
            }

        }
    }


    //save the limo request list to the storage
    SaveLocalObject("limoRequestsList", limoRequestsList);

    function getSavedObject() {
        var limoItemToUpdate = GetLocalDataObject("limoItemToUpdate");
        if (limoItemToUpdate) {
            return limoItemToUpdate;
        }
        else {
            var LimoReservationInfo = GetLocalDataObject("LimoReservationInfo");
            var LimoReservationMapInfo = GetLocalDataObject("LimoReservationMapInfo");

            var Data =
                {
                    ServiceType: LimoReservationInfo.ServiceType,// fixed as 1 for limo
                    ServiceDuration: LimoReservationInfo.ServiceDuration,
                    CarType: LimoReservationInfo.CarType,
                    RequestDateTime: LimoReservationInfo.RequestDateTime,
                    City: LimoReservationInfo.City,
                    DirectionFrom: LimoReservationMapInfo.DirectionFrom,
                    DirectionTo: LimoReservationMapInfo.DirectionTo,
                    DirectionLocation: LimoReservationMapInfo.DirectionLocation,
                    PaymentType: LimoReservationInfo.PaymentType,
                    ChannelCode: LimoReservationInfo.ChannelCode,
                    FromCordination: LimoReservationMapInfo.FromCordination.replace("(", "").replace(")", ""),
                    ToCordination: LimoReservationMapInfo.ToCordination.replace("(", "").replace(")", "")
                }

            return Data;
        }
    }

    // draw the list
    DrawUiList();

    function DrawUiList() {

        var deleteItem = "";
        if (limoRequestsList.length > 1) {
            deleteItem = '<a href="#" class="deleteBtn swipeout-deleteBtn " >' + GetResourceText("Delete") + '</a>';
        }
        var itemListHtml = "";
        $$.each(limoRequestsList, function (key, value) {
            var li = '<li class="swipeout">' +
                '<div class="swipeout-content item-content">' +
                '<img src="img/SettingIcon.png" style="width:18px" />' +
                '<div> &nbsp;' + value.RequestDateTime.replace("T", "-") + ' &nbsp;</div>' +
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
        var itemToUpdate = limoRequestsList[Number(changeIndex)];
        SaveLocalData("limoItemToUpdateIndex", changeIndex);
        SaveLocalObject("limoItemToUpdate", itemToUpdate);
        mainView.router.load({url: 'LimoReservationData.html'});
    });

    // Delete click action.
    $$("#ItemsListContainer").on("click", ".deleteBtn", function () {
        var deleteIndex = $$(this).parent().data("index");
        SaveLocalData("limoDeleteItemIndex", deleteIndex);

        myApp.modal({
            title: GetResourceText("alert"),
            text: GetResourceText("DeleteConfirm"),
            buttons: [
                {
                    text: GetResourceText("OkText"),
                    onClick: function () {
                        limoRequestsList.splice(Number(deleteIndex), 1);
                        SaveLocalObject("limoRequestsList", limoRequestsList);
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
        DeleteLocalData("limoItemToUpdate");
        DeleteLocalData("LimoReservationInfo");
        SaveLocalData("limoItemToUpdateIndex", "-1");
        mainView.router.load({url: 'LimoReservationData.html'});
    });

    // Complete the request. 
    $$("#Continue").click(function () {
        mainView.router.load({url: 'LimoReservationtypes.html'});
    });

});
//************************************************************//
// handle insert user information and submit the order
myApp.onPageInit('LimoReservationtypes', function (page) {
    // in case user is logged in the application retrive user profile and fill the form
    var pre = GetLocalDataObject("storedprofile");

    if (pre != null) {
        var ZipCod = pre.MobileNumber.substr(0, 3);

        var MobileNumber8D = pre.MobileNumber.substring(3).trim();
        pre.MobileNumber = MobileNumber8D;

        myApp.formFromJSON('#Fill_Up_Form', pre);

        document.getElementById("txtCountryCode").value = ZipCod;

        myApp.formFromJSON('#Fill_Up_Form_Authoraized', pre);
    }

    // UI helpers for select items
    $$(".div_click").on("click", function () {
        $$(this).find("input").focus();
    })
    $$(".select_click").on("click", function () {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function () {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    $$("#txtCountryCode").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr');
        }
        else {
            myApp.smartSelectOpen('#countriesEn');
        }
    });
    $$("#SmartSelectValuepickEn").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode").val($$("#countriesSelect").val());
    });

    $$("#SmartSelectValuepick").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode").val($$("#countriesSelectAr").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
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
    else {
        $$("#countriesSelectAr").val("966");
        $$("#countriesSelect").val("966");
        $$("#txtCountryCode").val("966");

    }
    $$("#txtCountryCode_cus").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('.countriesSelectAr_cus');
        }
        else {
            myApp.smartSelectOpen('.countriesSelect_cus');
        }
    });
    $$("#SmartSelectValuepickEn_cus").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_cus").val($$("#countriesSelect_cus").val());
    });

    $$("#SmartSelectValuepick_cus").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_cus").val($$("#countriesSelectAr_cus").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick_cus").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn_cus").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr_cus").val(reservationContactInfo.telCode);
        $$("#countriesSelect_cus").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode_cus").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode_cus").val("966");
    }
    else {
        $$("#countriesSelectAr_cus").val("966");
        $$("#countriesSelect_cus").val("966");
        $$("#txtCountryCode_cus").val("966");
    }

    $$("#txtCountryCode_Ne").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('.countriesAr_ne');
        }
        else {
            myApp.smartSelectOpen('.countriesEn_ne');
        }
    });
    $$("#SmartSelectValuepickEn_Ne").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_Ne").val($$("#countriesSelect_Ne").val());
    });

    $$("#SmartSelectValuepick_Ne").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode_Ne").val($$("#countriesSelectAr_Ne").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null) {
        $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
        $$("#txtEmailAddress").val(reservationContactInfo.email);
        $$("#SmartSelectValuepick_Ne").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn_Ne").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr_Ne").val(reservationContactInfo.telCode);
        $$("#countriesSelect_Ne").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode_Ne").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode_Ne").val("966");
    }
    else {
        $$("#countriesSelectAr_Ne").val("966");
        $$("#countriesSelect_Ne").val("966");
        $$("#txtCountryCode_Ne").val("966");
    }
    //set views based on tab selected
    $$('#btnCompanies').on('click', setcompaniesView);

    function setcompaniesView() {

        //Todo: set UI elements 
        $$('#btnCompanies').removeClass("not-selected-tab");
        $$('#btnCompanies').addClass("selected-tab");
        $$('#btnPersone').removeClass("selected-tab");
        $$('#btnPersone').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "0.3");

        $$('#tab1').css("display", "block");
        $$('#tab2').css("display", "none");

    }

    //set views based on tab selected 
    $$('#btnPersone').on('click', setbtncustomerView);

    function setbtncustomerView() {

        //Todo: set UI elemnts 
        $$('#tab2').css("display", "block");
        $$('#tab1').css("display", "none");
        $$('#btnPersone').removeClass("not-selected-tab");
        $$('#btnPersone').addClass("selected-tab");
        $$('#btnCompanies').removeClass("selected-tab");
        $$('#btnCompanies').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "1");
    }


    GetLimoRequestTypes();

    function GetLimoRequestTypes() {
        var LimoRequestTypes = GetLocalDataObject("LimoRequestTypes" + GetServiceLanguage());
        if (LimoRequestTypes == null) {
            myApp.showPreloader(GetResourceText("Loading"));
            $$.ajax(
                {
                    url: "https://mobile.saptco.com.sa/Forms/Limo/RequestTypes",
                    method: "Get",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var LimoRequestTypes = JSON.parse(data);

                        SaveLocalObject("LimoRequestTypes" + GetServiceLanguage(), LimoRequestTypes);
                        document.getElementById('btnCompanies').innerHTML = LimoRequestTypes[1].LocalizedName;
                        document.getElementById('btnPersone').innerHTML = LimoRequestTypes[0].LocalizedName;

                    },
                    error: function (xhr, status) {
                        myApp.hidePreloader();
                        myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }
                });
        }
        else {
            document.getElementById('btnCompanies').innerHTML = LimoRequestTypes[1].LocalizedName;
            document.getElementById('btnPersone').innerHTML = LimoRequestTypes[0].LocalizedName;
        }

    }


    $$("#btnSaveLimoPassenger").on("click", function () {

        var limoRequestsList = GetLocalDataObject("limoRequestsList");

        var Data =
            {
                RequestType: 66,
                CustomerName: $$("#CustomerName").val(),
                IdNo: $$("#Customer_ID").val(),
                CustomerMobileNo: $$("#txtCountryCode_Ne").val() + $$("#CusPhoneNUmber").val(),
                CustomerEmail: $$("#CusEmailAddress").val(),
                Gender: $$("#selectGender").val(),
                Customer_Location: $$("#Customer_Location").val(),
                ChannelCode: "005",
                ContractNo: "",
                CompanyName: " ",
                FaxNo: "",
                LimoRequestDetailes: limoRequestsList
            }

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoIdividual(Data);
        if (validationResult == ValidationSucessVal) {
            SaveLocalObject("LimoPassengerInfo", Data);
            postlimo(Data);
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

    });

    $$('#btnSaveLimoCorp').on('click', function () {
        var limoRequestsList = GetLocalDataObject("limoRequestsList");

        var Data =
            {
                RequestType: 67,
                ContractNo: $$("#Contract_Number").val(),
                IdNo: "",
                CustomerName: $$("#AuthorizedName").val(),
                CompanyName: $$("#Company_Name").val(),
                Gender: "0",
                Commercial_Record: $$("#Commercial_Record").val(),
                FaxNo: $$("#txtCountryCode").val() + $$("#FaxNumber").val(),
                CustomerMobileNo: $$("#txtCountryCode_cus").val() + $$("#PhoneNUmber").val(),
                CustomerEmail: $$("#EmailAddress").val(),
                ChannelCode: "005",
                LimoRequestDetailes: limoRequestsList
            };

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoCorpReservation(Data);
        if (validationResult == ValidationSucessVal) {
            SaveLocalObject("LimoPassengerInfo", Data);
            postlimo(Data);
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
    });


    function postlimo(Data) {
        //alert(JSON.stringify(Data));
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Forms/Limo/Request";

        $$.ajax(
            {
                method: "POST",
                url: urlAjax,
                contentType: 'application/json',
                data: JSON.stringify(Data),
                dataType: "json",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },

                success: function (data, status, xhr) {
                    if (data) {
                        myApp.hidePreloader();
                        mainView.router.load({url: 'LimoSucess.html'});
                    }
                    else {
                        myApp.hidePreloader();
                        myApp.alert(GetResourceText("GenericError"), GetResourceText('alert'));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText("GenericError"), GetResourceText('alert'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
    }
});
//********************** End of Limo resvation Types *******************************//

myApp.onPageInit('LimoSucess', function (page) {
    $$("#gohome").click(function () {
        mainView.router.load({url: 'Home.html'});
    });
});

/***************************** End of Limo Code **************************/

