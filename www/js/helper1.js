// JavaScript source code

myApp.onPageInit('about', function (page)
{
    // run createContentPage func after link was clicked
    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
    });
});
 

myApp.onPageInit('forget_password', function (page)
{
    $$("#btnSend").on("click", function ()
    { 
        var str = $$("#txtUserEmailAdd").val();

        var validationresult = ValidateForgetPassword(str);

        if (validationresult != ValidationSucessVal)
        {
            myApp.alert(GetResourceText(validationresult), GetResourceText("Error"));
        }
        else
        {
            var email = str.replace("@", "%40");
            myApp.showPreloader("Loading");

            $$.ajax(
                {
                    url: 'https://mobile.saptco.com.sa/Reservation/Profile/ResetPassword?email=' + email,
                    method: "Post",
                    contentType: 'application/json',
                    data: "{ }",
                    headers:
                    {
                        'Accept-Language': GetServiceLanguage(),
                        Accept: 'application/json'
                    },
                    success: function (data, xhr, param)
                    {
                        myApp.hidePreloader();
                        var massage = GetResourceText("AnEmailWillBeSend");
                        myApp.alert(massage, GetResourceText("Alert")); 
                    },
                    error: function (jqXhr, textStatus, errorThrown)
                    {
                        myApp.hidePreloader();
                    }
                });
        }

    });
});

