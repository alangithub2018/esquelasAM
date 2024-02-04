<?php if(!isset($_SESSION)){session_start();}
include("mpdf/mpdf.php");
class getParams{
    
    private static $vinstancia;
    public $path;
    public $content;
    public $parser;
    
    public function __construct() {
        $this->path = explode("\\", getcwd());
        $this->content = end($this->path)=='cye' ? 'assets/includes/setting.ini' : 'setting.ini';
        $this->parser = parse_ini_string(Esquelas::encrypt_decrypt('decrypt', base64_decode(file_get_contents($this->content))),true);
    }
    
    public static function Instancia(){
        if(is_null(self::$vinstancia)){
            self::$vinstancia = new self();
        }
        return self::$vinstancia;
    }
    
    /**
     * 
     * @param type $modulo
     * @param type $valor
     * @return String Devuelve el valor de configuracion solicitado
     * @return String
     */
    public function transConfig($modulo, $valor){
        return $this->parser[$modulo][$valor];
    }
    
    public function __destruct(){
        $this->parser = null;
        $this->content = null;
        $this->path = null;
    }
}

class SqlSrv extends getParams{
    private static $instance, $serverName, $dbname, $user, $password;
    protected $connection, $statement = null, $status = null;
    
    public function __construct(){
        parent::__construct();
        try{
            $this->setParams();
            //$this->connection = new PDO("odbc:host=".self::$serverName.";dbname=".self::$dbname.";", self::$user, self::$password);
            $this->connection = new PDO("odbc:Driver={SQL Server Native Client 10.0};Server=".self::$serverName.";Database=".self::$dbname.";", self::$user, self::$password);
            $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
            $this->status = $this->connection ? true : false;
        } catch (PDOException $ex) {
            die(print_r($ex->getMessage()));
        }
    }
    
