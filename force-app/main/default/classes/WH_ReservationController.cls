public without sharing class WH_ReservationController {

    @AuraEnabled(cacheable=true)
    public static AuthSession getLoggedInStatus() {
        return [SELECT IsCurrent FROM AuthSession ORDER BY IsCurrent DESC LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static User getOfficeAgentInfo(String productId) {
        Product2 product = [SELECT Office_Agent__c FROM Product2 WHERE Id =: productId][0];
        return [
            SELECT FirstName, LastName, FullPhotoUrl
            FROM User
            WHERE Id =: product.Office_Agent__c
        ];
    }

    @AuraEnabled
    public static void createJourneyEvent(Id productId, Id agentId, String selectedDay, String selectedTime) {
        DateTime startDateTime = getStartDateTime(selectedDay, selectedTime);
        Event objEvent = new Event();
        objEvent.OwnerId = agentId;
        objEvent.WhatId = productId;
        objEvent.Subject = 'Office Journey';
        objEvent.StartDateTime = startDateTime;
        objEvent.EndDateTime = startDateTime.addMinutes(30);
        try {
            insert objEvent;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static DateTime getStartDateTime(String selectedDay, String startTime) {
        Integer startTimeHour = integer.valueOf(startTime.substring(0, 2));
        Integer startTimeMinute = integer.valueOf(startTime.substring(3, 5));
        Time startTimeHoursAndMinutes = Time.newInstance(startTimeHour, startTimeMinute, 0, 0);
        Datetime startDateTime = Datetime.newInstance(Date.valueOf(selectedDay), startTimeHoursAndMinutes);
        return startDateTime;
    }

    @AuraEnabled(cacheable=true)
    public static String getAgentAvailability(Id agentId, String selectedDay) {
        Date day = Date.valueOf(selectedDay);
        Datetime dayStart = Datetime.newInstance(day, Time.newInstance(0, 0, 0, 0));
        Datetime dayEnd = Datetime.newInstance(day, Time.newInstance(23, 59, 59, 0));
        Map<String, Boolean> availability = getAvailabilityMap(day);
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

    private static Map<String, Boolean> getAvailabilityMap(Date selectedDay) {
        Map<String, Boolean> availability = new Map<String, Boolean>();
        Datetime now = System.now();
        availability.put('09:00', checkTime(now, selectedDay, 9, 0));
        availability.put('09:30', checkTime(now, selectedDay, 9, 30));
        for(Integer i = 10; i <= 14; i++) {
            availability.put(i + ':00', checkTime(now, selectedDay, i, 0));
            availability.put(i + ':30', checkTime(now, selectedDay, i, 30));
        }
        return availability;
    }

    private static Boolean checkTime(Datetime now, Date selectedDay, Integer hours, Integer minutes) {
        return (Datetime.newInstance(selectedDay, Time.newInstance(hours - 1, minutes, 0, 0)) < now);
    }

}