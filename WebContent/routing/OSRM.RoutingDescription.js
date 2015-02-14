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

// OSRM routing description
// [renders routing description and manages events]


OSRM.RoutingDescription = {
		
// directory with qrcodes files
QR_DIRECTORY: 'qrcodes/',
		
// initialization of required variables and events
init: function() {
	OSRM.G.active_shortlink = null;
	OSRM.Browser.onUnloadHandler( OSRM.RoutingDescription.uninit );
},
uninit: function() {
	if( OSRM.G.qrcodewindow )
		OSRM.G.qrcodewindow.close();	
},

// route description events
onMouseOverRouteDescription: function(lat, lng) {
	OSRM.G.markers.hover.setPosition( new L.LatLng(lat, lng) );
	OSRM.G.markers.hover.show();

},
onMouseOutRouteDescription: function(lat, lng) {
	OSRM.G.markers.hover.hide();	
},
onClickRouteDescription: function(lat, lng, desc) {
	OSRM.G.markers.highlight.setPosition( new L.LatLng(lat, lng) );
	OSRM.G.markers.highlight.show();
	OSRM.G.markers.highlight.centerView(OSRM.DEFAULTS.HIGHLIGHT_ZOOM_LEVEL);	

	if( OSRM.G.markers.highlight.description != null && document.getElementById("description-"+OSRM.G.markers.highlight.description) )
		document.getElementById("description-"+OSRM.G.markers.highlight.description).className = "description-body-item";
	OSRM.G.markers.highlight.description = desc;
	document.getElementById("description-"+desc).className = "description-body-item description-body-item-selected";
},
onClickCreateShortcut: function(src){
	var pr = OSRM.C.PRECISION;
    	src += '&z='+ OSRM.G.map.getZoom() + '&center=' + OSRM.G.map.getCenter().lat.toFixed(pr) + ',' + OSRM.G.map.getCenter().lng.toFixed(pr);
	src += '&alt='+OSRM.G.active_alternative;
	src += '&df=' + OSRM.G.active_distance_format;
	src += '&re=' + OSRM.G.active_routing_engine;
	src += '&ly=' + OSRM.Utils.getHash( OSRM.G.map.layerControl.getActiveLayerName() );
	//console.log("Here you go, Alex: " + src);
        i//if (justsrc) { return src; }
	// uncomment to not use link shorteners
	if( OSRM.DEFAULTS.HOST_SHORTENER_URL == '' ) {
		var response = {};
		response.label = OSRM.loc("ROUTE_LINK");	
		response[OSRM.DEFAULTS.SHORTENER_REPLY_PARAMETER] = src;
		OSRM.RoutingDescription.showRouteLink( response );
		return;	
	} else {
		var source = OSRM.DEFAULTS.HOST_SHORTENER_URL + OSRM.DEFAULTS.SHORTENER_PARAMETERS.replace(/%url/, encodeURIComponent(src));
		// using "encodeURIComponent(src)" instead of "src" required for some URL shortener services, but not functional for others (e.g. ours)
	
		OSRM.JSONP.call(source, OSRM.RoutingDescription.showRouteLink, OSRM.RoutingDescription.showRouteLink_TimeOut, OSRM.DEFAULTS.JSONP_TIMEOUT, 'shortener');
		document.getElementById('route-link').innerHTML = '[<a class="text-link-inactive">'+OSRM.loc("GENERATE_LINK_TO_ROUTE")+'</a>]';
	}
},
showRouteLink: function(response){
	if(!response || !response[OSRM.DEFAULTS.SHORTENER_REPLY_PARAMETER]) {
		OSRM.RoutingDescription.showRouteLink_TimeOut();
		return;
	}
	
	OSRM.G.active_shortlink = response[OSRM.DEFAULTS.SHORTENER_REPLY_PARAMETER];
	var shortlink_label = response.label;
	if( !shortlink_label )
		shortlink_label = OSRM.G.active_shortlink.substring(7);
	document.getElementById('route-link').innerHTML =
		//'[<a class="text-link" onClick="OSRM.RoutingDescription.showQRCode();">'+OSRM.loc("QR")+'</a>]' + '&nbsp;' +
		/*'[<a class="text-link" href="' +OSRM.G.active_shortlink+ '">'+*/
       
                '&nbsp;&nbsp;' + shortlink_label + '&nbsp;' 
                + '&nbsp;' + '<a class="text-link" href="' + 'http://' + shortlink_label + '">' + '[-]' + '</a>';
                //'<img src="http://www.endlessicons.com/wp-content/uploads/2012/11/link-icon-614x460.png" style="width:8px; height: 8px;" /> </a>'; 
                /*+'</a>]'*/;
},
showRouteLink_TimeOut: function(){
  // bleh, repeated code - SB
        var pr = OSRM.C.PRECISION;
        var query_string = '?hl=' + OSRM.Localization.current_language;
        for(var i=0; i<OSRM.G.markers.route.length; i++)
                query_string += '&loc=' + OSRM.G.markers.route[i].getLat().toFixed(pr) + ',' + OSRM.G.markers.route[i].getLng().toFixed(pr);

 
        var src = OSRM.DEFAULTS.WEBSITE_URL + query_string;
        src += '&z='+ OSRM.G.map.getZoom() + '&center=' + OSRM.G.map.getCenter().lat.toFixed(pr) + ',' + OSRM.G.map.getCenter().lng.toFixed(pr);
        src += '&alt='+OSRM.G.active_alternative;
        src += '&df=' + OSRM.G.active_distance_format;
        src += '&re=' + OSRM.G.active_routing_engine;
        src += '&ly=' + OSRM.Utils.getHash( OSRM.G.map.layerControl.getActiveLayerName() );
  
	document.getElementById('route-link').innerHTML = '[<a class="text-link-inactive" href="' + src+'">'+OSRM.loc("LINK_TO_ROUTE_TIMEOUT")+'</a>]';
},
showQRCode: function(response){
	if( OSRM.G.qrcodewindow )
		OSRM.G.qrcodewindow.close();	
	OSRM.G.qrcodewindow = window.open( OSRM.RoutingDescription.QR_DIRECTORY+"qrcodes.html","","width=280,height=250,left=100,top=100,dependent=yes,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,resizable=no");
},
getElevation: function() {
	var doChart = function (eles, distance) {
	  document.querySelector('#chart-box').style.display='block';
	  var x = ['x'];
	  var maxclimb=0, maxgradient=0, curclimb=0, climbstart=-1;
	  for (i = 0; i < eles.length; i++) {
	  	eles[i] = parseFloat(eles[i]);
	    x.push((i * distance / eles.length).toFixed(2));
	    if (i > 0) {
	    	if (eles[i] >= eles[i-1]) {
	    		if (climbstart < 0) {
	    			// climb starts
	    			climbstart = i;
	    		}
	    	}
	    	if (eles[i] < eles[i-1] && climbstart >= 0 || i == eles.length -1) {
	    		// look for an excuse to keep counting this climb, to handle noise in the elevations
	    		var keepgoing=0;
	    		for (j = i; j < i + 10 && j < eles.length; j++ ) {
	    			if (eles[j] > eles[i-1])
	    				keepgoing=1;
	    		}
	    		if (!keepgoing || i == eles.length-1) {
		    		// climb ends
		    		curclimb = eles[i-1] - eles[climbstart];
		    		if (curclimb > maxclimb) {
		    			maxclimb = curclimb;
		    			console.log(maxclimb);
		    			// ## warning, this gradient calculation will be inaccurate (overestimate) for long routes.
		    			// 10 because of kilometre/metre mismatch.
		    			maxgradient = 10.0 * (eles[i-1] - eles[climbstart]) / (parseFloat(x[i-1]) - parseFloat(x[climbstart]));
		    		}
		    		climbstart = -1;
		    	}
	    	}
	  	}
	  }

    var maxclimbtext = "Biggest climb: " + maxclimb.toFixed(0) + "m";
    maxclimbtext += " @ " + (maxgradient/100).toFixed(1) + "%";
    document.querySelector('#maxclimb').innerHTML = maxclimbtext;

    /* Generate a nice set of y axis ticks. */
	  var minele = Math.min.apply(null, eles);
	  var maxele = Math.max.apply(null, eles);
	  var tickoptions = [1, 2, 5,10,20,25,50,100,150,200,250,500,750,1000];
    var tickamt;
    var maxticks = 5, nticks = maxticks+1;
    for (i=0; nticks > maxticks; i++) {
      tickamt = tickoptions[i];
      nticks = (maxele - minele) / tickamt;
    }
    var ticks = [];
    for (i = minele - (minele % tickamt); i < maxele + tickamt; i+= tickamt) {
    	ticks.push(i);
    }

    eles.splice(0,0,'Elevations');

	  var chart = c3.generate({
	  	size: { height: 130 }, // why this number? #chart-box is 100 so this is just guessing...
	  	axis: { 
	  		x: { tick: { 
	  			count: 10,
	  			format: function(x) { return x.toFixed(1); } } }, // not working?
	  		y: { 
	  			min: ticks[0],//minele - (minele % 50), 
	  			max: ticks.slice[-1] + tickamt,//maxele + 50 - (maxele % 50), 
	  			padding: { top: 1, bottom: 0 },
	  			tick: { 
	  			  values: ticks
	  			  /*count: 5,
	  			  format: function(y) { return y.toFixed(0); } } } , */
	  			}
	  		}},
	  	point: { show: false },
	  	//axis: { x: { show: false } },
	    bindto: '#chart',
	    legend: { 'hide': true },
	    data: {
	      x: 'x',
	      columns: [
	        x,
	        eles
	      ]
	    }
	  });
	}
	var getJSON = function(url, callback) {
		// for some reason we don't have jQuery. This just copies $.getJSON();
		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		    var data = JSON.parse(request.responseText);
		    callback(data);
		  } else {
		    // We reached our target server, but it returned an error
         throw ("Surface API isn't working.");
		  }
		};

		request.onerror = function() {
         throw ("Surface API isn't working.");
		};

		request.send();
  }
	var positions = OSRM.G.route.getPositions();
	var samplePoints = 200;
 
  p=[];
  positions.forEach(function(d) {
  	p.push( [d.lng.toFixed(6), d.lat.toFixed(6)]);
  });
  var lsp = turf.linestring(p);
  var distance = turf.lineDistance(lsp, "kilometers");
  var pointString = "";
  for (i=0; i < samplePoints; i++) {
  	var rp = turf.along(lsp, i * distance / samplePoints, "kilometers").geometry.coordinates;
  	pointString += rp + ";"
    
  }
	pointString = pointString.slice(0,-1);

  var pkey = 'pk.eyJ1Ijoic3RldmFnZSIsImEiOiJGcW03aExzIn0.QUkUmTGIO3gGt83HiRIjQw';
  var surfaceURL = 'https://api.tiles.mapbox.com/v4/surface/mapbox.mapbox-terrain-v1.json?layer=contour&interpolate=true&fields=ele&points=' + pointString + '&access_token=' + pkey ;
  
	getJSON(surfaceURL, function(data) {
  //debugger;
    var latlngs = [];
    var eles = [];
    data.results.forEach(function(d) {
      //console.log("(" + d.latlng.lng.toFixed(6) + "," + d.latlng.lat.toFixed(6) + ")  " + d.ele);
      latlngs.push(d.latlng);
      if (d.ele)
      	eles.push(d.ele.toFixed(1));
      else
      	eles.push(0); // what to do??

    });
    //L.polyline(latlngs, {color: 'red'} ).addTo(map);
    doChart(eles, distance);

  });
},
// handling of routing description
show: function(response) {
	var pr = OSRM.C.PRECISION;
	
	// activate GUI features that need a route
	OSRM.GUI.activateRouteFeatures();
	
	// compute query string
	var query_string = '?hl=' + OSRM.Localization.current_language;
	for(var i=0; i<OSRM.G.markers.route.length; i++)
		query_string += '&loc=' + OSRM.G.markers.route[i].getLat().toFixed(pr) + ',' + OSRM.G.markers.route[i].getLng().toFixed(pr); 
 						
	// create link to the route
	var route_link ='[<a class="text-link" onclick="OSRM.RoutingDescription.onClickCreateShortcut(\'' + OSRM.DEFAULTS.WEBSITE_URL + query_string + '\')">'+OSRM.loc("GET_LINK_TO_ROUTE")+'</a>]';

	// create GPX link
	var gpx_link = '[<a class="text-link" onClick="document.location.href=\'' + OSRM.G.active_routing_server_url + query_string + '&output=gpx\';">'+OSRM.loc("GPX_FILE")+'</a>]';
	//var elevation_link = '[<a class="text-link" onClick="console.log(\"' +  query_string + '\")">'+'Elevation'+'</a>]';
	
	// check highlight marker to get id of corresponding description
	// [works as changing language or metric does not remove the highlight marker!]	
	var selected_description = null;
	if( OSRM.G.markers.highlight.isShown() )
		selected_description = OSRM.G.markers.highlight.description;
		
	// create route description
  var positions = OSRM.G.route.getPositions();

	//OSRM.RoutingDescription.getElevation(); //### scrap this later
  var elevation_link = '[<a class="text-link" onClick="OSRM.RoutingDescription.getElevation();">'+'Elevation'+'</a>]';
	

	var body = "";
	body += '<table class="description medium-font">';
	for(var i=0; i < response.route_instructions.length; i++){
		//odd or even ?
		var rowstyle='description-body-odd';
		if(i%2==0) { rowstyle='description-body-even'; }

		body += '<tr class="'+rowstyle+'">';
		
		body += '<td class="description-body-directions">';
		body += '<img class="description-body-direction" src="'+ OSRM.RoutingDescription._getDrivingInstructionIcon(response.route_instructions[i][0]) + '" alt=""/>';		
		body += '</td>';
		
		body += '<td class="description-body-items">';
		var pos = positions[response.route_instructions[i][3]];
		body += '<div id="description-'+i+'" class="description-body-item '+(selected_description==i ? "description-body-item-selected": "")+'" ' +
			'onclick="OSRM.RoutingDescription.onClickRouteDescription('+pos.lat.toFixed(pr)+","+pos.lng.toFixed(pr)+","+i+')" ' +
			'onmouseover="OSRM.RoutingDescription.onMouseOverRouteDescription('+pos.lat.toFixed(pr)+","+pos.lng.toFixed(pr)+')" ' +
			'onmouseout="OSRM.RoutingDescription.onMouseOutRouteDescription('+pos.lat.toFixed(pr)+","+pos.lng.toFixed(pr)+')">';

		// build route description
		if( response.route_instructions[i][1] != "" )
			body += OSRM.loc(OSRM.RoutingDescription._getDrivingInstruction(response.route_instructions[i][0])).replace(/\[(.*)\]/,"$1").replace(/%s/, response.route_instructions[i][1]).replace(/%d/, OSRM.loc(response.route_instructions[i][6]));
		else
			body += OSRM.loc(OSRM.RoutingDescription._getDrivingInstruction(response.route_instructions[i][0])).replace(/\[(.*)\]/,"").replace(/%d/, OSRM.loc(response.route_instructions[i][6]));

		body += '</div>';
		body += "</td>";
		
		body += '<td class="description-body-distance">';
		if( i != response.route_instructions.length-1 )
		body += '<b>'+OSRM.Utils.toHumanDistance(response.route_instructions[i][2])+'</b>';
		body += "</td>";
		
		body += "</tr>";
	}	
	body += '</table>';
	
	// create route name
	var route_name = "(";
	for(var j=0, sizej=response.route_name.length; j<sizej; j++)
		route_name += ( j>0 && response.route_name[j] != "" && response.route_name[j-1] != "" ? " - " : "") + "<span style='white-space:nowrap;'>"+response.route_name[j]+ "</span>";
	if( route_name == "(" )
		route_name += " - ";
	route_name += ")";
	
	// build header
	header = OSRM.RoutingDescription._buildHeader(OSRM.Utils.toHumanDistance(response.route_summary.total_distance), OSRM.Utils.toHumanTime(response.route_summary.total_time), route_link, gpx_link, route_name,elevation_link);
	
	// check if route_name causes a line break -> information-box height has to be reduced
	var tempDiv = document.createElement('tempDiv');
	document.body.appendChild(tempDiv);
	tempDiv.className = "base-font absolute-hidden";
	tempDiv.innerHTML = route_name;
	var width = tempDiv.clientWidth;
	var max_width = 370;					// 370 = information-box.width - header-subtitle.margin-left	
	document.body.removeChild(tempDiv);

	// update DOM
	document.getElementById('information-box').className = (width > max_width ? 'information-box-with-larger-header' : 'information-box-with-large-header');
	document.getElementById('information-box-header').innerHTML = header;
	document.getElementById('information-box').innerHTML = body;
	
	// add alternative GUI (has to be done last since DOM has to be updated before events are registered)
	OSRM.RoutingAlternatives.show();	
},

