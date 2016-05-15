// http://stackoverflow.com/a/17368101/1289683

Array.prototype.extend = function (otherArray) {
    if (otherArray && Array === otherArray.constructor)
        otherArray.forEach(function(v) {this.push(v)}, this);
};
