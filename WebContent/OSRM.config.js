/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM config file
// [has to be loaded directly after OSRM.base]
var ts=Math.round(new Date().getTime()/1000.0);
OSRM.DEFAULTS = {
	ROUTING_ENGINES: [
		{	url: 'http://cycletour.org:5010/viaroute',
			timestamp: 'http://cycletour.org:5010/timestamp',
			metric: 0,
			label: 'Cycling',
		},
        {       url: 'http://cycletour.org:5011/viaroute',
            timestamp: 'http://cycletour.org:5011/timestamp',
            metric: 1,
            label: 'Hiking',
        }

	],
	
	WEBSITE_URL: document.URL.replace(/#*(\?.*|$)/i,""),					// truncates URL before first ?, and removes tailing #
	HOST_GEOCODER_URL: 'http://nominatim.openstreetmap.org/search',
	HOST_REVERSE_GEOCODER_URL: 'http://nominatim.openstreetmap.org/reverse',
	//HOST_SHORTENER_URL: 'http://map.project-osrm.org/shorten/',				// use '' to not use url shortener service
	
	//SHORTENER_PARAMETERS: '%url&jsonp=%jsonp',
	//SHORTENER_REPLY_PARAMETER: 'ShortURL',									// keep set, even if not using url shortener service!
	HOST_SHORTENER_URL: 'http://tiny-url.info/api/v1/create/?', 
        SHORTENER_PARAMETERS: 'callback=%jsonp&format=json&apikey=AA097HB96A9BBGEFH853&provider=bit_ly&url=%url',        //'%url&jsonp=%jsonp',
        SHORTENER_REPLY_PARAMETER: 'shorturl',  


	ROUTING_ENGINE: 0,
	DISTANCE_FORMAT: 0,														// 0: km, 1: miles
	GEOCODER_BOUNDS: '',	
	ZOOM_LEVEL: 13, //14           
	HIGHLIGHT_ZOOM_LEVEL: 13, //16
	JSONP_TIMEOUT: 10000,
	EDITOR_MIN_ZOOM_LEVEL: 16,
	NOTES_MIN_ZOOM_LEVEL: 8,
	
	ONLOAD_ZOOM_LEVEL: 8,
	ONLOAD_LATITUDE: -37.5,
	ONLOAD_LONGITUDE: 145,
	ONLOAD_SOURCE: "",
	ONLOAD_TARGET: "",
	
	LANGUAGE: "en",
	LANGUAGE_USE_BROWSER_SETTING: true,
	LANUGAGE_ONDEMAND_RELOADING: true,
	LANGUAGE_SUPPORTED: [ 
		{encoding:"en", name:"English"},
		{encoding:"bg", name:"Български"},
		{encoding:"ca", name:"Català"},
		{encoding:"cs", name:"Česky"},
		{encoding:"de", name:"Deutsch"},
		{encoding:"da", name:"Dansk"},
		{encoding:"el", name:"Ελληνικά"},
		{encoding:"es", name:"Español"},
		{encoding:"fi", name:"Suomi"},
		{encoding:"fr", name:"Français"},
		{encoding:"it", name:"Italiano"},
		{encoding:"ja", name:"日本人"},
		{encoding:"ka", name:"ქართული"},
		{encoding:"lv", name:"Latviešu"},
		{encoding:"nb", name:"Bokmål"},
		{encoding:"pl", name:"Polski"},
		{encoding:"pt", name:"Portugues"},
		{encoding:"ro", name:"Română"},
		{encoding:"ru", name:"Русский"},
		{encoding:"sk", name:"Slovensky"},
		{encoding:"sv", name:"Svenska"},
		{encoding:"ta", name:"தமிழ்"},
		{encoding:"tr", name:"Türkçe"},
		{encoding:"uk", name:"Українська"}
	],
		
	TILE_SERVERS: [
                 {       display_name: 'Cycle Touring', /* with automatic cutover to dynamic tiles */ 
                        url:'http://cycletour.org/cycletour/{z}/{x}/{y}.png?updated=' + ts,
                        attribution:'Map data &copy; 2013 Open Cycle Map contributors, terrain from Victorian Government, Cartography &copy; Steve Bennett',
                        options:{maxZoom: 18, minZoom: 6}
                },
       
         {       
            display_name: 'VicMap',
            url:'http://api.maps.vic.gov.au/geowebcacheWM/service/wms?VERSION=1.1.1&TILED=true',
            attribution:'Victorian Government',
            wms:true,
            options:{
                layers: ['WEB_MERCATOR'],
                format: 'image/png',
                transparent: false,
                continuousWorld: true
            }
        },
         /*{
            display_name: 'VicMap hybrid satellite',
            url:'http://api.maps.vic.gov.au/geowebcacheWM/service/wms?VERSION=1.1.1&TILED=true',
            attribution:'Victorian Government',
            wms:true,
            options:{
                layers: ['HYBRID_MERCATOR'],
                format: 'image/png',
                transparent: false,
                continuousWorld: true
            }
        },*/
                {       display_name: 'Cycle Touring (mobile)',
                        url:'http://cycletour.org/tile/cycletour/{z}/{x}/{y}.png?metatile=4&scale=2&updated=1',
                        attribution:'Map data &copy; 2013 Open Cycle Map contributors, terrain from Victorian Government, Cartography &copy; Steve Bennett',
                        options:{maxZoom: 16, minZoom: 6}
                },
                 {       display_name: 'Cycle Touring (experimental)',
                        url:'http://cycletour.org/tile/cycletour/{z}/{x}/{y}.png?metatile=4&updated=' + ts,
                        attribution:'Map data &copy; 2013 Open Cycle Map contributors, terrain from Victorian Government, Cartography &copy; Steve Bennett',
                        options:{maxZoom: 16, minZoom: 6}
                },
                {       display_name: 'City bike paths',
                        url:'http://cycletour.org/tile/SteveBikeMap/{z}/{x}/{y}.png?updated=1',
                        attribution:'Map data &copy; 2013 Open Cycle Map contributors, Cartography &copy; Steve Bennett',
                        options:{maxZoom: 18}
                }, 
                {       display_name: 'Melbourne\'s Inner North',
                        url:'http://cycletour.org/tile/SteveMel/{z}/{x}/{y}.png?updated=1',
                        attribution:'Map data &copy; 2013 Open Cycle Map contributors, Cartography &copy; Steve Bennett',
                        options:{maxZoom: 18}
                },
  		{	display_name: 'Sigma',
			url:'http://tiles1.sigma-dc-control.com/layer8/{z}/{x}/{y}.png',
			attribution:'whatever',
			options:{maxZoom: 18}
		},
               {	display_name: 'Mapbox Terrain',
			url:'http://{s}.tiles.mapbox.com/v3/dennisl.map-dfbkqsr2/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://mapbox.com/">MapBox</a>',
			options:{maxZoom: 18}
		},
		{
			display_name: 'Mapbox Labelled Satellite',
			url:'http://{s}.tiles.mapbox.com/v3/dennisl.map-6g3jtnzm/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://mapbox.com/">MapBox</a>',
			options:{maxZoom: 18}
		},
		{
			display_name: 'Mapbox Satellite',
			url:'http://{s}.tiles.mapbox.com/v3/dennisl.map-inp5al1s/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://mapbox.com/">MapBox</a>',
			options:{maxZoom: 18}
		},
		{	display_name: 'osm.org',
			url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (CC-BY-SA)',
			options:{maxZoom: 18}
		},
		{	display_name: 'osm.de',
			url:'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (CC-BY-SA)',
			options:{maxZoom: 18}
		},
			{	display_name: 'MapQuest',
			url:'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://www.mapquest.de/">MapQuest</a>',
			options:{maxZoom: 18, subdomains: '1234'}
		},
		{	display_name: '4UMaps',
			url:'http://4umaps.eu/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), tiles (C) 4UMaps.eu',
			options:{maxZoom: 16}
		}

	],
	
	OVERLAY_SERVERS: [
  		{	display_name: 'National parks',
			url:'http://cycletour.org:20008/tile/NationalParks/{z}/{x}/{y}.png?updated=' + ts,
			attribution:'Steve Bennett',
			options:{opacity:1.0}
		},
                {       display_name: 'Public transport',
                        url:'http://dev.cycletour.org:20008/tile/buses/{z}/{x}/{y}.png?updated=' + ts,
                        attribution:'Steve Bennett',
                        options:{}
                },
                {       display_name: 'Truck volume (VicRoads)',
                        url:'http://cycletour.org:20008/tile/vicroadstest/{z}/{x}/{y}.png?updated='+1,// + ts,
                        attribution:'VicRoads',
                        options:{opacity: 0.5}
		},
                {       display_name: 'Bike shops',
                        url:'http://cycletour.org:20008/tile/Bikeshops/{z}/{x}/{y}.png?updated=' + ts,
                        attribution:'OpenStreetMap contributors',
                        options:{opacity: 0.9}
                },
                {       display_name: 'EMS cycletours',
                        url:'http://cycletour.org:20008/tile/SteveEMSOverlay/{z}/{x}/{y}.png?scale=2&updated=' + ts,
                        attribution:'OpenStreetMap contributors',
                        options:{opacity: 1.0}
                }
 	],
	NOTIFICATIONS: {
		LOCALIZATION:	18000000,	// 30min
		CLICKING: 		60000000,		// 1min
		DRAGGING: 		120000000,		// 2min 
		MAINTENANCE:	false
	},
	OVERRIDE_MAINTENANCE_NOTIFICATION_HEADER: undefined,
	OVERRIDE_MAINTENANCE_NOTIFICATION_BODY: undefined
};
