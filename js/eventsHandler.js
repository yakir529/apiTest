/****************************** GLOBAL ******************************/
var dataManager = AssetsLib.DataManager.GetInstance();

/****************************** LISTENERS ******************************/
$(function(){
    $(document.body).on("click", ".js_fetchData", function(i_event){
        dataManager.FetchDataToDB();
    });
    
    $(document.body).on("click", ".js_showReport", function(i_event){
        dataManager.GenerateReportFromDB()
        .then(function(i_reportData){
            var v_html = "",
                c_htmlTemplate = "<div class='data-row'><label>Tag:</label><p>{0}</p><label>Count:</label><p>{1}</p></div>",
                _graphDataArr = [["Tag", "Num"]],
                _graphOptions = {title: "Num Of Concurent Tags"};

            for (var key in i_reportData) {
                if (i_reportData.hasOwnProperty(key)) {
                    v_html += c_htmlTemplate.Format([i_reportData[key].Tag, i_reportData[key].num]);
                    _graphDataArr.push([i_reportData[key].Tag, i_reportData[key].num]);
                }
            }

            $(".raw-data-container").html("").append(v_html);

            dataManager.CreateGraph(_graphDataArr, _graphOptions, ".graph-container");
        });
    });
});