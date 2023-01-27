new DDVT_Utils.geolocation(pinfo => {
    document.querySelector("textarea").innerHTML = JSON.stringify(pinfo, null, 5);
}, true, true);