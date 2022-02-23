import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { VoucherInput } from '../../../_models/voucher/voucher.input.model';
import { CreateFileInput } from '../../../_models/voucher/file.input.model';

@Injectable()
export class VoucherService {
  constructor(private apollo: Apollo) {
  }

  ADD_VOUCHER = gql`
      mutation addVoucher($voucher: VoucherInput!) {
        addVoucher(voucher: $voucher){
              id,
              title,
              quantity,
              from_date,
              to_date,
              description,
              user{
                id,
                display_name
              }
              sale_man{
                id,
                display_name
              }
              voucher_distribute {
                gender,
                address,
                other_information
                hobbies{
                name
              }
              }

        }
      }
    `;

  GET_VOUCHER_CATEGORY_QUERY = gql`
      query{
            getVoucherCategory{
              id,
              name
            }
          }
    `;

  GET_PROVINCE_QUERY = gql`
                query{
              getProvinces {
                id
               name
                code

              }
            }`;

  GET_BUSINESS = gql`
      query searchBusiness($searchCode: String) {
        searchBusiness(search_code: $searchCode){
        id,
        display_name,
        username,
        content,

        }
      }
    `;

  GET_DISTRICT =  gql`
      query {
           getDistrict {
              id
            name
            code
              status
            }
          }
    `

  GET_TOWNSHIP =  gql`
      query getTownShip($districtId: Int!){
           getTownShip(district_id:$districtId) {
              id
              status
            name
            code
            }
          }
    `

  GET_VOUCHER_BY_ID = gql`
        query getDetailVoucherById($voucherId: Int!) {
        getDetailVoucherById(voucher_id: $voucherId) {
              id
              title
              description
              quantity
              user {
                id
                display_name
                username
              }
              number_of_used
              from_date
              to_date
              published_date
              number_of_voucher_distributed
              sale_man {
                display_name
              }
              type {
                id
                name
              }
              quantity
              file {
                file_url
              }
              status
              voucher_distribute {
                hobbies {
                  id
                  name
                }
                age_from
                age_to
                other_information
                district{
                  id
                  name
                }
                township{
                  id
                  name
                }
                status
                gender
                customer{
                  username
                  display_name
                }
              }
        }
      }

    `;

  USER_FRAGMENT = gql`
      fragment post on UserPageable {
        content {
          id,
          display_name,
          avatar,
          birthday,
          sex,
          createdAt,
          dateBecomeHit,
          user_type,
          sex,
          active
        },
        total_page,
        size,
        number,
        totalElements
      }
    `;

  GET_ALL = gql`
      query getVouchers($title: String, $business_name: String, $status: Int,$publish_date_from: Date, $publish_date_to:Date,
                        $page_number: Int!,$page_size: Int!) {
        getVouchers(title: $title, business_name: $business_name, status: $status, publish_date_from: $publish_date_from,
        publish_date_to: $publish_date_to, page_number: $page_number, page_size: $page_size) {
                  content {
                        id
                        title
                        published_date
                        status
                        from_date
                        quantity
                        to_date
                        file{
                          file_url
                        }
                        user {
                          id
                          display_name
                          username
                          }
                        createdAt

                        }
                  total_page
                  size
                  number
                  totalElements
                }
      }
    `;

  GET_CUSTOMER = gql`
      query getCustomers($is_user: Int!,$page_number: Int!,$page_size: Int!,$search_code:String,$user_id:Int) {
        getCustomers(is_user: $is_user, page_number: $page_number, page_size: $page_size,search_code:$search_code,user_id:$user_id) {
                  content{
                    id
                    name
                    address
                    phone_number
                    note
                    gender
                    is_user
                  }
                  total_page
                  number
                  totalElements
                  size
                }
      }
    `;

  GET_VOUCHER_INFO_DETAIL = gql`
    query getVoucherInfoByVoucherId($voucherId: Int!,$searchCode: String,$page_number: Int!,$page_size: Int!) {
      getVoucherInfoByVoucherId(voucher_id:$voucherId,searchCode: $searchCode, page_number: $page_number, page_size: $page_size) {
        content {
          id,
          used_date
          user {
            id
            display_name
            avatar
            username
          }
          status

        }
        total_page
        size
        number
        totalElements
      }
    }
  `;


