global class WH_CurrencyUpdate {

    public WH_CurrencyUpdate() {
        getCurrencyInfo();
    }

    @future(callout=true)
    private static void getCurrencyInfo() {
        Http httpCls = new Http();
        HttpRequest request = new HttpRequest();
        CurrencyEndpoint__c endpoint = CurrencyEndpoint__c.getInstance(UserInfo.getUserId());
        request.setEndpoint(endpoint.Endpoint__c);
        request.setMethod('GET');
        request.setTimeout(120000);
        httpResponse response = httpCls.send(request);
        Dom.Document document = response.getBodyDocument();
        Map<String, Decimal> currencyInfo = getRatesFromXML(document);
        for(String currencyName : currencyInfo.keySet()) {
            if(currencyName.length() < 4) {
                updateRate(currencyName, currencyInfo.get(currencyName));
            }
        }
    }

    private static Map<String, Decimal> getRatesFromXML(Dom.Document document) {
        Map<String, Decimal> rates = new Map<String, Decimal>();
        Dom.XMLNode rootElement = document.getRootElement();
        for (Dom.XMLNode childElement : rootElement.getChildElements()) {
            for (Dom.XMLNode detailElement : childElement.getChildElements()) {
                if(detailElement.getAttribute('time', '') != null) {
                    rates.put(detailElement.getAttribute('time', ''), 0);
                }
                for (Dom.XMLNode subDetailElement : detailElement.getChildElements()) {
                    rates.put(
                        subDetailElement.getAttribute('currency',''),
                        Decimal.valueOf(subDetailElement.getAttribute('rate',''))
                    );
                }
            }
        }
        return rates;
    }

    private static void updateRate(String code, Decimal rate) {
        String today = System.now().format('yyyy-MM-dd');
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:Currencies/');
        request.setBody('{ "IsoCode" : "' + code + '", "ConversionRate" : ' + rate + ', "StartDate" : "' + today + '" }');
        request.setHeader('Content-Type', 'application/json');
        request.setMethod('POST');
        request.setTimeout(120000);
        Http httpCls = new Http();
        HttpResponse response = httpCls.send(request);
    }
}