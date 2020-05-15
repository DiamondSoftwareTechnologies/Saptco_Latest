/* 
 */
var ValidationSucessVal = "Success";

function ValidateFavoriteList(list, passenger)
{

    $$.each(list, function (key, value)
    {
        if (passenger.DateOfBirth == value.DateOfBirth && passenger.IDType == value.IDType && passenger.Gender == value.Gender && passenger.IDNumber == value.IDNumber)
            return alert("tis passenger is exsisted");

    });
}
 
function ValidateForgetPassword(emailAddress)
{
    if (!IsValidEmailAddress(emailAddress))
    {
        return "ErrEnterEmail";
    }
    return ValidationSucessVal;
}

function ValidateTripsOneWay(strData)
{
    var Data = JSON.parse(strData)

    if (!IsValidID(Data.DepartureStation))
    {
        return "ErrEnterDepartrureStations";
    }

    if (!IsValidID(Data.ArrivalStation))
    {
        return "ErrEnterArrivleStations";
    }

    if (Data.DepartureStation == Data.ArrivalStation)
    {
        return "ErrSameStationsSelected";
    }


    if (!IsValidDate(Data.DepartureDate))
    {
        return "ErrEnterDepartureDate";
    }
    if (GetLocalData("ReservationType") == "Round" && !IsValidDate(Data.ReturnDate))
    {
        return "ErrEnterReturnDate";
    }

    if (Data.Passengers.AdultsCount <= 0 && Data.Passengers.ChildrenCount <= 0)
    {
        return "ErrMinNumberOfAdult";
    }

    return ValidationSucessVal;
}

function Validatelogin(strData)
{
    var Data = JSON.parse(strData)

    if (!IsValidString(Data.username))
    {
        return "ErrEnterusername";
    }

    if (!IsValidString(Data.password))
    {
        return "ErrEnterPassword";
    }

    return ValidationSucessVal;
}

function Validatesignup(strData)
{
    var Data = JSON.parse(strData)



    if (!IsValidString(Data.Firstname))
    {
        return "ErrEnterfirstname";
    }

    if (!IsValidString(Data.Lastname))
    {
        return "ErrEnterLastname";
    }

    if (!IsValidEmailAddress(Data.Email))
    {
        return "ErrEnterEmail";
    }
    if (!IsValidString(Data.Password) || (Data.Password.length < 6) || (Data.Password.length > 30))
    {
        return "ErrEnterPassword";
    }

    Data.MobileNumber = parseArabic(Data.MobileNumber).toString();
    if (!IsValidPhoneNumber(Data.MobileNumber) || Data.MobileNumber.length > 14 || Data.MobileNumber.length < 8)
    {
        return "WrongPhoneNumber";
    }

    if (!IsValidString(Data.IDtype) || Data.IDtype == "NA")
    {
        return "ErrIDType";

    }
    if (!IsValidGcc(Data.IDNumber) && (Data.IDtype == "GCC"))
    {

        return "ErrGCC";
    }

    Data.IDNumber = parseArabic(Data.IDNumber).toString();
    if (!ValidateNationalID(Data.IDNumber) && (Data.IDtype == "NationalID"))
    {
        return "ErrNationalID";
    }

    if (!ValidateIqamaID(Data.IDNumber) && (Data.IDtype == "IqamaID"))
    {

        return "ErrIqamaID";

    }
    if (!(Data.IDNumber) || !IsValidString(Data.IDNumber) || ((Data.IDNumber.length == 0) || (Data.IDNumber == "0") || (Data.IDNumber.length == null) || (Data.IDNumber == "null")))
    {
        return "ErrNationalID";
    }
    Data.Versionnum = parseArabic(Data.Versionnum).toString();
    if (!IsValidNumber(Data.Versionnum) || Data.Versionnum <= 0 || (Data.Versionnum == "null"))
    {
        return "ErrVersionnum";
    }

    if (Data.Gender == "NA")
    {
        return "ErrGender";
    }

    if (!IsValidDate(Data.BirthDate) || !IsValidString(Data.BirthDate))
    {
        return "ErrDateofbirth";
    }


    return ValidationSucessVal;
}

