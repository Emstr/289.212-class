var Places = [
                [document.getElementById("auckland"), 0, "AKL"],
                [document.getElementById("bay_of_plenty"), 0, "TRG"],
                [document.getElementById("canterbury"), 0, "CHC"],
                [document.getElementById("gisborne"), 0, "GIS"],
                [document.getElementById("hawkes_bay"), 0, "NPE"],
                [document.getElementById("marlborough"), 0, "BHE"],
                [document.getElementById("manawatu_wanganui"), 0, "PMR"],
                [document.getElementById("nelson"), 0, "NSN"],
                [document.getElementById("northland"), 0, "WRE"],
                [document.getElementById("otago"), 0, "DUD"],
                [document.getElementById("southland"), 0, "IVC"],
                [document.getElementById("tasman"), 0, "NSN"],
                [document.getElementById("taranaki"), 0, "NPL"],
                [document.getElementById("waikato"), 0, "HLZ"],
                [document.getElementById("wellington"), 0, "WLG"],
                [document.getElementById("west_coast"), 0, "HKK"],
                
            ];

var highestprice = 0;

var currentlySelected = false;

function getColor(value){
    //value from 0 to 1
    var hue= ((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,45%)"].join("");
};

function TC(str) {
                
            }

function formatText(str) {
    
    str = str.replace(/_/g, " ",)
    
    str = str.replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
    return str.replace(/Of/g, "of"); //Article decapitalize – grammar!
    
}

function paintAll() {
    Places.forEach(function(place) {
        if (place[1] > 0) {
                place[0].style.fill = getColor(place[1]/highestprice)
            } else if (place[1] == 0){
                place[0].style.fill = '#666'
            } else if (place[1] == -1) {
                place[0].style.fill = "white"
            }
    })
}

function reset() {
    Places.forEach(function(place) {
        place[0].style.fill = "black"
        document.getElementById("exit-button").style.display = "none"
        
    })
    
    document.getElementById("title").innerHTML = "Select a location to get started"
    
    document.getElementById("place_name").innerHTML = "";
    document.getElementById("price").innerHTML = "";
    
}

Places.forEach(function(place) {
    place[0].addEventListener('click', function() {
        
        if (!currentlySelected) {
            
            place[0].style.fill = "white";
            
            var currentPlace = place[2]
        
            currentlySelected = true;

            document.getElementById("title").innerHTML = "Currently selected origin: " + formatText(place[0].id);

            document.getElementById("exit-button").style.display = "block"
            
            document.getElementById("place_name").innerHTML = "Now tap any of the coloured locations to see price data"

            document.getElementById("exit-button").addEventListener("click", function() {
                reset()
                currentlySelected = false;
            })


            highestprice = 0; //reset
            for (var i = 0; i < Places.length; i++) {

                Places[i][1] = 0; 
                makeRequest(currentPlace, i, place);
            }
            
            place[1] = -1;
            
        }
        

    });
    
    place[0].addEventListener('mouseover', function() {
        
        if (currentlySelected) {
            place[0].style.fill="blue"
            
            console.log(place[1])
            
            document.getElementById("place_name").innerHTML = "Destination: " + formatText(place[0].id);
            
            if (place[1]>0) {
                document.getElementById("price").innerHTML = "Cost of one-way air travel with Air New Zealand: $" + place[1];
            } else {
                document.getElementById("price").innerHTML = "No flights were found between these locations"
            }
            
            
            
            
        } else {
            this.style.fill='white';
            document.getElementById("title").innerHTML = "Hovered location: " + formatText(place[0].id);
        }
        
        

    });
    
    place[0].addEventListener('mouseout', function() {
        
        if (currentlySelected) {
            
            if (place[1] > 0) {
                place[0].style.fill = getColor(place[1]/highestprice)
            } else if (place[1] == 0){
                place[0].style.fill = '#666'
            } else if (place[1] == -1) {
                place[0].style.fill = "white"
            };
            
        } else {
            this.style.fill='black';
            document.getElementById("title").innerHTML = "Select a location to get started"
        }
        

    });
});

function makeRequest(originCode, desCode, place) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    var destination = Places[desCode][2];


    xhr.open("GET", "https://api.airnz.io/api/v1/cached-flight-prices?countryCode=NZ&originCityCode="+ originCode+"&destinationCityCode=" + destination + "&fromDate=2018-11-26&toDate=2018-11-26");
    xhr.setRequestHeader("Authorization", "Bearer eyJraWQiOiJhaXJuei1nZW4tand0IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJBaXIgTmV3IFplYWxhbmQtc3VtbWVyLW9mLXRlY2giLCJhdWQiOiJBaXJOWlByb2QiLCJpc3MiOiJBaXJOWi1EaWdpdGFsU2hhcmVkUGxhdGZvcm1zIiwic2NvcGVzIjoiZmxpZ2h0X29mZmVyczpwPS9hcGkvdjEvZmxpZ2h0LW9mZmVycyBsb2NhdGlvbiBjYWNoZWRfZmxpZ2h0X3ByaWNlcyIsImV4cCI6MTU0MjI3OTYwMH0.eqXGrIGPl9Mv_LmZ5Nkncd6fNEWqn5SE3mHMMzGESfuS56mm-9B70trVO6V9uvmu1-jJMiZs9NWln5I90BY064XALiXsepDiU6iS01lmX81ihudgPP2a5kbkPuxTsvszJGCPHkWXyDL01t9rRsxnUQA-4DcZPdWWcUQFDuN9EoI_IQv3xawZpN2lWiITQE9WI3C4IhLIHTPMsP-Zl3Wx2Q6RMb2JUBSjz_2yqma0gpBS53xJH8vef3d1LXR4FN4KVBF_oz8yD86lJn8bXhsaDKwE8EiqRywtOOZ-Q0KX15oV6dQxF5Y_ojnTusu_pttWEEMWr0ioUtSfi_clhnR6rA");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "25cb5c96-7707-4db9-a18d-51b8ca5bd512");

    xhr.send(data);
    
    xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status == 200) {
                //console.log(this.responseText);
                APIdata = JSON.parse(this.responseText)

                Places[desCode][1] = APIdata.prices[0].adultPriceIncludingTax;

                place[0].style.fill = "white";
                place[1] = -1

                if (Places[desCode][1] > highestprice){
                    highestprice = Places[desCode][1]
                }

                paintAll();

                } else if (this.status == 400) {
                    price[1] = -20;

                } else if (this.status == 503 || this.status == 502 || this.status == 504) {
                    console.log("The API has reached capacity – wait 10-15 minutes to get let back in")
                }

                });
                }
