
var Latitude;
var Longitude;
var map;
var markers = [];
var origin1 = localStorage.getItem("txtDistLocation");
var destinationB = localStorage.getItem("txtPickUpLocation");
var bounds = {
    north: -25.363882,
    south: -31.203405,
    east: 131.044922,
    west: 125.244141
};
var rndLat;
var rndLng;

document.addEventListener("deviceready", onDeviceReady, false);

// convert string to latlng
function getLatLngFromString(ll)
{
    if (ll !== null && ll != null && ll != "null")
    {
        try
        {
            var latlng = ll.replace("(", "").replace(")", "").split(',');
            var newLatLng = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
            return newLatLng;
        }
        catch (e)
        {

            myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
            return null;
        }
    }
    else
        return null;
}

function onDeviceReady()
{
    //console.log("navigator.geolocation works well");
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);

}

myApp.onPageInit('LimoSchedual', function (page)
{
    var calendarDateFormat = myApp.calendar({
        input: '#calendar-default',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: true
    });
});



// getting current location from geolocation plugin.
var geolocationSuccess = function (position)
{
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    //mapProp.center = new google.maps.LatLng(Latitude, Longitude);
    //var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    bounds = {
        north: Latitude + 0.02,
        south: Latitude - 0.02,
        east: Longitude + 0.02,
        west: Longitude - 0.02
    };
    var lngSpan = bounds.east - bounds.west;
    var latSpan = bounds.north - bounds.south;

    rndLat = bounds.south + latSpan * Math.random();
    rndLng = bounds.west + lngSpan * Math.random();

};

//failed to get location set the location to al-Riyadh
function geolocationError()
{
    Latitude = 24.679272;
    Longitude = 46.687449;

}


myApp.onPageInit('LimoConfirm', function (page)
{
    var pickupLocationName = localStorage.getItem("txtValuePickUpLocation");
    var DistinationLocationName = localStorage.getItem("txtValueDistLocation");
    $$("#pickupLocation").text(pickupLocationName);
    $$("#distinationLocation").text(DistinationLocationName);
    var duration = Number(localStorage.getItem("durationValue"));
    var dateObj = new Date();
    var dateString = dateObj.toLocaleDateString();
    var timeString = addMinutes(dateObj, duration).toLocaleTimeString();
    $$("#lblDate").text(dateString);
    $$("#lblTime").text(timeString);
});


function addMinutes(date, minutes)
{
    return new Date(date.getTime() + minutes * 1000);
}


myApp.onPageInit('LimoFeedback', function (page)
{
    $$(".contentItemContainer").on("click", function ()
    {
        $$("#main").transform("translateY(-330px)");
        $$('#main').transition(300);
    });
});



myApp.onPageInit('LimoExtraTripDetails', function (page)
{

    $$(".feedbackContainer").on("click", function ()
    {
        $$(".page-content").scrollTo(0, 1270, 1000);
    });

    $$(".complain-button").on("click", function ()
    {
        if ($$(this).data("selected") == "false")
        {
            $$(this).addClass("selected-complin");
            $$(this).data("selected", "true");
        }
        else
        {
            $$(this).removeClass("selected-complin");
            $$(this).data("selected", "false");
        }
    });
});


var timer;
var timerCurrent;
var timerFinish;
var timerSeconds;
var carMarker;
myApp.onPageInit('LimoTrackMap', function (page)
{


    var mapLeft = (($$(window).width() - $$(".rounded-map").width()) / 2) - 35;
    $$(".rounded-map").css({ "position": 'absolute', left: mapLeft + "px" });
    var mapOffset = $$(".rounded-map").offset();
    var leftValue = $$(".rounded-map")[0].offsetLeft;
    var topValue = $$(".rounded-map")[0].offsetTop;
    $$(".timer").css({ "position": 'absolute', left: (leftValue - 7) + "px", top: (topValue - 7) + "px" });

    function runProgress()
    {
        timerSeconds = 30;
        timerCurrent = 0;
        timerFinish = new Date().getTime() + (timerSeconds * 1000);
        timer = setInterval('stopWatch()', 50);
    }
    runProgress();

    function initialize()
    {
        try
        {
            var mapProp = {
                center: new google.maps.LatLng(51.508742, -0.120850),
                zoom: 17,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

            var marker = new google.maps.Marker({
                position: {
                    lat: Latitude,
                    lng: Longitude
                },
                map: map
            });
        } catch (e)
        {
            myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
        }
    }

    initialize();
    window.onload = loadScript;

    var mapProp = {
        center: new google.maps.LatLng(Latitude, Longitude),//(51.508742, -0.120850),//
        zoom: 17,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    function loadScript()
    {
        try
        {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://maps.googleapis.com/maps/api/js?key=&libraries=places&sensor=false&callback=initialize";
            document.body.appendChild(script);
        } catch (e)
        {
            myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));
        }
    }

    drawMarkers();
    function drawMarkers()
    {
        for (var i = 0; i < markers.length; i++)
        {
            markers[i].setMap(null);
        }
        markers = [];

        var txtDistLocation = localStorage.getItem("txtDistLocation");
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


        newCarPositionLat = rndLat;
        newCarPositionLng = rndLng;
        calculateDistancePerTime(txtPickUpLocation);
    }
});

