<?php include_once 'funciones.php'; ini_set("memory_limit", "-1");
$datos = $_REQUEST['djson'];
genPDFPub::genPdfFromTemp($datos, true, true, '', true, false, []);