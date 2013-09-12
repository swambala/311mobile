<?php
	//require_once("database/dbconn.php");

	$result = array("categories"=>array());

	
	//$url_311	=	"http://mobile311-dev.sfgov.org/open311/v2/services.json";
	$url_311	=	"http://311test.baltimorecity.gov/open311/v2/services.json";
	$json_311	= 	curl_process($url_311);
	$json_data_size=sizeof($json_311)-1;
	for($i=0;$i<=$json_data_size;$i++)
	{
		array_push($result["categories"],array(
			"service_code"=>$json_311[$i]->service_code,
			"service_name"=>$json_311[$i]->service_name,
			"metadata"=>$json_311[$i]->metadata,
			"type"=>$json_311[$i]->type,
			"group"=>$json_311[$i]->group
		)); 
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
	function curl_process($json_url)
	{
		// Initializing curl
		$ch = curl_init( $json_url );
		 
		// Configuring curl options
		$options = array(
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER => array('Content-type: application/json') ,
		CURLOPT_SSL_VERIFYPEER => false
		);
		 
		// Setting curl options
		curl_setopt_array( $ch, $options );
		 
		// Getting results
		$result =  curl_exec($ch); // Getting jSON result string
		$json_file=json_decode($result);
		return $json_file;
	}
?>