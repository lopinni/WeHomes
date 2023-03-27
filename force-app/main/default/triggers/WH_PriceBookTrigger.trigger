trigger WH_PriceBookTrigger on Pricebook2 (before insert, before update) {
    List<Pricebook2> existingPricebooks = [
        SELECT Id, IsActive, TypeInfo__c FROM Pricebook2 WHERE IsActive = true
    ];
    for(Pricebook2 newPriceBook: Trigger.new) {
        if(newPriceBook.IsActive == true) {
            for(Pricebook2 existingPriceBook: existingPricebooks) {
                if(newPriceBook.TypeInfo__c == existingPriceBook.TypeInfo__c && newPriceBook.Id != existingPriceBook.Id) {
                    newPriceBook.addError('There is already an active Price Book of this type');
                }
            }
        }
    }
}