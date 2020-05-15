//detrmine device type
var isAndroid = false;//Framework7.prototype.device.android === true;
var isIos = true;//Framework7.prototype.device.ios === true;


//We also need to use this conditions in our Template7 templates, so we may assigin it to Template7 global context
Template7.global = {
    android: isAndroid,
    ios: isIos,
    isArabic: true,
    isEnglish: false
};


// Export selectors engine
var $$ = Dom7;

// include appropriate CSS files in our app depending on device
if (isAndroid)
{
    $$('head').append(
        '<link rel="stylesheet" href="css/framework7.material.min.css">' +
        '<link rel="stylesheet" href="css/framework7.material.colors.min.css">' +
        '<link rel="stylesheet" href="css/my-app.css">'
    );
}
else
{
    $$('head').append(
        '<link rel="stylesheet" href="css/framework7.ios.min.css">' +
        '<link rel="stylesheet" href="css/framework7.ios.rtl.css">' +
        '<link rel="stylesheet" href="css/framework7.ios.colors.min.css">' +
        '<link rel="stylesheet" href="css/my-app.css">'
    );
}

// change "Through" type navbar layout to "Fixed" in Material theme (for Android)
if (isAndroid)
{
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}

// Initialize your app 
if (Framework7.prototype.device.android === true)
{
    var myApp = new Framework7({
        // Enable Material theme for Android device only
        material: isAndroid ? true : false,
        // Enable Template7 pages
        template7Pages: true,
        // allows to close (but not open) panels with swipes
        swipePanelOnlyClose: true,
        // Default title for modals (Alert, Confirm, Prompt)
        modalTitle: 'SAPTCO',
        swipeBackPage: false
    });
}
else
{
    // Initialize your app 
    var myApp = new Framework7({
        // Enable Material theme for Android device only
        material: isAndroid ? true : false,
        // Enable Template7 pages
        template7Pages: true,
        // allows to close (but not open) panels with swipes
        swipePanelOnlyClose: true,
        // Default title for modals (Alert, Confirm, Prompt)
        modalTitle: 'SAPTCO',
        swipeBackPage: true
    });
}

Template7.data = {
    // This context will applied for page/template with "about.html" URL
    'url:schedulesandtickets.html': {
        title: 'Schedules and tickets',
    }
};


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page)
{
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function ()
    {
        createContentPage();
    });
});


$$('.home').on('click', function ()
{
    mainView.router.load({ url: 'Home.html' });
});

function loging()
{
    var profile = localStorage.getItem("storedprofile");
    var authHeader = localStorage.getItem("authHeader");
    if (authHeader != null && authHeader != 'null' && profile != null && profile != 'null')
    {
        $$("#logoutb").show();
        $$("#loginb").hide();
    } else
    {

        $$("#logoutb").hide();
        $$("#loginb").show();

    }
}


function loadScript(lang)
{

    lang = localStorage.getItem("Set_language");
    var script = document.createElement('script');
    script.type = 'text/javascript';
    var httpVal = "http";
    if (Framework7.prototype.device.android === true)
    {
        httpVal = "https";
    }
    script.src = httpVal + '://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCQ7F39NXXPZ66DAzsx2NOfcmR0YdRk-GM&libraries=places&sensor=false';
    if (lang)
    {
        script.src += '&language=' + lang;
    }

    script.id = "google-maps-script";
    document.body.appendChild(script);
}

window.onload = loadScript;

function ChangeGoogleMapsLanguage()
{

    var lang = localStorage.getItem("Set_language");
    //                oldScript = document.getElementById("google-maps-script");
    //            oldScript.parentNode.removeChild(oldScript);

    //  delete google.maps;

    loadScript(lang);
}

function profile()
{
    var profile = localStorage.getItem("storedprofile");
    var authHeader = localStorage.getItem("authHeader");
    if (authHeader != null && authHeader != 'null' && profile != null && profile != 'null')
    {
        $$("#myprofile").show();
        $$("#mysignup").hide();
    } else
    {

        $$("#myprofile").hide();
        $$("#mysignup").show();

    }
}



//Now we add our callback for initial page
myApp.onPageInit('index', function (page)
{
    

    if (page == null)
    {
        mainView.hideNavbar();
        mainView.hideToolbar();
        $$(".toolbar").css("display", "none");
        var mySwiper = myApp.swiper('.main-swiper-container', {
            speed: 400,
            pagination: '.swiper-pagination',
            paginationHide: false,
            paginationClickable: true,
            spaceBetween: 0,
            autoplay: 3000,
            autoplayDisableOnInteraction: false
        });

        loging();
        profile();

    }

    myApp.onPageInit('Home', function (page)
    {
        loging();
        profile();
    });
    launchSlider()
    $$(".btn-skip").on("click", function ()
    {
        mainView.showNavbar();
        mainView.showToolbar();
        $$(".toolbar").css("display", "block");
        $$(".toolbar").css("position", "absolute");
        mainView.router.load({ url: 'Home.html' });
    });
    $$('.open-Language-modal').on('click', function ()
    {

        var arabicCheked = "";
        var englishChecked = "";
        if (localStorage.getItem("ApplicationLanguage") == "ar")
        {
            englishChecked = "";
            arabicCheked = 'checked="checked"';
        }
        else
        {
            arabicCheked = "";
            englishChecked = 'checked="checked';
        }
        var checkBoxList = '<div class="list-block">' +
            '  <ul>                                                                                ' +
            '    <li>                                                                             ' +
            '      <label class="label-radio item-content">                                       ' +
            '        <!-- Checked by default -->                                                  ' +
            '        <input type="radio" name="my-radio" value="Arabic" ' + arabicCheked + ' class="arabicCheckBox" >         ' +
            '        <div class="item-inner">' +
            '          <div class="item-title">عربي</div>                                        ' +
            '        </div>                                                                       ' +
            '      </label>                                                                       ' +
            '    </li>                                                                               ' +
            '    <li>                                                                             ' +
            '      <label class="label-radio item-content">                                       ' +
            '        <input type="radio" name="my-radio" value="English"  ' + englishChecked + ' class="englishCheckBox">           ' +
            '        <div class="item-inner">                                                     ' +
            '          <div class="item-title">English</div>                                       ' +
            '        </div>                                                                       ' +
            '      </label>                                                                       ' +
            '    </li>                                                                            ' +
            '  </ul>                                                                              ' +
            '</div>                                                                               ';

        myApp.modal({
            title: ' اللغة/language',
            text: 'please select language <br/> الرجاء اختيار اللغة',
            afterText: checkBoxList,
            buttons: [
             {
                 text: 'ok',
                 onClick: function ()
                 {
                     localStorage.setItem("StationsStorage", null);
                     if ($$(".arabicCheckBox")[0].checked)
                     {
                         ChangeLanguage('ar');
                     }
                     else
                     {
                         ChangeLanguage('en');
                     }
                 }
             },
             {
                 text: 'cancel',
                 onClick: function ()
                 {
                 }
             },
            ]
        })
    });
}).trigger(); //And trigger it right away

myApp.onPageBeforeAnimation("Home", function () {

    //deleteFormsData();
    currentPage = "Home";
    var mySwiper = myApp.swiper('.main-swiper-container', {
        speed: 400,
        pagination: '.swiper-pagination',
        paginationHide: false,
        paginationClickable: true,
        spaceBetween: 0,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });
});

myApp.onPageAfterAnimation("index", function () {
    currentPage = "index";
    var mySwiper = myApp.swiper('.main-swiper-container', {
        speed: 400,
        pagination: '.swiper-pagination',
        paginationHide: false,
        paginationClickable: true,
        spaceBetween: 0,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });
});
// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage()
{
    mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
    return;
}



ChangeLanguage(GetApplicationLanguage());
function GetApplicationLanguage()
{

    var applicationLang = localStorage.getItem("ApplicationLanguage");
    if (applicationLang)
    {
        return applicationLang;
    }
    else
    {
        localStorage.setItem("ApplicationLanguage", "ar");
        return "ar";
    }
}

function ChangeLanguage(language)
{
    deleteFormsData();
    localStorage.setItem("ApplicationLanguage", language);
    var language_set;
    if (language == 'ar')
    {
        language_set = localStorage.setItem("Set_language", "ar");
        //this class should be added to each image we need to flip 
        localStorage.setItem("imgLanguageClass", 'img-direction-flip');
        localStorage.setItem("invertImgArClassName", 'engStyle');
        setArabicText();
        $$("#main-panel").addClass('panel-right');
        $$("#main-panel").removeClass('panel-left');
        $$("#mypanel").attr('data-position', 'right');
        $$("body").css("direction", "rtl");
        $$('head').append(
            '<link rel="stylesheet" href="css/Custom-ar.css">' +
            '<link rel="stylesheet" href="css/framework7.ios.rtl.css">');

        $$("#menu-item-Home").text("الرئيسية");
        $$("#menu-item-Booking").text("حجوزاتي");
        $$("#menu-item-contact").text("اتصال بنا");
        $$("#menu-item-More").text("المزيد");
        $$("#lblAdultCount").text("الكبار (1)");
        $$("#lblAdultDescription").text("اكبر من 12 سنة");
        $$("#lblChildCount").text("الاطفال");
        $$("#lblChildDescription").text("من سنتين حتى 12 سنة");
        $$("#lblInfantsDescription").text("أقل من سنتين");
        $$("#lblInfantsCount").text("الرضع");
        $$("#pnl-lbl-OurFleet").text("اسطولنا");
        $$("#pnl-lbl-Offers").text("العروض");
        $$("#pnl-lbl-Profile").text("حسابي");
        $$("#pnl-lbl-Favorite").text("القائمة المفضلة");
        $$("#pnl-lbl-Settings").text("الاعدادات");
        $$("#pnl-lbl-About").text("عن سابتكو");
        $$("#pnl-lbl-Terms").text("شروط الاستخدام");
        $$("#pnl-lbl-Kiosk").text("Kiosk");
        $$("#pnl-lbl-Privacy").text("سياسة الخصوصية");
        $$("#log").text("الدخول");
        $$(".btn-skip").text("ابدأ");
        $$(".language-btn").text("En/ع");
        $$("#btnPassengerCancel").text("الغاء");
        $$("#btnSavePassCount").text("موافق");
        $$("#loginp").text("الدخول");
        $$("#logoutp").text("الخروج");
        $$("#pnl-lbl-share").text("اخبر اصدقائك");
        $$("#pnl-lbl-Profile").text("حسابي");
        $$("#pnl-lbl-signup").text("انشاء حساب");
        $$("#imgTicket").attr("src", "img/ar-ticket.jpg");
        $$("#imgLimo").attr("src", "img/ar-limo.jpg");
        $$("#imgShip").attr("src", "img/ar-ship.jpg");
        $$("#imgVip").attr("src", "img/ar-vip.jpg");
    }
    else
    {

        language_set = localStorage.setItem("Set_language", "en");
        localStorage.setItem("imgLanguageClass", 'engStyle');
        localStorage.setItem("invertImgArClassName", 'img-direction-flip');
        setEnglishText();
        $$("#main-panel").addClass('panel-left');
        $$("#main-panel").removeClass('panel-right');
        $$("body").css("direction", "ltr");
        $$('head').append(
            '<link rel="stylesheet" href="css/Custom-en.css">');

        $$("#menu-item-Home").text("Home");
        $$("#menu-item-Booking").text("My Booking");
        $$("#menu-item-contact").text("Contact us");
        $$("#menu-item-More").text("More");
        $$("#lblAdultCount").text("Adults (1)");
        $$("#lblAdultDescription").text("More than 12 years");
        $$("#lblChildCount").text("Children");
        $$("#lblChildDescription").text("From 2 to 12 year");
        $$("#lblInfantsCount").text("Infants");
        $$("#lblInfantsDescription").text("Less than 2 years");
        $$("#pnl-lbl-OurFleet").text("Our Fleet");
        $$("#pnl-lbl-Offers").text("Offers");
        $$("#pnl-lbl-Profile").text("My Profile");
        $$("#pnl-lbl-Favorite").text("Favorite List");
        $$("#pnl-lbl-Settings").text("Settings");
        $$("#pnl-lbl-About").text("About us");
        $$("#pnl-lbl-Terms").text("Term of Use");
        $$("#pnl-lbl-Privacy").text("Privacy and Policy");
        $$("#log").text("Log in");
        $$(".btn-skip").text("Start");
        $$(".language-btn").text("En/ع");
        $$("#btnPassengerCancel").text("Cancel");
        $$("#btnSavePassCount").text("Done");
        $$("#loginp").text("Log in");
        $$("#logoutp").text("Log out");
        $$("#pnl-lbl-share").text("Tell a friend");
        $$("#pnl-lbl-Profile").text("My Profile");
        $$("#pnl-lbl-signup").text("Sign up");
        $$("#imgTicket").attr("src", "img/en-ticket.jpg");
        $$("#imgLimo").attr("src", "img/en-limo.jpg");
        $$("#imgShip").attr("src", "img/en-ship.jpg");
        $$("#imgVip").attr("src", "img/en-vip.jpg");
    }
    ChangeGoogleMapsLanguage(language_set);
    loging();
    profile();
}

function GetShareLink()
{
    if (Framework7.prototype.device.android === true)
    {
        return "https://play.google.com/store/apps/details?id=com.saptco.bus&hl=en";
    }
    else
    {
        return "https://itunes.apple.com/jo/app/saptco/id1074204412?mt=8";
    }
}

