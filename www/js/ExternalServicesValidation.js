/* 
 */
var ValidationSucessVal = "Success";
/************************Limo Code Validation **********************/

// validate corporate information
function ValidateLimoCorpReservation(Data)
{

    var regex = /[0-9]|\./;

   
    if (!IsValidString(Data.ContractNo) || ((Data.ContractNo.length == 0) ||  (Data.ContractNo.length == null) || (Data.ContractNo == "null") ))
    {
        return "ErrContractnum";
    }


    if (!IsValidString(Data.CompanyName))
    {
        return "ErrCompanyName";

    }

    if (!IsValidString(Data.CustomerName))
    {
        return "Errnamemustbefilled";

    }

    Data.CustomerMobileNo = parseArabic(Data.CustomerMobileNo).toString();
    if (!IsValidPhoneNumber(Data.CustomerMobileNo) || Data.CustomerMobileNo.length > 14 || Data.CustomerMobileNo.length < 8)
    {
        return "WrongPhoneNumber";
    }

    if (!IsValidEmailAddress(Data.CustomerEmail))
    {
        return "ErrEnterEmailAuth";
    }


    return ValidationSucessVal;
}


function ValidateLimoIdividual(Data)
{
    if (!IsValidString(Data.CustomerName))
    {
        return "Errnamemustbefilled";

    }

    if (!IsValidString(Data.IdNo) || ((Data.IdNo.length == 0) || (Data.IdNo == "0") || (Data.IdNo.length == null) || (Data.IdNo == "null")))
    {
        return "ErrNationalID";
    }

    Data.CustomerMobileNo = parseArabic(Data.CustomerMobileNo).toString();
    if (!IsValidPhoneNumber(Data.CustomerMobileNo) || Data.CustomerMobileNo.length > 14 || Data.CustomerMobileNo.length < 8)
    {
        return "WrongPhoneNumber";
    }

    if (!IsValidEmailAddress(Data.CustomerEmail))
    {
        return "ErrEnterEmail";
    }

    return ValidationSucessVal;
}


function ValidateLimoReservationData(Data)
{


    if (!IsValidNumber(Data.ServiceType) || Data.ServiceType <= 0 || (Data.ServiceType == "null"))
    {
        return "errServiceType";
    }


    if (!IsValidNumber(Data.ServiceDuration) || Data.ServiceDuration <= 0 || (Data.ServiceDuration == "null"))
    {
        return "errServiceDuration";
    }


    if (!IsValidNumber(Data.CarType) || Data.CarType <= 0 || (Data.CarType == "null"))
    {
        return "errCartype";
    }
    if (!IsValidString(Data.RequestDate) || Data.RequestDate == "NA")
    {
        return "ErrRequestDateTime";
    }


    if (!IsValidString(Data.RequestDateTime))
    {
        return "Errtriptime";
    }

    if (!IsValidNumber(Data.City) || Data.City <= 0 || (Data.City == "null"))
    {
        return "errCityName";
    }
    if (!IsValidNumber(Data.PaymentType) || Data.PaymentType <= 0 || (Data.PaymentType == "null"))
    {
        return "errPayMethod";
    }


    return ValidationSucessVal;
}

function ValidateLimoReservationDataLocation(Data)
{

    if (!IsValidString(Data.DirectionFrom))
    {
        return "ErrDepartFrom";
    }

    if (!IsValidString(Data.DirectionTo))
    {
        return "ErrDepartto";
    }

    /*  if (!IsValidString(Data.DirectionLocation))
      {
          return "ErrPickup_Location";
      }*/

    return ValidationSucessVal;
}

/********************End of Limo Code Validation **********************/


/***************************CNC Validations ******************************/
function ValidatePersonal(Personal_Form)
{
    if (!IsValidString(Personal_Form.CustomerName) || Personal_Form.CustomerName <= 0)
    {
        // return "Errnamemustbefilled";
        return "ErrEnterCustomerName";
    }

    Personal_Form.CustomerMobileNo = parseArabic(Personal_Form.CustomerMobileNo).toString();
    if (!IsValidPhoneNumber(Personal_Form.CustomerMobileNo) || Personal_Form.CustomerMobileNo.length > 14 || Personal_Form.CustomerMobileNo.length < 8)
    {
        return "WrongCustomerMobileNo";
    }

    if (!IsValidEmailAddress(Personal_Form.CustomerEmail))
    {
        return "ErrEnterCustomerEmail";
    }


    return ValidationSucessVal;
}

