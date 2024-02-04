<?php include_once "funciones.php";
   if(isset($_POST['nameTemp'], $_POST['medidaTemp'], $_POST['pagaTemp'],$_POST['mensajeTemp'],$_POST['fallecidoTemp'],$_POST['condolenciaTemp'],$_POST['fechaTemp'],$_POST['tipoTemp'], $_FILES['fondoTemp'],$_FILES['guiaTemp'])){
        //tenemos los datos requeridos
       $dirImgFondo = "../img/";
       $dirImgGuia = "../img/";
       
       $compPath = '../json/templates/';
       //necesitamos retornar la descripcion del tipo de plantilla para incluirla en la ruta destino
       $tipoPlantilla = intval($_POST['tipoTemp']);
       $nuevaRuta = Esquelas::getDescripcionTemp($tipoPlantilla);
       
       if($nomDir = $nuevaRuta->fetch_object()){
           $compPath .= $nomDir->descripcion;
           $dirImgFondo .= $nomDir->descripcion."/FONDO";
           $dirImgGuia .= $nomDir->descripcion."/GUIA";
           
           if(!file_exists($compPath)){
               mkdir($compPath, 0777);
           }
           
           if(!file_exists($dirImgFondo)){
               mkdir($dirImgFondo, 0777);
           }
           
           if(!file_exists($dirImgGuia)){
               mkdir($dirImgGuia, 0777);
           }
       }
       
       //obtener la extension
        $ext = explode(".", $_FILES['fondoTemp']['name']);
        $extGuia = explode(".", $_FILES['guiaTemp']['name']);
        $lext = end($ext);
        $lextGuia = end($extGuia);
        $san_name = Esquelas::sanear_string($_POST['nameTemp']);
        
        $gtDescTPub = Publicacion::getDescPubli($_POST['tipoTemp']);
        if($retTpDesc = $gtDescTPub->fetch_object()){
            $tipoPDsc = $retTpDesc->descripcion;
        }
        $medida = $_POST['MedText'];
        $insPlantilla = Esquelas::crearPlantilla($_POST['medidaTemp'], $san_name, str_replace("..","assets",$compPath)."/".$san_name."_".$medida.".json", 
                $_POST['tipoTemp'], str_replace("..","assets", $dirImgFondo)."/".$san_name."_Fondo_".$medida.".jpg", 
                str_replace("..","assets",$dirImgGuia)."/".$san_name."_Guia_".$medida.".png",
                "assets/includes/pdfs/".$tipoPDsc."/miniaturas/".$san_name."_".$medida.".png");
       $arrJSON = [];
        //insertamos los datos en la BD
       if($lsid = $insPlantilla->fetch_object()){
            $arrJSON["plantilla"]["id"] = $lsid->id;
            $arrJSON["plantilla"]["medida"] = $lsid->medida;
            $arrJSON["plantilla"]["ancho"] = $lsid->ancho;
            $arrJSON["plantilla"]["alto"] = $lsid->alto;
            $arrJSON["plantilla"]["tipo"] = $lsid->tipo;
            $arrJSON["plantilla"]["rutaTemplate"] = $lsid->rutaTemplate;
            $arrJSON["plantilla"]["rutaFondo"] = $lsid->rutaFondo;
            $arrJSON["plantilla"]["rutaGuia"] = $lsid->rutaGuia;
            $arrJSON["plantilla"]["rutaMini"] = $lsid->rutaMini;
            $arrJSON["plantilla"]["name"] = $lsid->nombre;
       }else{
           $ultReg = 'Error';
       }
       
       $rutaFondo = $dirImgFondo."/".$san_name."_Fondo_".$medida.".".$lext;
       $rutaGuia = $dirImgGuia."/".$san_name."_Guia_".$medida.".".$lextGuia;
        //vamos a mover la imagen de fondo a su ruta correspondiente
       move_uploaded_file($_FILES['fondoTemp']['tmp_name'], $rutaFondo);
       move_uploaded_file($_FILES['guiaTemp']['tmp_name'], $rutaGuia);
       
       if($lext != 'jpg'){
           tools::convertImage($rutaFondo, $dirImgFondo."/".$san_name."_Fondo_".$medida, 100, "jpg");
           unlink($rutaFondo);
       }
       
       if($lextGuia != 'png'){
           tools::convertImage($rutaGuia, $dirImgGuia."/".$san_name."_Guia_".$medida, 100, "png");
           unlink($rutaGuia);
       }
       
       header('Content-Type: application/json');
       echo json_encode($arrJSON);
    }else{
        echo "0";
    }
?>