function GetResourceText(itemKey)
{
    var textValue = "";
    if (GetApplicationLanguage() == "en")
    {
        var resources = {
            "sellerLogoutAlert": "You have been logged out successfully",
            "plzEnterDep": "Pleas Enter Departure Station",
            "Plzarrivl": "Pleas Enter Arrival Station",
            "theminisoneadult": "The Minimum Is One Adult",
            "notvalidc": "Not Valid",
            "notvalidi": "Not Valid",
            "plzinfo": "Sorry...Please Fill All Information",
            "plzSelectStation": "Please Select Station",
            "ErrEnterDepartrureStations": "Sorry...Please Enter Departure Station",
            "ErrEnterArrivleStations": "Sorry...Please Enter Arrival Station",
            "ErrEnterDepartureDate": "Sorry...Please Enter Departure Date",
            "ErrEnterReturnDate": "Sorry...Please Enter Return Date",
            "ErrMinNumberOfAdult": "Sorry...Please Enter At Least One Adult or one Child",
            "NoTripsFound": "Sorry...There Are No Trips In The Selected Return Date",
            "WrongPhoneNumber": "Sorry...Please Enter Correct Phone Number between 8-14",
            "WrongEmailAddress": "Sorry...Please Enter Correct Email Address",
            "Errnamemustbefilled": "Sorry...Please Fill Your Name ",
            "ErrNationalityIDtypemustbefilled": "Sorry...Please Fill Your Nationality",
            "ErrBirthdate": "Sorry...Please Fill Your Birth Date ",
            "ErrIDType": "Sorry...Please Fill Your ID Type",
            "ErrNationalID": "Sorry...Your National ID is  Wrong",
            "ErrIqamaID": "Sorry...Your Iqama ID  Is Wrong",
            "ErrGCC": "Sorry...Your GCC ID  Is Wrong",
            "NotTripsInSelectedDate": "Sorry...No Trips Found In Selected Date",
            "ErrEnterfirstname": "Sorry...Please Enter First Name",
            "ErrEnterLastname": "Sorry...Please Enter Last Name",
            "ErrEnterEmail": "Sorry...Please Enter A valid Email ",
            "ErrEnterEmailAuth": "Sorry...Please Enter A valid Email ",
            "ErrEnterPassword": "Sorry...Please Enter Your Correct Password Between 6-30 Characters",
            "ErrGender": "Sorry...Please Enter Your Gender ",
            "ErrIDtype": "Sorry...Please Enter Your ID Type",
            "ErrNationalID": "Sorry...Please Enter Your National ID",
            "ErrDateofbirth": "Sorry...Please Enter Your BirthDate",
            "Errnationalnumber": "Sorry...Please Enter Your National Number",
            "ErrnationalID": "Sorry...Please Enter Your National ID",
            "ErrVersionnum": "Sorry...Please Enter The copies count",
            "ErrMobileNumber": "Sorry...Please Enter Your Mobile Number of 9 Digits ",
            "MsgSignUpSuccessfully": "Sign Up Completed Successfully ",
            "MsgSignUpFaild": "Sorry...Sign Up not Completed Successfully, Please Try Later",
            "InvalidUserNameOrPassword": "Sorry...Invalid Username or Password",
            "GenericError": "Sorry...Unable to complete operation, please try again later",
            "CheckAgree": "Sorry...Please Agree on terms and conditions to complete the reservation",
            "Error": "SAPTCO",
            "alert": "SAPTCO",
            "selectAllTrips": "Sorry...Please select Outword and return trips",
            "ErrEnterusername": "Sorry...please enter your Email address",
            "ErrEnterPassword": "Sorry...please enter your password",
            "userCreatedSuccessfully": "User Created Successfully, please login to continue",
            "ErrAdultAge": "Sorry...Adult age must be more than 12 years",
            "ErrAChildAge": "Sorry...Child age must be between 12 and 2 years",
            "ErrInfantAge": "Sorry...Infants age must be less than 2 years",
            "Loading": "Loading",
            "lblStabdardPrice": "Standard Price",
            "lblDiscountPrice": "Discount Price",
            "TicketTirms": "Ticket Tirms",
            "discountConfirmationRefund": "- Not Refundable",
            "discountConfirmationTrans": "- Not Transferable",
            "lblDepartFrom": "Departure From",
            "lblArrivalTo": "Arrival To",
            "lblDepartureOn": "Departure Date",
            "lblReturnOn": "Return Date",
            "lblTotalTicketPrice": "Tickets Price",
            "Select": "Select Station",
            "tripsFound": "We found ## trips matching your search ",
            "ErrNameValue": "Sorry...Please insert Your Name",
            "ErrCommentValue": "Sorry...Please insert Your Comment",
            "ErrRatingValue": "Sorry...Please insert rate value",
            "errorNotAbleFeedback": "Sorry...Unable to save your feedback, please try again later",
            "noBookingFound": "Sorry...There are no booking for the current user",
            "feedBackSentSuccess": "Feedback was sent successfully",
            "NoDataForBooking": "Sorry...There are no reservation data related to the search data",
            "nonTransTicket": "Sorry...This ticket cannot be transferred to another date",
            "NoResultFoundCustomer": "Sorry...No customer was found matching search",
            "lblAdults": "Adults",
            "lblChild": "Children",
            "lblInfants": "Infants",
            "errLoginToViewHistory": "Sorry...Please login to view history",
            "errLoginToViewBookings": "Sorry...Please login to view Bookings",
            "transitHeader": "Transit trips",
            "servicesHeader": "Services",
            "ErrorPassData": "Sorry...There is missing data for customer :",
            "ErrSameStationsSelected": "Sorry...Please select different arrival station",
            "Customer": "Passenger",
            "logon": "Log in",
            "Logout": "Log out",
            "lblTransfer": "Change Date",
            "lblDetails": "Details",
            "lblFeedback": "Feedback",
            "lblPassengerName": "Passenger name",
            "LoadingInformation": "Loading Information",
            "lblPrint": "Print",
            "lblTicketPrice": "Ticket price",
            "TransferDoneSucessfully": "Tickets transfer completed successfully",
            "TransferFailed": "Sorry...Failed to transfer the ticket, please try again later",
            "CustomerAlreadyExist": "Sorry...The passenger is already added to favorit list",
            "Errlog": "Sorry...Please login to continue",
            "LogText": "User Profile",
            "log_btn": "Login",
            "Cnl_btn": "Cancel",
            "PassengerAlreadyAdded": "Sorry...Customer information already added",
            "loginn": "Login",
            "logoutt": "Logout",
            "addToCalendar": "Add to Calendar",
            "lblPnrNumber": "Reservation No.",
            "lblIsConfirmed": "Status",
            "lblTicketNumber": "Ticket Number : ",
            "SAR": " SR ",
            "Duration": "Duration",
            "Agree": "Agree",
            "PNR": "Reservation Number",
            "ResStatucConfirmed": "Confirmed ",
            "ResStatucNotConfirmed": "Not Confirmed ",
            "shareMessage": "This is a AWESOME aplication",
            "Cancel": "Cancel",
            "Passenger_Name": "Passenger Name",
            "lblMeals": "Meals",
            "lblChargres": "Chargers",
            "lblrefreshments": "Refreshments",
            "lblDirect": "Direct Trips",
            "lblNewspapers": "Newspapers",
            "lblagree": "I Agree To The Terms And Conditions.",
            "lblTirmsMessage": "Conditions",
            "errNotCompletedPayemnt": "Sorry..The payment not completed successfully, please try reservation again",
            "lblHours": " hrs",
            "errnoConnection": "Sorry service is not available at this time, please try again later",
            "lblTicketStatus": "Status",
            "OkText": "OK",
            "CancelText": "Cancel",
            "localizeDescription": "en_us",
            "PassengerlblGoingTic": "Ticket Details",
            "PassengerlblFrom": "From",
            "PassengerlblTo": "To",
            "PassengerlblReturnTi": "Return Ticket",
            "PassengerlblFrom1": "From",
            "PassengerlblTo1": "To",
            "PassengerlblPassenger": "Passengers Info",
            "PassengerlblpassType": "Passenger Type",
            "Passengerlblnatio": "Nationality",
            "PassengerlblGender": "Gender",
            "PassengerlblBirth": "Date Of Birth",
            "Passengerlbltitle": "Passengers",
            "PassengerlblName": "Name",
            "PassengerlblGoingTicket": "Going Ticket",
            "PassengerlblTicketFee": "Ticket Price",
            "PassengerlblTicketNumber": "Ticket Number",
            "PassengerSAR": " SR ",
            "PassengerlblTicketDate": "Trip Date",
            "PassengerlblDuration": "Duration",
            "classArabic": "",
            "Adult": "Adult",
            "AnEmailWillBeSend": "A link will be sent soon to your provided email address, please use this link to reset your password",
            "Child": "Child",
            "Infant": "Infant",
            "titleone": "Welcome To SAPTCO",
            "rentBusRequest": "The receipt of the request will be successfully communicate with you soon, do you want to establish a new order?",
            "ErrContractnum": "Sorry.. Enter The Contract Number",
            "ErrCompanyName": "Sorry...Please You Must Fill Your Company Name",
            "ErrCommRecord": "Sorry...Please Enter The Commercial Record",
            "ErrCusLocation": "Sorry...Please Enter The Customer Location",
            "Errtriptime": "Sorry...Please Enter The Trip Time",
            "ErrDepartFrom": "Sorry...Please Enter The Departure From",
            "ErrDepartto": "Sorry...Please Enter The Departure To",
            "ErrPickup_Location": "Sorry...Please Enter The Pickup Location",
            "errServiceType": "Sorry...Please Enter The Service Type",
            "ErrEnterCarryLoadLoc": "Sorry...Please select From City",
            "ErrEnterDelveryLoc": "Sorry...Please select the To City",
            "ErrEnterDirection": "Sorry...Please select the Direction",
            "ErrEnterTruckType": "Sorry...Please select the Truck Type",
            "ErrEnterTruckNumber": "Sorry...Please enter the Trucks Count between 1-1000",
            "ErrEnterPickupLocation": "Sorry...Please enter Pick up information",
            "ErrEnterDeliveryLocation": "Sorry...Please enter Delivery information",
            "ErrEnterCargoType": "Sorry...Please enter the type of the item",
            "ErrEnterCustomerName": "Sorry...Please You Must Fill Customer Name ",
            "WrongCustomerMobileNo": "Sorry...Please Enter Correct Customer Mobile  Number between 8-14",
            "ErrEnterCustomerEmail": "Sorry...Please Enter A valid Customer Email ",
            "ErrSalesOffice": "Please Select Sales Office",
            "ErrEnterCompanyName": "Sorry...Please You Must Fill Company Name",
            "WrongCompanyPhoneNumber": "Sorry...Please Enter Correct Company Phone  Number between 8-14",
            "ErrEnterCompanyFaxNo": "Sorry...Please Enter Correct Company Fax  Number between 8-14",
            "ErrBusType": "Please Select Bus Type",
            "ErrBusCount": "Please Select Bus Count between 1 -100",
            "ErrRequestDateTime": "Please Select Service Date",
            "ErrDirectionFrom": "Sorry...Please You Must Fill Direction From ",
            "ErrDirectionTo": "Sorry...Please You Must Fill ErrDirection To ",
            "ErrServiceLocation": "Sorry...Please You Must Fill Service Location",
            "BusRentSuccess": "Rent Bus request was sent successfully",
            "RequestSentSuccessfully": "Your Request was sent successfully",
            "errorNotAbleRentBus": "Sorry...Unable to Rent Bus, please try again later",
            "ErrNameValueAuthorized": "Sorry...Please insert Name of Authorized persone",
            "GPSError": "You can't get your current Location please turn on your GPS Location",
            "Edit": "Edit",
            "Delete": "Delete",
            "DeleteConfirm": "Are you sure you want to delete this Item",
            "Swiper_direction": "right",
            "AddUpdate": "Add/ Update",
            "SearchUsers": "Search",
            "FromFavorit": "Favorite List",
            "lblPassengerInfo": "Passenger Info",
            "ErrInterNetConnection": "please connect to internet to complete working on application",
            "ErrInterNetConnectionBefor": "please connect to internet to complete working on application",
            "errServiceType": "Sorry...Please Enter The Service Type",
            "ErrServiceType": "Sorry...Please Enter The Service Type",
            "errServiceDuration": "Sorry...Please Enter The Service Duration",
            "errCartype": "Sorry...Please Enter The Car Type",
            "errCityName": "Sorry...Please Enter The City",
            "errPayMethod": "Sorry...Please Enter The Pay Method",
            "version": "version:"
        };
        textValue = resources[itemKey];
    }
    else
    {
        var resources = {
            "sellerLogoutAlert": "نم نسجيل الخروج بنجاح",
            "plzEnterDep": "الرجاء ادخال مكان المغادرة",
            "Plzarrivl": "الرجاء ادخال مكان الوصول",
            "theminisoneadult": "الحد الادنى بالغ واحد على الاقل",
            "notvalidc": "غير صحيح",
            "notvalidi": "غير صحيح",
            "plzinfo": "الرجاء ادخال كافة المعلومات",
            "plzSelectStation": "الرجاء اختيار محطة",
            "ErrEnterDepartrureStations": "عذرا...الرجاء إدخال محطة المغادرة",
            "ErrEnterArrivleStations": "عذرا...الرجاء إدخال محطة الوصول",
            "ErrEnterDepartureDate": "عذرا...الرجاء إدخال تاريخ المغادرة",
            "ErrEnterReturnDate": "عذرا...الرجاء إدخال تاريخ العودة",
            "ErrMinNumberOfAdult": "عذرا...الرجاء إدخال شخص بالغ واحد او طفل واحد على الأقل",
            "NoTripsFound": "عذرا...لا يوجد رحلات في التاريخ الذي تم اختياره",
            "WrongPhoneNumber": "  عذرا...الرجاء ادخال رقم هاتف صحيح من 8 الى 14 خانة",
            "WrongEmailAddress": "عذرا...الرجاء ادخال البريد الالكتروني بشكل صحيح",
            "Errnamemustbefilled": "عذرا...للرجاء ادخال الاسم",
            "ErrNationalityIDtypemustbefilled": "عذرا...الرجاء ادخال الجنسية ",
            "ErrBirthdate": "عذرا...الرجاء ادخال تاريخ الميلاد ",
            "ErrIDType": "عذرا...الرجاء ادخال نوع الهوية",
            "ErrNationalID": "عذرا...خطأ في رقم بطاقة هوية ",
            "ErrIqamaID": "عذرا...خطأ في رقم فيزا اقامة",
            "ErrGCC": "عذرا...خطأ في رقم مواطن مجلس التعاون",
            "NotTripsInSelectedDate": "عذرا...لا يوجد رحلات في اليوم المختار",
            "ErrEnterfirstname": "عذرا...الرجاء ادخال الاسم الاول",
            "ErrEnterLastname": "عذرا...الرجاء ادخال الاسم الاخير",
            "ErrEnterEmail": "عذرا...الرجاء ادخال بريد الكتروني صحيح",
            "ErrEnterEmailAuth": "عذرا...الرجاء ادخال بريد الكتروني صحيح",
            "ErrEnterPassword": "عذرا...الرجاء ادخال كلمة مرور بين 6-30 خانة",
            "ErrGender": "عذرا...الرجاء ادخال الجنس",
            "ErrIDtype": "عذرا...الرجاء ادخال نوع الهوية",
            "ErrNationalID": "عذرا...الرجاء ادخال رقم هوية صحيح ",
            "ErrDateofbirth": "عذرا...الرجاء ادخال تاريخ الميلاد",
            "Errnationalnumber": "عذرا...الرجاء ادخال رقم الهوية ",
            "ErrnationalID": "عذرا...الرجاء ادخال رقم الهوية ",
            "ErrVersionnum": "عذرا...الرجاء ادخال عدد النسخ",
            "ErrMobileNumber": "عذرا...الرجاء ادخال رقم الجوال من 9 خانات",
            "MsgSignUpSuccessfully": "تم التسجيل بنجاح",
            "MsgSignUpFaild": "عذرا...لم تتم عملية التسجيل بنجاح، الرجاء المحاولة لاحقاً",
            "InvalidUserNameOrPassword": "عذرا...كلمة المرور او البريد الالكتروني غير صحيح",
            "GenericError": "عذرا...لا يمكن اتمام العملية حالياً، الرجاء المحاولة لاحقاً",
            "CheckAgree": "الرجاء الموافقة على الشروط و الاحكام لاكمال الحجز",
            "Error": "سابتكو",
            "alert": "سابتكو",
            "selectAllTrips": "الرجاء اختيار رحلة الذهاب و العودة",
            "ErrEnterusername": "عذرا...الرجاء ادخال البريد الإلكتروني",
            "ErrEnterPassword": "عذرا...الرجاء ادخال كلمة مرور بين 6-30 خانة",
            "userCreatedSuccessfully": "تم انشاء الحساب بنجاح, الرجاء الدخول باستخدام البريد الإلكتروني و كلمة المرور",
            "ErrAdultAge": "عذرا...يجب أن يكون سن البالغين أكثر من 12 عاما",
            "ErrAChildAge": "عذرا...يجب أن يكون عمر الأطفال بين 12 و 2 سنوات",
            "ErrInfantAge": "عذرا...يجب أن يكون عمر الأطفال الرضع أقل من 2 سنة",
            "Loading": "جاري البحث",
            "lblStabdardPrice": "السعر الاساسي",
            "lblDiscountPrice": "السعر التشجيعي",
            "TicketTirms": "شروط الحجز",
            "discountConfirmation": "1- غير قابلة للتحويل ، 2- غير مستردة",
            "discountConfirmationRefund": "- غير مستردة",
            "discountConfirmationTrans": "- غير قابلة للتحويل",
            "lblDepartFrom": "المغادرة من ",
            "lblArrivalTo": "الوصول الى ",
            "lblDepartureOn": "تاريخ الذهاب",
            "lblReturnOn": "تاريخ العودة",
            "lblTotalTicketPrice": "سعر التذاكر",
            "Select": " اختر المحطة",
            "tripsFound": "لقد وجدنا ## رحلات تطابق البحث",
            "ErrNameValue": "عذرا...الرجاء ادخال اسمك",
            "ErrCommentValue": "عذرا...الرجاء ادخال رايك",
            "ErrRatingValue": "عذرا...الرجاء اختيار تقيمك للرحلة",
            "errorNotAbleFeedback": "عذرا...لم تتم عملية تسجيل تقيمك بنجاح، الرجاء المحاولة لاحقا",
            "noBookingFound": "عذرا...لا يوجد حجوزات للمستخدم الحالي",
            "feedBackSentSuccess": "تم إرسال ملاحظاتك بنجاح",
            "NoDataForBooking": "عذرا...لا يوجد معلومات حجز تتعلق ببيانت البحث",
            "nonTransTicket": "عذرا...لا يمكن نقل هذه التذكرة إلى موعد آخر",
            "NoResultFoundCustomer": "عذرا...لا يوجد بيانات تطابق معلومات البحث",
            "lblAdults": "الكبار",
            "lblChild": "الاطفال",
            "lblInfants": "الرضع",
            "errLoginToViewHistory": "عذرا...الرجاء تسجيل الدخول لعرض الحجوزات القديمة",
            "errLoginToViewBookings": "عذرا...الرجاء تسجيل الدخول لعرض الحجوزات",
            "transitHeader": "الرحلات الغير مباشرة",
            "servicesHeader": "الخدمات",
            "ErrorPassData": "عذرا...بيانات الراكب غير مكتملة :",
            "ErrSameStationsSelected": "عذرا...الرجاء تحديد محطة وصول مختلفة",
            "Customer": "الراكب",
            "logon": "الدخول",
            "Logout": "الخروج",
            "lblTransfer": "تغيير الموعد",
            "lblDetails": "تفاصيل",
            "lblFeedback": "تقيمك",
            "lblPassengerName": "اسم الراكب",
            "LoadingInformation": "تحميل البيانات",
            "lblPrint": "طباعة",
            "lblTicketPrice": "سعر التذكرة",
            "TransferDoneSucessfully": "تم تغير موعد التذكرة بنجاح",
            "TransferFailed": "عذرا...لم تتم عملية نقل التذكرة بنجاح، الرجاء المحاولة لاحقاً",
            "CustomerAlreadyExist": "عذرا...الراكب موجود مسبقا في القائمة المفضلة",
            "Errlog": "عذرا...الرجاء تسجيل الدخول للمتابعة",
            "LogText": "حساب المستخدم",
            "log_btn": " تسجيل الدخول",
            "Cnl_btn": "الغاء",
            "PassengerAlreadyAdded": "معلومات العميل مضافة مسبقا",
            "loginn": "تسجيل الدخول",
            "logoutt": "تسجيل الخروج",
            "addToCalendar": "أضف الى التقويم ",
            "lblPnrNumber": "رقم الحجز",
            "lblIsConfirmed": "حالة الحجز",
            "lblTicketNumber": "تذكرة رقم : ",
            "SAR": " ر.س ",
            "Duration": "المدة",
            "Agree": "موافق",
            "PNR": "رقم الحجز",
            "ResStatucConfirmed": "مؤكّدة",
            "ResStatucNotConfirmed": "غير مؤكّدة ",
            "shareMessage": "تطبيق جميل ",
            "Cancel": "الغاء",
            "Passenger_Name": "اسم الراكب",
            "lblMeals": "وجبات",
            "lblChargres": "توصيلات اجهزة",
            "lblrefreshments": "مشروبات",
            "lblDirect": "بدون توقف",
            "lblNewspapers": "صحف",
            "lblagree": " انا موافق على الشروط و الأحكام",
            "lblTirmsMessage": "الإتفاقية",
            "lblHours": " ساعة",
            "errNotCompletedPayemnt": "عذرا...لم تتم عملية الدفع بشكل صحيح، الرجاء محاولة الحجز مرة اخرى ",
            "errnoConnection": "عذرا الخدمة غير متاحة في الوقت الحالي، الرجاء المحاولة في وقت لاحق",
            "lblTicketStatus": "الحالة",
            "OkText": "موافق",
            "CancelText": "إلغاء",
            "localizeDescription": "ar_sa",
            "PassengerlblGoingTic": "معلومات التذكرة ",
            "PassengerlblFrom": "من",
            "PassengerlblTo": "الى",
            "PassengerlblReturnTi": "تذكرة عوده",
            "PassengerlblFrom1": "من",
            "PassengerlblTo1": "الى",
            "PassengerlblPassenger": "معلومات الراكب",
            "PassengerlblpassType": "فئه الراكب",
            "Passengerlblnatio": "الجنسية",
            "PassengerlblGender": "الجنس",
            "PassengerlblBirth": "تاريخ الميلاد",
            "Passengerlbltitle": "الركاب",
            "PassengerlblName": "الاسم",
            "PassengerlblGoingTicket": "تذكرة الذهاب",
            "PassengerlblTicketFee": "سعر التذكرة",
            "PassengerlblTicketNumber": "رقم التذكرة",
            "PassengerSAR": " ر.س ",
            "PassengerlblTicketDate": "تاريخ الرحلة",
            "PassengerlblDuration": "المدة",
            "classArabic": "img-direction-flip",
            "Adult": "كبير",
            "Child": "طفل",
            "Infant": "رضيع",
            "titleone": "اهلا بك في سابتكو",
            "AnEmailWillBeSend": "سوف يتم ارسال رابط الى البريد الالكتروني المدخل لاعادة ضبط كلمة المرور",
            "rentBusRequest": "تم استلام الطلب بنجاح وسيتم التواصل معكم قريبا،هل تريد انشاء طلب جديد؟",
            "ErrContractnum": "عذرا...الرجاء ادخال رقم العقد ",
            "ErrCompanyName": "عذرا...الرجاء ادخال اسم الشركة",
            "ErrCommRecord": "عذرا...الرجاء ادخال السجل التجاري",
            "ErrCusLocation": "عذرا...الرجاء ادخال موقع العميل",
            "Errtriptime": "عذرا...الرجاء ادخال زمن الرحلة ",
            "ErrDepartFrom": "عذرا...الرجاء ادخال الاتجاه من ",
            "ErrDepartto": "عذرا...الرجاء ادخال الاتجاه الى ",
            "ErrPickup_Location": " عذرا...الرجاء ادخال تفاصيل العنوان ",
            "errServiceType": "عذرا... الرجاء ادخال نوع الخدمة",
            "ErrServiceType": "عذرا... الرجاء ادخال نوع الخدمة",
            "ErrEnterCarryLoadLoc": "عذرا... الرجاء اختيار من مدينة",
            "ErrEnterDelveryLoc": "عذرا... الرجاء اختيار الى مدينة",
            "ErrEnterCargoType": "عذرا... الرجاء ادخال نوع البضاعة",
            "ErrEnterDirection": "عذرا... الرجاء اختيار نوع الوجهة",
            "ErrEnterTruckType": "عذرا... الرجاء اختيار نوع الشاحنة",
            "ErrEnterTruckNumber": "عذرا... الرجاء ادخال عدد الشاحنات بين 1-1000 ",
            "ErrEnterPickupLocation": "عذرا... الرجاء ادخال  معلومات التحميل",
            "ErrEnterDeliveryLocation": "عذرا... الرجاء ادخال معلومات التنزيل",
            "ErrEnterCustomerName": "عذرا...الرجاء ادخال اسم العميل",
            "WrongCustomerMobileNo": "عذرا...الرجاء ادخال رقم الجوال من 9 خانات",
            "ErrEnterCustomerEmail": "عذرا...الرجاء ادخال البريد الإلكتروني",
            "ErrSalesOffice": "عذرا...الرجاء اختيار مكتب المبيعات",
            "ErrEnterCompanyName": "عذرا...الرجاء ادخال اسم الشركة",
            "WrongCompanyPhoneNumber": "عذرا...الرجاء ادخال رقم الهاتف من 9 خانات",
            "ErrEnterCompanyFaxNo": "عذرا...الرجاء ادخال رقم الفاكس من 9 خانات",
            "ErrBusType": "عذرا...الرجاء اختيار نوع الحافلة",
            "ErrBusCount": "عذرا...الرجاء إدخال عدد الحافلات بين 1-100",
            "ErrRequestDateTime": "عذرا...الرجاء إختيار التاريخ ",
            "ErrDirectionFrom": "عذرا...الرجاءادخال الاتجاه من",
            "ErrDirectionTo": "عذرا...الرجاء ادخال الاتجاه إلى",
            "ErrServiceLocation": "عذرا...الرجاء ادخال مكان الاستلام",
            "BusRentSuccess": "تم إرسال طلب استاجار حافلة بنجاح",
            "RequestSentSuccessfully": "تم إرسال طلبك بنجاح ",
            "errorNotAbleRentBus": "عذرا...لم تتم عملية حجز الحافله، الرجاء المحاولة لاحقا",
            "ErrNameValueAuthorized": "عذرا...الرجاء ادخال اسم الشخص المفوض",
            "GPSError": "لا يمكنك الحصول على موقعك الحالي الرجاء تفعيل نظام تحديد المواقع",
            "Edit": "تعديل",
            "Delete": "حذف",
            "DeleteConfirm": "هل انت متاكد من حذف الخدمة المختارة",
            "Swiper_direction": "left",
            "AddUpdate": "إضافة/تحديث",
            "SearchUsers": "بحث",
            "FromFavorit": "قائمة المفضلة",
            "lblPassengerInfo": "معلومات الركاب",
            "ErrInterNetConnection": "يرجى الاتصال بالإنترنت لإتمام العمل في التطبيق",
            "ErrInterNetConnectionBefor": "يرجى الاتصال بالإنترنت لإتمام العمل في التطبيق",
            "errServiceType": "عذرا... الرجاء ادخال نوع الخدمة",
            "errServiceDuration": "عذرا... الرجاء ادخال مدة الخدمة",
            "errCartype": "عذرا... الرجاء ادخال نوع السيارة",
            "errCityName": "عذرا... الرجاء ادخال المدينة",
            "errPayMethod": "عذرا... الرجاء ادخال طريقة الدفع",
            "version": "الإصدار:"



        };
        textValue = resources[itemKey];
    }
    return textValue;
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady()
{
    var version = AppVersion.version;
    var element = document.getElementById('deviceProperties');
    element.innerHTML = GetResourceText("version") + version;
    if (Framework7.prototype.device.android === true)
    {
        window.setTimeout(function ()
        {
            navigator.splashscreen.hide();
            var bottom = $$(window).height() - 75;;
            $$('#btnSkipScreen').offset({ top: bottom })
            $$('#btnSkipScreen').css({ "display": "block" });
            $$('#btnSkipScreen').css({ "width": "100%" });
            $$('#btnSkipScreen').css({ "float": "right" });

            //alert(bottom - coords.top);
        }, 3000);
    }
    deleteFormsData();
    document.addEventListener("backbutton", onBackKeyDown, false);
    var deviceInfo =
        {
            MobileType: device.manufacturer,
            OS: device.platform,
            MobileID: device.uuid,
            Version: device.version,
            ApplicationVersion: "1.0"
        }
    localStorage.setItem("deviceInfo", JSON.stringify(deviceInfo));

    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e)
    {
        myApp.closeModal('.picker-modal');
    }

}




