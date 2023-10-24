<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Api_model extends CI_Model {
    
    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    function getApiRequestList($where, $limit='')
    {
        $sql = 'SELECT R.*, S.name AS server_name FROM api_request AS R LEFT JOIN ai_server AS S ON R.server_id=S.id';
        $sql .= $where.' ORDER BY R.id DESC'.$limit;

        $query = $this->db->query($sql);
        return $query->result();
    }

    function getTotalApiRequestCount($where)
    {
        $sql = 'SELECT COUNT(id) AS cnt FROM api_request AS R'.$where;
        $query = $this->db->query($sql);
        return $query->row();
    }
}