<?php include_once 'funciones.php';
$dObj = json_decode($_REQUEST["dts"], false);
$idOra = $_REQUEST["Orc"];
$idMsj = $_REQUEST["Msg"];
$msgPer = $_REQUEST["MsgP"];
  
    $idPlan = $dObj->workspace->propsGrls->id;
    $email = "testEmail@email.com";
    
    $rutaToPdf = '../../pdfsPub';
    if(!file_exists($rutaToPdf)){
        mkdir($rutaToPdf, 0777, true);
    }
    //incluir el folio en el parametro de salida y crear el registro en pub_condolencias    
    $rutaFinal = Condolencias::newCondolencia($email, $idOra, $dObj->workspace->Fallecido->properties->txt, 
          $dObj->workspace->QuienPaga->properties->txt, $idMsj, $msgPer, $dObj->workspace->Condolencia->properties->txt, 
          $dObj->workspace->Fecha->properties->txt, $idPlan, str_replace("../../","", $rutaToPdf), $_SESSION['UserAgent']);
    if($rowCond = $rutaFinal->fetch_object()){
        $salida = $rowCond->salida;
        $arrToSend = array("Fallecido" => $dObj->workspace->Fallecido->properties->txt,
            "QuienPaga" => $dObj->workspace->QuienPaga->properties->txt,
            "Mensaje" => (empty($idMsj) ? $msgPer : $dObj->workspace->Mensaje->properties->txt),
            "Condolencia" => $dObj->workspace->Condolencia->properties->txt,
            "Fecha" => $dObj->workspace->Fecha->properties->txt);
        if(isset($dObj->workspace->Oracion)){
            $arrToSend["Oracion"] = $dObj->workspace->Oracion->properties->txt;
        }
        genPDFPub::genPdfFromTemp($_REQUEST["dts"], false, false, $salida , false, true, $arrToSend);
    }