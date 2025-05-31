var xmlhttp = new XMLHttpRequest();
var url = "laureate.json";

// Get the laureate.json and sends it as an object to main, where everything else happens
xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var data = JSON.parse(xmlhttp.responseText);
        main(data);
    }
};

// All functionality with the laureate.json implemented inside main.
const main = (data) => {

    // Function to get all the categories from the JSON
    const getAllCategories = (data) => {
        let category = ["physics"];
        for(var laureate of data["laureates"]){
            for(var prize of laureate["prizes"]){
                if(!(category.includes(prize["category"]))){
                    category.push(prize["category"]);
                }
            }
        }

        return category;

    };

    // Function to segregate the countries and the count of prizes based on the category given 
    const countByCountryAndCategory = (data, category) => {
        let country_count = {};
        for(var laureate of data["laureates"]){
            for(var prize of laureate["prizes"]){
                if(prize["category"] == category){
                    for(var affiliation of prize["affiliations"]){
                        let exist = false;
                        
                        // If affiliation has a key with country, Take country from affiliation
                        if("country" in affiliation){
                            var country = affiliation["country"];
                            // Check if the country has a "now" keyword in it. It means we have to change the string become counting it
                            if(affiliation["country"].includes("now")){
                                var index = affiliation["country"].indexOf("now");
                                var length = affiliation["country"].length;
                                country = affiliation["country"].slice(index + 4, length - 1);
                            }

                            // Check if key already exist in the object, else add it
                            if(!(country in country_count)) country_count[country] = [1, []];
                            else country_count[country][0]++;

                            // Check if the information of the 
                            for(let i of country_count[country][1]){
                                if(i["Full Name"].includes(laureate["firstname"] + " " + laureate["surname"]) && i["Date awarded"] == prize["year"]){
                                    exist = true;
                                    break;
                                }
                            }

                            if(exist == true){
                                continue;
                            }
                            
                            let laureates = {}
                            laureates["ID"] = laureate["id"];
                            laureates["Full Name"] = laureate["firstname"] + " " + laureate["surname"];
                            laureates["Date awarded"] = prize["year"];
                            laureates["Category"] = prize["category"]
                            laureates["birthYear"] = laureate["born"].slice(0,4);
                            
                            country_count[country][1].push(laureates);
                        }

                        // otherwise, If bornCountry is available, Take borncountry.
                        else if (laureate["bornCountry"] != undefined){
                            var country = laureate["bornCountry"];
                            if(laureate["bornCountry"].includes("now")){
                                var index = laureate["bornCountry"].indexOf("now");
                                var length = laureate["bornCountry"].length;
                                country = laureate["bornCountry"].slice(index + 4, length - 1);
                            }

                            if(!(country in country_count)) country_count[country] = [1, []];
                            else country_count[country][0]++;

                            for(let i of country_count[country][1]){
                                if(i["Full Name"].includes(laureate["firstname"] + " " + laureate["surname"]) && i["Date awarded"] == prize["year"]){
                                    console.log(i)
                                    exist = true;
                                }
                            }

                            if(exist == true){
                                continue;
                            }

                            let laureates = {}
                            laureates["ID"] = laureate["id"];
                            laureates["Full Name"] = laureate["firstname"] + " " + laureate["surname"];
                            laureates["Date awarded"] = prize["year"];
                            laureates["Category"] = prize["category"];
                            laureates["birthYear"] = laureate["born"].slice(0,4);
                            country_count[country][1].push(laureates);
                        }
                        break;
                    }
                }
            }
        }
        return country_count;
    };

    // Function to form the elements given the category and the countries information
    const formElements = (category, countries) => {
        const section = document.querySelector("." + category);

        const div = document.createElement("div");
        div.classList.add("countries", "display");

        const para = document.createElement("p");
        para.classList.add("section-header");
        para.innerHTML = category.toUpperCase() + " | ";
        section.appendChild(para);

        // Listener to the category buttons at the start of the page
        para.addEventListener("click", (event) => {
            const divs = document.querySelectorAll(".countries");
            divs.forEach((item) => {
                if(event.target.parentElement.children[1] != item){
                    item.classList.add("display")
                }
            });
            div.classList.toggle("display");
        });

        const list = document.createElement("ol");
        list.classList.add("list")

        for(let country in countries){
            const listElement = document.createElement("li");
            listElement.classList.add("list-item")
            listElement.innerHTML = country + " : " +  countries[country][0] + "<button class = \"show-laureate\">Show Laureates</button>";
            list.appendChild(listElement);
        }

        div.appendChild(list);
        section.appendChild(div);
    }

    // Function to extract data from the prize.json and get the data for final overlay
    const prizeJsonHandler = (categories) => {
        var xmlhttp = new XMLHttpRequest();
        var url = "prize.json";

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = JSON.parse(xmlhttp.responseText);
                buttonHandler(categories, data);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        // Handles the functionality of the show-laureates button and show-more buttons
        const buttonHandler = (categories, prizes) => {
            // Handles show more button. This is called at the end. 
            //This does nothing but attaches a click listener to all the show-more buttons
            const showMoreButtonHandler = (prizes) => {
                const buttons = document.querySelectorAll(".show-more");
                buttons.forEach((item) => {
                    item.addEventListener("click", (event) => {
                        const overlay = document.querySelector(".overlay");
                        const main = document.querySelector(".main");
                        const overlayHeader = document.querySelector(".overlay-header");
                        const overlayPara = document.querySelector(".overlay-para");
                        const element = event.target.parentElement.parentElement;
                        for(let prize of prizes["prizes"]){
                            if("laureates" in prize){
                                for(let laureate of prize["laureates"]){
                                    if(laureate["id"] == element.children[0].innerText){
                                        overlay.classList.remove("display");
                                        main.classList.add("blur");
                                        const length = laureate["motivation"].length
                                        const motivation = laureate["motivation"].slice(1, length - 1);
                                        const age = Number(prize["year"]) - Number(element.children[4].innerText) 
                                        overlayHeader.innerText = element.children[1].innerText;
                                        overlayPara.innerText = "In " + prize["year"] + ", at the age of " 
                                                                    + age + ", "
                                                                    + laureate["firstname"] + " " + laureate["surname"]
                                                                    + " received a nobel prize in " + prize["category"]
                                                                    + " " + motivation;
                                    }
                                }
                            }
                        }
                    });
                });
            };
    
            // Get all show-laureate button. 
            const button = document.querySelectorAll(".show-laureate");
            const table = document.querySelector(".table");
            const tableHeader = document.querySelector(".table-header");
    
            // Attach a click listener to the show-laureate buttons. Form the tables entries when pressed
            button.forEach((item) => {
                item.addEventListener("click", (event) => {
                    const tableRow = document.querySelectorAll(".row-data");
                    for(let row of tableRow){
                        table.removeChild(row);
                    }
                    table.classList.remove("display");
                    const section = event.target.parentElement.parentElement.parentElement.parentElement;
                    const length = section.children[0].innerHTML.length;
                    const category = section.children[0].innerHTML.toLowerCase().slice(0, length - 3);
                    const country = event.target.parentElement;
                    const index = country.innerText.indexOf(":")
                    const countryName = country.innerText.slice(0, index - 1);
                    tableHeader.innerHTML = "Nobel Laureates in " + category + " from " + countryName;  
                                         
                    const laureateInfo = categories[category][countryName][1];
                    for(let laureate of laureateInfo){
                        const tr = document.createElement("tr");
                        tr.classList.add("row-data");
                        for(let info in laureate){
                            const td = document.createElement("td");
                            if (info == "Category"){
                                const length = laureate[info].length
                                td.innerText = laureate[info].toUpperCase().slice(0,1) + laureate[info].slice(1,length);
                            }
                            else{
                                td.innerText = laureate[info];
                            }

                            if(info == "birthYear"){
                                td.classList.add("age")
                            }
                            tr.appendChild(td);
                        }
                        const lastTd = document.createElement("td");
                        lastTd.innerHTML = "<button class = \"show-more\">Show More</button>" 
                        tr.appendChild(lastTd);
                        table.appendChild(tr);
                    }

                    // Send the prize details to the showMoreButtonHandler function. This is needed there.
                    showMoreButtonHandler(prizes);
                });
            });
        };
    }

    // Get all the categories
    let catergoryList = getAllCategories(data);

    // Search the json for getting the count for every country given the category
    let categories = {};
    for(let category of catergoryList){
        let countryCount = countByCountryAndCategory(data, category);
        categories = { [category] : countryCount, ...categories };
    }

    // Sort the categories object and get the top 5 countries
    // Sort reference - https://www.w3schools.com/js/js_array_sort.asp
    // Reduce reference - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    // Object.entries reference - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for(let category in categories){
        categories[category] = Object.entries(categories[category])
                                .sort(([countryA, [valueA, ]], [countryB, [valueB, ]]) => {
                                    if(valueA !== valueB){
                                        return valueB - valueA
                                    }
                                    else{
                                        if(countryA > countryB){
                                            return 1
                                        } 
                                        else{
                                            return -1
                                        }
                                    }
                                })
                                .slice(0, 5)
                                .reduce((acc, [country, value]) => {
                                    acc[country] = value;
                                    return acc;
                                }, {});

    }

    // Send the categories object with the top 5 countries and form the element. 
    // 6 buttons for categories and a list of top 5 countries for each categories with a show-laureates button
    for(let category in categories){
        formElements(category, categories[category]);
    }

    // This handles the rest of the functionality from creating the tables to showing the biography of the laureate.
    prizeJsonHandler(categories);

    // Handles overlay functionality
    const overlay = document.querySelector(".overlay");
    const main = document.querySelector(".main");
    document.querySelector(".close").addEventListener("click", () => {
        overlay.classList.add("display");
        main.classList.remove("blur")
    });
};


// Request to get the laureates.json
xmlhttp.open("GET", url, true);
xmlhttp.send();