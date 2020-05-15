/***************************** Limo Code **************************/

myApp.onPageInit('LimoReservationtypes', function (page)
{
    var pre = GetLocalDataObject("storedprofile");

    if (pre != null)
    {
        //alert(JSON.stringify(pre));

        var ZipCod = pre.MobileNumber.substr(0, 3);

        var MobileNumber8D = pre.MobileNumber.substring(3);
        pre.MobileNumber = MobileNumber8D;

        //alert(JSON.stringify(formData));

        myApp.formFromJSON('#Fill_Up_Form', pre);

        document.getElementById("txtCountryCode").value = ZipCod;

        myApp.formFromJSON('#Fill_Up_Form_Authoraized', pre);
        // myApp.formFromJSON('#other-form', pre);
    }
    else
    { }
    // UI helpers for select items
    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })
    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
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

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
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
    $$("#txtCountryCode_cus").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('.countriesSelectAr_cus');
        }
        else
        {
            myApp.smartSelectOpen('.countriesSelect_cus');
        }
    });
    $$("#SmartSelectValuepickEn_cus").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_cus").val($$("#countriesSelect_cus").val());
    });

    $$("#SmartSelectValuepick_cus").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_cus").val($$("#countriesSelectAr_cus").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
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
    else
    {
        $$("#countriesSelectAr_cus").val("966");
        $$("#countriesSelect_cus").val("966");
        $$("#txtCountryCode_cus").val("966");
    }

    $$("#txtCountryCode_Ne").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('.countriesAr_ne');
        }
        else
        {
            myApp.smartSelectOpen('.countriesEn_ne');
        }
    });
    $$("#SmartSelectValuepickEn_Ne").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_Ne").val($$("#countriesSelect_Ne").val());
    });

    $$("#SmartSelectValuepick_Ne").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_Ne").val($$("#countriesSelectAr_Ne").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
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
    else
    {
        $$("#countriesSelectAr_Ne").val("966");
        $$("#countriesSelect_Ne").val("966");
        $$("#txtCountryCode_Ne").val("966");
    }
    //set views based on tab selected
    $$('#btnCompanies').on('click', setcompaniesView);
    function setcompaniesView()
    {

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
    function setbtncustomerView()
    {

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
    function GetLimoRequestTypes()
    {
        var LimoRequestTypes = GetLocalDataObject("LimoRequestTypes" + GetServiceLanguage());
        if (LimoRequestTypes == null)
        {
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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var LimoRequestTypes = JSON.parse(data);

                    SaveLocalObject("LimoRequestTypes" + GetServiceLanguage(), LimoRequestTypes);
                    document.getElementById('btnCompanies').innerHTML = LimoRequestTypes[1].LocalizedName;
                    document.getElementById('btnPersone').innerHTML = LimoRequestTypes[0].LocalizedName;

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            document.getElementById('btnCompanies').innerHTML = LimoRequestTypes[1].LocalizedName;
            document.getElementById('btnPersone').innerHTML = LimoRequestTypes[0].LocalizedName;
        }

    }

    // smart Select ///// 
    GetLimoCorpContractType();
    function GetLimoCorpContractType()
    {
        var LimoCorpContractType = GetLocalDataObject("LimoCorpContractType" + GetServiceLanguage());
        if (LimoCorpContractType == null)
        {
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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var LimoCorpContractType = JSON.parse(data);

                    SaveLocalObject("LimoCorpContractType" + GetServiceLanguage(), LimoCorpContractType);

                    var options = '';

                    for (var x = 0; x < LimoCorpContractType.length; x++)
                    {
                        options += '<option value="' + LimoCorpContractType[x].Id + '">' + LimoCorpContractType[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.Contract_Type', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < LimoCorpContractType.length; x++)
            {
                options += '<option value="' + LimoCorpContractType[x].Id + '">' + LimoCorpContractType[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.Contract_Type', options);
        }
    }

    $$("#btnSaveLimoPassenger").on("click", function ()
    {

        var LimoReservationInfo = GetLocalDataObject("LimoReservationInfo");

        var LimoReservationMapInfo = GetLocalDataObject("LimoReservationMapInfo");
        var Marker_from = localStorage.getItem("txtPickUpLocation");
        var Marker_To = localStorage.getItem("txtDistLocation");

        var Data =
        {
            RequestType: 66,
            CustomerName: $$("#CustomerName").val(),
            Customer_ID: $$("#Customer_ID").val(),
            CusPhoneNUmber: $$("#txtCountryCode_Ne").val() + $$("#CusPhoneNUmber").val(),
            CusEmailAddress: $$("#CusEmailAddress").val(),
            selectGender: $$("#selectGender").val(),
            Customer_Location: $$("#Customer_Location").val(),
            ContractType: "0",
            ServiceType: LimoReservationInfo.ServiceType,
            ServiceDuration: LimoReservationInfo.ServiceDuration,
            CarType: LimoReservationInfo.CarType,
            RequestDate: LimoReservationInfo.RequestDate,
            RequestDateTime: LimoReservationInfo.RequestDateTime,
            City: LimoReservationInfo.City,
            DirectionFrom: LimoReservationMapInfo.DirectionFrom,
            DirectionTo: LimoReservationMapInfo.DirectionTo,
            DirectionLocation: LimoReservationMapInfo.DirectionLocation,
            PaymentType: LimoReservationInfo.PaymentType,
            ChannelCode: LimoReservationInfo.ChannelCode,
            FromCordination: Marker_from.replact("(","").replace(")",""),
            ToCordination: Marker_To.replact("(","").replace(")","")
        }

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoIdividual(Data);
        if (validationResult == ValidationSucessVal)
        {
            SaveLocalObject("LimoPassengerInfo", Data);
            postlimo(Data);
            //mainView.router.load({ url: 'LimoReservationData.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }

    });

    $$('#btnSaveLimoCorp').on('click', function ()
    {
        var LimoReservationInfo = GetLocalDataObject("LimoReservationInfo");

        var LimoReservationMapInfo = GetLocalDataObject("LimoReservationMapInfo");
        var Marker_from = localStorage.getItem("txtPickUpLocation");
        var Marker_To = localStorage.getItem("txtDistLocation");


        var Data =
        {
            RequestType: 67,
            contract_Type: $$("#contract_select").val(),
            Contract_Number: $$("#Contract_Number").val(),
            Company_Name: $$("#Company_Name").val(),
            Commercial_Record: $$("#Commercial_Record").val(),
            FaxNumber: $$("#txtCountryCode").val() + $$("#FaxNumber").val(),
            AuthorizedName: $$("#AuthorizedName").val(),
            PhoneNUmber: $$("#txtCountryCode_cus").val() + $$("#PhoneNUmber").val(),
            EmailAddress: $$("#EmailAddress").val(),
            ServiceType: LimoReservationInfo.ServiceType,
            ServiceDuration: LimoReservationInfo.ServiceDuration,
            CarType: LimoReservationInfo.CarType,
            RequestDate: LimoReservationInfo.RequestDate,
            RequestDateTime: LimoReservationInfo.RequestDateTime,
            City: LimoReservationInfo.City,
            DirectionFrom: LimoReservationMapInfo.DirectionFrom,
            DirectionTo: LimoReservationMapInfo.DirectionTo,
            DirectionLocation: LimoReservationMapInfo.DirectionLocation,
            PaymentType: LimoReservationInfo.PaymentType,
            ChannelCode: LimoReservationInfo.ChannelCode,
            FromCordination: Marker_from.replact("(", "").replace(")", ""),
            ToCordination: Marker_To.replact("(", "").replace(")", "")
        };

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoCorpReservation(Data);
        if (validationResult == ValidationSucessVal)
        {
            SaveLocalObject("LimoPassengerInfo", Data);
            postlimo(Data);
            //mainView.router.load({ url: 'LimoReservationData.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });


    function postlimo(Data)
    {
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

            success: function (data, status, xhr)
            {
                myApp.hidePreloader();
                mainView.router.load({ url: 'LimoSucess.html' });
            },
            error: function (xhr, status)
            {
                myApp.hidePreloader();
                myApp.alert(GetResourceText("GenericError"), GetResourceText('alert'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
    }



});

//********************** End of Limo resvation Types *******************************//

//************************************************************//

myApp.onPageInit('LimoReservationData', function (page)
{
    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
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
        onOpen: function (p)
        {
            calendarDateFormatDepart.params.maxDate = _maxdate;
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
        value: [
            (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()), "00"],

        //         onChange: function (picker, values, displayValues) {
        //             
        //             
        //        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
        //        if (values[1] > daysInMonth) {
        //            picker.cols[1].setValue(daysInMonth);
        //        }
        //    },

        formatValue: function (p, values, displayValues)
        {
            return values[0] + ':' + values[1] + ':00';
            //yyyy-MM-ddTHH:mm:ss
        },

        cols: [
//            
            // Hours
            {
                values: (function ()
                {
                    var arr = [];
                    for (var i = 8; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
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
                values: (function ()
                {
                    var arr = ('00 05 10 15 20 25 30 35 40 45 50 55').split(' ');

                    return arr;
                })(),
            }
        ]
    });

    GetServiceTypes();
    function GetServiceTypes()
    {
        var LimoServiceTypes = GetLocalDataObject("LimoServiceTypes" + GetServiceLanguage());
        if (LimoServiceTypes == null)
        {
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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var LimoServiceTypes = JSON.parse(data);
                    SaveLocalObject("LimoServiceTypes" + GetServiceLanguage(), LimoServiceTypes);

                    var options = '';

                    for (var x = 0; x < LimoServiceTypes.length; x++)
                    {
                        options += '<option value="' + LimoServiceTypes[x].Id + '">' + LimoServiceTypes[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.servicetype', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < LimoServiceTypes.length; x++)
            {
                options += '<option value="' + LimoServiceTypes[x].Id + '">' + LimoServiceTypes[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.servicetype', options);
        }
    }

    GetServiceDuration();
    function GetServiceDuration()
    {
        var LimoServiceDuration = GetLocalDataObject("LimoServiceDuration" + GetServiceLanguage());
        if (LimoServiceDuration == null)
        {
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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var LimoServiceDuration = JSON.parse(data);
                    SaveLocalObject("LimoServiceDuration" + GetServiceLanguage(), LimoServiceDuration);

                    var options = '';

                    for (var x = 0; x < LimoServiceDuration.length; x++)
                    {
                        options += '<option value="' + LimoServiceDuration[x].Id + '">' + LimoServiceDuration[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.ServiceDuration', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            for (var x = 0; x < LimoServiceDuration.length; x++)
            {
                options += '<option value="' + LimoServiceDuration[x].Id + '">' + LimoServiceDuration[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.ServiceDuration', options);
        }
    }

    GetCarTypes();
    function GetCarTypes()
    {
        var LimoCarsTypes = GetLocalDataObject("LimoCarsTypes" + GetServiceLanguage());
        if (LimoCarsTypes == null)
        {
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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var LimoCarsTypes = JSON.parse(data);
                    SaveLocalObject("LimoCarsTypes" + GetServiceLanguage(), LimoCarsTypes);

                    var options = '';

                    for (var x = 0; x < LimoCarsTypes.length; x++)
                    {
                        options += '<option value="' + LimoCarsTypes[x].Id + '">' + LimoCarsTypes[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.cars', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < LimoCarsTypes.length; x++)
            {
                options += '<option value="' + LimoCarsTypes[x].Id + '">' + LimoCarsTypes[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.cars', options);
        }

    }

    GetCities();
    function GetCities()
    {
        var limoCities = GetLocalDataObject("limoCities" + GetServiceLanguage());
        if (limoCities == null)
        {

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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var limoCities = JSON.parse(data);
                    SaveLocalObject("limoCities" + GetServiceLanguage(), limoCities);

                    var options = '';

                    for (var x = 0; x < limoCities.length; x++)
                    {
                        options += '<option value="' + limoCities[x].Id + '">' + limoCities[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.city', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < limoCities.length; x++)
            {
                options += '<option value="' + limoCities[x].Id + '">' + limoCities[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.city', options);
        }
    }

    GetPaymentTypes();
    function GetPaymentTypes()
    {
        var LimoPaymentOptions = GetLocalDataObject("LimoPaymentOptions" + GetServiceLanguage());
        if (LimoPaymentOptions == null)
        {

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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var LimoPaymentOptions = JSON.parse(data);
                    SaveLocalObject("LimoPaymentOptions" + GetServiceLanguage(), LimoPaymentOptions)

                    var options = '';

                    for (var x = 0; x < LimoPaymentOptions.length; x++)
                    {
                        options += '<option value="' + LimoPaymentOptions[x].Id + '">' + LimoPaymentOptions[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.payment', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < LimoPaymentOptions.length; x++)
            {
                options += '<option value="' + LimoPaymentOptions[x].Id + '">' + LimoPaymentOptions[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.payment', options);
        }
    }

    $$("#btnSaveData").on('click', function ()
    {
        //
        //        var LimoPassengerInfo = GetLocalDataObject("LimoPassengerInfo");

        var requestBody =
        {
            //            RequestType: LimoPassengerInfo.RequestType,
            //            CustomerName: "Na",
            //            CustomerMobileNo: "NA",
            //            CustomerEmail: "NA",
            //            IdNo: "NA",
            //            Gender: "M",
            //            ContractType: "0",
            //            ContractNo: "NA",
            //            CompanyName: "NA",
            //            FaxNo: "NA",
            ServiceType: $$("#serv_type").val(),
            ServiceDuration: $$("#serv_time").val(),
            CarType: $$("#car_type").val(),
            RequestDate: $$('#calendar-date-depart').val(),
            RequestDateTime: ($$("#calendar-date-depart").val() + "T" + $$('.RequestDateTime').val()),
            City: $$("#cities").val(),
            //            DirectionFrom: $$("#DepartFrom").val(),
            //            DirectionTo: $$("#Departto").val(),
            //            DirectionLocation: $$("#Pickup_Location").val(),
            PaymentType: $$("#pay_method").val(),
            ChannelCode: "005"

        }

        //        if (LimoPassengerInfo.RequestType == 66)
        //        {
        //            requestBody.CustomerName = LimoPassengerInfo.CustomerName;
        //            requestBody.IdNo = LimoPassengerInfo.Customer_ID;
        //            requestBody.CustomerMobileNo = LimoPassengerInfo.CusPhoneNUmber;
        //            requestBody.CustomerEmail = LimoPassengerInfo.CusEmailAddress;
        //            requestBody.Gender = LimoPassengerInfo.selectGender;
        //            //Customer_Location: $$("#Customer_Location").val();
        //        }
        //        else
        //        {
        //            requestBody.ContractType = LimoPassengerInfo.contract_Type;
        //            requestBody.ContractNo = LimoPassengerInfo.Contract_Number;
        //            requestBody.CompanyName = LimoPassengerInfo.Company_Name;
        //            requestBody.IdNo = LimoPassengerInfo.Commercial_Record;
        //            requestBody.FaxNo = LimoPassengerInfo.FaxNumber;
        //            requestBody.CustomerName = LimoPassengerInfo.AuthorizedName;
        //            requestBody.CustomerMobileNo = LimoPassengerInfo.PhoneNUmber;
        //            requestBody.CustomerEmail = LimoPassengerInfo.EmailAddress;
        //        }


        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoReservationData(requestBody)

        if (ValidationSucessVal == validationResult)
        {

            SaveLocalObject("LimoReservationInfo", requestBody);
            mainView.router.load({ url: 'LimoReservationDataLocations.html' });
            //postlimo(requestBody);
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    })



});

myApp.onPageInit('LimoSucces', function (page)
{
    $$("#gohome").click(function ()
    {
        mainView.router.load({ url: 'Home.html' });
    });
});

//*************************End of Limo Resevation Data ***************************//

//********************Start of Limo Resevation Data Locations  ***********************//

myApp.onPageInit('LimoReservationDataLocations', function (page)
{
    var reqServiceType = "limo";
    $$('input[type="checkbox"]').prop('checked', false);

    $$("#DepartFrom_icon").on("click", function ()
    {
        localStorage.setItem("updatelocationfield", "From");
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#Departto_icon").on("click", function ()
    {
        localStorage.setItem("updatelocationfield", "To");
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#btnSaveDataLocations").on('click', function ()
    {
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
        r_Location: $$("#Customer_Location").val();

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoReservationDataLocation(requestBodyLocations)

        if (ValidationSucessVal == validationResult)
        {
            SaveLocalObject("CargoReservationMapInfo", requestBodyLocations);
            mainView.router.load({ url: 'LimoReservationtypes.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    })
});


myApp.onPageAfterAnimation('LimoReservationDataLocations', function (page)
{
    var reqServiceType = "limo";
    localStorage.setItem("reqServiceType", reqServiceType);

    var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
    var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
    var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
    var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);
    //    myApp.alert(JSON.stringify(Marker_from) + "name of " + location_From);
    //    myApp.alert(JSON.stringify(Marker_To) + "name of " + location_To);

    if (location_To != null)
    {
        // $$("#DepartFrom").val()
        document.getElementById("Departto").value = location_To;
        var mapProp2 = {
            center: getLatLngFromString(Marker_To),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);
    }

    if (location_From != null)
    {
        // $$("#DepartFrom").val()
        document.getElementById("DepartFrom").value = location_From;
        //google.maps.event.addDomListener(window, 'load', initialize);
        window.onload = loadScript;

        var mapProp = {
            center: getLatLngFromString(Marker_from),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        drawMarkers();

    }
    var depart_field = $$("#DepartFrom").val();

    copyLocationToTo();

    $$("#lblCheckBoxSameLoc").on("change", function ()
    {
        copyLocationToTo();
    });

    function copyLocationToTo()
    {
        var isChecked = $$('#same_locations').prop('checked');

        if (isChecked)
        {
            if (depart_field !== null)
            {
                document.getElementById("Departto").value = depart_field;

                var mapProp2 = {
                    center: getLatLngFromString(Marker_from),
                    zoom: 13,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);

                var marker2 = new google.maps.Marker({
                    position: getLatLngFromString(Marker_from),
                    map: map2
                });
                markers.push(marker2);
            }
        }
    }

    function drawMarkers()
    {

        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        markers = [];


        // myApp.alert("Marker is"+JSON.stringify(Marker_from));
        if (Marker_from != null)
        {
            var marker = new google.maps.Marker({
                position: getLatLngFromString(Marker_from),
                map: map
            });
            markers.push(marker);
        }

        var txtPickUpLocation = localStorage.getItem("txtPickUpLocation");
        if (Marker_To != null)
        {
            var marker2 = new google.maps.Marker({
                position: getLatLngFromString(Marker_To),
                map: map2
            });
            markers.push(marker2);
        }
    }
});

/*************************************************/

//********************End of Limo Resevation Data Locations  ***********************//


//************************************************************//



myApp.onPageInit('LimoStartReservation', function (page)
{

    $$("#Current_location_btn").on("click", function ()
    {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);

        var latVal = Latitude;
        var lngVal = Longitude;

        localStorage.setItem("currentLat", latVal);
        localStorage.setItem("currentLng", lngVal);

        var latlng = { lat: latVal, lng: lngVal };

        geocoder.geocode({ 'location': latlng }, function (results, status)
        {
            if (status === google.maps.GeocoderStatus.OK)
            {
                if (results[0])
                {
                    $$("#lblcurrentLocation").text(results[0].formatted_address);
                    localStorage.setItem("current_Address", results[0].formatted_address);
                    Current_location(latVal, lngVal);
                }
            }
        });



    });

    $$("#Continue").on("click", function ()
    {
        mainView.router.back({ url: '' });
    });

    var From_field = localStorage.getItem("updatelocationfield");
    var From_field_cargo = localStorage.getItem("updatelocationfield_Cargo");

    var top_map = $$("#googleMap3").offset().top;

    var elmnt = document.getElementById("googleMap3");
    var height_header = $$("#current_field").css("height");

    var heigh_header_ceil = Number(height_header.replace("px", ""));
    var height_map = $$("#googleMap3").css("height");
    var height_picker_H = $$("#position_off").css("height");
    var height_picker_W = $$("#position_off").css("width");
    var heigh_picker_ceil = Number(height_picker_H.replace("px", ""));
    var width_picker_ceil = Number(height_picker_W.replace("px", ""));
    var width_map = $$("#googleMap3").css("width");
    var half_map = Number(height_map.replace("px", "")) / 2;
    var half_map_w = Number(width_map.replace("px", "")) / 2;


    var center_map_y = half_map; //top_map + half_map - heigh_header_ceil - heigh_picker_ceil;
    var Y_ceil = Math.ceil(center_map_y) + (heigh_picker_ceil / 2);
    var X_ceil = Math.ceil(half_map_w) - (width_picker_ceil / 2);
    //myApp.alert(center_map_y);

    $$("#position_off").css("top", Y_ceil + "px");
    $$("#position_off").css("left", X_ceil + "px");
    // document.getElementById("position_off").style.top = Y_ceil;


    if (From_field == "From")
    {

        $$('.drop-style').css("display", "none");
        $$("#btnAddDest").css("display", "none");
        $$("#btnPickupLocation").hide();
        $$("#btnPickupLocation").show();

        //        
        //      $$("#googleMap3").offset().top
        //$$("#googleMap3").offset().left

        $$("#btnDitenationLocation").hide();
    }
    else

        if (From_field == "To")
        {
            $$('.drop-style').css("opacity", 1);
            $$('.drop-style').css("margin-top", -22);
            $$('.pickup-style').css("display", "none");
            $$("#btnAddDest").css("display", "none");
            $$("#btnPickupLocation").hide();
            $$("#btnDitenationLocation").show();
        }


    if (From_field_cargo == "From")
    {

        $$('.drop-style').css("display", "none");
        $$("#btnAddDest").css("display", "none");
        $$("#btnPickupLocation").hide();
        $$("#btnPickupLocation").show();

        //        
        //      $$("#googleMap3").offset().top
        //$$("#googleMap3").offset().left

        $$("#btnDitenationLocation").hide();
    }
    else

        if (From_field_cargo == "To")
        {
            $$('.drop-style').css("opacity", 1);
            $$('.drop-style').css("margin-top", -22);
            $$('.pickup-style').css("display", "none");
            $$("#btnAddDest").css("display", "none");
            $$("#btnPickupLocation").hide();
            $$("#btnDitenationLocation").show();
        }
    //GetStations();
    //    localStorage.setItem("txtPickUpLocation", null);
    //    localStorage.setItem("txtDistLocation", null);

    // get distance and duration information. 
    function getDistance(pickup)
    {

        // distance
        var bounds = new google.maps.LatLngBounds;
        var markersArray = [];
        var origin1 = getLatLngFromString(pickup);// { lat: Latitude, lng: Longitude };//pickup; 
        var destinationA = { lat: rndLat, lng: rndLng };
        var geocoder = new google.maps.Geocoder;
        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
            origins: [origin1],
            destinations: [destinationA],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status)
        {
            //response.originAddresses[0]

            if (status !== google.maps.DistanceMatrixStatus.OK || response.rows[0].elements[0].status == "ZERO_RESULTS")
            {
                //alert('Error was: ' + status);
                console.log("Cannot get location")
            }
            else
            {
                //rows[0].elements[1].distance.text
                if (response.rows[0].elements[0].status != "NOT_FOUND")
                {
                    $$("#lblDuration").html(response.rows[0].elements[0].duration.text);
                    localStorage.setItem("durationValue", response.rows[0].elements[0].duration.value);
                }
            }
        });
        // end of distance and time 
    }

    // select the item we want to get, distination location 
    $$("#distin").on("click", function ()
    {
        $$("#btnPickupLocation").hide();
        $$("#btnDitenationLocation").show();
    });

    // select the item we want to get, pickup location 
    $$("#pickup").on("click", function ()
    {
        $$("#btnPickupLocation").show();

        $$("#btnDitenationLocation").hide();
    });


    $$(".btnDone").on("click", function ()
    {

        var dest = $$("#pac-input2").val();
        var pick = $$("#pac-input").val();
        $$("#txtDistLocation").html(dest);
        $$("#txtPickUpLocation").html(pick);
    });


    $$('body').on('touchend', ".popup-about", function (e)
    {
        console.log('touchend');
        e.stopImmediatePropagation();
    });

    $$(".drop-style").css("opacity", 1);
    google.maps.event.addDomListener(window, 'load', initialize);

    //$$("#pac-input").on("click", function (){
    //	
    //	initAutocomplete();
    //});

    function initialize()
    {

        var mapProp3 = {
            center: new google.maps.LatLng(24.3851, 46.7414),
            zoom: 5,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("googleMap3"), mapProp3);

        var marker = new google.maps.Marker({
            position: {
                lat: Latitude,
                lng: Longitude
            },
            map: map
        });



        //initAutocomplete();
    }
    function Current_location()
    {


        var latVal = localStorage.getItem("currentLat");
        var lngVal = localStorage.getItem("currentLng");
        var mapProp3 = {
            center: new google.maps.LatLng(latVal, lngVal),
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("googleMap3"), mapProp3);

        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        markers = [];


        // myApp.alert("Marker is"+JSON.stringify(Marker_from));

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latVal, lngVal),
            map: map
        });
        markers.push(marker);


    }



    window.onload = loadScript;

    var mapProp3 = {
        center: new google.maps.LatLng(24.679272, 46.687449),//(51.508742, -0.120850),//
        zoom: 13,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;


    if ($$("#pickup").show == true)
    {
        localStorage.setItem("pickup", mapProp3);
    }
    else
    {
        localStorage.setItem("dist", mapProp3);
    }

    map = new google.maps.Map(document.getElementById("googleMap3"), mapProp3);
    //var image = 'https://www.saptco.com.sa/Images/Icons/carwithdriver-icon.aspx';
    var image = 'img/limoicon.png';



    DisplayCurrentLocationName();

    function geocodeLatLng(geocoder, map, infowindow)
    {
        var input = map.getCenter().toString();
        var latlngStr = input.split(',', 2);
        var latVal = parseFloat(latlngStr[0].replace('(', "").replace(')', ""));
        var lngVal = parseFloat(latlngStr[1].replace('(', "").replace(')', ""));

        var latlng = { lat: latVal, lng: lngVal };
        geocoder.geocode({ 'location': latlng }, function (results, status)
        {
            if (status === google.maps.GeocoderStatus.OK)
            {

                if (results[0])
                {
                    map.setZoom(16);
                    $$("#" + infowindow).html(results[0].formatted_address);
                    localStorage.setItem(infowindow.replace("txt", "txtValue"), results[0].formatted_address);
                    //infowindow.setContent(results[1].formatted_address);
                    //infowindow.open(map, marker);
                } else
                {
                    $$("#" + infowindow).html(map.getCenter());
                }
            } else
            {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
    function loadScript()
    {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.googleapis.com/maps/api/js?key=&libraries=places&sensor=false&callback=initialize";
        document.body.appendChild(script);
    }

    function DisplayCurrentLocationName()
    {

        var latVal = Latitude;
        var lngVal = Longitude;

        var latlng = { lat: latVal, lng: lngVal };
        geocoder.geocode({ 'location': latlng }, function (results, status)
        {
            if (status === google.maps.GeocoderStatus.OK)
            {
                if (results[0])
                {
                    $$("#lblcurrentLocation").text(results[0].formatted_address);;
                }
            }
        });
    }

    $$("#centerLocation").on("click", function ()
    {
        mapProp3.center = new google.maps.LatLng(Latitude, Longitude);
        map.setCenter(new google.maps.LatLng(Latitude, Longitude));
    });

    $$("#btnPickupLocation").on("click", function ()
    {
        geocodeLatLng(geocoder, map, "txtPickUpLocation");
        var pickup = map.getCenter().toString();
        localStorage.setItem("txtPickUpLocation", pickup);
        drawMarkers();
        getDistance(pickup);
    });

    $$("#btnDitenationLocation").on("click", function ()
    {
        geocodeLatLng(geocoder, map, "txtDistLocation");
        var dest = map.getCenter().toString();
        localStorage.setItem("txtDistLocation", dest);
        drawMarkers();
    });

    function drawMarkers()
    {
        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        markers = [];

        var txtDistLocation = localStorage.getItem("txtDistLocation");
        //myApp.alert("Next"+JSON.stringify(txtDistLocation));
        if (txtDistLocation != null)
        {
            var marker = new google.maps.Marker({
                position: getLatLngFromString(txtDistLocation),
                map: map
            });
            markers.push(marker);
        }

        var txtPickUpLocation = localStorage.getItem("txtPickUpLocation");
        if (txtPickUpLocation != null)
        {
            var marker2 = new google.maps.Marker({
                position: getLatLngFromString(txtPickUpLocation),
                map: map
            });
            markers.push(marker2);
        }

    }


    //redraw

    function setMapOnAll(map)
    {
        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(map);
        }
    }

    ////////

    $$("#btnShowPickupLoc").on("click", function ()
    {
        $$("#btnPickupLocation").css("display", "block");
        //    



        $$("#btnDitenationLocation").css("display", "none");


    });

    $$("#btnShowDistLocation").on("click", function ()
    {
        $$("#btnDitenationLocation").css("display", "block");
        $$("#btnPickupLocation").css("display", "none");
        $$(".popup-overlay").css("display", "none");
    });

    $$('.popup-about').on('opened', function ()
    {
        $$(".popup-overlay").css("display", "none");
        $$(".popup-overlay").css("z-index", "500");
    });


    $$("#btnConfirm").on("click", function ()
    {
        $$('.car-select-container').transform('translateY(-139px)');
        $$('.car-select-container').transition(600);
        $$('#btnConfirm').transform('translateY(-139px)');
        $$('#btnConfirm').transition(600);
        $$('#btnConfirm').transitionEnd(function ()
        {
            $$('#btnCancel').transform('translateY(-139px)');
            $$('#btnCancel').transition(600);
            $$('#btnCancel').css("display", "block");
            $$('#btnConfirm').css("display", "none");
        })
    });

    $$("#btnCancel").on("click", function ()
    {
        $$('.car-select-container').transform('translateY(15px)');
        $$('.car-select-container').transition(600);
        $$('#btnCancel').transform('translateY(15px)');
        $$('#btnCancel').transition(600);
        $$('#btnCancel').transitionEnd(function ()
        {
            $$('#btnConfirm').transform('translateY(15px)');
            $$('#btnConfirm').transition(600);
            $$('#btnConfirm').css("display", "block");
            $$('#btnCancel').css("display", "none");
        })
    });


    $$("#btnAddDest").on("click", function ()
    {
        $$(".drop-style").css("opacity", 1);
        $$('.drop-style').transition(600);
        $$("#btnAddDest").css("display", "none");
        $$("#btnPickupLocation").hide();
        $$("#btnDitenationLocation").show();
    });


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function ()
    {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function ()
    {
        var places = searchBox.getPlaces();

        if (places.length == 0)
        {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker)
        {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place)
        {
            if (!place.geometry)
            {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport)
            {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else
            {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    $$('body').on('touchend', '.pac-container', function (e) { e.stopImmediatePropagation(); })
    $$('.popup-about').on('touchend', '.pac-container', function (e) { e.stopImmediatePropagation(); })

    $$('#pac-input').on("keyup keydown change", function ()
    {
        $$(".pac-container").find(".pac-item").addClass('needsclick');
        $$(".pac-container").find("span").addClass('needsclick');
        $$(".pac-container").focus();
        $$(".pac-container").css("z-index", "50000")
    });

    $$(".views").on('click', '.pac-item', function ()
    {
        var sp = (this).find("span").text;
    });


    $$("body").on("touchstart", ".pac-item", function ()
    {
        var selectedText = $$(this)[0].children[1].innerText + ", " + $$(this)[0].children[2].innerText;
        $$('#pac-input').val(selectedText);
        $$('#pac-input').submit();
    });

});


//************************************************************//




/***************************** End of Limo Code **************************/


/*******************************Cargo ***************************/
myApp.onPageInit('CargoReservationRequest', function (page)
{


    var pre = GetLocalDataObject("storedprofile");

    if (pre != null)
    {
        //alert(JSON.stringify(pre));
        var ZipCod = pre.MobileNumber.substr(0, 3);

        var MobileNumber8D = pre.MobileNumber.substring(3);
        pre.MobileNumber = MobileNumber8D;

        //alert(JSON.stringify(formData));

        myApp.formFromJSON('#Fill_UP_Cargo', pre);
        myApp.formFromJSON('#Fill_Up_Form_Authoraized', pre);
        // myApp.formFromJSON('#other-form', pre);
    }


    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
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

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
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
    // Validate data and continue to next screen.
    $$('#btnGoToCargoDetails').click(function ()
    {
        //mainView.router.load({ url: 'CargoReservationData.html' });
        // Fill cargo request data
        // TODO: mobile number to add code


        var cargoDataObjData = GetLocalDataObject("cargoDataObjData" + GetServiceLanguage());
        var cargoLocationData = GetLocalDataObject("CargoReservationMapInfo"); 
        var cargoReqObjData =
                {
                    CustomerName: $$('#passengerName').val(),
                    CustomerMobileNo: $$('#txtPhoneNUmber').val(),
                    CustomerEmail: $$('#txtEmailAddress').val(),
                    FromCity: cargoDataObjData.FromCity,
                    ToCity: cargoDataObjData.ToCity,
                    Direction: cargoDataObjData.Direction,
                    TruckType: cargoDataObjData.TruckType,
                    TruckNo: cargoDataObjData.TruckNo,
                    RequestDate: cargoDataObjData.RequestDate,
                    ItemType: cargoDataObjData.ItemType,
                    LoadLocationInfo: cargoLocationData.LoadLocationInfo,
                    UnLoadLocationInfo: cargoLocationData.UnLoadLocationInfo,
                    ServiceLocation: cargoLocationData.ServiceLocation,
                    ChannelCode: cargoDataObjData.ChannelCode,
                    ServiceType: cargoDataObjData.ServiceType,
                    FromCordination: cargoLocationData.FromCordination.replact("(", "").replace(")", ""),
                    ToCordination: cargoLocationData.ToCordination.replact("(", "").replace(")", "")
                }

        // validate data.

        $$('.validate').removeClass("Validation-error");
        var validationResult = validateCargoRequest(cargoReqObjData);

        if (ValidationSucessVal == validationResult)
        {
            // save form data, and move to next screen
            SaveLocalObject('cargoReqObjData' + GetServiceLanguage(), cargoReqObjData);

            PostCrago(cargoReqObjData);
            /*post********/
            // mainView.router.load({ url: 'CargoReservationData.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }

    });


    function PostCrago(cargoReqObjData)
    {



        var jsonBody = JSON.stringify(cargoReqObjData);
        //myApp.alert(jsonBody);
        myApp.showPreloader(GetResourceText("Loading"));
        var urlAjax = "https://mobile.saptco.com.sa/Forms/Cargo/Request";
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
                mainView.router.load({ url: 'CargoSucess.html' });
            },
            error: function ()
            {
                myApp.hidePreloader();
                myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
            }
        });

    }

});

myApp.onPageInit('CargoSucess', function (page)
{
    $$("#gohome").click(function ()
    {
        mainView.router.load({ url: 'Home.html' });
    });
});

myApp.onPageInit('CargoReservationData', function (page)
{
    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    // fill service Type: 
    FillReservationTypes();
    function FillReservationTypes()
    {
        //check in case the cargo date stored in the local storage , in case yes, then read the values from local storage , else read values from server.
        var cargoServiceTypes = GetLocalDataObject("CargoServiceTypes_" + GetServiceLanguage());

        if (cargoServiceTypes == null)
        {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
            {
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Intervals",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var cargoServiceTypes = JSON.parse(data);
                    SaveLocalObject("CargoServiceTypes_" + GetServiceLanguage(), cargoServiceTypes);
                    var options = '';

                    for (var x = 0; x < cargoServiceTypes.length; x++)
                    {
                        options += '<option value="' + cargoServiceTypes[x].Id + '">' + cargoServiceTypes[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption("#servcies", options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < cargoServiceTypes.length; x++)
            {
                options += '<option value="' + cargoServiceTypes[x].Id + '">' + cargoServiceTypes[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption("#servcies", options);
        }
    }

    // intialize date. 
    var calendarCloseButton = GetResourceText("Agree");
    var currentDate = new Date();
    var today = new Date().setDate(currentDate.getDate());
    var _maxdate = new Date().setDate(currentDate.getDate() + 90);

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
        onOpen: function (p)
        {
            calendarDateFormatDepart.params.maxDate = _maxdate;
        }
    });

    // fill cargo direction information
    FillDirection();
    function FillDirection()
    {
        // check in case the direction stored in local storage or not, in case not get the values from service
        var cargoDirection = GetLocalDataObject("CargoDirection" + GetServiceLanguage());

        if (cargoDirection == null)
        {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax(
            {
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Directions",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var cargoDirection = JSON.parse(data);
                    SaveLocalObject("CargoDirection" + GetServiceLanguage(), cargoDirection);
                    var options = '';
                    for (var x = 0; x < cargoDirection.length; x++)
                    {
                        options += '<option value="' + cargoDirection[x].Id + '">' + cargoDirection[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.selectDirection', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            for (var x = 0; x < cargoDirection.length; x++)
            {
                options += '<option value="' + cargoDirection[x].Id + '">' + cargoDirection[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.selectDirection', options);
        }
    }


    //Fill Truck Types
    FillTrcukTypes();
    function FillTrcukTypes()
    {
        var truckTypes = GetLocalDataObject("truckTypes" + GetServiceLanguage());

        if (truckTypes == null)
        {
            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms//Cargo/TruckTypes",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var truckTypes = JSON.parse(data);
                    SaveLocalObject("truckTypes" + GetServiceLanguage(), truckTypes);
                    var options = '';

                    for (var x = 0; x < truckTypes.length; x++)
                    {
                        options += '<option value="' + truckTypes[x].Id + '">' + truckTypes[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.Truck', options);
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < truckTypes.length; x++)
            {
                options += '<option value="' + truckTypes[x].Id + '">' + truckTypes[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.Truck', options);
        }
    }

    //Fill From And to Cities
    FillCities();
    function FillCities()
    {
        var citiesCollection = GetLocalDataObject("citiesCollection" + GetServiceLanguage());

        if (citiesCollection == null)
        {
            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/Cargo/Cities",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var citiesCollection = JSON.parse(data);
                    SaveLocalObject("citiesCollection" + GetServiceLanguage(), citiesCollection);
                    var options = '';

                    for (var x = 0; x < citiesCollection.length; x++)
                    {
                        options += '<option value="' + citiesCollection[x].Id + '">' + citiesCollection[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.ongo', options);
                    myApp.smartSelectAddOption('.onreturn', options);

                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < citiesCollection.length; x++)
            {
                options += '<option value="' + citiesCollection[x].Id + '">' + citiesCollection[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.ongo', options);
            myApp.smartSelectAddOption('.onreturn', options);
        }
    }

    $$("#btnSaveCargorequest").on("click", function ()
    {


        var cargoDataObjData =
               {
                   FromCity: parseInt($$("#going").val()),
                   ToCity: parseInt($$('#Return').val()),
                   Direction: parseInt($$('#direction').val()),
                   TruckType: parseInt($$('#TruckType').val()),
                   TruckNo: $$('#Number').val(),
                   RequestDate: $$('#calendar-date-depart').val(),
                   ItemType: $$("#type").val(),
                   //        LoadLocationInfo : $$("#cary").val(),
                   //        UnLoadLocationInfo : $$("#drop").val(), 
                   //		ServiceLocation : $$("#ServiceLocation").val(),
                   ChannelCode: "005",
                   ServiceType: parseInt($$("#servcies").val())
               }




        // validate Object Data.

        $$('.validate').removeClass("Validation-error");
        var validationResult = validateCargoData(cargoDataObjData);

        // in case the data was valid, send the request to the server
        if (validationResult == ValidationSucessVal)
        {


            SaveLocalObject('cargoDataObjData' + GetServiceLanguage(), cargoDataObjData);


            mainView.router.load({ url: 'CargoReservationDataLocation.html' });
            //            var jsonBody = JSON.stringify(cargoReqObjData);
            //            myApp.showPreloader(GetResourceText("Loading"));
            //            var urlAjax = "https://mobile.saptco.com.sa/Forms/Cargo/Request";
            //            $$.ajax(
            //            {
            //                method: "POST",
            //                url: urlAjax,
            //                contentType: 'application/json',
            //                data: jsonBody,
            //                dataType: "json",
            //                headers:
            //                {
            //                    'Accept-Language': GetServiceLanguage(),
            //                    Accept: 'application/json'
            //                },
            //                success: function (data, status, xhr)
            //                {
            //                    myApp.hidePreloader();
            //                    mainView.router.load({ url: 'CargoSucess.html' });
            //                },
            //                error: function ()
            //                {
            //                    myApp.hidePreloader();
            //                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
            //                }
            //            });

        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });
});



//********************Start of CARGO Data Locations  ***********************//

myApp.onPageInit('CargoReservationDataLocation', function (page)
{
    var reqServiceType = "Cargo";
    $$('input[type="checkbox"]').prop('checked', false);

    $$("#DepartFrom_icon").on("click", function ()
    {
        localStorage.setItem("updatelocationfield", "From");
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#Departto_icon").on("click", function ()
    {
        localStorage.setItem("updatelocationfield", "To");
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#btnSaveCargoDataLocations").on('click', function ()
    {
        var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
        var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);

        var requestBodyLocations =
       {
           LoadLocationInfo: $$("#DepartFrom").val(),
           UnLoadLocationInfo: $$("#Departto").val(),
           ServiceLocation: $$("#Pickup_Location").val(),
           FromCordination: Marker_from,
           ToCordination: Marker_To
       }


        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateCargoReservationDataLocation(requestBodyLocations)

        if (ValidationSucessVal == validationResult)
        {
            SaveLocalObject("CargoReservationMapInfo", requestBodyLocations);
            mainView.router.load({ url: 'CargoReservationRequest.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
        var requestBodyLocations =
        {
            DirectionFrom: $$("#DepartFrom").val(),
            DirectionTo: $$("#Departto").val(),
            DirectionLocation: $$("#Pickup_Location").val(),
            FromCordination: Marker_from,
            ToCordination: Marker_To
        }
        r_Location: $$("#Customer_Location").val();

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateLimoReservationDataLocation(requestBodyLocations)

        if (ValidationSucessVal == validationResult)
        {
            SaveLocalObject("LimoReservationMapInfo", requestBodyLocations);
            mainView.router.load({ url: 'LimoReservationtypes.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    })
});

myApp.onPageAfterAnimation('CargoReservationDataLocation', function (page)
{
    var reqServiceType = "Cargo";
    localStorage.setItem("reqServiceType", reqServiceType);

    var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
    var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
    var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
    var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);
    //    myApp.alert(JSON.stringify(Marker_from) + "name of " + location_From);
    //    myApp.alert(JSON.stringify(Marker_To) + "name of " + location_To);

    if (location_To != null)
    {
        // $$("#DepartFrom").val()
        document.getElementById("Departto").value = location_To;
        var mapProp2 = {
            center: getLatLngFromString(Marker_To),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);
    }

    if (location_From != null)
    {
        // $$("#DepartFrom").val()
        document.getElementById("DepartFrom").value = location_From;
        //google.maps.event.addDomListener(window, 'load', initialize);
        window.onload = loadScript;

        var mapProp = {
            center: getLatLngFromString(Marker_from),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        drawMarkers();

    }
    var depart_field = $$("#DepartFrom").val();

    copyLocationToTo();

    $$("#lblCheckBoxSameLoc").on("change", function ()
    {
        copyLocationToTo();
    });

    function copyLocationToTo()
    {
        var isChecked = $$('#same_locations').prop('checked');

        if (isChecked)
        {
            if (depart_field !== null)
            {
                document.getElementById("Departto").value = depart_field;

                var mapProp2 = {
                    center: getLatLngFromString(Marker_from),
                    zoom: 13,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);

                var marker2 = new google.maps.Marker({
                    position: getLatLngFromString(Marker_from),
                    map: map2
                });
                markers.push(marker2);
            }
        }
    }

    function drawMarkers()
    {

        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        markers = [];


        // myApp.alert("Marker is"+JSON.stringify(Marker_from));
        if (Marker_from != null)
        {
            var marker = new google.maps.Marker({
                position: getLatLngFromString(Marker_from),
                map: map
            });
            markers.push(marker);
        }

        var txtPickUpLocation = localStorage.getItem("txtPickUpLocation");
        if (Marker_To != null)
        {
            var marker2 = new google.maps.Marker({
                position: getLatLngFromString(Marker_To),
                map: map2
            });
            markers.push(marker2);
        }
    }
});

/*************************************************/

/******************************CNC Code *************************/


//************* start  Rent Bus**************//


myApp.onPageInit('Rent_Bus_home', function (page)
{
    var pre = GetLocalDataObject("storedprofile");

    if (pre != null)
    {

        var ZipCod = pre.MobileNumber.substr(0, 3);

        var MobileNumber8D = pre.MobileNumber.substring(3);
        pre.MobileNumber = MobileNumber8D;

        //alert(JSON.stringify(formData));

        myApp.formFromJSON('#Countinue_Form_Personal', pre);
        myApp.formFromJSON('#Countinue_Form_Comapany', pre);
        // myApp.formFromJSON('#other-form', pre);
    }
    else
    { }

    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    $$("#txtCountryCode_pe").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('#countriesAr_pe');
        }
        else
        {
            myApp.smartSelectOpen('#countriesEn_pe');
        }
    });
    $$("#SmartSelectValuepickEn_pe").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_pe").val($$("#countriesSelect_pe").val());
    });

    $$("#SmartSelectValuepick_pe").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_pe").val($$("#countriesSelectAr_pe").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
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
    else
    {
        $$("#countriesSelectAr_pe").val("966");
        $$("#countriesSelect_pe").val("966");
        $$("#txtCountryCode_pe").val("966");
    }
    //fax personal
    $$("#txtCountryCode_fx").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('#countriesAr_fx');
        }
        else
        {
            myApp.smartSelectOpen('#countriesEn_fx');
        }
    });
    $$("#SmartSelectValuepickEn_fx").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_fx").val($$("#countriesSelect_fx").val());
    });

    $$("#SmartSelectValuepick_fx").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_fx").val($$("#countriesSelectAr_fx").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
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
    else
    {
        $$("#countriesSelectAr_fx").val("966");
        $$("#countriesSelect_fx").val("966");
        $$("#txtCountryCode_fx").val("966");
    }
    //phon com
    $$("#txtCountryCode_cph").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('#countriesAr_cph');
        }
        else
        {
            myApp.smartSelectOpen('#countriesEn_cph');
        }
    });
    $$("#SmartSelectValuepickEn_cph").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_cph").val($$("#countriesSelect_cph").val());
    });

    $$("#SmartSelectValuepick_cph").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_cph").val($$("#countriesSelectAr_cph").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
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
    else
    {
        $$("#countriesSelectAr_cph").val("966");
        $$("#countriesSelect_cph").val("966");
        $$("#txtCountryCode_cph").val("966");
    }

    //fax com
    $$("#txtCountryCode_cfx").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('#countriesAr_cfx');
        }
        else
        {
            myApp.smartSelectOpen('#countriesEn_cfx');
        }
    });
    $$("#SmartSelectValuepickEn_cfx").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_cfx").val($$("#countriesSelect_cfx").val());
    });

    $$("#SmartSelectValuepick_cfx").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_cfx").val($$("#countriesSelectAr_cfx").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
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
    else
    {
        $$("#countriesSelectAr_cfx").val("966");
        $$("#countriesSelect_cfx").val("966");
        $$("#txtCountryCode_cfx").val("966");
    }
    //ppe com
    $$("#txtCountryCode_CPP").on("click", function ()
    {
        var appLang = GetLocalData("ApplicationLanguage");
        if (appLang == 'ar')
        {
            myApp.smartSelectOpen('#countriesAr_CPP');
        }
        else
        {
            myApp.smartSelectOpen('#countriesEn_CPP');
        }
    });
    $$("#SmartSelectValuepickEn_CPP").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_CPP").val($$("#countriesSelect_CPP").val());
    });

    $$("#SmartSelectValuepick_CPP").on("DOMSubtreeModified", function ()
    {
        $$("#txtCountryCode_CPP").val($$("#countriesSelectAr_CPP").val());
    });

    var reservationContactInfo = GetLocalDataObject("ReservationcontactInfo" + GetServiceLanguage());
    if (reservationContactInfo != null)
    {
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
    else
    {
        $$("#countriesSelectAr_CPP").val("966");
        $$("#countriesSelect_CPP").val("966");
        $$("#txtCountryCode_CPP").val("966");
    }

    $$('#btnPersone').on('click', function ()
    {
        $$(".PassengerDetalies").show();
        $$(".ComapniesDetalies").hide();

        setOnewayView();
    });

    function setOnewayView()
    {
        $$('#btnPersone').removeClass("not-selected-tab");
        $$('#btnPersone').addClass("selected-tab");
        $$('#btnCompanies').removeClass("selected-tab");
        $$('#btnCompanies').addClass("not-selected-tab");
        $$('#divReturnDate').css("opacity", "0.3");
    }

    $$('#btnCompanies').on('click', function ()
    {

        $$(".PassengerDetalies").hide();
        $$(".ComapniesDetalies").show();
        SetCompanyView();
    });

    function SetCompanyView()
    {
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
    $$('.Countinue_Form_Personal').on('click', function ()
    {
        formData_1 = myApp.formToJSON('#PassengerDetalies');

        localStorage.setItem("Personally", JSON.stringify(formData_1));

        Locally_1 = localStorage.getItem("Personally");

        for (var key in formData_1) { result[key] = formData_1[key]; }

        var BusData = GetLocalDataObject("detailsData");
        var BusLocationData = GetLocalDataObject("CandCReservationMapInfo");

        localStorage.setItem("results", JSON.stringify(result));


        var Personal_Form =
        {
            RequestType: $$("#btnPersonelbl").val(),
            CustomerName: $$('#CustomerName').val(),
            CustomerMobileNo: $$('#CustomerMobileNo').val(),
            CustomerEmail: $$('#CustomerEmail').val(),
            CompanyName: "NA",
            CompanyPhone: "NA",
            CompanyFaxNo: "NA",
            BusType: BusData.BusType,
            BusCount: BusData.BusCount,
            SalesOffice: BusData.SalesOffice,
            RequestDateTime: BusData.RequestDateTime,
            DirectionFrom: BusLocationData.DirectionFrom,
            DirectionTo: BusLocationData.DirectionTo,
            ServiceLocation: BusLocationData.ServiceLocation,
            ChannelCode: "005",
            FromCordination: BusLocationData.FromCordination.replact("(", "").replace(")", ""),
            ToCordination: BusLocationData.ToCordination.replact("(", "").replace(")", "")
        }


        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidatePersonal(Personal_Form);
        if (validationResult == ValidationSucessVal)
        {
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

                success: function (data, status, xhr)
                {
                    myApp.hidePreloader();
                    mainView.router.load({ url: 'BusSucess.html' });
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText("errorNotAbleRentBus"), GetResourceText('alert'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });

            // mainView.router.load({ url: 'Rent_Bus_Details.html' });

        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }


    });
    $$('.Continue_Form_Comapany').on('click', function ()
    {
        formData_2 = myApp.formToJSON('#ComapniesDetalies');
        localStorage.setItem("Company", JSON.stringify(formData_2));
        Locally_2 = localStorage.getItem("Company");
        for (var key in formData_2) { result[key] = formData_2[key]; }
        var BusData = GetLocalDataObject("detailsData");
        var BusLocationData = GetLocalDataObject("CandCReservationMapInfo");
        localStorage.setItem("results", JSON.stringify(result));
        var Company_Form =
        {
            RequestType: $$("#btnCompanieslbl").val(),
            CompanyName: $$('#CompanyName').val(),
            CompanyPhone: $$('#CompanyPhone').val(),
            CompanyFaxNo: $$('#CompanyFaxNo').val(),
            BusType: BusData.BusType,
            BusCount: BusData.BusCount,
            SalesOffice: BusData.SalesOffice,
            RequestDateTime: BusData.RequestDateTime,
            DirectionFrom: BusLocationData.DirectionFrom,
            DirectionTo: BusLocationData.DirectionTo,
            ServiceLocation: BusLocationData.ServiceLocation,
            CustomerName: "NA",
            CustomerMobileNo: "NA",
            CustomerEmail: "NA",
            ChannelCode: "005",
            FromCordination: BusLocationData.FromCordination.replact("(", "").replace(")", ""),
            ToCordination: BusLocationData.ToCordination.replact("(", "").replace(")", "")
        }

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateCompany(Company_Form);
        if (validationResult == ValidationSucessVal)
        {
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

                success: function (data, status, xhr)
                {
                    myApp.hidePreloader();
                    mainView.router.load({ url: 'BusSucess.html' });
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText("errorNotAbleRentBus"), GetResourceText('alert'));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });


            //            mainView.router.load({ url: 'Rent_Bus_Details.html' });

        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
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
    function FillRequestType()
    {
        var RequestTypes = GetLocalDataObject("RequestTypes" + GetServiceLanguage());
        if (RequestTypes == null)
        {
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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var RequestTypes = JSON.parse(data);
                    SaveLocalObject("RequestTypes" + GetServiceLanguage(), RequestTypes);
                    document.getElementById('btnPersonelbl').value = RequestTypes[0].Id;
                    document.getElementById('btnCompanieslbl').value = RequestTypes[1].Id;
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                }
            });

        }
        else
        {
            document.getElementById('btnPersonelbl').value = RequestTypes[0].Id;
            document.getElementById('btnCompanieslbl').value = RequestTypes[1].Id;
        }

    }

    FillSalesOffices();
    function FillSalesOffices()
    {
        var salesOffices = GetLocalDataObject("salesOffices" + GetServiceLanguage());
        if (salesOffices == null)
        {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/CNC/SalesOffices",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var salesOffices = JSON.parse(data);
                    // save returned object
                    SaveLocalObject("salesOffices" + GetServiceLanguage(), salesOffices);
                    var options = '';

                    for (var x = 0; x < salesOffices.length; x++)
                    {
                        options += '<option value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                        '</option>';
                    }
                    myApp.smartSelectAddOption('.selectSalesOffice', options);
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            for (var x = 0; x < salesOffices.length; x++)
            {
                options += '<option value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                '</option>';
            }
            myApp.smartSelectAddOption('.selectSalesOffice', options);
        }
    }

});
/*******************end of Rent Bus**************************/

/************************ Rent Bus Details ***************************/

myApp.onPageInit('Rent_Bus_Details', function (page)
{
    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
    })

    $$(".select_click").on("click", function ()
    {
        var element = $$(this).parent().find(".smart-select")[0];
        setTimeout(function ()
        {
            myApp.smartSelectOpen(element);
        }, 300);
    });

    var all_forms = {};
    var RequestDateTime;
    var formData;
    var Locallly;
    var result = {};
    savedResults = localStorage.getItem("results");
    if (savedResults)
    {
        result = savedResults;
    }

    // collect data from form and post form data
    $$('.form-to-json').on('click', function ()
    {
        formData = myApp.formToJSON('#Rent_Detalies');

        //all_forms = JSON.parse(result);
        for (var key in formData)
        {
            all_forms[key] = formData[key];
        }

        var Details_Form =
       {
           BusType: $$("#BusType").val(),
           BusCount: $$("#BusCount").val(),
           SalesOffice: $$("#SalesOffice").val(),
           RequestDate: $$("#calendar-date-depart").val(),
           RequestDateTime: ($$("#calendar-date-depart").val() + "T" + $$('.RequestDateTime').val()),
           DirectionFrom: $$("#DirectionFrom").val(),
           DirectionTo: $$("#DirectionTo").val(),
           ServiceLocation: $$("#ServiceLocation").val()
       }

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidatDetails(Details_Form);
        if (validationResult == ValidationSucessVal)
        {
            SaveLocalObject("detailsData", Details_Form);
            mainView.router.load({ url: 'Rent_bus_Location.html' });
            //mainView.router.load({ url: 'Rent_Bus_home.html' }); 
            //PostCNCRequest();
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    });

    // Post Request data to server
    //    function PostCNCRequest()
    //    {
    //
    //
    //        myApp.showPreloader(GetResourceText("Loading"));
    //        var dataString = JSON.stringify(all_forms);
    //        $$.ajax({
    //            method: "POST",
    //            url: "https://mobile.saptco.com.sa/Forms/CNC/Request",
    //            contentType: 'application/json',
    //            data: dataString,
    //            dataType: "json",
    //            headers:
    //            {
    //                'Accept-Language': GetServiceLanguage(),
    //                Accept: 'application/json'
    //            },
    //
    //            success: function (data, status, xhr)
    //            {
    //                myApp.hidePreloader();
    //                mainView.router.load({ url: 'BusSucess.html' });
    //            },
    //            error: function (xhr, status)
    //            {
    //                myApp.hidePreloader();
    //                myApp.alert(GetResourceText("errorNotAbleRentBus"), GetResourceText('alert'));
    //                $$(".modal-button-bold").text(GetResourceText('OkText'));
    //            }
    //        });
    //    }



    FillSalesOffices();
    function FillSalesOffices()
    {
        var salesOffices = GetLocalDataObject("salesOffices" + GetServiceLanguage());
        if (salesOffices == null)
        {
            myApp.showPreloader(GetResourceText("Loading"));

            $$.ajax({
                url: "https://mobile.saptco.com.sa/Forms/CNC/SalesOffices",
                method: "Get",
                headers:
                {
                    'Accept-Language': GetServiceLanguage(),
                    Accept: 'application/json'
                },
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var salesOffices = JSON.parse(data);
                    // save returned object
                    SaveLocalObject("salesOffices" + GetServiceLanguage(), salesOffices);
                    var options = '';

                    for (var x = 0; x < salesOffices.length; x++)
                    {
                        options += '<option value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                        '</option>';
                    }
                    myApp.smartSelectAddOption('.selectSalesOffice', options);
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    myApp.alert(GetResourceText('GenericError'), GetResourceText("Error"));
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';
            for (var x = 0; x < salesOffices.length; x++)
            {
                options += '<option value="' + salesOffices[x].Id + '">' + salesOffices[x].LocalizedName
                '</option>';
            }
            myApp.smartSelectAddOption('.selectSalesOffice', options);
        }
    }

    // Get buses types from server 
    GetBusTypes();
    function GetBusTypes()
    {
        //check in case the value was available in local storage, if not then retrive the data from server. 
        var BusTypesCollection = GetLocalDataObject("BusTypesCollection" + GetServiceLanguage());

        if (BusTypesCollection == null)
        {
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
                success: function (data, xhr, param)
                {
                    myApp.hidePreloader();
                    var BusTypesCollection = JSON.parse(data);
                    SaveLocalObject("BusTypesCollection" + GetServiceLanguage(), BusTypesCollection);
                    var options = '';

                    for (var x = 0; x < BusTypesCollection.length; x++)
                    {
                        options += '<option value="' + BusTypesCollection[x].Id + '">' + BusTypesCollection[x].LocalizedName +
                           '</option>';
                    }

                    myApp.smartSelectAddOption('.selectBus_Type', options);
                },
                error: function (xhr, status)
                {
                    myApp.hidePreloader();
                    $$(".modal-button-bold").text(GetResourceText('OkText'));
                }
            });
        }
        else
        {
            var options = '';

            for (var x = 0; x < BusTypesCollection.length; x++)
            {
                options += '<option value="' + BusTypesCollection[x].Id + '">' + BusTypesCollection[x].LocalizedName +
                   '</option>';
            }

            myApp.smartSelectAddOption('.selectBus_Type', options);
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
        onOpen: function (p)
        {
            calendarDateFormatDepart.params.maxDate = _maxdate;
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
        value: [
            (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()), "00"],

        //         onChange: function (picker, values, displayValues) {
        //             
        //             
        //        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
        //        if (values[1] > daysInMonth) {
        //            picker.cols[1].setValue(daysInMonth);
        //        }
        //    },

        formatValue: function (p, values, displayValues)
        {
            return values[0] + ':' + values[1] + ':00';
            //yyyy-MM-ddTHH:mm:ss
        },

        cols: [
//            
            // Hours
            {
                values: (function ()
                {
                    var arr = [];
                    for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
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
                values: (function ()
                {
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

});

myApp.onPageInit('BusSucess', function (page)
{
    $$("#gohome").click(function ()
    {
        mainView.router.load({ url: 'Home.html' });
    });
});

//********************Start of rent bus Data Locations  ***********************//

myApp.onPageInit('Rent_bus_Location', function (page)
{
    var reqServiceType = "Bus";
    $$('input[type="checkbox"]').prop('checked', false);

    $$("#DepartFrom_icon").on("click", function ()
    {
        localStorage.setItem("updatelocationfield", "From");
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#Departto_icon").on("click", function ()
    {
        localStorage.setItem("updatelocationfield", "To");
        mainView.router.load({ url: 'MapLocationSelect.html' });
    });

    $$("#btnSaveDataLocations").on('click', function ()
    {
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
        r_Location: $$("#Customer_Location").val();

        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidateCandCLocationInfo(requestBodyLocations)

        if (ValidationSucessVal == validationResult)
        {
            SaveLocalObject("CandCReservationMapInfo", requestBodyLocations);
            mainView.router.load({ url: 'Rent_Bus_home.html' });
        }
        else
        {
            var redLinks = $$('.validate').filter(function (index, el)
            {
                return $$(this).attr('data-validation') == validationResult;
            });

            redLinks.addClass("Validation-error");
            // display error message
            myApp.alert(GetResourceText(validationResult), GetResourceText('Error'));
            $$(".modal-button-bold").text(GetResourceText('OkText'));
        }
    })
});

myApp.onPageAfterAnimation('Rent_bus_Location', function (page)
{
    var reqServiceType = "Bus";
    localStorage.setItem("reqServiceType", reqServiceType);

    var location_To = localStorage.getItem("txtValueDistLocation" + reqServiceType);
    var location_From = localStorage.getItem("txtValuePickUpLocation" + reqServiceType);
    var Marker_from = localStorage.getItem("txtPickUpLocation" + reqServiceType);
    var Marker_To = localStorage.getItem("txtDistLocation" + reqServiceType);
    //    myApp.alert(JSON.stringify(Marker_from) + "name of " + location_From);
    //    myApp.alert(JSON.stringify(Marker_To) + "name of " + location_To);

    if (location_To != null)
    {
        // $$("#DepartFrom").val()
        document.getElementById("Departto").value = location_To;
        var mapProp2 = {
            center: getLatLngFromString(Marker_To),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);
    }

    if (location_From != null)
    {
        // $$("#DepartFrom").val()
        document.getElementById("DepartFrom").value = location_From;
        //google.maps.event.addDomListener(window, 'load', initialize);
        window.onload = loadScript;

        var mapProp = {
            center: getLatLngFromString(Marker_from),//(51.508742, -0.120850),//
            zoom: 13,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        drawMarkers();

    }
    var depart_field = $$("#DepartFrom").val();

    copyLocationToTo();

    $$("#lblCheckBoxSameLoc").on("change", function ()
    {
        copyLocationToTo();
    });

    function copyLocationToTo()
    {
        var isChecked = $$('#same_locations').prop('checked');

        if (isChecked)
        {
            if (depart_field !== null)
            {
                document.getElementById("Departto").value = depart_field;

                var mapProp2 = {
                    center: getLatLngFromString(Marker_from),
                    zoom: 13,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp2);

                var marker2 = new google.maps.Marker({
                    position: getLatLngFromString(Marker_from),
                    map: map2
                });
                markers.push(marker2);
            }
        }
    }

    function drawMarkers()
    {

        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        markers = [];


        // myApp.alert("Marker is"+JSON.stringify(Marker_from));
        if (Marker_from != null)
        {
            var marker = new google.maps.Marker({
                position: getLatLngFromString(Marker_from),
                map: map
            });
            markers.push(marker);
        }

        var txtPickUpLocation = localStorage.getItem("txtPickUpLocation");
        if (Marker_To != null)
        {
            var marker2 = new google.maps.Marker({
                position: getLatLngFromString(Marker_To),
                map: map2
            });
            markers.push(marker2);
        }
    }
});

/*************************************************/

//************************ End OF Rent Bus Detais ***************************//
//************************* End CNC Code *************************//