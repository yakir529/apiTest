/****************************** GLOBAL ******************************/
var AssetsLib = AssetsLib || {};

/****************************** FACTORY ******************************/
AssetsLib.DBManager = (function(){
    var m_instance,
        DBHandler = (function(){
            var m_db = null,
                c_insertDataToTableCommandTemplate = "INSERT INTO {0} ({1}) VALUES {2}",
                c_clearTableTemplate = "DELETE FROM {0}",
                c_createTableCommandTemplate = "CREATE TABLE IF NOT EXISTS {0} (ID {1}, {2})",
                c_getReportCommand = "Select TagSlug as Tag, Count(*) as num from Tags Group by TagSlug",
                m_createdDataTablesLog = {},
                m_currTableName = null;

            function DBHandler(){
                m_db = openDatabase("wordsStore", "1.0", "db for words from api", 2 * 1024 * 1024);
            }

            DBHandler.prototype.SetCurrTableName = function(i_TableName){
                m_currTableName = i_TableName;
            }

            DBHandler.prototype.CreateDataTable = function(i_tableName, i_columns, i_isAutoInc){
                return new Promise(function (resolve) {
                    var _createWordsTableCommand = getCreateTableCommand(i_tableName, i_columns, i_isAutoInc),
                        _clearTableCommand = c_clearTableTemplate.Format([i_tableName]);
                    
                    m_db.transaction(function (tx) {
                        tx.executeSql(_createWordsTableCommand, [], function(tx, i_data){
                            tx.executeSql(_clearTableCommand, [], function(){
                                saveTableToLog(i_tableName, i_columns, i_isAutoInc);
                                resolve();
                            });
                        });
                    });
                });
            }

            DBHandler.prototype.InsertDataToLastCreatedTable = function(i_data){
                return new Promise(function (resolve) {
                    var _aggData = getAggregateData(m_createdDataTablesLog[m_currTableName].name, i_data),
                        _insertDataToWordTableCommand = getInsertToTableCommand(m_createdDataTablesLog[m_currTableName].name, "ID, " + m_createdDataTablesLog[m_currTableName].columns, _aggData.wordTableCommand),
                        _insertDataToTagsTableCommand = getInsertToTableCommand("Tags", m_createdDataTablesLog["Tags"].columns, _aggData.tagTableCommand);
                        
                    m_db.transaction(function (tx) {
                        tx.executeSql(_insertDataToWordTableCommand);
                        tx.executeSql(_insertDataToTagsTableCommand);
                        resolve();
                    });
                });
            }

            DBHandler.prototype.GetReport = function(){
                return new Promise(function (resolve) {
                    m_db.transaction(function (tx) {
                        tx.executeSql(c_getReportCommand, [], function(tx, i_data){
                            resolve(i_data.rows);
                        });
                    });
                });
            }

            function saveTableToLog(i_tableName, i_columns, i_isAutoInc){
                m_createdDataTablesLog[i_tableName] = {
                    name: i_tableName,
                    columns: i_columns,
                    isAutoInc: i_isAutoInc
                }
            }

            function getCreateTableCommand(i_tableName, i_columns, i_isAutoInc){
                return c_createTableCommandTemplate.Format([i_tableName, (i_isAutoInc)? "unique" : "", i_columns]);
            }
            
            function getInsertToTableCommand(i_tableName, i_columns, i_data){
                return c_insertDataToTableCommandTemplate.Format([i_tableName, i_columns, i_data]);
            }

            function getAggregateData(i_tableName, i_data){
                var o_response = {"wordTableCommand": "", "tagTableCommand": ""},
                    c_wordTableTemplate = "('{0}','{1}','{2}'){3}",
                    c_tagTableTemplate = "('{0}','{1}','{2}'){3}",
                    v_wordMarker = ", ",
                    v_tagMarker = null,
                    v_wordId = null;
                
                for (var k=0; k < i_data.length; k++) {
                    if (k == i_data.length - 1) v_wordMarker = "";
                    v_wordId = new Date().valueOf() + k;
                    v_tagMarker = ", ";
                    for (var index = 0; index < i_data[k].tags.length; index++) {
                        if (index == i_data[k].tags.length - 1 && k == i_data.length - 1) v_tagMarker = "";
                        o_response.tagTableCommand += c_tagTableTemplate.Format([v_wordId, i_tableName, i_data[k].tags[index], v_tagMarker]);
                    }
                    o_response.wordTableCommand += c_wordTableTemplate.Format([v_wordId, i_data[k].word, i_data[k].score, v_wordMarker]);
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