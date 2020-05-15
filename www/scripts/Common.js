// JavaScript source code


/*********************common screipts *****************/

mainView.hideNavbar();
launchSlider();

function launchSlider() {
    var mySwiper = myApp.swiper('.main-swiper-container', {
        speed: 400,
        pagination: '.swiper-pagination',
        paginationHide: false,
        paginationClickable: true,
        spaceBetween: 0,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });
}

function IsConnected() {
    var networkState = navigator.connection.type;

    if (networkState == Connection.NONE) {
        myApp.alert(GetResourceText("ErrInterNetConnectionBefor"), GetResourceText('alert'));
        $$(".modal-button-bold").text(GetResourceText('OkText'));

        //alert("Please make to sure to connect to internet before complete action");
        return false;
    } else {
        if (typeof google === 'object' && typeof google.maps === 'object') {
            // google is loaded;
        } else {
            // ChangeGoogleMapsLanguage();
        }
        return true;
    }
}

document.addEventListener("click", handler, true);
var messageIsShown = false;

function handler(e) {
    //mainView.showNavbar();
    var networkState = navigator.connection.type;
    if (networkState == Connection.NONE) {
        if (messageIsShown == false) {
            myApp.alert(GetResourceText("ErrInterNetConnectionBefor"), GetResourceText('alert'));
            messageIsShown = true;
        }

        $$(".modal-button-bold").text(GetResourceText('OkText'));
        e.stopPropagation();
        e.preventDefault();
    } else {
        messageIsShown = false;
    }
}

function GetServiceLanguage() {
    if (GetApplicationLanguage() == "en") {
        return "en-us";
    } else {
        return "ar-sa";
    }
}

function GetFormatedDate(dateString) {
    var res = dateString.split("-");
    var val = new Date("2015");
    val.setYear(parseInt(res[2]));
    val.setMonth(parseInt(res[1]) - 1);
    val.setDate(parseInt(res[0]));
    return val;
}

function GetSaptcoFormatedDate(date) {
    var Days = date.getDate();
    var Year = date.getFullYear();
    var Months = date.getMonth() + 1;
    if (Days < 10) {
        Days = '0' + Days;
    }
    if (Months < 10) {
        Months = '0' + Months;
    }
    var newDate = Days + "-" + Months + "-" + Year;
    return newDate;
}

function fillFormData(mainObject, namePrefix) {
    $$.each(mainObject, function (key, value) {
        if (value != null && value.toString().indexOf("object") > -1) {
            fillFormData(value, key);
        }

        $$("#" + namePrefix + "_" + key).html(value);
        // var item = $("#" + namePrefix + "_" + key);

        // alert(key + " -:- " + value);
        //console.log(namePrefix + "_" + key + " -:- " + value);
    });
}


function fillFormDataEvent(mainObject, namePrefix) {
    $$("#Results_BillNumber").html(mainObject.SADADBillReference);
    $$("#Results_BillExpiration").html(mainObject.ExpirationDt);
    $$("#Results_Amount").html(mainObject.Amount);
    $$("#Results_BillerNumber").html(mainObject.BillerCode);
    // $$.each(mainObject, function (key, value) {
    //     if (value != null && value.toString().indexOf("object") > -1) {
    //         fillFormData(value, key);
    //     }
    //
    //     $$("#" + namePrefix + "_" + key).html(value);
    //     // var item = $("#" + namePrefix + "_" + key);
    //
    //     // alert(key + " -:- " + value);
    //     //console.log(namePrefix + "_" + key + " -:- " + value);
    // });

}


function fillContainerData(mainObject, namePrefix, containerName) {

    $$.each(mainObject, function (key, value) {
        if (value.toString().indexOf("object") > -1) {
            fillContainerData(value, key, containerName);
        }

        if (isNaN(namePrefix) == false) {
            namePrefix = "sub";
        }

        $$("#" + containerName).find("#" + namePrefix + "_" + key).html(value);
        // var item = $("#" + namePrefix + "_" + key);

        // alert(key + " -:- " + value);
        console.log(namePrefix + "_" + key + " -:- " + value);
    });
}

$$(document).on('click', '.contact-us-tab', function () {
    mainView.router.load({url: 'contact_us.html'});
});

function searchReservationByEmail() {
    if (GetLocalDataObject("ReservationSummary") != null && GetLocalDataObject("ReservationReqBody") != null) {
        var summary = GetLocalDataObject("ReservationSummary").Results;
        var pnr = summary.PNR;
        var email = GetLocalDataObject("ReservationReqBody").Email;
        var reqBody = {
            "PNR": pnr,
            "Email": email
        };
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
                success: function (data, status, xhr) {
                    myApp.hidePreloader();
                    SaveLocalObject("TicketSearch", data.FullInformation.Tickets);
                    SaveLocalObject("pnrPayemntReturnInfo", data);
                    if (data.IsConfirmed) {
                        mainView.router.load({
                            url: 'Tickets.html'
                        });
                    } else {
                        mainView.router.load({
                            url: 'Home.html'
                        });
                        getBanner();
                    }
                },
                error: function (xhr, status) {
                    mainView.router.load({
                        url: 'Home.html'
                    });
                    getBanner();
                    myApp.hidePreloader();
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
    } else {
        mainView.router.load({url: 'Home.html'});
        getBanner();
    }
}

$$(document).on('click', '.mybooking', function () {
    var pages = ["CargoReservationData", "CargoReservationDataLocation", "CargoRequestItemsList", "CargoReservationRequest", "CargoSucess",
        "Rent_Bus_Details", "Rent_bus_Location", "CCRequestItemsList", "Rent_Bus_home", "BusSucess", "LimoReservationData", "LimoReservationDataLocations", "LimoRequestItemsList", "LimoReservationtypes",
        "LimoSucess"];

    var pageObject = mainView.activePage.name;
    var pageIndex = pages.indexOf(pageObject);
    if (pageIndex < 0) {
        //change select style
        $$("body").on("open", ".picker-modal", function () {
            $$(this).find(".toolbar").css("background-color", "#dbc255 !important");
            $$(this).find(".toolbar").find("a").css("color", "#ffffff");
            $$(this).find(".toolbar").css("color", "#ffffff !important");
        });

        mainView.router.load({url: 'mybooking.html'});
    }

});

$$(document).on('click', '.home-icon', function () {
    if (cordova.plugins.Keyboard.isVisible != true) {
        $$("body").on("open", ".picker-modal", function () {
            $$(this).find(".toolbar").css("background-color", "#dbc255 !important");
            $$(this).find(".toolbar").find("a").css("color", "#ffffff");
            $$(this).find(".toolbar").css("color", "#ffffff !important");
        });
        mainView.router.load({url: 'Home.html'});
    }
});

$$(document).on('pageInit', function (e) {
    $$('.tab-link').removeClass('active');
    if (e.detail.page.url == "Home.html") {
        $$(".home-tab").addClass('active');
    } else if (e.detail.page.url == "mybooking.html") {
        $$(".mybooking").addClass('active');
    } else if (e.detail.page.url == "contact_us.html") {
        $$(".contact-us-tab").addClass('active');
    }

});
/******************************************************/
var logo;
$$(document).on("click", "#goToSchedual", function () {
    goToSchedualEco();
});

var switchDiv;
$$(document).on("click", "#goToSchedual2", function () {
    goToSchedualVip();
});

function goToSchedualEco() {
    switchDiv = true;
    if (IsConnected()) {
        logo = 1;
        SaveLocalObject("logo", logo);
        //change select style
        DeleteLocalData("selectedStationType");
        DeleteLocalData("ServiceName");
        var selectedItemValue = 1;
        SaveLocalObject("selectedStationType", selectedItemValue);
        SaveLocalData("ServiceName", "Standard");
        $$("#selectTripType").val(selectedItemValue);
        $$("body").on("open", ".picker-modal", function () {
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
        mainView.router.load({url: 'schedulesandtickets.html'});
    }
}

function goToSchedualVip() {
    switchDiv = false;
    if (IsConnected()) {
        logo = 2;
        SaveLocalObject("logo", logo);
        //change select style
        DeleteLocalData("selectedStationType");
        DeleteLocalData("ServiceName");
        var selectedItemValue = 2;
        SaveLocalObject("selectedStationType", selectedItemValue);
        SaveLocalData("ServiceName", "VIP");
        $$("#selectTripType").val(selectedItemValue);
        $$("body").on("open", ".picker-modal", function () {
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
        mainView.router.load({url: 'schedulesandtickets.html'});
    }
}

$$(document).on("click", "#goToLimo", function () {
    SaveLocalData("txtValueDistLocationlimo", "");
    SaveLocalData("txtValuePickUpLocationlimo", "");
    SaveLocalData("txtPickUpLocationlimo", "");
    SaveLocalData("txtDistLocationlimo", "");
    DeleteLocalData("limoItemToUpdate");
    DeleteLocalData("LimoReservationInfo");
    DeleteLocalData("LimoReservationMapInfo");
    DeleteLocalData("LimoReservationMapInfo");
    mainView.router.load({url: 'LimoReservationData.html'});
})

$$(document).on("click", "#goToCargo", function () {
    SaveLocalData("txtValueDistLocationCargo", "");
    SaveLocalData("txtValuePickUpLocationCargo", "");
    SaveLocalData("txtPickUpLocationCargo", "");
    SaveLocalData("txtDistLocationCargo", "");

    DeleteLocalData("cargoItemToUpdate");
    DeleteLocalData("cargoDataObjData");
    DeleteLocalData("CargoReservationMapInfo");

    if (IsConnected()) {
        mainView.router.load({url: 'CargoReservationData.html'});
    }
})

$$(document).on("click", "#goToBusRent", function () {
    SaveLocalData("txtValueDistLocationBus", "");
    SaveLocalData("txtValuePickUpLocationBus", "");
    SaveLocalData("txtPickUpLocationBus", "");
    SaveLocalData("txtDistLocationBus", "");

    DeleteLocalData("CCItemToUpdate");
    DeleteLocalData("detailsData");
    DeleteLocalData("CandCReservationMapInfo");

    if (IsConnected()) {
        mainView.router.load({url: 'Rent_Bus_Details.html'});
    }
})
$$(document).on("click", "#MinusBtnEvent", function () {
    var count = $$('#PassengersCountEvent').html();
    if (count != 1) {
        count--;
        $$('#PassengersCountEvent').html(count);
        $$('#lblPassengerCountSummaryEvent').html(count);
    } else {

    }
});
$$(document).on("click", "#PlusBtnEvent", function () {
    var count = $$('#PassengersCountEvent').html();
    count++;
    $$('#PassengersCountEvent').html(count);
    $$('#lblPassengerCountSummaryEvent').html(count);
});


/*******************end of home**************************/
// Schedules and Tickets section
var RangePicker;
var calendarDateFormatDepart;
myApp.onPageInit('schedulesandtickets', function (page) {
    // GenerateTicket('24689161','9666464646464');
    // GenerateTicket('24689137','966501157223');
    mainView.showNavbar();
    $$(".backHome").on('click', function () {
        mainView.router.load({url: 'Home.html'});
    });
    $$("#PiligramMessage").hide();
    var Message = GetLocalData("AdMessage");
    if (Message)
        if (Message.length > 4) {
            $$("#PiligramMessage").html(Message);
            $$("#PiligramMessage").show();
        } else
            $$("#PiligramMessage").hide();
    if (logo == 1) {
        $$("#Rlogo").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 52px;height:33px">');
        $$("#logoTitle").addClass("orange-color");
    } else {
        $$("#Rlogo").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -7px">');
        $$("#logoTitle").addClass("orange-color");
    }
    var passengersCounts =
        {
            adultCount: 1,
            childrenCount: 0,
            infantsCount: 0
        };
    //test
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate() - 1);
    var _maxdate = new Date().setDate(currentDate.getDate() + 90);
    calendarDateFormatDepart = myApp.calendar({
        input: '#calendar-date-depart',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true,
        minDate: today,
        maxDate: _maxdate,
        toolbar: true,
        toolbarCloseText: calendarCloseButton,
        toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' + '{{monthPicker}}' + '{{yearPicker}}' + '</div></div> ',
        onChange: function () {
            calendarDateFormatReturn.params.minDate = calendarDateFormatDepart.value[0];
            calendarDepartVal = calendarDateFormatDepart.value[0];
        },
        onOpen: function (p) {
            calendarDateFormatDepart.params.maxDate = _maxdate;
            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");

            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        },
        onDayClick: function () {
            // calendarDateFormatDepart.close();
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
        onChange: function () {
            calendarDateFormatDepart.params.maxDate = calendarDateFormatReturn.value[0];
            calendarReturnVal = calendarDateFormatReturn.value[0];
        },
        onOpen: function (p) {

            if (calendarDateFormatDepart.value != null && calendarDateFormatDepart.value.length > 0) {
                var myDate = new Date(calendarDateFormatDepart.value[0]);
                var _currentMonth = myDate.getMonth();
                var CurrentYear = myDate.getFullYear();

                calendarDateFormatReturn.params.maxDate = _maxdate;
                var loopTimes = _currentMonth - p.currentMonth;

                for (i = 0; i < loopTimes; i++) {
                    calendarDateFormatReturn.nextMonth(1000);
                }


            }

            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");
            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        }
    });

    // set the view to one way or round trip
    reservationType = GetLocalData("ReservationType");
    if (reservationType) {
        //fill the dates value and passenger data in case the search already done before
        var ticketSearchData = GetLocalDataObject("ticketSearchData");
        if (reservationType == "Round") {
            setRoundTripView();
            if (ticketSearchData && ticketSearchData != null) {
                if (ticketSearchData.DepartureDate) {
                    var formatedDate = GetFormatedDate(ticketSearchData.DepartureDate);
                    calendarDateFormatDepart.setValue([formatedDate]);
                }
                if (ticketSearchData.ReturnDate) {
                    formatedDate = GetFormatedDate(ticketSearchData.ReturnDate);
                    calendarDateFormatReturn.setValue([formatedDate]);
                }
            }
        } else {
            setOnewayView();
            if (ticketSearchData && ticketSearchData != null) {
                if (ticketSearchData.DepartureDate) {
                    var formatedDate = GetFormatedDate(ticketSearchData.DepartureDate);
                    calendarDateFormatDepart.setValue([formatedDate]);
                }
            }
        }

        if (ticketSearchData && ticketSearchData != null) {
            passengersCounts.adultCount = ticketSearchData.Passengers.AdultsCount;
            passengersCounts.childrenCount = ticketSearchData.Passengers.ChildrenCount;
            passengersCounts.infantsCount = ticketSearchData.Passengers.InfantsCount;
            $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");
        }
    } else {
        SaveLocalData("ReservationType", "OneWay");
        setOnewayView();
    }

    $$('.departure-action').on('click', function () {
        SaveLocalData("FieldToSave", "Dep");
        var tripsSearch = collectTripsRound();
        SaveLocalData("ticketSearchData", tripsSearch);
        mainView.router.load({url: 'stations.html'});
    });

    $$('.arrival-action').on('click', function () {
        SaveLocalData("FieldToSave", "Arr");
        var tripsSearch = collectTripsRound();
        SaveLocalData("ticketSearchData", tripsSearch);
        mainView.router.load({url: 'stations.html'});
    });

    //select the date by clicking the containers.
    $$("#divDepartDate").on("click", function () {
        if (calendarReturnVal != null) {
            calendarDateFormatDepart.params.maxDate = calendarReturnVal;
        }

        setTimeout(function () {
            calendarDateFormatDepart.open();
            if (calendarReturnVal != null) {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 300);

        setTimeout(function () {
            if (calendarReturnVal != null) {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 450);

    });

    $$("#divCalenderOpen").on("click", function () {

        if (calendarReturnVal != null) {
            calendarDateFormatDepart.params.maxDate = calendarReturnVal;
        }

        setTimeout(function () {
            calendarDateFormatDepart.open();
            if (calendarReturnVal != null) {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 300);

        setTimeout(function () {
            if (calendarReturnVal != null) {
                calendarDateFormatDepart.params.maxDate = calendarReturnVal;
            }
        }, 450);
    });

    // $$("#divReturnDate").on("click", function () {
    //     if (calendarDepartVal != null) {
    //         calendarDateFormatReturn.params.minDate = calendarDepartVal;
    //     }
    //     var reservationType = GetLocalData("ReservationType");
    //
    //     if (reservationType && reservationType == "Round") {
    //         setTimeout(function () {
    //             calendarDateFormatReturn.open();
    //         }, 300);
    //
    //
    //     }
    //     if (calendarDepartVal != null) {
    //         calendarDateFormatReturn.params.minDate = calendarDepartVal;
    //     }
    // });
    var pageContainer = $$(page.container);
    pageContainer.on('click', '.schedule-search-button', function () {
        DeleteLocalData("DayTrips");
        DeleteLocalData("InWordTabData");
        DeleteLocalData("OutJournyFullData");
        DeleteLocalData("OutWordTabData");
        DeleteLocalData("ReservationSummary");
        DeleteLocalData("TripBookList");
        DeleteLocalData("ReservationSummary");
        DeleteLocalData("retJournyFullData");
        //SaveLocalData("FieldToSave", "Arr");
        if (GetLocalData("adultCount") == null) {
            SaveLocalData("adultCount", 1);
            SaveLocalData("childrenCount", 0);
            SaveLocalData("infantsCount", 0);
        }
        var tripType = GetLocalData("ReservationType");

        if (tripType == "OneWay") {
            var tripsSearch = collectTripsOneWay();
            var validationRuslt = ValidateTripsOneWay(tripsSearch);
            //mainView.router.load({ url: 'trips.html' });

            if (validationRuslt == ValidationSucessVal) {
                SaveLocalData("ticketSearchData", tripsSearch);
                // for test only :
                //mainView.router.load({ url: 'trips.html' });
                PostTripsOneway(tripsSearch);
            } else {
                myApp.alert(GetResourceText(validationRuslt), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        } else if (tripType == "Round") {
            var tripsSearch = collectTripsRound();
            var validationRuslt = ValidateTripsRoundtrip(tripsSearch);
            //mainView.router.load({ url: 'trips.html' });

            if (validationRuslt == ValidationSucessVal) {
                SaveLocalData("ticketSearchData", tripsSearch);
                // for test only :
                //mainView.router.load({ url: 'trips.html' });
                PostTripsRound(tripsSearch);
            } else {
                myApp.alert(GetResourceText(validationRuslt), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        }
    });
    $$('#btnOneWay').on('click', function () {
        setOnewayView();
    });

    function setOnewayView() {
        $$('#calendar-date-depart').val("");
        calendarDateFormatDepart = myApp.calendar({
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
            onChange: function () {
                calendarDateFormatReturn.params.minDate = calendarDateFormatDepart.value[0];
                calendarDepartVal = calendarDateFormatDepart.value[0];
                $$('.popover-picker-calendar').remove();
            },
            onOpen: function (p) {
                calendarDateFormatDepart.params.maxDate = _maxdate;
                $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
                $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");
                $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
                $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
            },
            onDayClick: function () {
            }
        });
        calendarDateFormatDepart.params.maxDate = _maxdate;
        SaveLocalData("ReservationType", "OneWay");
        DeleteLocalData("TypeMulti");
        //Todo: set UI elements
        $$('#btnOneWay').removeClass("not-selected-tab");
        $$('#btnOneWay').addClass("selected-tab");
        $$('#btnRoundTrip').removeClass("selected-tab");
        $$('#btnRoundTrip').addClass("not-selected-tab");
        $$('#multiDist').removeClass("selected-tab");
        $$('#multiDist').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "0.3");
        $$('#calendar-date-arrive').addClass("disabled");
        $$('#calendar-date-arrive').val("");
        $$("#multiDistDiv").removeClass("col-100");
        $$("#multiDistDiv").removeClass("schedual-section");
        calendarDateFormatDepart.params.maxDate = null;

    }

    $$('#btnRoundTrip').on('click', function () {
        setRoundTripView();

    });

    function setRoundTripView() {
        $$('#calendar-date-depart').val("");
        calendarDateFormatDepart.destroy();
        var datepickerdate;
        var counter = 0;
        var start;
        var CalendarDateFormatDepart = myApp.calendar({
            input: '#calendar-date-depart',
            dateFormat: 'dd-mm-yyyy',
            rangePicker: true,
            updateValuesOnTouchmove: false,
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
            onChange: function () {
                calendarDepartVal = CalendarDateFormatDepart.value[0];
                if (counter == 1 && CalendarDateFormatDepart.value[0])
                    start = new Date(CalendarDateFormatDepart.value[0]);
                else if (counter == 2 && !CalendarDateFormatDepart.value[0]) {
                    var date = [
                        FormatDate(new Date(start)),
                        FormatDate(new Date(start))
                    ];
                    datepickerdate = date[0] + ' - ' + date[1];
                    console.log(date[0] + '-' + date[1]);
                    CalendarDateFormatDepart.close();
                    FillRoundDate(datepickerdate);
                }
            },
            onOpen: function (p) {
                calendarDateFormatDepart.params.maxDate = _maxdate;
                $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
                $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");

                $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
                $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
            },
            onDayClick: function () {
                counter++;
            },
            onClose: function () {
                counter = 0;


            }
        });
        calendarDateFormatDepart.params.maxDate = _maxdate;
        SaveLocalData("ReservationType", "Round");
        DeleteLocalData("TypeMulti");
        //Todo: set UI elemnts
        $$('#btnRoundTrip').removeClass("not-selected-tab");
        $$('#btnRoundTrip').addClass("selected-tab");
        $$('#btnOneWay').removeClass("selected-tab");
        $$('#btnOneWay').addClass("not-selected-tab");
        $$('#multiDist').removeClass("selected-tab");
        $$('#multiDist').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "1");
        $$('#calendar-date-arrive').removeClass("disabled");
        $$("#multiDistDiv").removeClass("col-100");
        $$("#multiDistDiv").removeClass("schedual-section");

    }

    $$('#multiDist').on('click', function () {
        InitTemplateArray();
        SaveLocalData("ReservationType", "Multiple");
        SaveLocalData("TypeMulti", "Multiple");
        $$('#multiDist').removeClass("not-selected-tab");
        $$('#multiDist').addClass("selected-tab");
        $$('#btnRoundTrip').removeClass("selected-tab");
        $$('#btnRoundTrip').addClass("not-selected-tab");
        $$('#btnOneWay').removeClass("selected-tab");
        $$('#btnOneWay').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "0.3");
        $$('#calendar-date-arrive').addClass("disabled");
        $$('#calendar-date-arrive').val("");
        calendarDateFormatDepart.params.maxDate = null;
        $$("#multiDistDiv").addClass("col-100");
        mainView.router.load({url: 'multiple.html'});
        $$('#multiDist').removeClass("selected-tab");
        $$('#multiDist').addClass("not-selected-tab");
        $$('#btnOneWay').removeClass("not-selected-tab");
        $$('#btnOneWay').addClass("selected-tab");
    })
    $$('#btnSubAdult').on('click', function () {
        if (passengersCounts.adultCount > 0) {
            passengersCounts.adultCount = subPassenger(passengersCounts.adultCount);
        }
        updatePassengerCountLabels();
    });

    $$('#btnAddAdult').on('click', function () {
        passengersCounts.adultCount = addPassenger(passengersCounts.adultCount);
        updatePassengerCountLabels();
    });

    $$('#btnSubChild').on('click', function () {
        passengersCounts.childrenCount = subPassenger(passengersCounts.childrenCount);
        updatePassengerCountLabels();
    });

    $$('#btnAddChild').on('click', function () {
        passengersCounts.childrenCount = addPassenger(passengersCounts.childrenCount);
        updatePassengerCountLabels();
    });

    $$('#btnSubInfants').on('click', function () {
        passengersCounts.infantsCount = subPassenger(passengersCounts.infantsCount);
        updatePassengerCountLabels();
    });

    $$('#btnAddInfants').on('click', function () {
        passengersCounts.infantsCount = addPassenger(passengersCounts.infantsCount);
        updatePassengerCountLabels();
    });

    $$('#btnSavePassCount').on('click', function () {
        SaveLocalData("adultCount", passengersCounts.adultCount);
        SaveLocalData("childrenCount", passengersCounts.childrenCount);
        SaveLocalData("infantsCount", passengersCounts.infantsCount);

        $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");

    });

    function subPassenger(passCount) {
        if (passCount > 0) {
            return (passCount - 1);
        }
        return passCount;
    }

    function addPassenger(passCount) {
        if (passCount < 5) {
            return (passCount + 1);
        }
        return passCount;
    }

    updatePassengerCountLabels();

    function updatePassengerCountLabels() {
        if (GetApplicationLanguage() == "ar") {
            $$("#lblAdultCount").text(" (" + GetResourceText("lblAdults") + " (" + passengersCounts.adultCount);
            $$("#lblChildCount").text(" (" + GetResourceText("lblChild") + " (" + passengersCounts.childrenCount);
            $$("#lblInfantsCount").text(" (" + GetResourceText("lblInfants") + " (" + passengersCounts.infantsCount);
        } else {
            $$("#lblAdultCount").text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + ")");
            $$("#lblChildCount").text(GetResourceText("lblChild") + " (" + passengersCounts.childrenCount + ")");
            $$("#lblInfantsCount").text(GetResourceText("lblInfants") + " (" + passengersCounts.infantsCount + ")");
        }
    }

    // check in case the local storage got any values, then fill the values inside the labels , else fill temp data
    if (logo == 1) {
        var test1 = GetLocalDataObject("StationsStorage");
    } else
        var test1 = GetLocalDataObject("StationsStorageVip");

    if (test1 == null) {
        var stationsStorage = {
            DepartureStationsName: GetResourceText("Select"),
            DepartureStationsId: -1,
            ArrivleStationsName: GetResourceText("Select"),
            ArrivleStationsId: -1,
            StationTypeDep: "all",
            StationTypeArr: "all"
        };

        if (logo == 1) {
            SaveLocalObject("StationsStorage", stationsStorage);
            SaveLocalObject("StationsStorage2", stationsStorage);
        } else
            SaveLocalObject("StationsStorageVip", stationsStorage);
    }
    // fill the data inside the form
    if (logo == 1) {
        fillFormData(GetLocalDataObject("StationsStorage"), "Locations");
    } else
        fillFormData(GetLocalDataObject("StationsStorageVip"), "Locations");


});

function TicketsValidation() {
    var EventDeparture = $$('#EventLocations_DepartureStationsName').text();
    var EventArrival = $$('#EventLocations_ArrivleStationsName').text();
    if (EventDeparture == "اختر المحطة" || EventDeparture == "Select Station" || EventDeparture == "Please Select Station" || EventDeparture == "الرجاء اختيار محطة") {
        myApp.alert(GetResourceText("ErrEnterDepartrureStations"));
    } else if (EventArrival == "اختر المحطة" || EventArrival == "Select Station" || EventArrival == "Please Select Station" || EventArrival == "الرجاء اختيار محطة") {
        myApp.alert(GetResourceText("ErrEnterArrivleStations"));
    } else if (!$$('#Event_calendar-date-depart').val()) {
        myApp.alert(GetResourceText("ErrEnterDepartureDate"))
    }
}

var onwayradio = true;
var roundradio = false;
var EventTripType = 1;
SaveLocalData("EventTripType", EventTripType);
myApp.onPageInit('Events_Scheduleandtickets', function (page) {
    DeleteLocalData('goingTripRound');
    DeleteLocalData('goingTrip');
    DeleteLocalData('returnTripRound');
    $$('#EventLocations_DepartureStationsName').on('click', function () {
        SaveLocalData('fieldToSaveEvent', 'Dep');
        mainView.router.loadPage({url: 'Eventstations.html'});
    });
    $$('#EventLocations_ArrivleStationsName').on('click', function () {
        SaveLocalData('fieldToSaveEvent', 'Arr');
        mainView.router.load({url: 'Eventstations.html'});
    });
    var passengerinitialize = GetLocalDataObject("EventPassengerCountLabel");
    if (passengerinitialize) {
        $$('#lblPassengerCountSummaryEvent').text(passengerinitialize);
        $$('#PassengersCountEvent').text(passengerinitialize);
    }
    $$('#btnSavePassCountEvent').click(function () {
        var passengerscount = $$('#PassengersCountEvent').text();
        $$('#lblPassengerCountSummaryEvent').text(passengerscount);
        SaveLocalObject("EventPassengerCountLabel", passengerscount);
    });
    $$('#EventbtnOneWay').click(function () {
        EventTripType = 1;
        SaveLocalData("EventTripType", EventTripType);
        onwayradio = true;
        roundradio = false;
        $$('#EventLocations_DepartureStationsName').html(GetResourceText("plzSelectStation"));
        $$('#EventLocations_ArrivleStationsName').html(GetResourceText("plzSelectStation"));
    });
    $$('#EventbtnRoundTrip').click(function () {
        EventTripType = 2;
        SaveLocalData("EventTripType", EventTripType);
        onwayradio = false;
        roundradio = true;
        $$('#EventLocations_DepartureStationsName').html(GetResourceText("plzSelectStation"));
        $$('#EventLocations_ArrivleStationsName').html(GetResourceText("plzSelectStation"));
    });
    if (onwayradio == true) {
        $$("#EventbtnOneWay").attr('checked', 'checked');
        $$("#EventbtnRoundTrip").removeAttr('checked');
        $$(".TolocationDiv").css("display", "none");

    } else {
        $$("#EventbtnRoundTrip").attr('checked', 'checked');
        $$("#EventbtnOneWay").removeAttr('checked');
    }
    $$('#fillTickets').on('click', function () {
        mainView.router.load({url: 'EventStations.html'});
    });
    $$('#btnSavePassCountEvent').on('click', function () {
        passengersCount = $$('#PassengersCountEvent').html();
    });
    var passengersCount;
    var StationsStorageEvent = GetLocalDataObject("StationsStorageEvent");
    if (StationsStorageEvent == null) {
        var StationsStorageEvent = {
            DepartureStationsName: GetResourceText("plzSelectStation"),
            DepartureStationsId: -1,
            ArrivleStationsName: GetResourceText("plzSelectStation"),
            ArrivleStationsId: -1,
            StationTypeDep: "all",
            StationTypeArr: "all"
        };
        SaveLocalObject("StationsStorageEvent", StationsStorageEvent);
        $$('#EventLocations_DepartureStationsName').html(StationsStorageEvent.DepartureStationsName);
        $$('#EventLocations_ArrivleStationsName').html(StationsStorageEvent.ArrivleStationsName);
    } else {
        $$('#EventLocations_DepartureStationsName').html(StationsStorageEvent.DepartureStationsName);
        $$('#EventLocations_ArrivleStationsName').html(StationsStorageEvent.ArrivleStationsName);
    }
    $$('.schedule-search-button-event').on('click', function () {
        var EventDeparture = $$('#EventLocations_DepartureStationsName').text();
        var EventArrival = $$('#EventLocations_ArrivleStationsName').text();
        if (EventDeparture == "اختر المحطة" || EventDeparture == "Select Station" || EventDeparture == "Please Select Station" || EventDeparture == "الرجاء اختيار محطة") {
            myApp.alert(GetResourceText("ErrEnterDepartrureStations"));
        } else if (EventArrival == "اختر المحطة" || EventArrival == "Select Station" || EventArrival == "Please Select Station" || EventArrival == "الرجاء اختيار محطة") {
            myApp.alert(GetResourceText("ErrEnterArrivleStations"));
        } else if (!$$('#Event_calendar-date-depart').val()) {
            myApp.alert(GetResourceText("ErrEnterDepartureDate"))
        } else {
            var urlAjax = "http://integtest.saptco.sa/EventsBooking/Events/TripsInquiry";
            // var urlAjax = "https://mobile.saptco.com.sa/EventsBooking/Events/TripsInquiry";
            var date = $$('#Event_calendar-date-depart').val();
            var count = $$('#PassengersCountEvent').html();
            SaveLocalData('PassengerCountEvent', count);
            var EventID = parseInt(GetLocalData('EventID'));
            var postData = {
                "EventId": EventID,
                "Lang": GetApplicationLanguage(),
                "FromLocation": StationsStorageEvent.DepartureStationsId,
                "ToLocation": StationsStorageEvent.ArrivleStationsId,
                "DepartureDate": date,
                "PassengersCount": count,
                "SearchType": EventTripType
            }
            myApp.showPreloader();
            $$.ajax(
                {
                    type: "POST",
                    url: urlAjax,
                    contentType: "application/json",
                    data: JSON.stringify(postData),
                    headers:
                        {
                            Authorization: 'Basic TW9iaWxlVXNlcjpWWXR3TlUyd25KTEptMzZm'
                        },

                    success: function (data, status, xhr) {
                        myApp.hidePreloader();
                        if (data) {
                            var tickets = JSON.parse(data);
                            SaveLocalObject('EventTrips', tickets);
                            var tripType = GetLocalData("EventTripType");
                            if (tickets.ReturnTrips.length == 0 && tickets.GoingTrips.length == 0)
                                myApp.alert(GetResourceText("NoTripsFound"));
                            else if ((tripType == 2 && tickets.ReturnTrips.length == 0) || (tripType == 1 && tickets.GoingTrips.length == 0))
                                myApp.alert(GetResourceText("NoTripsFound"));
                            else
                                mainView.router.load({url: 'EventTrips.html'});
                        } else {
                            myApp.alert(GetResourceText("NoTripsFound"));
                        }
                    },
                    error: function (xhr, status) {
                        myApp.hidePreloader();
                        myApp.alert(GetResourceText("NoTripsFound"));
                    }
                });
        }

    });
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate() - 1);
    EventDepartDate = myApp.calendar({
        input: '#Event_calendar-date-depart',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true,
        minDate: today,
        toolbar: true,
        toolbarCloseText: calendarCloseButton,
        toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '{{monthPicker}}' +
            '{{yearPicker}}' +
            '</div></div> ',
        onChange: function () {
            // EventDepartDate.params.minDate = EventDepartDate.value[0];
            calendarDepartVal = EventDepartDate.value[0];
        },
        onOpen: function (p) {
            EventDepartDate.params.maxDate = _maxdate;
            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");
            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        },
        onDayClick: function () {
            // calendarDateFormatDepart.close();
            // $$("#Event_calendar-date-depart").val(EventDepartDate.value[0]);
        }
    });

});


myApp.onPageInit('offers-promotions', function (page) {
    $$('.open-3-modal').on('click', function () {
        myApp.modal({
            title: 'SAPTCO',
            text: '' + GetResourceText('SelectTripTypeText') + '',
            buttons: [
                {
                    text: '' + GetResourceText('EcoTrips') + '',
                    onClick: function () {
                        goToSchedualEco();
                    }
                },
                {
                    text: '' + GetResourceText('VipTrips') + '',
                    onClick: function () {
                        goToSchedualVip();
                    }
                },
            ]
        })
    });
    if (GetApplicationLanguage() == 'ar') {
        $$('.PolicyDivEn').addClass("hide-element");
        $$('.PromoTableEn').addClass("hide-element");
        $$('.AgreeDivEn').addClass("hide-element");
    } else {
        $$('.PolicyDivAr').addClass("hide-element");
        $$('.PromoTableAr').addClass("hide-element");
        $$('.AgreeDivAr').addClass("hide-element");
    }
});


myApp.onPageInit('Offers1', function (page) {
    if (GetApplicationLanguage() == 'ar') {
        $$('.imagePhoto').removeClass("hide-element");
        $$('.offerDivEn').addClass("hide-element");
        $$('.offerDiv2En').addClass("hide-element");
    } else {
        $$('.offerDivAr').addClass("hide-element");
        $$('.offerDiv2Ar').addClass("hide-element");
        $$('.imagePhoto').addClass("hide-element");
    }
});


myApp.onPageInit('EventStations', function (page) {
    var StationIDToRemove;
    var pageContainer = $$(page.container);
    pageContainer.on('click', '.clickable-station-Event', function () {
        var stationID = $$(this).data('stationid');
        if (GetLocalData('fieldToSaveEvent') == 'Dep') {
            StationIDToRemove = $$(this).data('stationid');
            SaveLocalData('StationIDToRemove', StationIDToRemove);
        }
        var stationType = $$(this).data('stationType');
        var stationName = $$(this).text();
        SaveStationsSelectionEvent(stationName, stationID, stationType, stationDivID);
    });
    fillEventStations();
});


function EventPost() {
    myApp.showPreloader();
    var urlAjax = "http://integtest.saptco.sa/EventsBooking/Events/CreateReservation";
    // var urlAjax = "https://mobile.saptco.com.sa/EventsBooking/Events/CreateReservation";
    var tripType = GetLocalData("EventTripType");
    var data;
    if (tripType == 1) {
        var oneway = GetLocalDataObject("goingTrip");
        var EventID = parseInt(GetLocalData('EventID'));
        data = {
            "EventId": EventID,
            "Lang": GetApplicationLanguage(),
            "GoingTrip": oneway,
            "SeatsCount": parseInt(GetLocalData('PassengerCountEvent')),
            "ContactDetails": GetLocalDataObject("EventContactInformation")
        };
    } else {
        var Roundgoing = GetLocalDataObject("goingTripRound");
        var Roundreturn = GetLocalDataObject("returnTripRound");
        var EventID = parseInt(GetLocalData('EventID'));
        data = {
            "EventId": EventID,
            "Lang": GetApplicationLanguage(),
            "GoingTrip":
            Roundgoing
            ,
            "ReturnTrip":
            Roundreturn
            ,
            "SeatsCount": parseInt(GetLocalData('PassengerCountEvent')),
            "ContactDetails": GetLocalDataObject("EventContactInformation")
        };
    }
    $$.ajax({
        type: "POST",
        url: urlAjax,
        contentType: "application/json",
        data: JSON.stringify(data),
        headers:
            {
                Authorization: 'Basic TW9iaWxlVXNlcjpWWXR3TlUyd25KTEptMzZm'
            },
        success: function (data, status, xhr) {
            myApp.hidePreloader();
            var response = JSON.parse(data);
            if (response.IsFree) {
                myApp.alert(GetResourceText('lblThankYou'));
            } else {
                SaveLocalData('EventSadadPNR', response.PNR);
                SaveLocalData('EventTotalAmount', response.TotalAmount);
                if (response.IsCreditCardEnabled)
                    $$("#btnGotoVisaEvent").css("display", "none");
                if (response.IsSADADEnabled)
                    $$('#btnGoToSadadEvent').css("display", "none");
                if (response.IsCreditCardEnabled || response.IsSADADEnabled)
                    mainView.router.load({url: 'EventPaymentOptions.html'});
                else myApp.alert(GetResourceText('lblThankYou'));
            }
        },
        error: function (xhr, status, data) {
            myApp.hidePreloader();
            myApp.alert(GetResourceText('GenericError'));
        }
    });
}

myApp.onPageInit('EventContactDetails', function (page) {
    var ContactDetails;
    $$('#EventConfirmbtn').on('click', function () {
        if (!$$('#EventName').val()) {
            $$('#EventName').addClass("Validation-error");
            myApp.alert(GetResourceText("lblEevntName"));
        } else if (!$$('#EventMobile').val()) {
            $$('#EventMobile').addClass("Validation-error");
            myApp.alert(GetResourceText("lblEventMobile"));
        } else if (!$$('#EventEmail').val()) {
            $$('#EventEmail').addClass("Validation-error");
            myApp.alert(GetResourceText("lblEventEmail"));
        } else {
            ContactDetails = {
                "MobileNumber": $$('#EventMobile').val(),
                "Name": $$('#EventName').val(),
                "Email": $$('#EventEmail').val()
            };
            SaveLocalObject("EventContactInformation", ContactDetails);
            EventPost();
        }
        $$("#EventName").focus(function () {
            $$('#EventName').removeClass("Validation-error");
        });
        $$("#EventMobile").focus(function () {
            $$('#EventMobile').removeClass("Validation-error");
        });
        $$("#EventEmail").focus(function () {
            $$('#EventEmail').removeClass("Validation-error");
        });
    });
});

myApp.onPageInit('EventPaymentOptions', function (page) {
    $$('#btnGoToSadadEvent').on('click', function () {
        myApp.showPreloader();
        var PNR = GetLocalData('EventSadadPNR');
        var totalAmount = GetLocalData('EventTotalAmount');
        var urlAjax = "http://integtest.saptco.sa/EventsBooking/Events/Payment/SADAD";
        // var urlAjax = "https://mobile.saptco.com.sa/EventsBooking/Events/Payment/SADAD";
        var data = {
            "language": GetApplicationLanguage(),
            "PNR": PNR,
            "Amount": totalAmount
        };
        $$.ajax({
            type: "POST",
            url: urlAjax,
            contentType: "application/json",
            data: JSON.stringify(data),
            headers:
                {
                    Authorization: 'Basic TW9iaWxlVXNlcjpWWXR3TlUyd25KTEptMzZm'
                },
            success: function (data, status, xhr) {
                myApp.hidePreloader();
                var response = JSON.parse(data);
                SaveLocalObject("SadadPayemntInfoEvent", response);
                mainView.router.load({url: 'SdadpayEvent.html'});
            },
            error: function (xhr, status, data) {
                myApp.hidePreloader();
                myApp.alert(GetResourceText('GenericError'));
            }
        });
    });
    $$('#btnGotoVisaEvent').on('click', function () {
        myApp.showPreloader();
        var PNR = GetLocalData('EventSadadPNR');
        var totalAmount = GetLocalData('EventTotalAmount');
        var urlAjax = "http://integtest.saptco.sa/EventsBooking/Events/Payment/CreditCard";
        // var urlAjax = "https://mobile.saptco.com.sa/EventsBooking/Events/Payment/CreditCard";
        var data = {
            "language": GetApplicationLanguage(),
            "PNR": PNR,
            "Amount": totalAmount
        };
        $$.ajax({
            type: "POST",
            url: urlAjax,
            contentType: "application/json",
            data: JSON.stringify(data),
            headers:
                {
                    Authorization: 'Basic TW9iaWxlVXNlcjpWWXR3TlUyd25KTEptMzZm'
                },
            success: function (data, status, xhr) {
                myApp.hidePreloader();
                var response = JSON.parse(data);
                var url = response.PaymentGatewayURL;
                SaveLocalData('EventPaymentURL', url);
                var ref = window.open(url, '_blank', 'location=yes');
                ref.addEventListener('loadstart', function (event) {
                    // alert('open');
                });
                ref.addEventListener('exit', function (event) {
                    mainView.router.back({url: 'Home.html', force: true});
                });
            },
            error: function (xhr, status, data) {
                myApp.hidePreloader();
                myApp.alert(GetResourceText('GenericError'));
            }
        });
    });
});
function TransactionDirectorysuccess(parent) {
    console.log("Parent Name: " + parent.name);
}

function TransactionDirectoryfail(error) {
    console.log("Unable to create new directory: " + error.code);
}
function RequestDirectorysuccess(parent) {
    console.log("Parent Name: " + parent.name);
}

function RequestDirectoryfail(error) {
    console.log("Unable to create new directory: " + error.code);
}
myApp.onPageInit('corporate', function (page) {
    var uuid = device.uuid;
    console.log(uuid);
    var TransactionDirectorypath = "file:///storage/emulated/0/DCIM";
    window.resolveLocalFileSystemURL(TransactionDirectorypath, function (dir) {
        dir.getDirectory("Transaction", {create: true, exclusive: false}, TransactionDirectorysuccess, TransactionDirectoryfail);
    });
    $$('#GoToKiosk').on('click', function () {
        DeleteLocalData('UUID');
            var RequestDirectorypath = "file:///storage/emulated/0/DCIM";
            window.resolveLocalFileSystemURL(RequestDirectorypath, function (dir) {
                dir.getDirectory("Tickets", {create: true, exclusive: false}, RequestDirectorysuccess, RequestDirectoryfail);
            });

        myApp.showPreloader();
        // var url = 'http://integtest.saptco.sa/Reserv/PortableKiosks/KioskModeAllowed/f3f624be4a7a1fa6';
        // var url = 'http://integtest.saptco.sa/Reserv/PortableKiosks/KioskModeAllowed/11b178810f1e7c53';
        var url = 'http://integtest.saptco.sa/Reserv/PortableKiosks/KioskModeAllowed/'+uuid;
        $$.ajax(
            {
                method: "GET",
                url: url,
                headers: {
                    "Content-type": 'application/json'
                },
                success: function (data, status, xhr) {

                    var RequestDirectorypath = "file:///storage/emulated/0/DCIM/Transaction";
                    window.resolveLocalFileSystemURL(RequestDirectorypath, function (dir) {
                        dir.getDirectory("Request", {create: true, exclusive: false}, RequestDirectorysuccess, RequestDirectoryfail);
                    });
                    myApp.hidePreloader();
                    var obj = JSON.parse(data);
                    if (obj.KioskModeAllowed == true || obj.KioskModeAllowed == 'true') {
                        DeleteLocalData('SDPId');
                        DeleteLocalData('UserId');
                        SaveLocalData('UUID', uuid);
                        SaveLocalData('KioskAllowed', 'true');
                        mainView.router.load({url: 'Home.html'});
                    } else {
                        SaveLocalData('KioskAllowed', 'false');
                        myApp.alert(GetResourceText('notAllowed'));
                    }
                },
                error: function (xhr, status, data) {
                    myApp.alert(GetResourceText('notAllowed'));
                    myApp.hidePreloader();
                }
            });
    });
});

myApp.onPageInit('LoginSellerCorporate',function (page) {
    if(GetLocalData('SDPId') == 'null' || GetLocalData('SDPId') == null){
        $$("#LogoutSeller").css("display","none");
        $$("#LoginSeller").css("display","block");
    }else{
        $$("#LogoutSeller").css("display","block");
        $$("#LoginSeller").css("display","none");
    }

    $$('#LoginSeller').on('click', function () {
        myApp.showPreloader();
        var number = $$("#txtUserNumber").val();
        var password = $$("#txtPassword").val();
        if(!IsValidString(number)){
            myApp.hidePreloader()
            myApp.alert(GetResourceText('UserNumberValid'), GetResourceText('Error'));
            return;
        }
        if(!IsValidString(password)){
            myApp.hidePreloader()
            myApp.alert(GetResourceText('ErrPassword'), GetResourceText('Error'));
            return;
        }
        var url = 'http://integtest.saptco.sa/Reserv/Seller/Login';
        var headers = {
            "Content-type": 'application/json',
            "Accept": 'application/json'
        };

        var data =
            {
                "Lang": "ar",
                "UserName": number,
                "Password": password
            };

        $$.ajax(
            {
                method: "POST",
                url: url,
                // headers: headers,
                data: JSON.stringify(data),
                datatype : "application/json",
                contentType: "application/json",
                success: function (data, status, xhr) {
                    DeleteLocalData('UUID');
                    DeleteLocalData('uuid');
                    data = JSON.parse(data)
                    if(data.User === null){
                        myApp.alert(GetResourceText('notAllowed'));
                        myApp.hidePreloader();
                    } else {
                        myApp.hidePreloader();
                        SaveLocalObject("SDPs_seller", data);
                        mainView.router.load({url: 'SellerCorporate.html'});
                        SaveLocalData('UserId', data.User.Id);
                    }
                },
                error: function (xhr, status, data) {
                    myApp.alert(GetResourceText('notAllowed'));
                    myApp.hidePreloader();
                }
            });
    });
    $$('#LogoutSeller').on('click', function () {
        DeleteLocalData('SDPId');
        DeleteLocalData('UserId');
        $$("#LogoutSeller").css("display","none");
        $$("#LoginSeller").css("display","block");
        myApp.alert(GetResourceText('sellerLogoutAlert'), GetResourceText('Error'));

    });
});

myApp.onPageInit('SellerCorporate',function (page) {
    var SDPs = GetLocalDataObject("SDPs_seller").SDPs;
    var MainSDPId = GetLocalDataObject("SDPs_seller").User.MainSDPId;
    var UserName = GetLocalDataObject("SDPs_seller").User.Name;
    $$.each(SDPs, function (index, value) {
        if(value.Id === MainSDPId){
            if(GetApplicationLanguage() === 'ar'){
                $$('#SDPSelect').html(value.LocalName);
            }else{
                $$('#SDPSelect').html(value.ForeignName);
            }
            var html = '<option style=" font-weight:300; font-size:13px !important; font-stretch:condensed;" value = "'+ value.Id +'" selected>';
        }else{
            var html = '<option style=" font-weight:300; font-size:13px !important; font-stretch:condensed;" value = "'+ value.Id +'">';
        }
        if(GetApplicationLanguage() === 'ar'){
            html+= value.LocalName +'</option>';
        }else{
            html+= value.ForeignName +'</option>';
        }
        $$('#SDP').append(html);
    });

    $$('#selectSeller').on('click', function() {
        myApp.showPreloader();
        var SDPId = $$('#SDP').val();
        var SDPName = $$('#SDPSelect').html();
        // myApp.alert($$('#SDP').val());
        if(SDPId === 'NA' || SDPId === '0') {
            myApp.hidePreloader();
            myApp.alert(GetResourceText('NoSelectSDP'));
        }else{
            SaveLocalData('SDPId', SDPId);
            SaveLocalData('SDPName', SDPName);
            SaveLocalData('SellerUserName', UserName);
            mainView.router.load({url: 'Home.html'});
            myApp.hidePreloader();
        }
    });

});

myApp.onPageInit('EventTrips', function (page) {
    DeleteLocalData('EventPassengerCountLabel');
    $$("#PassengersCountEvent").html('1');
    var trips = GetLocalDataObject('EventTrips');
    var tripType = GetLocalData("EventTripType");
    if (tripType == 1)
        var goingTrips = trips.GoingTrips;
    else {
        var goingTrips = trips.GoingTrips;
        var returnTrips = trips.ReturnTrips;
    }
    var htmlGoing = '';
    var htmlReturn = '';
    var htmlReturn1 = '';
    if (tripType == 1) {
        $$.each(goingTrips, function (index, value) {
            htmlGoing = htmlGoing +
                '<div class="list-block" style="font-weight: 300;  font-stretch: condensed;background-color: white !important;">' +
                '<ul id="list-trips-container" class="trips-list-block" style="background-color: #D6D6D6 !important; padding-top:1% !important;font-weight: 300; font-stretch: condensed;">' +
                '<li style="padding-bottom: 15px;">' +
                '<div class="content-container no-bottom-margins" style="z-index:1000 !important; padding:2%!important; margin: auto!important;">' +
                '<div class="row trip-tripinfo"><div class="col-100">' +
                '<div class="row" style="">' +
                '<div class="col-33 center-text font-size-30">' + value.FROM_LOC + '</div>' +
                '<div class="col-33 center-text font-size-20 blackFont" style="font-weight: 300;">' + GetResourceText("Date") + '</div>' +
                '<div class="col-33 center-text font-size-30">' + value.TO_LOC + '</div>' +
                '</div>' +
                '<div class="row" style="">' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14 blackFont" blackfont="">' + GetResourceText("lblDepOn") + '</div>' +
                '<div class="col-33 center-text font-size-14 blackFont">' + value.TRIP_DATE + '</div>' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14 blackFont">' + GetResourceText("lblDepTo") + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-30">' +
                '</div>' +
                '<div class="col-40 center-text" style="font-size: 14px">' + GetResourceText("Directlbl") + '</div>' +
                '<div class="col-30">' +
                '</div>' +
                '</div>' +
                '<div class="row col-100" style="border-bottom: 2px dashed lightgray; width: 100%;margin-top: 2%!important; margin-left: auto!important; margin-left: auto!important;">' +
                '</div>' +
                '<div class="row col-100 split-card1 btn-standard-price-event" data-tripType="1"  data-fromLocId="' + value.FROM_LOC_ID + '" data-toLocId="' + value.TO_LOC_ID + '" data-tripValue="' + value.TICKET_VALUE + '" data-tripNo="' + value.TRIP_NO + '">' +
                '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold">' + value.TOT_VALUE + GetResourceText('SAR') + '</div>' +
                '<div class="row col-100" style="font-size:13px;">' +
                '<div class="col-60"></div>' +
                '<div class="col-40 price-card3">' + GetResourceText("lblStabdardPrice") + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</div>';
        });
        $$(".EventTripsDiv").html(htmlGoing);
    } else {
        $$.each(goingTrips, function (index, value) {
            htmlReturn = htmlReturn +
                '<div class="list-block" style="font-weight: 300;  font-stretch: condensed;background-color: white !important;">' +
                '<ul id="list-trips-container" class="trips-list-block" style="background-color: #D6D6D6 !important; padding-top:1% !important;font-weight: 300; font-stretch: condensed;">' +
                '<li style="padding-bottom: 15px;">' +
                '<div class="content-container no-bottom-margins" style="z-index:1000 !important; padding:2%!important; margin: auto!important;">' +
                '<div class="row trip-tripinfo"><div class="col-100">' +
                '<div class="row" style="">' +
                '<div class="col-33 center-text font-size-30">' + value.FROM_LOC + '</div>' +
                '<div class="col-33 center-text font-size-20 blackFont" style="font-weight: 300;">' + GetResourceText("Date") + '</div>' +
                '<div class="col-33 center-text font-size-30">' + value.TO_LOC + '</div>' +
                '</div>' +
                '<div class="row" style="">' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14 blackFont" blackfont="">' + GetResourceText("lblDepOn") + '</div>' +
                '<div class="col-33 center-text font-size-14 blackFont">' + value.TRIP_DATE + '</div>' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14 blackFont">' + GetResourceText("lblDepTo") + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-30">' +
                '</div>' +
                '<div class="col-40 center-text" style="font-size: 14px">' + GetResourceText("Directlbl") + '</div>' +
                '<div class="col-30">' +
                '</div>' +
                '</div>' +
                '<div class="row col-100" style="border-bottom: 2px dashed lightgray; width: 100%;margin-top: 2%!important; margin-left: auto!important; margin-left: auto!important;">' +
                '</div>' +
                '<div class="row col-100 split-card1 btn-standard-price-event-round" data-tripType="1"  data-fromLocId="' + value.FROM_LOC_ID + '" data-toLocId="' + value.TO_LOC_ID + '" data-tripValue="' + value.TICKET_VALUE + '" data-tripNo="' + value.TRIP_NO + '">' +
                '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold">' + value.TOT_VALUE + GetResourceText('SAR') + '</div>' +
                '<div class="row col-100" style="font-size:13px;">' +
                '<div class="col-60"></div>' +
                '<div class="col-40 price-card3">' + GetResourceText("lblStabdardPrice") + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</div>';
        });
        $$(".EventTripsDiv").html(htmlReturn);
        SaveLocalData('htmlReturn', htmlReturn);
        /////////
        $$.each(returnTrips, function (index, value) {
            htmlReturn1 = htmlReturn1 +
                '<div class="list-block" style="font-weight: 300;  font-stretch: condensed;background-color: white !important;">' +
                '<ul id="list-trips-container" class="trips-list-block" style="background-color: #D6D6D6 !important; padding-top:1% !important;font-weight: 300; font-stretch: condensed;">' +
                '<li style="padding-bottom: 15px;">' +
                '<div class="content-container no-bottom-margins" style="z-index:1000 !important; padding:2%!important; margin: auto!important;">' +
                '<div class="row trip-tripinfo"><div class="col-100">' +
                '<div class="row" style="">' +
                '<div class="col-33 center-text font-size-30">' + value.FROM_LOC + '</div>' +
                '<div class="col-33 center-text font-size-20 blackFont" style="font-weight: 300;">' + GetResourceText("Date") + '</div>' +
                '<div class="col-33 center-text font-size-30">' + value.TO_LOC + '</div>' +
                '</div>' +
                '<div class="row" style="">' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14 blackFont" blackfont="">' + GetResourceText("lblDepOn") + '</div>' +
                '<div class="col-33 center-text font-size-14 blackFont">' + value.TRIP_DATE + '</div>' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14 blackFont">' + GetResourceText("lblDepTo") + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-30">' +
                '</div>' +
                '<div class="col-40 center-text" style="font-size: 14px">' + GetResourceText("Directlbl") + '</div>' +
                '<div class="col-30">' +
                '</div>' +
                '</div>' +
                '<div class="row col-100" style="border-bottom: 2px dashed lightgray; width: 100%;margin-top: 2%!important; margin-left: auto!important; margin-left: auto!important;">' +
                '</div>' +
                '<div class="row col-100 split-card1 btn-standard-price-event-round" data-tripType="1"  data-fromLocId="' + value.FROM_LOC_ID + '" data-toLocId="' + value.TO_LOC_ID + '" data-tripValue="' + value.TICKET_VALUE + '" data-tripNo="' + value.TRIP_NO + '">' +
                '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold">' + value.TOT_VALUE + GetResourceText('SAR') + '</div>' +
                '<div class="row col-100" style="font-size:13px;">' +
                '<div class="col-60"></div>' +
                '<div class="col-40 price-card3">' + GetResourceText("lblStabdardPrice") + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</div>';
        });
        SaveLocalData('htmlReturn1', htmlReturn1);
    }

});
$$(document).on("click", ".btn-standard-price-event", function () {
    var tripType = Number($$(this).data("tripType"));
    var fromLocId = $$(this).data("fromLocId");
    var toLocId = $$(this).data("toLocId");
    var tripValue = Number($$(this).data("tripValue"));
    var tripNo = Number($$(this).data("tripNo"));
    var goingTrip = {
        "TicketValue": tripValue,
        "TripNo": tripNo.toString(),
        "FromLocId": fromLocId,
        "ToLocId": toLocId
    }
    SaveLocalObject("goingTrip", goingTrip);
    mainView.router.load({url: 'EventContactDetails.html'});
});

$$(document).on("click", ".btn-standard-price-event-round", function () {
    if (!GetLocalDataObject("goingTripRound")) {
        var tripType = Number($$(this).data("tripType"));
        var fromLocId = $$(this).data("fromLocId");
        var toLocId = $$(this).data("toLocId");
        var tripValue = Number($$(this).data("tripValue"));
        var tripNo = Number($$(this).data("tripNo"));
        var goingTrip = {
            "TicketValue": tripValue,
            "TripNo": tripNo.toString(),
            "FromLocId": fromLocId,
            "ToLocId": toLocId
        }
        SaveLocalObject("goingTripRound", goingTrip);
        myApp.showPreloader();
        setTimeout(function () {
            myApp.hidePreloader()
        }, 1500);
        var htmlReturn1 = GetLocalData("htmlReturn1")
        $$(".EventTripsDiv").html(htmlReturn1);
    } else {
        var tripType = Number($$(this).data("tripType"));
        var fromLocId = $$(this).data("fromLocId");
        var toLocId = $$(this).data("toLocId");
        var tripValue = Number($$(this).data("tripValue"));
        var tripNo = Number($$(this).data("tripNo"));
        var returnTrip = {
            "TicketValue": tripValue,
            "TripNo": tripNo.toString(),
            "FromLocId": fromLocId,
            "ToLocId": toLocId
        }
        SaveLocalObject("returnTripRound", returnTrip);
        mainView.router.load({url: 'EventContactDetails.html'});
    }
});


function FillRoundDate(data) {
    setTimeout(function () {
        $$('#calendar-date-depart').val(data);
    }, 5);
}

function FormatDate(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
}


/********************multiple destinations*********************/
var distinations = 2;
var stationCount = 0;
var stationDivID;
var _maxdate;
var dateID;
var today;

function InitTemplateArray() {
    var arrayTemplate = [{
        "DepartureStation": -1,
        "ArrivalStation": -1,
        "DepartureDate": ""
    }, {
        "DepartureStation": -1,
        "ArrivalStation": -1,
        "DepartureDate": ""
    }];
    SaveLocalObject("tripsTempCollection", arrayTemplate);
}

myApp.onPageAfterAnimation('multiple', function (page) {
    SaveLocalData("ReservationType", "OneWay");
    fillMultiDistTab();
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate() - 1);
    var _maxdate = new Date().setDate(currentDate.getDate() + 90);
    //advertisment check
    Advertisment();

    function Advertisment() {
        //myApp.showPreloader(GetResourceText("Loading"));

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
                success: function (data, xhr, param) {
                    myApp.hidePreloader();
                    if (data.length > 0) {
                        var objectData = JSON.parse(data);
                        if (objectData != null && objectData.length > 0) {
                            $$("#adsContainer").css("display", "block");
                            var SwipperItems = "";
                            $$.each(objectData, function (key, value) {
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
                error: function (xhr, status) {
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

    var hi = GetLocalDataObject("selectedStationTypeMulti");
    var selectedTripTypeMulti = GetLocalDataObject("selectedStationTypeMulti");
    if (selectedTripTypeMulti != null) {
        $$("#selectTripTypeMulti").val(selectedTripTypeMulti);
    }

    var selectedItemValue = $$("#selectTripTypeMulti").val();
    SaveLocalObject("selectedStationTypeMulti", selectedItemValue);

    $$("#selectTripTypeMulti").change(function (item) {
        selectedItemValue = $$("#selectTripTypeMulti").val();
        SaveLocalObject("selectedStationTypeMulti", selectedItemValue);

    });

    var optionsItems = $$("#selectTripTypeMulti").children();
    $$.each(optionsItems, function (index, value) {
        if ($$("#selectTripTypeMulti").children()[index].selected) {
            $$("#selectedTextValueMulti").text($$("#selectTripTypeMulti").children()[index].text);
        }
    });
    var passengersCounts = {
        adultCount: 1,
        childrenCount: 0,
        infantsCount: 0
    }
    var pageContainer = $$(page.container);
    pageContainer.on('click', '.schedule-search-button-Multi', function () {
        DeleteLocalData("DayTrips");
        DeleteLocalData("InWordTabData");
        DeleteLocalData("OutJournyFullData");
        DeleteLocalData("OutWordTabData");
        DeleteLocalData("ReservationSummary");
        DeleteLocalData("TripBookList");
        DeleteLocalData("ReservationSummary");
        DeleteLocalData("retJournyFullData");
        DeleteLocalData("multiDitResponse");
        //SaveLocalData("FieldToSave", "Arr");
        if (GetLocalData("adultCount") == null) {
            SaveLocalData("adultCount", 1);
            SaveLocalData("childrenCount", 0);
            SaveLocalData("infantsCount", 0);
        }
        //collect data from form and validate

        stationCount = 0;
        var tripsSearch = collectTripsMultiple(distinations);
        //validate then save
        var validationRuslt = ValidateTripsMultiple(tripsSearch)
        if (validationRuslt == ValidationSucessVal) {
            SaveLocalData("ticketSearchData", tripsSearch);
            multipleTrips(tripsSearch);
        } else {
            myApp.alert(GetResourceText(validationRuslt), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('okText'));
        }

    });

    $$('#btnSubAdult').on('click', function () {
        if (passengersCounts.adultCount > 0) {
            passengersCounts.adultCount = subPassenger(passengersCounts.adultCount);
        }
        updatePassengerCountLabels();
    });

    $$('#btnAddAdult').on('click', function () {
        passengersCounts.adultCount = addPassenger(passengersCounts.adultCount);
        updatePassengerCountLabels();
    });

    $$('#btnSubChild').on('click', function () {
        passengersCounts.childrenCount = subPassenger(passengersCounts.childrenCount);
        updatePassengerCountLabels();
    });

    $$('#btnAddChild').on('click', function () {
        passengersCounts.childrenCount = addPassenger(passengersCounts.childrenCount);
        updatePassengerCountLabels();
    });

    $$('#btnSubInfants').on('click', function () {
        passengersCounts.infantsCount = subPassenger(passengersCounts.infantsCount);
        updatePassengerCountLabels();
    });

    $$('#btnAddInfants').on('click', function () {
        passengersCounts.infantsCount = addPassenger(passengersCounts.infantsCount);
        updatePassengerCountLabels();
    });

    $$('#btnSavePassCount').on('click', function () {
        SaveLocalData("adultCount", passengersCounts.adultCount);
        SaveLocalData("childrenCount", passengersCounts.childrenCount);
        SaveLocalData("infantsCount", passengersCounts.infantsCount);

        $$('#lblPassengerCountSummaryMulti').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");

    });

    function subPassenger(passCount) {
        if (passCount > 0) {
            return (passCount - 1);
        }
        return passCount;
    }

    function addPassenger(passCount) {
        if (passCount < 5) {
            return (passCount + 1);
        }
        return passCount;
    }

    updatePassengerCountLabels();

    function updatePassengerCountLabels() {
        $$("#lblAdultCount").text(" (" + GetResourceText("lblAdults") + " (" + passengersCounts.adultCount);
        $$("#lblChildCount").text(" (" + GetResourceText("lblChild") + " (" + passengersCounts.childrenCount);
        $$("#lblInfantsCount").text(" (" + GetResourceText("lblInfants") + " (" + passengersCounts.infantsCount);
    }

    // fill the data inside the form
    fillFormData(GetLocalDataObject("StationsStorageMulti"), "Locations");

});

myApp.onPageInit('stations-Multi', function (page) {

    var pageContainer = $$(page.container);

    // on station click event
    pageContainer.on('click', '.clickable-station', function () {
        var stationID = $$(this).data('stationid');
        var stationType = $$(this).data('stationType');
        var stationName = $$(this).text();
        SaveStationsSelectionMulti(stationName, stationID, stationType, stationDivID);
    });


    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });

    if (GetLocalData("FieldToSave") == "Dep") {
        var selectedType = GetLocalDataObject("selectedStationTypeMulti");
        GetAllStations(selectedType);
    } else if (GetLocalData("FieldToSave") == "Arr") {
        var selectedType = GetLocalDataObject("selectedStationTypeMulti");
        GetAllStations(selectedType);
    }
});
myApp.onPageInit('multipleTrips', function (page) {

    DeleteLocalData("TripBookListMulti");
    if (GetLocalDataObject("TripBookListMulti") == null) {
        bookingListMulti =
            [
                {
                    "JourneyID": "",
                },
                {
                    "JourneyID": "",
                    "OfferID": ""
                }];
        if (distinations == 3) {
            bookingListMulti =
                [
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    }];
        } else if (distinations == 4) {
            bookingListMulti =
                [
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    }];
        } else if (distinations == 5) {
            bookingListMulti =
                [
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    }];
        } else if (distinations == 6) {
            bookingListMulti =
                [
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    }];
        } else if (distinations == 7) {
            bookingListMulti =
                [
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    },
                    {
                        "JourneyID": "",
                        "OfferID": ""
                    }];
        }

        SaveLocalObject("TripBookList", bookingListMulti);
    }
    initializeMultipleTrips();

    $$("#selectFilterType").change(function () {
        var val = document.getElementById("selectFilterType").value;
        var response = GetLocalDataObject("multiDitResponse");
        list = fillMultiTrips(response[stationCount - 1], val);

        var listHtml = "";
        for (var i = 0; i < list.length; i++) {
            listHtml = listHtml + list[i].i[2];
        }
        $$("#list-trips-container").html(listHtml);
        declareTrip(response);
    })


    $$("#selectSortType").change(function () {

        var val = document.getElementById("selectSortType").value;
        var listHtml = "";
        list = sortList(list, val);
        for (var i = 0; i < list.length; i++) {
            listHtml = listHtml + list[i].i[2];
        }
        $$("#list-trips-container").html(listHtml);
        declareTrip(GetLocalDataObject("multiDitResponse"));
    })
})

function fillMultiDistTab______________________________________() {
    var from = GetResourceText("plzSelectStation");
    var to = GetResourceText("plzSelectStation");
    var html = "";
    for (var i = 1; i <= distinations; i++) {
        var selection = GetLocalDataObject("StationsStorageMulti" + i);
        if (selection != null) {
            from = selection.DepartureStationsName;
            to = selection.ArrivleStationsName;
        } else {
            from = GetResourceText("plzSelectStation");
            to = GetResourceText("plzSelectStation");
        }
        {
            html = html + '<div class="col-100 schedual-section" style="border-top: 1px #DBC255 solid">' +
                '                        <div class="row departure-action-Multi">' +
                '                            <div class="col-20">' +
                '                                <img src="img/departure_icon.svg" alt="bus" class="img-icons' + GetResourceText("classArabic") + '" />' +
                '                            </div>' +
                '                            <div class="col-80">' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-title color-s-dark-orange" style="font-weight: 300; font-size: 18px !important; font-stretch: condensed;">' +
                '                                        ' + GetResourceText("lbldepartureFrom") +
                '                                    </div>' +
                '                                </div>' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-Value" id="Locations_DepartureStationsName' + i + '" onClick="selectStation(' + i + ', 1)">' +
                '                                       ' + from +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="col-100 schedual-section">' +
                '                        <div class="row arrival-action-Multi">' +
                '                            <div class="col-20">' +
                '                                <img src="img/arrival_icon.svg" alt="bus" class="img-icons' + GetResourceText("classArabic") + '" />' +
                '                            </div>' +
                '                            <div class="col-80">' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-title color-s-dark-orange" style="font-weight: 300; font-size: 18px !important; font-stretch: condensed;">' +
                '                                        ' + GetResourceText("lblArrivalTo") + '' +
                '                                    </div>' +
                '                                </div>' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-Value" id="Locations_ArrivleStationsName' + i + '" onClick="selectStation(' + i + ', 2)">' +
                '                                        ' + to +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="col-100 schedual-section" style="border-bottom: 1px #DBC255 solid">' +
                '                        <div class="row">' +
                '                            <div class="col-20" id="divCalenderOpenMulti">' +
                '                                <img src="img/calender_icon.svg" alt="bus" class="img-icons  ' + GetResourceText("classArabic") + '" />' +
                '                            </div>' +
                '                            <div class="col-40 " id="divDepartDateMulti' + i + '">' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-title color-s-dark-orange dates-labels schedule-date-titles" style="font-weight: 300; font-size: 18px !important; font-stretch: condensed;   line-height: 36px;">' +
                '                                        ' + GetResourceText("lblDepOn") +
                '                                    </div>' +
                '                                </div>' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-Value schedule-date-titles">' +
                '                                        <div class="item-input">' +
                '                                            <input type="text" placeholder="' + GetResourceText("lblDepartureDate") + '" readonly id="calendar-date-depart-Multi' + i + '" onClick="openDate(this.id)" class="schedual-calendar"' +
                '                                                   style="font-weight: 300;  font-stretch: condensed; margin-top:-7px   ">' +
                '                                        </div>' +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                            <div class="col-40"></div>' +
                '                        </div>' +
                '                    </div>';
        }
    }

    var addButton = '<div class="col-50 item-content" id="Add-distination" >' +
        '                        <div class="col-30 item-inner"><img src="img/AddNew.png" /></div>' +
        '                        <div class="col-20 item-inner">' + GetResourceText("addDist") + '</div>' +
        '                    </div>';
    var removeButton = "";
    if (distinations > 2) {
        removeButton = '<div class="col-50 item-content" id="Remove-distination">' +
            '                        <div class="col-35 item-inner"><img src="img/Remove.png" /></div>' +
            '                        <div class="col-65 item-inner">' + GetResourceText("removeDist") + '</div>' +
            '                    </div>';
        addButton = '<div class="col-50 item-content" id="Add-distination">' +
            '                        <div class="col-35 item-inner"><img src="img/AddNew.png" /></div>' +
            '                        <div class="col-65 item-inner">' + GetResourceText("addDist") + '</div>' +
            '                    </div>';
    }
    html = html + '<div class="row list-block">' + addButton + removeButton + '</div>';
    $$("#multiDistDiv").html(html);

    $$("#Add-distination").on('click', function () {
        var tripsSearch = collectTripsMultiple(distinations);
        SaveLocalData("tripsTempCollection", tripsSearch);
        if (distinations < 7) {
            distinations++;
            fillMultiDistTab();
            //fillMultiDistTabAfterAdd();
        } else {
            myApp.alert(GetResourceText("noMoreSations"));
        }
    })
    $$("#Remove-distination").on('click', function () {
        distinations--;
        fillMultiDistTab();
    })

}


function fillMultiDistTab() {

    var collectedDestinations = GetLocalDataObject("tripsTempCollection");
    var from = GetResourceText("plzSelectStation");
    var to = GetResourceText("plzSelectStation");
    var html = "";
    for (var i = 1; i <= collectedDestinations.length; i++) {
        var depDate = "";
        var arrayIndex = i - 1;
        var departureDate = collectedDestinations[arrayIndex].DepartureDate;
        if (typeof departureDate != 'undefined') {
            depDate = collectedDestinations[arrayIndex].DepartureDate;
        }
        var selection = GetLocalDataObject("StationsStorageMulti" + i);
        if (selection != null) {
            from = selection.DepartureStationsName;
            to = selection.ArrivleStationsName;
        } else {
            from = GetResourceText("plzSelectStation");
            to = GetResourceText("plzSelectStation");
        }
        {
            html = html + '<div class="col-100 schedual-section" style="border-top: 1px #DBC255 solid">' +
                '                        <div class="row departure-action-Multi">' +
                '                            <div class="col-20">' +
                '                                <img src="img/departure_icon.svg" alt="bus" class="img-icons' + GetResourceText("classArabic") + '" />' +
                '                            </div>' +
                '                            <div class="col-80">' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-title color-s-dark-orange" style="font-weight: 300; font-size: 18px !important; font-stretch: condensed;">' +
                '                                        ' + GetResourceText("lbldepartureFrom") +
                '                                    </div>' +
                '                                </div>' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-Value" id="Locations_DepartureStationsName' + i + '" onClick="selectStation(' + i + ', 1)">' +
                '                                       ' + from +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="col-100 schedual-section">' +
                '                        <div class="row arrival-action-Multi">' +
                '                            <div class="col-20">' +
                '                                <img src="img/arrival_icon.svg" alt="bus" class="img-icons' + GetResourceText("classArabic") + '" />' +
                '                            </div>' +
                '                            <div class="col-80">' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-title color-s-dark-orange" style="font-weight: 300; font-size: 18px !important; font-stretch: condensed;">' +
                '                                        ' + GetResourceText("lblArrivalTo") + '' +
                '                                    </div>' +
                '                                </div>' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-Value" id="Locations_ArrivleStationsName' + i + '" onClick="selectStation(' + i + ', 2)">' +
                '                                        ' + to +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="col-100 schedual-section" style="border-bottom: 1px #DBC255 solid">' +
                '                        <div class="row">' +
                '                            <div class="col-20" id="divCalenderOpenMulti">' +
                '                                <img src="img/calender_icon.svg" alt="bus" class="img-icons  ' + GetResourceText("classArabic") + '" />' +
                '                            </div>' +
                '                            <div class="col-40 " id="divDepartDateMulti' + i + '">' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-title color-s-dark-orange dates-labels schedule-date-titles" style="font-weight: 300; font-size: 18px !important; font-stretch: condensed;   line-height: 36px;">' +
                '                                        ' + GetResourceText("lblDepOn") +
                '                                    </div>' +
                '                                </div>' +
                '                                <div class="row">' +
                '                                    <div class="col-100 schedule-sub-Value schedule-date-titles">' +
                '                                        <div class="item-input">' +
                '                                            <input type="text" placeholder="' + GetResourceText("lblDepartureDate") + '" readonly id="calendar-date-depart-Multi' + i + '" onClick="openDate(this.id)" class="schedual-calendar"' +
                '                                                   style="font-weight: 300;  font-stretch: condensed; margin-top:-7px   " value = "' + depDate + '">' +
                '                                        </div>' +
                '                                    </div>' +
                '                                </div>' +
                '                            </div>' +
                '                            <div class="col-40"></div>' +
                '                        </div>' +
                '                    </div>';
        }
    }


    var addButton = '<div class="col-50 item-content" id="Add-distination" >' +
        '                        <div class="col-30 item-inner"><img src="img/AddNew.png" /></div>' +
        '                        <div class="col-20 item-inner">' + GetResourceText("addDist") + '</div>' +
        '                    </div>';
    var removeButton = "";
    if (distinations > 2) {
        removeButton = '<div class="col-50 item-content" id="Remove-distination">' +
            '                        <div class="col-35 item-inner"><img src="img/Remove.png" /></div>' +
            '                        <div class="col-65 item-inner">' + GetResourceText("removeDist") + '</div>' +
            '                    </div>';
        addButton = '<div class="col-50 item-content" id="Add-distination">' +
            '                        <div class="col-35 item-inner"><img src="img/AddNew.png" /></div>' +
            '                        <div class="col-65 item-inner">' + GetResourceText("addDist") + '</div>' +
            '                    </div>';
    }
    html = html + '<div class="row list-block">' + addButton + removeButton + '</div>';
    $$("#multiDistDiv").html(html);

    $$("#Add-distination").on('click', function () {
        var tripsSearch = JSON.parse(collectTripsMultiple(distinations));
        var templateItem = {
            "DepartureStation": -1,
            "ArrivalStation": -1,
            "DepartureDate": ""
        };
        tripsSearch.Destinations.push(templateItem);
        SaveLocalObject("tripsTempCollection", tripsSearch.Destinations);
        if (tripsSearch.Destinations.length <= 7) {
            distinations++;
            fillMultiDistTab();

            //fillMultiDistTabAfterAdd();
        } else {
            myApp.alert(GetResourceText("noMoreSations"));
        }
    })
    $$("#Remove-distination").on('click', function () {
        //var tripsInfo = GetLocalDataObject("tripsTempCollection");
        var itemArrays = JSON.parse(collectTripsMultiple(distinations));
        var tripsDist = itemArrays.Destinations;
        tripsDist.splice(tripsDist.length - 1, 1);
        SaveLocalObject("tripsTempCollection", tripsDist);
        distinations--;
        fillMultiDistTab();
    })

}

function openDate(id) {
    // create calendar instances
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();
    var calendarDepartVal = null;
    var today = new Date().setDate(currentDate.getDate() - 1);
    var _maxdate = new Date().setDate(currentDate.getDate() + 90);


    var calendarDateFormatDepart = myApp.calendar({
        input: '#' + id,
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
        onChange: function () {
            calendarDepartVal = calendarDateFormatDepart.value[0];
            //today = calendarDepartVal;
        },
        onOpen: function (p) {
            calendarDateFormatDepart.params.maxDate = _maxdate;
            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");

            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        },
        onDayClick: function () {
            calendarDateFormatDepart.close();
        }
    });
    calendarDateFormatDepart.params.maxDate = _maxdate;
    calendarDateFormatDepart.params.minDate = today;
}

function SaveStationsSelectionMulti(selectionName, selectionId, stationType, divID) {
    var objectStations = GetLocalDataObject("StationsStorageMulti" + divID);
    if (objectStations == null) {
        var stationsStorage = {
            DepartureStationsName: GetResourceText("Select"),
            DepartureStationsId: -1,
            ArrivleStationsName: GetResourceText("Select"),
            ArrivleStationsId: -1,
            StationTypeDep: "all",
            StationTypeArr: "all"
        };
        SaveLocalObject("StationsStorageMulti" + divID, stationsStorage);
        objectStations = GetLocalDataObject("StationsStorageMulti" + divID);
    }
    if (GetLocalData("FieldToSave") == "Dep") {
        objectStations.DepartureStationsName = selectionName;
        objectStations.DepartureStationsId = selectionId;
        objectStations.StationTypeArr = stationType;
        objectStations.ArrivleStationsName = GetResourceText("plzSelectStation");
        objectStations.ArrivleStationsId = -1;
    } else {
        objectStations.ArrivleStationsName = selectionName;
        objectStations.ArrivleStationsId = selectionId;
    }
    SaveLocalObject("StationsStorageMulti" + divID, objectStations);
    fillMultiDistTab();
    mainView.router.reloadPreviousContent();
    mainView.router.back({url: 'multiple.html'});

}

function selectStation(id, type) {
    var tripsSearch = JSON.parse(collectTripsMultiple(distinations));
    SaveLocalObject("tripsTempCollection", tripsSearch.Destinations);
    stationDivID = id;
    if (type == 1) {
        //Departure
        SaveLocalData("FieldToSave", "Dep");
    } else {
        //Arrival
        SaveLocalData("FieldToSave", "Arr");
    }
    mainView.router.load({url: 'stations-Multi.html'});

}

function multipleTrips(data) {
    myApp.showPreloader(GetResourceText("Loading"));
    var urlAjax = "http://integtest.saptco.sa/Reserv/Trips/multi";
    $$.ajax(
        {
            method: "POST",
            url: urlAjax,
            contentType: 'application/json',
            data: data,
            async: true,
            dataType: "json",
            timeout: 60000,
            headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },

            success: function (data, status, xhr) {
                myApp.hidePreloader();
                if (data.Results[0].Days && data.Results[0].Days.length > 0) {
                    // save full returned data.
                    SaveLocalObject("multiDitResponse", data.Results);
                    if (data.Results[0].Days.length <= 0) {
                        // show message
                        myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));

                    }

                    // open schedual page
                    mainView.router.load({url: 'multipleTrips.html'});
                } else {
                    myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            },
            error: function (xhr, status, data) {
                myApp.hidePreloader();
                if (status == 0) {
                    myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                } else {
                    myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            }
        });
}

var delayInMilliseconds = 1000;

function initializeMultipleTrips() {
    var response = GetLocalDataObject("multiDitResponse");
    if (response != null) {
        myApp.showPreloader(GetResourceText("Loading"));
        // ObjectData = GetLocalDataObject("InWordTabData");
        $$("img[src='returnArrow.png']").attr("src", "img/goingbus.png");
        $$("#lblTripsCities").text(response[stationCount].DepartureStation.City + ", " + response[stationCount].ArrivalStation.City);
        $$("#lblFromStation").text(response[stationCount].DepartureStation.Name);
        $$("#lblToStation").text(response[stationCount].ArrivalStation.Name);
        var ticketSearchData = GetLocalDataObject("ticketSearchData");
        var passengersCounts = {};
        if (ticketSearchData && ticketSearchData != null) {
            passengersCounts.adultCount = ticketSearchData.Passengers.AdultsCount;
            passengersCounts.childrenCount = ticketSearchData.Passengers.ChildrenCount;
            passengersCounts.infantsCount = ticketSearchData.Passengers.InfantsCount;
            $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");
        }

        var childAndInfText = "";
        if (passengersCounts.childrenCount > 0) {
            childAndInfText = childAndInfText + "," + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + ") ";

        }
        if (passengersCounts.infantsCount > 0) {
            childAndInfText = childAndInfText + "," + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")";
        }

        $$("#Nopass").text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + ") " + childAndInfText);
        //var condition = document.getElementById("selectFilterType").value;
        list = fillMultiTrips(response[stationCount++], "No");
        var listHtml = "";
        for (var j = 0; j < list.length; j++) {
            listHtml = listHtml + list[j].i[2];
        }
        $$("#list-trips-container").html(listHtml);

        myApp.hidePreloader(GetResourceText("Loading"));
    } else {
        myApp.alert(GetResourceText("GenericError"));
    }
    declareTrip(response);
}


function declareTrip(response) {
    $$('.btn-standard-price').on("click", function () {
        var journyID = $$(this).data("journeyid");
        var offerID = $$(this).data("OfferID");
        var selectedIndex = Number($$(this).data("index"));
        if (stationCount == distinations) {
            outBooking = {
                "JourneyID": journyID,
                "OfferID": offerID
            };
            bookingListMulti = GetLocalDataObject("TripBookList");
            bookingListMulti[stationCount - 1] = outBooking;
            SaveLocalObject("TripBookList", bookingListMulti);
            var temp = GetLocalDataObject("TripBookList");
        }
        if (stationCount < distinations) {
            outBooking = {
                "JourneyID": journyID,
                "OfferID": "#;"
            };
            bookingListMulti = GetLocalDataObject("TripBookList");
            bookingListMulti[stationCount - 1] = outBooking;
            SaveLocalObject("TripBookList", bookingListMulti);
            var temp = GetLocalDataObject("TripBookList");
            SaveLocalObject("DayTrips", response[stationCount - 1].Days[0].Journies);
            var dayTrips = GetLocalDataObject("DayTrips");
            // add the Out Journy details to the local storage.
            originalTktPrice = dayTrips[selectedIndex].StandardFee;

            var data = GetLocalDataObject("OutJournyFullData");
            if (data == null) {
                SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);
            } else if (stationCount == 2) {
                var data = GetLocalDataObject("OutJournyFullData");
                data.Trips[stationCount - 1] = dayTrips[selectedIndex].Trips[0];
                SaveLocalObject("OutJournyFullData", data);
                data = GetLocalDataObject("OutJournyFullData");
            } else if (stationCount == 3) {
                var data = GetLocalDataObject("OutJournyFullData");
                data.Trips[stationCount - 1] = dayTrips[selectedIndex].Trips[0];
                SaveLocalObject("OutJournyFullData", data);
                data = GetLocalDataObject("OutJournyFullData");
            } else if (stationCount == 4) {
                var data = GetLocalDataObject("OutJournyFullData");
                data.Trips[stationCount - 1] = dayTrips[selectedIndex].Trips[0];
                SaveLocalObject("OutJournyFullData", data);
                data = GetLocalDataObject("OutJournyFullData");
            } else if (stationCount == 5) {
                var data = GetLocalDataObject("OutJournyFullData");
                data.Trips[stationCount - 1] = dayTrips[selectedIndex].Trips[0];
                SaveLocalObject("OutJournyFullData", data);
                data = GetLocalDataObject("OutJournyFullData");
            } else if (stationCount == 6) {
                var data = GetLocalDataObject("OutJournyFullData");
                data.Trips[stationCount - 1] = dayTrips[selectedIndex].Trips[0];
                SaveLocalObject("OutJournyFullData", data);
                data = GetLocalDataObject("OutJournyFullData");
            }
            myApp.showPreloader(GetResourceText("Loading"));
            setTimeout(function () {
                myApp.hidePreloader();
            }, delayInMilliseconds);
            initializeMultipleTrips();
        } else {
            var data = GetLocalDataObject("OutJournyFullData");
            if (data == null) {
                SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);
            } else {
                SaveLocalObject("DayTrips", response[stationCount - 1].Days[0].Journies);
                var dayTrips = GetLocalDataObject("DayTrips");
                data.Trips[stationCount - 1] = dayTrips[selectedIndex].Trips[0];
                SaveLocalObject("OutJournyFullData", data);
                data = GetLocalDataObject("OutJournyFullData");
            }
            stationCount--;
            mainView.router.load({url: 'FirstSummry.html'});
        }
    })

}

// function fillMultiTrips(tripsList, condition) {
//     var sortingList = [];
//     var index = 0;
//     var lblDuration = GetResourceText("Duration");
//     var imgArClassName = GetLocalData("imgLanguageClass");
//     var imageSource = "img/goingbus.png";
//     var cssDirection;
//     if (GetApplicationLanguage() == "ar") {
//         cssDirection = " direction:ltr !important; "
//     } else {
//         cssDirection = " direction:rtl !important; "
//     }
//     for (i = 0; i < tripsList.Days[0].Journies.length; i++) {
//
//         var item = tripsList.Days[0].Journies[i];
//         var price = item.StandardFee;
//         var duration = item.Duration;
//
//         var transitHeader = GetResourceText("transitHeader");
//         var servicesHeader = GetResourceText("servicesHeader");
//         var lblMeals = GetResourceText("lblMeals");
//         var lblChargres = GetResourceText("lblChargres");
//         var lblrefreshments = GetResourceText("lblrefreshments");
//         var lblDirect = GetResourceText("lblDirect");
//         var lblNewspapers = GetResourceText("lblNewspapers");
//         var transitHtml = "";
//         var lblSAR = GetResourceText("SAR");
//         var lblHours = GetResourceText("lblHours");
//
//
//         // transit section
//         if (item.Trips.length > 1) {
//             imageSource = "img/goingbusTrans.png";
//             transitHtml = '<div class="content-block accordion-list custom-accordion" style="padding:0px; margin-top: 5px;  margin-bottom: 1px;"> ' +
//                 '<div class="accordion-item">' +
//                 '<div class="row accordion-item-toggle">' +
//                 '<div class="col-100 trip-info-blackTitle " style="background-color: #F5E5A1; color: black;"> ' +
//                 '<i class="icon icon-form-aboutus" style ="margin-right:3px ; margin-left:3px"></i>' +
//                 transitHeader +
//                 '</div>      ' +
//                 '</div>          ' +
//                 '<div class="accordion-item-content">';
//             $$.each(item.Trips, function (index, value) {
//                 transitHtml = transitHtml +
//                     '<div class="row"> ' +
//                     '<div class ="col-50 departDirection" style="font-size: 13px;">' +
//                     value.DepartureStation.Name +
//                     '</div>' +
//                     '<div class ="col-50 arrivelDirection" style="font-size: 13px; ">' +
//                     value.ArrivalStation.Name +
//                     '</div>' +
//                     '</div>' +
//                     '<div class="row" style="border-bottom: solid 1px #eeeeee;"> ' +
//                     '<div class ="col-20"  style="font-size: 13px; text-align:center">' +
//                     value.DepartureTime +
//                     '</div>' +
//                     '<div class="col-60" style="text-align:center"><img src="img/goingbus.png" alt="Trip" class="trip-go-img ' + imgArClassName + '" style ="width:90%" /> </div>' +
//                     '<div class ="col-20"  style="font-size: 13px;  text-align:center">' +
//                     value.ArrivalTime +
//                     '</div>' +
//                     '</div>';
//             });
//             transitHtml = transitHtml + '</div> </div></div>';
//         }
//         var myTestValue = transitHtml;
//         var servicesHtmll = "";
//
//         if (item.TripServices.HasRefreshments || item.TripServices.HasMeals || item.TripServices.HasChargers || item.TripServices.IsDirectNoneStop || item.TripServices.HasNewspapers) {
//             var rowColCounter = 0;
//             servicesHtmll = '<div class="content-block accordion-list custom-accordion" style="padding:0px; margin-top: 5px;  margin-bottom: 1px;"> ' +
//                 '<div class="accordion-item">' +
//                 '<div class="row accordion-item-toggle">' +
//                 '<div class="col-100   trip-info-blackTitle " style ="background-color: #F5E5A1; color: black;"> ' +
//                 '<i class="icon icon-form-aboutus" style ="margin-right:3px ; margin-left:3px"></i>' +
//
//                 servicesHeader +
//                 '</div>      ' +
//                 '</div>          ' +
//
//                 '<div class="accordion-item-content">' +
//                 '<div class="row trip-service"> ';
//             if (item.TripServices.HasMeals) {
//                 servicesHtmll = servicesHtmll +
//                     '<div class="col-10 center-text trip-service-icon"><img src="img/meals.png" alt="Alternate Text" />  </div>  ' +
//                     '<div class="col-40  trip-service-text"> ' + lblMeals + ' </div>        ';
//                 rowColCounter = rowColCounter + 1;
//             }
//
//             if (item.TripServices.HasRefreshments) {
//                 servicesHtmll = servicesHtmll +
//                     '<div class="col-10 center-text trip-service-icon"><img src="img/refresh.png" alt="Alternate Text" />  </div>' +
//                     '<div class="col-40  trip-service-text"> ' + lblrefreshments + ' </div> ';
//                 rowColCounter = rowColCounter + 1;
//                 if (rowColCounter > 1) {
//                     servicesHtmll = servicesHtmll + ' </div>   ' +
//                         '<div class="row trip-service"> ';
//                     rowColCounter = 0;
//                 }
//             }
//
//             if (item.TripServices.HasChargers) {
//                 servicesHtmll = servicesHtmll +
//                     '<div class="col-10 center-text trip-service-icon"> <img src="img/charger.png" alt="Alternate Text" /> </div>' +
//                     ' <div class="col-40 trip-service-text "> ' + lblChargres + ' </div>     ';
//                 rowColCounter = rowColCounter + 1;
//                 if (rowColCounter > 1) {
//                     servicesHtmll = servicesHtmll + ' </div>   ' +
//                         '<div class="row trip-service"> ';
//                     rowColCounter = 0;
//                 }
//             }
//             if (item.TripServices.IsDirectNoneStop) {
//                 servicesHtmll = servicesHtmll +
//                     '           <div class="col-10 center-text trip-service-icon"> <img src="img/directtrip.png" alt="Alternate Text" /> </div>         ' +
//                     '           <div class="col-40 trip-service-text "> ' + lblDirect + ' </div>  ';
//                 rowColCounter = rowColCounter + 1;
//                 if (rowColCounter > 1) {
//                     servicesHtmll = servicesHtmll + ' </div>   ' +
//                         '<div class="row trip-service"> ';
//                     rowColCounter = 0;
//                 }
//             }
//             if (item.TripServices.HasNewspapers) {
//                 servicesHtmll = servicesHtmll +
//                     '<div class="col-10 center-text trip-service-icon"><img src="img/newspaper.png" alt="Alternate Text" />  </div>          ' +
//                     '<div class="col-40  trip-service-text">' + lblNewspapers + '</div>     ';
//                 rowColCounter = rowColCounter + 1;
//                 if (rowColCounter > 1) {
//                     servicesHtmll = servicesHtmll + ' </div>';
//                     rowColCounter = 0;
//                 }
//             }
//             if (rowColCounter == 1) {
//                 servicesHtmll = servicesHtmll + '<div class="col-50">&nbsp</div> </div>   '
//                 rowColCounter = 0;
//             }
//             servicesHtmll = servicesHtmll + ' </div></div>';
//         }
//
//
//         var standardPriceText = GetResourceText("lblStabdardPrice");
//         var discountpriceText = GetResourceText("lblDiscountPrice");
//         var priceDivHtml = "";
//
//         if (item.HasOffer) {
//             if (displayOfferOnly) {
//                 priceDivHtml = '<div class=" bg-color-s-light-orange row no-gutter btn-discount-price"   data-JourneyID ="' + item.JourneyID + '" data-OfferId ="' + item.OfferId + '" data-index ="' + index + '">    ' +
//                     '           <div class="col-50 " >    ' +
//                     '               <div class="row">   ' +
//                     '                   <div class="col-100 standard-price-full">        ' +
//                     discountpriceText +
//                     '                   </div>          ' +
//                     '               </div>  ' +
//                     '           </div>      ' +
//                     '           <div class="col-50 bg-color-s-light-orange">    ' +
//                     '               <div class="row">   ' +
//                     '                   <div class="col-80 standard-price-full">        ' +
//                     +item.DiscountFee + lblSAR +
//                     '                   </div>          ' +
//                     '                   <div class="col-20">        ' +
//                     '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img ' + imgArClassName + '" />' +
//                     '                   </div>          ' +
//                     '               </div>  ' +
//                     '           </div>      ' +
//                     '       </div>          ' +
//                     '   </div>              ' +
//                     '    </div> ' +
//                     '</div>    ';
//             }
//             else if (isSlectedOffer == false && isLinkedOffer) {
//                 priceDivHtml = '<div class=" bg-color-s-light-orange row no-gutter btn-standard-price" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo.OfferID + '"  data-index ="' + index + '" style="margin-bottom: -1px;  margin-bottom: -1px; border-bottom: 3px #927515 solid; "> ' +
//                     '           <div class="col-50 " >    ' +
//                     '               <div class="row">   ' +
//                     '                   <div class="col-100 standard-price-full">        ' +
//                     standardPriceText +
//                     '                   </div>          ' +
//                     '               </div>  ' +
//                     '           </div>      ' +
//                     '           <div class="col-50 bg-color-s-light-orange">    ' +
//                     '               <div class="row">   ' +
//                     '                   <div class="col-80 standard-price-full">        ' +
//                     +price + lblSAR +
//                     '                   </div>          ' +
//                     '                   <div class="col-20">        ' +
//                     '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img ' + imgArClassName + '" />' +
//                     '                   </div>          ' +
//                     '               </div>  ' +
//                     '           </div>      ' +
//                     '       </div>          ' +
//                     '   </div>              ' +
//                     '    </div> ' +
//                     '</div>    ';
//             }
//             else if (dirction == "Out") {
//                 priceDivHtml = '<div class="row no-gutter" style="margin-bottom: -1px; margin-bottom: -1px; border-bottom: 3px #927515 solid;"> ' +
//                     '           <div class="col-50 bg-color-s-light-orange btn-standard-price" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo.OfferID + '"  data-index ="' + index + '">    ' +
//                     '               <div class="row">   ' +
//                     '                   <div class="col-80 ">        ' +
//                     '                       <div class="row">       ' +
//                     '                           <div class="col-100 color-white center-text trip-service-text1">   ' +
//                     standardPriceText +
//                     '                           </div>  ' +
//                     '                       </div>      ' +
//                     '                       <div class="row"><div class="col-100 color-white center-text  trip-service-text2"  >' + price + lblSAR + '</div></div>      ' +
//                     '                   </div>          ' +
//                     '                   <div class="col-20">        ' +
//                     '                       <img src="img/rightarrow.png" alt="Alternate Text" class="trip-service-button-img ' + imgArClassName + '" />           ' +
//                     '                   </div>          ' +
//                     '               </div>  ' +
//                     '           </div>      ' +
//                     '           <div class="col-50 bg-color-s-dark-orange2 btn-discount-price"  data-JourneyID ="' + item.JourneyID + '" data-OfferId ="' + item.OfferId + '" data-index ="' + index + '">    ' +
//                     '               <div class="row">   ' +
//                     '                   <div class="col-80 ">        ' +
//                     '                       <div class="row">       ' +
//                     '                           <div class="col-100 color-white center-text  trip-service-text1">   ' +
//                     discountpriceText +
//                     '                           </div>  ' +
//                     '                       </div>      ' +
//                     '                       <div class="row"><div class="col-100  color-white center-text  trip-service-text2" >' + item.DiscountFee + lblSAR + '</div></div>     ' +
//                     '                   </div>          ' +
//                     '                   <div class="col-20">        ' +
//                     '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img  ' + imgArClassName + '" />' +
//                     '                   </div>          ' +
//                     '               </div>  ' +
//                     '           </div>      ' +
//                     '       </div>          ' +
//                     '   </div>              ' +
//                     '    </div> ' +
//                     '</div>    ';
//             } else {
//                 priceDivHtml = '<div class="row no-gutter" style="margin-bottom: -1px; margin-bottom: -1px; border-bottom: 3px #927515 solid;"> ' +
//                     '           <div class="col-100 bg-color-s-light-orange btn-standard-price" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo.OfferID + '"  data-index ="' + index + '" style="text-align: center">    ' +
//                     '               <div class="row">   ' +
//                     '                   <div class="col-80 ">        ' +
//                     '                       <div class="row">       ' +
//                     '                           <div class="col-100 color-white center-text trip-service-text1">   ' +
//                     standardPriceText +
//                     '                           </div>  ' +
//                     '                       </div>      ' +
//                     '                       <div class="row"><div class="col-100 color-white center-text  trip-service-text2"  >' + price + lblSAR + '</div></div>      ' +
//                     '                   </div>          ' +
//                     '                   <div class="col-20">        ' +
//                     '                       <img src="img/rightarrow.png" alt="Alternate Text" class="trip-service-button-img ' + imgArClassName + '" />           ' +
//                     '                   </div>          ' +
//                     '               </div>  ' +
//                     '           </div>      ' +
//                     '       </div>          ' +
//                     '   </div>              ' +
//                     '    </div> ' +
//                     '</div>    ';
//             }
//         }
//         else {
//
//             priceDivHtml = '<div class=" bg-color-s-light-orange row no-gutter btn-standard-price" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo.OfferID + '"  data-index ="' + index + '" style="margin-bottom: -1px;  margin-bottom: -1px; border-bottom: 3px #927515 solid; "> ' +
//                 '           <div class="col-50 " >    ' +
//                 '               <div class="row">   ' +
//                 '                   <div class="col-100 standard-price-full">        ' +
//                 standardPriceText +
//                 '                   </div>          ' +
//                 '               </div>  ' +
//                 '           </div>      ' +
//                 '           <div class="col-50 bg-color-s-light-orange">    ' +
//                 '               <div class="row">   ' +
//                 '                   <div class="col-80 standard-price-full">        ' +
//                 +price + lblSAR +
//                 '                   </div>          ' +
//                 '                   <div class="col-20">        ' +
//                 '                       <img src="img/rightarrow.png" alt=">" class="trip-service-button-img ' + imgArClassName + '" />' +
//                 '                   </div>          ' +
//                 '               </div>  ' +
//                 '           </div>      ' +
//                 '       </div>          ' +
//                 '   </div>              ' +
//                 '    </div> ' +
//                 '</div>    ';
//         }
//
//         if (condition == "No" || condition == "directTripsOnly" && item.Type == "Direct" || condition == "day" && item.DepartureTime <= "12" || condition == "night" && item.DepartureTime > "12" || condition == "directDay" && item.Type == "Direct" && item.DepartureTime <= "12" || condition == "directNight" && item.Type == "Direct" && item.DepartureTime > "12") {
//             sortingList[index++] = {
//                 i: [duration, price, '<li style="padding-bottom: 15px;">' +
//                 '<div class="content-container no-bottom-margins container-box-shaddow" style="z-index:1000 !important; border-radius: 8px;">' +
//                 '<div class="row trip-tripinfo">' +
//                 '<div class="col-100">      ' +
//
//                 '<div class="row">  ' +
//                 '<div class="col-100 center-text"><img src="' + imageSource + '" alt="Trip" class="trip-go-img ' + imgArClassName + '" /></div>        ' +
//                 '</div>          ' +
//                 '<div class="row" style="' + cssDirection + '">           ' +
//                 '  <div class="col-33 center-text font-size-14"> ' + item.DepartureTime + '  </div> ' +
//                 '  <div class="col-33 center-text font-size-14" style="font-weight: 300;">' + lblDuration + '</div>     ' +
//                 '  <div class="col-33 center-text font-size-14">' + item.ArrivalTime + '</div>   ' +
//                 '</div>          ' +
//                 '  <div class="row" style="' + cssDirection + '">           ' +
//                 '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + item.Trips[0].DepartureDate + '</div>         ' +
//                 '  <div class="col-33 center-text font-size-14">' + duration + lblHours + '</div>     ' +
//                 '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + item.Trips[item.Trips.length - 1].ArrivalDate + '</div>         ' +
//                 '  </div>          ' +
//                 transitHtml +
//                 servicesHtmll +
//                 priceDivHtml +
//                 '</li>'
//                 ]
//             }
//
//         }
//     }
//     return sortingList;
// }

/*******************end of multiple**************************/

function PostTripsOneway(postData) {
    postData = postData;
    myApp.showPreloader(GetResourceText("Loading"));

    var headers = {
        'Accept-Language': GetServiceLanguage(),
        Accept: 'application/json'
    };
    if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null)
        headers = {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json',
            'X-UUID': GetLocalData('UUID'),
        };
    if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
        headers['X-UserId'] = GetLocalData('UserId');
        headers['X-SDPId'] = GetLocalData('SDPId');
    }

    // var urlAjax = "https://mobile.saptco.com.sa/Reservation/Trips/oneway";
    var urlAjax = "http://integtest.saptco.sa/Reserv/Trips/oneway";
    $$.ajax(
        {
            method: "POST",
            url: urlAjax,
            contentType: 'application/json',
            data: postData,
            dataType: "json",
            timeout: 60000,
            headers:headers,

            success: function (data, status, xhr) {
                myApp.hidePreloader();
                if (data.Results[0].Days && data.Results[0].Days.length > 0) {
                    SaveLocalObject("OutWordTabData", data.Results[0]);
                    SaveLocalObject("TripsDays", data.Results[0].Days);
                    if (data.Results[0].Days.length > 1) {
                        SaveLocalObject("DayTrips", data.Results[0].Days[1].Journies);
                    } else if (data.Results[0].Days.length > 0) {
                        SaveLocalObject("DayTrips", data.Results[0].Days[0].Journies);
                    } else {
                        myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }
                    mainView.router.load({url: 'trips.html'});
                } else {
                    myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            },
            error: function (xhr, status, data) {
                myApp.hidePreloader();
                if (status == 0) {
                    myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                } else {
                    myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            }
        });
}

function PostTripsRound(postData) {
    myApp.showPreloader(GetResourceText("Loading"));
    // var urlAjax = "https://mobile.saptco.com.sa/Reservation/Trips/Round";
    var urlAjax = "http://integtest.saptco.sa/Reserv/Trips/Round";
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

            success: function (data, status, xhr) {
                myApp.hidePreloader();
                // save each tab data :
                SaveLocalObject("OutWordTabData", data.Results[0]);
                SaveLocalObject("InWordTabData", data.Results[1]);
                // store days information for selection perpous.
                SaveLocalObject("TripsDays", data.Results[0].Days);
                // var DeviceInfoSerach = GetLocalDataObject("DeviceInfo");
                // DeviceInfoSerach.UserJourney.RequestJson = postData.replace(/"/g, '\'');
                // DeviceInfoSerach.UserJourney.TripType = GetLocalData("ServiceName");
                // DeviceInfoSerach.UserJourney.MobileNumber = "";
                // DeviceInfoSerach.UserJourney.ServiceName = "Search";
                // localStorage.setItem("DeviceInfo", JSON.stringify(DeviceInfoSerach));
                // PostDeviceInfo(DeviceInfoSerach);
                if (data.Results[0].Days.length > 1 && data.Results[1].Days.length > 1) {
                    SaveLocalObject("DayTrips", data.Results[0].Days[1].Journies);
                    mainView.router.load({url: 'trips.html'});
                } else if (data.Results[0].Days.length > 0 && data.Results[1].Days.length > 0) {
                    SaveLocalObject("DayTrips", data.Results[0].Days[0].Journies);
                    mainView.router.load({url: 'trips.html'});
                } else {
                    // show message
                    myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            },
            error: function (xhr, status) {
                myApp.hidePreloader();
                if (status == 0) {
                    myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                } else {
                    myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }

            }
        });


}

function PostDeviceInfo(postData) {
    var urlAjax = "http://integtest.saptco.sa/Reserv/UserDevices/DeviceInfo";
    $$.ajax(
        {
            method: "POST",
            async: true,
            url: urlAjax,
            contentType: 'application/json',
            data: JSON.stringify(postData),
            dataType: "json",
            headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },

            success: function (data, status, xhr) {
                console.log("Device saved");
            },
            error: function (xhr, status) {
                console.log("Device failed saved");
            }
        });
}

/************* End of Schedules and Tickets section ****************/
/************************** stations ********************************/
function fillStations(stationsData) {
    var stationsList = myApp.virtualList('.list-block.virtual-list', {
        // Array with items data
        items: stationsData,
        // Custom render function to render item's HTML
        renderItem: function (index, item) {
            return '<li class="item-content">' +
                '<div class="item-inner clickable-station" data-stationId ="' + item.ID + '" data-stationType =' + item.Type.toLowerCase() + ' >' +
                '<div class="item-title"  style="font-weight: 300;  font-stretch: condensed;"  >' + item.Name + '</div>' +
                '</div>' +
                '</li>';
        },
        searchAll: function (query, items) {
            var foundItems = [];
            for (var i = 0; i < items.length; i++) {
                // Check if title contains query string
                if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) == 0) foundItems.push(i);
            }

            for (var i = 0; i < items.length; i++) {
                // Check if title contains query string
                if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) > 0) foundItems.push(i);
            }
            // Return array with indexes of matched items
            return foundItems;
        }
    });
}

function SaveStationsSelection(selectionName, selectionId, stationType) {
    if (logo == 1) {
        var objectStations = GetLocalDataObject("StationsStorage");
    } else
        var objectStations = GetLocalDataObject("StationsStorageVip");
    if (GetLocalData("FieldToSave") == "Dep") {
        objectStations.DepartureStationsName = selectionName;
        objectStations.DepartureStationsId = selectionId;
        objectStations.StationTypeArr = stationType;
        objectStations.ArrivleStationsName = GetResourceText("plzSelectStation");
        objectStations.ArrivleStationsId = -1;
    } else {
        objectStations.ArrivleStationsName = selectionName;
        objectStations.ArrivleStationsId = selectionId;
    }

    if (logo == 1) {
        SaveLocalObject("StationsStorage", objectStations);
        SaveLocalObject("StationsStorage2", objectStations);
    } else
        SaveLocalObject("StationsStorageVip", objectStations);
    mainView.router.reloadPreviousPage('schedulesandtickets.html');
    mainView.router.back({url: 'schedulesandtickets.html'});

}

function SaveStationsSelectionEvent(selectionName, selectionId, stationType) {
    var objectStations = GetLocalDataObject("StationsStorageEvent");
    if (GetLocalData("fieldToSaveEvent") == "Dep") {
        objectStations.DepartureStationsName = selectionName;
        objectStations.DepartureStationsId = selectionId;
        objectStations.StationTypeArr = stationType;
        objectStations.ArrivleStationsName = GetResourceText("plzSelectStation");
        objectStations.ArrivleStationsId = -1;
    } else {
        objectStations.ArrivleStationsName = selectionName;
        objectStations.ArrivleStationsId = selectionId;
    }
    SaveLocalObject("StationsStorageEvent", objectStations);
    mainView.router.reloadPreviousPage('Events_Scheduleandtickets.html');
    mainView.router.back({url: 'Events_Scheduleandtickets.html'});
}


myApp.onPageInit('stations', function (page) {
    // on station click event
    if (logo == 1) {
        $$("#Rlogo9").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 40px;height:30px ">');
        $$("#logoTitle9").addClass("blue-logo");
    } else {
        $$("#Rlogo9").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -7px">');
        $$("#logoTitle9").addClass("orange-color");

    }
    var pageContainer = $$(page.container);
    pageContainer.on('click', '.clickable-station', function () {
        var stationID = $$(this).data('stationid');
        var stationType = $$(this).data('stationType');
        var stationName = $$(this).text();
        SaveStationsSelection(stationName, stationID, stationType);
    });


    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });

    if (GetLocalData("FieldToSave") == "Dep") {
        var selectedType = GetLocalDataObject("selectedStationType");
        GetAllStations(selectedType);
    } else {
        if (logo == 1) {
            var objectStations = GetLocalDataObject("StationsStorage");
        } else
            var objectStations = GetLocalDataObject("StationsStorageVip");
        var selectedType = GetLocalDataObject("selectedStationType");
        if (selectedType == "0") {
            if (objectStations.StationTypeArr == "0" || objectStations.StationTypeArr == "2" || objectStations.StationTypeArr == "1") {
                GetAllStations(objectStations.StationTypeArr);
            } else {
                GetAllStations("0");
            }
        } else {
            GetAllStations(selectedType);
        }
    }

});

function GetAllStations(stationType) {
    var allStations = GetLocalDataObject("stationsStorage_" + GetServiceLanguage() + stationType);
    if (allStations) {
        var msDay = 60 * 60 * 24 * 1000;
        var saveDate = new Date(allStations.timeStamp);
        var currentDate = new Date();
        var daysSinceSave = ((currentDate - saveDate) / msDay);
        if (daysSinceSave > 5) {
            DeleteLocalData("stationsStorage_" + GetServiceLanguage() + stationType);
            GetAllStations(stationType);
        }
        fillStations(allStations.objectData);
    } else {
        SaveLocalData("StationTypeToSave", stationType);
        myApp.showPreloader(GetResourceText("Loading"));
        var headers = {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        };
        if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null)
            headers = {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json',
                'X-UUID': GetLocalData('UUID'),
            };
        if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
            headers['X-UserId'] = GetLocalData('UserId');
            headers['X-SDPId'] = GetLocalData('SDPId');
        }

        $$.ajax({
            // url: 'https://mobile.saptco.com.sa/Reservation/Stations/v2/' + stationType,
            url: 'http://integtest.saptco.sa/Reserv/Stations/v2/' + stationType,
            headers: headers,
            success: function (data, status, xhr) {
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
            error: function (xhr, status) {
                myApp.hidePreloader();
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
            ,
            statusCode: {
                404: function (xhr) {
                    alert('page not found');
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            }
        });
    }
}

/********************************************************************/

/****************************SeatSelect*********************/
function getBusStructure(ticketNumber) {
    var newTicket = ticketNumber;
    SaveLocalObject("newTicket", newTicket);
    myApp.showPreloader(GetResourceText("Loading"));
    // var urlAjax = "https://mobile.saptco.com.sa/Reservation/Bus/CreateBusStructure";
    var urlAjax = "http://integtest.saptco.sa/Reserv/Bus/CreateBusStructure";
    $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            async: true, // add this
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(ticketNumber), // change this
            headers: {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json'
            },
            success: function (data, status, xhr) {
                myApp.hidePreloader(GetResourceText("Loading"));
                if (data.SeatStructuer) {
                    // check in case the returned data contains tickets
                    SaveLocalObject("busStructure", data);
                    creatBus(data);

                }
            },

            error: function (data) {
                myApp.hidePreloader("Loading");

                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));

                $$(".modal-button-bold").text(GetResourceText('OkText'));

            }

        });

}

myApp.onPageInit('seatSelect', function (page) {
    if (logo == 1) {
        $$("#Rlogo6").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 40px;height:30px ">');
        $$("#logoTitle6").addClass("blue-logo");
    } else {
        $$("#Rlogo6").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -7px">');
        $$("#logoTitle6").addClass("orange-color");

    }
    var pageContainer = $$(page.container);
    var confirmSeat = pageContainer.find('#confirmSeat');
    mainView.hideToolbar();
    var passengerTicket = GetLocalDataObject("PassengerTicketViewData");
    var tripType = GetLocalData("ReservationType");
    var tripMulti = GetLocalData("TypeMulti");
    if (tripType == "OneWay" && tripMulti == null) {
        var ticketNumber = passengerTicket[0].TicketNumber;
    } else if (tripType == "Round") {
        var ticketNumber = passengerTicket[ticketNo].TicketNumber;
    } else {
        var ticketNumber = passengerTicket[ticketNo].TicketNumber;
    }
    var ticketNumberJson = {
        "TicketNumber": [
            ticketNumber
        ]
    };
    getBusStructure(ticketNumberJson);
    //busStruct();
    var struct = GetLocalDataObject("busStructure");
    var seatNumber = passengerTicket[0].SeatNumber;
    if (tripType == "Round") {
        var seatNumber = passengerTicket[ticketNo].SeatNumber;
    }

    confirmSeat.on('click', function () {
        struct = GetLocalDataObject("busStructure");
        var token = struct.ValidToken;
        var reserve = {
            "Token": token,
            "TicketsSeat": [
                {
                    "TicketNumber": ticketNumber,
                    "SeatNumber": prevSeatNumber
                }
            ]
        };
        reserveSeat(reserve);

    });

});

function creatBus(struct) {
    var seats = "";
    var seatClasses = [
        {
            c: ["availableSeat",
                "selectedSeat",
                "reservedSeat"]
        },
        {
            c: ["availableSeatD",
                "selectedSeatD",
                "reservedSeatD"]
        },
        "",
        "wc",
        "door",
        "canteen",
        "table",
        "wcDoor"
    ];
    var rows = struct.SeatStructuer.length;
    for (var i = 0; i < rows; i++) {
        seats = seats +
            '       <div class="row">';
        var row = struct.SeatStructuer[i];
        for (var j = 0; j < row.Info.length; j++) {
            var seatTypeToRemove = -1;
            var seatInfo = row.Info[j];
            var position = seatInfo.PositionOnMap;
            var seatType = seatInfo.SeatType - 1;
            var isAvailable = seatInfo.IsAvalaible;
            var seatImg = (seatType != 0 && seatType != 1) ? seatClasses[seatType] : seatClasses[seatType].c[isAvailable ? 0 : 2];
            var seatNumber = (seatType == 0 || seatType == 1) ? seatInfo.SeatNumber + "" : "";
            if (prevSeatNumber == seatNumber) {
                prevSeat = "seat" + position;
                if (seatImg == "availableSeat") {
                    prevSeatClass = "selectedSeat";
                } else {
                    prevSeatClass = "selectedSeatD";
                }
                seatImg = prevSeatClass;
            }
            seatTypeToRemove = (seatType == 0 && isAvailable) ? 1 : (seatType == 1 && isAvailable) ? 2 : ((seatType == 0 || seatType == 1) && !isAvailable) ? 3 : "";
            var onClick = (seatTypeToRemove != -1) ? 'onClick="selectSeat(this.id, ' + seatTypeToRemove + ')"' : '';
            seats = seats +

                '           <div class="col-20">' +
                '               <div class="button11 ' + seatImg + ' center" id="seat' + seatNumber + '" ' + onClick + ' >' + seatNumber + '</div>' +
                '           </div>';
        }
        seats = seats + '</div>';
    }
    $$('#seats').html(seats);
    seatDiv.html(prevSeatNumber);
}

function reserveSeat(seatNumber) {
    var tripType = GetLocalData("ReservationType");
    var tripMulti = GetLocalData("TypeMulti");
    myApp.showPreloader(GetResourceText("Loading"));
    // var urlAjax = "https://mobile.saptco.com.sa/Reservation/Bus/UpdateSeatNumber";
    var urlAjax = "http://integtest.saptco.sa/Reserv/Bus/UpdateSeatNumber";
    $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            dataType: 'json',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify(seatNumber),
            headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },

            success: function (data, status, xhr) {
                myApp.hidePreloader(GetResourceText("Loading"));
                if (data == true) {
                    if (tripType == "OneWay" && tripMulti == null) {
                        prevSeatNumber = prevSeat.replace("seat", "");
                        seatDiv.html(prevSeatNumber);
                        var index = GetLocalDataObject("ticketIndex");
                        var updatePostReservation = GetLocalDataObject("ReservationSummary");
                        updatePostReservation.Results.Tickets[index].SeatNumber = prevSeatNumber;
                        SaveLocalObject("ReservationSummary", updatePostReservation);
                        mainView.router.back();
                        mainView.router.loadPage({url: "Passengers.html"});

                    } else if (tripType == "Round") {
                        prevSeatNumber = prevSeat.replace("seat", "");
                        seatDiv.html(prevSeatNumber);
                        var index = GetLocalDataObject("ticketIndex");
                        var tempdata = GetLocalDataObject("ReservationSummary");
                        var updatePassengerTicketView = GetLocalDataObject("PassengerTicketViewData");
                        updatePassengerTicketView[ticketNo].SeatNumber = prevSeatNumber;
                        SaveLocalObject("PassengerTicketViewData", updatePassengerTicketView);
                        for (i = 0; i < tempdata.Results.Tickets.length; i++) {
                            if (tempdata.Results.Tickets[i].TicketNumber == updatePassengerTicketView[ticketNo].TicketNumber) {
                                tempdata.Results.Tickets[i].SeatNumber = prevSeatNumber;
                            }
                        }
                        SaveLocalObject("ReservationSummary", tempdata);
                        mainView.router.back();
                        mainView.router.loadPage({url: "Passengers.html"});
                    } else {
                        prevSeatNumber = prevSeat.replace("seat", "");
                        seatDiv.html(prevSeatNumber);
                        var index = GetLocalDataObject("ticketIndex");
                        var tempdata = GetLocalDataObject("ReservationSummary");
                        var updatePassengerTicketView = GetLocalDataObject("PassengerTicketViewData");
                        updatePassengerTicketView[ticketNo].SeatNumber = prevSeatNumber;
                        SaveLocalObject("PassengerTicketViewData", updatePassengerTicketView);
                        for (i = 0; i < tempdata.Results.Tickets.length; i++) {
                            if (tempdata.Results.Tickets[i].TicketNumber == updatePassengerTicketView[ticketNo].TicketNumber) {
                                tempdata.Results.Tickets[i].SeatNumber = prevSeatNumber;
                            }
                        }
                        SaveLocalObject("ReservationSummary", tempdata);
                        mainView.router.back();
                        mainView.router.loadPage({url: "Passengers.html"});
                    }
                } else if (data == false) {
                    myApp.alert(GetResourceText("ReservedSeat"));
                    var ticketNumberJson = {
                        "TicketNumber": [
                            seatNumber.TicketsSeat[0].TicketNumber
                        ]
                    };
                    getBusStructure(ticketNumberJson);
                    creatBus(GetLocalDataObject("busStructure"));
                    myApp.hidePreloader("Loading");
                    mainView.router.loadPage({url: 'SeatSelect.html'});
                } else {
                    myApp.alert(data);
                }
            },
            error: function (data) {
                myApp.hidePreloader("Loading");
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
}

var prevSeat = "seat";
var prevSeatNumber = "-1";
var prevSeatClass;
var selectedSeat;

function selectSeat(seatID, buttonClass) {
    var newClass;
    if (buttonClass == 1) {
        newClass = "selectedSeat";
        $$("#" + prevSeat).removeClass(prevSeatClass);
        $$("#" + seatID).addClass(newClass);
        $$("#" + prevSeat).addClass("availableSeat");
        prevSeat = seatID;
        selectedSeat = prevSeat.substring(4);
        prevSeatNumber = selectedSeat;
        prevSeatClass = newClass;
    } else if (buttonClass == 2) {
        newClass = "selectedSeatD";
        $$("#" + prevSeat).removeClass(prevSeatClass);
        $$("#" + seatID).addClass(newClass);
        $$("#" + prevSeat).addClass("availableSeatD");
        prevSeat = seatID;
        selectedSeat = prevSeat.substring(4);
        prevSeatNumber = selectedSeat;
        prevSeatClass = newClass;
    } else if (buttonClass == 3) {
        myApp.alert(GetResourceText("ReservedSeat"));
    }

}

myApp.onPageBeforeRemove("seatSelect", function () {
    //document.getElementById("bottom-toolbar").style.visibility = "visible";
    mainView.router.refreshPreviousPage();
    mainView.showToolbar();
});
myApp.onPageBeforeRemove("trips", function () {
    tripIndex = 0;
});

/**********************End of SeatSelect*********************/

/***************************** trips ********************************/
var tripIndex = 0;
myApp.onPageInit('trips', function (page) {
        if (logo == 1) {
            $$("#Rlogo1").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 40px;height:30px ">');
            $$("#logoTitle1").addClass("blue-logo");
        } else {
            $$("#Rlogo1").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -7px">');
            $$("#logoTitle1").addClass("orange-color");
            document.getElementById("tripsdiv").style.visibility = "hidden";
            document.getElementById("tripsdiv").style.height = "0px";
        }
        var selectedTab = "Out";
        var list;
        // intilize objects for data
        if (GetLocalData("ReservationType") == "OneWay") {
            if (GetLocalDataObject("TripBookList") == null) {
                bookingList =
                    [
                        {
                            "JourneyID": "",
                            "OfferID": ""
                        }
                    ];

                SaveLocalObject("TripBookList", bookingList);
            }
        } else {
            if (GetLocalDataObject("TripBookList") == null) {
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
        $$('.clicktab').on('click', function () {
            var selectedIndex = Number($$(this).data("index"));
            if (GetLocalDataObject("TripsDays") != null) {
                var newDay = GetLocalDataObject("TripsDays")[selectedIndex];
                //SaveLocalObject("DayTrips", newDay.Journies);
                if (newDay.Journies) {
                    fillTripsList(newDay.Journies, selectedTab);
                    $$(".clicktab").removeClass("tabselected");
                    $$(".clicktab").addClass("tabnotSelected");
                    $$(this).removeClass("tabnotSelected");
                    $$(this).addClass("tabselected");
                } else {
                    $$("#list-trips-container").html("");
                    $$(".clicktab").removeClass("tabselected");
                    $$(".clicktab").addClass("tabnotSelected");
                    $$(this).removeClass("tabnotSelected");
                    $$(this).addClass("tabselected");
                    myApp.alert(GetResourceText('NoTripsFound2'));
                }
            }
        });

        $$("#OutTab").click(function () {
            $$("#ReturnTab").removeClass("selected-tab");
            $$("#ReturnTab").addClass("not-selected-tab");
            $$(this).removeClass("not-selected-tab");
            $$(this).addClass("selected-tab");
            FillTripScreenData("Out");
            selectedTab = "Out";
        });
        $$("#ReturnTab").click(function () {
            bookingList = GetLocalDataObject("TripBookList");
            if (GetLocalData("ReservationType") != "OneWay" && bookingList && bookingList.length > 0 && bookingList[0].JourneyID != "") {
                $$("#OutTab").removeClass("selected-tab");
                $$("#OutTab").addClass("not-selected-tab");
                $$(this).removeClass("not-selected-tab");
                $$(this).addClass("selected-tab");
                FillTripScreenData("In");
                selectedTab = "Return";
            }
        });

        function FillTripScreenData(direction) {
            myApp.showPreloader(GetResourceText("Loading"));
            var ObjectData;
            //
            if (direction == "Out") {
                ObjectData = GetLocalDataObject("OutWordTabData");
                $$("img[src='returnArrow.png']").attr("src", "img/goingbus.png");
            } else {
                var tempData = [];
                ObjectData = GetLocalDataObject("InWordTabData");
                $$("img[src='goingbus.png']").attr("src", "img/returnArrow.png");
                // if (ObjectData.Days.length > 0) {
                //     var dateRet = GetFormatedDate(ObjectData.Days[0].Date);
                //     if (dateRet >= dateOut) {
                //         tempData.push(ObjectData.Days[0]);
                //     }
                // }
                // if (ObjectData.Days.length > 1) {
                //     var dateRet = GetFormatedDate(ObjectData.Days[1].Date);
                //     if (dateRet >= dateOut) {
                //         tempData.push(ObjectData.Days[1]);
                //     }
                // }
                // if (ObjectData.Days.length > 2) {
                //     var dateRet = GetFormatedDate(ObjectData.Days[2].Date);
                //     if (dateRet >= dateOut) {
                //         tempData.push(ObjectData.Days[2]);
                //     }
                // }
                // ObjectData.Days = tempData;
            }

            function getReturnObjectDate(object, dateOut, arrivalTime) {
                var finalObj = [];
                var journies = [];
                var tempObject = object;
                for (var i = 0; i < object.length; i++) {
                    if (tempObject[i].Date == dateOut) {
                        journies = [];
                        if (tempObject[i].Journies)
                            for (var j = 0; j < tempObject[i].Journies.length; j++) {
                                if (tempObject[i].Journies[j].DepartureTime > arrivalTime) {
                                    journies.push(tempObject[i].Journies[j]);
                                } else {
                                    tempObject[i].Journies.splice(j, 1);
                                }
                                if (j == tempObject[i].Journies)
                                    // if (j == tempObject[i].Journies.length - 1)
                                    if (journies.length > 0)
                                        tempObject[i].Journies[j] = journies;
                                    else myApp.alert(GetResourceText('incompatibleTimes'));

                            }
                    }
                    if (tempObject[i].Date < dateOut) {
                        tempObject[i].Journies = null;
                    }
                    if (tempObject[i].Date > dateOut) {
                        // if (tempObject[i].Journies)
                        //     for (var j = 0; j < tempObject[i].Journies.length; j++) {
                        //         if (tempObject.days[i].Journies[j].DepartureTime > arrivalTime) {
                        //             tempObject[i].Journies = tempObject.days[i].Journies[j];
                        //             tripsFound = true;
                        //         }
                        //         if (!tripsFound) tempObject[i].Journies = [];
                        //         tripsFound = false;
                        //     }
                    }


                }
                return tempObject;
            }

            $$("#lblTripsCities").text(ObjectData.DepartureStation.City + ", " + ObjectData.ArrivalStation.City);
            $$("#lblFromStation").text(ObjectData.DepartureStation.Name);
            $$("#lblToStation").text(ObjectData.ArrivalStation.Name);
            var ticketSearchData = GetLocalDataObject("ticketSearchData");
            var passengersCounts = {};
            if (ticketSearchData && ticketSearchData != null) {
                passengersCounts.adultCount = ticketSearchData.Passengers.AdultsCount;
                passengersCounts.childrenCount = ticketSearchData.Passengers.ChildrenCount;
                passengersCounts.infantsCount = ticketSearchData.Passengers.InfantsCount;
                $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");
            }
            var childAndInfText = "";
            if (passengersCounts.childrenCount > 0) {
                childAndInfText = childAndInfText + "," + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + ") ";

            }
            if (passengersCounts.infantsCount > 0) {
                childAndInfText = childAndInfText + "," + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")";
            }
            $$("#Nopass").text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + ") " + childAndInfText);
            if (ObjectData.Days.length > 0) {
                // store days information for selection perpous.
                SaveLocalObject("TripsDays", ObjectData.Days);

                // fill the days inside the labels in the top;
                if (ObjectData.Days.length > 0) {
                    $$("#0_DateTab").text(ObjectData.Days[0].Date.substring(3));
                    $$("#day0").text(ObjectData.Days[0].Date.substring(0, 2));
                } else {
                    $$("#0_DateTab").html("---");
                }
                if (ObjectData.Days.length > 1) {
                    $$("#1_DateTab").text(ObjectData.Days[1].Date.substring(3));
                    $$("#day1").text(ObjectData.Days[1].Date.substring(0, 2));
                } else {
                    $$("#1_DateTab").html("---");
                }

                if (ObjectData.Days.length > 2) {
                    $$("#2_DateTab").text(ObjectData.Days[2].Date.substring(3));
                    $$("#day2").text(ObjectData.Days[2].Date.substring(0, 2));
                } else {
                    $$("#2_DateTab").html("---");
                }
                // todo: check the date to make the selection based on the date.
                var searchData = GetLocalDataObject("ticketSearchData");
                $$("#0_DateTab").parent().parent().removeClass("tabselected");
                $$("#1_DateTab").parent().parent().removeClass("tabselected");
                $$("#2_DateTab").parent().parent().removeClass("tabselected");
                $$("#0_DateTab").parent().parent().addClass("tabnotselected");
                $$("#1_DateTab").parent().parent().addClass("tabnotselected");
                $$("#2_DateTab").parent().parent().addClass("tabnotselected");
                var outInfo = GetLocalDataObject("OutJournyFullData");
                var arrivalTimeOut = outInfo.ArrivalTime;
                var dateOut = outInfo.ArrivalDate;
                tempData = getReturnObjectDate(ObjectData.Days, dateOut, arrivalTimeOut);
                ObjectData.Days = tempData;
                SaveLocalObject("TripsDays", ObjectData.Days);
                if (ObjectData.Days.length > 1 && searchData.ReturnDate == ObjectData.Days[1].Date) {
                    $$("#0_DateTab").parent().parent().addClass("tabnotselected");
                    $$("#1_DateTab").parent().parent().addClass("tabselected");
                    $$("#2_DateTab").parent().parent().addClass("tabnotselected");
                    if (ObjectData.Days[1].Journies) {
                        fillTripsList(ObjectData.Days[1].Journies, direction);
                    } else {
                        $$("#list-trips-container").html('');
                        myApp.alert(GetResourceText('NoTripsFound2'));
                    }
                } else if (ObjectData.Days.length > 1 && searchData.ReturnDate == ObjectData.Days[0].Date) {
                    $$("#0_DateTab").parent().parent().addClass("tabselected");
                    $$("#1_DateTab").parent().parent().addClass("tabnotselected");
                    $$("#2_DateTab").parent().parent().addClass("tabnotselected");
                    if (ObjectData.Days[0].Journies) {
                        fillTripsList(ObjectData.Days[0].Journies, direction);
                    } else {
                        $$("#list-trips-container").html('');
                        myApp.alert(GetResourceText('NoTripsFound2'));
                    }
                } else if (ObjectData.Days.length > 1 && searchData.ReturnDate == ObjectData.Days[2].Date) {
                    $$("#0_DateTab").parent().parent().addClass("tabnotselected");
                    $$("#1_DateTab").parent().parent().addClass("tabnotselected");
                    $$("#2_DateTab").parent().parent().addClass("tabselected");
                    if (ObjectData.Days[2].Journies) {
                        fillTripsList(ObjectData.Days[2].Journies, direction);
                    } else {
                        $$("#list-trips-container").html('');
                        myApp.alert(GetResourceText('NoTripsFound2'));
                    }
                }
            } else {
                myApp.alert(GetResourceText("NoTripsFound"), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }

            myApp.hidePreloader(GetResourceText("Loading"));
        }

        // event handler for clicking an trip price
        $$(".trips-list-block").on('click', '.btn-standard-price', function () {
            var transitTrip = $$(this).data("tripType");
            var journyID = $$(this).data("journeyid");
            var offerID = $$(this).data("OfferID");
            if (transitTrip == "Trans")
                offerID = '#' + offerID + ';#' + offerID;
            var tripType = GetLocalData("ReservationType");
            var selectedPriceDiv2;
            if (tripType == "OneWay") {
                var selectedPriceDiv = $$(this).data("selectedPriceDiv");
                SaveLocalData("selectedPriceDiv", selectedPriceDiv);
            } else {
                if (tripIndex == 0) {
                    var selectedPriceDiv1 = parseInt($$(this).data("selectedPriceDiv"));
                    SaveLocalData("selectedPriceDiv1", selectedPriceDiv1);
                    tripIndex++;
                } else {
                    selectedPriceDiv2 = parseInt($$(this).data("selectedPriceDiv"));
                    SaveLocalData("selectedPriceDiv2", selectedPriceDiv2);
                    tripIndex = 0;
                }
            }
            var journyIndex = $$(this).data("journyIndex");
            var selectedIndex = Number($$(this).data("index"));
            if (selectedTab == "Out") {
                // set the out booking information.
                outBooking = {
                    "JourneyID": journyID,
                    "OfferID": offerID
                };

                // get the full details of the selected journy
                var dayTrips = GetLocalDataObject("DayTrips");
                // add the Out Journy details to the local storage.
                if (tripType == "OneWay") {
                    originalTktPrice = dayTrips[selectedIndex].Trips[0].FeeInfo[selectedPriceDiv].Amount;
                } else if (tripType == "Round") {
                    originalTktPrice = dayTrips[selectedIndex].Trips[0].FeeInfo[selectedPriceDiv1].Amount;
                }
                SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);

                bookingList = GetLocalDataObject("TripBookList");
                bookingList[0] = outBooking;

                // in case it was one way trip, move to the next screen
                if ((GetLocalData("ReservationType") == "OneWay")) {
                    SaveLocalObject("TripBookList", bookingList);
                    //mainView.router.load({
                    //    url: 'PassengersInfo.html'
                    //});
                    mainView.router.load({
                        url: 'FirstSummry.html'
                    });
                } else {
                    SaveLocalObject("TripBookList", bookingList);
                    myApp.showPreloader(GetResourceText("Loading"));
                    $$(".clicktab").removeClass('tabselected');
                    $$(".clicktab").removeClass('tabnotSelected');
                    $$(".midDiv").addClass("tabselected");
                    setTimeout(function () {
                        myApp.hidePreloader();
                        $$('.page-content').scrollTop(0, 600);
                        $$("#OutTab").removeClass("selected-tab");
                        $$("#OutTab").addClass("not-selected-tab");
                        $$("#ReturnTab").removeClass("not-selected-tab");
                        $$("#ReturnTab").addClass("selected-tab");
                        FillTripScreenData("In");
                        selectedTab = "Return";
                    }, 1000);
                }
            } else {
                var selectedIndex = Number($$(this).data("index"));
                // set the return booking information.
                retBooking = {
                    "JourneyID": journyID,
                    "OfferID": offerID
                };
                var dayTrips = GetLocalDataObject("DayTrips");
                originalTktPrice = dayTrips[selectedIndex].Trips[0].FeeInfo[selectedPriceDiv2].Amount;
                SaveLocalObject("retJournyFullData", dayTrips[selectedIndex]);
                bookingList = GetLocalDataObject("TripBookList");
                bookingList[1] = retBooking;
                SaveLocalObject("TripBookList", bookingList);
                mainView.router.load({
                    url: 'FirstSummry.html'
                });

            }
        });
        $$(".trips-list-block").on('click', '.btn-discount-price', function () {
            var journyID = $$(this).data("journeyid");
            var offerID = $$(this).data("OfferId");
            var selectedIndex = Number($$(this).data("index"));

            runDiscountLogic(journyID, offerID, selectedIndex);

        });

        function runDiscountLogic(journyID, offerID, selectedIndex) {
            if (selectedTab == "Out") {
                // get the full details of the selected journy
                var dayTrips = GetLocalDataObject("DayTrips");
                var selectedTrip = dayTrips[selectedIndex];
                if (selectedTrip.IsRefundable == false || selectedTrip.IsTransferable == false) {
                    var message = "";
                    if (selectedTrip.IsRefundable == false) {
                        message += GetResourceText("discountConfirmationRefund") + "</br> ";
                    }
                    if (selectedTrip.IsTransferable == false) {
                        message += GetResourceText("discountConfirmationTrans");
                    }

                    myApp.confirm(message, GetResourceText("TicketTirms"), function () {
                        outBooking =
                            {
                                "JourneyID": journyID,
                                "OfferID": offerID
                            };
                        SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);
                        bookingList = GetLocalDataObject("TripBookList");
                        bookingList[0] = outBooking;
                        if ((GetLocalData("ReservationType") == "OneWay")) {
                            SaveLocalObject("TripBookList", bookingList);
                            mainView.router.load({
                                url: 'FirstSummry.html'
                            });
                        } else {
                            SaveLocalObject("TripBookList", bookingList);
                            myApp.showPreloader(GetResourceText("Loading"));
                            setTimeout(function () {
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
                    });
                    $$(".modal-button").text(GetResourceText('CancelText'));
                    $$(".modal-button.modal-button-bold").text(GetResourceText('OkText'));
                } else {
                    outBooking =
                        {
                            "JourneyID": journyID,
                            "OfferID": offerID
                        };
                    SaveLocalObject("OutJournyFullData", dayTrips[selectedIndex]);
                    bookingList = GetLocalDataObject("TripBookList");
                    bookingList[0] = outBooking;
                    if ((GetLocalData("ReservationType") == "OneWay")) {
                        SaveLocalObject("TripBookList", bookingList);
                        mainView.router.load({
                            url: 'FirstSummry.html'
                        });
                    } else {
                        SaveLocalObject("TripBookList", bookingList);

                        myApp.showPreloader(GetResourceText("Loading"));
                        setTimeout(function () {
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
            } else {
                retBooking =
                    {
                        "JourneyID": journyID,
                        "OfferID": offerID
                    };
                var dayTrips = GetLocalDataObject("DayTrips");
                SaveLocalObject("retJournyFullData", dayTrips[selectedIndex]);
                bookingList = GetLocalDataObject("TripBookList");
                bookingList[1] = retBooking;
                SaveLocalObject("TripBookList", bookingList);
                mainView.router.load({
                    url: 'FirstSummry.html'
                });
            }
        }

        var data = GetLocalDataObject("OutWordTabData");
        $$("#lblTripsCities").text(data.DepartureStation.City + ", " + data.ArrivalStation.City);
        var ticketSearchData = GetLocalDataObject("ticketSearchData");
        if (data.Days.length == 3) {
            var day = data.Days[0].Date;
            $$("#0_DateTab").text(day.substring(3));
            $$("#day0").text(day.substring(0, 2));
            day = data.Days[1].Date;
            $$("#1_DateTab").text(day.substring(3));
            $$("#day1").text(day.substring(0, 2));
            day = data.Days[2].Date;
            $$("#2_DateTab").text(day.substring(3));
            $$("#day2").text(day.substring(0, 2));
        }
        $$("#lblFromStation").text(data.DepartureStation.Name);
        $$("#lblToStation").text(data.ArrivalStation.Name);
        var passengersCounts = {};
        if (ticketSearchData && ticketSearchData != null) {
            passengersCounts.adultCount = ticketSearchData.Passengers.AdultsCount;
            passengersCounts.childrenCount = ticketSearchData.Passengers.ChildrenCount;
            passengersCounts.infantsCount = ticketSearchData.Passengers.InfantsCount;
            $$('#lblPassengerCountSummary').text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + "), " + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + "), " + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")");
        }

        var childAndInfText = "";
        if (passengersCounts.childrenCount > 0) {
            childAndInfText = childAndInfText + "," + GetResourceText("lblChild") + "(" + passengersCounts.childrenCount + ") ";
        }
        if (passengersCounts.infantsCount > 0) {
            childAndInfText = childAndInfText + "," + GetResourceText("lblInfants") + "(" + passengersCounts.infantsCount + ")";
        }
        $$("#Nopass").text(GetResourceText("lblAdults") + " (" + passengersCounts.adultCount + ") " + childAndInfText);
        var dateTabIndex;
        for (var i = 0; i < 3; i++)
            if (GetLocalDataObject("ticketSearchData").DepartureDate == data.Days[i].Date)
                dateTabIndex = i;
        if (GetLocalDataObject("ticketSearchData").DepartureDate == data.Days[0].Date) {
            $$("#0_DateTab").parent().parent().addClass("tabselected");
            $$("#1_DateTab").parent().parent().addClass("tabnotselected");
            $$("#2_DateTab").parent().parent().addClass("tabnotselected");
            if (data.Days[0].Journies)
                fillTripsList(data.Days[0].Journies, "Out");
            else myApp.alert(GetResourceText('NoTripsFound2'));
        } else if (GetLocalDataObject("ticketSearchData").DepartureDate == data.Days[1].Date) {
            $$("#1_DateTab").parent().parent().addClass("tabselected");
            $$("#0_DateTab").parent().parent().addClass("tabnotselected");
            $$("#2_DateTab").parent().parent().addClass("tabnotselected");
            if (data.Days[1].Journies)
                fillTripsList(data.Days[1].Journies, "Out");
            else myApp.alert(GetResourceText('NoTripsFound2'));
        } else if (GetLocalDataObject("ticketSearchData").DepartureDate == data.Days[2].Date) {
            $$("#2_DateTab").parent().parent().addClass("tabselected");
            $$("#1_DateTab").parent().parent().addClass("tabnotselected");
            $$("#0_DateTab").parent().parent().addClass("tabnotselected");
            if (data.Days[2].Journies)
                fillTripsList(data.Days[2].Journies, "Out");
            else myApp.alert(GetResourceText('NoTripsFound2'));
        }
        var displayOfferOnly;
        var isSlectedOffer;
        var isLinkedOffer;
        var myList;
        var lblDuration;
        var imgArClassName;
        var imageSource;
        var cssDirection;
        var tripsList1;
        var dirction;

        function fillTripsList(tripsList, direction) {
            dirction = direction;
            tripsList1 = tripsList;
            lblDuration = GetResourceText("Duration");
            imgArClassName = GetLocalData("imgLanguageClass");
            imageSource = "img/goingbus.png";
            cssDirection = "";
            if (direction != "Out") {
                cssDirection = " direction:rtl !important;";
                if (GetApplicationLanguage() == "ar") {
                    cssDirection = " direction:ltr !important; "
                }
                var journyInfo = GetLocalDataObject("OutJournyFullData");
                var tripBookingInfo = GetLocalDataObject("TripBookList");
                var offerId = tripBookingInfo[0].OfferID;

                imageSource = "img/returnArrow.png";
                displayOfferOnly = false;
                isSlectedOffer = false;
                isLinkedOffer = false;
                if (offerId.length > 2) {
                    isSlectedOffer = true;
                }
                if (journyInfo.IsLinkedOffer) {
                    isLinkedOffer = true;
                }

                if (journyInfo.IsLinkedOffer && offerId.length > 2) {
                    var tripsQueryOffer = JSLINQ(tripsList).Where(function (item) {
                        return item.IsLinkedOffer && item.OfferId == offerId;
                    });
                    tripsList = tripsQueryOffer.items;
                    displayOfferOnly = true;
                } else if (journyInfo.IsLinkedOffer == false) {
                    var tripsQueryOffer = JSLINQ(tripsList).Where(function (item) {
                        return item.IsLinkedOffer == false;
                    });
                    tripsList = tripsQueryOffer.items;
                }
                var Trip1ArrivalTime = GetFormatedDate(journyInfo.ArrivalDate);
                Trip1ArrivalTime.setHours(journyInfo.ArrivalTime.split(":")[0]);
                Trip1ArrivalTime.setMinutes(journyInfo.ArrivalTime.split(":")[1]);

                if (tripsList.length > 0 && tripsList[0].Trips[0].DepartureDate == journyInfo.ArrivalDate) {
                    var tripsQueryTime = JSLINQ(tripsList).Where(function (item) {
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

            list = fillTripsCondition("No", tripsList, imgArClassName, imageSource, cssDirection, lblDuration, displayOfferOnly, isSlectedOffer, isLinkedOffer, dirction);
            var listHtml = "";
            for (var j = 0; j < list.length; j++) {
                listHtml = listHtml + list[j].i[2];
            }

            $$("#list-trips-container").html(listHtml);
        }

        $$("#selectFilterType").change(function () {
            var val = document.getElementById("selectFilterType").value;
            list = fillTripsCondition(val, tripsList1, imgArClassName, imageSource, cssDirection, lblDuration, displayOfferOnly, isSlectedOffer, isLinkedOffer, dirction);
            var listHtml = "";
            for (var i = 0; i < list.length; i++) {
                listHtml = listHtml + list[i].i[2];
            }
            $$("#list-trips-container").html(listHtml);
        })


        $$("#selectSortType").change(function () {

            var val = document.getElementById("selectSortType").value;
            var listHtml = "";
            list = sortList(list, val);
            for (var i = 0; i < list.length; i++) {
                listHtml = listHtml + list[i].i[2];
            }
            $$("#list-trips-container").html(listHtml);
        })

    }
);


function sortList(list, as) {
    if (as == "lowerPrice") {
        list.sort(comparePrice);
    } else if (as == "tripDuration") {
        list.sort(compareDuration);
    }
    return list;
}

function comparePrice(a, b) {
    if (a.i[1] > b.i[1]) {
        return 1;
    } else if (a.i[1] < b.i[1]) {
        return -1;
    } else if (a.i[0] > b.i[0]) {
        return 1;
    } else if (a.i[0] < b.i[0]) {
        return -1;
    } else {
        return 0;
    }
}

function compareDuration(a, b) {
    if (a.i[0] > b.i[0]) {
        return 1;
    } else if (a.i[0] < b.i[0]) {
        return -1;
    } else {
        return 0;
    }
}

function fillTripsCondition(condition, tripsList, imgArClassName, imageSource, cssDirection, lblDuration, displayOfferOnly, isSlectedOffer, isLinkedOffer, dirction) {
    var sortingList = [];
    var index = 0;
    for (i = 0; i < tripsList.length; i++) {
        var item = tripsList[i];
        var pricesNo = item.Trips[0].FeeInfo.length;
        var pricesNoTransit = item.Trips[0].FeeInfo.length;
        var TripType = item.Type;
        if (TripType == "Direct") {
            if (pricesNo == 1) {
                var FlexiblePrice = item.Trips[0].FeeInfo[0].Amount;
                var FlexiblePricelbl = item.Trips[0].FeeInfo[0].FeeName;
            } else if (pricesNo == 2) {
                var FlexiblePrice = item.Trips[0].FeeInfo[0].Amount;
                var FlexiblePricelbl = item.Trips[0].FeeInfo[0].FeeName;
                var EconomicPrice = item.Trips[0].FeeInfo[1].Amount;
                var EconomicPricelbl = item.Trips[0].FeeInfo[1].FeeName;
            } else if (pricesNo == 3) {
                var FlexiblePrice = item.Trips[0].FeeInfo[0].Amount;
                var FlexiblePricelbl = item.Trips[0].FeeInfo[0].FeeName;
                var EconomicPrice = item.Trips[0].FeeInfo[1].Amount;
                var EconomicPricelbl = item.Trips[0].FeeInfo[1].FeeName;
                var SavePrice = item.Trips[0].FeeInfo[2].Amount;
                var SavePricelbl = item.Trips[0].FeeInfo[2].FeeName;
            }
        } else if (TripType == "Transit") {

            if (pricesNoTransit == 1) {
                FlexiblePrice = item.Trips[0].FeeInfo[0].Amount + item.Trips[1].FeeInfo[0].Amount;
                FlexiblePricelbl = item.Trips[0].FeeInfo[0].FeeName;
            } else if (pricesNoTransit == 2) {
                FlexiblePrice = item.Trips[0].FeeInfo[0].Amount + item.Trips[1].FeeInfo[0].Amount;
                FlexiblePricelbl = item.Trips[0].FeeInfo[0].FeeName;
                EconomicPrice = item.Trips[0].FeeInfo[1].Amount + item.Trips[1].FeeInfo[1].Amount;
                EconomicPricelbl = item.Trips[0].FeeInfo[1].FeeName;
            } else if (pricesNoTransit == 3) {
                FlexiblePrice = item.Trips[0].FeeInfo[0].Amount + item.Trips[1].FeeInfo[0].Amount;
                FlexiblePricelbl = item.Trips[0].FeeInfo[0].FeeName;
                EconomicPrice = item.Trips[0].FeeInfo[1].Amount + item.Trips[1].FeeInfo[1].Amount;
                EconomicPricelbl = item.Trips[0].FeeInfo[1].FeeName;
                SavePrice = item.Trips[0].FeeInfo[2].Amount + item.Trips[1].FeeInfo[2].Amount;
                SavePricelbl = item.Trips[0].FeeInfo[2].FeeName;
            }
        }
        var duration = item.Duration;
        var transitHeader = GetResourceText("transitHeader");
        var servicesHeader = GetResourceText("servicesHeader");
        var lblMeals = GetResourceText("lblMeals");
        var lblChargres = GetResourceText("lblChargres");
        var lblrefreshments = GetResourceText("lblrefreshments");
        var lblDirect = GetResourceText("lblDirect");
        var lblNewspapers = GetResourceText("lblNewspapers");
        var lblWifi = GetResourceText("lblWifi");
        var lblTV = GetResourceText("lblTV");
        var lblLimitSeats = GetResourceText("lblLimitSeats");
        var lblTables = GetResourceText("lblTables");
        var lblEntertainment = GetResourceText("lblEntertainment");
        var transitHtml = "";
        var lblSAR = GetResourceText("SAR");
        var lblHours = GetResourceText("lblHours");
        var lblDepOn = GetResourceText("lblDepOn");
        var lblDepTo = GetResourceText("lblDepTo");
        // transit section
        if (item.Trips.length > 1) {
            imageSource = "img/goingbusTrans.png";
            if (dirction != "Out") {
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
            $$.each(item.Trips, function (index, value) {
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

        if (item.TripServices.HasRefreshments || item.TripServices.HasMeals || item.TripServices.HasChargers || item.TripServices.IsDirectNoneStop || item.TripServices.HasNewspapers || item.TripServices.HasWiFi || item.TripServices.HasRefreshments) {
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
            if (item.TripServices.HasMeals) {
                servicesHtmll = servicesHtmll +
                    '<div class="col-10 center-text trip-service-icon"><img src="img/meals.png" alt="Alternate Text" />  </div>  ' +
                    '<div class="col-40  trip-service-text"> ' + lblMeals + ' </div>        ';
                rowColCounter = rowColCounter + 1;
            }

            if (item.TripServices.HasRefreshments) {
                servicesHtmll = servicesHtmll +
                    '<div class="col-10 center-text trip-service-icon"><img src="img/refresh.png" alt="Alternate Text" />  </div>' +
                    '<div class="col-40  trip-service-text"> ' + lblrefreshments + ' </div> ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>   ' +
                        '<div class="row trip-service"> ';
                    rowColCounter = 0;
                }
            }
            if (item.TripServices.HasWiFi) {
                servicesHtmll = servicesHtmll +
                    '<div class="col-10 center-text trip-service-icon"><img src="img/wifi.png" alt="Alternate Text" />  </div>  ' +
                    '<div class="col-40  trip-service-text"> ' + lblWifi + ' </div>        ';
                rowColCounter = rowColCounter + 1;
            }

            if (item.TripServices.HasEntertainment) {
                servicesHtmll = servicesHtmll +
                    '<div class="col-10 center-text trip-service-icon"><img src="img/ipad.png" alt="Alternate Text" />  </div>' +
                    '<div class="col-40  trip-service-text"> ' + lblEntertainment + ' </div> ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>   ' +
                        '<div class="row trip-service"> ';
                    rowColCounter = 0;
                }
            }
            if (item.TripServices.HasChargers) {
                servicesHtmll = servicesHtmll +
                    '<div class="col-10 center-text trip-service-icon"> <img src="img/charger.png" alt="Alternate Text" /> </div>' +
                    ' <div class="col-40 trip-service-text "> ' + lblChargres + ' </div>     ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>   ' +
                        '<div class="row trip-service"> ';
                    rowColCounter = 0;
                }
            }
            if (item.TripServices.IsDirectNoneStop) {
                servicesHtmll = servicesHtmll +
                    '           <div class="col-10 center-text trip-service-icon"> <img src="img/directtrip.png" alt="Alternate Text" /> </div>         ' +
                    '           <div class="col-40 trip-service-text "> ' + lblDirect + ' </div>  ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>   ' +
                        '<div class="row trip-service"> ';
                    rowColCounter = 0;
                }
            }
            if (item.TripServices.HasNewspapers) {
                servicesHtmll = servicesHtmll +
                    '<div class="col-10 center-text trip-service-icon"><img src="img/newspaper.png" alt="Alternate Text" />  </div>          ' +
                    '<div class="col-40  trip-service-text">' + lblNewspapers + '</div>     ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>';
                    rowColCounter = 0;
                }
            }
            if (item.TripServices.HasTV) {
                servicesHtmll = servicesHtmll +
                    '           <div class="col-10 center-text trip-service-icon"> <img src="img/entertainment.png" alt="Alternate Text" /> </div>         ' +
                    '           <div class="col-40 trip-service-text "> ' + lblTV + ' </div>  ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>   ' +
                        '<div class="row trip-service"> ';
                    rowColCounter = 0;
                }
            }
            if (item.TripServices.HasTables) {
                servicesHtmll = servicesHtmll +
                    '           <div class="col-10 center-text trip-service-icon"> <img src="img/SeatTable.png" alt="Alternate Text" /> </div>         ' +
                    '           <div class="col-40 trip-service-text "> ' + lblTables + ' </div>  ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>   ' +
                        '<div class="row trip-service"> ';
                    rowColCounter = 0;
                }
            }
            if (item.TripServices.HasLimit_seats) {
                servicesHtmll = servicesHtmll +
                    '<div class="col-10 center-text trip-service-icon"><img src="img/LimitedSeat.png" alt="Alternate Text" />  </div>          ' +
                    '<div class="col-40  trip-service-text">' + lblLimitSeats + '</div>     ';
                rowColCounter = rowColCounter + 1;
                if (rowColCounter > 1) {
                    servicesHtmll = servicesHtmll + ' </div>';
                    rowColCounter = 0;
                }
            }
            if (rowColCounter == 1) {
                servicesHtmll = servicesHtmll + '<div class="col-50">&nbsp</div> </div>   '
                rowColCounter = 0;
            }
            servicesHtmll = servicesHtmll + ' </div></div>';
        }
        var priceDivHtml = "";
        if (TripType == "Direct") {
            if (pricesNo == 1) {
                if (item) {
                    priceDivHtml = '<div class="row col-100 split-card1 btn-standard-price"  data-selectedPriceDiv="0" data-JourneyID ="' + item.JourneyID + '"  data-OfferID="' + item.Trips[0].FeeInfo[0].OfferID + '"  data-index ="' + index + '">' +
                        '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold">' + FlexiblePrice + lblSAR + ' </div>' +
                        '<div class="row col-100" style="font-size:13px;">' +
                        ' <div class="col-60"></div>' +
                        ' <div class="col-40 price-card3">' + FlexiblePricelbl + '</div>' +
                        ' </div>' +
                        '</div>';

                }
            } else if (pricesNo == 2) {
                if (item) {
                    priceDivHtml = '<div class="row col-100" style=" margin-top: 2%!important;">' +
                        '<div class="row col-50 split-card2  btn-standard-price" data-selectedPriceDiv="0" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[0].OfferID + '"  data-index ="' + index + '" >' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + FlexiblePrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card1">' + FlexiblePricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row col-50 split-card3 btn-standard-price"  data-selectedPriceDiv="1" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[1].OfferID + '" data-index ="' + index + '">' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + EconomicPrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card2">' + EconomicPricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';


                }
            } else if (pricesNo == 3) {
                if (item) {
                    priceDivHtml = '<div class="row col-100" style=" margin-top: 2%!important;">' +
                        '<div class="row col-50 split-card2  btn-standard-price" data-selectedPriceDiv="0" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[0].OfferID + '"  data-index ="' + index + '" >' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + FlexiblePrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card1">' + FlexiblePricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row col-50 split-card3 btn-standard-price"  data-selectedPriceDiv="1" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[1].OfferID + '" data-index ="' + index + '">' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + EconomicPrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card2">' + EconomicPricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row col-100 split-card1 btn-standard-price"  data-selectedPriceDiv="2" data-journyIndex="2" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[2].OfferID + '" data-index ="' + index + '">' +
                        '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold">' + SavePrice + lblSAR + ' </div>' +
                        '<div class="row col-100" style="font-size:13px;">' +
                        '<div class="col-60"></div>' +
                        ' <div class="col-40 price-card3">' + SavePricelbl + '</div>' +
                        ' </div>' +
                        '</div>';
                }
            }
        } else if (TripType == "Transit") {
            if (pricesNoTransit == 1) {
                if (item) {
                    priceDivHtml = '<div class="row col-100 split-card1 btn-standard-price"  data-selectedPriceDiv="0" data-JourneyID ="' + item.JourneyID + '" data-tripType="Trans" data-OfferID="' + item.Trips[0].FeeInfo[0].OfferID + '"  data-index ="' + index + '">' +
                        '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold">' + FlexiblePrice + lblSAR + ' </div>' +
                        '<div class="row col-100" style="font-size:13px;">' +
                        ' <div class="col-60"></div>' +
                        ' <div class="col-40 price-card3">' + FlexiblePricelbl + '</div>' +
                        ' </div>' +
                        '</div>';


                }
            } else if (pricesNoTransit == 2) {
                if (item) {
                    priceDivHtml = '<div class="row col-100" style=" margin-top: 2%!important;">' +
                        '<div class="row col-50 split-card2  btn-standard-price" data-selectedPriceDiv="0" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[0].OfferID + '" data-tripType="Trans" data-index ="' + index + '">' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + FlexiblePrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card1">' + FlexiblePricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row col-50 split-card3 btn-standard-price"  data-selectedPriceDiv="1" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[1].OfferID + '" data-tripType="Trans" data-index ="' + index + '">' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + EconomicPrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card2">' + EconomicPricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';


                }
            } else if (pricesNoTransit == 3) {
                if (item) {
                    priceDivHtml = '<div class="row col-100" style=" margin-top: 2%!important;">' +
                        '<div class="row col-50 split-card2  btn-standard-price" data-selectedPriceDiv="0" data-journyIndex="0" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[0].OfferID + '" data-tripType="Trans" data-index ="' + index + '">' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + FlexiblePrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card1">' + FlexiblePricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row col-50 split-card3 btn-standard-price"  data-selectedPriceDiv="1" data-journyIndex="1" data-JourneyID ="' + item.JourneyID + '" data-OfferID="' + item.Trips[0].FeeInfo[1].OfferID + '" data-tripType="Trans" data-index ="' + index + '">' +
                        '<div class="row col-100 blackFont" style="margin-right:5%;font-size:16px;font-weight:bold">' + EconomicPrice + lblSAR + '</div>' +
                        '<div class="row col-100" style="font-size:11px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card2">' + EconomicPricelbl + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row col-100 split-card1 btn-standard-price"  data-selectedPriceDiv3="2" data-journyIndex="2" data-JourneyID ="' + item.JourneyID + '" data-tripType="Trans" data-OfferID="' + item.Trips[0].FeeInfo[2].OfferID + '" data-index ="' + index + '">' +
                        '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold">' + SavePrice + lblSAR + ' </div>' +
                        '<div class="row col-100" style="font-size:13px;">' +
                        '<div class="col-40"></div>' +
                        '<div class="col-60 price-card3">' + SavePricelbl + '</div>' +
                        ' </div>' +
                        '</div>';
                }
            }

        }
        var TripTypelbl;
        if (GetApplicationLanguage() === "ar")
            if (TripType == "Transit")
                TripTypelbl = GetResourceText("Transitlbl");
            else
                TripTypelbl = GetResourceText("Directlbl");
        if (condition == "No" || condition == "directTripsOnly" && item.Type == "Direct" || condition == "day" && item.DepartureTime <= "12" || condition == "night" && item.DepartureTime > "12" || condition == "directDay" && item.Type == "Direct" && item.DepartureTime <= "12" || condition == "directNight" && item.Type == "Direct" && item.DepartureTime > "12") {
            sortingList[index++] = {
                i: [duration, price, '<li style="padding-bottom: 15px;">' +
                '<div class="content-container no-bottom-margins" style="z-index:1000 !important; padding:2%!important; margin: auto!important;">' +
                '<div class="row trip-tripinfo">' +
                '<div class="col-100">      ' +
                '<div class="row" style="' + cssDirection + '">           ' +
                '  <div class="col-33 center-text font-size-30"> ' + item.DepartureTime + '  </div> ' +
                '  <div class="col-33 center-text font-size-20 blackFont" style="font-weight: 300;">' + lblDuration + '</div>     ' +
                '  <div class="col-33 center-text font-size-30">' + item.ArrivalTime + '</div>   ' +
                '</div>          ' +
                '  <div class="row" style="' + cssDirection + '">           ' +
                '      <div class="col-33 center-text color-s-dark-orange font-size-14 blackFont" blackFont>' + lblDepOn + '</div>         ' +
                '      <div class="col-33 center-text font-size-14 blackFont">' + duration + lblHours + '</div>     ' +
                '      <div class="col-33 center-text color-s-dark-orange font-size-14 blackFont">' + lblDepTo + '</div>         ' +
                '  </div>          ' +
                '<div class="row">' +
                '<div class="col-30"></div>' +
                '<div class="col-40 center-text" style="font-size: 14px">' + TripTypelbl + '</div>' +
                '<div class="col-30"></div>' +
                '</div>' +
                '<div class="row col-100" style="border-bottom: 2px dashed lightgray; width: 100%;margin-top: 2%!important; margin-left: auto!important; margin-left: auto!important;">' + '</div>' +
                transitHtml +
                servicesHtmll +
                priceDivHtml +
                '</li>'
                ]
            }

        }
    }

    return sortingList;
}

/************************ End of trips *****************************/

/***********************Passengers details***************************/
var originalTktPrice;
var originalTktPrice2;
myApp.onPageInit('PassengersInfo', function (page) {
    var profileInfo = GetLocalDataObject("storedprofile");
    if (!profileInfo)
        $$("#UpdateUserProfile").hide();
    if (logo == 1) {
        $$("#Rlogo3").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 52px;height:33px">');
        $$("#logoTitle3").addClass("blue-logo");
    } else {
        $$("#Rlogo3").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -4px">');
        $$("#logoTitle3").addClass("orange-color");

    }
    var profileInfo = GetLocalDataObject("storedprofile");
    if (profileInfo) {
        var mobileNumber = profileInfo.MobileNumber.replace(" ", "")
        $$("#txtCountryCode").val(mobileNumber.substr(0, 3));
        $$("#txtPhoneNUmber").val(profileInfo.MobileNumber.substring(3));
        $$("#txtEmailAddress").val(profileInfo.UserName);
    }

    $$("#txtCountryCode").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr');
        } else {
            myApp.smartSelectOpen('#countriesEn');
        }
    });

    $$("#SmartSelectValuepickEn").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode").val($$("#countriesSelect").val());
    });

    $$("#SmartSelectValuepick").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode").val($$("#countriesSelectAr").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo");
    if (reservationContactInfo != null) {
        if (profileInfo) {
            $$("#txtPhoneNUmber").val(profileInfo.MobileNumber.substring(3));
            $$("#txtEmailAddress").val(profileInfo.UserName);
        } else {
            $$("#txtPhoneNUmber").val(reservationContactInfo.phoneNumber);
            $$("#txtEmailAddress").val(reservationContactInfo.email);
        }
        $$("#SmartSelectValuepick").text(reservationContactInfo.countryCode);
        $$("#SmartSelectValuepickEn").text(reservationContactInfo.countryCodeEn);
        $$("#countriesSelectAr").val(reservationContactInfo.telCode);
        $$("#countriesSelect").val(reservationContactInfo.telCode);
        if (reservationContactInfo.countryCode != "")
            $$("#txtCountryCode").val(reservationContactInfo.countryCode);
        else
            $$("#txtCountryCode").val("966");
    } else {
        $$("#countriesSelectAr").val("966");
        $$("#countriesSelect").val("966");
        $$("#txtCountryCode").val("966");
    }

    //Fill nationalities setup data.
    GetAllNationalities();

    //Button post reservation
    $$('#btnPostReservation').on('click', function () {
        var reservationPostBody = collectReservationsInfo();
        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateTripsSummaryPost(reservationPostBody);

        if (validationResult == ValidationSucessVal) {
            savePassengerContactInfo();
            SaveLocalData("ReservationReqBody", reservationPostBody);
            POSTReservations(reservationPostBody);
        } else {
            if (validationResult.indexOf("ErrorPassData_") >= 0) {
                var passName = validationResult.replace("ErrorPassData_", "");
                myApp.alert(GetResourceText("ErrorPassData") + " " + passName, GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            } else {
                var redLinks = $$('.validate').filter(function (index, el) {

                    return $$(this).attr('data-validation') == validationResult;
                });
                $$("." + validationResult).addClass("Validation-error");
                redLinks.addClass("Validation-error");
                myApp.alert(GetResourceText(validationResult), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));

            }
        }
    });

    $$('#UpdateUserProfile').on('click', function () {
        mainView.router.load({
            url: 'UpdateProfile.html'
        });
    });

    //add passenger details click event handler.
    $$('.passengers-lists').on('click', '.PassengerItemClickable', function () {
        var passUpdateDetails =
            {
                itemIndex: $$(this).data("index"),
                itemType: $$(this).data("type")
            };

        savePassengerContactInfo(passUpdateDetails);


        SaveLocalObject("passengerUpdateDetials", passUpdateDetails);
        var addUpdateText = GetResourceText("AddUpdate");
        var SearchText = GetResourceText("SearchUsers");
        var FavText = GetResourceText("FromFavorit");

        var modal = myApp.modal({
            title: GetResourceText("lblPassengerInfo"),
            text: '' +
                '<div class="Button-shaddow btn-login-orange close-popup " id="btnAddUpdatePassengerPopup" style="font-weight: 300; font-size: 13px !important; font-stretch: condensed;">' + addUpdateText + '</div>' +
                '<div class="Button-shaddow btn-login-orange close-popup " id="btnSearchPassengerPopup" style="font-weight: 300; font-size: 13px !important; font-stretch: condensed;">' + SearchText + '</div>' +
                '<div class="Button-shaddow btn-login-orange close-popup " id="btnFavPassengerPopup" style="font-weight: 300; font-size: 13px !important; font-stretch: condensed;">' + FavText + '</div>'
            ,
            buttons: [
                {
                    text: GetResourceText('Cancel'),
                    bold: true,
                    onClick: function () {
                        //  myApp.alert('Thanks! I know you like it!')
                        savePassengerContactInfo();

                        var passUpdateDetails =
                            {
                                itemIndex: $$(this).data("index"),
                                itemType: $$(this).data("type")
                            };

                        SaveLocalObject("passengerUpdateDetials", passUpdateDetails);
                        SaveLocalData("PassengerUpdateType", "Update");
                    }
                },
            ]
        });
    });

    $$("body").on("click", "#btnAddUpdatePassengerPopup", AddUpdatePassengerDetails);
    $$("body").on("click", "#btnSearchPassengerPopup", SearchPassengerDetailsPage);
    $$("body").on("click", "#btnFavPassengerPopup", GoToSelectFavPassenger);

    //add passenger details click event handler.
    function AddUpdatePassengerDetails() {
        myApp.closeModal();
        SaveLocalData("PassengerUpdateType", "Update");
        mainView.router.load({
            url: 'PassengerfillInfo.html'
        });
    }

    function SearchPassengerDetailsPage() {
        myApp.closeModal();
        SaveLocalData("PassengerUpdateType", "Search");
        mainView.router.load({
            url: 'PassengerfillInfo.html'
        });
    }

    function savePassengerContactInfo() {
        var appLang = GetLocalData("ApplicationLanguage");
        var countryCode = "";
        var countryCodeEn = "";
        var telCode;
        if (appLang == 'ar') {
            countryCode = $$("#SmartSelectValuepick").text();
            telCode = $$("#countriesSelectAr").val();
        } else {
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

    function GoToSelectFavPassenger() {
        myApp.closeModal();
        mainView.router.load({
            url: 'favorite_list.html'
        });
    }

    var passInfo = GetLocalDataObject("ticketSearchData");
    if (passInfo == null) {
        mainView.router.load({
            url: 'Home.html'
        });
    } else {
        // get passenger numbers and types .
        var adultsCount = passInfo.Passengers.AdultsCount;
        var ChildCount = passInfo.Passengers.ChildrenCount;
        var InfCount = passInfo.Passengers.InfantsCount;

        if (adultsCount == 0) {
            //Hide Adult List
            $$(".adults-info").css("display", "none");
        }
        if (ChildCount == 0) {
            //Hide Children List
            $$(".child-info").css("display", "none");
        }
        if (InfCount == 0) {
            //Hide Infants List
            $$(".infants-info").css("display", "none");
        }
        var customerTextLabel = GetResourceText("Customer");
        if (GetLocalDataObject("AdultPassengers") == null || GetLocalDataObject("AdultPassengers").length != adultsCount) {
            var adultsArray = [];
            for (i = 0; i < adultsCount; i++) {
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
        if (childrenArray == null || childrenArray.length != ChildCount) {
            childrenArray = [];
            for (i = 0; i < ChildCount; i++) {
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
        if (InfArray == null || InfArray.length != InfCount) {
            InfArray = [];
            for (i = 0; i < InfCount; i++) {
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

    function POSTReservations(postData) {
        myApp.showPreloader(GetResourceText("Loading"));
        // var urlAjax = "https://mobile.saptco.com.sa/Reservation/Reservations";
        var urlAjax = "http://integtest.saptco.sa/Reserv/Reservations";
        var headers = {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json',
        };
        if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null)
            headers = {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json',
                'X-UUID': GetLocalData('UUID'),
            };
        if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
            headers['X-UserId'] = GetLocalData('UserId');
            headers['X-SDPId'] = GetLocalData('SDPId');
        }

        $$.ajax(
            {
                type: "POST",
                url: urlAjax,
                dataType: 'json',
                contentType: 'application/json',
                data: postData,
                headers:headers,

                success: function (data, status, xhr) {
                    myApp.hidePreloader(GetResourceText("Loading"));
                    if (data.Results) {
                        // check in case the returned data contains tickets
                        tax = data.Results.Tickets[0].Tax;
                        if (prevSeatNumber == -1) {
                            SaveLocalObject("ReservationSummary", data);
                        } else {

                            SaveLocalObject("ReservationSummary", data);
                        }
                        var reservationInfo = GetLocalDataObject("ReservationReqBody");
                        mainView.router.load({
                            url: 'Trip-summry.html'
                        });
                    }
                },
                error: function (data) {
                    myApp.hidePreloader("Loading");
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
    }
});

myApp.onPageInit('UpdateProfile', function (page) {
    var profileInfo = GetLocalDataObject("storedprofile");
    $$("#FName").val(profileInfo.FirstName);
    $$("#LName").val(profileInfo.FullName);
    $$("#Email").val(profileInfo.UserName);
    $$("#Mobile").val(profileInfo.MobileNumber.substring(3));
    $$("#IDNumber").val(profileInfo.IDNumber);
    $$("#VersionNumber").val(profileInfo.VersionNumber);
    $$("#calendar-default").val(profileInfo.BirthDate);
    $$("#IDType").val(profileInfo.IDType);
});

/*******************End  of Passengers details*************************/

/************************** Nationalities **********************************/

function fillNationalities() {
    var nationalitiesList = GetLocalDataObject("NationalitiesList" + GetServiceLanguage());
    if (nationalitiesList != null) {
        var nationalityCat = GetLocalData("SelectedIdType");
        if (nationalityCat == "IqamaID") {
            var nationalitiesQuery = JSLINQ(nationalitiesList.Results).Where(function (item) {
                return item.Type == "Normal"
            });
            nationalitiesList.Results = nationalitiesQuery.items;
        }
        if (nationalityCat == "GCC") {
            var nationalitiesQuery = JSLINQ(nationalitiesList.Results).Where(function (item) {
                return item.Type == "GCC";
            });
            nationalitiesList.Results = nationalitiesQuery.items;
        }

        var natinoalityList = myApp.virtualList('.list-block.virtual-list', {
            // Array with items data
            items: nationalitiesList.Results,
            // Custom render function to render item's HTML
            renderItem: function (index, item) {
                return '<li class="item-content">' +
                    '<div class="item-inner clickable-Nationality" data-nationalityId =' + item.ID + '>' +
                    '<div class="item-title" >' + item.Name + '</div>' +
                    '</div>' +
                    '</li>';
            },
            searchAll: function (query, items) {
                var foundItems = [];

                for (var i = 0; i < items.length; i++) {
                    // Check if title contains query string
                    if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) == 0)
                        foundItems.push(i);
                }

                for (var i = 0; i < items.length; i++) {
                    if (items[i].Name.replace("أ", "ا").replace("إ", "ا").toUpperCase().indexOf(query.trim().replace("أ", "ا").replace("إ", "ا").toUpperCase()) > 0)
                        foundItems.push(i);
                }


                // Return array with indexes of matched items
                return foundItems;
            }
        });
    }
}

function SaveNatiotnlaitySelection(selectionName, selectionId) {
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

myApp.onPageInit('nationalities', function (page) {
    // on nationality click event
    $$(document).on('click', '.clickable-Nationality', function () {
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

function GetAllNationalities() {
    if (GetLocalDataObject("NationalitiesList" + GetServiceLanguage()) == null) {
        myApp.showPreloader(GetResourceText("Loading"));
        var headers = {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json',
        };
        if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null)
            headers = {
                'Accept-Language': GetServiceLanguage(),
                Accept: 'application/json',
                'X-UUID': GetLocalData('UUID'),
            };
        if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
            headers['X-UserId'] = GetLocalData('UserId');
            headers['X-SDPId'] = GetLocalData('SDPId');
        }

        $$.ajax({
            // url: 'https://mobile.saptco.com.sa/Reservation/Nationalities',
            url: 'http://integtest.saptco.sa/Reserv/Nationalities',
            headers: headers,
            success: function (data, status, xhr) {
                myApp.hidePreloader();
                var objectData = JSON.parse(data);
                SaveLocalObject("NationalitiesList" + GetServiceLanguage(), objectData);

            },
            error: function (xhr, status) {
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
for (var i = 1915; i <= 2015; i++) {
    yearsArr.push(i);
}


function limit(element) {
    var max_chars = 10;

    if (element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}

myApp.onPageInit('PassengerfillInfo', function (page) {
    if (logo == 1) {
        $$("#Rlogo5").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 40px;height:30px ">');
        $$("#logoTitle5").addClass("blue-logo");
    } else {
        $$("#Rlogo5").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -7px">');
        $$("#logoTitle5").addClass("orange-color");

    }


    //passenger-BirthDate
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate() - 0);
    var _maxdate = new Date().setDate(currentDate.getDate() + 0);
    var _mindate = new Date().setDate(currentDate.getDate() - 30000);
    calendarDateFormatDepart = myApp.calendar({
        input: '#calendar-BirthDatePassenger',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true,
        minDate: today,
        maxDate: today,
        toolbar: true,
        toolbarCloseText: calendarCloseButton,
        toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '{{monthPicker}}' +
            '{{yearPicker}}' +
            '</div></div> ',
        onChange: function () {
            //today = calendarDepartVal;
        },
        onOpen: function (p) {
            calendarDateFormatDepart.params.maxDate = today;
            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");
            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        },
        onDayClick: function () {
            calendarDateFormatDepart.close();
        }
    });
    calendarDateFormatDepart.params.maxDate = _maxdate;
    calendarDateFormatDepart.params.minDate = _mindate;
    calendarDateFormatDepart = myApp.calendar({
        input: '#calendar-BirthDatePassengerSearch',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true,
        minDate: today,
        maxDate: today,
        toolbar: true,
        toolbarCloseText: calendarCloseButton,
        toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '{{monthPicker}}' +
            '{{yearPicker}}' +
            '</div></div> ',
        onChange: function () {
            //today = calendarDepartVal;
        },
        onOpen: function (p) {
            calendarDateFormatDepart.params.maxDate = today;
            $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");
            $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
            $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
        },
        onDayClick: function () {
            calendarDateFormatDepart.close();
        }
    });

    calendarDateFormatDepart.params.maxDate = _maxdate;
    calendarDateFormatDepart.params.minDate = _mindate;

    $$(".selectIdType").on("change", function (e) {
        var selectedValue = $$(".selectIdType").val();
        SaveLocalData("SelectedIdType", selectedValue);

        if (selectedValue == "NationalID") {
            // hide the nationalty field and set the value of the nationality by default to Saudi.
            $$("#liNationalityView").css("display", "none");
            $$("#NationalityId").val("1");
        } else {
            //show the field and and clear default.
            $$("#liNationalityView").css("display", "block");
            $$("#NationalityId").val("0");
        }
    });

    //function onSuccess(date) {
    //     var saptcoDate = GetSaptcoFormatedDate(date);
    //    $$(".datePickerItem").val(saptcoDate);
    //}
    //
    /// function onError(error) {
    //}
    function openDate2(id) {
        var calendarCloseButton = GetResourceText("Agree");
        var currentDate = new Date();
        var today = new Date().setDate(currentDate.getDate() - 0);
        var _maxdate = new Date().setDate(currentDate.getDate() + 0);
        var _mindate = new Date().setDate(currentDate.getDate() - 30000);
        calendarDateFormatDepart = myApp.calendar({
            input: '#' + id,
            dateFormat: 'dd-mm-yyyy',
            closeOnSelect: true,
            minDate: today,
            maxDate: today,
            toolbar: true,
            toolbarCloseText: calendarCloseButton,
            toolbarTemplate: '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                '{{monthPicker}}' +
                '{{yearPicker}}' +
                '</div></div> ',
            onChange: function () {
                //today = calendarDepartVal;
            },
            onOpen: function (p) {
                calendarDateFormatDepart.params.maxDate = today;
                $$(".picker-calendar-next-month").html("<div class='div-next'></div>");
                $$(".picker-calendar-prev-month").html("<div class='div-prev'></div>");
                $$(".picker-calendar-next-year").html("<div class='div-next'></div>");
                $$(".picker-calendar-prev-year").html("<div class='div-prev'></div>");
            },
            onDayClick: function () {
                calendarDateFormatDepart.close();
            }
        });
        calendarDateFormatDepart.params.maxDate = _maxdate;
        calendarDateFormatDepart.params.minDate = _mindate;
    }

    $$(".datePickerItem").on("click", function () {

        openDate2("calendar-BirthDatePassenger");
    });
    $$(".datePickerItemSearch").on("click", function () {
        openDate2("calendar-BirthDatePassengerSearch");
    });

    //$$("#show-datePicketrClass").on("click", function () {
    ///   var selectedDate = new Date();
    //  var birthDateVal = $$("#calendar-BirthDatePassenger").val();
    //  if (birthDateVal.split("-").length > 1) {
    //      selectedDate = GetFormatedDate(birthDateVal);
    //  }
    //  var options = {
    //      date: selectedDate,
    //      mode: 'date',
    //       local: GetResourceText("localizeDescription")
    //   };

    //    datePicker.show(options, onSuccess, onError);
    // });

    //  var pickerDevice = myApp.picker({
    //    input: '#calendar-BirthDate-picker',

    //   toolbar: false,
    //  rotateEffect: true,
    //   closeByOutsideClick: true,

    //  value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

    //   onChange: function (picker, values, displayValues) {
    //        var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
    //        if (values[1] > daysInMonth) {
    //            picker.cols[1].setValue(daysInMonth);
    //         }
    //     },
    //
    //      formatValue: function (p, values) {
    //           return values[0] + '-' + values[1] + '-' + values[2];
    //       },
    //       cols: [
    //       // Months
    //   {
    //        values: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ')
    //    },
    //        // Days
    //    {
    //        values: [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    //    },
    //        // Years
    //    {
    //       values: yearsArr,
    //   }
    //  ]
    //});

    var updatedPassType = GetLocalDataObject("passengerUpdateDetials");
    var itemIndex = updatedPassType.itemIndex;
    var updatedItem = {};

    if (GetLocalData("PassengerUpdateType") == "Search") {
        $$("#SearchView").css("display", "block");
        $$("#PassengerDetalies").addClass("disabled");
    } else {
        $$("#SearchView").css("display", "none");
        myApp.accordionOpen("#accPassInfo");
        $$("#PassengerDetalies").removeClass("disabled");
        // fill form details.
        fillPassengerDetails();
    }


    // on nationality click event
    $$('.passenger-nationality-click').on('click', function () {
        savePassengerDetails();
        mainView.router.load({
            url: 'nationalities.html'
        });
    });

    // on nationality click event
    $$('#btnSavePassenger').on('click', function () {
        var isUpdated = savePassengerDetails();
        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidatePassengers(updatedItem);
        if (validationResult == ValidationSucessVal) {
            updatedItem.isCompleted = true;
            if ($$("#cboAddToFavList").is(':checked')) {
                var favList = GetLocalDataObject("favList_" + updatedPassType.itemType);
                var matchingIndex = 0;
                //check for null value.
                if (favList) {
                    var isContainUser = false;
                    $$.each(favList, function (index, value) {
                        if (value.IDNumber == updatedItem.IDNumber && value.IDType == updatedItem.IDType) {
                            isContainUser = true;
                            matchingIndex = index;
                        }
                    });

                    if (isContainUser == false) {
                        favList.push(updatedItem);
                    } else {
                        favList[matchingIndex] = updatedItem;
                        SaveLocalObject("favList_" + updatedPassType.itemType, favList[matchingIndex]);
                    }
                } else {
                    favList = [updatedItem];
                }
                SaveLocalObject("favList_" + updatedPassType.itemType, favList)
            }
            if (isUpdated) {
                mainView.router.reloadPreviousPage('PassengersInfo.html');
                mainView.router.back({
                    url: 'PassengersInfo.html'
                });
            }
        } else {
            var redLinks = $$('.validate').filter(function (index, el) {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationResult), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });

    function savePassengerDetails() {
        var formData = myApp.formToJSON("#PassengerDetalies");
        var nationalityCat = GetLocalData("SelectedIdType");

        var passengerArray = [];

        if (updatedPassType.itemType == "adult") {
            passengerArray = GetLocalDataObject("AdultPassengers");
        }

        if (updatedPassType.itemType == "child") {
            passengerArray = GetLocalDataObject("ChildsArray");
        }

        if (updatedPassType.itemType == "infant") {
            passengerArray = GetLocalDataObject("InfantsPassengersArray");
        }
        updatedItem = passengerArray[itemIndex];
        //selectIdType
        //selectGender
        var selectedIdType = $$("#selectIdType").val();
        var selectedGender = $$("#selectGender").val();
        var tempFname = formData.FName;
        var tempMname = formData.MName;
        var tempLname = formData.LName;
        formData.FName = tempFname.replace(/\s/g, '');
        formData.MName = tempMname.replace(/\s/g, '');
        formData.LName = tempLname.replace(/\s/g, '');
        updatedItem.Name = formData.FName;
        updatedItem.Name += " " + formData.MName;
        updatedItem.Name += " " + formData.LName;
        updatedItem.DateOfBirth = formData.DateOfBirth;
        updatedItem.Gender = formData.Gender;
        updatedItem.IDNumber = formData.IDNumber;
        updatedItem.IDType = formData.IDType;
        updatedItem.IDVersion = formData.IDVersion;
        updatedItem.SAPTCOID = GetLocalDataObject("SAPTCOID");
        var selectedNationality = GetLocalDataObject("SelectedNationality");

        if (selectedNationality != null) {
            updatedItem.NationalityID = selectedNationality.natioalityID;
        }

        if (nationalityCat == "NationalID") {
            updatedItem.NationalityID = "1";
        }

        var validationResult = ValidatePassengers(updatedItem);
        var passengersquery = JSLINQ(passengerArray).Where(function (item) {
            return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType);
        });
        var isUpdated = false;
        if (validationResult == ValidationSucessVal && passengersquery.items.length <= 1) {
            updatedItem.isCompleted = true;
            isUpdated = true;
        } else {
            updatedItem.isCompleted = false;
            if (passengersquery.items.length > 1) {
                myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        }

        passengerArray[itemIndex] = updatedItem;

        switch (updatedPassType.itemType) {
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
    function fillPassengerDetails() {

        var itemIndex = updatedPassType.itemIndex;
        var formSavedData = {};
        switch (updatedPassType.itemType) {
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

        if (updatedItem.Name.indexOf("Passenger") >= 0 || updatedItem.Name.indexOf("راكب") >= 0) {
            updatedItem.Name = "";
        }
        myApp.formFromJSON("#PassengerDetalies", updatedItem);

        // this code will select the dropdown values zzzzzzz.

        $$("#selectIdType").val(updatedItem.IDType)
        var optionsItems = $$("#selectIdType").children();
        $$.each(optionsItems, function (index, value) {
            if (optionsItems[index].selected) {
                $$("#txtIDTypeText").text(optionsItems[index].text);
            }
        });

        var optionsItems2 = $$("#selectGender").children();

        $$.each(optionsItems2, function (index, value) {
            if (optionsItems2[index].selected) {
                $$("#txtGenderText").text(optionsItems2[index].text);
            }
        });

        var nationalityId = updatedItem.NationalityID;

        var nationalities = GetLocalDataObject("NationalitiesList" + GetServiceLanguage()).Results;
        var nationalityQuery = JSLINQ(nationalities).Where(function (item) {
            return (item.ID == nationalityId);
        });
        var nationalityName = nationalityQuery.items[0];
        if (nationalityQuery.items.length > 0) {
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
    // var calendarDateFormat = myApp.calendar({
    ////   input: '#calendar-BirthDatePassenger',
    ////   dateFormat: 'dd-mm-yyyy',
    //closeOnSelect: true
    //});

    //var calendarDateSearch = myApp.calendar({
    //    input: '#calendar-BirthDatePassengerSearch',
    ////    dateFormat: 'dd-mm-yyyy',
    //    closeOnSelect: true
    // });

    $$("#btnSearchCustomer").on("click", function () {
        var formData = myApp.formToJSON("#SearchPassengerDetalies");
        PostCustomerSearch(formData);
    });

    //post customer search zzzz

    function PostCustomerSearch(postData) {
        myApp.showPreloader(GetResourceText("Loading"));
        // var urlAjax = "https://mobile.saptco.com.sa/Reservation/customers";
        var urlAjax = "http://integtest.saptco.sa/Reserv/customers";
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

                success: function (data, status, xhr) {
                    SaveLocalObject("SAPTCOID", data.Results.SAPTCOID);
                    myApp.hidePreloader();
                    // open collapsed info in case the info where found
                    myApp.accordionOpen("#accPassInfo");

                    myApp.formFromJSON("#PassengerDetalies", data.Results);
                    $$("#inputIDVersion").val(data.Results.IDVersion);
                    $$("#selectIdType").val(data.Results.IDType)
                    var name = data.Results.Name;
                    var space = " ";
                    var space1 = name.indexOf(space);
                    space1++;
                    var space2 = name.indexOf(space, space1);
                    var fname = name.substring(0, space1);
                    var mname = name.substring(space1, space2);
                    var lname = name.substring(space2);
                    $$("#passengerFName").val(fname)
                    $$("#passengerMName").val(mname)
                    $$("#passengerLName").val(lname)
                    var optionsItems = $$("#selectIdType").children();
                    $$.each(optionsItems, function (index, value) {
                        if (optionsItems[index].selected) {
                            $$("#txtIDTypeText").text(optionsItems[index].text);
                        }
                    });

                    var optionsItems2 = $$("#selectGender").children();

                    $$.each(optionsItems2, function (index, value) {
                        if (optionsItems2[index].selected) {
                            $$("#txtGenderText").text(optionsItems2[index].text);
                        }
                    });
                    var nationalities = GetLocalDataObject("NationalitiesList" + GetServiceLanguage()).Results;
                    $$.each(nationalities, function (index, value) {
                        if (value.ID == data.Results.NationalityID) {
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
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.accordionClose("#accPassInfo");
                    myApp.alert(GetResourceText("NoResultFoundCustomer"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
    }

});

function PostUserDevice(postData) {
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

            success: function (data, status, xhr) {
                console.log("Device saved");
            },
            error: function (xhr, status) {
                console.log("Device failed saved");
            }
        });
}

myApp.onPageAfterBack('nationalities', function (page) {
    var selectedNationality = GetLocalDataObject("SelectedNationality");

    if (selectedNationality) {
        $$("#lblNationalityName").val(selectedNationality.nationalityName);
    }
});
/********************************************************************/

/************************Reservation First Summry *****************************/
myApp.onPageInit('FirstSummry', function (page) {
    //check the type of the trip and update the form based on the value
    if (logo == 1) {
        $$("#Rlogo2").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 52px;height:33px">');
        $$("#logoTitle2").addClass("blue-logo");
    } else {
        $$("#Rlogo2").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -4px">');
        $$("#logoTitle2").addClass("orange-color");

    }
    $$("#divReturnTicketContainer").css("display", "none");
    var journyInfo = GetLocalDataObject("OutJournyFullData");
    var tripsString = "";
    var direction = "";
    var iconDivRefund = "";
    var iconDivTrans = "";
    var index = -1;
    var count = -1;
    var x = GetLocalData("ReservationType");
    if (GetApplicationLanguage() == "ar") {
        direction = GetResourceText("classArabic");
    }
    if (journyInfo != null && journyInfo.Trips != null) {
        // if (x == "OneWay") {
        var TripType = journyInfo.Type;
        for (var i = 0; i < journyInfo.Trips.length; i++) {
            var depName = journyInfo.Trips[i].DepartureStation.Name;
            var arrName = journyInfo.Trips[i].ArrivalStation.Name;
            var depTime = journyInfo.Trips[i].DepartureTime;
            var arrTime = journyInfo.Trips[i].ArrivalTime;
            var depDate = journyInfo.Trips[i].DepartureDate;
            var arrDate = journyInfo.Trips[i].ArrivalDate;
            var duration = journyInfo.Trips[i].Duration;
            var catagoryID = GetLocalData("selectedPriceDiv");
            var catagoryID1 = GetLocalData("selectedPriceDiv1");
            var RefundText;
            var TransText;
            var IsRefundWithFees = GetResourceText("IsRefundWithFees");
            var IsRefund = GetResourceText("IsRefund");
            var NotRefundable = GetResourceText("NotRefundable");
            var IsTransWithFees = GetResourceText("IsTransWithFees");
            var IsTrans = GetResourceText("IsTrans");
            var NotTransfarable = GetResourceText("NotTransfarable");

            if (x == "OneWay" && TripType != "Transit") {
                index = catagoryID;
                count = 0;
            } else if (x == "OneWay" && TripType == "Transit") {
                index = catagoryID;
                count++;
            } else if (x == "Round" && TripType != "Transit") {
                index = catagoryID1;
                count = 0;
            } else if (x == "Round" && TripType == "Transit") {
                index = catagoryID1;
                count++;
            }
            if (journyInfo.Trips[count].FeeInfo[index].IsRefundable == true) {
                {
                    iconDivRefund = GetResourceText("trueIcon");
                    if (journyInfo.Trips[count].FeeInfo[index].IsRefundableWithfees == true)
                        RefundText = IsRefundWithFees;
                    else
                        RefundText = IsRefund;
                }
            } else if (journyInfo.Trips[count].FeeInfo[index].IsRefundable == false) {
                iconDivRefund = GetResourceText("falseIcon");
                RefundText = NotRefundable;
            }
            if (journyInfo.Trips[count].FeeInfo[index].IsTransferable == true) {
                iconDivTrans = GetResourceText("trueIcon");
                if (journyInfo.Trips[count].FeeInfo[index].IsTransferableWithfees == true)
                    TransText = IsTransWithFees;
                else
                    TransText = IsTrans;
            } else if (journyInfo.Trips[count].FeeInfo[index].IsTransferable == false) {
                iconDivTrans = GetResourceText("falseIcon");
                TransText = NotTransfarable;
            }
            tripsString = tripsString +
                '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px; background-color:#FFF5E1 !important; ">      ' +
                '      <div class="row no-gutter" style="background-color: #FFF5E1">              ' +
                '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
                GetResourceText("PassengerlblGoingTicket") +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
                '          <div class="col-100">                ' +
                '              <div class="row no-gutter">      ' +
                '                  <div class="col-20">         ' +
                '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; background-color: #FFF5E2;font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
                '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">'
                + depName + '</h4></div>' +
                '              </div>          ' +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
                '          <div class="col-100">                ' +
                '              <div class="row">                ' +
                '                  <div class="col-20">         ' +
                '                      <h5 id="lblTo trip-summary-labels1" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important;background-color: #FBF3DB; font-stretch: condensed;">' +
                GetResourceText("PassengerlblTo1") +
                '</h5>  ' +
                '                  </div>      ' +
                '                  <div class="col-80">         ' +
                '                      <h4 id="ArrivalStation_Name" class="trip-summary-labels2" style="font-weight: 300; background-color: #FFF5E2; font-stretch: condensed;">' + arrName + '</h4>         ' +
                '                  </div>      ' +
                '              </div>          ' +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
                '          <div class="col-100">                ' +
                '              <div class="row">                ' +
                '                  <div class="row col-50">         ' +
                '<div class="col-30">' +
                '                      <h4  class="trip-summary-labels1 ' + iconDivRefund + '" id="iconDiv1" style="font-weight: 300;background-color: #FBF3DB;  font-stretch: condensed;"></h4>         ' +
                '</div>' +
                '<div class="col-70">' +
                '                      <h4  class="trip-summary-labels1" style="font-weight: 300; background-color: #FFF5E2; font-stretch: condensed;">' + RefundText + '</h4>         ' +
                '</div>' +
                '                  </div>      ' +
                '                  <div class="row col-50">         ' +
                '<div class="col-30">' +
                '                      <h4  class="trip-summary-labels1 ' + iconDivTrans + '" id="iconDiv2" style="font-weight: 300; background-color: #FBF3DB; font-stretch: condensed;"></h4>         ' +
                '</div>' +
                '<div class="col-70">' +
                '                      <h4  class="trip-summary-labels1" style="font-weight: 300; background-color: #FFF5E2; font-stretch: condensed;">' + TransText + '</h4>         ' +
                '</div>' +
                '                  </div>      ' +
                '              </div>          ' +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="row" style="background-color: #FFF5E1 !important;">       ' +
                '          <div class="col-100 center-text" style="background-color: #FFF5E1 !important;">    ' +
                '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img ' + direction + ' " /> ' +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="row" style="background-color: #FFF5E2;">       ' +
                '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + depTime + '  </div>' +
                '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
                '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + arrTime + ' </div>  ' +
                '      </div> ' +
                '      <div class="row" style="background-color: #FFF5E2;">  ' +
                '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="sub_DepartureDate"> ' + depDate + ' </div>    ' +
                '          <div class="col-33 center-text font-size-14 trip-summary-labels1" id="Summary_Duration"> ' + duration + '  </div>      ' +
                '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="Summary_ArrivalDate"> ' + arrDate + '  </div>  ' +
                '      </div> ' +
                '  </div> </li> ';


        }
        // }
        $$("#list-OutgoingTrips").html(tripsString);
        if (x != "OneWay") {
            //get trip return Journy full information
            var retJournyInfo = GetLocalDataObject("retJournyFullData");
            var catagoryID2 = GetLocalData("selectedPriceDiv2");
            tripsString = "";
            for (var i = 0; i < retJournyInfo.Trips.length; i++) {
                var tripInfo = retJournyInfo.Trips[i];
                if (tripInfo.FeeInfo[catagoryID2].IsRefundable == true) {
                    iconDivRefund = GetResourceText("trueIcon");
                    if (tripInfo.FeeInfo[catagoryID2].IsRefundableWithfees == true)
                        RefundText = IsRefundWithFees;
                    else
                        RefundText = IsRefund;

                } else if (tripInfo.FeeInfo[catagoryID2].IsRefundable == false) {
                    iconDivRefund = GetResourceText("falseIcon");
                    RefundText = NotRefundable;
                }
                if (tripInfo.FeeInfo[catagoryID2].IsTransferable == true) {
                    iconDivTrans = GetResourceText("trueIcon");
                    if (tripInfo.FeeInfo[catagoryID2].IsTransferableWithfees == true)
                        TransText = IsTransWithFees;
                    else
                        TransText = IsTrans;
                } else if (tripInfo.FeeInfo[catagoryID2].IsTransferable == false) {
                    iconDivTrans = GetResourceText("falseIcon");
                    TransText = NotTransfarable;
                }
                tripsString = tripsString +
                    '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px;">      ' +
                    '      <div class="row no-gutter" style="background-color: #FFF5E2;">              ' +
                    '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
                    GetResourceText("PassengerlblReturnTi") +
                    '          </div>              ' +
                    '      </div> ' +
                    '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
                    '          <div class="col-100">                ' +
                    '              <div class="row no-gutter">      ' +
                    '                  <div class="col-20">         ' +
                    '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
                    '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.DepartureStation.Name + '</h4></div>' +
                    '              </div>          ' +
                    '          </div>              ' +
                    '      </div> ' +
                    '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
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
                    '<div class="row" style="background-color: #FFF5E2;">' +
                    '        <div class="row col-50" >         ' +
                    '            <div class="col-30">' +
                    '              <h4  class="trip-summary-labels1 ' + iconDivRefund + '" id="iconDiv1" style="font-weight: 300;  font-stretch: condensed;"></h4>         ' +
                    '            </div>' +
                    '           <div class="col-70">' +
                    '              <h4  class="trip-summary-labels1" style="font-weight: 300;  font-stretch: condensed;">' + RefundText + '</h4>         ' +
                    '           </div>' +
                    '        </div>      ' +
                    '                  <div class="row col-50" >         ' +
                    '<div class="col-30" >' +
                    '                      <h4  class="trip-summary-labels1 ' + iconDivTrans + '" id="iconDiv2" style="font-weight: 300;  font-stretch: condensed;"></h4>         ' +
                    '</div>' +
                    '<div class="col-70">' +
                    '                      <h4  class="trip-summary-labels1" style="font-weight: 300;  font-stretch: condensed;">' + TransText + '</h4>         ' +
                    '</div>' +
                    '                  </div>      ' +
                    '</div>' +
                    '<hr style="margin-top: 0.005%;margin-bottom: -8px">' +
                    '      <div class="row" style="background-color: #FFF5E2 !important; margin-top: 2%">       ' +
                    '          <div class="col-100 center-text" style="background-color:#FFF5E1 !important;">    ' +
                    '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img trip-summary-bus-img ' + direction + ' " /> ' +
                    '          </div>              ' +
                    '      </div> ' +
                    '      <div class="row" style="background-color: #FFF5E2;">       ' +
                    '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + tripInfo.DepartureTime + '  </div>' +
                    '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
                    '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + tripInfo.ArrivalTime + ' </div>  ' +
                    '      </div> ' +
                    '      <div class="row" style="background-color: #FFF5E2;">  ' +
                    '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="sub_DepartureDate"> ' + tripInfo.DepartureDate + ' </div>    ' +
                    '          <div class="col-33 center-text font-size-14 trip-summary-labels1" id="Summary_Duration"> ' + tripInfo.Duration + '  </div>      ' +
                    '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="Summary_ArrivalDate"> ' + tripInfo.ArrivalDate + '  </div>  ' +
                    '      </div> ' +
                    '  </div> </li> '
            }
            $$("#list-Return").html(tripsString);
        }

    }
    $$("#btn-continue").on("click", function () {
        mainView.router.load({
            url: 'PassengersInfo.html'
        });
    });
})
;

/************************Reservation summary *****************************/
myApp.onPageInit('tripsummry', function (page) {
    //check the type of the trip and update the form based on the value
    if (logo == 1) {
        $$("#Rlogo7").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 52px;height:33px">');
        $$("#logoTitle7").addClass("blue-logo");
    } else {
        $$("#Rlogo7").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -4px">');
        $$("#logoTitle7").addClass("orange-color");

    }
    var direction = "";
    if (GetApplicationLanguage() == "ar") {
        direction = GetResourceText("classArabic");
    }
    var journyInfo = GetLocalDataObject("OutJournyFullData");
    var tripsString = "";
    for (var i = 0; i < journyInfo.Trips.length; i++) {
        var tripInfo = journyInfo.Trips[i];
        tripsString = tripsString +
            '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px; background-color: #FFF5E1;">      ' +
            '      <div class="row no-gutter" style="background-color: #FFF5E2;">              ' +
            '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
            GetResourceText("PassengerlblGoingTicket") +
            '          </div>              ' +
            '      </div> ' +
            '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
            '          <div class="col-100">                ' +
            '              <div class="row no-gutter">      ' +
            '                  <div class="col-20">         ' +
            '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
            '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.DepartureStation.Name + '</h4></div>' +
            '              </div>          ' +
            '          </div>              ' +
            '      </div> ' +
            '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
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
            '      <div class="row" style="background-color: #FFF5E2 !important;">         ' +
            '          <div class="col-100 center-text" style="background-color: #FFF5E1 !important;">    ' +
            '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img trip-summary-bus-img ' + direction + ' " /> ' +
            '          </div>              ' +
            '      </div> ' +
            '      <div class="row" style="background-color: #FFF5E2;">       ' +
            '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + tripInfo.DepartureTime + '  </div>' +
            '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
            '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + tripInfo.ArrivalTime + ' </div>  ' +
            '      </div> ' +
            '      <div class="row" style="background-color: #FFF5E2;">  ' +
            '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="sub_DepartureDate"> ' + tripInfo.DepartureDate + ' </div>    ' +
            '          <div class="col-33 center-text font-size-14 trip-summary-labels1" id="Summary_Duration"> ' + tripInfo.Duration + '  </div>      ' +
            '          <div class="col-33 center-text  font-size-14 trip-summary-labels1" id="Summary_ArrivalDate"> ' + tripInfo.ArrivalDate + '  </div>  ' +
            '      </div> ' +
            '  </div> </li> '
    }
    $$("#list-OutgoingTrips").html(tripsString);

    if (GetLocalData("ReservationType") != "OneWay") {
        //get trip return Journy full information

        var retJournyInfo = GetLocalDataObject("retJournyFullData");

        tripsString = "";
        for (var i = 0; i < retJournyInfo.Trips.length; i++) {
            var tripInfo = retJournyInfo.Trips[i];
            tripsString = tripsString +
                '  <li><div class="DepartureContainerDiv container-box-shaddow content-container bottom-curve" id="GoingDataContainer" style="margin-bottom: 18px;">      ' +
                '      <div class="row no-gutter">              ' +
                '          <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 18px !important; font-stretch: condensed;">        ' +
                GetResourceText("PassengerlblReturnTi") +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
                '          <div class="col-100">                ' +
                '              <div class="row no-gutter">      ' +
                '                  <div class="col-20">         ' +
                '                  <h5 id="lblFrom" class="trip-summary-labels1" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblFrom1") + '</h5></div> ' +
                '                  <div class="col-80 "><h4 id="DepartureStation_Name" class="trip-summary-labels2 " style="font-weight: 300;  font-stretch: condensed;">' + tripInfo.DepartureStation.Name + '</h4></div>' +
                '              </div>          ' +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="summary-section row" style="background-color: #FFF5E2;">        ' +
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
                '      <div class="row" style="background-color: #FFF5E1 !important;">       ' +
                '          <div class="col-100 center-text" style="background-color: #FFF5E1 !important;">    ' +
                '              <img src="img/goingbus.png" alt="Trip" class="trip-go-img trip-summary-bus-img ' + direction + ' " /> ' +
                '          </div>              ' +
                '      </div> ' +
                '      <div class="row" style="background-color: #FFF5E2;">       ' +
                '          <div class="col-33 center-text font-size-14 trip-summary-labels2" id="Summary_DepartureTime"> ' + tripInfo.DepartureTime + '  </div>' +
                '          <div class="col-33 center-text" id="durationLbl">' + GetResourceText("PassengerlblDuration") + ' </div>  ' +
                '          <div class="col-33 center-text font-size-14  trip-summary-labels2" id="Summary_ArrivalTime"> ' + tripInfo.ArrivalTime + ' </div>  ' +
                '      </div> ' +
                '      <div class="row" style="background-color: #FFF5E2;">  ' +
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
    var seatExist = GetLocalDataObject("seatExist");
    var ticketDetails;
    if (seatExist == "yes")
        ticketDetails = GetResourceText("ticketDetails");
    else
        ticketDetails = GetResourceText("noSeat");
    var amount = data.Results.TotalPrice;
    if (data.Results.Tickets.length > 0) {
        var ticketsData = data.Results.Tickets;
        var TicketsSelect = [];

        for (i = 0; i < ticketsData.length; i++) {
            var viewItem =
                {
                    Amount: 0,
                    PassengerName: ticketsData[i].PassengerName,
                    PassengerID: ticketsData[i].PassengerID
                };

            var queryResult = JSLINQ(TicketsSelect).Where(function (item) {
                return (item.PassengerID == ticketsData[i].PassengerID);
            });

            var sumQuery = JSLINQ(ticketsData).Where(function (item) {
                return (item.PassengerID == ticketsData[i].PassengerID);
            });
            var sum = 0;

            for (var z = 0; z < sumQuery.items.length; z++) {
                sum += sumQuery.items[z].Amount;
            }


            if (queryResult.items.length == 0) {
                TicketsSelect.push(viewItem);
            }
            TicketsSelect[(TicketsSelect.length - 1)].Amount = sum;
        }

        $$("#summaryTotalPrice").html(amount);
        var myList = myApp.virtualList('#PassengersList', {
            // Array with items data
            items: TicketsSelect,
            // Custom render function to render item's HTML
            renderItem: function (index, item) {
                //amount = item.Amount * tax / 100 + item.Amount;
                return '<div class="row summary-section clickablePassenger" data-itemIndex ="' + index + '"  style="background-color: #FFF5E2;"> ' +
                    '<div class="col-30 summary-pass-name">' + item.PassengerName + '</div> ' +
                    '<div class="col-40 color-s-orange bold" style="margin-top:12px; margin-left:5px ">' + ticketDetails + '</div> ' +
                    '<div class="col-15 summary-pass-amount">' + item.Amount + sarText + '</div> ' +
                    '<div class="col-15"><img src="img/arrow_right.svg" style="    width: 18px;" alt=">"  class="summary-pass-img ' + imgArClassName + '"/></div>  ' +
                    '</div>';
            }
        });
    }

    $$('#btnGoToPayemnt').on('click', function () {
        myApp.modal({
            title: GetResourceText('alert'),
            text: GetResourceText("lblagree"),
            buttons: [
                {
                    text: GetResourceText('Agree'),
                    onClick: function () {
                        mainView.router.load({
                            url: 'paymentoptions.html'
                        });
                    }
                },
                {
                    text: GetResourceText('lblTirmsMessage'),
                    onClick: function () {
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
    var tempDist = distinations;
    $$('#PassengersList').on('click', '.clickablePassenger', function () {
        var tripType = GetLocalData("ReservationType");
        var tripMulti = GetLocalData("TypeMulti");
        if (tripType == "OneWay" && tripMulti == "null") {
            var ticketIndex = Number($$(this).data('itemIndex'));
            var selectedTicket = data.Results.Tickets[ticketIndex];
            SaveLocalObject("ticketIndex", ticketIndex);
            var passengersquery = JSLINQ(data.Results.Tickets).Where(function (item) {
                return (item.PassengerID == selectedTicket.PassengerID);
            });
            if (prevSeatNumber == -1) {
                SaveLocalObject("PassengerTicketViewData", passengersquery.items);
            } else {
                passengersquery.items[0].SeatNumber = data.Results.Tickets[ticketIndex].SeatNumber;
                SaveLocalObject("PassengerTicketViewData", passengersquery.items);
            }
            mainView.router.load({url: 'Passengers.html'});
        } else if (tripType == "Round") {
            var ticketIndex = Number($$(this).data('itemIndex'));
            var selectedTicket = data.Results.Tickets[ticketIndex];
            SaveLocalObject("ticketIndex", ticketIndex);
            var passengersquery = JSLINQ(data.Results.Tickets).Where(function (item) {
                return (item.PassengerID == selectedTicket.PassengerID);
            });
            if (prevSeatNumber == -1) {
                SaveLocalObject("PassengerTicketViewData", passengersquery.items);
            } else {
                SaveLocalObject("PassengerTicketViewData", passengersquery.items);
            }
            mainView.router.load({url: 'Passengers.html'});
        } else if (GetLocalData("TypeMulti") == "Multiple") {
            var ticketIndex = Number($$(this).data('itemIndex'));
            var tempArray = [];
            if (ticketIndex == 0) {
                for (var i = 0; i < distinations; i++) {
                    tempArray[i] = data.Results.Tickets[i];
                }
            } else {
                tempDist = distinations * ticketIndex;
                for (var i = 0; i < distinations; i++) {
                    tempArray[i] = data.Results.Tickets[tempDist++];
                }
            }
            var selectedTicket = data.Results.Tickets[ticketIndex];
            SaveLocalObject("ticketIndex", ticketIndex);
            // var passengersquery = JSLINQ(data.Results.Tickets).Where(function (item) { return (item.PassengerID == selectedTicket.PassengerID); });
            if (prevSeatNumber == -1) {
                SaveLocalObject("PassengerTicketViewData", tempArray);

            } else {
                SaveLocalObject("PassengerTicketViewData", tempArray);
            }
            mainView.router.load({url: 'Passengers.html'});

        }
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
    var bootstrapCode='*/:root{--blue:#007bff;--indigo:#6610f2;--purple:#6f42c1;--pink:#e83e8c;--red:#dc3545;--orange:#fd7e14;--yellow:#ffc107;--green:#28a745;--teal:#20c997;--cyan:#17a2b8;--white:#fff;--gray:#6c757d;--gray-dark:#343a40;--primary:#007bff;--secondary:#6c757d;--success:#28a745;--info:#17a2b8;--warning:#ffc107;--danger:#dc3545;--light:#f8f9fa;--dark:#343a40;--breakpoint-xs:0;--breakpoint-sm:576px;--breakpoint-md:768px;--breakpoint-lg:992px;--breakpoint-xl:1200px;--font-family-sans-serif:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-family-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}*,::after,::before{box-sizing:border-box}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-size:1rem;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}[tabindex="-1"]:focus{outline:0!important}hr{box-sizing:content-box;height:0;overflow:visible}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:.5rem}p{margin-top:0;margin-bottom:1rem}abbr[data-original-title],abbr[title]{text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted;cursor:help;border-bottom:0;-webkit-text-decoration-skip-ink:none;text-decoration-skip-ink:none}address{margin-bottom:1rem;font-style:normal;line-height:inherit}dl,ol,ul{margin-top:0;margin-bottom:1rem}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}dt{font-weight:700}dd{margin-bottom:.5rem;margin-left:0}blockquote{margin:0 0 1rem}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}a{color:#007bff;text-decoration:none;background-color:transparent}a:hover{color:#0056b3;text-decoration:underline}a:not([href]):not([tabindex]){color:inherit;text-decoration:none}a:not([href]):not([tabindex]):focus,a:not([href]):not([tabindex]):hover{color:inherit;text-decoration:none}a:not([href]):not([tabindex]):focus{outline:0}code,kbd,pre,samp{font-family:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}pre{margin-top:0;margin-bottom:1rem;overflow:auto}figure{margin:0 0 1rem}img{vertical-align:middle;border-style:none}svg{overflow:hidden;vertical-align:middle}table{border-collapse:collapse}caption{padding-top:.75rem;padding-bottom:.75rem;color:#6c757d;text-align:left;caption-side:bottom}th{text-align:inherit}label{display:inline-block;margin-bottom:.5rem}button{border-radius:0}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}button,input,optgroup,select,textarea{margin:0;font-family:inherit;font-size:inherit;line-height:inherit}button,input{overflow:visible}button,select{text-transform:none}select{word-wrap:normal}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]:not(:disabled),[type=reset]:not(:disabled),[type=submit]:not(:disabled),button:not(:disabled){cursor:pointer}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{padding:0;border-style:none}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=date],input[type=datetime-local],input[type=month],input[type=time]{-webkit-appearance:listbox}textarea{overflow:auto;resize:vertical}fieldset{min-width:0;padding:0;margin:0;border:0}legend{display:block;width:100%;max-width:100%;padding:0;margin-bottom:.5rem;font-size:1.5rem;line-height:inherit;color:inherit;white-space:normal}progress{vertical-align:baseline}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{outline-offset:-2px;-webkit-appearance:none}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button}output{display:inline-block}summary{display:list-item;cursor:pointer}template{display:none}[hidden]{display:none!important}.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{margin-bottom:.5rem;font-weight:500;line-height:1.2}.h1,h1{font-size:2.5rem}.h2,h2{font-size:2rem}.h3,h3{font-size:1.75rem}.h4,h4{font-size:1.5rem}.h5,h5{font-size:1.25rem}.h6,h6{font-size:1rem}.lead{font-size:1.25rem;font-weight:300}.display-1{font-size:6rem;font-weight:300;line-height:1.2}.display-2{font-size:5.5rem;font-weight:300;line-height:1.2}.display-3{font-size:4.5rem;font-weight:300;line-height:1.2}.display-4{font-size:3.5rem;font-weight:300;line-height:1.2}hr{margin-top:1rem;margin-bottom:1rem;border:0;border-top:1px solid rgba(0,0,0,.1)}.small,small{font-size:80%;font-weight:400}.mark,mark{padding:.2em;background-color:#fcf8e3}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;list-style:none}.list-inline-item{display:inline-block}.list-inline-item:not(:last-child){margin-right:.5rem}.initialism{font-size:90%;text-transform:uppercase}.blockquote{margin-bottom:1rem;font-size:1.25rem}.blockquote-footer{display:block;font-size:80%;color:#6c757d}.blockquote-footer::before{content:"\\2014\\00A0"}.img-fluid{max-width:100%;height:auto}.img-thumbnail{padding:.25rem;background-color:#fff;border:1px solid #dee2e6;border-radius:.25rem;max-width:100%;height:auto}.figure{display:inline-block}.figure-img{margin-bottom:.5rem;line-height:1}.figure-caption{font-size:90%;color:#6c757d}code{font-size:87.5%;color:#e83e8c;word-break:break-word}a>code{color:inherit}kbd{padding:.2rem .4rem;font-size:87.5%;color:#fff;background-color:#212529;border-radius:.2rem}kbd kbd{padding:0;font-size:100%;font-weight:700}pre{display:block;font-size:87.5%;color:#212529}pre code{font-size:inherit;color:inherit;word-break:normal}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width:576px){.container{max-width:540px}}@media (min-width:768px){.container{max-width:720px}}@media (min-width:992px){.container{max-width:960px}}@media (min-width:1200px){.container{max-width:1140px}}.container-fluid{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}.row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px}.no-gutters{margin-right:0;margin-left:0}.no-gutters>.col,.no-gutters>[class*=col-]{padding-right:0;padding-left:0}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;padding-right:15px;padding-left:15px}.col{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.col-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-first{-ms-flex-order:-1;order:-1}.order-last{-ms-flex-order:13;order:13}.order-0{-ms-flex-order:0;order:0}.order-1{-ms-flex-order:1;order:1}.order-2{-ms-flex-order:2;order:2}.order-3{-ms-flex-order:3;order:3}.order-4{-ms-flex-order:4;order:4}.order-5{-ms-flex-order:5;order:5}.order-6{-ms-flex-order:6;order:6}.order-7{-ms-flex-order:7;order:7}.order-8{-ms-flex-order:8;order:8}.order-9{-ms-flex-order:9;order:9}.order-10{-ms-flex-order:10;order:10}.order-11{-ms-flex-order:11;order:11}.order-12{-ms-flex-order:12;order:12}.offset-1{margin-left:8.333333%}.offset-2{margin-left:16.666667%}.offset-3{margin-left:25%}.offset-4{margin-left:33.333333%}.offset-5{margin-left:41.666667%}.offset-6{margin-left:50%}.offset-7{margin-left:58.333333%}.offset-8{margin-left:66.666667%}.offset-9{margin-left:75%}.offset-10{margin-left:83.333333%}.offset-11{margin-left:91.666667%}@media (min-width:576px){.col-sm{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.col-sm-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-sm-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-sm-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-sm-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-sm-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-sm-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-sm-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-sm-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-sm-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-sm-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-sm-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-sm-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-sm-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-sm-first{-ms-flex-order:-1;order:-1}.order-sm-last{-ms-flex-order:13;order:13}.order-sm-0{-ms-flex-order:0;order:0}.order-sm-1{-ms-flex-order:1;order:1}.order-sm-2{-ms-flex-order:2;order:2}.order-sm-3{-ms-flex-order:3;order:3}.order-sm-4{-ms-flex-order:4;order:4}.order-sm-5{-ms-flex-order:5;order:5}.order-sm-6{-ms-flex-order:6;order:6}.order-sm-7{-ms-flex-order:7;order:7}.order-sm-8{-ms-flex-order:8;order:8}.order-sm-9{-ms-flex-order:9;order:9}.order-sm-10{-ms-flex-order:10;order:10}.order-sm-11{-ms-flex-order:11;order:11}.order-sm-12{-ms-flex-order:12;order:12}.offset-sm-0{margin-left:0}.offset-sm-1{margin-left:8.333333%}.offset-sm-2{margin-left:16.666667%}.offset-sm-3{margin-left:25%}.offset-sm-4{margin-left:33.333333%}.offset-sm-5{margin-left:41.666667%}.offset-sm-6{margin-left:50%}.offset-sm-7{margin-left:58.333333%}.offset-sm-8{margin-left:66.666667%}.offset-sm-9{margin-left:75%}.offset-sm-10{margin-left:83.333333%}.offset-sm-11{margin-left:91.666667%}}@media (min-width:768px){.col-md{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.col-md-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-md-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-md-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-md-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-md-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-md-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-md-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-md-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-md-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-md-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-md-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-md-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-md-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-md-first{-ms-flex-order:-1;order:-1}.order-md-last{-ms-flex-order:13;order:13}.order-md-0{-ms-flex-order:0;order:0}.order-md-1{-ms-flex-order:1;order:1}.order-md-2{-ms-flex-order:2;order:2}.order-md-3{-ms-flex-order:3;order:3}.order-md-4{-ms-flex-order:4;order:4}.order-md-5{-ms-flex-order:5;order:5}.order-md-6{-ms-flex-order:6;order:6}.order-md-7{-ms-flex-order:7;order:7}.order-md-8{-ms-flex-order:8;order:8}.order-md-9{-ms-flex-order:9;order:9}.order-md-10{-ms-flex-order:10;order:10}.order-md-11{-ms-flex-order:11;order:11}.order-md-12{-ms-flex-order:12;order:12}.offset-md-0{margin-left:0}.offset-md-1{margin-left:8.333333%}.offset-md-2{margin-left:16.666667%}.offset-md-3{margin-left:25%}.offset-md-4{margin-left:33.333333%}.offset-md-5{margin-left:41.666667%}.offset-md-6{margin-left:50%}.offset-md-7{margin-left:58.333333%}.offset-md-8{margin-left:66.666667%}.offset-md-9{margin-left:75%}.offset-md-10{margin-left:83.333333%}.offset-md-11{margin-left:91.666667%}}@media (min-width:992px){.col-lg{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.col-lg-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-lg-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-lg-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-lg-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-lg-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-lg-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-lg-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-lg-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-lg-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-lg-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-lg-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-lg-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-lg-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-lg-first{-ms-flex-order:-1;order:-1}.order-lg-last{-ms-flex-order:13;order:13}.order-lg-0{-ms-flex-order:0;order:0}.order-lg-1{-ms-flex-order:1;order:1}.order-lg-2{-ms-flex-order:2;order:2}.order-lg-3{-ms-flex-order:3;order:3}.order-lg-4{-ms-flex-order:4;order:4}.order-lg-5{-ms-flex-order:5;order:5}.order-lg-6{-ms-flex-order:6;order:6}.order-lg-7{-ms-flex-order:7;order:7}.order-lg-8{-ms-flex-order:8;order:8}.order-lg-9{-ms-flex-order:9;order:9}.order-lg-10{-ms-flex-order:10;order:10}.order-lg-11{-ms-flex-order:11;order:11}.order-lg-12{-ms-flex-order:12;order:12}.offset-lg-0{margin-left:0}.offset-lg-1{margin-left:8.333333%}.offset-lg-2{margin-left:16.666667%}.offset-lg-3{margin-left:25%}.offset-lg-4{margin-left:33.333333%}.offset-lg-5{margin-left:41.666667%}.offset-lg-6{margin-left:50%}.offset-lg-7{margin-left:58.333333%}.offset-lg-8{margin-left:66.666667%}.offset-lg-9{margin-left:75%}.offset-lg-10{margin-left:83.333333%}.offset-lg-11{margin-left:91.666667%}}@media (min-width:1200px){.col-xl{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.col-xl-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-xl-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-xl-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-xl-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-xl-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-xl-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-xl-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-xl-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-xl-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-xl-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-xl-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-xl-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-xl-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-xl-first{-ms-flex-order:-1;order:-1}.order-xl-last{-ms-flex-order:13;order:13}.order-xl-0{-ms-flex-order:0;order:0}.order-xl-1{-ms-flex-order:1;order:1}.order-xl-2{-ms-flex-order:2;order:2}.order-xl-3{-ms-flex-order:3;order:3}.order-xl-4{-ms-flex-order:4;order:4}.order-xl-5{-ms-flex-order:5;order:5}.order-xl-6{-ms-flex-order:6;order:6}.order-xl-7{-ms-flex-order:7;order:7}.order-xl-8{-ms-flex-order:8;order:8}.order-xl-9{-ms-flex-order:9;order:9}.order-xl-10{-ms-flex-order:10;order:10}.order-xl-11{-ms-flex-order:11;order:11}.order-xl-12{-ms-flex-order:12;order:12}.offset-xl-0{margin-left:0}.offset-xl-1{margin-left:8.333333%}.offset-xl-2{margin-left:16.666667%}.offset-xl-3{margin-left:25%}.offset-xl-4{margin-left:33.333333%}.offset-xl-5{margin-left:41.666667%}.offset-xl-6{margin-left:50%}.offset-xl-7{margin-left:58.333333%}.offset-xl-8{margin-left:66.666667%}.offset-xl-9{margin-left:75%}.offset-xl-10{margin-left:83.333333%}.offset-xl-11{margin-left:91.666667%}}.table{width:100%;margin-bottom:1rem;color:#212529}.table td,.table th{padding:.75rem;vertical-align:top;border-top:1px solid #dee2e6}.table thead th{vertical-align:bottom;border-bottom:2px solid #dee2e6}.table tbody+tbody{border-top:2px solid #dee2e6}.table-sm td,.table-sm th{padding:.3rem}.table-bordered{border:1px solid #dee2e6}.table-bordered td,.table-bordered th{border:1px solid #dee2e6}.table-bordered thead td,.table-bordered thead th{border-bottom-width:2px}.table-borderless tbody+tbody,.table-borderless td,.table-borderless th,.table-borderless thead th{border:0}.table-striped tbody tr:nth-of-type(odd){background-color:rgba(0,0,0,.05)}.table-hover tbody tr:hover{color:#212529;background-color:rgba(0,0,0,.075)}.table-primary,.table-primary>td,.table-primary>th{background-color:#b8daff}.table-primary tbody+tbody,.table-primary td,.table-primary th,.table-primary thead th{border-color:#7abaff}.table-hover .table-primary:hover{background-color:#9fcdff}.table-hover .table-primary:hover>td,.table-hover .table-primary:hover>th{background-color:#9fcdff}.table-secondary,.table-secondary>td,.table-secondary>th{background-color:#d6d8db}.table-secondary tbody+tbody,.table-secondary td,.table-secondary th,.table-secondary thead th{border-color:#b3b7bb}.table-hover .table-secondary:hover{background-color:#c8cbcf}.table-hover .table-secondary:hover>td,.table-hover .table-secondary:hover>th{background-color:#c8cbcf}.table-success,.table-success>td,.table-success>th{background-color:#c3e6cb}.table-success tbody+tbody,.table-success td,.table-success th,.table-success thead th{border-color:#8fd19e}.table-hover .table-success:hover{background-color:#b1dfbb}.table-hover .table-success:hover>td,.table-hover .table-success:hover>th{background-color:#b1dfbb}.table-info,.table-info>td,.table-info>th{background-color:#bee5eb}.table-info tbody+tbody,.table-info td,.table-info th,.table-info thead th{border-color:#86cfda}.table-hover .table-info:hover{background-color:#abdde5}.table-hover .table-info:hover>td,.table-hover .table-info:hover>th{background-color:#abdde5}.table-warning,.table-warning>td,.table-warning>th{background-color:#ffeeba}.table-warning tbody+tbody,.table-warning td,.table-warning th,.table-warning thead th{border-color:#ffdf7e}.table-hover .table-warning:hover{background-color:#ffe8a1}.table-hover .table-warning:hover>td,.table-hover .table-warning:hover>th{background-color:#ffe8a1}.table-danger,.table-danger>td,.table-danger>th{background-color:#f5c6cb}.table-danger tbody+tbody,.table-danger td,.table-danger th,.table-danger thead th{border-color:#ed969e}.table-hover .table-danger:hover{background-color:#f1b0b7}.table-hover .table-danger:hover>td,.table-hover .table-danger:hover>th{background-color:#f1b0b7}.table-light,.table-light>td,.table-light>th{background-color:#fdfdfe}.table-light tbody+tbody,.table-light td,.table-light th,.table-light thead th{border-color:#fbfcfc}.table-hover .table-light:hover{background-color:#ececf6}.table-hover .table-light:hover>td,.table-hover .table-light:hover>th{background-color:#ececf6}.table-dark,.table-dark>td,.table-dark>th{background-color:#c6c8ca}.table-dark tbody+tbody,.table-dark td,.table-dark th,.table-dark thead th{border-color:#95999c}.table-hover .table-dark:hover{background-color:#b9bbbe}.table-hover .table-dark:hover>td,.table-hover .table-dark:hover>th{background-color:#b9bbbe}.table-active,.table-active>td,.table-active>th{background-color:rgba(0,0,0,.075)}.table-hover .table-active:hover{background-color:rgba(0,0,0,.075)}.table-hover .table-active:hover>td,.table-hover .table-active:hover>th{background-color:rgba(0,0,0,.075)}.table .thead-dark th{color:#fff;background-color:#343a40;border-color:#454d55}.table .thead-light th{color:#495057;background-color:#e9ecef;border-color:#dee2e6}.table-dark{color:#fff;background-color:#343a40}.table-dark td,.table-dark th,.table-dark thead th{border-color:#454d55}.table-dark.table-bordered{border:0}.table-dark.table-striped tbody tr:nth-of-type(odd){background-color:rgba(255,255,255,.05)}.table-dark.table-hover tbody tr:hover{color:#fff;background-color:rgba(255,255,255,.075)}@media (max-width:575.98px){.table-responsive-sm{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-sm>.table-bordered{border:0}}@media (max-width:767.98px){.table-responsive-md{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-md>.table-bordered{border:0}}@media (max-width:991.98px){.table-responsive-lg{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-lg>.table-bordered{border:0}}@media (max-width:1199.98px){.table-responsive-xl{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-xl>.table-bordered{border:0}}.table-responsive{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive>.table-bordered{border:0}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.form-control{transition:none}}.form-control::-ms-expand{background-color:transparent;border:0}.form-control:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.form-control::-webkit-input-placeholder{color:#6c757d;opacity:1}.form-control::-moz-placeholder{color:#6c757d;opacity:1}.form-control:-ms-input-placeholder{color:#6c757d;opacity:1}.form-control::-ms-input-placeholder{color:#6c757d;opacity:1}.form-control::placeholder{color:#6c757d;opacity:1}.form-control:disabled,.form-control[readonly]{background-color:#e9ecef;opacity:1}select.form-control:focus::-ms-value{color:#495057;background-color:#fff}.form-control-file,.form-control-range{display:block;width:100%}.col-form-label{padding-top:calc(.375rem + 1px);padding-bottom:calc(.375rem + 1px);margin-bottom:0;font-size:inherit;line-height:1.5}.col-form-label-lg{padding-top:calc(.5rem + 1px);padding-bottom:calc(.5rem + 1px);font-size:1.25rem;line-height:1.5}.col-form-label-sm{padding-top:calc(.25rem + 1px);padding-bottom:calc(.25rem + 1px);font-size:.875rem;line-height:1.5}.form-control-plaintext{display:block;width:100%;padding-top:.375rem;padding-bottom:.375rem;margin-bottom:0;line-height:1.5;color:#212529;background-color:transparent;border:solid transparent;border-width:1px 0}.form-control-plaintext.form-control-lg,.form-control-plaintext.form-control-sm{padding-right:0;padding-left:0}.form-control-sm{height:calc(1.5em + .5rem + 2px);padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.form-control-lg{height:calc(1.5em + 1rem + 2px);padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}select.form-control[multiple],select.form-control[size]{height:auto}textarea.form-control{height:auto}.form-group{margin-bottom:1rem}.form-text{display:block;margin-top:.25rem}.form-row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-5px;margin-left:-5px}.form-row>.col,.form-row>[class*=col-]{padding-right:5px;padding-left:5px}.form-check{position:relative;display:block;padding-left:1.25rem}.form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.form-check-input:disabled~.form-check-label{color:#6c757d}.form-check-label{margin-bottom:0}.form-check-inline{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;padding-left:0;margin-right:.75rem}.form-check-inline .form-check-input{position:static;margin-top:0;margin-right:.3125rem;margin-left:0}.valid-feedback{display:none;width:100%;margin-top:.25rem;font-size:80%;color:#28a745}.valid-tooltip{position:absolute;top:100%;z-index:5;display:none;max-width:100%;padding:.25rem .5rem;margin-top:.1rem;font-size:.875rem;line-height:1.5;color:#fff;background-color:rgba(40,167,69,.9);border-radius:.25rem}.form-control.is-valid,.was-validated .form-control:valid{border-color:#28a745;padding-right:calc(1.5em + .75rem);background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 8 8\'%3e%3cpath fill=\'%2328a745\' d=\'M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z\'/%3e%3c/svg%3e");background-repeat:no-repeat;background-position:center right calc(.375em + .1875rem);background-size:calc(.75em + .375rem) calc(.75em + .375rem)}.form-control.is-valid:focus,.was-validated .form-control:valid:focus{border-color:#28a745;box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.form-control.is-valid~.valid-feedback,.form-control.is-valid~.valid-tooltip,.was-validated .form-control:valid~.valid-feedback,.was-validated .form-control:valid~.valid-tooltip{display:block}.was-validated textarea.form-control:valid,textarea.form-control.is-valid{padding-right:calc(1.5em + .75rem);background-position:top calc(.375em + .1875rem) right calc(.375em + .1875rem)}.custom-select.is-valid,.was-validated .custom-select:valid{border-color:#28a745;padding-right:calc((1em + .75rem) * 3 / 4 + 1.75rem);background:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 5\'%3e%3cpath fill=\'%23343a40\' d=\'M2 0L0 2h4zm0 5L0 3h4z\'/%3e%3c/svg%3e") no-repeat right .75rem center/8px 10px,url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 8 8\'%3e%3cpath fill=\'%2328a745\' d=\'M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z\'/%3e%3c/svg%3e") #fff no-repeat center right 1.75rem/calc(.75em + .375rem) calc(.75em + .375rem)}.custom-select.is-valid:focus,.was-validated .custom-select:valid:focus{border-color:#28a745;box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.custom-select.is-valid~.valid-feedback,.custom-select.is-valid~.valid-tooltip,.was-validated .custom-select:valid~.valid-feedback,.was-validated .custom-select:valid~.valid-tooltip{display:block}.form-control-file.is-valid~.valid-feedback,.form-control-file.is-valid~.valid-tooltip,.was-validated .form-control-file:valid~.valid-feedback,.was-validated .form-control-file:valid~.valid-tooltip{display:block}.form-check-input.is-valid~.form-check-label,.was-validated .form-check-input:valid~.form-check-label{color:#28a745}.form-check-input.is-valid~.valid-feedback,.form-check-input.is-valid~.valid-tooltip,.was-validated .form-check-input:valid~.valid-feedback,.was-validated .form-check-input:valid~.valid-tooltip{display:block}.custom-control-input.is-valid~.custom-control-label,.was-validated .custom-control-input:valid~.custom-control-label{color:#28a745}.custom-control-input.is-valid~.custom-control-label::before,.was-validated .custom-control-input:valid~.custom-control-label::before{border-color:#28a745}.custom-control-input.is-valid~.valid-feedback,.custom-control-input.is-valid~.valid-tooltip,.was-validated .custom-control-input:valid~.valid-feedback,.was-validated .custom-control-input:valid~.valid-tooltip{display:block}.custom-control-input.is-valid:checked~.custom-control-label::before,.was-validated .custom-control-input:valid:checked~.custom-control-label::before{border-color:#34ce57;background-color:#34ce57}.custom-control-input.is-valid:focus~.custom-control-label::before,.was-validated .custom-control-input:valid:focus~.custom-control-label::before{box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.custom-control-input.is-valid:focus:not(:checked)~.custom-control-label::before,.was-validated .custom-control-input:valid:focus:not(:checked)~.custom-control-label::before{border-color:#28a745}.custom-file-input.is-valid~.custom-file-label,.was-validated .custom-file-input:valid~.custom-file-label{border-color:#28a745}.custom-file-input.is-valid~.valid-feedback,.custom-file-input.is-valid~.valid-tooltip,.was-validated .custom-file-input:valid~.valid-feedback,.was-validated .custom-file-input:valid~.valid-tooltip{display:block}.custom-file-input.is-valid:focus~.custom-file-label,.was-validated .custom-file-input:valid:focus~.custom-file-label{border-color:#28a745;box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.invalid-feedback{display:none;width:100%;margin-top:.25rem;font-size:80%;color:#dc3545}.invalid-tooltip{position:absolute;top:100%;z-index:5;display:none;max-width:100%;padding:.25rem .5rem;margin-top:.1rem;font-size:.875rem;line-height:1.5;color:#fff;background-color:rgba(220,53,69,.9);border-radius:.25rem}.form-control.is-invalid,.was-validated .form-control:invalid{border-color:#dc3545;padding-right:calc(1.5em + .75rem);background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23dc3545\' viewBox=\'-2 -2 7 7\'%3e%3cpath stroke=\'%23dc3545\' d=\'M0 0l3 3m0-3L0 3\'/%3e%3ccircle r=\'.5\'/%3e%3ccircle cx=\'3\' r=\'.5\'/%3e%3ccircle cy=\'3\' r=\'.5\'/%3e%3ccircle cx=\'3\' cy=\'3\' r=\'.5\'/%3e%3c/svg%3E");background-repeat:no-repeat;background-position:center right calc(.375em + .1875rem);background-size:calc(.75em + .375rem) calc(.75em + .375rem)}.form-control.is-invalid:focus,.was-validated .form-control:invalid:focus{border-color:#dc3545;box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.form-control.is-invalid~.invalid-feedback,.form-control.is-invalid~.invalid-tooltip,.was-validated .form-control:invalid~.invalid-feedback,.was-validated .form-control:invalid~.invalid-tooltip{display:block}.was-validated textarea.form-control:invalid,textarea.form-control.is-invalid{padding-right:calc(1.5em + .75rem);background-position:top calc(.375em + .1875rem) right calc(.375em + .1875rem)}.custom-select.is-invalid,.was-validated .custom-select:invalid{border-color:#dc3545;padding-right:calc((1em + .75rem) * 3 / 4 + 1.75rem);background:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 5\'%3e%3cpath fill=\'%23343a40\' d=\'M2 0L0 2h4zm0 5L0 3h4z\'/%3e%3c/svg%3e") no-repeat right .75rem center/8px 10px,url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23dc3545\' viewBox=\'-2 -2 7 7\'%3e%3cpath stroke=\'%23dc3545\' d=\'M0 0l3 3m0-3L0 3\'/%3e%3ccircle r=\'.5\'/%3e%3ccircle cx=\'3\' r=\'.5\'/%3e%3ccircle cy=\'3\' r=\'.5\'/%3e%3ccircle cx=\'3\' cy=\'3\' r=\'.5\'/%3e%3c/svg%3E") #fff no-repeat center right 1.75rem/calc(.75em + .375rem) calc(.75em + .375rem)}.custom-select.is-invalid:focus,.was-validated .custom-select:invalid:focus{border-color:#dc3545;box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.custom-select.is-invalid~.invalid-feedback,.custom-select.is-invalid~.invalid-tooltip,.was-validated .custom-select:invalid~.invalid-feedback,.was-validated .custom-select:invalid~.invalid-tooltip{display:block}.form-control-file.is-invalid~.invalid-feedback,.form-control-file.is-invalid~.invalid-tooltip,.was-validated .form-control-file:invalid~.invalid-feedback,.was-validated .form-control-file:invalid~.invalid-tooltip{display:block}.form-check-input.is-invalid~.form-check-label,.was-validated .form-check-input:invalid~.form-check-label{color:#dc3545}.form-check-input.is-invalid~.invalid-feedback,.form-check-input.is-invalid~.invalid-tooltip,.was-validated .form-check-input:invalid~.invalid-feedback,.was-validated .form-check-input:invalid~.invalid-tooltip{display:block}.custom-control-input.is-invalid~.custom-control-label,.was-validated .custom-control-input:invalid~.custom-control-label{color:#dc3545}.custom-control-input.is-invalid~.custom-control-label::before,.was-validated .custom-control-input:invalid~.custom-control-label::before{border-color:#dc3545}.custom-control-input.is-invalid~.invalid-feedback,.custom-control-input.is-invalid~.invalid-tooltip,.was-validated .custom-control-input:invalid~.invalid-feedback,.was-validated .custom-control-input:invalid~.invalid-tooltip{display:block}.custom-control-input.is-invalid:checked~.custom-control-label::before,.was-validated .custom-control-input:invalid:checked~.custom-control-label::before{border-color:#e4606d;background-color:#e4606d}.custom-control-input.is-invalid:focus~.custom-control-label::before,.was-validated .custom-control-input:invalid:focus~.custom-control-label::before{box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.custom-control-input.is-invalid:focus:not(:checked)~.custom-control-label::before,.was-validated .custom-control-input:invalid:focus:not(:checked)~.custom-control-label::before{border-color:#dc3545}.custom-file-input.is-invalid~.custom-file-label,.was-validated .custom-file-input:invalid~.custom-file-label{border-color:#dc3545}.custom-file-input.is-invalid~.invalid-feedback,.custom-file-input.is-invalid~.invalid-tooltip,.was-validated .custom-file-input:invalid~.invalid-feedback,.was-validated .custom-file-input:invalid~.invalid-tooltip{display:block}.custom-file-input.is-invalid:focus~.custom-file-label,.was-validated .custom-file-input:invalid:focus~.custom-file-label{border-color:#dc3545;box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.form-inline{display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap;-ms-flex-align:center;align-items:center}.form-inline .form-check{width:100%}@media (min-width:576px){.form-inline label{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;margin-bottom:0}.form-inline .form-group{display:-ms-flexbox;display:flex;-ms-flex:0 0 auto;flex:0 0 auto;-ms-flex-flow:row wrap;flex-flow:row wrap;-ms-flex-align:center;align-items:center;margin-bottom:0}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-plaintext{display:inline-block}.form-inline .custom-select,.form-inline .input-group{width:auto}.form-inline .form-check{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:auto;padding-left:0}.form-inline .form-check-input{position:relative;-ms-flex-negative:0;flex-shrink:0;margin-top:0;margin-right:.25rem;margin-left:0}.form-inline .custom-control{-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.form-inline .custom-control-label{margin-bottom:0}}.btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.btn{transition:none}}.btn:hover{color:#212529;text-decoration:none}.btn.focus,.btn:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.btn.disabled,.btn:disabled{opacity:.65}a.btn.disabled,fieldset:disabled a.btn{pointer-events:none}.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}.btn-primary.focus,.btn-primary:focus{box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-primary.disabled,.btn-primary:disabled{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:not(:disabled):not(.disabled).active,.btn-primary:not(:disabled):not(.disabled):active,.show>.btn-primary.dropdown-toggle{color:#fff;background-color:#0062cc;border-color:#005cbf}.btn-primary:not(:disabled):not(.disabled).active:focus,.btn-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}.btn-secondary.focus,.btn-secondary:focus{box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-secondary.disabled,.btn-secondary:disabled{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:not(:disabled):not(.disabled).active,.btn-secondary:not(:disabled):not(.disabled):active,.show>.btn-secondary.dropdown-toggle{color:#fff;background-color:#545b62;border-color:#4e555b}.btn-secondary:not(:disabled):not(.disabled).active:focus,.btn-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:hover{color:#fff;background-color:#218838;border-color:#1e7e34}.btn-success.focus,.btn-success:focus{box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-success.disabled,.btn-success:disabled{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:not(:disabled):not(.disabled).active,.btn-success:not(:disabled):not(.disabled):active,.show>.btn-success.dropdown-toggle{color:#fff;background-color:#1e7e34;border-color:#1c7430}.btn-success:not(:disabled):not(.disabled).active:focus,.btn-success:not(:disabled):not(.disabled):active:focus,.show>.btn-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-info{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:hover{color:#fff;background-color:#138496;border-color:#117a8b}.btn-info.focus,.btn-info:focus{box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-info.disabled,.btn-info:disabled{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:not(:disabled):not(.disabled).active,.btn-info:not(:disabled):not(.disabled):active,.show>.btn-info.dropdown-toggle{color:#fff;background-color:#117a8b;border-color:#10707f}.btn-info:not(:disabled):not(.disabled).active:focus,.btn-info:not(:disabled):not(.disabled):active:focus,.show>.btn-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-warning{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:hover{color:#212529;background-color:#e0a800;border-color:#d39e00}.btn-warning.focus,.btn-warning:focus{box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-warning.disabled,.btn-warning:disabled{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:not(:disabled):not(.disabled).active,.btn-warning:not(:disabled):not(.disabled):active,.show>.btn-warning.dropdown-toggle{color:#212529;background-color:#d39e00;border-color:#c69500}.btn-warning:not(:disabled):not(.disabled).active:focus,.btn-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-danger{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:hover{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-danger.focus,.btn-danger:focus{box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-danger.disabled,.btn-danger:disabled{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:not(:disabled):not(.disabled).active,.btn-danger:not(:disabled):not(.disabled):active,.show>.btn-danger.dropdown-toggle{color:#fff;background-color:#bd2130;border-color:#b21f2d}.btn-danger:not(:disabled):not(.disabled).active:focus,.btn-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-light{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:hover{color:#212529;background-color:#e2e6ea;border-color:#dae0e5}.btn-light.focus,.btn-light:focus{box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-light.disabled,.btn-light:disabled{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:not(:disabled):not(.disabled).active,.btn-light:not(:disabled):not(.disabled):active,.show>.btn-light.dropdown-toggle{color:#212529;background-color:#dae0e5;border-color:#d3d9df}.btn-light:not(:disabled):not(.disabled).active:focus,.btn-light:not(:disabled):not(.disabled):active:focus,.show>.btn-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-dark{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:hover{color:#fff;background-color:#23272b;border-color:#1d2124}.btn-dark.focus,.btn-dark:focus{box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-dark.disabled,.btn-dark:disabled{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:not(:disabled):not(.disabled).active,.btn-dark:not(:disabled):not(.disabled):active,.show>.btn-dark.dropdown-toggle{color:#fff;background-color:#1d2124;border-color:#171a1d}.btn-dark:not(:disabled):not(.disabled).active:focus,.btn-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-outline-primary{color:#007bff;border-color:#007bff}.btn-outline-primary:hover{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary.focus,.btn-outline-primary:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-primary.disabled,.btn-outline-primary:disabled{color:#007bff;background-color:transparent}.btn-outline-primary:not(:disabled):not(.disabled).active,.btn-outline-primary:not(:disabled):not(.disabled):active,.show>.btn-outline-primary.dropdown-toggle{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary:not(:disabled):not(.disabled).active:focus,.btn-outline-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-secondary{color:#6c757d;border-color:#6c757d}.btn-outline-secondary:hover{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary.focus,.btn-outline-secondary:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-secondary.disabled,.btn-outline-secondary:disabled{color:#6c757d;background-color:transparent}.btn-outline-secondary:not(:disabled):not(.disabled).active,.btn-outline-secondary:not(:disabled):not(.disabled):active,.show>.btn-outline-secondary.dropdown-toggle{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary:not(:disabled):not(.disabled).active:focus,.btn-outline-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-success{color:#28a745;border-color:#28a745}.btn-outline-success:hover{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success.focus,.btn-outline-success:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-success.disabled,.btn-outline-success:disabled{color:#28a745;background-color:transparent}.btn-outline-success:not(:disabled):not(.disabled).active,.btn-outline-success:not(:disabled):not(.disabled):active,.show>.btn-outline-success.dropdown-toggle{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success:not(:disabled):not(.disabled).active:focus,.btn-outline-success:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-info{color:#17a2b8;border-color:#17a2b8}.btn-outline-info:hover{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info.focus,.btn-outline-info:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-info.disabled,.btn-outline-info:disabled{color:#17a2b8;background-color:transparent}.btn-outline-info:not(:disabled):not(.disabled).active,.btn-outline-info:not(:disabled):not(.disabled):active,.show>.btn-outline-info.dropdown-toggle{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info:not(:disabled):not(.disabled).active:focus,.btn-outline-info:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-warning{color:#ffc107;border-color:#ffc107}.btn-outline-warning:hover{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning.focus,.btn-outline-warning:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-warning.disabled,.btn-outline-warning:disabled{color:#ffc107;background-color:transparent}.btn-outline-warning:not(:disabled):not(.disabled).active,.btn-outline-warning:not(:disabled):not(.disabled):active,.show>.btn-outline-warning.dropdown-toggle{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning:not(:disabled):not(.disabled).active:focus,.btn-outline-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-danger{color:#dc3545;border-color:#dc3545}.btn-outline-danger:hover{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger.focus,.btn-outline-danger:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-danger.disabled,.btn-outline-danger:disabled{color:#dc3545;background-color:transparent}.btn-outline-danger:not(:disabled):not(.disabled).active,.btn-outline-danger:not(:disabled):not(.disabled):active,.show>.btn-outline-danger.dropdown-toggle{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger:not(:disabled):not(.disabled).active:focus,.btn-outline-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-light{color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:hover{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light.focus,.btn-outline-light:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-light.disabled,.btn-outline-light:disabled{color:#f8f9fa;background-color:transparent}.btn-outline-light:not(:disabled):not(.disabled).active,.btn-outline-light:not(:disabled):not(.disabled):active,.show>.btn-outline-light.dropdown-toggle{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:not(:disabled):not(.disabled).active:focus,.btn-outline-light:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-dark{color:#343a40;border-color:#343a40}.btn-outline-dark:hover{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark.focus,.btn-outline-dark:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-outline-dark.disabled,.btn-outline-dark:disabled{color:#343a40;background-color:transparent}.btn-outline-dark:not(:disabled):not(.disabled).active,.btn-outline-dark:not(:disabled):not(.disabled):active,.show>.btn-outline-dark.dropdown-toggle{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark:not(:disabled):not(.disabled).active:focus,.btn-outline-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-link{font-weight:400;color:#007bff;text-decoration:none}.btn-link:hover{color:#0056b3;text-decoration:underline}.btn-link.focus,.btn-link:focus{text-decoration:underline;box-shadow:none}.btn-link.disabled,.btn-link:disabled{color:#6c757d;pointer-events:none}.btn-group-lg>.btn,.btn-lg{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.btn-group-sm>.btn,.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:.5rem}input[type=button].btn-block,input[type=reset].btn-block,input[type=submit].btn-block{width:100%}.fade{transition:opacity .15s linear}@media (prefers-reduced-motion:reduce){.fade{transition:none}}.fade:not(.show){opacity:0}.collapse:not(.show){display:none}.collapsing{position:relative;height:0;overflow:hidden;transition:height .35s ease}@media (prefers-reduced-motion:reduce){.collapsing{transition:none}}.dropdown,.dropleft,.dropright,.dropup{position:relative}.dropdown-toggle{white-space:nowrap}.dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:"";border-top:.3em solid;border-right:.3em solid transparent;border-bottom:0;border-left:.3em solid transparent}.dropdown-toggle:empty::after{margin-left:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:10rem;padding:.5rem 0;margin:.125rem 0 0;font-size:1rem;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:.25rem}.dropdown-menu-left{right:auto;left:0}.dropdown-menu-right{right:0;left:auto}@media (min-width:576px){.dropdown-menu-sm-left{right:auto;left:0}.dropdown-menu-sm-right{right:0;left:auto}}@media (min-width:768px){.dropdown-menu-md-left{right:auto;left:0}.dropdown-menu-md-right{right:0;left:auto}}@media (min-width:992px){.dropdown-menu-lg-left{right:auto;left:0}.dropdown-menu-lg-right{right:0;left:auto}}@media (min-width:1200px){.dropdown-menu-xl-left{right:auto;left:0}.dropdown-menu-xl-right{right:0;left:auto}}.dropup .dropdown-menu{top:auto;bottom:100%;margin-top:0;margin-bottom:.125rem}.dropup .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:"";border-top:0;border-right:.3em solid transparent;border-bottom:.3em solid;border-left:.3em solid transparent}.dropup .dropdown-toggle:empty::after{margin-left:0}.dropright .dropdown-menu{top:0;right:auto;left:100%;margin-top:0;margin-left:.125rem}.dropright .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:"";border-top:.3em solid transparent;border-right:0;border-bottom:.3em solid transparent;border-left:.3em solid}.dropright .dropdown-toggle:empty::after{margin-left:0}.dropright .dropdown-toggle::after{vertical-align:0}.dropleft .dropdown-menu{top:0;right:100%;left:auto;margin-top:0;margin-right:.125rem}.dropleft .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:""}.dropleft .dropdown-toggle::after{display:none}.dropleft .dropdown-toggle::before{display:inline-block;margin-right:.255em;vertical-align:.255em;content:"";border-top:.3em solid transparent;border-right:.3em solid;border-bottom:.3em solid transparent}.dropleft .dropdown-toggle:empty::after{margin-left:0}.dropleft .dropdown-toggle::before{vertical-align:0}.dropdown-menu[x-placement^=bottom],.dropdown-menu[x-placement^=left],.dropdown-menu[x-placement^=right],.dropdown-menu[x-placement^=top]{right:auto;bottom:auto}.dropdown-divider{height:0;margin:.5rem 0;overflow:hidden;border-top:1px solid #e9ecef}.dropdown-item{display:block;width:100%;padding:.25rem 1.5rem;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}.dropdown-item:focus,.dropdown-item:hover{color:#16181b;text-decoration:none;background-color:#f8f9fa}.dropdown-item.active,.dropdown-item:active{color:#fff;text-decoration:none;background-color:#007bff}.dropdown-item.disabled,.dropdown-item:disabled{color:#6c757d;pointer-events:none;background-color:transparent}.dropdown-menu.show{display:block}.dropdown-header{display:block;padding:.5rem 1.5rem;margin-bottom:0;font-size:.875rem;color:#6c757d;white-space:nowrap}.dropdown-item-text{display:block;padding:.25rem 1.5rem;color:#212529}.btn-group,.btn-group-vertical{position:relative;display:-ms-inline-flexbox;display:inline-flex;vertical-align:middle}.btn-group-vertical>.btn,.btn-group>.btn{position:relative;-ms-flex:1 1 auto;flex:1 1 auto}.btn-group-vertical>.btn:hover,.btn-group>.btn:hover{z-index:1}.btn-group-vertical>.btn.active,.btn-group-vertical>.btn:active,.btn-group-vertical>.btn:focus,.btn-group>.btn.active,.btn-group>.btn:active,.btn-group>.btn:focus{z-index:1}.btn-toolbar{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-pack:start;justify-content:flex-start}.btn-toolbar .input-group{width:auto}.btn-group>.btn-group:not(:first-child),.btn-group>.btn:not(:first-child){margin-left:-1px}.btn-group>.btn-group:not(:last-child)>.btn,.btn-group>.btn:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn-group:not(:first-child)>.btn,.btn-group>.btn:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.dropdown-toggle-split{padding-right:.5625rem;padding-left:.5625rem}.dropdown-toggle-split::after,.dropright .dropdown-toggle-split::after,.dropup .dropdown-toggle-split::after{margin-left:0}.dropleft .dropdown-toggle-split::before{margin-right:0}.btn-group-sm>.btn+.dropdown-toggle-split,.btn-sm+.dropdown-toggle-split{padding-right:.375rem;padding-left:.375rem}.btn-group-lg>.btn+.dropdown-toggle-split,.btn-lg+.dropdown-toggle-split{padding-right:.75rem;padding-left:.75rem}.btn-group-vertical{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:center;justify-content:center}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group{width:100%}.btn-group-vertical>.btn-group:not(:first-child),.btn-group-vertical>.btn:not(:first-child){margin-top:-1px}.btn-group-vertical>.btn-group:not(:last-child)>.btn,.btn-group-vertical>.btn:not(:last-child):not(.dropdown-toggle){border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:not(:first-child)>.btn,.btn-group-vertical>.btn:not(:first-child){border-top-left-radius:0;border-top-right-radius:0}.btn-group-toggle>.btn,.btn-group-toggle>.btn-group>.btn{margin-bottom:0}.btn-group-toggle>.btn input[type=checkbox],.btn-group-toggle>.btn input[type=radio],.btn-group-toggle>.btn-group>.btn input[type=checkbox],.btn-group-toggle>.btn-group>.btn input[type=radio]{position:absolute;clip:rect(0,0,0,0);pointer-events:none}.input-group{position:relative;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:stretch;align-items:stretch;width:100%}.input-group>.custom-file,.input-group>.custom-select,.input-group>.form-control,.input-group>.form-control-plaintext{position:relative;-ms-flex:1 1 auto;flex:1 1 auto;width:1%;margin-bottom:0}.input-group>.custom-file+.custom-file,.input-group>.custom-file+.custom-select,.input-group>.custom-file+.form-control,.input-group>.custom-select+.custom-file,.input-group>.custom-select+.custom-select,.input-group>.custom-select+.form-control,.input-group>.form-control+.custom-file,.input-group>.form-control+.custom-select,.input-group>.form-control+.form-control,.input-group>.form-control-plaintext+.custom-file,.input-group>.form-control-plaintext+.custom-select,.input-group>.form-control-plaintext+.form-control{margin-left:-1px}.input-group>.custom-file .custom-file-input:focus~.custom-file-label,.input-group>.custom-select:focus,.input-group>.form-control:focus{z-index:3}.input-group>.custom-file .custom-file-input:focus{z-index:4}.input-group>.custom-select:not(:last-child),.input-group>.form-control:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0}.input-group>.custom-select:not(:first-child),.input-group>.form-control:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.input-group>.custom-file{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.input-group>.custom-file:not(:last-child) .custom-file-label,.input-group>.custom-file:not(:last-child) .custom-file-label::after{border-top-right-radius:0;border-bottom-right-radius:0}.input-group>.custom-file:not(:first-child) .custom-file-label{border-top-left-radius:0;border-bottom-left-radius:0}.input-group-append,.input-group-prepend{display:-ms-flexbox;display:flex}.input-group-append .btn,.input-group-prepend .btn{position:relative;z-index:2}.input-group-append .btn:focus,.input-group-prepend .btn:focus{z-index:3}.input-group-append .btn+.btn,.input-group-append .btn+.input-group-text,.input-group-append .input-group-text+.btn,.input-group-append .input-group-text+.input-group-text,.input-group-prepend .btn+.btn,.input-group-prepend .btn+.input-group-text,.input-group-prepend .input-group-text+.btn,.input-group-prepend .input-group-text+.input-group-text{margin-left:-1px}.input-group-prepend{margin-right:-1px}.input-group-append{margin-left:-1px}.input-group-text{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:.375rem .75rem;margin-bottom:0;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;text-align:center;white-space:nowrap;background-color:#e9ecef;border:1px solid #ced4da;border-radius:.25rem}.input-group-text input[type=checkbox],.input-group-text input[type=radio]{margin-top:0}.input-group-lg>.custom-select,.input-group-lg>.form-control:not(textarea){height:calc(1.5em + 1rem + 2px)}.input-group-lg>.custom-select,.input-group-lg>.form-control,.input-group-lg>.input-group-append>.btn,.input-group-lg>.input-group-append>.input-group-text,.input-group-lg>.input-group-prepend>.btn,.input-group-lg>.input-group-prepend>.input-group-text{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.input-group-sm>.custom-select,.input-group-sm>.form-control:not(textarea){height:calc(1.5em + .5rem + 2px)}.input-group-sm>.custom-select,.input-group-sm>.form-control,.input-group-sm>.input-group-append>.btn,.input-group-sm>.input-group-append>.input-group-text,.input-group-sm>.input-group-prepend>.btn,.input-group-sm>.input-group-prepend>.input-group-text{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.input-group-lg>.custom-select,.input-group-sm>.custom-select{padding-right:1.75rem}.input-group>.input-group-append:last-child>.btn:not(:last-child):not(.dropdown-toggle),.input-group>.input-group-append:last-child>.input-group-text:not(:last-child),.input-group>.input-group-append:not(:last-child)>.btn,.input-group>.input-group-append:not(:last-child)>.input-group-text,.input-group>.input-group-prepend>.btn,.input-group>.input-group-prepend>.input-group-text{border-top-right-radius:0;border-bottom-right-radius:0}.input-group>.input-group-append>.btn,.input-group>.input-group-append>.input-group-text,.input-group>.input-group-prepend:first-child>.btn:not(:first-child),.input-group>.input-group-prepend:first-child>.input-group-text:not(:first-child),.input-group>.input-group-prepend:not(:first-child)>.btn,.input-group>.input-group-prepend:not(:first-child)>.input-group-text{border-top-left-radius:0;border-bottom-left-radius:0}.custom-control{position:relative;display:block;min-height:1.5rem;padding-left:1.5rem}.custom-control-inline{display:-ms-inline-flexbox;display:inline-flex;margin-right:1rem}.custom-control-input{position:absolute;z-index:-1;opacity:0}.custom-control-input:checked~.custom-control-label::before{color:#fff;border-color:#007bff;background-color:#007bff}.custom-control-input:focus~.custom-control-label::before{box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.custom-control-input:focus:not(:checked)~.custom-control-label::before{border-color:#80bdff}.custom-control-input:not(:disabled):active~.custom-control-label::before{color:#fff;background-color:#b3d7ff;border-color:#b3d7ff}.custom-control-input:disabled~.custom-control-label{color:#6c757d}.custom-control-input:disabled~.custom-control-label::before{background-color:#e9ecef}.custom-control-label{position:relative;margin-bottom:0;vertical-align:top}.custom-control-label::before{position:absolute;top:.25rem;left:-1.5rem;display:block;width:1rem;height:1rem;pointer-events:none;content:"";background-color:#fff;border:#adb5bd solid 1px}.custom-control-label::after{position:absolute;top:.25rem;left:-1.5rem;display:block;width:1rem;height:1rem;content:"";background:no-repeat 50%/50% 50%}.custom-checkbox .custom-control-label::before{border-radius:.25rem}.custom-checkbox .custom-control-input:checked~.custom-control-label::after{background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 8 8\'%3e%3cpath fill=\'%23fff\' d=\'M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z\'/%3e%3c/svg%3e")}.custom-checkbox .custom-control-input:indeterminate~.custom-control-label::before{border-color:#007bff;background-color:#007bff}.custom-checkbox .custom-control-input:indeterminate~.custom-control-label::after{background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 4\'%3e%3cpath stroke=\'%23fff\' d=\'M0 2h4\'/%3e%3c/svg%3e")}.custom-checkbox .custom-control-input:disabled:checked~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-checkbox .custom-control-input:disabled:indeterminate~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-radio .custom-control-label::before{border-radius:50%}.custom-radio .custom-control-input:checked~.custom-control-label::after{background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 8 8\'%3e%3ccircle r=\'3\' fill=\'%23fff\'/%3e%3c/svg%3e")}.custom-radio .custom-control-input:disabled:checked~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-switch{padding-left:2.25rem}.custom-switch .custom-control-label::before{left:-2.25rem;width:1.75rem;pointer-events:all;border-radius:.5rem}.custom-switch .custom-control-label::after{top:calc(.25rem + 2px);left:calc(-2.25rem + 2px);width:calc(1rem - 4px);height:calc(1rem - 4px);background-color:#adb5bd;border-radius:.5rem;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-transform .15s ease-in-out;transition:transform .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;transition:transform .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-transform .15s ease-in-out}@media (prefers-reduced-motion:reduce){.custom-switch .custom-control-label::after{transition:none}}.custom-switch .custom-control-input:checked~.custom-control-label::after{background-color:#fff;-webkit-transform:translateX(.75rem);transform:translateX(.75rem)}.custom-switch .custom-control-input:disabled:checked~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-select{display:inline-block;width:100%;height:calc(1.5em + .75rem + 2px);padding:.375rem 1.75rem .375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;vertical-align:middle;background:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 5\'%3e%3cpath fill=\'%23343a40\' d=\'M2 0L0 2h4zm0 5L0 3h4z\'/%3e%3c/svg%3e") no-repeat right .75rem center/8px 10px;background-color:#fff;border:1px solid #ced4da;border-radius:.25rem;-webkit-appearance:none;-moz-appearance:none;appearance:none}.custom-select:focus{border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.custom-select:focus::-ms-value{color:#495057;background-color:#fff}.custom-select[multiple],.custom-select[size]:not([size="1"]){height:auto;padding-right:.75rem;background-image:none}.custom-select:disabled{color:#6c757d;background-color:#e9ecef}.custom-select::-ms-expand{display:none}.custom-select-sm{height:calc(1.5em + .5rem + 2px);padding-top:.25rem;padding-bottom:.25rem;padding-left:.5rem;font-size:.875rem}.custom-select-lg{height:calc(1.5em + 1rem + 2px);padding-top:.5rem;padding-bottom:.5rem;padding-left:1rem;font-size:1.25rem}.custom-file{position:relative;display:inline-block;width:100%;height:calc(1.5em + .75rem + 2px);margin-bottom:0}.custom-file-input{position:relative;z-index:2;width:100%;height:calc(1.5em + .75rem + 2px);margin:0;opacity:0}.custom-file-input:focus~.custom-file-label{border-color:#80bdff;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.custom-file-input:disabled~.custom-file-label{background-color:#e9ecef}.custom-file-input:lang(en)~.custom-file-label::after{content:"Browse"}.custom-file-input~.custom-file-label[data-browse]::after{content:attr(data-browse)}.custom-file-label{position:absolute;top:0;right:0;left:0;z-index:1;height:calc(1.5em + .75rem + 2px);padding:.375rem .75rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;border:1px solid #ced4da;border-radius:.25rem}.custom-file-label::after{position:absolute;top:0;right:0;bottom:0;z-index:3;display:block;height:calc(1.5em + .75rem);padding:.375rem .75rem;line-height:1.5;color:#495057;content:"Browse";background-color:#e9ecef;border-left:inherit;border-radius:0 .25rem .25rem 0}.custom-range{width:100%;height:calc(1rem + .4rem);padding:0;background-color:transparent;-webkit-appearance:none;-moz-appearance:none;appearance:none}.custom-range:focus{outline:0}.custom-range:focus::-webkit-slider-thumb{box-shadow:0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)}.custom-range:focus::-moz-range-thumb{box-shadow:0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)}.custom-range:focus::-ms-thumb{box-shadow:0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)}.custom-range::-moz-focus-outer{border:0}.custom-range::-webkit-slider-thumb{width:1rem;height:1rem;margin-top:-.25rem;background-color:#007bff;border:0;border-radius:1rem;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;-webkit-appearance:none;appearance:none}@media (prefers-reduced-motion:reduce){.custom-range::-webkit-slider-thumb{transition:none}}.custom-range::-webkit-slider-thumb:active{background-color:#b3d7ff}.custom-range::-webkit-slider-runnable-track{width:100%;height:.5rem;color:transparent;cursor:pointer;background-color:#dee2e6;border-color:transparent;border-radius:1rem}.custom-range::-moz-range-thumb{width:1rem;height:1rem;background-color:#007bff;border:0;border-radius:1rem;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;-moz-appearance:none;appearance:none}@media (prefers-reduced-motion:reduce){.custom-range::-moz-range-thumb{transition:none}}.custom-range::-moz-range-thumb:active{background-color:#b3d7ff}.custom-range::-moz-range-track{width:100%;height:.5rem;color:transparent;cursor:pointer;background-color:#dee2e6;border-color:transparent;border-radius:1rem}.custom-range::-ms-thumb{width:1rem;height:1rem;margin-top:0;margin-right:.2rem;margin-left:.2rem;background-color:#007bff;border:0;border-radius:1rem;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;appearance:none}@media (prefers-reduced-motion:reduce){.custom-range::-ms-thumb{transition:none}}.custom-range::-ms-thumb:active{background-color:#b3d7ff}.custom-range::-ms-track{width:100%;height:.5rem;color:transparent;cursor:pointer;background-color:transparent;border-color:transparent;border-width:.5rem}.custom-range::-ms-fill-lower{background-color:#dee2e6;border-radius:1rem}.custom-range::-ms-fill-upper{margin-right:15px;background-color:#dee2e6;border-radius:1rem}.custom-range:disabled::-webkit-slider-thumb{background-color:#adb5bd}.custom-range:disabled::-webkit-slider-runnable-track{cursor:default}.custom-range:disabled::-moz-range-thumb{background-color:#adb5bd}.custom-range:disabled::-moz-range-track{cursor:default}.custom-range:disabled::-ms-thumb{background-color:#adb5bd}.custom-control-label::before,.custom-file-label,.custom-select{transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.custom-control-label::before,.custom-file-label,.custom-select{transition:none}}.nav{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;padding-left:0;margin-bottom:0;list-style:none}.nav-link{display:block;padding:.5rem 1rem}.nav-link:focus,.nav-link:hover{text-decoration:none}.nav-link.disabled{color:#6c757d;pointer-events:none;cursor:default}.nav-tabs{border-bottom:1px solid #dee2e6}.nav-tabs .nav-item{margin-bottom:-1px}.nav-tabs .nav-link{border:1px solid transparent;border-top-left-radius:.25rem;border-top-right-radius:.25rem}.nav-tabs .nav-link:focus,.nav-tabs .nav-link:hover{border-color:#e9ecef #e9ecef #dee2e6}.nav-tabs .nav-link.disabled{color:#6c757d;background-color:transparent;border-color:transparent}.nav-tabs .nav-item.show .nav-link,.nav-tabs .nav-link.active{color:#495057;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0}.nav-pills .nav-link{border-radius:.25rem}.nav-pills .nav-link.active,.nav-pills .show>.nav-link{color:#fff;background-color:#007bff}.nav-fill .nav-item{-ms-flex:1 1 auto;flex:1 1 auto;text-align:center}.nav-justified .nav-item{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;text-align:center}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.navbar{position:relative;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;padding:.5rem 1rem}.navbar>.container,.navbar>.container-fluid{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between}.navbar-brand{display:inline-block;padding-top:.3125rem;padding-bottom:.3125rem;margin-right:1rem;font-size:1.25rem;line-height:inherit;white-space:nowrap}.navbar-brand:focus,.navbar-brand:hover{text-decoration:none}.navbar-nav{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding-left:0;margin-bottom:0;list-style:none}.navbar-nav .nav-link{padding-right:0;padding-left:0}.navbar-nav .dropdown-menu{position:static;float:none}.navbar-text{display:inline-block;padding-top:.5rem;padding-bottom:.5rem}.navbar-collapse{-ms-flex-preferred-size:100%;flex-basis:100%;-ms-flex-positive:1;flex-grow:1;-ms-flex-align:center;align-items:center}.navbar-toggler{padding:.25rem .75rem;font-size:1.25rem;line-height:1;background-color:transparent;border:1px solid transparent;border-radius:.25rem}.navbar-toggler:focus,.navbar-toggler:hover{text-decoration:none}.navbar-toggler-icon{display:inline-block;width:1.5em;height:1.5em;vertical-align:middle;content:"";background:no-repeat center center;background-size:100% 100%}@media (max-width:575.98px){.navbar-expand-sm>.container,.navbar-expand-sm>.container-fluid{padding-right:0;padding-left:0}}@media (min-width:576px){.navbar-expand-sm{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-sm .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-sm .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-sm .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-sm>.container,.navbar-expand-sm>.container-fluid{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-sm .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-sm .navbar-toggler{display:none}}@media (max-width:767.98px){.navbar-expand-md>.container,.navbar-expand-md>.container-fluid{padding-right:0;padding-left:0}}@media (min-width:768px){.navbar-expand-md{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-md .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-md .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-md .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-md>.container,.navbar-expand-md>.container-fluid{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-md .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-md .navbar-toggler{display:none}}@media (max-width:991.98px){.navbar-expand-lg>.container,.navbar-expand-lg>.container-fluid{padding-right:0;padding-left:0}}@media (min-width:992px){.navbar-expand-lg{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-lg .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-lg .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-lg .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-lg>.container,.navbar-expand-lg>.container-fluid{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-lg .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-lg .navbar-toggler{display:none}}@media (max-width:1199.98px){.navbar-expand-xl>.container,.navbar-expand-xl>.container-fluid{padding-right:0;padding-left:0}}@media (min-width:1200px){.navbar-expand-xl{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-xl .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-xl .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-xl .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-xl>.container,.navbar-expand-xl>.container-fluid{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-xl .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-xl .navbar-toggler{display:none}}.navbar-expand{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand>.container,.navbar-expand>.container-fluid{padding-right:0;padding-left:0}.navbar-expand .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand .navbar-nav .dropdown-menu{position:absolute}.navbar-expand .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand>.container,.navbar-expand>.container-fluid{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand .navbar-toggler{display:none}.navbar-light .navbar-brand{color:rgba(0,0,0,.9)}.navbar-light .navbar-brand:focus,.navbar-light .navbar-brand:hover{color:rgba(0,0,0,.9)}.navbar-light .navbar-nav .nav-link{color:rgba(0,0,0,.5)}.navbar-light .navbar-nav .nav-link:focus,.navbar-light .navbar-nav .nav-link:hover{color:rgba(0,0,0,.7)}.navbar-light .navbar-nav .nav-link.disabled{color:rgba(0,0,0,.3)}.navbar-light .navbar-nav .active>.nav-link,.navbar-light .navbar-nav .nav-link.active,.navbar-light .navbar-nav .nav-link.show,.navbar-light .navbar-nav .show>.nav-link{color:rgba(0,0,0,.9)}.navbar-light .navbar-toggler{color:rgba(0,0,0,.5);border-color:rgba(0,0,0,.1)}.navbar-light .navbar-toggler-icon{background-image:url("data:image/svg+xml,%3csvg viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath stroke=\'rgba(0, 0, 0, 0.5)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' d=\'M4 7h22M4 15h22M4 23h22\'/%3e%3c/svg%3e")}.navbar-light .navbar-text{color:rgba(0,0,0,.5)}.navbar-light .navbar-text a{color:rgba(0,0,0,.9)}.navbar-light .navbar-text a:focus,.navbar-light .navbar-text a:hover{color:rgba(0,0,0,.9)}.navbar-dark .navbar-brand{color:#fff}.navbar-dark .navbar-brand:focus,.navbar-dark .navbar-brand:hover{color:#fff}.navbar-dark .navbar-nav .nav-link{color:rgba(255,255,255,.5)}.navbar-dark .navbar-nav .nav-link:focus,.navbar-dark .navbar-nav .nav-link:hover{color:rgba(255,255,255,.75)}.navbar-dark .navbar-nav .nav-link.disabled{color:rgba(255,255,255,.25)}.navbar-dark .navbar-nav .active>.nav-link,.navbar-dark .navbar-nav .nav-link.active,.navbar-dark .navbar-nav .nav-link.show,.navbar-dark .navbar-nav .show>.nav-link{color:#fff}.navbar-dark .navbar-toggler{color:rgba(255,255,255,.5);border-color:rgba(255,255,255,.1)}.navbar-dark .navbar-toggler-icon{background-image:url("data:image/svg+xml,%3csvg viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath stroke=\'rgba(255, 255, 255, 0.5)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' d=\'M4 7h22M4 15h22M4 23h22\'/%3e%3c/svg%3e")}.navbar-dark .navbar-text{color:rgba(255,255,255,.5)}.navbar-dark .navbar-text a{color:#fff}.navbar-dark .navbar-text a:focus,.navbar-dark .navbar-text a:hover{color:#fff}.card{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:1px solid rgba(0,0,0,.125);border-radius:.25rem}.card>hr{margin-right:0;margin-left:0}.card>.list-group:first-child .list-group-item:first-child{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.card>.list-group:last-child .list-group-item:last-child{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.card-body{-ms-flex:1 1 auto;flex:1 1 auto;padding:1.25rem}.card-title{margin-bottom:.75rem}.card-subtitle{margin-top:-.375rem;margin-bottom:0}.card-text:last-child{margin-bottom:0}.card-link:hover{text-decoration:none}.card-link+.card-link{margin-left:1.25rem}.card-header{padding:.75rem 1.25rem;margin-bottom:0;background-color:rgba(0,0,0,.03);border-bottom:1px solid rgba(0,0,0,.125)}.card-header:first-child{border-radius:calc(.25rem - 1px) calc(.25rem - 1px) 0 0}.card-header+.list-group .list-group-item:first-child{border-top:0}.card-footer{padding:.75rem 1.25rem;background-color:rgba(0,0,0,.03);border-top:1px solid rgba(0,0,0,.125)}.card-footer:last-child{border-radius:0 0 calc(.25rem - 1px) calc(.25rem - 1px)}.card-header-tabs{margin-right:-.625rem;margin-bottom:-.75rem;margin-left:-.625rem;border-bottom:0}.card-header-pills{margin-right:-.625rem;margin-left:-.625rem}.card-img-overlay{position:absolute;top:0;right:0;bottom:0;left:0;padding:1.25rem}.card-img{width:100%;border-radius:calc(.25rem - 1px)}.card-img-top{width:100%;border-top-left-radius:calc(.25rem - 1px);border-top-right-radius:calc(.25rem - 1px)}.card-img-bottom{width:100%;border-bottom-right-radius:calc(.25rem - 1px);border-bottom-left-radius:calc(.25rem - 1px)}.card-deck{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.card-deck .card{margin-bottom:15px}@media (min-width:576px){.card-deck{-ms-flex-flow:row wrap;flex-flow:row wrap;margin-right:-15px;margin-left:-15px}.card-deck .card{display:-ms-flexbox;display:flex;-ms-flex:1 0 0%;flex:1 0 0%;-ms-flex-direction:column;flex-direction:column;margin-right:15px;margin-bottom:0;margin-left:15px}}.card-group{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.card-group>.card{margin-bottom:15px}@media (min-width:576px){.card-group{-ms-flex-flow:row wrap;flex-flow:row wrap}.card-group>.card{-ms-flex:1 0 0%;flex:1 0 0%;margin-bottom:0}.card-group>.card+.card{margin-left:0;border-left:0}.card-group>.card:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0}.card-group>.card:not(:last-child) .card-header,.card-group>.card:not(:last-child) .card-img-top{border-top-right-radius:0}.card-group>.card:not(:last-child) .card-footer,.card-group>.card:not(:last-child) .card-img-bottom{border-bottom-right-radius:0}.card-group>.card:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.card-group>.card:not(:first-child) .card-header,.card-group>.card:not(:first-child) .card-img-top{border-top-left-radius:0}.card-group>.card:not(:first-child) .card-footer,.card-group>.card:not(:first-child) .card-img-bottom{border-bottom-left-radius:0}}.card-columns .card{margin-bottom:.75rem}@media (min-width:576px){.card-columns{-webkit-column-count:3;-moz-column-count:3;column-count:3;-webkit-column-gap:1.25rem;-moz-column-gap:1.25rem;column-gap:1.25rem;orphans:1;widows:1}.card-columns .card{display:inline-block;width:100%}}.accordion>.card{overflow:hidden}.accordion>.card:not(:first-of-type) .card-header:first-child{border-radius:0}.accordion>.card:not(:first-of-type):not(:last-of-type){border-bottom:0;border-radius:0}.accordion>.card:first-of-type{border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.accordion>.card:last-of-type{border-top-left-radius:0;border-top-right-radius:0}.accordion>.card .card-header{margin-bottom:-1px}.breadcrumb{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:.75rem 1rem;margin-bottom:1rem;list-style:none;background-color:#e9ecef;border-radius:.25rem}.breadcrumb-item+.breadcrumb-item{padding-left:.5rem}.breadcrumb-item+.breadcrumb-item::before{display:inline-block;padding-right:.5rem;color:#6c757d;content:"/"}.breadcrumb-item+.breadcrumb-item:hover::before{text-decoration:underline}.breadcrumb-item+.breadcrumb-item:hover::before{text-decoration:none}.breadcrumb-item.active{color:#6c757d}.pagination{display:-ms-flexbox;display:flex;padding-left:0;list-style:none;border-radius:.25rem}.page-link{position:relative;display:block;padding:.5rem .75rem;margin-left:-1px;line-height:1.25;color:#007bff;background-color:#fff;border:1px solid #dee2e6}.page-link:hover{z-index:2;color:#0056b3;text-decoration:none;background-color:#e9ecef;border-color:#dee2e6}.page-link:focus{z-index:2;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.page-item:first-child .page-link{margin-left:0;border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.page-item:last-child .page-link{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.page-item.active .page-link{z-index:1;color:#fff;background-color:#007bff;border-color:#007bff}.page-item.disabled .page-link{color:#6c757d;pointer-events:none;cursor:auto;background-color:#fff;border-color:#dee2e6}.pagination-lg .page-link{padding:.75rem 1.5rem;font-size:1.25rem;line-height:1.5}.pagination-lg .page-item:first-child .page-link{border-top-left-radius:.3rem;border-bottom-left-radius:.3rem}.pagination-lg .page-item:last-child .page-link{border-top-right-radius:.3rem;border-bottom-right-radius:.3rem}.pagination-sm .page-link{padding:.25rem .5rem;font-size:.875rem;line-height:1.5}.pagination-sm .page-item:first-child .page-link{border-top-left-radius:.2rem;border-bottom-left-radius:.2rem}.pagination-sm .page-item:last-child .page-link{border-top-right-radius:.2rem;border-bottom-right-radius:.2rem}.badge{display:inline-block;padding:.25em .4em;font-size:75%;font-weight:700;line-height:1;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.badge{transition:none}}a.badge:focus,a.badge:hover{text-decoration:none}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.badge-pill{padding-right:.6em;padding-left:.6em;border-radius:10rem}.badge-primary{color:#fff;background-color:#007bff}a.badge-primary:focus,a.badge-primary:hover{color:#fff;background-color:#0062cc}a.badge-primary.focus,a.badge-primary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.badge-secondary{color:#fff;background-color:#6c757d}a.badge-secondary:focus,a.badge-secondary:hover{color:#fff;background-color:#545b62}a.badge-secondary.focus,a.badge-secondary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.badge-success{color:#fff;background-color:#28a745}a.badge-success:focus,a.badge-success:hover{color:#fff;background-color:#1e7e34}a.badge-success.focus,a.badge-success:focus{outline:0;box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.badge-info{color:#fff;background-color:#17a2b8}a.badge-info:focus,a.badge-info:hover{color:#fff;background-color:#117a8b}a.badge-info.focus,a.badge-info:focus{outline:0;box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.badge-warning{color:#212529;background-color:#ffc107}a.badge-warning:focus,a.badge-warning:hover{color:#212529;background-color:#d39e00}a.badge-warning.focus,a.badge-warning:focus{outline:0;box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.badge-danger{color:#fff;background-color:#dc3545}a.badge-danger:focus,a.badge-danger:hover{color:#fff;background-color:#bd2130}a.badge-danger.focus,a.badge-danger:focus{outline:0;box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.badge-light{color:#212529;background-color:#f8f9fa}a.badge-light:focus,a.badge-light:hover{color:#212529;background-color:#dae0e5}a.badge-light.focus,a.badge-light:focus{outline:0;box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.badge-dark{color:#fff;background-color:#343a40}a.badge-dark:focus,a.badge-dark:hover{color:#fff;background-color:#1d2124}a.badge-dark.focus,a.badge-dark:focus{outline:0;box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.jumbotron{padding:2rem 1rem;margin-bottom:2rem;background-color:#e9ecef;border-radius:.3rem}@media (min-width:576px){.jumbotron{padding:4rem 2rem}}.jumbotron-fluid{padding-right:0;padding-left:0;border-radius:0}.alert{position:relative;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.alert-heading{color:inherit}.alert-link{font-weight:700}.alert-dismissible{padding-right:4rem}.alert-dismissible .close{position:absolute;top:0;right:0;padding:.75rem 1.25rem;color:inherit}.alert-primary{color:#004085;background-color:#cce5ff;border-color:#b8daff}.alert-primary hr{border-top-color:#9fcdff}.alert-primary .alert-link{color:#002752}.alert-secondary{color:#383d41;background-color:#e2e3e5;border-color:#d6d8db}.alert-secondary hr{border-top-color:#c8cbcf}.alert-secondary .alert-link{color:#202326}.alert-success{color:#155724;background-color:#d4edda;border-color:#c3e6cb}.alert-success hr{border-top-color:#b1dfbb}.alert-success .alert-link{color:#0b2e13}.alert-info{color:#0c5460;background-color:#d1ecf1;border-color:#bee5eb}.alert-info hr{border-top-color:#abdde5}.alert-info .alert-link{color:#062c33}.alert-warning{color:#856404;background-color:#fff3cd;border-color:#ffeeba}.alert-warning hr{border-top-color:#ffe8a1}.alert-warning .alert-link{color:#533f03}.alert-danger{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb}.alert-danger hr{border-top-color:#f1b0b7}.alert-danger .alert-link{color:#491217}.alert-light{color:#818182;background-color:#fefefe;border-color:#fdfdfe}.alert-light hr{border-top-color:#ececf6}.alert-light .alert-link{color:#686868}.alert-dark{color:#1b1e21;background-color:#d6d8d9;border-color:#c6c8ca}.alert-dark hr{border-top-color:#b9bbbe}.alert-dark .alert-link{color:#040505}@-webkit-keyframes progress-bar-stripes{from{background-position:1rem 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:1rem 0}to{background-position:0 0}}.progress{display:-ms-flexbox;display:flex;height:1rem;overflow:hidden;font-size:.75rem;background-color:#e9ecef;border-radius:.25rem}.progress-bar{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;color:#fff;text-align:center;white-space:nowrap;background-color:#007bff;transition:width .6s ease}@media (prefers-reduced-motion:reduce){.progress-bar{transition:none}}.progress-bar-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.progress-bar-animated{-webkit-animation:progress-bar-stripes 1s linear infinite;animation:progress-bar-stripes 1s linear infinite}@media (prefers-reduced-motion:reduce){.progress-bar-animated{-webkit-animation:none;animation:none}}.media{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start}.media-body{-ms-flex:1;flex:1}.list-group{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding-left:0;margin-bottom:0}.list-group-item-action{width:100%;color:#495057;text-align:inherit}.list-group-item-action:focus,.list-group-item-action:hover{z-index:1;color:#495057;text-decoration:none;background-color:#f8f9fa}.list-group-item-action:active{color:#212529;background-color:#e9ecef}.list-group-item{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:-1px;background-color:#fff;border:1px solid rgba(0,0,0,.125)}.list-group-item:first-child{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.list-group-item.disabled,.list-group-item:disabled{color:#6c757d;pointer-events:none;background-color:#fff}.list-group-item.active{z-index:2;color:#fff;background-color:#007bff;border-color:#007bff}.list-group-horizontal{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal .list-group-item{margin-right:-1px;margin-bottom:0}.list-group-horizontal .list-group-item:first-child{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal .list-group-item:last-child{margin-right:0;border-top-right-radius:.25rem;border-bottom-right-radius:.25rem;border-bottom-left-radius:0}@media (min-width:576px){.list-group-horizontal-sm{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-sm .list-group-item{margin-right:-1px;margin-bottom:0}.list-group-horizontal-sm .list-group-item:first-child{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-sm .list-group-item:last-child{margin-right:0;border-top-right-radius:.25rem;border-bottom-right-radius:.25rem;border-bottom-left-radius:0}}@media (min-width:768px){.list-group-horizontal-md{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-md .list-group-item{margin-right:-1px;margin-bottom:0}.list-group-horizontal-md .list-group-item:first-child{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-md .list-group-item:last-child{margin-right:0;border-top-right-radius:.25rem;border-bottom-right-radius:.25rem;border-bottom-left-radius:0}}@media (min-width:992px){.list-group-horizontal-lg{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-lg .list-group-item{margin-right:-1px;margin-bottom:0}.list-group-horizontal-lg .list-group-item:first-child{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-lg .list-group-item:last-child{margin-right:0;border-top-right-radius:.25rem;border-bottom-right-radius:.25rem;border-bottom-left-radius:0}}@media (min-width:1200px){.list-group-horizontal-xl{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-xl .list-group-item{margin-right:-1px;margin-bottom:0}.list-group-horizontal-xl .list-group-item:first-child{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-xl .list-group-item:last-child{margin-right:0;border-top-right-radius:.25rem;border-bottom-right-radius:.25rem;border-bottom-left-radius:0}}.list-group-flush .list-group-item{border-right:0;border-left:0;border-radius:0}.list-group-flush .list-group-item:last-child{margin-bottom:-1px}.list-group-flush:first-child .list-group-item:first-child{border-top:0}.list-group-flush:last-child .list-group-item:last-child{margin-bottom:0;border-bottom:0}.list-group-item-primary{color:#004085;background-color:#b8daff}.list-group-item-primary.list-group-item-action:focus,.list-group-item-primary.list-group-item-action:hover{color:#004085;background-color:#9fcdff}.list-group-item-primary.list-group-item-action.active{color:#fff;background-color:#004085;border-color:#004085}.list-group-item-secondary{color:#383d41;background-color:#d6d8db}.list-group-item-secondary.list-group-item-action:focus,.list-group-item-secondary.list-group-item-action:hover{color:#383d41;background-color:#c8cbcf}.list-group-item-secondary.list-group-item-action.active{color:#fff;background-color:#383d41;border-color:#383d41}.list-group-item-success{color:#155724;background-color:#c3e6cb}.list-group-item-success.list-group-item-action:focus,.list-group-item-success.list-group-item-action:hover{color:#155724;background-color:#b1dfbb}.list-group-item-success.list-group-item-action.active{color:#fff;background-color:#155724;border-color:#155724}.list-group-item-info{color:#0c5460;background-color:#bee5eb}.list-group-item-info.list-group-item-action:focus,.list-group-item-info.list-group-item-action:hover{color:#0c5460;background-color:#abdde5}.list-group-item-info.list-group-item-action.active{color:#fff;background-color:#0c5460;border-color:#0c5460}.list-group-item-warning{color:#856404;background-color:#ffeeba}.list-group-item-warning.list-group-item-action:focus,.list-group-item-warning.list-group-item-action:hover{color:#856404;background-color:#ffe8a1}.list-group-item-warning.list-group-item-action.active{color:#fff;background-color:#856404;border-color:#856404}.list-group-item-danger{color:#721c24;background-color:#f5c6cb}.list-group-item-danger.list-group-item-action:focus,.list-group-item-danger.list-group-item-action:hover{color:#721c24;background-color:#f1b0b7}.list-group-item-danger.list-group-item-action.active{color:#fff;background-color:#721c24;border-color:#721c24}.list-group-item-light{color:#818182;background-color:#fdfdfe}.list-group-item-light.list-group-item-action:focus,.list-group-item-light.list-group-item-action:hover{color:#818182;background-color:#ececf6}.list-group-item-light.list-group-item-action.active{color:#fff;background-color:#818182;border-color:#818182}.list-group-item-dark{color:#1b1e21;background-color:#c6c8ca}.list-group-item-dark.list-group-item-action:focus,.list-group-item-dark.list-group-item-action:hover{color:#1b1e21;background-color:#b9bbbe}.list-group-item-dark.list-group-item-action.active{color:#fff;background-color:#1b1e21;border-color:#1b1e21}.close{float:right;font-size:1.5rem;font-weight:700;line-height:1;color:#000;text-shadow:0 1px 0 #fff;opacity:.5}.close:hover{color:#000;text-decoration:none}.close:not(:disabled):not(.disabled):focus,.close:not(:disabled):not(.disabled):hover{opacity:.75}button.close{padding:0;background-color:transparent;border:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}a.close.disabled{pointer-events:none}.toast{max-width:350px;overflow:hidden;font-size:.875rem;background-color:rgba(255,255,255,.85);background-clip:padding-box;border:1px solid rgba(0,0,0,.1);box-shadow:0 .25rem .75rem rgba(0,0,0,.1);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);opacity:0;border-radius:.25rem}.toast:not(:last-child){margin-bottom:.75rem}.toast.showing{opacity:1}.toast.show{display:block;opacity:1}.toast.hide{display:none}.toast-header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:.25rem .75rem;color:#6c757d;background-color:rgba(255,255,255,.85);background-clip:padding-box;border-bottom:1px solid rgba(0,0,0,.05)}.toast-body{padding:.75rem}.modal-open{overflow:hidden}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal{position:fixed;top:0;left:0;z-index:1050;display:none;width:100%;height:100%;overflow:hidden;outline:0}.modal-dialog{position:relative;width:auto;margin:.5rem;pointer-events:none}.modal.fade .modal-dialog{transition:-webkit-transform .3s ease-out;transition:transform .3s ease-out;transition:transform .3s ease-out,-webkit-transform .3s ease-out;-webkit-transform:translate(0,-50px);transform:translate(0,-50px)}@media (prefers-reduced-motion:reduce){.modal.fade .modal-dialog{transition:none}}.modal.show .modal-dialog{-webkit-transform:none;transform:none}.modal-dialog-scrollable{display:-ms-flexbox;display:flex;max-height:calc(100% - 1rem)}.modal-dialog-scrollable .modal-content{max-height:calc(100vh - 1rem);overflow:hidden}.modal-dialog-scrollable .modal-footer,.modal-dialog-scrollable .modal-header{-ms-flex-negative:0;flex-shrink:0}.modal-dialog-scrollable .modal-body{overflow-y:auto}.modal-dialog-centered{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;min-height:calc(100% - 1rem)}.modal-dialog-centered::before{display:block;height:calc(100vh - 1rem);content:""}.modal-dialog-centered.modal-dialog-scrollable{-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;height:100%}.modal-dialog-centered.modal-dialog-scrollable .modal-content{max-height:none}.modal-dialog-centered.modal-dialog-scrollable::before{content:none}.modal-content{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:100%;pointer-events:auto;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem;outline:0}.modal-backdrop{position:fixed;top:0;left:0;z-index:1040;width:100vw;height:100vh;background-color:#000}.modal-backdrop.fade{opacity:0}.modal-backdrop.show{opacity:.5}.modal-header{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:justify;justify-content:space-between;padding:1rem 1rem;border-bottom:1px solid #dee2e6;border-top-left-radius:.3rem;border-top-right-radius:.3rem}.modal-header .close{padding:1rem 1rem;margin:-1rem -1rem -1rem auto}.modal-title{margin-bottom:0;line-height:1.5}.modal-body{position:relative;-ms-flex:1 1 auto;flex:1 1 auto;padding:1rem}.modal-footer{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:end;justify-content:flex-end;padding:1rem;border-top:1px solid #dee2e6;border-bottom-right-radius:.3rem;border-bottom-left-radius:.3rem}.modal-footer>:not(:first-child){margin-left:.25rem}.modal-footer>:not(:last-child){margin-right:.25rem}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:576px){.modal-dialog{max-width:500px;margin:1.75rem auto}.modal-dialog-scrollable{max-height:calc(100% - 3.5rem)}.modal-dialog-scrollable .modal-content{max-height:calc(100vh - 3.5rem)}.modal-dialog-centered{min-height:calc(100% - 3.5rem)}.modal-dialog-centered::before{height:calc(100vh - 3.5rem)}.modal-sm{max-width:300px}}@media (min-width:992px){.modal-lg,.modal-xl{max-width:800px}}@media (min-width:1200px){.modal-xl{max-width:1140px}}.tooltip{position:absolute;z-index:1070;display:block;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;opacity:0}.tooltip.show{opacity:.9}.tooltip .arrow{position:absolute;display:block;width:.8rem;height:.4rem}.tooltip .arrow::before{position:absolute;content:"";border-color:transparent;border-style:solid}.bs-tooltip-auto[x-placement^=top],.bs-tooltip-top{padding:.4rem 0}.bs-tooltip-auto[x-placement^=top] .arrow,.bs-tooltip-top .arrow{bottom:0}.bs-tooltip-auto[x-placement^=top] .arrow::before,.bs-tooltip-top .arrow::before{top:0;border-width:.4rem .4rem 0;border-top-color:#000}.bs-tooltip-auto[x-placement^=right],.bs-tooltip-right{padding:0 .4rem}.bs-tooltip-auto[x-placement^=right] .arrow,.bs-tooltip-right .arrow{left:0;width:.4rem;height:.8rem}.bs-tooltip-auto[x-placement^=right] .arrow::before,.bs-tooltip-right .arrow::before{right:0;border-width:.4rem .4rem .4rem 0;border-right-color:#000}.bs-tooltip-auto[x-placement^=bottom],.bs-tooltip-bottom{padding:.4rem 0}.bs-tooltip-auto[x-placement^=bottom] .arrow,.bs-tooltip-bottom .arrow{top:0}.bs-tooltip-auto[x-placement^=bottom] .arrow::before,.bs-tooltip-bottom .arrow::before{bottom:0;border-width:0 .4rem .4rem;border-bottom-color:#000}.bs-tooltip-auto[x-placement^=left],.bs-tooltip-left{padding:0 .4rem}.bs-tooltip-auto[x-placement^=left] .arrow,.bs-tooltip-left .arrow{right:0;width:.4rem;height:.8rem}.bs-tooltip-auto[x-placement^=left] .arrow::before,.bs-tooltip-left .arrow::before{left:0;border-width:.4rem 0 .4rem .4rem;border-left-color:#000}.tooltip-inner{max-width:200px;padding:.25rem .5rem;color:#fff;text-align:center;background-color:#000;border-radius:.25rem}.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}.popover .arrow::after,.popover .arrow::before{position:absolute;display:block;content:"";border-color:transparent;border-style:solid}.bs-popover-auto[x-placement^=top],.bs-popover-top{margin-bottom:.5rem}.bs-popover-auto[x-placement^=top]>.arrow,.bs-popover-top>.arrow{bottom:calc((.5rem + 1px) * -1)}.bs-popover-auto[x-placement^=top]>.arrow::before,.bs-popover-top>.arrow::before{bottom:0;border-width:.5rem .5rem 0;border-top-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=top]>.arrow::after,.bs-popover-top>.arrow::after{bottom:1px;border-width:.5rem .5rem 0;border-top-color:#fff}.bs-popover-auto[x-placement^=right],.bs-popover-right{margin-left:.5rem}.bs-popover-auto[x-placement^=right]>.arrow,.bs-popover-right>.arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}.bs-popover-auto[x-placement^=right]>.arrow::before,.bs-popover-right>.arrow::before{left:0;border-width:.5rem .5rem .5rem 0;border-right-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=right]>.arrow::after,.bs-popover-right>.arrow::after{left:1px;border-width:.5rem .5rem .5rem 0;border-right-color:#fff}.bs-popover-auto[x-placement^=bottom],.bs-popover-bottom{margin-top:.5rem}.bs-popover-auto[x-placement^=bottom]>.arrow,.bs-popover-bottom>.arrow{top:calc((.5rem + 1px) * -1)}.bs-popover-auto[x-placement^=bottom]>.arrow::before,.bs-popover-bottom>.arrow::before{top:0;border-width:0 .5rem .5rem .5rem;border-bottom-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=bottom]>.arrow::after,.bs-popover-bottom>.arrow::after{top:1px;border-width:0 .5rem .5rem .5rem;border-bottom-color:#fff}.bs-popover-auto[x-placement^=bottom] .popover-header::before,.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:"";border-bottom:1px solid #f7f7f7}.bs-popover-auto[x-placement^=left],.bs-popover-left{margin-right:.5rem}.bs-popover-auto[x-placement^=left]>.arrow,.bs-popover-left>.arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}.bs-popover-auto[x-placement^=left]>.arrow::before,.bs-popover-left>.arrow::before{right:0;border-width:.5rem 0 .5rem .5rem;border-left-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=left]>.arrow::after,.bs-popover-left>.arrow::after{right:1px;border-width:.5rem 0 .5rem .5rem;border-left-color:#fff}.popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}.popover-header:empty{display:none}.popover-body{padding:.5rem .75rem;color:#212529}.carousel{position:relative}.carousel.pointer-event{-ms-touch-action:pan-y;touch-action:pan-y}.carousel-inner{position:relative;width:100%;overflow:hidden}.carousel-inner::after{display:block;clear:both;content:""}.carousel-item{position:relative;display:none;float:left;width:100%;margin-right:-100%;-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:-webkit-transform .6s ease-in-out;transition:transform .6s ease-in-out;transition:transform .6s ease-in-out,-webkit-transform .6s ease-in-out}@media (prefers-reduced-motion:reduce){.carousel-item{transition:none}}.carousel-item-next,.carousel-item-prev,.carousel-item.active{display:block}.active.carousel-item-right,.carousel-item-next:not(.carousel-item-left){-webkit-transform:translateX(100%);transform:translateX(100%)}.active.carousel-item-left,.carousel-item-prev:not(.carousel-item-right){-webkit-transform:translateX(-100%);transform:translateX(-100%)}.carousel-fade .carousel-item{opacity:0;transition-property:opacity;-webkit-transform:none;transform:none}.carousel-fade .carousel-item-next.carousel-item-left,.carousel-fade .carousel-item-prev.carousel-item-right,.carousel-fade .carousel-item.active{z-index:1;opacity:1}.carousel-fade .active.carousel-item-left,.carousel-fade .active.carousel-item-right{z-index:0;opacity:0;transition:0s .6s opacity}@media (prefers-reduced-motion:reduce){.carousel-fade .active.carousel-item-left,.carousel-fade .active.carousel-item-right{transition:none}}.carousel-control-next,.carousel-control-prev{position:absolute;top:0;bottom:0;z-index:1;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:15%;color:#fff;text-align:center;opacity:.5;transition:opacity .15s ease}@media (prefers-reduced-motion:reduce){.carousel-control-next,.carousel-control-prev{transition:none}}.carousel-control-next:focus,.carousel-control-next:hover,.carousel-control-prev:focus,.carousel-control-prev:hover{color:#fff;text-decoration:none;outline:0;opacity:.9}.carousel-control-prev{left:0}.carousel-control-next{right:0}.carousel-control-next-icon,.carousel-control-prev-icon{display:inline-block;width:20px;height:20px;background:no-repeat 50%/100% 100%}.carousel-control-prev-icon{background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23fff\' viewBox=\'0 0 8 8\'%3e%3cpath d=\'M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z\'/%3e%3c/svg%3e")}.carousel-control-next-icon{background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23fff\' viewBox=\'0 0 8 8\'%3e%3cpath d=\'M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z\'/%3e%3c/svg%3e")}.carousel-indicators{position:absolute;right:0;bottom:0;left:0;z-index:15;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;padding-left:0;margin-right:15%;margin-left:15%;list-style:none}.carousel-indicators li{box-sizing:content-box;-ms-flex:0 1 auto;flex:0 1 auto;width:30px;height:3px;margin-right:3px;margin-left:3px;text-indent:-999px;cursor:pointer;background-color:#fff;background-clip:padding-box;border-top:10px solid transparent;border-bottom:10px solid transparent;opacity:.5;transition:opacity .6s ease}@media (prefers-reduced-motion:reduce){.carousel-indicators li{transition:none}}.carousel-indicators .active{opacity:1}.carousel-caption{position:absolute;right:15%;bottom:20px;left:15%;z-index:10;padding-top:20px;padding-bottom:20px;color:#fff;text-align:center}@-webkit-keyframes spinner-border{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spinner-border{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.spinner-border{display:inline-block;width:2rem;height:2rem;vertical-align:text-bottom;border:.25em solid currentColor;border-right-color:transparent;border-radius:50%;-webkit-animation:spinner-border .75s linear infinite;animation:spinner-border .75s linear infinite}.spinner-border-sm{width:1rem;height:1rem;border-width:.2em}@-webkit-keyframes spinner-grow{0%{-webkit-transform:scale(0);transform:scale(0)}50%{opacity:1}}@keyframes spinner-grow{0%{-webkit-transform:scale(0);transform:scale(0)}50%{opacity:1}}.spinner-grow{display:inline-block;width:2rem;height:2rem;vertical-align:text-bottom;background-color:currentColor;border-radius:50%;opacity:0;-webkit-animation:spinner-grow .75s linear infinite;animation:spinner-grow .75s linear infinite}.spinner-grow-sm{width:1rem;height:1rem}.align-baseline{vertical-align:baseline!important}.align-top{vertical-align:top!important}.align-middle{vertical-align:middle!important}.align-bottom{vertical-align:bottom!important}.align-text-bottom{vertical-align:text-bottom!important}.align-text-top{vertical-align:text-top!important}.bg-primary{background-color:#007bff!important}a.bg-primary:focus,a.bg-primary:hover,button.bg-primary:focus,button.bg-primary:hover{background-color:#0062cc!important}.bg-secondary{background-color:#6c757d!important}a.bg-secondary:focus,a.bg-secondary:hover,button.bg-secondary:focus,button.bg-secondary:hover{background-color:#545b62!important}.bg-success{background-color:#28a745!important}a.bg-success:focus,a.bg-success:hover,button.bg-success:focus,button.bg-success:hover{background-color:#1e7e34!important}.bg-info{background-color:#17a2b8!important}a.bg-info:focus,a.bg-info:hover,button.bg-info:focus,button.bg-info:hover{background-color:#117a8b!important}.bg-warning{background-color:#ffc107!important}a.bg-warning:focus,a.bg-warning:hover,button.bg-warning:focus,button.bg-warning:hover{background-color:#d39e00!important}.bg-danger{background-color:#dc3545!important}a.bg-danger:focus,a.bg-danger:hover,button.bg-danger:focus,button.bg-danger:hover{background-color:#bd2130!important}.bg-light{background-color:#f8f9fa!important}a.bg-light:focus,a.bg-light:hover,button.bg-light:focus,button.bg-light:hover{background-color:#dae0e5!important}.bg-dark{background-color:#343a40!important}a.bg-dark:focus,a.bg-dark:hover,button.bg-dark:focus,button.bg-dark:hover{background-color:#1d2124!important}.bg-white{background-color:#fff!important}.bg-transparent{background-color:transparent!important}.border{border:1px solid #dee2e6!important}.border-top{border-top:1px solid #dee2e6!important}.border-right{border-right:1px solid #dee2e6!important}.border-bottom{border-bottom:1px solid #dee2e6!important}.border-left{border-left:1px solid #dee2e6!important}.border-0{border:0!important}.border-top-0{border-top:0!important}.border-right-0{border-right:0!important}.border-bottom-0{border-bottom:0!important}.border-left-0{border-left:0!important}.border-primary{border-color:#007bff!important}.border-secondary{border-color:#6c757d!important}.border-success{border-color:#28a745!important}.border-info{border-color:#17a2b8!important}.border-warning{border-color:#ffc107!important}.border-danger{border-color:#dc3545!important}.border-light{border-color:#f8f9fa!important}.border-dark{border-color:#343a40!important}.border-white{border-color:#fff!important}.rounded-sm{border-radius:.2rem!important}.rounded{border-radius:.25rem!important}.rounded-top{border-top-left-radius:.25rem!important;border-top-right-radius:.25rem!important}.rounded-right{border-top-right-radius:.25rem!important;border-bottom-right-radius:.25rem!important}.rounded-bottom{border-bottom-right-radius:.25rem!important;border-bottom-left-radius:.25rem!important}.rounded-left{border-top-left-radius:.25rem!important;border-bottom-left-radius:.25rem!important}.rounded-lg{border-radius:.3rem!important}.rounded-circle{border-radius:50%!important}.rounded-pill{border-radius:50rem!important}.rounded-0{border-radius:0!important}.clearfix::after{display:block;clear:both;content:""}.d-none{display:none!important}.d-inline{display:inline!important}.d-inline-block{display:inline-block!important}.d-block{display:block!important}.d-table{display:table!important}.d-table-row{display:table-row!important}.d-table-cell{display:table-cell!important}.d-flex{display:-ms-flexbox!important;display:flex!important}.d-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}@media (min-width:576px){.d-sm-none{display:none!important}.d-sm-inline{display:inline!important}.d-sm-inline-block{display:inline-block!important}.d-sm-block{display:block!important}.d-sm-table{display:table!important}.d-sm-table-row{display:table-row!important}.d-sm-table-cell{display:table-cell!important}.d-sm-flex{display:-ms-flexbox!important;display:flex!important}.d-sm-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media (min-width:768px){.d-md-none{display:none!important}.d-md-inline{display:inline!important}.d-md-inline-block{display:inline-block!important}.d-md-block{display:block!important}.d-md-table{display:table!important}.d-md-table-row{display:table-row!important}.d-md-table-cell{display:table-cell!important}.d-md-flex{display:-ms-flexbox!important;display:flex!important}.d-md-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media (min-width:992px){.d-lg-none{display:none!important}.d-lg-inline{display:inline!important}.d-lg-inline-block{display:inline-block!important}.d-lg-block{display:block!important}.d-lg-table{display:table!important}.d-lg-table-row{display:table-row!important}.d-lg-table-cell{display:table-cell!important}.d-lg-flex{display:-ms-flexbox!important;display:flex!important}.d-lg-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media (min-width:1200px){.d-xl-none{display:none!important}.d-xl-inline{display:inline!important}.d-xl-inline-block{display:inline-block!important}.d-xl-block{display:block!important}.d-xl-table{display:table!important}.d-xl-table-row{display:table-row!important}.d-xl-table-cell{display:table-cell!important}.d-xl-flex{display:-ms-flexbox!important;display:flex!important}.d-xl-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media print{.d-print-none{display:none!important}.d-print-inline{display:inline!important}.d-print-inline-block{display:inline-block!important}.d-print-block{display:block!important}.d-print-table{display:table!important}.d-print-table-row{display:table-row!important}.d-print-table-cell{display:table-cell!important}.d-print-flex{display:-ms-flexbox!important;display:flex!important}.d-print-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}.embed-responsive{position:relative;display:block;width:100%;padding:0;overflow:hidden}.embed-responsive::before{display:block;content:""}.embed-responsive .embed-responsive-item,.embed-responsive embed,.embed-responsive iframe,.embed-responsive object,.embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}.embed-responsive-21by9::before{padding-top:42.857143%}.embed-responsive-16by9::before{padding-top:56.25%}.embed-responsive-4by3::before{padding-top:75%}.embed-responsive-1by1::before{padding-top:100%}.flex-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-center{-ms-flex-align:center!important;align-items:center!important}.align-items-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}@media (min-width:576px){.flex-sm-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-sm-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-sm-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-sm-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-sm-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-sm-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-sm-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-sm-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-sm-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-sm-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-sm-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-sm-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-sm-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-sm-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-sm-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-sm-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-sm-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-sm-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-sm-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-sm-center{-ms-flex-align:center!important;align-items:center!important}.align-items-sm-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-sm-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-sm-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-sm-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-sm-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-sm-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-sm-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-sm-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-sm-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-sm-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-sm-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-sm-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-sm-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-sm-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}@media (min-width:768px){.flex-md-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-md-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-md-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-md-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-md-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-md-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-md-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-md-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-md-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-md-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-md-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-md-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-md-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-md-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-md-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-md-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-md-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-md-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-md-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-md-center{-ms-flex-align:center!important;align-items:center!important}.align-items-md-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-md-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-md-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-md-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-md-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-md-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-md-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-md-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-md-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-md-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-md-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-md-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-md-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-md-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}@media (min-width:992px){.flex-lg-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-lg-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-lg-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-lg-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-lg-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-lg-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-lg-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-lg-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-lg-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-lg-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-lg-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-lg-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-lg-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-lg-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-lg-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-lg-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-lg-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-lg-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-lg-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-lg-center{-ms-flex-align:center!important;align-items:center!important}.align-items-lg-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-lg-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-lg-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-lg-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-lg-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-lg-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-lg-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-lg-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-lg-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-lg-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-lg-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-lg-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-lg-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-lg-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}@media (min-width:1200px){.flex-xl-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-xl-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-xl-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-xl-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-xl-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-xl-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-xl-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-xl-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-xl-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-xl-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-xl-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-xl-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-xl-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-xl-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-xl-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-xl-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-xl-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-xl-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-xl-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-xl-center{-ms-flex-align:center!important;align-items:center!important}.align-items-xl-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-xl-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-xl-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-xl-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-xl-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-xl-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-xl-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-xl-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-xl-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-xl-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-xl-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-xl-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-xl-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-xl-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}.float-left{float:left!important}.float-right{float:right!important}.float-none{float:none!important}@media (min-width:576px){.float-sm-left{float:left!important}.float-sm-right{float:right!important}.float-sm-none{float:none!important}}@media (min-width:768px){.float-md-left{float:left!important}.float-md-right{float:right!important}.float-md-none{float:none!important}}@media (min-width:992px){.float-lg-left{float:left!important}.float-lg-right{float:right!important}.float-lg-none{float:none!important}}@media (min-width:1200px){.float-xl-left{float:left!important}.float-xl-right{float:right!important}.float-xl-none{float:none!important}}.overflow-auto{overflow:auto!important}.overflow-hidden{overflow:hidden!important}.position-static{position:static!important}.position-relative{position:relative!important}.position-absolute{position:absolute!important}.position-fixed{position:fixed!important}.position-sticky{position:-webkit-sticky!important;position:sticky!important}.fixed-top{position:fixed;top:0;right:0;left:0;z-index:1030}.fixed-bottom{position:fixed;right:0;bottom:0;left:0;z-index:1030}@supports ((position:-webkit-sticky) or (position:sticky)){.sticky-top{position:-webkit-sticky;position:sticky;top:0;z-index:1020}}.sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal}.shadow-sm{box-shadow:0 .125rem .25rem rgba(0,0,0,.075)!important}.shadow{box-shadow:0 .5rem 1rem rgba(0,0,0,.15)!important}.shadow-lg{box-shadow:0 1rem 3rem rgba(0,0,0,.175)!important}.shadow-none{box-shadow:none!important}.w-25{width:25%!important}.w-50{width:50%!important}.w-75{width:75%!important}.w-100{width:100%!important}.w-auto{width:auto!important}.h-25{height:25%!important}.h-50{height:50%!important}.h-75{height:75%!important}.h-100{height:100%!important}.h-auto{height:auto!important}.mw-100{max-width:100%!important}.mh-100{max-height:100%!important}.min-vw-100{min-width:100vw!important}.min-vh-100{min-height:100vh!important}.vw-100{width:100vw!important}.vh-100{height:100vh!important}.stretched-link::after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;pointer-events:auto;content:"";background-color:rgba(0,0,0,0)}.m-0{margin:0!important}.mt-0,.my-0{margin-top:0!important}.mr-0,.mx-0{margin-right:0!important}.mb-0,.my-0{margin-bottom:0!important}.ml-0,.mx-0{margin-left:0!important}.m-1{margin:.25rem!important}.mt-1,.my-1{margin-top:.25rem!important}.mr-1,.mx-1{margin-right:.25rem!important}.mb-1,.my-1{margin-bottom:.25rem!important}.ml-1,.mx-1{margin-left:.25rem!important}.m-2{margin:.5rem!important}.mt-2,.my-2{margin-top:.5rem!important}.mr-2,.mx-2{margin-right:.5rem!important}.mb-2,.my-2{margin-bottom:.5rem!important}.ml-2,.mx-2{margin-left:.5rem!important}.m-3{margin:1rem!important}.mt-3,.my-3{margin-top:1rem!important}.mr-3,.mx-3{margin-right:1rem!important}.mb-3,.my-3{margin-bottom:1rem!important}.ml-3,.mx-3{margin-left:1rem!important}.m-4{margin:1.5rem!important}.mt-4,.my-4{margin-top:1.5rem!important}.mr-4,.mx-4{margin-right:1.5rem!important}.mb-4,.my-4{margin-bottom:1.5rem!important}.ml-4,.mx-4{margin-left:1.5rem!important}.m-5{margin:3rem!important}.mt-5,.my-5{margin-top:3rem!important}.mr-5,.mx-5{margin-right:3rem!important}.mb-5,.my-5{margin-bottom:3rem!important}.ml-5,.mx-5{margin-left:3rem!important}.p-0{padding:0!important}.pt-0,.py-0{padding-top:0!important}.pr-0,.px-0{padding-right:0!important}.pb-0,.py-0{padding-bottom:0!important}.pl-0,.px-0{padding-left:0!important}.p-1{padding:.25rem!important}.pt-1,.py-1{padding-top:.25rem!important}.pr-1,.px-1{padding-right:.25rem!important}.pb-1,.py-1{padding-bottom:.25rem!important}.pl-1,.px-1{padding-left:.25rem!important}.p-2{padding:.5rem!important}.pt-2,.py-2{padding-top:.5rem!important}.pr-2,.px-2{padding-right:.5rem!important}.pb-2,.py-2{padding-bottom:.5rem!important}.pl-2,.px-2{padding-left:.5rem!important}.p-3{padding:1rem!important}.pt-3,.py-3{padding-top:1rem!important}.pr-3,.px-3{padding-right:1rem!important}.pb-3,.py-3{padding-bottom:1rem!important}.pl-3,.px-3{padding-left:1rem!important}.p-4{padding:1.5rem!important}.pt-4,.py-4{padding-top:1.5rem!important}.pr-4,.px-4{padding-right:1.5rem!important}.pb-4,.py-4{padding-bottom:1.5rem!important}.pl-4,.px-4{padding-left:1.5rem!important}.p-5{padding:3rem!important}.pt-5,.py-5{padding-top:3rem!important}.pr-5,.px-5{padding-right:3rem!important}.pb-5,.py-5{padding-bottom:3rem!important}.pl-5,.px-5{padding-left:3rem!important}.m-n1{margin:-.25rem!important}.mt-n1,.my-n1{margin-top:-.25rem!important}.mr-n1,.mx-n1{margin-right:-.25rem!important}.mb-n1,.my-n1{margin-bottom:-.25rem!important}.ml-n1,.mx-n1{margin-left:-.25rem!important}.m-n2{margin:-.5rem!important}.mt-n2,.my-n2{margin-top:-.5rem!important}.mr-n2,.mx-n2{margin-right:-.5rem!important}.mb-n2,.my-n2{margin-bottom:-.5rem!important}.ml-n2,.mx-n2{margin-left:-.5rem!important}.m-n3{margin:-1rem!important}.mt-n3,.my-n3{margin-top:-1rem!important}.mr-n3,.mx-n3{margin-right:-1rem!important}.mb-n3,.my-n3{margin-bottom:-1rem!important}.ml-n3,.mx-n3{margin-left:-1rem!important}.m-n4{margin:-1.5rem!important}.mt-n4,.my-n4{margin-top:-1.5rem!important}.mr-n4,.mx-n4{margin-right:-1.5rem!important}.mb-n4,.my-n4{margin-bottom:-1.5rem!important}.ml-n4,.mx-n4{margin-left:-1.5rem!important}.m-n5{margin:-3rem!important}.mt-n5,.my-n5{margin-top:-3rem!important}.mr-n5,.mx-n5{margin-right:-3rem!important}.mb-n5,.my-n5{margin-bottom:-3rem!important}.ml-n5,.mx-n5{margin-left:-3rem!important}.m-auto{margin:auto!important}.mt-auto,.my-auto{margin-top:auto!important}.mr-auto,.mx-auto{margin-right:auto!important}.mb-auto,.my-auto{margin-bottom:auto!important}.ml-auto,.mx-auto{margin-left:auto!important}@media (min-width:576px){.m-sm-0{margin:0!important}.mt-sm-0,.my-sm-0{margin-top:0!important}.mr-sm-0,.mx-sm-0{margin-right:0!important}.mb-sm-0,.my-sm-0{margin-bottom:0!important}.ml-sm-0,.mx-sm-0{margin-left:0!important}.m-sm-1{margin:.25rem!important}.mt-sm-1,.my-sm-1{margin-top:.25rem!important}.mr-sm-1,.mx-sm-1{margin-right:.25rem!important}.mb-sm-1,.my-sm-1{margin-bottom:.25rem!important}.ml-sm-1,.mx-sm-1{margin-left:.25rem!important}.m-sm-2{margin:.5rem!important}.mt-sm-2,.my-sm-2{margin-top:.5rem!important}.mr-sm-2,.mx-sm-2{margin-right:.5rem!important}.mb-sm-2,.my-sm-2{margin-bottom:.5rem!important}.ml-sm-2,.mx-sm-2{margin-left:.5rem!important}.m-sm-3{margin:1rem!important}.mt-sm-3,.my-sm-3{margin-top:1rem!important}.mr-sm-3,.mx-sm-3{margin-right:1rem!important}.mb-sm-3,.my-sm-3{margin-bottom:1rem!important}.ml-sm-3,.mx-sm-3{margin-left:1rem!important}.m-sm-4{margin:1.5rem!important}.mt-sm-4,.my-sm-4{margin-top:1.5rem!important}.mr-sm-4,.mx-sm-4{margin-right:1.5rem!important}.mb-sm-4,.my-sm-4{margin-bottom:1.5rem!important}.ml-sm-4,.mx-sm-4{margin-left:1.5rem!important}.m-sm-5{margin:3rem!important}.mt-sm-5,.my-sm-5{margin-top:3rem!important}.mr-sm-5,.mx-sm-5{margin-right:3rem!important}.mb-sm-5,.my-sm-5{margin-bottom:3rem!important}.ml-sm-5,.mx-sm-5{margin-left:3rem!important}.p-sm-0{padding:0!important}.pt-sm-0,.py-sm-0{padding-top:0!important}.pr-sm-0,.px-sm-0{padding-right:0!important}.pb-sm-0,.py-sm-0{padding-bottom:0!important}.pl-sm-0,.px-sm-0{padding-left:0!important}.p-sm-1{padding:.25rem!important}.pt-sm-1,.py-sm-1{padding-top:.25rem!important}.pr-sm-1,.px-sm-1{padding-right:.25rem!important}.pb-sm-1,.py-sm-1{padding-bottom:.25rem!important}.pl-sm-1,.px-sm-1{padding-left:.25rem!important}.p-sm-2{padding:.5rem!important}.pt-sm-2,.py-sm-2{padding-top:.5rem!important}.pr-sm-2,.px-sm-2{padding-right:.5rem!important}.pb-sm-2,.py-sm-2{padding-bottom:.5rem!important}.pl-sm-2,.px-sm-2{padding-left:.5rem!important}.p-sm-3{padding:1rem!important}.pt-sm-3,.py-sm-3{padding-top:1rem!important}.pr-sm-3,.px-sm-3{padding-right:1rem!important}.pb-sm-3,.py-sm-3{padding-bottom:1rem!important}.pl-sm-3,.px-sm-3{padding-left:1rem!important}.p-sm-4{padding:1.5rem!important}.pt-sm-4,.py-sm-4{padding-top:1.5rem!important}.pr-sm-4,.px-sm-4{padding-right:1.5rem!important}.pb-sm-4,.py-sm-4{padding-bottom:1.5rem!important}.pl-sm-4,.px-sm-4{padding-left:1.5rem!important}.p-sm-5{padding:3rem!important}.pt-sm-5,.py-sm-5{padding-top:3rem!important}.pr-sm-5,.px-sm-5{padding-right:3rem!important}.pb-sm-5,.py-sm-5{padding-bottom:3rem!important}.pl-sm-5,.px-sm-5{padding-left:3rem!important}.m-sm-n1{margin:-.25rem!important}.mt-sm-n1,.my-sm-n1{margin-top:-.25rem!important}.mr-sm-n1,.mx-sm-n1{margin-right:-.25rem!important}.mb-sm-n1,.my-sm-n1{margin-bottom:-.25rem!important}.ml-sm-n1,.mx-sm-n1{margin-left:-.25rem!important}.m-sm-n2{margin:-.5rem!important}.mt-sm-n2,.my-sm-n2{margin-top:-.5rem!important}.mr-sm-n2,.mx-sm-n2{margin-right:-.5rem!important}.mb-sm-n2,.my-sm-n2{margin-bottom:-.5rem!important}.ml-sm-n2,.mx-sm-n2{margin-left:-.5rem!important}.m-sm-n3{margin:-1rem!important}.mt-sm-n3,.my-sm-n3{margin-top:-1rem!important}.mr-sm-n3,.mx-sm-n3{margin-right:-1rem!important}.mb-sm-n3,.my-sm-n3{margin-bottom:-1rem!important}.ml-sm-n3,.mx-sm-n3{margin-left:-1rem!important}.m-sm-n4{margin:-1.5rem!important}.mt-sm-n4,.my-sm-n4{margin-top:-1.5rem!important}.mr-sm-n4,.mx-sm-n4{margin-right:-1.5rem!important}.mb-sm-n4,.my-sm-n4{margin-bottom:-1.5rem!important}.ml-sm-n4,.mx-sm-n4{margin-left:-1.5rem!important}.m-sm-n5{margin:-3rem!important}.mt-sm-n5,.my-sm-n5{margin-top:-3rem!important}.mr-sm-n5,.mx-sm-n5{margin-right:-3rem!important}.mb-sm-n5,.my-sm-n5{margin-bottom:-3rem!important}.ml-sm-n5,.mx-sm-n5{margin-left:-3rem!important}.m-sm-auto{margin:auto!important}.mt-sm-auto,.my-sm-auto{margin-top:auto!important}.mr-sm-auto,.mx-sm-auto{margin-right:auto!important}.mb-sm-auto,.my-sm-auto{margin-bottom:auto!important}.ml-sm-auto,.mx-sm-auto{margin-left:auto!important}}@media (min-width:768px){.m-md-0{margin:0!important}.mt-md-0,.my-md-0{margin-top:0!important}.mr-md-0,.mx-md-0{margin-right:0!important}.mb-md-0,.my-md-0{margin-bottom:0!important}.ml-md-0,.mx-md-0{margin-left:0!important}.m-md-1{margin:.25rem!important}.mt-md-1,.my-md-1{margin-top:.25rem!important}.mr-md-1,.mx-md-1{margin-right:.25rem!important}.mb-md-1,.my-md-1{margin-bottom:.25rem!important}.ml-md-1,.mx-md-1{margin-left:.25rem!important}.m-md-2{margin:.5rem!important}.mt-md-2,.my-md-2{margin-top:.5rem!important}.mr-md-2,.mx-md-2{margin-right:.5rem!important}.mb-md-2,.my-md-2{margin-bottom:.5rem!important}.ml-md-2,.mx-md-2{margin-left:.5rem!important}.m-md-3{margin:1rem!important}.mt-md-3,.my-md-3{margin-top:1rem!important}.mr-md-3,.mx-md-3{margin-right:1rem!important}.mb-md-3,.my-md-3{margin-bottom:1rem!important}.ml-md-3,.mx-md-3{margin-left:1rem!important}.m-md-4{margin:1.5rem!important}.mt-md-4,.my-md-4{margin-top:1.5rem!important}.mr-md-4,.mx-md-4{margin-right:1.5rem!important}.mb-md-4,.my-md-4{margin-bottom:1.5rem!important}.ml-md-4,.mx-md-4{margin-left:1.5rem!important}.m-md-5{margin:3rem!important}.mt-md-5,.my-md-5{margin-top:3rem!important}.mr-md-5,.mx-md-5{margin-right:3rem!important}.mb-md-5,.my-md-5{margin-bottom:3rem!important}.ml-md-5,.mx-md-5{margin-left:3rem!important}.p-md-0{padding:0!important}.pt-md-0,.py-md-0{padding-top:0!important}.pr-md-0,.px-md-0{padding-right:0!important}.pb-md-0,.py-md-0{padding-bottom:0!important}.pl-md-0,.px-md-0{padding-left:0!important}.p-md-1{padding:.25rem!important}.pt-md-1,.py-md-1{padding-top:.25rem!important}.pr-md-1,.px-md-1{padding-right:.25rem!important}.pb-md-1,.py-md-1{padding-bottom:.25rem!important}.pl-md-1,.px-md-1{padding-left:.25rem!important}.p-md-2{padding:.5rem!important}.pt-md-2,.py-md-2{padding-top:.5rem!important}.pr-md-2,.px-md-2{padding-right:.5rem!important}.pb-md-2,.py-md-2{padding-bottom:.5rem!important}.pl-md-2,.px-md-2{padding-left:.5rem!important}.p-md-3{padding:1rem!important}.pt-md-3,.py-md-3{padding-top:1rem!important}.pr-md-3,.px-md-3{padding-right:1rem!important}.pb-md-3,.py-md-3{padding-bottom:1rem!important}.pl-md-3,.px-md-3{padding-left:1rem!important}.p-md-4{padding:1.5rem!important}.pt-md-4,.py-md-4{padding-top:1.5rem!important}.pr-md-4,.px-md-4{padding-right:1.5rem!important}.pb-md-4,.py-md-4{padding-bottom:1.5rem!important}.pl-md-4,.px-md-4{padding-left:1.5rem!important}.p-md-5{padding:3rem!important}.pt-md-5,.py-md-5{padding-top:3rem!important}.pr-md-5,.px-md-5{padding-right:3rem!important}.pb-md-5,.py-md-5{padding-bottom:3rem!important}.pl-md-5,.px-md-5{padding-left:3rem!important}.m-md-n1{margin:-.25rem!important}.mt-md-n1,.my-md-n1{margin-top:-.25rem!important}.mr-md-n1,.mx-md-n1{margin-right:-.25rem!important}.mb-md-n1,.my-md-n1{margin-bottom:-.25rem!important}.ml-md-n1,.mx-md-n1{margin-left:-.25rem!important}.m-md-n2{margin:-.5rem!important}.mt-md-n2,.my-md-n2{margin-top:-.5rem!important}.mr-md-n2,.mx-md-n2{margin-right:-.5rem!important}.mb-md-n2,.my-md-n2{margin-bottom:-.5rem!important}.ml-md-n2,.mx-md-n2{margin-left:-.5rem!important}.m-md-n3{margin:-1rem!important}.mt-md-n3,.my-md-n3{margin-top:-1rem!important}.mr-md-n3,.mx-md-n3{margin-right:-1rem!important}.mb-md-n3,.my-md-n3{margin-bottom:-1rem!important}.ml-md-n3,.mx-md-n3{margin-left:-1rem!important}.m-md-n4{margin:-1.5rem!important}.mt-md-n4,.my-md-n4{margin-top:-1.5rem!important}.mr-md-n4,.mx-md-n4{margin-right:-1.5rem!important}.mb-md-n4,.my-md-n4{margin-bottom:-1.5rem!important}.ml-md-n4,.mx-md-n4{margin-left:-1.5rem!important}.m-md-n5{margin:-3rem!important}.mt-md-n5,.my-md-n5{margin-top:-3rem!important}.mr-md-n5,.mx-md-n5{margin-right:-3rem!important}.mb-md-n5,.my-md-n5{margin-bottom:-3rem!important}.ml-md-n5,.mx-md-n5{margin-left:-3rem!important}.m-md-auto{margin:auto!important}.mt-md-auto,.my-md-auto{margin-top:auto!important}.mr-md-auto,.mx-md-auto{margin-right:auto!important}.mb-md-auto,.my-md-auto{margin-bottom:auto!important}.ml-md-auto,.mx-md-auto{margin-left:auto!important}}@media (min-width:992px){.m-lg-0{margin:0!important}.mt-lg-0,.my-lg-0{margin-top:0!important}.mr-lg-0,.mx-lg-0{margin-right:0!important}.mb-lg-0,.my-lg-0{margin-bottom:0!important}.ml-lg-0,.mx-lg-0{margin-left:0!important}.m-lg-1{margin:.25rem!important}.mt-lg-1,.my-lg-1{margin-top:.25rem!important}.mr-lg-1,.mx-lg-1{margin-right:.25rem!important}.mb-lg-1,.my-lg-1{margin-bottom:.25rem!important}.ml-lg-1,.mx-lg-1{margin-left:.25rem!important}.m-lg-2{margin:.5rem!important}.mt-lg-2,.my-lg-2{margin-top:.5rem!important}.mr-lg-2,.mx-lg-2{margin-right:.5rem!important}.mb-lg-2,.my-lg-2{margin-bottom:.5rem!important}.ml-lg-2,.mx-lg-2{margin-left:.5rem!important}.m-lg-3{margin:1rem!important}.mt-lg-3,.my-lg-3{margin-top:1rem!important}.mr-lg-3,.mx-lg-3{margin-right:1rem!important}.mb-lg-3,.my-lg-3{margin-bottom:1rem!important}.ml-lg-3,.mx-lg-3{margin-left:1rem!important}.m-lg-4{margin:1.5rem!important}.mt-lg-4,.my-lg-4{margin-top:1.5rem!important}.mr-lg-4,.mx-lg-4{margin-right:1.5rem!important}.mb-lg-4,.my-lg-4{margin-bottom:1.5rem!important}.ml-lg-4,.mx-lg-4{margin-left:1.5rem!important}.m-lg-5{margin:3rem!important}.mt-lg-5,.my-lg-5{margin-top:3rem!important}.mr-lg-5,.mx-lg-5{margin-right:3rem!important}.mb-lg-5,.my-lg-5{margin-bottom:3rem!important}.ml-lg-5,.mx-lg-5{margin-left:3rem!important}.p-lg-0{padding:0!important}.pt-lg-0,.py-lg-0{padding-top:0!important}.pr-lg-0,.px-lg-0{padding-right:0!important}.pb-lg-0,.py-lg-0{padding-bottom:0!important}.pl-lg-0,.px-lg-0{padding-left:0!important}.p-lg-1{padding:.25rem!important}.pt-lg-1,.py-lg-1{padding-top:.25rem!important}.pr-lg-1,.px-lg-1{padding-right:.25rem!important}.pb-lg-1,.py-lg-1{padding-bottom:.25rem!important}.pl-lg-1,.px-lg-1{padding-left:.25rem!important}.p-lg-2{padding:.5rem!important}.pt-lg-2,.py-lg-2{padding-top:.5rem!important}.pr-lg-2,.px-lg-2{padding-right:.5rem!important}.pb-lg-2,.py-lg-2{padding-bottom:.5rem!important}.pl-lg-2,.px-lg-2{padding-left:.5rem!important}.p-lg-3{padding:1rem!important}.pt-lg-3,.py-lg-3{padding-top:1rem!important}.pr-lg-3,.px-lg-3{padding-right:1rem!important}.pb-lg-3,.py-lg-3{padding-bottom:1rem!important}.pl-lg-3,.px-lg-3{padding-left:1rem!important}.p-lg-4{padding:1.5rem!important}.pt-lg-4,.py-lg-4{padding-top:1.5rem!important}.pr-lg-4,.px-lg-4{padding-right:1.5rem!important}.pb-lg-4,.py-lg-4{padding-bottom:1.5rem!important}.pl-lg-4,.px-lg-4{padding-left:1.5rem!important}.p-lg-5{padding:3rem!important}.pt-lg-5,.py-lg-5{padding-top:3rem!important}.pr-lg-5,.px-lg-5{padding-right:3rem!important}.pb-lg-5,.py-lg-5{padding-bottom:3rem!important}.pl-lg-5,.px-lg-5{padding-left:3rem!important}.m-lg-n1{margin:-.25rem!important}.mt-lg-n1,.my-lg-n1{margin-top:-.25rem!important}.mr-lg-n1,.mx-lg-n1{margin-right:-.25rem!important}.mb-lg-n1,.my-lg-n1{margin-bottom:-.25rem!important}.ml-lg-n1,.mx-lg-n1{margin-left:-.25rem!important}.m-lg-n2{margin:-.5rem!important}.mt-lg-n2,.my-lg-n2{margin-top:-.5rem!important}.mr-lg-n2,.mx-lg-n2{margin-right:-.5rem!important}.mb-lg-n2,.my-lg-n2{margin-bottom:-.5rem!important}.ml-lg-n2,.mx-lg-n2{margin-left:-.5rem!important}.m-lg-n3{margin:-1rem!important}.mt-lg-n3,.my-lg-n3{margin-top:-1rem!important}.mr-lg-n3,.mx-lg-n3{margin-right:-1rem!important}.mb-lg-n3,.my-lg-n3{margin-bottom:-1rem!important}.ml-lg-n3,.mx-lg-n3{margin-left:-1rem!important}.m-lg-n4{margin:-1.5rem!important}.mt-lg-n4,.my-lg-n4{margin-top:-1.5rem!important}.mr-lg-n4,.mx-lg-n4{margin-right:-1.5rem!important}.mb-lg-n4,.my-lg-n4{margin-bottom:-1.5rem!important}.ml-lg-n4,.mx-lg-n4{margin-left:-1.5rem!important}.m-lg-n5{margin:-3rem!important}.mt-lg-n5,.my-lg-n5{margin-top:-3rem!important}.mr-lg-n5,.mx-lg-n5{margin-right:-3rem!important}.mb-lg-n5,.my-lg-n5{margin-bottom:-3rem!important}.ml-lg-n5,.mx-lg-n5{margin-left:-3rem!important}.m-lg-auto{margin:auto!important}.mt-lg-auto,.my-lg-auto{margin-top:auto!important}.mr-lg-auto,.mx-lg-auto{margin-right:auto!important}.mb-lg-auto,.my-lg-auto{margin-bottom:auto!important}.ml-lg-auto,.mx-lg-auto{margin-left:auto!important}}@media (min-width:1200px){.m-xl-0{margin:0!important}.mt-xl-0,.my-xl-0{margin-top:0!important}.mr-xl-0,.mx-xl-0{margin-right:0!important}.mb-xl-0,.my-xl-0{margin-bottom:0!important}.ml-xl-0,.mx-xl-0{margin-left:0!important}.m-xl-1{margin:.25rem!important}.mt-xl-1,.my-xl-1{margin-top:.25rem!important}.mr-xl-1,.mx-xl-1{margin-right:.25rem!important}.mb-xl-1,.my-xl-1{margin-bottom:.25rem!important}.ml-xl-1,.mx-xl-1{margin-left:.25rem!important}.m-xl-2{margin:.5rem!important}.mt-xl-2,.my-xl-2{margin-top:.5rem!important}.mr-xl-2,.mx-xl-2{margin-right:.5rem!important}.mb-xl-2,.my-xl-2{margin-bottom:.5rem!important}.ml-xl-2,.mx-xl-2{margin-left:.5rem!important}.m-xl-3{margin:1rem!important}.mt-xl-3,.my-xl-3{margin-top:1rem!important}.mr-xl-3,.mx-xl-3{margin-right:1rem!important}.mb-xl-3,.my-xl-3{margin-bottom:1rem!important}.ml-xl-3,.mx-xl-3{margin-left:1rem!important}.m-xl-4{margin:1.5rem!important}.mt-xl-4,.my-xl-4{margin-top:1.5rem!important}.mr-xl-4,.mx-xl-4{margin-right:1.5rem!important}.mb-xl-4,.my-xl-4{margin-bottom:1.5rem!important}.ml-xl-4,.mx-xl-4{margin-left:1.5rem!important}.m-xl-5{margin:3rem!important}.mt-xl-5,.my-xl-5{margin-top:3rem!important}.mr-xl-5,.mx-xl-5{margin-right:3rem!important}.mb-xl-5,.my-xl-5{margin-bottom:3rem!important}.ml-xl-5,.mx-xl-5{margin-left:3rem!important}.p-xl-0{padding:0!important}.pt-xl-0,.py-xl-0{padding-top:0!important}.pr-xl-0,.px-xl-0{padding-right:0!important}.pb-xl-0,.py-xl-0{padding-bottom:0!important}.pl-xl-0,.px-xl-0{padding-left:0!important}.p-xl-1{padding:.25rem!important}.pt-xl-1,.py-xl-1{padding-top:.25rem!important}.pr-xl-1,.px-xl-1{padding-right:.25rem!important}.pb-xl-1,.py-xl-1{padding-bottom:.25rem!important}.pl-xl-1,.px-xl-1{padding-left:.25rem!important}.p-xl-2{padding:.5rem!important}.pt-xl-2,.py-xl-2{padding-top:.5rem!important}.pr-xl-2,.px-xl-2{padding-right:.5rem!important}.pb-xl-2,.py-xl-2{padding-bottom:.5rem!important}.pl-xl-2,.px-xl-2{padding-left:.5rem!important}.p-xl-3{padding:1rem!important}.pt-xl-3,.py-xl-3{padding-top:1rem!important}.pr-xl-3,.px-xl-3{padding-right:1rem!important}.pb-xl-3,.py-xl-3{padding-bottom:1rem!important}.pl-xl-3,.px-xl-3{padding-left:1rem!important}.p-xl-4{padding:1.5rem!important}.pt-xl-4,.py-xl-4{padding-top:1.5rem!important}.pr-xl-4,.px-xl-4{padding-right:1.5rem!important}.pb-xl-4,.py-xl-4{padding-bottom:1.5rem!important}.pl-xl-4,.px-xl-4{padding-left:1.5rem!important}.p-xl-5{padding:3rem!important}.pt-xl-5,.py-xl-5{padding-top:3rem!important}.pr-xl-5,.px-xl-5{padding-right:3rem!important}.pb-xl-5,.py-xl-5{padding-bottom:3rem!important}.pl-xl-5,.px-xl-5{padding-left:3rem!important}.m-xl-n1{margin:-.25rem!important}.mt-xl-n1,.my-xl-n1{margin-top:-.25rem!important}.mr-xl-n1,.mx-xl-n1{margin-right:-.25rem!important}.mb-xl-n1,.my-xl-n1{margin-bottom:-.25rem!important}.ml-xl-n1,.mx-xl-n1{margin-left:-.25rem!important}.m-xl-n2{margin:-.5rem!important}.mt-xl-n2,.my-xl-n2{margin-top:-.5rem!important}.mr-xl-n2,.mx-xl-n2{margin-right:-.5rem!important}.mb-xl-n2,.my-xl-n2{margin-bottom:-.5rem!important}.ml-xl-n2,.mx-xl-n2{margin-left:-.5rem!important}.m-xl-n3{margin:-1rem!important}.mt-xl-n3,.my-xl-n3{margin-top:-1rem!important}.mr-xl-n3,.mx-xl-n3{margin-right:-1rem!important}.mb-xl-n3,.my-xl-n3{margin-bottom:-1rem!important}.ml-xl-n3,.mx-xl-n3{margin-left:-1rem!important}.m-xl-n4{margin:-1.5rem!important}.mt-xl-n4,.my-xl-n4{margin-top:-1.5rem!important}.mr-xl-n4,.mx-xl-n4{margin-right:-1.5rem!important}.mb-xl-n4,.my-xl-n4{margin-bottom:-1.5rem!important}.ml-xl-n4,.mx-xl-n4{margin-left:-1.5rem!important}.m-xl-n5{margin:-3rem!important}.mt-xl-n5,.my-xl-n5{margin-top:-3rem!important}.mr-xl-n5,.mx-xl-n5{margin-right:-3rem!important}.mb-xl-n5,.my-xl-n5{margin-bottom:-3rem!important}.ml-xl-n5,.mx-xl-n5{margin-left:-3rem!important}.m-xl-auto{margin:auto!important}.mt-xl-auto,.my-xl-auto{margin-top:auto!important}.mr-xl-auto,.mx-xl-auto{margin-right:auto!important}.mb-xl-auto,.my-xl-auto{margin-bottom:auto!important}.ml-xl-auto,.mx-xl-auto{margin-left:auto!important}}.text-monospace{font-family:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace!important}.text-justify{text-align:justify!important}.text-wrap{white-space:normal!important}.text-nowrap{white-space:nowrap!important}.text-truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.text-left{text-align:left!important}.text-right{text-align:right!important}.text-center{text-align:center!important}@media (min-width:576px){.text-sm-left{text-align:left!important}.text-sm-right{text-align:right!important}.text-sm-center{text-align:center!important}}@media (min-width:768px){.text-md-left{text-align:left!important}.text-md-right{text-align:right!important}.text-md-center{text-align:center!important}}@media (min-width:992px){.text-lg-left{text-align:left!important}.text-lg-right{text-align:right!important}.text-lg-center{text-align:center!important}}@media (min-width:1200px){.text-xl-left{text-align:left!important}.text-xl-right{text-align:right!important}.text-xl-center{text-align:center!important}}.text-lowercase{text-transform:lowercase!important}.text-uppercase{text-transform:uppercase!important}.text-capitalize{text-transform:capitalize!important}.font-weight-light{font-weight:300!important}.font-weight-lighter{font-weight:lighter!important}.font-weight-normal{font-weight:400!important}.font-weight-bold{font-weight:700!important}.font-weight-bolder{font-weight:bolder!important}.font-italic{font-style:italic!important}.text-white{color:#fff!important}.text-primary{color:#007bff!important}a.text-primary:focus,a.text-primary:hover{color:#0056b3!important}.text-secondary{color:#6c757d!important}a.text-secondary:focus,a.text-secondary:hover{color:#494f54!important}.text-success{color:#28a745!important}a.text-success:focus,a.text-success:hover{color:#19692c!important}.text-info{color:#17a2b8!important}a.text-info:focus,a.text-info:hover{color:#0f6674!important}.text-warning{color:#ffc107!important}a.text-warning:focus,a.text-warning:hover{color:#ba8b00!important}.text-danger{color:#dc3545!important}a.text-danger:focus,a.text-danger:hover{color:#a71d2a!important}.text-light{color:#f8f9fa!important}a.text-light:focus,a.text-light:hover{color:#cbd3da!important}.text-dark{color:#343a40!important}a.text-dark:focus,a.text-dark:hover{color:#121416!important}.text-body{color:#212529!important}.text-muted{color:#6c757d!important}.text-black-50{color:rgba(0,0,0,.5)!important}.text-white-50{color:rgba(255,255,255,.5)!important}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.text-decoration-none{text-decoration:none!important}.text-break{word-break:break-word!important;overflow-wrap:break-word!important}.text-reset{color:inherit!important}.visible{visibility:visible!important}.invisible{visibility:hidden!important}@media print{*,::after,::before{text-shadow:none!important;box-shadow:none!important}a:not(.btn){text-decoration:underline}abbr[title]::after{content:" (" attr(title) ")"}pre{white-space:pre-wrap!important}blockquote,pre{border:1px solid #adb5bd;page-break-inside:avoid}thead{display:table-header-group}img,tr{page-break-inside:avoid}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}@page{size:a3}body{min-width:992px!important}.container{min-width:992px!important}.navbar{display:none}.badge{border:1px solid #000}.table{border-collapse:collapse!important}.table td,.table th{background-color:#fff!important}.table-bordered td,.table-bordered th{border:1px solid #dee2e6!important}.table-dark{color:inherit}.table-dark tbody+tbody,.table-dark td,.table-dark th,.table-dark thead th{border-color:#dee2e6}.table .thead-dark th{color:inherit;border-color:#dee2e6}}\n' +
    '/*# sourceMappingURL=bootstrap.min.css.map */</style>';
var price;

//POS START
var transactionId;
var interval;
var failer;
var paymentFailCounter;
var paymentAllowed = true;

// function replace_String(string, numberofchar,chartoreplace) {
//
//     return string.substring(0, numberofchar).split("").map(ele => ele = chartoreplace).join("").concat(string.substring(numberofchar, string.length))
//
// }

function TicketsHtml(data, i) {
    var date = data.OperationInfo.TimestampUTC;
    console.log(date);
    var dateArr = date.split(" ");
    var Html = "";
    var CustomerId =  data.Results.Tickets[i].Passenger.IDNumber ;
    var CustomerIdLength = CustomerId.length - 5 ;

    var CustomerIds = CustomerId.substring(0,CustomerIdLength);
    var star = '';
    for(var J =0 ; J<=CustomerIdLength; J++) {
        star+='*';
    }
    CustomerId = star + CustomerIds;
    // var CustomerId =  replace_String(CustomerId, CustomerIdLength,"*");

    Html =
         '<header><div class="row"><div class="col-md-6 left"><p>تاريخ ووقت الطباعة</p><p> ' +
        dateArr[0] +
        "</p><p> " +
        dateArr[1] +
        '</p></div><div class="col-md-6 right"><img src="https://www.saptco.com.sa/Mobile/Logo.aspx?width=414&height=128&ext=.png"></div></div><hr></header>' +
        '<section id="PassengerDetails"><div class="row" style="padding-top: 5px"><div class="col-md-6" id="IDNumber"><p>ID number / رقم الهوية</p><p id="IDNumber_number">' +
        CustomerId +
        '</p></div><div class="col-md-6" id="PassengerName"><p>Passenger Name /  أسم الراكب</p>' +
        data.Results.Tickets[i].Passenger.Name +
        "" +
        '<p id="PassengerName_name"></p></div><div class="col-md-6" id="TicketType"><p>Ticket Type / نوع التذكرة</p><p id="TicketType_type">';
    if(data.Results.Tickets[i].TicketType == "Infant"){
        Html+="Infant - without seat";
    }else if(data.Results.Tickets[i].TicketType == "رضيع"){
        Html+="رضيع - بدون مقعد";
    }else{
        Html+=data.Results.Tickets[i].TicketType;
    }

       Html+= '</p></div><div class="col-md-6" id="ReservationNO"><p>Reservation NO / رقم الحجز</p><p id="ReservationNO_number">' +
        data.Results.PNR +
        "</p></div></div></section>" +
        '<section id="TicketNo"><div class="row"><div class="col-md-12"><p>Ticket No / رقم التذكرة</p><p><img src=https://saptco.com.sa/BarcodeGetImage/GetBarCodeImageHandler.ashx?d=' +
        data.Results.Tickets[i].TicketNumber +
        '&h=150&w=300&bc=FFFFFF&fc=000000&t=Code%20128&il=true&if=png&align=c" id="barcode"></p></div></div></section>' +
        '<section id="FromTo"><div class="row" style="padding-bottom: 15px;"><div class="col-md-6" style="text-align: right;" id="from">' +
        data.Results.Tickets[i].DepartureStation.Name +
        '</div><div class="col-md-6">Form / من</div></div><div class="row" style="padding-bottom: 15px;"><div class="col-md-6" style="text-align: right;" id="to">' +
        data.Results.Tickets[i].ArrivalStation.Name +
        '</div><div class="col-md-6">To / الى</div></div></section>' +
        '<section id="TicketDetails"><div class="row" id="TicketDetailsRow"><div class="col-md-5 left" style="padding-bottom: 15px"><div id="TripNo"><span>Trip No / رقم الرحلة</span><p id="TripNo_number">' +
        data.Results.Tickets[i].TripCode +
        '</p></div><div id="SeatNo"><span>Seat No / رقم المقعد</span><p id="SeatNo_number">' +
        data.Results.Tickets[i].SeatNumber +
        "</p></div></div>" +
        '<div class="col-md-1"></div><div class="col-md-6 right" style="padding-bottom: 15px; margin-inline-start: auto;"><div id="DepartureTime"><span>Departure Time /  وقت المغادرة</span><p id="DepartureTime_date">' +
        data.Results.Tickets[i].DepartureDate.replace('T',' ') +
        '</p></div><div id="ArrivalTime"><span>Arrival Time /  وقت الوصول</span><p id="ArrivalTime_date">' +
        data.Results.Tickets[i].ArrivalDate.replace('T',' ') +
        "</p></div></div></div></section>" +
        '<section id="TotalAmount"><div class="row" id="Text"><div class="col-md-6 english"> Total Amount include VAT</div><div class="col-md-6 arabic"> اجمالي القيمة شامل ضريبة القيمة المضافة</div></div><div class="row" id="Amount"><div class="col-md-6"><span>ريال</span><p>SAR</p></div><div class="col-md-6" style="margin-top: 17px;" id="Amount_price">' +
        data.Results.Tickets[i].Amount +
        "</div></div></section>" +
        '<section id="TicketCondition">';
    // data.Results.Tickets[i].IsTransferable = false;
    // data.Results.Tickets[i].IsRefundable = false;
    if (
        data.Results.Tickets[i].IsTransferable == false ||
        data.Results.Tickets[i].IsTransferable == "false" ||
        data.Results.Tickets[i].IsRefundable == false ||
        data.Results.Tickets[i].IsRefundable == "false"
    )
        Html +=
            '<p style="text-decoration: underline;"> Ticket Condition / شروط التذكرة</p>';

    if (
        data.Results.Tickets[i].IsRefundable == false ||
        data.Results.Tickets[i].IsRefundable == "false"
    )
        Html += "<p> Not Refundable  غير قابلة للاسترداد</p>";

    if (
        data.Results.Tickets[i].IsTransferable == false ||
        data.Results.Tickets[i].IsTransferable == "false"
    )
        Html += "<p> Not Transferable  غير قابلة للتحويل</p>";

    Html +=
        '</section><section style="text-align: center"><p>تطبق الشروط والاحكام. يمكن مراجعة الشروط والاحكام بموقع الشركة الالكتروني</p></section>' +
        '<footer><div class="row"><div style="font-size: 18px;" class="col-md-4" id="email"><p> www.saptco.com.sa </p> </div><div class="col-md-1"><div class= "vertical"></div></div><div style="padding: 20px;font-size: 18px;" class="col-md-7" id="PhoneNumber"> <p>920000877 - Customer Service خدمة العملاء</p></div></div></footer>' +
        "";
    return Html;
}
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
function savebase64AsPDF(folderpath, filename, content, contentType) {
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content, contentType);

    console.log("Starting to write the file :3");

    window.resolveLocalFileSystemURL(folderpath, function (dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, { create: true }, function (file) {
            console.log("File created succesfully.");
            file.createWriter(
                function (fileWriter) {
                    console.log("Writing content to file");
                    fileWriter.write(DataBlob);
                },
                function () {
                    alert(GetResourceText('UnableSaveToFile') + folderpath);
                }
            );
        });
    });
}
function CreatePdfFileFromHtml(fileName, pdfhtml) {
    pdf.htmlToPDF({
        data: pdfhtml,
        documentSize: "A4",
        landscape: "portrait",
        type: "base64"
    },function(base64){
        var contentType = "application/pdf";
        var folderpath = "file:///storage/emulated/0/DCIM/";
        savebase64AsPDF(folderpath, fileName, base64, contentType);
    },function(err){
console.log(err);
    });
}
function CreatePdfSetTimeOut(TicketNumber,HtmlPdf){
        CreatePdfFileFromHtml(TicketNumber + ".pdf",HtmlPdf);
        console.log(TicketNumber);
        console.log(HtmlPdf);
}
function GenerateTicket(PNR, PhoneNumber) {
    var serverName = "http://integtest.saptco.sa";
    //var serverName = 'https://mobile.saptco.com.sa';
    var urlAjax = serverName + "/Reserv/Reservations/" + PNR + "/" + PhoneNumber;
    $$.ajax({
        method: "Get",
        url: urlAjax,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: "application/json",
        },
        success: function (data, status, xhr) {
            data = JSON.parse(data);
            var htmlContentArray ='<html><head><style>' +bootstrapCode
                 +"</style><style>body {font-weight: bold;font-size: 27px;}header {padding-right:5px;padding-left:5px;height:9% !important;white-space: pre-line; }" +
                ".right {text-align: end;}#PassengerDetails{padding: 10px;text-align: center;height:19% !important;}#TicketNo {height:15% !important;text-align: center;}.col-md-6,.col-md-4,.col-md-7{padding-top: 20px;}#FromTo {height:9% !important;text-align: center;border: 2px solid black;border-radius: 25px;width: 90%;margin-left: 5%;}#TicketDetails{padding-top: 15px;}#TicketDetailsRow{height:13% !important;width: 90%;margin-left: 5%;}" +
                "#TicketDetails .row .left,#TicketDetails .row .right {text-align: center;border: 2px solid black;border-radius: 25px;}#TotalAmount{height:8% !important;width: 90%;margin-left: 5%;text-align: left;}#TotalAmount #Text {text-align: center;}#TotalAmount #Amount {width: 50%;margin-left: 25%;text-align: center;}#TotalAmount #Text .english{text-align: left;}#TicketCondition {width: 90%;margin-left: 5%;padding-top:5% !important;text-align: center;height:15% !important;}footer {width: 100%;height: 7%;font-size: smaller;}footer .row{height: 100%;width: 70%;margin-left: 11%;}.vertical {border-left: 2px solid black;height: 70%;}footer .row #email{margin-top: 29px;text-align: center;}footer .row #PhoneNumber{margin-top: 29px;text-align: center;}footer .row #TextFooter{height:5% !important;text-align: center;}#barcodeImg {width: 300px !important;height: 15% !important;}" +
                '</style><body>';
            for (var i = 0; i < data.Results.Tickets.length; i++) {
                if(i >= 1){
                    // htmlContentArray +="<br>";
                }
                htmlContentArray += TicketsHtml(data, i);

            }
            htmlContentArray +="</body></html>";
            console.log(htmlContentArray);
                CreatePdfSetTimeOut("Ticket",htmlContentArray);
        },
        error: function (xhr, data, status) {
            console.log(status);
        },
    });
}
function WriteRequestTransaction(amount, transactionid) {

    // var DirectoryPath = "file:///storage/emulated/0/DCIM/Transaction/Response";
    // GetFilesListFromDirectory(DirectoryPath);


    var blob = new Blob([amount + '00;' + transactionid], {type: 'text/plain'});
    var folderpath = "file:///storage/emulated/0/DCIM/Transaction/Request";
    window.resolveLocalFileSystemURL(folderpath, function (dir) {
        console.log("Access to the directory granted succesfully");
        var filename = transactionid+'.txt';
        console.log(filename);
        dir.getFile(filename, {create: true}, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(blob);
            }, function () {
                myApp.alert(GetResourceText('UnableSaveToFile') + folderpath);
            });
        });
    });

}
function fail(e) {
    failer += 1;
    if (failer == 60){
        var reservationInfo = GetLocalDataObject("ReservationSummary");
        price = reservationInfo.Results.TotalPrice;
        clearInterval(interval);
        myApp.hidePreloader();
        // paymentFailCounter++;
        LogPayment(false,price,"POS");
        if(paymentFailCounter == 3){
            // myApp.alert("Payment failed, please try again");
            myApp.alert(GetResourceText("PaymentFailed"), function () {
                mainView.router.back({url: 'Home.html', force: true});
            });
        }else{
            myApp.alert(GetResourceText("PaymentFailed"));
            console.log("transaction "+paymentFailCounter);
        }
        // alert('Transaction Faild');

    }
}
function XmlToJson(xml){

    var x2js = new X2JS();
    var string = JSON.stringify(x2js.xml_str2json(xml));
    return JSON.parse(string);

}
function RemoveFileFromDirectory(name){

    var path = "file:///storage/emulated/0/DCIM/Transaction/Response/";
    window.resolveLocalFileSystemURL(path, function(dir) {
        dir.getFile(name, {create:false}, function(fileEntry) {
            fileEntry.remove(function(){
                // The file has been removed succesfully
            },function(error){
                alert(error);
                // Error deleting the file
            },function(){
                alert("The file doesn't exist");
                // The file doesn't exist
            });
        });
    });
}
function RemoveFile(){
    var summary = GetLocalDataObject("ReservationSummary");
    var Pnr = summary.Results.PNR;
    var path = "file:///storage/emulated/0/DCIM/Transaction/Response/";
    window.resolveLocalFileSystemURL(path, function(dir) {
        dir.getFile(Pnr+paymentFailCounter+".txt", {create:false}, function(fileEntry) {
            fileEntry.remove(function(){
                // The file has been removed succesfully
            },function(error){
                alert(error);
                // Error deleting the file
            },function(){
                alert("The file doesn't exist");
                // The file doesn't exist
            });
        });
    });
}
function LogPaymentCash(IsPaid,amount,paymentMethod){
    var todayDate = new Date();
    var todayISO = todayDate.toISOString();
    var dotPosotion =todayISO.indexOf('.');
    var subDate = todayISO.substring(0,dotPosotion);

    var today = subDate;


    var summary = GetLocalDataObject("ReservationSummary");
    var Pnr = summary.Results.PNR;
    var MobileNumber = summary.Results.MobileNumber;
    var urlAjax = "http://integtest.saptco.sa/Reserv/Reservations/PaymentNotification";
    var headers = {
        'Accept-Language': GetServiceLanguage(),
        Accept: 'application/json',
        'x-api-key':'h3XEayxh5VJ7WmzG',
    };
    if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null)
        headers = {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json',
            'X-UUID': GetLocalData('UUID'),
            'x-api-key':'h3XEayxh5VJ7WmzG',
        };

    if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
        headers['X-UserId'] = GetLocalData('UserId');
        headers['X-SDPId'] = GetLocalData('SDPId');
    }

    var postData={
        "PNR": Pnr,
        "TransactionId": Pnr,
        "IsPaid": IsPaid,
        "Amount": amount,
        "PaymentDate": today,
        "PaymentMethod": paymentMethod,
        "Remarks": "Sample"
    };
    console.log(postData);
    $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            contentType: 'application/json',
            dataType: 'json',
            data:JSON.stringify(postData),
            headers: headers,
            success: function (data, status, xhr) {
                console.log(data);
                var summary = GetLocalDataObject("ReservationSummary");
                var Pnr = summary.Results.PNR;
                var MobileNumber = summary.Results.MobileNumber;
                GenerateTicket(Pnr,MobileNumber);
                myApp.hidePreloader();
                mainView.router.load({
                    url: 'Home.html'
                });
            },
            error: function (status, xhr) {
                myApp.hidePreloader();
                myApp.alert(GetResourceText("PaymentNotAvailable"), function () {
                    mainView.router.back({url: 'Home.html', force: true});
                });
            }
        });
}
function LogPayment(IsPaid,amount,paymentMethod){
    var todayDate = new Date();
    var todayISO = todayDate.toISOString();
    var dotPosotion =todayISO.indexOf('.');
    var subDate = todayISO.substring(0,dotPosotion);

    var today = subDate;


    var summary = GetLocalDataObject("ReservationSummary");
    var Pnr = summary.Results.PNR;
    var MobileNumber = summary.Results.MobileNumber;
    var urlAjax = "http://integtest.saptco.sa/Reserv/Reservations/PaymentNotification";
    var headers = {
        'Accept-Language': GetServiceLanguage(),
        Accept: 'application/json',
        'x-api-key':'h3XEayxh5VJ7WmzG',
    };
    if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null)
        headers = {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json',
                'X-UUID': GetLocalData('UUID'),
            'x-api-key':'h3XEayxh5VJ7WmzG',
        };
    if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
        headers['X-UserId'] = GetLocalData('UserId');
        headers['X-SDPId'] = GetLocalData('SDPId');
    }

    var postData={
        "PNR": Pnr,
        "TransactionId": Pnr+paymentFailCounter,
        "IsPaid": IsPaid,
        "Amount": amount,
        "PaymentDate": today,
        "PaymentMethod": paymentMethod,
        "Remarks": "Sample"
    };
    console.log(postData);
    $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            contentType: 'application/json',
            dataType: 'json',
            data:JSON.stringify(postData),
            headers: headers,
            success: function (data, status, xhr) {
                console.log(data);
                RemoveFile();
                if(IsPaid == true){
                    GenerateTicket(Pnr,MobileNumber);
                }

            },
            error: function (status, xhr) {
                myApp.alert(GetResourceText("PaymentNotAvailable"), function () {
                    mainView.router.back({url: 'Home.html', force: true});
                });
            }
        });
}
function LogPaymentFromDirectory(IsPaid,amount,paymentMethod,transactionId){
    var todayDate = new Date();
    var todayISO = todayDate.toISOString();
    var dotPosotion =todayISO.indexOf('.');
    var subDate = todayISO.substring(0,dotPosotion);

    var today = subDate;

    var transactionIdArray = transactionId.split('.');
    var transaction = transactionIdArray[0];

    var summary = GetLocalDataObject("ReservationSummary");
    var Pnr = transaction.substr(0,transaction.length - 1);
    var urlAjax = "http://integtest.saptco.sa/Reserv/Reservations/PaymentNotification";
    var headers = {
        'Accept-Language': GetServiceLanguage(),
        Accept: 'application/json',
        'x-api-key':'h3XEayxh5VJ7WmzG',
    };
    if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null)
        headers = {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json',
            'X-UUID': GetLocalData('UUID'),
            'x-api-key':'h3XEayxh5VJ7WmzG',
        };
    if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
        headers['X-UserId'] = GetLocalData('UserId');
        headers['X-SDPId'] = GetLocalData('SDPId');
    }

    var postData={
        "PNR": Pnr,
        "TransactionId": transaction,
        "IsPaid": IsPaid,
        "PaidAmount": amount,
        "PaymentDate": today,
        "PaymentMethod": paymentMethod,
        "Remarks": "Sample"
    };
    console.log(postData);
    $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            contentType: 'application/json',
            dataType: 'json',
            data:JSON.stringify(postData),
            headers: headers,
            success: function (data, status, xhr) {
                console.log(data);
                RemoveFileFromDirectory(transactionId);

            },
            error: function (status, xhr) {
                paymentAllowed = false;
                myApp.alert(GetResourceText("PaymentNotAvailable"), function () {
                    mainView.router.back({url: 'Home.html', force: true});
                });
            }
        });
}
function gotFile(fileEntry) {

    clearInterval(interval);
    fileEntry.file(function (file) {

        var reader = new FileReader();
        reader.onloadend = function (e) {
            var xml = this.result;
            //var xml = '<?xml version="1.0" encoding="windows-1256" standalone="no" ?><madaArchives><madaTransactionResult><Retailer RetailerNameEng="mada Test" RetailerNameArb="������ ���" address_eng_1="Al-Olaya, Riyadh" address_eng_2="" address_arb_1="�����ǡ������" address_arb_2="����" download_phone="" /><Performance StartDateTime="11032020114615" EndDateTime="11032020114615" /><BankId>SABB</BankId><MerchantID>650999000911   </MerchantID><TerminalID>1234567812121250</TerminalID><MCC>5411</MCC><STAN>000100</STAN><Version>4.316</Version><RRN>007108000100</RRN><CardScheme ID="MC" Arabic="����� ����" English="MASTERCARD" /><ApplicationLabel Arabic="����� ����" English="MASTERCARD" /><PAN>523970******6228</PAN><CardExpiryDate>1213</CardExpiryDate><TransactionType Arabic="����" English="PURCHASE"/><Amounts ArabicCurrency="����"  EnglishCurrency="SAR"><Amount ArabicName="���� ������" EnglishName="PURCHASE AMOUNT" >1.41</Amount></Amounts><Result Arabic="������" English="APPROVED"/><CardholderVerification Arabic="�� ������ ������ ������" English="CARDHOLDER VERIFIED BY SIGNATURE"/><RetailerCopy ArabicName = "���� ������" EnglishName = "Retailer Copy"><SignatureLineText Arabic="������ ���� �������" English="CUSTOMER SIGN BELOW"/></RetailerCopy><CustomerCopy ArabicName = "���� ������" EnglishName = "Customer Copy"><SignatureLineText Arabic="" English=""/></CustomerCopy><AcknowledgementConfirmationText Arabic="����� ��� ����� �� ����� ������" English="DEBIT MY ACCOUNT FOR THE AMOUNT"/><ApprovalCode Arabic = "��� ��������" English="APPROVAL CODE">144421</ApprovalCode><EMV_Tags><PosEntryMode>DIPPED</PosEntryMode><ResponseCode>000</ResponseCode><TerminalStatusCode>00</TerminalStatusCode><AID>A0000000041010</AID><TVR>0840001000</TVR><TSI>E800</TSI><CVR>5E0300</CVR><ACI>00</ACI><AC>EBD2908BDBEA216E</AC></EMV_Tags><Campaign><QrCodeData>110000000000000000014100010020200311114553SABBMASTERCARD1234567812121250650999000911   71030155434C10015035411007108000100144421000</QrCodeData><CampaignText></CampaignText></Campaign><AdditionalData>12345</AdditionalData></madaTransactionResult></madaArchives>';
            responseJson = XmlToJson(xml);
            console.log("response POS  Result " + responseJson.madaArchives.madaTransactionResult.Result._English);
            console.log("response POS  Amount " + responseJson.madaArchives.madaTransactionResult.Amounts.Amount.__text);
            console.log("response POS  AdditionalData " + responseJson.madaArchives.madaTransactionResult.AdditionalData);
            var response = {
                "Amount":responseJson.madaArchives.madaTransactionResult.Amounts.Amount.__text,
                "Result":responseJson.madaArchives.madaTransactionResult.Result._English,
                "AdditionalData":responseJson.madaArchives.madaTransactionResult.AdditionalData
            };
            var paymentStatus  = responseJson.madaArchives.madaTransactionResult.Result._English;

            if(paymentStatus == "APPROVED"){
                // myApp.alert("Payment succeeded");
                // paymentFailCounter++;
                LogPayment(true,response.Amount,"POS");
                myApp.alert(GetResourceText("PaymentSucceeded"), function () {
                    mainView.router.back({url: 'Home.html', force: true});
                });
            }else{
                // paymentFailCounter++;
                LogPayment(false,response.Amount,"POS");

                if(paymentFailCounter == 3){
                    myApp.alert(GetResourceText("PaymentFailed"), function () {
                        mainView.router.back({url: 'Home.html', force: true});
                    });
                }else{
                    myApp.alert(GetResourceText("PaymentFailed"));
                }
            }


            // alert(JSON.stringify(response));
            // RemoveFile();
        }
        reader.readAsText(file);
    });
    myApp.hidePreloader();
}

function GetFileFromDirectory(fileEntry) {

    fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            var xml = this.result;
            //var xml = '<?xml version="1.0" encoding="windows-1256" standalone="no" ?><madaArchives><madaTransactionResult><Retailer RetailerNameEng="mada Test" RetailerNameArb="������ ���" address_eng_1="Al-Olaya, Riyadh" address_eng_2="" address_arb_1="�����ǡ������" address_arb_2="����" download_phone="" /><Performance StartDateTime="11032020114615" EndDateTime="11032020114615" /><BankId>SABB</BankId><MerchantID>650999000911   </MerchantID><TerminalID>1234567812121250</TerminalID><MCC>5411</MCC><STAN>000100</STAN><Version>4.316</Version><RRN>007108000100</RRN><CardScheme ID="MC" Arabic="����� ����" English="MASTERCARD" /><ApplicationLabel Arabic="����� ����" English="MASTERCARD" /><PAN>523970******6228</PAN><CardExpiryDate>1213</CardExpiryDate><TransactionType Arabic="����" English="PURCHASE"/><Amounts ArabicCurrency="����"  EnglishCurrency="SAR"><Amount ArabicName="���� ������" EnglishName="PURCHASE AMOUNT" >1.41</Amount></Amounts><Result Arabic="������" English="APPROVED"/><CardholderVerification Arabic="�� ������ ������ ������" English="CARDHOLDER VERIFIED BY SIGNATURE"/><RetailerCopy ArabicName = "���� ������" EnglishName = "Retailer Copy"><SignatureLineText Arabic="������ ���� �������" English="CUSTOMER SIGN BELOW"/></RetailerCopy><CustomerCopy ArabicName = "���� ������" EnglishName = "Customer Copy"><SignatureLineText Arabic="" English=""/></CustomerCopy><AcknowledgementConfirmationText Arabic="����� ��� ����� �� ����� ������" English="DEBIT MY ACCOUNT FOR THE AMOUNT"/><ApprovalCode Arabic = "��� ��������" English="APPROVAL CODE">144421</ApprovalCode><EMV_Tags><PosEntryMode>DIPPED</PosEntryMode><ResponseCode>000</ResponseCode><TerminalStatusCode>00</TerminalStatusCode><AID>A0000000041010</AID><TVR>0840001000</TVR><TSI>E800</TSI><CVR>5E0300</CVR><ACI>00</ACI><AC>EBD2908BDBEA216E</AC></EMV_Tags><Campaign><QrCodeData>110000000000000000014100010020200311114553SABBMASTERCARD1234567812121250650999000911   71030155434C10015035411007108000100144421000</QrCodeData><CampaignText></CampaignText></Campaign><AdditionalData>12345</AdditionalData></madaTransactionResult></madaArchives>';
            responseJson = XmlToJson(xml);
            console.log("response POS  Result " + responseJson.madaArchives.madaTransactionResult.Result._English);
            console.log("response POS  Amount " + responseJson.madaArchives.madaTransactionResult.Amounts.Amount.__text);
            console.log("response POS  AdditionalData " + responseJson.madaArchives.madaTransactionResult.AdditionalData);
            var response = {
                "Amount":responseJson.madaArchives.madaTransactionResult.Amounts.Amount.__text,
                "Result":responseJson.madaArchives.madaTransactionResult.Result._English,
                "AdditionalData":responseJson.madaArchives.madaTransactionResult.AdditionalData
            };
            var paymentStatus  = responseJson.madaArchives.madaTransactionResult.Result._English;

            if(paymentStatus == "APPROVED"){
                LogPaymentFromDirectory(true,response.Amount,"POS",fileEntry.name);
            }else{
                LogPaymentFromDirectory(false,response.Amount,"POS",fileEntry.name);
            }
        }
        reader.readAsText(file);
    });
    myApp.hidePreloader();
}
// Changes XML to JSON
function ReadTransactionResponse() {

    var folderpath = "file:///storage/emulated/0/DCIM/Transaction/Response/";
    myApp.hidePreloader();
    myApp.showPreloader(GetResourceText("Loading"));
    failer=0;
    setTimeout(function () {
        interval = setInterval(CheckFileExists, 1000);
    },30000);

}

function CheckFileExists() {
    var summary = GetLocalDataObject("ReservationSummary");
    var Pnr = summary.Results.PNR;
    var path = "file:///storage/emulated/0/DCIM/Transaction/Response/"+Pnr+paymentFailCounter+".txt";
    console.log(path);
    console.log(Pnr);
    window.resolveLocalFileSystemURL(path, gotFile, fail);

}
function GetFilesListFromDirectory(path){
    window.resolveLocalFileSystemURL(path,
        function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {

                    for(var i=0;i<entries.length;i++){
                        console.log(path+"/"+entries[i].name);
                        window.resolveLocalFileSystemURL(path+"/"+entries[i].name, GetFileFromDirectory, fail);
                    }
                },
                function (err) {
                    console.log(err);
                }
            );
        }, function (err) {
            console.log(err);
        }
    );
}

function fileDoesNotExist() {
    alert("file does not exist");
}

function getFSFail(evt) {
    console.log(evt.target.error.code);
}

//POS END
myApp.onPageInit('paymentoptions', function (page) {
    // GenerateTicket('24689104','9666464646464');
    paymentAllowed = true;
    var DirectoryPath = "file:///storage/emulated/0/DCIM/Transaction/Response";
    GetFilesListFromDirectory(DirectoryPath);
    paymentFailCounter=0;

    var reservationInfo = GetLocalDataObject("ReservationSummary");

    var transaction = GetLocalDataObject("TripBookList");
    transactionId = reservationInfo.Results.PNR;
    console.log(transactionId);

    price = reservationInfo.Results.TotalPrice;
    console.log(price);
    if (reservationInfo.Results.IsSadadEnabled == false) {
        $$("#btnGoToSadad").css("display", "none");
    }
    if (reservationInfo.Results.IsVisaEnabled == false) {
        $$("#btnGotoVisa").css("display", "none");
    }
    if (reservationInfo.Results.IsMADAEnabled == false) {
        $$("#btnGotoMada").css("display", "none");
    }
    if (reservationInfo.Results.IsPOSEnabled == false) {
        $$("#btnGotoPOS").css("display", "none");
    }
    if (reservationInfo.Results.IsCashEnabled == false) {
        $$("#btnGotoCash").css("display", "none");
    }
    if (reservationInfo.Results.IsSadadEnabled == false &&
        reservationInfo.Results.IsVisaEnabled == false &&
        reservationInfo.Results.IsMADAEnabled == false &&
        reservationInfo.Results.IsPOSEnabled == false &&
        reservationInfo.Results.IsCashEnabled == false) {
        $$("#btnGotoCash").css("display", "block");
    }

    $$("#btnGotoCash").on('click', function () {

        var reservationInfo = GetLocalDataObject("ReservationSummary");
        price = reservationInfo.Results.TotalPrice;

        myApp.modal({
            title: GetResourceText('alert'),
            text: GetResourceText("lblReceived") +' '+ price + ' ' + GetResourceText("SAR"),
            buttons: [
                {
                    text: GetResourceText('lblConfirmd'),
                    onClick: function () {
                        myApp.showPreloader();
                        LogPaymentCash(true, price, 'cash')
                    }
                },
                {
                    text: GetResourceText('Cancel'),

                }
            ]
        });

    });

    $$("#btnGoToSadad").on('click', function () {
        var sadadPNR = CollectSadadPnr();
        POSTReservationsSadad(sadadPNR);
    });
    $$("#btnGotoVisa").on('click', function () {
        var ref = window.open(reservationInfo.Results.VisaPaymentURL, '_blank', 'location=yes');
        ref.addEventListener('loadstart', function (event) {
        });
        ref.addEventListener('exit', function (event) {
            //get ticket info
            mainView.router.back({url: 'Home.html', force: true});
            // searchReservationByEmail();
        });
    });
    $$("#btnGotoVisaLink").attr("href", reservationInfo.Results.VisaPaymentURL);
    $$("#btnGotoMada").on('click', function () {
        var ref = window.open(reservationInfo.Results.MADAPaymentURL, '_blank', 'location=yes');
        ref.addEventListener('loadstart', function (event) {
        });
        ref.addEventListener('exit', function (event) {
            mainView.router.back({url: 'Home.html', force: true});
        });
    });
    $$("#btnGotoMadaLink").attr("href", reservationInfo.Results.MADAPaymentURL);
    $$("#btnGotoPOS").on('click', function () {
        paymentFailCounter++;
        // WriteRequestTransaction(price, transactionId.substring(1)+paymentFailCounter);
        if(paymentAllowed == true){
            WriteRequestTransaction(price, transactionId+paymentFailCounter);
            ReadTransactionResponse();
        }else{
            myApp.alert(GetResourceText("PaymentNotAvailable"), function () {
                mainView.router.back({url: 'Home.html', force: true});
            });
        }

    });
});

myApp.onPageInit('TransferPaymentOption', function (page) {
    var reservationInfo = GetLocalDataObject("ReservationSummaryTransfer");
    var ticketsInfo = reservationInfo.TicketsInfo
    var totalAmount = reservationInfo.TotalAmount;
    var token = reservationInfo.Token;
    var visaUrl = '';
    var madaUrl = '';
    if (reservationInfo.IsSadadEnabled == false) {
        $$("#btnGoToSadadTransfer").css("display", "none");
    }
    if (reservationInfo.IsVisaEnabled == false) {
        $$("#btnGotoVisaTransfer").css("display", "none");
    }
    if (reservationInfo.IsMADAEnabled == false) {
        $$("#btnGotoMadaTransfer").css("display", "none");
    }

    $$("#btnGoToSadadTransfer").on('click', function () {
        var sadadPNR = CollectSadadPnrTransfer();
        POSTReservationsSadad(sadadPNR);
    });
    $$("#btnGotoVisaTransfer").on('click', function () {
        visaUrl = reservationInfo.ReturnUrl;
        var ref = cordova.InAppBrowser.open(visaUrl, '_blank', {usewkwebview: 'no'});
        ref.addEventListener('loadstart', function (event) {
        });
        ref.addEventListener('exit', function (event) {
            //get ticket info
            mainView.router.back({url: 'Home.html', force: true});
        });
    });
    $$("#btnGotoVisaLinkTransfer").attr("href", visaUrl);
    $$("#btnGotoMadaTransfer").on('click', function () {
        madaUrl = reservationInfo.ReturnUrl;
        var ref = cordova.InAppBrowser.open(madaUrl, '_blank', {usewkwebview: 'no'});
        ref.addEventListener('loadstart', function (event) {
        });
        ref.addEventListener('exit', function (event) {
            //get ticket info
            mainView.router.back({url: 'Home.html', force: true});
        });
    });
    $$("#btnGotoMadaLinkTransfer").attr("href", madaUrl);
});


function POSTReservationsSadad(postData) {
    myApp.showPreloader(GetResourceText("Loading"));
    // var urlAjax = "https://mobile.saptco.com.sa/Reservation/Reservations/Sadad";
    var urlAjax = "http://integtest.saptco.sa/Reserv/Reservations/Sadad";
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
            success: function (data, status, xhr) {
                myApp.hidePreloader("Loading");
                data.Results.Amount = price;
                SaveLocalObject("SadadPayemntInfo", data.Results);
                mainView.router.load({
                    url: 'Sdadpay.html'
                });
            },
            error: function (status, xhr) {
                myApp.hidePreloader("Loading");
                if (status.status == 400) {
                    mainView.router.load({
                        url: 'Sdadpay.html'
                    });
                } else {
                    myApp.alert(GetResourceText("GenericError"), GetResourceText('Error'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            }
        });
}


/***********************end of Payemnt options ***************************/

/*****************************  Sadad Payemnt  ***************************/
myApp.onPageInit('Sdadpay', function (page) {
    var sadadInfo = GetLocalDataObject("SadadPayemntInfo");
    fillFormData(sadadInfo, "Results");

    $$(document).on('click', '#btnSearch', function () {
        mainView.router.load({
            url: 'Home.html'
        });
    });

    $$(document).on('click', '#btnPrint', function () {
        var summary = GetLocalDataObject("ReservationSummary");
        var mobileNum = summary.Results.MobileNumber;
        var Pnr = summary.Results.PNR;
        printPDfFile(Pnr, mobileNum);
    });
});
myApp.onPageInit('SdadpayEvent', function (page) {
    var sadadInfo = GetLocalDataObject("SadadPayemntInfoEvent");
    fillFormDataEvent(sadadInfo, "Results");
    $$("#btnSearch").on('click', function () {
        mainView.router.load({
            url: 'Home.html'
        });
    });
});
/***********************end of  Sadad Payemnt  ***************************/

/*********************************Passengers******************************/
var tax = 0;
var seatDiv;
var ticketNo;
myApp.onPageInit('Passengers', function (page) {
    if (logo == 1) {
        $$("#Rlogo4").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 52px;height:33px ">');
        $$("#logoTitle4").addClass("blue-logo");
    } else {
        $$("#Rlogo4").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -4px">');
        $$("#logoTitle4").addClass("orange-color");

    }
    var passengerTicketsArray = GetLocalDataObject("PassengerTicketViewData");
    passengerTickerDetails = passengerTicketsArray[0];
    $$('#TxtPassengerName').text(passengerTickerDetails.PassengerName);
    $$('#txtPassengerType').text(GetResourceText(passengerTickerDetails.PassengerType));
    $$('#txtNationalityName').text(passengerTickerDetails.Nationality.Name);
    $$('#txtGender').text(passengerTickerDetails.Gender);
    $$('#txtDateOfBirth').text(passengerTickerDetails.DateOfBirth);
    var allItemsHtml = "";
    var selectedTripType = GetLocalDataObject("selectedStationType");
    var tripType = GetLocalData("TypeMulti");
    DeleteLocalData("seatExist");
    for (var i = 0; i < passengerTicketsArray.length; i++) {
        passengerTickerDetails = passengerTicketsArray[i];
        tax = passengerTickerDetails.Tax;
        prevSeatNumber = passengerTickerDetails.SeatNumber;
        var imageSrc = "img/goingbus.png";
        if (passengerTickerDetails.Direction != "Onward") {
            imageSrc = "img/returnArrow.png";
        }

        allItemsHtml = allItemsHtml +
            ' <div class="DepartureContainerDiv container-box-shaddow content-container" id="GoingDataContainer">            ' +
            '     <div class="row no-gutter" style="background-color: #FFF5E2;">            ' +
            '         <div class="col-100 selected-tab" id="lblGoingTic" style=" font-weight: 300; font-size: 20px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblGoingTic") + '</div>        ' +
            '     </div>                ' +
            '     <div class="row" style="width:100% " style="background-color: #FFF5E2;">  ' +
            '         <div class="col-100 center-text" style="background-color: #FFF5E1">  ' +
            '             <img src=' + imageSrc + ' alt="Trip" class="trip-go-img passenger-trip-go-img"style="background-color: #FFF5E1" />                ' +
            '         </div>            ' +
            '     </div>                ' +
            '     <div class="summary-section row" style="background-color: #FFF5E2;">      ' +
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
            '     <div class="summary-section row" style="background-color: #FFF5E2;">      ' +
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
            '     <div class="row passenger-div-separator" style="background-color: #FFF5E2;">               ' +
            '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblTicketNumber") + '</div>            ' +
            '         <div class="col-50" id="txtTicketNumber">' + passengerTickerDetails.TicketNumber + '</div>     ' +
            '     </div>                ';
        if (passengerTickerDetails.SeatNumber != null && passengerTickerDetails.SeatNumber != "" && passengerTickerDetails.PassengerType.toLowerCase() != "infant" != "Infant") {
            SaveLocalObject("seatExist", "yes");
            allItemsHtml = allItemsHtml + '     <div class="row passenger-div-separator" id="SeatNumber" style="background-color: #FFF5E2;" >               ' +
                '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblSeatNumber") + '</div>            ' +
                '         <div class="col-35" id="txtSeatNumber' + i + '">' + prevSeatNumber + '</div>     ' +
                '         <div class="col-15 button" id="editIcon' + i + '">' + GetResourceText("changeSeat") + '</div> ' +
                '     </div>                ';
        }
        allItemsHtml = allItemsHtml +
            '     <div class="row passenger-div-separator" style="background-color: #FFF5E2;">               ' +
            '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("PassengerlblTicketDate") + '</div>              ' +
            '         <div class="col-50" id="txtdate">' + passengerTickerDetails.TripDate.replace(" 00:00", "") + '</div>             ' +
            '     </div>                ' +
            '     <div class="row passenger-div-separator" style="background-color: #FFF5E2;">               ' +
            '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("taxAmount") + '</div>               ' +
            '         <div class="col-50" id="taxAmount">' + tax + GetResourceText("PassengerSAR") + '</div>              ' +
            '     </div>                ' +
            '     <div class="row passenger-div-separator" style="background-color: #FFF5E2;">               ' +
            '         <div class="col-50" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + GetResourceText("totalPrice") + '</div>               ' +
            '         <div class="col-50" id="totalPrice">' + (passengerTickerDetails.Amount) + GetResourceText("PassengerSAR") + '</div>              ' +
            '     </div>                ' +


            ' </div> '

    }
    $$("#list-Tickets-container").html(allItemsHtml);
    var imgArClassName = GetLocalData("imgLanguageClass");
    $$('.passenger-trip-go-img').addClass(imgArClassName);
    $$("#editIcon0").on('click', function () {
        var tripType = GetLocalData("ReservationType");
        var tripMulti = GetLocalData("TypeMulti");
        if (tripType == "OneWay" && tripMulti == null) {
            seatDiv = $$("#txtSeatNumber0");
            mainView.router.load({url: "SeatSelect.html"});
        } else if (tripType == "Round") {
            ticketNo = 0;
            seatDiv = $$("#txtSeatNumber0");
            prevSeatNumber = document.getElementById("txtSeatNumber0").innerHTML;
            mainView.router.load({url: "SeatSelect.html"});
        } else {
            ticketNo = 0;
            seatDiv = $$("#txtSeatNumber0");
            prevSeatNumber = document.getElementById("txtSeatNumber0").innerHTML;
            mainView.router.load({url: "SeatSelect.html"});
        }
    });
    $$("#editIcon1").on('click', function () {
        var tripType = GetLocalData("ReservationType");
        if (tripType == "Round") {
            ticketNo = 1;
            seatDiv = $$("#txtSeatNumber1");
            prevSeatNumber = document.getElementById("txtSeatNumber1").innerHTML;
            mainView.router.load({url: "SeatSelect.html"});
        } else {
            ticketNo = 1;
            seatDiv = $$("#txtSeatNumber1");
            prevSeatNumber = document.getElementById("txtSeatNumber1").innerHTML;
            mainView.router.load({url: "SeatSelect.html"});
        }
    });
    $$("#editIcon2").on('click', function () {
        ticketNo = 2;
        seatDiv = $$("#txtSeatNumber2");
        prevSeatNumber = document.getElementById("txtSeatNumber2").innerHTML;
        mainView.router.load({url: "SeatSelect.html"});

    });
    $$("#editIcon3").on('click', function () {
        ticketNo = 3;
        seatDiv = $$("#txtSeatNumber3");
        prevSeatNumber = document.getElementById("txtSeatNumber3").innerHTML;
        mainView.router.load({url: "SeatSelect.html"});

    });
    $$("#editIcon4").on('click', function () {
        ticketNo = 4;
        seatDiv = $$("#txtSeatNumber4");
        prevSeatNumber = document.getElementById("txtSeatNumber4").innerHTML;
        mainView.router.load({url: "SeatSelect.html"});

    });
    $$("#editIcon5").on('click', function () {
        ticketNo = 5;
        seatDiv = $$("#txtSeatNumber5");
        prevSeatNumber = document.getElementById("txtSeatNumber5").innerHTML;
        mainView.router.load({url: "SeatSelect.html"});

    });
    $$("#editIcon6").on('click', function () {
        ticketNo = 6;
        seatDiv = $$("#txtSeatNumber6");
        prevSeatNumber = document.getElementById("txtSeatNumber6").innerHTML;
        mainView.router.load({url: "SeatSelect.html"});

    });
    $$("#PassContinue").on('click', function () {
        mainView.router.load({url: "Trip-summry.html"});
    });
});
/*************************************************************************/

/*************************Fav List ***************************************/

myApp.onPageInit('favorite_list', function (page) {
    if (logo == 1) {
        $$("#Rlogo8").html('<img src="img/economic-logo.png" alt="SAPTCO" style="width: 40px;height:30px ">');
        $$("#logoTitle8").addClass("blue-logo");
    } else {
        $$("#Rlogo8").html('<img src="img/vip-logo-new.png" alt="SAPTCO" style="width: 60px;height:40px;margin-top: -7px">');
        $$("#logoTitle8").addClass("orange-color");

    }
    var passengerUpdateInfo = GetLocalDataObject("passengerUpdateDetials");
    var favoritList = GetLocalDataObject("favList_" + passengerUpdateInfo.itemType);

    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.fav-list',
        searchIn: '.item-title'
    });

    if (favoritList) {
        var myList = myApp.virtualList('.fav-list', {
            // Array with items data
            items: favoritList,
            // Custom render function to render item's HTML
            renderItem: function (index, item) {
                return '<li class="item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-title clickable-Fav" data-index =' + index + ' style="width:100%">' + item.Name + '</div>' +
                    '</div> </li>';
            },
            // search item by item
            searchByItem: function (query, index, item) {
                // Check if title contains query string
                if (item && item != null) {
                    var name = item.Name.toLowerCase();
                    var queryString = query.trim().toLowerCase();
                    if (name.indexOf(queryString) >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        });
    } else {
        $$(".searchbar").css("display", "none");
    }


    $$('.fav-list').on('click', '.clickable-Fav', function () {
        var itemIndex = Number($$(this).data('index'));
        var favoritList = GetLocalDataObject("favList_" + passengerUpdateInfo.itemType);
        var updatedItem = favoritList[itemIndex];
        var userIsUpdated = false;

        switch (passengerUpdateInfo.itemType) {
            case "adult":
                passengerArray = GetLocalDataObject("AdultPassengers");
                var passengersquery = JSLINQ(passengerArray).Where(function (item) {
                    return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType);
                });
                if (passengersquery.items.length > 0) {
                    myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                } else {
                    passengerArray[Number(passengerUpdateInfo.itemIndex)] = updatedItem;
                    SaveLocalObject("AdultPassengers", passengerArray);
                    userIsUpdated = true;
                }

                break;
            case "child":
                passengerArray = GetLocalDataObject("ChildsArray");
                var passengersquery = JSLINQ(passengerArray).Where(function (item) {
                    return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType);
                });
                if (passengersquery.items.length > 0) {
                    myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                } else {
                    passengerArray[Number(passengerUpdateInfo.itemIndex)] = updatedItem;
                    SaveLocalObject("ChildsArray", passengerArray);
                    userIsUpdated = true;
                }
                break;
            case "infant":
                passengerArray = GetLocalDataObject("InfantsPassengersArray");
                var passengersquery = JSLINQ(passengerArray).Where(function (item) {
                    return (item.IDNumber == updatedItem.IDNumber && item.IDType == updatedItem.IDType);
                });
                if (passengersquery.items.length > 0) {
                    myApp.alert(GetResourceText("PassengerAlreadyAdded"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                } else {
                    passengerArray[Number(passengerUpdateInfo.itemIndex)] = updatedItem;
                    SaveLocalObject("InfantsPassengersArray", passengerArray);
                    userIsUpdated = true;
                }
                break;
        }
        if (userIsUpdated) {
            mainView.router.reloadPreviousPage('PassengersInfo.html');
            mainView.router.back({
                url: 'PassengersInfo.html'
            });
        }
    });
});

/*************************************************************************/

/***************************setting***************************************/
myApp.onPageInit('setting', function (page) {
    if (GetApplicationLanguage() == "en") {
        $$("#cboEnglishCheck").prop('checked', true);
        $$("#cboArabicCheck").prop('checked', false);
    } else {
        $$("#cboArabicCheck").prop('checked', true);
        $$("#cboEnglishCheck").prop('checked', false);
    }


    $$("#btnSaveLanguage").on('click', function () {
        DeleteLocalData("StationsStorage");
        DeleteLocalData("StationsStorageVip");
        if ($$("#cboEnglishCheck")[0].checked) {
            ChangeLanguage('en');
        } else {
            ChangeLanguage('ar');
        }

        mainView.router.load({
            url: 'Home.html'
        });
        location.reload();
    });

});
/***************************End of setting********************************/

/**************************History ***************************************/
myApp.onPageInit('historytab', function (page) {
    $$(document).on('click', '#feedback', function () {
        mainView.router.load({
            url: 'feedback.html'
        });
    });
    Gethistory();

    function Gethistory() {
        myApp.showPreloader(GetResourceText("Loading"));

        var authHeader = GetLocalData("authHeader");
        $$.ajax(
            {
                // url: "https://mobile.saptco.com.sa/Reservation/Reservations/History",
                url: "http://integtest.saptco.sa/Reserv/Reservations/History",
                method: "Get",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json',
                        "Authorization": authHeader
                    },
                success: function (data, xhr, param) {
                    myApp.hidePreloader();
                    var objectData = JSON.parse(data);
                    fillBookingHistory(objectData.Results);
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    if (xhr.status == 401) {
                        myApp.alert(GetResourceText('errLoginToViewHistory'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    } else {
                        myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }

                }
            });
    }

    $$(".history-virtualList").on("click", ".btn-Booking-Details", function () {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveLocalData("resno", pnr);
        SaveLocalData("phoneno", phoneNumber);
        // GETReservationsPnrMobileNumber(pnr, phoneNumber);
    });

    function fillBookingHistory(bookingHistory) {
        $$(".history-virtualList").on('click', '.btn-history-feedback', function () {
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
            renderItem: function (index, item) {
                var lblDepartFrom = GetResourceText("lblDepartFrom");
                var lblArrivalTo = GetResourceText("lblArrivalTo");
                var lblDepartureOn = GetResourceText("lblDepartureOn");
                var lblReturnOn = GetResourceText("lblReturnOn");
                var lblTotalTicketPrice = GetResourceText("lblTotalTicketPrice");
                var lblFeedback = GetResourceText("lblFeedback");
                var lblDetails = GetResourceText("lblDetails");
                var lblPnrNumber = GetResourceText("lblPnrNumber");
                var dsiplayReturn = "block";
                if (!item.ReturnDate || item.ReturnDate == "") {
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

myApp.onPageBeforeInit('Home', function () {
    $$(".navbar-inner").css("background-color", "transparent");
    $$(".navbar-inner").css("display", "none");
    if (GetApplicationLanguage() == "ar") {
        $$('#hEco').addClass("homeAr");
        $$('#hVip').addClass("homeAr");
        $$('#hLimo').addClass("homeAr");
        $$('#hBus').addClass("homeAr");
        $$('#flipBack1').removeClass("flip");
        $$('#flipBack2').removeClass("flip");
        $$('#flipBack3').removeClass("flip");
        $$('#flipBack4').removeClass("flip");
        $$(".arrow").attr("src", "img/PrevArrow.png");
    } else {
        $$('#hEco').addClass("homeEn");
        $$('#hVip').addClass("homeEn");
        $$('#hLimo').addClass("homeEn");
        $$('#hBus').addClass("homeEn");
        $$('#flipBack1').addClass("flip");
        $$('#flipBack2').addClass("flip");
        $$('#flipBack3').addClass("flip");
        $$('#flipBack4').addClass("flip");
        $$(".arrow").attr("src", "img/NextArrow.png");

    }
    // var diameter = GetLocalData('ScreenDiameter');
    // console.log(diameter);
    // if (diameter > 6.45) {
    //     $$('.HomeBlock').removeClass("mob-margin");
    //     $$('.Card-st').removeClass("mob-card-st");
    //     $$('.Card-st1').removeClass("mob-card-st");
    //     $$('.Card-st2').removeClass("mob-card-st");
    //     $$('.Card-st3').removeClass("mob-card-st");
    //     $$('.HomeBottomRow').removeClass("mob-bottom-row");
    //     $$('.HomeSwiper').removeClass("mob-swiper");
    //     $$('.HomeBlock').addClass("ipad-margin");
    //     $$('.Card-st').addClass("ipad-card-st");
    //     $$('.Card-st1').addClass("ipad-card-st");
    //     $$('.Card-st2').addClass("ipad-card-st");
    //     $$('.Card-st3').addClass("ipad-card-st");
    //     $$('.HomeBottomRow').addClass("ipad-bottom-row");
    //     $$('.HomeSwiper').addClass("ipad-swiper");
    // } else {
    //     $$('.HomeBlock').addClass("mob-margin");
    //     $$('.Card-st').addClass("mob-card-st");
    //     $$('.Card-st1').addClass("mob-card-st");
    //     $$('.Card-st2').addClass("mob-card-st");
    //     $$('.Card-st3').addClass("mob-card-st");
    //     $$('.HomeBottomRow').addClass("mob-bottom-row");
    //     $$('.HomeSwiper').addClass("mob-swiper");
    // }
});
myApp.onPageInit('Home', function (page) {
    // GenerateTicket('24689137','966501157223');
    $$("#SellerData").hide();
    $$("#KioskData").hide();
    if (GetLocalData('UUID') != 'null' && GetLocalData('UUID') != null){
        $$("#KioskData").show();
        if (GetApplicationLanguage() == "ar"){
            $$("#KioskSelfService").html("الخدمة الذاتية");
        }else{
            $$("#KioskSelfService").html("Self Service");
        }
        }

    if(GetLocalData('SDPId') != 'null' && GetLocalData('SDPId') != null){
        $$("#SellerData").show();
        if (GetApplicationLanguage() == "ar"){
            $$("#SellerUserName").html("اسم المستخدم:"+GetLocalData("SellerUserName"));
            $$("#SellerSdp").html(" مركز البيع:"+GetLocalData("SDPName"));
        }else{
            $$("#SellerUserName").html("User Name:"+GetLocalData("SellerUserName"));
            $$("#SellerSdp").html("SDP:"+GetLocalData("SDPName"));
        }
    }
    GetMessage();
    getBanner();
    if (GetApplicationLanguage() == "ar") {
        $$('#hEco').addClass("homeAr");
        $$('#hVip').addClass("homeAr");
        $$('#hLimo').addClass("homeAr");
        $$('#hBus').addClass("homeAr");
        $$('#flipBack1').removeClass("flip");
        $$('#flipBack2').removeClass("flip");
        $$('#flipBack3').removeClass("flip");
        $$('#flipBack4').removeClass("flip");
        $$(".arrow").attr("src", "img/PrevArrow.png");
    } else {
        $$('#hEco').addClass("homeEn");
        $$('#hVip').addClass("homeEn");
        $$('#hLimo').addClass("homeEn");
        $$('#hBus').addClass("homeEn");
        $$('#flipBack1').addClass("flip");
        $$('#flipBack2').addClass("flip");
        $$('#flipBack3').addClass("flip");
        $$('#flipBack4').addClass("flip");
        $$(".arrow").attr("src", "img/NextArrow.png");
    }

    //$$("#").addClass("active");
    SaveLocalData("IsConnectionAlert", "false");
    document.addEventListener("offline", function () {
        var showMessage = (GetLocalData("IsConnectionAlert") == "false");
        if (showMessage) {
            SaveLocalData("IsConnectionAlert", "true");

            myApp.alert(GetResourceText("ErrInterNetConnection"), GetResourceText('alert'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
        var pages = ["CargoReservationData", "CargoReservationDataLocation", "CargoRequestItemsList", "CargoReservationRequest", "CargoSucess",
            "Rent_Bus_Details", "Rent_bus_Location", "CCRequestItemsList", "Rent_Bus_home", "BusSucess", "LimoReservationData", "LimoReservationDataLocations", "LimoRequestItemsList", "LimoReservationtypes",
            "LimoSucess"];

        var pageObject = mainView.activePage.name;
        var pageIndex = pages.indexOf(pageObject);
        if (pageIndex >= 0) {
            //mainView.router.load({ url: 'Home.html' });
        }
    }, false);

    $$("body").on("open", ".picker-modal", function () {
        $$(this).find(".toolbar").removeClass("CandCToolbarStyle");
        $$(this).find(".toolbar").removeClass("cargoToolbarStyle");
        if (mainView.activePage.name == "CargoReservationData" || mainView.activePage.name == "CargoReservationRequest") {
            $$(this).find(".toolbar").addClass("cargoToolbarStyle");
        }

        if (mainView.activePage.name == "Rent_Bus_Details" || mainView.activePage.name == "Rent_Bus_home") {
            $$(this).find(".toolbar").addClass("CandCToolbarStyle");
        }
    });
    $$(document).on('DOMNodeInserted', '.pac-container', function () {
        $$('.pac-item, .pac-item span', this).addClass('no-fastclick');
    });

    function initializeSearchMap() {

        new google.maps.places.Autocomplete(
            (document.getElementById('autocomplete')), {
                types: ['geocode']
            });
    }

    var profileInfo = GetLocalDataObject("storedprofile");
    if (profileInfo) {
        if (GetApplicationLanguage() == "en") {
            $$(".mainTitle").text(GetResourceText("titleone").replace("To SAPTCO", profileInfo.FullName));
        } else {
            $$(".mainTitle").text(GetResourceText("titleone").replace("في سابتكو", profileInfo.FullName));
        }
    }
});

function GetVersion() {
    $$.ajax(
        {
            url: "http://integtest.saptco.sa/reserv/UserDevices/getSetting/Mobileversion",
            // url: "https://mobile.saptco.com.sa/Reservation/UserDevices/getSetting/Mobileversion",
            method: "Get",
            success: function (data, xhr, param) {
                var appVersion = "4.2.0";
                var publishVersion = data.replace(/['"]+/g, '');
                if (publishVersion <= appVersion) {

                } else {
                    var publishVersionLSub = publishVersion.substring(0, 3);
                    var appVersionLSub = appVersion.substring(0, 3);
                    var publishVersionRSub = publishVersion.substring(4);
                    var appVersionRSub = appVersion.substring(4);
                    if (appVersionLSub != publishVersionLSub) {
                        myApp.alert(GetResourceText("PleaseUpdate"), GetResourceText("alert"), function () {
                            var url = 'https://itunes.apple.com/us/app/saptco/id1074204412?mt=8';
                            if (device.platform != 'iOS')
                                url = 'https://play.google.com/store/apps/details?id=com.saptco.bus2';
                            window.open(url, '_system');
                            navigator.app.exitApp();
                        });
                    } else if (publishVersionRSub != appVersionRSub) {
                        myApp.confirm(GetResourceText("PleaseUpdate"), GetResourceText("alert"), function () {
                            var url = 'https://itunes.apple.com/us/app/saptco/id1074204412?mt=8';
                            if (device.platform != 'iOS')
                                url = 'https://play.google.com/store/apps/details?id=com.saptco.bus2';
                            window.open(url, '_system');
                            navigator.app.exitApp();
                        });
                    }
                }
            },
            error: function (xhr, status) {
            }
        });
}

function GetMessage() {
    $$.ajax(
        {
            url: "http://integtest.saptco.sa/reserv/UserDevices/getSetting/hajjMessage",
            // url: "https://mobile.saptco.com.sa/Reservation/UserDevices/getSetting/hajjMessage",
            method: "Get",
            headers:
                {
                    'Accept-Language': GetApplicationLanguage(),
                    Accept: 'application/json'
                },
            success: function (data, xhr, param) {
                if (data)
                    SaveLocalData("AdMessage", data);
                else
                    DeleteLocalData("AdMessage");
            },
            error: function (xhr, status) {

            }
        });
}

myApp.onPageInit('feedback', function (page) {
    var profileInfo = GetLocalDataObject("storedprofile");
    if (profileInfo) {
        $$("#txtName").val(profileInfo.FullName);
        $$("#txtPhoneNUmber").val(profileInfo.MobileNumber.replace(" ", ""));
    }

    var ratingValue = 0;
    $$(".rate1").on('click', function () {
        ratingValue = 1;
    })

    $$(".rate2").on('click', function () {
        ratingValue = 2;
    })

    $$(".rate3").on('click', function () {
        ratingValue = 3;
    })

    $$(".rate4").on('click', function () {
        ratingValue = 4;
    })

    $$(".rate5").on('click', function () {
        ratingValue = 5;
    })

    $$("#submitReview").on('click', function () {
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
        if (validationResult == ValidationSucessVal) {
            postFeedback(requestBody);
        } else {
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    })

    function postFeedback(postData) {
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

                success: function (data, status, xhr) {
                    myApp.hidePreloader();
                    mainView.router.back({
                        url: 'historytab.html'
                    });
                    myApp.alert(GetResourceText("feedBackSentSuccess"), GetResourceText('alert'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText("errorNotAbleFeedback"), GetResourceText('alert'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
    }
});

/****************************End of feedback******************************/

function PostTripsManageRes(ticketnumber, searchid) {
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

            success: function (data, status, xhr) {

            },
            error: function (xhr, status) {
                myApp.hidePreloader();
                myApp.alert(GetResourceText("NotTripsInSelectedDate"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
}

function GetManageTrips(ticketnumber, searchdate) {
    myApp.showPreloader(GetResourceText("Loading"));
    $$.ajax({
        url: 'https://mobile.saptco.com.sa/Reservation/Reservations/transfer/' + ticketnumber + '/' + searchdate,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr) {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);
        },
        error: function (xhr, status) {
            myApp.hidePreloader();
            myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}

/*******************Booking *********************/

myApp.onPageInit('mybooking', function (page) {
    $$("#txtCountryCode").on("click", function () {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar') {
            myApp.smartSelectOpen('#countriesAr');
        } else {
            myApp.smartSelectOpen('#countriesEn');
        }
    });

    $$("#SmartSelectValuepickEn").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode").val($$("#countriesSelect").val());
    });

    $$("#SmartSelectValuepick").on("DOMSubtreeModified", function () {
        $$("#txtCountryCode").val($$("#countriesSelectAr").val());
    });

    $$(".div_click").on("click", function () {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function () {
        var element = $$(this).parent().find("select")[0], worked = false;
        if (document.createEvent) { // all browsers
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            worked = element.dispatchEvent(e);
        } else if (element.fireEvent) { // ie
            worked = element.fireEvent("onmousedown");
        }
    })
    $$("#btnMybooking").on("click", function () {
        GetAllBooking();
    })

    function GetAllBooking() {
        myApp.showPreloader("Loading");
        var authHeader = GetLocalData("authHeader");
        $$.ajax(
            {
                // url: "https://mobile.saptco.com.sa/Reservation/Reservations/MyReservationsV2",
                url: "http://integtest.saptco.sa/Reserv/Reservations/MyReservationsV2",
                method: "Get",
                headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json',
                        "Authorization": authHeader
                    },
                success: function (data, xhr, param) {
                    myApp.hidePreloader();
                    var objectData = JSON.parse(data);
                    SaveLocalObject("AllBookingData", objectData);
                    mainView.router.load({
                        url: 'Booking.html'
                    });

                },
                error: function (xhr, param) {
                    myApp.hidePreloader();
                    if (xhr.status == 401) {
                        myApp.alert(GetResourceText('errLoginToViewBookings'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    } else if (xhr.status == 404) {
                        myApp.alert(GetResourceText("noBookingFound"), GetResourceText('Error'));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    } else {
                        myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }

                }
            });
    }
});

myApp.onPageInit('booking', function (page) {
    var bookingData = GetLocalDataObject("AllBookingData");
    if (bookingData) {
        fillMyBooking(bookingData.Bookings, false);
        fillMyBooking(bookingData.History, true);
    }
    $$("#btnSearch").on("click", function () {
        mainView.router.back({
            url: 'mybooking.html'
        });
    });
    $$("#list-booking-container").on("click", ".btn-Booking-Details", function () {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveLocalData("resno", pnr);
        SaveLocalData("phoneno", phoneNumber);
        SaveLocalObject("confirmedDate", 1);
        // GETReservationsPnrMobileNumberNo2(pnr, phoneNumber);
    });
    $$("#list-booking-container").on('click', '.btn-history-feedback', function () {
        var pnrValue = $$(this).data("pnr");
        SaveLocalData("hisotryPNR", pnrValue);
        mainView.router.load({
            url: 'feedback.html'
        });
    });
    $$("#list-booking-container").on("click", ".btn-Add-to-cal", function () {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        var dir = $$(this).data("direction");
        SaveReservationsToCalinder(pnr, phoneNumber, dir);
    });
});

//isHistory
function fillMyBooking(bookings, isHistory) {
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
    var dateArray = [];
    var tempDate;
    if (GetApplicationLanguage() == "en") {
        var border = "flip";
    } else {
        var border = "";
    }
    for (var i = 0; i < bookings.length; i++) {
        var departDate;
        var returnDate;
        var departQuery = JSLINQ(bookings[i].Trips[0].Tickets).Where(function (item) {
            return item.Direction != "Return"
        });
        if (departQuery.items.length > 0) {
            departDate = departQuery.items[0].DepartureDateString;
            dateArray = departDate.split('/');
            tempDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
            departDate = tempDate + " - " + departQuery.items[0].DepartureTimeString;
        }
        var returnQuery = JSLINQ(bookings[i].Trips[0].Tickets).Where(function (item) {
            return item.Direction == "Return"
        });
        if (returnQuery.items.length > 0) {
            returnDate = returnQuery.items[0].DepartureDateString;
            dateArray = returnDate.split('/');
            tempDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
            returnDate = tempDate + " - " + returnQuery.items[0].DepartureTimeString;
        }
        var index = i;
        var item = bookings[i];
        var dsiplayReturn = "";
        var buttonsHtml = "";
        if (item.IsValid) {
            resStatus = GetResourceText("ResStatucConfirmed")
        }
        if (!item.ReturnDate || item.ReturnDate == "") {
            dsiplayReturn = 'style="display:none"';
        }
        var displayTransfer = "none";
        if (item.Trips[0].Tickets[0].IsTransferable) {
            //displayTransfer = "block";
        }
        if (item.FeedbackEnabled) {

            buttonsHtml = '<div class="row" style="width:100%">' +
                '<div class ="col-50">' +
                '<div class="bg-color-s-dark-orange2 color-black btn-Booking-Details"    data-pnr ="' + item.PNR + '" data-phoneNumber ="' + item.Mobile + '" > ' +
                lblDetails +
                '</div>        ' +
                '</div>  ' +
                '<div class ="col-50">' +
                '<div class="bg-black color-s-orange btn-history-feedback" data-pnr ="' + item.PNR + '"  > ' +
                lblFeedback +
                '</div>' +
                '</div>' +
                '</div>';
        } else {
            if (isHistory) {
                buttonsHtml = '<div class="schedule-search-button btn-Booking-Details no-padding border-rounding" style="background-color: #8B6A19 !important; width:100%; text-align: center;height:10% !important;"   data-pnr ="' + item.PNR + '" data-phoneNumber ="' + item.Mobile + '" > ' +
                    lblDetails +
                    '</div>'
                ;
            } else {
                buttonsHtml = '<div class="schedule-search-button btn-Booking-Details no-padding border-rounding" style=" background-color: #8B6A19 !important;width: 100%; text-align: center;height:10% !important;"   data-pnr ="' + item.PNR + '" data-phoneNumber ="' + item.Mobile + '" > ' +
                    lblDetails +
                    '      </div>';
            }
        }
        myList = myList + '<li><div class="content-block content-container no-top-margins no-padding">' +
            '<div class="row no-gutter" data-completeID="' + index + '">' +
            '          <div class="schedual-section" style="padding:2px;background-color: white!important;border-radius:10px;height:auto;width: 100%">       ' +
            '              <div class="row">       ' +

            '                          <div class="col-50" style="height: 15% !important;padding:2px">  ' + lblDepartFrom +
            '                          </div>   ' +
            '                          <div class="col-50" id="Locations_DepartureStationsName">     ' +
            item.Trips[0].DepartureStation.Name +
            '                          </div>   ' +
            '              </div>               ' +
            '          </div>  ' +
            '          <div class="schedual-section" style="background-color: white!important;border-radius:10px;height:auto;width: 100%">       ' +

            '              <div class="row">         ' +
            '                  <div class="col-50" style="height: 30px;padding:2px">  ' + lblArrivalTo +
            '                      </div>       ' +

            '                        <div class="col-50" id="Locations_ArrivleStationsName">       ' +
            item.Trips[0].ArrivalStation.Name +
            '                  </div>           ' +
            '              </div>               ' +
            '          </div>  ' +
            '          <div class="schedual-section" style="background-color: white!important;border-radius:10px;height:auto;width: 100%">       ' +

            '             <div class="row">    ' +
            '                         <div class="col-50" style="height: 30px;padding:2px">  ' + lblDepartureOn + '   </div>   ' +
            ' <div class="col-50"> ' + departDate + '    </div>   ' +
            '                    </div>' +

            '              <div class="row " id="divReturnDate" ' + dsiplayReturn + '>    ' +

            '                    <div class="col-80">' +
            '                      <div class="row">' +
            '                        <div class="col-100 schedule-sub-title color-s-dark-orange"  style="height: 30px;line-height: 30px;padding: 3px;"> ' + lblReturnOn + '   </div>   ' +
            '                      </div>' +
            '                    <div class="row">' +
            '                      <div class="col-100 schedule-sub-Value " style="height: 30px;line-height: 35px; direction: ltr !important;"> ' + returnDate + '    </div>   ' +
            '                    </div>' +
            '                    </div>' +
            '            </div>           ' +
            '</div>' +
            '          <div class="schedual-section" style="background-color: white!important;border-radius:10px;height:auto;width: 100%">       ' +

            '<div class="row ">' +
            '         <div class="col-50" style="height: 30px;padding:2px">' +
            lblPnrNumber +
            '                              </div>  ' +
            '                   <div class="col-50" >   ' +
            item.PNR +
            '                              </div>  ' +
            '                          </div>   ' +
            '                      </div>       ' +

            '          <div class="schedual-section" style="background-color: white!important;border-radius:10px;height:auto;width: 100%">       ' +

            '                  <div class="row">' +
            '         ' +
            '         <div class="col-50" style="height: 30px;padding:2px">' +
            lblTotalTicketPrice +
            '                              </div>  ' +
            '         <div class="col-50" >' + item.Trips[0].TotalPrice + SAR +
            '                              </div>  ' +
            '                          </div>   ' +
            '                      </div>       ' +

            '          <div class="schedual-section" style="background-color: white!important;border-radius:10px;height:auto;width: 100%">       ' +

            '                  <div class="row">' +
            '         <div class="col-50" style="padding:2px">' + lblResStatus +
            '                              </div>  ' +
            '         <div class="col-50">' + resStatus +
            '                              </div>  ' +
            '                          </div>   ' +
            '                      </div>       ' +
            buttonsHtml +
            '         </div>  ' +
            '      </div>  </li>';
    }
    $$("#list-booking-container").html(myList);
}

/**********************print*******************/
function printPDfFile(pnr, mobileNumber) {
    var lang = GetServiceLanguage();
    // var link = "https://mobile.saptco.com.sa/Reservation/Reservations/file/" + lang + "/" + mobileNumber + "/" + pnr + ".pdf";
    var link = "http://integtest.saptco.sa/Reserv/Reservations/file/" + lang + "/" + mobileNumber + "/" + pnr + ".pdf";
    var ref = window.open(link, '_system', 'location=yes');
    ref.addEventListener('loadstart', function (event) {
        alert('start: ' + event.url);
    });
    ref.addEventListener('loadstop', function (event) {
        alert('stop: ' + event.url);
    });
    ref.addEventListener('loaderror', function (event) {
        alert('error: ' + event.message);
    });
    ref.addEventListener('exit', function (event) {
        alert(event.type);
    });
}

function PdfViewer() {
}

// PdfViewer.prototype.showPdf = function (url) {
//     PhoneGap.exec(null, null, "PdfViewer", "showPdf", [url]);
// };
//
// cordova.addConstructor(function () {
//     window.pdfViewer = new PdfViewer();
//
//     // backwards compatibility
//     window.plugins = window.plugins || {};
//     window.plugins.pdfViewer = window.pdfViewer;
// });
