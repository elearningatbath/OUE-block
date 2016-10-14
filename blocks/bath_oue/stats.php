<?php

define('AJAX_SCRIPT', true);
require_once('../../config.php');
require_once($CFG->libdir . '/datalib.php');
require_once('classes/samis_oue.php');
$username = optional_param('username', NULL, PARAM_ALPHANUM);
//Fun stuff!


try {
    //$sits = new sits($report);
    $samis_oue = new \samis_oue($username);
} catch (\Exception $e) {
    var_dump($e);
    $result['sits_error'] = true;
    echo json_encode($result);
    die();
}
$student = new stdClass;
$student->username = $username;
if (!$result = $samis_oue->get_survey_stats_student($student)) {
    $result['result_error'] = true;
} else {
    $result['data'] = explode("/", $result[0]); // Remove tabs
    if (is_array($result['data'])) {
        if ($result['data'][0] == '') {
            $result['data'][0] = 'NO ROWS'; // Fix for #1062
        }
        if ($result['data'][0] !== 'NO ROWS') {
            foreach ($result['data'] as $key => $value) {
                unset($result['data'][$key]);
                $newkey = substr($value, 0, 1);
                if ($value === '') {
                    $newkey = 'S';
                }
                $result['data'][$newkey] = (int)substr($value, 1);
            }
        } else {
            $result['data'] = $result['data'][0];
        }
    }
    unset($result[0]);
}
$result['data'] = array('S' => 3, 'C' => 2);
echo json_encode($result);
		

