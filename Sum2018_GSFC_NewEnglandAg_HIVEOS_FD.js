//MODULES used

var modules = require('users/rappjer/SUM2018_NewEnglandAg:modules');
var colorbrewer = require('users/gena/packages:colorbrewer')
/* 

           _   _           _____         
          | \ | |   /\    / ____|  /\    
          |  \| |  /  \  | (___   /  \   
          | . ` | / /\ \  \___ \ / /\ \  
          | |\  |/ ____ \ ____) / ____ \ 
          |_| \_/_/    \_\_____/_/    \_\
                                         
 _____  ________      ________ _      ____  _____  
|  __ \|  ____\ \    / /  ____| |    / __ \|  __ \ 
| |  | | |__   \ \  / /| |__  | |   | |  | | |__) |
| |  | |  __|   \ \/ / |  __| | |   | |  | |  ___/ 
| |__| | |____   \  /  | |____| |___| |__| | |     
|_____/|______|   \/   |______|______\____/|_|     
                                                   
                                                   

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
	  University Of Maryland: vanEngelsdorp Bee Research Laboratory - https://www.vanengelsdorpbeelab.com/
  August 10th, 2018

OVERVIEW

Create a onestop shop for users to visualize, summarize, and export relevant earth obs data geared towards honey bee research

ANCILLARY DATA USED
NLDAS/GLDAS

EARTH OBSERVATIONS USED
Landsat 8 OLI
Landsat 7 ETM+
Sentinel-2 MSI 
ALOS 30M DEM
SRTM
SMAP


*/
//////////////////////////////////////////
//Creating User Interface for intialization
//////////////////////////
//Create the User Panel
var panel_intro = ui.Panel();
panel_intro.style().set({ width: '620px',height: '850px', position: 'top-center',color: '#4874ba', fontWeight: 'bold'}); //Defines attributes of the panel, most widgets
//are like this
Map.add(panel_intro) //add this panel to the map (makes it appear is a box in the middle of the screen)

panel_intro.add(ui.Button({label: 'Close', style: {color: 'black', position: 'top-center'}, //At a function to close the map box, mostly for aesthetics
  onClick: function() {
  panel_intro.style().set('shown', false)}}))//This disables the mapbox on click of the close button
  
// Add the title text and other information, including a NASA disclaimer
var title = ui.Panel([ui.Label({value: 'Welcome to the NASA DEVELOP Honeybee Informatics via Earth Observations (HIVE-OS) Tool',
style: {fontSize: '25px', fontWeight: 'bold', textAlign: 'center',color:'black'}})]); 
panel_intro.add(title);

var intro = ui.Panel([ui.Label({value: 'Before beginning, please make sure the data you are planning to use is in the format'+
                                        ' as described in the toolkit tutorial associated with this platform.'+
                                        'You will be asked to provide some parameters relevant to the data you are working with',
    style: {color: 'black',fontWeight: 'normal'}})]);
panel_intro.add(intro);
var disclaimer = ui.Panel([ui.Label({value: 'This material is based upon work supported by NASA through '+ 
    'contract NNL16AA05C and cooperative agreement NNX14AB60A. Any mention of a commercial product,'+
    'service, or activity in this material does not constitute NASA endorsement. Any opinions, findings,'+ 
    'and conclusions or recommendations expressed in this material are those of the author(s) and '+ 
    'do not necessarily reflect the views of the National Aeronautics and Space Administration and partner organizations.'+
    ' It was created as part of the Summer 2018 NASA DEVELOP Goddard Space Flight Center New England Agriculture and Food Security project.',
    style: {fontSize: '10px', color: 'black', fontWeight: 'normal'}})]);
panel_intro.add(disclaimer); 


var exploration_title =  ui.Panel([ui.Label({value: 'Select which type of data you plan on bringing into the platform or select free look',
    style: { fontSize: '25px', fontWeight: 'bold', color: 'black' }}
    )])

panel_intro.add(exploration_title)

//This variable intialization is very important in order to get other variables out of the functions (think of them as escaping a for loop)
//The index of is list will be used to call other important variables later, like foraging range, start year, end year, etc.
var variables = []

