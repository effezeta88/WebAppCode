<!DOCTYPE html>
<html>
    <head>
        <title>Indoor Mapping</title>
        <meta charset="UTF-8">
		<link rel="stylesheet" type="text/css" href="css/style.css" >
    </head>
    <body onload="clear_canvas()">
    <div id="button_div" align="center">
		<input type="file" id="id_file" name="id_file" onchange="upload_img()"/>
		<br><br>
		<button onclick="clear_canvas()">Clear</button>
	        <button id="btn_json" onclick="save_info()">Save</button>
	</div>
	<div id="button_draw"  align="center">
		<p class="btn_draw"> Choose the figure to draw:</p>
		<button class="btn_draw" onclick="active_poly()">Polygon</button>
		<button class="btn_draw" onclick="active_rect()">Rectangle</button>
	</div>
	<div class="info_div" align="center"><p id="info_id">&nbsp</p>
	</div>
    <div id="map_image">
        <canvas id="canv_map" style="cursor:crosshair; border:2px solid black;" >
            You don't have map in your folder
        </canvas>
    </div>
	<div id="maps_div" class="div_l">
        <p class="p01" align="center" >List of Maps</p>
		<select id="list_map" class="dim_area" size=10 onchange="setCanvas()">
		<?php
		$dir="/home/ubuntu/map/images/";
		if(is_dir($dir)){
			if($dh = opendir($dir)){
				while(($file = readdir($dh)) !== false){
					if($file !== "." && $file !== ".." && $file !== "json"){
						echo '<option value="'.$file.'">'.$file.'</option>';
						}
				}
			closedir($dh);
			}
		} 
		?>
		</select>
	</div>
	<div id="coordinates_div" class="div_r" >
        <p class="p01" align="center">Coordinates</p>
        <textarea id="coordinates" disable="disable" class="dim_area"></textarea>
	</div>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script type="text/javascript" src="porygon.js"></script>
    </body>
</html>
