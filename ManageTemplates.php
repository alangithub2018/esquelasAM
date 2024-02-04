<?php if(!isset($_SESSION)){session_start();}
if(isset($_SESSION['NombreAgent'], $_SESSION['UserAgent']) And 
        !empty($_SESSION['NombreAgent']) And !empty($_SESSION['UserAgent'])){
    include_once "assets/includes/funciones.php";
    if($_SESSION['tipoUser'] != 1){
        //obtener la ultima plantilla creada
        $lstTemplate = Esquelas::getLastTemplate();
        if($ultTemp = $lstTemplate->fetch_object()){
            $json_data = file_get_contents($ultTemp->rutaTemplate);
            $pTemplate = json_decode($json_data, false);
        }
?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Esquelas y Condolencias" />
    <meta name="author" content="Sistemas AM" />
    <meta name="keyword" content="Sistema, Esquelas, Condolencias" />
    <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Expires" content="0" />
    <meta http-equiv="Pragma" content="no-cache" />
    <title>.::|::.Generar Plantilla.::|::.</title>
    <link rel="stylesheet" type="text/css" href="assets/css/styles.css.php" />
    <link rel="shortcut icon"  type="image/png"  href="assets/img/favicon.ico">
    <style type="text/css">
        /* width */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            border-radius: 10px;*/
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
            -webkit-border-radius: 10px;
            border-radius: 10px;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.9);*/
            background: -moz-linear-gradient(top,#ffffff 0%,#ffffff 50%,#b5b5b5);
            background: -webkit-gradient(linear, left top, left bottom,from(#ffffff),color-stop(0.50, #ffffff),to(#b5b5b5));
            -moz-border-radius: 10px;
            -webkit-border-radius: 10px;
            border-radius: 10px;
            border: 3px solid #e4e6e3;
            -moz-box-shadow:0px 1px 3px rgba(000,000,000,0.5),inset 0px 0px 3px rgba(255,255,255,1);
            -webkit-box-shadow:0px 1px 3px rgba(000,000,000,0.5),inset 0px 0px 3px rgba(255,255,255,1);
            box-shadow:0px 1px 3px rgba(000,000,000,0.5),inset 0px 0px 3px rgba(255,255,255,1);
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: -moz-linear-gradient(top,#ebebeb 0%,#ffffff 50%,#9e969e);
            background: -webkit-gradient(linear, left top, left bottom,from(#ebebeb),color-stop(0.50, #ffffff),to(#9e969e));
            -moz-border-radius: 10px;
            -webkit-border-radius: 10px;
            border-radius: 10px;
            border: 3px solid #e4e6e3;
            -moz-box-shadow:0px 1px 3px rgba(000,000,000,0.5),inset 0px 0px 3px rgba(255,255,255,1);
            -webkit-box-shadow:0px 1px 3px rgba(000,000,000,0.5),inset 0px 0px 3px rgba(255,255,255,1);
            box-shadow: 0px 1px 3px rgba(000,000,000,0.5), inset 0px 0px 3px rgba(255,255,255,1);
        }
        <?php 
            //construir el style de los elementos
            $textos = [];
            foreach($pTemplate as $workspace){
                foreach($workspace as $elem => $value){
                    if($elem != "propsGrls"){
                        foreach($value as $prop){
                            $lwdth = $prop->clW;
                            $lhgth = $prop->clH;
                            $ltalgn = $prop->alGn;
                            $lfsz = $prop->tFn;
                            $lfst = $prop->sFn;
                            $lbld = $prop->fnBld;
                            $lcolor = $prop->fnCol;
                            $lht = $prop->lineH;
                            $ltrSp = $prop->lettSpc;
                            $textos[$elem] = $prop->txt;
                        }
                       
                        echo "#".$elem."{
                            width: ".str_replace("px","",$lwdth)."px;
                            height: ".str_replace("px","",$lhgth)."px;
                            text-align: $ltalgn;
                            font-size: $lfsz;
                            font-style: $lfst;
                            font-weight: $lbld;
                            color: $lcolor;
                            line-height:".$lht.";
                            letter-spacing:".$ltrSp.";
                        }\n";
                    }
                }
            }
        ?>
        #workspace{
          /*background: url("../img/gayosso-doble8(4x3).jpg");   -------4x3*/
          background-image: url("<?php echo str_replace("..","assets",$pTemplate->workspace->propsGrls->background); ?>");
          background-position: top left;
          background-repeat: no-repeat;
          /*background-size: 146.187mm 134.993mm;    ------4x3*/
          background-size: <?php echo $pTemplate->workspace->propsGrls->ancho; ?>mm <?php echo $pTemplate->workspace->propsGrls->alto; ?>mm;
          /*margin: 0 auto; */
          margin: 4.5rem auto 0 35%;
          background-color: lightgray;
          border: 2px solid #000;
          width: <?php echo $pTemplate->workspace->propsGrls->ancho; ?>mm;
          height: <?php echo $pTemplate->workspace->propsGrls->alto; ?>mm;
          -webkit-animation-duration:3.5s;
          -moz-animation-duration:3.5s;
        }
        input[type=range]{
          padding-left: 0px;
          padding-right: 0px;
        }
        #tmFont{
          width: 3.8rem;
        }
        #fntStyle{
          width: 6rem;
        }
        #fnAlign{
          width: 6rem;
        }
        #lblGuia{
            text-align: left;
            margin-left: -0.5rem;
            padding-left: 0;
            margin-bottom:0;
            padding-bottom:0;
            margin-top:.6rem;
        }