function ValidateCompany(Company_Form)
{
    if (!IsValidString(Company_Form.CompanyName) || Company_Form.CompanyName <= 0)
    {
        return "ErrEnterCompanyName";
    }

    Company_Form.CompanyPhone = parseArabic(Company_Form.CompanyPhone).toString();
    if (!IsValidPhoneNumber(Company_Form.CompanyPhone) || Company_Form.CompanyPhone.length > 14 || Company_Form.CompanyPhone.length < 8)
    {
        return "WrongCompanyPhoneNumber";
    }

    //Company_Form.CompanyFaxNo = parseArabic(Company_Form.CompanyFaxNo).toString();
    //if (!IsValidPhoneNumber(Company_Form.CompanyFaxNo) || Company_Form.CompanyFaxNo.length > 14 || Company_Form.CompanyFaxNo.length < 8)
    //{
    //    return "ErrEnterCompanyFaxNo";
    //}

    if (!IsValidString(Company_Form.CustomerName))
    {
        return "Errnamemustbefilled";

    }



    Company_Form.CustomerMobileNo = parseArabic(Company_Form.CustomerMobileNo).toString();
    if (!IsValidPhoneNumber(Company_Form.CustomerMobileNo) || Company_Form.CustomerMobileNo.length > 14 || Company_Form.CustomerMobileNo.length < 8)
    {
        return "WrongPhoneNumber";
    }

    if (!IsValidEmailAddress(Company_Form.CustomerEmail))
    {
        return "ErrEnterEmailAuth";
    }



    return ValidationSucessVal;
}


function ValidatDetails(Details_Form)
{
    if (!IsValidString(Details_Form.BusType) || Details_Form.BusType == "NA")
    {
        return "ErrBusType";
    }

Details_Form.BusCount = parseArabic(Details_Form.BusCount).toString();
    if (!IsValidNumber(Details_Form.BusCount) || Details_Form.BusCount <= 0 || Details_Form.BusCount > 100 || (Details_Form.BusCount == "null"))
    {
        return "ErrBusCount";
    }


    if (!IsValidString(Details_Form.SalesOffice) || Details_Form.SalesOffice == "NA")
    {
        return "ErrSalesOffice";
    }


    if (!IsValidString(Details_Form.RequestDate) || Details_Form.RequestDate == "NA")
    {
        return "ErrRequestDateTime";
    }

    if (!IsValidString(Details_Form.RequestDateTime) || Details_Form.RequestDateTime == "NA")
    {
        return "Errtriptime";
    }

    return ValidationSucessVal;

}

function ValidateCandCLocationInfo(Details_Form)
{

    if (!IsValidString(Details_Form.DirectionFrom) || Details_Form.DirectionFrom <= 0)
    {
        return "ErrDirectionFrom";
    }

    if (!IsValidString(Details_Form.DirectionTo) || Details_Form.DirectionTo <= 0)
    {
        return "ErrDirectionTo";
    }


    return ValidationSucessVal;
}
/************************End of CNC validations **************************/
/*********************************cargo valdition**********************************/
function validateCargoData(Data)
{

    if (!IsValidNumber(Data.FromCity) || Data.FromCity <= 0 || (Data.FromCity == "null"))
    {
        return "ErrEnterCarryLoadLoc";
    }

    if (!IsValidNumber(Data.ToCity) || Data.ToCity <= 0 || (Data.ToCity == "null"))
    {
        return "ErrEnterDelveryLoc";
    }
    if (!IsValidNumber(Data.Direction) || Data.Direction <= 0 || (Data.Direction == "null"))
    {
        return "ErrEnterDirection";
    }

    if (!IsValidNumber(Data.ServiceType) || Data.ServiceType <= 0 || (Data.ServiceType == "null"))
    {
        return "ErrServiceType";
    }
    if (!IsValidNumber(Data.TruckType) || Data.TruckType <= 0 || (Data.TruckType == "null"))
    {
        return "ErrEnterTruckType";
    }
    if (!IsValidString(Data.RequestDate) || Data.RequestDate == "NA")
    {
        return "ErrRequestDateTime";
    }

Data.TruckNo = parseArabic(Data.TruckNo).toString();
    if (!IsValidNumber(Data.TruckNo) || Data.TruckNo <= 0 || Data.TruckNo > 1000 || (Data.TruckNo == "null"))
    {
        return "ErrEnterTruckNumber";
    }

    if (!IsValidString(Data.ItemType))
    {
        return "ErrEnterCargoType";
    }

    return ValidationSucessVal;

}
function ValidateCargoReservationDataLocation(Data)
{
    if (!IsValidString(Data.LoadLocationInfo))
    {
        return "ErrEnterPickupLocation";
    }

    if (!IsValidString(Data.UnLoadLocationInfo))
    {
        return "ErrEnterDeliveryLocation";
    }
    if (!IsValidString(Data.ServiceLocation) || Data.ServiceLocation <= 0)
    {
        return "ErrServiceLocation";
    }
    return ValidationSucessVal;

}
function validateCargoRequest(Data)
{
    if (!IsValidString(Data.CustomerName))
    {
        return "Errnamemustbefilled";
    }

    Data.CustomerMobileNo = parseArabic(Data.CustomerMobileNo).toString();
    if (!IsValidPhoneNumber(Data.CustomerMobileNo) || Data.CustomerMobileNo.length > 14 || Data.CustomerMobileNo.length < 8)
    {
        return "WrongPhoneNumber";
    }

    if (!IsValidEmailAddress(Data.CustomerEmail))
    {
        return "WrongEmailAddress";
    }



    return ValidationSucessVal;
}
/*******************End of Cargo Validations *************************/
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
function IsValidNumberOnly(Number)
{
    return ((/[^\d+]/.test(Number)) && Number.indexOf("00") !== 0);
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