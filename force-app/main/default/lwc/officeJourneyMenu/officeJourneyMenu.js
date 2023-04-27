import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getLoggedInStatus from "@salesforce/apex/WH_ReservationController.getLoggedInStatus";
import getOfficeAgentInfo from "@salesforce/apex/WH_ReservationController.getOfficeAgentInfo";

import ERROR from '@salesforce/label/c.Error';
import LOADING from '@salesforce/label/c.Loading';

export default class OfficeJourneyMenu extends LightningElement {

    labels = {
        LOADING
    }

    @api recordId;

    loaded = false;
    isLoggedIn = false;

    agent;

    showError(error) {
        console.log(error);
        this.dispatchEvent(new ShowToastEvent({
            title: ERROR,
            message: error.statusText,
            variant: 'error'
        }));
    }

    @wire(getLoggedInStatus)
    userDetails({ error, data }) {
        if (error) {
            this.showError(error);
        } else if (data) {
            this.isLoggedIn = data.IsCurrent;
        }
    }

    connectedCallback() {
        getOfficeAgentInfo({ productId: this.recordId }).then(result => {
            this.agent = result;
            this.loaded = true;
        }).catch(error => {
            this.showError(error);
        });
    }

}