myApp.onPageInit('login', function (page)
{

    $$('#btnForgetPassword').on("click", function ()
    {
        mainView.router.load({ url: 'forget_password.html' });
    });

    loging();
    profile();

    $$('#Login').on('click', function ()
    {
        var username = $$('#txtUserName').val();
        var password = $$('#txtPassword').val();
        var jas = {
            "username": username,
            "password": password

        }
        var jas = JSON.stringify(jas);
        //  PostRegstration(json);
        var validationresult = Validatelogin(jas);
        if (validationresult == ValidationSucessVal)
        {

            SaveLocalData("username", username);
            SaveLocalData("Password", password);
            GetProfile(username, password);
        }
        else
        {
            var massage = GetResourceText(validationresult);
            myApp.alert(massage, GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }


    });

    $$('#btnSignup').on('click', function ()
    {
        mainView.router.load({ url: 'signup.html' });
    });



});

///login into profile function//////////////////////
function GetProfile(userName, password)
{
    myApp.showPreloader("Loading");
    // $$.mobile.loading('show');
    var authHeader = 'SAPTCO u="' + userName + '",p="' + password + '"';
    SaveLocalData("authHeader", authHeader);
    localStorage.setItem("authHeader", authHeader);

    $$.ajax(
    {
        url: "https://mobile.saptco.com.sa/Reservation/Profile",
        method: "Get",
        headers:
        {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json',
            "Authorization": authHeader
        },
        success: function (data, xhr, param)
        {
            // SaveLocalObject("GetAllUserInfo", data.Results);
            var storedData = JSON.parse(data);
            SaveLocalObject("storedprofile", storedData.Results);
            //  alert(storedData);
            /// myApp.formFromJSON('#my-form', data.Results);
            // myApp.formFromJSON('.my-form', storedData);

            myApp.hidePreloader();
            mainView.router.load({ url: 'Home.html' });

            loging();
            profile();
        },
        error: function (jqXhr, textStatus, errorThrown)
        {
            myApp.hidePreloader();
            var massage = GetResourceText("InvalidUserNameOrPassword");
            myApp.alert(massage, GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}

///////////////////////////////////
////////history///////
function Gethistory()
{
    myApp.showPreloader("Loading");

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
           fillHistory(objectData.Results);
       }
   });
}
///////history///////

////////////////////////fillbooking

//////////////////////////////////

function fillHistory(stationsData)
{
    var stationsList = myApp.virtualList('#historyList', {
        // Array with items data
        items: stationsData,
        // Custom render function to render item's HTML
        renderItem: function (index, item)
        {
            return '   <h5 style="text-shadow: none; font-weight: 300; margin: 0px"id="Locations_DepartureStationsName">' + item.FromStation.Name + ' </h5> ' +
            '  <h5 style="text-shadow: none; font-weight: 300; margin: 0px" id="Locations_ArrivleStationsName">' + item.ArrivalStation.Name + '</h5> ' +
            '  <h5 id="lblDepartureDate" style="text-shadow: none; font-weight: 300; margin: 0px; margin-top: 6%">' + item.DepartureDate + ' <h5> ' +
            '  <h5 id="lblReturnDate" style="text-shadow: none; font-weight: 300; margin: 0px; margin-top: 6%">' + item.ReturnDate + '<h5>';


        },
        searchAll: function (query, items)
        {
            var foundItems = [];
            for (var i = 0; i < items.length; i++)
            {
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
myApp.onPageInit('profile', function (page)
{

    ///
    var username = GetLocalData("username");
    var password = GetLocalData("Password");
    var pre = GetLocalDataObject("storedprofile");

    if (pre != null)
    {
        pre.MobileNumber = pre.MobileNumber.replace(" ", "");
        myApp.formFromJSON('#my-form', pre);
        myApp.formFromJSON('#other-form', pre);
    }
    else
    {
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
                 onClick: function ()
                 {
                     mainView.router.load({ url: 'login.html' });
                 }
             },
             {
                 text: message3,
                 onClick: function ()
                 {
                     mainView.router.back({
                         url: 'Home.html'
                     });
                 }
             },

            ]
        })

        mainView.router.load({ url: 'Home.html' });
    }

    ////
    var calendarDefault = myApp.calendar({
        dateFormat: 'dd-mm-yyyy',
        input: '#calendar-default',
    });

    $$('.form-from-json').on('click', function ()
    {
        SaveLocalData("authHeader", null);
        SaveLocalData("storedprofile", null);
        mainView.router.load({ url: 'Home.html' });
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

    $$('.form-to-json').on('click', function ()
    {
        var formData = myApp.formToJSON('#my-form');
        var appLang = GetLocalData("ApplicationLanguage");
        var countryCode = $$("#txtCountryCode").val();

        formData.MobileNumber = countryCode + formData.MobileNumber;
        var json = JSON.stringify(formData);

        //   PostRegstration(json);
        $$('.validate').removeClass("Validation-error");
        var validationresult = Validatesignup(json);
        if (validationresult == ValidationSucessVal)
        {

            PostRegstration(json);

            loging();
            profile();

        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {


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
//*****signup********************
function PostRegstration(postData)
{
    var objectValue = JSON.parse(postData);
    var authHeader = 'SAPTCO u="' + objectValue.Email + '",p="' + objectValue.Password + '"';
    SaveLocalData("authHeader", authHeader);
    myApp.showPreloader("Loading");
    var urlAjax = "https://mobile.saptco.com.sa/Reservation/Profile/Register";
    $$.ajax(
    {
        method: "POST",
        url: urlAjax,
        contentType: 'application/json',
        data: postData,
        dataType: "json",
        headers:
        {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr)
        {
            myApp.hidePreloader();
            SaveLocalObject("GetAllUserInfo", data);
            // showLocalizedMessage("MsgSignUpSuccessfully");
            //$$("#btnGoToMainMenu").css("display", "block");
            //SaveLocalObject("storedprofile",data);
            // alert("ajax worked");
            myApp.alert(GetResourceText('userCreatedSuccessfully'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
            mainView.router.load({ url: 'Home.html' });
        },
        error: function (data, xhr)
        {
            if (data.status == 201)
            {
                myApp.hidePreloader();
                mainView.router.load({ url: 'Home.html' });
                myApp.alert(GetResourceText('userCreatedSuccessfully'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
            else
            {
                myApp.hidePreloader();
                var messages = JSON.parse(data.responseText);
                if (messages && messages.model !=null &&  messages.model.length > 0)
                {
                    myApp.alert(messages.model[0], GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
                else
                {
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }

            }
        }
    });
}

myApp.onPageInit('Passdeatlies', function (page)
{

    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
        closeOnSelect: true
    });

    $$('.form-to-json').on('click', function ()
    {
        var formData = myApp.formToJSON('#PassengerDetalies');
    });

});
$$(document).on('click', '#logoutb', function (e)
{


    SaveLocalData("authHeader", null);
    SaveLocalData("storedprofile", null);
    loging();
    profile();


});

 
myApp.onPageInit('booking', function (page)
{
    $$("#book").on("click", ".btn-Booking-Details", function ()
    {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveLocalData("resno", pnr);
        SaveLocalData("phoneno", phoneNumber);
        GETReservationsPnrMobileNumber(pnr, phoneNumber);
    });

    $$("#book").on("click", ".btn-Add-to-cal", function ()
    {
        var phoneNumber = $$(this).data("phoneNumber");
        var pnr = $$(this).data("pnr");
        SaveReservationsToCalinder(pnr, phoneNumber);
    });


    function Getmybooking()
    {
        myApp.showPreloader("Loading");
        var authHeader = GetLocalData("authHeader");
        $$.ajax(
       {
           url: "https://mobile.saptco.com.sa/Reservation/Reservations/bookings",
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
               fillMyBooking(objectData.Results);
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

function GETReservationsPnrMobileNumber(pnr, mobile)
{
    myApp.showPreloader(GetResourceText("LoadingInformation"));
    $$.ajax({
        url: 'https://mobile.saptco.com.sa/Reservation/Reservations/' + pnr + "/" + mobile,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr)
        {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);
            SaveLocalObject("TicketSearch", objectData.Results.Tickets);
            mainView.router.load({ url: 'Tickets.html' });
        },
        error: function (jqXhr, textStatus, errorThrown)
        {
            myApp.hidePreloader();
            myApp.alert(GetResourceText("NoDataForBooking"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}

function SaveReservationsToCalinder(pnr, mobile, direction)
{
    myApp.showPreloader(GetResourceText("LoadingInformation"));
    $$.ajax({
        url: 'https://mobile.saptco.com.sa/Reservation/Reservations/' + pnr + "/" + mobile,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr)
        {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);

            var depName = objectData.Results.Tickets[0].DepartureStation.Name;
            var Descprition = "Trip Reservation time";
            if (direction == "return")
            {
                //  Direction: 
                var returnTicket = JSLINQ(objectData.Results.Tickets).Where(function (item) { return item.Direction == "Return"; });
                var start_Date = new Date(returnTicket.items[0].DepartureDate);
                var end_date = new Date(returnTicket.items[0].ArrivalDate);
                window.plugins.calendar.createEvent("SAPTCO", depName, Descprition, start_Date, end_date, onSuccess, onError);
            }
            else
            {
                var outTicket = JSLINQ(objectData.Results.Tickets).Where(function (item) { return item.Direction != "Return"; });
                var start_Date = new Date(outTicket.items[0].DepartureDate);
                var end_date = new Date(outTicket.items[0].ArrivalDate);
                window.plugins.calendar.createEvent("SAPTCO", depName, Descprition, start_Date, end_date, onSuccess, onError);
            }

        },
        error: function (jqXhr, textStatus, errorThrown)
        {
            myApp.hidePreloader();
            myApp.alert(GetResourceText("NoDataForBooking"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
}

myApp.onPageInit('Tickets', function (page)
{
    var pnrExtraDetails = GetLocalDataObject("pnrPayemntReturnInfo");
    if (pnrExtraDetails && pnrExtraDetails != null)
    {
        $$("#sectionPNR").css("display", "block");
        $$("#txtPnrNumber").text(pnrExtraDetails.ReservationNumber);

        if (pnrExtraDetails.IsConfirmed)
        {
            $$("#txtPnrStatus").text(GetResourceText("ResStatucConfirmed"));
            $$(".back").css("display", "none");
        }
        else
        {
            $$("#txtPnrStatus").text(GetResourceText("ResStatucNotConfirmed"));
            $$("#btnPrint").css("display", "none");
        }
        DeleteLocalData("pnrPayemntReturnInfo");
    }
    else
    {
        $$("#sectionPNR").css("display", "none");
    }

    var resno = GetLocalData("resno");
    phoneno = GetLocalData("phoneno");
    fillTickets();
    $$(document).on("click", ".btn-ticket", function ()
    {
        var ticketNo = $$(this).data("ticketNo");
        var isTransferable = $$(this).data("isTransferable");
        var itemIndex = $$(this).data("itemIndex");
        var selectedTicket = GetLocalDataObject("TicketSearch")[itemIndex];
        if (selectedTicket)
        {
            SaveLocalObject("selectedTransTicket", selectedTicket);
        }
        // on finsh     isTransferable
        if ('true' == 'true')
        {
            mainView.router.load({ url: 'TicketTransfer.html' });
        }
        else
        {
            myApp.alert(GetResourceText("nonTransTicket"), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
    $$("#btnPrint").on("click", function ()
    {
        var resno = GetLocalData("resno");
        var phoneno = GetLocalData("phoneno");
        //var pnr = $$("#btnPrint").data("pnr_Number");
        //var phoneNUmber = $$("#btnPrint").data("Mobile_Number");

        //printPDfFile('9163145', '966569811632');
        printPDfFile(resno, phoneno);
    });

    $$("#btnGoHomeTickets").on("click", function ()
    {
        mainView.router.load({ url: 'Home.html' });
    });

    function fillTickets()
    {
        var ticketsInfo = GetLocalDataObject("TicketSearch");
        var allHtmlTickets = "";
        if (ticketsInfo != null)
        {
            var ticketQuery = JSLINQ(ticketsInfo).Where(function (item) { return (item.IsPrintable); });
            if (ticketQuery.items.length > 0)
            {
                $$("#btnPrint").css("display", "block");
                $$("#btnPrint").data("pnr_Number", "");
                $$("#btnPrint").data("Mobile_Number", "");
            }
            else
            {
                $$("#btnPrint").css("display", "none");
            }

            for (var index = 0; index < ticketsInfo.length; index++)
            {
                var item = ticketsInfo[index];
                var lblDepartFrom = GetResourceText("lblDepartFrom");
                var lblArrivalTo = GetResourceText("lblArrivalTo");
                var lblDepartureOn = GetResourceText("lblDepartureOn");
                var lblReturnOn = GetResourceText("lblReturnOn");
                var lblPassengerName = GetResourceText("lblPassengerName");
                var lblTicketPrice = GetResourceText("lblTicketPrice");
                var lblTicketStatus = GetResourceText("lblTicketStatus");
                var lblTicketNumber = GetResourceText("lblTicketNumber");
                var imgArClassName = GetLocalData("imgLanguageClass");
                var transferClassClass = "col-50";
                var printClass = "col-50";
                var displayTrans = "none";
                var displayPrint = "none";
                item.IsPrintable = false;
                if (item.IsTransferable)
                {
                    displayTrans = "block";
                    transferClassClass = "col-100";
                }
                else
                {
                    displayTrans = "none";
                }
                if (item.IsPrintable)
                {
                    displayPrint = "block";
                    printClass = "col-100";
                }
                if (item.IsTransferable && item.IsPrintable)
                {
                    transferClassClass = "col-50";
                    printClass = "col-50";
                }

                var lblPrint = GetResourceText("lblPrint");
                var lblTransfer = GetResourceText("lblTransfer");

                var imageSource = "img/goingbus.png";

                var createdItem = '<li><div class="container-box-shaddow content-container " >' +
                    '   <div class="row no-gutter">                                                                                                                           ' +
                    '     <div class="col-100 selected-tab" style=" font-weight: 300; font-size: 16px !important; font-stretch: condensed;"> ' + lblTicketNumber + item.TicketNumber + ' </div>  ' +
                    '   </div>                                                                                                                                                ' +
                          '<div class="Depart">                            ' +
                              '<div class="from row">  ' +
                                ' <div class="col-50"> <h5 id="lblUserName"> ' + lblPassengerName + '</h5> </div>' +
                                ' <div class="col-50"> <h4 id="Passenger_Name" style="margin: 5px;" >' + item.Passenger.Name + '</h4></div>' +
                              '</div>                                          ' +
                          '</div>                                          ' +
                          '<div class="Depart">                            ' +
                      '<div class="from row">  ' +
                                ' <div class="col-50"> <h5 id="lblUserName">' + lblDepartFrom + '</h5> </div>' +
                                ' <div class="col-50"> <h4 id="Passenger_Name" style="margin: 5px;" >' + item.DepartureStation.Name + '</h4></div>' +
                              '</div>     ' +
                          '</div>                                          ' +
                          '<div class="Depart">                            ' +
                              '<div class="from row">                              ' +
                                  ' <div class="col-50"> <h5 id="lblTo">' + lblArrivalTo + '</h5>            </div>              ' +
                                  '<div class="col-50"><h4 id="ArrivalStation_Name" style="margin: 5px;" >' + item.ArrivalStation.Name + '</h4> </div>          ' +
                              '</div>                                          ' +
                          '</div>                                          ' +

                             '<div class="Depart">                            ' +
                                  '<div class="from row">  ' +
                                  ' <div class="col-50"> <h5  >' + lblTicketPrice + '</h5> </div>' +
                                  ' <div class="col-50"> <h4   style="margin: 5px;" >' + item.Amount + '</h4></div>' +
                              '</div>     ' +
                       '<div class="Depart">                            ' +
                                  '<div class="from row">  ' +
                                  ' <div class="col-50"> <h5  >' + lblTicketStatus + '</h5> </div>' +
                                  ' <div class="col-50"> <h4   style="margin: 5px;" >' + item.Status + '</h4></div>' +
                              '</div>     ' +
                          '</div>     ' +
                          '<div class="row">  ' +
                            '<div class="col-100 center-text ' + imgArClassName + '"><img src="' + imageSource + '" alt="Trip" class="trip-go-img" /></div>        ' +
                          '</div>          ' +
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
                        '<div class="Depart">                            ' +
                            '<div class="row no-gutter">' +
                                '<div  style="display:' + displayTrans + '" class="' + transferClassClass + '" id="btnTransferTicket"  data-ticketNo ="' + item.TicketNumber + '" data-isTransferable ="' + item.IsTransferable + '" data-itemIndex ="' + index + '"> <div class="trans-booking ">' + lblTransfer + '</div>            </div>              ' +
                                '<div  style="display:' + displayPrint + '" class="' + printClass + '" id= "btnPrintTicket"><div class ="print-ticket">' + lblPrint + '</div> </div>          ' +
                            '</div> ' +
                          '</div> ' +
                      '</div></li>';

                allHtmlTickets = allHtmlTickets + createdItem;
            }

            $$("#ticketsUl").html(allHtmlTickets);
        }
    }

    //show date picker.

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
    $$("#calenderInput").on("change", function ()
    {
        newDate = $$("#calenderInput").val();
        SaveLocalData("TicketSearch", ticketNumber);
        GetTicketTransTrip(ticketNumber, newDate);
    });
    var ticketNumber = "";
    $$(".TicketsVirtulelist").on("click", "#btnTransferTicket", function ()
    {
        setTimeout(function ()
        {
            calTrans.open();
        }, 300);
        ticketNumber = $$(this).data("ticketNo");
        //mainView.router.load("Tikets2.html");
    });

    $$(".TicketsVirtulelist").on("click", "#btnPrintTicket", function ()
    {
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

       function (dispose)
       {
           // dispose: object with X, Y of the last line add to the PDF 
           //          this allow the insertion of new lines after html
           pdf.save('ticket.pdf');
       }, margins);

    });
});
//////////////////////////////////////////////////
/***/////////////mybookingjs/***//////////////***/////////////
myApp.onPageInit('mybooking', function (page)
{

    $$(document).on('click', '#booking1', function (e)
    {
        mainView.router.load({ url: 'Booking.html' });
    });
    $$(document).on('click', '#history1', function (e)
    {
        mainView.router.load({ url: 'historytab.html' });
    });
    $$(document).on('click', '#mange1', function (e)
    {
        mainView.router.load({ url: 'mybooking.html' });
    });


    $$('#searchReservations').on('click', function ()
    {
        var resno = $$('#resno').val();
        var phoneno = $$('#txtCountryCode').val() + $$('#phoneno').val();
        SaveLocalData("resno", resno);
        SaveLocalData("phoneno", phoneno);
        GETReservationsPnrMobileNumber(resno, phoneno);
    });

});

/***//////////////***//////////////***////```//////////***/////////////


/**************************** Ticket Transfer*************************************/
myApp.onPageInit('TicketTransfer', function (page)
{
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

    $$("#btnSearchNewTicket").on('click', function ()
    {
        var newDate = $$("#calendar-date-Ticket").val();
        var selectedTicket = GetLocalDataObject("selectedTransTicket");
        var ticketNumber = selectedTicket.TicketNumber;
        //post trans
        GetTicketTransTrip(ticketNumber, newDate);

    });

});


function GetTicketTransTrip(ticketNumber, SearchDate)
{
    myApp.showPreloader(GetResourceText("Loading"));
    $$.ajax({
        url: 'https://mobile.saptco.com.sa/Reservation/transfer/' + ticketNumber + "/" + SearchDate,
        headers: {
            'Accept-Language': GetServiceLanguage(),
            Accept: 'application/json'
        },
        success: function (data, status, xhr)
        {
            myApp.hidePreloader();
            var objectData = JSON.parse(data);
            //fillStations(objectData.Results);
            SaveLocalObject("GetTicketTransTrip", objectData);

            if (objectData && objectData.Results[0] && objectData.Results[0].Days && objectData.Results[0].Days.length > 0)
            {
                SaveLocalObject("JournyID", objectData.Results[0].Days.JourneyID);
                mainView.router.load({ url: "changetime.html" });
            }
            else
            {
                myApp.alert(GetResourceText("NoTripsFound"));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        },
        error: function (xhr, status)
        {
            myApp.hidePreloader();
            myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
            $$(".modal-button-bold").text(GetResourceText('OkText'));

        }

    });
}
/***********************end of Ticket Transfer************************************/

/////////////////////////////////changed time rervation//////////////
myApp.onPageInit('changetime', function (page)
{

    var object = GetLocalDataObject("GetTicketTransTrip");
    var imageSource = "img/goingbus.png";

    if (object.Results[0] && object.Results[0].Days.length > 0)
    {
        var lblDuration = GetResourceText("Duration");
        var imgArClassName = GetLocalData("imgLanguageClass");
        var imageSource = "img/goingbus.png";
        var tripsList = object.Results[0].Days[0].Journies;
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
                    priceDivHtml = '<div class=" bg-color-s-light-orange row no-gutter btn-standard-price"   data-JourneyID ="' + item.JourneyID + '" data-OfferId ="' + item.OfferId + '" data-index ="' + index + '">    ' +
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
                              '    </div>                  ' +
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
                              '    </div>                  ' +
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
                                    '    </div>                  ' +
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
                                '    </div>                  ' +
                        '</div>    ';
            }


            listHtml = listHtml + '<li style="padding-bottom: 15px;">' +
                '<div class="content-container no-bottom-margins container-box-shaddow" style="z-index:1000 !important; border-radius: 8px;">' +
             '<div class="row trip-tripinfo">' +
             '<div class="col-100">      ' +

             '<div class="row">  ' +
             '<div class="col-100 center-text"><img src="' + imageSource + '" alt="Trip" class="trip-go-img ' + imgArClassName + '" /></div>        ' +
             '</div>          ' +
             '<div class="row">           ' +
             '  <div class="col-33 center-text font-size-14"> ' + item.DepartureTime + '  </div> ' +
             '  <div class="col-33 center-text font-size-14" style="font-weight: 300;">' + lblDuration + '</div>     ' +
             '  <div class="col-33 center-text font-size-14">' + item.ArrivalTime + '</div>   ' +
             '</div>          ' +
             '  <div class="row">           ' +
             '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + item.Trips[0].DepartureDate + '</div>         ' +
             '  <div class="col-33 center-text font-size-14">' + item.Duration + lblHours + '</div>     ' +
             '      <div class="col-33 center-text color-s-dark-orange font-size-14">' + item.Trips[0].ArrivalDate + '</div>         ' +
             '  </div>          ' +
                transitHtml +
                servicesHtmll +
                priceDivHtml +
                 '</li>';

        }
        $$("#list-trips-container").html(listHtml);
    }
    else
    {
        var massage = GetResourceText("NoTripsFound");
        myApp.alert(massage);
        $$(".modal-button-bold").text(GetResourceText('OkText'));
    }

    $$("#changeTripsList").on('click', ".btn-standard-price", function ()
    {

        var tiketid = GetLocalData("TicketSearch");
        var journyid = $$(this).data("JourneyID");
        PostReservationTransfer(tiketid, journyid);

        function PostReservationTransfer(tiketid, journyid)
        {
            journyid = journyid.replace("#", "%23");
            myApp.showPreloader("Loading");

            var urlAjax = 'https://mobile.saptco.com.sa/Reservation/transfer/' + tiketid + '/' + journyid;

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
                    myApp.hidePreloader();
                    var massage = GetResourceText("TransferDoneSucessfully");
                    myApp.alert(massage);
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                    mainView.router.load({ url: 'Home.html' });
                },
                error: function (data, xhr)
                {
                    myApp.hidePreloader();
                    var massage = GetResourceText("TransferFailed");
                    myApp.alert(massage);
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }

    });


});
///////////////////////////////////
/////////cAlendar
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

function onSuccess(msg)
{
    //TODO : add message
    //alert('Calendar success: ' + JSON.stringify(msg));
}

function onError(msg)
{
    //TODO : add message
    //alert('Calendar error: ' + JSON.stringify(msg));
}

function openCalendar()
{
    // today + 3 days
    var d = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
    window.plugins.calendar.openCalendar(d, onSuccess, onError);
}

function listCalendars()
{
    window.plugins.calendar.listCalendars(onSuccess, onError);
}

function createCalendar()
{
    window.plugins.calendar.createCalendar(calendarName, onSuccess, onError);
}

function deleteEvent()
{
    window.plugins.calendar.deleteEvent(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function createCalendarEvent()
{
    window.plugins.calendar.createEvent(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function createCalendarEventInteractively()
{
    window.plugins.calendar.createEventInteractively(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function createCalendarEventInteractivelyWithOptions()
{
    window.plugins.calendar.createEventInteractivelyWithOptions(title, loc, notes, startDate, endDate, options, onSuccess, onError);
}

function createCalendarEventWithOptions()
{
    window.plugins.calendar.createEventWithOptions(title, loc, notes, startDate, endDate, options, onSuccess, onError)
}

function findEventWithFilter()
{
    window.plugins.calendar.findEvent(title, loc, notes, startDate, endDate, onSuccess, onError);
}

function findEventNoFilter()
{
    window.plugins.calendar.findEvent(null, null, null, startDate, endDate, onSuccess, onError);
}

window.onerror = function (msg, file, line)
{
    alert(msg + '; ' + file + '; ' + line);
};