    public static function getInstance(){
        if(is_null( self::$instance ) ){
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function setParams(){
        self::$serverName = $this->transConfig('odbc','server');
        self::$dbname = $this->transConfig('odbc','mdatabase');
        self::$user = $this->transConfig('odbc','muser');
        self::$password = $this->transConfig('odbc','mpassword');
    }
    
    public function getStatus(){
        return $this->status;
    }
    
    public function preparar($consulta){
        $this->statement = $this->connection->prepare($consulta);
    }
    
    public function ejecutar(array $values){
        $this->statement->execute($values);
        if($this->statement->rowCount()==0){
            $this->statement->closeCursor();
        }
    }
    
    public function stored_proc($proc, array $params){
        $tots = count($params); $prevls = [];
        if ($tots > 1):
            for ($x = 0; $x < $tots; $x++): array_push($prevls, '?');
            endfor;
        else: array_push($prevls, '?'); endif;
        if ($this->getStatus()):
            $this->preparar("EXEC " . $proc . " " . ($tots ? implode(",", $prevls) : $prevls[0]));
            $this->ejecutar($params);
        endif;
        return $this->statement;
    }
    
    public function select($string, array $vals){
        if($this->getStatus()):
        $this->preparar(utf8_decode($string));
        $this->ejecutar($vals);
        endif;
        return $this->statement;
    }
    
    public function __destruct() {
        parent::__destruct();
        self::$instance = null;
        $this->statement = null;
        $this->connection = null;
        $this->status = null;
    }
}

class Conexion extends mysqli{
    
    const __MYSQL__ = "conexion";
    
    private static $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $instance = null;
    public static $DIR, $END_PATH, $RUTA;
    protected static $CONFIG;
    
    public function __construct() {
        $this->setParameters();
        parent::__construct(self::$DB_HOST, self::$DB_USER, self::$DB_PASS, self::$DB_NAME);
        if(mysqli_connect_error()){
            exit('Connect Error (' . mysqli_connect_errno() . ') '
                    . mysqli_connect_errno());
        }
        parent::set_charset('utf-8');
    }
    
    /* Obtiene la instancia de conexion correspondiente */
    
    public static function getInstance() {
        if(!self::$instance instanceof self){
            self::$instance = new self;
        }
        return self::$instance;
    }
    
    protected static function getBase(){
        self::setParameters();
        return self::$DB_NAME;
    }
    
    /* no se permite duplicar la instancia de conexion */
    
    public function __clone() {
        trigger_error('Clone is not allowed.', E_USER_ERROR);
    }
    
    public function __wakeup() {
        trigger_error('Deserializing is not allowed.', E_USER_ERROR);
    }
    
    /* se setean los parametros de las variables privadas */
    
    private static function setParameters(){
        self::$DB_HOST = getParams::Instancia()->transConfig(self::__MYSQL__, "hostname");
        self::$DB_USER = getParams::Instancia()->transConfig(self::__MYSQL__, "username");
        self::$DB_PASS = getParams::Instancia()->transConfig(self::__MYSQL__, "password");
        self::$DB_NAME = getParams::Instancia()->transConfig(self::__MYSQL__, "database");
    }
    
    /* funcion global que ejecuta consultas en mysql */
    
    public function query($query, $resultx = MYSQLI_USE_RESULT){
        /* llamada al metodo padre de mysqli */
        $result = parent::query($query , MYSQLI_USE_RESULT);
        if(mysqli_error($this)){
            throw new Exception(mysqli_error($this), mysqli_errno($this));
        }
        return $result;
    }
    
    /* se cierra la conexion automaticamente despues de cada procedimiento */
    
    public function __destruct() {
        parent::close();
    }
}

class CRUD extends Conexion{
    public static $rf = array();
    
    public static function stored_procedure($afrws, $nombre, $tparams, $tips, $valores){
        $nmpr = ($tparams >= 1) ? "?" : "";
        if ($tparams > 1): for ($x = 1; $x < $tparams; $x++): $nmpr .= ",?"; endfor; endif;
        $str = "CALL " . $nombre . "(" . $nmpr . ")";
        $sp = parent::getInstance()->prepare($str);
        if (count($valores) > 0 AND $tparams > 0):
            call_user_func_array(array($sp, 'bind_param'), array_merge(array($tips), self::Referencing(array_merge($valores))));
        endif;
        $rw = $sp->execute(); if ($rw === false): die('execute() failed: ' . htmlspecialchars($sp->error)); endif;
        return $afrws ? $sp->affected_rows : $sp->get_result();
    }
    
    public static function Qsencillo($str){
        $sql_Qsencillo = parent::getInstance()->prepare($str); $sql_Qsencillo->execute(); return $sql_Qsencillo->get_result();
    }
    //consulta global que minoriza la cantidad de codigo
    static function Consultar($tabla, $ccampos, $tipos, $valor, $inner, $cson, $aftwh, $grpb, $vrgb, $ord, $lo, $lmt, $elmt){
        $elementos = count($ccampos) > 1 ? implode(",", $ccampos) : ($ccampos[0] == 'all' ? '*' : $ccampos[0]);
        if($inner): $ct = 0; $ct2 = 0;
            for($x=0;$x<count($tabla);$x++): $tabla[$x] = self::getBase().".".$tabla[$x];
                if($x>=1): $ct++; $tabla[$x] .= " ON ".$cson[$ct-1+$ct2]." = ".$cson[$ct+$ct2]; $ct2++; endif;
            endfor; $inter = implode(" INNER JOIN ", $tabla);
        else: $inter = self::getBase().".".$tabla; endif; $tdw = count($aftwh);
        for($z=0;$z<$tdw;$z++): $aftwh[$z] = $aftwh[$z]." = ?"; endfor;
        if($tdw>1): $enq = ' WHERE '.implode(" AND ", $aftwh); elseif($tdw==1): $enq = ' WHERE '.$aftwh[0]; endif;
        $li = count($elmt) > 1 ? '?,?' : !empty($elmt) ? '?' : ''; $lsgrb = count($vrgb) > 1 ? implode(",", $vrgb) : empty($vrgb) ? '' : $vrgb[0];
        $grpby = $grpb ? ' GROUP BY '.$lsgrb : '';
        $ord_lmt = $ord ? ' ORDER BY '.$lo : ''; $ord_lmt .= $lmt ? ' LIMIT '.$li : '';
        //var_dump("SELECT ".$elementos." FROM ".$inter." ".$enq.$grpby.$ord_lmt);
        $sql_Cons = parent::getInstance()->prepare("SELECT ".$elementos." FROM ".$inter." ".$enq.$grpby.$ord_lmt);
        if(count($valor)>0 OR count($elmt)>0): call_user_func_array(array($sql_Cons,'bind_param'), array_merge(array($tipos),self::Referencing(array_merge($valor,$elmt)))); endif;
        $rw = $sql_Cons->execute(); if($rw===false): die('execute() failed: '.htmlspecialchars($sql_Cons->error)); else: return $sql_Cons->get_result(); endif;
    }
    //exclusivamente borrar datos
    static function Borrar($tabla,$valor){
        $stmt_del = parent::getInstance()->prepare("DELETE FROM ".self::getBase().".".$tabla." WHERE ".$tabla.".id = ?");
        $idn = $valor; $stmt_del->bind_param('i',$idn);
        $stmt_del->execute(); $afectados = $stmt_del->affected_rows;
        return intval($afectados);
    }
    static function Insertar($tabla,$campos,$tip,$vls){
        $tcin = count($campos); $str = [];
        for($x=0;$x<$tcin;$x++): array_push($str, "?"); endfor;
        $arcmpin = $tcin > 1 ? implode(",", $campos) : $campos[0]; $signs = $vls > 1 ? implode(",", $str) : "?";
        $stmt_in = parent::getInstance()->prepare("INSERT INTO ".self::getBase().".".$tabla." (".$arcmpin.") VALUES (".$signs.")");
        call_user_func_array(array($stmt_in,'bind_param'), array_merge(array($tip), self::Referencing($vls))); $rs = $stmt_in->execute();
        if($rs === false): die('execute() failed: '.htmlspecialchars($stmt_in->error));
        else: return $stmt_in; endif;
        //var_dump(self::Referencing($vls));
    }
    static function Modificar($tabla, $campos, $tps, $vals){
        $tcampos = count($campos); for($x=0;$x<$tcampos;$x++): $campos[$x] .= " = ?"; endfor;
        $arcampos = $tcampos > 1 ? implode(",", $campos) : $campos[0];
        $sql_Upd = parent::getInstance()->prepare("UPDATE ".self::getBase().".".$tabla." SET ".$arcampos." WHERE ".$tabla.".id = ?");
        call_user_func_array(array($sql_Upd,'bind_param'), array_merge(array($tps), self::Referencing($vals)));
        $sql_Upd->execute(); $res = $sql_Upd->affected_rows;
        return $res;
    }
    
    static function Referencing($ar){
        foreach ($ar as $k => $v): $cn = $ar[$k];
            if(is_int($cn)): $ar[$k] = intval($cn);
            elseif(is_double($cn)): $ar[$k] = doubleval($cn);
            elseif(is_null($cn) or empty($cn)): $ar[$k] = NULL;
            else: $ar[$k] = trim(utf8_decode($cn)); endif;
            self::$rf[$k] = &$ar[$k];
        endforeach;
        return $ar;
    }
}

class Batch{
    public static function execInBackground($cmd) {
        if (substr(php_uname(), 0, 7) == "Windows"){
            pclose(popen("start /B ". $cmd, "r"));  
        } 
        else { 
            exec($cmd . " > /dev/null &");
        }
    }
}

class Condolencias{
    public static function newCondolencia($eml, $nOr, $nFll, $nPg, $nMn, $nMnP, $nCnd, $nFch, $idPl, $rtPdf, $agent){
        $getRutFinal = CRUD::stored_procedure(false, "sp_newCondolencia", 11, 'sississsiss', [$eml, $nOr, $nFll, $nPg, 
          $nMn, $nMnP, $nCnd, $nFch, $idPl, $rtPdf, $agent]);
        return $getRutFinal;
    }
    public static function getCondolenciasGen(){
        $getGeneradas = CRUD::stored_procedure(false, "sp_getCondsGeneradas", 2, 'si', [$_SESSION['UserAgent'], intval($_SESSION['tipoUser'])]);
        return $getGeneradas;
    }
    
    public static function printCondosGenerate(){
        $data = self::getCondolenciasGen();
        while($datos = $data->fetch_object()){
            echo "<tr>
                <td align='center'>".$datos->folio."</td><td>".$datos->fecha_captura."</td>
                <td align='center'>".$datos->medida."</td>
                <td>".utf8_encode($datos->fallecido)."</td><td>".utf8_encode($datos->QuienPaga)."</td>
                <td align='center'><a target='_blank' href='".$datos->ruta_pdf."'><img alt='descargarCondolencia' src='assets/img/pdf.png'></a></td>
                </tr>";
        }
    }
}

class Esquelas{
    public static function getPathTemplateByName($name){
        $myArr = array($name);
        $pathTemplate = CRUD::stored_procedure(false, "sp_getPathTemplateByName", 1, 's', $myArr);
        return $pathTemplate;
    }
    
    public static function getLastTemplate(){
        $lastTemplate = CRUD::stored_procedure(false, "sp_getLastTemplate",0,'',[]);
        return $lastTemplate;
    }
    
    public static function NuevaEsquela(array $datos){
       $insEsquela = CRUD::stored_procedure(true, "sp_insertaEsquela", 8, 'ssssssss', $datos);
       if(intval($insEsquela) > 0){
           echo "1";
       }else{
           echo "0";
       }
    }
    
    public static function getCatalogo($tipo){
        $prcOra = CRUD::stored_procedure(false,"sp_getCatalogoTemp",1,'s',[$tipo]);
        return $prcOra;
    }
    
    public static function getMiniaturas($t,$m){
        $htmlT = "";
        $getMinis = CRUD::stored_procedure(false, "sp_getMinis", 2, 'si', [$t, intval($m)]);
        if($getMinis->num_rows > 0){
            while($rowMini = $getMinis->fetch_object()){
                $htmlT .= '<div class="posMini">
                    <span class="titleMini">'.$rowMini->nombre.'</span><br>
                    <img id="'.$rowMini->id.'" src="'.$rowMini->rutaMini.'?ni='.date('YmdHis').'" alt="'.$rowMini->rutaTemplate.'" ><br>
                    <span class="MedMini">'.$rowMini->medida.'</span>
                </div>';
            }
        }else{
            $htmlT .= '<div class="posMini">No hay plantillas creadas</div>';
        }
        return trim($htmlT);
    }
    
    public static function getDescripcionTemp($id){
        $prcGetDT = CRUD::stored_procedure(false,"sp_getDescTemp",1,'i',[$id]);
        return $prcGetDT;
    }
    
    public static function getMedidas(){
        $prcMeds = CRUD::stored_procedure(false,"sp_getMedidasTemp",0,'',[]);
        return $prcMeds;
    }
    
    public static function crearPlantilla($medida, $plantilla, $rutaTemplate, $tipo, $fondo, $guia, $mini){
        $insTemplate = CRUD::stored_procedure(false, "sp_insertaPlantilla",7,'sisisss',[$plantilla, $medida, $rutaTemplate, $tipo, $fondo, $guia, $mini]);
        return $insTemplate;
    }
    
    public static function getTiposPlantillas(){
        $prcTipos = CRUD::stored_procedure(false,"sp_getTiposTemp",0,'',[]);
        return $prcTipos;
    }
    
    public static function encrypt_decrypt($action, $string) {
        $output = false;
        $encrypt_method = "AES-256-CBC";
        $secret_key = 'This is my secret key';
        $secret_iv = 'This is my secret iv';
        $key = hash('sha256', $secret_key);
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        if ($action == 'encrypt') {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        } else if ($action == 'decrypt') {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }return $output;
    }
    
    public static function sanear_string($string) {
        $string = trim($string);
	$string = str_replace(array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'), array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'), $string);
	$string = str_replace(array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'), array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'), $string);
	$string = str_replace(array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'), array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'), $string);
	$string = str_replace(array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'), array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'), $string);
	$string = str_replace(array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'), array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'), $string);
	$string = str_replace(array('ñ', 'Ñ', 'ç', 'Ç'), array('n', 'N', 'c', 'C',), $string);
	$string = str_replace(array("\\", "¨", "º", "-", "~", "#", "@", "|", "!", "\"", "·", "$", "%", "&", "/", "(", ")", "?", "'", "¡", "¿", "[", "^", "`", "]", "+", "}", "{", "¨", "´", ">", "< ", ";", ",", ":", ".", " "), '', $string);
        return $string;
    }
}

