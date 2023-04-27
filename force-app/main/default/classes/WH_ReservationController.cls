public without sharing class WH_ReservationController {

    @AuraEnabled(cacheable=true)
    public static AuthSession getLoggedInStatus() {
        return [ SELECT IsCurrent FROM AuthSession ORDER BY IsCurrent DESC ][0];
    }

}