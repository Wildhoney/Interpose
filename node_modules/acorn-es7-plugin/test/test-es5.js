'use strict';
/* Simple test script that doesn't need mocha or similar - it just parses stuff and checks the returned AST */
var acorn = require('acorn');
var colors = require('colors');
require('../')(acorn);
function parse(code, pluginOptions) {
    if (Array.isArray(code)) {
        code = code.join('\n');
    }
    return acorn.parse(code, {
        sourceType: 'module',
        ecmaVersion: 7,
        locations: true,
        ranges: true,
        plugins: {
            asyncawait: pluginOptions || {}
        }
    });
}

function isIdentThenFnDecl(ast) {
    return ast.body[0].type === 'ExpressionStatement' && ast.body[0].expression.type === 'Identifier' && ast.body[0].expression.name === 'async' && !ast.body[1].async === true && ast.body[1].type == "FunctionDeclaration";
}

function isAsyncFnDecl(ast) {
    return ast.body[0].async === true && ast.body[0].type == "FunctionDeclaration";
}

function isExprType(type) {
    return function (ast) {
        return ast.body[0].type === 'ExpressionStatement' && ast.body[0].expression.type === type;
    };
}

var tests = [{
    desc: "Simple async function",
    code: "async function x() { return undefined; }",
    pass: function (ast) {
        return ast.body[0].async === true;
    }
},{
    desc: "Await in async is AwaitExpression",
    code: "async function x() { await(undefined); await undefined ; }",
    pass: function (ast) {
        return ast.body[0].body.body[0].expression.type === 'AwaitExpression' && ast.body[0].body.body[1].expression.type === 'AwaitExpression';
    }
},{
    desc: "Await in function is identifier",
    code: "function x() { await(undefined); }",
    pass: function (ast) {
        return ast.body[0].body.body[0].expression.callee.name === 'await';
    }
},{
    desc: "Async method",
    code: "var a = {async x(){}}",
    pass: function (ast) {
        return ast.body[0].declarations[0].init.properties[0].value.async;
    }
},{
    desc: "Async get method",
    code: "var a = {async get x(){}}",
    pass: function (ast) {
        return ast.body[0].declarations[0].init.properties[0].value.async;
    }
},{
    desc: "Async arrow",
    code: "var a = async()=>0",
    pass: function (ast) {
        return ast.body[0].declarations[0].init.async;
    }
},{
    desc: "Async set method fails",
    code: "var a = {async set x(){}}",
    pass: function (ex) {
        return ex === "'set <member>(value)' cannot be be async (1:15)";
    }
},{
    desc: "Async constructor fails",
    code: "var a = {async constructor(){}}",
    pass: function (ex) {
        return ex === "'constructor()' cannot be be async (1:15)";
    }
},{
    desc: "Await declaration fails in async function",
    code: "async function x() { var await; }",
    pass: function (ex) {
        return ex === "'await' is reserved within async functions (1:25)";
    }
},{
    desc: "Await function declaration fails in async function",
    code: "async function x() { function await() {} }",
    pass: function (ex) {
        return ex === "'await' is reserved within async functions (1:30)";
    }
},{
    desc: "Await reference fails in async function",
    code: "async function x() { return 1+await; }",
    pass: function (ex) {
        return ex === "Unexpected token (1:35)";
    }
},{
    desc: "{code} is an async FunctionDeclaration",
    code: "async /* a */ function x(){}",
    pass: isAsyncFnDecl
},{
    desc: "{code} is a reference to 'async' and a sync FunctionDeclaration",
    code: "async /*\n*/function x(){}",
    pass: isIdentThenFnDecl
},{
    desc: "{code} is a reference to 'async' and a sync FunctionDeclaration",
    code: "async /* a */\nfunction x(){}",
    pass: isIdentThenFnDecl
},{
    desc: "{code} is a reference to 'async' and a sync FunctionDeclaration",
    code: "async\nfunction x(){}",
    pass: isIdentThenFnDecl
},{
    desc: "{code} is a reference to 'async' and a sync FunctionDeclaration",
    code: "async //\nfunction x(){}",
    pass: isIdentThenFnDecl
},{
    desc: "{code} is a reference to 'async' and a sync FunctionDeclaration",
    code: "async /*\n*/\nfunction x(){}",
    pass: isIdentThenFnDecl
},{
    /* Valid combinations of await options; none, just inAsyncFunction, or just awaitAnywhere */
    desc: "{code} is an AwaitExpression when inAsyncFunction option is true",
    code: "await(x)",
    options: {
        inAsyncFunction: true
    },
    pass: isExprType('AwaitExpression')
},{
    desc: "{code} is an AwaitExpression when inAsyncFunction option is true",
    code: "await x",
    options: {
        inAsyncFunction: true
    },
    pass: isExprType('AwaitExpression')
},{
    desc: "{code} is a CallExpression when awaitAnywhere option is true",
    code: "await(x)",
    options: {
        awaitAnywhere: true
    },
    pass: isExprType('CallExpression')
},{
    desc: "{code} is an AwaitExpression when awaitAnywhere option is true",
    code: "await x",
    options: {
        awaitAnywhere: true
    },
    pass: isExprType('AwaitExpression')
},{
    desc: "{code} is a CallExpression when inAsyncFunction and awaitAnywhere option are false",
    code: "await(x)",
    pass: isExprType('CallExpression')
},{
    desc: "{code} is a SyntaxError when inAsyncFunction and awaitAnywhere option are false",
    code: "await x",
    pass: function (ex) {
        return ex === "Unexpected token (1:6)";
    }
}];
var out = {
    true: "pass".green,
    false: "fail".red
};
var testNumber = +process.argv[2] || 0;
if (testNumber) {
    tests = [tests[testNumber - 1]];
} else {
    testNumber += 1;
}
var results = {
    true: 0,
    false: 0
};
tests.forEach(function (test, idx) {
    var code = test.code.replace(/\n/g, ' <linefeed> ');
    var desc = test.desc.replace('{code}', code.yellow);
    var pass = function () {
        var p = test.pass.apply(this, arguments);
        results[p] += 1;
        return p;
    };
    try {
        console.log(idx + testNumber + ")\t", desc, out[pass(parse(test.code, test.options))]);
    } catch (ex) {
        console.log(idx + testNumber + ")\t", desc, ex.message.cyan, out[pass(ex.message)]);
    }
});
console.log('');
if (results.true) 
    console.log((results.true + " of " + tests.length + " tests passed").green);
if (results.false) 
    console.log((results.false + " of " + tests.length + " tests failed").red);

