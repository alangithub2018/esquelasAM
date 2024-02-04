<?php if(!isset($_SESSION)){session_start();}
if(isset($_SESSION['NombreAgent'], $_SESSION['UserAgent']) And 
        !empty($_SESSION['NombreAgent']) And !empty($_SESSION['UserAgent'])){
    include_once "assets/includes/funciones.php";
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Esquelas y Condolencias">
        <meta name="author" content="Sistemas AM">
        <meta name="keyword" content="Sistema, Esquelas, Condolencias">
        <meta http-equiv="content-type" content="text/html;charset=UTF-8">
        <meta http-equiv="cache-control" content="max-age=0">
        <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Expires" content="0">
        <meta http-equiv="Pragma" content="no-cache">
        <title>.::Publicar Condolencia::.</title>
        <link href="assets/css/styles.css.php" rel="stylesheet">
        <link rel="shortcut icon"  type="image/png"  href="assets/img/favicon.ico">
    </head>
    <body>
        <script type="text/javascript" language="javascript" src="assets/js/ajaxJS.js"></script>
        <div data-role="page" class="ui-responsive-panel" id="publiCondo" data-title=".::Publicar Condolencia::.">
            <?php tools::printHeaderApp('pDlgSPub','nvPanPub','btnSlPub'); ?>
            </div><!--Header-->
            <div data-role="main" class="ui-content">
                <div id="loadingAjax"><img class="loadingAjx" src="assets/img/loading/loading.gif" style="margin-top: 3.5rem;" /></div>
                <div id="notification" class="animated fadeInDown">...</div>
                <div id="cdPpal" class="formPub animated fadeInDown" style="padding-top:0;">
                    <div id="contHeader" style="margin-bottom:3rem;">
                        <div id="filtro" class="ui-btn-right" style="margin:0;text-align: right; margin-bottom: -1.5rem; padding-top: 0.195rem;">
                            <!--<label for="fmedsConds" style="text-align:right;">Filtrar:</label>-->
                            <select id="fmedsConds" data-mini="true" data-inline="true" data-icon="filter" data-iconpos="right" data-native-menu="false">
                                <?php
                                $medidas = Esquelas::getMedidas();
                                while ($meds = $medidas->fetch_object()) {
                                    echo "<option value='" . $meds->id . "' " . ($meds->id == 2 ? 'selected=selected' : '') . ">" . utf8_encode(trim($meds->descripcion)) . "</option>";
                                }?>
                            </select>
                        </div>
                    </div>
                    <hr>
                    <div id="slPlan" class="minsCond">
                        <?php
                        echo Esquelas::getMiniaturas("all", 2);
                        ?>
                    </div>
                </div>
                <div id="sgPart" class="formPub animated fadeInDown pdg" style="display: none;">
                    <div style="max-height: 80%;">
                        <label class="control-label" for="nFallecido">Fallecido</label>
                        <div style="width: 55%; margin-right: 0; padding-right: 0;">
                            <input id="nFallecido" type="text" class="inputsCnds" placeholder="Fallecido..." maxlength="61" oncopy="return false" oncut="return false" onpaste="return false" data-clear-btn="true">
                        </div>
                        <div style="width: 45%; text-align:right;margin-top: -3.12rem;margin-bottom: 0;margin-right: -.3rem; margin-left: 0; padding-left: 0; float: right;">
                            <input type="text" size="5" data-mini="true" maxlength="5" style="width: 40px;" data-role="spinbox" name="spin3" id="spnFll" oncopy="return false" oncut="return false" onpaste="return false">
                            <input id="vFOrT" type="hidden" data-role="none" value="">
                        </div>
                        <label class="control-label" for="nPaga">Solicitante</label>
                        <input id="nPaga" type="text" class="inputsCnds" placeholder="Quien Paga..." data-clear-btn="true">
                        <label class="control-label" for="nFecha">Fecha</label>
                        <input id="nFecha" type="text" class="inputsCnds" placeholder="Fecha..." data-clear-btn="true">
                        <div id="shOra" style="display: none;">
                            <label class="control-label" for="orTmplt">Oracion</label>
                            <select id="orTmplt" name="oraTemp">
                                <option value="X">Oracion del catalogo...</option>
                                <?php
                                $oraciones = Esquelas::getCatalogo('oracion');
                                while ($oras = $oraciones->fetch_object()) {
                                    echo "<option value='" . $oras->id . "'>" . utf8_encode(trim($oras->descripcion)) . "</option>";
                                }
                                ?>
                            </select>
                        </div>
                                <div class="ui-grid-b ui-responsive">
                                    <div class="ui-block-a" style="width: 70%;">
                                        <div id="msjContent">
                                            <label style="margin-bottom:4px;" for="menTmplt" class="select">Mensaje</label>
                                            <select style="min-width:1rem;" name="menTemp" id="menTmplt">
                                                <option value="X">Selecciona el mensaje...</option>
                                                <?php
                                                $mensaje = Esquelas::getCatalogo('mensaje');
                                                while ($mens = $mensaje->fetch_object()) {
                                                    echo "<option value='" . $mens->id . "'>" . utf8_encode(trim($mens->descripcion)) . "</option>";
                                                }
                                                ?>
                                            </select>
                                        </div>
                                        <div id="txtMsjPer" style="display:none;">
                                            <label style="margin-bottom:4px;" for="ltxtPer" class="select">Mensaje</label>
                                            <input type="text" style="min-width:1rem;" name="msjPers" id="ltxtPer" placeholder="Mensaje personalizado...">
                                        </div>
                                    </div>
                                    <div class="ui-block-b" style="float: right; text-align: right; width: 30%;">
                                        <label for="slpzdo" style="text-align: right;">Personalizado</label>
                                        <select id="slpzdo" name="spzdo" data-role="slider">
                                            <option value="0" selected="selected">No</option>
                                            <option value="1">Si</option>
                                        </select>
                                    </div>
                                </div>
                        <label class="control-label">Condolencia</label>
                        <div id="colCondo">
                            <button data-role="none" id="btnLeft" class="btn-tool"><img src="assets/img/align_left.png" width="24" height="24"></button>
                            <button data-role="none" id="btnCenter" class="btn-tool"><img src="assets/img/align_center.png" width="24" height="24"></button>
                            <button data-role="none" id="btnRight" class="btn-tool"><img src="assets/img/align_right.png" width="24" height="24"></button>
                            <button data-role="none" id="btnBold" class="btn-tool"><img src="assets/img/bold.png" width="24" height="24"></button>
                            <button data-role="none" id="btnItalic" class="btn-tool"><img src="assets/img/italic.png" width="24" height="24"></button>
                            <button data-role="none" id="btnUndo" class="btn-tool"><img src="assets/img/deshacer.png" width="24" height="24"></button>
                            <button data-role="none" id="btnRedo" class="btn-tool"><img src="assets/img/rehacer.png" width="24" height="24"></button>
                            <button data-role="none" id="btnLB" class="btn-tool"><img src="assets/img/salto_linea.png" width="24" height="24"></button>
                            <div id="stCondo" contenteditable="true" onpaste="OnPaste_StripFormatting(this, event);"></div>
                        </div>
                    </div>
                    <div class="lbtnPub" style="margin-bottom:.2rem;">
                        <button style="margin-left: 0;" id="btnBefore" class="ui-btn ui-icon-back ui-btn-inline ui-btn-icon-left ui-corner-all ui-mini btnIzq">Atras</button>
                        <button style="margin-right: 0;" id="saveCondo" class="ui-btn ui-icon-check ui-btn-inline ui-btn-icon-right ui-corner-all ui-mini btnDere">Guardar</button>
                        <button id="vPrevia" class="btnDere ui-btn ui-icon-eye ui-btn-icon-right ui-btn-inline ui-corner-all ui-mini" style="display: none;">Previa</button>
                    </div>
                </div>
                <div id="shwVPrevia" class="animated fadeIn" style="display: none;"></div>
                <div id="backEdit" class="btnPrevShw animated slideInLeft" style="display: none;"><button data-role="none" id="regrePub" class="prevBtn"><span class="ui-icon ui-icon-back"></span>Atras</button></div>
                <div id="gnPdf" class="btnGenerate animated slideInRight" style="display: none;"><button data-role="none" id="genPub" class="genPdf"><span>PDF</span></button></div>
            </div><!--Contenido-->
            <?php tools::printFooter(); tools::printPanelMenu('nvPanPub'); tools::printPopupSalir('pDlgSPub', 'pubExit'); ?>
            <script type="text/javascript" language="javascript" src="assets/js/pubsJs.js"></script>
        </div>
        </body>
    </html>
<?php }else{
     header('Location: index.php');
} ?>