<?php
	define('UPLOAD_DIR', '/home/ubuntu/map/images/');
	$img=$_FILES['file']['name'];
	$link = $_POST['newname'];

	$img = str_replace(' ', '', $img);
	$link = str_replace(' ', '', $link);
	//$fileData = base64_decode($img);
	$imageFile_lenght = explode(".", $img);
	$imageFileType = end($imageFile_lenght);
	$uploadOk=1;
	if (file_exists(UPLOAD_DIR . $img)) {
	    $txt="Sorry, file already exists.";
	    $uploadOk=0;
	}
	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
	    $txt="Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
	    $uploadOk=0;
	}
	if($_FILES["fileToUpload"]["size"]>20971520){
	    $txt = "File too big (20M max)";
	    $uploadOk=0;
	}
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
	    $txt=$txt." Your file was not uploaded.";
	    $results = array("error_code" => 1,"error_msg"=> $txt);
	} else {
		$fileName = UPLOAD_DIR . $link;
		//file_put_contents($fileName, $fileData);
		if(move_uploaded_file($_FILES["file"]["tmp_name"], $fileName)){
	    	$results = array("error_code" => 0,"error_msg"=> "OK");
		}
		else{
			$results = array("error_code" => 1,"error_msg"=> "Error.Your file was not uploaded.");
		}

	}

	echo json_encode($results);
?>