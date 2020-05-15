

function fillAdultsList(array)
{
    var adult_list = myApp.virtualList('.adult-list', {
        // Array with items data
        items: array,
        // Custom render function to render item's HTML
        renderItem: function (index, item)
        {
            return GetPassengerItemHTML(index, "adult", item.isCompleted, item.Name);
        }
    });
}

function fillChildrenList(array)
{
    var children_list = myApp.virtualList('.children-list', {
        // Array with items data
        items: array,
        // Custom render function to render item's HTML
        renderItem: function (index, item)
        {
            return GetPassengerItemHTML(index, "child", item.isCompleted, item.Name);
        }
    });
}
 
function fillInfantsList(array)
{
    var infa_list = myApp.virtualList('.infa-list', {
        // Array with items data
        items: array,
        // Custom render function to render item's HTML
        renderItem: function (index, item)
        {
            return GetPassengerItemHTML(index, "infant", item.isCompleted, item.Name);
        }
    });
}

function GetPassengerItemHTML(index, itemType, isCompleted,Name)
{
    var imgSrc = "img/CheckNotSelected.png";
    if (isCompleted)
    {
        imgSrc = "img/CheckSelected.png"
    }
    var imgSrc2 = "img/add-icons.svg";
    if (isCompleted)
    {
        imgSrc2 = "img/edit-icons.svg"
    }

    return '<li style="border-bottom: 1px solid #EFEDC3;"><div class="row  no-gutter PassengerItemClickable" style="padding-left:5px; background-color: #FFF5E1;padding-right : 5px; padding-top: 5px ;" data-type="' + itemType + '" data-index="' + index + '"  >                     ' +
             '      <div class="col-5"  >                                                                        ' +
                 '          <img src="' + imgSrc + '"  style="width: 15px; margin: 25%;padding-top: 5px;"/>                                                     ' +
             '      </div>                                                                                      ' +
                 '      <div class="adult-text col-80  passenger_name add-passenger-details" style="font-weight: 300; font-size: 16px !important; font-stretch: condensed; line-height: 35px;"  data-type="' + itemType + '" data-index="' + index + '">' + Name +
             '      </div>                                                                                      ' +
               '          <img src="' + imgSrc2 + '" class="add-passenger-details" data-type="child" data-index="' + index + '" style="width: 32px;"/>     ' +
             '  </div></li> ';
}


myApp.onPageInit('bus_content_fleet', function (page)
{

    $$("#bus_content_fleet").on('click', '.clickable_img', function ()
    {

        SaveLocalData("busName", $$(this).attr('id'));
        //mainView.router.load({ url: 'fleet_test.html' });

        var busName = GetLocalData("busName");
        var captiontext = $$("." + busName).html();
        var myPhotoBrowserPopupDark = myApp.photoBrowser({
            backLinkText: "",
            photos: [
                {
                    url: 'img/' + busName + '1.jpg',
                    caption: captiontext
                },

                {
                    url: 'img/' + busName + '2.jpg',
                    caption: captiontext
                },
                // This one without caption
                {
                    url: 'img/' + busName + '3.jpg',
                    caption: captiontext
                },
            ],
            theme: 'dark',
            type: 'standalone'
        });

        myPhotoBrowserPopupDark.open();

        //////////////////////////
    })
});

myApp.onPageInit('fleet_advance', function (page)
{


    var busName = GetLocalData("busName");

    var mySwiper = myApp.swiper('.swiper-container', {
        pagination: '.swiper-pagination'
    });

    for (i = 1; i < 4; i++)
    {
        var elementId = "#slider" + i;
        $$(elementId).attr("src", 'img/' + busName + i + '.jpg');
    }

    $$('.' + busName).show();


});


