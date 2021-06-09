//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value == null ? _.identity : value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var result;
    var timeout = null;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

/* PSG ECOMMERCE console.log (found in commons.js) in a single file to be used in non web contexts */

if (typeof console === 'undefined') {
    console = {};
}

(function ()
{
    'use strict';

    // Pass these methods through to the console if they exist, otherwise just
    // fail gracefully. These methods are provided for convenience.
    var console_methods = 'assert clear count debug dir dirxml exception group groupCollapsed groupEnd info log profile profileEnd table time timeEnd trace warn'.split(' ')
        ,	idx = console_methods.length
        ,	noop = function(){};

    while (--idx >= 0)
    {
        var method = console_methods[idx];

        if (typeof console[method] === 'undefined')
        {
            console[method] = noop;
        }
    }

    if (typeof console.memory === 'undefined')
    {
        console.memory = {};
    }

    _.each({'log': 'DEBUG', 'info': 'AUDIT', 'error': 'EMERGENCY', 'warn': 'ERROR'}, function (value, key)
    {
        console[key] = function ()
        {
            nlapiLogExecution(value, arguments.length > 1 ? arguments[0] : '', arguments.length > 1 ? arguments[1] : arguments[0] || 'null' );
        };
    });

    _.extend(console, {

        timeEntries: []

        ,	time: function (text)
        {
            if (typeof text === 'string')
            {
                console.timeEntries[text] = Date.now();
            }
        }

        ,	timeEnd: function (text)
        {
            if (typeof text === 'string')
            {
                if (!arguments.length)
                {
                    console.warn('TypeError:', 'Not enough arguments');
                }
                else
                {
                    if (typeof console.timeEntries[text] !== 'undefined')
                    {
                        console.log(text + ':', Date.now() - console.timeEntries[text] + 'ms');
                        delete console.timeEntries[text];
                    }
                }
            }
        }
    });
}());
// Backbone.Events
// -----------------
// A module that can be mixed in to *any object* in order to provide it with
// custom events. You may bind with `on` or remove with `off` callback functions
// to an event; trigger`-ing an event fires all callbacks in succession.
//
//     var object = {};
//     _.extend(object, Events);
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');

var slice = Array.prototype.slice
// Regular expression used to split event strings
    ,	eventSplitter = /\s+/;

var Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {
        'use strict';

        var calls, event, node, tail, list;

        if (!callback)
        {
            return this;
        }

        events = events.split(eventSplitter);
        calls = this._callbacks || (this._callbacks = {});

        // Create an immutable callback list, allowing traversal during
        // modification.  The tail is an empty object that will always be used
        // as the next node.
        while (!!(event = events.shift())) {
            list = calls[event];
            node = list ? list.tail : {};
            node.next = tail = {};
            node.context = context;
            node.callback = callback;
            calls[event] = {tail: tail, next: list ? list.next : node};
        }

        return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
        'use strict';
        var event, calls, node, tail, cb, ctx;

        // No events, or removing *all* events.
        if (!(calls = this._callbacks))
        {
            return;
        }

        if (!(events || callback || context)) {
            delete this._callbacks;
            return this;
        }

        // Loop through the listed events and contexts, splicing them out of the
        // linked list of callbacks if appropriate.
        events = events ? events.split(eventSplitter) : _.keys(calls);
        while (!!(event = events.shift())) {
            node = calls[event];
            delete calls[event];

            if (!node || !(callback || context))
            {
                continue;
            }

            // Create a new list, omitting the indicated callbacks.
            tail = node.tail;
            while ((node = node.next) !== tail) {
                cb = node.callback;
                ctx = node.context;
                if ((callback && cb !== callback) || (context && ctx !== context)) {
                    this.on(event, cb, ctx);
                }
            }
        }

        return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
        'use strict';

        var event, node, calls, tail, args, all, rest;
        if (!(calls = this._callbacks))
        {
            return this;
        }
        all = calls.all;
        events = events.split(eventSplitter);
        rest = slice.call(arguments, 1);

        // For each event, walk through the linked list of callbacks twice,
        // first to trigger the event, then to trigger any `"all"` callbacks.
        while (!!(event = events.shift())) {
            if (!!(node = calls[event])) {
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, rest);
                }
            }
            if (!!(node = all)) {
                tail = node.tail;
                args = [event].concat(rest);
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, args);
                }
            }
        }

        return this;
    }
};

