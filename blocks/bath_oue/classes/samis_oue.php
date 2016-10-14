<?php
class samis_oue {
    protected $sql_get_current_survey_stats_student;
    protected $get_current_survey_stats_student_stm;
    public $samis_dbh;
    public $bucs_id;
    function __construct($userid) {
        $plugin_config = get_config('enrol_samisv2');
        $this->samis_dbh = new \enrol_samisv2_sits_database($plugin_config->dbhost, $plugin_config->dbname, $plugin_config->dbuser,
            $plugin_config->dbpass, $plugin_config->dbport);
    }
    public function get_survey_stats_student($student){
        $this->bucs_id = $student;
        $this->set_sql_current_survey_stats_student();
        if($this->prepare_current_survey_stats_student()){
            $resource = oci_execute($this->get_current_survey_stats_student_stm);
            if($resource){
                 $results = array();
                while($row = oci_fetch_array($this->get_current_survey_stats_student_stm))
                {
                     $results[] = $row[0];
                }
                return $results;
            }
            else{
                return false;
            }
        }
    }
    protected function prepare_current_survey_stats_student(){
         $this->get_current_survey_stats_student_stm = oci_parse($this->samis_dbh->conn, $this->sql_get_current_survey_stats_student);
        if(!$this->get_current_survey_stats_student_stm){
            return false;
        }
        elseif(!oci_bind_by_name($this->get_current_survey_stats_student_stm, ':username', $this->bucs_id->username, 8, SQLT_CHR)){

            return false;
        }
        else{
            return true;
        }
    }
    protected function set_sql_current_survey_stats_student(){
        $this->sql_get_current_survey_stats_student = <<<sql
            select bath_oue_utils.get_moodle_stats(:username) from dual
sql;
    }
}