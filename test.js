var obj = new Hash('K1', 'V1', 'K2', 'V2');
//var obj = ['K1', 'V1', 'K2', 'V2'];
var h = new Hash();
h['A'] = obj;
alert('orgin:\n' + h.dump());
var h2 = h.clone();
alert('clone:\n' + h2.dump());
obj['K2'] = 'changed';
alert('changed:\n' + h.dump());
alert('Clone: \n' + h2.dump());

/*
alert('map: \n' + h2.map(function(v) {
    return v.map(function(v) {
        return v + '!!!';
    });
}).dump());
*/