function onBackKeyDown() { }

// Set Screens text
function setArabicText()
{
    Template7.data = {
        // This context will applied for page/template with "about.html" URL
        'url:Home.html': {
            titleone: " اهلا بك في سابتكو",
            titleTwo: "الرجاء اختيار الخدمة التي تريدها",
            lblTitle: "الرئيسية",
            btnLimoReq: "img/Ar_Limo.svg",
            btnCargoReq: "img/Ar_Cargo.svg",
            btnBuyTicket: "img/Ar_BuyTicket.svg",
            btnBusCharter: "img/Ar_BusCharterRequest.svg",
            languageRes: "?lang=ar-SA"
        },
        'url:LimoStartReservation.html': {
            yourLocationis: "موقعك الحالي",
            PickupLocation: "إختر مكان الانطلاق",
            Select: "إختر",
            destinationlocation: "إختر مكان الوصول",
            GetCurrentLocation: "عرض موقعك الحالي",
            Continue: "تابع",
            PicLocation_png: "img/PickupLoc_ar2.png",
            SetDist_png: "img/SetDist_ar2.png",


        },
        'url:MapLocationSelect.html': {
            yourLocationis: "موقعك الحالي",
            PickupLocation: "إختر مكان الانطلاق",
            Select: "إختر",
            destinationlocation: "إختر مكان الوصول",
            GetCurrentLocation: "عرض موقعك الحالي",
            Continue: "تابع",
            PicLocation_png: "img/PickupLoc_ar2.png",
            SetDist_png: "img/SetDist_ar2.png",
            SearchBox: "بحث"
        },
        'url:schedulesandtickets.html': {
            title: "تذاكر السفر",
            lblSubHeader: "جداول التذاكر",
            lblOneWay: " ذهاب فقط",
            lblRoundtrip: "ذهاب و عودة",
            lbldepartureFrom: "المغادرة من",
            lblArrivalTo: "الوصول الى",
            lblDepOn: " المغادرة",
            lblRetTo: " العودة",
            lblPassengersLabel: "الركاب",
            btnSearch: "البحث",
            btnCancel: "الغاء",
            btnDone: "حفظ",
            lblAdults: "الكبار",
            lblAdultsRange: "اكثر من 12 سنة",
            lblChildRange: "بين سنتين الى اربعة سنين",
            lblInfRange: "اقل من سنتين",
            lblPassengers: "الكبار (1)، أطفال (0)، الرضع (0)",
            lblDepartureDate: "اختر التاريخ",
            lblReturnDate: "اختر التاريخ",
            imgBusDep: "busdepa_ar.png",
            imgBusArrive: "busarriv_ar.png",
            lblChild: "الاطفال",
            lblInfants: "الرضع",
            classArabic: "",
            lblVipType: "نوع الرحلة",
            vip: "الخدمة المميزة",
            reg: "الخدمة العادية",
            all: "الجميع",
            DoneText: "موافق"


        },

        'url:aboutus.html': {
            DisplayEnglish: "none",
            DisplayArabic: "block",
            lblTitle: "نبذة عن",
            lblP1: "بدأت الجهود المكثفة لترسيخ مفهوم النقل العام في المملكة منذ صدور المرسوم الملكي الكريم رقم (م / 11) وتاريخ 7/3/1399هـ بالموافقة على الترخيص بتأسيس الشركة السعودية للنقل الجماعي، لنقل الركاب في المملكة العربية السعودية، وقد أتبع ذلك بمرسوم ملكي كريم آخر برقم (م / 48) وتاريخ 23/12/1399هـ، مانحاً الشركة السعودية للنقل الجماعي (شركة مساهمة سعودية) التزام نقل الركاب بالحافلات لمدة خمس عشرة سنة هجرية وفقاً لعقد الالتزام المبرم بين الشركة ووزارة النقل.",
            lblP2: "وتقديراً لنجاحات الشركة، واستشرافاً لما يمكن أن تحققه في المستقبل، صدر قرار مجلس الوزراء الموقر برقم (57) وتاريخ 1/6/1414هـ بالموافقة على تجديد عقد الالتزام المبرم بين الحكومة والشركة السعودية للنقل الجماعي، الصادر بالمرسوم الملكي (م / 48) وتاريخ 23/12/1399هـ بذات الشروط الواردة فيه ولمدة خمسة عشر عاماً اعتباراً من01/07/1414هـ ، وبتاريخ 21/05/1429هـ تم تجديد عقد الالتزام لمدة خمس سنوات أخرى قابلة للتمديد إعتباراً من 1/7/1429 هـ، وتم تمديد عقد الإلتزام لمدة 3 سنوات أخرى إعتباراً من 01/07/1434هـ.",
            lblP3: "ولغرض توفير الموارد المالية اللازمة، التي تــضمن الوفاء بالتزامات الشركة على الوجه الأكمل، حدد النظام الأساسي للشركة رأسمالها بـ (1.000.000.000) ألف مليون ريال سعودي تم زيادته إلى (1.250.000.000) ألف ومائتين وخمسون مليون ريال سعودي خلال عام 2007م، كما حدد غرضها الرئيسي وهو نقل الركاب بالحافلات على شبكة الطرق العامة داخل المدن وفيما بينها.<br> بلغ عدد المركبات بالشركة (4.500) مركبة. <br> توفر الشركة شبكة خطوط واسعة ومنتظمة بين المدن، تربط أكثر من (385) مدينة وقرية وهجرة في مختلف أنحاء المملكة. <br> تغطي خدمات الشركة المحلية (داخل المدن) خمس مدن رئيسية بالمملكة هي (الرياض، مكة المكرمة، المدينة المنورة، جدة، الدمام). <br> وفي تطور آخر يعكس مدى التزام الشركة بتوسيع خدماتها، تعدت أنشطتها من النطاق المحلي إلى النطاق الدولي لتصل برحلاتها إلى ثمان دول خليجية وعربية مجاورة هي: دولة الإمارات العربية المتحدة، مملكة البحرين، دولة قطر، دولة الكويت، جمهورية مصر العربية، المملكة الأردنية الهاشمية، الجمهورية العربية اليمنية، جمهورية السودان. <br>  لتحقيق هذه الرؤية بتوسيع الخدمات، تقوم الشركة بتسيير رحلات مجدولة يومياً تصل إلى (800) رحلة في الأيام العادية و (1000) رحلة في المواسم تتنوع ما بين رحلات بين مدن المملكة ورحلات دولية.",
            lblP4: "قدم الشركة الخدمة المميزة vip التي صممتها لرحلات عالية الجودة في حافلات بمواصفات خاصة وحققت تلك الخدمة نجاحاً متزايداً حيث تتميز بأنها رحلات مباشرة دون توقف إضافة الى توفير الوجبات والمشروبات الباردة والساخنة وتقديم الصحف وتوفر نقاط شحن للهاتف الجوال والحاسبات الشخصية داخل الحافلة ، وتم تشغيل تلك الرحلات بين الرياض والخبر ومكة المكرمة والمدينة المنورة ، وجده والمدينة المنورة وكذلك بين الرياض والبحرين ويجري العمل حالياً للتوسع في تلك الخدمة لتشمل عدد من الخطوط الجديدة.",
            lblP5: "في خطوة تهدف إلى توسيع شبكة خدماتها ومشاريعها, قامت الشركة بإطلاق مشروع (سابتكو ليمو) والذي يقدم خدمة السيارات الفاخرة مع السائق بطريقة احترافي. ويضم هذا المشروع الذي يأتي في إطار تنفيذ إستراتيجية نمو الشركة أسطولاً من السيارات الفاخرة تشمل سيارات مرسيدس الفئة اس بالإضافة إلى سيارات لكزس وسيارات الكابرس والسيارات العائلية (سوبربان) تعمل في كل من مكة المكرمة وجدة والمدينة المنورة؛ والرياض، وتم افتتاح فروع خدمة العملاء في كافة الصالات الدولية والداخلية بمطار الملك خالد الدولي بالرياض، ومطار الملك عبدالعزيز الدولي بجدة ومطار الأمير محمد بن عبدالعزيز بالمدينة المنورة.",
            lblp6: "كما أطلقت الشركة خدمات الشحن من خلال (سابتكو كارجو) بأسطول من الشاحنات و المقطورات (براد و ستارة و جوانب و سطحه) وقد قامت الشركة بالتوسع في خدمة العديد من العملاء الجدد في داخل المملكة والدول المجاورة وحظيت هذه الخدمات بقبول ورضاء أولئك العملاء وبشكل يؤكد إن هنالك طلب متنامي على خدمات نقل السلع والبضائع بمختلف أنواعها ولا سيما الأنواع المتصلة بالمواد الإنشائية في ظل المشاريع الضخمة التي عمت إنحاء المملكة."


        },

        'url:contact_us.html': {
            lblTitle: "اتصل بنا",
            lblcompany: "الشركة السعودية للنقل الجماعي (سابتكو)",
            lblhead: " الادارة العامة ",
            lblheadInfo: " ش/ الأمير عبدالعزيز بن مساعد بن جلوي  الرياض -  حي السليمانية ",
            lblBox: "ص.ب ",
            lblb_oboxinfo: " ا10667  الرياض : 11443",
            lblphone: " الهاتف ",
            lblfax: "فاكس",
            lblcustomerService: "مركز خدمات العملاء",
            lblComplaints: "مركز استقبال الشكاوي و الملاحظات",
            lblcustomerServiceinternational: "خارج المملكة",
            textAlign: "right"

        },

        'url:favorite_list.html': {
            lblTitle: "المفضلة",
            txtSearch: "بحث"

        },
        'url:fleet_advance.html': {
            lblTitle: "تفاصيل الاسطول",
            lblHeaderTitle: "المواصفات",
            lblModel: "الموديل",
            lblDetails: "المواصفات",
            lblServices: "الخدمات",
            lblModel2: "الموديل",
            lblDetails2: "المواصفات",
            lblServices2: "الخدمات",
            lblModel3: "الموديل",
            lblDetails3: "المواصفات",
            lblServices3: "الخدمات",
            lblModel4: "الموديل",
            lblDetails4: "المواصفات",
            lblServices4: "الخدمات",
            lblModel5: "الموديل",
            lblDetails5: "المواصفات",
            lblServices5: "الخدمات",
            lblModel6: "الموديل",
            lblDetails6: "المواصفات",
            lblServices6: "الخدمات",
            lblModel7: "الموديل",
            lblDetails7: "المواصفات",
            lblServices7: "الخدمات",
            lblModelTraveco: "2015 28 مقعد جلد",
            lblDetailsTraveco: "28 مقعد جلد",
            lblServicesTraveco: "خدمات العقود و التأجير",
            lblModelTrav: "2012 49 مقعد مخمل",
            lblDetailsTrav: " 49 مقعد مخمل",
            lblServicesTrav: "خدمات النقل بين المدن-النقل الدولي-خدمات العقود و التأجير",
            lblModelMBT: "2005 49 مقعد مخمل",
            lblDetailsMBT: " 49 مقعد مخمل ",
            lblServicesMBT: "خدمات النقل بين المدن-النقل الدولي-خدمات العقود و التأجير",
            lblModelKingLong: "2014 49 مقعد مخمل",
            lblDetailsKingLong: " 49 مقعد مخمل",
            lblServicesKingLong: "خدمات النقل بين المدن-النقل الدولي-خدمات العقود و التأجير",
            lblModelCityBus: "2013 45 مقعد مخمل",
            lblDetailsCityBus: "تكييف + ستائر للنوافذ + عازل للحرارة والصوت",
            lblServicesCityBus: "خدمات العقود و التأجير-خدمات النقل داخل المدن",
            lblModelTravecoMistsubishi: "2014 29 مقعد مخمل",
            lblDetailsMistsubishi1: "أجهزة سمعية ",
            lblDetailsMistsubishi2: "تكييف+ستائر للنوافذ.",
            lblServicesMistsubishi: "خدمات العقود و التأجير",
            lblModelKonicto: "2007 46 مقعد مخمل",
            lblDetailsKonicto: "تكييف+ستائر للنوافذ +عازل للحرارة والصوت.",
            lblServicesKonicto: "خدمات العقود و التأجير"

        },
        'url:bus_content_fleet.html': {
            DF__Seat28: "Traveco",
            DF__Seat49: "Trav",
            DF__Mbt: "MBT",
            DF__Kinglong: "KingLong",
            DF__Citybus: "CityBus",
            DF__Mistsubishirosa: "Mistsubishi",
            DF__KonictoCity: "Konicto",
            Traveco_28: "مرسيدس ترافيقو فاخر 28 مقعد",
            Traveco_49: "مرسيدس ترافيقو فاخر 49 مقعد",
            MBT_350: "مرسيدس MBT 350",
            lblKing: "كنج لونج",
            lblCitybus: "مرسيدس كونيكتو سيتي باص",
            lblMistsubishi: "ميتسوبيشي روزا",
            lblKonicto: "مرسيدس كونيكتو سيتي باص",
            lblheaderTitle: "باصات",
            lblTitle: "تفاصيل الاسطول",
            lblHeaderTitle: "المواصفات",
            lblModel: "الموديل",
            lblDetails: "المواصفات",
            lblServices: "الخدمات",
            lblModel2: "الموديل",
            lblDetails2: "المواصفات",
            lblServices2: "الخدمات",
            lblModel3: "الموديل",
            lblDetails3: "المواصفات",
            lblServices3: "الخدمات",
            lblModel4: "الموديل",
            lblDetails4: "المواصفات",
            lblServices4: "الخدمات",
            lblModel5: "الموديل",
            lblDetails5: "المواصفات",
            lblServices5: "الخدمات",
            lblModel6: "الموديل",
            lblDetails6: "المواصفات",
            lblServices6: "الخدمات",
            lblModel7: "الموديل",
            lblDetails7: "المواصفات",
            lblServices7: "الخدمات",
            lblModelTraveco: "2015 28 مقعد جلد",
            lblDetailsTraveco: "28 مقعد جلد",
            lblServicesTraveco: "خدمات العقود و التأجير",
            lblModelTrav: "2012 49 مقعد مخمل",
            lblDetailsTrav: " 49 مقعد مخمل",
            lblServicesTrav: "خدمات النقل بين المدن-النقل الدولي-خدمات العقود و التأجير",
            lblModelMBT: "2005 49 مقعد مخمل",
            lblDetailsMBT: " 49 مقعد مخمل ",
            lblServicesMBT: "خدمات النقل بين المدن-النقل الدولي-خدمات العقود و التأجير",
            lblModelKingLong: "2014 49 مقعد مخمل",
            lblDetailsKingLong: " 49 مقعد مخمل",
            lblServicesKingLong: "خدمات النقل بين المدن-النقل الدولي-خدمات العقود و التأجير",
            lblModelCityBus: "2013 45 مقعد مخمل",
            lblDetailsCityBus: "تكييف + ستائر للنوافذ + عازل للحرارة والصوت",
            lblServicesCityBus: "خدمات العقود و التأجير-خدمات النقل داخل المدن",
            lblModelTravecoMistsubishi: "2014 29 مقعد مخمل",
            lblDetailsMistsubishi1: "أجهزة سمعية ",
            lblDetailsMistsubishi2: "تكييف+ستائر للنوافذ.",
            lblServicesMistsubishi: "خدمات العقود و التأجير",
            lblModelKonicto: "2007 46 مقعد مخمل",
            lblDetailsKonicto: "تكييف+ستائر للنوافذ +عازل للحرارة والصوت.",
            lblServicesKonicto: "خدمات العقود و التأجير"

        },

        'url:intro.html': {

            lblLanguage: "اللغة",
            lblSkip: "الاستمرار"

        },

        'url:login.html': {
            lblPersonalInfo: "معلومات شخصية",
            lbllogin: "دخول",
            lblforget: "نسيت كلمة السر ؟",
            lbldonthaveaccount: "إذا لم يكن لديك حساب الرجاء",
            join: "سجل الان ",
            lblTittle: "دخول",
            txtUserName: "البريد الإلكتروني",
            txtPassword: "كلمة المرور",
            btnSignUp: "انشاء حساب",
            btnLogin: "الدخول",
            lblLoginToYourAccount: "الدخول الى حسابك",
            btnForgetPassword: "نسيت كلمة المرور"

        },
        'url:nationalities.html': {
            txtSearch: "البحث",
            lblTitle: "الجنسيات",
            "Cancel": "الغاء"
        },

        'url:offers1.html': {
            lblTitle: "العروض",
            firstlbl: "خدمة التوصيل من المطار",
            seconlbl: "سيارة فارهة مع سائق ذو خبرة "

        },
        'url:Offers2nd.html': {
            lblTitle: "عروض",
            lblTranTitle: "خدمة النقل من المطار",
            lblParagraph: "خدمة السيارات الفاخرة مع سائق بطريقة مهنية للاستفادة من تجربة النقل الجماعي في مجال النقل. <BR> المواقع وانتشار فروع سابتكو في المناطق الرئيسية في المملكة العربية السعودية والمطارات حيث الخدمة في محطات مطارات في الرياض وجدة ومطار الدمام. <BR> SAPTCO استهدفت فنادق الخمس نجوم والبنوك وشركات الطيران ومنظمي الفعاليات والمؤتمرات والمعارض والأندية الرياضية."
        },
        'url:our_fleet.html': {
            lblHeader: "اسطولنا",
            lblTitle: "اسطولنا"

        },
        'url:PassengerfillInfo.html': {
            lblName: "الاسم",
            lblIdTime: "نوع الهوية",
            lblNationalIdNumber: "رقم الهوية",
            lblVersionNumber: "عدد النسخ",
            lblNationlaty: "الجنسية",
            lblTitle: "المعلومات",
            lblGender: "الجنس",
            lblDateOfBirth: "تاريخ الميلاد",
            btnDone: "حفظ",
            lblAddToFavList: "إضافة هذا الراكب إلى قائمة المفضلة",
            btnSaveItem: "اضافة",
            lblMale: "ذكر",
            lblFemale: "انثى",
            lblPassport: "جواز سفر",
            lblIdCard: "هوية وطنية",
            lblResidenceVisa: "اقامة",
            lblGccSitizen: "مواطن مجلس تعاون",
            lblTitle: "معلومات الركاب",
            optSelect: "اختر",
            btnSearch: "بحث",
            lblPassengersInfo: "معلومات الراكب",
            lblSearch: "البحث عن راكب"
        },
        'url:FavoritefillInfo.html': {
            lblName: "الاسم",
            lblIdTime: "نوع الهوية",
            lblNationalIdNumber: "رقم الهوية",
            lblVersionNumber: "عدد النسخ",
            lblNationlaty: "الجنسية",
            lblTitle: "المعلومات",
            lblGender: "الجنس",
            lblDateOfBirth: "تاريخ الميلاد",
            btnDone: "حفظ",
            lblAddToFavList: "إضافة هذا الراكب إلى قائمة المفضلة",
            btnSaveItem: "اضافة",
            lblMale: "ذكر",
            lblFemale: "انثى",
            lblPassport: "جواز سفر",
            lblIdCard: "بطاقة هوية",
            lblResidenceVisa: "فيزا اقامة",
            lblGccSitizen: "مواطن دول الخليج",
            lblTitle: "معلومات الركاب",
            optSelect: "اختر",
            btnSearch: "بحث",
            lblPassengersInfo: "معلومات الراكب"
        },

        'url:Passengers.html': {
            lblGoingTic: "معلومات التذكرة ",
            lblFrom: "من",
            lblTo: "الى",
            lblReturnTi: "تذكرة عوده",
            lblFrom1: "من",
            lblTo1: "الى",
            lblPassenger: "معلومات الراكب",
            lblpassType: "فئه الراكب",
            lblnatio: "الجنسية",
            lblGender: "الجنس",
            lblBirth: "تاريخ الميلاد",
            lbltitle: "الركاب",
            lblName: "الاسم",
            lblGoingTicket: "تذكرة الذهاب",
            lblTicketFee: "سعر التذكرة",
            lblTicketNumber: "رقم التذكرة",
            SAR: " ر.س ",
            lblTicketDate: "تاريخ الرحلة"
        },
        'url:PassengersInfo.html': {
            lblTitle: "الركاب",
            lblPassengerInfo: "معلومات الركاب",
            lblPleaseEnter: "الرجاء إدخال جميع المعلومات الركاب",
            lblPassInfo: "معلومات الركاب",
            lblAdults: "الكبار",
            lblChildren: "الأطفال",
            lblInfants: "الرضع",
            lblContactInfo: "معلومات الاتصال",
            lblCountryLabel: "البلد",
            txtPhoneNUmber: "5XXXXXXXX",
            txtEmailAddress: "أدخل عنوان بريدك الإلكتروني",
            btnContinue: "اكمال الحجز",
            ArabicSelect: "block",
            EnglishSelect: "none",
            phoneDirection: "rtl"
        },
        'url:privacyandpolicy.html':
            {
                lblTitle: "سياسة الخصوصية",
                showEnglishCss: "none",
                showArabicCss: "block"
            },

        'url:profile.html': {
            lblPersonalInfo: "معلومات شخصية",
            lblOtherPersonalInfo: "معلومات أخرى",
            lbllogin: "تعديل ",
            logout: "خروج",
            Logout: "خروج",
            lblTittle: "ملفي الشخصي",
            natiNumber: "أدخل رقم هاتفك ",
            iqama: "إقامة",
            NatID: "هوية الوطنية",
            lblpassport: "جواز سفر",
            lblGCC: "مواطن  مجلس تعاون ",
            lblmale: "ذكر",
            title: "حسابي",
            lblFemale: "أنثى"
        },

        'url:paymentoptions.html': {
            head: " الدفع",
            selpayment: "الرجاء اختيار طريقة الدفع"
        },
        'url:Sdadpay.html': {
            lblThankYou: "شكرا لكم على الحجز مع الشركة السعودية للنقل الجماعي (سابتكو)",
            lblPart1: "هذه الرسالة للتذكير بأن حجزكم غير مؤكد ويجب المسارعة بإتمام الدفع بنظام سداد قبل آخر موعد للسداد الموضح أدناه لتجنب إلغاء الحجز تلقائيا.",
            lblPart2: "يمكنك الدفع بنظام سداد بعدة وسائل : من خلال حسابك البنكي على الانترنت ، مكائن الصرف الآلي ، الهاتف المصرفي للبنك الخاص بك أو مباشرة عن طريق صرافي البنوك. يرجى اختيار الرقم المفوتر للشركة السعودية للنقل الجماعي ثم إدخال رقم الحجز / الفاتورة الموضح بالأعلى وإتمام عملية الدفع. بعد إتمام عملية الدفع سوف تصلك رسالة جوال قصيرة ورسالة بريد الكتروني تفيد بتأكيد عملية الدفع والحجز.",
            lblBill: "رقم الفاتورة",
            lblLastPayemntDue: "اخر موعد للدفع",
            lblTotalAmount: "المبلغ الكلي",
            lblSaudiTrans: "رمز الشركة السعودية للنقل الجماعي",
            btnSearch: "القائمة الرئيسية",
            lblTitle: "سداد",
            lblPrint: "طباعة"
        },

        'url:stations.html': {
            lblTitle: "المحطات",
            "Cancel": "الغاء",
            search: "بحث"
        },
        'url:setting.html': {
            lblTitle: "إعدادات",
            lblChangeLanguage: "اختر لغة",
            lblEnglish: "إنجليزي",
            lblArabic: "عربي",
            btnSave: "حفظ"
        },
        'url:trips.html': {
            numberofpassengers: "السعر يشمل الركاب",
            lblTripsFound: "وجدنا  <a style='color: black' id ='lblNumberOfTrips'> 0</a>  رحلة مطابقة  للبحث",
            lblOutwordTrip: "الرحلة :",
            tabOutword: "تذكرة الذهاب",
            tabReturn: "تذكرة العودة",
            lblFrom: "من",
            lblto: "الى",
            lblMoreDetils: "المزيد",
            lblTripServices: "خدمات الرحلة",
            lblMeals: "وجبات",
            lblChargres: "شواحن",
            lblrefreshments: "مشروبات",
            lblDirect: "رحلة مباشرة",
            lblNewspapers: "جرائد",
            lblMapView: "الخريطة",
            lblStabdardPrice: "السعر  العادي",
            lblDiscountPrice: "السعر التشجيعي",
            imgGoingBus: "returnArrow.png",
            lblPleaseSelectRet: "الرجاء اختيار رحلة العودة",
            btnOK: "موافق",
            lblHeaderTitle: "اختار الرحلة",
            lblTicketTerms: "شروط الرحلة",
            lblNotRefundable: "1- غير مستردة",
            lblTransferable: "2- غير قابلة لتغير الموعد",
            lblCancel: "الغاء",
            Accept: "الموافقة",
            tripDirection: "الرحلة"
        },

        'url:Trip-summry.html': {
            lblGoingTic: "تذكره ذهاب",
            lblFrom: "من",
            lblTo: "الى",
            lblReturnTi: "تذكرة عوده",
            lblFrom1: "من",
            lblTo1: "الى",
            lblPassenger: "الركاب",
            lblagree: " انا موافق على  الشروط و الأحكام",
            lblTitle: "تأكيد الرحلات",
            lblprice: "السعر الكلي للحجز - التاكيد و الدفع",
            SAR: " ر.س ",
            Duration: "المدة"
        },

        'url:FirstSummry.html': {
            lblGoingTic: "تذكره الذهاب",
            lblFrom: "من",
            lblTo: "الى",
            lblReturnTi: "تذكرة العوده",
            lblFrom1: "من",
            lblTo1: "الى",
            lblPassenger: "الركاب",
            lblagree: " انا موافق على  الشروط و الأحكام",
            lblTitle: "تأكيد الرحلات",
            lblprice: "السعر الكلي للحجز",
            SAR: " ر.س ",
            btnContinue: "المتابعة",
            classArabic: "img-direction-flip",
            lblHours: " ساعة",
            Duration: "المدة"
        },
        'url:signup.html': {
            lblPersonalInfo: "معلومات شخصية",
            lblOtherPersonalInfo: "معلومات أخرى",
            lbllogin: "تسجيل",
            lblTittle: "تسجيل ",
            lblGender: "الجنس",
            lblidtype: "نوع الهوية",
            lblnation: "الجنسية",
            lblbday: "تايخ الولادة",
            lblmail: "البريد الاكتروني",
            fistName: "اسم الاول",
            lastName: "اسم الاخير",
            Emailtxt: "البريد الالكتروني",
            Password: "كلمة المرور",
            natNumber: "أدخل الرقم الوطني الخاص",
            natId: "عدد النسخ",
            country: "المدينة",
            phoneNumber: "5XXXXXXXX",
            iqama: "إقامة",
            NatID: "هوية وطنية",
            lblpassport: "جواز سفر",
            lblGCC: "مواطن مجلس تعاون ",
            select: "اختر",
            lblmale: "ذكر",
            lblFemale: "أنثى",
            DF__lblFemale: "2",
            DF__lblmale: "1",
            DF__iqama: "1",
            DF__NatID: "2",
            DF__lblpassport: "4",
            DF__lblGCC: "3",
            SignupMessageOk: "موافق",
            ArabicSelect: "block",
            EnglishSelect: "none"
        },
        'url:condtionandterms.html':
            {
                lblTitle: "الشروط والاحكام",
                showEnglishCss: "none",
                showArabicCss: "block"
            },
        'url:mybooking.html':
            {
                lblTitle: "إدارة الحجز",
                reservationNumber: "رقم الحجز",
                mobileNumber: " رقم الهاتف ",
                SearchBtn: "البحث",
                tabManage: "بحث",
                tabBooking: "حجوزاتي",
                tabHistory: "الارشيف",
                lblSearchReservation: "البحث في حجوزاتي",
                lblMobileNum: "رقم الهاتف"
            },
        'url:historytab.html':
            {
                HistoryTitle: "الارشيف",
                tabManage: "بحث",
                tabBooking: "حجوزاتي",
                tabHistory: "الارشيف"
            },
        'url:Booking.html':
            {
                MyBookingTitle: "حجوزاتي",
                tabManage: "بحث",
                tabBooking: "حجوزاتي",
                tabHistory: "الارشيف"
            },
        'url:TicketTransfer.html':
            {
                lblTitle: "تغير الموعد",
                PassengerName: "اسم المسافر",
                lblDepartFrom: "المغادرة من",
                lblArrivalTo: "الوصول الى",
                lblDepartureOn: "المغادرة في",
                lblNewDepartureOn: "تاريخ المغادرة الجديد",
                btnSearch: "بحث"
            },
        'url:Tickets.html':
            {
                tickets: "الحجوزات",
                lblPNRInfo: "معلومات الحجز",
                PNRNumber: "رقم الحجز",
                ReservationStatus: "الحالة",
                btnSearch: "القائمة الرئيسية",
                btnPrint: "طباعة"
            },
        'url:feedback.html':
            {
                PhoneNumber: "رقم الهاتف",
                Name: "الاسم",
                Comment: "الملاحظة",
                Feedback: "التقيم",
                Save: "إرسال"
            },
        'url:changetime.html':
            {
                lblTitle: "الرحلات"
            },

        'url:paymentcomp.html':
            {
                lblTitle: "اتمام الدفع",
                Thank_msg: "شكرا لحجزكم مع سابتكو ، سيتم ارسال رسالة قريبا لتاكيد حالة الحجز."
            },
        'url:menu_favorite.html':
        {
            lblTitle: "قائمة المفضلة",
            lbladult: "بالغ",
            lblchild: "طفل",
            lblinfa: "رضيع",
            lblselect: "اختر فئة الراكب"

        },
        'url:forget_password.html':
        {

            lblTittle: " نسيان كلمة المرور",
            txtUserName: "البريد الالكتروني",
            btnSend: "ارسال"

        }
 ,
        'url:LimoReservationtypes.html':
            {

                lblTittle: "توصيل مع سائق",
                Companies: "للشركات",
                Customer: "عميل جديد",
                Company_information: "بيانات الشركة/المؤسسة",
                Deliver: "توصيل",
                Contract_Type: "نوع التعاقد",
                Contract_Number: "رقم العقد",
                Company_Name: "الاسم ",
                Commercial_Record: "السجل التجاري",
                Fax_Number: " رقم الإتصال",
                Authorized_Person: "بيانات الشخص المفوض",
                Name: "الاسم",
                Phone_Number: "رقم الجوال",
                Email_Address: "البريد الالكتروني",
                Customer_Info: "بيانات العميل",
                Cus_Name: "اسم العميل",
                ID_Number: "رقم الهوية",
                lblMale: "ذكر",
                lblFemale: "انثى",
                DoneText: "موافق",
                optSelect: "اختر",
                Gender: "الجنس",
                Customer_Location: "موقع العميل",
                Continue: "ارسال الطلب",
                DoneText: "حفظ",
                phoneDirection: "rtl",
                txtPhoneNUmber: "5XXXXXXXX"

            },
        'url:LimoReservationData.html':
            {
                Service_Period: "مدة الخدمة",
                lblTittle: "بيانات الحجز",
                Reservation_Information: "بيانات الحجز",
                limo_with_driver: "مشوار",
                Service_Type: "نوع الخدمة",
                One_way: "توصيل فقط",
                Round_Trip: "ذهاب و عودة",
                Service_Time: "وقت الخدمة",
                Mercedes: "مرسيدس",
                GMC: "جيمس",
                BMW: "بي ام دبليو",
                LEXUS: "ليكزس",
                Car_Type: "نوع السيارة",
                Service_Date: "تاريخ الخدمة:",
                Time: "الزمن",
                City: "المدينة",
                DepartFrom: "الاتجاه من",
                lblTo: "الاتجاه الى",
                Pickup_Location: "تفاصيل العنوان",
                Cash: "نقدا",
                Visa: "فيزا",
                Sadad: "سداد",
                Payment_Method: "طريقة الدفع",
                Continue: "التالي",
                DoneText: "حفظ",
                Contract_Type: "نوع التعاقد",
                selectDate: "اختر التاريخ",
                optSelect: "اختر"
            },
        'url:new_LimoReservationData.html':
            {
                Service_Period: "مدة الخدمة",
                lblTittle: "بيانات الحجز",
                Reservation_Information: "بيانات الحجز",
                limo_with_driver: "مشوار",
                Service_Type: "نوع الخدمة",
                One_way: "توصيل فقط",
                Round_Trip: "ذهاب و عودة",
                Service_Time: "وقت الخدمة",
                Mercedes: "مرسيدس",
                GMC: "جيمس",
                BMW: "بي ام دبليو",
                LEXUS: "ليكزس",
                Car_Type: "نوع السيارة",
                Service_Date: "تاريخ الخدمة:",
                Time: "الزمن",
                City: "المدينة",
                DepartFrom: "الاتجاه من",
                lblTo: "الاتجاه الى",
                Pickup_Location: "تفاصيل العنوان",
                Cash: "نقدا",
                Visa: "فيزا",
                Sadad: "سداد",
                Payment_Method: "طريقة الدفع",
                Continue: "التالي",
                DoneText: "حفظ",
                Contract_Type: "نوع التعاقد",
                selectDate: "اختر التاريخ",
                optSelect: "اختر"
            },

        'url:LimoReservationDataLocations.html': {
            ToSamePickupLoc: "الى نفس مكان الانطلاق",
            lblTittle: "بيانات الحجز",
            Reservation_Information: "الموقع",
            DepartFrom: "يرجى تحديد موقع المغادرة",
            lblTo: "يرجى تحديد موقع الوصول",
            Pickup_Location: "معالم الموقع",
            Continue: "التالي",
            DoneText: "حفظ"
        },

        'url:new_LimoReservationDataLocations.html': {
            ToSamePickupLoc: "الى نفس مكان الانطلاق",
            lblTittle: "بيانات الحجز",
            Reservation_Information: "الموقع",
            DepartFrom: "يرجى تحديد موقع المغادرة",
            lblTo: "يرجى تحديد موقع الوصول",
            Pickup_Location: "معالم الموقع",
            Continue: "التالي",
            DoneText: "حفظ"
        },

        'url:LimoRequestItemsList.html': {
            lblTitle: "بيانات الحجز",
            RequestsList: " الخدمات المضافة",
            AddNewService: "اضافة خدمة اخرى",
            Continue: "التالي"
        },
        'url:new_LimoRequestItemsList.html': {
            lblTitle: "بيانات الحجز",
            RequestsList: " الخدمات المضافة",
            AddNewService: "اضافة خدمة اخرى",
            Continue: "التالي"
        },
        'url:CCRequestItemsList.html': {
            lblTitle: "بيانات الحجز",
            RequestsList: " الخدمات المضافة",
            AddNewService: "اضافة خدمة اخرى",
            Continue: "التالي"
        },
        'url:CargoRequestItemsList.html': {
            lblTitle: "بيانات الحجز",
            RequestsList: " الخدمات المضافة",
            AddNewService: "اضافة خدمة اخرى",
            Continue: "التالي"
        },
        'url:CargoReservationDataLocation.html': {
            ToSamePickupLoc: "الى نفس مكان الانطلاق",
            lblTittle: "بيانات الحجز",
            Reservation_Information: "الموقع",
            DepartFrom: "يرجى تحديد موقع المغادرة",
            lblTo: "يرجى تحديد موقع الوصول",
            Pickup_Location: "تفاصيل العنوان",
            Continue: "التالي",
            DoneText: "حفظ",
        },
        'url:Rent_bus_Location.html': {
            ToSamePickupLoc: "الى نفس مكان الانطلاق",
            lblTittle: "بيانات الحجز",
            Reservation_Information: "الموقع",
            DepartFrom: "يرجى تحديد موقع المغادرة",
            lblTo: "يرجى تحديد موقع الوصول",
            Pickup_Location: "مكان الاستلام",
            Continue: "التالي",
            DoneText: "حفظ",
        },
        'url:CargoSucess.html':
        {
            successfullyCargo: " تم استلام الطلب بنجاح وسيتم التواصل معكم قريباً",
            ReturnHome: "الرجوع للصفحة الرئيسية",
            Title: "نجاح العملية",
            CargoService: "خدمة شحن"

        },

        'url:LimoSucess.html':
        {
            successfullyLimo: " تم استلام الطلب بنجاح وسيتم التواصل معكم قريباً",
            ReturnHome: "الرجوع للصفحة الرئيسية",
            Title: "نجاح العملية"

        },
        'url:BusSucess.html':
        {
            successfullyCargo: " تم استلام الطلب بنجاح وسيتم التواصل معكم قريباً",
            ReturnHome: "الرجوع للصفحة الرئيسية",
            Title: "نجاح العملية"

        },

        'url:CargoReservationData.html':
            {
                VehicleType: "نوع الشاحنة:",
                CargoInformation: "التفاصيل",
                ReservationInformation: 'معلومات الحجز',
                Fromcity: 'من مدينة:',
                Tocity: 'الى مدينة:',
                الرجاء: 'نوع الشاحنة:',
                Typeofitems: 'نوع البضاعة:',
                TypeofiTypeofitemsPlaceHoldertems: 'نوع البضاعة',
                informationofloadinplace: 'معلومات التحميل:',
                Informationofplacedownloading: 'معلومات التنزيل:',
                VehicleNo: 'عدد الشاحنات:',
                VehicleNoPlaceHolder: 'عدد الشاحنات',
                ReservationInformation: 'معلومات الحجز',
                Date: "التاريخ:",
                DatePlaceHolder: "التاريخ",
                Continue: 'تابع',
                DoneText: "موافق",
                Direction: "الإتجاه:",
                Typeofservice: "نوع الخدمة:",
                lblLocation: ":الموقع",
                ServiceLocation: "موقع الخدمة",
                optSelect: "اختر"
            },
        'url:CargoReservationRequest.html':
            {
                lblRequestCargo: ' خدمة الشحن',
                LimoReservationtypes: '',
                CustomerInfo: 'معلومات العميل',
                Name: 'الاسم',
                PhoneNumber: 'رقم الجوال',
                MobileNumber: 'رقم الجوال',
                EmailAddress: 'البريد الكتروني',
                service1: 'خدمة1',
                service2: 'خدمة2',
                service3: 'خدمة3',
                Continue: 'إرسال',
                phoneDirection: "rtl",
                txtPhoneNUmber: "5XXXXXXXX"
            },
        'url:Rent_Bus_home.html':
            {
                lblName: "اسم العميل:",
                lblIdTime: "رقم الجوال",
                txtEmailAddress: "البريد الإلكتروني:",
                lblFax: "الفاكس:",
                lblFaxPlaceHolder: "الفاكس",
                lblTitle: "المعلومات",
                lblGender: "الجنس:",
                lblDateOfBirth: "تاريخ الميلاد:",
                btnDone: "حفظ",
                lblAddToFavList: "إضافة هذا الراكب إلى قائمة المفضلة",
                btnSaveItem: "اضافة",
                lblJeddah: "جده",
                lblRiydah: "رياض",
                btnContinue: "إرسال",
                lblTitle: "معلومات الركاب",
                optSelect: "اختر",
                btnSearch: "بحث",
                lblPassengersInfo: "معلومات الراكب",
                Personal: "للافراد",
                Comapnies: "للشركات",
                lblCompanyDetails: "بيانات الشركة",
                lblCompanyName: "اسم الشركة:",
                lblPhone: "رقم الاتصال",
                lblAuthorizedperson: "الشخص المفوض",
                lblPersonName: "الاسم:",
                title: "تاجير حافلة",
                PhoneNumber: 'الهاتف',
                phoneDirection: "rtl",
                txtPhoneNUmber: "5XXXXXXXX",
            },

        'url:Rent_Bus_Details.html':
            {
                detailstitle: "التفاصيل",
                lblRentDetails: "تفاصيل الطلب",
                lblBus: "نوع الحافلة",
                DoneText: "موافق",
                lblCountBuses: "عدد الحافلات",
                lblDate: "تاريخ الخدمة:",
                lblFrom: "الاتجاه من",
                lblTo: "الاتجاه الى",
                lblLocation: "مكان الاستلام",
                lblOffice: "مكتب المبيعات",
                btnDone: "موافق",
                btnSaveItem: "Ok",
                btnContinue: "متابعة",
                lblTime: "وقت الخدمة",
                optSelect: "أختر",
                selectDate: "اختر التاريخ",
                phoneDirection: "rtl"
            }


    };

}