function getText()
{
    var bus_data = {
        "lblHeaderTitle": "Details",
        "lblModel": "Model",
        "lblDetails": "Details",
        "lblServices": "Services",
        "lblModel2": "Model",
        "lblDetails2": "Details",
        "lblServices2": "Services",
        "lblModel3": "Model",
        "lblDetails3": "Details",
        "lblServices3": "Services",
        "lblModel4": "Model",
        "lblDetails4": "Details",
        "lblServices4": "Services",
        "lblModel5": "Model",
        "lblDetails5": "Details",
        "lblServices5": "Services",
        "lblModel6": "Model",
        "lblDetails6": "Details",
        "lblServices6": "Services",
        "lblModel7": "Model",
        "lblDetails7": "Details",
        "lblServices7": "Services",
        "lblModel": "Model",
        "lblDetails": "Details",
        "lblServices": "Services",
        "lblModelTraveco": "2015, 28 Leather Seat",
        "lblDetailsTraveco": "Leather Seat 28",
        "lblServicesTraveco": "Annual Contract And Leasing Service.",
        "lblModelTrav": "2012, 49 Velvet Seat",
        "lblDetailsTrav": "49 Velvet Seat",
        "lblServicesTrav": "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
        "lblModelMBT": "2005, 49 Velvet Seat",
        "lblDetailsMBT": "49 Velvet Seat",
        "lblServicesMBT": "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
        "lblModelKingLong": "2014, 49 Velvet Seat",
        "lblDetailsKingLong": "49 Velvet Seat",
        "lblServicesKingLong": "Inter-City Transport Service-International Transport-Annual Contract And Leasing Service.",
        "lblModelCityBus": "2013, 45 Velvet Seat",
        "lblDetailsCityBus": "Conditioning + Curtains For The Windows + Heat Insulator And Sound.",
        "lblServicesCityBus": "Annual Contract And Leasing Service-Transport Within City Service.",
        "lblModelTravecoMistsubishi": "2014, 29 Velvet Seat",
        "lblDetailsMistsubishi1": "Audio-Visual Equipment",
        "lblDetailsMistsubishi2": "Conditioning + Curtains For The Windows.",
        "lblServicesMistsubishi": "Annual Contract And Leasing Service",
        "lblModelKonicto": "2007, 46 velvet Seat",
        "lblDetailsKonicto": "Conditioning + Curtains For The Windows + Heat Insulator And Sound.",
        "lblServicesKonicto": "Annual Contract And Leasing Service."
    }
}

function fleet()
{
    $$('.' + busName).show();
}

myApp.onPageInit('menu_favorite', function (page)
{
    GetAllNationalities();

    $$(document).on('click', ".deleteClass", function (e)
    {

        var itemIndex = Number(e.toElement.attributes["data-index"].value);
        var favoritList = GetLocalDataObject("favList_" + $$("#selectIdType").val());
        var newFavList = [];
        for (var i = 0; i < favoritList.length; i++)
        {
            if (i != itemIndex)
            {
                newFavList.push(favoritList[i]);
            }
        }
        GetLocalDataObject("favList_" + $$("#selectIdType").val());
        SaveLocalObject("favList_" + $$("#selectIdType").val(), newFavList);
        drowFavList();
    });

    $$("#selectIdType").on("change", function ()
    {
        drowFavList();
    });

    function drowFavList()
    {
        var favoritList = GetLocalDataObject("favList_" + $$("#selectIdType").val());
        var favUpdateQuery =
            {
                FavType: $$("#selectIdType").val(),
                ItemIndex: 0
            };
        SaveLocalObject("favUpdateQuery", favUpdateQuery);
        var tempFavList = null;
        if (favoritList)
        {
            $$(".fav-list").css({ "display": "block" });
            var myList = myApp.virtualList('.fav-list', {
                // Array with items data
                items: favoritList,
                // Custom render function to render item's HTML
                renderItem: function (index, item)
                {
                    //return '<li class="item-content swipeout">' +
                    //             '<div class="swipeout-content item-content">' +
                    //                     '<div class="item-inner ">' +
                    //                         '<div class="item-title clickable-Fav" data-index =' + index + '>' + item.Name + '</div>' +
                    //                    ' </div>' +
                    //                    ' <div class="swipeout-actions-right">' +
                    //                                ' <a href="#" class="swipeout-delete" data-confirm="Are you sure want to delete this item?" data-confirm-title="Delete?" data-close-on-cancel="true">Delete</a>' +
                    //                    '</div>' +
                    //            '</div>' +
                    //        '</li>';
                    //clickable-Fav
                    return '    <li class="swipeout "  data-index =' + index + '>                                   ' +
                    '     <div class="swipeout-content item-content" >            ' +
                    '       <div class="item-inner clickable-Fav"  data-index =' + index + '>' + item.Name + '</div>                    ' +
                    '     </div>                                                 ' +
                    '     <div class="swipeout-actions-left">                    ' +
                    '       <a href="#" class="deleteClass" data-index =' + index + '>Delete</a>            ' +
                    '     </div>                                                 ' +
                    '     <div class="swipeout-actions-right">                   ' +
                    '       <a href="#" class="deleteClass" data-index =' + index + '>Delete</a>            ' +
                    '     </div>                                                 ' +
                    '   </li>                                                    ';

                },
                // search item by item
                searchByItem: function (query, index, item)
                {
                    // Check if title contains query string
                    if (item.title.indexOf(query.trim()) >= 0)
                    {
                        return true; //item matches query
                    }
                    else
                    {
                        return false; //item doesn't match
                    }
                }
            });
            tempFavList = myList;
        }
        else
        {
            $$(".fav-list").css({ "display": "none" });
        }
        $$('.fav-list').on('click', '.clickable-Fav', function ()
        {
            var itemIndex = Number($$(this).data('index'));
            var updateQuery = GetLocalDataObject("favUpdateQuery");
            updateQuery.ItemIndex = itemIndex;
            SaveLocalObject("favUpdateQuery", updateQuery);
            mainView.router.load({ url: "FavoritefillInfo.html" });
        })
    }
});
//}); 

