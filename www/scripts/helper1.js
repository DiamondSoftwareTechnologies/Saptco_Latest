//JavaScript source code

myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
    });
});


myApp.onPageInit('forget_password', function (page) {
    $$("#btnSend").on("click", function () {
        var str = $$("#txtUserEmailAdd").val();

        var validationresult = ValidateForgetPassword(str);

        if (validationresult != ValidationSucessVal) {
            myApp.alert(GetResourceText(validationresult), GetResourceText("Error"));
        }
        else {
            var email = str.replace("@", "%40");
            myApp.showPreloader("Loading");

            $$.ajax(
                {
                    // url: 'https://mobile.saptco.com.sa/Reservation/Profile/ResetPassword?email=' + email,
                    url: 'http://integtest.saptco.sa/Reserv/Profile/ResetPassword?email=' + email,
                    method: "Post",
                    contentType: 'application/json',
                    data: "{ }",
                    headers:
                        {
                            'Accept-Language': GetServiceLanguage(),
                            Accept: 'application/json'
                        },
                    success: function (data, xhr, param) {
                        myApp.hidePreloader();
                        var massage = GetResourceText("AnEmailWillBeSend");
                        myApp.alert(massage, GetResourceText("Alert"));
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        myApp.hidePreloader();
                    }
                });
        }

    });
});

myApp.onPageInit('login', function (page) {

    $$('#btnForgetPassword').on("click", function () {
        mainView.router.load({url: 'forget_password.html'});
    });

    loging();
    profile();

    $$('#Login').on('click', function () {
        var username = $$('#txtUserName').val();
        var password = $$('#txtPassword').val();
        var jas = {
            "username": username,
            "password": password

        }
        var jas = JSON.stringify(jas);
        //  PostRegstration(json);
        var validationresult = Validatelogin(jas);
        if (validationresult == ValidationSucessVal) {

            SaveLocalData("username", username);
            SaveLocalData("Password", password);
            GetProfile(username, password);
        }
        else {
            var massage = GetResourceText(validationresult);
            myApp.alert(massage, GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }


    });

    $$('#btnSignup').on('click', function () {
        mainView.router.load({url: 'signup.html'});
    });


});

///login into profile function//////////////////////
function GetProfile(userName, password) {
    myApp.showPreloader("Loading");
    // $$.mobile.loading('show');
    var authHeader = 'SAPTCO u="' + userName + '",p="' + password + '"';
    SaveLocalData("authHeader", authHeader);
    localStorage.setItem("authHeader", authHeader);

    $$.ajax(
        {
            // url: "https://mobile.saptco.com.sa/Reservation/Profile",
            url: "http://integtest.saptco.sa/Reserv/Profile",
            method: "Get",
            headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json',
                    "Authorization": authHeader
                },
            success: function (data, xhr, param) {
                // SaveLocalObject("GetAllUserInfo", data.Results);

                var storedData = JSON.parse(data);
                SaveLocalObject("storedprofile", storedData.Results);
                //  alert(storedData);
                /// myApp.formFromJSON('#my-form', data.Results);
                // myApp.formFromJSON('.my-form', storedData);

                myApp.hidePreloader();
                mainView.router.load({url: 'Home.html'});

                loging();
                profile();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                myApp.hidePreloader();
                var massage = GetResourceText("InvalidUserNameOrPassword");
                myApp.alert(massage, GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
}

///////////////////////////////////
////////history///////
function Gethistory() {
    myApp.showPreloader("Loading");

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
                fillHistory(objectData.Results);
            }
        });
}

///////history///////

////////////////////////fillbooking

//////////////////////////////////

function fillHistory(stationsData) {
    var stationsList = myApp.virtualList('#historyList', {
        // Array with items data
        items: stationsData,
        // Custom render function to render item's HTML
        renderItem: function (index, item) {
            return '   <h5 style="text-shadow: none; font-weight: 300; margin: 0px"id="Locations_DepartureStationsName">' + item.FromStation.Name + ' </h5> ' +
                '  <h5 style="text-shadow: none; font-weight: 300; margin: 0px" id="Locations_ArrivleStationsName">' + item.ArrivalStation.Name + '</h5> ' +
                '  <h5 id="lblDepartureDate" style="text-shadow: none; font-weight: 300; margin: 0px; margin-top: 6%">' + item.DepartureDate + ' <h5> ' +
                '  <h5 id="lblReturnDate" style="text-shadow: none; font-weight: 300; margin: 0px; margin-top: 6%">' + item.ReturnDate + '<h5>';


        },
        searchAll: function (query, items) {
            var foundItems = [];
            for (var i = 0; i < items.length; i++) {
                // Check if title contains query string
                if (items[i].Name.indexOf(query.trim()) >= 0) foundItems.push(i);
            }
            // Return array with indexes of matched items
            return foundItems;
        }
    });
}

//////////////////////////////////
//..........profile..........
myApp.onPageInit('profile', function (page) {

    ///
    var username = GetLocalData("username");
    var password = GetLocalData("Password");
    var pre = GetLocalDataObject("storedprofile");

    if (pre != null) {
        pre.MobileNumber = pre.MobileNumber.replace(" ", "");
        myApp.formFromJSON('#my-form', pre);
        myApp.formFromJSON('#other-form', pre);
    }
    else {
        var message = GetResourceText("LogText");
        var message1 = GetResourceText("Errlog");
        var message2 = GetResourceText("log_btn");
        var message3 = GetResourceText("Cnl_btn");
        myApp.modal({
            title: message,
            text: message1,
            buttons: [
                {
                    text: message2,
                    onClick: function () {
                        mainView.router.load({url: 'login.html'});
                    }
                },
                {
                    text: message3,
                    onClick: function () {
                        mainView.router.back({
                            url: 'Home.html'
                        });
                    }
                },

            ]
        })

        mainView.router.load({url: 'Home.html'});
    }

    ////
    var calendarDefault = myApp.calendar({
        dateFormat: 'dd-mm-yyyy',
        input: '#calendar-default',
    });

    $$('.form-from-json').on('click', function () {
        SaveLocalData("authHeader", null);
        SaveLocalData("storedprofile", null);
        mainView.router.load({url: 'Home.html'});
        loging();
        profile();


    });
});
//....................signup....................
myApp.onPageInit('signup', function (page) {

    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true
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

    $$('.form-to-json').on('click', function () {
        var formData = myApp.formToJSON('#my-form');
        formData.UpdateUser = "false";
        var appLang = GetLocalData("ApplicationLanguage");
        var countryCode = $$("#txtCountryCode").val();
        formData.MobileNumber = countryCode + formData.MobileNumber;
        var json = JSON.stringify(formData);
        $$('.validate').removeClass("Validation-error");
        var validationresult = Validatesignup(json);
        if (validationresult == ValidationSucessVal) {
            PostRegstration(json, "create");
            loging();
            profile();
        }
        else {
            var redLinks = $$('.validate').filter(function (index, el) {


                return $$(this).attr('data-validation') == validationresult;
            });
            loging();
            profile();
            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationresult), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
            //var massage = GetResourceText(validationresult);
            // myApp.alert(massage);
        }
    });
});

myApp.onPageInit('UpdateProfile', function (page) {

    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true
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

    $$('#form-to-json').on('click', function () {
        var formData = myApp.formToJSON('#my-form');
        formData.UpdateUser = "true";
        var appLang = GetLocalData("ApplicationLanguage");
        var countryCode = $$("#txtCountryCode").val();
        formData.MobileNumber = countryCode + formData.MobileNumber;
        var json = JSON.stringify(formData);

        //   PostRegstration(json);
        $$('.validate').removeClass("Validation-error");
        var validationresult = Validatesignup(json);
        if (validationresult == ValidationSucessVal) {
            PostRegstration(json, "update");
            loging();
            profile();

        }
        else {
            var redLinks = $$('.validate').filter(function (index, el) {


                return $$(this).attr('data-validation') == validationresult;
            });

            loging();
            profile();
            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationresult), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
            //var massage = GetResourceText(validationresult);
            // myApp.alert(massage);
        }
    });
});


// function CustomValidate(data) {
//     if (data.BirthDate == "")
//         data.BirthDate = "01-01-1900";
//     if (data.Gender == "NA")
//         data.Gender = "Male";
//     if (data.IDNumber == "")
//         data.IDNumber = "1010101010";
//     if (data.IDtype == "NA")
//         data.IDtype = "Passport";
//     if (data.MobileNumber.length == 3)
//         data.MobileNumber = "000000000000";
//     return data;
// }


function CustomValidate(data) {
    if (data.BirthDate == "")
        data.BirthDate = "";
    if (data.Gender == "NA")
        data.Gender = "";
    if (data.IDNumber == "")
        data.IDNumber = "";
    if (data.IDtype == "NA")
        data.IDtype = "";
    if (data.MobileNumber.length == 3)
        data.MobileNumber = "";
    return data;
}

