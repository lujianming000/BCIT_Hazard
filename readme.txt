-------------------------------
BCIT Biking
-------------------------------

== CONTENTS == 
Top Level of project folder:
    -- .gitignore             # Git ignore file
    -- index.html             # landing HTML file, this is what users see when you come to url (and for login)
    -- map.html               # after logged in, this is the main file with google maps and bike hazard elements
    -- readme.txt

It has the follow subfolders:
    -- fonts                  # Folder for fonts (taken from www.bcit.ca)
       /...light.woff2.txt    # file for bcit-light font-family
       /...medium.woff2.txt   # file for bcit-medium font-family
       /...regular.woff2.txt  # file for bcit-regular font-family
       /...semibold.woff2.txt # file for bcit-semibold font-family
    -- images                 # Folder for images
       /BCIT-logo.png         # icon for navbar brand logo
       /construction.png      # icon displaying a 'construction' hazard type
       /downvote.png          # img button to downvote a hazard
       /other.png             # icon displaying an 'other' hazard type
       /pothole.png           # icon displaying a 'pothole' hazard type
       /snow.png              # icon displaying a 'snow' hazard type
       /upvote.png            # img button to upvote a hazard
    -- scripts                # Folder for scripts
       /firebase-api.js       # initializes firebase with this project's config and api key
       /login.js              # this is where the login function is located, as well as a background image with google maps
       /map.js                # this is where all the core functions are located
    -- styles                 # Folder for styles
       /styles.css            # this is where the core styling elements are located.


== REFERENCE LIBRARIES == 
Google Maps:
https://developers.google.com/maps/documentation
FireBase:
https://firebase.google.com/docs/
Bootstrap:
https://getbootstrap.com/docs/