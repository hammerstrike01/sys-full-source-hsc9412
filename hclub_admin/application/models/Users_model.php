<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Users_model extends CI_Model {
    
    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    function getUsersList($where, $limit='')
    {
        $sql = 'SELECT * FROM users AS U';
        $sql .= '  '.$where;
        $sql .= ' ORDER BY U.id DESC '.$limit;

        $query = $this->db->query($sql);
        return $query->result();
    }
    function getProfileList($where, $limit='')
    {
        $sql = 'SELECT * FROM users AS U';
        $sql .= '  '.$where;
        $sql .= ' ORDER BY U.id DESC '.$limit;

        $query = $this->db->query($sql);
        return $query->result();
    }

    function getTotalUsersCount($where)
    {
        $sql = 'SELECT COUNT(U.id) AS cnt FROM users AS U';
        $sql .= '  '.$where;

        $query = $this->db->query($sql);
        return $query->row();
    }
    function getUsersById($id)
    {
        $sql = 'SELECT *,U.id as uid, P.id as pid FROM users as U left join profile as P on U.id = P.user_id  where U.id = "'.$id.'"'; 
        $query = $this->db->query($sql);
        return $query->row();
    }
    function getAddressSido()
    {
        $sql = 'SELECT *  FROM address_si order by id'; 
        $query = $this->db->query($sql);
        return $query->result();
    }
    function getPaymentList($id)
    {
        $sql = 'SELECT *  FROM payment where user_id = "'.$id.'" order by id desc '; 
        $query = $this->db->query($sql);
        return $query->result();
    }
    function getReviewList($id)
    {
        $sql = 'SELECT R.*, U.nick_name, U.email  FROM after as R left join users as U on U.id = R.user_id where R.send_id = "'.$id.'" order by R.id desc '; 
        $query = $this->db->query($sql);
        return $query->result();
    }
    function getBadgeList($id)
    {
        $sql = 'SELECT *  FROM badge_cert where user_id = "'.$id.'"  '; 
        $query = $this->db->query($sql);
        return $query->row();
    }
    function getMatchingList($id,$gender)
    {
        if($gender=="1"){
            $sql = 'SELECT M.*, U.nick_name,U.user_name, U.email,U.born,U.m_profile, U.id as user_id  FROM matching as M left join users as U on U.id = M.user_id2 where user_id1 = "'.$id.'" order by M.id desc  ';      
        }
        else{
            $sql = 'SELECT  M.*, U.nick_name,U.user_name, U.email,U.born,U.m_profile, U.id as user_id  FROM matching as M left join users as U on U.id = M.user_id1 where user_id2 = "'.$id.'" order by M.id desc ';      
        }
        
        $query = $this->db->query($sql);
        return $query->result();
    }
    function getCupponList($where, $limit='')
    {
        $sql = 'SELECT C.*, U.nick_name,U.user_name, U.email,U.born,U.m_profile FROM payment AS C left join users as U on U.id =C.user_id';
        $sql .= '  '.$where;
        $sql .= ' ORDER BY C.id DESC '.$limit;

        $query = $this->db->query($sql);
        return $query->result();
    }

    function getTotalCupponCount($where)
    {
        $sql = 'SELECT COUNT(C.id) AS cnt FROM payment AS C left join users as U on U.id =C.user_id';
        $sql .= '  '.$where;

        $query = $this->db->query($sql);
        return $query->row();
    }

    function updateCupponCnt($id,$cnt,$type)
    {
        if($type=="패스권")
            $sql = 'update users set pass_card=pass_card+'.$cnt.'   where id = "'.$id.'" ';
        else
            $sql = 'update users set matching_card=matching_card+'.$cnt.'   where id = "'.$id.'" ';
        
        $query = $this->db->query($sql);
        return true;
    }
    

    

    
}