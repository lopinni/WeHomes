import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getLoggedInStatus from "@salesforce/apex/WH_ReservationController.getLoggedInStatus";
import getOfficeAgentInfo from "@salesforce/apex/WH_ReservationController.getOfficeAgentInfo";
import createJourneyEvent from "@salesforce/apex/WH_ReservationController.createJourneyEvent";
import getAgentAvailability from "@salesforce/apex/WH_ReservationController.getAgentAvailability";

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
    journeyTime;
    journeyDate;
    journeyTimeMessage;
    journeyDateMessage;

    disabledButtons = true;
    disabledReservation = true;

    nine = true;
    nineHalf = true;
    ten = true;
    tenHalf = true;
    eleven = true;
    elevenHalf = true;
    twelve = true;
    twelveHalf = true;
    thirteen = true;
    thirteenHalf = true;
    fourteen = true;
    fourteenHalf = true;

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

    setJourneyDate(event) {
        this.journeyDate = event.detail.value;
        this.journeyDateMessage = "Jourey set on: " + this.journeyDate;
        getAgentAvailability({
            agentId: this.agent.Id,
            selectedDay: this.journeyDate
        }).then(result => {
            this.setAvailability(result);
        })
        .catch(error => {
            this.showError(error);
        });
        this.disabledButtons = false;
    }

    setAvailability(result) {
        const parsed = JSON.parse(result);
        this.nine = parsed["9:00"];
        this.nineHalf = parsed["9:30"];
        this.ten = parsed["10:00"];
        this.tenHalf = parsed["10:30"];
        this.eleven = parsed["11:00"];
        this.elevenHalf = parsed["11:30"];
        this.twelve = parsed["12:00"];
        this.twelveHalf = parsed["12:30"];
        this.thirteen = parsed["13:00"];
        this.thirteenHalf = parsed["13:30"];
        this.fourteen = parsed["14:00"];
        this.fourteenHalf = parsed["14:30"];
    }

    setJourneyTime(event) {
        this.journeyTime = event.target.dataset.time;
        this.journeyTimeMessage = this.journeyDateMessage + " at: " + this.journeyTime;
        this.disabledReservation = false;
    }

    bookEvent() {
        createJourneyEvent({
            agentId: this.agent.Id,
            selectedDay: this.journeyDate,
            selectedTime: this.journeyTime
        })
        .catch(error => {
            this.showError(error);
        });
    }

}