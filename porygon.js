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
var color=['rgba(255, 0, 0, 0.5)','rgba(0, 255, 0, 0.5)','rgba(0, 0, 255, 0.5)','rgba(255, 255, 0, 0.5)','rgba(255, 0, 255, 0.5)','rgba(0, 255, 255, 0.5)','rgba(255, 255, 255, 0.5)','rgba(247, 191, 190, 0.5)'];

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
    ctx = canvas.getContext("2d");
    ctx.font = "30px Arial black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeText("No map found",10, canvas.height/2);
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
        complete = false;
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

function save_info() {
	if(image_name!=""){
	    	var data = canvas.toDataURL();
		var name_file = image_name;
		var today = new Date();
		var d = today.getDate();
		var m = today.getMonth()+1;
		var y = today.getFullYear();
		var h = today.getHours();
		var mi = today.getMinutes();
		var s = today.getSeconds();
		var name_split = name_file.split(".");
		var filename = name_split[0]+"_"+y+m+d+"_"+h+mi+s+".png";
		var filenameJSON = name_split[0]+"_"+y+m+d+"_"+h+mi+s+".json";

		var form_data = new FormData();
		form_data.append('filenameJSON',filenameJSON);
		form_data.append('data',data);
		form_data.append('filename',filename);
		form_data.append('json',JSON.stringify(obj));

		$.ajax({
		  type: "POST",
		  url: "save_Json_Canvas.php",
		  data: form_data,
		  dataType:"json",
		  cache: false,
		  processData: false,
    		  contentType: false,
		  success :function(data){
		    if(data.error_code==0){
			 alert("Files saved corretly");
		    	 //window.location.href = 'index.php';
		    }
		    else{
		    	alert(data.error_msg);
		    }
		  },
		  error: function(data){
		    alert("Generic Error");
		  }
		});
	}
	else{
		alert("Nothing to save");
	}
}

function setCanvas() {
   image_name = document.getElementById("list_map").value;
   if (image_name==null){
   	image_name="";
   }
   start();
}

function save_json(){
    var data = encode( JSON.stringify(obj));

    var blob = new Blob( [ data ], {
        type: 'application/octet-stream'
    });

    var str="";
    var res = image_name.split(".");
    for( var i=0; i<res.length-1;i++){
        str=str+res[i];
    }
    str.replace(".","_");
    var nam_sav = str+".json";

    url = URL.createObjectURL( blob );


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
function upload_img(){
	var link = document.getElementById("id_file").files[0];
 	var form_data = new FormData();
        form_data.append('file', link);
        form_data.append('newname', link.name);
		$.ajax({
		  type: "POST",
		  url: "upload_pic.php",
		  data: form_data,
		  dataType:"json",
		  cache: false,
		  processData: false,
    		  contentType: false,
		  success :function(data){
		    if(data.error_code==0){
			 alert("File uploaded corretly");
		    	 window.location.href = 'index.php';
		    }
		    else{
		    	alert(data.error_msg);
		    }
		  },
		  error: function(data){
		    alert("Generic Error");
		  }
		});
}

function start(with_draw) {
    drag = false;
    info.innerHTML="&nbsp";
    canvas.removeEventListener('mousedown', point_it);
    area_name=num_fig;
    num_fig=0;
    obj=[];
    var img = new Image();
    img.src = PATH_IMG+image_name;
    img.onload= function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width=img.width;
	canvas.height=img.height;
	while(canvas.width>1000 || canvas.height>700){
		canvas.width=img.width*0.5;
		canvas.height=img.height*0.5;
	}
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}
