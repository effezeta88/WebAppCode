<?php
$target_dir = "/home/ubuntu/map/images/";
$target_JSON = "/home/ubuntu/map/images/json/";
$image=$_POST['data'];
$fileName = $target_dir.$_POST['filename'];
$json = $_POST['json'];
$fileNameJSON= $target_JSON.$_POST['filenameJSON'];

$image = str_replace('data:image/png;base64,', '', $image);
$image = str_replace(' ', '+', $image);
$data = base64_decode($image);

$uploadOk = 1;

if (json_decode($json) != null)
{
     $file = fopen($fileNameJSON,'w+');
     fwrite($file, $json);
     fclose($file);
     $txt = "JSON saved.";
}
else
{
    $txt = "Error in JSON file. Not saved (¿empty?)";
    $uploadOk=0;
}
if($uploadOk==0){
    $results = array("error_code" => 1,"error_msg"=> $txt);
}
else{
    if(file_put_contents($fileName, $data)){
        $results = array("error_code" => 0,"error_msg"=> "OK");
    }
    else{
        $txt =  $txt."\n Error image. Not saved";
        $results = array("error_code" => 1,"error_msg"=> $txt);
    }
}

echo json_encode($results);

?>