function setEnglishText()
{
    Template7.data = {
        'url:Home.html': {
            titleone: "Welcome To SAPTCO",
            titleTwo: "Please Choose The Service You Want",
            lblTitle: "Home",
            btnLimoReq: "img/En_Limo.svg",
            btnCargoReq: "img/En_Cargo.svg",
            btnBuyTicket: "img/En_BuyTicket.svg",
            btnBusCharter: "img/En_BusCharterRequest.svg",
            languageRes: "?lang=en-US"
        },


        'url:LimoStartReservation.html': {
            yourLocationis: "Your Location is",
            PickupLocation: "Pickup Location",
            Select: "Select",
            destinationlocation: "Destination Location",
            GetCurrentLocation: "View current Location",
            Continue: "Countinue",
            PicLocation_png: "img/PickupLoc.png",
            SetDist_png: "img/SetDist.png",


        },
        'url:MapLocationSelect.html': {
            yourLocationis: "Your Location is",
            PickupLocation: "Pickup Location",
            Select: "Select",
            destinationlocation: "Destination Location",
            GetCurrentLocation: "View current Location",
            Continue: "Countinue",
            PicLocation_png: "img/PickupLoc.png",
            SetDist_png: "img/SetDist.png",
            SearchBox: "Search"

        },
        'url:schedulesandtickets.html': {
            title: "Tickets",
            lblSubHeader: "Schedules And Tickets",
            lblOneWay: "One Way",
            lblRoundtrip: "Round Trip",
            lbldepartureFrom: "Departure From",
            lblArrivalTo: "Arrival To",
            lblDepOn: "Departure",
            lblRetTo: "Return",
            lblPassengersLabel: "Passengers",
            btnSearch: "Search",
            btnCancel: "Cancel",
            btnDone: "Done",
            lblAdults: "Adults",
            lblAdultsRange: "More Than 12 Years",
            lblChildRange: "2- 12 Years",
            lblInfRange: "Less Than 2 Years",
            lblPassengers: "Adults(1) , Children(0), Infants(0)",
            lblDepartureDate: "Select date",
            lblReturnDate: "Select date",
            imgBusDep: "busdepa.png",
            imgBusArrive: "busarriv.png",
            lblChild: "Children",
            lblInfants: "Infants",
            classArabic: "img-direction-flip",
            lblVipType: "Trip Type",
            vip: "VIP",
            reg: "Regular",
            all: "all",
            DoneText: "Done"

        },

        'url:aboutus.html': {

            lblTitle: "About Us",
            DisplayEnglish: "block",
            DisplayArabic: "none"
        },


        'url:contact_us.html': {
            lblTitle: "Contact us",
            lblcompany: "Saudi Public Transport Company (SAPTCO)",
            lblhead: "Head Quarter ",
            lblheadInfo: "Solumanih Distrect, Riyadh <br /> Prince AbdulAziz Bin Mosaid Bin Jalawi Street",
            lblBox: "B.O Box",
            lblb_oboxinfo: "10667 Riyadh 11443",
            lblphone: "Phone Number",
            lblfax: "Fax",
            lblcustomerService: "Customer Service Center",
            lblComplaints: "Complaints & Feedback",
            lblcustomerServiceinternational: "International",
            textAlign: "left"

        },

        'url:favorite_list.html': {
            lblTitle: "Favorite List",
            txtSearch: "Search"

        },
        'url:bus_content_fleet.html': {
            DF__Seat28: "Traveco",
            DF__Seat49: "Trav",
            DF__Mbt: "MBT",
            DF__Kinglong: "KingLong",
            DF__Citybus: "CityBus",
            DF__Mistsubishirosa: "Mistsubishi",
            DF__KonictoCity: "Konicto",
            Traveco_28: "Luxurious Mercedes Traveco 28 Seat",
            Traveco_49: "Mercedes Traveco 49 Seat",
            MBT_350: "Mercedes MBT 350",
            lblKing: "King Long",
            lblCitybus: "King Long City Bus",
            lblMistsubishi: "Mistsubishi Rosa",
            lblKonicto: "Mercedes Konicto citybus",
            lblheaderTitle: "Buses",
            lblTitle: "Fleet Advance",
            lblHeaderTitle: "Details",
            lblModel: "Model",
            lblDetails: "Details",
            lblServices: "Services",
            lblModel2: "Model",
            lblDetails2: "Details",
            lblServices2: "Services",
            lblModel3: "Model",
            lblDetails3: "Details",
            lblServices3: "Services",
            lblModel4: "Model",
            lblDetails4: "Details",
            lblServices4: "Services",
            lblModel5: "Model",
            lblDetails5: "Details",
            lblServices5: "Services",
            lblModel6: "Model",
            lblDetails6: "Details",
            lblServices6: "Services",
            lblModel7: "Model",
            lblDetails7: "Details",
            lblServices7: "Services",
            lblModel: "Model",
            lblDetails: "Details",
            lblServices: "Services",
            lblModelTraveco: "2015, 28 Leather Seat",
            lblDetailsTraveco: "Leather Seat 28",
            lblServicesTraveco: "Annual Contract And Leasing Service.",
            lblModelTrav: "2012, 49 Velvet Seat",
            lblDetailsTrav: "49 Velvet Seat",
            lblServicesTrav: "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
            lblModelMBT: "2005, 49 Velvet Seat",
            lblDetailsMBT: "49 Velvet Seat",
            lblServicesMBT: "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
            lblModelKingLong: "2014, 49 Velvet Seat",
            lblDetailsKingLong: "49 Velvet Seat",
            lblServicesKingLong: "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
            lblModelCityBus: "2013, 45 Velvet Seat",
            lblDetailsCityBus: "Conditioning + Curtains For The Windows + Heat Insulator And Sound.",
            lblServicesCityBus: "Annual Contract And Leasing Service-Transport Within City Service.",
            lblModelTravecoMistsubishi: "2014, 29 Velvet Seat",
            lblDetailsMistsubishi1: "Audio-Visual Equipment",
            lblDetailsMistsubishi2: "Conditioning + Curtains For The Windows.",
            lblServicesMistsubishi: "Annual Contract And Leasing Service",
            lblModelKonicto: "2007, 46 velvet Seat",
            lblDetailsKonicto: "Conditioning + Curtains For The Windows + Heat Insulator And Sound.",
            lblServicesKonicto: "Annual Contract And Leasing Service."
        },
        'url:fleet_advance.html': {
            lblTitle: "Fleet Advance",
            lblHeaderTitle: "Details",
            lblModel: "Model",
            lblDetails: "Details",
            lblServices: "Services",
            lblModel2: "Model",
            lblDetails2: "Details",
            lblServices2: "Services",
            lblModel3: "Model",
            lblDetails3: "Details",
            lblServices3: "Services",
            lblModel4: "Model",
            lblDetails4: "Details",
            lblServices4: "Services",
            lblModel5: "Model",
            lblDetails5: "Details",
            lblServices5: "Services",
            lblModel6: "Model",
            lblDetails6: "Details",
            lblServices6: "Services",
            lblModel7: "Model",
            lblDetails7: "Details",
            lblServices7: "Services",
            lblModel: "Model",
            lblDetails: "Details",
            lblServices: "Services",
            lblModelTraveco: "2015, 28 Leather Seat",
            lblDetailsTraveco: "Leather Seat 28",
            lblServicesTraveco: "Annual Contract And Leasing Service.",
            lblModelTrav: "2012, 49 Velvet Seat",
            lblDetailsTrav: "49 Velvet Seat",
            lblServicesTrav: "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
            lblModelMBT: "2005, 49 Velvet Seat",
            lblDetailsMBT: "49 Velvet Seat",
            lblServicesMBT: "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
            lblModelKingLong: "2014, 49 Velvet Seat",
            lblDetailsKingLong: "49 Velvet Seat",
            lblServicesKingLong: "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
            lblModelCityBus: "2013, 45 Velvet Seat",
            lblDetailsCityBus: "Conditioning + Curtains For The Windows + Heat Insulator And Sound.",
            lblServicesCityBus: "Annual Contract And Leasing Service-Transport Within City Service.",
            lblModelTravecoMistsubishi: "2014, 29 Velvet Seat",
            lblDetailsMistsubishi1: "Audio-Visual Equipment",
            lblDetailsMistsubishi2: "Conditioning + Curtains For The Windows.",
            lblServicesMistsubishi: "Annual Contract And Leasing Service",
            lblModelKonicto: "2007, 46 velvet Seat",
            lblDetailsKonicto: "Conditioning + Curtains For The Windows + Heat Insulator And Sound.",
            lblServicesKonicto: "Annual Contract And Leasing Service."
        },

        'url:intro.html': {
            lblLanguage: "Language",
            lblSkip: "Skip"

        },

        'url:login.html': {
            lblPersonalInfo: "Personal Information",
            lbllogin: "Login",
            lblforget: "Forget Password ?",
            lbldonthaveaccount: "If You Don't Have An Account Please",
            join: "Join Now",
            lblTittle: "Log In",
            txtUserName: "Email address",
            txtPassword: "Password",
            btnSignUp: "Sign Up",
            btnLogin: "Log in",
            lblLoginToYourAccount: "Login to your account",
            btnForgetPassword: "Forget Password"
        },
        'url:nationalities.html': {
            txtSearch: "Search",
            lblTitle: "Nationalities",
            "Cancel": "Cancel"
        },

        'url:offers1.html': {
            lblTitle: "Offers",
            firstlbl: "Transport Service From Airport",
            seconlbl: "luxury Car Service With Driver In Professional "
        },
        'url:Offers2nd.html': {
            lblTitle: "Offers",
            lblTranTitle: "Transport Service From Airport",
            lblParagraph: "Luxury Car Service With Driver In a Professional Manner To Benefit From SAPTCO Experience In The Field Of Transport. <br> Locations And The Spread Of SAPTCO Branches In Main Regions Of The KSA And Airports Where The Service In Airports' Terminals In Riyadh, Jeddah And Dammam Airport. <br> SAPTCO Targeting Five-Star Hotels, Banks, Airlines, Organizers Of Events, Conferences, Exhibitions And Sports Clubs."

        },
        'url:our_fleet.html': {
            lblHeader: "Our Fleet",
            lblTitle: "Our Fleet"
        },
        'url:PassengerfillInfo.html': {

            lblName: "Name",
            lblIdTime: "ID Type",
            lblNationalIdNumber: "ID Number",
            lblVersionNumber: "Copies count",
            lblNationlaty: "Nationality",
            lblTitle: "Details",
            lblGender: "Gender",
            lblDateOfBirth: "Date Of Birth",
            btnDone: "Done",
            lblAddToFavList: "Add This Passenger To Favorite List",
            btnSaveItem: "Ok",
            lblMale: "Male",
            lblFemale: "Female",
            lblPassport: "Passport",
            lblIdCard: "National ID",
            lblResidenceVisa: "Iqama",
            lblGccSitizen: "Gcc Citizen",
            lblTitle: "Passenger Info",
            optSelect: "Select",
            btnSearch: "Search",
            lblPassengersInfo: "Passenger Information",
            lblSearch: "Search Passenger"
        },
        'url:PassengerfillInfo.html': {

            lblName: "Name",
            lblIdTime: "ID Type",
            lblNationalIdNumber: "ID Number",
            lblVersionNumber: "Copies count",
            lblNationlaty: "Nationality",
            lblTitle: "Details",
            lblGender: "Gender",
            lblDateOfBirth: "Date Of Birth",
            btnDone: "Done",
            lblAddToFavList: "Add This Passenger To Favorite List",
            btnSaveItem: "Ok",
            lblMale: "Male",
            lblFemale: "Female",
            lblPassport: "Passport",
            lblIdCard: "National ID",
            lblResidenceVisa: "Iqama",
            lblGccSitizen: "Gcc Citizen",
            lblTitle: "Passenger Info",
            optSelect: "Select",
            btnSearch: "Search",
            lblPassengersInfo: "Passenger Information"
        },
        'url:PassengerfillInfo.html': {

            lblName: "Name",
            lblIdTime: "ID Type",
            lblNationalIdNumber: "ID Number",
            lblVersionNumber: "Copies count",
            lblNationlaty: "Nationality",
            lblTitle: "Details",
            lblGender: "Gender",
            lblDateOfBirth: "Date Of Birth",
            btnDone: "Done",
            lblAddToFavList: "Add This Passenger To Favorite List",
            btnSaveItem: "Ok",
            lblMale: "Male",
            lblFemale: "Female",
            lblPassport: "Passport",
            lblIdCard: "National ID",
            lblResidenceVisa: "Iqama",
            lblGccSitizen: "Gcc Citizen",
            lblTitle: "Passenger Info",
            optSelect: "Select",
            btnSearch: "Search",
            lblPassengersInfo: "Passenger Information"
        },
        'url:PassengerfillInfo.html': {

            lblName: "Name",
            lblIdTime: "ID Type",
            lblNationalIdNumber: "ID Number",
            lblVersionNumber: "Copies Count",
            lblNationlaty: "Nationality",
            lblTitle: "Details",
            lblGender: "Gender",
            lblDateOfBirth: "Date Of Birth",
            btnDone: "Done",
            lblAddToFavList: "Add This Passenger To Favorite List",
            btnSaveItem: "Ok",
            lblMale: "Male",
            lblFemale: "Female",
            lblPassport: "Passport",
            lblIdCard: "National ID",
            lblResidenceVisa: "Iqama",
            lblGccSitizen: "Gcc Citizen",
            lblTitle: "Passenger Info",
            optSelect: "Select",
            btnSearch: "Search",
            lblPassengersInfo: "Passenger Information"
        },
        'url:PassengerfillInfo.html': {

            lblName: "Name",
            lblIdTime: "ID Type",
            lblNationalIdNumber: "ID Number",
            lblVersionNumber: "Copies count",
            lblNationlaty: "Nationality",
            lblTitle: "Details",
            lblGender: "Gender",
            lblDateOfBirth: "Date Of Birth",
            btnDone: "Done",
            lblAddToFavList: "Add This Passenger To Favorite List",
            btnSaveItem: "Ok",
            lblMale: "Male",
            lblFemale: "Female",
            lblPassport: "Passport",
            lblIdCard: "National ID",
            lblResidenceVisa: "Iqama",
            lblGccSitizen: "Gcc Citizen",
            lblTitle: "Passenger Info",
            optSelect: "Select",
            btnSearch: "Search",
            lblPassengersInfo: "Passenger Information"
        },
        'url:PassengerfillInfo.html': {

            lblName: "Name",
            lblIdTime: "ID Type",
            lblNationalIdNumber: "ID Number",
            lblVersionNumber: "Copies count",
            lblNationlaty: "Nationality",
            lblTitle: "Details",
            lblGender: "Gender",
            lblDateOfBirth: "Date Of Birth",
            btnDone: "Done",
            lblAddToFavList: "Add This Passenger To Favorite List",
            btnSaveItem: "Ok",
            lblMale: "Male",
            lblFemale: "Female",
            lblPassport: "Passport",
            lblIdCard: "National ID",
            lblResidenceVisa: "Iqama",
            lblGccSitizen: "Gcc Citizen",
            lblTitle: "Passenger Info",
            optSelect: "Select",
            btnSearch: "Search",
            lblPassengersInfo: "Passenger Information"
        },
        'url:FavoritefillInfo.html': {

            lblName: "Name",
            lblIdTime: "ID Type",
            lblNationalIdNumber: "ID Number",
            lblVersionNumber: "Copies count",
            lblNationlaty: "Nationality",
            lblTitle: "Details",
            lblGender: "Gender",
            lblDateOfBirth: "Date Of Birth",
            btnDone: "Done",
            lblAddToFavList: "Add This Passenger To Favorite List",
            btnSaveItem: "Ok",
            lblMale: "Male",
            lblFemale: "Female",
            lblPassport: "Passport",
            lblIdCard: "National ID",
            lblResidenceVisa: "Iqama",
            lblGccSitizen: "Gcc Citizen",
            lblTitle: "Passenger Info",
            optSelect: "Select",
            btnSearch: "Search",
            lblPassengersInfo: "Passenger Information"
        },

        'url:Passengers.html': {
            lblGoingTic: "Ticket Details",
            lblFrom: "From",
            lblTo: "To",
            lblReturnTi: "Return Ticket",
            lblFrom1: "From",
            lblTo1: "To",
            lblPassenger: "Passengers Info",
            lblpassType: "Passenger Type",
            lblnatio: "Nationality",
            lblGender: "Gender",
            lblBirth: "Date Of Birth",
            lbltitle: "Passengers",
            lblName: "Name",
            lblGoingTicket: "Going Ticket",
            lblTicketFee: "Ticket Price",
            lblTicketNumber: "Ticket Number",
            SAR: " SR ",
            lblTicketDate: "Trip Date"

        },
        'url:PassengersInfo.html': {
            lblTitle: "Passengers",
            lblPassengerInfo: "Passenger Info",
            lblPleaseEnter: "PleaseEnter All Passengers Information",
            lblPassInfo: "Passengers Information",
            lblAdults: "Adults",
            lblChildren: "Children",
            lblInfants: "Infants",
            lblContactInfo: "Contact Information",
            lblCountryLabel: "Country",
            txtPhoneNUmber: "5XXXXXXXX",
            txtEmailAddress: "Enter Your Email Address",
            btnContinue: "Continue",
            ArabicSelect: "none",
            EnglishSelect: "block",
            phoneDirection: "ltr"
        },
        'url:privacyandpolicy.html':
            {
                lblTitle: "Privacy And Policy ",
                showEnglishCss: "block",
                showArabicCss: "none"
            },

        'url:profile.html': {
            lblPersonalInfo: "Personal Information",
            lblOtherPersonalInfo: "OtherInformation",
            lbllogin: "Edit Profile",
            logout: "Log Out",
            title: "Profile",
            Logout: "Logout",
            lblTittle: "My Profile",
            natId: "Copies Count",
            country: "Country",
            natiNumber: "Phone Number",
            iqama: "Iqama",
            NatID: "National ID",
            lblpassport: "Passport",
            lblGCC: "GCC Citizen",
            lblmale: "Male",
            lblFemale: "Female"

        },

        'url:paymentoptions.html': {

            head: " Payment",
            selpayment: "Please Select The Payment Method"
        },
        'url:Sdadpay.html': {
            lblThankYou: "Thank You For Booking With Saudi Public Transport Company(SAPTCO)",
            lblPart1: "This is a reminder for you that your booking is not confirmed and payment must be received before the expiration time below or it will be automatically cancelled.",
            lblPart2: "You can access SADAD via your online bank account, ATM, Phone Banking or at a bank counter. Select Saudi Public Transport Company biller number, type your PNR / Bill number and complete the transaction. After payment you will receive SMS and E-Mail that your payment and your reservation have been confirmed.",
            lblBill: "Bill Number",
            lblLastPayemntDue: "Last Payment Due",
            lblTotalAmount: "Total Amount",
            lblSaudiTrans: "Saudi Transportation Company Code",
            btnSearch: "Main Menu",
            lblTitle: "Sadad Payment",
            lblPrint: "Print"
        },

        'url:stations.html': {
            lblTitle: "Station",
            "Cancel": "Cancel",
            search: "Search"
        },
        'url:setting.html': {
            lblTitle: "Settings",
            lblChangeLanguage: "Change Language",
            lblEnglish: "English",
            lblArabic: "Arabic",
            btnSave: "Save"
        },
        'url:trips.html': {
            numberofpassengers: "Price for ",
            lblHeaderTitle: "We Found <a style='color: black' id ='lblNumberOfTrips'> 0</a> Trips Matching Search",
            lblOutwordTrip: "Trip : ",
            tabOutword: "Outword",
            tabReturn: "Return",
            lblFrom: "From",
            lblto: "To",
            lblMoreDetils: "More Details",
            lblTripServices: "Trip Services",
            lblMeals: "Meals",
            lblChargres: "Chargers",
            lblrefreshments: "Refreshments",
            lblDirect: "Direct Trips",
            lblNewspapers: "Newspapers",
            lblMapView: "Map",
            lblStabdardPrice: "Standard Price",
            lblDiscountPrice: "Discount Price",
            imgGoingBus: "goingbus.png",
            lblPleaseSelectRet: "Please Select The Return Trip",
            btnOK: "OK",
            lblHeaderTitle: "Select Trip",
            lblTicketTerms: "Ticket Terms",
            lblNotRefundable: "1- Not Refundable",
            lblTransferable: "2- Not Transferrable",
            lblCancel: "Cancel",
            Accept: "Accept",
            tripDirection: "Trip :"
        },

        'url:Trip-summry.html': {

            lblGoingTic: "Outward Ticket",
            lblFrom: "From",
            lblTo: "To",
            lblReturnTi: "Return Ticket",
            lblFrom1: "From",
            lblTo1: "To",
            lblPassenger: "Passengers",
            lblagree: "I Agree To The Terms And Conditions.",
            lblTitle: "Trip Summary",
            lblprice: "Total Reservation Price - Confirm and Pay",
            SAR: " SR ",
            Duration: "Duration"

        }, 'url:FirstSummry.html': {

            lblGoingTic: "Outward Ticket",
            lblFrom: "From",
            lblTo: "To",
            lblReturnTi: "Return Ticket",
            lblFrom1: "From",
            lblTo1: "To",
            lblPassenger: "Passengers",
            lblagree: "I Agree To The Terms And Conditions.",
            lblTitle: "Trip Summary",
            lblprice: "Tolal Reservation Price",
            SAR: " SR ",
            btnContinue: "Continue",
            classArabic: "",
            lblHours: " hrs",
            Duration: "Duration"

        },
        'url:signup.html': {
            lblPersonalInfo: "Personal Information",
            lblOtherPersonalInfo: "Other Information",
            lbllogin: "Sign Up",
            lblTittle: "Sign Up",
            lblGender: "Gender",
            lblidtype: "ID Type",
            lblnation: "Nationality",
            lblbday: "Date of Birthday",
            lblmail: " Mail",
            fistName: "First Name",
            lastName: "Last Name",
            Emailtxt: "Email",
            Password: "Password",
            natNumber: "Enter Your ID Number",
            natId: "Copies count",
            country: "Country",
            phoneNumber: "5XXXXXXXX",
            iqama: "Iqama",
            NatID: "National ID",
            lblpassport: "Passport",
            lblmale: "Male",
            lblGCC: "GCC Citizen",
            lblFemale: "Female",
            select: "select",
            DF__lblFemale: "2",
            DF__lblmale: "1",
            DF__iqama: "1",
            DF__NatID: "2",
            DF__lblpassport: "4",
            DF__lblGCC: "3",
            SignupMessageOk: "OK",
            ArabicSelect: "none",
            EnglishSelect: "block"
        },
        'url:condtionandterms.html':
        {
            lblTitle: "Terms and Conditions",
            showEnglishCss: "block",
            showArabicCss: "none"
        },
        'url:mybooking.html':
           {
               lblTitle: "Manage Reservation",
               reservationNumber: "Reservation number",
               mobileNumber: "Mobile Number",
               SearchBtn: "Search",
               tabManage: "Search",
               tabBooking: "My Booking",
               tabHistory: "History",
               lblSearchReservation: "Search Reservation",
               lblMobileNum: "Mobile No"
           },
        'url:historytab.html':
            {
                HistoryTitle: "History",
                tabManage: "Search",
                tabBooking: "My Booking",
                tabHistory: "History"
            },
        'url:Booking.html':
            {
                MyBookingTitle: "My Booking",
                tabManage: "Search",
                tabBooking: "My Booking",
                tabHistory: "History"
            },
        'url:TicketTransfer.html':
            {
                lblTitle: "Ticket transfer",
                PassengerName: "Passnger Name",
                lblDepartFrom: "Departure From",
                lblArrivalTo: "Arrival to",
                lblDepartureOn: "Departure date",
                lblNewDepartureOn: "New Departure Date",
                btnSearch: "Search"
            },
        'url:Tickets.html':
            {
                tickets: "Tickets",
                lblPNRInfo: "Reservation Info",
                PNRNumber: "Number",
                ReservationStatus: "Status",
                btnPrint: "Print",
                btnSearch: "Main Menu"
            },
        'url:feedback.html':
            {
                PhoneNumber: "phone number",
                Name: "Name",
                Comment: "Comment",
                Feedback: "Feedback",
                Save: "Send"
            },
        'url:changetime.html':
            {
                lblTitle: "Trips"
            },
        'url:paymentcomp.html':
            {
                lblTitle: "Payment Completment",
                Thank_msg: "Thank You For Reserving With Saptco, you will receive a message shortly to confirm reservation status."
            },
        'url:menu_favorite.html':
            {
                lblTitle: "Favorite List",
                lbladult: "Adult",
                lblchild: "Child",
                lblinfa: "Infant",
                lblselect: "Select passenger category"

            },
        'url:forget_password.html':
            {

                lblTittle: "Forget Password",
                txtUserName: "Email",
                btnSend: "Send"
            },
        'url:LimoReservationtypes.html':
            {

                lblTittle: "Limo Reservation",
                Companies: "Companies",
                Customer: "Customer",
                Company_information: "Company's information",
                Deliver: "Deliver",
                Contract_Type: "Contract Type",
                Contract_Number: "Contract No.",
                Company_Name: "Name",
                Commercial_Record: "Commercial Record",
                Fax_Number: "Fax No. ",
                Authorized_Person: "Authorized Person",
                Name: "Name",
                Phone_Number: "Mobile No.",
                Email_Address: "Email",
                Customer_Info: "Customer Info",
                Cus_Name: "Name",
                ID_Number: "ID Number",
                lblMale: "Male",
                lblFemale: "Female",
                DoneText: "Done",
                optSelect: "Select",
                Gender: "Gender",
                Customer_Location: "Customer Location",
                Continue: "Send Request",
                DoneText: "Done",
                phoneDirection: "ltr",
                txtPhoneNUmber: "5XXXXXXXX",

            },
        'url:LimoReservationData.html':
            {
                Service_Period: "Service Period",
                lblTittle: "Reservation Info",
                Reservation_Information: "Reservation Information",
                limo_with_driver: "limo with driver",
                Service_Type: "Service Type",
                One_way: "One way",
                Round_Trip: "Round Trip",
                Service_Time: "Service Time",
                Mercedes: "Mercedes",
                GMC: "GMC",
                BMW: "BMW",
                LEXUS: "LEXUS",
                Car_Type: "Car Type",
                Service_Date: "Service Date:",
                Time: "Time",
                City: "City",
                DepartFrom: "Depart From",
                lblTo: "To",
                Pickup_Location: "Pickup Location",
                Cash: "Cash",
                Visa: "Visa",
                Sadad: "Sadad",
                Payment_Method: "Payment Method",
                Continue: "Continue",
                Contract_Type: "Contract Type",
                selectDate: "Select Date",
                optSelect: "Select"
            },
        'url:LimoRequestItemsList.html':
            {
                lblTitle: "Services",
                RequestsList: "Services List",
                AddNewService: "Add new service",
                Continue: "Continue"
            },
        'url:CCRequestItemsList.html':
            {
                lblTitle: "Services",
                RequestsList: "Services List",
                AddNewService: "Add new service",
                Continue: "Continue"
            },
        'url:CargoRequestItemsList.html':
            {
                lblTitle: "Services",
                RequestsList: "Services List",
                AddNewService: "Add new service",
                Continue: "Continue"
            },
        'url:CargoReservationDataLocation.html':
            {
                ToSamePickupLoc: "To same pickup location",
                lblTittle: "Reservation Info",
                Reservation_Information: "Location",
                DepartFrom: "Please Select Depart Location",
                lblTo: "Please Select Arrival Location",
                Pickup_Location: "Pickup Location",
                Continue: "Continue"
            },
        'url:LimoReservationDataLocations.html':
            {
                ToSamePickupLoc: "To same pickup location",
                lblTittle: "Reservation Info",
                Reservation_Information: "Location",
                DepartFrom: "Please Select Depart Location",
                lblTo: "Please Select Arrival Location",
                Pickup_Location: "Location Details",
                Continue: "Continue"
            },
        'url:Rent_bus_Location.html':
            {
                ToSamePickupLoc: "To same pickup location",
                lblTittle: "Reservation Info",
                Reservation_Information: "Location",
                DepartFrom: "Please Select Depart Location",
                lblTo: "Please Select Arrival Location",
                Pickup_Location: "Delivery Location",
                Continue: "Continue"
            },
        'url:CargoSucess.html':
         {
             successfullyCargo: "Request Cargo was sent successfully, We will contact you soon",
             ReturnHome: "Return Home",
             Title: "Sucess",
             CargoService: "Cargo Request"
         },
        'url:LimoSucess.html':
         {
             successfullyLimo: "Request Limo was sent successfully, We will contact you soon",
             ReturnHome: "Return Home",
             Title: "Sucess"

         },
        'url:BusSucess.html':
         {
             successfullyCargo: "Request Bus was sent successfully, We will contact you soon",
             ReturnHome: "Return Home",
             Title: "Sucess"

         },
        'url:CargoReservationData.html':
            {
                CargoInformation: "Details",
                ReservationInformation: 'Reservation Information',
                Fromcity: 'From city:',
                DoneText: "Done",
                Tocity: 'To city:',
                VehicleType: 'Truck Type:',
                Typeofitems: 'Type of items:',
                TypeofitemsPlaceHolder: 'Type of items',
                informationofloadinplace: 'Pickup Location:',
                Informationofplacedownloading: 'Delivery Location:',
                VehicleNo: "Truck Count:",
                VehicleNoPlaceHolder: "Truck Count",
                Date: 'Date:',
                DatePlaceHolder: 'Date',
                Continue: 'Continue',
                Direction: 'Direction:',
                Typeofservice: 'Type of service:',
                lblLocation: 'Location:',
                ServiceLocation: "Service Location",
                optSelect: "Select"
            },
        'url:CargoReservationRequest.html':
            {
                lblRequestCargo: 'Cargo service',
                CustomerInfo: 'Customer Info',
                Name: 'Name',
                PhoneNumber: 'Phone',
                MobileNumber: "Mobile",
                EmailAddress: 'EmailAddress',
                service1: 'service1',
                service2: 'service2',
                service3: 'service3',
                Continue: 'Submit',
                phoneDirection: "ltr",
                txtPhoneNUmber: "5XXXXXXXX",
            },
        'url:CargoSucess.html':
            {
                successfullyCargo: "Request Cargo was sent successfully",
                ReturnHome: "Return Home"

            }
        ,
        'url:Rent_Bus_home.html':
            {
                lblName: "Name:",
                lblIdTime: "Mobile No.:",
                txtEmailAddress: "Email:",
                lblFax: "Fax:",
                lblFaxPlaceHolder: "Fax",
                lblTitle: "Details",
                lblGender: "Gender:",
                lblDateOfBirth: "Date Of Birth",
                btnDone: "Done",
                lblAddToFavList: "Add This Passenger To Favorite List",
                btnSaveItem: "Ok",
                lblJeddah: "Jeddeh",
                lblRiydah: "Riydah",
                btnContinue: "Submit",
                lblTitle: "Passenger Info",
                optSelect: "Select",
                btnSearch: "Search",
                lblPassengersInfo: "Passenger Information",
                lblSearch: "Search Passenger",
                Personal: "Personal",
                Comapnies: "Comapnies",
                lblCompanyDetails: "Company Info",
                lblCompanyName: "Company Name:",
                lblPhone: "Mobile Number",
                lblAuthorizedperson: "Authorized person",
                lblPersonName: "Name:",
                title: "Rent Bus",
                PhoneNumber: "Mobile Number",
                phoneDirection: "ltr",
                txtPhoneNUmber: "5XXXXXXXX"
            },
        'url:Rent_Bus_Details.html':
            {
                detailstitle: "Details",
                lblRentDetails: " Request Details",
                lblBus: "Bus Type",
                DoneText: "Done",
                lblCountBuses: "Bus Count",
                lblDate: "Service Date:",
                lblFrom: "From",
                lblTo: "To",
                lblLocation: "Location:",
                lblTime: "Service Time",
                lblTitle: "Details",
                lblGender: "Gender",
                lblDateOfBirth: "Date Of Birth",
                btnDone: "Done",
                lblOffice: "Sales Office",
                btnSaveItem: "Ok",
                btnContinue: "Continue",
                optSelect: "Select",
                btnSearch: "Search",
                lblPassengersInfo: "Passenger Information",
                lblSearch: "Search Passenger",
                Personal: "Personal",
                Comapnies: "Comapnies",
                selectDate: "Select Date",
                phoneDirection: "ltr"
            }

    };
}
/**************menu links***********/
myApp.onPageInit('*', function (page)
{

    localStorage.setItem("PageName", page.name);
    $$(".link-force-back").on("click", function ()
    {
        mainView.router.back({ url: "Home.html", force: true });
    });
    if (currentPage != "index" && page.name != "index" && page.name != "Home" && page.name != "setting")
    {
        currentPage = "";
    }

    if (page.name == "Home")
    {
        currentPage = "Home";
    }
});