class Publicacion{
    public static function getDescPubli($tipo){
        $descPub = CRUD::stored_procedure(false, "sp_getDescPub", 1, 'i', [$tipo]);
        return $descPub;
    }
    
    public static function insertaCaracteristica($iPlan, $tPlan, $elm, $lstTFont, $lstAl, $lstClr, $lstFz, $lstBld, $lstSt,
                              $lstLft, $lstTop, $lstWdth, $lstHgt, $lstLsPc, $lstLH){
        $insCarac = CRUD::stored_procedure(true, "sp_insertaCaracteristica", 15, 'isssssdssdddddd', [$iPlan, $tPlan, $elm, $lstTFont, $lstAl, $lstClr, $lstFz, $lstBld, $lstSt,
                              $lstLft, $lstTop, $lstWdth, $lstHgt, $lstLsPc, $lstLH]);
        return $insCarac;
    }
    
    public static function getMedidaTextFromPlId($idPlant){
        $textMed = CRUD::stored_procedure(false, 'sp_getMedTxtPlant', 1, 'i', [$idPlant]);
        return $textMed;
    }
}

class genPDFPub{
    public static function genPdfFromTemp($prms, $dirs, $json, $psalida, $minis, $txtChg, $nwTxts){
        $plantilla = json_decode($prms, false);
        $strings = ""; $string2 = ""; $pagesize = [];
        $idPlan = $plantilla->workspace->propsGrls->id;
        $medidaText = Publicacion::getMedidaTextFromPlId($idPlan);
        if($medText = $medidaText->fetch_object()){
            $tMedText = $medText->MedidaT;
        }
        $tipoPlan = trim($plantilla->workspace->propsGrls->tipo);
        $fondoPlan = $plantilla->workspace->propsGrls->background;
        $nombrePlan = $plantilla->workspace->propsGrls->name ."_". $tMedText; //nombre de plantilla mas la medida
        foreach($plantilla as $workspace){
           foreach($workspace as $elem => $value){
               if($elem != "propsGrls"){
                   foreach($value as $prop){
                       //aqui debemos hacer el registro en base de datos de cada caracteristica
                      $lastLft = tools::cnvrtPxToMm(floatval($prop->ofsLft));
                      $lastTop = tools::cnvrtPxToMm(floatval($prop->ofTop));
                      $lastWdth = tools::cnvrtPxToMm(floatval($prop->clW));
                      $lastHgt = tools::cnvrtPxToMm(floatval($prop->clH));
                      $lastClr = $prop->fnCol;
                      $lastFz = tools::calcPts($prop->tFn);
                      $lastSt = $prop->sFn;
                      $lastAl = $prop->alGn;
                      $lastBld = $prop->fnBld;
                      $lastLH = $prop->lineH;
                      $lastLsPc = $prop->lettSpc;
                      $lastTpFont = $prop->tpFuente;
                      
                      $inserto = Publicacion::insertaCaracteristica(intval($idPlan), strval($tipoPlan), strval($elem), strval($lastTpFont), strval($lastAl), strval($lastClr), doubleval(str_replace(["px","pt"], ["",""], $lastFz)), strval($lastBld), strval($lastSt),
                            floatval($lastLft), floatval($lastTop), doubleval(str_replace(["px","pt"],["",""],$lastWdth)), doubleval(str_replace(["px","pt"],["",""],$lastHgt)), floatval(str_replace(["px","pt"], ["",""], $lastLsPc)), floatval(str_replace(["px","pt"], ["",""],$lastLH)));
                      
                      if($txtChg){
                        $lastTxt = $nwTxts[$elem];
                      }else{
                        $lastTxt = $prop->txt;
                      }
                   }

                   $strings .= ".".$elem."{ \n position: absolute; \n overflow: visible; \n left:".$lastLft."mm; \n top:".$lastTop."mm; \n background: transparent; \n width:".$lastWdth."mm; \n height:".$lastHgt."mm; \n color:".$lastClr."; \n font-family: ".$lastTpFont."; \n font-size:".$lastFz."; \n font-style:".$lastSt."; \n text-align:".$lastAl."; \n font-weight:".$lastBld."; \n line-height:".$lastLH."pt; \n letter-spacing:".$lastLsPc."pt;  \n }\n";
                   $string2 .= '<div class="'.$elem.'">'.$lastTxt.'</div>';
               }
            }
        }
        
        if($dirs){
            /**********************************Crear Directorios***********************************/
            $dirJson = '../json/templates/'.$tipoPlan;
            $dirPdf = 'pdfs/'.$tipoPlan;
            $dirMinis = 'pdfs/'.$tipoPlan.'/miniaturas';

            if(!file_exists($dirJson)){
                mkdir($dirJson, 0777);
            }

            if(!file_exists($dirPdf)){
                mkdir($dirPdf, 0777, true);
            }

            if(!file_exists($dirMinis)){
                mkdir($dirMinis, 0777, true);
            }
        }
        
        if($json){
            $plantilla->workspace->propsGrls->medP = $tMedText;
            $fp = fopen($dirJson.'/'.$nombrePlan.".json", 'w+');
            fwrite($fp, json_encode($plantilla));
            fclose($fp);
            /**********************************Crear Directorios***********************************/
        }
        $html = '<html><style>'.$strings.'</style>
            <body style="background-image: url(\''.str_replace("assets","..",$fondoPlan).'\'); background-image-resize:4; background-repeat: no-repeat; background-image-resolution: from-image; background-position: top left;">'.$string2.'</body></html>';

        array_push($pagesize, $plantilla->workspace->propsGrls->ancho, $plantilla->workspace->propsGrls->alto);
        
        $mpdf = new mPDF('utf-8', $pagesize, 0, '', 0, 0, 0, 0, 0, 0,'P');

        $custom_fontdata = array(
            'palatino' => array(
                'R' => "../../../fonts/Palatino.ttf",
                'B' => "../../../fonts/Palatino-Bold.ttf",
                'I' => "../../../fonts/Palatino-Italic.ttf",
                'BI' => "../../../fonts/Palatino-BoldItalic.ttf"
                // use 'R' to support CSS font-weight: normal
                // use 'B', 'I', 'BI' and etc. to support CSS font-weight: bold, font-style: italic, and both...
            )
        );
        
        function addFont($mpdf, $fonts_list) {
            // Logic from line 1146 mpdf.pdf - $this->available_unifonts = array()...       
            foreach ($fonts_list as $f => $fs) {
                // add to fontdata array
                $mpdf->fontdata[$f] = $fs;

                // add to available fonts array
                if (isset($fs['R']) && $fs['R']) { $mpdf->available_unifonts[] = $f; }
                if (isset($fs['B']) && $fs['B']) { $mpdf->available_unifonts[] = $f.'B'; }
                if (isset($fs['I']) && $fs['I']) { $mpdf->available_unifonts[] = $f.'I'; }
                if (isset($fs['BI']) && $fs['BI']) { $mpdf->available_unifonts[] = $f.'BI'; }
            }
            $mpdf->default_available_fonts = $mpdf->available_unifonts;
        }

        addFont($mpdf, $custom_fontdata);

        $mpdf->WriteHTML($html);
        /****************************Regla de Posicionamiento*************************/
        /*for($x=0; $x<$anchoP; $x += 6.77){
            $mpdf->Line($x,0, $x, 258.7);
            for($s=0; $s<258.7; $s++){
                $mpdf->Line($x-1, $s, $x+1, $s);
            }
        }
        /*for($y=0; $y<258.7; $y += 12.935){
            $mpdf->Line(0, $y, 135.4, $y);
            for($r=0; $r<135.4; $r++){
                if($r % 10 == 0){
                    $mpdf->SetFontSize(7);
                    $mpdf->Text($r-1,$y-1,$r);
                }else{
                    $mpdf->Line($r, $y-1, $r, $y+1); 
                }
            }
        }*/
        /****************************Regla de Posicionamiento*************************/
        ob_clean();
        
        $salida = (($dirs) ? ($dirPdf.'/'.$nombrePlan.'.pdf') : ("../../".$psalida));
        
        $mpdf->Output($salida,'F');
        
        if($minis){
            if(file_exists($salida)){
                $cmd = 'magick convert -density 96x96 -thumbnail 128x245 "C:\wamp\www\cye\assets\includes\\'.$dirPdf.'\\'.$nombrePlan.'.pdf" "C:\wamp\www\cye\assets\includes\\'.$dirMinis.'\\'.$nombrePlan.'.png"';
                Batch::execInBackground($cmd);
                clearstatcache();
            }
        }
        
            $finalS = (($dirs) ? ('assets/includes/'.$salida) : str_replace("../..", "", $salida));
            echo $finalS;
            
            exit;
    }
}