// simple description
showSimple: function(response) {
	// build header
	header = OSRM.RoutingDescription._buildHeader(OSRM.Utils.toHumanDistance(response.route_summary.total_distance), OSRM.Utils.toHumanTime(response.route_summary.total_time), "", "");

	// update DOM
	document.getElementById('information-box').className = 'information-box-with-normal-header';	
	document.getElementById('information-box-header').innerHTML = header;
	document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+OSRM.loc("YOUR_ROUTE_IS_BEING_COMPUTED")+"</div>";	
},

// no description
showNA: function( display_text ) {
	// activate GUI features that need a route
	OSRM.GUI.activateRouteFeatures();
	
	// compute query string
	var query_string = '?hl=' + OSRM.Localization.current_language;
	var pr = OSRM.C.PRECISION;
	for(var i=0; i<OSRM.G.markers.route.length; i++)
		query_string += '&loc=' + OSRM.G.markers.route[i].getLat().toFixed(pr) + ',' + OSRM.G.markers.route[i].getLng().toFixed(pr); 
 						
	// create link to the route
	var route_link ='[<a class="text-link" onclick="OSRM.RoutingDescription.onClickCreateShortcut(\'' + OSRM.DEFAULTS.WEBSITE_URL + query_string + '\')">'+OSRM.loc("GET_LINK_TO_ROUTE")+'</a>]';
	
	// build header
	header = OSRM.RoutingDescription._buildHeader("N/A", "N/A", route_link, "");

	// update DOM
	document.getElementById('information-box').className = 'information-box-with-normal-header';	
	document.getElementById('information-box-header').innerHTML = header;
	document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+display_text+"</div>";	
},

