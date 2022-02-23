import {FlatTreeNode, SuperEntity} from "@next-solutions/next-solutions-base";
import {FormGroup} from "@angular/forms";

export class Segment extends FlatTreeNode {
  checked = false;
  invalid = false;
  acceptDate: string | undefined;
  acceptUser: string | undefined;
  clientId: string | undefined;
  code: string | undefined;
  createDate: string | undefined;
  createUser: string | undefined;
  description: string | undefined;
  id: number | undefined;
  name: string | undefined;
  rejectReason: string | undefined;
  status: 'ACCEPTED' | 'DRAFT' | 'REJECTED' | string | undefined;
  updateDate: string | undefined;
  updateUser: string | undefined;

  constructor(form: FormGroup | number | undefined) {
    super();
    if (form instanceof FormGroup) {

    } else {
      this.id = form;
    }
  }
}
