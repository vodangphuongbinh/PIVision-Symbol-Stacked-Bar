/*
	FINAL PROJECT
	Course: Customizing PI Vision with Extensibility
	Author: Binh Vo
	Email: binh.vo@esec.vn
*/
(function (PV) {
	"use strict";
	
    function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);
	
	//Use this function to merge data variable
	function arrayDataProvider(data) {
		var result = [];
		var i, j;
		for (i = 0; i < data.Data[0].Values.length; i++) {
			var dt = [];
			var dt1 = new Date(data.Data[0].Values[i].Time);
			var dt2 = (dt1.getMonth() + 1) + "/" + dt1.getDate() + "/" + dt1.getFullYear();
			dt = {"Time": dt2};
			for (j = 0; j < data.Data.length; j++) {
				var id = data.Data[j].Label;
				dt[id] = Math.round(data.Data[j].Values[i].Value);
			}
			result.push(dt);
		}
		return result;
	}
	
	//Generate a column quantity based on data array size.
	function arrayGraphs(data) {
		var result = [];
		var k;
		for (k = 0; k < data.Data.length; k++) {
			var dt = {
				"balloonText": "[[title]]: [[value]]",
				"fillAlphas": 1,
				"id": "AmGraph-" + (k + 1),
				"title": data.Data[k].Label,
				"type": "column",
				"valueField": data.Data[k].Label
			};
			result.push(dt);
		}
		return result;
	}

	//Amchart code
	//$unit: UOM of the data and Value Axis legend
	function getConfig(unit){		
		return{
			"type": "serial",
			"categoryField": "Time",
			"startDuration": 1,
			"theme": "light",
			"categoryAxis": {
				"gridPosition": "start"
			},
			"valueAxes": [
				{
					"id": "ValueAxis-1",
					"stackType": "regular",
					"title": "UOM: " + unit
				}
			],
			"allLabels": [],
			"balloon": {},
			"legend": {
				"enabled": true,
				"useGraphSettings": true
			}
		}
	}
    var definition = {
        typeName: 'StackedBar',
		//The logo file is stored in the same directory with this symbol documents
		iconUrl: 'Scripts/app/editor/symbols/ext/ESEC.svg',
		visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        getDefaultConfig: function() {
    	    return {
				DataShape: 'Timeseries',
    	        Height: 300,
                Width: 300
            };
        }
    };
	
	symbolVis.prototype.init = function (scope, elem) {
		var container = elem.find('#container')[0];
		container.id = "barChart_" + scope.symbol.Name;		
				
		this.onDataUpdate = dataUpdate;
		function dataUpdate(data){
			var chart = AmCharts.makeChart(container.id, getConfig(data.Data[0].Units));
			var GS = arrayGraphs(data);
			chart.graphs = GS;	
			var DP = arrayDataProvider(data);			
			chart.dataProvider = DP;
			chart.validateData();			
		}
    };

    PV.symbolCatalog.register(definition);
})(window.PIVisualization);