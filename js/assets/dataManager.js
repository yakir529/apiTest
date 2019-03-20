/****************************** GLOBAL ******************************/
var AssetsLib = AssetsLib || {};

/****************************** FACTORY ******************************/
AssetsLib.DataManager = (function(){
    var m_instance,
        DataHandler = (function(){
            var c_badSettingsMSG = "Bad settings were submited",
                m_apiPath = null,
                m_dbManager = null,
                m_loaderManager = null,
                m_settings = null;

            function DataHandler()
            {
                m_dbManager = AssetsLib.DBManager.GetInstance();
                m_loaderManager = AssetsLib.LoaderManager.GetInstance();
                m_apiPath = "https://api.datamuse.com/words?ml={0}";
                m_settings = {
                    rawDataContainerSelector: ".rawDataContainer",
                    keyWords: {"affiliate": "affiliate","marketing": "marketing","influencer": "influencer"}
                };
            }

            DataHandler.prototype.FetchDataToDB = function(){
                m_loaderManager.ShowLoader();
                var _promise = $.when(),
                    _keys = Object.keys(m_settings.keyWords);
                m_dbManager.SetKeywords(m_settings.keyWords);
                _keys.forEach(function(word){
                    _promise = _promise
                    .then(function(){
                        return m_dbManager.CreateDataTable(word);
                    })
                    .then(function(){
                        m_dbManager.SetCurrTableName(word);
                        return callToAPI(word, m_dbManager.InsertDataToLastCreatedTable);
                    });
                });
                _promise = _promise.always(m_loaderManager.HideLoader);
                return _promise;
            }

            DataHandler.prototype.GenerateReportFromDB = function(i_uniqueContainerSelector, i_callback){
                m_loaderManager.ShowLoader();
                var _promise = $.when();
                _promise = _promise.then(m_dbManager.GetReport);
                _promise = _promise.always(m_loaderManager.HideLoader);
                return _promise;
            }

            function callToAPI(i_wordToFetch, i_callback){
                return $.get(m_apiPath.Format([i_wordToFetch]), i_callback);
            }

            return DataHandler;
        })();

    function createInstance(){
        if (!m_instance) m_instance = new DataHandler;
        return m_instance;
    }

    return {
        GetInstance: function(){
            return createInstance();
        }
    }
})();

