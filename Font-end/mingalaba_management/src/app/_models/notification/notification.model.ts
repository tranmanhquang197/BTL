import { SuperEntity } from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';

export class NotificationModel extends SuperEntity {
  id: number | undefined;
  title: string | undefined;
  content: string | undefined;
  click_action: string | undefined;
  description: string | undefined;
  item_id: string | undefined;
  uri_path: string | undefined;
  type: string | undefined;
  create_date: string | undefined;
  mess_object: string | undefined;
  send_people: string | undefined;
  is_read: boolean | undefined;
  highlighted?: boolean;
  hovered?: boolean;
  notification_id: number | undefined;
  constructor(form: FormGroup | number) {
    super();
    if (form instanceof FormGroup) {
      const fId = form.get('id');
      if (fId) {
        this.id = fId.value;
      }
      const ftitle = form.get('title');
      if (ftitle) {
        this.title = ftitle.value;
      }
      const is_read = form.get('is_read');
      if (is_read) {
        this.is_read = is_read.value;
      }
      const notification_id = form.get('notification_id');
      if (notification_id) {
        this.notification_id = notification_id.value;
      }
      const fcontent = form.get('content');
      if (fcontent) {
        this.content = fcontent.value;
      }
      const click_action = form.get('click_action');
      if (click_action) {
        this.click_action = click_action.value;
      }
      const send_people = form.get('send_people');
      if (send_people) {
        this.send_people = send_people.value;
      }
      const create_date = form.get('create_date');
      if (create_date) {
        this.create_date = create_date.value;
      }
      const mess_object = form.get('mess_object');
      if (mess_object) {
        this.mess_object = mess_object.value;
      }
      const fDescription = form.get('description');
      if (fDescription) {
        this.description = fDescription.value;
      }
      const item_id = form.get('item_id');
      if (item_id) {
        this.item_id = item_id.value;
      }
      const uri_path = form.get('uri_path');
      if (uri_path) {
        this.uri_path = uri_path.value;
      }
      const type = form.get('type');
      if (type) {
        this.type = type.value;
      }
    } else {
      this.id = form;
    }
  }
}