myApp.onPageInit('FavoritefillInfo', function (page)
{
    //passenger-BirthDate
    var updateQuery = GetLocalDataObject("favUpdateQuery");

    var favoritList = GetLocalDataObject("favList_" + updateQuery.FavType);
    var updatedItem = favoritList[updateQuery.ItemIndex];

    var nationalitiesList = GetLocalDataObject("NationalitiesList" + GetServiceLanguage());

    if (nationalitiesList != null && nationalitiesList.Results != null)
    {
        nationalitiesList = nationalitiesList.Results;
    }

    var nationalityName = JSLINQ(nationalitiesList).Where(function (item)
    {
        return item.ID == updatedItem.NationalityID
    });

    if (nationalityName.items.length > 0)
    {
        if (nationalityName.items[0].Name != null)
        {
            $$("#lblNationalityName").val(nationalityName.items[0].Name);
        }
        else
        {
            $$("#lblNationalityName").val(nationalityName.items[0]);
        }
    }

    $$("#lblNationalityName").data("NatValue", updatedItem.NationalityID);

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
        var options = {
            date: new Date(),
            mode: 'date'
        };

        datePicker.show(options, onSuccess, onError);
    });

    if (GetLocalData("PassengerUpdateType") == "Search")
    {
        $$("#SearchView").css("display", "block");
        $$("#PassengerDetalies").addClass("disabled");
    }
    else
    {
        $$("#SearchView").css("display", "none");
        $$("#PassengerDetalies").removeClass("disabled");
        // fill form details.
    }

    fillFavPassengerDetails();


    // on nationality click event
    $$('.passenger-nationality-click').on('click', function ()
    {
        //savePassengerDetails();
        mainView.router.load({
            url: 'favNationalities.html'
        });

    });

    myApp.onPageAfterBack("favNationalities", function (page)
    {
        var objectNationality = GetLocalDataObject("SelectedNationality");

        if (objectNationality && objectNationality != null)
        {
            $$("#lblNationalityName").val(objectNationality.nationalityName);
            $$("#lblNationalityName").data("NatValue", objectNationality.natioalityID);
        }
        DeleteLocalData("SelectedNationality");
    });

    // on nationality click event
    $$('#btnSaveFavPassenger').on('click', function ()
    {

        var updatedItem = myApp.formToJSON("#PassengerDetalies");
        updatedItem.NationalityId = $$("#lblNationalityName").data("NatValue");
        updatedItem.NationalityID = $$("#lblNationalityName").data("NatValue");
        //PassengerDetalies
        $$('.validate').removeClass("Validation-error");
        var validationResult = ValidatePassengers(updatedItem);
        if (validationResult == ValidationSucessVal)
        {
            updatedItem.isCompleted = true;
            //SaveLocalObject("updatedItem", updatedItem);
            var updateQuery = GetLocalDataObject("favUpdateQuery");
            var favoritList = GetLocalDataObject("favList_" + updateQuery.FavType);
            favoritList[updateQuery.ItemIndex] = updatedItem;
            SaveLocalObject("favList_" + updateQuery.FavType, favoritList);
            mainView.router.reloadPreviousPage('menu_favorite.html');
            mainView.router.back({
                url: 'menu_favorite.html'
            });

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

        var passengerArray = [];

        if (updateQuery.FavType == "adult")
        {
            passengerArray = GetLocalDataObject("AdultPassengers");
        }

        if (updateQuery.FavType == "child")
        {
            passengerArray = GetLocalDataObject("ChildsArray");
        }

        if (updateQuery.FavType.itemType == "infant")
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
        updatedItem.Gender =

            formData.Gender;
        updatedItem.IDNumber = formData.IDNumber;
        updatedItem.IDType = formData.IDType;
        updatedItem.IDVersion = formData.IDVersion;
        var selectedNationality = GetLocalDataObject("SelectedNationality");

        if (selectedNationality != null)
        {
            updatedItem.NationalityID = selectedNationality.natioalityID;
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

        switch (updateQuery.FavType)
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
    function fillFavPassengerDetails()
    {
        var itemIndex = updateQuery.itemIndex;
        var formSavedData = {
        };
        switch (updateQuery.FavType)
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

        myApp.formFromJSON("#PassengerDetalies", updatedItem);
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
       // var formData = myApp.formToJSON("#SearchPassengerDetalies");
        var formData = true;
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
                myApp.formFromJSON("#PassengerDetalies", data.Results);
                $$("#inputIDVersion").val(data.Results.IDVersion);

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
                myApp.alert(GetResourceText("NoResultFoundCustomer"), GetResourceText('Error'));
                $$(".modal-button-bold").text(GetResourceText('OkText'));
            }
        });
    }

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
});

