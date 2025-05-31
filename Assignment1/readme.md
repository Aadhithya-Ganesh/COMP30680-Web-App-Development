Listed below are the places where I have used the elements that are required

▪ Links to both your own pages and external webpages - Links to my own pages are given in the nav bar. Links to external pages are given in Bosses page. If you click the boss name, you get directed to the Wiki page where you can read about the bosses.

▪ A navigation bar - A nav bar is presented in all the pages to navigate to any page. You can press the logo to go to the home page.

▪ At least one table used for an appropriate purpose - Table is used in page heroes. To represent all the available stats and their uses. 

▪ At least one list (ordered or unordered) - List is used in nav bar as well as the gallery page to list all the images. 

▪ At least one local or embedded video - Video in the home page. Its a trailer video of the game.

▪ At least five CSS3 and four HTML5 specific elements - 
    CSS3 elements : 
        1. box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 40px; -- gallery.css
        2. display: flex; -- gallery.css, hero-list.css, index.css ....
        3. backdrop-filter: blur(7px); -- header.css
        4. z-index: -1; -- header.css
        5. transform: translatex(100%); -- header.css
        6. background: linear-gradient(19deg, rgba(0,0,0,1) 0%, rgba(10,36,35,0.85) 60%, rgba(10,36,35,1) 100%); -- header.css
        7. cursor : pointer; -- header.css

    HTML5 elements :
        1. <video></video> - index.html
        2. <section></section> - map.html, gallery.html, 
        3. <article></article> - index.html, bosslist.html, hero-list.html
        4. <header></header> - All pages
        5. <footer></footer> - All pages  

▪ Make use of the CSS positional properties (e.g. display, position) : 
        1. display : flex; header.css
        2. display : block; for all images
        3. display : inline; For footer icons
        4. position : fixed; For nav bar
        5. position : absolute; hero-list.css
        6. position : relative; hero-list.css

▪ Make use of both inline and block elements : 
        1. display : block; for all images
        2. display : inline; For footer icons



Going beyond the parts of HTML and CSS described in the lectures and practical classes to explore features of HTML and CSS that make a website responsive.

I have made the entire page responsive to the screen width. By using @media (min-width : 768px), I designed both the mobile view and desktop view. This is something i learned while working as a fullstack developer. In all the CSS files, There will be desktop view styles at the top using media query, @media (min-width : 768px).

