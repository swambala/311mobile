<?php
	
	$result = array("tickets"=>array());
	$jurisdiction_id = isset($_REQUEST["jurisdiction_id"])?$_REQUEST["jurisdiction_id"]:"baltimorecity.gov";
	$api_key = isset($_REQUEST["api_key"])?$_REQUEST["api_key"]:"dc189c48f1047585aecd09333a597b7a";
	$url_311	= "http://311test.baltimorecity.gov/open311/v2/requests.json?jurisdiction_id=baltimorecity.gov&api_key=dc189c48f1047585aecd09333a597b7a";
		
	//To send service request	
	if($_REQUEST["action"] == "create") {
		
		if($_REQUEST["media_data"] != ''){
			$tempFileName = uniqid() . '.jpg';
			$upload_path = "../media/".$tempFileName;
			$media_url = 'http://www.cauvesoft.com/devlbox/sira/311/media/' . $tempFileName;
			$captureImage = $_REQUEST["media_data"];
			$captureImage = str_replace('data:image/jpg;base64,', '', $captureImage);
			$captureImage = str_replace(' ', '+', $captureImage);
			$captureData = base64_decode($captureImage);
			file_put_contents($upload_path, $captureData);
		}
		$url_311 .= "&service_code=" . $_REQUEST["service_code"] . "&lat=" . $_REQUEST["latitude"] . "&long=" . $_REQUEST["longitude"] . "&email=" . $_REQUEST["email"] ."&description=" . urlencode($_REQUEST["description"]). "&media_url=" . $media_url. "&device_id=" . $_REQUEST["device_id"];
		
		$json_311	= 	curl_process($url_311,'',1);
		$result = array("success"=>true,"message"=>$json_311);
		if($_REQUEST["media_data"] != ''){
			unlink($upload_path);
		}
	}else {	//Collect posted services	
		$json_311	= 	curl_process($url_311);
		$json_data_size=sizeof($json_311)-1;
		for($i=0;$i<=$json_data_size;$i++)
		{
			array_push($result["tickets"],array(
				"service_request_id"=>$json_311[$i]->service_request_id,
				"status"=>$json_311[$i]->status,
				"status_notes"=>$json_311[$i]->status_notes,
				"service_name"=>$json_311[$i]->service_name,
				"service_code"=>$json_311[$i]->service_code,
				"description"=>$json_311[$i]->description,
				"requested_datetime"=>date("Y-m-d",strtotime($json_311[$i]->requested_datetime)),
				"updated_datetime"=>$json_311[$i]->updated_datetime,
				"address"=>$json_311[$i]->address,
				"lat"=>$json_311[$i]->lat,
				"long"=>$json_311[$i]->long,
				"media_url"=>$json_311[$i]->media_url,
				"device_id"=>$json_311[$i]->device_id
			));
		}
	}
	if (isset($_REQUEST["callback"])) {
		header("Content-Type: text/javascript");
		echo $_REQUEST["callback"]. "(" .json_encode($result). ");";
	}
	else {
		header("Content-Type: application/x-json");
		echo json_encode($result);
	}
	
	
	//CURL Function 
	function curl_process($json_url,$url_311_params='',$url_post=0)
	{
		// Initializing curl
		$ch = curl_init($json_url);
		
		// Configuring curl options
		if($url_post==1) {
			$options = array(
				CURLOPT_POST=>1,
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_SSL_VERIFYPEER => false
			);
		}else{
			
			$options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HTTPHEADER => array('Content-type: application/json') ,
				CURLOPT_SSL_VERIFYPEER => false		
			);
		}
		 
		// Setting curl options
		curl_setopt_array( $ch, $options );
		 
		// Getting results
		$result =  curl_exec($ch); // Getting jSON result string
		$json_file=json_decode($result);
		return $json_file;
	}
?>