// Aliases for backwards compatibility.
Events.bind = Events.on;
Events.unbind = Events.off;


var Application = _.extend({

    originalModels: {}

    , extendedModels: {}

    , init: function () {
    }
    , wrapFunctionWithEvents: function (methodName, thisObj, fn) {
        'use strict';

        return _.wrap(fn, function (func) {
            // Gets the arguments passed to the function from the execution code (removes func from arguments)
            var args = _.toArray(arguments).slice(1);

            // Fires the 'before:ObjectName.MethodName' event most common 'before:Model.method'
            Application.trigger.apply(Application, ['before:' + methodName, thisObj].concat(args));

            // Executes the real code of the method
            var result = func.apply(thisObj, args);

            // Fires the 'before:ObjectName.MethodName' event adding result as 1st parameter
            Application.trigger.apply(Application, ['after:' + methodName, thisObj, result].concat(args));

            // Returns the result from the execution of the real code, modifications may happend in the after event
            return result;
        });
    }

    , defineModel: function (name, definition) {
        'use strict';

        Application.originalModels[name] = definition;
    }

    , pushToExtendedModels: function (name) {
        'use strict';

        var model = {};

        _.each(Application.originalModels[name], function (value, key) {
            if (typeof value === 'function') {
                model[key] = Application.wrapFunctionWithEvents(name + '.' + key, model, value);
            }
            else {
                model[key] = value;
            }
        });

        if (!model.validate) {
            model.validate = Application.wrapFunctionWithEvents(name + '.validate', model, function (data) {
                if (this.validation) {
                    var validator = _.extend({
                            validation: this.validation
                            , attributes: data
                        }, Backbone.Validation.mixin)

                        , invalidAttributes = validator.validate();

                    if (!validator.isValid()) {
                        throw {
                            status: 400
                            , code: 'ERR_BAD_REQUEST'
                            , message: invalidAttributes
                        };
                    }
                }
            });
        }

        Application.extendedModels[name] = model;
    }

    , extendModel: function (name, extensions) {
        'use strict';

        if (Application.originalModels[name]) {
            if (!Application.extendedModels[name]) {
                Application.pushToExtendedModels(name);
            }

            var model = Application.extendedModels[name];

            _.each(extensions, function (value, key) {
                if (typeof value === 'function') {
                    model[key] = Application.wrapFunctionWithEvents(name + '.' + key, model, value);
                }
                else {
                    model[key] = value;
                }
            });
        }
        else {
            throw nlapiCreateError('APP_ERR_UNKNOWN_MODEL', 'The model ' + name + ' is not defined');
        }
    }

    , getModel: function (name) {
        'use strict';

        if (Application.originalModels[name]) {
            if (!Application.extendedModels[name]) {
                Application.pushToExtendedModels(name);
            }

            return Application.extendedModels[name];
        }
        else {
            throw nlapiCreateError('APP_ERR_UNKNOWN_MODEL', 'The model ' + name + ' is not defined');
        }

    }

    ,	sendContent: function (content, options)
    {
        'use strict';

        // Default options
        options = _.extend({status: 200, cache: false}, options || {});

        // Triggers an event for you to know that there is content being sent
        Application.trigger('before:Application.sendContent', content, options);

        // We set a custom status
        response.setHeader('Custom-Header-Status', parseInt(options.status, 10).toString());

        // The content type will be here
        var content_type = false;

        // If its a complex object we transform it into an string
        if (_.isArray(content) || _.isObject(content))
        {
            content_type = 'JSON';
            content = JSON.stringify( content );
        }

        // If you set a jsonp callback this will honor it
        if (request.getParameter('jsonp_callback'))
        {
            content_type = 'JAVASCRIPT';
            content = request.getParameter('jsonp_callback') + '(' + content + ');';
        }

        //Set the response chache option
        if (options.cache)
        {
            response.setCDNCacheable(options.cache);
        }

        // Content type was set so we send it
        content_type && response.setContentType(content_type);

        response.write(content);

        Application.trigger('after:Application.sendContent', content, options);
    }

    ,	processError: function (e)
    {
        'use strict';

        var status = 500
            ,	code = 'ERR_UNEXPECTED'
            ,	message = 'error';

        if (e instanceof nlobjError)
        {
            code = e.getCode();
            message = e.getDetails();
        }
        else if (_.isObject(e) && !_.isUndefined(e.status))
        {
            status = e.status;
            code = e.code;
            message = e.message;
        }
        else
        {
            var error = nlapiCreateError(e);
            code = error.getCode();
            message = (error.getDetails() !== '') ? error.getDetails() : error.getCode();
        }

        if (status === 500 && code === 'INSUFFICIENT_PERMISSION')
        {
            status = forbiddenError.status;
            code = forbiddenError.code;
            message = forbiddenError.message;
        }

        var content = {
            errorStatusCode: parseInt(status,10).toString()
            ,	errorCode: code
            ,	errorMessage: message
        };

        if (e.errorDetails)
        {
            content.errorDetails = e.errorDetails;
        }

        return content;
    }

    ,	sendError: function (e)
    {
        'use strict';

        Application.trigger('before:Application.sendError', e);

        var content = Application.processError(e)
            ,	content_type = 'JSON';

        response.setHeader('Custom-Header-Status', content.errorStatusCode);

        if (request.getParameter('jsonp_callback'))
        {
            content_type = 'JAVASCRIPT';
            content = request.getParameter('jsonp_callback') + '(' + JSON.stringify(content) + ');';
        }
        else
        {
            content = JSON.stringify(content);
        }

        response.setContentType(content_type);

        response.write(content);

        Application.trigger('after:Application.sendError', e);
    }

}, Events);



