# -*- coding: utf-8 -*-
"""
	Python Output Generator for HIVE-OS tool
	Reads in an excel file and spits out a json type architecture for Google Earth Engine work
	
	August 10th, 2018

  New England Agriculture & Food Security GSFC Summer 2018
    Incorporating NASA Earth observations into an Assessment Tool to Identify Correlations Between
    Factors Associated with Bee Health
    
    Center Lead: Victor Lenske
    Asst Center Lead: Jacob Ramthun
    Project Lead: Jeremy Rapp* rappjer1@gmail.com
    Team Members: Eyob Solomon, Ryan Young
    
    In collaboration with 
      Urban Bee Keeping Laboratory & Bee Sanctuary, Inc. - https://beesanctuary.org/
      The Bee Informed Parternship, Inc. - https://beeinformed.org/
      BeekeepingIO - https://app.beekeeping.io/
"""
####
#Import packages needed
import pandas as pd
import json
import numpy
import datetime

###
#Build Javascript encoder for JSON architecture (used to translate dataframe to geoJSON type 
class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.integer):
            return int(obj)
        elif isinstance(obj, numpy.floating):
            return float(obj)
        elif isinstance(obj, numpy.ndarray):
            return obj.tolist()
        else:
            return super(Encoder, self).default(obj)
        
                

############

##Location of excel file desired to 
data_loc = 'file:///G:/My Drive/DEVELOP_CODE/cleaned_data/NASA-yield2015.xlsx'

df_data = pd.read_excel(data_loc)
columns = list(df_data)

df_collapse = df_data.groupby(columns[0:3])
##############
epoch = datetime.datetime.utcfromtimestamp(0)

def unix_time_millis(dt):
    return(dt-epoch).total_seconds()*1000

######
data = []

##############


##############
for name, group in df_collapse:
	#build empty dictionaries for json architecture, this also clears these dictionaries through each iteration 
   feature = {}
   ### DEFINE PROPERTY NAMES####
   properties = {}
   prop = {}
   columns = list(group)
   attribute_col = columns[4:]
   for col in attribute_col: #Add columns as individual properties
       properties[col] = {}
    
   geometry = {}
   entry = {}
   entry_list = []
   
   #These columns must be in this order in the excel file, or the script will not work. the index of the column refers to the position from the left of the excel file for 
   UniqueID = group[columns[0]].iloc[0]
   long = group[columns[2]].iloc[0]
   lat = group[columns[1]].iloc[0]
   for col in attribute_col:
       for index, row in group.iterrows():
           date = row[columns[3]]
           milliseconds = int(unix_time_millis(date))
           if numpy.isnan(row[col]) != True:
               entry[milliseconds] = row[col]
       properties[col] = entry

   #Build specifically the GeoJSON type     
   entry_list = entry_list.append(entry)
   geometry['type'] = 'Point' 
   geometry['coordinates'] = [long, lat]
   properties['UniqueID'] = UniqueID
   feature['type'] = "Feature"
   feature['geometry'] = geometry
   feature['properties'] = properties
   data.append(feature)
##################   
#print(data)
#open a file called "Data" and save it with the reformated table
with open('data.txt', 'w') as outfile:
    json.dump(data, outfile,cls=Encoder)   
   
   
