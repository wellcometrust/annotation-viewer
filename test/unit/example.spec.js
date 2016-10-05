'use strict';
var test = require('tape');
import { Example } from '../../src/js/components/example.js';

test("Example module greets as expected", (t) => {
    let expected = 'Hello world';
    let testExample = new Example('world');
    let result = testExample.sayHello();

    t.equal(result, expected, `${result} should equal ${expected}`);
    t.end();
});

test("Example module says goodbye as expected", (t) => {
    let expected = 'Goodbye world';
    let testExample = new Example('world');
    let result = testExample.sayGoodbye();

    t.equal(result, expected, `${result} should equal ${expected}`);
    t.end();
});