/// Default error objetcs
var unauthorizedError = {
        status: 401
        ,	code: 'ERR_USER_NOT_LOGGED_IN'
        ,	message: 'Not logged In'
    }

    ,	forbiddenError = {
        status: 403
        ,	code: 'ERR_INSUFFICIENT_PERMISSIONS'
        ,	message: 'Insufficient permissions'
    }

    ,	notFoundError = {
        status: 404
        ,	code: 'ERR_RECORD_NOT_FOUND'
        ,	message: 'Not found'
    }

    ,	methodNotAllowedError = {
        status: 405
        ,	code: 'ERR_METHOD_NOT_ALLOWED'
        ,	message: 'Sorry, You are not allowed to preform this action.'
    }

    ,	invalidItemsFieldsAdvancedName = {
        status: 500
        ,	code:'ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME'
        ,	message: 'Please check if the fieldset is created.'
    };


var SC = SC || {};
SC.Configuration = SC.Configuration || {};
SC.Configuration.Efficiencies = SC.Configuration.Efficiencies || {};

/* PSG ECOMMERCE translate function (found in fronted code) in a single file to be used in non web contexts
Only difference is this one requires the dictionary. This can be changed using _.partial */

function translate (dictionary,text)
{
    if (!text)
    {
        return '';
    }

    text = text.toString();
    // Turns the arguments object into an array
    var args = Array.prototype.slice.call(arguments)

    // Checks the translation table
        ,	result = dictionary && dictionary[text] ? dictionary[text] : text;

    if (args.length && result)
    {
        // Mixes in inline variables
        result = result.format.apply(result, args.slice(2));
    }

    return result;
}

