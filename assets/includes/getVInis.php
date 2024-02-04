<?php include_once "funciones.php";
    $ultPlant = Esquelas::getLastTemplate();
    if($ultimo = $ultPlant->fetch_object()){
        $ubi = str_replace("assets","..",$ultimo->rutaTemplate);
        $lsDats = file_get_contents($ubi);
        header('Content-Type: application/json');
       echo json_encode($lsDats);
    }
?>