import { LightningElement, api } from 'lwc';

export default class PaginationControls extends LightningElement {

    @api page;
    @api pages;

    @api
    get pagesNumber() {
        return this.pages;
    }
    set pagesNumber(value) {
        this.pages = value;
        this.buildPaginationInfo();
    }

    paginationInfo;

    enablePreviousButtons;
    enableNextButtons = true;

    connectedCallback() {
        this.buildPaginationInfo();
    }

    buildPaginationInfo() {
        this.checkButtonsState();
        this.paginationInfo = "Page " + this.page + " of " + this.pages;
    }

    moveFirst() {
        this.page = 1;
        this.buildPaginationInfo();
        this.moveToPage();
    }

    movePrevious() {
        if(this.page > 1) {
            this.page -= 1;
        }
        this.buildPaginationInfo();
        this.moveToPage();
    }

    moveNext() {
        if(this.page < this.pages) {
            this.page += 1;
        }
        this.buildPaginationInfo();
        this.moveToPage();
    }

    moveLast() {
        this.page = this.pages;
        this.buildPaginationInfo();
        this.moveToPage();
    }

    moveToPage() {
        this.checkButtonsState();
        const customEvent = new CustomEvent("move", { detail: this.page });
        this.dispatchEvent(customEvent);
    }

    checkButtonsState() {
        if(this.page == 1) {
            this.enablePreviousButtons = false;
        } else {
            this.enablePreviousButtons = true;
        }
        if(this.page == this.pages) {
            this.enableNextButtons = false;
        } else {
            this.enableNextButtons = true;
        }
    }

}