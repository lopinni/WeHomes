import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getProductById from "@salesforce/apex/WH_LocationController.getProductById";
import getBusinessProductPriceById from "@salesforce/apex/WH_PricebookManagerController.getBusinessProductPriceById";

import LOADING from '@salesforce/label/c.Loading';
import TOTAL_SURFACE_AREA from '@salesforce/label/c.Total_Surface_Area';
import CITY from '@salesforce/label/c.City';
import STREET from '@salesforce/label/c.Street';
import POSTAL_CODE from '@salesforce/label/c.PostalCode';
import COUNTRY from '@salesforce/label/c.Country';
import FURNISHED from '@salesforce/label/c.Furnished';
import PRICE from '@salesforce/label/c.Price';
import DESCRIPTION from '@salesforce/label/c.Description';
import FLOOR_INFORMATION from '@salesforce/label/c.Floor_Information';
import FLOOR from '@salesforce/label/c.Floor';
import NUMBER_OF_FLOORS from '@salesforce/label/c.Number_Of_Floors';
import FACILITIES from '@salesforce/label/c.Facilities';
import NUMBER_OF_MEETING_ROOMS from '@salesforce/label/c.Number_Of_Meeting_Rooms';
import NUMBER_OF_KITCHENS from '@salesforce/label/c.Number_Of_Kitchens';
import NUMBER_OF_PARKING_SPACES from '@salesforce/label/c.Number_Of_Parking_Spaces';
import AMENITIES from '@salesforce/label/c.Amenities';
import WHEELCHAIR_ACCESSIBLE from '@salesforce/label/c.Wheelchair_Accessible';
import OPEN_PLAN_OFFICE from '@salesforce/label/c.Open_Plan_Office';
import ELEVATOR_ACCESS from '@salesforce/label/c.Elevator_Access';
import AIR_CONDITIONING from '@salesforce/label/c.Air_Conditioning';
import YES from '@salesforce/label/c.Yes';
import NO from '@salesforce/label/c.No';
import ERROR from '@salesforce/label/c.Error';
import YEAR from '@salesforce/label/c.Year';

export default class BusinessPremiseDetail extends LightningElement {

    labels = {
        LOADING,
        TOTAL_SURFACE_AREA,
        CITY,
        STREET,
        POSTAL_CODE,
        COUNTRY,
        FURNISHED,
        PRICE,
        DESCRIPTION,
        FLOOR_INFORMATION,
        FLOOR,
        NUMBER_OF_FLOORS,
        FACILITIES,
        NUMBER_OF_MEETING_ROOMS,
        NUMBER_OF_KITCHENS,
        NUMBER_OF_PARKING_SPACES,
        AMENITIES,
        WHEELCHAIR_ACCESSIBLE,
        OPEN_PLAN_OFFICE,
        ELEVATOR_ACCESS,
        AIR_CONDITIONING,
        YES,
        NO,
        YEAR
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
                this.dispatchEvent(new ShowToastEvent({
                    title: ERROR,
                    message: error.body.message,
                    variant: 'error'
                }));
            });
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error.body.message,
                variant: 'error'
            }));
        });
    }

    populateFields(result) {
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