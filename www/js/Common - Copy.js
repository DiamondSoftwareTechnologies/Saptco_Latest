
// JavaScript source code

/*********************common screipts *****************/
function GetServiceLanguage()
{
    if (GetApplicationLanguage() == "en")
    {
        return "en-us";
    }
    else
    {
        return "ar-sa";
    }
}

function GetFormatedDate(dateString)
{
    var res = dateString.split("-");
    var val = new Date("2015");
    val.setYear(parseInt(res[2]));
    val.setMonth(parseInt(res[1]) - 1);
    val.setDate(parseInt(res[0]));
    return val;
}

function GetSaptcoFormatedDate(date)
{
    var Days = date.getDate();
    var Year = date.getFullYear();
    var Months = date.getMonth() + 1;
    if (Days < 10)
    {
        Days = '0' + Days;
    }
    if (Months < 10)
    {
        Months = '0' + Months;
    }
    var newDate = Days + "-" + Months + "-" + Year;
    return newDate;
}

function fillFormData(mainObject, namePrefix)
{
    $$.each(mainObject, function (key, value)
    {
        if (value != null && value.toString().indexOf("object") > -1)
        {
            fillFormData(value, key);
        }

        $$("#" + namePrefix + "_" + key).html(value);
        // var item = $("#" + namePrefix + "_" + key);

        // alert(key + " -:- " + value);
        console.log(namePrefix + "_" + key + " -:- " + value);
    });
}

function fillContainerData(mainObject, namePrefix, containerName)
{

    $$.each(mainObject, function (key, value)
    {
        if (value.toString().indexOf("object") > -1)
        {
            fillContainerData(value, key, containerName);
        }

        if (isNaN(namePrefix) == false)
        {
            namePrefix = "sub";
        }

        $$("#" + containerName).find("#" + namePrefix + "_" + key).html(value);
        // var item = $("#" + namePrefix + "_" + key);

        // alert(key + " -:- " + value);
        console.log(namePrefix + "_" + key + " -:- " + value);
    });
}

$$(document).on('click', '.contact-us-tab', function ()
{
    mainView.router.load({ url: 'contact_us.html' });
});

