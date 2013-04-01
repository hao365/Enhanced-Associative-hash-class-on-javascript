
var Hash = function() {
    if (arguments.length % 2 == 0)
        for(var i = 0; i < arguments.length; i++) {
            if ('|string|number|'.indexOf('|' + typeof arguments[i] + '|') == -1)
                throw new Exception('invalid key');
            else
                this[arguments[i]] = arguments[++i];
        }
    else
        throw new Exception('init new Hash arguments % 2 != 0');
};
Hash.prototype = {
    empty: function() {
        for (var i in this)
            if (this.hasOwnProperty(i))
                return false;
        return true;
    },
    count: function() {
        var r = 0;
        for (var i in this)
            if (this.hasOwnProperty(i))
                ++r;
        return r;
    },
    keys: function($) {
        var r = $ ? [] : {};
        for (var i in this)
            if (this.hasOwnProperty(i))
                $ ? r.push(i) : r[i] = 1;
        return r;
    },
    values: function() {
        var r = [];
        for (var i in this)
            if (this.hasOwnProperty(i))
                r.push(this[i]);
        return r;
    },
    clone: function() {
        var r = new Hash, v, n;
        for (var i in this)
            if (this.hasOwnProperty(i)) {
                v = this[i];
                switch (typeof v) {
                    case 'object':
                        switch (v.constructor.toString().substr(10, 4)) {
                            case 'Date':
                                n = new Date().setTime(v.getTime());
                                break;
                            case 'Arra':
                                n = [];
                                for (var i = 0; i < v.length; i++)
                                    n[i] = typeof v[i] == 'object' ? '' : v[i];
                                break;
                            default:
                                n = v instanceof Hash ? v.clone() : v;
                        }
                        break;
                    default:
                        n = v;
                }
                r[i] = n;
            }
        return r;
    },
    _cloneArray: function(v) {
        var n;
                alert('_cloneArray');
        switch (typeof v) {
            case 'object':
                switch (v.constructor.toString().substring(9, 13)) {
                    case 'Hash':
                        n = v.clone();
                        break;
                    case 'Date':
                        n = new Date().setTime(v.getTime());
                        break;
                    case 'Arra':
                        n = [];
                        for (var i = 0; i < v.length; i++)
                            n[i] = typeof v[i] == 'object' ? this._cloneArray(v) : v;
                        break;
                    default:
                        n = v;
                }
                break;
            default:
                n = v;
        }
        return n;
    },
    append: function(a, $) { // $: return a clone or self
        var r = $ ? this.clone() : this;
        for (var i in a)
            if (a.hasOwnProperty(i))
                r[i] = a[i];
        return r;
    },
    union: function(a, $) { // $: return a clone or self
        var r = $ ? this.clone() : this;
        for (var i in a)
            if (r[i] == undefined)
                r[i] = a[i];
        return r;
    },
    foreach: function(fn, ex1, ex2) {
        for (var i in this)
            if (this.hasOwnProperty(i))
                fn(i, this[i], ex1, ex2);
        return ex1 ? ex1 : this;
    },
    each: function(fn) {
        for (var i in this)
            if (this.hasOwnProperty(i))
                if (!fn(i, this[i]))
                    return false;
        return true;
    },
    grep: function(fn) {
        var r = new Hash;
        for (var i in this)
            if (this.hasOwnProperty(i))
                if (fn(i, this[i]))
                    r[i] = this[i];
        return r;
    },
    map: function(fn, $) {
        var r = $ ? new Hash : this;
        for (var i in this)
            if (this.hasOwnProperty(i))
                r[i] = fn(this[i], i);
        return r;
    },
    eq: function(a) {
        if (a == this)
            return true;
        throw new Exception('Not implemented', 100);
    },
    diff: function(a) {
        throw new Exception('Not implemented', 100);
    },
    dump: function(level) {
        level = level || 0;
        var ret = '', k = '', v = '';
        for (var i in this)
            if (this.hasOwnProperty(i)) {
                k = i;
                if (typeof i == 'string')
                    k = '"' + i + '"';
                switch (typeof this[i]) {
                    case 'string':
                        v = 'string(' + this[i].length + ') "' + this[i] + '"';
                        break;
                    case 'rray':
                        v = 'array(' + this[i].join('\n');
                        break;
                    case 'number':
                        v = 'int(' + this[i] + ')';
                        break;
                    case 'object':
                        if (this[i] instanceof Hash) {
                            v = this[i].dump(level);
                        } else if (this[i] instanceof Array) {
                            v = 'Array(\n' + this[i].join(',\n').leftpad(1) + '\n)';
                        } else {
                            var c = this[i].constructor.toString();
                            v = 'object(' + c.indexOf('function') == -1 ? 'Unknown' : c.substring(c.indexOf(' ') + 1, c.indexOf('(')) + ')';
                        }
                        break;
                    case 'boolean':
                        v = 'bool(' + (this[i] ? 'true' : 'false') + ')';
                        break;
                    case 'function':
                        v = this[i].toString();
                        break;
                    case 'undefined':
                        v = 'undefined';
                        break;
                    default:
                        throw new Exception('unknown type in Hash.dump()', 400);
                }
                ret += '[' + k +'] => \n' + v.leftpad(level + 1) + '\n\n';
            }
        return ret;
    }
}