function drawTimer(percent)
{
    $$('div.timer').html('<div class="percent"></div><div id="slice"' + (percent > 50 ? ' class="gt50"' : '') + '><div class="pie"></div>' + (percent > 50 ? '<div class="pie fill"></div>' : '') + '</div>');
    var deg = 360 / 100 * percent;

    $$('#slice .pie').css({
        '-moz-transform': 'rotate(' + deg + 'deg)',
        '-webkit-transform': 'rotate(' + deg + 'deg)',
        '-o-transform': 'rotate(' + deg + 'deg)',
        'transform': 'rotate(' + deg + 'deg)'
    });

    //$$('.percent').html(Math.round(percent) + '%');
}

var newCarPositionLat;
var newCarPositionLng;
var counter = 0;
function stopWatch()
{

    var seconds = (timerFinish - (new Date().getTime())) / 1000;
    counter++;
    if (seconds <= 0)
    {
        drawTimer(100);
        clearInterval(timer);
        //console.log(counter);
    }
    else
    {
        var percent = 100 - ((seconds / timerSeconds) * 100);
        var timePer = (((100 - percent) / 100) * 180);
        var min = Math.floor(timePer / 60);
        var sec = Math.floor(timePer % 60);
        var fullTime = min + ":" + sec;
        $$("#lblperiod").text(fullTime);

        newCarPositionLat = newCarPositionLat + calLat;
        newCarPositionLng = newCarPositionLng + valLng;
        var newLatLng = new google.maps.LatLng(parseFloat(newCarPositionLat), parseFloat(newCarPositionLng));
        carMarker.setPosition(newLatLng);
        drawTimer(percent);
    }
}

var calLat = 0;
var valLng = 0;

function calculateDistancePerTime(txtPickUpLocation)
{
    var latlng = getLatLngFromString(txtPickUpLocation);
    calLat = (latlng.lat() - rndLat) / 491;
    valLng = (latlng.lng() - rndLng) / 491;

}


myApp.onPageInit('LimoPassengersDetails', function (page)
{
    $$(".complain-button").on("click", function ()
    {
        if ($$(this).data("selected") == "false")
        {
            $$(this).addClass("selected-complin");
            $$(this).data("selected", "true");
        }
        else
        {
            $$(this).removeClass("selected-complin");
            $$(this).data("selected", "false");
        }
    });
});


myApp.onPageInit('LimoSchedual', function (page)
{

    var calendarDateFormat = myApp.calendar({
        input: '#calendar-default',
        dateFormat: 'dd-mm-yyyy',
        closeOnSelect: false,
        multiple: true,
        onClose: function ()
        {
            var rowitme = '';
            var lengith = 0;
            var setofDates = calendarDateFormat.value;
            var lengith = setofDates.length;
            setofDates = $$("#calendar-default").val().split(",");
            //console.log(setofDates);
            for (var i = 0; i < setofDates.length; i++)
            {
                var string = ' <li class="accordion-item"><a href="#" class="item-content item-link"> ' +
                        '<div style="background-color: rgba(77, 67, 67, 0.45);"class="item-inner">' +
                       '  <div class="item-title">' + setofDates[i] + '</div>' +
                       ' </div></a>' +
                     ' <div  class="accordion-item-content">' +
                     '<a href="#" class="item-content item-link"> ' +
                       ' <div style="background-color: rgba(77, 67, 67, 0.45);" class="content-block">' +
                        ' <p style="color:balck !important"> info trip</p>' +
                       ' </div>' +
                       '</a>' +
                       '<div  class="accordion-item-content">' +
                       '<p>mrhba manaf</p>'
                '</div>' +
             ' </div>' +
            ' </li> ';
                rowitme = rowitme + string;
                //console.log(rowitme);
            }

            $$("#row").html(rowitme);

        }
    });



});



