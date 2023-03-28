import { LightningElement, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

import D3CSS from '@salesforce/resourceUrl/D3CSS';
import D3JS from '@salesforce/resourceUrl/D3JS';

export default class PricebookChart extends LightningElement {
    svgWidth = 800;
    svgHeight = 300;

    rendered = false;

    @api
    get pricebooks() {
        return this._pricebooks;
    }
    set pricebooks(value) {
        this._pricebooks = value;
        if (this.rendered) {
            this.clearChart();
            this.initializeChart();
        }
    }

    renderedCallback() {
        if (this.rendered) {
            return;
        }
        this.rendered = true;

        Promise.all([
            loadStyle(this, D3CSS),
            loadScript(this, D3JS)
        ])
            .then(() => {
                this.initializeChart();
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading libraries',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    initializeChart() {
        const pricebookData = JSON.parse(JSON.stringify(this.pricebooks));
        var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = this.svgWidth - margin.left - margin.right,
            height = this.svgHeight - margin.top - margin.bottom;

        var svg = d3.select(this.template.querySelector('svg.chart'))
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .style("font-size", "14px")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dates = [];
        pricebookData.forEach(element => {
            dates.push(Date.parse(element.StartDate__c));
            dates.push(Date.parse(element.EndDate__c));
        });
        const dateMax = new Date(Math.max.apply(null,dates)).getTime();
        const dateMin = new Date(Math.min.apply(null,dates)).getTime();

        const x = d3.scaleTime()
                    .domain([dateMin, dateMax])
                    .range([150, width]);

        const y = d3.scaleBand()
                    .domain(pricebookData.map(d => d.Name))
                    .range([0, height])
                    .padding(0.2);

        svg.call(d3.axisBottom(x));

        svg.append("g")
            .style("font-size", "14px")
            .attr("transform", "translate(" + (margin.left * 3) + "," + margin.top + ")")
            .call(d3.axisLeft(y));

        var index = 0;
        const rectangleHeight = this.svgHeight / (pricebookData.length * 3);
        pricebookData.forEach(element => {
            index++;
            svg.append("rect")
                .attr("rx", 10)
                .attr("x", () => {
                    return x(Date.parse(element.StartDate__c));
                })
                .attr("y", () => {
                    return (y(element.Name) + (rectangleHeight));
                })
                .attr("height", rectangleHeight)
                .attr("width", () => {
                    return x(Date.parse(element.EndDate__c)) - x(Date.parse(element.StartDate__c));
                })
                .attr("stroke", () => {
                    if(element.IsActive == true) {
                        return "#feb8ab";
                    } else {
                        return "#ecebea";
                    }
                })
                .attr("stroke-width", 5)
                .style("fill", () => {
                    if(element.TypeInfo__c == 'Business Premise PB') {
                        return "#57a3fd";
                    } else if(element.TypeInfo__c == 'Apartment PB') {
                        return "#91db8b";
                    } else {
                        return "#dddbda";
                    }
                });
        });

        svg.append("line")
            .attr("x1", () => {
                var today = new Date().getTime();
                return x(today);
            })
            .attr("x2", () => {
                var today = new Date().getTime();
                return x(today);
            })
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "purple")
            .style("stroke-dasharray", ("3, 3"));
    }

    clearChart() {
        var svg = d3.select(this.template.querySelector('svg.chart'));
        svg.selectAll("*").remove();
    }

}