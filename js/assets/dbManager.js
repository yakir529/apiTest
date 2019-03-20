/****************************** GLOBAL ******************************/
var AssetsLib = AssetsLib || {};

/****************************** FACTORY ******************************/
AssetsLib.DBManager = (function(){
    var m_instance,
        DBHandler = (function(){
            var m_db = null,
                c_insertDataToTableCommandTemplate = "DELETE FROM {0} INSERT INTO {0} ({1}) VALUES {2}",
                c_createTableCommandTemplate = "CREATE TABLE IF NOT EXISTS {0} (ID unique, {1})",
                c_dataTableColumnsTemplate = "Word, Score, Tags",
                c_tagsFieldSlugMarker = "&",
                c_getReportCommandTemplate = "SELECT * FROM {0} {1} ",
                m_createdDataTablesNameLog = [];

            function DBHandler(){
                m_db = openDatabase("wordsStore", "1.0", "db for words from api", 2 * 1024 * 1024);
            }

            DBHandler.prototype.SetKeywords = function(i_keywordsArr){
                m_createdDataTablesNameLog = i_keywordsArr;
            }

            DBHandler.prototype.CreateDataTable = function(i_tableName){
                return new Promise(function (resolve) {
                    var _createTableCommand = getCreateTableCommand(i_tableName, c_dataTableColumnsTemplate);
                    m_db.transaction(function (tx) {
                        tx.executeSql(_createTableCommand);
                        resolve();
                    });
                });
            }

            DBHandler.prototype.InsertDataToLastCreatedTable = function(i_data){
                return new Promise(function (resolve) {
                    var _insertDataToTableCommand = getInsertToTableCommand(m_createdDataTablesNameLog[m_createdDataTablesNameLog.length - 1], c_dataTableColumnsTemplate, getAggregateData(i_data));
                    m_db.transaction(function (tx) {
                        tx.executeSql(_insertDataToTableCommand);
                        resolve();
                    });
                });
            }

            DBHandler.prototype.GetReport = function(){
                return new Promise(function (resolve) {
                    var _reportDataCommand = getReportCommand();
                    m_db.transaction(function (tx) {
                        tx.executeSql(_reportDataCommand, [], function(tx, i_data){
                            resolve(i_data.rows);
                        });
                    });
                });
            }

            function getCreateTableCommand(i_tableName, i_columns){
                return c_createTableCommandTemplate.Format([i_tableName, i_columns]);
            }
            
            function getInsertToTableCommand(i_tableName, i_columns, i_data){
                return c_insertDataToTableCommandTemplate.Format([i_tableName, i_columns, i_data]);
            }

            function getReportCommand(){
                var o_response = "SELECT Tags, COUNT(*) AS 'num' FROM (",
                    v_union = "UNION";

                for (var k=0; k<m_createdDataTablesNameLog.length; k++) {
                    if (k == m_createdDataTablesNameLog.length - 1) v_union = ") GROUP BY Tags";
                    o_response += c_getReportCommandTemplate.Format([m_createdDataTablesNameLog[k], v_union]);
                }

                return o_response;
            }

            function getAggregateData(i_data){
                var o_response = "",
                    c_template = "('{0}','{1}','{2}'){3}",
                    v_marker = ", ";
                
                for (var k=0; k < i_data.length; k++) {
                    if (k == i_data.length - 1) v_marker = "";
                    o_response += c_template.Format([i_data[k].word, i_data[k].score, i_data[k].tags.join(c_tagsFieldSlugMarker), v_marker]);
                };

                return o_response;
            }

            return DBHandler;
        })();
    
    function craeteInstance(){
        if (!m_instance) m_instance = new DBHandler;
        return m_instance;
    }

    return {
        GetInstance: function(){
            return craeteInstance();
        }
    };
})();