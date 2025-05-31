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
    for (var laureate of data["laureates"]) {
      for (var prize of laureate["prizes"]) {
        if (!category.includes(prize["category"])) {
          category.push(prize["category"]);
        }
      }
    }

    return category;
  };

  // Function to segregate the countries and the count of prizes based on the category given
  const countByCountryAndCategory = (data, category) => {
    let country_count = {};
    for (var laureate of data["laureates"]) {
      for (var prize of laureate["prizes"]) {
        if (prize["category"] == category) {
          // If bornCountry is available, Take borncountry.
          if (laureate["bornCountry"] != undefined) {
            var country = laureate["bornCountry"];

            // Check if the country has a "now" keyword in it. It means we have to change the string become counting it
            if (laureate["bornCountry"].includes("now")) {
              var index = laureate["bornCountry"].indexOf("now");
              var length = laureate["bornCountry"].length;
              country = laureate["bornCountry"].slice(index + 4, length - 1);
            }

            // Check if key already exist in the object, else add it
            if (!(country in country_count)) country_count[country] = [1, []];
            else country_count[country][0]++;

            // Get all the necessary details from JSON and add it to the object
            let laureates = {};
            laureates["ID"] = laureate["id"];
            laureates["Full Name"] =
              laureate["firstname"] + " " + laureate["surname"];
            laureates["Date awarded"] = prize["year"];
            laureates["Category"] = prize["category"];
            laureates["birthYear"] = laureate["born"].slice(0, 4);
            country_count[country][1].push(laureates);
          }
        }
      }
    }

    // Return the count
    return country_count;
  };

  // Function to form the default elements required
  const formDefaultElements = () => {
    let headings = ["ID", "Full name", "Date", "Category", "Show details"];

    const body = document.querySelector("body");
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("main");

    const sections = document.createElement("div");
    sections.classList.add("sections");

    const table = document.createElement("table");
    table.classList.add("display", "table");

    const tableHeader = document.createElement("th");
    tableHeader.colSpan = 5;
    tableHeader.classList.add("table-header");

    const tableRow = document.createElement("tr");
    for (let i = 0; i < 5; i++) {
      const tableItem = document.createElement("th");
      tableItem.innerText = headings[i];
      tableRow.appendChild(tableItem);
    }

    table.appendChild(tableHeader);
    table.appendChild(tableRow);

    mainDiv.appendChild(sections);
    mainDiv.appendChild(table);

    body.appendChild(mainDiv);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay", "display");

    const popup = document.createElement("div");
    popup.classList.add("popup");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "close";

    const label = document.createElement("label");
    label.htmlFor = "close";
    label.classList.add("close");

    const span1 = document.createElement("span");
    const span2 = document.createElement("span");

    const overlayHeader = document.createElement("h1");
    overlayHeader.classList.add("overlay-header");

    const overlayPara = document.createElement("p");
    overlayPara.classList.add("overlay-para");

    label.appendChild(span1);
    label.appendChild(span2);

    popup.appendChild(input);
    popup.appendChild(label);
    popup.appendChild(overlayHeader);
    popup.appendChild(overlayPara);

    overlay.appendChild(popup);

    body.appendChild(overlay);
  };

  // Function to form the elements given the category and the countries information
  const formElements = (category, countries) => {
    const main_section = document.querySelector(".sections");
    const section = document.createElement("section");
    section.classList.add("." + category);

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
        if (event.target.parentElement.children[1] != item) {
          item.classList.add("display");
        }
      });
      div.classList.toggle("display");
    });

    const list = document.createElement("ol");
    list.classList.add("list");

    for (let country in countries) {
      const listElement = document.createElement("li");
      listElement.classList.add("list-item");
      listElement.innerHTML =
        country +
        " : " +
        countries[country][0] +
        '<button class = "show-laureate">Show Laureates</button>';
      list.appendChild(listElement);
    }

    div.appendChild(list);
    section.appendChild(div);
    main_section.appendChild(section);
  };

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
            for (let prize of prizes["prizes"]) {
              if ("laureates" in prize) {
                for (let laureate of prize["laureates"]) {
                  if (laureate["id"] == element.children[0].innerText) {
                    overlay.classList.remove("display");
                    main.classList.add("blur");
                    const length = laureate["motivation"].length;
                    const motivation = laureate["motivation"].slice(
                      1,
                      length - 1
                    );
                    const age =
                      Number(prize["year"]) -
                      Number(element.children[4].innerText);
                    overlayHeader.innerText = element.children[1].innerText;
                    overlayPara.innerText =
                      "In " +
                      prize["year"] +
                      ", at the age of " +
                      age +
                      ", " +
                      laureate["firstname"] +
                      " " +
                      laureate["surname"] +
                      " received a nobel prize in " +
                      prize["category"] +
                      " " +
                      motivation;
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
          for (let row of tableRow) {
            table.removeChild(row);
          }
          table.classList.remove("display");
          const section =
            event.target.parentElement.parentElement.parentElement
              .parentElement;
          const length = section.children[0].innerHTML.length;
          const category = section.children[0].innerHTML
            .toLowerCase()
            .slice(0, length - 3);
          const country = event.target.parentElement;
          const index = country.innerText.indexOf(":");
          const countryName = country.innerText.slice(0, index - 1);
          tableHeader.innerHTML =
            "Nobel Laureates in " + category + " from " + countryName;

          const laureateInfo = categories[category][countryName][1];
          for (let laureate of laureateInfo) {
            const tr = document.createElement("tr");
            tr.classList.add("row-data");
            for (let info in laureate) {
              const td = document.createElement("td");
              if (info == "Category") {
                const length = laureate[info].length;
                td.innerText =
                  laureate[info].toUpperCase().slice(0, 1) +
                  laureate[info].slice(1, length);
              } else {
                td.innerText = laureate[info];
              }

              if (info == "birthYear") {
                td.classList.add("age");
              }
              tr.appendChild(td);
            }
            const lastTd = document.createElement("td");
            lastTd.innerHTML = '<button class = "show-more">Show More</button>';
            tr.appendChild(lastTd);
            table.appendChild(tr);
          }

          // Send the prize details to the showMoreButtonHandler function. This is needed there.
          showMoreButtonHandler(prizes);
        });
      });
    };
  };

  // Get all the categories
  let catergoryList = getAllCategories(data);

  // Search the json for getting the count for every country given the category
  let categories = {};
  for (let category of catergoryList.reverse()) {
    let countryCount = countByCountryAndCategory(data, category);
    categories = { [category]: countryCount, ...categories };
  }

  // Sort the categories object and get the top 5 countries
  // Sort reference - https://www.w3schools.com/js/js_array_sort.asp
  // Reduce reference - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  // Object.entries reference - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
  for (let category in categories) {
    categories[category] = Object.entries(categories[category])
      .sort(([countryA, [valueA]], [countryB, [valueB]]) => {
        if (valueA !== valueB) {
          return valueB - valueA;
        } else {
          if (countryA > countryB) {
            return 1;
          } else {
            return -1;
          }
        }
      })
      .slice(0, 5)
      .reduce((acc, [country, value]) => {
        acc[country] = value;
        return acc;
      }, {});
  }

  formDefaultElements();

  // Send the categories object with the top 5 countries and form the element.
  // 6 buttons for categories and a list of top 5 countries for each categories with a show-laureates button
  for (let category in categories) {
    formElements(category, categories[category]);
  }

  // This handles the rest of the functionality from creating the tables to showing the biography of the laureate.
  prizeJsonHandler(categories);

  // Handles overlay functionality
  const overlay = document.querySelector(".overlay");
  const main = document.querySelector(".main");
  document.querySelector(".close").addEventListener("click", () => {
    overlay.classList.add("display");
    main.classList.remove("blur");
  });
};

// Request to get the laureates.json
xmlhttp.open("GET", url, true);
xmlhttp.send();