(function ()
{
    'use strict';

    String.prototype.format = function ()
    {
        var args = arguments;

        return this.replace(/\$\((\d+)\)/g, function (match, number)
        {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };

})();
/* PSG ECOMMERCE formatCurrency (found in commons.js) in a single file to be used in non web contexts */

function formatCurrency (value, symbol, settings)
{
    'use strict';
    var value_float = parseFloat(value);

    if (isNaN(value_float))
    {
        value_float = parseFloat(0); //return value;
    }

    var negative = value_float < 0;
    value_float = Math.abs(value_float);
    value_float = parseInt((value_float + 0.005) * 100, 10) / 100;

    var value_string = value_float.toString()

        ,	groupseparator = ','
        ,	decimalseparator = '.'
        ,	negativeprefix = '('
        ,	negativesuffix = ')'
        ,	settings = settings || {};

    if (settings.hasOwnProperty('groupseparator'))
    {
        groupseparator = settings.groupseparator;
    }

    if (settings.hasOwnProperty('decimalseparator'))
    {
        decimalseparator = settings.decimalseparator;
    }

    if (settings.hasOwnProperty('negativeprefix'))
    {
        negativeprefix = settings.negativeprefix;
    }

    if (settings.hasOwnProperty('negativesuffix'))
    {
        negativesuffix = settings.negativesuffix;
    }

    value_string = value_string.replace('.',decimalseparator);
    var decimal_position = value_string.indexOf(decimalseparator);

    // if the string doesn't contains a .
    if (!~decimal_position)
    {
        value_string += decimalseparator + '00';
        decimal_position = value_string.indexOf(decimalseparator);
    }
    // if it only contains one number after the .
    else if (value_string.indexOf(decimalseparator) === (value_string.length - 2))
    {
        value_string += '0';
    }

    var thousand_string = '';
    for (var i = value_string.length - 1; i >= 0; i--)
    {
        //If the distance to the left of the decimal separator is a multiple of 3 you need to add the group separator
        thousand_string = (i > 0 && i < decimal_position && (((decimal_position-i) % 3) === 0) ? groupseparator : '') + value_string[i] + thousand_string;
    }

    if (!symbol)
    {
        symbol = '$';
    }

    value_string  = symbol + thousand_string;

    return negative ? (negativeprefix + value_string + negativesuffix) : value_string;
}
/*
Basic contact operations:
Get contacts by customer
Find if a customer already has a contact with an email
Add a contact to a customer if there is no already one with that email.
Add a contact
 */
Application.defineModel('Contact', {
    record: 'contact',
    filters: {
        base: [ {fieldName:'isinactive', operator:'is',value1: 'F'}]
    },
    columns: {
        internalid: { fieldName:'internalid'},
        firstname: { fieldName: 'firstname'},
        lastname: { fieldName: 'lastname'},
        email: { fieldName: 'email'},
        company: {fieldName: 'company'}
    },
    fieldsets: {
        basic: []
    },
    getByCustomer: function(customerId) {

        var search = new SearchHelper(this.record,this.filters.base,this.columns,this.fieldsets.basic);
        search.addFilter({fieldName:'company', operator:'anyof',value1: customerId});

        return search.search().getResults();

    },
    customerHasContactEmail: function(customerId,contactEmail) {

        var search = new SearchHelper(this.record,this.filters.base,this.columns,this.fieldsets.basic);
        search.addFilter({fieldName:'company', operator:'anyof',value1: customerId});
        search.addFilter({fieldName:'email', operator:'is',value1: contactEmail});

        return search.search().getResults();

    },
    addIfNotExists: function(data)
    {
        var search = new SearchHelper(this.record,this.filters.base,this.columns,this.fieldsets.basic);
        search.addFilter({fieldName:'company', operator:'anyof',value1: data.company});
        search.addFilter({fieldName:'email', operator:'is',value1: data.email});

        var results = search.search().getResults();
        if(!results || results.length === 0)
        {
            this.mantainContact(data)
        }

    },
    mantainContact: function (data) {

        var contact,
            isEdit = !!data.internalid,
            contactId;

        if (isEdit) {
            contact = nlapiLoadRecord('contact', data.internalid);
        } else {
            contact = nlapiCreateRecord('contact');
            contact.setFieldValue('entityid', data.firstname + ' ' + data.lastname);
        }

        _.each(data, function(value,key){
            contact.setFieldValue(key,value);
        });


        contactId = nlapiSubmitRecord(contact);

        if (!isEdit)
        {
            nlapiAttachRecord('contact', contactId, 'customer', data.company);
        }

        return contactId;
    }
});

/**
 * Created by pzignani on 21/10/2014.
 * Given a search result from SearchHelper, with an item property, an item column, an item property, and the item type property,
 * grabs the results and appends ITEMS (order-fieldset complete items, in frontend expected format)
 * Record: is the record from where the search comes from
 * RecordItemColumn: the column name where the item is linked
 * ResultItemProperty: on the results, the property id where the itemid resides
 * ResultItemTypeProperty: on the results, the property id where the item type resides
 */
function ItemsResultHelper (record, recordItemColumn,resultItemProperty,resultItemTypeProperty)
{
    'use strict';
    this.record = record;
    this.recordItemColumn = recordItemColumn;
    this.resultItemProperty = resultItemProperty;
    this.resultItemTypeProperty = resultItemTypeProperty;
}

ItemsResultHelper.prototype.processResults = function(results){

    var self = this,
        storeItemModel = Application.getModel('StoreItem'),
        items_to_preload = [];

    _.each(results, function(result){
        items_to_preload.push({
            id: result[self.resultItemProperty],
            type: result[self.resultItemTypeProperty]
        });
    });

    storeItemModel.preloadItems(items_to_preload);

    _.each(results, function(result)
    {
        var itemStored = storeItemModel.get(result[self.resultItemProperty], result[self.resultItemTypeProperty]);
        var itemsToQuery = [];


        if (!itemStored || typeof itemStored.itemid === 'undefined')
        {
            itemsToQuery.push({
                id: result[self.resultItemProperty],
                type: result[self.resultItemTypeProperty]
            });
        }
        else
        {
            _.extend(result, {item: itemStored});
            delete result.itemType;
        }
    });



};
/* Same concept as SearchHelper but for records that sadly have to be loaded whole to get correct info
* Try to avoid it's use
* */

function RecordHelper (record, fields, fieldset) {
    'use strict';
    this.setRecord(record);
    this.setFields(fields);
    this.setFieldset(fieldset);
}


RecordHelper.prototype.setFieldset = function (fieldset)
{
    'use strict';
    this._fieldset = _.clone(fieldset);
    return this;
};

RecordHelper.prototype.setFields = function (value)
{
    'use strict';
    this._fields = _.clone(value);
    return this;
};


RecordHelper.prototype.addField = function (value)
{
    'use strict';
    this._fields = this._fields || [];
    this._fields.push(value);
    return this;
};


RecordHelper.prototype.setRecord = function (value)
{
    'use strict';
    this._record = value;
    return this;
};

RecordHelper.prototype.getResult = function ()
{
    'use strict';
    return this._lastResult && this._lastResult.length === 1 && this._lastResult[0];
};

RecordHelper.prototype.getResults = function ()
{
    'use strict';
    return this._lastResult;
};

RecordHelper.prototype._mapResult = function (list)
{
    'use strict';

    var self = this,
        props = _.clone(this._fields);

    return (list && list.length && _.map(list, function (record)
        {

            var ret = _.reduce(props, function (o, v, k)
            {

                //Not in fieldset, move along
                if(self._fieldset && !_.contains(self._fieldset,k)){
                    return o;
                }

                switch(v.type)
                {
                    case 'listrecordToObject':
                    case 'file':
                    case 'object':
                        o[k] = {
                            internalid: record.getFieldValue(v.fieldName),
                            name: record.getFieldText(v.fieldName)
                        };

                        break;
                    case 'getText':
                    case 'text':
                        o[k] = record.getFieldText(v.fieldName);
                        break;

                    //case 'getValue':
                    default:
                        o[k] = record.getFieldValue(v.fieldName);
                        break;
                }

                if (v.applyFunction)
                {
                    o[k] = v.applyFunction(record, v, k);
                }

                return o;
            }, {});
            ret.internalid = record.getId() + '';
            return ret;
        })) || [];
};


RecordHelper.prototype.get = function(id){
    this.search([id]);
};

RecordHelper.prototype.getRecord = function(id){
    return this._lastResultRecords[id];
}

RecordHelper.prototype.search = function (ids)
{
    'use strict';

    var self = this;
    var results = [];
    this._lastResultRecords = [];


    _.each(ids, function(id){
        if(_.isObject(id)){

            var temp = nlapiLoadRecord(id.type, id.id);
        } else {
            var temp = nlapiLoadRecord(self._record, id); //Cheating for "subclasses" like items heh.
        }
        results.push(temp);
        self._lastResultRecords[temp.getId()] = temp;

    });

    this._lastResult = this._mapResult(results);


    return this;
};
/* global nlapiCreateSearch:false */
function SearchHelper (record, filters, columns, fieldset, results_per_page,page,sort,sortOrder)
{
    'use strict';
    this.setRecord(record);
    this.setFilters(filters);
    this.setColumns(columns);
    this.setFieldset(fieldset);
    this.setResultsPerPage(results_per_page);
    this.setPage(page);
    this.setSort(sort);
    this.setSortOrder(sortOrder);
}

SearchHelper.prototype.setSort = function (sort)
{
    'use strict';
    this._sortField = sort;
    return this;
};

SearchHelper.prototype.setSortOrder = function (sortOrder)
{
    'use strict';
    this._sortOrder = sortOrder;
    return this;
};

SearchHelper.prototype.setResultsPerPage = function (results_per_page)
{
    'use strict';
    this.results_per_page = results_per_page;
    return this;
};
SearchHelper.prototype.setPage = function (page)
{
    'use strict';
    this.page = page;
    return this;
};

SearchHelper.prototype.setFieldset = function (fieldset)
{
    'use strict';
    this._fieldset = _.clone(fieldset);
    return this;
};

SearchHelper.prototype.setColumns = function (value)
{
    'use strict';
    this._columns = _.clone(value);
    return this;
};

SearchHelper.prototype.setFilters = function (value)
{
    'use strict';
    this._filters = _.clone(value);
    return this;
};

SearchHelper.prototype.addFilter = function (value)
{
    'use strict';
    this._filters = this._filters || [];
    this._filters.push(value);
    return this;
};

SearchHelper.prototype.addColumn = function (value)
{
    'use strict';
    this._columns = this._columns || [];
    this._columns.push(value);
    return this;
};

SearchHelper.prototype.setRecord = function (value)
{
    'use strict';
    this._record = value;
    return this;
};

SearchHelper.prototype.getResult = function ()
{
    'use strict';
    return this._lastResult && this._lastResult.length === 1 && this._lastResult[0];
};

SearchHelper.prototype.getResults = function ()
{
    'use strict';
    return this._lastResult;
};

SearchHelper.prototype.getResultsForListHeader = function ()
{
    'use strict';

    return {
        page: this.page,
        recordsPerPage: this.results_per_page,
        records: this._lastResult,
        totalRecordsFound: this.totalRecordsFound,
        order: this._sortOrder === 'desc'? -1 : 1,
        sort: this._sortField
    };
};

SearchHelper.prototype.getColumns = function ()
{
    'use strict';
    var self = this;
    return _.compact(_.map(this._columns, function (v,k)
    {
        //fieldset column limit
        if(self._fieldset && !_.contains(self._fieldset,k)){
            return null;
        }

        var column = new nlobjSearchColumn(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);



        if (v.sort || self._sortField === k)
        {

            if(v.sort)
            {
                column.setSort(v.sort === 'desc');
            }
            else if (self._sortField === k)
            {
                column.setSort(self._sortOrder === 'desc');
            }
        }
        if (v.formula)
        {
            column.setFormula(v.formula);
        }
        return column;
    }));

};

SearchHelper.prototype._mapResult = function (list)
{
    'use strict';

    var self = this,
        props = _.clone(this._columns);

    return (list && list.length && _.map(list, function (line)
    {
        return _.reduce(props, function (o, v, k)
        {

            //Not in fieldset, move along
            if(self._fieldset && !_.contains(self._fieldset,k)){
                return o;
            }

            switch(v.type)
            {
                case 'listrecordToObject':
                case 'file':
                case 'object':
                    o[k] = {
                        internalid: line.getValue(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null),
                        name: line.getText(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null)
                    };

                    break;
                case 'getText':
                case 'text':
                    o[k] = line.getText(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);
                    break;

                //case 'getValue':
                default:
                    o[k] = line.getValue(v.fieldName, v.joinKey ? v.joinKey : null, v.summary ? v.summary : null);
                    break;
            }

            if (v.applyFunction)
            {
                o[k] = v.applyFunction(line, v, k);
            }

            return o;
        }, {});
    })) || [];
};

SearchHelper.prototype.getFilters = function ()
{
    'use strict';

    return _.map(this._filters || [], function (f)
    {
        var filter = new nlobjSearchFilter(f.fieldName, f.joinKey ? f.joinKey : null, f.operator, f.value1 ? f.value1 : null, f.value2 ? f.value2 : null);
        if(f.summary){
            filter.setSummaryType(f.summary);
        };
        return filter;
    }) || [];
};

SearchHelper.prototype.searchRange = function (from, to)
{
    'use strict';
    var search = nlapiCreateSearch(this._record, this.getFilters(), this.getColumns())
    var results = search.runSearch();
    this._lastResult = this._mapResult(results.getResults(from, to));


    return this;
};

SearchHelper.prototype.search = function ()
{
    'use strict';
    var columns = this.getColumns(),
        filters = this.getFilters();

    if(!this.results_per_page)
    {
        this._lastResult = this._mapResult(this._getAllSearchResults(this._record, filters, columns));
    } else
    {
        this.page = this.page || 1;
        var results = this._getPaginatedSearchResults(this._record, filters, columns,this.results_per_page,this.page);
        this._lastResult = this._mapResult(results.records);
        this.totalRecordsFound = results.totalRecordsFound;
    }

    return this;
};

SearchHelper.prototype._searchUnion = function (target, array)
{
    'use strict';
    return target.concat(array);
};

SearchHelper.prototype._getPaginatedSearchResults = function(record_type,filters,columns,results_per_page,page,column_count){

    'use strict';

    var range_start = (page * results_per_page) - results_per_page,
        range_end = page * results_per_page,
        do_real_count = _.any(columns, function (column)
        {
            return column.getSummary();
        }),
        result = {
            page: page,
            recordsPerPage: results_per_page,
            records: []
        };

    if (!do_real_count || column_count)
    {
        var _column_count = column_count || new nlobjSearchColumn('internalid', null, 'count'),
            count_result = nlapiSearchRecord(record_type, null, filters, [_column_count]);

        result.totalRecordsFound = parseInt(count_result[0].getValue(_column_count), 10);
    }

    if (do_real_count || (result.totalRecordsFound > 0 && result.totalRecordsFound > range_start))
    {
        var search = nlapiCreateSearch(record_type, filters, columns).runSearch();
        result.records = search.getResults(range_start, range_end);

        if (do_real_count && !column_count)
        {
            result.totalRecordsFound = search.getResults(0, 1000).length;
        }
    }

    return result;

};
SearchHelper.prototype._getAllSearchResults = function (record_type, filters, columns)
{
    'use strict';
    var search = nlapiCreateSearch(record_type, filters, columns);
    search.setIsPublic(true);

    var searchRan = search.runSearch(),
        bolStop = false,
        intMaxReg = 1000,
        intMinReg = 0,
        result = [];

    while (!bolStop && nlapiGetContext().getRemainingUsage() > 10)
    {
        // First loop get 1000 rows (from 0 to 1000), the second loop starts at 1001 to 2000 gets another 1000 rows and the same for the next loops
        var extras = searchRan.getResults(intMinReg, intMaxReg);

        result = this._searchUnion(result, extras);
        intMinReg = intMaxReg;
        intMaxReg += 1000;
        // If the execution reach the the last result set stop the execution
        if (extras.length < 1000)
        {
            bolStop = true;
        }
    }

    return result;
};

var ActionToken = function (keys,timeInMinutes){
    this.keys = _.clone(keys);
    this.time = timeInMinutes;
};

ActionToken.prototype.generate =  function(data){

    var encrypted_data = nlapiEncrypt(
        this.keys.AESMESSAGE.replace('{{timestamp}}',new Date().getTime())
            .replace('{{random}}',Math.random())
            .replace('{{user_id}}',nlapiGetUser())
            .replace('{{random2}}',Math.random())
            .replace('{{resource}}',JSON.stringify(data)),
        'aes', this.keys.AESKEY);

    var resourceHashed = nlapiEncrypt(this.keys.SHA1KEY.replace('{{resource}}',JSON.stringify(data)).replace('{{user_id}}',nlapiGetUser()),'sha1');

    return {
        signature: resourceHashed,
        data: encrypted_data
    };

    return url;
};

ActionToken.prototype.read = function(data){
    var ts = data.data;
    var r = data.signature;
    var now = new Date();


    if(!ts || !r){
        throw nlapiCreateError('ERR_SL_COM', 'Need params',false);
    }

    var tsArray = nlapiDecrypt(ts, 'aes', this.keys.AESKEY).split('::'),
        timestamp = tsArray[1],
        user_id = tsArray[3],
        data = tsArray[5],
        ssp_request_date = new Date(parseInt(timestamp,10)),
        diffInMinutes = (now.valueOf() - ssp_request_date.valueOf())/1000/60,
        key = this.keys.SHA1KEY.replace('{{resource}}',data).replace('{{user_id}}',user_id),
        hash = nlapiEncrypt(key,'sha1');

    // SECURITY VALIDATIONS
    if( hash !== r){
        throw nlapiCreateError('ERR_SL_COM', 'Invalid call');
    }

    // TIME VALIDATIONS
    if(isNaN(diffInMinutes) ||  diffInMinutes > this.time){
        throw nlapiCreateError('ERR_SL_COM', 'Action expired',false);
    }

    if(!user_id || !data){
        throw nlapiCreateError('ERR_SL_COM', 'Invalid call',false);
    }
    try {
        nlapiLogExecution('ERROR', 'data', data);
        var dataJSON = JSON.parse(data)
    } catch(e){
        throw nlapiCreateError('ERR_SL_COM', 'Invalid data',false);
    }

    return {
        userId: user_id,
        data: dataJSON
    };
}

