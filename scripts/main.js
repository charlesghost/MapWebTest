/**
 * Created by abcd on 19/03/2017.
 */


$(function() {

    var myPosition;
    var map;

    // Multiple markers location, latitude, and longitude
    var globalMarkers = [
        ['Grove Lamp post', 51.588256, -0.230552
            , '<div class="info_content">' +
        '<h3>Grove Lamp</h3>' +
        '<p></p>' + '</div>'
        ],
        ['79 The Burrows', 51.588770, -0.228663
            , '<div class="info_content">' +
        '<h3>79 The Burrows</h3>' +
        '<p></p>' +
        '</div>'
        ],
        ['Portakabin 6 and 7', 51.589623, -0.230066
            , '<div class="info_content">' +
        '<h3>Portakabin 6 and 7</h3>' +
        '<p></p>' +
        '</div>'
        ]
    ];

    function getMarkers() {
        return [
            ['Grove Lamp post', 51.588256, -0.230552
                , '<div class="info_content">' +
            '<h3>Grove Lamp</h3>' +
            '<p></p>' + '</div>'
            ],
            ['79 The Burrows', 51.588770, -0.228663
                , '<div class="info_content">' +
            '<h3>79 The Burrows</h3>' +
            '<p></p>' +
            '</div>'
            ],
            ['Portakabin 6 and 7', 51.589623, -0.230066
                , '<div class="info_content">' +
            '<h3>Portakabin 6 and 7</h3>' +
            '<p></p>' +
            '</div>'
            ]
        ];
    }

    function getMyposition() {
        navigator.geolocation.getCurrentPosition(function (position) {
            myPosition = position
        });
    }

    function updateMap() {
        getMyposition();
        var markers = globalMarkers;

        if (myPosition != undefined) {
            markers.push(['charles', myPosition.coords.latitude, myPosition.coords.longitude
                    , '<div class="info_content">' +
                    '<h3>Your Position</h3>' +
                    '<p></p>' +
                    '</div>'
                ]
            );
        }
        drawMarkers(map, markers);
    }

    function initMap() {
        getMyposition();
        globalMarkers = getMarkers();
        map = drawMap();
        // Call the autoUpdate() function every 5 seconds
        setTimeout(updateMap, 2000);


    }



    function drawMap() {
        var map;
        var mapOptions = {
            mapTypeId: 'roadmap'
        };
        // Display a map on the web page
        map = new google.maps.Map(document.getElementById("maps"), mapOptions);
        map.setTilt(50);
        // Set zoom level
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
            this.setZoom(14);
            google.maps.event.removeListener(boundsListener);
        });
        return map;
    }

    function drawMarkers(map, markers) {

        var bounds = new google.maps.LatLngBounds();

        // Add multiple markers to map
        var infoWindow = new google.maps.InfoWindow(), marker, i;

        // Place each marker on the map
        for (i = 0; i < markers.length; i++) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            var content = markers[i][3];
            bounds.extend(position);

            if(i == markers.length -1)
            {
                marker = new google.maps.Marker({
                position: position,
                map: map,
                title: content,
                icon: 'markernew.png'
                 })
            }
            else {
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: content,
                });
            }

            // Add info window to marker
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var html = markers[i][3];
                    var distance = getDistanceBetweenMarkers(marker.position.lat(), marker.position.lng()
                        , myPosition.coords.latitude, myPosition.coords.longitude);
                   // alert(distance);
                    if (distance <100 && distance > 0) // less than 100m
                    {
                        html = html + '<div> You are Close!</div>';
                        playSound();
                    }
                    else if(distance == 0)
                        {
                        html = html + '<div> This is you</div>';
                    }
                    else {
                        html = html + '<div> You are far!</div>';
                    }
                    infoWindow.setContent(html);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Center the map to fit all markers on the screen
            map.fitBounds(bounds);
        }
    }

    function getDistanceBetweenMarkers(lat1, lng1, lat2, lng2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lng2 - lng1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km

        return  Math.floor( d * 1000);
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    function playSound() {
        document.getElementById('myTune').play();
    }


        google.maps.event.addDomListener(window, 'load', initMap);


});