function ValidateTripsRoundtrip(strData)
{
    var Data = JSON.parse(strData)

    if (!IsValidID(Data.DepartureStation))
    {
        return "ErrEnterDepartrureStations";
    }

    if (!IsValidID(Data.ArrivalStation))
    {
        return "ErrEnterArrivleStations";
    }

    if (Data.DepartureStation == Data.ArrivalStation)
    {
        return "ErrSameStationsSelected";
    }

    if (!IsValidDate(Data.DepartureDate))
    {
        return "ErrEnterDepartureDate";
    }
    if (!IsValidDate(Data.ReturnDate))
    {
        return "ErrEnterReturnDate";
    }

    if (Data.Passengers.AdultsCount <= 0 && Data.Passengers.ChildrenCount <= 0)
    {
        return "ErrMinNumberOfAdult";
    }

    return ValidationSucessVal;
}

function ValidateTripsSummaryPost(tripsSummaryReq)
{
    var objectData = JSON.parse(tripsSummaryReq);

    var validationResult = "";
    $$.each(objectData.Passengers, function (index, value)
    {
        if (value.isCompleted == false && validationResult.length == 0)
        {
            validationResult = ("ErrorPassData_" + value.Name);
            return false;
        }
    });
    if (validationResult.length > 0)
    {
        return validationResult;
    }

    objectData.Mobile = parseArabic(objectData.Mobile).toString();
    if (!IsValidPhoneNumber(objectData.Mobile) || objectData.Mobile.length > 14 || objectData.Mobile.length <8)
    {
        return "WrongPhoneNumber";
    }

    if (!IsValidEmailAddress(objectData.Email))
    {
        return "WrongEmailAddress";
    }

    return ValidationSucessVal;
}

function ValidatePassengers(passengerData)
{

    if (!IsValidString(passengerData.Name) || passengerData.Name <= 0)
    {
        return "Errnamemustbefilled";

    }
    if (!IsValidString(passengerData.IDType) || passengerData.IDType == "NA")
    {
        return "ErrIDType";
    }

    passengerData.IDNumber = parseArabic(passengerData.IDNumber).toString();
    if (!ValidateNationalID(passengerData.IDNumber) && (passengerData.IDType == "NationalID"))
    {
        return "ErrNationalID";
    }
    if (!IsValidString(passengerData.IDNumber) || ((passengerData.IDNumber.length == 0) || (passengerData.IDNumber == "0") || (passengerData.IDNumber.length == null) || (passengerData.IDNumber == "null")))
    {
        return "ErrNationalID";
    }


    if (!ValidateIqamaID(passengerData.IDNumber) && (passengerData.IDType == "IqamaID"))
    {
        return "ErrIqamaID";
    }

    if (!IsValidGcc(passengerData.IDNumber) && (passengerData.IDType == "GCC"))
    {


        return "ErrGCC";
    }

    passengerData.IDVersion = parseArabic(passengerData.IDVersion).toString();
    if (!IsValidString(passengerData.IDNumber) || ((passengerData.IDNumber.length == 0) || (passengerData.IDNumber == "0") || (passengerData.IDNumber.length == null) || (passengerData.IDNumber == "null")))
    {
        return "ErrVersionnum";
    }


    if (!IsValidID(passengerData.NationalityID) || !IsValidString(passengerData.NationalityID))
    {
        return "ErrNationalityIDtypemustbefilled";
    }

    if (!IsValidString(passengerData.Gender) || passengerData.Gender == "NA")
    {
        return "ErrGender";
    }

    if (!IsValidDate(passengerData.DateOfBirth))
    {
        return "ErrBirthdate";
    }

    var dob = passengerData.DateOfBirth;
    var age = get_age(dob);
    switch (passengerData.Type)
    {
        case "Adult":
            if (age < 12)
                return "ErrAdultAge";
            break;
        case "Child":
            if (age >= 12 || age < 2)
                return "ErrAChildAge";
            break;
        case "Infant":
            if (age >= 2)
                return "ErrInfantAge";
            break;
    }




    return ValidationSucessVal;
}



function validateFeedback(feedbackObj)
{

    if (!IsValidString(feedbackObj.Issue))
    {
        return "ErrCommentValue";
    }
    if (!IsValidString(feedbackObj.PassengerName))
    {
        return "ErrNameValue";
    }

    feedbackObj.MobileNumber = parseArabic(feedbackObj.MobileNumber).toString();
    var mobNumber = feedbackObj.MobileNumber.replace(" ", "");
    if (!IsValidPhoneNumber(mobNumber))
    {
        return "WrongPhoneNumber";
    }
    if (!IsValidID(feedbackObj.RatingValue) || feedbackObj.RatingValue == 0)
    {
        return "ErrRatingValue";
    }

    return ValidationSucessVal;
}

