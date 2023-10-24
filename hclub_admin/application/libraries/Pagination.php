<?php
  class Pagination
  {
    function __construct()
    {
    }

    function render($cur_page, $records_per_page, $total_cnt, $total_page, $num)
    {
      $str = '<div class="card-footer d-flex align-items-center">';

      if($total_cnt > 0)
      {
        $str .= '<p class="m-0 text-muted">Showing <span>'.(($cur_page - 1) * $records_per_page + 1).'</span>';
        $str .= ' to <span>'.($total_cnt > $cur_page * $records_per_page ? $cur_page * $records_per_page : $total_cnt).'</span>';
        $str .= ' of <span>'.$total_cnt.'</span> entries</p>';

        if($total_page > 1)
        {
          $str .= '<ul class="pagination m-0 ms-auto">';

          if ($cur_page > 1)
          { 
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page - 1).','.$num.')">';
            $str .= '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>';
            $str .= 'prev';
            $str .= '</a>';
            $str .= '</li>';
          }
          else
          {
            $str .= '<li class="page-item disabled">';
            $str .= '<a class="page-link" href="#" tabindex="-1" aria-disabled="true">';
            $str .= '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>';
            $str .= 'prev';
            $str .= '</a>';
            $str .= '</li>';
          }
          
          if ($cur_page - 4 > 0 && $cur_page - 4 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page - 4).','.$num.')">'.($cur_page - 4).'</a>';
            $str .= '</li>';
          }

          if ($cur_page - 3 > 0 && $cur_page - 3 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page - 3).','.$num.')">'.($cur_page - 3).'</a>';
            $str .= '</li>';
          }

          if ($cur_page - 2 > 0 && $cur_page - 2 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page - 2).','.$num.')">'.($cur_page - 2).'</a>';
            $str .= '</li>';
          }

          if ($cur_page - 1 > 0 && $cur_page - 1 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page - 1).','.$num.')">'.($cur_page - 1).'</a>';
            $str .= '</li>';
          }

          $str .= '<li class="page-item active">';
          $str .= '<a class="page-link" href="#">'.$cur_page.'</a>';
          $str .= '</li>';
          
          if ($cur_page + 1 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page + 1).','.$num.')">'.($cur_page + 1).'</a>';
            $str .= '</li>';
          }

          if ($cur_page + 2 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page + 2).','.$num.')">'.($cur_page + 2).'</a>';
            $str .= '</li>';
          }

          if ($cur_page + 3 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page + 3).','.$num.')">'.($cur_page + 3).'</a>';
            $str .= '</li>';
          }

          if ($cur_page + 4 <= $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page + 4).','.$num.')">'.($cur_page + 4).'</a>';
            $str .= '</li>';
          }

          if ($cur_page < $total_page)
          {
            $str .= '<li class="page-item">';
            $str .= '<a class="page-link" href="javascript:clickPage('.($cur_page + 1).','.$num.')" tabindex="-1" aria-disabled="true">';
            $str .= '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>';
            $str .= 'next';
            $str .= '</a>';
            $str .= '</li>';
          }
          else
          {
            $str .= '<li class="page-item disabled">';
            $str .= '<a class="page-link" href="#" tabindex="-1" aria-disabled="true">';
            $str .= '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>';
            $str .= 'next';
            $str .= '</a>';
            $str .= '</li>';
          }

          $str .= '</ul>';
        }
      }

      $str .= '</div>';
      
      echo $str;
    }
  }
?>