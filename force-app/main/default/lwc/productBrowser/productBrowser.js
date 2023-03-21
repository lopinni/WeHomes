import { LightningElement, wire, track } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import RoleName from '@salesforce/schema/User.UserRole.Name';
import noHeader from '@salesforce/resourceUrl/NoHeaderStylesheet';
import getProducts from "@salesforce/apex/WH_LocationController.getProducts";

export default class ProductBrowser extends LightningElement {

    userRoleName;

    isHousingSales = false;
    isBusinessSales = false;

    limit = "10";
    offset = "0";
    renderPagination = false;

    productName;
    productCity;
    productStreet;
    productCountry;

    @track
    products;

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

    @wire(getRecord, { recordId: Id, fields: [RoleName] })
    userDetails({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
            if (data.fields.UserRole.value != null) {
                this.userRoleName = data.fields.UserRole.value.fields.Name.value;
            }
            if(this.userRoleName == "Business Premises Sales") {
                this.isBusinessSales = true;
            } else if(this.userRoleName == "Housing Sales") {
                this.isHousingSales = true;
            }
        }
    }

    queryProducts() {
        getProducts({
            name: this.productName,
            city: this.productCity,
            street: this.productStreet,
            country: this.productCountry,
            paginationLimit: this.limit,
            paginationOffset: this.offset
        }).then(result => {
            this.products = result; //copy JSON
            this.renderPagination = true;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }

    setName(event) {
        this.productName = event.detail.value;
        this.queryProducts();
    }

    setCity(event) {
        this.productCity = event.detail.value;
        this.queryProducts();
    }

    setStreet(event) {
        this.productStreet = event.detail.value;
        this.queryProducts();
    }

    setCountry(event) {
        this.productCountry = event.detail.value;
        this.queryProducts();
    }

}