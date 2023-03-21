import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import RoleName from '@salesforce/schema/User.UserRole.Name';
import { loadStyle } from "lightning/platformResourceLoader";
import noHeader from '@salesforce/resourceUrl/NoHeaderStylesheet';

export default class ProductBrowser extends LightningElement {

    userRoleName;
    isHousingSales = false;
    isBusinessSales = false;
    renderPagination = true;

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

    @wire(getRecord, { recordId: Id, fields: [RoleName] })
    userDetails({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.userRoleName = data.fields.UserRole.value.fields.Name.value;
            if(this.userRoleName == "Business Premises Sales") {
                this.isBusinessSales = true;
            } else if(this.userRoleName == "Housing Sales") {
                this.isHousingSales = true;
            }
        }
    }

    handleSearch() {

    }

}