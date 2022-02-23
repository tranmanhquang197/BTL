import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

@Injectable()
export class reportUsersService {
    constructor(private apollo: Apollo) {
    }

    // GET_USER_REPORT = gql`
    //   query getReports($search_content: String,$search_user: String,$report_type: Int, $status: Int,$page_number: Int!,$page_size: Int!) {
    //     getReports(search_content: $search_content, search_user: $search_user, report_type: $report_type, status: $status, page_number: $page_number, page_size: $page_size) {
    //         item {
    //             title
    //             username
    //             user_id
    //             user_avatar_url
    //         }
    //         user {
    //             display_name
    //         }
    //          type {
    //              title
    //         }
    //         total_page
    //         number
    //         totalElements
    //         size
    //        }
    // `;

    GET_USER_REPORT = gql`
      query getReports($status: Int,$page_number: Int!,$page_size: Int!) {
        getReports(status: $status, page_number: $page_number, page_size: $page_size) {
            
            content {
             item {
              title
              id
              files {
                file_url
              }
              username
              user {
                display_name
                id
                email
              }
              message
              user_avatar_url
            
            }
            user_report {
              display_name
              id
              email
            }
              report_user {
              display_name
              id
              email
            }
            type {
              title
            }
              
            report_type
              status
            description
              count_report
          }
            total_page
            size
            number
            totalElements
            
            }
           }
    `;

    GET_USER_DETAIL_REPORT = gql`
      query getDetailReport($status: Int!,$page_number: Int!,$page_size: Int!,$report_id:Int!,$report_type:Int) {
        getDetailReport(status: $status, page_number: $page_number, page_size: $page_size,report_id:$report_id,report_type:$report_type) {
            
            content {
         item {
          title
          id
          username
          user {
            display_name
          }
          message
          user_avatar_url
        
        }
        user_report {
          display_name
          
        }
          report_user {
          display_name
          
        }
        type {
          title
        }
          
        report_type
          status
        description
          count_report
      }
        total_page
        size
        number
        totalElements
       }
            
            
           }
    `;


}
