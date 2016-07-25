/**
 * power-assert-renderers.js - Power Assert output renderers
 *
 * https://github.com/twada/power-assert-renderers
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/power-assert-renderers/blob/master/MIT-LICENSE.txt
 */

'use strict';

module.exports = {
    FileRenderer: require('power-assert-renderer-file'),
    AssertionRenderer: require('power-assert-renderer-assertion'),
    DiagramRenderer: require('power-assert-renderer-diagram'),
    BinaryExpressionRenderer: require('power-assert-renderer-comparison'),
    SuccinctRenderer: require('power-assert-renderer-succinct')
};
