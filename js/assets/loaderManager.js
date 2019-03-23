/****************************** GLOBAL ******************************/
var AssetsLib = AssetsLib || {};

/****************************** FACTORY ******************************/
AssetsLib.LoaderManager = (function(){
    var m_instance,
        LoaderHandler = (function(){
            var m_containerSelector = ".loader-container";

            function LoaderHandler()
            { }

            LoaderHandler.prototype.ShowLoader = function(){
                $(m_containerSelector).css("visibility", "visible");
            }

            LoaderHandler.prototype.HideLoader = function(){
                $(m_containerSelector).css("visibility", "hidden");
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