// validations Helpers :

function IsValidString(stringValue)
{
    if (stringValue == undefined || stringValue == null || stringValue.trim() == "")
    {
        return false;
    }
    return true;
}

function IsValidNumber(intValue)
{
    if (intValue == undefined || isNaN(intValue))
    {
        return false;
    }
    return true;
}

function IsValidID(idValue)
{
    if (!IsValidNumber(idValue) || idValue < 0)
    {
        return false;
    }
    return true;
}

function IsValidDate(dateVal)
{
    return dateVal == 'dd/mm/yyyy' || (/\d{2}(\.|-)\d{2}(\.|-)\d{4}/.test(dateVal));
}

function IsValidPhoneNumber(phoneNumber)
{
    return ((/^\d{8,14}$/.test(phoneNumber)) && phoneNumber.indexOf("00") !== 0);
}

function IsValidGcc(gccnumber)
{
    return ((/^\d(\d{8,10})$/.test(gccnumber)));
}

function Validate2Dates(date1, date2)
{
    if (!IsValidDate(date1) || !IsValidDate(date2))
    {
        return false;
    }
    if (date2 < date1)
    {
        return false;
    }
    return true;
}

function IsValidEmailAddress(emailAddres)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(emailAddres);
}

function ValidateNationalID(sender)
{
    if (sender.length == 0)
        return false;
    var strID = sender;
    var digits = '';
    var counter = 0;

    while (counter < 9)
    {
        if ((counter + 1) % 2 == 0)
        {
            digits = digits + strID.substring(counter, counter + 1);
        }
        else
        {
            digits = digits + (strID.substring(counter, counter + 1) * 2).toString();
            // IMPORTANT! increment the index so
        }
        counter++;
    }
    var intSum = 0;
    var intSumTemp = 0;

    var strSum;
    var intOddSumDigit;
    var CheckDigit;
    counter = 0;
    while (counter < digits.length)
    {
        intSumTemp = digits.charAt(counter) * 1;
        intSum += intSumTemp;
        counter++;
    }
    strSum = intSum.toString();

    if (strSum.length == 1)
        intOddSumDigit = intSum;
    else
        intOddSumDigit = strSum.substring(strSum.length, strSum.length - 1);

    if (intOddSumDigit == 0)
        CheckDigit = 0;
    else
        CheckDigit = (10 - intOddSumDigit).toString();

    var PublicID = sender;
    PublicID = PublicID.toString();

    if (CheckDigit == PublicID.substring(PublicID.length - 1, PublicID.length) && strID.length == 10 && strID.substring(0, 1) == '1')
    {
        return true;
    }
    else
    {
        return false;
    }
}

function ValidateIqamaID(sender)
{
    if (sender.length == 0)
        return false;
    var Residence = sender;// .value;
    var strID = sender;// .value;
    var digits = '';
    var counter = 0;

    while (counter < 9)
    {
        if ((counter + 1) % 2 == 0)
        {
            digits = digits + strID.substring(counter, counter + 1);
        }
        else
        {
            digits = digits + (strID.substring(counter, counter + 1) * 2).toString();
            // IMPORTANT! increment the index so
        }
        counter++;
    }
    var intSum = 0;
    var intSumTemp = 0;
    var strSum;
    var intOddSumDigit;
    var CheckDigit;
    counter = 0;
    while (counter < digits.length)
    {
        intSumTemp = digits.charAt(counter) * 1;
        intSum += intSumTemp;
        counter++;
    }
    strSum = intSum.toString();
    if (strSum.length == 1)
        intOddSumDigit = intSum;
    else
        intOddSumDigit = strSum.substring(strSum.length, strSum.length - 1);

    if (intOddSumDigit == 0)
        CheckDigit = 0;
    else
        CheckDigit = (10 - intOddSumDigit).toString();

    var PublicID = sender;// .value;
    PublicID = PublicID.toString();

    if (CheckDigit == PublicID.substring(PublicID.length - 1, PublicID.length) && strID.length == 10 && strID.substring(0, 1) == '2')
    {
        return true;
    }
    else
    {
        return false;
    }
}



function get_age(dob)
{
    var birthdate = dob.split("-");
    var born = new Date(birthdate[2], birthdate[1] - 1, birthdate[0]);
    var now = new Date();
    var birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
    if (now >= birthday)
        return now.getFullYear() - born.getFullYear();
    else
        return now.getFullYear() - born.getFullYear() - 1;
}



