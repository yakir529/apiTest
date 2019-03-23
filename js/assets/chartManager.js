/****************************** GLOBAL ******************************/
var AssetsLib = AssetsLib || {};

google.charts.load('current', {packages: ['corechart']});

/****************************** FACTORY ******************************/
AssetsLib.ChartManager = (function(){
    var m_instance,
        ChartHandler = (function(){
            function ChartHandler()
            { }

            ChartHandler.prototype.DrawChart = function(i_dataArr, i_options, i_uniqueSelector){
                var _data = google.visualization.arrayToDataTable(i_dataArr),
                    _options = i_options;

                m_chart = new google.visualization.ColumnChart(document.querySelector(i_uniqueSelector));
                m_chart.draw(_data, _options);
            }

            return ChartHandler;
        })();

    function createInstance(){
        if (!m_instance) m_instance = new ChartHandler;
        return m_instance;
    }

    return {
        GetInstance: function(){
            return createInstance();
        }
    }
})();