//**signup*******
function PostRegstration(PostData, type) {
    var Type = type;
    var Message;
    if (type == "create")
        Message = GetResourceText('userCreatedSuccessfully');
    else
        Message = GetResourceText('userUpdatedSuccessfully');
    var objectValue = JSON.parse(PostData);
    CustomValidate(objectValue);
    var postData = JSON.stringify(CustomValidate(objectValue));
    var authHeader = 'SAPTCO u="' + objectValue.Email + '",p="' + objectValue.Password + '"';
    SaveLocalData("authHeader", authHeader);
    myApp.showPreloader("Loading");
    // var urlAjax = "https://mobile.saptco.com.sa/Reservation/Profile/Register";
    var urlAjax = "http://integtest.saptco.sa/Reserv/Profile/Register_User";
    $$.ajax(
        {
            method: "POST",
            url: urlAjax,
            contentType: 'application/json',
            data: PostData,
            dataType: "json",
            headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
            success: function (data, status, xhr) {
                if (Type == "update") {
                    var userName = GetLocalData("username");
                    var password = GetLocalData("Password");
                    GetProfile(userName, password);
                }
                myApp.hidePreloader();
                SaveLocalObject("GetAllUserInfo", data);
                // showLocalizedMessage("MsgSignUpSuccessfully");
                //$$("#btnGoToMainMenu").css("display", "block");
                //SaveLocalObject("storedprofile",data);
                // alert("ajax worked");
                myApp.alert(Message);
                $$(".modal-button-bold").text(GetResourceText('OkText'));
                mainView.router.load({url: 'Home.html'});
            },
            error: function (data, xhr) {

                if (data.status == 201) {
                    myApp.hidePreloader();
                    mainView.router.load({url: 'Home.html'});
                    myApp.alert(GetResourceText('userCreatedSuccessfully'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
                else {
                    myApp.hidePreloader();
                    var messages = JSON.parse(data.responseText);
                    if (messages && messages.model != null && messages.model.length > 0) {
                        if (messages.model[0] == "InvalidPassword")
                            myApp.alert(GetResourceText("ErrPassword"), GetResourceText("Error"));
                        else myApp.alert(GetResourceText("ErrEnterEmail"), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }
                    else {
                        myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }

                }
            }
        });
}

myApp.onPageInit('Passdeatlies', function (page) {

    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
        closeOnSelect: true
    });

    $$('.form-to-json').on('click', function () {
        var formData = myApp.formToJSON('#PassengerDetalies');
    });

});
$$(document).on('click', '#logoutb', function (e) {


    SaveLocalData("authHeader", null);
    SaveLocalData("storedprofile", null);
    loging();
    profile();


});


myApp.onPageInit('booking', function (page) {
    disabledInputs = [];
    DeleteLocalData("TicketSearch");
    DeleteLocalData("transferedTicketsArray");
    selectedTicketsToTransfer = [];
    DeleteLocalData("UpdatedTransferDate");
    datesvArray = [];
    datesNumber = 0;
    ticketsWithSearchId = [];
    $$("#book").on("click", ".btn-Booking-Details", function () {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveLocalData("resno", pnr);
        SaveLocalData("phoneno", phoneNumber);
        // GETReservationsPnrMobileNumber(pnr, phoneNumber);
    });

    $$("#book").on("click", ".btn-Add-to-cal", function () {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveReservationsToCalinder(pnr, phoneNumber);
    });


    function Getmybooking() {
        myApp.showPreloader("Loading");
        var authHeader = GetLocalData("authHeader");
        $$.ajax(
            {
                // url: "https://mobile.saptco.com.sa/Reservation/Reservations/bookings",
                url: "http://integtest.saptco.sa/Reserv/Reservations/bookings",
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
                    fillMyBooking(objectData.Results);
                },
                error: function (xhr, param) {
                    myApp.hidePreloader();
                    if (xhr.status == 401) {
                        myApp.alert(GetResourceText('errLoginToViewBookings'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }
                    else if (xhr.status == 404) {
                        myApp.alert(GetResourceText("noBookingFound"), GetResourceText('Error'));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }
                    else {
                        myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                        $$(".modal-button-bold").text(GetResourceText('OkText'));
                    }

                }
            });
    }


});

function GETConfirmaionCode(pnr, mobile) {
    SaveLocalObject("pnr", pnr);
    SaveLocalObject("mobile", mobile);
    myApp.showPreloader(GetResourceText("LoadingInformation"));
    $$.ajax({
        // url: 'https://mobile.saptco.com.sa/Reservation/Reservations/Inquiry/' + pnr + "/" + mobile,
        url: 'http://integtest.saptco.sa/Reserv/Reservations/Inquiry/' + pnr + "/" + mobile,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr) {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);
            if (objectData.Status) {
                var RefrenceId = objectData.RefrenceId;
                var token = objectData.DisplayMessage;
                prompCode(RefrenceId, token);
            } else myApp.alert(GetResourceText("NoDataForBooking"), GetResourceText("Error"));
            // GETReservationsPnrMobileNumber(resno, phoneno, RefrenceId);

            //SaveLocalObject("TicketSearch", objectData.Results.Tickets);
            //mainView.router.load({ url: 'Tickets.html' });
        },
        error: function (jqXhr, textStatus, errorThrown) {
            myApp.hidePreloader();
            myApp.alert(GetResourceText("NoDataForBooking"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}


//toString();
// function ParseConfirmationCodeff(confirmationcode) {
//     for (var i = 0 ; i < confirmationcode.length; i++) {
//         if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 0;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 1;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 2;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 3;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 4;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 5;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 6;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 7;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 8;
//         else if (confirmationcode.charAt(i) == '?')
//             confirmationcode.charAt(i) = 9;
//     }
//     return confirmationcode;
// }

function ParseConfirmationCode(confirmationcode) {

}


function prompCode(RefrenceId, token) {
    var confirmCode = myApp.prompt((GetResourceText("EnterConfirmCode")), function (confirmCode) {
        GETReservationsPnrMobileNumber(confirmCode, RefrenceId, token);
    });
    // document.getElementsByClassName("modal-text-input").focus();
    $$(".modal-text-input")[0].type = 'tel';
    $$(".modal-text-input").focus();
}

function GETReservationsPnrMobileNumber(confirmCode, RefrenceId, token) {

    myApp.showPreloader(GetResourceText("LoadingInformation"));
    $$.ajax({
        // url: 'https://mobile.saptco.com.sa/Reservation/Reservations/Inquiry/' + confirmCode + "/" + RefrenceId + "/" + token,
        url: 'http://integtest.saptco.sa/Reserv/Reservations/Inquiry/' + confirmCode + "/" + RefrenceId + "/" + token,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr) {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);
            SaveLocalObject("TicketSearch", objectData.Results.Tickets);
            mainView.router.load({url: 'Tickets.html'});
        },
        error: function (jqXhr, textStatus, errorThrown) {
            myApp.hidePreloader();
            myApp.alert(GetResourceText("NoDataForBooking"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}


// function GETReservationsPnrMobileNumberNo2(pnr, mobile) {
//     mobile = parseInt(mobile);
//     myApp.showPreloader(GetResourceText("LoadingInformation"));
//     $$.ajax({
//         // url: 'https://mobile.saptco.com.sa/Reservation/Reservations/' + pnr + "/" + mobile,
//         url: 'http://integtest.saptco.sa/Reserv/Reservations/WithoutSMS/' + pnr + "/" + mobile,
//         headers: {
//             'Accept-Language': GetServiceLanguage(),
//             Accept: 'application/json'
//         },
//         success: function (data, status, xhr) {
//             myApp.hidePreloader();
//             var objectData = JSON.parse(data);
//             SaveLocalObject("TicketSearch", objectData.Results.Tickets);
//             mainView.router.load({url: 'Tickets.html'});
//         },
//         error: function (jqXhr, textStatus, errorThrown) {
//             myApp.hidePreloader();
//             myApp.alert(GetResourceText("NoDataForBooking"), GetResourceText("Error"));
//             $$(".modal-button-bold").text(GetResourceText('OkText'));
//         }
//     });
// }


function SaveReservationsToCalinder(pnr, mobile, direction) {
    myApp.showPreloader(GetResourceText("LoadingInformation"));
    $$.ajax({
        // url: 'https://mobile.saptco.com.sa/Reservation/Reservations/Inquiry/' + pnr + "/" + mobile,
        url: 'http://integtest.saptco.sa/Reserv/Reservations/' + pnr + "/" + mobile,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr) {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);

            var depName = objectData.Results.Tickets[0].DepartureStation.Name;
            var Descprition = "Trip Reservation time";
            if (direction == "return") {
                //  Direction:
                var returnTicket = JSLINQ(objectData.Results.Tickets).Where(function (item) {
                    return item.Direction == "Return";
                });
                var start_Date = new Date(returnTicket.items[0].DepartureDate);
                var end_date = new Date(returnTicket.items[0].ArrivalDate);
                window.plugins.calendar.createEvent("SAPTCO", depName, Descprition, start_Date, end_date, onSuccess, onError);
            }
            else {
                var outTicket = JSLINQ(objectData.Results.Tickets).Where(function (item) {
                    return item.Direction != "Return";
                });
                var start_Date = new Date(outTicket.items[0].DepartureDate);
                var end_date = new Date(outTicket.items[0].ArrivalDate);
                window.plugins.calendar.createEvent("SAPTCO", depName, Descprition, start_Date, end_date, onSuccess, onError);
            }

        },
        error: function (jqXhr, textStatus, errorThrown) {
            myApp.hidePreloader();
            myApp.alert(GetResourceText("NoDataForBooking"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}

var seatDiv;
var PrevSeatNumber;
var ticketsNumber = 0;
var disabledInputs = [];
var disabledInputsTemp = [];
myApp.onPageInit('Tickets', function (page) {
    var ticketscounter;
    var Triptype;
    myApp.hidePreloader(GetResourceText("Loading"));
    var pnrExtraDetails = GetLocalDataObject("pnrPayemntReturnInfo");
    if (pnrExtraDetails && pnrExtraDetails != null) {
        $$("#sectionPNR").css("display", "block");
        $$("#txtPnrNumber").text(pnrExtraDetails.ReservationNumber);

        if (pnrExtraDetails.IsConfirmed) {
            $$("#txtPnrStatus").text(GetResourceText("ResStatucConfirmed"));
            $$(".back").css("display", "none");
        }
        else {
            $$("#txtPnrStatus").text(GetResourceText("ResStatucNotConfirmed"));
            $$("#btnPrint").css("display", "none");
        }
        DeleteLocalData("pnrPayemntReturnInfo");
    }
    else {
        $$("#sectionPNR").css("display", "none");
    }

    var resno = GetLocalData("resno");
    phoneno = GetLocalData("phoneno");
    fillTickets();
    $$(document).on("click", ".btn-ticket", function () {
        var ticketNo = $$(this).data("ticketNo");
        var isTransferable = $$(this).data("isTransferable");
        var itemIndex = $$(this).data("itemIndex");
        var selectedTicket = GetLocalDataObject("TicketSearch")[itemIndex];
        if (selectedTicket) {
            SaveLocalObject("selectedTransTicket", selectedTicket);
        }
        // on finsh     isTransferable
        if ('true' == 'true') {
            mainView.router.load({url: 'TicketTransfer.html'});
        }
        else {
            myApp.alert(GetResourceText("nonTransTicket"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
    $$("#btnPrint").on("click", function () {
        var resno = GetLocalData("resno");
        var phoneno = GetLocalData("phoneno");
        //var pnr = $$("#btnPrint").data("pnr_Number");
        //var phoneNUmber = $$("#btnPrint").data("Mobile_Number");

        //printPDfFile('9163145', '966569811632');
        printPDfFile(resno, phoneno);
    });

    $$("#btnGoHomeTickets").on("click", function () {
        mainView.router.load({url: 'Home.html'});
    });

    function fillTickets() {
        var OneWayTicketsCounter = 0;
        var RoundTicketsCounter = 0;
        var ticketsInfo = GetLocalDataObject("TicketSearch");
        var lblPrint = GetResourceText("lblPrint");
        var lblOnwardTickets = GetResourceText("lblOnwardTickets");
        var lblReturnTickets = GetResourceText("lblReturnTickets");
        var From = GetResourceText("PassengerlblFrom");
        var To = GetResourceText("PassengerlblTo");
        var lblTransfer = GetResourceText("lblTransfer");
        var TicketInfo = GetResourceText("PassengerlblGoingTic");
        var ticketNumber = GetResourceText("ticketNumber");

        var allHtmlTickets = "";
        if (ticketsInfo != null) {
            var ticketQuery = JSLINQ(ticketsInfo).Where(function (item) {
                return (item.IsPrintable);
            });
            if (ticketQuery.items.length > 0) {
                $$("#btnPrint").css("display", "block");
                $$("#btnPrint").data("pnr_Number", "");
                $$("#btnPrint").data("Mobile_Number", "");
            }
            else {
                $$("#btnPrint").css("display", "none");
            }
            var html = '<div class="list-block  TicketsVirtulelist" style="margin-top: 30%!important;">' +
                '<div class="container-box-shaddow content-container ">' +
                '<div class="block">' +
                '<div class="block-title selected-tab-cust2">' + lblOnwardTickets + '</div>';
            var html2way = '<div class="list-block  TicketsVirtulelist" style="margin-top: 30%!important;">';
            var htmlOnward = '<div class="container-box-shaddow content-container ">' +
                '<div class="block">' +
                '<div class="block-title selected-tab-cust2">' + lblOnwardTickets + '</div>';
            var htmlReturn = '<div class="container-box-shaddow content-container ">' +
                '<div class="block">' +
                '<div class="block-title selected-tab-cust2">' + lblReturnTickets + '</div>';
            var counter1 = 0;
            var counter2 = 0;
            for (var index = 0; index < ticketsInfo.length; index++) {
                ticketscounter = ticketsInfo.length;
                var item = ticketsInfo[index];
                var tktNo = item.TicketNumber;
                SaveLocalObject("tktNo" + index, tktNo);
                var lblDepartFrom = GetResourceText("lblDepartFrom");
                var lblArrivalTo = GetResourceText("lblArrivalTo");
                var lblDepartureOn = GetResourceText("lblDepartureOn");
                var lblReturnOn = GetResourceText("lblReturnOn");
                var lblPassengerName = GetResourceText("lblPassengerName");
                var lblTicketPrice = GetResourceText("lblTicketPrice");
                var lblTicketStatus = GetResourceText("lblTicketStatus");
                PrevSeatNumber = item.SeatNumber;
                var lblTicketNumber = GetResourceText("lblTicketNumber");
                var imgArClassName = GetLocalData("imgLanguageClass");
                var transferClassClass = "col-50";
                var printClass = "col-50";
                var displayTrans = "none";
                var displayPrint = "none";
                item.IsPrintable = false;
                if (item.IsTransferable) {
                    displayTrans = "block";
                    transferClassClass = "col-100";
                }
                else {
                    displayTrans = "none";
                }
                if (item.IsPrintable) {
                    displayPrint = "block";
                    printClass = "col-100";
                }
                if (item.IsTransferable && item.IsPrintable) {
                    transferClassClass = "col-50";
                    printClass = "col-50";
                }
                if (item.Direction == "NA" || item.ReservationType == "اتجاه واحد" || item.ReservationType == "one_way") {
                    counter1++;
                    html += '<div class="list-block">' +
                        '                    <ul> ' +
                        '                        <li> ' +
                        '                            <div class="row no-gutter"> ' +
                        '                                <div class="col-100 selected-tab-cust" ' +
                        '                                     style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + ticketNumber + ' ' + counter1 + '</div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="from row"> ' +
                        '                                    <div class="col-50"><h5 id="lblUserName">' + lblPassengerName + '</h5></div> ' +
                        '                                    <div class="col-50"><h4 id="Passenger_Name" style="margin: 5px;">' + item.Passenger.Name + '</h4></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="row from"> ' +
                        '                                    <div class="col-10"><h4 id="lblUserName">' + From + '</h4></div> ' +
                        '                                    <div class="col-40"><h5 id="Passenger_Name">' + item.DepartureStation.Name + '</h5></div> ' +
                        '                                    <div class="col-10"><h4 id="lblTo">' + To + '</h4></div> ' +
                        '                                    <div class="col-40"><h5 id="ArrivalStation_Name">' + item.ArrivalStation.Name + '</h5></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="from row"> ' +
                        '                                    <div class="col-50"><h4>' + lblTransfer + '</h4></div> ' +
                        '                                    <div class="col-50"><input type="checkbox" id="inputBoxOneWay' + counter1 + '" data-ticketNo="' + item.TicketNumber + '" data-depID="' + item.DepartureStation.ID + '" data-arrID="' + item.ArrivalStation.ID + '"></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                        </li> ' +
                        '                        <li class="accordion-item"><a href="#" class="item-content item-link"> ' +
                        '                            <div class="item-inner"> ' +
                        '                                <div class="item-title">' + TicketInfo + '</div> ' +
                        '                            </div> ' +
                        '                        </a> ' +
                        '                            <div class="accordion-item-content"> ' +
                        '                                <div class="content-block"> ' +
                        '                                    <div class="Depart"> ' +
                        '                                        <div class="from row"> ' +
                        '                                            <div class="col-50"><h5>' + lblTicketPrice + '</h5></div> ' +
                        '                                            <div class="col-50"><h4 style="margin: 5px;">' + item.Amount + '</h4></div> ' +
                        '                                        </div> ' +
                        '</div>' +
                        '                                        <div class="Depart"> ' +
                        '                                            <div class="from row"> ' +
                        '                                                <div class="col-50"><h5>' + lblTicketStatus + '</h5></div> ' +
                        '                                                <div class="col-50"><h4 style="margin: 5px;">' + item.Status + '</h4> ' +
                        '                                                </div> ' +
                        '                                            </div> ' +
                        '                                        </div> ';
                    if (item.SeatNumber != null && item.SeatNumber != "") {
                        html = html + '<div class="Depart">                            ' +
                            '<div class="from row">  ' +
                            ' <div class="col-40"> <h5  >' + GetResourceText("PassengerlblSeatNumber") + '</h5> </div>' +
                            ' <div class="col-40" id="txtSeatNumberR' + index + '"> <h4   style="margin: 5px;" >' + PrevSeatNumber + '</h4></div>' +
                            ' <div class="col-20 button" onclick="EditSeatBtn(\'' + index + '\')" id="editIconR' + index + '"> <h4   style="margin: 5px;" >' + GetResourceText("changeSeat") + '</h4></div>' +
                            '</div>     ' +
                            '</div>     ';
                    }

                    html += '<div class="row"> ' +
                        ' <div class="col-100 center-text img-direction-flip"><img ' +
                        'src="img/goingbus.png" ' +
                        'alt="Trip" ' +
                        'class="trip-go-img"/></div> ' +
                        '</div> ' +
                        '<div class="row">           ' +
                        '  <div class="col-33 center-text font-size-14"> ' + item.DepartureTimeString + '  </div> ' +
                        '  <div class="col-33 center-text font-size-14"> &nbsp;</div>     ' +
                        '  <div class="col-33 center-text font-size-14">' + item.ArrivalTimeString + '</div>   ' +
                        '</div>          ' +
                        '<div class="row">           ' +
                        '<div class="col-33 center-text color-s-dark-orange font-size-14">' + item.DepartureDateString + '</div>         ' +
                        '<div class="col-33 center-text">  </div>        ' +
                        '<div class="col-33 center-text color-s-dark-orange font-size-14">' + item.ArrivalDateString + '</div>         ' +
                        '</div>          ' +
                        '                                    </div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                        </li> ' +
                        '                    </ul> ' +
                        '                </div>';
                }
                else if (item.Direction == "Onward") {
                    OneWayTicketsCounter++;
                    counter1++;
                    htmlOnward += '<div class="list-block">' +
                        '                    <ul> ' +
                        '                        <li> ' +
                        '                            <div class="row no-gutter"> ' +
                        '                                <div class="col-100 selected-tab-cust" ' +
                        '                                     style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;"> ' + ticketNumber + ' ' + counter1 + '</div>' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="from row"> ' +
                        '                                    <div class="col-50"><h5 id="lblUserName">' + lblPassengerName + '</h5></div> ' +
                        '                                    <div class="col-50"><h4 id="Passenger_Name" style="margin: 5px;">' + item.Passenger.Name + '</h4></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="row from"> ' +
                        '                                    <div class="col-10"><h4 id="lblUserName">' + From + '</h4></div> ' +
                        '                                    <div class="col-40"><h5 id="Passenger_Name">' + item.DepartureStation.Name + '</h5></div> ' +
                        '                                    <div class="col-10"><h4 id="lblTo">' + To + '</h4></div> ' +
                        '                                    <div class="col-40"><h5 id="ArrivalStation_Name">' + item.ArrivalStation.Name + '</h5></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="from row"> ' +
                        '                                    <div class="col-50"><h4>' + lblTransfer + '</h4></div> ' +
                        '                                    <div class="col-50"><input type="checkbox" id="inputBoxRound1' + counter1 + '" data-ticketNo="' + item.TicketNumber + '" data-depID="' + item.DepartureStation.ID + '" data-arrID="' + item.ArrivalStation.ID + '"></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                        </li> ' +
                        '                        <li class="accordion-item"><a href="#" class="item-content item-link"> ' +
                        '                            <div class="item-inner"> ' +
                        '                                <div class="item-title">' + TicketInfo + '</div> ' +
                        '                            </div> ' +
                        '                        </a> ' +
                        '                            <div class="accordion-item-content"> ' +
                        '                                <div class="content-block"> ' +
                        '                                    <div class="Depart"> ' +
                        '                                        <div class="from row"> ' +
                        '                                            <div class="col-50"><h5>' + lblTicketPrice + '</h5></div> ' +
                        '                                            <div class="col-50"><h4 style="margin: 5px;">' + item.Amount + '</h4></div> ' +
                        '                                        </div> ' +
                        '</div>' +
                        '                                        <div class="Depart"> ' +
                        '                                            <div class="from row"> ' +
                        '                                                <div class="col-50"><h5>' + lblTicketStatus + '</h5></div> ' +
                        '                                                <div class="col-50"><h4 style="margin: 5px;">' + item.Status + '</h4> ' +
                        '                                                </div> ' +
                        '                                            </div> ' +
                        '                                        </div> ';
                    if (item.SeatNumber != null && item.SeatNumber != "") {
                        htmlOnward += '<div class="Depart">                            ' +
                            '<div class="from row">  ' +
                            ' <div class="col-40"> <h5  >' + GetResourceText("PassengerlblSeatNumber") + '</h5> </div>' +
                            ' <div class="col-40" id="txtSeatNumberR' + index + '"> <h4   style="margin: 5px;" >' + PrevSeatNumber + '</h4></div>' +
                            ' <div class="col-20 button" onclick="EditSeatBtn(\'' + index + '\')" id="editIconR' + index + '"> <h4   style="margin: 5px;" >' + GetResourceText("changeSeat") + '</h4></div>' +
                            '</div>     ' +
                            '</div>     ';
                    }

                    htmlOnward += '<div class="row"> ' +
                        ' <div class="col-100 center-text img-direction-flip"><img ' +
                        'src="img/goingbus.png" ' +
                        'alt="Trip" ' +
                        'class="trip-go-img"/></div> ' +
                        '</div> ' +
                        '<div class="row">           ' +
                        '  <div class="col-33 center-text font-size-14"> ' + item.DepartureTimeString + '  </div> ' +
                        '  <div class="col-33 center-text font-size-14"> &nbsp;</div>     ' +
                        '  <div class="col-33 center-text font-size-14">' + item.ArrivalTimeString + '</div>   ' +
                        '</div>          ' +
                        '<div class="row">           ' +
                        '<div class="col-33 center-text color-s-dark-orange font-size-14">' + item.DepartureDateString + '</div>         ' +
                        '<div class="col-33 center-text">  </div>        ' +
                        '<div class="col-33 center-text color-s-dark-orange font-size-14">' + item.ArrivalDateString + '</div>         ' +
                        '</div>          ' +
                        '                                    </div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                        </li> ' +
                        '                    </ul> ' +
                        '                </div>';
                } else if (item.Direction == "Return") {
                    RoundTicketsCounter++;
                    counter2++;
                    htmlReturn += '<div class="list-block">' +
                        '                    <ul> ' +
                        '                        <li> ' +
                        '                            <div class="row no-gutter"> ' +
                        '                                <div class="col-100 selected-tab-cust" ' +
                        '                                     style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;"> ' + ticketNumber + ' ' + counter2 + '</div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="from row"> ' +
                        '                                    <div class="col-50"><h5 id="lblUserName">' + lblPassengerName + '</h5></div> ' +
                        '                                    <div class="col-50"><h4 id="Passenger_Name" style="margin: 5px;">' + item.Passenger.Name + '</h4></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="row from"> ' +
                        '                                    <div class="col-10"><h4 id="lblUserName">' + From + '</h4></div> ' +
                        '                                    <div class="col-40"><h5 id="Passenger_Name">' + item.DepartureStation.Name + '</h5></div> ' +
                        '                                    <div class="col-10"><h4 id="lblTo">' + To + '</h4></div> ' +
                        '                                    <div class="col-40"><h5 id="ArrivalStation_Name">' + item.ArrivalStation.Name + '</h5></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                            <div class="Depart"> ' +
                        '                                <div class="from row"> ' +
                        '                                    <div class="col-50"><h4>' + lblTransfer + '</h4></div> ' +
                        '                                    <div class="col-50"><input type="checkbox" id="inputBoxRound2' + counter2 + '" data-ticketNo="' + item.TicketNumber + '" data-depID="' + item.DepartureStation.ID + '" data-arrID="' + item.ArrivalStation.ID + '"></div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                        </li> ' +
                        '                        <li class="accordion-item"><a href="#" class="item-content item-link"> ' +
                        '                            <div class="item-inner"> ' +
                        '                                <div class="item-title">' + TicketInfo + '</div> ' +
                        '                            </div> ' +
                        '                        </a> ' +
                        '                            <div class="accordion-item-content"> ' +
                        '                                <div class="content-block"> ' +
                        '                                    <div class="Depart"> ' +
                        '                                        <div class="from row"> ' +
                        '                                            <div class="col-50"><h5>' + lblTicketPrice + '</h5></div> ' +
                        '                                            <div class="col-50"><h4 style="margin: 5px;">' + item.Amount + '</h4></div> ' +
                        '                                        </div> ' +
                        '</div>' +
                        '                                        <div class="Depart"> ' +
                        '                                            <div class="from row"> ' +
                        '                                                <div class="col-50"><h5>' + lblTicketStatus + '</h5></div> ' +
                        '                                                <div class="col-50"><h4 style="margin: 5px;">' + item.Status + '</h4> ' +
                        '                                                </div> ' +
                        '                                            </div> ' +
                        '                                            </div> ' +
                        '                                        </div> ';
                    if (item.SeatNumber != null && item.SeatNumber != "") {
                        htmlReturn += '<div class="Depart">                            ' +
                            '<div class="from row">  ' +
                            ' <div class="col-40"> <h5  >' + GetResourceText("PassengerlblSeatNumber") + '</h5> </div>' +
                            ' <div class="col-40" id="txtSeatNumberR' + index + '"> <h4   style="margin: 5px;" >' + PrevSeatNumber + '</h4></div>' +
                            ' <div class="col-20 button" onclick="EditSeatBtn(\'' + index + '\')" id="editIconR' + index + '"> <h4   style="margin: 5px;" >' + GetResourceText("changeSeat") + '</h4></div>' +
                            '</div>     ' +
                            '</div>     ';
                    }

                    htmlReturn += '<div class="row"> ' +
                        ' <div class="col-100 center-text img-direction-flip"><img ' +
                        'src="img/goingbus.png" ' +
                        'alt="Trip" ' +
                        'class="trip-go-img"/></div> ' +
                        '</div> ' +
                        '<div class="row">           ' +
                        '  <div class="col-33 center-text font-size-14"> ' + item.DepartureTimeString + '  </div> ' +
                        '  <div class="col-33 center-text font-size-14"> &nbsp;</div>     ' +
                        '  <div class="col-33 center-text font-size-14">' + item.ArrivalTimeString + '</div>   ' +
                        '</div>          ' +
                        '<div class="row">           ' +
                        '<div class="col-33 center-text color-s-dark-orange font-size-14">' + item.DepartureDateString + '</div>         ' +
                        '<div class="col-33 center-text">  </div>        ' +
                        '<div class="col-33 center-text color-s-dark-orange font-size-14">' + item.ArrivalDateString + '</div>         ' +
                        '</div>          ' +
                        '                                    </div> ' +
                        '                                </div> ' +
                        '                            </div> ' +
                        '                        </li> ' +
                        '                    </ul> ' +
                        '                            </div> ';

                }
                var lblPrint = GetResourceText("lblPrint");
                var lblTransfer = GetResourceText("lblTransfer");
                var imageSource = "img/goingbus.png";
                allHtmlTickets = allHtmlTickets + html;
            }
            html +=
                '</div></div>' +
                '<div class="row no-gutter">' +
                '<div style="display:block" class="col-100" id="btnTransferTicket" data-type="Oneway">' +
                '<div class="light-orange-background2 trans-booking">' + lblTransfer + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            htmlOnward +=
                '</div>' +
                '<div class="row no-gutter">' +
                '<div style="display:block" class="col-100" id="btnTransferTicket1" data-type="Onward">' +
                '<div class="light-orange-background2 trans-booking">' + lblTransfer + '</div>' +
                '</div>' +
                '</div>' +
                '</div></div>';
            htmlReturn +=
                '<div class="row no-gutter">' +
                '<div style="display:block" class="col-100" id="btnTransferTicket2" data-type="Return">' +
                '<div class="light-orange-background2 trans-booking">' + lblTransfer + '</div>' +
                '</div>' +
                '</div>' +
                '</div></div>';
            html2way += htmlOnward + htmlReturn;
            html2way += '</div>';
            if (RoundTicketsCounter == 0)
                $$("#ticketsUl").html(htmlOnward);
            else if (RoundTicketsCounter > 0)
                $$("#ticketsUl").html(html2way);
            myApp.hidePreloader();
        }
    }

    if (disabledInputs.length != 0)
        for (var i = 0; i < disabledInputs.length; i++) {
            $$("#" + disabledInputs[i]).attr('disabled', 'true');
            $$("#" + disabledInputs[i]).parent().parent().attr('disabled', 'true');
            $$("#" + disabledInputs[i]).parent().parent().parent().hide();
        }
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate() - 1);
    var calTrans = myApp.calendar({
        input: '#calenderInput',
        dateFormat: 'dd-mm-yyyy',
        minDate: today,
        toolbarCloseText: "cancel",
        closeByOutsideClick: true,
        closeOnSelect: true
    });
    var newDate = "";
    var ticketsObject = [];
    $$("#calenderInput").on("change", function () {
        var depID;
        var arrID;
        var Type = "";
        if (Triptype == "Oneway") {
            Type = "inputBoxOneWay";
            SaveLocalData('transferTripType', Triptype);
        } else if (Triptype == "Onward") {
            SaveLocalData('transferTripType', Triptype);
            Type = "inputBoxRound1";
            ticketscounter /= 2;
        }
        else if (Triptype == "Return") {
            SaveLocalData('transferTripType', Triptype);
            Type = "inputBoxRound2";
            ticketscounter /= 2;
        }

        for (var i = 1; i <= ticketscounter; i++) {
            var id = Type + i;
            var inputField = document.getElementById(id);
            depID = inputField.dataset.depid;
            arrID = inputField.dataset.arrid;
            if (inputField.checked) {
                ticketsObject.push(inputField.dataset.ticketno);
                ticketsNumber++;
                disabledInputs.push(id)
            }
        }
        if (ticketsObject.length != 0) {
            newDate = $$("#calenderInput").val();
            date = newDate;
            var formatedDate = date.split("-").reverse().join("-");
            var transferObject = GetLocalDataObject('TansferObject');
            transferObject.Tickets = ticketsObject;
            SaveLocalObject('transferedTicketsArray', transferObject);
            transferObject.searchRequest.DepartureDate = formatedDate;
            transferObject.searchRequest.DepartureStation = depID;
            transferObject.searchRequest.ArrivalStation = arrID;
            // SaveLocalData("TicketSearch", ticketNumber);
            // GetTicketTransTrip(ticketNumber, newDate);
            GetTicketTransTrip(JSON.stringify(transferObject));
        }
        else
            myApp.alert('please select ticket');
        console.log(ticketsObject);
    });
    $$("#btnTransferTicket").on("click", function () {
        var Type = "";
        if ($$(this).data("type") == "Oneway") {
            Triptype = "Oneway";
            Type = "inputBoxRound1";
            ticketscounter /= 2;
        } else if ($$(this).data("type") == "Onward") {
            Triptype = "Onward";
            Type = "inputBoxRound1";
            ticketscounter /= 2;
        } else if ($$(this).data("type") == "Return") {
            Triptype = "Return";
            Type = "inputBoxRound2";
            ticketscounter /= 2;
        }
        var arrId = $$(this).data("ArrId");
        var TansferObject = {
            Tickets:
                [],
            searchRequest: {
                DepartureStation: '',
                ArrivalStation: '',
                DepartureDate: '',
                AdultSeats: "1",
                HalfSeats: "0",
                InfantSeats: "0",
                IsVip: false,
                PromotionCode: ""
            }
        };
        SaveLocalObject('TansferObject', TansferObject);
        for (var i = 1; i <= ticketscounter; i++) {
            var id = Type + i;
            var inputField = document.getElementById(id);
            if (inputField.checked) {
                // ticketsObject.push(inputField.dataset.ticketno);
                // ticketsNumber++;
                disabledInputsTemp.push(id)
            }
        }
        if (disabledInputsTemp.length == 0) {
            ticketscounter *= 2;
            disabledInputsTemp = [];
            myApp.alert(GetResourceText('SelectTicket'));
        } else {
            ticketscounter *= 2;
            disabledInputsTemp = [];
            setTimeout(function () {
                calTrans.open();
            }, 300);
        }
    });
    $$("#btnTransferTicket1").on("click", function () {
        var Type = "";
        // if ($$(this).data("type") == "Oneway") {
        //     Triptype = "Oneway";
        //     Type = "inputBoxRound1";
        //     ticketscounter /= 2;
        // } else if ($$(this).data("type") == "Onward") {
        if ($$(this).data("type") == "Onward") {
            Triptype = "Onward";
            Type = "inputBoxRound1";
            ticketscounter /= 2;
        } else if ($$(this).data("type") == "Return") {
            Triptype = "Return";
            Type = "inputBoxRound2";
            ticketscounter /= 2;
        }
        var arrId = $$(this).data("ArrId");
        var TansferObject = {
            Tickets:
                [],
            searchRequest: {
                DepartureStation: '',
                ArrivalStation: '',
                DepartureDate: '',
                AdultSeats: "1",
                HalfSeats: "0",
                InfantSeats: "0",
                IsVip: false,
                PromotionCode: ""
            }
        };
        SaveLocalObject('TansferObject', TansferObject);
        if (ticketscounter == 0.5)
            ticketscounter *= 2;
        for (var i = 1; i <= ticketscounter; i++) {
            var id = Type + i;
            var inputField = document.getElementById(id);
            if (inputField.checked) {
                // ticketsObject.push(inputField.dataset.ticketno);
                // ticketsNumber++;
                disabledInputsTemp.push(id)
            }
        }
        if (disabledInputsTemp.length == 0) {
            ticketscounter *= 2;
            disabledInputsTemp = [];
            myApp.alert(GetResourceText('SelectTicket'));
        } else {
            ticketscounter *= 2;
            disabledInputsTemp = [];
            setTimeout(function () {
                calTrans.open();
            }, 300);
        }
    });
    $$("#btnTransferTicket2").on("click", function () {
        var Type = "";
        if ($$(this).data("type") == "Oneway") {
            Triptype = "Oneway";
            Type = "inputBoxRound1";
            ticketscounter /= 2;
        } else if ($$(this).data("type") == "Onward") {
            Triptype = "Onward";
            Type = "inputBoxRound1";
            ticketscounter /= 2;
        } else if ($$(this).data("type") == "Return") {
            Triptype = "Return";
            Type = "inputBoxRound2";
            ticketscounter /= 2;
        }
        var arrId = $$(this).data("ArrId");
        var TansferObject = {
            Tickets:
                [],
            searchRequest: {
                DepartureStation: '',
                ArrivalStation: '',
                DepartureDate: '',
                AdultSeats: "1",
                HalfSeats: "0",
                InfantSeats: "0",
                IsVip: false,
                PromotionCode: ""
            }
        };
        SaveLocalObject('TansferObject', TansferObject);
        for (var i = 1; i <= ticketscounter; i++) {
            var id = Type + i;
            var inputField = document.getElementById(id);
            if (inputField.checked) {
                // ticketsObject.push(inputField.dataset.ticketno);
                // ticketsNumber++;
                disabledInputsTemp.push(id)
            }
        }
        if (disabledInputsTemp.length == 0) {
            ticketscounter *= 2;
            disabledInputsTemp = [];
            myApp.alert(GetResourceText('SelectTicket'));
        } else {
            ticketscounter *= 2;
            disabledInputsTemp = [];
            setTimeout(function () {
                calTrans.open();
            }, 300);
        }
    });


    $$(".TicketsVirtulelist").on("click", "#btnPrintTicket", function () {
        var pdf = new jsPDF('p', 'pt', 'letter');
        source = $$('.TicketsVirtulelist')[0];
        margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };

        pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                //'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF
                //          this allow the insertion of new lines after html
                pdf.save('ticket.pdf');
            }, margins);

    });
});

function EditSeatBtn(i) {

    seatDiv = $$("#txtSeatNumberR" + i);
    var tktNumber = GetLocalDataObject("tktNo" + i);
    SaveLocalObject("Ticket", tktNumber);
    mainView.router.load({url: "SeatSelectR.html"});

}

myApp.onPageInit('SeatSelectR', function (page) {
    var pageContainer = $$(page.container);
    var confirmSeatR = pageContainer.find('#confirmSeatR');
    mainView.hideToolbar();
    var TicketNumber = GetLocalDataObject("Ticket");
    var TicketNumberJson = {
        "TicketNumber": [
            TicketNumber
        ]
    };

    GetBusStructure(TicketNumberJson);
    // var struct = GetLocalDataObject("busStructure");
    // var seatNumber = passengerTicket[0].SeatNumber;
    confirmSeatR.on('click', function () {
        struct = GetLocalDataObject("busStructure");
        var token = struct.ValidToken;
        var reserve = {
            "Token": token,
            "TicketsSeat": [
                {
                    "TicketNumber": TicketNumber,
                    "SeatNumber": PrevSeatNumber
                }
            ]
        };
        ReserveSeat(reserve);

    });


});

/*/////////////mybookingjs/*//////////////*/////////////
function GetBusStructure(ticketNumber) {
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
                    CreatBus(data);

                }
            },

            error: function (data) {
                myApp.hidePreloader("Loading");

                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));

                $$(".modal-button-bold").text(GetResourceText('OkText'));

            }

        });

}

function CreatBus(struct) {
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
            if (PrevSeatNumber == seatNumber) {
                PrevSeat = "seat" + position;
                if (seatImg == "availableSeat") {
                    PrevSeatClass = "selectedSeat";
                } else {
                    PrevSeatClass = "selectedSeatD";
                }
                seatImg = PrevSeatClass;
            }
            seatTypeToRemove = (seatType == 0 && isAvailable) ? 1 : (seatType == 1 && isAvailable) ? 2 : ((seatType == 0 || seatType == 1) && !isAvailable) ? 3 : "";
            var onClick = (seatTypeToRemove != -1) ? 'onClick="SelectSeat(this.id, ' + seatTypeToRemove + ')"' : '';
            seats = seats +

                '           <div class="col-20">' +
                '               <div class="button11 ' + seatImg + ' center" id="seat' + seatNumber + '" ' + onClick + ' >' + seatNumber + '</div>' +
                '           </div>';
        }
        seats = seats + '</div>';
    }
    $$('#seats').html(seats);
    seatDiv.html(PrevSeatNumber);
}


function ReserveSeat(seatNumber) {
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
                    PrevSeatNumber = PrevSeat.replace("seat", "");
                    var tempArray = GetLocalDataObject("TicketSearch");
                    var TicketNumber = GetLocalDataObject("Ticket");
                    for (i = 0; i < tempArray.length; i++) {
                        if (tempArray[i].TicketNumber == TicketNumber) {
                            tempArray[i].SeatNumber = PrevSeatNumber;
                        }
                    }
                    seatDiv.html(PrevSeatNumber);
                    SaveLocalObject("TicketSearch", tempArray);
                    if (GetLocalDataObject("confirmedDate")) {
                        var pnr = GetLocalDataObject("resno");
                        var mobile = GetLocalDataObject("phoneno");
                    }
                    var pnr = GetLocalDataObject("pnr");
                    var mobile = GetLocalDataObject("mobile");
                    DeleteLocalData("confirmedDate");
                    // GETReservationsPnrMobileNumberNo2(pnr, mobile);

                }

                else if (data == false) {
                    myApp.alert(GetResourceText("ReservedSeat"));
                    var ticketNumberJson = {
                        "TicketNumber": [
                            TicketNumber
                        ]
                    };
                    GetBusStructure(ticketNumberJson);
                    CreatBus(GetLocalDataObject("busStructure"));
                    myApp.hidePreloader("Loading");
                    mainView.router.loadPage({url: 'SeatSelectR.html'});
                }
            },
            error: function (data) {
                myApp.hidePreloader("Loading");
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
}

var PrevSeat = "seat";
var PrevSeatNumber = "-1";
var PrevSeatClass;
var SelectedSeat;

function SelectSeat(seatID, buttonClass) {
    var newClass;
    if (buttonClass == 1) {
        newClass = "selectedSeat";
        $$("#" + PrevSeat).removeClass(PrevSeatClass);
        $$("#" + seatID).addClass(newClass);
        $$("#" + PrevSeat).addClass("availableSeat");
        PrevSeat = seatID;
        SelectedSeat = PrevSeat.substring(4);
        PrevSeatNumber = SelectedSeat;
        PrevSeatClass = newClass;
    } else if (buttonClass == 2) {
        newClass = "selectedSeatD";
        $$("#" + PrevSeat).removeClass(PrevSeatClass);
        $$("#" + seatID).addClass(newClass);
        $$("#" + PrevSeat).addClass("availableSeatD");
        PrevSeat = seatID;
        SelectedSeat = PrevSeat.substring(4);
        PrevSeatNumber = SelectedSeat;
        PrevSeatClass = newClass;
    } else if (buttonClass == 3) {
        myApp.alert(GetResourceText("ReservedSeat"));
    }

}

myApp.onPageAfterAnimation('mybooking', function (page) {
    disabledInputs = [];
    DeleteLocalData("TicketSearch");
    DeleteLocalData("transferedTicketsArray");
    selectedTicketsToTransfer = [];
    DeleteLocalData("UpdatedTransferDate");
    datesvArray = [];
    ticketsWithSearchId = [];
    datesNumber = 0;


    $$(document).on('click', '#booking1', function (e) {
        mainView.router.load({url: 'Booking.html'});
    });
    $$(document).on('click', '#history1', function (e) {
        mainView.router.load({url: 'historytab.html'});
    });
    $$(document).on('click', '#mange1', function (e) {
        mainView.router.load({url: 'mybooking.html'});
    });


    $$('#searchReservations').on('click', function () {
        var resno = $$('#resno').val();
        var phoneno = $$('#txtCountryCode').val() + $$('#phoneno').val();
        SaveLocalData("resno", resno);
        SaveLocalData("phoneno", phoneno);
        GETConfirmaionCode(resno, phoneno);
    });

});


/********** Ticket Transfer*************/
myApp.onPageInit('TicketTransfer', function (page) {
    var selectedTicket = GetLocalDataObject("selectedTransTicket");
    $$("#Passenger_NameValue").text(selectedTicket.Passenger.Name);
    $$("#DepartureStation_NameValue").text(selectedTicket.DepartureStation.Name);
    $$("#ArrivalStation_NameValue").text(selectedTicket.ArrivalStation.Name);
    $$("#DeparutOn").text(selectedTicket.DepartureDateString);
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate() - 1);
    var calendarDateFormat = myApp.calendar({
        input: '#calendar-date-Ticket',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true,
        minDate: today
    });

    $$("#btnSearchNewTicket").on('click', function () {
        var newDate = $$("#calendar-date-Ticket").val();
        var selectedTicket = GetLocalDataObject("selectedTransTicket");
        var ticketNumber = selectedTicket.TicketNumber;
        date = newDate;
        //post trans
        GetTicketTransTrip(ticketNumber, newDate);


    });
});


function GetTicketTransTrip(transferObject) {
    myApp.showPreloader(GetResourceText("Loading"));
    // var url = 'https://mobile.saptco.com.sa/Reservation/Inquiry';
    var url = 'http://integtest.saptco.sa/Reserv/Transfer/Inquiry';
    $$.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: transferObject,
        success: function (data, status, xhr) {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);
            //fillStations(objectData.Results);
            SaveLocalObject("GetTicketTransTrip", objectData);
            // if (objectData && objectData.Results[0] && objectData.Results[0].Days && objectData.Results[0].Days.length > 0) {
            if (objectData[0].Trips.length > 0) {
                // SaveLocalObject("JournyID", objectData.Results[0].Days.JourneyID);
                mainView.router.load({url: "changetime.html"});
            }
            else {
                myApp.alert(GetResourceText("NoTripsFound"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        },
        error: function (xhr, status) {
            myApp.hidePreloader();
            myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));

        }

    });
}

// function GetTicketTransTrip(ticketNumber, SearchDate) {
//     myApp.showPreloader(GetResourceText("Loading"));
//     $$.ajax({
//         // url: 'https://mobile.saptco.com.sa/Reservation/Transfer/' + ticketNumber + "/" + SearchDate,
//         url: 'http://integtest.saptco.sa/Reserv/Transfer/' + ticketNumber + "/" + SearchDate,
//         headers: {
//             'Accept-Language': GetServiceLanguage(),
//             Accept: 'application/json'
//         },
//         success: function (data, status, xhr) {
//             myApp.hidePreloader();
//             var objectData = JSON.parse(data);
//             //fillStations(objectData.Results);
//             SaveLocalObject("GetTicketTransTrip", objectData);
//
//             if (objectData && objectData.Results[0] && objectData.Results[0].Days && objectData.Results[0].Days.length > 0) {
//                 SaveLocalObject("JournyID", objectData.Results[0].Days.JourneyID);
//                 mainView.router.load({url: "changetime.html"});
//             }
//             else {
//                 myApp.alert(GetResourceText("NoTripsFound"));
//                 $$(".modal-button-bold").text(GetResourceText('OkText'));
//             }
//         },
//         error: function (xhr, status) {
//             myApp.hidePreloader();
//             myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
//             $$(".modal-button-bold").text(GetResourceText('OkText'));
//
//         }
//
//     });
// }

/********end of Ticket Transfer*************/

/////////////////////////////////changed time rervation//////////////
var date;
var datesvArray = [];
var dates;
var datesNumber = 0;
myApp.onPageInit('changetime', function (page) {
    var object = GetLocalDataObject("GetTicketTransTrip");
    var imageSource = "img/goingbus.png";
    var lblDuration = GetResourceText("Duration");
    var imgArClassName = GetLocalData("imgLanguageClass");
    // var imageSource = "img/goingbus.png";
    var listHtml;
    var TripsCounter = 0;
    // if (object.Results[0] && object.Results[0].Days.length > 0) {
    var Day1, Day2, Day3;
    if (object[0].Trips.length > 0) {
        var tripsList = "";
        var tabsDiv = '';
        if (object.length == 3) {
            Day1 = object[0].Day;
            Day2 = object[1].Day;
            Day3 = object[2].Day;
            tabsDiv = '<div class="row no-gutter " style="height: auto!important; margin-top: 34%">' +
                '<div class="col-100">' +
                '<div class="DatesTabs2" style="background-color:white">' +
                '<div class="col-33 TabNotSelected tab0" onclick="changeTab(0)" data-index="0">' +
                '<div class="row col-100" style="height: 45px;">' +
                '<h2 >' + Day1.substring(0, 2) + '</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5 >' + Day1.substring(3) + '</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-34 TabSelected tab1" onclick="changeTab(1)" data-index="1">' +
                '<div class="row col-100" style="height: 45px;  ">' +
                '<h2  >' + Day2.substring(0, 2) + '</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5>' + Day2.substring(3) + '</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-33 TabNotSelected tab2" onclick="changeTab(2)" data-index="2">' +
                '<div class="row col-100" style="height: 45px;">' +
                '<h2>' + Day3.substring(0, 2) + '</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5 >' + Day3.substring(3) + '</h5>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="list-block" style="font-weight: 300;  font-stretch: condensed;">';
        } else if (object.length == 2) {
            Day1 = object[0].Day;
            Day2 = object[1].Day;
            tabsDiv = '<div class="row no-gutter " style="height: auto!important; margin-top: 34%">' +
                '<div class="col-100">' +
                '<div class="DatesTabs2" style="background-color:white">' +
                '<div class="col-33 TabNotSelected tab0" onclick="changeTab(0)" data-index="0">' +
                '<div class="row col-100" style="height: 45px;">' +
                '<h2 >' + Day1.substring(0, 2) + '</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5 >' + Day1.substring(3) + '</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-34 TabSelected tab1" onclick="changeTab(1)" data-index="1">' +
                '<div class="row col-100" style="height: 45px;  ">' +
                '<h2  >' + Day2.substring(0, 2) + '</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5>' + Day2.substring(3) + '</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-33 TabNotSelected tab2">' +
                '<div class="row col-100" style="height: 45px;">' +
                '<h2>---</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5 >---</h5>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="list-block" style="font-weight: 300;  font-stretch: condensed;">';
        } else if (object.length == 1) {
            Day1 = object[0].Day;
            tabsDiv = '<div class="row no-gutter " style="height: auto!important; margin-top: 34%">' +
                '<div class="col-100">' +
                '<div class="DatesTabs2" style="background-color:white">' +
                '<div class="col-33 TabNotSelected tab0">' +
                '<div class="row col-100" style="height: 45px;">' +
                '<h2 >---</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5 >---</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-34 TabSelected tab1">' +
                '<div class="row col-100" style="height: 45px;  ">' +
                '<h2  >' + Day1.substring(0, 2) + '</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5>' + Day1.substring(3) + '</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-33 TabNotSelected tab2">' +
                '<div class="row col-100" style="height: 45px;">' +
                '<h2>---</h2>' +
                '</div>' +
                '<div class="row col-100">' +
                '<h5 >---</h5>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="list-block" style="font-weight: 300;  font-stretch: condensed;">';
        }
        $$("#testTabs").html(tabsDiv);
        if (object.length == 3)
            tripsList = object[1].Trips;
        else if (object.length == 2)
            tripsList = object[1].Trips;
        else if (object.length == 1)
            tripsList = object[0].Trips;
        listHtml = '';
        for (var j = 0; j < tripsList.length; j++) {
            var item = tripsList[j];
            if (item.TotalExtraAmount == 0) {
                TripsCounter++;
                var index = i;
                var transitHeader = GetResourceText("transitHeader");
                var servicesHeader = GetResourceText("servicesHeader");
                var lblMeals = GetResourceText("lblMeals");
                var lblChargres = GetResourceText("lblChargres");
                var lblrefreshments = GetResourceText("lblrefreshments");
                var lblDirect = GetResourceText("lblDirect");
                var lblTV = GetResourceText("lblTV");
                var lblNewspapers = GetResourceText("lblNewspapers");
                var transitHtml = "";
                var lblSAR = GetResourceText("SAR");
                var lblHours = GetResourceText("lblHours");
                imageSource = "img/goingbusTrans.png";
                var DepDateTime = item.DeptDt;
                var ArrDateTime = item.ArrDt;
                var DepStationName = item.DeptStationName;
                var ArrStationName = item.ArrStationName;
                var splitIndex = ArrDateTime.indexOf('T') - 1;
                var splitIndex1 = ArrDateTime.indexOf('T');
                // if (item) {
                //     if (item.Dirction != "Onward")
                //         imageSource = "img/goingbusTrans.png";
                //     else
                //         imageSource = "img/returnArrowTrans.png";
                //     transitHtml = '<div class="content-block accordion-list custom-accordion" style="padding:0px; margin-top: 5px;  margin-bottom: 1px;"> ' +
                //         '<div class="accordion-item">' +
                //         '<div class="row accordion-item-toggle">' +
                //         '<div class="col-100 trip-info-blackTitle " style="background-color: #F5E5A1; color: black;"> ' +
                //         '<i class="icon icon-form-aboutus" style ="margin-right:3px ; margin-left:3px"></i>' +
                //         transitHeader +
                //         '</div>      ' +
                //         '</div>          ' +
                //         '<div class="accordion-item-content">';
                //     transitHtml = transitHtml +
                //         '<div class="row"> ' +
                //         '<div class ="col-50 departDirection" style="font-size: 13px;">' + "DepartureStation" + '</div>' +
                //         '<div class ="col-50 arrivelDirection" style="font-size: 13px; ">' + "ArrivalStation" + '</div>' +
                //         '</div>' +
                //         '<div class="row" style="border-bottom: solid 1px #eeeeee;"> ' +
                //         '<div class ="col-20"  style="font-size: 13px; text-align:center">' +
                //         DepDateTime.substr(splitIndex + 2) +
                //         '</div>' +
                //         '<div class="col-60" style="text-align:center"><img src="img/goingbus.png" alt="Trip" class="trip-go-img ' + imgArClassName + '" style ="width:90%" /> </div>' +
                //         '<div class ="col-20"  style="font-size: 13px;  text-align:center">' +
                //         ArrDateTime.substr(splitIndex + 2) +
                //         '</div>' +
                //         '</div>';
                //     transitHtml = transitHtml + '</div> </div></div>';
                // }
                var myTestValue = transitHtml;
                var servicesHtmll = "";
                if (item.HasRefreshments || item.HasMeals || item.HasChargers || item.IsDirectNoneStop || item.HasNewspapers || item.HasTV || item.Tables || item.HasRefreshments) {
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
                    if (item.HasMeals) {
                        servicesHtmll = servicesHtmll +
                            '<div class="col-10 center-text trip-service-icon"><img src="img/meals.png" alt="Alternate Text" />  </div>  ' +
                            '<div class="col-40  trip-service-text"> ' + lblMeals + ' </div>        ';
                        rowColCounter = rowColCounter + 1;
                    }

                    if (item.HasRefreshments) {
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
                    if (item.HasTV) {
                        servicesHtmll = servicesHtmll +
                            '<div class="col-10 center-text trip-service-icon"><img src="img/wifi.png" alt="Alternate Text" />  </div>  ' +
                            '<div class="col-40  trip-service-text"> ' + lblTv + ' </div>        ';
                        rowColCounter = rowColCounter + 1;
                    }
                    if (item.Tables) {
                        servicesHtmll = servicesHtmll +
                            '<div class="col-10 center-text trip-service-icon"><img src="img/wifi.png" alt="Alternate Text" />  </div>  ' +
                            '<div class="col-40  trip-service-text"> ' + lblTables + ' </div>        ';
                        rowColCounter = rowColCounter + 1;
                    }

                    if (item.HasEntertainment) {
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
                    if (item.HasChargers) {
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
                    if (item.IsDirectNoneStop) {
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
                    if (item.HasNewspapers) {
                        servicesHtmll = servicesHtmll +
                            '<div class="col-10 center-text trip-service-icon"><img src="img/newspaper.png" alt="Alternate Text" />  </div>          ' +
                            '<div class="col-40  trip-service-text">' + lblNewspapers + '</div>     ';
                        rowColCounter = rowColCounter + 1;
                        if (rowColCounter > 1) {
                            servicesHtmll = servicesHtmll + ' </div>';
                            rowColCounter = 0;
                        }
                    }
                    if (item.HasTV) {
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
                    if (item.HasTables) {
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
                    if (rowColCounter == 1) {
                        servicesHtmll = servicesHtmll + '<div class="col-50">&nbsp</div> </div>   '
                        rowColCounter = 0;
                    }
                    servicesHtmll = servicesHtmll + ' </div></div>';
                }
                var standardPriceText = GetResourceText("lblStabdardPrice");
                var discountpriceText = GetResourceText("lblDiscountPrice");
                var priceDivHtml = "";
                priceDivHtml = '<div class="row col-100 split-card1 btn-standard-price" style="width: 98%;margin: auto"  data-depDateTime2="' + DepDateTime.substring(0, splitIndex + 1) + '"  data-arrDepTime2="' + ArrDateTime.substring(0, splitIndex + 1) + '"  data-duration="' + item.Duration + '" data-depDateTime="' + DepDateTime.substring(splitIndex + 2) + '" data-arrDepTime="' + ArrDateTime.substring(splitIndex + 2) + '" data-Searchid="' + item.SearchId + '">' +
                    '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold;">' + item.TotalExtraAmount + lblSAR + ' </div>' +
                    '<div class="row col-100" style="font-size:13px;">' +
                    ' <div class="col-60"></div>' +
                    ' <div class="col-40 price-card3">' + standardPriceText + '</div>' +
                    ' </div>' +
                    '</div>';
                listHtml = listHtml + '<li style="padding-bottom: 15px;">' +
                    '<div class="content-container no-bottom-margins container-box-shaddow1">' +
                    '<div class="row trip-tripinfo">' +
                    '<div class="col-100">      ' +

                    '<div class="row">  ' +
                    '<div class="col-100 center-text"><img src="' + imageSource + '" alt="Trip" class="trip-go-img ' + imgArClassName + '" /></div>        ' +
                    '</div>          ' +
                    '<div class="row">           ' +
                    '  <div class="col-33 center-text font-size-14"> ' + DepDateTime.substring(splitIndex + 2) + '  </div> ' +
                    '  <div class="col-33 center-text font-size-14" style="font-weight: 300;">' + lblDuration + '</div>     ' +
                    '  <div class="col-33 center-text font-size-14">' + ArrDateTime.substring(splitIndex + 2) + '</div>   ' +
                    '</div>          ' +
                    '  <div class="row">           ' +
                    '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + DepDateTime.substring(0, splitIndex + 1) + '</div>         ' +
                    '  <div class="col-33 center-text font-size-14">' + item.Duration + lblHours + '</div>     ' +
                    '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + ArrDateTime.substring(0, splitIndex + 1) + '</div>         ' +
                    '  </div>          ' +
                    '  <div class="row">           ' +
                    '      <div class="col-40 center-text color-s-dark-orange font-size-14">' + DepStationName + '</div>         ' +
                    '      <div class="col-20 center-text font-size-14"></div>     ' +
                    '      <div class="col-40 center-text color-s-dark-orange font-size-14">' + ArrStationName + '</div>         ' +
                    '  </div>          ' +
                    transitHtml +
                    servicesHtmll +
                    priceDivHtml +
                    '</li>';
            } else {
            }
        }
        $$("#list-trips-container").append(listHtml);
        if (i == object.length - 1)
            if (TripsCounter == 0) {
                var massage = GetResourceText("NoTripsFound");
                myApp.alert(massage, function () {
                    mainView.router.load({url: 'Tickets.html'});
                });
            }
    }
    else {
        var massage = GetResourceText("NoTripsFound");
        myApp.alert(massage);
        $$(".modal-button-bold").text(GetResourceText('OkText'));
    }
    $$("#changeTripsList").on('click', ".btn-standard-price", function () {
        var Triptype = GetLocalData('transferTripType');
        var tiketid = GetLocalData("TicketSearch");
        var journyid = $$(this).data("JourneyID");
        var duratin = $$(this).data('duration');
        var depDateTime = $$(this).data('depDateTime');
        var arrDateTime = $$(this).data('arrDepTime');
        var depDateTime2 = $$(this).data('depDateTime2');
        var arrDateTime2 = $$(this).data('arrDepTime2');
        var SearchId = $$(this).data('SearchId');
        var dates = {
            depTime: depDateTime,
            arrTime: arrDateTime,
            depDate: depDateTime2,
            arrDate: arrDateTime2,
            ticketsNumber: ticketsNumber,
            SearchId: SearchId
        }
        datesvArray[datesNumber] = dates;
        SaveLocalObject("UpdatedTransferDate", datesvArray);
        mainView.router.load({url: 'transferSummary.html'});
        // PostReservationTransfer(tiketid, journyid);
    });
});

function changeTab(index) {
    if (index == 0) {
        $$(".tab0").removeClass('TabNotSelected');
        $$(".tab1").removeClass('TabSelected');
        $$(".tab2").removeClass('TabSelected');
        $$(".tab1").addClass('TabNotSelected');
        $$(".tab2").addClass('TabNotSelected');
        $$(".tab0").addClass('TabSelected');
    } else if (index == 1) {
        $$(".tab1").removeClass('TabNotSelected');
        $$(".tab0").removeClass('TabSelected');
        $$(".tab2").removeClass('TabSelected');
        $$(".tab0").addClass('TabNotSelected');
        $$(".tab2").addClass('TabNotSelected');
        $$(".tab1").addClass('TabSelected');
    } else if (index == 2) {
        $$(".tab2").removeClass('TabNotSelected');
        $$(".tab0").removeClass('TabSelected');
        $$(".tab1").removeClass('TabSelected');
        $$(".tab0").addClass('TabNotSelected');
        $$(".tab1").addClass('TabNotSelected');
        $$(".tab2").addClass('TabSelected');
    }
    myApp.showPreloader();
    setTimeout(function () {
        myApp.hidePreloader();
    }, 500);

    $$("#list-trips-container").html('');
    var object = GetLocalDataObject("GetTicketTransTrip");
    var tripsList = "";
    var listHtml = '';
    var imageSource = "img/goingbus.png";
    var lblDuration = GetResourceText("Duration");
    var imgArClassName = GetLocalData("imgLanguageClass");
    tripsList = object[index].Trips;
    var TripsCounter = 0;
    for (var j = 0; j < tripsList.length; j++) {
        var item = tripsList[j];
        if (item.TotalExtraAmount == 0) {
            TripsCounter++;
            // var index = i;
            var transitHeader = GetResourceText("transitHeader");
            var servicesHeader = GetResourceText("servicesHeader");
            var lblMeals = GetResourceText("lblMeals");
            var lblChargres = GetResourceText("lblChargres");
            var lblrefreshments = GetResourceText("lblrefreshments");
            var lblDirect = GetResourceText("lblDirect");
            var lblTV = GetResourceText("lblTV");
            var lblNewspapers = GetResourceText("lblNewspapers");
            var transitHtml = "";
            var lblSAR = GetResourceText("SAR");
            var lblHours = GetResourceText("lblHours");
            imageSource = "img/goingbusTrans.png";
            var DepDateTime = item.DeptDt;
            var ArrDateTime = item.ArrDt;
            var DepStationName = item.DeptStationName;
            var ArrStationName = item.ArrStationName;
            var splitIndex = ArrDateTime.indexOf('T') - 1;
            var splitIndex1 = ArrDateTime.indexOf('T');
            // if (item) {
            //     if (item.Dirction != "Onward")
            //         imageSource = "img/goingbusTrans.png";
            //     else
            //         imageSource = "img/returnArrowTrans.png";
            //     transitHtml = '<div class="content-block accordion-list custom-accordion" style="padding:0px; margin-top: 5px;  margin-bottom: 1px;"> ' +
            //         '<div class="accordion-item">' +
            //         '<div class="row accordion-item-toggle">' +
            //         '<div class="col-100 trip-info-blackTitle " style="background-color: #F5E5A1; color: black;"> ' +
            //         '<i class="icon icon-form-aboutus" style ="margin-right:3px ; margin-left:3px"></i>' +
            //         transitHeader +
            //         '</div>      ' +
            //         '</div>          ' +
            //         '<div class="accordion-item-content">';
            //     transitHtml = transitHtml +
            //         '<div class="row"> ' +
            //         '<div class ="col-50 departDirection" style="font-size: 13px;">' + "DepartureStation" + '</div>' +
            //         '<div class ="col-50 arrivelDirection" style="font-size: 13px; ">' + "ArrivalStation" + '</div>' +
            //         '</div>' +
            //         '<div class="row" style="border-bottom: solid 1px #eeeeee;"> ' +
            //         '<div class ="col-20"  style="font-size: 13px; text-align:center">' +
            //         DepDateTime.substr(splitIndex + 2) +
            //         '</div>' +
            //         '<div class="col-60" style="text-align:center"><img src="img/goingbus.png" alt="Trip" class="trip-go-img ' + imgArClassName + '" style ="width:90%" /> </div>' +
            //         '<div class ="col-20"  style="font-size: 13px;  text-align:center">' +
            //         ArrDateTime.substr(splitIndex + 2) +
            //         '</div>' +
            //         '</div>';
            //     transitHtml = transitHtml + '</div> </div></div>';
            // }
            var myTestValue = transitHtml;
            var servicesHtmll = "";
            if (item.HasRefreshments || item.HasMeals || item.HasChargers || item.IsDirectNoneStop || item.HasNewspapers || item.HasTV || item.Tables || item.HasRefreshments) {
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
                if (item.HasMeals) {
                    servicesHtmll = servicesHtmll +
                        '<div class="col-10 center-text trip-service-icon"><img src="img/meals.png" alt="Alternate Text" />  </div>  ' +
                        '<div class="col-40  trip-service-text"> ' + lblMeals + ' </div>        ';
                    rowColCounter = rowColCounter + 1;
                }

                if (item.HasRefreshments) {
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
                if (item.HasTV) {
                    servicesHtmll = servicesHtmll +
                        '<div class="col-10 center-text trip-service-icon"><img src="img/wifi.png" alt="Alternate Text" />  </div>  ' +
                        '<div class="col-40  trip-service-text"> ' + lblTv + ' </div>        ';
                    rowColCounter = rowColCounter + 1;
                }
                if (item.Tables) {
                    servicesHtmll = servicesHtmll +
                        '<div class="col-10 center-text trip-service-icon"><img src="img/wifi.png" alt="Alternate Text" />  </div>  ' +
                        '<div class="col-40  trip-service-text"> ' + lblTables + ' </div>        ';
                    rowColCounter = rowColCounter + 1;
                }

                if (item.HasEntertainment) {
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
                if (item.HasChargers) {
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
                if (item.IsDirectNoneStop) {
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
                if (item.HasNewspapers) {
                    servicesHtmll = servicesHtmll +
                        '<div class="col-10 center-text trip-service-icon"><img src="img/newspaper.png" alt="Alternate Text" />  </div>          ' +
                        '<div class="col-40  trip-service-text">' + lblNewspapers + '</div>     ';
                    rowColCounter = rowColCounter + 1;
                    if (rowColCounter > 1) {
                        servicesHtmll = servicesHtmll + ' </div>';
                        rowColCounter = 0;
                    }
                }
                if (item.HasTV) {
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
                if (item.HasTables) {
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
                if (rowColCounter == 1) {
                    servicesHtmll = servicesHtmll + '<div class="col-50">&nbsp</div> </div>   '
                    rowColCounter = 0;
                }
                servicesHtmll = servicesHtmll + ' </div></div>';
            }
            var standardPriceText = GetResourceText("lblStabdardPrice");
            var discountpriceText = GetResourceText("lblDiscountPrice");
            var priceDivHtml = "";
            priceDivHtml = '<div class="row col-100 split-card1 btn-standard-price" style="width: 98%; margin: auto" data-depDateTime2="' + DepDateTime.substring(0, splitIndex + 1) + '"  data-arrDepTime2="' + ArrDateTime.substring(0, splitIndex + 1) + '"  data-duration="' + item.Duration + '" data-depDateTime="' + DepDateTime.substring(splitIndex + 2) + '" data-arrDepTime="' + ArrDateTime.substring(splitIndex + 2) + '" data-Searchid="' + item.SearchId + '">' +
                '<div class="row col-100" style="margin-right:5%;font-size:20px;font-weight:bold;">' + item.TotalExtraAmount + lblSAR + ' </div>' +
                '<div class="row col-100" style="font-size:13px;">' +
                ' <div class="col-60"></div>' +
                ' <div class="col-40 price-card3">' + standardPriceText + '</div>' +
                ' </div>' +
                '</div>';
            listHtml = listHtml + '<li style="padding-bottom: 15px;">' +
                '<div class="content-container no-bottom-margins container-box-shaddow1">' +
                '<div class="row trip-tripinfo">' +
                '<div class="col-100">      ' +

                '<div class="row">  ' +
                '<div class="col-100 center-text"><img src="' + imageSource + '" alt="Trip" class="trip-go-img ' + imgArClassName + '" /></div>        ' +
                '</div>          ' +
                '<div class="row">           ' +
                '  <div class="col-33 center-text font-size-14"> ' + DepDateTime.substring(splitIndex + 2) + '  </div> ' +
                '  <div class="col-33 center-text font-size-14" style="font-weight: 300;">' + lblDuration + '</div>     ' +
                '  <div class="col-33 center-text font-size-14">' + ArrDateTime.substring(splitIndex + 2) + '</div>   ' +
                '</div>          ' +
                '  <div class="row">           ' +
                '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + DepDateTime.substring(0, splitIndex + 1) + '</div>         ' +
                '  <div class="col-33 center-text font-size-14">' + item.Duration + lblHours + '</div>     ' +
                '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + ArrDateTime.substring(0, splitIndex + 1) + '</div>         ' +
                '  </div>          ' +
                '  <div class="row">           ' +
                '      <div class="col-40 center-text color-s-dark-orange font-size-14">' + DepStationName + '</div>         ' +
                '      <div class="col-20 center-text font-size-14"></div>     ' +
                '      <div class="col-40 center-text color-s-dark-orange font-size-14">' + ArrStationName + '</div>         ' +
                '  </div>          ' +
                transitHtml +
                servicesHtmll +
                priceDivHtml +
                '</li>';
        } else {
        }
    }
    $$("#list-trips-container").append(listHtml);
    // if (i == object.length - 1)
    //     if (TripsCounter == 0) {
    //         var massage = GetResourceText("NoTripsFound");
    //         myApp.alert(massage, function () {
    //             mainView.router.load({url: 'Tickets.html'});
    //         });
    //     }
}


var selectedTicketsToTransfer = [];
var ticketsIDs;
var ticketsWithSearchId = [];

myApp.onPageInit('transferSummary', function (page) {
    var filteredObject = [];
    ticketsIDs = [];
    $$('#CancelTransformation').on('click', function () {
        mainView.router.load({url: 'Home.html'});
        DeleteLocalData("TicketSearch");
        DeleteLocalData("transferedTicketsArray");
        disabledInputs = [];
        selectedTicketsToTransfer = [];
        DeleteLocalData("UpdatedTransferDate");
        datesvArray = [];
        datesNumber = 0;
        ticketsWithSearchId = [];

    });
    $$('#AddTickets').on('click', function () {
        mainView.router.load({url: 'Tickets.html'});
    });
    $$('#ConfirmTransferTicket').on('click', function () {
        PostReservationTransfer(ticketsIDs);
    });
    var ticketsInfoTransfer = GetLocalDataObject("TicketSearch");
    if (disabledInputs.length == ticketsInfoTransfer.length)
        $$("#AddTickets").attr('disabled', 'true');
    var ticketsObject = GetLocalDataObject('transferedTicketsArray');
    var lblTickets = GetResourceText("lblTickets");
    var From = GetResourceText("PassengerlblFrom");
    var To = GetResourceText("PassengerlblTo");
    var lblTransfer = GetResourceText("lblTransfer");
    var TicketInfo = GetResourceText("PassengerlblGoingTic");
    var lblPassengerName = GetResourceText("lblPassengerName");
    var ticketNumber = GetResourceText("ticketNumber");
    var lblTicketPrice = GetResourceText("lblTicketPrice");
    var lblTicketStatus = GetResourceText("lblTicketStatus");
    var PrevSeatNumber;
    var counter1 = 0
    var html = '';
    datesNumber++;
    for (var i = 0; i < ticketsInfoTransfer.length; i++) {
        for (var j = 0; j < ticketsObject.Tickets.length; j++) {
            if (ticketsInfoTransfer[i].TicketNumber == ticketsObject.Tickets[j])
                filteredObject.push(ticketsInfoTransfer[i]);
        }
    }
    selectedTicketsToTransfer.push(filteredObject);
    for (var i = 0; i < selectedTicketsToTransfer.length; i++) {
        ticketsWithSearchId = [];
        for (var j = 0; j < selectedTicketsToTransfer[i].length; j++) {
            dates = datesvArray[i];
            counter1++;
            var item = selectedTicketsToTransfer[i][j];
            ticketsWithSearchId[j] = item.TicketNumber;
            if (j == selectedTicketsToTransfer[i].length - 1)
                ticketsWithSearchId.push(dates.SearchId);
            PrevSeatNumber = item.SeatNumber;
            html +=
                '<div class="list-block">' +
                '<ul>' +
                '<li>' +
                '<div class="row no-gutter">' +
                '<div class="col-100 selected-tab-cust" ' +
                '                                     style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;">' + ticketNumber + ' ' + counter1 + '</div> ' +
                '</div>' +
                '<div class="Depart">' +
                '<div class="from row">' +
                '<div class="col-50"><h5 id="lblUserName">' + lblPassengerName + '</h5></div>' +
                '<div class="col-50"><h4 id="Passenger_Name" style="margin: 5px;">' + item.Passenger.Name + '</h4></div>' +
                '</div>' +
                '</div>' +
                '<div class="Depart">' +
                '<div class="row from">' +
                '<div class="col-10"><h4 id="lblUserName">' + From + '</h4></div>' +
                '<div class="col-40"><h5 id="Passenger_Name">' + item.DepartureStation.Name + '</h5></div>' +
                '<div class="col-10"><h4 id="lblTo">' + To + '</h4></div>' +
                '<div class="col-40"><h5 id="ArrivalStation_Name">' + item.ArrivalStation.Name + '</h5></div>' +
                '</div>' +
                '</div>' +
                '</li> ' +
                '<li class="accordion-item"><a href="#" class="item-content item-link">' +
                '<div class="item-inner">' +
                '<div class="item-title">' + TicketInfo + '</div>' +
                '</div> ' +
                '</a> ' +
                '<div class="accordion-item-content">' +
                '<div class="content-block">' +
                '<div class="Depart">' +
                '<div class="from row">' +
                '<div class="col-50"><h5>' + lblTicketPrice + '</h5></div>' +
                '<div class="col-50"><h4 style="margin: 5px;">' + item.Amount + '</h4></div>' +
                '</div> ' +
                '</div>' +
                '<div class="Depart">' +
                '<div class="from row">' +
                '<div class="col-50"><h5>' + lblTicketStatus + '</h5></div>' +
                '<div class="col-50"><h4 style="margin: 5px;">' + item.Status + '</h4>' +
                '</div>' +
                '</div>' +
                '</div>';
            if (item.SeatNumber != null && item.SeatNumber != "") {
                html = html + '<div class="Depart">' +
                    '<div class="from row">' +
                    ' <div class="col-40"><h5  >' + GetResourceText("PassengerlblSeatNumber") + '</h5></div>' +
                    ' <div class="col-40" id="txtSeatNumberR' + index + '"> <h4   style="margin: 5px;" >' + PrevSeatNumber + '</h4></div>' +
                    ' <div class="col-20 button" onclick="EditSeatBtn(\'' + index + '\')" id="editIconR' + index + '"> <h4   style="margin: 5px;" >' + GetResourceText("changeSeat") + '</h4></div>' +
                    '</div>' +
                    '</div>';
            }
            html += '<div class="row">' +
                '<div class="col-100 center-text img-direction-flip"><img ' +
                'src="img/goingbus.png"' +
                'alt="Trip"' +
                'class="trip-go-img"/></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-33 center-text font-size-14"> ' + dates.depDate + '</div>' +
                '<div class="col-33 center-text font-size-14"> &nbsp;</div>' +
                '<div class="col-33 center-text font-size-14">' + dates.arrDate + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14">' + dates.depTime + '</div>' +
                '<div class="col-33 center-text"></div>' +
                '<div class="col-33 center-text color-s-dark-orange font-size-14">' + dates.arrTime + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</div>';
        }
        ticketsIDs.push(ticketsWithSearchId);
    }
    $$(".transferSummary").html(html);
});

function PostReservationTransfer(journyInfo) {
    myApp.showPreloader("Loading");
    var transferArray = [];
    var SearchId;
    for (var i = 0; i < journyInfo.length; i++) {
        var tickets = [];
        for (var j = 0; j < journyInfo[i].length - 1; j++) {
            tickets[j] = journyInfo[i][j];
            SearchId = journyInfo[i][j + 1];
            var request =
                {
                    "Tickets": tickets,
                    "SearchId": SearchId,
                    "Lang": GetApplicationLanguage(),
                    "SdpId": 870,
                    "Channel": "005",
                    "UserId": 2231
                };
        }
        transferArray[i] = request;
    }
    var urlAjax = 'http://integtest.saptco.sa/Reserv/Transfer/TransferRequest';
    // var urlAjax = 'https://mobile.saptco.com.sa/Reservation/Transfer/TransferRequest';
    $$.ajax(
        {
            type: "POST",
            url: urlAjax,
            contentType: "application/json",
            data: JSON.stringify(transferArray),
            success: function (data, status, xhr) {
                var Data = JSON.parse(data);
                SaveLocalObject("ReservationSummaryTransfer", Data)
                myApp.hidePreloader();
                if (Data.TransferSucceeded && (Data.TotalAmount == 0)) {
                    myApp.alert(GetResourceText("TransferDoneSucessfully"), function () {
                        mainView.router.load({url: 'Home.html'});
                    });

                } else if (!Data.TransferSucceeded && (Data.TotalAmount != 0)) {
                    mainView.router.load({url: 'TransferPaymentOption.html'});
                }
            },
            error: function (data, xhr) {
                myApp.hidePreloader();
                var massage = GetResourceText("TransferFailed");
                myApp.alert(massage);
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
}

/////////cAlendar////////////////
var title = 'My Event Title';
var loc = 'My Event Location';
var notes = 'My interesting Event notes.';
var startDate = new Date();
var endDate = new Date();
var calendarName = 'MyCal';
var options = {
    url: 'https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin',
    calendarName: calendarName, // iOS specific
    calendarId: 1 // Android specific
};

// clean up the dates a bit
startDate.setMinutes(0);
endDate.setMinutes(0);
startDate.setSeconds(0);
endDate.setSeconds(0);

// add a few hours to the dates, JS will automatically update the date (+1 day) if necessary
startDate.setHours(startDate.getHours() + 2);
endDate.setHours(endDate.getHours() + 3);

function onSuccess(msg) {
    //TODO : add message
    //alert('Calendar success: ' + JSON.stringify(msg));
}

function onError(msg) {
    //TODO : add message
    //alert('Calendar error: ' + JSON.stringify(msg));
}

function openCalendar() {
    // today + 3 days
    var d = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
    window.plugins.calendar.openCalendar(d, onSuccess, onError);
}

function listCalendars() {
    window.plugins.calendar.listCalendars(onSuccess, onError);
}

function createCalendar() {
    window.plugins.calendar.createCalendar(calendarName, onSuccess, onError);
}

function deleteEvent() {
    window.plugins.calendar.deleteEvent(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function createCalendarEvent() {
    window.plugins.calendar.createEvent(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function createCalendarEventInteractively() {
    window.plugins.calendar.createEventInteractively(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function createCalendarEventInteractivelyWithOptions() {
    window.plugins.calendar.createEventInteractivelyWithOptions(title, loc, notes, startDate, endDate, options, onSuccess, onError);
}

function createCalendarEventWithOptions() {
    window.plugins.calendar.createEventWithOptions(title, loc, notes, startDate, endDate, options, onSuccess, onError)
}

function findEventWithFilter() {
    window.plugins.calendar.findEvent(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function findEventNoFilter() {
    window.plugins.calendar.findEvent(null, null, null, startDate, endDate, onSuccess, onError);
}

window.onerror = function (msg, file, line) {
    alert(msg + '; ' + file + '; ' + line);
};