class tools{
    public static function printLogSystem(){
        $getLogXUser = CRUD::stored_procedure(false, 'sp_GetLogByUser', 2, 'si', [$_SESSION['UserAgent'], $_SESSION['tipoUser']]);
        while($dLog = $getLogXUser->fetch_object()){
            echo "<tr>
                <td align='center'>".$dLog->usuario."</td>
                <td align='center'>".$dLog->fecha."</td>
                <td>".$dLog->evento."</td>
                </tr>";
        }
    }


    public static function printHeaderApp($idE, $idPn, $idbS){
        echo '<div data-role="header" data-position="fixed" data-theme="b" data-tap-toggle="false" data-disable-page-zoom="true" data-hide-during-focus="">
                <a href="#'.$idPn.'" class="ui-btn-left ui-btn ui-icon-home ui-btn-icon-left ui-btn-inline ui-corner-all ui-mini ui-btn-icon-notext">Menu</a>
                <h1 style="margin:0; padding:0;" class="ui-title"><button class="ui-btn ui-icon-user ui-btn-icon-left ui-shadow ui-corner-all">&nbsp;'.$_SESSION['NombreAgent'].'</button></h1>
                <a id="'.$idbS.'" href="#'.$idE.'" class="ui-btn-right ui-btn ui-icon-power ui-btn-icon-right ui-btn-inline ui-corner-all ui-mini ui-btn-icon-notext" data-rel="popup" data-position-to="window" data-transition="pop">Salir</a>';
    }


