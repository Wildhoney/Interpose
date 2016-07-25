var NotAsync = {} ;
var asyncExit = /^async[\t ]+(return|throw)/ ;
var asyncFunction = /^async[\t ]+function/ ;
var atomOrPropertyOrLabel = /^\s*[):;]/ ;
var removeComments = /([^\n])\/\*(\*(?!\/)|[^\n*])*\*\/([^\n])/g ;

function hasLineTerminatorBeforeNext(st, since) {
    return st.lineStart >= since;
}

function test(regex,st,noComment) {
    var src = st.input.slice(st.start) ;
    if (noComment) {
        src = src.replace(removeComments,"$1 $3") ;
  }
    return regex.test(src);
}

/* Return the object holding the parser's 'State'. This is different between acorn ('this')
 * and babylon ('this.state') */
function state(p) {
    if (('state' in p) && p.state.constructor && p.state.constructor.name==='State')
        return p.state ; // Probably babylon
    return p ; // Probably acorn
}

/* Create a new parser derived from the specified parser, so that in the
 * event of an error we can back out and try again */
function subParse(parser, pos, extensions) {
    // NB: The Babylon constructor does NOT expect 'pos' as an argument, and so
    // the input needs truncation at the start position, however at present
    // this doesn't work nicely as all the node location/start/end values
    // are therefore offset. Consequently, this plug-in is NOT currently working
    // with the (undocumented) Babylon plug-in interface.
    var p = new parser.constructor(parser.options, parser.input, pos);
    if (extensions)
        for (var k in extensions)
            p[k] = extensions[k] ;

    var src = state(parser) ;
    var dest = state(p) ;
    ['inFunction','inAsyncFunction','inAsync','inGenerator','inModule'].forEach(function(k){
        if (k in src)
            dest[k] = src[k] ;
    }) ;
    p.nextToken();
    return p;
}