function searchReservationByEmail()
{
    if (GetLocalDataObject("ReservationSummary") != null && GetLocalDataObject("ReservationReqBody") != null)
    {
        var summary = GetLocalDataObject("ReservationSummary").Results;
        var pnr = summary.PNR;
        var email = GetLocalDataObject("ReservationReqBody").Email;
        var reqBody = {
            "PNR": pnr,
            "Email": email
        }

        SaveLocalData("resno", summary.PNR);
        SaveLocalData("phoneno", summary.MobileNumber);

        var jsonBody = JSON.stringify(reqBody)
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Reservation/Reservations/Search";
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
                SaveLocalObject("TicketSearch", data.FullInformation.Tickets);
                SaveLocalObject("pnrPayemntReturnInfo", data);
                if (data.IsConfirmed)
                {
                    mainView.router.load({
                        url: 'Tickets.html'
                    });
                }
                else
                {
                    myApp.alert(GetResourceText("errNotCompletedPayemnt"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                    mainView.router.load({
                        url: 'Home.html'
                    });
                }
            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                myApp.alert(GetResourceText("errNotCompletedPayemnt"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
                mainView.router.load({
                    url: 'Home.html'
                });
                //myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
            }
        });
    }
    else
    {
        mainView.router.load({ url: 'Home.html' });
    }
}
$$(document).on('click', '.mybooking', function ()
{
    //change select style
    $$("body").on("open", ".picker-modal", function ()
    {
        $$(this).find(".toolbar").css("background-color", "#dbc255 !important");
        $$(this).find(".toolbar").find("a").css("color", "#ffffff");
        $$(this).find(".toolbar").css("color", "#ffffff !important");
    });

    mainView.router.load({ url: 'mybooking.html' });
    //call the service to get my bookings 
});

$$(document).on('click', '.home-icon', function ()
{
    debugger;
    //change select style
    if (cordova.plugins.Keyboard.isVisible != true)
    {
        $$("body").on("open", ".picker-modal", function ()
        {
            $$(this).find(".toolbar").css("background-color", "#dbc255 !important");
            $$(this).find(".toolbar").find("a").css("color", "#ffffff");
            $$(this).find(".toolbar").css("color", "#ffffff !important");
        });
        mainView.router.load({ url: 'Home.html' });
    }
});

$$(document).on('pageInit', function (e)
{
    $$('.tab-link').removeClass('active');
    if (e.detail.page.url == "Home.html")
    {
        $$(".home-tab").addClass('active');
    }
    else if (e.detail.page.url == "mybooking.html")
    {
        $$(".mybooking").addClass('active');
    }
    else if (e.detail.page.url == "contact_us.html")
    {
        $$(".contact-us-tab").addClass('active');
    }

});
/******************************************************/
/***********************home ************************/

$$(document).on("click", "#goToSchedual", function ()
{
    //change select style
    $$("body").on("open", ".picker-modal", function ()
    {
        $$(this).find(".toolbar").css("background-color", "#dbc255 !important");
        $$(this).find(".toolbar").find("a").css("color", "#ffffff");
        $$(this).find(".toolbar").css("color", "#ffffff !important");
    });

    DeleteLocalData("AdultPassengers");
    DeleteLocalData("ChildsArray");
    DeleteLocalData("DayTrips");
    DeleteLocalData("InWordTabData");
    DeleteLocalData("InfantsPassengersArray");
    DeleteLocalData("OutJournyFullData");
    DeleteLocalData("OutWordTabData");
    DeleteLocalData("ReservationType");
    DeleteLocalData("ReservationReqBody");
    DeleteLocalData("ReservationSummary");
    DeleteLocalData("SadadPayemntInfo");
    DeleteLocalData("TripBookList");
    DeleteLocalData("ReservationSummary");
    DeleteLocalData("SelectedNationality");
    DeleteLocalData("retJournyFullData");
    DeleteLocalData("ticketSearchData");
    SaveLocalData("adultCount", 1);
    SaveLocalData("childrenCount", 0);
    SaveLocalData("infantsCount", 0);
    mainView.router.load({ url: 'schedulesandtickets.html' });
})

$$(document).on("click", "#goToLimo", function ()
{
    mainView.router.load({ url: 'LimoReservationData.html' });
})

$$(document).on("click", "#goToCargo", function ()
{
    mainView.router.load({ url: 'CargoReservationData.html' });
})

$$(document).on("click", "#goToBusRent", function ()
{
    mainView.router.load({ url: 'Rent_Bus_Details.html' });
})
/*******************end of home**************************/

// Schedules and Tickets section

myApp.onPageInit('schedulesandtickets', function (page)
{
    //advertisment check 
    Advertisment();
    function Advertisment()
    {
        myApp.showPreloader(GetResourceText("Loading"));

        var authHeader = GetLocalData("authHeader");
        $$.ajax(
        {
            url: "https://mobile.saptco.com.sa/Forms/News/CNCNews", //by osama : ValidNews changed to CargoNews
            method: "Get",
            headers:
            {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json',
                "Authorization": authHeader
            },
            success: function (data, xhr, param)
            {
                myApp.hidePreloader();
                if (data.length > 0)
                {
                    var objectData = JSON.parse(data);
                    if (objectData != null && objectData.length > 0)
                    {
                        $$("#adsContainer").css("display", "block");
                        var SwipperItems = "";
                        $$.each(objectData, function (key, value)
                        {
                            SwipperItems += "<div class='swiper-slide'><span>" + value.LocalizedName + "</span></div>";
                        });
                        $$("#AdsSwiperItems").html(SwipperItems);

                        var mySwiper = myApp.swiper('.ads-Swiper', {
                            speed: 400,
                            spaceBetween: 0,
                            autoplay: 6000,
                        });
                    }
                }
            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                /*     if (xhr.status == 401)
                     {
                         myApp.alert(GetResourceText('errLoginToViewHistory'), GetResourceText("Error"));
                         $$(".modal-button-bold").text(GetResourceText('OkText'));
                     }
                     else
                     {
                         myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                         $$(".modal-button-bold").text(GetResourceText('OkText'));
                     }*/

            }
        });
    }


    var selectedTripType = GetLocalDataObject("selectedStationType");
    if (selectedTripType != null)
    {
        $$("#selectTripType").val(selectedTripType);
    }

    var selectedItemValue = $$("#selectTripType").val();
    SaveLocalObject("selectedStationType", selectedItemValue);

    $$("#selectTripType").change(function (item)
    {
        selectedItemValue = $$("#selectTripType").val();
        SaveLocalObject("selectedStationType", selectedItemValue);
        var objectStations = GetLocalDataObject("StationsStorage");
        objectStations.DepartureStationsName = GetResourceText("plzSelectStation");
        objectStations.DepartureStationsId = -1;
        objectStations.ArrivleStationsName = GetResourceText("plzSelectStation");
        objectStations.ArrivleStationsId = -1;
        SaveLocalObject("StationsStorage", objectStations);
        fillFormData(objectStations, "Locations");
    });

    var optionsItems = $$("#selectTripType").children();
    $$.each(optionsItems, function (index, value)
    {
        if ($$("#selectTripType").children()[index].selected)
        {
            $$("#selectedTextValue").text($$("#selectTripType").children()[index].text);
        }
    });

    // create calendar instances
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();

    var today = new Date().setDate(currentDate.getDate() - 1);
    var _maxdate = new Date().setDate(currentDate.getDate() + 90);

    var passengersCounts =
        {
            adultCount: 1,
            childrenCount: 0,
            infantsCount: 0
        }


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
        onChange: function ()
        {
            calendarDateFormatReturn.params.minDate = calendarDateFormatDepart.value[0];
            calendarDepartVal = calendarDateFormatDepart.value[0];
        },
        onOpen: function (p)
        {
            calendarDateFormatDepart.params.maxDate = _maxdate;
        }
    });
    calendarDateFormatDepart.params.maxDate = _maxdate;

    var calendarReturnVal = null;
    var calendarDepartVal = null;
    var calendarDateFormatReturn = myApp.calendar({
        input: '#calendar-date-arrive',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true,
        toolbar: true,
        maxDate: _maxdate,
        toolbarCloseText: calendarCloseButton,
        toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '{{monthPicker}}' +
            '{{yearPicker}}' +
        '</div></div> ',
        minDate: today,
        onChange: function ()
        {
            calendarDateFormatDepart.params.maxDate = calendarDateFormatReturn.value[0];
            calendarReturnVal = calendarDateFormatReturn.value[0];
        },
        onOpen: function (p)
        {
            calendarDateFormatReturn.params.maxDate = _maxdate;
        }
    });

    // set the view to one way or round trip
    if (GetLocalData("ReservationType"))
    {
        //fill the dates value and passenger data in case the search already done before
        var ticketSearchData = GetLocalDataObject("ticketSearchData");
        if (GetLocalData("ReservationType") == "Round")
        {
            setRoundTripView();
            if (ticketSearchData && ticketSearchData != null)
            {
                if (ticketSearchData.DepartureDate)
                {
                    var formatedDate = GetFormatedDate(ticketSearchData.DepartureDate);
                    calendarDateFormatDepart.setValue([formatedDate]);
                }
                if (ticketSearchData.ReturnDate)
                {
                    formatedDate = GetFormatedDate(ticketSearchData.ReturnDate);
                    calendarDateFormatReturn.setValue([formatedDate]);
                }
            }
        }
        else
        {
            setOnewayView();

            if (ticketSearchData && ticketSearchData != null)
            {
                if (ticketSearchData.DepartureDate)
                {
                    var formatedDate = GetFormatedDate(ticketSearchData.DepartureDate);
                    calendarDateFormatDepart.setValue([formatedDate]);
                }
            }
        }

        if (ticketSearchData && ticketSearchData != null)
        {
            passengersCounts.adultCount = ticketSearchData.Passengers.AdultsCount;
            passengersCounts.childrenCount = ticketSearchData.Passengers.ChildrenCount;
            passengersCounts.infantsCount = ticketSearchData.Passengers.InfantsCount;
            $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");
        }
    }
    else
    {
        SaveLocalData("ReservationType", "OneWay");
        setOnewayView();
    }

    $$('.departure-action').on('click', function ()
    {
        SaveLocalData("FieldToSave", "Dep");
        var tripsSearch = collectTripsRound();
        SaveLocalData("ticketSearchData", tripsSearch);
        mainView.router.load({
            url: 'stations.html'
        });
    });

    $$('.arrival-action').on('click', function ()
    {
        SaveLocalData("FieldToSave", "Arr");
        var tripsSearch = collectTripsRound();
        SaveLocalData("ticketSearchData", tripsSearch);
        mainView.router.load({
            url: 'stations.html'
        });
    });




    //select the date by clicking the containers. 
    $$("#divDepartDate").on("click", function ()
    {
        if (calendarReturnVal != null)
        {
            calendarDateFormatDepart.params.maxDate = calendarReturnVal;
        }

        setTimeout(function ()
        {
            calendarDateFormatDepart.open();
            if (calendarReturnVal != null)
            {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 300);

        setTimeout(function ()
        {
            if (calendarReturnVal != null)
            {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 450);

    });

    $$("#divCalenderOpen").on("click", function ()
    {

        if (calendarReturnVal != null)
        {
            calendarDateFormatDepart.params.maxDate = calendarReturnVal;
        }

        setTimeout(function ()
        {
            calendarDateFormatDepart.open();
            if (calendarReturnVal != null)
            {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 300);

        setTimeout(function ()
        {
            if (calendarReturnVal != null)
            {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 450);
    });

    $$("#divReturnDate").on("click", function ()
    {
        if (calendarDepartVal != null)
        {
            calendarDateFormatReturn.params.minDate = calendarDepartVal;
        }
        var reservationType = GetLocalData("ReservationType");

        if (reservationType && reservationType == "Round")
        {
            setTimeout(function ()
            {
                calendarDateFormatReturn.open();
            }, 300);


        }
        if (calendarDepartVal != null)
        {
            calendarDateFormatReturn.params.minDate = calendarDepartVal;
        }
    });
    $$('.schedule-search-button').on('click', function ()
    {
        DeleteLocalData("DayTrips");
        DeleteLocalData("InWordTabData");
        DeleteLocalData("OutJournyFullData");
        DeleteLocalData("OutWordTabData");
        DeleteLocalData("ReservationSummary");
        DeleteLocalData("TripBookList");
        DeleteLocalData("ReservationSummary");
        DeleteLocalData("retJournyFullData");

        //SaveLocalData("FieldToSave", "Arr");  
        if (GetLocalData("adultCount") == null)
        {
            SaveLocalData("adultCount", 1);
            SaveLocalData("childrenCount", 0);
            SaveLocalData("infantsCount", 0);
        }
        var tripIsOneWay = (GetLocalData("ReservationType") == "OneWay")

        if (tripIsOneWay)
        {
            var tripsSearch = collectTripsOneWay();
            var validationRuslt = ValidateTripsOneWay(tripsSearch);
            //mainView.router.load({ url: 'trips.html' });

            if (validationRuslt == ValidationSucessVal)
            {
                SaveLocalData("ticketSearchData", tripsSearch);
                // for test only : 
                //mainView.router.load({ url: 'trips.html' });
                PostTripsOneway(tripsSearch);
            }
            else
            {
                myApp.alert(GetResourceText(validationRuslt), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        }
        else
        {
            var tripsSearch = collectTripsRound();
            var validationRuslt = ValidateTripsRoundtrip(tripsSearch);
            //mainView.router.load({ url: 'trips.html' });

            if (validationRuslt == ValidationSucessVal)
            {
                SaveLocalData("ticketSearchData", tripsSearch);
                // for test only : 
                //mainView.router.load({ url: 'trips.html' });
                PostTripsRound(tripsSearch);
            }
            else
            {
                myApp.alert(GetResourceText(validationRuslt), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        }
    });


    $$('#btnOneWay').on('click', function ()
    {
        setOnewayView();
    });
    function setOnewayView()
    {
        SaveLocalData("ReservationType", "OneWay");
        //Todo: set UI elements 
        $$('#btnOneWay').removeClass("not-selected-tab");
        $$('#btnOneWay').addClass("selected-tab");
        $$('#btnRoundTrip').removeClass("selected-tab");
        $$('#btnRoundTrip').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "0.3");
        $$('#calendar-date-arrive').addClass("disabled");
        $$('#calendar-date-arrive').val("");
        calendarDateFormatDepart.params.maxDate = null;
    }

    $$('#btnRoundTrip').on('click', function ()
    {
        setRoundTripView();
    });
    function setRoundTripView()
    {
        SaveLocalData("ReservationType", "Round");
        //Todo: set UI elemnts 
        $$('#btnRoundTrip').removeClass("not-selected-tab");
        $$('#btnRoundTrip').addClass("selected-tab");
        $$('#btnOneWay').removeClass("selected-tab");
        $$('#btnOneWay').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "1");
        $$('#calendar-date-arrive').removeClass("disabled");
    }

    $$('#btnSubAdult').on('click', function ()
    {
        if (passengersCounts.adultCount > 0)
        {
            passengersCounts.adultCount = subPassenger(passengersCounts.adultCount);
        }
        updatePassengerCountLabels();
    });

    $$('#btnAddAdult').on('click', function ()
    {
        passengersCounts.adultCount = addPassenger(passengersCounts.adultCount);
        updatePassengerCountLabels();
    });

    $$('#btnSubChild').on('click', function ()
    {
        passengersCounts.childrenCount = subPassenger(passengersCounts.childrenCount);
        updatePassengerCountLabels();
    });

    $$('#btnAddChild').on('click', function ()
    {
        passengersCounts.childrenCount = addPassenger(passengersCounts.childrenCount);
        updatePassengerCountLabels();
    });

    $$('#btnSubInfants').on('click', function ()
    {
        passengersCounts.infantsCount = subPassenger(passengersCounts.infantsCount);
        updatePassengerCountLabels();
    });

    $$('#btnAddInfants').on('click', function ()
    {
        passengersCounts.infantsCount = addPassenger(passengersCounts.infantsCount);
        updatePassengerCountLabels();
    });

    $$('#btnSavePassCount').on('click', function ()
    {
        SaveLocalData("adultCount", passengersCounts.adultCount);
        SaveLocalData("childrenCount", passengersCounts.childrenCount);
        SaveLocalData("infantsCount", passengersCounts.infantsCount);

        $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");

    });

    function subPassenger(passCount)
    {
        if (passCount > 0)
        {
            return (passCount - 1);
        }
        return passCount;
    }

    function addPassenger(passCount)
    {
        if (passCount < 5)
        {
            return (passCount + 1);
        }
        return passCount;
    }
    updatePassengerCountLabels();
    function updatePassengerCountLabels()
    {
        $$("#lblAdultCount").text(GetResourceText("lblAdults") + " )" + passengersCounts.adultCount + "(");
        $$("#lblChildCount").text(GetResourceText("lblChild") + " (" + passengersCounts.childrenCount + ")");
        $$("#lblInfantsCount").text(GetResourceText("lblInfants") + " (" + passengersCounts.infantsCount + ")");
    }

    // check in case the local storage got any values, then fill the values inside the labels , else fill temp data
    if (GetLocalDataObject("StationsStorage") == null)
    {
        var stationsStorage =
        {
            DepartureStationsName: GetResourceText("Select"),
            DepartureStationsId: -1,
            ArrivleStationsName: GetResourceText("Select"),
            ArrivleStationsId: -1,
            StationTypeDep: "all",
            StationTypeArr: "all"
        };

        SaveLocalObject("StationsStorage", stationsStorage);
    }
    // fill the data inside the form
    fillFormData(GetLocalDataObject("StationsStorage"), "Locations");
});


function PostTripsOneway(postData)
{
    postData = postData;
    myApp.showPreloader(GetResourceText("Loading"));
    var urlAjax = "https://mobile.saptco.com.sa/Reservation/trips/oneway";
    $$.ajax(
    {
        method: "POST",
        url: urlAjax,
        contentType: 'application/json',
        data: postData,
        dataType: "json",
        timeout: 60000,
        headers:
        {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },

        success: function (data, status, xhr)
        {
            myApp.hidePreloader();
            if (data.Results[0].Days && data.Results[0].Days.length > 0)
            {
                // save full returned data.
                SaveLocalObject("OutWordTabData", data.Results[0]);
                // store days information for selection perpous.
                SaveLocalObject("TripsDays", data.Results[0].Days);

                if (data.Results[0].Days.length > 1)
                {
                    SaveLocalObject("DayTrips", data.Results[0].Days[1].Journies);
                }
                else if (data.Results[0].Days.length > 0)
                {
                    SaveLocalObject("DayTrips", data.Results[0].Days[0].Journies);
                }
                else
                {
                    // show message
                    myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));

                }

                // open schedual page
                mainView.router.load({
                    url: 'trips.html'
                });
            }
            else
            {
                myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        },
        error: function (xhr, status, data)
        {
            myApp.hidePreloader();
            if (status == 0)
            {
                myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
            else
            {
                myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        }
    });
}


function PostTripsRound(postData)
{
    myApp.showPreloader(GetResourceText("Loading"));
    var urlAjax = "https://mobile.saptco.com.sa/Reservation/Trips/Round";
    $$.ajax(
    {
        type: "POST",
        url: urlAjax,
        dataType: 'json',
        contentType: 'application/json',
        data: postData,
        timeout: 60000,
        headers:
        {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },

        success: function (data, status, xhr)
        {
            myApp.hidePreloader();
            // save each tab data :
            SaveLocalObject("OutWordTabData", data.Results[0]);
            SaveLocalObject("InWordTabData", data.Results[1]);
            // store days information for selection perpous.
            SaveLocalObject("TripsDays", data.Results[0].Days);
            if (data.Results[0].Days.length > 1 && data.Results[1].Days.length > 1)
            {
                SaveLocalObject("DayTrips", data.Results[0].Days[1].Journies);
                mainView.router.load({
                    url: 'trips.html'
                });
            }
            else if (data.Results[0].Days.length > 0 && data.Results[1].Days.length > 0)
            {
                SaveLocalObject("DayTrips", data.Results[0].Days[0].Journies);
                mainView.router.load({
                    url: 'trips.html'
                });
            }
            else
            {
                // show message
                myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        },
        error: function (xhr, status)
        {
            myApp.hidePreloader();
            if (status == 0)
            {
                myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
            else
            {
                myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }

        }
    });



}
/************* End of Schedules and Tickets section ****************/

/************************** stations ********************************/
function fillStations(stationsData)
{
    var stationsList = myApp.virtualList('.list-block.virtual-list', {
        // Array with items data
        items: stationsData,
        // Custom render function to render item's HTML
        renderItem: function (index, item)
        {
            return '<li class="item-content">' +
                      '<div class="item-inner clickable-station" data-stationId ="' + item.ID + '" data-stationType =' + item.Type.toLowerCase() + ' >' +
                          '<div class="item-title"  style="font-weight: 300;  font-stretch: condensed;"  >' + item.Name + '</div>' +
                      '</div>' +
                           '</li>';
        },
        searchAll: function (query, items)
        {
            var foundItems = [];
            for (var i = 0; i < items.length; i++)
            {
                // Check if title contains query string
                if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) == 0) foundItems.push(i);
            }

            for (var i = 0; i < items.length; i++)
            {
                // Check if title contains query string
                if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) > 0) foundItems.push(i);
            }
            // Return array with indexes of matched items
            return foundItems;
        }
    });
}

function SaveStationsSelection(selectionName, selectionId, stationType)
{
    var objectStations = GetLocalDataObject("StationsStorage");
    if (GetLocalData("FieldToSave") == "Dep")
    {
        objectStations.DepartureStationsName = selectionName;
        objectStations.DepartureStationsId = selectionId;
        objectStations.StationTypeArr = stationType;
        objectStations.ArrivleStationsName = GetResourceText("plzSelectStation");
        objectStations.ArrivleStationsId = -1;
    }
    else
    {
        objectStations.ArrivleStationsName = selectionName;
        objectStations.ArrivleStationsId = selectionId;
    }

    SaveLocalObject("StationsStorage", objectStations);
    mainView.router.reloadPreviousPage('schedulesandtickets.html');
    mainView.router.back({
        url: 'schedulesandtickets.html'
    });
}

myApp.onPageInit('stations', function (page)
{
    // on station click event
    $$(document).on('click', '.clickable-station', function ()
    {
        var stationID = $$(this).data('stationid');
        var stationType = $$(this).data('stationType');
        var stationName = $$(this).text();
        SaveStationsSelection(stationName, stationID, stationType);
    });


    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });

    if (GetLocalData("FieldToSave") == "Dep")
    {
        var selectedType = GetLocalDataObject("selectedStationType");
        GetAllStations(selectedType);
    }
    else
    {
        var objectStations = GetLocalDataObject("StationsStorage");
        var selectedType = GetLocalDataObject("selectedStationType");
        if (selectedType == "all")
        {
            if (objectStations.StationTypeArr == "all" || objectStations.StationTypeArr == "vip" || objectStations.StationTypeArr == "standard")
            {
                GetAllStations(objectStations.StationTypeArr);
            }
            else
            {
                GetAllStations("all");
            }
        }
        else
        {
            GetAllStations(selectedType);
        }
    }
});

function GetAllStations(stationType)
{
    var allStations = GetLocalDataObject("stationsStorage_" + GetServiceLanguage() + stationType);

    if (allStations)
    {
        var msDay = 60 * 60 * 24 * 1000;
        var saveDate = new Date(allStations.timeStamp);
        var currentDate = new Date();
        var daysSinceSave = ((currentDate - saveDate) / msDay);
        if (daysSinceSave > 5)
        {
            DeleteLocalData("stationsStorage_" + GetServiceLanguage() + stationType);
            GetAllStations(stationType);
        }
        fillStations(allStations.objectData);
    }
    else
    {
        SaveLocalData("StationTypeToSave", stationType);
        myApp.showPreloader(GetResourceText("Loading"));
        $$.ajax({
            url: 'https://mobile.saptco.com.sa/Reservation/Stations/' + stationType,
            headers: {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },
            success: function (data, status, xhr)
            {
                myApp.hidePreloader();
                var objectData = JSON.parse(data);
                var stationObject = {
                    timeStamp: new Date(),
                    objectData: objectData.Results
                };
                stationType = GetLocalData("StationTypeToSave");
                SaveLocalObject("stationsStorage_" + GetServiceLanguage() + stationType, stationObject);
                fillStations(objectData.Results);
            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
            ,
            statusCode: {
                404: function (xhr)
                {
                    alert('page not found');
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            }
        });
    }
}
/********************************************************************/

/***************************** trips ********************************/
myApp.onPageInit('trips', function (page)
{

    var selectedTab = "Out";

    // intilize objects for data
    if (GetLocalData("ReservationType") == "OneWay")
    {
        if (GetLocalDataObject("TripBookList") == null)
        {
            bookingList =
            [
            {
                "JourneyID": "",
                "OfferID": ""
            }];
            SaveLocalObject("TripBookList", bookingList);
        }
    }
    else
    {
        if (GetLocalDataObject("TripBookList") == null)
        {
            bookingList =
            [
            {
                "JourneyID": "",
                "OfferID": ""
            },
            {
                "JourneyID": "",
                "OfferID": ""
            }];
            SaveLocalObject("TripBookList", bookingList);
        }
    }

    // event handler for clicking an trip Days tabs
    $$('.clicktab').on('click', function ()
    {
        var selectedIndex = Number($$(this).data("index"));
        if (GetLocalDataObject("TripsDays") != null)
        {
            var newDay = GetLocalDataObject("TripsDays")[selectedIndex];
            //SaveLocalObject("DayTrips", newDay.Journies);
            if (newDay)
            {
                fillTripsList(newDay.Journies, selectedTab);
                $$(".clicktab").removeClass("tabselected");
                $$(".clicktab").addClass("tabnotSelected");
                $$(this).removeClass("tabnotSelected");
                $$(this).addClass("tabselected");
            }
        }
    });

    $$("#OutTab").click(function ()
    {

        $$("#ReturnTab").removeClass("selected-tab");
        $$("#ReturnTab").addClass("not-selected-tab");
        $$(this).removeClass("not-selected-tab");
        $$(this).addClass("selected-tab");
        FillTripScreenData("Out");
        selectedTab = "Out";
    });

    $$("#ReturnTab").click(function ()
    {
        bookingList = GetLocalDataObject("TripBookList");
        if (GetLocalData("ReservationType") != "OneWay" && bookingList && bookingList.length > 0 && bookingList[0].JourneyID != "")
        {
            $$("#OutTab").removeClass("selected-tab");
            $$("#OutTab").addClass("not-selected-tab");
            $$(this).removeClass("not-selected-tab");
            $$(this).addClass("selected-tab");
            FillTripScreenData("In");
            selectedTab = "Return";
        }
    });


    function FillTripScreenData(direction)
    {
        myApp.showPreloader(GetResourceText("Loading"));
        var ObjectData;
        // 
        if (direction == "Out")
        {
            ObjectData = GetLocalDataObject("OutWordTabData");
            // ObjectData = GetLocalDataObject("InWordTabData");
            $$("img[src='returnArrow.png']").attr("src", "img/goingbus.png");
        }
        else
        {
            var tempData = [];
            ObjectData = GetLocalDataObject("InWordTabData");
            $$("img[src='goingbus.png']").attr("src", "img/returnArrow.png");
            var outInfo = GetLocalDataObject("OutJournyFullData");
            var dateOut = new Date(outInfo.ArrivalDate);

            dateOut = GetFormatedDate(outInfo.ArrivalDate);
            //check the dates before adding them to object data
            if (ObjectData.Days.length > 0)
            {
                var dateRet = GetFormatedDate(ObjectData.Days[0].Date);
                if (dateRet >= dateOut)
                {
                    tempData.push(ObjectData.Days[0]);
                }
            }
            if (ObjectData.Days.length > 1)
            {
                var dateRet = GetFormatedDate(ObjectData.Days[1].Date);
                if (dateRet >= dateOut)
                {
                    tempData.push(ObjectData.Days[1]);
                }
            }
            if (ObjectData.Days.length > 2)
            {
                var dateRet = GetFormatedDate(ObjectData.Days[2].Date);
                if (dateRet >= dateOut)
                {
                    tempData.push(ObjectData.Days[2]);
                }
            }
            ObjectData.Days = tempData;

        }

        $$("#lblTripsCities").text(ObjectData.DepartureStation.City + ", " + ObjectData.ArrivalStation.City);
        $$("#lblFromStation").text(ObjectData.DepartureStation.Name);
        $$("#lblToStation").text(ObjectData.ArrivalStation.Name);
        var ticketSearchData = GetLocalDataObject("ticketSearchData");
        var passengersCounts = {};
        if (ticketSearchData && ticketSearchData != null)
        {
            passengersCounts.adultCount = ticketSearchData.Passengers.AdultsCount;
            passengersCounts.childrenCount = ticketSearchData.Passengers.ChildrenCount;
            passengersCounts.infantsCount = ticketSearchData.Passengers.InfantsCount;
            $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");
        }

        var childAndInfText = "";
        if (passengersCounts.childrenCount > 0)
        {
            childAndInfText = childAndInfText + "," + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + ") ";

        }
        if (passengersCounts.infantsCount > 0)
        {
            childAndInfText = childAndInfText + "," + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")";
        }

        $$("#Nopass").text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + ") " + childAndInfText);

        if (ObjectData.Days.length > 0)
        {
            // store days information for selection perpous.
            SaveLocalObject("TripsDays", ObjectData.Days);

            // fill the days inside the labels in the top;
            if (ObjectData.Days.length > 0)
            {
                $$("#0_DateTab").html(ObjectData.Days[0].Date);
            }
            else
            {
                $$("#0_DateTab").html("---");
            }
            if (ObjectData.Days.length > 1)
            {
                $$("#1_DateTab").html(ObjectData.Days[1].Date);
            }
            else
            {
                $$("#1_DateTab").html("---");
            }

            if (ObjectData.Days.length > 2)
            {
                $$("#2_DateTab").html(ObjectData.Days[2].Date);
            }
            else
            {
                $$("#2_DateTab").html("---");
            }


            // todo: check the date to make the selection based on the date.
            var searchData = GetLocalDataObject("ticketSearchData");
            if (ObjectData.Days.length > 1 && searchData.ReturnDate == ObjectData.Days[1].Date)
            {
                fillTripsList(ObjectData.Days[1].Journies, direction);
                var numberOfTrips = ObjectData.Days[1].Journies.length;
                $$("#0_DateTab").parent().removeClass("tabselected");
                $$("#0_DateTab").parent().addClass("tabnotselected");
                $$("#1_DateTab").parent().addClass("tabselected");
                $$("#1_DateTab").parent().removeClass("tabnotselected");
                $$("#2_DateTab").parent().removeClass("tabselected");
                $$("#2_DateTab").parent().addClass("tabnotselected");
            }
            else if (ObjectData.Days.length > 0)
            {
                fillTripsList(ObjectData.Days[0].Journies, direction);
                var numberOfTrips = ObjectData.Days[0].Journies.length;
                $$("#0_DateTab").parent().addClass("tabselected");
                $$("#0_DateTab").parent().removeClass("tabnotselected");
                $$("#1_DateTab").parent().removeClass("tabselected");
                $$("#1_DateTab").parent().addClass("tabnotselected");
                $$("#2_DateTab").parent().removeClass("tabselected");
                $$("#2_DateTab").parent().addClass("tabnotselected");
            }
        }
        else
        {
            myApp.alert(GetResourceText("NoTripsFound"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }

        myApp.hidePreloader(GetResourceText("Loading"));
    }

    // event handler for clicking an trip price
    $$(".trips-list-block").on('click', '.btn-standard-price', function ()
    {
        var journyID = $$(this).data("journeyid");
        var selectedIndex = Number($$(this).data("index"));
        if (selectedTab == "Out")
        {
            // set the out booking information.
            outBooking =
            {
                "JourneyID": journyID,
                "OfferID": "#;"
            };

            // get the full details of the selected journy
            var dayTrips = GetLocalDataObject("DayTrips");

            // add the Out Journy details to the local storage. 
            SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);

            bookingList = GetLocalDataObject("TripBookList");
            bookingList[0] = outBooking;

            // in case it was one way trip, move to the next screen
            if ((GetLocalData("ReservationType") == "OneWay"))
            {
                SaveLocalObject("TripBookList", bookingList);
                //mainView.router.load({
                //    url: 'PassengersInfo.html'
                //});
                mainView.router.load({
                    url: 'FirstSummry.html'
                });
            }
            else
            {
                SaveLocalObject("TripBookList", bookingList);
                // show message to tell the user that he/she must select the  return trip .
                //myApp.alert(GetResourceText("selectAllTrips"), GetResourceText("alert"), function ()
                //{ 
                //document.body.scrollTop = document.documentElement.scrollTop = 0; 

                myApp.showPreloader(GetResourceText("Loading"));
                setTimeout(function ()
                {
                    myApp.hidePreloader();
                    $$('.page-content').scrollTop(0, 600);
                    $$("#OutTab").removeClass("selected-tab");
                    $$("#OutTab").addClass("not-selected-tab");
                    $$("#ReturnTab").removeClass("not-selected-tab");
                    $$("#ReturnTab").addClass("selected-tab");
                    FillTripScreenData("In");
                    selectedTab = "Return";
                }, 1200);

                //});

            }
        }

        else
        {
            var selectedIndex = Number($$(this).data("index"));
            // set the return booking information.
            retBooking =
            {
                "JourneyID": journyID,
                "OfferID": "#;"
            };
            // get the full details of the selected journy
            var dayTrips = GetLocalDataObject("DayTrips");


            // add the return Journy details to the local storage. 
            SaveLocalObject("retJournyFullData", dayTrips[selectedIndex]);
            bookingList = GetLocalDataObject("TripBookList");
            bookingList[1] = retBooking;


            SaveLocalObject("TripBookList", bookingList);
            //mainView.router.load({
            //    url: 'PassengersInfo.html'
            //});
            mainView.router.load({
                url: 'FirstSummry.html'
            });

        }
    });

    // event handler for clicking an trip price
    $$(".trips-list-block").on('click', '.btn-discount-price', function ()
    {
        var journyID = $$(this).data("journeyid");
        var offerID = $$(this).data("OfferId");
        var selectedIndex = Number($$(this).data("index"));

        runDiscountLogic(journyID, offerID, selectedIndex);

    });


    function runDiscountLogic(journyID, offerID, selectedIndex)
    {

        if (selectedTab == "Out")
        {
            // get the full details of the selected journy
            var dayTrips = GetLocalDataObject("DayTrips");
            var selectedTrip = dayTrips[selectedIndex];
            if (selectedTrip.IsRefundable == false || selectedTrip.IsTransferable == false)
            {
                var message = "";
                if (selectedTrip.IsRefundable == false)
                {
                    message += GetResourceText("discountConfirmationRefund") + "</br> ";
                }
                if (selectedTrip.IsTransferable == false)
                {
                    message += GetResourceText("discountConfirmationTrans");
                }

                myApp.confirm(message, GetResourceText("TicketTirms"), function ()
                {
                    // set the out booking information.
                    outBooking =
                    {
                        "JourneyID": journyID,
                        "OfferID": offerID
                    };


                    // add the Out Journy details to the local storage. 
                    SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);



                    bookingList = GetLocalDataObject("TripBookList");

                    bookingList[0] = outBooking;

                    // in case it was a one way trip move to the next page
                    if ((GetLocalData("ReservationType") == "OneWay"))
                    {
                        SaveLocalObject("TripBookList", bookingList);
                        //mainView.router.load({
                        //    url: 'PassengersInfo.html'
                        //});
                        mainView.router.load({
                            url: 'FirstSummry.html'
                        });
                    }
                    else
                    {
                        SaveLocalObject("TripBookList", bookingList);
                        // show message to tell the user that he/she must select the  return trip .
                        //myApp.alert(GetResourceText("selectAllTrips"), GetResourceText("alert"), function ()
                        //{
                        myApp.showPreloader(GetResourceText("Loading"));
                        setTimeout(function ()
                        {
                            myApp.hidePreloader();
                            $$('.page-content').scrollTop(0, 600);
                            $$("#OutTab").removeClass("selected-tab");
                            $$("#OutTab").addClass("not-selected-tab");
                            $$("#ReturnTab").removeClass("not-selected-tab");
                            $$("#ReturnTab").addClass("selected-tab");
                            FillTripScreenData("In");
                            selectedTab = "Return";
                        }, 1200);
                        //});

                    }
                });
                $$(".modal-button").text(GetResourceText('CancelText'));
                $$(".modal-button.modal-button-bold").text(GetResourceText('OkText'));
            }
            else
            {
                // set the out booking information.
                outBooking =
                {
                    "JourneyID": journyID,
                    "OfferID": offerID
                };


                // add the Out Journy details to the local storage. 
                SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);



                bookingList = GetLocalDataObject("TripBookList");

                bookingList[0] = outBooking;

                // in case it was a one way trip move to the next page
                if ((GetLocalData("ReservationType") == "OneWay"))
                {
                    SaveLocalObject("TripBookList", bookingList);
                    //mainView.router.load({
                    //    url: 'PassengersInfo.html'
                    //});
                    mainView.router.load({
                        url: 'FirstSummry.html'
                    });
                }
                else
                {
                    SaveLocalObject("TripBookList", bookingList);

                    myApp.showPreloader(GetResourceText("Loading"));
                    setTimeout(function ()
                    {
                        myApp.hidePreloader();
                        $$('.page-content').scrollTop(0, 600);
                        $$("#OutTab").removeClass("selected-tab");
                        $$("#OutTab").addClass("not-selected-tab");
                        $$("#ReturnTab").removeClass("not-selected-tab");
                        $$("#ReturnTab").addClass("selected-tab");
                        FillTripScreenData("In");
                        selectedTab = "Return";

                    }, 1200);
                }
            }

        }

        else
        {
            // set the return booking information.
            retBooking =
            {
                "JourneyID": journyID,
                "OfferID": offerID
            };
            // get the full details of the selected journy
            var dayTrips = GetLocalDataObject("DayTrips");


            // add the return Journy details to the local storage. 
            SaveLocalObject("retJournyFullData", dayTrips[selectedIndex]);
            bookingList = GetLocalDataObject("TripBookList");
            bookingList[1] = retBooking;

            SaveLocalObject("TripBookList", bookingList);
            //mainView.router.load({
            //    url: 'PassengersInfo.html'
            //});
            mainView.router.load({
                url: 'FirstSummry.html'
            });

        }
    }

    var data = GetLocalDataObject("OutWordTabData");

    $$("#lblTripsCities").text(data.DepartureStation.City + ", " + data.ArrivalStation.City);
    if (data.Days.length > 0)
    {
        $$("#0_DateTab").text(data.Days[0].Date);
    }

    if (data.Days[1])
    {
        $$("#1_DateTab").text(data.Days[1].Date);
    }
    if (data.Days[2])
    {
        $$("#2_DateTab").text(data.Days[2].Date);
    }

    $$("#lblFromStation").text(data.DepartureStation.Name);
    $$("#lblToStation").text(data.ArrivalStation.Name);
    var ticketSearchData = GetLocalDataObject("ticketSearchData");
    var passengersCounts = {};
    if (ticketSearchData && ticketSearchData != null)
    {
        passengersCounts.adultCount = ticketSearchData.Passengers.AdultsCount;
        passengersCounts.childrenCount = ticketSearchData.Passengers.ChildrenCount;
        passengersCounts.infantsCount = ticketSearchData.Passengers.InfantsCount;
        $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");
    }

    var childAndInfText = "";
    if (passengersCounts.childrenCount > 0)
    {
        childAndInfText = childAndInfText + "," + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + ") ";

    }
    if (passengersCounts.infantsCount > 0)
    {
        childAndInfText = childAndInfText + "," + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")";
    }

    $$("#Nopass").text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + ") " + childAndInfText);

    if (GetLocalDataObject("ticketSearchData").DepartureDate == data.Days[0].Date)
    {//tabnotselected
        $$("#0_DateTab").parent().addClass("tabselected");
        $$("#0_DateTab").parent().removeClass("tabnotselected");
        $$("#1_DateTab").parent().removeClass("tabselected");
        fillTripsList(data.Days[0].Journies, "Out");
    }
    else if (data && data.Days.length > 1)
    {
        fillTripsList(data.Days[1].Journies, "Out");
    }
    else if (data && data.Days.length == 1)
    {
        $$("#0_DateTab").parent().addClass("tabselected");
        $$("#0_DateTab").parent().removeClass("tabnotselected");
        $$("#1_DateTab").parent().removeClass("tabselected");
        fillTripsList(data.Days[0].Journies, "Out");
    }

    var myList;

    function fillTripsList(tripsList, direction)
    {
        var lblDuration = GetResourceText("Duration");
        var imgArClassName = GetLocalData("imgLanguageClass");
        var imageSource = "img/goingbus.png";
        var cssDirection = "";
        if (direction != "Out")
        {

            cssDirection = " direction:rtl !important;";
            if (GetApplicationLanguage() == "ar")
            {
                cssDirection = " direction:ltr !important; "
            }

            var journyInfo = GetLocalDataObject("OutJournyFullData");
            var tripBookingInfo = GetLocalDataObject("TripBookList");
            var offerId = tripBookingInfo[0].OfferID;

            imageSource = "img/returnArrow.png";
            var displayOfferOnly = false;
            var isSlectedOffer = false;
            var isLinkedOffer = false;
            if (offerId.length > 2)
            {
                isSlectedOffer = true;
            }
            if (journyInfo.IsLinkedOffer)
            {
                isLinkedOffer = true;
            }

            if (journyInfo.IsLinkedOffer && offerId.length > 2)
            {
                var tripsQueryOffer = JSLINQ(tripsList).Where(function (item) { return item.IsLinkedOffer && item.OfferId == offerId; });
                tripsList = tripsQueryOffer.items;
                displayOfferOnly = true;
            }
            else if (journyInfo.IsLinkedOffer == false)
            {
                var tripsQueryOffer = JSLINQ(tripsList).Where(function (item) { return item.IsLinkedOffer == false; });
                tripsList = tripsQueryOffer.items;
            }
            var Trip1ArrivalTime = GetFormatedDate(journyInfo.ArrivalDate);
            Trip1ArrivalTime.setHours(journyInfo.ArrivalTime.split(":")[0]);
            Trip1ArrivalTime.setMinutes(journyInfo.ArrivalTime.split(":")[1]);

            if (tripsList.length > 0 && tripsList[0].Trips[0].DepartureDate == journyInfo.ArrivalDate)
            {
                var tripsQueryTime = JSLINQ(tripsList).Where(function (item)
                {
                    var Trip2DepartTime = GetFormatedDate(item.Trips[0].DepartureDate);
                    Trip2DepartTime.setHours(item.DepartureTime.split(":")[0]);
                    Trip2DepartTime.setMinutes(item.DepartureTime.split(":")[1]);
                    return (Trip2DepartTime - Trip1ArrivalTime) > 0;
                });
                tripsList = tripsQueryTime.items;
            }
        }
        SaveLocalObject("DayTrips", tripsList);
        $$(".trips-subtitle-1").text(GetResourceText("tripsFound").replace("##", tripsList.length));
        $$("#list-trips-container").html("");
        var listHtml = "";
        for (i = 0; i < tripsList.length ; i++)
        {

            var item = tripsList[i];
            var index = i;

            var transitHeader = GetResourceText("transitHeader");
            var servicesHeader = GetResourceText("servicesHeader");
            var lblMeals = GetResourceText("lblMeals");
            var lblChargres = GetResourceText("lblChargres");
            var lblrefreshments = GetResourceText("lblrefreshments");
            var lblDirect = GetResourceText("lblDirect");
            var lblNewspapers = GetResourceText("lblNewspapers");
            var transitHtml = "";
            var lblSAR = GetResourceText("SAR");
            var lblHours = GetResourceText("lblHours");


            // transit section 
            if (item.Trips.length > 1)
            {
                imageSource = "img/goingbusTrans.png";
                if (direction != "Out")
                {
                    imageSource = "img/returnArrowTrans.png";
                }

                transitHtml = '<div class="content-block accordion-list custom-accordion" style="padding:0px; margin-top: 5px;  margin-bottom: 1px;"> ' +
                                '<div class="accordion-item">' +
                                    '<div class="row accordion-item-toggle">' +
                                       '<div class="col-100 trip-info-blackTitle " style="background-color: #F5E5A1; color: black;"> ' +
                                        '<i class="icon icon-form-aboutus" style ="margin-right:3px ; margin-left:3px"></i>' +
                                         transitHeader +
                                       '</div>      ' +
                                    '</div>          ' +
                                    '<div class="accordion-item-content">';
                $$.each(item.Trips, function (index, value)
                {
                    transitHtml = transitHtml +
                 '<div class="row"> ' +
                     '<div class ="col-50 departDirection" style="font-size: 13px;">' +
                          value.DepartureStation.Name +
                     '</div>' +
                     '<div class ="col-50 arrivelDirection" style="font-size: 13px; ">' +
                          value.ArrivalStation.Name +
                     '</div>' +
                '</div>' +
                '<div class="row" style="border-bottom: solid 1px #eeeeee;"> ' +
                    '<div class ="col-20"  style="font-size: 13px; text-align:center">' +
                        value.DepartureTime +
                    '</div>' +
                    '<div class="col-60" style="text-align:center"><img src="img/goingbus.png" alt="Trip" class="trip-go-img ' + imgArClassName + '" style ="width:90%" /> </div>' +
                '<div class ="col-20"  style="font-size: 13px;  text-align:center">' +
                     value.ArrivalTime +
                '</div>' +
             '</div>';
                });
                transitHtml = transitHtml + '</div> </div></div>';
            }
            var myTestValue = transitHtml;
            var servicesHtmll = "";

            if (item.TripServices.HasRefreshments || item.TripServices.HasMeals || item.TripServices.HasChargers || item.TripServices.IsDirectNoneStop || item.TripServices.HasNewspapers)
            {
                var rowColCounter = 0;
                servicesHtmll = '<div class="content-block accordion-list custom-accordion" style="padding:0px; margin-top: 5px;  margin-bottom: 1px;"> ' +
                                '<div class="accordion-item">' +
                                    '<div class="row accordion-item-toggle">' +
                                       '<div class="col-100   trip-info-blackTitle " style ="background-color: #F5E5A1; color: black;"> ' +
                                        '<i class="icon icon-form-aboutus" style ="margin-right:3px ; margin-left:3px"></i>' +

             servicesHeader +
                '</div>      ' +
                                    '</div>          ' +

               '<div class="accordion-item-content">' +
           '<div class="row trip-service"> ';
                if (item.TripServices.HasMeals)
                {
                    servicesHtmll = servicesHtmll +
                        '<div class="col-10 center-text trip-service-icon"><img src="img/meals.png" alt="Alternate Text" />  </div>  ' +
                        '<div class="col-40  trip-service-text"> ' + lblMeals + ' </div>        ';
                    rowColCounter = rowColCounter + 1;
                }

                if (item.TripServices.HasRefreshments)
                {
                    servicesHtmll = servicesHtmll +
                        '<div class="col-10 center-text trip-service-icon"><img src="img/refresh.png" alt="Alternate Text" />  </div>' +
                        '<div class="col-40  trip-service-text"> ' + lblrefreshments + ' </div> ';
                    rowColCounter = rowColCounter + 1;
                    if (rowColCounter > 1)
                    {
                        servicesHtmll = servicesHtmll + ' </div>   ' +
                                    '<div class="row trip-service"> ';
                        rowColCounter = 0;
                    }
                }

                if (item.TripServices.HasChargers)
                {
                    servicesHtmll = servicesHtmll +
                      '<div class="col-10 center-text trip-service-icon"> <img src="img/charger.png" alt="Alternate Text" /> </div>' +
                      ' <div class="col-40 trip-service-text "> ' + lblChargres + ' </div>     ';
                    rowColCounter = rowColCounter + 1;
                    if (rowColCounter > 1)
                    {
                        servicesHtmll = servicesHtmll + ' </div>   ' +
                                    '<div class="row trip-service"> ';
                        rowColCounter = 0;
                    }
                }
                if (item.TripServices.IsDirectNoneStop)
                {
                    servicesHtmll = servicesHtmll +
                       '           <div class="col-10 center-text trip-service-icon"> <img src="img/directtrip.png" alt="Alternate Text" /> </div>         ' +
                 '           <div class="col-40 trip-service-text "> ' + lblDirect + ' </div>  ';
                    rowColCounter = rowColCounter + 1;
                    if (rowColCounter > 1)
                    {
                        servicesHtmll = servicesHtmll + ' </div>   ' +
                                    '<div class="row trip-service"> ';
                        rowColCounter = 0;
                    }
                }
                if (item.TripServices.HasNewspapers)
                {
                    servicesHtmll = servicesHtmll +
                        '<div class="col-10 center-text trip-service-icon"><img src="img/newspaper.png" alt="Alternate Text" />  </div>          ' +
                        '<div class="col-40  trip-service-text">' + lblNewspapers + '</div>     ';
                    rowColCounter = rowColCounter + 1;
                    if (rowColCounter > 1)
                    {
                        servicesHtmll = servicesHtmll + ' </div>';
                        rowColCounter = 0;
                    }
                }
                if (rowColCounter == 1)
                {
                    servicesHtmll = servicesHtmll + '<div class="col-50">&nbsp</div> </div>   '
                    rowColCounter = 0;
                }
                servicesHtmll = servicesHtmll + ' </div></div>';
            }


            var standardPriceText = GetResourceText("lblStabdardPrice");
            var discountpriceText = GetResourceText("lblDiscountPrice");
            var priceDivHtml = "";

            if (item.HasOffer)
            {
                if (displayOfferOnly)
                {
                    priceDivHtml = '<div class=" bg-color-s-light-orange row no-gutter btn-discount-price"   data-JourneyID ="' + item.JourneyID + '" data-OfferId ="' + item.OfferId + '" data-index ="' + index + '">    ' +
                      '           <div class="col-50 " >    ' +
                      '               <div class="row">   ' +
                      '                   <div class="col-100 standard-price-full">        ' +
                         discountpriceText +
                      '                   </div>          ' +
                     '               </div>  ' +
                      '           </div>      ' +
                      '           <div class="col-50 bg-color-s-light-orange">    ' +
                      '               <div class="row">   ' +
                      '                   <div class="col-80 standard-price-full">        ' +
                    +item.DiscountFee + lblSAR +
                      '                   </div>          ' +
                      '                   <div class="col-20">        ' +
                      '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img ' + imgArClassName + '" />' +
                      '                   </div>          ' +
                      '               </div>  ' +
                      '           </div>      ' +
                      '       </div>          ' +
                      '   </div>              ' +
                              '    </div> ' +
                      '</div>    ';
                }
                else if (isSlectedOffer == false && isLinkedOffer)
                {
                    priceDivHtml = '<div class=" bg-color-s-light-orange row no-gutter btn-standard-price" data-JourneyID ="' + item.JourneyID + '"  data-index ="' + index + '" style="margin-bottom: -1px;  margin-bottom: -1px; border-bottom: 3px #927515 solid; "> ' +
                      '           <div class="col-50 " >    ' +
                      '               <div class="row">   ' +
                      '                   <div class="col-100 standard-price-full">        ' +
                                            standardPriceText +
                      '                   </div>          ' +
                     '               </div>  ' +
                      '           </div>      ' +
                      '           <div class="col-50 bg-color-s-light-orange">    ' +
                      '               <div class="row">   ' +
                      '                   <div class="col-80 standard-price-full">        ' +
                      +item.StandardFee + lblSAR +
                      '                   </div>          ' +
                      '                   <div class="col-20">        ' +
                      '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img ' + imgArClassName + '" />' +
                      '                   </div>          ' +
                      '               </div>  ' +
                      '           </div>      ' +
                      '       </div>          ' +
                      '   </div>              ' +
                              '    </div> ' +
                      '</div>    ';
                }
                else
                {
                    priceDivHtml = '<div class="row no-gutter" style="margin-bottom: -1px; margin-bottom: -1px; border-bottom: 3px #927515 solid;"> ' +
                            '           <div class="col-50 bg-color-s-light-orange btn-standard-price" data-JourneyID ="' + item.JourneyID + '"  data-index ="' + index + '">    ' +
                            '               <div class="row">   ' +
                            '                   <div class="col-80 ">        ' +
                            '                       <div class="row">       ' +
                            '                           <div class="col-100 color-white center-text trip-service-text1">   ' +
                           standardPriceText +
                            '                           </div>  ' +
                            '                       </div>      ' +
                            '                       <div class="row"><div class="col-100 color-white center-text  trip-service-text2"  >' + item.StandardFee + lblSAR + '</div></div>      ' +
                            '                   </div>          ' +
                            '                   <div class="col-20">        ' +
                            '                       <img src="img/rightarrow.png" alt="Alternate Text" class="trip-service-button-img ' + imgArClassName + '" />           ' +
                            '                   </div>          ' +
                            '               </div>  ' +
                            '           </div>      ' +
                            '           <div class="col-50 bg-color-s-dark-orange2 btn-discount-price"  data-JourneyID ="' + item.JourneyID + '" data-OfferId ="' + item.OfferId + '" data-index ="' + index + '">    ' +
                            '               <div class="row">   ' +
                            '                   <div class="col-80 ">        ' +
                            '                       <div class="row">       ' +
                            '                           <div class="col-100 color-white center-text  trip-service-text1">   ' +
                            discountpriceText +
                            '                           </div>  ' +
                            '                       </div>      ' +
                            '                       <div class="row"><div class="col-100  color-white center-text  trip-service-text2" >' + item.DiscountFee + lblSAR + '</div></div>     ' +
                            '                   </div>          ' +
                            '                   <div class="col-20">        ' +
                            '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img  ' + imgArClassName + '" />' +
                            '                   </div>          ' +
                            '               </div>  ' +
                            '           </div>      ' +
                            '       </div>          ' +
                            '   </div>              ' +
                                    '    </div> ' +
                                    '</div>    ';
                }
            }
            else
            {
                priceDivHtml = '<div class=" bg-color-s-light-orange row no-gutter btn-standard-price" data-JourneyID ="' + item.JourneyID + '"  data-index ="' + index + '" style="margin-bottom: -1px;  margin-bottom: -1px; border-bottom: 3px #927515 solid; "> ' +
                        '           <div class="col-50 " >    ' +
                        '               <div class="row">   ' +
                        '                   <div class="col-100 standard-price-full">        ' +
                                              standardPriceText +
                        '                   </div>          ' +
                       '               </div>  ' +
                        '           </div>      ' +
                        '           <div class="col-50 bg-color-s-light-orange">    ' +
                        '               <div class="row">   ' +
                        '                   <div class="col-80 standard-price-full">        ' +
                        +item.StandardFee + lblSAR +
                        '                   </div>          ' +
                        '                   <div class="col-20">        ' +
                        '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img ' + imgArClassName + '" />' +
                        '                   </div>          ' +
                        '               </div>  ' +
                        '           </div>      ' +
                        '       </div>          ' +
                        '   </div>              ' +
                                '    </div> ' +
                        '</div>    ';
            }


            listHtml = listHtml + '<li style="padding-bottom: 15px;">' +
                '<div class="content-container no-bottom-margins container-box-shaddow" style="z-index:1000 !important; border-radius: 8px;">' +
             '<div class="row trip-tripinfo">' +
             '<div class="col-100">      ' +

             '<div class="row">  ' +
             '<div class="col-100 center-text"><img src="' + imageSource + '" alt="Trip" class="trip-go-img ' + imgArClassName + '" /></div>        ' +
             '</div>          ' +
             '<div class="row" style="' + cssDirection + '">           ' +
             '  <div class="col-33 center-text font-size-14"> ' + item.DepartureTime + '  </div> ' +
             '  <div class="col-33 center-text font-size-14" style="font-weight: 300;">' + lblDuration + '</div>     ' +
             '  <div class="col-33 center-text font-size-14">' + item.ArrivalTime + '</div>   ' +
             '</div>          ' +
             '  <div class="row"  style="' + cssDirection + '">           ' +
             '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + item.Trips[0].DepartureDate + '</div>         ' +
             '  <div class="col-33 center-text font-size-14">' + item.Duration + lblHours + '</div>     ' +
             '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + item.Trips[item.Trips.length - 1].ArrivalDate + '</div>         ' +
             '  </div>          ' +
                transitHtml +
                servicesHtmll +
                priceDivHtml +
                 '</li>';

        }
        $$("#list-trips-container").html(listHtml);
    }


});
/************************ End of trips *****************************/

/***********************Passengers details***************************/
myApp.onPageInit('PassengersInfo', function (page)
{
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

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo");
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

    //Fill nationalities setup data. 
    GetAllNationalities();

    //Button post reservation 
    $$('#btnPostReservation').on('click', function ()
    {
        //for test only
        //mainView.router.load({ url: 'Trip-summry.html' });

        var reservationPostBody = collectReservationsInfo();
        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateTripsSummaryPost(reservationPostBody);

        if (validationResult == ValidationSucessVal)
        {
            savePassengerContactInfo();

            SaveLocalData("ReservationReqBody", reservationPostBody);

            POSTReservations(reservationPostBody);
        }
        else
        {
            if (validationResult.indexOf("ErrorPassData_") >= 0)
            {
                var passName = validationResult.replace("ErrorPassData_", "");
                myApp.alert(GetResourceText("ErrorPassData") + " " + passName, GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
            else
            {
                var redLinks = $$('.validate').filter(function (index, el)
                {

                    return $$(this).attr('data-validation') == validationResult;
                });
                $$("." + validationResult).addClass("Validation-error");
                redLinks.addClass("Validation-error");
                myApp.alert(GetResourceText(validationResult), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));

            }
        }
    });

    //add passenger details click event handler. 
    $$('.passengers-lists').on('click', '.add-passenger-details', function ()
    {
        savePassengerContactInfo();

        var passUpdateDetails =
        {
            itemIndex: $$(this).data("index"),
            itemType: $$(this).data("type")
        };

        SaveLocalObject("passengerUpdateDetials", passUpdateDetails);
        SaveLocalData("PassengerUpdateType", "Update");
        mainView.router.load({
            url: 'PassengerfillInfo.html'
        });
    });

    $$('.passengers-lists').on('click', '.search-passenger-details', function ()
    {
        savePassengerContactInfo();

        var passUpdateDetails =
        {
            itemIndex: $$(this).data("index"),
            itemType: $$(this).data("type")
        };

        SaveLocalObject("passengerUpdateDetials", passUpdateDetails);
        SaveLocalData("PassengerUpdateType", "Search");
        mainView.router.load({
            url: 'PassengerfillInfo.html'
        });
    });

    function savePassengerContactInfo()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        var countryCode = "";
        var countryCodeEn = "";
        var telCode;
        if (appLang == 'ar')
        {
            countryCode = $$("#SmartSelectValuepick").text();
            telCode = $$("#countriesSelectAr").val();
        }
        else
        {
            countryCodeEn = $$("#SmartSelectValuepickEn").text();
            telCode = $$("#countriesSelect").val();
        }
        var contactInfo =
               {
                   telCode: telCode,
                   countryCodeEn: $$("#txtCountryCode").val(),
                   countryCode: $$("#txtCountryCode").val(),
                   phoneNumber: $$("#txtPhoneNUmber").val(),
                   email: $$("#txtEmailAddress").val()
               }
        SaveLocalObject("ReservationcontactInfo", contactInfo);
    }

    $$('.passengers-lists').on('click', '.go-to-fav', function ()
    {
        savePassengerContactInfo();

        var passUpdateDetails =
        {
            itemIndex: $$(this).data("index"),
            itemType: $$(this).data("type")
        };

        SaveLocalObject("passengerUpdateDetials", passUpdateDetails);
        mainView.router.load({
            url: 'favorite_list.html'
        });
    });

    var passInfo = GetLocalDataObject("ticketSearchData");
    if (passInfo == null)
    {
        mainView.router.load({
            url: 'Home.html'
        });
    }
    else
    {
        // get passenger numbers and types . 
        var adultsCount = passInfo.Passengers.AdultsCount;
        var ChildCount = passInfo.Passengers.ChildrenCount;
        var InfCount = passInfo.Passengers.InfantsCount;

        if (adultsCount == 0)
        {
            //Hide Adult List
            $$(".adults-info").css("display", "none");
        }
        if (ChildCount == 0)
        {
            //Hide Children List
            $$(".child-info").css("display", "none");
        }
        if (InfCount == 0)
        {
            //Hide Infants List
            $$(".infants-info").css("display", "none");
        }

        var customerTextLabel = GetResourceText("Customer");
        if (GetLocalDataObject("AdultPassengers") == null || GetLocalDataObject("AdultPassengers").length != adultsCount)
        {
            var adultsArray = [];

            for (i = 0; i < adultsCount; i++)
            {
                var adultInfo =
                {
                    "SAPTCOID": "",
                    "Name": customerTextLabel + " " + (i + 1),
                    "IDNumber": "",
                    "IDType": "1",
                    "IDVersion": 1,
                    "DateOfBirth": "",
                    "Gender": "1",
                    "NationalityID": "",
                    "Type": "Adult",
                    "isCompleted": false

                }
                adultsArray.push(adultInfo);
            }
            SaveLocalObject("AdultPassengers", adultsArray);

        }
        fillAdultsList(GetLocalDataObject("AdultPassengers"));

        var childrenArray = GetLocalDataObject("ChildsArray");
        if (childrenArray == null || childrenArray.length != ChildCount)
        {
            childrenArray = [];
            for (i = 0; i < ChildCount; i++)
            {
                var ChildInfo =
                {
                    "SAPTCOID": "",
                    "Name": customerTextLabel + " " + (i + 1),
                    "IDNumber": "",
                    "IDType": "1",
                    "IDVersion": 1,
                    "DateOfBirth": "",
                    "Gender": "1",
                    "NationalityID": "",
                    "Type": "Child",
                    "isCompleted": false
                };
                childrenArray.push(ChildInfo);
            }
            SaveLocalObject("ChildsArray", childrenArray);
        }
        fillChildrenList(GetLocalDataObject("ChildsArray"));

        var InfArray = GetLocalDataObject("InfantsPassengersArray");
        if (InfArray == null || InfArray.length != InfCount)
        {
            InfArray = [];
            for (i = 0; i < InfCount; i++)
            {
                var InfantsInfo =
                {
                    "SAPTCOID": "",
                    "Name": customerTextLabel + " " + (i + 1),
                    "IDNumber": "",
                    "IDType": "1",
                    "IDVersion": 1,
                    "DateOfBirth": "",
                    "Gender": "1",
                    "NationalityID": "",
                    "Type": "Infant",
                    "isCompleted": false
                };
                InfArray.push(InfantsInfo);
            }
            SaveLocalObject("InfantsPassengersArray", InfArray);

        }
        fillInfantsList(GetLocalDataObject("InfantsPassengersArray"));

    }
    function POSTReservations(postData)
    {
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Reservation/Reservations";


        $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            dataType: 'json',
            contentType: 'application/json',
            data: postData,
            headers:
            {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },

            success: function (data, status, xhr)
            {
                myApp.hidePreloader(GetResourceText("Loading"));
                if (data.Results)
                {
                    // check in case the returned data contains tickets
                    SaveLocalObject("ReservationSummary", data);
                    var reservationInfo = GetLocalDataObject("ReservationReqBody");
                    var deviceData = GetLocalDataObject("deviceInfo");
                    var deviceInfo = {
                        "ReservationNumber": data.Results.PNR,
                        "Email": reservationInfo.Email,
                        "MobileNumber": data.Results.MobileNumber,
                        "MobileType": deviceData.MobileType,
                        "MobileID": deviceData.MobileID,
                        "OS": deviceData.OS,
                        "Version": deviceData.Version,
                        "ApplicationVersion": deviceData.ApplicationVersion,
                        "Service": "PostReservation"
                    };

                    PostUserDevice(deviceInfo);
                    mainView.router.load({
                        url: 'Trip-summry.html'
                    });
                }
            },
            error: function (data)
            {
                myApp.hidePreloader("Loading");
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
    }
});
/*******************End  of Passengers details*************************/

/************************** Nationalities **********************************/

function fillNationalities()
{
    var nationalitiesList = GetLocalDataObject("NationalitiesList" + GetServiceLanguage());
    if (nationalitiesList != null)
    {
        var nationalityCat = GetLocalData("SelectedIdType");
        if (nationalityCat == "IqamaID")
        {
            var nationalitiesQuery = JSLINQ(nationalitiesList.Results).Where(function (item) { return item.Type == "Normal" });
            nationalitiesList.Results = nationalitiesQuery.items;
        }
        if (nationalityCat == "GCC")
        {
            var nationalitiesQuery = JSLINQ(nationalitiesList.Results).Where(function (item) { return item.Type == "GCC"; });
            nationalitiesList.Results = nationalitiesQuery.items;
        }

        var natinoalityList = myApp.virtualList('.list-block.virtual-list', {
            // Array with items data
            items: nationalitiesList.Results,
            // Custom render function to render item's HTML
            renderItem: function (index, item)
            {
                return '<li class="item-content">' +
                      '<div class="item-inner clickable-Nationality" data-nationalityId =' + item.ID + '>' +
                          '<div class="item-title" >' + item.Name + '</div>' +
'</div>' +
                     '</li>';
            },
            searchAll: function (query, items)
            {
                var foundItems = [];

                for (var i = 0; i < items.length; i++)
                {
                    // Check if title contains query string
                    if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) == 0)
                        foundItems.push(i);
                }

                for (var i = 0; i < items.length; i++)
                {
                    if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) > 0)
                        foundItems.push(i);
                }


                // Return array with indexes of matched items
                return foundItems;
            }
        });
    }
}

function SaveNatiotnlaitySelection(selectionName, selectionId)
{
    var objectNationality =
    {
        nationalityName: selectionName,
        natioalityID: selectionId
    }
    SaveLocalObject("SelectedNationality", objectNationality);
    mainView.router.reloadPreviousPage('PassengerfillInfo.html');
    mainView.router.back({
        url: 'PassengerfillInfo.html'
    });
}

myApp.onPageInit('nationalities', function (page)
{
    // on nationality click event
    $$(document).on('click', '.clickable-Nationality', function ()
    {
        var nationlaityID = $$(this).data('nationalityId');
        var nationalityName = $$(this).text();
        SaveNatiotnlaitySelection(nationalityName, nationlaityID);
    });

    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });
    fillNationalities();
});