//This selector is important for selecting the type of exploration you will do, of which there are three options
//A free view that enables users to use the functionality as a click based querrier
//A python output that comes from the JSON converter script associated with this package
//A featuretable iterator that comes from your personal featuretable collection
var selector = ui.Select({
  items: ['Fusion Table', 'Python Output', 'Free View'],
  onChange: function(key) {
    //////////////////////////
    
   //This clears the variable list every iteration through the clicks
    
    //Create the labels and buttons 
    var startyear_label = ui.Label({value: 'Starting Year', style: {color: 'black', fontWeight: 'Bold'}})
    var startyear_box = ui.Textbox(
         {placeholder: 'Please enter the starting year as a 4 digit number i.e. 2014', 
          onChange: function(text){
            variables.push(text)
            var start_year = ee.Number.parse(text)
            print(start_year)
          },
          style: {width: '550px', height: '30px'}
         })
  

      var endyear_label = ui.Label({value: 'Ending Year', style: {color: 'black', fontWeight: 'Bold'}})
      var endyear_box = ui.Textbox(
         {placeholder: 'Please enter the ending year as a 4 digit number i.e. 2018', 
          onChange: function(text){
            variables.push(text)
            var end_year = ee.Number.parse(text)
            print(end_year)
          },
          style: {width: '550px', height: '30px'}
         })


      var radius_label = ui.Label({value: 'Foraging Range (in meters)', style: {color: 'black', fontWeight: 'Bold'}})
      var radius_box = ui.Textbox(
         {placeholder: 'Radius around hive(meters) i.e. 3000', 
          onChange: function(text){
            variables.push(text)
            var radius = ee.Number.parse(text)
            return radius
          },
          style: {width: '550px', height: '30px'}
         })
     
      var ft_textbox_label = ui.Label({value: 'Copy and paste your featuretable ID (without the ft:)', style: {color: 'black', fontWeight: 'Bold'}})
      var ft_textbox = ui.Textbox(
         {placeholder: 'Fusion Table ID',
          onChange: function(text){
            variables.push(text)
            var ft_loc = 'ft:' + text
            value.set(ft_loc)
          },
          style: {width: '550px', height: '30px'}
         })
         
      var po_textbox_label = ui.Label({value: 'Copy and paste your points file into the box below', style: {color: 'black', fontWeight: 'Bold'}})
      var po_textbox = ui.Textbox(
         {placeholder: 'Python Output text',
          onChange: function(text){
            variables.push(text)
            return(text)
            value.set(text)
          },
          style: {width: '550px', height: '30px'}
         })
    //creates panels of the buttons depending on the if       
    var add_fv_list = ui.Panel([startyear_label,startyear_box,endyear_label, endyear_box, radius_label, radius_box])
    var add_ft_list = ui.Panel([startyear_label,startyear_box,endyear_label, endyear_box, radius_label, radius_box, ft_textbox_label, ft_textbox])
    var add_po_list = ui.Panel([startyear_label,startyear_box,endyear_label, endyear_box, radius_label, radius_box, po_textbox_label, po_textbox])
    
    //push key to variable slist
    variables.push(key)
    
    //logic checks
    if(key === "Fusion Table") {
      panel_intro.add(add_ft_list)
    }
    if(key === "Python Output") {
      panel_intro.add(add_po_list)
    }
     if(key === "Free View") {
      panel_intro.add(add_fv_list)
    }
    
    //reset to start over if you decide to change your mind
    var reset_button = ui.Button({
      label: 'Select Different Data Type type',
      onClick: function() {
      panel_intro.clear()
      var exploration_title =  ui.Panel([ui.Label({value: 'Select which type of data you plan on bringing into the platform or select free look',
      style: { fontSize: '25px', fontWeight: 'bold', color: 'black' }})])
      
      panel_intro.add(exploration_title)
      panel_intro.add(selector)
      }})
    panel_intro.remove(selector)
    panel_intro.add(reset_button)
    var end = ui.Panel([ui.Label({value: 'Press “Display Points” to start exploring the tool. Enjoy!',
     style: {color: 'black', textAlign: 'center' , fontWeight: 'bold'}})]);
    panel_intro.add(end);
    //Display Points button, intializes the visualizaiton portion of the script
    panel_intro.add(ui.Button({label: 'Display Points', style: {color: 'black'},
     onClick: function() {
      print('test')
      print(variables)
      var var_length = (ee.List(variables)).length()
      print(var_length)
      print((ee.List(variables)).get(0))
      print(ee.String((ee.List(variables)).get(0)))
      if (var_length.eq(5)) {
        
        var po = ee.String("Python Output")
        var ft = ee.String("Fusion Table")
        var key = ee.String((ee.List(variables)).get(0))
        var test_po = key.compareTo(po)
        var test_ft = key.compareTo(ft)

        if (test_ft.getInfo() === 0){
          var v = ee.List(variables).get(3)
          var ft = ee.FeatureCollection('ft:' + v)
          Map.addLayer(Ft)
          var points_geom = ee.Feature(ft.geometry()).centroid()
          var lat = ee.Number(points_geom.geometry().coordinates().get(0)).getInfo()
          var lon = ee.Number(points_geom.geometry().coordinates().get(1)).getInfo()
          Map.setCenter(lat, lon, 8)  
          
        }
        if (test_po.getInfo() === 0)
        {
        var v = ee.List(variables).get(4)
        print(v)
        var points_decoded = ee.List(ee.String(ee.List(v)).decodeJSON())
        var points_info = points_decoded.getInfo()
        var fc0 = ee.FeatureCollection(points_info)
        Map.addLayer(fc0)
        var points_geom = ee.Feature(fc0.geometry()).centroid()
        var lat = ee.Number(points_geom.geometry().coordinates().get(0)).getInfo()
        var lon = ee.Number(points_geom.geometry().coordinates().get(1)).getInfo()
        Map.setCenter(lat, lon, 8)  
          
        }
      }
      panel_intro.style().set('shown', false);
  } }));
  
  panel_intro.add(ui.Button({label: 'Close', style: {color: 'black', position: 'bottom-left'}, 
  onClick: function() {
    panel_intro.style().set('shown', false);
  }}))},
      style:{color: 'red'}});

