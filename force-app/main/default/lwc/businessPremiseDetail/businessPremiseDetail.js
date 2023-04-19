import { LightningElement, api } from 'lwc';

import getProductById from "@salesforce/apex/WH_LocationController.getProductById";
import getBusinessProductPriceById from "@salesforce/apex/WH_PricebookManagerController.getBusinessProductPriceById";

import LOADING from '@salesforce/label/c.Loading';
import TOTAL_SURFACE_AREA from '@salesforce/label/c.Total_Surface_Area';

export default class BusinessPremiseDetail extends LightningElement {

    labels = {
        LOADING,
        TOTAL_SURFACE_AREA,
    };

    @api recordId;
    @api basicInfo;

    productName;
    productDescription;
    productTotalSurfaceArea;
    productFloor;
    productNumberOfFloors;
    productCity;
    productStreet;
    productPostalCode;
    productCountry;
    productNumberOfMeetingRooms;
    productNumberOfKitchens;
    productParkingSpaces;
    productFurnished;
    productWheelchairAccessible;
    productOpenPlanOffice;
    productElevatorAccess;
    productAirConditioning;

    productPrice;

    loaded = false;

    connectedCallback() {
        getProductById({ productId: this.recordId }).then(result => {
            this.populateFields(result);
            getBusinessProductPriceById({ productId: this.recordId }).then(result => {
                this.productPrice = result.UnitPrice;
                this.loaded = true;
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });
    }

    populateFields(result) {
        console.log(result);
        this.productName = result.Name;
        this.productDescription = result.Description;
        this.productTotalSurfaceArea = result.Total_surface_area__c;
        this.productFloor = result.Floor__c;
        this.productNumberOfFloors = result.Number_of_floors__c;
        this.productCity = result.City__c;
        this.productStreet = result.Street__c;
        this.productPostalCode = result.Postal_Code__c;
        this.productCountry = result.Country__c;
        this.productNumberOfMeetingRooms = result.Number_of_meeting_rooms__c;
        this.productNumberOfKitchens = result.Number_of_kitchens__c;
        this.productParkingSpaces = result.Parking_spaces__c;
        this.productFurnished = result.Furnished__c;
        this.productWheelchairAccessible = result.Wheelchair_accessible__c;
        this.productOpenPlanOffice = result.Open_plan_office__c;
        this.productElevatorAccess = result.Elevator_access__c;
        this.productAirConditioning = result.Air_conditioning__c;
    }

}