"use strict";
exports.__esModule = true;
exports.cleanse = void 0;
var cleanse = function (object) {
    var array = [];
    var _loop_1 = function (i) {
        var element = {};
        var claves = Object.keys(object[i]);
        var datos = Object.values(object[i]);
        var nuevaClave = [];
        claves.forEach(function (c, index) {
            nuevaClave.push(c.replace(/"/g, ""));
            element[nuevaClave[index]] = datos[index];
        });
        if (!isNaN(parseInt(element.Grupo)) && element.Nombre.length > 0) {
            array.push(element);
        }
    };
    for (var i = 0; i < object.length; i++) {
        _loop_1(i);
    }
    return array;
};
exports.cleanse = cleanse;
//# sourceMappingURL=cleanse.js.map