panel_intro.add(selector)

/////////////////////////////////////
/*



                                           _                     
    /\                                    | |                    
   /  \   _ __ ___  __ _    _____  ___ __ | | ___  _ __ ___ _ __ 
  / /\ \ | '__/ _ \/ _` |  / _ \ \/ / '_ \| |/ _ \| '__/ _ \ '__|
 / ____ \| | |  __/ (_| | |  __/>  <| |_) | | (_) | | |  __/ |   
/_/    \_\_|  \___|\__,_|  \___/_/\_\ .__/|_|\___/|_|  \___|_|   
                                    | |                          
                                    |_|           
                                    
                                    
                                    
*/

/////////////////////////////////////

//Making the area explorer

var panel2 = ui.Panel();



///All functions that occur within the bounds of the 
Map.onClick(function(coords) {
  print(variables)

  panel2.clear()
  panel2.style().set('width', '300px');

  // Create an intro panel with labels.
  var intro2 = ui.Panel([
  ui.Label({
    value: ' ',
    style: {fontSize: '20px', fontWeight: 'bold'}
  }),
  ui.Label('Click a point on the map to inspect.')
  ]);

  panel2.add(intro2);

  var lon = ui.Label();
  var lat = ui.Label();
  
  panel2.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));
  //These layer lines make sure to remove duplicates as the map is clicked multiple times 
  var layers = Map.layers()
  print(layers)
  var layer = layers.get(0)
  var layer2 = layers.get(1)
  layers.remove(layer)
  layers.remove(layer2)
  
  //Logic section for determining what to display and how to display it
    var var_length = ee.List(variables).length()
      if (var_length.eq(5)) {
        var po = ee.String("Python Output")
        var ft = ee.String("Fusion Table")
        var key = ee.String((ee.List(variables)).get(0))
        var test_po = key.compareTo(po)
        var test_ft = key.compareTo(ft)
        
        if (test_ft.getInfo() === 0) {
          var v = ee.List(variables).get(4)
          var ft = ee.FeatureCollection('ft:' + v)
          Map.addLayer(Ft);
          var points_geom = ee.Feature(ft.geometry()).centroid()
          var lat_set = ee.Number(points_geom.geometry().coordinates().get(0)).getInfo();
          var lon_set = ee.Number(points_geom.geometry().coordinates().get(1)).getInfo();
          Map.setCenter(lat_set, lon_set, 8);
          
        }
        if (test_po.getInfo() === 0) {
          var v = ee.List(variables).get(4);
          print(v);
          var points_decoded = ee.List(ee.String(ee.List(v)).decodeJSON());
          var points_info = points_decoded.getInfo();
          var fc0 = ee.FeatureCollection(points_info);
          Map.addLayer(fc0);
          // var filtered = fc0.filterBounds(neib);
          // var name = filtered.first();
          // var value = ee.String(name.get('UniqueID'));
          // print(value);
          // panel2.add(ui.Label({value: ('UniqueID'+ee.String(value)) }));
          
        }
      }


    // Update the lon/lat panel with values from the click event.
  lon.setValue('lon: ' + coords.lon.toFixed(2)),
  lat.setValue('lat: ' + coords.lat.toFixed(2));
  
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var buffered_point = point.buffer(6000);
  //Will be used to get feature from featurecollection to print 
  var neib = ee.Geometry.Rectangle(coords.lon-1e-3,coords.lat-1e-3,
                                  coords.lon+1e-3,coords.lat+1e-3);
  Map.addLayer(buffered_point, {},'buffered_point');

