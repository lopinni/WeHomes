import { LightningElement } from 'lwc';

import WEHOMES_LOGO from '@salesforce/resourceUrl/WeHomesLogo';
import FURNITURE from '@salesforce/resourceUrl/OfficeFurniture';
import CONSTRUCTION from '@salesforce/resourceUrl/OfficeConstruction';
import STARTUP from '@salesforce/resourceUrl/OfficeStartup';
import SUPPORT from '@salesforce/resourceUrl/OfficeSupport';
import HAPPY from '@salesforce/resourceUrl/OfficeHappy';

import FURNITURE_HEADER from '@salesforce/label/c.Furniture_Header';
import FURNITURE_TEXT from '@salesforce/label/c.Furniture_Text';
import CONSTRUCTION_HEADER from '@salesforce/label/c.Construction_Header';
import CONSTRUCTION_TEXT from '@salesforce/label/c.Construction_Text';
import STARTUP_HEADER from '@salesforce/label/c.Startup_Header';
import STARTUP_TEXT from '@salesforce/label/c.Startup_Text';
import SUPPORT_HEADER from '@salesforce/label/c.Support_Header';
import SUPPORT_TEXT from '@salesforce/label/c.Support_Text';
import HAPPY_HEADER from '@salesforce/label/c.Happy_Header';
import HAPPY_TEXT from '@salesforce/label/c.Happy_Text';

export default class HomePageInfo extends LightningElement {

    logoUrl = WEHOMES_LOGO;

    images = {
        FURNITURE,
        CONSTRUCTION,
        STARTUP,
        SUPPORT,
        HAPPY
    }

    labels = {
        FURNITURE_HEADER,
        FURNITURE_TEXT,
        CONSTRUCTION_HEADER,
        CONSTRUCTION_TEXT,
        STARTUP_HEADER,
        STARTUP_TEXT,
        SUPPORT_HEADER,
        SUPPORT_TEXT,
        HAPPY_HEADER,
        HAPPY_TEXT
    }

}