    public static function printFooter(){
        echo '<div data-role="footer" data-position="fixed" data-theme="b" data-tap-toggle="false" data-disable-page-zoom="true" data-hide-during-focus="">
                <h4>Todos los derechos reservados 2019</h4>
            </div>';
    }
    
    public static function printPanelMenu($idPnl){
        echo '<div data-role="panel" data-display="overlay" data-theme="b" id="'.$idPnl.'" data-position-fixed="true">
                <ul data-role="listview">
                    <li data-icon="delete" data-position="left"><a href="#" data-rel="close">&nbsp;</a></li>
                    <li data-icon="esquela" data-role="collapsible" data-iconpos="right" data-inset="false">
                        <h2>Condolencias</h2>
                        <ul data-role="listview" data-shadow="false" data-inset="true" data-corners="false" data-iconpos="left">
                            <li data-iconpos="left" data-icon="comment"><a href="pubCondolencias.php" data-transition="flip" data-ajax="false">Publicar</a></li>
                            <li data-iconpos="left" data-icon="bullets"><a href="ListCondolencias.php" data-transition="flip" data-ajax="false">Generados</a></li>
                        </ul>
                    </li>
                    <li data-icon="condolencia"><a href="#">Esquelas</a></li>
                    <li data-icon="agradecimiento"><a href="#">Agradecimientos</a></li>
                    <li data-icon="action"><a href="ManageTemplates.php" data-transition="flip" data-ajax="false">Templates</a></li>
                    <li data-icon="info"><a href="ActividadLog.php" data-transition="flip" data-ajax="false">Actividad</a></li>
                </ul>
            </div>';
    }

