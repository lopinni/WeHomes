import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import RoleName from '@salesforce/schema/User.UserRole.Name';

export default class ProductSearch extends LightningElement {

    userRoleName;

    @wire(getRecord, { recordId: Id, fields: [RoleName] })
    userDetails({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
            if (data.fields.UserRole.value != null) {
                this.userRoleName = data.fields.UserRole.value.fields.Name.value;
            }
        }
    }

}