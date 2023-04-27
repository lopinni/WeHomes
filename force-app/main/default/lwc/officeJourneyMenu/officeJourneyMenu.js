import { LightningElement, api, wire } from 'lwc';

import getLoggedInStatus from "@salesforce/apex/WH_ReservationController.getLoggedInStatus";

export default class OfficeJourneyMenu extends LightningElement {

    @api recordId;

    loaded = false;

    userRoleName;
    isLoggedIn = false;

    @wire(getLoggedInStatus)
    userDetails({ error, data }) {
        if (error) {
            console.log(error);
        } else if (data) {
            this.isLoggedIn = data.IsCurrent;
        }
        this.loaded = true;
    }

}