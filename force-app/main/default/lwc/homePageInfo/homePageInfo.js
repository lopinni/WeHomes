import { LightningElement } from 'lwc';

import WEHOMES_LOGO from '@salesforce/resourceUrl/WeHomesLogo';
import FURNITURE from '@salesforce/resourceUrl/OfficeFurniture';
import CONSTRUCTION from '@salesforce/resourceUrl/OfficeConstruction';
import STARTUP from '@salesforce/resourceUrl/OfficeStartup';
import SUPPORT from '@salesforce/resourceUrl/OfficeSupport';
import HAPPY from '@salesforce/resourceUrl/OfficeHappy';

export default class HomePageInfo extends LightningElement {

    logoUrl = WEHOMES_LOGO;

    images = {
        FURNITURE,
        CONSTRUCTION,
        STARTUP,
        SUPPORT,
        HAPPY,
    }

}