/********************** MAP Code **************************/
/********************** New Code **************************/
myApp.onPageInit('MapLocationSelect', function (page)
{

    $$("#Search_Location_btn").click(function ()
    {
        if ($$("#search-box-input").css("display") == "none")
        {
            $$("#search-box-input").css("display", "block");
        }
        else
        {
            $$("#search-box-input").css("display", "none");
        }
    });

    //initializeSearchMap();

    //function initializeSearchMap()
    //{
    //    new google.maps.places.Autocomplete(
    //    (document.getElementById('autocomplete')), {
    //        types: ['geocode']
    //    });
    //}

    //$$("#btnPopupSearch").click(function ()
    //{
    //    var searchValue = $$(".searchPopupInput").val();

    //});

    // set default to riyadh
    var currentDeviceLat = 24.6793519;
    var currentDeviceLong = 46.691814;
    var mainMap;
    var geocoder = new google.maps.Geocoder;
    var markers = [];
    var reqServiceType = localStorage.getItem("reqServiceType");

    var location_To = localStorage.getItem("CenterSelectLocation" + reqServiceType);
    var Marker_To = localStorage.getItem("CenterSelectLocationCord" + reqServiceType);

    // draw map centerd to default location.
    try
    {
        initialize(false);
    } catch (e)
    {

    }

    //prepare screen items: 
    PrepaareScreenView();

    // get the current device location :  
    getCurrentLocation(false);
    // get current location from the device GPS.
    var showMessage = true;
    function getCurrentLocation(isManual)
    {
        // on success functionalty 
        var onSuccess = function (position)
        {

            navigator.geolocation.clearWatch(watchID);
            currentDeviceLat = position.coords.latitude;
            currentDeviceLong = position.coords.longitude;
            initialize(isManual);

            localStorage.setItem("currentLat", currentDeviceLat);
            localStorage.setItem("currentLng", currentDeviceLong);

            // get location name 
            var latlng = { lat: currentDeviceLat, lng: currentDeviceLong };
            geocoder.geocode({ 'location': latlng }, function (results, status)
            {
                if (status === google.maps.GeocoderStatus.OK)
                {
                    if (results[0])
                    {
                        $$("#lblcurrentLocation").text(results[0].formatted_address);
                        localStorage.setItem("current_Address", results[0].formatted_address);
                    }
                }
            });

        };

        // onError Callback receives a PositionError object 
        function onError(error)
        {

            // show message to turn the GPS on :GPSError

            navigator.geolocation.clearWatch(watchID);
            var correctPage = (mainView.activePage.name == "MapLocationSelect");

            if (showMessage && correctPage)
            {
                showMessage = false;
                myApp.confirm(GetResourceText("GPSError"), GetResourceText('alert'),
                function ()
                {
                    showMessage = true;
                    if (window.cordova && window.cordova.plugins.settings)
                    {
                        window.cordova.plugins.settings.open("location", function ()
                        {
                        },
                              function ()
                              {
                              });
                    }

                }, function ()
                {
                    showMessage = true;
                });
                $$(".modal-button").text(GetResourceText('CancelText'));
                $$(".modal-button.modal-button-bold").text(GetResourceText('OkText'));
            }

        }

        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 8000 });


    }

    //temp solution to handle ios get current location from the device GPS.
    function getCurrentLocation_temp(isManual)
    {
        // on success functionalty 
        var onSuccess = function (position)
        {

            navigator.geolocation.clearWatch(watchID);
            currentDeviceLat = position.coords.latitude;
            currentDeviceLong = position.coords.longitude;
            initialize(isManual);

            localStorage.setItem("currentLat", currentDeviceLat);
            localStorage.setItem("currentLng", currentDeviceLong);

            // get location name 
            var latlng = { lat: currentDeviceLat, lng: currentDeviceLong };
            geocoder.geocode({ 'location': latlng }, function (results, status)
            {
                if (status === google.maps.GeocoderStatus.OK)
                {
                    if (results[0])
                    {
                        $$("#lblcurrentLocation").text(results[0].formatted_address);
                        localStorage.setItem("current_Address", results[0].formatted_address);
                    }
                }
            });

        };

        // onError Callback receives a PositionError object 
        function onError(error)
        {

            // show message to turn the GPS on :GPSError

            navigator.geolocation.clearWatch(watchID);

            var correctPage = (mainView.activePage.name == "MapLocationSelect");
            if (correctPage)
            {
                myApp.confirm(GetResourceText("GPSError"), GetResourceText('alert'), function ()
                {
                    if (typeof cordova.plugins.settings.openSetting != undefined)
                    {
                        cordova.plugins.settings.open("location_source", function ()
                        {
                            //console.log("opened settings")
                        }, function ()
                        {
                            //console.log("failed to open settings")
                        });
                    }
                });
                $$(".modal-button").text(GetResourceText('CancelText'));
                $$(".modal-button.modal-button-bold").text(GetResourceText('OkText'));
            }

        }

        var watchID = 0;
        if (isAndroid)
        {
            //calling the get current location functionalty
            watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 8000 });
        }

    }

    // end of get current location . 

    // get current location from the device GPS.
    function getCurrentLocation_Test1(isManual)
    {
        // on success functionalty 
        var onSuccess = function (position)
        {

            //navigator.geolocation.clearWatch(watchID);
            currentDeviceLat = position.coords.latitude;
            currentDeviceLong = position.coords.longitude;
            initialize(isManual);

            localStorage.setItem("currentLat", currentDeviceLat);
            localStorage.setItem("currentLng", currentDeviceLong);

            // get location name 
            var latlng = { lat: currentDeviceLat, lng: currentDeviceLong };
            geocoder.geocode({ 'location': latlng }, function (results, status)
            {
                if (status === google.maps.GeocoderStatus.OK)
                {
                    if (results[0])
                    {
                        $$("#lblcurrentLocation").text(results[0].formatted_address);
                        localStorage.setItem("current_Address", results[0].formatted_address);
                    }
                }
            });

        };

        // onError Callback receives a PositionError object 
        function onError(error)
        {

            // show message to turn the GPS on :GPSError

            //navigator.geolocation.clearWatch(watchID);

            myApp.confirm(GetResourceText("GPSError"), GetResourceText('alert'), function ()
            {
                //if (typeof cordova.plugins.settings.openSetting != undefined)
                //{
                //    //cordova.plugins.settings.open("location_source", function ()
                //    //{
                //    //    //console.log("opened settings")
                //    //}, function ()
                //    //{
                //    //    //console.log("failed to open settings")
                //    //});
                //}
            });
            $$(".modal-button").text(GetResourceText('CancelText'));
            $$(".modal-button.modal-button-bold").text(GetResourceText('OkText'));

        }

        var watchID = 0;
        if (isAndroid)
        {
            //calling the get current location functionalty
            var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 8000 });
        }
        else
        {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }

    }


    // intilize and view the map 
    function initialize(isCurrentLoc)
    {
        var latLngValue = new google.maps.LatLng(currentDeviceLat, currentDeviceLong);
        if (Marker_To != null && Marker_To != "null" && Marker_To != "" && Marker_To != "undefined" && !isCurrentLoc)
        {
            latLngValue = getLatLngFromString(Marker_To);
            $$("#txtDistLocation").text(location_To);
            $$("#txtPickUpLocation").text(location_To);
        }

        //alert(currentDeviceLat + "-" + currentDeviceLong);
        var mapProp = {
            center: latLngValue,//new google.maps.LatLng(currentDeviceLat, currentDeviceLong),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
        };
        mainMap = new google.maps.Map(document.getElementById("googleMapContainer"), mapProp);
        if (Marker_To != null)
        {
            var markerDist = Marker_To.replace("(", "").replace(")", "").split(",");
            drawSelectedLocationMarker(markerDist[0], markerDist[1]);
        }
        // Create the search box and link it to the UI element.
        var input = document.getElementById('search-box-input');
        var searchBox = new google.maps.places.SearchBox(input);
        //mainMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        mainMap.addListener('bounds_changed', function ()
        {
            searchBox.setBounds(mainMap.getBounds());
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', saerchPlace);


        function saerchPlace()
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
                    //console.log("Returned place contains no geometry");
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
                    map: mainMap,
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
            mainMap.fitBounds(bounds);
        }
    }

    // draw the marker in the selected location
    function drawSelectedLocationMarker(lat, lng)
    {
        // Clear out the old markers.
        markers.forEach(function (marker)
        {
            marker.setMap(null);
        });
        markers = [];
        var myCenter = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: myCenter,
            animation: google.maps.Animation.BOUNCE
        });
        markers.push(marker);
        marker.setMap(mainMap);
    }

    // got to current location
    $$("#Current_location_btn").on("click", function ()
    {
        getCurrentLocation(true);
    });

    // Pickup button clicked 
    $$("#btnPickupLocation").on("click", function ()
    {
        geocodeLatLng(geocoder, mainMap, "txtPickUpLocation");
        var pickup = mainMap.getCenter().toString();
        localStorage.setItem("txtPickUpLocation" + reqServiceType, pickup);
        drawSelectedLocationMarker(mainMap.getCenter().lat(), mainMap.getCenter().lng());
        if (pickup != null && pickup != "")
        {
            mainView.router.back({ url: '' });
        }

    });

    // Distenation button click
    $$("#btnDitenationLocation").on("click", function ()
    {
        geocodeLatLng(geocoder, mainMap, "txtDistLocation");
        var dest = mainMap.getCenter().toString();
        localStorage.setItem("txtDistLocation" + reqServiceType, dest);
        drawSelectedLocationMarker(mainMap.getCenter().lat(), mainMap.getCenter().lng());
        if (dest != null && dest != "")
        {
            mainView.router.back({ url: '' });
        }
    });

    $$("#Continue").on("click", function ()
    {
        mainView.router.back({ url: '' });
    });

    // Get location name based on lat lng 
    function geocodeLatLng(geocoder, map, infowindow)
    {
        var mapCenter = map.getCenter();
        var latVal = mapCenter.lat();
        var lngVal = mapCenter.lng();
        //getPlaceName(latVal , lngVal);

        var latlng = { lat: latVal, lng: lngVal };
        geocoder.geocode({ 'location': latlng }, function (results, status)
        {
            if (status === google.maps.GeocoderStatus.OK)
            {
                if (results[0])
                {
                    mainMap.setZoom(17);
                    $$("#" + infowindow).html(results[0].formatted_address);
                    localStorage.setItem(infowindow.replace("txt", "txtValue") + reqServiceType, results[0].formatted_address);
                }
                else
                {
                    $$("#" + infowindow).html(map.getCenter());
                }
            }
            else
            {
                localStorage.setItem(infowindow.replace("txt", "txtValue") + reqServiceType, "");
                // window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    // prepare screen view items
    function PrepaareScreenView()
    {
        var From_field = localStorage.getItem("updatelocationfield");

        var top_map = $$("#googleMapContainer").offset().top;

        var elmnt = document.getElementById("googleMapContainer");
        var height_header = $$("#current_field").css("height");

        var heigh_header_ceil = Number(height_header.replace("px", ""));
        var height_map = $$("#googleMapContainer").css("height");
        var height_picker_H = $$("#position_off").css("height");
        var height_picker_W = $$("#position_off").css("width");
        var heigh_picker_ceil = Number(height_picker_H.replace("px", ""));
        var width_picker_ceil = Number(height_picker_W.replace("px", ""));
        var width_map = $$("#googleMapContainer").css("width");
        var half_map = Number(height_map.replace("px", "")) / 2;
        var half_map_w = Number(width_map.replace("px", "")) / 2;


        var center_map_y = half_map + (heigh_picker_ceil / 2);
        var Y_ceil = Math.ceil(center_map_y) + (heigh_picker_ceil / 2);
        var X_ceil = Math.ceil(half_map_w) - (width_picker_ceil / 2);
        //myApp.alert(center_map_y);

        $$("#position_off").css("top", Y_ceil + "px");
        $$("#position_off").css("left", X_ceil + "px");

        if (From_field == "From")
        {
            $$('.drop-style').css("display", "none");
            $$("#btnAddDest").css("display", "none");
            $$("#btnPickupLocation").hide();
            $$("#btnPickupLocation").show();
            $$("#btnDitenationLocation").hide();
        }
        else if (From_field == "To")
        {
            $$('.drop-style').css("opacity", 1);
            $$('.drop-style').css("margin-top", -22);
            $$('.pickup-style').css("display", "none");
            $$("#btnAddDest").css("display", "none");
            $$("#btnPickupLocation").hide();
            $$("#btnDitenationLocation").show();
        }
    }

    function getPlaceName(lat, lng, fieldToUpdate)
    {
        //https://maps.googleapis.com/maps/api/place/search/json?location=40.805112,-73.960349&rankby=distance&types=establishment&sensor=false&key=AIzaSyB75Qvk1SEDobdZz1X7HonyV1AV_N_PL24
        $$.ajax(
           {
               url: "http://maps.googleapis.com/maps/api/place/search/json?location=" + lat + "," + lng + "&rankby=distance&types=establishment&sensor=false&key=AIzaSyAJH8WkCrIP5pWOjBflQjWuFvzVzBlCbhI",
               method: "Get",
               headers:
               {
                   'Accept-Language': GetServiceLanguage(),
                   Accept: 'application/json'
               },
               success: function (data, xhr, param)
               {
                   myApp.hidePreloader();


               },
               error: function (xhr, status)
               {
                   myApp.alert(GetResourceText("errnoConnection"), GetResourceText('Error'));

               }
           });
    }
});