import { LightningElement, wire, track } from 'lwc';
import { loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import noHeader from '@salesforce/resourceUrl/NoHeaderStylesheet';
import getCurrentUserRole from "@salesforce/apex/WH_LocationController.getCurrentUserRole";
import getProducts from "@salesforce/apex/WH_LocationController.getProducts";

import ERROR from '@salesforce/label/c.Error';

export default class ProductBrowser extends LightningElement {

    loaded = false;
    userRoleName;

    isHousingSales = false;
    isBusinessSales = true;
    isCommunity = false;

    renderPagination = false;
    pageSize = 6;
    page;
    pages;

    productName;
    productCity;
    productStreet;
    productCountry;

    productNumberOfFloors;
    productNumberOfMeetingRooms;
    productNumberOfKitchens;
    productNumberOfParkingSpaces;
    productOpenPlanOffice;

    productCityCenterDistance;
    productNumberOfBedrooms;
    productNumberOfBathrooms;
    productBalcony;
    productGarage;

    @track products;
    @track productsTemp;

    showMessage = false;
    messageContent = "Could not find products with matching criteria.";

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

    @wire(getCurrentUserRole)
    userDetails({ error, data }) {
        if (error) {
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error.statusText,
                variant: 'error'
            }));
        } else if (data) {
            if (data.Name != null) {
                this.userRoleName = data.Name;
            }
            if(this.userRoleName == "Business Premises Sales") {
                this.isCommunity = false;
                this.isHousingSales = false;
                this.isBusinessSales = true;
            } else if(this.userRoleName == "Housing Sales") {
                this.isCommunity = false;
                this.isHousingSales = true;
                this.isBusinessSales = false;
            } else if(this.userRoleName == "CEO") {
                this.isCommunity = false;
                this.isHousingSales = false;
                this.isBusinessSales = false;
            }
        } else {
            this.isCommunity = true;
        }
        this.queryProducts();
        this.loaded = true;
    }

    queryProducts() {
        getProducts({
            name: this.productName,
            city: this.productCity,
            street: this.productStreet,
            country: this.productCountry,
            numberOfFloors: this.productNumberOfFloors,
            numberOfMeetingRooms: this.productNumberOfMeetingRooms,
            numberOfKitchens: this.productNumberOfKitchens,
            numberOfParkingSpaces: this.productNumberOfParkingSpaces,
            openPlanOffice: this.productOpenPlanOffice,
            cityCenterDistance: this.productCityCenterDistance,
            numberOfBedrooms: this.productNumberOfBedrooms,
            numberOfBathrooms: this.productNumberOfBathrooms,
            balcony: this.productBalcony,
            garage: this.productGarage,
            housingSales: this.isHousingSales,
            businessSales: this.isBusinessSales
        }).then(result => {
            this.loaded = false;
            if(result.length > 0) {
                this.showMessage = false;
                this.populateFields(result);
            }
            else {
                this.productsTemp = [];
                this.showMessage = true;
                this.renderPagination = false;
                this.messageContent = "No matches found.";
            }
            this.loaded = true;
        }).catch(error => {
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error.statusText,
                variant: 'error'
            }));
        });
    }

    populateFields(result) {
        this.products = result; //copy JSON
        this.page = 1;
        this.pages = Math.ceil(this.products.length / 6);
        this.setPagination();
        this.renderPagination = true;
    }

    setPagination() {
        const start = (this.page - 1) * this.pageSize;
        let end;
        if((start + this.pageSize) > this.products.length) {
            end = this.products.length;
        } else {
            end = start + this.pageSize;
        }
        this.productsTemp = this.products.slice(start, end);
    }

    handleMove(event) {
        this.page = event.detail;
        this.setPagination();
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

    setNumberOfFloors(event) {
        this.productNumberOfFloors = event.detail.value;
        this.queryProducts();
    }
    setNumberOfMeetingRooms(event) {
        this.productNumberOfMeetingRooms = event.detail.value;
        this.queryProducts();
    }
    setNumberOfKitchens(event) {
        this.productNumberOfKitchens = event.detail.value;
        this.queryProducts();
    }
    setNumberOfParkingSpaces(event) {
        this.productNumberOfParkingSpaces = event.detail.value;
        this.queryProducts();
    }
    setOpenPlanOffice(event) {
        this.productOpenPlanOffice = event.target.checked;
        this.queryProducts();
    }

    setCityCenterDistance(event) {
        this.productCityCenterDistance = event.detail.value;
        this.queryProducts();
    }
    setNumberOfBedrooms(event) {
        this.productNumberOfBedrooms = event.detail.value;
        this.queryProducts();
    }
    setNumberOfBathrooms(event) {
        this.productNumberOfBathrooms = event.detail.value;
        this.queryProducts();
    }
    setBalcony(event) {
        this.productBalcony = event.target.checked;
        this.queryProducts();
    }
    setGarage(event) {
        this.productGarage = event.target.checked;
        this.queryProducts();
    }

    clear() {
        this.template.querySelectorAll('lightning-input').forEach(each => { 
            each.value = '';
            each.checked = false;
        });
        this.productsTemp = [];
        this.clearfields();
        this.showMessage = false;
        this.queryProducts();
    }

    clearfields() {
        this.productName = '';
        this.productCity = '';
        this.productStreet = '';
        this.productCountry = '';
        this.productNumberOfFloors = '';
        this.productNumberOfMeetingRooms = '';
        this.productNumberOfKitchens = '';
        this.productNumberOfKitchens = '';
        this.productOpenPlanOffice = false;
        this.productCityCenterDistance = '';
        this.productNumberOfBedrooms = '';
        this.productNumberOfBathrooms = '';
        this.balcony = false;
        this.garage = false;
    }

}