myApp.onPageInit('PassengerfillInfo', function (page)
{

    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
        $$(this).find("select");
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

        //$$(this).find("select").focus().click();
        //$$(this).find("select").show().click(); 
        //$$(this).find("select").show().focus();

    })

    $$("#passengerName").on("click", function ()
    {
        $$(this).val("");
    })


});

myApp.onPageInit('PassengersInfo', function (page)
{
    $$(".div_click").on("click", function ()
    {
        $$(this).find("input").focus();
        $$(this).find("select");
    })
});
myApp.onPageInit('FavoritefillInfo', function (page)
{

    $$(".div_click").on("click", function ()
    {

        $$(this).find("input").focus();
        $$(this).find("select");

    })




});
myApp.onPageInit('signup', function (page)
{

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


});

/************************** Nationalities **********************************/

myApp.onPageInit('favNationalities', function (page)
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
    fillFavNationalities();

});


function SaveNatiotnlaitySelection(selectionName, selectionId)
{
    var objectNationality =
    {
        nationalityName: selectionName,
        natioalityID: selectionId
    }
    SaveLocalObject("SelectedNationality", objectNationality);
    mainView.router.back({
        url: 'FavoritefillInfo.html'
    });
}

function fillFavNationalities()
{
    var nationalitiesList = GetLocalDataObject("NationalitiesList" + GetServiceLanguage());
    if (nationalitiesList != null)
    {
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
                    if (items[i].Name.toUpperCase().indexOf(query.trim().toUpperCase()) >= 0) foundItems.push(i);
                }
                // Return array with indexes of matched items
                return foundItems;
            }
        });
    }
}


/**************************************/