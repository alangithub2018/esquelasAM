<?php include_once "funciones.php";
    $tp = $_REQUEST['tdesign'];
    $vl = Esquelas::getMiniaturas("all","all");
    echo $vl;
?>