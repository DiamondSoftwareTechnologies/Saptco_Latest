

/**
 * 
 */
function collectTripsOneWay_() {
    var stationsData = GetLocalDataObject("StationsStorage");
    var passengersCount = GetLocalDataObject("passengersCount");
    var Data =
	{
	    "DepartureStation": stationsData.DepartureStationsId,
	    "ArrivalStation": stationsData.ArrivleStationsId,
	    "DepartureDate": $$("#lblDepartureDate").html(),
	    "DirectTripsOnly": false,
	    "Passengers":
		{
		    "AdultsCount": passengersCount.AdultsCount,
		    "ChildrenCount": passengersCount.ChildrenCount,
		    "InfantsCount": passengersCount.InfantsCount
		},
	    "PromotionCode": ""
	};

    var jsonData = JSON.stringify(Data);
    return jsonData;
}

function collectTripsOneWay() {
	var logo=GetLocalDataObject("logo");
	if(logo == 1)
        var stationsData = GetLocalDataObject("StationsStorage");
	else
        var stationsData = GetLocalDataObject("StationsStorageVip");


    // var passengersCount = GetLocalDataObject("passengersCount");
    var Data =
	{
	    "DepartureStation": stationsData.DepartureStationsId,
	    "ArrivalStation": stationsData.ArrivleStationsId,
	    "DepartureDate": $$("#calendar-date-depart").val(),
	    "DirectTripsOnly": false,
	    "Passengers":
		{
		    "AdultsCount": parseInt(GetLocalData("adultCount")),
		    "ChildrenCount": parseInt(GetLocalData("childrenCount")),
		    "InfantsCount": parseInt(GetLocalData("infantsCount")),
		},
	    "PromotionCode": ""
	};

    var jsonData = JSON.stringify(Data);
    return jsonData;
}

function collectTripsRound() {
    var logo=GetLocalDataObject("logo");
    if(logo == 1)
        var stationsData = GetLocalDataObject("StationsStorage");
    else
        var stationsData = GetLocalDataObject("StationsStorageVip");

    // var passengersCount = GetLocalDataObject("passengersCount");
    var Data =
	{
	    "DepartureStation": stationsData.DepartureStationsId,
	    "ArrivalStation": stationsData.ArrivleStationsId,
	    "DepartureDate": $$("#calendar-date-depart").val(),
	    "ReturnDate": $$("#calendar-date-arrive").val(),
	    "DirectTripsOnly": false,
	    "Passengers":
		{
		    "AdultsCount": parseInt(GetLocalData("adultCount")),
		    "ChildrenCount": parseInt(GetLocalData("childrenCount")),
		    "InfantsCount": parseInt(GetLocalData("infantsCount")),
		},
	    "PromotionCode": ""
	};


    var jsonData = JSON.stringify(Data);

    return jsonData;
}

function collectCustomersInfo() {
    var Data =
	{
	    "IDNumber": parseArabic($$("#Passenger_IDNumber").html()),
	    "IDType": $$("#Passenger_IDType").data("ID"),
	    "DateOfBirth": $$("#lblDateValue").val()
	};

    var jsonData = JSON.stringify(Data);
    return jsonData;
}

function collectReservationsInfo() {
    var passInfo = GetLocalDataObject("ticketSearchData");

    // get passenger numbers and types .
    var adultsCount = passInfo.Passengers.AdultsCount;
    var ChildCount = passInfo.Passengers.ChildrenCount;
    var InfCount = passInfo.Passengers.InfantsCount;
    var appLang = GetLocalData("ApplicationLanguage");
    var countryCode = $$("#txtCountryCode").val();
    var phoneNumber = $$("#txtPhoneNUmber").val();
    if (phoneNumber.indexOf("0") == 0) {
        var phoneNumber = phoneNumber.substring(1, phoneNumber.length);
    }
    var Data =
	{
	    "BookingList": GetLocalDataObject("TripBookList"),
	    "Passengers": getPassengers(),
	    "PassengerCount":
		{
		    "AdultsCount": adultsCount,
		    "ChildrenCount": ChildCount,
		    "InfantsCount": InfCount
		},
	    "Mobile": countryCode + phoneNumber,
	    "Email": $$("#txtEmailAddress").val()
	};

    var jsonData = JSON.stringify(Data);
    return jsonData;
}

