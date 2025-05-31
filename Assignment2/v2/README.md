<------------------------------------------------------------------------------------------------------------------------------------------>

Few things to note here. 

1. I did a lot of research on how the counting is done. Do we take the country to which the laureate is affiliated to or do we take his country of origin. Both seem to be a correct way. I did both of the approaches to check the count. I also checked many resources to see the actual count. The json given is not an approriate one. If we went with counting affiliations, some laureates mainly in the categories of peace and literature dont have any affiliations. So i decided to go with bornCountry as my primary count. Some laureates dont even have bornCountry. I had to leave those.

2. The HTML file has "NOTHING". Every element comes from the javascript and javascript alone. There html file just has the doctype and the basic <head> and <body> tags.

3. Since this project tested us on javascript, I didnt give much attention to the responsiveness. I just made sure nothing breaks in a higher screen width (Desktop view). I didnt write any separate media query. The css is very simple and readable. 

<------------------------------------------------------------------------------------------------------------------------------------------>

Now to the script

The script start by extracting the data from laureate.json

In the onReadyStateChange() Function the data from laureate.json is sent to the main() function, Where the rest of the functionality is implemented.

1. The first thing that we want to do is get all the available categories from the data.
   getAllCategories() function does this and returns a list of categories

2. We want to then go into the json, And for each categories, count the number of prizes for each country. There are few tricky things to notice here. Do we take the country to which the laureate is affiliated to or do we take his country of origin. I took the country of origin here. Another thing to notice here is in the data, Some countries are given 2 name, One name from the past which doesnt exist anymore and its current name. I decided to count the prize against the current countries name. I had to implement a logic for this. Not only we need the count, We also need the necessary information of the laureate, like "Name", "Date awarded", "category", and "birthYear". 
   My final object looks as follows

country_count = { "country_name" : ["number of prizes", [{laureate_Info},{laureate_Info},{laureate_Info},.....,{laureate_Info}]]}

This object will be returned.

3. We then want to go through the object and sort it in descending order based on the value and the first 5 values Since we only want top 5 countries. If 2 countries have the same count, I am sorting based on the country name

4. We can now form the elements. If you see the HTML file, There is nothing there. All the elements are getting formed inside the JS file.
   There are 2 functions to achieve this. formDefaultElements() will form the default elements that are required. formElements will form the rest of the elements, like the tables, show-laureates buttons, the top 5 countries in each categories etc.

5. After forming the tables, call the prizeJsonHandler(categories) function. This does few things
   - Reads the prize.json
   - Sends the data to buttonHandler(categories, prizes). The button handler function handlers the click events of all the buttons. Both the show laureate buttons and show details buttons. 
   - It has 2 sets of event listenes for the click events that are about to happen. 
   - When a click event occurs, It take the necessary details from object that we got ready from parsing the given data. 

6. When show details is pressed, a popup is presented with the biography of the laureate that are chosen. Note that there can be duplicates in the table. Since few laureates won the prize more than once.


