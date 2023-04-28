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

    disabledReservation = true;

    disableNine = true;
    disableNineHalf = true;
    disableTen = true;
    disableTenHalf = true;
    disableEleven = true;
    disableElevenHalf = true;
    disableTwelve = true;
    disableTwelveHalf = true;
    disableThirteen = true;
    disableThirteenHalf = true;
    disableFourteen = true;
    disableFourteenHalf = true;

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
        if(this.isLoggedIn) {
            getOfficeAgentInfo({ productId: this.recordId }).then(result => {
                this.agent = result;
                this.loaded = true;
            }).catch(error => {
                this.showError(error);
            });
        }
    }

    setJourneyDate(event) {
        this.journeyDate = event.detail.value;
        this.journeyDateMessage = "Jourey set on: " + this.journeyDate;
        this.setButtonsState();
    }

    setButtonsState() {
        getAgentAvailability({
            agentId: this.agent.Id,
            selectedDay: this.journeyDate
        }).then(result => {
            this.setAvailability(result);
        })
        .catch(error => {
            this.showError(error);
        });
    }

    setAvailability(result) {
        const parsed = JSON.parse(result);
        this.disableNine = parsed["09:00"];
        this.disableNineHalf = parsed["09:30"];
        this.disableTen = parsed["10:00"];
        this.disableTenHalf = parsed["10:30"];
        this.disableEleven = parsed["11:00"];
        this.disableElevenHalf = parsed["11:30"];
        this.disableTwelve = parsed["12:00"];
        this.disableTwelveHalf = parsed["12:30"];
        this.disableThirteen = parsed["13:00"];
        this.disableThirteenHalf = parsed["13:30"];
        this.disableFourteen = parsed["14:00"];
        this.disableFourteenHalf = parsed["14:30"];
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
        }).then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: "Success",
                message: "The Office Agent will contact You soon.",
                variant: 'success'
            }));
        }).then(() => {
            this.setButtonsState();
        })
        .catch(error => {
            this.showError(error);
        });
    }

}