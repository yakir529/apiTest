/****************************** AID FUNCS & POLYFILLS ******************************/
if (!String.prototype.Format) {
    String.prototype.Format = function () {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var argumentsToReturn = typeof arguments[0];

        argumentsToReturn = (("string" === argumentsToReturn || "number" === argumentsToReturn) ? arguments : arguments[0]);

        return str.replace(/\{([0-9]+)\}/g, function (key, val) {
            return argumentsToReturn[val];
        });
    };
}