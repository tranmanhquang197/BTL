import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogoutComponent} from './shared/logout/logout.component';
import {ListUserComponent} from './components/user/list-user/list-user.component';
import {AddEditUserComponent} from './components/user/add-edit-user/add-edit-user.component';
import {ListRoleComponent} from './components/role/list-role/list-role.component';
import {AddEditRoleComponent} from './components/role/add-edit-role/add-edit-role.component';
import {ListMenuComponent} from './components/menu/list-menu/list-menu.component';
import {AddEditMenuComponent} from './components/menu/add-edit-menu/add-edit-menu.component';
import {ListPermissionComponent} from './components/permission/list-permission/list-permission.component';
import {AddEditPermissionComponent} from './components/permission/add-edit-permission/add-edit-permission.component';
import {ListClientComponent} from './components/client/list-client/list-client.component';
import {AddEditClientComponent} from './components/client/add-edit-client/add-edit-client.component';


const routes: Routes = [
  {path: '', component: ListUserComponent},
  {path: 'home', component: ListUserComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'list-user', component: ListUserComponent},
  {path: 'add-edit-user', component: AddEditUserComponent},
  {path: 'list-role', component: ListRoleComponent},
  {path: 'add-edit-role', component: AddEditRoleComponent},
  {path: 'list-menu', component: ListMenuComponent},
  {path: 'add-edit-menu', component: AddEditMenuComponent},
  {path: 'list-permission', component: ListPermissionComponent},
  {path: 'add-edit-permission', component: AddEditPermissionComponent},
  {path: 'list-client', component: ListClientComponent},
  {path: 'add-edit-client', component: AddEditClientComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
