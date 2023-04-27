public without sharing class WH_ReservationController {

    @AuraEnabled(cacheable=true)
    public static AuthSession getLoggedInStatus() {
        return [SELECT IsCurrent FROM AuthSession ORDER BY IsCurrent DESC LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static User getOfficeAgentInfo(String productId) {
        Product2 product = [SELECT Office_Agent__c FROM Product2 WHERE Id =: productId][0];
        return [
            SELECT 
                FirstName,
                LastName,
                FullPhotoUrl
            FROM User
            WHERE Id =: product.Office_Agent__c
        ];
    }

    private static DateTime getStartDateTime(String selectedDay, String startTime) {
        String startTimeStringHour = startTime.substring(0, 2);
        Integer startTimeHour = integer.valueOf(startTimeStringHour);
        String startTimeStringMinute = startTime.substring(3, 5);
        Integer startTimeMinute = integer.valueOf(startTimeStringMinute);
        Time startTimeHoursAndMinutes = Time.newInstance(startTimeHour, startTimeMinute, 0, 0);
        Date startDateDay = Date.valueOf(selectedDay);
        Datetime startDateTime = Datetime.newInstance(startDateDay, startTimeHoursAndMinutes);
        return startDateTime;
    }

    @AuraEnabled
    public static void createJourneyEvent(Id agentId, String selectedDay, String selectedTime) {
        DateTime startDateTime = getStartDateTime(selectedDay, selectedTime);
        Event objEvent = new Event();
        objEvent.OwnerId = agentId;
        objEvent.Subject = 'Office Journey';
        objEvent.StartDateTime = startDateTime;
        objEvent.EndDateTime = startDateTime.addMinutes(30);
        try {
            insert objEvent;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getAgentAvailability(Id agentId, String selectedDay) {
        Datetime dayStart = Datetime.newInstance(Date.valueOf(selectedDay), Time.newInstance(0, 0, 0, 0));
        Datetime dayEnd = Datetime.newInstance(Date.valueOf(selectedDay), Time.newInstance(23, 59, 59, 0));
        Map<String, Boolean> availability = new Map<String, Boolean>();
        availability.put('09:00', false);
        availability.put('09:30', false);
        availability.put('10:00', false);
        availability.put('10:30', false);
        availability.put('11:00', false);
        availability.put('11:30', false);
        availability.put('12:00', false);
        availability.put('12:30', false);
        availability.put('13:00', false);
        availability.put('13:30', false);
        availability.put('14:00', false);
        availability.put('14:30', false);
        List<Event> bookedEvents = [
            SELECT StartDateTime 
            FROM Event 
            WHERE OwnerId =: agentId 
            AND StartDateTime >: dayStart 
            AND StartDateTime <: dayEnd
        ];
        for(Event event : bookedEvents) {
            String eventTime = event.StartDateTime.format('HH:mm');
            availability.put(eventTime, true);
        }
        return JSON.serialize(availability);
    }

}