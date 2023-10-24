<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Common_model extends CI_Model {
    
    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    function getDataList($tbl_name, $order='id ASC', $where='', $limit='')
    {
        $sql = 'SELECT * FROM '.$tbl_name.$where.' ORDER BY '.$order.$limit;
        $query = $this->db->query($sql);
        return $query->result();
    }

    function getTotalDataCount($tbl_name, $where='')
    {
        $sql = 'SELECT COUNT(*) AS cnt FROM '.$tbl_name.$where;
        $query = $this->db->query($sql);
        return $query->row();
    }

    function getData($tbl_name, $id)
    {
        $sql = 'SELECT * FROM '.$tbl_name.' WHERE id="'.$id.'"';
        $query = $this->db->query($sql);
        return $query->row();
    }

    function addData($tbl_name, $data)
    {
        if($this->db->insert($tbl_name, $data))
            return $this->db->insert_id();
        else
            return false;
    }
    
    function updateData($tbl_name, $id, $data)
    {
        if($this->db->update($tbl_name, $data, array('id' => $id)))
            return true;
        else
            return false;
    }

    function deleteData($tbl_name, $id)
    {
        if($this->db->delete($tbl_name, array('id' => $id)))
            return true;
        else
            return false;
    }
    function allData($id){
        $this->db->delete('matching', array('user_id1' => $id));
        $this->db->delete('matching', array('user_id2' => $id));
        $this->db->delete('payment', array('user_id' => $id));
    }
    function getData1($id)
    {
        $sql = 'SELECT * FROM users WHERE email="'.$id.'"';
        $query = $this->db->query($sql);
        return $query->row();
    }
    function getUserInfo($id,$gender)
    {
        $sql = 'SELECT U.*,P.like_type,P.intro FROM users as U left join profile as P on U.id = P.user_id WHERE U.email="'.$id.'" and U.gender ="'.$gender.'" and U.cert_profile=3 ';
        $query = $this->db->query($sql);
        return $query->row();
    }

    function getMatchingList($where, $limit='')
    {
        $sql = 'SELECT M.*, U.born, U.email, U.m_profile,U.nick_name,U.phone,U.user_name,W.born as born2,W.phone as phone2, W.email as email2, W.m_profile as m_profile2, W.nick_name as nick_name2,W.user_name as user_name2  FROM matching AS M left join users as U on M.user_id1=U.id left join users as W on M.user_id2= W.id ';
        $sql .= '  '.$where;
        $sql .= ' ORDER BY M.id DESC '.$limit;

        $query = $this->db->query($sql);
        return $query->result();
    }

    function getMatchingCount($where)
    {
        $sql = 'SELECT count(M.id) as cnt FROM matching AS M left join users as U on M.user_id1=U.id left join users as W on M.user_id2= W.id ';
        $sql .= '  '.$where;

        $query = $this->db->query($sql);
        return $query->row();
    }
    function getMatchingDetail($id)
    {
        $sql = 'SELECT  M.*, U.born, U.email, U.m_profile,U.nick_name,U.phone,U.user_name,W.born as born2,W.phone as phone2, W.email as email2, W.m_profile as m_profile2, W.nick_name as nick_name2,W.user_name as user_name2, P.like_type,P.intro,PW.like_type as w_type, PW.intro as w_intro  FROM matching AS M left join users as U on M.user_id1=U.id left join users as W on M.user_id2= W.id left join profile as P on P.user_id = U.id left join profile as PW on PW.user_id = W.id   WHERE M.id="'.$id.'"';
        $query = $this->db->query($sql);
        return $query->row();
    }
    function getReviewList($m_id)
    {
        $sql = 'SELECT A.*, U.nick_name, U.user_name, U.email FROM after AS A left join users as U on A.user_id=U.id where m_id = "'.$m_id.'" ';
         
        $query = $this->db->query($sql);
        return $query->result();
    }
    function getChattingList($m_id)
    {
        $sql = 'SELECT A.*, U.nick_name FROM chat_history AS A left join users as U on A.user_id=U.id where room_id = "'.$m_id.'" ';
         
        $query = $this->db->query($sql);
        return $query->result();
    }

    function deletMatching($id)
    {
        if($this->db->delete('matching', array('id' => $id)))
            return true;
        else
            return false;
    }
    function refundUser1($id, $card)
    {
        $sql = 'UPDATE users SET matching_card = matching_card + "'.$card.'" where id = "'.$id.'" ';  
        $query = $this->db->query($sql);
        return true;
    }
    function refundUser2($id, $card)
    {
        $sql = 'UPDATE users SET matching_card = matching_card + "'.$card.'" where id = "'.$id.'" ';  
        $query = $this->db->query($sql);
        return true;
    }
    function updateUsers($id)
    {
        $sql = 'UPDATE users SET push_cnt = push_cnt + 1 where id = "'.$id.'" ';  
        $query = $this->db->query($sql);
        return true;
    }
    


    
    
}