import config from '../../utils/config';

const env = config.environment;
let origin = config[env].originBackend;
const api_key = ''; //'?api_key=' + config.apiKey;
origin = origin + '/netd-api';

export default {
login: origin + '/login' + api_key,
auth_user: origin + '/auth-user' + api_key,
//---------------- routes -------------------//
get_all_route: origin + '/get-all-route' + api_key,
get_routes: origin + '/get-routes' + api_key,
get_route_by_id: origin + '/get-route' + api_key,
get_route_parents: origin + '/get-route-parents' + api_key,
insert_route: origin + '/insert-route' + api_key,
update_route: origin + '/update-route' + api_key,
delete_route: origin + '/delete-route' + api_key,
//---------------- end routes -------------------//

//---------------- roles -------------------//
get_all_role: origin + '/get-all-role' + api_key,
get_roles: origin + '/get-roles' + api_key,
get_role_by_id: origin + '/get-role' + api_key,
insert_role: origin + '/insert-role' + api_key,
update_role: origin + '/update-role' + api_key,
delete_role: origin + '/delete-role' + api_key,
//---------------- end roles -------------------//

//---------------- operations -------------------//
get_all_operation: origin + '/get-all-operation' + api_key,
//---------------- end operations -------------------//

//---------------- groups -------------------//
get_all_group: origin + '/get-all-group' + api_key,
get_groups: origin + '/get-groups' + api_key,
get_group_by_id: origin + '/get-group' + api_key,
insert_group: origin + '/insert-group' + api_key,
update_group: origin + '/update-group' + api_key,
delete_group: origin + '/delete-group' + api_key,
//---------------- end groups -------------------//

//---------------- users -------------------//
get_all_user: origin + '/get-all-user' + api_key,
get_users: origin + '/get-users' + api_key,
get_user_by_id: origin + '/get-user' + api_key,
insert_user: origin + '/insert-user' + api_key,
update_user: origin + '/update-user' + api_key,
reset_password: origin + '/reset-password' + api_key,
delete_user: origin + '/delete-user' + api_key,
//---------------- end users -------------------//

  //---------------- locations -------------------//
  get_all_location: origin + '/get-all-location' + api_key,
  get_locations: origin + '/get-locations' + api_key,
  get_location_by_id: origin + '/get-location' + api_key,
  insert_location: origin + '/insert-location' + api_key,
  update_location: origin + '/update-location' + api_key,
  delete_location: origin + '/delete-location' + api_key,
  //---------------- end locations -------------------//
  
  //---------------- dataCenters -------------------//
  get_all_datacenter: origin + '/get-all-datacenter' + api_key,
  get_datacenters: origin + '/get-datacenters' + api_key,
  get_datacenter_by_id: origin + '/get-datacenter' + api_key,
  insert_datacenter: origin + '/insert-datacenter' + api_key,
  update_datacenter: origin + '/update-datacenter' + api_key,
  delete_datacenter: origin + '/delete-datacenter' + api_key,
  //---------------- end dataCenters -------------------//

  //---------------- rooms -------------------//
  get_all_room: origin + '/get-all-room' + api_key,
  get_rooms: origin + '/get-rooms' + api_key,
  get_room_by_id: origin + '/get-room' + api_key,
  insert_room: origin + '/insert-room' + api_key,
  update_room: origin + '/update-room' + api_key,
  delete_room: origin + '/delete-room' + api_key,
  //---------------- end rooms -------------------//
    
  //---------------- zones -------------------//
  get_all_zone: origin + '/get-all-zone' + api_key,
  get_zones: origin + '/get-zones' + api_key,
  get_zone_by_id: origin + '/get-zone' + api_key,
  insert_zone: origin + '/insert-zone' + api_key,
  update_zone: origin + '/update-zone' + api_key,
  delete_zone: origin + '/delete-zone' + api_key,
  //---------------- end zones -------------------//

  //---------------- customers -------------------//
  get_all_customer: origin + '/get-all-customer' + api_key,
  get_customers: origin + '/get-customers' + api_key,
  get_customer_by_id: origin + '/get-customer' + api_key,
  insert_customer: origin + '/insert-customer' + api_key,
  update_customer: origin + '/update-customer' + api_key,
  delete_customer: origin + '/delete-customer' + api_key,
  //---------------- end customers -------------------//

  //---------------- departments -------------------//
  get_all_department: origin + '/get-all-department' + api_key,
  get_departments: origin + '/get-departments' + api_key,
  get_department_by_id: origin + '/get-department' + api_key,
  insert_department: origin + '/insert-department' + api_key,
  update_department: origin + '/update-department' + api_key,
  delete_department: origin + '/delete-department' + api_key,
  //---------------- end departments -------------------//

  //---------------- regions -------------------//
  get_all_region: origin + '/get-all-region' + api_key,
  get_regions: origin + '/get-regions' + api_key,
  get_region_by_id: origin + '/get-region' + api_key,
  insert_region: origin + '/insert-region' + api_key,
  update_region: origin + '/update-region' + api_key,
  delete_region: origin + '/delete-region' + api_key,
  //---------------- end regions -------------------//

  //---------------- device types -------------------//
  get_all_device_type: origin + '/get-all-device-type' + api_key,
  get_device_types: origin + '/get-device-types' + api_key,
  get_device_type_by_id: origin + '/get-device-type' + api_key,
  insert_device_type: origin + '/insert-device-type' + api_key,
  update_device_type: origin + '/update-device-type' + api_key,
  delete_device_type: origin + '/delete-device-type' + api_key,
  //---------------- end device-types -------------------//

  //---------------- device templates -------------------//
  get_all_device_template: origin + '/get-all-device-template' + api_key,
  get_device_templates: origin + '/get-device-templates' + api_key,
  get_device_template_by_id: origin + '/get-device-template' + api_key,
  insert_device_template: origin + '/insert-device-template' + api_key,
  update_device_template: origin + '/update-device-template' + api_key,
  delete_device_template: origin + '/delete-device-template' + api_key,
  //---------------- end device-templates -------------------//

  //---------------- racks -------------------//
  get_all_rack: origin + '/get-all-rack' + api_key,
  get_racks: origin + '/get-racks' + api_key,
  get_rack_by_id: origin + '/get-rack' + api_key,
  get_rack_by_zone: origin + '/get-rack-by-zone' + api_key,
  insert_rack: origin + '/insert-rack' + api_key,
  update_rack: origin + '/update-rack' + api_key,
  delete_rack: origin + '/delete-rack' + api_key,
  booking_u: origin + '/booking-u' + api_key,
  //---------------- end racks -------------------//

  //---------------- layouts -------------------//
  get_all_layout: origin + '/get-all-layout' + api_key,
  get_layouts: origin + '/get-layouts' + api_key,
  get_layout_by_id: origin + '/get-layout' + api_key,
  insert_layout: origin + '/insert-layout' + api_key,
  update_layout: origin + '/update-layout' + api_key,
  delete_layout: origin + '/delete-layout' + api_key,
  //---------------- end layouts -------------------//

}