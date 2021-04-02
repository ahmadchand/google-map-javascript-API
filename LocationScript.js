var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
var marker;

function addYourLocationButton(map, marker) {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '30px';
    firstChild.style.height = '30px';
    firstChild.style.borderRadius = '5px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '15px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '30px';
    secondChild.style.height = '30px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '-161px 2px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);


    firstChild.addEventListener('click', function () {
        var imgX = '0';
        var animationInterval = setInterval(function () {
            if (imgX == '-18') imgX = '0';
            else imgX = '-18';
        }, 500);
        debugger
        if (navigator.geolocation) {
            infowindow.close();
            navigator.geolocation.getCurrentPosition(function (position) {                
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                marker.setPosition(latlng);
                map.setCenter(latlng);

                marker.setVisible(true);

                geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            bindDataToForm(results[0].formatted_address, marker.getPosition().lat(), marker.getPosition().lng());
                            infowindow.setContent('Address: ' + results[0].formatted_address + '<br>Cordinates:  ' + marker.getPosition().toUrlValue(6));
                            infowindow.open(map, marker);
                        }
                    }
                });
                //infowindow.open(map, marker);
            });
        }
        else {
            clearInterval(animationInterval);
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function initialize() {
    var latlng = new google.maps.LatLng(31.452310943168865, 74.29301563890633);
    var map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: 15
    });
    marker = new google.maps.Marker({
        map: map,
        position: latlng,
        animation: google.maps.Animation.DROP,
        draggable: true,
        anchorPoint: new google.maps.Point(0, -29)
    });

    addYourLocationButton(map, marker);

    var input = document.getElementById('searchInput');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setComponentRestrictions({
        country: ["pk"],
    });
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        bindDataToForm(place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng());
        infowindow.setContent('Address: ' + place.formatted_address + '<br>Cordinates:  ' + place.geometry.location.lat() + ', ' + place.geometry.location.lng());
        infowindow.open(map, marker);

    });
    // this function will work on marker move event into map
    google.maps.event.addListener(marker, 'dragend', function () {
        geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    bindDataToForm(results[0].formatted_address, marker.getPosition().lat(), marker.getPosition().lng());
                    infowindow.setContent('Address: ' + results[0].formatted_address + '<br>Cordinates:  ' + marker.getPosition().lat() + ', ' + marker.getPosition().lng());
                    infowindow.open(map, marker);
                }
            }
        });
    });

}

function bindDataToForm(address, lat, lng) {
    document.getElementById('location').value = address;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
}
google.maps.event.addDomListener(window, 'load', initialize);