    public static function printPopupSalir($idPp,$idSl){
        echo '<div data-role="popup" id="'.$idPp.'" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="max-width:400px;">
                <div data-role="header" data-theme="a">
                <h1>Cerrar sesi&oacute;n?</h1>
                </div>
                <div role="main" class="ui-content">
                    <h3 class="ui-title">Realmente deseas salir de la aplicaci&oacute;n?</h3>
                <p>Esta operaci&oacute;n no se puede deshacer.</p>
                    <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">No</a>
                    <a href="#" id="'.$idSl.'" class="clsApp ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-transition="flow">Si</a>
                </div>
            </div>';
    }
    public static function cnvrtPxToMm($px){
        $valor1 = $px * 2.54;
        $valor2 = $valor1 / 96;
        $valor3 = $valor2 * 10;
        return bcdiv($valor3, 1, 2);
    }

    public static function cntrllBld($dt){
        return $dt == 'bold' ? $dt : 'normal';
    }

    public static function calcPts($c){
        $pos = strrpos($c, "px");
        if($pos === false){
            return $c;
        }else{
            $v1 = substr($c, 0, $pos);
            $v2 = $v1 * 0.75;
            $v3 = bcdiv($v2, 1, 2);
           return $v3.'pt';
        }
    }
    
    public static function convertImage($originalImage, $outputImage, $quality, $formatOut){
        $exploded = explode(".", $originalImage);
        $ext = $exploded[count($exploded) - 1]; //determinar la extension de la imagen original
        if(preg_match('/jpg|jpeg/i', $ext)){
            $imageTmp = imagecreatefromjpeg($originalImage);
        }else if (preg_match('/png/i', $ext)) {
            $imageTmp = imagecreatefrompng($originalImage);
        }else if (preg_match('/gif/i', $ext)){
            $imageTmp = imagecreatefromgif($originalImage);
        }else if (preg_match('/bmp/i', $ext)){
            $imageTmp = imagecreatefromwbmp($originalImage);
        }else {
            return false;
        }
        switch ($formatOut){
            case 'jpg':
            case 'jpeg':
                imagejpeg($imageTmp, $outputImage.".".$formatOut, $quality);
                break;
            case 'png':
                imagepng(imagecreatefromstring(file_get_contents($originalImage)), $outputImage.".".$formatOut);
                break;
        }
        imagedestroy($imageTmp);
        return true;
    }
}