/****************************** GLOBAL ******************************/
var AssetsLib = AssetsLib || {};

/****************************** FACTORY ******************************/
AssetsLib.LoaderManager = (function(){
    var m_instance,
        LoaderHandler = (function(){
            function LoaderHandler()
            { }

            LoaderHandler.prototype.ShowLoader = function(){
                
            }

            LoaderHandler.prototype.HideLoader = function(){
                console.log(1);
            }

            return LoaderHandler;
        })();

    function createInstance(){
        if (!m_instance) m_instance = new LoaderHandler;
        return m_instance;
    }

    return {
        GetInstance: function(){
            return createInstance();
        }
    }
})();