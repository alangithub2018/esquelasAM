<?php if(!isset($_SESSION)){session_start();}
if(isset($_SESSION['NombreAgent'], $_SESSION['UserAgent']) And 
        !empty($_SESSION['NombreAgent']) And !empty($_SESSION['UserAgent'])){
    include_once 'assets/includes/funciones.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="with=device-width, initial-scale=1.0" />
        <meta name="description" content="Condolencias" />
        <meta name="author" content="Sistemas AM" />
        <meta name="keyword" content="Sistema, Condolencias, Listado" />
        <meta http-equiv="cache-control" content="max-age=0" />
        <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Expires" content="-1" />
        <meta http-equiv="Pragma" content="no-cache" />
        <title>.::|::.Log de Actividad.::|::.</title>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="assets/css/styles.css.php">
        <link rel="shortcut icon" type="image/png" href="assets/img/favicon.ico">
    </head>
    <body>
        <script type="text/javascript" language="javascript" src="assets/js/ajaxJS.js"></script>
        <div data-role="page" class="ui-responsive-panel" id="listCondo" data-title=".::Log de Actividad::.">
            <?php tools::printHeaderApp('pDlgActLst','nvPanelALst','btnSlALst'); ?>
                <div class="ui-bar ui-bar-a">
                    <form>
                        <input type="search" id="filterTable-AcList" data-theme="d" data-clear-btn="true" placeholder=" Buscar...">
                    </form>
                </div>
            </div><!--Header-->
            <div data-role="main" class="ui-content">
                <div class="containerPpal">
                    <table id="TblActivList" data-role="table" data-filter="true" align="center" cellspacing="0" cellpadding="6" data-input="#filterTable-AcList" data-mode="reflow" class="ui-responsive ui-shadow table-striped tblencabezadoConds">
                        <caption style="font-family: Arial Narrow; font-size: 1.6rem;">ACTIVIDAD EN EL SISTEMA</caption>
                    <thead>
                        <tr>
                            <th data-priority="1">USUARIO</th>
                            <th data-priority="2">FECHA</th>
                            <th data-priority="3">EVENTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                           tools::printLogSystem();
                        ?>
                    </tbody>
                    <tfoot>
                        <tr><td colspan='6'>Listado de Actividades Realizadas en el sistema</td></tr>
                    </tfoot>
                    </table>
                </div>
            </div><!--Contenido-->
            <?php tools::printFooter(); tools::printPanelMenu('nvPanelALst'); tools::printPopupSalir('pDlgActLst','lstAcexit'); ?>
        </div><!--Pagina-->
    </body>
</html>
<?php }else{
     header('Location: index.php');
} ?>