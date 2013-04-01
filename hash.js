
var Hash = function() {
    if (arguments.length % 2 == 0)
        for(var i = 0; i < arguments.length; i++) {
            if ('|string|number|'.indexOf('|' + typeof arguments[i] + '|') == -1)
                throw new Exception('invalid key');
            else
                this[arguments[i]] = arguments[++i];
        }
    else
        throw new Exception('arguments not pairs');
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
        var r = new Hash, v, n, cns = '', tmp, pos;
        for (var i in this)
            if (this.hasOwnProperty(i)) {
                v = this[i];
                switch (typeof v) {
                    case 'function':
                        tmp = v[i].toString();
                        pos = tmp.indexOf('{');
                        eval('n = function' + tmp.substring(10, pos) + tmp.substr(pos));
                        break;
                    case 'object':
                        cns = v.constructor.toString();
                        switch (cns.substring(10, cns.indexOf('('))) {
                            case 'Date':
                                n = new Date().setTime(v.getTime());
                                break;
                            case 'Array':
                                n = this._cloneArray(v);
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
        var r = [], cns = '', tmp = '', pos = 0;
        for (var i = 0; i < v.length; i++)
            switch (typeof v[i]) {
                case 'function':
                    tmp = v[i].toString();
                    pos = tmp.indexOf('{');
                    eval('r[i] = function' + tmp.substring(10, pos) + tmp.substr(pos));
                    break;
                case 'object':
                    cns = v.constructor.toString();
                    switch (v[i].constructor.toString().substring(10, cns.indexOf('('))) {
                        case 'Hash':
                            r[i] = v[i].clone();
                            break;
                        case 'Date':
                            r[i] = new Date().setTime(v[i].getTime());
                            break;
                        case 'Array':
                            r[i] = this._cloneArray(v[i]);
                            break;
                        default:
                            r[i] = v[i];
                    }
                    break;
                default:
                    r[i] = v[i];
            }
        return r;
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
                r[i] = fn(i, this[i]);
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
                    case 'number':
                        v = 'int(' + this[i] + ')';
                        break;
                    case 'object':
                        if (this[i] instanceof Hash) {
                            v = 'Hash(\n' + this[i].dump(level).leftpad(1) + '\n)';
                        } else if (this[i] instanceof Array) {
                            v = 'Array(\n' + this[i].join(',\n').leftpad(1) + '\n)';
                        } else if (this[i] instanceof Date) {
                            v = 'Date(\n' + this[i].getTime() + '\n)';
                        } else {
                            var c = this[i].constructor.toString();
                            v = 'object(' + c.substr(0, 8) == 'function' ? 'Unknown' : c.substring(10, c.indexOf('(')) + ')';
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

