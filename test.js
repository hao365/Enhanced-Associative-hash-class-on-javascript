var obj = new Hash('K1', 'V1', 'K2', 'V2');
var h = new Hash();
h['A'] = obj;
var h2 = h.clone();
obj['K1'] = 'changed';
alert('Clone: \n' + h2.dump());

alert('map: \n' + h2.map(function(v) {
    return v.map(function(v) {
        return v + '!!!';
    });
}).dump());

