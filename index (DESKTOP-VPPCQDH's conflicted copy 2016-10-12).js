var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    //toast("start");
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
//---------------------
$(document).on("pageshow", "#tbl", function () {
    loadtbl();
});
//---------------------
$(document).on("pageshow", "#lect", function () {
    navigator.geolocation.getCurrentPosition(getlocation, onErrorLoc);
    
});

//----------------------------
function getlocation(position) {
    //toast('location ' + position.coords.latitude + ' , ' + position.coords.longitude);
    localStorage.setItem("n", position.coords.latitude);
    localStorage.setItem("e", position.coords.longitude);
    loadlect();
    //navigator.notification.alert(localStorage.getItem("n") + "\n" + localStorage.getItem("e"), alertDismissed, 'مهارات للتدريب', 'موافق');
}
// onError Callback receives a PositionError object
//
function onErrorLoc(error) {
    toast('Location error Please open GPS ');
    localStorage.setItem("n", "");
    localStorage.setItem("e", "");
}

function login() {
    var name = document.getElementById("tbname").value;
    var pass = document.getElementById("tbpass").value;
    if (name == "") {
        toast("please input user name ");
        return;
    }
    if (pass == "") {
        toast("please input user password ");
        return;
    }
    $.ajax({
        type: "POST",
        url: "http://www.attend.somee.com/code/login.ashx",
        data: { name: name, pass: pass },
        success: function (text) {
            //alert(text);
            var arr = text.split("#");
            if (arr[0] == "1") {
                toast(" Welcome " + arr[1]);
                localStorage.setItem("uname", arr[1]);
                localStorage.setItem("uid", name);
                localStorage.setItem("file", "");
                $.mobile.changePage("#student", { role: "page" });
            }
            else {
                toast(arr[1]);
            }
        },
        error: function (data) { toast("error " + data); }
    });

}


//=======================
function loadtbl() {
    var id = localStorage.getItem("uid");

    $.ajax({
        type: "POST",
        url: "http://www.attend.somee.com/code/course.ashx",
        data: { id: id },
        success: function (text) {
           // alert(text);
            var arr = text.split(";");
            $('#ldatat').empty();

            var i = 0;
            for (i = 1; i < arr.length; i++) {

                var ar = arr[i].split(',');
                //alert(ar.length);
                var data = "<div><h2>  Section :  " + ar[0] + "</h2>";
                data += "<h2>  Course :  " + ar[1] + " : " + ar[2] + "</h2>";
                data += "<h2>  Profssor :  " + ar[3] + " : " + ar[4] + "</h2></div>";
               // alert(data);
                $('<li data-icon="false" >').append(data).appendTo('#ldatat');
            }
            $('#ldatat').listview().listview('refresh');
        },
        error: function (data) { toast("error " + data); }
    });
}
//------------------------

//=======================
function loadlect() {
    var id = localStorage.getItem("uid");


    $.ajax({
        type: "POST",
        url: "http://www.attend.somee.com/code/lect.ashx",
        data: { id: id },
        success: function (text) {
            //alert(text);
            var arr = text.split(";");
            $('#ldatal').empty();

            var i = 0;
            for (i = 1; i < arr.length; i++) {

                var ar = arr[i].split(',');
                //alert(ar.length);
                var n1 = ar[6];
                var e1 = ar[7];
                var distance = parseInt(getDistanceFromLatLonInKm(parseFloat(e1), parseFloat(n1)));
                alert(distance);
                if (distance <= 20) {
                    var data = "<a href='javascript:take(\"" + ar[5] + "\")'><div><h2>  Section :  " + ar[0] + "</h2>";
                    data += "<h2>  Course :  " + ar[1] + " : " + ar[2] + "</h2>";
                    data += "<h2>  Profssor :  " + ar[3] + " : " + ar[4] + "</h2></div></a>";
                    // alert(data);
                    $('<li data-icon="false" >').append(data).appendTo('#ldatal');
                }
            }
            $('#ldatal').listview().listview('refresh');
        },
        error: function (data) { toast("error " + data); }
    });
}
//------------------------
function take(lid) {
    localStorage.setItem("lid", lid);
    $.mobile.changePage("#cam", { role: "page" });
}
// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('picture');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
    
    var data = "data:image/jpeg;base64," + imageData;
    $.ajax({
        type: "POST",
        url: "http://www.attend.somee.com/Saveimage.ashx",

        data: { data: data },
        success: function (par) {
            toast('file name '+par);
            localStorage.setItem("file", par);
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        },
        error: function (par) {
            //toast("error : " + par);
        }
    });
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('picture');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    largeImage.src = imageURI;

}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    //alert("Start");
    //testface(this);
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL, correctOrientation: true
    });

}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL, correctOrientation: true
    });

}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}

//----------------------------
function onSuccess(position) {
    //toast('location ' + position.coords.latitude + ' , ' + position.coords.longitude);
    localStorage.setItem("n", position.coords.latitude);
    localStorage.setItem("e", position.coords.longitude);
    var n = position.coords.latitude;
    var e = position.coords.longitude;
    var id = localStorage.getItem("uid");
    var lid = localStorage.getItem("lid");
    var sfile = localStorage.getItem("file");
    try {
        $.ajax({
            type: "POST",
            url: "http://www.attend.somee.com/code/studentsave.ashx",
            data: { id: id ,n:n ,e:e , lid:lid,sfile:sfile},
            success: function (text) {
                toast(text);
            },
            error: function (data) { toast("error " + data); }
        });

    }
    catch (ex) {toast(ex);}
    //navigator.notification.alert(localStorage.getItem("n") + "\n" + localStorage.getItem("e"), alertDismissed, 'مهارات للتدريب', 'موافق');
}
// onError Callback receives a PositionError object
//
function onError(error) {
    toast('Location error Please open GPS ');
    localStorage.setItem("n", "");
    localStorage.setItem("e", "");
}
//============== message 
var toast = function (msg) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + msg + "</h3></div>")
.css({ display: "block",
    opacity: 0.90,
    position: "fixed",
    padding: "7px",
    color: "#FFFFFF",
    "background-color": "#000000",
    "text-align": "center",
    width: "270px",
    left: ($(window).width() - 284) / 2,
    top: $(window).height() / 2
})
.appendTo($.mobile.pageContainer).delay(1500)
.fadeOut(400, function () {
    $(this).remove();
});
}


//-----------------------------

//==================
function getDistanceFromLatLonInKm(lat2, lon2) {
    var n = localStorage.getItem("n");
    var e = localStorage.getItem("e");
    var lat1 = parseFloat(n);
    var lon1 = parseFloat(e);
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c*1000; // Distance in m
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