  DELETE_VOUCHER = gql`
      query getVouchers($title: String, $business_name: String, $status: Int,$publish_date_from: Date, $publish_date_to:Date,
                        $page_number: Int!,$page_size: Int!) {
        getVouchers(title: $title, business_name: $business_name, status: $status, publish_date_from: $publish_date_from,
        publish_date_to: $publish_date_to, page_number: $page_number, page_size: $page_size) {
                  content {
                        id
                        title
                        published_date
                        status
                        from_date
                        quantity
                        to_date
                        user {
                          id
                          display_name
                          }
                        createdAt

                        }
                  total_page
                  size
                  number
                  totalElements
                }
      }
    `;




  getAllNotification(username?: string, pageNumber?: number, pageSize?: number) {
    const USET_FRAGMENT = gql`
      fragment post on UserPageable {
        content {
          id,
          display_name,
          avatar,
          birthday,
          sex,
          createdAt,
          dateBecomeHit,
          userType
        },
        total_page,
        size,
        totalElements
      }
    `;
    const GET_ALL = gql`
      query getUserMango($username: String, $birthday: Date, $page_number: Int!,$page_size: Int!) {
        getUserMango(username: $username, birthday: $birthday, page_number: $page_number, page_size: $page_size) {
          ...post
        }
      }
      ${USET_FRAGMENT}
    `;
    return this.apollo.watchQuery({
      query: GET_ALL,
      variables: {
        username,
        page_number: pageNumber,
        page_size: pageSize
      }
    })
  }

  addVoucher(voucherInput: VoucherInput) {
    const CREATE_VOUCHER = gql`
      mutation addVoucherv2($voucher: VoucherInput!) {
        addVoucherv2(voucher: $voucher){
              id,
              title,
              quantity,
              from_date,
              to_date,
              description,
              user{
                id,
                display_name,
                username
              }
              sale_man{
                id,
                display_name
              }
              voucher_distribute {
                gender,
                other_information
                hobbies{
                name
              }
              }

        }
      }
    `
    return this.apollo.mutate({
      mutation: CREATE_VOUCHER,
      variables: {
        voucher: voucherInput,

      }
    })
  }

  updateVoucher(voucherId: number|undefined,voucherInput: VoucherInput) {
    const UPDATE_VOUCHER = gql`
      mutation updateVoucherv2($voucher_id: Int!,$voucher: VoucherInput!) {
        updateVoucherv2(voucher_id : $voucher_id ,voucher: $voucher){
              id,
              title,
              quantity,
              from_date,
              to_date,
              description,
              user{
                id,
                display_name,
                username
              }
              sale_man{
                id,
                display_name
              }
              voucher_distribute {
                gender,
                other_information
                hobbies{
                name
              }
              }

        }
      }
    `
    return this.apollo.mutate({
      mutation: UPDATE_VOUCHER,
      variables: {
        voucher: voucherInput,
        voucher_id: voucherId

      }
    })
  }

  deleteVoucher(voucherId?: number) {
    const DELETE_VOUCHER = gql`
      mutation deleteVoucher($voucher_id: Int!) {
        deleteVoucher(voucher_id: $voucher_id)
      }
    `;
    return this.apollo.mutate({
      mutation: DELETE_VOUCHER,
      variables: {
        voucher_id: voucherId,

      }
    })
  }

  approveVoucher(voucherId?: number) {
    const APPROVE_VOUCHER = gql`
      mutation approveVoucher($voucher_id: Int!) {
        approveVoucher(voucher_id: $voucher_id){
          id,title
        }
      }
    `;
    return this.apollo.mutate({
      mutation: APPROVE_VOUCHER,
      variables: {
        voucher_id: voucherId,

      }
    })
  }

  getVoucherCategories() {
      const GET_VOUCHER_CATEGORIES = gql`
      mutation getVoucherCategory() {
        getVoucherCategory(){
          id,name
        }
      }
    `;
    return this.apollo.mutate({
      mutation: GET_VOUCHER_CATEGORIES,
      variables: {
      }
    })
  }

  getHobbies() {
    const GET_HOBBIES = gql`
      mutation getHobbies() {
        getDriver(){
          id,name
        }
      }
    `;
    return this.apollo.mutate({
      mutation: GET_HOBBIES,
      variables: {
      }
    })
  }



}
