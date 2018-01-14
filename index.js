'use strict';
const isPrimitiveValue = (value) => (
    value === null ||
    typeof value !== 'object' ||
    value instanceof Boolean ||
    value instanceof Date ||
    value instanceof Number ||
    value instanceof RegExp ||
    value instanceof String
);

JSON.encodeCirculars = (obj) => {
    const walkObject = (currentValue) => {
        const replaceCircular = (val, key) => {
            const circularObjectPath = map.get(val);

            if (circularObjectPath) {
                return { $ref: circularObjectPath };
            } else if (typeof val === 'object') {
                map.set(val, `${map.get(currentValue)}.${key}`);
                return walkObject(val);
            }

            return val;
        };

        if (Array.isArray(currentValue)) {
            return currentValue.map(replaceCircular);
        } else if (!isPrimitiveValue(obj)) {
            const copy = Object.assign({}, currentValue);
            Object.keys(currentValue).forEach((key) => {
                const val = currentValue[key];
                copy[key] = replaceCircular(val, key);
            });

            return copy;
        }

        return currentValue;
    };

    if (isPrimitiveValue(obj)) {
        return obj;
    }

    const map = new WeakMap();

    map.set(obj, '$');

    return walkObject(obj);
};

JSON.decodeCirculars = function (encodedObj) {
    const walkObject = (currentValue) => {
        const replaceRef = (val, key) => {
            const ref = val.$ref;

            if (ref) {
                if (ref === '$') {
                    currentValue[key] = encodedObj;
                } else {
                    const pathParts = ref.split('.');

                    const referencedObj = pathParts.reduce((acc, val, i) => {
                        if (i === 0) return acc;

                        return acc[val];
                    }, encodedObj);

                    currentValue[key] = referencedObj;
                }
            } else {
                walkObject(val);
            }
        };

        if (Array.isArray(currentValue)) {
            return currentValue.map(replaceRef);
        } else if (!isPrimitiveValue(currentValue)) {
            Object.keys(currentValue).forEach((key) => {
                const val = currentValue[key];

                if (typeof val === 'object') {
                    replaceRef(val, key);
                }
            });
        }
    };

    if (!isPrimitiveValue(encodedObj)) {
        walkObject(encodedObj);
    }

    return encodedObj;
};