var currentPage = "";
myApp.onPageBack('*', function (page)
{
    localStorage.setItem("BackPageName", page.name);
});

//$$(document).on('beforeSubmit', function (e)
//{
//    var saptcoIndex = e.detail.xhr.requestUrl.indexOf("saptco.");
//
//    var xhr = e.detail.xhr;
//    if (saptcoIndex > 0)
//    {
//        try
//        {
//            xhr.abort();
//        } catch (e)
//        {

//        }
//    }

//});

myApp.onPageBeforeAnimation("index", function ()
{
    document.getElementById("btnSkipScreen").focus();

    $$("#btnSkipScreen").css('z-index', '100000');
    $$(".btn-change-lang").css('z-index', '100000');

    mainView.hideNavbar();
    mainView.hideToolbar();

    var mySwiper = myApp.swiper('.main-swiper-container', {
        speed: 400,
        pagination: '.swiper-pagination',
        paginationHide: false,
        paginationClickable: true,
        spaceBetween: 0,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });
});

myApp.onPageBeforeAnimation("Home", function ()
{

    //deleteFormsData();
    currentPage = "Home";

});

myApp.onPageAfterAnimation("index", function ()
{
    currentPage = "index";
});

myApp.onPageInit('index', function (page)
{
    ChangeLanguage(GetApplicationLanguage());
});

