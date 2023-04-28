import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getLoggedInStatus from "@salesforce/apex/WH_ReservationController.getLoggedInStatus";
import getOfficeAgentInfo from "@salesforce/apex/WH_ReservationController.getOfficeAgentInfo";
import createJourneyEvent from "@salesforce/apex/WH_ReservationController.createJourneyEvent";
import getAgentAvailability from "@salesforce/apex/WH_ReservationController.getAgentAvailability";

import ERROR from '@salesforce/label/c.Error';
import LOADING from '@salesforce/label/c.Loading';
import SUCCESS from '@salesforce/label/c.Success';
import SELECTED_DATE_TIME from '@salesforce/label/c.Selected_Date_time';
import RESERVATION_SUCCESS_MESSAGE from '@salesforce/label/c.Journey_reservation_success_message';
import OFFICE_AGENT from '@salesforce/label/c.Office_Agent';
import AM from '@salesforce/label/c.AM';
import PM from '@salesforce/label/c.PM';
import BOOK_AN_OFFICE_JOURNEY from '@salesforce/label/c.Book_An_Office_Journey';
import RESERVE_JOURNEY from '@salesforce/label/c.Reserve_Journey';

export default class OfficeJourneyMenu extends LightningElement {

    labels = {
        LOADING,
        OFFICE_AGENT,
        AM,
        PM,
        BOOK_AN_OFFICE_JOURNEY,
        RESERVE_JOURNEY
    }

    @api recordId;

    loaded = false;
    isLoggedIn = true;

    agent;
    journeyTime;
    journeyDate;
    journeyDateTimeMessage;

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
            message: error.body.message,
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
        } else {
            this.loaded = true;
        }
    }

    setJourneyDate(event) {
        this.journeyDate = event.detail.value;
        this.setButtonsState();
    }

    setButtonsState() {
        getAgentAvailability({
            agentId: this.agent.Id,
            productId: this.recordId,
            selectedDay: this.journeyDate
        }).then(result => {
            this.setAvailability(JSON.parse(result));
        })
        .catch(error => {
            this.showError(error);
        });
    }

    setAvailability(parsed) {
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
        this.journeyDateTimeMessage = SELECTED_DATE_TIME;
        this.journeyDateTimeMessage += " " + this.journeyDate + "  " + this.journeyTime;
        this.disabledReservation = false;
    }

    bookEvent() {
        createJourneyEvent({
            productId: this.recordId,
            agentId: this.agent.Id,
            selectedDay: this.journeyDate,
            selectedTime: this.journeyTime
        }).then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: SUCCESS,
                message: RESERVATION_SUCCESS_MESSAGE,
                variant: 'success'
            }));
        }).then(() => {
            this.updateButtons();
        })
        .catch(error => {
            this.showError(error);
        });
    }

    updateButtons() {
        this.disableNine = true; 
        this.disableNineHalf = true; 
        this.disableTen = true; 
        this.disableTenHalf = true; 
        this.disableEleven = true; 
        this.disableElevenHalf = true; 
        this.disableTwelve = true; 
        this.disableTwelveHalf = true; 
        this.disableThirteen = true; 
        this.disableThirteenHalf = true; 
        this.disableFourteen = true; 
        this.disableFourteenHalf = true; 
        this.disabledReservation = true;
    }

}