function getBookingList() {
    var bookingList =
	[
	{
	    "JourneyID": "sample string 1",
	    "OfferID": "sample string 2"
	},
	{
	    "JourneyID": "sample string 1",
	    "OfferID": "sample string 2"
	}]

    return bookingList;
}

function CollectPassengerData(type) {
    var userTypes =
	["Adult", "Child", "Infant"];
    var passengerData =
	{
	    "SAPTCOID": GetLocalData("PassengerToEdit"),
	    "Name": $$("#Passenger_Name").html(),
	    "IDNumber": parseArabic($$("#Passenger_IDNumber").html()),
	    "IDType": $$("#Passenger_IDType").data("ID"),
	    "IDVersion": parseArabic(parseInt($$("#Passenger_IDVersion").html())),
	    "DateOfBirth": $$("#lblDateValue").val(),
	    "Gender": $$("#Passenger_Gender").data("ID"),
	    "NationalityID": $$("#lblNationlatyValue").data("ID"),
	    "Type": (userTypes.indexOf(type))
	}

    return passengerData;
}

function getPassengers() {

    var passengers = [];

    var adultsArray = GetLocalDataObject("AdultPassengers");
    for (var i = 0; i < adultsArray.length; i++) {
        // adultsArray[i].SAPTCOID = "";
        passengers.push(adultsArray[i]);
    }

    var childArray = GetLocalDataObject("ChildsArray");
    for (var i = 0; i < childArray.length; i++) {
        // childArray[i].SAPTCOID = "";
        passengers.push(childArray[i]);
    }

    var InfantArray = GetLocalDataObject("InfantsPassengersArray");
    for (var i = 0; i < InfantArray.length; i++) {
        // InfantArray[i].SAPTCOID = "";
        passengers.push(InfantArray[i]);
    }

    return passengers;
}

function CollectSadadPnr() {
    var pnrValue = GetLocalDataObject("ReservationSummary").Results.PNR;
    var Data =
	{
	    "PNR": pnrValue
	};

    var jsonData = JSON.stringify(Data);
    return jsonData;
}

function CollectCreditURI() {
    var Data =
	{
	    "ReturnURI": "sample string 1"
	};

    var jsonData = JSON.stringify(Data);
    return jsonData;
}

function collectSignup() {// edit by manaf 
    var appLang = GetLocalData("ApplicationLanguage");
    var countryCode = "";
    if (appLang == 'ar') {
        countryCode = $$("#countriesSelectAr").val();
    }
    else {
        countryCode = $$("#countriesSelect").val();
    }
    var Personalinfo =
	{
	    Firstname: $$("#fistName").data("value"),
	    Lastname: $$("#lastName").data("value"),
	    Email: $$("#Emailtxt").data("value"),
	    Password: $$("#Password").data("value"),
	    Gender: $$("#Profile_Gender").data("value"),
	    BirthDate: $$("#lblDateValue").val(),
	    IDtype: $$("#Profile_IDType").data("value"),
	    IDNumber: parseArabic($$("#natNumber").data("value")),
	    Versionnum: parseArabic($$("#version").data("value")),
	    MobileNumber: countryCode + $$("#phoneNumber").data("value")
	};

    var jsonData = JSON.stringify(Personalinfo);
    return jsonData;
}

function ClearReservationSearchData() {
    DeleteLocalData("ticketSearchData");
    DeleteLocalData("StationsStorage");
    DeleteLocalData("ticketSearchData");
    DeleteLocalData("InfantsPassengersArray");
    DeleteLocalData("ChildsArray");
    DeleteLocalData("AdultPassengers");
    DeleteLocalData("passengersCount");
}


function parseArabic(str) {
    if (isNaN(str)) {
        return Number(str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
            return d.charCodeAt(0) - 1632;
        }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
            return d.charCodeAt(0) - 1776;
        }));
    }
    else {
        return Number(str);
    }
}