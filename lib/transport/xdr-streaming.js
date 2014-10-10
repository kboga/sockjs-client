'use strict';

var util = require('util')
  , AjaxBasedTransport = require('./lib/ajax-based')
  , XhrReceiver = require('./receiver/xhr')
  , XDRObject = require('./sender/xdr')
  , origin = require('../utils/origin')
  , loc = require('../polyfills/location')
  ;

// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

function XdrStreamingTransport(transUrl) {
  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
}

util.inherits(XdrStreamingTransport, AjaxBasedTransport);

XdrStreamingTransport.enabled = function(url, info) {
  if (info && (info.cookie_needed || info.nullOrigin)) {
    return false;
  }
  // IE 8/9 if the request target uses the same scheme - #79
  return !!(global.XDomainRequest && global.document &&
    global.document.domain && origin.isSameOriginScheme(url, loc.href));
};

XdrStreamingTransport.transportName = 'xdr-streaming';
XdrStreamingTransport.roundTrips = 2; // preflight, ajax

module.exports = XdrStreamingTransport;