function GetAllNationalities()
{
    if (GetLocalDataObject("NationalitiesList" + GetServiceLanguage()) == null)
    {
        myApp.showPreloader(GetResourceText("Loading"));
        $$.ajax({
            url: 'https://mobile.saptco.com.sa/Reservation/Nationalities',
            headers: {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },
            success: function (data, status, xhr)
            {
                myApp.hidePreloader();
                var objectData = JSON.parse(data);
                SaveLocalObject("NationalitiesList" + GetServiceLanguage(), objectData);

            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
    }
}
/**********************End of Nationalities**************************/

/**********************Passenger Fill info **************************/
//passenger-nationality-click


var today = new Date();

var yearsArr = [];
for (var i = 1915; i <= 2015; i++) { yearsArr.push(i); }

myApp.onPageInit('PassengerfillInfo', function (page)
{
    //passenger-BirthDate



    $$(".selectIdType").on("change", function (e)
    {
        var selectedValue = $$(".selectIdType").val();
        SaveLocalData("SelectedIdType", selectedValue);

        if (selectedValue == "NationalID")
        {
            // hide the nationalty field and set the value of the nationality by default to Saudi.
            $$("#liNationalityView").css("display", "none");
            $$("#NationalityId").val("1");
        }
        else
        {
            //show the field and and clear default. 
            $$("#liNationalityView").css("display", "block");
            $$("#NationalityId").val("0");
        }
    });

    function onSuccess(date)
    {
        var saptcoDate = GetSaptcoFormatedDate(date);
        $$(".datePickerItem").val(saptcoDate);
    }

    function onError(error)
    {
    }

    $$(".datePickerItem").on("click", function ()
    {
        var selectedDate = new Date();
        var birthDateVal = $$("#calendar-BirthDatePassenger").val();
        if (birthDateVal.split("-").length > 1)
        {
            selectedDate = GetFormatedDate(birthDateVal);
        }
        var options = {
            date: selectedDate,
            mode: 'date',
            local: GetResourceText("localizeDescription")
        };
        datePicker.show(options, onSuccess, onError);
    });

    $$("#show-datePicketrClass").on("click", function ()
    {
        var selectedDate = new Date();
        var birthDateVal = $$("#calendar-BirthDatePassenger").val();
        if (birthDateVal.split("-").length > 1)
        {
            selectedDate = GetFormatedDate(birthDateVal);
        }
        var options = {
            date: selectedDate,
            mode: 'date',
            local: GetResourceText("localizeDescription")
        };

        datePicker.show(options, onSuccess, onError);
    });

    var pickerDevice = myApp.picker({
        input: '#calendar-BirthDate-picker',

        toolbar: false,
        rotateEffect: true,
        closeByOutsideClick: true,

        value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

        onChange: function (picker, values, displayValues)
        {
            var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
            if (values[1] > daysInMonth)
            {
                picker.cols[1].setValue(daysInMonth);
            }
        },

        formatValue: function (p, values)
        {
            return values[0] + '-' + values[1] + '-' + values[2];
        },
        cols: [
       // Months
       {
           values: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ')
       },
       // Days
       {
           values: [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
       },
       // Years
       {
           values: yearsArr,
       }
        ]
    });

    var updatedPassType = GetLocalDataObject("passengerUpdateDetials");
    var itemIndex = updatedPassType.itemIndex;
    var updatedItem = {
    };

    if (GetLocalData("PassengerUpdateType") == "Search")
    {
        $$("#SearchView").css("display", "block");
        $$("#PassengerDetalies").addClass("disabled");
    }
    else
    {
        $$("#SearchView").css("display", "none");
        myApp.accordionOpen("#accPassInfo");
        $$("#PassengerDetalies").removeClass("disabled");
        // fill form details.
        fillPassengerDetails();
    }


    // on nationality click event
    $$('.passenger-nationality-click').on('click', function ()
    {
        savePassengerDetails();
        mainView.router.load({
            url: 'nationalities.html'
        });
    });

    // on nationality click event
    $$('#btnSavePassenger').on('click', function ()
    {
        var isUpdated = savePassengerDetails();
        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidatePassengers(updatedItem);
        if (validationResult == ValidationSucessVal)
        {
            updatedItem.isCompleted = true;
            if ($$("#cboAddToFavList").is(':checked'))
            {
                var favList = GetLocalDataObject("favList_" + updatedPassType.itemType);
                var matchingIndex = 0;
                //check for null value.
                if (favList)
                {
                    var isContainUser = false;
                    $$.each(favList, function (index, value)
                    {
                        if (value.IDNumber == updatedItem.IDNumber && value.IDType == updatedItem.IDType)
                        {
                            isContainUser = true;
                            matchingIndex = index;
                        }
                    });

                    if (isContainUser == false)
                    {
                        favList.push(updatedItem);
                    }
                    else
                    {
                        favList[matchingIndex] = updatedItem;
                        SaveLocalObject("favList_" + updatedPassType.itemType, favList[matchingIndex]);
                    }
                }
                else
                {
                    favList = [updatedItem];
                }
                SaveLocalObject("favList_" + updatedPassType.itemType, favList)
            }
            if (isUpdated)
            {
                mainView.router.reloadPreviousPage('PassengersInfo.html');
                mainView.router.back({
                    url: 'PassengersInfo.html'
                });
            }
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationResult), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });

    function savePassengerDetails()
    {
        var formData = myApp.formToJSON("#PassengerDetalies");
        var nationalityCat = GetLocalData("SelectedIdType");

        var passengerArray = [];

        if (updatedPassType.itemType == "adult")
        {
            passengerArray = GetLocalDataObject("AdultPassengers");
        }

        if (updatedPassType.itemType == "child")
        {
            passengerArray = GetLocalDataObject("ChildsArray");
        }

        if (updatedPassType.itemType == "infant")
        {
            passengerArray = GetLocalDataObject("InfantsPassengersArray");
        }
        updatedItem = passengerArray[itemIndex];
        //selectIdType
        //selectGender
        var selectedIdType = $$("#selectIdType").val();
        var selectedGender = $$("#selectGender").val();

        updatedItem.Name = formData.Name;
        updatedItem.DateOfBirth = formData.DateOfBirth;
        updatedItem.Gender = formData.Gender;
        updatedItem.IDNumber = formData.IDNumber;
        updatedItem.IDType = formData.IDType;
        updatedItem.IDVersion = formData.IDVersion;
        var selectedNationality = GetLocalDataObject("SelectedNationality");

        if (selectedNationality != null)
        {
            updatedItem.NationalityID = selectedNationality.natioalityID;
        }

        if (nationalityCat == "NationalID")
        {
            updatedItem.NationalityID = "1";
        }

        var validationResult = ValidatePassengers(updatedItem);
        var passengersquery = JSLINQ(passengerArray).Where(function (item) { return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType); });
        var isUpdated = false;
        if (validationResult == ValidationSucessVal && passengersquery.items.length <= 1)
        {
            updatedItem.isCompleted = true;
            isUpdated = true;
        }
        else
        {
            updatedItem.isCompleted = false;
            if (passengersquery.items.length > 1)
            {
                myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        }

        passengerArray[itemIndex] = updatedItem;

        switch (updatedPassType.itemType)
        {
            case "adult":
                SaveLocalObject("AdultPassengers", passengerArray);
                break;
            case "child":
                SaveLocalObject("ChildsArray", passengerArray);
                break;
            case "infant":
                SaveLocalObject("InfantsPassengersArray", passengerArray);
                break;
        }
        return isUpdated;
    }

    // fill form data. 
    function fillPassengerDetails()
    {
        var itemIndex = updatedPassType.itemIndex;
        var formSavedData = {
        };
        switch (updatedPassType.itemType)
        {
            case "adult":
                formSavedData = GetLocalDataObject("AdultPassengers");

                break;
            case "child":
                formSavedData = GetLocalDataObject("ChildsArray");
                break;
            case "infant":
                formSavedData = GetLocalDataObject("InfantsPassengersArray");
                break;
        }
        updatedItem = formSavedData[itemIndex];

        if (updatedItem.Name.indexOf("Passenger") >= 0 || updatedItem.Name.indexOf("راكب") >= 0)
        {
            updatedItem.Name = "";
        }
        myApp.formFromJSON("#PassengerDetalies", updatedItem);

        // this code will select the dropdown values zzzzzzz. 

        $$("#selectIdType").val(updatedItem.IDType)
        var optionsItems = $$("#selectIdType").children();
        $$.each(optionsItems, function (index, value)
        {
            if (optionsItems[index].selected)
            {
                $$("#txtIDTypeText").text(optionsItems[index].text);
            }
        });

        var optionsItems2 = $$("#selectGender").children();

        $$.each(optionsItems2, function (index, value)
        {
            if (optionsItems2[index].selected)
            {
                $$("#txtGenderText").text(optionsItems2[index].text);
            }
        });

        var nationalityId = updatedItem.NationalityID;

        var nationalities = GetLocalDataObject("NationalitiesList" + GetServiceLanguage()).Results;
        var nationalityQuery = JSLINQ(nationalities).Where(function (item) { return (item.ID == nationalityId); });
        var nationalityName = nationalityQuery.items[0];
        if (nationalityQuery.items.length > 0)
        {
            $$("#lblNationalityName").val(nationalityName.Name);
            var objectNationality =
                       {
                           nationalityName: nationalityName.Name,
                           natioalityID: nationalityId
                       }
            SaveLocalObject("SelectedNationality", objectNationality);
        }
    }

    //intialize calinder calendar-BirthDate
    var calendarDateFormat = myApp.calendar({
        input: '#calendar-BirthDate',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true
    });

    var calendarDateSearch = myApp.calendar({
        input: '#calendar-SearchBirthDate',
        dateFormat: 'dd-mm-yyyy',

        closeOnSelect: true
    });

    $$("#btnSearchCustomer").on("click", function ()
    {
        var formData = myApp.formToJSON("#SearchPassengerDetalies");
        PostCustomerSearch(formData);
    });

    //post customer search zzzz

    function PostCustomerSearch(postData)
    {
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Reservation/customers";
        $$.ajax(
        {
            method: "POST",
            url: urlAjax,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            dataType: "json",
            headers:
            {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },

            success: function (data, status, xhr)
            {
                myApp.hidePreloader();
                // open collapsed info in case the info where found
                myApp.accordionOpen("#accPassInfo");

                myApp.formFromJSON("#PassengerDetalies", data.Results);
                $$("#inputIDVersion").val(data.Results.IDVersion);
                $$("#selectIdType").val(data.Results.IDType)
                var optionsItems = $$("#selectIdType").children();
                $$.each(optionsItems, function (index, value)
                {
                    if (optionsItems[index].selected)
                    {
                        $$("#txtIDTypeText").text(optionsItems[index].text);
                    }
                });

                var optionsItems2 = $$("#selectGender").children();

                $$.each(optionsItems2, function (index, value)
                {
                    if (optionsItems2[index].selected)
                    {
                        $$("#txtGenderText").text(optionsItems2[index].text);
                    }
                });
                var nationalities = GetLocalDataObject("NationalitiesList" + GetServiceLanguage()).Results;
                $$.each(nationalities, function (index, value)
                {
                    if (value.ID == data.Results.NationalityID)
                    {
                        var objectNationality =
                        {
                            nationalityName: value.Name,
                            natioalityID: value.ID
                        }
                        SaveLocalObject("SelectedNationality", objectNationality);
                        $$("#lblNationalityName").val(value.Name);
                    }
                });
            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                myApp.accordionClose("#accPassInfo");
                myApp.alert(GetResourceText("NoResultFoundCustomer"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
    }

});

function PostUserDevice(postData)
{
    var urlAjax = "https://mobile.saptco.com.sa/Reservation/userDevices";
    var dataString = JSON.stringify(postData);
    $$.ajax(
    {
        method: "POST",
        url: urlAjax,
        contentType: 'application/json',
        data: dataString,
        dataType: "json",
        headers:
        {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },

        success: function (data, status, xhr)
        {
            console.log("Device saved");
        },
        error: function (xhr, status)
        {
            console.log("Device failed saved");
        }
    });
}


myApp.onPageAfterBack('nationalities', function (page)
{
    var selectedNationality = GetLocalDataObject("SelectedNationality");

    if (selectedNationality)
    {
        $$("#lblNationalityName").val(selectedNationality.nationalityName);
    }
});
/********************************************************************/
/************************Reservation First Summry *****************************/
myApp.onPageInit('FirstSummry', function (page)
{
    //check the type of the trip and update the form based on the value 


    $$("#divReturnTicketContainer").css("display", "none");
    var journyInfo = GetLocalDataObject("OutJournyFullData");
    var tripsString = "";
    if (journyInfo != null && journyInfo.Trips != null)
    {

        for (var i = 0; i < journyInfo.Trips.length; i++)
        {
            var tripInfo = journyInfo.Trips[i];
            tripsString = tripsString +
         '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px;">      ' +
         '      <div class="row no-gutter">              ' +
         '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
         GetResourceText("PassengerlblGoingTicket") +
         '          </div>              ' +
         '      </div> ' +
         '      <div class="summary-section row">        ' +
         '          <div class="col-100">                ' +
         '              <div class="row no-gutter">      ' +
         '                  <div class="col-20">         ' +
         '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
         '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.DepartureStation.Name + '</h4></div>' +
         '              </div>          ' +
         '          </div>              ' +
         '      </div> ' +
         '      <div class="summary-section row">        ' +
         '          <div class="col-100">                ' +
         '              <div class="row">                ' +
         '                  <div class="col-20">         ' +
         '                      <h5 id="lblTo trip-summary-labels1" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' +
            GetResourceText("PassengerlblTo1") +
           '</h5>  ' +
           '                  </div>      ' +
           '                  <div class="col-80">         ' +
           '                      <h4 id="ArrivalStation_Name" class="trip-summary-labels2" style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.ArrivalStation.Name + '</h4>         ' +
           '                  </div>      ' +
           '              </div>          ' +
           '          </div>              ' +
           '      </div> ' +
           '      <div class="row">       ' +
           '          <div class="col-100 center-text">    ' +
           '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img trip-summary-bus-img ' + GetResourceText("classArabic") + ' " /> ' +
           '          </div>              ' +
           '      </div> ' +
           '      <div class="row">       ' +
           '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + tripInfo.DepartureTime + '  </div>' +
           '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
           '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + tripInfo.ArrivalTime + ' </div>  ' +
           '      </div> ' +
           '      <div class="row">  ' +
           '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="sub_DepartureDate"> ' + tripInfo.DepartureDate + ' </div>    ' +
           '          <div class="col-33 center-text font-size-14 trip-summary-labels1" id="Summary_Duration"> ' + tripInfo.Duration + '  </div>      ' +
           '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="Summary_ArrivalDate"> ' + tripInfo.ArrivalDate + '  </div>  ' +
           '      </div> ' +
           '  </div> </li> '
        }
        $$("#list-OutgoingTrips").html(tripsString);

        if (GetLocalData("ReservationType") != "OneWay")
        {
            //get trip return Journy full information

            var retJournyInfo = GetLocalDataObject("retJournyFullData");

            tripsString = "";
            for (var i = 0; i < retJournyInfo.Trips.length; i++)
            {
                var tripInfo = retJournyInfo.Trips[i];
                tripsString = tripsString +
             '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px;">      ' +
             '      <div class="row no-gutter">              ' +
             '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
             GetResourceText("PassengerlblReturnTi") +
             '          </div>              ' +
             '      </div> ' +
             '      <div class="summary-section row">        ' +
             '          <div class="col-100">                ' +
             '              <div class="row no-gutter">      ' +
             '                  <div class="col-20">         ' +
             '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
             '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.DepartureStation.Name + '</h4></div>' +
             '              </div>          ' +
             '          </div>              ' +
             '      </div> ' +
             '      <div class="summary-section row">        ' +
             '          <div class="col-100">                ' +
             '              <div class="row">                ' +
             '                  <div class="col-20">         ' +
             '                      <h5 id="lblTo trip-summary-labels1" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' +
                GetResourceText("PassengerlblTo1") +
               '</h5>  ' +
               '                  </div>      ' +
               '                  <div class="col-80">         ' +
               '                      <h4 id="ArrivalStation_Name" class="trip-summary-labels2" style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.ArrivalStation.Name + '</h4>         ' +
               '                  </div>      ' +
               '              </div>          ' +
               '          </div>              ' +
               '      </div> ' +
               '      <div class="row">       ' +
               '          <div class="col-100 center-text">    ' +
               '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img trip-summary-bus-img ' + GetResourceText("classArabic") + ' " /> ' +
               '          </div>              ' +
               '      </div> ' +
               '      <div class="row">       ' +
               '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + tripInfo.DepartureTime + '  </div>' +
               '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
               '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + tripInfo.ArrivalTime + ' </div>  ' +
               '      </div> ' +
               '      <div class="row">  ' +
               '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="sub_DepartureDate"> ' + tripInfo.DepartureDate + ' </div>    ' +
               '          <div class="col-33 center-text font-size-14 trip-summary-labels1" id="Summary_Duration"> ' + tripInfo.Duration + '  </div>      ' +
               '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="Summary_ArrivalDate"> ' + tripInfo.ArrivalDate + '  </div>  ' +
               '      </div> ' +
               '  </div> </li> '
            }
            $$("#list-Return").html(tripsString);
        }

    }
    $$("#btn-continue").on("click", function ()
    {
        mainView.router.load({
            url: 'PassengersInfo.html'
        });
    });
});

/************************Reservation summary *****************************/
myApp.onPageInit('tripsummry', function (page)
{
    //check the type of the trip and update the form based on the value 
    var journyInfo = GetLocalDataObject("OutJournyFullData");
    var tripsString = "";
    for (var i = 0; i < journyInfo.Trips.length; i++)
    {
        var tripInfo = journyInfo.Trips[i];
        tripsString = tripsString +
     '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px;">      ' +
     '      <div class="row no-gutter">              ' +
     '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
     GetResourceText("PassengerlblGoingTicket") +
     '          </div>              ' +
     '      </div> ' +
     '      <div class="summary-section row">        ' +
     '          <div class="col-100">                ' +
     '              <div class="row no-gutter">      ' +
     '                  <div class="col-20">         ' +
     '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
     '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.DepartureStation.Name + '</h4></div>' +
     '              </div>          ' +
     '          </div>              ' +
     '      </div> ' +
     '      <div class="summary-section row">        ' +
     '          <div class="col-100">                ' +
     '              <div class="row">                ' +
     '                  <div class="col-20">         ' +
     '                      <h5 id="lblTo trip-summary-labels1" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' +
        GetResourceText("PassengerlblTo1") +
       '</h5>  ' +
       '                  </div>      ' +
       '                  <div class="col-80">         ' +
       '                      <h4 id="ArrivalStation_Name" class="trip-summary-labels2" style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.ArrivalStation.Name + '</h4>         ' +
       '                  </div>      ' +
       '              </div>          ' +
       '          </div>              ' +
       '      </div> ' +
       '      <div class="row">       ' +
       '          <div class="col-100 center-text">    ' +
       '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img trip-summary-bus-img ' + GetResourceText("classArabic") + ' " /> ' +
       '          </div>              ' +
       '      </div> ' +
       '      <div class="row">       ' +
       '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + tripInfo.DepartureTime + '  </div>' +
       '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
       '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + tripInfo.ArrivalTime + ' </div>  ' +
       '      </div> ' +
       '      <div class="row">  ' +
       '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="sub_DepartureDate"> ' + tripInfo.DepartureDate + ' </div>    ' +
       '          <div class="col-33 center-text font-size-14 trip-summary-labels1" id="Summary_Duration"> ' + tripInfo.Duration + '  </div>      ' +
       '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="Summary_ArrivalDate"> ' + tripInfo.ArrivalDate + '  </div>  ' +
       '      </div> ' +
       '  </div> </li> '
    }
    $$("#list-OutgoingTrips").html(tripsString);

    if (GetLocalData("ReservationType") != "OneWay")
    {
        //get trip return Journy full information

        var retJournyInfo = GetLocalDataObject("retJournyFullData");

        tripsString = "";
        for (var i = 0; i < retJournyInfo.Trips.length; i++)
        {
            var tripInfo = retJournyInfo.Trips[i];
            tripsString = tripsString +
         '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px;">      ' +
         '      <div class="row no-gutter">              ' +
         '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
         GetResourceText("PassengerlblReturnTi") +
         '          </div>              ' +
         '      </div> ' +
         '      <div class="summary-section row">        ' +
         '          <div class="col-100">                ' +
         '              <div class="row no-gutter">      ' +
         '                  <div class="col-20">         ' +
         '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
         '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.DepartureStation.Name + '</h4></div>' +
         '              </div>          ' +
         '          </div>              ' +
         '      </div> ' +
         '      <div class="summary-section row">        ' +
         '          <div class="col-100">                ' +
         '              <div class="row">                ' +
         '                  <div class="col-20">         ' +
         '                      <h5 id="lblTo trip-summary-labels1" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' +
            GetResourceText("PassengerlblTo1") +
           '</h5>  ' +
           '                  </div>      ' +
           '                  <div class="col-80">         ' +
           '                      <h4 id="ArrivalStation_Name" class="trip-summary-labels2" style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.ArrivalStation.Name + '</h4>         ' +
           '                  </div>      ' +
           '              </div>          ' +
           '          </div>              ' +
           '      </div> ' +
           '      <div class="row">       ' +
           '          <div class="col-100 center-text">    ' +
           '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img trip-summary-bus-img ' + GetResourceText("classArabic") + ' " /> ' +
           '          </div>              ' +
           '      </div> ' +
           '      <div class="row">       ' +
           '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + tripInfo.DepartureTime + '  </div>' +
           '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
           '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + tripInfo.ArrivalTime + ' </div>  ' +
           '      </div> ' +
           '      <div class="row">  ' +
           '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="sub_DepartureDate"> ' + tripInfo.DepartureDate + ' </div>    ' +
           '          <div class="col-33 center-text font-size-14 trip-summary-labels1" id="Summary_Duration"> ' + tripInfo.Duration + '  </div>      ' +
           '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="Summary_ArrivalDate"> ' + tripInfo.ArrivalDate + '  </div>  ' +
           '      </div> ' +
           '  </div> </li> '
        }
        $$("#list-Return").html(tripsString);
    }



    var imgArClassName = GetLocalData("imgLanguageClass");
    $$(".trip-summary-bus-img").addClass(imgArClassName);
    $$(".summary-pass-img").addClass(imgArClassName);
    $$(".summary-btn-img").addClass(imgArClassName);
    var data = GetLocalDataObject("ReservationSummary");
    var sarText = GetResourceText("SAR");

    if (data.Results.Tickets.length > 0)
    {
        var ticketsData = data.Results.Tickets;
        var TicketsSelect = [];

        for (i = 0 ; i < ticketsData.length ; i++)
        {
            var viewItem =
                  {
                      Amount: 0,
                      PassengerName: ticketsData[i].PassengerName,
                      PassengerID: ticketsData[i].PassengerID
                  };

            var queryResult = JSLINQ(TicketsSelect).Where(function (item)
            {
                return (item.PassengerID == ticketsData[i].PassengerID);
            });

            var sumQuery = JSLINQ(ticketsData).Where(function (item)
            {
                return (item.PassengerID == ticketsData[i].PassengerID);
            });
            var sum = 0;

            for (var z = 0; z < sumQuery.items.length; z++)
            {
                sum += sumQuery.items[z].Amount;
            }


            if (queryResult.items.length == 0)
            {
                TicketsSelect.push(viewItem);
            }
            TicketsSelect[(TicketsSelect.length - 1)].Amount = sum;
        }

        $$("#summaryTotalPrice").html(data.Results.TotalPrice);
        var myList = myApp.virtualList('#PassengersList', {
            // Array with items data
            items: TicketsSelect,
            // Custom render function to render item's HTML
            renderItem: function (index, item)
            {
                return '<div class="row summary-section clickablePassenger" data-itemIndex ="' + index + '" > ' +
                       '<div class="col-60 summary-pass-name">' + item.PassengerName + '</div> ' +
                   '<div class="col-25 summary-pass-amount">' + item.Amount + sarText + '</div> ' +
   '<div class="col-15"><img src="img/arrow_right.svg" style="    width: 18px;" alt=">"  class="summary-pass-img ' + imgArClassName + '"/></div>  ' +
                               '</div>';
            }
        });
    }




    $$('#btnGoToPayemnt').on('click', function ()
    {
        myApp.modal({
            title: GetResourceText('alert'),
            text: GetResourceText("lblagree"),
            buttons: [
              {
                  text: GetResourceText('Agree'),
                  onClick: function ()
                  {
                      mainView.router.load({
                          url: 'paymentoptions.html'
                      });
                  }
              },
              {
                  text: GetResourceText('lblTirmsMessage'),
                  onClick: function ()
                  {
                      mainView.router.load({
                          url: 'condtionandterms.html'
                      });
                  }
              },
              {
                  text: GetResourceText('Cancel'),

              }
            ]
        });
    });

    $$('#PassengersList').on('click', '.clickablePassenger', function ()
    {
        var ticketIndex = Number($$(this).data('itemIndex'));
        var selectedTicket = data.Results.Tickets[ticketIndex];

        var passengersquery = JSLINQ(data.Results.Tickets).Where(function (item) { return (item.PassengerID == selectedTicket.PassengerID); });
        SaveLocalObject("PassengerTicketViewData", passengersquery.items);
        mainView.router.load({
            url: 'Passengers.html'
        });
    });
});
/********************End Reservation summary *****************************/

/*************************Payemnt Options*********************************/

//$$(document).on('pageBeforeAnimation', function (e)
//{
//    var page = e.detail.page;
//    if ((page.name == "paymentoptions" || page.name == "Sdadpay") && page.swipeBack)
//    {
//        mainView.router.load({
//            url: 'index.html'
//        });
//    }
//});

myApp.onPageInit('paymentoptions', function (page)
{
    var reservationInfo = GetLocalDataObject("ReservationSummary");

    if (reservationInfo.Results.IsSadadEnabled == false)
    {
        $$("#btnGoToSadad").css("display", "none");
    }

    if (reservationInfo.Results.IsVisaEnabled == false)
    {
        $$("#btnGotoVisa").css("display", "none");
    }

    $$("#btnGoToSadad").on('click', function ()
    {
        var sadadPNR = CollectSadadPnr();
        POSTReservationsSadad(sadadPNR);
    });

    $$("#btnGotoVisa").on('click', function ()
    {
        //mainView.router.load({
        //    url: reservationInfo.Results.VisaPaymentURL
        //});
        //window.open(reservationInfo.Results.VisaPaymentURL, '_blank');
        var ref = window.open(reservationInfo.Results.VisaPaymentURL, '_blank', 'location=yes');
        ref.addEventListener('loadstart', function (event)
        {
            //if (event.url.indexOf(".pdf") === event.url.length - 4) {
            //  alert("hope");
            //  } 
        });
        //  ref.addEventListener('loadstop', function (event) { alert('stop: ' + event.url); });
        //   ref.addEventListener('loaderror', function (event) { alert('error: ' + event.message); });
        ref.addEventListener('exit', function (event)
        {
            //get ticket info
            searchReservationByEmail();
        });

    });
    $$("#GoToKiosk").on('click', function ()
    {
        mainView.router.load({
           url: reservationInfo.Results.
        });

    });

    $$("#btnGotoVisaLink").attr("href", reservationInfo.Results.VisaPaymentURL);
    //$$("#btnGotoVisaLink").attr("href", "http://192.168.1.4/TestVisa.html");

    function POSTReservationsSadad(postData)
    {
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Reservation/Reservations/Sadad";
        $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            contentType: 'application/json',
            dataType: 'json',
            data: postData,
            headers:
            {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },
            success: function (data, status, xhr)
            {
                myApp.hidePreloader("Loading");
                SaveLocalObject("SadadPayemntInfo", data.Results);
                mainView.router.load({
                    url: 'Sdadpay.html'
                });
            },
            error: function (status, xhr)
            {
                myApp.hidePreloader("Loading");
                if (status.status == 400)
                {
                    mainView.router.load({
                        url: 'Sdadpay.html'
                    });
                }
                else
                {
                    myApp.alert(GetResourceText("GenericError"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
                // alert("ajax error ...");
            }
        });
    }
});
/***********************end of Payemnt options ***************************/

/*****************************  Sadad Payemnt  ***************************/
myApp.onPageInit('Sdadpay', function (page)
{
    var sadadInfo = GetLocalDataObject("SadadPayemntInfo");
    fillFormData(sadadInfo, "Results");

    $$(document).on('click', '#btnSearch', function ()
    {
        mainView.router.load({
            url: 'Home.html'
        });
    });

    $$(document).on('click', '#btnPrint', function ()
    {
        var summary = GetLocalDataObject("ReservationSummary");
        var mobileNum = summary.Results.MobileNumber;
        var Pnr = summary.Results.PNR;
        printPDfFile(Pnr, mobileNum);
    });
});
/***********************end of  Sadad Payemnt  ***************************/

/*********************************Passengers******************************/
myApp.onPageInit('Passengers', function (page)
{
    var passengerTicketsArray = GetLocalDataObject("PassengerTicketViewData");
    passengerTickerDetails = passengerTicketsArray[0];

    $$('#TxtPassengerName').text(passengerTickerDetails.PassengerName);

    $$('#txtPassengerType').text(GetResourceText(passengerTickerDetails.PassengerType));

    $$('#txtNationalityName').text(passengerTickerDetails.Nationality.Name);
    $$('#txtGender').text(passengerTickerDetails.Gender);
    $$('#txtDateOfBirth').text(passengerTickerDetails.DateOfBirth);
    var allItemsHtml = "";

    for (var i = 0; i < passengerTicketsArray.length; i++)
    {
        passengerTickerDetails = passengerTicketsArray[i];
        var imageSrc = "img/goingbus.png";
        if (passengerTickerDetails.Direction != "Onward")
        {
            imageSrc = "img/returnArrow.png";
        }
        allItemsHtml = allItemsHtml +
        ' <div class="DepartureContainerDiv container-box-shaddow content-container" id="GoingDataContainer">            ' +
        '     <div class="row no-gutter">            ' +
        '         <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 20px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblGoingTic") + '</div>        ' +
        '     </div>                ' +
        '     <div class="row" style="width:100% ">  ' +
        '         <div class="col-100 center-text">  ' +
        '             <img src=' + imageSrc + ' alt="Trip" class="trip-go-img passenger-trip-go-img" />                ' +
        '         </div>            ' +
        '     </div>                ' +
        '     <div class="summary-section row">      ' +
        '         <div class="col-100">              ' +
        '             <div class="row no-gutter">    ' +
        '                 <div class="col-100"><h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom") + '</h5></div>           ' +
        '             </div>        ' +
        '             <div class="row no-gutter">    ' +
        '                 <div class="col-100 ">     ' +
        '                     <h4 id="lblDepartureStation_Name" class="trip-summary-labels2 ">' + passengerTickerDetails.DepartureStation.Name + '</h4>  ' +
        '                 </div>    ' +
        '             </div>        ' +
        '         </div>            ' +
        '     </div>                ' +
        '     <div class="summary-section row">      ' +
        '         <div class="col-100">              ' +
        '             <div class="row">              ' +
        '                 <div class="col-100">      ' +
        '                     <h5 id="arrival" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblTo") + ' </h5>  ' +
        '                 </div>    ' +
        '             </div>        ' +
        '             <div class="row">              ' +
        '                 <div class="col-100">      ' +
        '                     <h4 id="lblArrivalStation_Name" class="trip-summary-labels2">' + passengerTickerDetails.ArrivalStation.Name + '</h4>     ' +
        '                 </div>    ' +
        '             </div>        ' +
        '         </div>            ' +
        '     </div>                ' +
        '     <div class="row passenger-div-separator">               ' +
        '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblTicketNumber") + '</div>            ' +
        '         <div class="col-50" id="txtTicketNumber">' + passengerTickerDetails.TicketNumber + '</div>     ' +
        '     </div>                ' +
        '     <div class="row passenger-div-separator">               ' +
        '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblTicketDate") + '</div>              ' +
        '         <div class="col-50" id="txtdate">' + passengerTickerDetails.TripDate.replace(" 00:00", "") + '</div>             ' +
        '     </div>                ' +
        '     <div class="row passenger-div-separator">               ' +
        '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblTicketFee") + '</div>               ' +
        '         <div class="" id="txtTicketFee">' + passengerTickerDetails.Amount + '</div>              ' +
        '         <div class="col-40" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerSAR") + '</div>       ' +
        '     </div>                ' +
        ' </div> '

    }

    $$("#list-Tickets-container").html(allItemsHtml);


    //$$('#lblDepartureStation_Name').html(passengerTickerDetails.DepartureStation.Name);
    //$$('#lblArrivalStation_Name').html(passengerTickerDetails.ArrivalStation.Name);
    //$$('#txtTicketNumber').html(passengerTickerDetails.TicketNumber);
    //$$('#txtTicketFee').html(passengerTickerDetails.Amount);
    //$$('#txtdate').html(passengerTickerDetails.TripDate.replace(" 00:00", ""));


    //if (passengerTicketsArray.length > 1)
    //{
    //    var passengerReturnTickerDetails = passengerTicketsArray[1];
    //    $$("#ReturnDataContainer").css("display", "block");
    //    $$('#ret_lblDepartureStation_Name').html(passengerReturnTickerDetails.DepartureStation.Name);
    //    $$('#ret_lblArrivalStation_Name').html(passengerReturnTickerDetails.ArrivalStation.Name);
    //    $$('#ret_txtTicketNumber').html(passengerReturnTickerDetails.TicketNumber);
    //    $$('#ret_txtTicketFee').html(passengerReturnTickerDetails.Amount);
    //    $$('#ret_txtdate').html(passengerReturnTickerDetails.TripDate.replace(" 00:00", ""));
    //}
    var imgArClassName = GetLocalData("imgLanguageClass");
    $$('.passenger-trip-go-img').addClass(imgArClassName);
    //$$('#Summary_DepartureTime').text(passengerTickerDetails.);
    //$$('#sub_Duration').text(passengerTickerDetails.);
    //$$('#Summary_ArrivalTime').text(passengerTickerDetails.);
    //$$('#sub_DepartureDate').text(passengerTickerDetails.);
    //$$('#lblArrivalDate').text(passengerTickerDetails.);
});
/*************************************************************************/

/*************************Fav List ***************************************/

myApp.onPageInit('favorite_list', function (page)
{
    var passengerUpdateInfo = GetLocalDataObject("passengerUpdateDetials");
    var favoritList = GetLocalDataObject("favList_" + passengerUpdateInfo.itemType);

    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.fav-list',
        searchIn: '.item-title'
    });

    if (favoritList)
    {
        var myList = myApp.virtualList('.fav-list', {
            // Array with items data
            items: favoritList,
            // Custom render function to render item's HTML
            renderItem: function (index, item)
            {
                return '<li class="item-content">' +
                          '<div class="item-inner">' +
                              '<div class="item-title clickable-Fav" data-index =' + index + '>' + item.Name + '</div>' +
                      '</div> </li>';
            },
            // search item by item
            searchByItem: function (query, index, item)
            {
                // Check if title contains query string
                if (item && item != null)
                {
                    var name = item.Name.toLowerCase();
                    var queryString = query.trim().toLowerCase();
                    if (name.indexOf(queryString) >= 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
        });
    }
    else
    {
        $$(".searchbar").css("display", "none");
    }


    $$('.fav-list').on('click', '.clickable-Fav', function ()
    {
        var itemIndex = Number($$(this).data('index'));
        var favoritList = GetLocalDataObject("favList_" + passengerUpdateInfo.itemType);
        var updatedItem = favoritList[itemIndex];
        var userIsUpdated = false;
        switch (passengerUpdateInfo.itemType)
        {
            case "adult":
                passengerArray = GetLocalDataObject("AdultPassengers");
                var passengersquery = JSLINQ(passengerArray).Where(function (item) { return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType); });
                if (passengersquery.items.length > 0)
                {
                    myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
                else
                {
                    passengerArray[Number(passengerUpdateInfo.itemIndex)] = updatedItem;
                    SaveLocalObject("AdultPassengers", passengerArray);
                    userIsUpdated = true;
                }

                break;
            case "child":
                passengerArray = GetLocalDataObject("ChildsArray");
                var passengersquery = JSLINQ(passengerArray).Where(function (item) { return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType); });
                if (passengersquery.items.length > 0)
                {
                    myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
                else
                {
                    passengerArray[Number(passengerUpdateInfo.itemIndex)] = updatedItem;
                    SaveLocalObject("ChildsArray", passengerArray);
                    userIsUpdated = true;
                }
                break;
            case "infant":
                passengerArray = GetLocalDataObject("InfantsPassengersArray");
                var passengersquery = JSLINQ(passengerArray).Where(function (item) { return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType); });
                if (passengersquery.items.length > 0)
                {
                    myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
                else
                {
                    passengerArray[Number(passengerUpdateInfo.itemIndex)] = updatedItem;
                    SaveLocalObject("InfantsPassengersArray", passengerArray);
                    userIsUpdated = true;
                }
                break;
        }
        if (userIsUpdated)
        {
            mainView.router.reloadPreviousPage('PassengersInfo.html');
            mainView.router.back({
                url: 'PassengersInfo.html'
            });
        }
    });
});

/*************************************************************************/

/***************************setting***************************************/
myApp.onPageInit('setting', function (page)
{
    if (GetApplicationLanguage() == "en")
    {
        $$("#cboEnglishCheck").prop('checked', true);
        $$("#cboArabicCheck").prop('checked', false);
    }
    else
    {
        $$("#cboArabicCheck").prop('checked', true);
        $$("#cboEnglishCheck").prop('checked', false);
    }


    $$("#btnSaveLanguage").on('click', function ()
    {
        DeleteLocalData("StationsStorage");
        if ($$("#cboEnglishCheck")[0].checked)
        {
            ChangeLanguage('en');
        }
        else
        {
            ChangeLanguage('ar');
        }

        mainView.router.load({
            url: 'Home.html'
        });
    });

});
/***************************End of setting********************************/

/**************************History ***************************************/
myApp.onPageInit('historytab', function (page)
{
    $$(document).on('click', '#feedback', function ()
    {
        mainView.router.load({
            url: 'feedback.html'
        });
    });
    Gethistory();
    function Gethistory()
    {
        myApp.showPreloader(GetResourceText("Loading"));

        var authHeader = GetLocalData("authHeader");
        $$.ajax(
        {
            url: "https://mobile.saptco.com.sa/Reservation/Reservations/History",
            method: "Get",
            headers:
            {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json',
                "Authorization": authHeader
            },
            success: function (data, xhr, param)
            {
                myApp.hidePreloader();
                var objectData = JSON.parse(data);
                fillBookingHistory(objectData.Results);
            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                if (xhr.status == 401)
                {
                    myApp.alert(GetResourceText('errLoginToViewHistory'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
                else
                {
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }

            }
        });
    }
    $$(".history-virtualList").on("click", ".btn-Booking-Details", function ()
    {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveLocalData("resno", pnr);
        SaveLocalData("phoneno", phoneNumber);
        GETReservationsPnrMobileNumber(pnr, phoneNumber);
    });
    function fillBookingHistory(bookingHistory)
    {
        $$(".history-virtualList").on('click', '.btn-history-feedback', function ()
        {
            var pnrValue = $$(this).data("pnr");
            SaveLocalData("hisotryPNR", pnrValue);
            mainView.router.load({
                url: 'feedback.html'
            });
        });

        var myList = myApp.virtualList('.history-virtualList', {
            // Array with items data
            items: bookingHistory,
            // Custom render function to render item's HTML
            renderItem: function (index, item)
            {
                var lblDepartFrom = GetResourceText("lblDepartFrom");
                var lblArrivalTo = GetResourceText("lblArrivalTo");
                var lblDepartureOn = GetResourceText("lblDepartureOn");
                var lblReturnOn = GetResourceText("lblReturnOn");
                var lblTotalTicketPrice = GetResourceText("lblTotalTicketPrice");
                var lblFeedback = GetResourceText("lblFeedback");
                var lblDetails = GetResourceText("lblDetails");
                var lblPnrNumber = GetResourceText("lblPnrNumber");
                var dsiplayReturn = "block";
                if (!item.ReturnDate || item.ReturnDate == "")
                {
                    dsiplayReturn = "none";
                }
                //+ item.DepartureDate +
                return '<div class="content-block container-box-shaddow content-container no-top-margins no-padding">' +
                '<div class="row no-gutter" data-completeID="' + index + '">' +
                '          <div class="col-100 schedual-section"  style="height:auto">       ' +
                '              <div class="row departure-action">       ' +
            '                  <div class="col-20">' +
            '                      <img src="img/busdepa.png" alt="bus" class="img-icons" />         ' +
            '                  </div>           ' +
            '                  <div class="col-80">' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-title color-s-dark-orange"  style="height:30px">  ' + lblDepartFrom +
            '                          </div>   ' +
            '                      </div>       ' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-Value" id="Locations_DepartureStationsName">     ' +
           item.FromStation.Name +
            '                          </div>   ' +
            '                      </div>       ' +
            '                  </div>           ' +
            '              </div>               ' +
            '          </div>  ' +
            '          <div class="col-100 schedual-section"  style="height:auto">       ' +
            '              <div class="row arrival-action">         ' +
            '                  <div class="col-20">' +
            '                      <img src="img/busarriv.png" alt="bus" class="img-icons" />        ' +
            '                  </div>           ' +
            '                  <div class="col-80">' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-title color-s-dark-orange"  style="height:30px">  ' + lblArrivalTo +
            '                          </div>   ' +
            '                      </div>       ' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-Value" id="Locations_ArrivleStationsName">       ' +
            item.ArrivalStation.Name +
            '                          </div>   ' +
            '                      </div>       ' +
            '                  </div>           ' +
            '              </div>               ' +
            '          </div>  ' +
            '          <div class="col-100 schedual-section">       ' +
            '              <div class="row">    ' +
            '                  <div class="col-20">' +
            '                      <img src="img/calenderIcon.png" alt="bus" class="img-icons" />    ' +
            '                  </div>           ' +
            '                  <div class="col-40 date-separator-Border">               ' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-title color-s-dark-orange dates-labels schedule-date-titles">        ' +
            lblDepartureOn +
            '                          </div>   ' +
            '                      </div>       ' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-Value schedule-date-titles"> ' + item.DepartureDate +
            '                          </div>   ' +
            '                      </div>       ' +
            '                  </div>           ' +
            '                  <div class="col-40 date-separator-Border" id="divReturnDate">         ' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-title color-s-dark-orange dates-labels schedule-date-titles" style="display:' + dsiplayReturn + '">        ' +
            lblReturnOn +
            '                          </div>   ' +
            '                      </div>       ' +
            '                      <div class="row">                ' +
            '                          <div class="col-100 schedule-sub-Value schedule-date-titles"> ' +
            item.ReturnDate +
            '                          </div>   ' +
            '                      </div>       ' +
            '                  </div>           ' +
            '              </div>               ' +
            '          </div>  ' +
            '<div class="col-100 schedual-section"  style="height:auto">       ' +
           '                  <div class="row">' +
           '         ' +
           '                      <div class="col-100">             ' +
           '                          <div class="row">            ' +
           '                              <div class="col-40 schedule-sub-title color-s-dark-orange"  style="height: 30px;"> ' +
            lblPnrNumber +
           '                              </div>  ' +
           '                              <div class="col-60 schedule-sub-Value" id="lblPassengerCountSummary" style="text-align: center;">   ' +
            item.FullInformation.PNR +
               '                              </div>  ' +
           '                          </div>   ' +
           '                      </div>       ' +
           '                  </div>           ' +

           '          </div>  ' +
                    '<div class="col-100 schedual-section"  style="height:auto">       ' +
           '                  <div class="row">' +
           '         ' +
           '                      <div class="col-100">             ' +
           '                          <div class="row">            ' +
           '                              <div class="col-50 schedule-sub-title color-s-dark-orange"  style="height: 30px;"> ' +
            lblTotalTicketPrice +
           '                              </div>  ' +
           '                              <div class="col-50 schedule-sub-Value" id="lblPassengerCountSummary" style="text-align: center;">   ' +
            item.TotalPrice +
               '                              </div>  ' +
           '                          </div>   ' +
           '                      </div>       ' +
           '                  </div>           ' +

           '          </div>  ' +
                    '<div class="row" style="width:100%">' +
                        '<div class ="col-50">' +
                            '<div class="bg-color-s-dark-orange2 color-black btn-Booking-Details"    data-pnr ="' + item.FullInformation.PNR + '" data-phoneNumber ="' + item.MobileNumber + '" > ' +
                                lblDetails +
                            '</div>        ' +
                        '</div>  ' +
                        '<div class ="col-50">' +
                             '<div class="bg-black color-s-orange btn-history-feedback" data-pnr ="' + item.FullInformation.PNR + '"  > ' +
                                lblFeedback +
                             '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>  ' +
            '</div>  ';
            }
        });
    }
});
/*************************end of hisotry *********************************/

/*******************************Feedback ********************************/
myApp.onPageInit('Home', function (page)
{
    $$("body").on("open", ".picker-modal", function ()
    {
        $$(this).find(".toolbar").removeClass("CandCToolbarStyle");
        $$(this).find(".toolbar").removeClass("cargoToolbarStyle");
        if (mainView.activePage.name == "CargoReservationData" || mainView.activePage.name == "CargoReservationRequest")
        {
            $$(this).find(".toolbar").addClass("cargoToolbarStyle");
        }

        if (mainView.activePage.name == "Rent_Bus_Details" || mainView.activePage.name == "Rent_Bus_home")
        {
            $$(this).find(".toolbar").addClass("CandCToolbarStyle");
        }


    });



    $$(document).on('DOMNodeInserted', '.pac-container', function ()
    {
        $$('.pac-item, .pac-item span', this).addClass('no-fastclick');
    });


    function initialize()
    {

        new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });
    }

    //initialize();

    var profileInfo = GetLocalDataObject("storedprofile");
    if (profileInfo)
    {
        if (GetApplicationLanguage() == "en")
        {
            $$(".mainTitle").text(GetResourceText("titleone").replace("To SAPTCO", profileInfo.FullName));
        }
        else
        {
            $$(".mainTitle").text(GetResourceText("titleone").replace("في سابتكو", profileInfo.FullName));
        }

    }
});

myApp.onPageInit('feedback', function (page)
{
    var profileInfo = GetLocalDataObject("storedprofile");
    if (profileInfo)
    {
        $$("#txtName").val(profileInfo.FullName);
        $$("#txtPhoneNUmber").val(profileInfo.MobileNumber.replace(" ", ""));
    }

    var ratingValue = 0;
    $$(".rate1").on('click', function ()
    {
        ratingValue = 1;
    })

    $$(".rate2").on('click', function ()
    {
        ratingValue = 2;
    })

    $$(".rate3").on('click', function ()
    {
        ratingValue = 3;
    })

    $$(".rate4").on('click', function ()
    {
        ratingValue = 4;
    })

    $$(".rate5").on('click', function ()
    {
        ratingValue = 5;
    })

    $$("#submitReview").on('click', function ()
    {
        var comments = $$("#txtComments").val();
        var phoneNumber = $$("#txtPhoneNUmber").val();
        var name = $$("#txtName").val();
        var requestBody =
        {
            "PNR": GetLocalData("hisotryPNR"),
            "PassengerName": name,
            "Issue": comments,
            "RatingValue": ratingValue,
            "MobileNumber": phoneNumber
        }
        var validationResult = validateFeedback(requestBody);
        if (validationResult == ValidationSucessVal)
        {
            postFeedback(requestBody);
        }
        else
        {
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    })


    function postFeedback(postData)
    {
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Reservation/Reservations/Rating";
        $$.ajax(
        {
            method: "POST",
            url: urlAjax,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            dataType: "json",
            headers:
            {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },

            success: function (data, status, xhr)
            {
                myApp.hidePreloader();
                mainView.router.back({
                    url: 'historytab.html'
                });
                myApp.alert(GetResourceText("feedBackSentSuccess"), GetResourceText('alert'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                myApp.alert(GetResourceText("errorNotAbleFeedback"), GetResourceText('alert'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
    }
});
/****************************End of feedback******************************/
/****************************manage Res Trips*******************************/

function PostTripsManageRes(ticketnumber, searchid)
{
    myApp.showPreloader(GetResourceText("Loading"));
    var urlAjax = "https://mobile.saptco.com.sa/Reservation/Reservations/transfer/" + ticketnumber + "/" + searchid;
    $$.ajax(
    {
        method: "POST",
        url: urlAjax,
        contentType: 'application/json',
        data: "",
        dataType: "json",
        headers:
        {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },

        success: function (data, status, xhr)
        {

        },
        error: function (xhr, status)
        {
            myApp.hidePreloader();
            myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}


function GetManageTrips(ticketnumber, searchdate)
{
    myApp.showPreloader(GetResourceText("Loading"));
    $$.ajax({
        url: 'https://mobile.saptco.com.sa/Reservation/Reservations/transfer/' + ticketnumber + '/' + searchdate,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr)
        {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);
        },
        error: function (xhr, status)
        {
            myApp.hidePreloader();
            myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}
/***********************End of manage Res Trips*******************************/
/******************************printing ****************************************/

/*************************Home********************/
myApp.onPageInit('Home', function (page)
{

});
/**************************************************/

/*******************Booking *********************/

myApp.onPageInit('mybooking', function (page)
{
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

    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find("select")[0], worked = false;
        if (document.createEvent)
        { // all browsers
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            worked = element.dispatchEvent(e);
        }
        else if (element.fireEvent)
        { // ie
            worked = element.fireEvent("onmousedown");
        }
    })

    $$("#btnMybooking").on("click", function ()
    {
        GetAllBooking();
    })

    function GetAllBooking()
    {
        myApp.showPreloader("Loading");
        var authHeader = GetLocalData("authHeader");
        $$.ajax(
       {
           url: "https://mobile.saptco.com.sa/Reservation/Reservations/myreservations",
           method: "Get",
           headers:
           {
               'Accept-Language': GetServiceLanguage(),
               Accept: 'application/json',
               "Authorization": authHeader
           },
           success: function (data, xhr, param)
           {
               myApp.hidePreloader();
               var objectData = JSON.parse(data);
               SaveLocalObject("AllBookingData", objectData);
               mainView.router.load({
                   url: 'Booking.html'
               });

           },
           error: function (xhr, param)
           {
               myApp.hidePreloader();
               if (xhr.status == 401)
               {
                   myApp.alert(GetResourceText('errLoginToViewBookings'), GetResourceText("Error"));
                   $$(".modal-button-bold").text(GetResourceText('OkText'));
               }
               else if (xhr.status == 404)
               {
                   myApp.alert(GetResourceText("noBookingFound"), GetResourceText('Error'));
                   $$(".modal-button-bold").text(GetResourceText('OkText'));
               }
               else
               {
                   myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                   $$(".modal-button-bold").text(GetResourceText('OkText'));
               }

           }
       });
    }

});

myApp.onPageInit('booking', function (page)
{
    var bookingData = GetLocalDataObject("AllBookingData");
    if (bookingData)
    {
        fillMyBooking(bookingData.Bookings, false);
        fillMyBooking(bookingData.History, true);
    }

    $$("#btnSearch").on("click", function ()
    {
        mainView.router.back({
            url: 'mybooking.html'
        });
    });

    $$("#list-booking-container").on("click", ".btn-Booking-Details", function ()
    {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveLocalData("resno", pnr);
        SaveLocalData("phoneno", phoneNumber);
        GETReservationsPnrMobileNumber(pnr, phoneNumber);
    });

    $$("#list-booking-container").on('click', '.btn-history-feedback', function ()
    {
        var pnrValue = $$(this).data("pnr");
        SaveLocalData("hisotryPNR", pnrValue);
        mainView.router.load({
            url: 'feedback.html'
        });
    });

    $$("#list-booking-container").on("click", ".btn-Add-to-cal", function ()
    {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        var dir = $$(this).data("direction");
        SaveReservationsToCalinder(pnr, phoneNumber, dir);
    });
});

function fillMyBooking(bookings, isHistory)
{
    var myList = $$("#list-booking-container").html();

    var lblDepartFrom = GetResourceText("lblDepartFrom");
    var lblArrivalTo = GetResourceText("lblArrivalTo");
    var lblDepartureOn = GetResourceText("lblDepartureOn");
    var lblReturnOn = GetResourceText("lblReturnOn");
    var lblTotalTicketPrice = GetResourceText("lblTotalTicketPrice");
    var lblDetails = GetResourceText("lblDetails");
    var lblAddToCalindar = GetResourceText("addToCalendar");
    var lblFeedback = GetResourceText("lblFeedback");
    var lblPnrNumber = GetResourceText("lblPnrNumber");
    var lblResStatus = GetResourceText("lblIsConfirmed");
    var resStatus = GetResourceText("ResStatucNotConfirmed");
    var SAR = GetResourceText("SAR");
    var imgArClassName = GetLocalData("imgLanguageClass");
    var invertImgArClassName = GetLocalData("invertImgArClassName");

    for (var i = 0; i < bookings.length; i++)
    {
        var departDate;
        var returnDate;
        var departQuery = JSLINQ(bookings[i].FullInformation.Tickets).Where(function (item) { return item.Direction != "Return" });
        departDate = departQuery.items[0].DepartureDateString + "-" + departQuery.items[0].DepartureTimeString;
        var returnQuery = JSLINQ(bookings[i].FullInformation.Tickets).Where(function (item) { return item.Direction == "Return" });
        if (returnQuery.items.length > 0)
        {
            returnDate = returnQuery.items[0].DepartureDateString + "-" + returnQuery.items[0].DepartureTimeString;
        }
        var index = i;
        var item = bookings[i];
        var dsiplayReturn = "";
        var buttonsHtml = "";

        // check the inner tickets for dates values ;  

        if (item.IsConfirmed)
        {
            resStatus = GetResourceText("ResStatucConfirmed")
        }
        if (!item.ReturnDate || item.ReturnDate == "")
        {
            dsiplayReturn = 'style="display:none"';
        }
        var displayTransfer = "none";
        if (item.FullInformation.Tickets[0].IsTransferable)
        {
            //displayTransfer = "block";
        }
        if (item.FeedbackEnabled)
        {

            buttonsHtml = '<div class="row" style="width:100%">' +
                                '<div class ="col-50">' +
                                    '<div class="bg-color-s-dark-orange2 color-black btn-Booking-Details"    data-pnr ="' + item.FullInformation.PNR + '" data-phoneNumber ="' + item.MobileNumber + '" > ' +
                                        lblDetails +
                                    '</div>        ' +
                                '</div>  ' +
                                '<div class ="col-50">' +
                                     '<div class="bg-black color-s-orange btn-history-feedback" data-pnr ="' + item.FullInformation.PNR + '"  > ' +
                                        lblFeedback +
                                     '</div>' +
                                '</div>' +
                            '</div>';
        }
        else
        {
            if (isHistory)
            {
                buttonsHtml = '<div class="bg-black color-s-orange btn-Booking-Details" style="    width:100%; text-align: center; padding-top: 14px;padding-bottom: 14px;"   data-pnr ="' + item.FullInformation.PNR + '" data-phoneNumber ="' + item.MobileNumber + '" > ' +
                                 lblDetails +
                                 '</div>'
                ;
            }
            else
            {
                buttonsHtml = '<div class="bg-black color-s-orange btn-Booking-Details" style="    width: 100%; text-align: center; padding-top: 14px;padding-bottom: 14px;"   data-pnr ="' + item.FullInformation.PNR + '" data-phoneNumber ="' + item.MobileNumber + '" > ' +
                   lblDetails +
                   '      </div>';
                //'       <div class="color-black bg-s-orange btn-Add-to-cal" style="width: 50%; text-align: center; padding-top: 15px;padding-bottom: 15px;"   data-pnr ="' + item.FullInformation.PNR + '" data-phoneNumber ="' + item.MobileNumber + '" > ' +
                //           lblAddToCalindar +
                //'   </div>';
            }
        }
        //+ item.DepartureDate +                                                                                                                                                                                                                           
        myList = myList + '<li><div class="content-block container-box-shaddow content-container no-top-margins no-padding">' +
       '<div class="row no-gutter" data-completeID="' + index + '">' +
       '          <div class="col-100 schedual-section" style="height:auto">       ' +
       '              <div class="row departure-action">       ' +
    '                  <div class="col-20">' +
    '                      <img src="img/departure_icon.svg" alt="bus" class="img-icons ' + invertImgArClassName + '" style="width:45px" />         ' +
    '                  </div>           ' +
    '                  <div class="col-80">' +
    '                      <div class="row">                ' +
    '                          <div class="col-100 schedule-sub-title color-s-dark-orange" style="height: 30px;">  ' + lblDepartFrom +
    '                          </div>   ' +
    '                      </div>       ' +
    '                      <div class="row">                ' +
    '                          <div class="col-100 schedule-sub-Value" id="Locations_DepartureStationsName">     ' +
    item.FromStation.Name +
    '                          </div>   ' +
    '                      </div>       ' +
    '                  </div>           ' +
    '              </div>               ' +
    '          </div>  ' +
    '          <div class="col-100 schedual-section"  style="height:auto">       ' +
    '              <div class="row arrival-action">         ' +
    '                  <div class="col-20">' +
    '                      <img src="img/arrival_icon.svg" alt="bus" class="img-icons ' + invertImgArClassName + '" style="width:45px" />        ' +
    '                  </div>           ' +
    '                  <div class="col-80">' +
    '                      <div class="row">                ' +
    '                          <div class="col-100 schedule-sub-title color-s-dark-orange"  style="height: 30px;">  ' + lblArrivalTo +
    '                          </div>   ' +
    '                      </div>       ' +
    '                      <div class="row">                ' +
    '                          <div class="col-100 schedule-sub-Value" id="Locations_ArrivleStationsName">       ' +
    item.ArrivalStation.Name +
    '                          </div>   ' +
    '                      </div>       ' +
    '                  </div>           ' +
    '              </div>               ' +
    '          </div>  ' +
    '          <div class="col-100 schedual-section"  style="height:auto">       ' +
    '             <div class="row no-gutter" style="border-bottom: #E8E0E0 solid 1px;">    ' +
  '                    <div class="col-40 schedule-sub-title color-s-dark-orange"  style="height: 30px;line-height: 30px;padding: 3px;"> ' +
                            lblDepartureOn +
    '                  </div>   ' +
    '                  <div class="col-50 schedule-sub-Value " style="height: 30px;line-height: 35px"> ' + departDate +
    '                  </div>   ' +
    '                  <div class="col-10">' +
    '                      <img src="img/calender_icon.svg" alt="bus" class="img-icons btn-Add-to-cal ' + imgArClassName + '"  style="margin: 0px;" data-direction="depart" data-pnr ="' + item.FullInformation.PNR + '" data-phoneNumber ="' + item.MobileNumber + '"/>    ' +
    '                  </div>           ' +
                '</div>   ' +
  '              <div class="row no-gutter" id="divReturnDate" ' + dsiplayReturn + '>    ' +
  '                  <div class="col-40 schedule-sub-title color-s-dark-orange"  style="height: 30px;line-height: 30px;padding: 3px;">       ' +
                            lblReturnOn +
    '                  </div>   ' +
 '                     <div class="col-50 schedule-sub-Value" style="height: 30px;line-height: 35px"> ' +
                            returnDate +
    '                  </div>   ' +
   '                  <div class="col-10">' +
    '                      <img src="img/calender_icon.svg" alt="bus" class="img-icons btn-Add-to-cal  ' + imgArClassName + '" style="margin: 0px;"  data-direction="return" data-pnr ="' + item.FullInformation.PNR + '" data-phoneNumber ="' + item.MobileNumber + '"/>    ' +
    '                  </div>           ' +
    '            </div>           ' +
       '      </div>   ' +

    '<div class="col-100 schedual-section"  style="height:auto">       ' +
    '                  <div class="row">' +
    '         ' +
    '                      <div class="col-100">             ' +
    '                          <div class="row">            ' +
    '                              <div class="col-40 schedule-sub-title color-s-dark-orange"  style="height: 30px;line-height: 30px;padding: 3px;"> ' +
    lblPnrNumber +
    '                              </div>  ' +
    '                              <div class="col-60 schedule-sub-Value" id="lblPassengerCountSummary" height: 30px;line-height: 35px>   ' +
    item.FullInformation.PNR +
       '                              </div>  ' +
    '                          </div>   ' +
    '                      </div>       ' +
    '                  </div>           ' +

    '          </div>  ' +
            '<div class="col-100 schedual-section"  style="height:auto">       ' +
    '                  <div class="row">' +
    '         ' +
    '                      <div class="col-100">             ' +
    '                          <div class="row">            ' +
    '                              <div class="col-40 schedule-sub-title color-s-dark-orange"  style="height: 30px;line-height: 30px;padding: 3px;"> ' +
    lblTotalTicketPrice +
    '                              </div>  ' +
    '                              <div class="col-60 schedule-sub-Value" id="lblPassengerCountSummary" height: 30px;line-height: 35px>   ' +
    item.TotalPrice + SAR +
       '                              </div>  ' +
    '                          </div>   ' +
    '                      </div>       ' +
    '                  </div>           ' +

    '          </div>  ' +
          '<div class="col-100 schedual-section"  style="height:auto"> ' +
    '                  <div class="row">' +
    '         ' +
    '                      <div class="col-100">             ' +
    '                          <div class="row">            ' +
    '                              <div class="col-40 schedule-sub-title color-s-dark-orange"  style="height: 30px;line-height: 30px;padding: 3px;"> ' +
    lblResStatus +
    '                              </div>  ' +
    '                              <div class="col-60 schedule-sub-Value" id="lblPassengerCountSummary" height: 30px;line-height: 35px>   ' +
    resStatus +
       '                              </div>  ' +
    '                          </div>   ' +
    '                      </div>       ' +
    '                  </div>           ' +

    '          </div>  ' +
buttonsHtml +

    '         </div>  ' +
       '      </div>  </li>';
    }
    $$("#list-booking-container").html(myList);
}




//////////////////////////////////////////////////


/**********************print*******************/
function printPDfFile(pnr, mobileNumber)
{
    var lang = GetServiceLanguage();
    var link = "https://mobile.saptco.com.sa/Reservation/Reservations/file/" + lang + "/" + mobileNumber + "/" + pnr + ".pdf";

    var ref = window.open(link, '_system', 'location=yes');
    ref.addEventListener('loadstart', function (event) { alert('start: ' + event.url); });
    ref.addEventListener('loadstop', function (event) { alert('stop: ' + event.url); });
    ref.addEventListener('loaderror', function (event) { alert('error: ' + event.message); });
    ref.addEventListener('exit', function (event) { alert(event.type); });

    // downloadAndOpenPDF(link, 'ticket.pdf', '/sdcard/SAPTCO/');

}


function PdfViewer()
{
}

/**
 * Display a new browser with the specified URL.
 * 
 * NOTE: If usePhoneGap is set, only trusted PhoneGap URLs should be loaded,
 *       since any PhoneGap API can be called by the loaded HTML page.
 *
 * @param url           The url to load
 * @param usePhoneGap   Load url in PhoneGap webview [optional] - Default: false
 */
PdfViewer.prototype.showPdf = function (url)
{
    PhoneGap.exec(null, null, "PdfViewer", "showPdf", [url]);
};

/**
 * Load PdfViewer
 */


cordova.addConstructor(function ()
{
    window.pdfViewer = new PdfViewer();

    // backwards compatibility
    window.plugins = window.plugins || {};
    window.plugins.pdfViewer = window.pdfViewer;
});