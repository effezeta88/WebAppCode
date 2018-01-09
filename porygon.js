var perimeter = new Array();
var complete = false;
var image_name ="";
var PATH_IMG="images/";
var canvas = document.getElementById("canv_map");
var info = document.getElementById("info_id");
var ctx;
var obj;
var num_fig;
var drag;
var rect={};
var area_name;
var color=['rgba(255, 0, 0, 0.5)','rgba(0, 255, 0, 0.5)','rgba(0, 0, 255, 0.5)','rgba(255, 255, 0, 0.5)','rgba(255, 0, 255, 0.5)','rgba(0, 255, 255, 0.5)','rgba(255, 255, 255, 0.5)','rgba(247, 191, 190, 0.5)']

function line_intersects(p0, p1, p2, p3) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1['x'] - p0['x'];
    s1_y = p1['y'] - p0['y'];
    s2_x = p3['x'] - p2['x'];
    s2_y = p3['y'] - p2['y'];

    var s, t;
    s = (-s1_y * (p0['x'] - p2['x']) + s1_x * (p0['y'] - p2['y'])) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0['y'] - p2['y']) - s2_y * (p0['x'] - p2['x'])) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        return true;
    }
    return false;
}

function point(x, y){
    ctx.fillStyle="white";
    ctx.strokeStyle = "white";
    ctx.fillRect(x-2,y-2,4,4);
    ctx.moveTo(x,y);
}

function clear_canvas(){
    ctx = undefined;
    perimeter = new Array();
    complete = false;
    document.getElementById('coordinates').value = '';
    start();
}

function draw(end){
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.lineCap = "square";
    ctx.beginPath();

    for(var i=0; i<perimeter.length; i++){
        if(i==0){
            ctx.moveTo(perimeter[i]['x'],perimeter[i]['y']);
            end || point(perimeter[i]['x'],perimeter[i]['y']);
        } else {
            ctx.lineTo(perimeter[i]['x'],perimeter[i]['y']);
            end || point(perimeter[i]['x'],perimeter[i]['y']);
        }
    }
    if(end){
        ctx.lineTo(perimeter[0]['x'],perimeter[0]['y']);
        ctx.closePath();
        if(num_fig<8)
        	ctx.fillStyle = color[num_fig];
	else
		ctx.fillStyle = color[num_fig-8];
        ctx.fill();
        ctx.strokeStyle = 'blue';
        complete = true;
    }
    ctx.stroke();
}

function check_intersect(x,y){
    if(perimeter.length < 4){
        return false;
    }
    var p0 = new Array();
    var p1 = new Array();
    var p2 = new Array();
    var p3 = new Array();

    p2['x'] = perimeter[perimeter.length-1]['x'];
    p2['y'] = perimeter[perimeter.length-1]['y'];
    p3['x'] = x;
    p3['y'] = y;

    for(var i=0; i<perimeter.length-1; i++){
        p0['x'] = perimeter[i]['x'];
        p0['y'] = perimeter[i]['y'];
        p1['x'] = perimeter[i+1]['x'];
        p1['y'] = perimeter[i+1]['y'];
        if(p1['x'] == p2['x'] && p1['y'] == p2['y']){ continue; }
        if(p0['x'] == p3['x'] && p0['y'] == p3['y']){ continue; }
        if(line_intersects(p0,p1,p2,p3)==true){
            return true;
        }
    }
    return false;
}

function point_it(event) {
    if(complete){
        alert('Polygon already created');
        return false;
    }
    var rect, x, y;

    if(event.ctrlKey || event.which === 3 || event.button === 2){
        if(perimeter.length==2){
            alert('You need at least three points for a polygon');
            return false;
        }
        draw(true);
	num_fig++;
        assign_area();
	event.preventDefault();
	complete=false;
        return false;
    } else {
        rect = canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        if (perimeter.length>0 && x == perimeter[perimeter.length-1]['x'] && y == perimeter[perimeter.length-1]['y']){
            // same point - double click
            return false;
        }
        perimeter.push({'x':x,'y':y,'z':num_fig});
        draw();
        return false;
    }
}

