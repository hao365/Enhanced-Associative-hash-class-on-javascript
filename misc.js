String.prototype.repeat = function(n) {
    return new Array(isNaN(n) ? 1 : ++n).join(this);
}
String.prototype.leftpad = function(len, pad) {
    pad = (pad || '  ').repeat(len);
    return pad + this.split(/\n/).join('\n' + pad);
}