//Add functionality to display different earth obs
  var landsat_button = ui.Button({label: 'Landsat Visualizer and Querent',
    onClick: function() {
      print('This is where all the Landsat details will be printed')
  //Define variables for imagery
  var start = ee.Date((ee.List(variables)).get(1))
  var end = ee.Date((ee.List(variables)).get(2))
  var feature = buffered_point
  var startMillis = start.millis();
  //////////////////////////////
  var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  var l7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
  var l5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')

  //Import Sentinel
  var s2 = ee.ImageCollection('COPERNICUS/S2');




//Landsat Band Selection (Landsat 5,7, and 8)
//Landsat 5 and Landsat 7 Bands (Share same naming system)

var bandNames = ee.List(['B1','B2','B3','B4','B5','pixel_qa'])
// Landsat 8 Bands
var bandNamesl8 = ee.List(['B2','B3','B4','B5','B6','pixel_qa'])

//Sentinel 2 bands
var bandNamesS2 = ee.List(['B8','B4','B11','QA60'])

var mosaicbands = ee.List(['time','NDVI','NDWI']);

// quality mosaic/output band for indice maximums and ranges
var outBands = ee.List(['NDVI','NDWI']);

//clip and select bands
var l5_region = modules.observation_clip(start,end,feature, l5, bandNames);
var l7_region = modules.observation_clip(start,end,feature, l7, bandNames);
var l8_region = modules.observation_clip(start,end,feature, l8, bandNamesl8);
var s2_region = modules.observation_clip(start,end,feature, s2, bandNamesS2);
//merge l5 and l7 (named "l57")
var l57 = ee.ImageCollection(l5_region.merge(l7_region));

//get bands per EOS and create landsat specific functions

//Cloud Mask (utilizes the 'pixel_qa' layer in Surface Reflectance products)
// A function to mask out cloudy pixels.
var getQABits = function(image, start, end, newName) {
    // Compute the bits we need to extract.
    var pattern = 0;
    for (var i = start; i <= end; i++) {
       pattern += Math.pow(2, i);
    }
    // Return a single band image of the extracted QA bits, giving the band
    // a new name.
    return image.select([0], [newName])
                  .bitwiseAnd(pattern)
                  .rightShift(start);
};

var cloud_shadows = function(image) {
  // Select the QA band.
  var QA = image.select(['pixel_qa']);
  // Get the internal_cloud_algorithm_flag bit.
  return getQABits(QA, 3,3, 'Cloud_shadows').eq(0);
  // Return an image masking out cloudy areas.
};

// A function to mask out cloudy pixels.
var clouds = function(image) {
  // Select the QA band.
  var QA = image.select(['pixel_qa']);
  // Get the internal_cloud_algorithm_flag bit.
  return getQABits(QA, 5,5, 'Cloud').eq(0);
  // Return an image masking out cloudy areas.
};

var maskClouds = function(image) {
  var cs = cloud_shadows(image);
  var c = clouds(image);
  image = image.updateMask(cs);
  return image.updateMask(c);
};

var maskCloudsS2 = function(image){
  var cfmask = image.select('QA60');
  return image.updateMask(cfmask.eq(0));
};

var addbands = function(image) {
  return image.clip(feature)
  // NDVI
  .addBands(image.normalizedDifference(['B4','B3']).rename('NDVI'))
  // NDWI
  .addBands(image.normalizedDifference(['B4','B5']).rename('NDWI'))
  //time in days
  .addBands(image.metadata('system:time_start').rename('time'))
  //EVI
  // .addBands(image.expression(
  //   '2.5 * ((NIR * s - RED * s) / (NIR * s + 6 * RED * s - 7.5 * BLUE * s + 1))', {
  //     'NIR': image.select('B4'),
  //     'RED': image.select('B3'),
  //     'BLUE': image.select('B1'),
  //     's'  : 0.0001 // band scale factor for SR product
  //   }).rename('EVI'))
};

var addL8bands = function(image) {
  return image.clip(feature)
  // NDVI
  .addBands(image.normalizedDifference(['B5','B4']).rename('NDVI'))
  // NDWI
  .addBands(image.normalizedDifference(['B5','B6']).rename('NDWI'))
  //time in days
  .addBands(image.metadata('system:time_start').rename('time'))
  //EVI
  // .addBands(image.expression(
  //   '2.5 * ((NIR * s - RED * s) / (NIR * s + 6 * RED * s - 7.5 * BLUE * s + 1))', {
  //     'NIR': image.select('B5'),
  //     'RED': image.select('B4'),
  //     'BLUE': image.select('B2'),
  //     's'  : 0.0001 // band scale factor for SR product
  //   }).rename('EVI'))
  
};

var addbandsS2 = function(image) {
  return image.clip(feature)
  .addBands(image.normalizedDifference(['B8','B4']).rename('NDVI'))
  .addBands(image.normalizedDifference(['B8','B11']).rename('NDWI'))
  .addBands(image.metadata('system:time_start').rename('time'))
}

// Buffer edge pixels out image because of poor quality
var buffers = function(image){
  return image.clip(image.geometry().buffer(-500));
};

//Apply functions over collections: 
//Over l57
var l57merged = l57.map(addbands).map(buffers).map(maskClouds);

//Over l8
var l80 = l8.map(addL8bands).map(maskClouds);

//Over s2
var s20 = s2.map(addbandsS2).map(maskCloudsS2)

//Combine l8 and l7
var merged_landsat = ee.ImageCollection(l57merged.merge(l80))
print(merged_landsat.first())
var mosaicbands = merged_landsat.select(mosaicbands);
print(mosaicbands.first())
var band_maximums = mosaicbands.select(outBands).max()

var index_final = band_maximums.set({
  'system:time_start': startMillis,
  'year': start,
  'region': feature,
  'lag': 0
});

///Merge S2 and landsat collections
var merged_all = ee.ImageCollection(merged_landsat.merge(s20)).filterDate(start,end)
  //////////////////////////////


///Landsat 32 Day for Visualization
var ls_32d = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_TOA').filterBounds(buffered_point)
//Create a month viewer for the visualization
var showLayer = function(month) {
  Map.layers().reset();
  var date = ee.Date.fromYMD(ee.Number.parse((ee.List(variables)).get(1)), month, 1);
  var dateRange = ee.DateRange(date, date.advance(1, 'month'));
  var image = ls_32d.filterDate(dateRange).first();
  Map.addLayer({
    eeObject: ee.Image(image).clip(buffered_point),
    visParams: {
      bands: ['B4','B3','B2'],
      gamma: [1, 1.2, 1] //exagerate the green band to show vegetation a little clearer (some images are a little dark)
    },
    name: String(month)
  });
};
var label = ui.Label('Landsat Monthly Viewer');
var slider = ui.Slider({
  min: 1,
  max: 12,
  step: 1,
  onChange: showLayer,
  style: {stretch: 'horizontal'}
});


var panel = ui.Panel({
  widgets: [label, slider],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {
    position: 'top-center',
    padding: '7px'
  }
});

Map.add(panel);

slider.setValue(1)  
  ///add ndvi chart to graph
var ndviChart = ui.Chart.image.series(merged_all.select('NDVI'), point, ee.Reducer.mean(), 30)
        .setOptions({
          title: ' ',
          vAxis: {title: 'NDVI', maxValue: 0.7},
          hAxis: {title: 'date', format: 'MM-dd', gridlines:{count: 6}},
        });
    panel2.widgets().set(3, ndviChart);      

    }
  })
  //add  button for cdl functionality, this will allow users to display cdl layers and graphs
  var cdl_button = ui.Button({label: 'CDL Visualizer and Querent',
    onClick: function() {
      print('This is where all the cdl details will be printed')
    var year = ee.String((ee.List(variables)).get(1)).getInfo()
    print(year)
    var cdl = ee.Image('USDA/NASS/CDL/' + year).select('cropland')
    Map.addLayer(ee.Image(cdl).select('cropland').clip(buffered_point))
    
  //Done by Ryan C. Young, reclassifies CDL 
    ////////////////////////////////////////////////////////
// Separate land values in to bins //
//Based on CDL documentaiton you can read in the dataset explorer//
var crop_list_1 = ee.List.sequence(1,61);
var crop_list_2 = ee.List.sequence(63,77);
var crop_list_3 = ee.List.sequence(204,254);

var crops = crop_list_1.cat(crop_list_2).cat(crop_list_3);
// print (crops,'crops');

var crop_reclass = ee.List.repeat(0,127);
// print (crop_reclass, 'crop reclass');

var native_list_1 = ee.List.sequence(63,63);
var native_list_2 = ee.List.sequence(141,195);

var native = native_list_1.cat(native_list_2);
var native_reclass = ee.List.repeat(1,56);
// print (native,'native');
// print (native_reclass, 'native reclass');

var urban = ee.List([82,121,122,123,124]);
var urban_reclass = ee.List.repeat(2,5);
// print (urban,'urban');
// print (urban_reclass, 'urban reclass');

var water = ee.List.sequence(83,112);
var water_reclass = ee.List.repeat(3,30);
// print (water,'water');
// print (water_reclass, 'water reclass');

var biglist = crops.cat(native).cat(urban).cat(water);
// print (biglist, 'big List');

var reclass_list = crop_reclass.cat(native_reclass).cat(urban_reclass).cat(water_reclass);
// print (reclass_list);

var remap = cdl.remap(biglist,reclass_list);
// print (remap, 'REMAPPED');
Map.addLayer(remap.clip(buffered_point), {min: 0, max: 3, palette:['yellow','green','gray','blue']},'Reclassified image');

// var names = clip_land.get('cropland_class_names');
// var values= clip_land.get('cropland_class_values');


    }
  })
