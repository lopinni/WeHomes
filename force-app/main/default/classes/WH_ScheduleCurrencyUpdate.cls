global class WH_ScheduleCurrencyUpdate implements Schedulable {
    global void execute(SchedulableContext SC) {
        WH_CurrencyUpdate currencySync = new WH_CurrencyUpdate();
    }
}