// build header
_buildHeader: function(distance, duration, route_link, gpx_link, route_name, elevation_link) {
	var temp = 
		'<div class="header-title">' + OSRM.loc("ROUTE_DESCRIPTION") + (route_name ? '<br/><div class="header-subtitle">' + route_name + '</div>' : '') + '</div>' +
		
		'<div class="full">' +
		'<div class="row">' +

		'<div class="left">' +
		'<div class="full">' +
		'<div class="row">' +
		'<div class="left header-label nowrap">' + OSRM.loc("DISTANCE")+":" + '</div>' +
		'<div class="left header-content stretch">' + distance + '</div>' +
		'</div>' +
		'<div class="row">' +
		'<div class="left header-label nowrap">' + OSRM.loc("DURATION")+":" + '</div>' +
		'<div class="left header-content stretch">' + duration + '</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		
		'<div class="left">' +
		'<div class="full">' +
		'<div class="row">' +
		'<div class="right header-content" id="route-link">' + route_link + '</div>' +
		'</div>' +
		'<div class="row">' +
		'<div class="right header-content">' + gpx_link + '</div>' +
		'</div>' +

		'<div class="row">' +
		'<div class="right header-content">' + elevation_link + '</div>' +
		'</div>' +


		'</div>' +


		'</div>' +
		
		'</div>' +
		'</div>' +		
		
		'</div>';	
	return temp;
},

// retrieve driving instruction icon from instruction id
_getDrivingInstructionIcon: function(server_instruction_id) {
	var local_icon_id = "direction_";
	server_instruction_id = server_instruction_id.replace(/^11-\d{1,}$/,"11");		// dumb check, if there is a roundabout (all have the same icon)
	local_icon_id += server_instruction_id;
	
	if( OSRM.G.images[local_icon_id] )
		return OSRM.G.images[local_icon_id].getAttribute("src");
	else
		return OSRM.G.images["direction_0"].getAttribute("src");
},

// retrieve driving instructions from instruction ids
_getDrivingInstruction: function(server_instruction_id) {
	var local_instruction_id = "DIRECTION_";
	server_instruction_id = server_instruction_id.replace(/^11-\d{2,}$/,"11-x");	// dumb check, if there are 10+ exits on a roundabout (say the same for exit 10+)
	local_instruction_id += server_instruction_id;
	
	var description = OSRM.loc( local_instruction_id );
	if( description == local_instruction_id)
		return OSRM.loc("DIRECTION_0");
	return description;
}

};
///