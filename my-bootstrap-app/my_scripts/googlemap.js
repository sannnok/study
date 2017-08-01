  function myMap() {
    var myCenter = new google.maps.LatLng(47.049971, 28.869012);
    var mapProp = { center: myCenter, zoom: 16, scrollwheel: false, draggable: false, mapTypeId: google.maps.MapTypeId.ROADMAP };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var marker = new google.maps.Marker({ position: myCenter });
    marker.setMap(map);
  }