function point_it_rect(event) {
	if(complete){
		alert('Rectangle already created');
		return false;
	}
	var rect, x, y;

	rect = canvas.getBoundingClientRect();
	x = event.clientX - rect.left;
	y = event.clientY - rect.top;
	if(perimeter.length == 0){
		perimeter.push({'x':x,'y':y,'z':num_fig});
    	}
	else if (perimeter.length == 1){
		if(Math.abs(perimeter[0]['x']-x)<Math.abs(perimeter[0]['y']-y))
			perimeter.push({'x':perimeter[0]['x'],'y':y,'z':num_fig});
		else
			perimeter.push({'x':x,'y':perimeter[0]['y'],'z':num_fig});
	}
	else if (perimeter.length == 2){
		if(Math.abs(perimeter[1]['x']-x)<Math.abs(perimeter[1]['y']-y))
			perimeter.push({'x':perimeter[1]['x'],'y':y,'z':num_fig});
		else
			perimeter.push({'x':x,'y':perimeter[1]['y'],'z':num_fig});
	}
	else if (perimeter.length == 3){
		perimeter.push({'x':perimeter[2]['x'],'y':perimeter[0]['y'],'z':num_fig});
	}
	draw();
	if(perimeter.length == 4){
		draw(true);
		num_fig++;
		assign_area();
		event.preventDefault();
		complete=false;

	}
	return false;

    
}

function downloadCanvas(link, filename) {
    link.href = canvas.toDataURL();
    link.download = filename;
}


document.getElementById('download_canvas').addEventListener('click', function() {
    downloadCanvas(this, 'test.png');
}, false);


  function import_canvas(evt) {
 	
    var files = evt.target.files;
    var output = [];

   for (var i = 0,f;f = files[i]; i++) {
      output.push(escape(f.name));
    }
   image_name=output.join('');
   if (image_name!=""){
    	start();
   }

  }

  document.getElementById('inp_files').addEventListener('change', import_canvas, false);


function save_json(){
    var data = encode( JSON.stringify(obj));

    var blob = new Blob( [ data ], {
        type: 'application/octet-stream'
    });
    
    url = URL.createObjectURL( blob );
    var link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', 'data.json' );
    
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );

}
function active_poly(){
        canvas.removeEventListener('mousedown', point_it_rect, false);
	canvas.addEventListener('mousedown', point_it, false);
	info.innerHTML="press <b>Ctrl+Left</b> or <b>Right</b> for close the polygon";
}

function active_rect(){
        canvas.removeEventListener('mousedown', point_it);
	canvas.addEventListener('mousedown', point_it_rect, false);
	info.innerHTML="Start from the <b>top-left vertex</b> and continue <b>counter-clockwise</b>, the program help you to go straight";

}

function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}

function assign_area() {
    area_name = prompt("Name of the Area", "");
    if (area_name == "" || area_name == null) {
	area_name=num_fig;
    }
    if(perimeter.length == 0){
        document.getElementById('coordinates').value = '';
    } else {
	for(var i=0; i<perimeter.length; i++){
		perimeter[i]['z']=area_name;	
	}
	obj.push(perimeter)
	perimeter = new Array();
        document.getElementById('coordinates').value = JSON.stringify(obj);
    }

}

function start(with_draw) {
    drag = false;
    info.innerHTML="&nbsp";
    canvas.removeEventListener('mousedown', point_it);
    var img = new Image();
    area_name=num_fig;
    num_fig=0;
    obj=[];
    if (image_name!=""){	
    	img.src = PATH_IMG+image_name;
    	img.onload = function(){
		canvas.width=img.width;
		canvas.height=img.height;
		while(canvas.width>1000 || canvas.height>700){
			canvas.width=img.width*0.5;
			canvas.height=img.height*0.5;
		}

		ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    	}
   }
}