function asyncAwaitPlugin (parser,options){
    var es7check = function(){} ;

    parser.extend("initialContext",function(base){
        return function(){
            if (this.options.ecmaVersion < 7) {
                es7check = function(node) {
                    parser.raise(node.start,"async/await keywords only available when ecmaVersion>=7") ;
                } ;
            }
      this.reservedWords = new RegExp(this.reservedWords.toString().replace(/await|async/g,"").replace("|/","/").replace("/|","/").replace("||","|")) ;
      this.reservedWordsStrict = new RegExp(this.reservedWordsStrict.toString().replace(/await|async/g,"").replace("|/","/").replace("/|","/").replace("||","|")) ;
      this.reservedWordsStrictBind = new RegExp(this.reservedWordsStrictBind.toString().replace(/await|async/g,"").replace("|/","/").replace("/|","/").replace("||","|")) ;
            this.inAsyncFunction = options.inAsyncFunction ;
            if (options.awaitAnywhere && options.inAsyncFunction)
                parser.raise(node.start,"The options awaitAnywhere and inAsyncFunction are mutually exclusive") ;

            return base.apply(this,arguments);
        }
    }) ;

    parser.extend("shouldParseExportStatement",function(base){
        return function(){
            if (this.type.label==='name' && this.value==='async' && test(asyncFunction,state(this))) {
                return true ;
            }
            return base.apply(this,arguments) ;
        }
    }) ;

    parser.extend("parseStatement",function(base){
        return function (declaration, topLevel) {
            var st = state(this) ;
            var start = st.start;
            var startLoc = st.startLoc;
            if (st.type.label==='name') {
                if (test(asyncFunction,st,true)) {
                    var wasAsync = st.inAsyncFunction ;
                    try {
                        st.inAsyncFunction = true ;
                        this.next() ;
                        var r = this.parseStatement(declaration, topLevel) ;
                        r.async = true ;
                        r.start = start;
                        r.loc && (r.loc.start = startLoc);
                        r.range && (r.range[0] = start);
                        return r ;
                    } finally {
                        st.inAsyncFunction = wasAsync ;
                    }
                } else if ((typeof options==="object" && options.asyncExits) && test(asyncExit,st)) {
                    // NON-STANDARD EXTENSION iff. options.asyncExits is set, the
                    // extensions 'async return <expr>?' and 'async throw <expr>?'
                    // are enabled. In each case they are the standard ESTree nodes
                    // with the flag 'async:true'
                    this.next() ;
                    var r = this.parseStatement(declaration, topLevel) ;
                    r.async = true ;
                    r.start = start;
                    r.loc && (r.loc.start = startLoc);
                    r.range && (r.range[0] = start);
                   return r ;
                }
            }
            return base.apply(this,arguments);
        }
    }) ;

  parser.extend("parseIdent",function(base){
        return function(liberal){
                var id = base.apply(this,arguments);
                var st = state(this) ;
                if (st.inAsyncFunction && id.name==='await') {
                    if (arguments.length===0) {
                        this.raise(id.start,"'await' is reserved within async functions") ;
                    }
                }
                return id ;
        }
    }) ;

    parser.extend("parseExprAtom",function(base){
        return function(refShorthandDefaultPos){
            var st = state(this) ;
            var start = st.start ;
            var startLoc = st.startLoc;
            var rhs,r = base.apply(this,arguments);
            if (r.type==='Identifier') {
                if (r.name==='async' && !hasLineTerminatorBeforeNext(st, r.end)) {
                    // Is this really an async function?
                    var isAsync = st.inAsyncFunction ;
                    try {
                        st.inAsyncFunction = true ;
                        var pp = this ;
                        var inBody = false ;

                        var parseHooks = {
                            parseFunctionBody:function(node,isArrowFunction){
                                try {
                                    var wasInBody = inBody ;
                                    inBody = true ;
                                    return pp.parseFunctionBody.apply(this,arguments) ;
                                } finally {
                                    inBody = wasInBody ;
                                }
                            },
                            raise:function(){
                                try {
                                    return pp.raise.apply(this,arguments) ;
                                } catch(ex) {
                                    throw inBody?ex:NotAsync ;
                                }
                            }
                        } ;

                        rhs = subParse(this,st.start,parseHooks).parseExpression() ;
                        if (rhs.type==='SequenceExpression')
                            rhs = rhs.expressions[0] ;
                        if (rhs.type==='FunctionExpression' || rhs.type==='FunctionDeclaration' || rhs.type==='ArrowFunctionExpression') {
                            rhs.async = true ;
                            rhs.start = start;
                            rhs.loc && (rhs.loc.start = startLoc);
                            rhs.range && (rhs.range[0] = start);
                            st.pos = rhs.end;
                            this.end = rhs.end ;
                            this.endLoc = rhs.endLoc ;
                            this.next();
                            es7check(rhs) ;
                            return rhs ;
                        }
                    } catch (ex) {
                        if (ex!==NotAsync)
                            throw ex ;
                    }
                    finally {
                        st.inAsyncFunction = isAsync ;
                    }
                }
                else if (r.name==='await') {
                    var n = this.startNodeAt(r.start, r.loc && r.loc.start);
                    if (st.inAsyncFunction) {
                        rhs = this.parseExprSubscripts() ;
                        n.operator = 'await' ;
                        n.argument = rhs ;
                        n = this.finishNodeAt(n,'AwaitExpression', rhs.end, rhs.loc && rhs.loc.end) ;
                        es7check(n) ;
                        return n ;
                    } else
                        // NON-STANDARD EXTENSION iff. options.awaitAnywhere is true,
                        // an 'AwaitExpression' is allowed anywhere the token 'await'
                        // could not be an identifier with the name 'await'.

                        // Look-ahead to see if this is really a property or label called async or await
                        if (st.input.slice(r.end).match(atomOrPropertyOrLabel))
                            return r ; // This is a valid property name or label

                        if (typeof options==="object" && options.awaitAnywhere) {
                            start = st.start ;
                            rhs = subParse(this,start-4).parseExprSubscripts() ;
                            if (rhs.end<=start) {
                                rhs = subParse(this,start).parseExprSubscripts() ;
                                n.operator = 'await' ;
                                n.argument = rhs ;
                                n = this.finishNodeAt(n,'AwaitExpression', rhs.end, rhs.loc && rhs.loc.end) ;
                                st.pos = rhs.end;
                                this.end = rhs.end ;
                                this.endLoc = rhs.endLoc ;
                                this.next();
                                es7check(n) ;
                                return n ;
                            }
                        }
                }
            }
            return r ;
        }
    }) ;

    parser.extend('finishNodeAt',function(base){
            return function(node,type,pos,loc) {
                if (node.__asyncValue) {
                    delete node.__asyncValue ;
                    node.value.async = true ;
                }
                return base.apply(this,arguments) ;
            }
    }) ;

    parser.extend('finishNode',function(base){
            return function(node,type) {
                if (node.__asyncValue) {
                    delete node.__asyncValue ;
                    node.value.async = true ;
                }
                return base.apply(this,arguments) ;
            }
    }) ;

    parser.extend("parsePropertyName",function(base){
        return function (prop) {
            var st = state(this) ;
            var key = base.apply(this,arguments) ;
            if (key.type === "Identifier" && key.name === "async" && !hasLineTerminatorBeforeNext(st, key.end)) {
                // Look-ahead to see if this is really a property or label called async or await
                if (!st.input.slice(key.end).match(atomOrPropertyOrLabel)){
                    es7check(prop) ;
                    key = base.apply(this,arguments) ;
                    if (key.type==='Identifier') {
                        if (key.name==='constructor')
                            this.raise(key.start,"'constructor()' cannot be be async") ;
                        else if (key.name==='set')
                            this.raise(key.start,"'set <member>(value)' cannot be be async") ;
                    }
                    prop.__asyncValue = true ;
                }
            }
            return key;
        };
    }) ;

    parser.extend("parseClassMethod",function(base){
        return function (classBody, method, isGenerator) {
            var st, wasAsync ;
            if (method.__asyncValue) {
                st = state(this) ;
                wasAsync = st.inAsyncFunction ;
                st.inAsyncFunction = true ;
            }
            var r = base.apply(this,arguments) ;
            if (st) {
                st.inAsyncFunction = wasAsync ;
            }
            return r ;
        }
    }) ;
    
    parser.extend("parsePropertyValue",function(base){
        return function (prop, isPattern, isGenerator, startPos, startLoc, refDestructuringErrors) {
            var st, wasAsync ;
            if (prop.__asyncValue) {
                st = state(this) ;
                wasAsync = st.inAsyncFunction ;
                st.inAsyncFunction = true ;
            }
            var r = base.apply(this,arguments) ;
            if (st) {
                st.inAsyncFunction = wasAsync ;
            }
            return r ;
        }
    }) ;
}

module.exports = function(acorn) {
    acorn.plugins.asyncawait = asyncAwaitPlugin ;
    return acorn
}