</style>
</head>
<body style="background:gray;">
    <script type="text/javascript" language="javascript" src="assets/js/ajaxJS.js"></script>
    <div data-role="page" class="ui-responsive-panel" id="MngTemplate" data-title=".::|::.Generar Plantilla.::|::." style="background:gray;">
        <div id="loadingAjax"><img class="loadingAjx" src="assets/img/loading/loading.gif" style="margin-top: 3.5rem;" /></div>
        <div id="notification" class="animated fadeInDown">Plantilla creada exitosamente!!</div>
        <div id="changeBackground" class="Modal animated fadeIn">
            <div id="chFrmBck" class="ModalBody contentForm animated fadeInDown">
                <div id="hdrBck" class="ModalHeader">Cambiar fondo de plantilla</div>
                <div id="cntBck" class="ModalGrid">
                    <form data-role="none" id="formChgBck" name="changeBck" onsubmit="return false">
                        <div class="grid grow">
                            <label>Nuevo Fondo</label>
                            <input data-role="none" id="ldnFondo" style="width:20%;" type="file" name="fondoNw" class="formInputs" placeholder="Nuevo Fondo..." /><br>
                            <label>Nueva Guia</label>
                            <input data-role="none" id="ldnGuia" style="width:20%;" type="file" name="GuiaNw" class="formInputs" placeholder="Nueva Guia..." /><br>
                            <div class="contButton"><button data-role="none" id="sendNwBck" class="btnForm chgBackg">&nbsp;</button></div>
                            <div class="contButton"><button data-role="none" id="cncldnwBck" data-target="changeBackground" class="btnForm cancelBtn">&nbsp;</button></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div id="nwTemplate" class="Modal animated fadeIn">
            <div id="frmNWTemplate" class="ModalBody contentForm animated fadeInDown">
                <div id="myHdr" class="ModalHeader">Ingresa los datos</div>
                <div id="col2" class="ModalGrid">
                    <form data-role="none" id="formNwTemplate" name="nuevaPlantilla" enctype="multipart/form-data" onsubmit="return false">
                        <div class="grid grow">
                            <label>Plantilla</label>
                            <input data-role="none" id="nmTemplate" name="nameTemp" type="text" class="formInputs" placeholder="Nombre..." autocomplete="off" />
                        </div>
                        <div class="grid grow">
                            <div style="padding-left:0; margin-left:0; width: 100%;">
                                <label style="text-align:left; padding-left:0.1rem;">Tipo</label>
                                <select style="width:98%; text-align:left; margin-left:0;" data-role="none" id="tpTemplate" name="tipoTemp" class="formInputs">
                                <option value="X">Selecciona el tipo...</option>
                                <?php
                                    $tipo = Esquelas::getTiposPlantillas();
                                    while($tps = $tipo->fetch_object()){
                                        echo "<option value='".$tps->id."'>".utf8_encode(trim($tps->descripcion))."</option>";
                                    }
                                ?>
                                </select>
                            </div>
                        </div>
                        <div class="grid grow">
                        <label>Medida</label>
                        <select data-role="none" id="mdTemplate" name="medidaTemp" class="formInputs">
                            <option value="X">Selecciona la medida...</option>
                            <?php
                                $medidas = Esquelas::getMedidas();
                                while($meds = $medidas->fetch_object()){
                                    echo "<option value='".$meds->id."'>".utf8_encode(trim($meds->descripcion))."</option>";
                                }
                            ?>
                        </select>
                        </div>
                        <div class="grid grow">
                            <label>Paga</label>
                            <input data-role="none" id="pgTemplate" name="pagaTemp" type="text" class="formInputs" placeholder="Paga..." autocomplete="off" />
                        </div>
                        <label for="actOra">Oracion</label><input id="actOra" type="checkbox" checked="checked">
                        <select data-role="none" id="orTemplate" name="oracionTemp" class="formInputs">
                            <option value="X">Oracion del catalogo...</option>
                            <?php $oraciones = Esquelas::getCatalogo('oracion');
                                while($oras = $oraciones->fetch_object()){
                                    echo "<option value='".$oras->id."'>".utf8_encode(trim($oras->descripcion))."</option>";
                                }
                            ?>
                        </select>
                        <div class="grid grow">
                            <span>Mensaje</span>
                            <select data-role="none" id="mnTemplate" name="mensajeTemp" class="formInputs">
                                <option value="X">Selecciona el mensaje...</option>
                                <?php
                                    $mensaje = Esquelas::getCatalogo('mensaje');
                                    while($mens = $mensaje->fetch_object()){
                                        echo "<option value='".$mens->id."'>".utf8_encode(trim($mens->descripcion))."</option>";
                                    }
                                ?>
                            </select>
                        </div>
                        <div class="grid grow">
                            <label>Fallecido</label>
                            <input data-role="none" id="fllTemplate" name="fallecidoTemp" type="text" class="formInputs" placeholder="Fallecido..." autocomplete="off" />
                        </div>
                        <div class="grid grow">
                            <label>Condolencia</label>
                            <input data-role="none" id="cndTemplate" name="condolenciaTemp" type="text" class="formInputs" placeholder="Condolencia..." autocomplete="off" />
                        </div>
                        <div class="grid grow">
                            <label>Fecha</label>
                            <input data-role="none" id="fchTemplate" name="fechaTemp" type="text" class="formInputs" placeholder="Fecha..." />
                        </div>
                        <div class="grid grow">
                            <label>Fondo</label>
                            <input data-role="none" id="bgTemplate" type="file" name="fondoTemp" class="formInputs" placeholder="Fondo..." />
                            <label>Guia</label>
                            <input data-role="none" id="gaTemplate" type="file" name="guiaTemp" class="formInputs" placeholder="Guia..." />
                        </div>
                        <div class="grid grow">
                            <div style="text-align:left; width:100%;">
                                <div class="contButton" style="width:85%;float:left;"><button data-role="none" id="sendNwTemplate" class="btnForm createTemplate">&nbsp;</button></div>
                                <div class="contButton" style="width:15%; float:right;"><button data-role="none" id="cncNWTemplate" data-target="nwTemplate" class="btnForm cancelBtn">&nbsp;</button></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <?php tools::printHeaderApp('pDlgMngT','nvPanMngT','btnSlMngT'); ?>
        </div><!--Header-->
        <div data-role="main" class="ui-content">
            <div id="cntThmbs" class="shPlantillas animated zoomInLeft">
                <div class="shTxtPlantilla">
                    <input data-role="none" type="text" class="searchPl" value="" placeholder="Buscar..." />
                    <select data-role="none" class="searchPl">
                        <option selected="selected" value="all">Todos</option>
                        <option value="4x3">4x3</option>
                        <option value="7x3">7x3</option>
                    </select>
                    <div id="myTemplates" class="contPlants">
                        <?php
                           echo Esquelas::getMiniaturas('all','all');
                        ?>
                    </div>
                </div>
            </div>
            <div id="lblEdt" class="editando"></div>
            <div id="lblPos" class="posicion"></div>
            <div id="lblDms" class="dimension"></div>
            <div id="tools" class="animated zoomInDown">
                <div id="cntNew"><input data-role="none" id="addTemplate" type="button" class="newWork openModal" data-target="nwTemplate" /></div>
                <div id="edtNew"><input data-role="none" id="edtTemplate" type="button" class="edtWork openModal" data-target="changeBackground" /></div>
                <div id="contentEdit"><input data-role="none" id="contentEdt" type="button" class="editObj" disabled='disabled' /></div>
                <div id="contentIcon"><input data-role="none" id="contentPDF" type="button" class="gpdf" /></div>
                <div class="contentImg"><input data-role="none" id="contentSvd" type="button" class="saveWork" disabled="disabled" /></div>
                <!--<div id="nmPlant" contenteditable="true" style="text-align:center;">Pon aqui un NOMBRE</div>-->
        <!--        <label>Fuente</label>-->
                <select data-role="none" id="tpFont" class="controller" disabled="disabled" style="margin-right:0.5rem;">
                    <option value="palatino">Palatino</option>
                </select>
                <label for="tmFont">Tamaño</label>
                <select data-role="none" id="tmFont" class="controller" disabled="disabled" style="margin-right:0.5rem;">
                    <?php
                        echo '<option value="x">...</option>';
                        for($x = 8; $x < 73; $x++){
                            echo '<option value="'.$x.'">'.$x.'</option>';
                            if($x < 17){
                                echo '<option value="'.($x + 0.5).'">'.($x + 0.5).'</option>';
                            }
                        }
                    ?>
                </select>
                <label for="fntStyle">Estilo</label>
                <select data-role="none" id="fntStyle" class="controller" disabled="disabled" style="margin-right:0.5rem;">
                    <option value="x">...</option>
                    <option value="italic">Cursiva</option>
                    <option value="normal">Normal</option>
                    <option value="oblique">Oblicua</option>
                </select>
                <label for="fnAlign">Alineacion</label>
                <select data-role="none" id="fnAlign" class="controller" disabled="disabled" style="margin-right:0.5rem;">
                    <option value="x">...</option>
                    <option value="left">Izquierda</option>
                    <option value="center">Centrado</option>
                    <option value="right">Derecha</option>
                    <option value="justify">Justificar</option>
                </select>
                <label for="fntBold">Negrita</label>
                <input data-role="none" type="checkbox" id="fntBold" name="fnegrita" value="bold" disabled='disabled'>
                <label for="fntColor">Color</label>
                <div class="dColor">
                <input data-role="none" type="color" id="fntColor" name="fnColor" value="#000000" disabled='disabled'>
                </div>
                <label for="lnHgt" id="linterl">Interlineado</label>
                <input data-role="none" id="lnHgt" name="lnHeight" class="ranges" type="range" step="0.1" value="0" min="-1" max="48" disabled="disabled">
                <label for="ltrSpc">Espaciado</label>
                <input data-role="none" id="ltrSpc" name="ltrSpacing" class="ranges" type="range" step="0.1" value="0" min="-2" max="10" disabled="disabled">
                <input data-role="none" type="checkbox" id="actGuia" name="vGuia">
                <label for="actGuia" id="lblGuia">Guia</label>
                <div style="font-family:Arial;">&nbsp;<wbr></div>
          </div>
            <div id="workspace" class="animated fadeIn"><!--Los siguientes elementos deben salir de BD-->
                    <?php
                        //vamos a solicitar el ultimo template creado!!
                        foreach($textos as $clave => $value){
                            if($clave != "propsGrls"){
                                echo "<div id=\"".$clave."\" class=\"resizable\">
                                    <div class=\"resizers\">
                                        <div class=\"contentTXT\">
                                            ".trim($value)."
                                        </div>
                                        <div class='resizer top-left'></div>
                                        <div class='resizer top-right'></div>
                                        <div class='resizer bottom-left'></div>
                                        <div class='resizer bottom-right'></div>
                                    </div></div>";
                            }
                        }
                    ?>
                  <!--Los siguientes elementos deben salir de BD-->
              </div>
        </div><!--Contenido-->
        <script type="text/javascript" language="javascript" src="assets/js/js.js"></script>
        <?php tools::printFooter(); tools::printPanelMenu('nvPanMngT'); tools::printPopupSalir('pDlgMngT', 'MngTExit'); ?>
    </div>
</body>
</html>
<?php 
    }else{
        header('Location: pubCondolencias.php');
    }
}else{
     header('Location: index.php');
} ?>