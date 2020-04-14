# HIVE-OS
Honeybee Informatics Via Earth Observations - 2018 Summer - The software was motivated by a collaborator desire to take beehive health data that has traditionally been used aspatially and apply it in a spatial format in conjunction with NASA Earth observations in order to determine what correlations exist between the health data and local landscape, environmental, and atmospheric phenomena. This software addresses this desire at two points. It directs the user to shape their data into a compatible format and then ingests the raw recorded data, converts it to a GeoJSON using Python, and then provides documentation in order for the user to upload their data to Google Earth Engine in order to utilize the scripts generated that access the Earth observations data. These scripts summarize as well as provide statistics for download for the users based on a point or polygon typology.

# PYTHON README
===============
Excel_Honeybee_data_converter
===============

Date Created: August 10th, 2018

Code contained in this script reads in an excel file and converts the format of the excel file into a JSON format compatible with Google Earth Engine. 
This script is capable of reading multiple attributes from column headers and associating appropiate timestamp with the data being collected.
The code depends on the excel file being in a tidy format. If unfamiliar with what tidy data looks like please review http://vita.had.co.nz/papers/tidy-data.html

 Required Packages
===================
* Python (Anaconda Package installation contains all necessary libraries for analyses)
* Numpy library 
* Pandas library
* JSON library
* Datetime library


 Parameters
-------------


1. Ensure the excel file desired to convert is in appropiate format. Appropiate format has the first four columns being Hive ID, Latitude, Longitude, and then a Timestamp in that order. 
	Columns containing observational data (such as hive weight) can be in any order from the 5th column on. 
2. Change line 48 in the code to specify the location that your excel file is located
3. Specify the python working directory using the Spyder GUI, this is where your data will be output to
4. Run the script
5. Go to the location you specified, open the data file with a text editor, and copy and paste the entire line in to the HIVE-OS Python Output section


 Contact
---------
Name(s): Jeremy Rapp
E-mail(s): rappjer1@gmail.com



# GEE README
===============
Honeybee Informatics via Earth Observations (HIVE-OS)
===============

Date Created: August 10th, 2018

A Google Earth Engine (GEE) visualization platform used to display user defined Honeybee hive locations in conjunction with relevant NASA Earth Observations over the hives and honeybee foraging ranges. This code gives users a one stop platform for visualizing relevant remotely sensed data and geophysical parameters.  

 Required User Steps
===================
* Create a Google Earth Engine account (https://earthengine.google.com/)
* If unfamiliar with JavaScript and Earth Engine, take time familiarizing self with what it is through documentation and tutorials (https://developers.google.com/earth-engine/tutorial_api_01 and https://geohackweek.github.io/GoogleEarthEngine/ )
* Locate the HIVE-OS tool on NASA DEVELOP github repository



 Parameters
-------------


1. Run the HIVE-OS Tool
2. Depending on the format you wish to use to display data, choose either Fusion Table (if using Google Fusion Tables), Python Output, if using the associated python script to convert your excel file, or Free View if you wish to just explore
3. Specify the needed inputs in integer format (no decimals) 
4. Copy and paste the fusion table id or the python output if using either of those options
5. Display points to show your points
6. Click on one of the locations of the hives that appear, and then use the buttons located on the side to view different earth observations
7. Export data using the built in export tools 


 Contact
---------
Name(s): Jeremy Rapp	
E-mail(s): rappjer1@gmail.com