var elevation_button = ui.Button({label: 'Elevation Visualizer',
  onClick: function() {
    var elevation = ee.Image('CGIAR/SRTM90_V4')
    //Pull regional minimum and maximum values in order to display the point buffer with decent detail
    var min = (elevation.reduceRegion(ee.Reducer.min(), buffered_point)).get('elevation').getInfo()
    var max = (elevation.reduceRegion(ee.Reducer.max(), buffered_point)).get('elevation').getInfo()
    print(min,max)
    //use a color brewer palette from the colorbrewer module
    var palette = colorbrewer.Palettes.RdYlGn[11]
    Map.addLayer(elevation.clip(buffered_point), {min: min, max: max, palette: palette},'elevation')
  }
})

//Smap currently prints to console, will change this in the second version
var smap_button = ui.Button({label: 'Display Soil Moisture Chart',
  onClick : function()
  {
    var smap = ee.ImageCollection('NASA_USDA/HSL/SMAP_soil_moisture')
    print(ui.Chart.image.series(smap, buffered_point))  
    
  }
  
})
//add  buttons for visualizaiton and data querrying
  panel2.add(ui.Panel([landsat_button, cdl_button, elevation_button, smap_button]))
  // Load a raw Landsat 5 ImageCollection for a single year.

  });
  
//sets map properties to crosshair for work
Map.style().set('cursor', 'crosshair');
ui.root.insert(0, panel2);
// Add the panel to the ui.root.

