// http://stackoverflow.com/a/17368101/1289683

Array.prototype.extend = function (otherArray) {
    if (otherArray && Array === otherArray.constructor)
        otherArray.forEach(function(v) {this.push(v)}, this);
};

exports.averageColor = function(c1, c2) {
    var c1r = Math.floor(c1 / 0x10000);
    var c1g = Math.floor(c1 / 0x100) % 0x100;
    var c1b = c1 % 256;
    var c2r = Math.floor(c2 / 0x10000);
    var c2g = Math.floor(c2 / 0x100) % 0x100;
    var c2b = c2 % 256;

    var r = Math.round((c1r + c2r) / 2);
    var g = Math.round((c1g + c2g) / 2);
    var b = Math.round((c1b + c2b) / 2);

    return r * 0x10000 + g * 0x100 + b;
};