myApp.onPageBack("*", function ()
{
    myApp.closeModal();
});

/***********************************/
/////////////////phonegap
var app = {
    // Application Constructor
    initialize: function ()
    {
        this.bindEvents();
        document.addEventListener("backbutton", backKeyDown, true);
        function backKeyDown()
        {
            if ($$('body').hasClass('with-panel-right-reveal') || $$('body').hasClass('with-panel-left-reveal'))
            {
                myApp.closePanel();
                myApp.closeModal();
            }
            else
            {
                var pageObject = mainView.activePage;
                if (pageObject.name == "index")
                {
                    navigator.app.exitApp();
                }
                else if (pageObject.name == "Home")
                {
                    mainView.router.back({ url: 'index.html', force: true });
                }
                else
                {
                    var pages = ["CargoRequestItemsList", "LimoRequestItemsList", "CCRequestItemsList", "paymentoptions", "Sdadpay", "CargoSucess", "LimoSucess"
                    , "BusSucess"];
                    var pageIndex = pages.indexOf(pageObject.name);
                    if (pageIndex < 0)
                    {

                        if (pageObject.name == "Home")
                        {
                            mainView.router.back({ url: 'index.html', force: true });
                        }
                        else
                        {
                            var b = localStorage.getItem("PageName");
                            var backPageName = localStorage.getItem("BackPageName"); 
                            mainView.router.back({ url: 'index.html' }); 
                        }
                    }
                }
            }
            myApp.closeModal();
        }
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function ()
    {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler 
    onDeviceReady: function ()
    {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id)
    {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
};

function deleteFormsData()
{
    // Limo Storage. 
    localStorage.removeItem("LimoCorpContractTypeen-us");
    localStorage.removeItem("LimoCorpContractTypear-sa");
    localStorage.removeItem("LimoServiceTypesar-sa");
    localStorage.removeItem("LimoServiceTypesen-us");
    localStorage.removeItem("LimoServiceDurationar-sa");
    localStorage.removeItem("LimoServiceDurationen-us");
    localStorage.removeItem("LimoCarsTypesar-sa");
    localStorage.removeItem("LimoCarsTypesen-us");
    localStorage.removeItem("limoCitiesar-sa");
    localStorage.removeItem("limoCitiesen-us");
    localStorage.removeItem("LimoPaymentOptionsar-sa");
    localStorage.removeItem("LimoPaymentOptionsen-us");
    localStorage.removeItem("salesOfficesar-sa");
    localStorage.removeItem("salesOfficesen-us");
    localStorage.removeItem("BusTypesCollectionar-sa");
    localStorage.removeItem("BusTypesCollectionen-us");
    localStorage.removeItem("CargoServiceTypes_ar-sa");
    localStorage.removeItem("CargoServiceTypes_en-us");
    localStorage.removeItem("CargoDirectionar-sa");
    localStorage.removeItem("CargoDirectionen-us");
    localStorage.removeItem("truckTypesar-sa");
    localStorage.removeItem("truckTypesen-us");
    localStorage.removeItem("citiesCollectionar-sa");
    localStorage.removeItem("citiesCollectionen-us");
    localStorage.removeItem("stationsStorage_ar-sa");
    localStorage.removeItem("stationsStorage_en-us");


    localStorage.removeItem("txtValueDistLocation");
    localStorage.removeItem("txtDistLocation");
    localStorage.removeItem("txtValuePickUpLocation");
    localStorage.removeItem("txtPickUpLocation");
    localStorage.removeItem("pickupLocation");
    localStorage.removeItem("updatelocationfield");
    localStorage.removeItem("CenterSelectLocation");
    localStorage.removeItem("CenterSelectLocationCord");
    localStorage.removeItem("reqServiceType");
    localStorage.removeItem("cargoItemToUpdate");
    localStorage.removeItem("cargoDataObjData");
    localStorage.removeItem("CargoReservationMapInfo");
    localStorage.removeItem("cargoItemToUpdate");
    localStorage.removeItem("cargoRequestsList");
    localStorage.removeItem("cargoItemToUpdateIndex");
    localStorage.removeItem("cargoReqObjData");
    localStorage.removeItem("limoItemToUpdate");
    localStorage.removeItem("LimoReservationInfo");
    localStorage.removeItem("limoRequestsList");
    localStorage.removeItem("limoItemToUpdateIndex");
    localStorage.removeItem("limoItemToUpdate");
    localStorage.removeItem("LimoRequestTypes");
    localStorage.removeItem("LimoPassengerInfo");
    localStorage.removeItem("txtValueDistLocation");
    localStorage.removeItem("txtDistLocation");
    localStorage.removeItem("txtValuePickUpLocation");
    localStorage.removeItem("txtPickUpLocation");
    localStorage.removeItem("pickupLocation");
    localStorage.removeItem("updatelocationfield");
    localStorage.removeItem("CenterSelectLocation");
    localStorage.removeItem("CenterSelectLocationCord");
    localStorage.removeItem("reqServiceType");

    localStorage.removeItem("CCItemToUpdate");
    localStorage.removeItem("detailsData");
    localStorage.removeItem("CCItemToUpdate");
    localStorage.removeItem("CandCReservationMapInfo");
    localStorage.removeItem("CCRequestsList");
    localStorage.removeItem("CCItemToUpdateIndex");
    localStorage.removeItem("CCItemToUpdate");
    localStorage.removeItem("CCItemToUpdateIndex");
    localStorage.removeItem("CCRequestsList");
    localStorage.removeItem("Personal_form_Data");
    localStorage.removeItem("Company_form_Data");
    localStorage.removeItem("RequestTypes");
    localStorage.removeItem("salesOffices");
    localStorage.removeItem("updatelocationfield");
    localStorage.removeItem("CenterSelectLocation");
    localStorage.removeItem("CenterSelectLocationCord");
    localStorage.removeItem("txtValuePickUpLocation");
    localStorage.removeItem("txtPickUpLocation");
    localStorage.removeItem("txtValueDistLocation");
    localStorage.removeItem("txtDistLocation");
    localStorage.removeItem("pickupLocation");
    localStorage.removeItem("reqServiceType");
    localStorage.removeItem("Personally");
    localStorage.removeItem("results");
    localStorage.removeItem("Company");
    localStorage.removeItem("results");

    localStorage.removeItem("txtValueDistLocation");
    localStorage.removeItem("txtDistLocation");
    localStorage.removeItem("txtValuePickUpLocation");
    localStorage.removeItem("txtPickUpLocation");
    localStorage.removeItem("pickupLocation");
    localStorage.removeItem("updatelocationfield");
    localStorage.removeItem("CenterSelectLocation");
    localStorage.removeItem("CenterSelectLocationCord");
    localStorage.removeItem("reqServiceType");
    localStorage.removeItem("cargoItemToUpdate");
    localStorage.removeItem("cargoDataObjData");
    localStorage.removeItem("CargoReservationMapInfo");
    localStorage.removeItem("cargoItemToUpdate");
    localStorage.removeItem("cargoRequestsList");
    localStorage.removeItem("cargoItemToUpdateIndex");
    localStorage.removeItem("cargoReqObjData");
    localStorage.removeItem("limoItemToUpdate");
    localStorage.removeItem("LimoReservationInfo");
    localStorage.removeItem("limoRequestsList");
    localStorage.removeItem("limoItemToUpdateIndex");
    localStorage.removeItem("limoItemToUpdate");
    localStorage.removeItem("LimoRequestTypes");
    localStorage.removeItem("LimoPassengerInfo");
    localStorage.removeItem("txtValueDistLocation");
    localStorage.removeItem("txtDistLocation");
    localStorage.removeItem("txtValuePickUpLocation");
    localStorage.removeItem("txtPickUpLocation");
    localStorage.removeItem("pickupLocation");
    localStorage.removeItem("updatelocationfield");
    localStorage.removeItem("CenterSelectLocation");
    localStorage.removeItem("CenterSelectLocationCord");
    localStorage.removeItem("reqServiceType");

    localStorage.removeItem("CCItemToUpdate");
    localStorage.removeItem("detailsData");
    localStorage.removeItem("CCItemToUpdate");
    localStorage.removeItem("CandCReservationMapInfo");
    localStorage.removeItem("CCRequestsList");
    localStorage.removeItem("CCItemToUpdateIndex");
    localStorage.removeItem("CCItemToUpdate");
    localStorage.removeItem("CCItemToUpdateIndex");
    localStorage.removeItem("CCRequestsList");
    localStorage.removeItem("Personal_form_Data");
    localStorage.removeItem("Company_form_Data");
    localStorage.removeItem("RequestTypes");
    localStorage.removeItem("salesOffices");
    localStorage.removeItem("updatelocationfield");
    localStorage.removeItem("CenterSelectLocation");
    localStorage.removeItem("CenterSelectLocationCord");
    localStorage.removeItem("txtValuePickUpLocation");
    localStorage.removeItem("txtPickUpLocation");
    localStorage.removeItem("txtValueDistLocation");
    localStorage.removeItem("txtDistLocation");
    localStorage.removeItem("pickupLocation");
    localStorage.removeItem("reqServiceType");
    localStorage.removeItem("Personally");
    localStorage.removeItem("results");
    localStorage.removeItem("Company");
    localStorage.removeItem("results");
}


function DeleteLocalData(key)
{
    localStorage.setItem(key, null);
}