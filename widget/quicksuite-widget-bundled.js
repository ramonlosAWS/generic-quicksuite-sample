// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Generated bundle — DO NOT EDIT BY HAND.
// Produced by build-bundled.js. Edit quicksuite-widget.js and rebuild.
// Inlined Amazon QuickSight Embedding SDK v2.11.3.
//

/* ===== BEGIN vendored Amazon QuickSight Embedding SDK ===== */
/*! 
* amazon-quicksight-embedding-sdk v2.11.3
* git@github.com:awslabs/amazon-quicksight-embedding-sdk.git
* https://github.com/awslabs/amazon-quicksight-embedding-sdk
* 
* Copyright 2025 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).QuickSightEmbedding={})}(this,(function(e){"use strict";function n(e,n){(null==n||n>e.length)&&(n=e.length);for(var r=0,t=Array(n);r<n;r++)t[r]=e[r];return t}function r(e,n,r,t,i,o,a){try{var s=e[o](a),c=s.value}catch(e){return void r(e)}s.done?n(c):Promise.resolve(c).then(t,i)}function t(e){return function(){var n=this,t=arguments;return new Promise((function(i,o){var a=e.apply(n,t);function s(e){r(a,i,o,s,c,"next",e)}function c(e){r(a,i,o,s,c,"throw",e)}s(void 0)}))}}function i(e,n,r){return n=u(n),function(e,n){if(n&&("object"==typeof n||"function"==typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,p()?Reflect.construct(n,r||[],u(e).constructor):n.apply(e,r))}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function a(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,w(t.key),t)}}function s(e,n,r){return n&&a(e.prototype,n),r&&a(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function c(e,n,r){return(n=w(n))in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function u(e){return u=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},u(e)}function l(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),n&&m(e,n)}function p(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(p=function(){return!!e})()}function f(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function d(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?f(Object(r),!0).forEach((function(n){c(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function h(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r={};for(var t in e)if({}.hasOwnProperty.call(e,t)){if(n.includes(t))continue;r[t]=e[t]}return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.includes(r)||{}.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}function E(){E=function(){return n};var e,n={},r=Object.prototype,t=r.hasOwnProperty,i=Object.defineProperty||function(e,n,r){e[n]=r.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(e,n,r){return Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[n]}try{u({},"")}catch(e){u=function(e,n,r){return e[n]=r}}function l(e,n,r,t){var o=n&&n.prototype instanceof w?n:w,a=Object.create(o.prototype),s=new C(t||[]);return i(a,"_invoke",{value:R(e,r,s)}),a}function p(e,n,r){try{return{type:"normal",arg:e.call(n,r)}}catch(e){return{type:"throw",arg:e}}}n.wrap=l;var f="suspendedStart",d="suspendedYield",h="executing",m="completed",v={};function w(){}function g(){}function O(){}var _={};u(_,a,(function(){return this}));var I=Object.getPrototypeOf,A=I&&I(I(L([])));A&&A!==r&&t.call(A,a)&&(_=A);var x=O.prototype=w.prototype=Object.create(_);function T(e){["next","throw","return"].forEach((function(n){u(e,n,(function(e){return this._invoke(n,e)}))}))}function S(e,n){function r(i,o,a,s){var c=p(e[i],e,o);if("throw"!==c.type){var u=c.arg,l=u.value;return l&&"object"==typeof l&&t.call(l,"__await")?n.resolve(l.__await).then((function(e){r("next",e,a,s)}),(function(e){r("throw",e,a,s)})):n.resolve(l).then((function(e){u.value=e,a(u)}),(function(e){return r("throw",e,a,s)}))}s(c.arg)}var o;i(this,"_invoke",{value:function(e,t){function i(){return new n((function(n,i){r(e,t,n,i)}))}return o=o?o.then(i,i):i()}})}function R(n,r,t){var i=f;return function(o,a){if(i===h)throw Error("Generator is already running");if(i===m){if("throw"===o)throw a;return{value:e,done:!0}}for(t.method=o,t.arg=a;;){var s=t.delegate;if(s){var c=y(s,t);if(c){if(c===v)continue;return c}}if("next"===t.method)t.sent=t._sent=t.arg;else if("throw"===t.method){if(i===f)throw i=m,t.arg;t.dispatchException(t.arg)}else"return"===t.method&&t.abrupt("return",t.arg);i=h;var u=p(n,r,t);if("normal"===u.type){if(i=t.done?m:d,u.arg===v)continue;return{value:u.arg,done:t.done}}"throw"===u.type&&(i=m,t.method="throw",t.arg=u.arg)}}}function y(n,r){var t=r.method,i=n.iterator[t];if(i===e)return r.delegate=null,"throw"===t&&n.iterator.return&&(r.method="return",r.arg=e,y(n,r),"throw"===r.method)||"return"!==t&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+t+"' method")),v;var o=p(i,n.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,v;var a=o.arg;return a?a.done?(r[n.resultName]=a.value,r.next=n.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,v):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,v)}function b(e){var n={tryLoc:e[0]};1 in e&&(n.catchLoc=e[1]),2 in e&&(n.finallyLoc=e[2],n.afterLoc=e[3]),this.tryEntries.push(n)}function N(e){var n=e.completion||{};n.type="normal",delete n.arg,e.completion=n}function C(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(b,this),this.reset(!0)}function L(n){if(n||""===n){var r=n[a];if(r)return r.call(n);if("function"==typeof n.next)return n;if(!isNaN(n.length)){var i=-1,o=function r(){for(;++i<n.length;)if(t.call(n,i))return r.value=n[i],r.done=!1,r;return r.value=e,r.done=!0,r};return o.next=o}}throw new TypeError(typeof n+" is not iterable")}return g.prototype=O,i(x,"constructor",{value:O,configurable:!0}),i(O,"constructor",{value:g,configurable:!0}),g.displayName=u(O,c,"GeneratorFunction"),n.isGeneratorFunction=function(e){var n="function"==typeof e&&e.constructor;return!!n&&(n===g||"GeneratorFunction"===(n.displayName||n.name))},n.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,O):(e.__proto__=O,u(e,c,"GeneratorFunction")),e.prototype=Object.create(x),e},n.awrap=function(e){return{__await:e}},T(S.prototype),u(S.prototype,s,(function(){return this})),n.AsyncIterator=S,n.async=function(e,r,t,i,o){void 0===o&&(o=Promise);var a=new S(l(e,r,t,i),o);return n.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},T(x),u(x,c,"Generator"),u(x,a,(function(){return this})),u(x,"toString",(function(){return"[object Generator]"})),n.keys=function(e){var n=Object(e),r=[];for(var t in n)r.push(t);return r.reverse(),function e(){for(;r.length;){var t=r.pop();if(t in n)return e.value=t,e.done=!1,e}return e.done=!0,e}},n.values=L,C.prototype={constructor:C,reset:function(n){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(N),!n)for(var r in this)"t"===r.charAt(0)&&t.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(n){if(this.done)throw n;var r=this;function i(t,i){return s.type="throw",s.arg=n,r.next=t,i&&(r.method="next",r.arg=e),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return i("end");if(a.tryLoc<=this.prev){var c=t.call(a,"catchLoc"),u=t.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return i(a.catchLoc,!0);if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return i(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return i(a.finallyLoc)}}}},abrupt:function(e,n){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc<=this.prev&&t.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=n&&n<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=e,a.arg=n,o?(this.method="next",this.next=o.finallyLoc,v):this.complete(a)},complete:function(e,n){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&n&&(this.next=n),v},finish:function(e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),N(r),v}},catch:function(e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc===e){var t=r.completion;if("throw"===t.type){var i=t.arg;N(r)}return i}}throw Error("illegal catch attempt")},delegateYield:function(n,r,t){return this.delegate={iterator:L(n),resultName:r,nextLoc:t},"next"===this.method&&(this.arg=e),v}},n}function m(e,n){return m=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,n){return e.__proto__=n,e},m(e,n)}function v(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var t,i,o,a,s=[],c=!0,u=!1;try{if(o=(r=r.call(e)).next,0===n){if(Object(r)!==r)return;c=!1}else for(;!(c=(t=o.call(r)).done)&&(s.push(t.value),s.length!==n);c=!0);}catch(e){u=!0,i=e}finally{try{if(!c&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(u)throw i}}return s}}(e,r)||function(e,r){if(e){if("string"==typeof e)return n(e,r);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?n(e,r):void 0}}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function w(e){var n=function(e,n){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var t=r.call(e,n||"default");if("object"!=typeof t)return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)}(e,"string");return"symbol"==typeof n?n:n+""}function g(e){return g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},g(e)}var O={CALLBACK_OPERATION_INVOKED:"CALLBACK_OPERATION_INVOKED",CONTENT_LOADED:"CONTENT_LOADED",EXPERIENCE_INITIALIZED:"EXPERIENCE_INITIALIZED",ERROR_OCCURRED:"ERROR_OCCURRED",SIZE_CHANGED:"SIZE_CHANGED",PARAMETERS_CHANGED:"PARAMETERS_CHANGED",SELECTED_SHEET_CHANGED:"SELECTED_SHEET_CHANGED",MODAL_OPENED:"MODAL_OPENED",Q_SEARCH_CLOSED:"Q_SEARCH_CLOSED",Q_SEARCH_OPENED:"Q_SEARCH_OPENED",Q_SEARCH_FOCUSED:"Q_SEARCH_FOCUSED",Q_SEARCH_SIZE_CHANGED:"Q_SEARCH_SIZE_CHANGED",Q_SEARCH_ENTERED_FULLSCREEN:"Q_SEARCH_ENTERED_FULLSCREEN",Q_SEARCH_EXITED_FULLSCREEN:"Q_SEARCH_EXITED_FULLSCREEN",Q_PANEL_ENTERED_FULLSCREEN:"Q_PANEL_ENTERED_FULLSCREEN",Q_PANEL_EXITED_FULLSCREEN:"Q_PANEL_EXITED_FULLSCREEN",PAGE_NAVIGATION:"PAGE_NAVIGATION",PARAMETERS_LOADED:"PARAMETERS_LOADED"},_={FRAME_STARTED:"FRAME_STARTED",FRAME_MOUNTED:"FRAME_MOUNTED",FRAME_LOADED:"FRAME_LOADED",FRAME_REMOVED:"FRAME_REMOVED"},I={FRAME_NOT_CREATED:"FRAME_NOT_CREATED",NO_BODY:"NO_BODY",NO_CONTAINER:"NO_CONTAINER",INVALID_CONTAINER:"INVALID_CONTAINER",NO_URL:"NO_URL",INVALID_URL:"INVALID_URL",NO_FRAME_OPTIONS:"NO_FRAME_OPTIONS",INVALID_FRAME_OPTIONS:"INVALID_FRAME_OPTIONS"},A={UNRECOGNIZED_CONTENT_OPTIONS:"UNRECOGNIZED_CONTENT_OPTIONS",UNRECOGNIZED_FRAME_OPTIONS:"UNRECOGNIZED_FRAME_OPTIONS",UNRECOGNIZED_EVENT_TARGET:"UNRECOGNIZED_EVENT_TARGET"},x={SET_PARAMETERS:"SET_PARAMETERS",SET_SELECTED_SHEET_ID:"SET_SELECTED_SHEET_ID",SET_Q_SEARCH_QUESTION:"SET_Q_SEARCH_QUESTION",SET_VISUAL_ACTIONS:"SET_VISUAL_ACTIONS",SET_THEME:"SET_THEME",ADD_FILTER_GROUPS:"ADD_FILTER_GROUPS",UPDATE_FILTER_GROUPS:"UPDATE_FILTER_GROUPS",REMOVE_FILTER_GROUPS:"REMOVE_FILTER_GROUPS",ADD_VISUAL_ACTIONS:"ADD_VISUAL_ACTIONS",REMOVE_VISUAL_ACTIONS:"REMOVE_VISUAL_ACTIONS",SET_THEME_OVERRIDE:"SET_THEME_OVERRIDE",PRELOAD_THEMES:"PRELOAD_THEMES",CREATE_SHARED_VIEW:"CREATE_SHARED_VIEW"},T={GET_PARAMETERS:"GET_PARAMETERS",GET_SHEETS:"GET_SHEETS",GET_SHEET_VISUALS:"GET_SHEET_VISUALS",GET_VISUAL_ACTIONS:"GET_VISUAL_ACTIONS",GET_SELECTED_SHEET_ID:"GET_SELECTED_SHEET_ID",GET_FILTER_GROUPS_FOR_SHEET:"GET_FILTER_GROUPS_FOR_SHEET",GET_FILTER_GROUPS_FOR_VISUAL:"GET_FILTER_GROUPS_FOR_VISUAL"},S={ACKNOWLEDGE:"ACKNOWLEDGE",INITIATE_PRINT:"INITIATE_PRINT",NAVIGATE_TO_DASHBOARD:"NAVIGATE_TO_DASHBOARD",CLOSE_Q_SEARCH:"CLOSE_Q_SEARCH",UNDO:"UNDO",REDO:"REDO",RESET:"RESET",TOGGLE_EXECUTIVE_SUMMARY_PANE:"TOGGLE_EXECUTIVE_SUMMARY_PANE",OPEN_BUILD_VISUAL_PANE:"OPEN_BUILD_VISUAL_PANE",OPEN_DATA_QNA_PANE:"OPEN_DATA_QNA_PANE",TOGGLE_BOOKMARKS_PANE:"TOGGLE_BOOKMARKS_PANE",TOGGLE_THRESHOLD_ALERTS_PANE:"TOGGLE_THRESHOLD_ALERTS_PANE",TOGGLE_SCHEDULING_PANE:"TOGGLE_SCHEDULING_PANE",TOGGLE_RECENT_SNAPSHOTS_PANE:"TOGGLE_RECENT_SNAPSHOTS_PANE",IMPORT_OBJECTS:"IMPORT_OBJECTS",OPEN_BUILD_STORY_PANE:"OPEN_BUILD_STORY_PANE",SEND_PROMPT:"SEND_PROMPT"},R=Object.freeze({__proto__:null,ErrorChangeEventName:I,GetterMessageEventName:T,InfoChangeEventName:_,InfoMessageEventName:O,InvokerMessageEventName:S,SetterMessageEventName:x,WarnChangeEventName:A}),y=d(d(d({},_),I),A),b=d(d(d(d({},O),x),T),S),N={ERROR:"ERROR",INFO:"INFO",WARN:"WARN"},C=Object.freeze({__proto__:null,ChangeEventLevel:N,ChangeEventName:y,MessageEventName:b}),L=Object.freeze({__proto__:null}),P=Object.freeze({__proto__:null}),D=Object.freeze({__proto__:null}),U=Object.freeze({__proto__:null}),M={CONSOLE:"CONSOLE",CONTEXT:"CONTEXT",CONTROL:"CONTROL",VISUAL:"VISUAL",DASHBOARD:"DASHBOARD",QSEARCH:"QSEARCH",GENERATIVEQNA:"QSEARCH",QUICKCHAT:"QUICKCHAT"},F=Object.freeze({__proto__:null,ExperienceType:M}),G=Object.freeze({__proto__:null}),k={NULL:null,OTHER_BUCKET:null},H={INTEGER:null,STRING:null,DECIMAL:null,DATETIME:null},V=Object.freeze({__proto__:null,CALCULATED_METRIC_COLUMN_TYPE:H,SPECIAL_DATAPOINT_VALUE_TYPES:k}),j=Object.freeze({__proto__:null}),Q=Object.freeze({__proto__:null}),B=Object.freeze({__proto__:null}),q={FULL:"FULL",SEARCH_BAR:"SEARCH_BAR"},z=Object.freeze({__proto__:null,GenerativeQnAPanelType:q}),W=Object.freeze({__proto__:null}),X=Object.freeze({__proto__:null}),K=s((function e(n,r,t){o(this,e),this.eventName=n,this.message=r,this.data=t})),Z=function(e){function n(e,r,t,a){var s;return o(this,n),(s=i(this,n,[e,t,a])).eventLevel=r,s}return l(n,e),s(n)}(K),Y=function(e){function n(e,r,t){var a;return o(this,n),(a=i(this,n,[e,r,t])).eventName=e,a}return l(n,e),s(n)}(K),$=function(e){function n(e,r,t,a){var s;return o(this,n),(s=i(this,n,[e,t,a])).eventTarget=r,s}return l(n,e),s(n)}(Y),J=function(e){function n(e,r,t,a,s,c,u){var l;return o(this,n),(l=i(this,n,[e,r,c,u])).timestamp=a,l.version=s,l.eventId=t,l}return l(n,e),s(n)}($),ee=s((function e(){o(this,e)})),ne=s((function e(){o(this,e),c(this,"success",!0)})),re=s((function e(n){o(this,e),c(this,"success",!1),this.errorCode=n.errorCode,this.error=n.error,this.message=n.message})),te=s((function e(n){o(this,e),c(this,"success",!0),this.message=n}));let ie;const oe=new Uint8Array(16);function ae(){if(!ie&&(ie="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!ie))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return ie(oe)}const se=[];for(let e=0;e<256;++e)se.push((e+256).toString(16).slice(1));var ce={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function ue(e,n,r){if(ce.randomUUID&&!n&&!e)return ce.randomUUID();const t=(e=e||{}).random||(e.rng||ae)();if(t[6]=15&t[6]|64,t[8]=63&t[8]|128,n){r=r||0;for(let e=0;e<16;++e)n[r+e]=t[e];return n}return function(e,n=0){return se[e[n+0]]+se[e[n+1]]+se[e[n+2]]+se[e[n+3]]+"-"+se[e[n+4]]+se[e[n+5]]+"-"+se[e[n+6]]+se[e[n+7]]+"-"+se[e[n+8]]+se[e[n+9]]+"-"+se[e[n+10]]+se[e[n+11]]+se[e[n+12]]+se[e[n+13]]+se[e[n+14]]+se[e[n+15]]}(t)}var le=s((function e(n,r,i,a){var s=this;o(this,e),c(this,"send",function(){var e=t(E().mark((function e(n){var r;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s.experienceFrame&&s.internalExperience){e.next=2;break}throw new Error("Experience has not been initialized");case 2:return r=new $(n.eventName,s.internalExperience,n.message,n.data),e.abrupt("return",s.experienceFrame.send(r));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"addEventListener",(function(e,n){return s.experienceFrame.addInternalEventListener(e,n)})),c(this,"setLogProvider",(function(e){return s.logger=e,s})),c(this,"getInternalExperienceInfo",(function(n){var r,t,i=-1;do{i++,r=d(d({},n),{},{contextId:s.controlOptions.contextId,discriminator:i}),t=e.getExperienceIdentifier(r)}while(s.experienceIdentifiers.has(t));return s.experienceIdentifiers.add(t),{experienceIdentifier:t,internalExperience:r}})),c(this,"transformContentOptions",(function(e,n){return s.warnUnrecognizedContentOptions(Object.keys(n)),e})),c(this,"warnUnrecognizedContentOptions",(function(e){var n,r,t;e.length>0&&(null===(n=(r=s.frameOptions).onChange)||void 0===n||n.call(r,new Z(y.UNRECOGNIZED_CONTENT_OPTIONS,N.WARN,"Experience content options contain unrecognized properties",{unrecognizedContentOptions:e}),{frame:null}),null===(t=s.logger)||void 0===t||t.warn("Experience content options contain unrecognized properties"))})),c(this,"validateFrameOptions",(function(){if(!s.frameOptions.url){var e,n,r="Url is required for the experience";throw null===(e=(n=s.frameOptions).onChange)||void 0===e||e.call(n,new Z(y.NO_URL,N.ERROR,r),{frame:null}),new Error(r)}})),this.frameOptions=n,this.contentOptions=r,this.controlOptions=i,this.experienceIdentifiers=a,this.validateFrameOptions()}));c(le,"getExperienceIdentifier",(function(e){if(e.experienceType===M.DASHBOARD)return[e.contextId,e.experienceType,e.dashboardId,e.discriminator].filter(Boolean).join("-");if(e.experienceType===M.VISUAL)return[e.contextId,e.experienceType,e.dashboardId,e.sheetId,e.visualId,e.discriminator].filter(Boolean).join("-");if([M.CONSOLE,M.CONTROL,M.CONTEXT,M.QSEARCH,M.GENERATIVEQNA,M.QUICKCHAT].includes(e.experienceType))return[e.contextId,e.experienceType,e.discriminator].filter(Boolean).join("-");throw new Error("Invalid experience unable to build experience identifier")}));const pe=2147483647,fe={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},de=Math.floor,he=String.fromCharCode;function Ee(e){throw new RangeError(fe[e])}const me=function(e,n){return e+22+75*(e<26)-((0!=n)<<5)},ve=function(e,n,r){let t=0;for(e=r?de(e/700):e>>1,e+=de(e/n);e>455;t+=36)e=de(e/35);return de(t+36*e/(e+38))},we=function(e){const n=[];e=function(e){const n=[];let r=0;const t=e.length;for(;r<t;){const i=e.charCodeAt(r++);if(i>=55296&&i<=56319&&r<t){const t=e.charCodeAt(r++);56320==(64512&t)?n.push(((1023&i)<<10)+(1023&t)+65536):(n.push(i),r--)}else n.push(i)}return n}(e);const r=e.length;let t=128,i=0,o=72;for(const r of e)r<128&&n.push(he(r));const a=n.length;let s=a;for(a&&n.push("-");s<r;){let r=pe;for(const n of e)n>=t&&n<r&&(r=n);const c=s+1;r-t>de((pe-i)/c)&&Ee("overflow"),i+=(r-t)*c,t=r;for(const r of e)if(r<t&&++i>pe&&Ee("overflow"),r===t){let e=i;for(let r=36;;r+=36){const t=r<=o?1:r>=o+26?26:r-o;if(e<t)break;const i=e-t,a=36-t;n.push(he(me(t+i%a,0))),e=de(i/a)}n.push(he(me(e,0))),o=ve(i,c,s===a),i=0,++s}++i,++t}return n.join("")};var ge=s((function e(n){var r=this;o(this,e),c(this,"classNames",[e.IFRAME_CLASS_NAME]),c(this,"getIframe",(function(){return r.iframe})),c(this,"createIframePlaceholder",(function(n){if(r.iframePlaceholder=document.createElement("div"),r.iframePlaceholder.id="".concat(r.iframeName,"-placeholder"),r.iframePlaceholder.style.width=r.width,r.iframePlaceholder.style.backgroundColor="rgba(0,0,0,.01)",r.iframePlaceholder.style.display="flex",r.iframePlaceholder.style.justifyContent="center",r.iframePlaceholder.style.alignItems="center",r.iframePlaceholder.className="".concat(e.IFRAME_CLASS_NAME,"-placeholder"),r.height.endsWith("px")&&(r.iframePlaceholder.style.height=r.height),n&&"boolean"!=typeof n)r.iframePlaceholder.appendChild(n);else{var t=r.createLoaderSVG();r.iframePlaceholder.appendChild(t)}r.container.appendChild(r.iframePlaceholder)})),c(this,"createIframe",(function(){var e,n,t=document.createElement("iframe");t.className=r.classNames.join(" ").trim(),t.id=r.iframeName,t.name=r.iframeName,t.width=r.width,t.height=r.height,r.loading&&(t.loading=r.loading),t.style.border="0px",t.style.padding="0px",r.iframePlaceholder&&(t.style.opacity="0",t.style.position="absolute"),"0px"===r.width&&"0px"===r.height&&(t.style.position="absolute");var i=[];return null!==(e=r.framePermissions)&&void 0!==e&&e.clipboardRead&&i.push("clipboard-read ".concat(new URL(r.src).origin)),null!==(n=r.framePermissions)&&void 0!==n&&n.clipboardWrite&&i.push("clipboard-write ".concat(new URL(r.src).origin)),i.length&&(t.allow=i.join("; ")),r.container.appendChild(t),r.payload?r.postRequest=r.createPostRequest({src:r.src,target:t.name,container:r.container,payload:r.payload}):t.src=r.src,t})),c(this,"onLoadLocal",(function(e){var n,t;r.iframePlaceholder&&(r.iframePlaceholder.remove(),r.iframe.style.position="",r.iframe.style.opacity="1",r.iframe.style.transition="opacity .5s ease-in-out"),null===(n=r.onLoad)||void 0===n||n.call(r,e),null===(t=r.postRequest)||void 0===t||t.remove()})),c(this,"createPostRequest",(function(e){var n=e.src,r=e.container,t=e.target,i=e.payload;if(!n)throw new Error("No source has been provided.");var o=document.createElement("form");return o.style.visibility="hidden",o.method="POST",o.action=n,o.target=t,o.name="".concat(t,"-form"),Object.keys(i).forEach((function(e){var n=document.createElement("input");n.type="hidden",n.name=e,n.value=i[e],o.appendChild(n)})),r.appendChild(o),null==o||o.submit(),{remove:function(){o.remove()}}})),c(this,"createSvgElement",(function(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},t=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],i=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.entries(n).forEach((function(e){var n=v(e,2),r=n[0],t=n[1];return i.setAttribute(r,t)})),Object.entries(r).forEach((function(e){var n=v(e,2),r=n[0],t=n[1];return i.style.setProperty(r,t)})),t.forEach((function(e){return i.appendChild(e)})),i})),c(this,"createLoaderSVG",(function(){var e=[1,2,3].map((function(e){var n=r.createSvgElement("animate",{attributeName:"opacity",dur:"1s",values:"0;1;0",repeatCount:"indefinite",begin:"".concat(e/10)});return r.createSvgElement("circle",{fill:"#ccc",stroke:"none",cx:"".concat(20*e-14),cy:"50",r:"6"},void 0,[n])}));return r.createSvgElement("svg",{version:"1.1",x:"0px",y:"0px",viewBox:"0 0 100 100","enable-background":"new 0 0 0 0"},{width:"100px",height:"100px"},e)}));var t=n.id,i=n.src,a=n.width,s=void 0===a?"100%":a,u=n.height,l=void 0===u?"100%":u,p=n.container,f=n.onLoad,d=n.loading,h=n.withIframePlaceholder,E=n.payload,m=n.className,w=n.framePermissions;this.width=s,this.height=l,this.onLoad=f,this.iframeName=t,this.framePermissions=w,this.loading=d,m&&this.classNames.push(m),this.container=p,this.payload=E,this.src=i,h&&this.createIframePlaceholder(h),this.iframe=this.createIframe(),this.iframe.addEventListener("load",this.onLoadLocal)}));c(ge,"IFRAME_CLASS_NAME","quicksight-embedding-iframe");var Oe="2.11.3",_e=s((function e(n,r,i,a,s,u,l){var p=this;o(this,e),c(this,"MESSAGE_RESPONSE_TIMEOUT",5e3),c(this,"iframe",null),c(this,"send",function(){var e=t(E().mark((function e(n){var r,t,i;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!p.controlOptions.sendToControlFrame){e.next=2;break}return e.abrupt("return",p.controlOptions.sendToControlFrame(n));case 2:if(p.iframe){e.next=4;break}throw new Error("Cannot send ".concat(n.eventName,": No experience frame found"));case 4:if(t=ue(),i=new J(n.eventName,n.eventTarget,t,Date.now(),Oe,n.message,n.data),null===(r=p.iframe)||void 0===r||null===(r=r.contentWindow)||void 0===r||r.postMessage(i,p.url),n.eventName!==b.ACKNOWLEDGE){e.next=9;break}return e.abrupt("return",Promise.resolve(new ne));case 9:return e.abrupt("return",new Promise((function(e,r){var i=function(n){var r,o,a=n.data;(null==a?void 0:a.eventId)===t&&(window.removeEventListener("message",i),!0===(null===(r=a.message)||void 0===r?void 0:r.success)?e(new ne):!1===(null===(o=a.message)||void 0===o?void 0:o.success)?e(new re(a.message)):e(new te(a.message)))};window.addEventListener("message",i),setTimeout((function(){window.removeEventListener("message",i),r("".concat(n.eventName," timed out"))}),p.MESSAGE_RESPONSE_TIMEOUT)})));case 10:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"buildParameterString",(function(e){return e&&"object"===g(e)?Object.entries(e).map((function(e){var n=v(e,2),r=n[0],t=n[1],i=Array.isArray(t)?t:[t],o=encodeURIComponent(r);return i.map(encodeURIComponent).map((function(e){return"p.".concat(o,"=").concat(e)})).join("&")})).join("&"):""})),c(this,"buildQueryString",(function(e){var n=Object.entries(e).reduce((function(e,n){var r=v(n,2),t=r[0],i=r[1];return null!=i?d(d({},e),{},c({},t,"".concat(i))):e}),{punyCodeEmbedOrigin:we("".concat(window.location.origin,"/")),sdkVersion:Oe});return new URLSearchParams(n).toString()})),c(this,"createExperienceIframe",(function(){p.onChange(new Z(y.FRAME_STARTED,N.INFO,"Creating the frame",{experience:p.internalExperience}));try{p.setTimeoutInstance(),p.iframe=new ge({id:p.experienceId,src:p.url,width:p.frameOptions.width,height:p.frameOptions.height,container:p.container,onLoad:p.onLoadHandler,withIframePlaceholder:p.frameOptions.withIframePlaceholder,className:p.frameOptions.className,framePermissions:p.frameOptions.framePermissions}).getIframe()}catch(e){throw p.onChange(new Z(y.FRAME_NOT_CREATED,N.ERROR,"Failed to create the frame",{experience:p.internalExperience})),e}p.onChange(new Z(y.FRAME_MOUNTED,N.INFO,"The frame mounted",{experience:p.internalExperience,frame:p.iframe}))})),c(this,"addInternalEventListener",(function(e,n){var r=function(r,t){r.eventName===e&&n(r,t)};return p.controlOptions.eventManager.addEventListener(p.experienceId,r,!0),{remove:function(){return p.controlOptions.eventManager.removeEventListener(p.experienceId,r)}}})),c(this,"validateBaseUrl",(function(e){if(!e)throw p.onChange(new Z(y.NO_URL,N.ERROR,"Url is required for the experience",{experience:p.internalExperience})),new Error("Url is required for the experience");try{new URL(e)}catch(e){throw p.onChange(new Z(y.INVALID_URL,N.ERROR,"Invalid experience url",{experience:p.internalExperience})),new Error("Invalid experience url")}return e})),c(this,"setTimeoutInstance",(function(){p.timeoutInstance=setTimeout((function(){throw p.onChange(new Z(y.FRAME_NOT_CREATED,N.ERROR,"Creating the frame timed out",{experience:p.internalExperience})),new Error("Creating the frame timed out")}),p.controlOptions.timeout)})),c(this,"onLoadHandler",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:p.timeoutInstance&&clearTimeout(p.timeoutInstance),p.onChange(new Z(y.FRAME_LOADED,N.INFO,"The experience iframe loaded",{experience:p.internalExperience}));case 2:case"end":return e.stop()}}),e)})))),c(this,"getContainer",(function(e){if(!e){var n="Container is required for the experience";throw p.onChange(new Z(y.NO_CONTAINER,N.ERROR,n,{experience:p.internalExperience})),new Error(n)}var r=null;if("string"==typeof e)try{r=document.querySelector(e)}catch(e){throw e instanceof Error&&p.onChange(new Z(y.INVALID_CONTAINER,N.ERROR,e.message,{experience:p.internalExperience})),e}else"object"===g(e)&&e.nodeName&&(r=e);if(!r){var t="Invalid container '".concat(e,"' for the experience");throw p.onChange(new Z(y.INVALID_CONTAINER,N.ERROR,t,{experience:p.internalExperience})),new Error(t)}return r})),c(this,"decorateOnChange",(function(e){return function(n){if(e){var r={frame:p.iframe};e(n,r)}}})),c(this,"decorateOnMessage",(function(e,n){return function(r){n&&p.iframe&&n(r,{frame:p.iframe}),e&&e(r,{frame:p.iframe})}})),c(this,"initializeMutationObserver",(function(){var e=new MutationObserver((function(n){n.some((function(e){return Array.from(e.removedNodes).some((function(e){return e===p.iframe||e===p.container}))}))&&(p.controlOptions.eventManager.cleanUpCallbacksForExperience(p.experienceId),e.disconnect(),p.iframe=null,p.onChange(new Z(y.FRAME_REMOVED,N.INFO,"Frame removed from the DOM",{experience:p.internalExperience})))}));e.observe(document.body,{childList:!0,subtree:!0})})),this.frameOptions=n,this.contentOptions=i,this.onChange=this.decorateOnChange(n.onChange),this.onMessage=this.decorateOnMessage(i.onMessage,l),this.container=this.getContainer(n.container),this.internalExperience=s,this.controlOptions=r,this.transformedContentOptions=a,this.experienceId=u,this.url=this.validateBaseUrl(n.url),this.controlOptions.eventManager.addEventListener(this.experienceId,this.onMessage,!0),this.initializeMutationObserver()})),Ie=["parameters"],Ae=function(e){function n(e,r,t,a,s,u,l){var p;return o(this,n),c(p=i(this,n,[e,r,t,a,s,u,l]),"buildExperienceUrl",(function(e){var n=p.transformedContentOptions,r=n.parameters,t=h(n,Ie),i=p.internalExperience,o=i.contextId,a=i.discriminator;return[e,[p.buildQueryString(d(d({},t),{},{contextId:o,discriminator:a})),p.buildParameterString(r)].join("#")].join(e.includes("?")?"&":"?")})),p.url=p.buildExperienceUrl(e.url),p.createExperienceIframe(),p}return l(n,e),s(n)}(_e),xe=["scaleToContainer","fitToIframeWidth","locale","parameters","themeOptions","onMessage"],Te=function(e){function n(e,r,a,s){var u;o(this,n),c(u=i(this,n,[e,r,a,s]),"setParameters",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_PARAMETERS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"reset",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.RESET)));case 1:case"end":return e.stop()}}),e)})))),c(u,"addFilterGroups",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.ADD_FILTER_GROUPS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"updateFilterGroups",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.UPDATE_FILTER_GROUPS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"removeFilterGroups",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.REMOVE_FILTER_GROUPS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"getFilterGroups",t(E().mark((function e(){var n;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_FILTER_GROUPS_FOR_VISUAL));case 2:if(n=e.sent,Array.isArray(null==n?void 0:n.message)){e.next=5;break}throw new Error("Failed to retrieve filter groups for the visual");case 5:return e.abrupt("return",n.message);case 6:case"end":return e.stop()}}),e)})))),c(u,"getActions",t(E().mark((function e(){var n;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_VISUAL_ACTIONS));case 2:if(n=e.sent,Array.isArray(null==n?void 0:n.message)){e.next=5;break}throw new Error("Failed to retrieve the actions");case 5:return e.abrupt("return",n.message);case 6:case"end":return e.stop()}}),e)})))),c(u,"addActions",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.ADD_VISUAL_ACTIONS,{Actions:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"setActions",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_VISUAL_ACTIONS,{Actions:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"removeActions",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.REMOVE_VISUAL_ACTIONS,{Actions:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"setTheme",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_THEME,{ThemeArn:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"setThemeOverride",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_THEME_OVERRIDE,{ThemeOverride:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"setPreloadThemes",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.PRELOAD_THEMES,{PreloadThemes:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"extractExperienceFromUrl",(function(e){var n,r,t=/^https:\/\/[^/]+\/embed\/[^/]+\/dashboards\/([\w-]+)\/sheets\/([\w-]+)\/visuals\/([\w-]+)(\?|$)/i.exec(e)||[];if(t.length<5)throw null===(n=(r=u.frameOptions).onChange)||void 0===n||n.call(r,new Z(y.INVALID_URL,N.ERROR,"Invalid visual experience url",{url:e}),{frame:u.experienceFrame.iframe}),new Error("Invalid visual experience URL");return{experienceType:M.VISUAL,dashboardId:t[1],sheetId:t[2],visualId:t[3]}})),c(u,"interceptMessage",(function(e,n){var r,t,i,o,a;"SIZE_CHANGED"===e.eventName&&u.frameOptions.resizeHeightOnSizeChangedEvent&&!u.contentOptions.scaleToContainer&&(null==n||null===(i=n.frame)||void 0===i||null===(o=i.setAttribute)||void 0===o||o.call(i,"height","".concat(null===(a=e.message)||void 0===a?void 0:a.height,"px")));"EXPERIENCE_INITIALIZED"===e.eventName&&null!==(r=u.contentOptions)&&void 0!==r&&null!==(r=r.themeOptions)&&void 0!==r&&r.themeOverride&&u.setThemeOverride(u.contentOptions.themeOptions.themeOverride),"EXPERIENCE_INITIALIZED"===e.eventName&&null!==(t=u.contentOptions)&&void 0!==t&&null!==(t=t.themeOptions)&&void 0!==t&&t.preloadThemes&&u.setPreloadThemes(u.contentOptions.themeOptions.preloadThemes)})),c(u,"transformVisualContentOptions",(function(e){var n=e.scaleToContainer,r=e.fitToIframeWidth,t=e.locale,i=e.parameters,o=e.themeOptions;e.onMessage;var a=h(e,xe),s=u.transformContentOptions({scaleToContainer:null!=n&&n,fitToIframeWidth:null==r||r,locale:t},a);return Array.isArray(i)&&(s.parameters=i.reduce((function(e,n){return d(d({},e),{},c({},n.Name,n.Values))}),{})),null!=o&&o.themeArn&&(s.themeArn=o.themeArn),s})),u.experience=u.extractExperienceFromUrl(e.url);var l=u.getInternalExperienceInfo(u.experience),p=l.experienceIdentifier,f=l.internalExperience;return u.internalExperience=f,u.experienceId=p,u.experienceFrame=new Ae(e,a,r,u.transformVisualContentOptions(r),f,p,u.interceptMessage),u}return l(n,e),s(n)}(le),Se=function(e){function n(e,r,t,a,s,u,l){var p;return o(this,n),c(p=i(this,n,[e,r,t,a,s,u,l]),"buildExperienceUrl",(function(e){var n=p.internalExperience,r=n.contextId,t=n.discriminator;return[e,p.buildQueryString(d(d({},p.transformedContentOptions),{},{contextId:r,discriminator:t}))].join(e.includes("?")?"&":"?")})),p.url=p.buildExperienceUrl(e.url),p.createExperienceIframe(),p}return l(n,e),s(n)}(_e),Re=["locale","toolbarOptions","onMessage"],ye=function(e){function n(e,r,a,s){var u;o(this,n),c(u=i(this,n,[e,r,a,s]),"createSharedView",t(E().mark((function e(){var n;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("DASHBOARD"===u.currentPage||"DASHBOARD_SHEET"===u.currentPage||"DASHBOARD_VIEW"===u.currentPage){e.next=2;break}throw new Error("Cannot call createSharedView from this page");case 2:return e.next=4,u.send(new Y(b.CREATE_SHARED_VIEW));case 4:if(null!=(n=e.sent)&&n.message){e.next=7;break}throw new Error("Failed to create shared view");case 7:return e.abrupt("return",n);case 8:case"end":return e.stop()}}),e)})))),c(u,"toggleExecutiveSummaryPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("DASHBOARD"===u.currentPage){e.next=2;break}throw new Error("Cannot call toggleExecutiveSummaryPane from this page");case 2:return e.abrupt("return",u.send(new Y(b.TOGGLE_EXECUTIVE_SUMMARY_PANE)));case 3:case"end":return e.stop()}}),e)})))),c(u,"openDataQnAPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.OPEN_DATA_QNA_PANE)));case 1:case"end":return e.stop()}}),e)})))),c(u,"openBuildVisualPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.OPEN_BUILD_VISUAL_PANE)));case 1:case"end":return e.stop()}}),e)})))),c(u,"buildStoryFromDashboard",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("DASHBOARD"===u.currentPage){e.next=2;break}throw new Error('Cannot call buildStoryFromDashboard from "'.concat(u.currentPage,'" page'));case 2:return e.abrupt("return",u.send(new Y(b.OPEN_BUILD_STORY_PANE)));case 3:case"end":return e.stop()}}),e)})))),c(u,"interceptMessage",(function(e,n){var r;e.eventName===b.PAGE_NAVIGATION&&(u.currentPage=null==e||null===(r=e.message)||void 0===r?void 0:r.pageType)})),c(u,"extractExperienceFromUrl",(function(e){var n,r;if((/^https:\/\/[^/]+\/embedding\/[^/]+\/(start(\/(favorites|dashboards|analyses))?|dashboards\/[\w-]+(\/views\/[\w-]+)?|analyses\/[\w-]+)(\?|$)/i.exec(e)||[]).length<5)throw null===(n=(r=u.frameOptions).onChange)||void 0===n||n.call(r,new Z(y.INVALID_URL,N.ERROR,"Invalid console experience url",{url:e}),{frame:u.experienceFrame.iframe}),new Error("Invalid console experience URL");return{experienceType:M.CONSOLE}})),c(u,"transformConsoleContentOptions",(function(e){var n=e.locale,r=e.toolbarOptions;e.onMessage;var t=h(e,Re),i=u.transformContentOptions({locale:n},t);return!0===(null==r?void 0:r.executiveSummary)&&(i.showExecutiveSummaryIcon=!0),!0===(null==r?void 0:r.dataQnA)&&(i.showDataQnAIcon=!0),!0===(null==r?void 0:r.buildVisual)&&(i.showBuildVisualIcon=!0),!0===(null==r?void 0:r.buildStory)&&(i.showBuildStoryIcon=!0),i})),u.experience=u.extractExperienceFromUrl(e.url);var l=u.getInternalExperienceInfo(u.experience),p=l.experienceIdentifier,f=l.internalExperience;u.internalExperience=f,u.experienceId=p,r.locale,r.onMessage;var d=u.transformConsoleContentOptions(r);return u.experienceFrame=new Se(e,a,r,d,f,p,u.interceptMessage),u.currentPage="START",u}return l(n,e),s(n)}(le),be=["parameters"],Ne=function(e){function n(e,r,t,a,s,u,l){var p;return o(this,n),c(p=i(this,n,[e,r,t,a,s,u,l]),"buildExperienceUrl",(function(e){var n=p.transformedContentOptions,r=n.parameters,t=h(n,be),i=p.internalExperience,o=i.contextId,a=i.discriminator,s=p.contentOptions.viewId;if(s){var c=new URL(e);c.pathname=c.pathname.concat("/views/"+s),e=c.href}return[e,[p.buildQueryString(d(d({},t),{},{contextId:o,discriminator:a})),p.buildParameterString(r)].join("#")].join(e.includes("?")?"&":"?")})),p.url=p.buildExperienceUrl(e.url),p.createExperienceIframe(),p}return l(n,e),s(n)}(_e),Ce=["parameters","locale","attributionOptions","sheetOptions","toolbarOptions","themeOptions","onMessage"],Le=function(e){function n(e,r,a,s){var u;o(this,n),c(u=i(this,n,[e,r,a,s]),"initiatePrint",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.INITIATE_PRINT)));case 1:case"end":return e.stop()}}),e)})))),c(u,"undo",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.UNDO)));case 1:case"end":return e.stop()}}),e)})))),c(u,"redo",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.REDO)));case 1:case"end":return e.stop()}}),e)})))),c(u,"toggleExecutiveSummaryPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.TOGGLE_EXECUTIVE_SUMMARY_PANE)));case 1:case"end":return e.stop()}}),e)})))),c(u,"toggleBookmarksPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.TOGGLE_BOOKMARKS_PANE)));case 1:case"end":return e.stop()}}),e)})))),c(u,"toggleThresholdAlertsPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.TOGGLE_THRESHOLD_ALERTS_PANE)));case 1:case"end":return e.stop()}}),e)})))),c(u,"toggleSchedulingPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.TOGGLE_SCHEDULING_PANE)));case 1:case"end":return e.stop()}}),e)})))),c(u,"toggleRecentSnapshotsPane",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.TOGGLE_RECENT_SNAPSHOTS_PANE)));case 1:case"end":return e.stop()}}),e)})))),c(u,"getParameters",t(E().mark((function e(){var n;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_PARAMETERS));case 2:if(n=e.sent,Array.isArray(null==n?void 0:n.message)){e.next=5;break}throw new Error("Failed to retrieve the parameters");case 5:return e.abrupt("return",n.message);case 6:case"end":return e.stop()}}),e)})))),c(u,"getSheets",t(E().mark((function e(){var n;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_SHEETS));case 2:if(n=e.sent,Array.isArray(null==n?void 0:n.message)){e.next=5;break}throw new Error("Failed to retrieve the sheets");case 5:return e.abrupt("return",n.message);case 6:case"end":return e.stop()}}),e)})))),c(u,"addFilterGroups",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.ADD_FILTER_GROUPS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"updateFilterGroups",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.UPDATE_FILTER_GROUPS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"removeFilterGroups",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.REMOVE_FILTER_GROUPS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"getFilterGroupsForSheet",function(){var e=t(E().mark((function e(n){var r;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_FILTER_GROUPS_FOR_SHEET,{SheetId:n}));case 2:if(r=e.sent,Array.isArray(null==r?void 0:r.message)){e.next=5;break}throw new Error("Failed to retrieve filter groups for the sheet");case 5:return e.abrupt("return",r.message);case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"getFilterGroupsForVisual",function(){var e=t(E().mark((function e(n,r){var t;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_FILTER_GROUPS_FOR_VISUAL,{SheetId:n,VisualId:r}));case 2:if(t=e.sent,Array.isArray(null==t?void 0:t.message)){e.next=5;break}throw new Error("Failed to retrieve filter groups for the visual");case 5:return e.abrupt("return",t.message);case 6:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}()),c(u,"getVisualActions",function(){var e=t(E().mark((function e(n,r){var t;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_VISUAL_ACTIONS,{SheetId:n,VisualId:r}));case 2:if(t=e.sent,Array.isArray(null==t?void 0:t.message)){e.next=5;break}throw new Error("Failed to retrieve the visual actions");case 5:return e.abrupt("return",t.message);case 6:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}()),c(u,"addVisualActions",function(){var e=t(E().mark((function e(n,r,t){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.ADD_VISUAL_ACTIONS,{SheetId:n,VisualId:r,Actions:t})));case 1:case"end":return e.stop()}}),e)})));return function(n,r,t){return e.apply(this,arguments)}}()),c(u,"setVisualActions",function(){var e=t(E().mark((function e(n,r,t){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_VISUAL_ACTIONS,{SheetId:n,VisualId:r,Actions:t})));case 1:case"end":return e.stop()}}),e)})));return function(n,r,t){return e.apply(this,arguments)}}()),c(u,"getSelectedSheetId",t(E().mark((function e(){var n;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_SELECTED_SHEET_ID));case 2:if(null!=(n=e.sent)&&n.message){e.next=5;break}throw new Error("Failed to retrieve the selected sheet id");case 5:return e.abrupt("return",n.message);case 6:case"end":return e.stop()}}),e)})))),c(u,"setSelectedSheetId",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_SELECTED_SHEET_ID,{SheetId:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"setTheme",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_THEME,{ThemeArn:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"navigateToDashboard",function(){var e=t(E().mark((function e(n,r){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.NAVIGATE_TO_DASHBOARD,{DashboardId:n,Parameters:null==r?void 0:r.parameters})));case 1:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}()),c(u,"removeVisualActions",function(){var e=t(E().mark((function e(n,r,t){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.REMOVE_VISUAL_ACTIONS,{SheetId:n,VisualId:r,Actions:t})));case 1:case"end":return e.stop()}}),e)})));return function(n,r,t){return e.apply(this,arguments)}}()),c(u,"getSheetVisuals",function(){var e=t(E().mark((function e(n){var r;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.GET_SHEET_VISUALS,{SheetId:n}));case 2:if(r=e.sent,Array.isArray(null==r?void 0:r.message)){e.next=5;break}throw new Error("Failed to retrieve the sheet visuals");case 5:return e.abrupt("return",r.message);case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"setParameters",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_PARAMETERS,n)));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"reset",t(E().mark((function e(){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.RESET)));case 1:case"end":return e.stop()}}),e)})))),c(u,"setThemeOverride",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.SET_THEME_OVERRIDE,{ThemeOverride:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"setPreloadThemes",function(){var e=t(E().mark((function e(n){return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",u.send(new Y(b.PRELOAD_THEMES,{PreloadThemes:n})));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(u,"createSharedView",t(E().mark((function e(){var n;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.send(new Y(b.CREATE_SHARED_VIEW));case 2:if(null!=(n=e.sent)&&n.message){e.next=5;break}throw new Error("Failed to create shared view");case 5:return e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)})))),c(u,"extractExperienceFromUrl",(function(e){var n,r,t=/^https:\/\/[^/]+\/embed\/[^/]+\/dashboards\/([\w-]+)(\?|$)/i.exec(e)||[];if(t.length<3)throw null===(n=(r=u.frameOptions).onChange)||void 0===n||n.call(r,new Z(y.INVALID_URL,N.ERROR,"Invalid dashboard experience url",{url:e}),{frame:null}),new Error("Invalid dashboard experience URL");return{experienceType:M.DASHBOARD,dashboardId:t[1]}})),c(u,"interceptMessage",(function(e,n){var r,t,i,o,a;"SIZE_CHANGED"===e.eventName&&u.frameOptions.resizeHeightOnSizeChangedEvent&&(null==n||null===(i=n.frame)||void 0===i||null===(o=i.setAttribute)||void 0===o||o.call(i,"height","".concat(null==e||null===(a=e.message)||void 0===a?void 0:a.height,"px")));"EXPERIENCE_INITIALIZED"===e.eventName&&null!==(r=u.contentOptions)&&void 0!==r&&null!==(r=r.themeOptions)&&void 0!==r&&r.themeOverride&&u.setThemeOverride(u.contentOptions.themeOptions.themeOverride),"EXPERIENCE_INITIALIZED"===e.eventName&&null!==(t=u.contentOptions)&&void 0!==t&&null!==(t=t.themeOptions)&&void 0!==t&&t.preloadThemes&&u.setPreloadThemes(u.contentOptions.themeOptions.preloadThemes)})),c(u,"transformDashboardContentOptions",(function(e){var n,r,t=e.parameters,i=e.locale,o=e.attributionOptions,a=e.sheetOptions,s=e.toolbarOptions,l=e.themeOptions;e.onMessage;var p=h(e,Ce),f=u.transformContentOptions({locale:i,fitSheetToWidth:null===(n=null==a?void 0:a.fitSheetToWidth)||void 0===n||n},p);return Array.isArray(t)&&(f.parameters=t.reduce((function(e,n){return d(d({},e),{},c({},n.Name,n.Values))}),{})),!0!==(null==o?void 0:o.overlayContent)&&(f.footerPaddingEnabled=!0),(null!=s&&s.export||null!=s&&null!==(r=s.export)&&void 0!==r&&r.print)&&(f.printEnabled=!0),!0!==(null==s?void 0:s.undoRedo)&&(f.undoRedoDisabled=!0),!0!==(null==s?void 0:s.reset)&&(f.resetDisabled=!0),!0===(null==s?void 0:s.bookmarks)&&(f.showBookmarksIcon=!0),!0===(null==s?void 0:s.thresholdAlerts)&&(f.showThresholdAlertsIcon=!0),!0===(null==s?void 0:s.scheduling)&&(f.showSchedulingIcon=!0),!0===(null==s?void 0:s.executiveSummary)&&(f.showExecutiveSummaryIcon=!0),!0===(null==s?void 0:s.recentSnapshots)&&(f.showRecentSnapshotsIcon=!0),null!=a&&a.initialSheetId&&(f.sheetId=a.initialSheetId),"boolean"==typeof(null==a?void 0:a.singleSheet)&&(f.sheetTabsDisabled=a.singleSheet),null!=a&&a.emitSizeChangedEventOnSheetChange&&(f.resizeOnSheetChange=!0),null!=l&&l.themeArn&&(f.themeArn=l.themeArn),f})),u.experience=u.extractExperienceFromUrl(e.url);var l=u.getInternalExperienceInfo(u.experience),p=l.experienceIdentifier,f=l.internalExperience;return u.internalExperience=f,u.experienceId=p,u.experienceFrame=new Ne(e,a,r,u.transformDashboardContentOptions(r),f,p,u.interceptMessage),u}return l(n,e),s(n)}(le),Pe=function(e){function n(e,r,t,a,s,u,l){var p;return o(this,n),c(p=i(this,n,[e,r,t,a,s,u,l]),"buildExperienceUrl",(function(e){var n=p.internalExperience,r=n.contextId,t=n.discriminator;return[e,p.buildQueryString(d(d({},p.transformedContentOptions),{},{contextId:r,discriminator:t}))].join(e.includes("?")?"&":"?")})),p.url=p.buildExperienceUrl(e.url),p.createExperienceIframe(),p}return l(n,e),s(n)}(_e),De=function(e){function n(){var e;o(this,n);for(var r=arguments.length,a=new Array(r),s=0;s<r;s++)a[s]=arguments[s];return c(e=i(this,n,[].concat(a)),"close",(function(){return e.send(new Y(b.CLOSE_Q_SEARCH))})),c(e,"setQuestion",(function(n){return e.send(new Y(b.SET_Q_SEARCH_QUESTION,{question:n}))})),c(e,"trackOutsideClicks",(function(){var n=function(){var n=t(E().mark((function n(r){var t;return E().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(null!==(t=e.experienceFrame.iframe)&&void 0!==t&&t.contains(r.target)){n.next=11;break}return n.prev=1,n.next=4,e.close();case 4:n.next=11;break;case 6:if(n.prev=6,n.t0=n.catch(1),e.experienceFrame.iframe){n.next=10;break}return n.abrupt("return");case 10:throw n.t0;case 11:case"end":return n.stop()}}),n,null,[[1,6]])})));return function(e){return n.apply(this,arguments)}}();window.addEventListener("click",n),e.controlOptions.eventManager.addEventListenerForCleanup(e.experienceId,(function(){return window.removeEventListener("click",n)}))})),c(e,"enterFullScreen",(function(r){var t,i;!e.frameStyles&&null!=r&&r.frame&&(e.frameStyles={position:null===(t=r.frame)||void 0===t?void 0:t.style.position,top:null===(i=r.frame)||void 0===i?void 0:i.style.top,left:r.frame.style.left,zIndex:r.frame.style.zIndex,width:r.frame.style.width,height:r.frame.style.height},r.frame.style.position="fixed",r.frame.style.top="0px",r.frame.style.left="0px",r.frame.style.zIndex=n.MAX_Z_INDEX,r.frame.style.width="100vw",r.frame.style.height="100vh")})),c(e,"exitFullScreen",(function(n){e.frameStyles&&null!=n&&n.frame&&(n.frame.style.position=e.frameStyles.position,n.frame.style.top=e.frameStyles.top,n.frame.style.left=e.frameStyles.left,n.frame.style.zIndex=e.frameStyles.zIndex,n.frame.style.width=e.frameStyles.width,n.frame.style.height=e.frameStyles.height,e.frameStyles=void 0)})),e}return l(n,e),s(n)}(le);c(De,"MAX_Z_INDEX","2147483647");var Ue=["hideIcon","hideTopicName","theme","allowTopicSelection","onMessage"],Me=function(e){function n(e,r,t,a){var s;o(this,n),c(s=i(this,n,[e,r,t,a]),"extractExperienceFromUrl",(function(e){var n,r;if((/^https:\/\/[^/]+\/embedding\/[^/]+\/q\/search(\/|\?|$)/i.exec(e)||[]).length<2)throw null===(n=(r=s.frameOptions).onChange)||void 0===n||n.call(r,new Z(y.INVALID_URL,N.ERROR,"Invalid q-search experience URL",{url:e}),{frame:s.experienceFrame.iframe}),new Error("Invalid q-search experience URL");return{experienceType:M.QSEARCH}})),c(s,"interceptMessage",(function(e,n){switch(e.eventName){case b.Q_SEARCH_OPENED:case b.Q_SEARCH_CLOSED:var r,t;if("object"===g(e.message))null==n||null===(r=n.frame)||void 0===r||r.style.setProperty("height","".concat(null==e||null===(t=e.message)||void 0===t?void 0:t.height,"px"));break;case b.CONTENT_LOADED:s.trackOutsideClicks();break;case b.Q_SEARCH_ENTERED_FULLSCREEN:s.enterFullScreen(n);break;case b.Q_SEARCH_EXITED_FULLSCREEN:s.exitFullScreen(n)}})),c(s,"transformQSearchContentOptions",(function(e){var n=e.hideIcon,r=e.hideTopicName,t=e.theme,i=e.allowTopicSelection;e.onMessage;var o=h(e,Ue),a=s.transformContentOptions({allowTopicSelection:i},o);return void 0!==n&&(a.qBarIconDisabled=n),void 0!==r&&(a.qBarTopicNameDisabled=r),void 0!==t&&(a.themeId=t),a})),s.experience=s.extractExperienceFromUrl(e.url);var u=s.getInternalExperienceInfo(s.experience),l=u.experienceIdentifier,p=u.internalExperience;return s.internalExperience=p,s.experienceId=l,s.experienceFrame=new Pe(e,t,r,s.transformQSearchContentOptions(r),p,l,s.interceptMessage),s}return l(n,e),s(n)}(De),Fe=function(e){function n(e,r,t,a,s,u,l){var p;return o(this,n),c(p=i(this,n,[e,r,t,a,s,u,l]),"buildExperienceUrl",(function(e){var n=p.internalExperience,r=n.contextId,t=n.discriminator;return[e,p.buildQueryString(d(d({},p.transformedContentOptions),{},{contextId:r,discriminator:t}))].join(e.includes("?")?"&":"?")})),p.url=p.buildExperienceUrl(e.url),p.createExperienceIframe(),p}return l(n,e),s(n)}(_e),Ge=["onMessage","showTopicName","showPinboard","showSearchBar","showInterpretedAs","showFeedback","showGeneratedNarrative","showDidYouMean","showComplementaryVisuals","showQBusinessInsights","showSeeWhy","allowTopicSelection","allowFullscreen","allowReturn","searchPlaceholderText","panelOptions","themeOptions","initialQuestionId","initialAnswerId"],ke=["panelType","title","showQIcon"],He=["panelType","focusedHeight","expandedHeight"],Ve=function(e){function n(e,r,t,a){var s;o(this,n),c(s=i(this,n,[e,r,t,a]),"extractExperienceFromUrl",(function(e){var n,r;if((/^https:\/\/[^/]+\/embedding\/[^/]+\/q\/search(\/|\?|$)/i.exec(e)||[]).length<2)throw null===(n=(r=s.frameOptions).onChange)||void 0===n||n.call(r,new Z(y.INVALID_URL,N.ERROR,"Invalid generative-qna experience URL",{url:e}),{frame:s.experienceFrame.iframe}),new Error("Invalid generative-qna experience URL");return{experienceType:M.GENERATIVEQNA}})),c(s,"interceptMessage",(function(e,n){switch(e.eventName){case b.Q_SEARCH_OPENED:case b.Q_SEARCH_CLOSED:case b.Q_SEARCH_FOCUSED:var r,t;if("object"===g(e.message))null==n||null===(r=n.frame)||void 0===r||r.style.setProperty("height","".concat(null==e||null===(t=e.message)||void 0===t?void 0:t.height));break;case b.CONTENT_LOADED:var i;(null===(i=s.contentOptions)||void 0===i||null===(i=i.panelOptions)||void 0===i?void 0:i.panelType)===q.SEARCH_BAR&&s.trackOutsideClicks();break;case b.Q_PANEL_ENTERED_FULLSCREEN:s.enterFullScreen(n);break;case b.Q_PANEL_EXITED_FULLSCREEN:s.exitFullScreen(n)}})),c(s,"transformGenerativeQnAContentOptions",(function(e){var n=[],r=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";Object.keys(e).forEach((function(e){n.push(r+e)}))};e.onMessage;var t=e.showTopicName,i=e.showPinboard,o=e.showSearchBar,a=e.showInterpretedAs,c=e.showFeedback,u=e.showGeneratedNarrative,l=e.showDidYouMean,p=e.showComplementaryVisuals,f=e.showQBusinessInsights,d=e.showSeeWhy,E=e.allowTopicSelection,m=e.allowFullscreen,v=e.allowReturn,w=e.searchPlaceholderText,g=e.panelOptions,O=e.themeOptions,_=e.initialQuestionId,I=e.initialAnswerId;r(h(e,Ge));var A={qShowTopicName:t,qShowPinboard:i,qShowSearchBar:o,qShowInterpretedAs:a,qShowFeedback:c,qShowGeneratedNarrative:u,qShowDidYouMean:l,qShowComplementaryVisuals:p,qShowQBusinessInsights:f,qShowSeeWhy:d,qAllowTopicSelection:E,qAllowFullscreen:m,qAllowReturn:v,questionId:_,answerId:I};if("string"==typeof w&&(s.checkMaxLength(w,"searchPlaceholderText"),A.qSearchPlaceholderText=encodeURIComponent(w)),g){var x=g.panelType;if(A.qPanelType=x,x===q.FULL){g.panelType;var T=g.title,S=g.showQIcon,R=h(g,ke);"string"==typeof T&&(s.checkMaxLength(T,"panelOptions.title"),A.qPanelTitle=encodeURIComponent(T)),A.qShowPanelIcon=S,r(R,"panelOptions.")}else{if(x!==q.SEARCH_BAR)throw new Error("panelOptions.panelType should be one of following: [FULL, SEARCH_BAR]");g.panelType;var y=g.focusedHeight,b=g.expandedHeight,N=h(g,He);A.qPanelFocusedHeight=y,A.qPanelExpandedHeight=b,r(N,"panelOptions.")}}return null!=O&&O.themeArn&&(A.themeArn=O.themeArn),s.warnUnrecognizedContentOptions(n),A})),c(s,"checkMaxLength",(function(e,r){var t=n.TEXT_PROPERTY_MAX_LENGTH;if(e.length>t)throw new Error("".concat(r," should be less than ").concat(t," characters"))})),s.experience=s.extractExperienceFromUrl(e.url);var u=s.getInternalExperienceInfo(s.experience),l=u.experienceIdentifier,p=u.internalExperience;return s.internalExperience=p,s.experienceId=l,s.experienceFrame=new Fe(e,t,r,s.transformGenerativeQnAContentOptions(r),p,l,s.interceptMessage),s}return l(n,e),s(n)}(De);c(Ve,"TEXT_PROPERTY_MAX_LENGTH",200);var je=function(e){function n(e,r,t,a,s,u,l){var p;return o(this,n),c(p=i(this,n,[e,r,t,a,s,u,l]),"buildExperienceUrl",(function(e){var n=p.internalExperience,r=n.contextId,t=n.discriminator;return[e,p.buildQueryString(d(d({},p.transformedContentOptions),{},{contextId:r,discriminator:t}))].join("?")})),p.url=p.buildExperienceUrl(e.url),p.createExperienceIframe(),p}return l(n,e),s(n)}(_e),Qe=s((function e(n,r,t,i){var a=this;o(this,e),c(this,"experience",{experienceType:M.CONTROL}),c(this,"send",(function(e){return a.controlExperienceFrame.send(e)})),c(this,"controlFrameMessageListener",(function(e){if(a.isMessageEvent(e.data)){var n=e.data;try{if(n.eventTarget){var r=le.getExperienceIdentifier(n.eventTarget);a.eventManager.invokeEventListener(r,n)}a.sendAcknowledgment(n)}catch(e){var t,i;null===(t=a.onChange)||void 0===t||t.call(a,new Z(y.UNRECOGNIZED_EVENT_TARGET,N.WARN,"Message with unrecognized event target received",{eventTarget:n.eventTarget}),{frame:a.controlExperienceFrame.iframe}),null===(i=a.logger)||void 0===i||i.warn("Message with unrecognized event target received")}}})),c(this,"sendAcknowledgment",(function(e){var n,r,t=new $(b.ACKNOWLEDGE,a.internalExperience,{eventName:e.eventName,eventTarget:e.eventTarget});(null===(n=(r=window).requestIdleCallback)||void 0===n?void 0:n.call(r,(function(){return a.send(t)})))||a.send(t)})),c(this,"getControlExperienceId",(function(){return[a.internalExperience.contextId,a.internalExperience.experienceType,a.internalExperience.discriminator].filter(Boolean).join("-")})),c(this,"getControlExperienceBaseUrl",(function(){var e=a.urlInfo,n=e.host,r=e.sessionId,t="".concat(n,"/embed/").concat(r,"/embedControl");return new URL(t).href})),c(this,"isMessageEvent",(function(e){return!!e&&!!e.eventTarget&&!!e.eventName})),this.container=n,this.eventManager=r.eventManager,this.urlInfo=r.urlInfo,this.onChange=t,this.logger=i,this.internalExperience=d(d({},this.experience),{},{contextId:r.contextId,discriminator:0});var s=this.getControlExperienceId();this.controlExperienceFrame=new je({url:this.getControlExperienceBaseUrl(),container:this.container,width:"0px",height:"0px",onChange:this.onChange},{eventManager:this.eventManager,contextId:this.internalExperience.contextId,timeout:e.FRAME_TIMEOUT,urlInfo:this.urlInfo},{},{},this.internalExperience,s),window.addEventListener("message",this.controlFrameMessageListener),this.eventManager.addEventListenerForCleanup(s,(function(){return window.removeEventListener("message",a.controlFrameMessageListener)}))}));c(Qe,"FRAME_TIMEOUT",6e4);var Be=s((function e(){var n=this;o(this,e),c(this,"addEventListener",(function(e,r,t){if(!e)throw new Error("Experience identifier is required when calling addEventListener");if("function"!=typeof r)throw new Error("Invalid type provided for event listener");var i=n.eventListeners.get(e);return t&&n.addEventListenerForCleanup(e,(function(){return n.removeEventListener(e,r)})),i?(i.push(r),n):(n.eventListeners.set(e,[r]),n)})),c(this,"invokeEventListener",(function(e,r){var t=n.eventListeners.get(e);if(!t)throw new Error("Unable to find experience specific event listeners: ".concat(e));return t.forEach((function(e){e(r)})),n})),c(this,"removeEventListener",(function(e,r){var t=n.eventListeners.get(e);if(!t)throw new Error("Unable to find experience specific event listeners: ".concat(e));var i=t.filter((function(e){return e!==r}));return n.eventListeners.set(e,i),n})),c(this,"addEventListenerForCleanup",(function(e,r){var t,i=null!==(t=n.cleanUpCallbacks.get(e))&&void 0!==t?t:[];i.push(r),n.cleanUpCallbacks.set(e,i)})),c(this,"cleanUpCallbacksForExperience",(function(e){var r=n.cleanUpCallbacks.get(e);r&&(r.forEach((function(e){return e()})),n.cleanUpCallbacks.delete(e),n.eventListeners.set(e,[]))})),this.eventListeners=new Map,this.cleanUpCallbacks=new Map})),qe=s((function e(){o(this,e),c(this,"log",console.log),c(this,"warn",console.warn),c(this,"error",console.error),c(this,"debug",console.debug),c(this,"info",console.info)})),ze=function(e){function n(e,r,t,a,s,u,l){var p;return o(this,n),c(p=i(this,n,[e,r,t,a,s,u,l]),"buildExperienceUrl",(function(e){var n=p.internalExperience,r=n.contextId,t=n.discriminator;return[e,p.buildQueryString(d({contextId:r,discriminator:t},p.transformedContentOptions))].join(e.includes("?")?"&":"?")})),p.url=p.buildExperienceUrl(e.url),p.createExperienceIframe(),p}return l(n,e),s(n)}(_e),We=["fixedAgentArn","agentOptions","promptOptions","footerOptions","onMessage"],Xe=["fixedAgentId"],Ke=["allowFileAttachments","initialPrompt","showAgentKnowledgeBoundary","showInitialPromptMessage","showWebSearch","showPromptArea","showChatHistory","enablePrivateMode"],Ze=["showBrandAttribution","showUsagePolicy"],Ye=function(e){function n(e,r,t,a){var s;o(this,n);var u=d({framePermissions:d({clipboardRead:!0,clipboardWrite:!0},e.framePermissions)},e);c(s=i(this,n,[u,r,t,a]),"extractExperienceFromUrl",(function(e){var n,r;if((/^https:\/\/[^/]+\/embedding\/[^/]+\/quick\/chat(\/|\?|$)/i.exec(e)||[]).length<2)throw null===(n=(r=s.frameOptions).onChange)||void 0===n||n.call(r,new Z(y.INVALID_URL,N.ERROR,"Invalid quick chat experience url",{url:e}),{frame:null}),new Error("Invalid quick chat experience url");return{experienceType:M.QUICKCHAT}})),c(s,"sendPrompt",(function(e){return s.send(new Y(b.SEND_PROMPT,{prompt:e}))})),c(s,"transformQuickChatContentOptions",(function(e){var n=[],r=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";Object.keys(e).forEach((function(e){n.push(r+e)}))},t=e.fixedAgentArn,i=e.agentOptions,o=void 0===i?{}:i,a=e.promptOptions,c=void 0===a?{}:a,u=e.footerOptions,l=void 0===u?{}:u;e.onMessage,r(h(e,We));var p=o.fixedAgentId;r(h(o,Xe),"agentOptions.");var f=c.allowFileAttachments,d=c.initialPrompt,E=c.showAgentKnowledgeBoundary,m=c.showInitialPromptMessage,v=c.showWebSearch,w=c.showPromptArea,g=c.showChatHistory,O=c.enablePrivateMode;r(h(c,Ke),"promptOptions.");var _=l.showBrandAttribution,I=l.showUsagePolicy;return r(h(l,Ze),"footerOptions."),s.warnUnrecognizedContentOptions(n),{allowFileAttachments:f,initialPrompt:d,showAgentKnowledgeBoundary:E,showBrandAttribution:_,showInitialPromptMessage:m,showUsagePolicy:I,showWebSearch:v,showPromptArea:w,showChatHistory:g,enablePrivateMode:O,fixedAgentId:s.validateFixedAgentId(t,p)}})),c(s,"validateFixedAgentId",(function(e,n){if(e&&n)throw new Error("Both fixedAgentArn and agentOptions.fixedAgentId cannot be specified. Use agentOptions.fixedAgentId.");if(n)return n;if(e){var r;null===(r=s.logger)||void 0===r||r.warn("The fixedAgentArn option is deprecated. Use agentOptions.fixedAgentId instead.");var t=e.split("/")[1];if(!t)throw new Error("Invalid fixedAgentArn.");return t}})),s.experience=s.extractExperienceFromUrl(u.url);var l=s.getInternalExperienceInfo(s.experience),p=l.experienceIdentifier,f=l.internalExperience;return s.internalExperience=f,s.experienceId=p,s.experienceFrame=new ze(u,t,r,s.transformQuickChatContentOptions(r),f,p),s}return l(n,e),s(n)}(le),$e=s((function e(n){var r=this;o(this,e),c(this,"embedVisual",function(){var e=t(E().mark((function e(n){var t,i,o=arguments;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=o.length>1&&void 0!==o[1]?o[1]:{},r.validateFrameOptions(n,"embedVisual"),i=r.buildControlOptions(n),e.abrupt("return",new Te(n,t,i,r.experienceIdentifiers).setLogProvider(r.logger));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"embedDashboard",function(){var e=t(E().mark((function e(n){var t,i,o=arguments;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=o.length>1&&void 0!==o[1]?o[1]:{},r.validateFrameOptions(n,"embedDashboard"),i=r.buildControlOptions(n),e.abrupt("return",new Le(n,t,i,r.experienceIdentifiers).setLogProvider(r.logger));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"embedConsole",function(){var e=t(E().mark((function e(n){var t,i,o=arguments;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=o.length>1&&void 0!==o[1]?o[1]:{},r.validateFrameOptions(n,"embedConsole"),i=r.buildControlOptions(n),e.abrupt("return",new ye(n,t,i,r.experienceIdentifiers).setLogProvider(r.logger));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"embedQSearchBar",function(){var e=t(E().mark((function e(n){var t,i,o=arguments;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=o.length>1&&void 0!==o[1]?o[1]:{},r.validateFrameOptions(n,"embedQSearchBar"),i=r.buildControlOptions(n),e.abrupt("return",new Me(n,t,i,r.experienceIdentifiers).setLogProvider(r.logger));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"embedGenerativeQnA",function(){var e=t(E().mark((function e(n){var t,i,o=arguments;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=o.length>1&&void 0!==o[1]?o[1]:{},r.validateFrameOptions(n,"embedGenerativeQnA"),i=r.buildControlOptions(n),e.abrupt("return",new Ve(n,t,i,r.experienceIdentifiers).setLogProvider(r.logger));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"embedQuickChat",function(){var e=t(E().mark((function e(n){var t,i,o=arguments;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=o.length>1&&void 0!==o[1]?o[1]:{},r.validateFrameOptions(n,"embedQuickChat"),i=r.buildControlOptions(n),e.abrupt("return",new Ye(n,t,i,r.experienceIdentifiers).setLogProvider(r.logger));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),c(this,"validateFrameOptions",(function(e,n){if(!e){var t="".concat(n," is called without frameOptions");throw r.onChange(new Z(y.NO_FRAME_OPTIONS,N.ERROR,"".concat(n," is called without frameOptions"),{methodName:n}),{frame:null}),new Error(t)}if("object"!==g(e)||Array.isArray(e)){var i="".concat(n," is called with non-object frameOptions");throw r.onChange(new Z(y.INVALID_FRAME_OPTIONS,N.ERROR,i,{methodName:n,frameOptionsType:Array.isArray(e)?"array":g(e)}),{frame:null}),new Error(i)}var o=["url","container","width","height","resizeHeightOnSizeChangedEvent","withIframePlaceholder","onChange","className","framePermissions"],a=Object.keys(e).filter((function(e){return!o.includes(e)}));if(a.length>0){var s,c,u="".concat(n," is called with unrecognized properties");null===(s=e.onChange)||void 0===s||s.call(e,new Z(y.UNRECOGNIZED_FRAME_OPTIONS,N.WARN,u,{unrecognizedFrameOptions:a}),{frame:null}),null===(c=r.logger)||void 0===c||c.warn(u)}})),c(this,"buildControlOptions",(function(e){if(!r.controlOptions){if(!e.url)throw new Error("URL is missing in frame options, but is a required field");var n=r.getControlUrlInfo(e.url),t=new Qe(r.getBodyElement(),{eventManager:r.eventManager,urlInfo:n,contextId:r.contextId},r.onChange,r.logger);r.controlOptions={eventManager:r.eventManager,sendToControlFrame:t.send,contextId:r.contextId,timeout:Qe.FRAME_TIMEOUT,urlInfo:n}}return r.controlOptions})),c(this,"onChange",(function(e,n){r.contextOnChange&&r.contextOnChange(e,n)})),c(this,"getControlUrlInfo",(function(e){var n=/^(https:\/\/[^/]+)\/(embedding|embed)\/([^/]+)\/[^?]+\?(.*)/i.exec(e)||[];if((null==n?void 0:n.length)<4)throw new Error('Invalid embedding url: "'.concat(e,'"'));return{sessionId:n[3],host:n[1],urlSearchParams:new URLSearchParams(n[4])}})),c(this,"getBodyElement",(function(){var e,n=null===(e=document.getElementsByTagName("body"))||void 0===e?void 0:e[0];if(!n){var t="could not locate <body> element in the page";throw r.onChange(new Z(y.NO_BODY,N.ERROR,t),{frame:null}),new Error(t)}return n})),this.contextId=ue(),this.experienceIdentifiers=new Set,this.eventManager=new Be,this.contextOnChange=n.onChange,this.logger=new qe})),Je=function(){var e=t(E().mark((function e(){var n,r=arguments;return E().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.length>0&&void 0!==r[0]?r[0]:{},e.abrupt("return",new $e(n));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),en=d(d(d(d(d(d(d(d(d(d(d(d(d(d(d({},U),R),C),L),P),D),F),G),V),Q),j),B),z),W),X);e.BaseExperience=le,e.BaseExperienceFrame=_e,e.CALCULATED_METRIC_COLUMN_TYPE=H,e.ChangeEvent=Z,e.ChangeEventLevel=N,e.ChangeEventName=y,e.ConsoleExperience=ye,e.ConsoleExperienceFrame=Se,e.ControlExperience=Qe,e.ControlExperienceFrame=je,e.DashboardExperience=Le,e.DashboardExperienceFrame=Ne,e.DataResponse=te,e.DefaultLogger=qe,e.EmbeddingContext=$e,e.EmbeddingEvent=K,e.EmbeddingMessageEvent=Y,e.ErrorChangeEventName=I,e.ErrorResponse=re,e.EventManager=Be,e.ExperienceType=M,e.GenerativeQnAExperience=Ve,e.GenerativeQnAExperienceFrame=Fe,e.GenerativeQnAPanelType=q,e.GetterMessageEventName=T,e.Iframe=ge,e.InfoChangeEventName=_,e.InfoMessageEventName=O,e.InternalQBaseExperience=De,e.InvokerMessageEventName=S,e.MessageEventName=b,e.PostMessageEvent=J,e.QSE=en,e.QSearchExperience=Me,e.QSearchExperienceFrame=Pe,e.QuickChatExperience=Ye,e.QuickChatExperienceFrame=ze,e.ResponseMessage=ee,e.SDK_VERSION=Oe,e.SPECIAL_DATAPOINT_VALUE_TYPES=k,e.SetterMessageEventName=x,e.SuccessResponse=ne,e.TargetedMessageEvent=$,e.VisualExperience=Te,e.VisualExperienceFrame=Ae,e.WarnChangeEventName=A,e.createEmbeddingContext=Je}));
//# sourceMappingURL=quicksight-embedding-js-sdk.min.js.map

/* ===== END vendored Amazon QuickSight Embedding SDK ===== */

/* ===== BEGIN QuickSuite Widget ===== */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * QuickSuite Widget — Generic QuickSight Embedding Widget
 *
 * Self-contained IIFE that initializes an embedded QuickSight dashboard
 * and Q&A chat experience from a single <script> tag. No global scope
 * pollution. All configuration is loaded from a co-located config.json.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // ConfigLoader — fetches and validates config.json against schema
  // ---------------------------------------------------------------------------

  class ConfigLoader {
    constructor() {
      this._schema = null;
    }

    /**
     * Load and validate the configuration file.
     * @param {string} configUrl - Absolute URL to config.json
     * @returns {Promise<Object>} Validated configuration object
     * @throws {Error} On fetch failure or validation errors
     */
    async load(configUrl) {
      const config = await this._fetchJson(configUrl, 'config.json');
      const schemaUrl = configUrl.replace(/config\.json$/, 'config.schema.json');
      await this._loadSchema(schemaUrl);
      return this.validate(config);
    }

    /**
     * Validate a config object against the loaded schema.
     * @param {Object} config - Configuration object to validate
     * @returns {Object} The validated config (unchanged if valid)
     * @throws {Error} With validation details if invalid
     */
    validate(config) {
      if (!this._schema) {
        // Schema not loaded — skip validation but warn
        console.warn('[QuickSuite] Config schema not loaded; skipping validation.');
        return config;
      }

      const errors = this._validateAgainstSchema(config, this._schema, '');
      if (errors.length > 0) {
        errors.forEach(function (err) {
          console.error('[QuickSuite] Config validation error: ' + err.path + ' — ' + err.message);
        });
        var errorMsg = 'Configuration is invalid: ' + errors.length + ' error(s) found.';
        throw new ConfigValidationError(errorMsg, errors);
      }
      return config;
    }

    /**
     * Fetch a JSON resource.
     * @private
     */
    async _fetchJson(url, label) {
      var response;
      try {
        response = await fetch(url);
      } catch (networkErr) {
        var msg = 'Failed to fetch ' + label + ': network error';
        console.error('[QuickSuite] ' + msg);
        throw new ConfigFetchError(msg, 0);
      }

      if (!response.ok) {
        var errMsg = 'Failed to fetch ' + label + ': HTTP ' + response.status;
        console.error('[QuickSuite] ' + errMsg);
        throw new ConfigFetchError(errMsg, response.status);
      }

      try {
        return await response.json();
      } catch (parseErr) {
        var parseMsg = 'Failed to parse ' + label + ': invalid JSON';
        console.error('[QuickSuite] ' + parseMsg);
        throw new ConfigFetchError(parseMsg, 0);
      }
    }

    /**
     * Load the JSON schema for validation.
     * @private
     */
    async _loadSchema(schemaUrl) {
      try {
        this._schema = await this._fetchJson(schemaUrl, 'config.schema.json');
      } catch (err) {
        console.warn('[QuickSuite] Could not load config schema; validation will be skipped.', err.message);
        this._schema = null;
      }
    }

    /**
     * Minimal JSON Schema validator (draft-07 subset).
     * Validates type, required, properties, pattern, min/max, enum, format.
     * Returns an array of { path, message } error objects.
     * @private
     */
    _validateAgainstSchema(value, schema, path) {
      var errors = [];

      if (!schema || typeof schema !== 'object') {
        return errors;
      }

      // Type check
      if (schema.type) {
        if (!this._checkType(value, schema.type)) {
          errors.push({ path: path || '/', message: 'Expected type "' + schema.type + '", got "' + this._getType(value) + '"' });
          return errors; // No point continuing if type is wrong
        }
      }

      // Enum check
      if (schema.enum) {
        if (schema.enum.indexOf(value) === -1) {
          errors.push({ path: path || '/', message: 'Value must be one of: ' + schema.enum.join(', ') });
        }
      }

      // String constraints
      if (schema.type === 'string' && typeof value === 'string') {
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
          errors.push({ path: path || '/', message: 'String exceeds maxLength of ' + schema.maxLength });
        }
        if (schema.pattern) {
          var re = new RegExp(schema.pattern);
          if (!re.test(value)) {
            errors.push({ path: path || '/', message: 'String does not match pattern: ' + schema.pattern });
          }
        }
        if (schema.format === 'uri') {
          if (!this._isValidUrl(value)) {
            errors.push({ path: path || '/', message: 'String is not a valid URI' });
          }
        }
        if (schema.format === 'uuid') {
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            errors.push({ path: path || '/', message: 'String is not a valid UUID' });
          }
        }
      }

      // Number constraints
      if ((schema.type === 'number' || schema.type === 'integer') && typeof value === 'number') {
        if (schema.minimum !== undefined && value < schema.minimum) {
          errors.push({ path: path || '/', message: 'Value ' + value + ' is less than minimum ' + schema.minimum });
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
          errors.push({ path: path || '/', message: 'Value ' + value + ' is greater than maximum ' + schema.maximum });
        }
        if (schema.type === 'integer' && value !== Math.floor(value)) {
          errors.push({ path: path || '/', message: 'Expected integer, got floating point' });
        }
      }

      // Object validation
      if (schema.type === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Required properties
        if (schema.required) {
          schema.required.forEach(function (key) {
            if (!(key in value)) {
              errors.push({ path: path + '/' + key, message: 'Required property "' + key + '" is missing' });
            }
          });
        }

        // Property count (minProperties / maxProperties)
        var propCount = Object.keys(value).length;
        if (schema.minProperties !== undefined && propCount < schema.minProperties) {
          errors.push({ path: path || '/', message: 'Object has ' + propCount + ' properties, minimum is ' + schema.minProperties });
        }
        if (schema.maxProperties !== undefined && propCount > schema.maxProperties) {
          errors.push({ path: path || '/', message: 'Object has ' + propCount + ' properties, maximum is ' + schema.maxProperties });
        }

        // Validate known properties
        if (schema.properties) {
          var self = this;
          Object.keys(value).forEach(function (key) {
            if (schema.properties[key]) {
              var subErrors = self._validateAgainstSchema(value[key], schema.properties[key], path + '/' + key);
              errors = errors.concat(subErrors);
            } else if (schema.additionalProperties === false) {
              errors.push({ path: path + '/' + key, message: 'Additional property "' + key + '" is not allowed' });
            } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
              var subErrors2 = self._validateAgainstSchema(value[key], schema.additionalProperties, path + '/' + key);
              errors = errors.concat(subErrors2);
            }
          });
        } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
          var self2 = this;
          Object.keys(value).forEach(function (key) {
            var subErrors3 = self2._validateAgainstSchema(value[key], schema.additionalProperties, path + '/' + key);
            errors = errors.concat(subErrors3);
          });
        }
      }

      // Array validation
      if (schema.type === 'array' && Array.isArray(value)) {
        if (schema.items) {
          var self3 = this;
          value.forEach(function (item, index) {
            var subErrors4 = self3._validateAgainstSchema(item, schema.items, path + '[' + index + ']');
            errors = errors.concat(subErrors4);
          });
        }
      }

      return errors;
    }

    /**
     * Check if a value matches a JSON Schema type.
     * @private
     */
    _checkType(value, type) {
      switch (type) {
        case 'string': return typeof value === 'string';
        case 'number': return typeof value === 'number' && isFinite(value);
        case 'integer': return typeof value === 'number' && isFinite(value) && value === Math.floor(value);
        case 'boolean': return typeof value === 'boolean';
        case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'array': return Array.isArray(value);
        case 'null': return value === null;
        default: return true;
      }
    }

    /**
     * Get the JSON Schema type name for a value.
     * @private
     */
    _getType(value) {
      if (value === null) return 'null';
      if (Array.isArray(value)) return 'array';
      return typeof value;
    }

    /**
     * Basic URI validation.
     * @private
     */
    _isValidUrl(str) {
      try {
        var url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch (e) {
        return false;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Custom Error Types
  // ---------------------------------------------------------------------------

  class ConfigFetchError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = 'ConfigFetchError';
      this.statusCode = statusCode;
    }
  }

  class ConfigValidationError extends Error {
    constructor(message, errors) {
      super(message);
      this.name = 'ConfigValidationError';
      this.validationErrors = errors;
    }
  }

  // ---------------------------------------------------------------------------
  // DeepLinkParser — reads and sanitizes deep link state from URL and DOM
  // ---------------------------------------------------------------------------

  class DeepLinkParser {
    /**
     * Parse deep link state from URL query parameters and container data attributes.
     * URL params take priority over data attributes. All values are sanitized.
     * Tab/item references are validated against config; invalid refs fall back to defaults.
     *
     * @param {HTMLElement} container - The widget container element
     * @param {Object} config - The validated widget configuration
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    parse(container, config) {
      var urlParams = this._readUrlParams();
      var dataAttrs = this._readDataAttributes(container);
      var merged = this._mergeWithPriority(urlParams, dataAttrs);
      var state = this._validateAgainstConfig(merged, config);
      return state;
    }

    /**
     * Read deep link parameters from the current URL query string.
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    _readUrlParams() {
      var params = { tab: null, item: null, view: null, prompt: null };

      if (typeof window === 'undefined' || !window.location || !window.location.search) {
        return params;
      }

      var searchParams;
      try {
        searchParams = new URLSearchParams(window.location.search);
      } catch (e) {
        return params;
      }

      var tab = searchParams.get('tab');
      var item = searchParams.get('item');
      var view = searchParams.get('view');
      var prompt = searchParams.get('prompt');

      if (tab !== null) params.tab = this._sanitize(tab);
      if (item !== null) params.item = this._sanitize(item);
      if (view !== null) params.view = this._sanitize(view);
      if (prompt !== null) params.prompt = this._sanitize(prompt);

      return params;
    }

    /**
     * Read deep link parameters from HTML data attributes on the container element.
     * @param {HTMLElement} container - The widget container element
     * @returns {{ tab: string|null, item: string|null }}
     */
    _readDataAttributes(container) {
      var attrs = { tab: null, item: null };

      if (!container || typeof container.getAttribute !== 'function') {
        return attrs;
      }

      var tab = container.getAttribute('data-initial-tab');
      var item = container.getAttribute('data-initial-item');

      if (tab !== null) attrs.tab = this._sanitize(tab);
      if (item !== null) attrs.item = this._sanitize(item);

      return attrs;
    }

    /**
     * Sanitize a deep link parameter value.
     * - URL-decodes the value
     * - Strips HTML tags
     * - Strips characters outside alphanumeric, hyphen, underscore, dot, tilde, and URL-safe set
     * - Limits to 200 characters
     *
     * @param {string} value - Raw parameter value
     * @returns {string} Sanitized value
     */
    _sanitize(value) {
      if (value === null || value === undefined) {
        return '';
      }

      var decoded = value;
      try {
        decoded = decodeURIComponent(String(value));
      } catch (e) {
        // If decoding fails, use the raw value
        decoded = String(value);
      }

      // Strip HTML tags
      decoded = decoded.replace(/<[^>]*>/g, '');

      // Strip characters outside alphanumeric, hyphen, underscore, dot, space, tilde, and common URL-safe chars
      decoded = decoded.replace(/[^a-zA-Z0-9\-_.~ ]/g, '');

      // Limit to 200 characters
      if (decoded.length > 200) {
        decoded = decoded.substring(0, 200);
      }

      return decoded;
    }

    /**
     * Merge URL params and data attributes, with URL params taking priority.
     * @param {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }} urlParams
     * @param {{ tab: string|null, item: string|null }} dataAttrs
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    _mergeWithPriority(urlParams, dataAttrs) {
      return {
        tab: urlParams.tab !== null ? urlParams.tab : (dataAttrs.tab || null),
        item: urlParams.item !== null ? urlParams.item : (dataAttrs.item || null),
        view: urlParams.view || null,
        prompt: urlParams.prompt || null
      };
    }

    /**
     * Validate tab/item references against config. Falls back to defaults for invalid refs.
     * Truncates prompt to 500 characters.
     *
     * @param {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }} state
     * @param {Object} config - The validated widget configuration
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    _validateAgainstConfig(state, config) {
      var result = { tab: null, item: null, view: state.view, prompt: state.prompt };

      // Determine available tab IDs from config navigation
      var navigation = (config && config.navigation) ? config.navigation : {};
      var tabIds = Object.keys(navigation);
      var defaultTab = tabIds.length > 0 ? tabIds[0] : null;
      var chatEnabled = !!(config && config.chatEnabled);

      // If chatEnabled is false, reject any deep link targeting the chat view
      // or a chat-type tab, falling back to the default tab (Requirement 4.9)
      var requestedTab = state.tab;
      if (requestedTab && navigation[requestedTab] && navigation[requestedTab].type === 'chat' && !chatEnabled) {
        console.warn('[QuickSuite] Deep link targets chat tab "' + requestedTab + '" but chat is disabled; falling back to default.');
        requestedTab = null;
      }
      if (state.view === 'chat' && !chatEnabled) {
        console.warn('[QuickSuite] Deep link view=chat but chat is disabled; falling back to default.');
        result.view = null;
        result.prompt = null;
      }

      // Validate tab reference
      if (requestedTab && tabIds.indexOf(requestedTab) !== -1) {
        result.tab = requestedTab;
      } else {
        if (requestedTab) {
          console.warn('[QuickSuite] Deep link tab "' + requestedTab + '" not found in config; falling back to default.');
        }
        result.tab = defaultTab;
      }

      // Validate item reference within the resolved tab
      if (result.tab && navigation[result.tab]) {
        var tabConfig = navigation[result.tab];
        var subItems = tabConfig.subItems || [];
        var subItemIds = subItems.map(function (si) { return si.id; });
        var defaultItem = subItemIds.length > 0 ? subItemIds[0] : null;

        if (state.item && subItemIds.indexOf(state.item) !== -1) {
          result.item = state.item;
        } else {
          if (state.item) {
            console.warn('[QuickSuite] Deep link item "' + state.item + '" not found in tab "' + result.tab + '"; falling back to default.');
          }
          result.item = defaultItem;
        }
      }

      // Truncate prompt to 500 characters
      if (result.prompt && result.prompt.length > 500) {
        result.prompt = result.prompt.substring(0, 500);
      }

      return result;
    }
  }

  // ---------------------------------------------------------------------------
  // AuthManager — Cognito Hosted UI login + id-token handling (per-user auth)
  // ---------------------------------------------------------------------------

  /**
   * Manages end-user authentication against a Cognito User Pool using the
   * Hosted UI implicit OAuth flow. When the widget config includes an `auth`
   * block, unauthenticated visitors are redirected to the Hosted UI to log in;
   * on return, the id token in the URL fragment is captured and sent as a
   * Bearer token on backend embed requests, so the backend embeds each viewer
   * as their own registered QuickSight identity.
   *
   * When no `auth` block is configured the AuthManager is inert (no login is
   * required) — supporting anonymous/shared-identity deployments.
   */
  class AuthManager {
    /**
     * @param {Object|null} authConfig - config.auth, or null/undefined to disable auth
     */
    constructor(authConfig) {
      this._cfg = authConfig || null;
      this._storageKey = 'qs_id_token';
    }

    /** @returns {boolean} whether Cognito auth is configured for this widget */
    isEnabled() {
      return !!(this._cfg && this._cfg.userPoolDomain && this._cfg.clientId);
    }

    /**
     * Capture an id token returned in the URL fragment after a Hosted UI
     * redirect (implicit flow), persist it, and strip it from the address bar.
     */
    captureTokenFromRedirect() {
      if (!this.isEnabled()) return;
      if (typeof window === 'undefined' || !window.location) return;
      var hash = window.location.hash || '';
      if (hash.indexOf('id_token=') === -1) return;

      var params = {};
      hash.replace(/^#/, '').split('&').forEach(function (pair) {
        var kv = pair.split('=');
        if (kv.length === 2) params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
      });

      if (params.id_token) {
        try {
          sessionStorage.setItem(this._storageKey, params.id_token);
        } catch (e) {
          console.warn('[QuickSuite] Unable to persist auth token.');
        }
        // Remove the token fragment from the URL so it is not left in history.
        try {
          var clean = window.location.pathname + window.location.search;
          window.history.replaceState({}, document.title, clean);
        } catch (e) { /* non-fatal */ }
      }
    }

    /** @returns {string|null} the stored id token, or null */
    getIdToken() {
      try {
        return sessionStorage.getItem(this._storageKey);
      } catch (e) {
        return null;
      }
    }

    /** @returns {boolean} true if a non-expired id token is stored */
    isAuthenticated() {
      if (!this.isEnabled()) return true; // auth not required
      var token = this.getIdToken();
      if (!token) return false;
      var payload = this._decodeJwt(token);
      if (!payload || !payload.exp) return false;
      // exp is in seconds; add a small skew buffer
      return (payload.exp * 1000) > (Date.now() + 5000);
    }

    /** Redirect the browser to the Cognito Hosted UI login page (implicit flow). */
    login() {
      if (!this.isEnabled() || typeof window === 'undefined') return;
      var scopes = (this._cfg.scopes && this._cfg.scopes.length)
        ? this._cfg.scopes.join('+')
        : 'openid+email+profile';
      var redirectUri = this._cfg.redirectUri || (window.location.origin + window.location.pathname);
      var url = this._normalizeDomain() +
        '/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=' + encodeURIComponent(this._cfg.clientId) +
        '&redirect_uri=' + encodeURIComponent(redirectUri) +
        '&scope=' + scopes;
      window.location.assign(url);
    }

    /** Clear the local token and redirect to the Hosted UI logout endpoint. */
    logout() {
      try { sessionStorage.removeItem(this._storageKey); } catch (e) { /* ignore */ }
      if (!this.isEnabled() || typeof window === 'undefined') return;
      var logoutUri = this._cfg.logoutUri || (window.location.origin + window.location.pathname);
      var url = this._normalizeDomain() +
        '/logout' +
        '?client_id=' + encodeURIComponent(this._cfg.clientId) +
        '&logout_uri=' + encodeURIComponent(logoutUri);
      window.location.assign(url);
    }

    /** @private normalize the configured domain into an https origin (no trailing slash) */
    _normalizeDomain() {
      var d = String(this._cfg.userPoolDomain || '').replace(/\/$/, '');
      if (d.indexOf('http://') === 0 || d.indexOf('https://') === 0) return d;
      return 'https://' + d;
    }

    /** @private decode a JWT payload without verifying the signature (client-side, display/expiry only) */
    _decodeJwt(token) {
      try {
        var parts = token.split('.');
        if (parts.length < 2) return null;
        var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        var json = decodeURIComponent(
          atob(b64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
        );
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // WidgetInitializer — orchestrates initialization
  // ---------------------------------------------------------------------------

  class WidgetInitializer {
    constructor() {
      this._config = null;
      this._container = null;
      this._configLoader = new ConfigLoader();
      this._errorHandler = new ErrorHandler();
      this._deepLinkParser = new DeepLinkParser();
      this._navRenderer = null;
      this._embedManager = null;
      this._deepLinkState = null;
      this._authManager = null;
      this._chatBubble = null;
      this._filterBar = null;
    }

    /**
     * First navigation tab that is not a chat tab (chat is a bubble, not a tab).
     * @private
     * @returns {string|null}
     */
    _firstDashboardTabId() {
      var navigation = this._config.navigation || {};
      var tabIds = Object.keys(navigation);
      for (var i = 0; i < tabIds.length; i++) {
        if (navigation[tabIds[i]].type !== 'chat') {
          return tabIds[i];
        }
      }
      return null;
    }

    /**
     * Start the widget initialization process.
     * Called at DOMContentLoaded or when the script loads.
     */
    async init() {
      try {
        // Step 1: Detect the container element
        this._container = await this._detectContainer();
        if (!this._container) {
          return; // Warning already logged
        }

        // Step 2: Resolve config.json URL relative to this script
        var configUrl = this._resolveConfigUrl();

        // Step 3: Load and validate configuration
        this._showLoadingScreen();
        this._config = await this._configLoader.load(configUrl);

        // Step 3b: Authentication gate (per-user Cognito login).
        // If auth is configured: capture any token returned from the Hosted UI
        // redirect, and if the user is not authenticated, send them to log in.
        this._authManager = new AuthManager(this._config.auth);
        this._authManager.captureTokenFromRedirect();
        if (this._authManager.isEnabled() && !this._authManager.isAuthenticated()) {
          console.log('[QuickSuite] Not authenticated; redirecting to login.');
          this._authManager.login();
          return; // navigation away; stop initialization
        }

        // Step 4: Parse deep link state (URL params + data attributes)
        this._deepLinkState = this._deepLinkParser.parse(this._container, this._config);

        // Step 5: Render navigation
        var self = this;
        this._navRenderer = new NavigationRenderer({
          container: this._container,
          config: this._config,
          onTabChange: function (tabId) { self._handleTabChange(tabId); },
          onSubItemChange: function (itemId) { self._handleSubItemChange(itemId); },
          onBreakpointChange: function () { self._handleBreakpointChange(); }
        });
        this._navRenderer.render();

        // Step 6: Initialize the embedding SDK context
        this._embedManager = new EmbedManager(this._config, this._container, this._errorHandler, this._authManager);
        await this._embedManager.init();

        // Step 6b: App-level filter bar. The widget renders its own filter bar
        // (below the navigation) in the widget-driven layout. In host-driven /
        // split-pane layouts (container marked data-no-chat-bubble) the host
        // page renders its own filter bar, so it is skipped here to avoid two.
        var hostDriven = this._container && this._container.hasAttribute('data-no-chat-bubble');
        if (!hostDriven && this._config.filters && this._config.filters.length) {
          var selF = this;
          this._filterBar = new FilterBar({
            container: this._container,
            config: this._config,
            getFrame: function () { return selF._embedManager.getDashboardFrame(); },
            getSheetId: function () { return selF._embedManager.getCurrentSheetId(); }
          });
          this._filterBar.mount();
        }

        // Step 6c: Chat panel. Mounted BEFORE the (slower) dashboard embed so it
        // appears immediately and its own embed loads in parallel — rather than
        // popping in several seconds after the dashboard. Skipped when the host
        // marks the container data-no-chat-bubble (split-pane handles chat).
        var noBubble = this._container && this._container.hasAttribute('data-no-chat-bubble');
        if (this._config.chatEnabled && !noBubble) {
          var self2 = this;
          var chatNav = this._config.navigation || {};
          var chatTabId = this._findChatTabId();
          var chatTitle = (chatTabId && chatNav[chatTabId] && chatNav[chatTabId].label) ? chatNav[chatTabId].label : 'Ask Analytics';
          this._chatBubble = new ChatBubble({
            container: this._container,
            config: this._config,
            title: chatTitle,
            onFirstOpen: function (panelInner, prompt) {
              return self2._embedManager.embedChatInto(panelInner, prompt);
            }
          });
          this._chatBubble.mount();
          // Auto-open beside the dashboard on desktop so the assistant is
          // immediately available. On narrow/mobile viewports the panel is
          // full-screen, so leave it as a launcher to avoid covering the dashboard.
          var isNarrow = (typeof window !== 'undefined' && window.innerWidth <= 768);
          if (!isNarrow) {
            var dlPrompt = (this._deepLinkState.view === 'chat') ? this._deepLinkState.prompt : null;
            this._chatBubble.open(dlPrompt);
          }
        }

        // Step 7: Resolve the initial dashboard tab. Chat is a floating bubble,
        // not a tab, so the active tab is always a dashboard tab.
        var navCfg = this._config.navigation || {};
        var initialTab = this._deepLinkState.tab;
        if (!initialTab || !navCfg[initialTab] || navCfg[initialTab].type === 'chat') {
          initialTab = this._firstDashboardTabId();
        }

        if (initialTab) {
          this._navRenderer.setActiveTab(initialTab, this._deepLinkState.item);
          await this._loadActiveView();
        } else {
          console.warn('[QuickSuite] No dashboard navigation tabs configured; nothing to render.');
        }

        // (The chat panel is mounted earlier, in Step 6c, so it appears without
        // waiting for the dashboard embed.)

        console.log('[QuickSuite] Widget initialized successfully.');

      } catch (err) {
        this._handleInitError(err);
      }
    }

    /**
     * Get the current embedded dashboard frame for host-page integration.
     * Use this to call setParameters(), setFilterValues(), etc.
     * @returns {object|null}
     */
    getDashboardFrame() {
      if (this._embedManager) {
        return this._embedManager.getDashboardFrame();
      }
      return null;
    }

    /**
     * Embed chat into an external container (for split-pane layouts).
     * Resilient to init timing: if the widget is still initializing when the
     * host page calls this, it waits (up to ~15s) for the embed manager
     * instead of silently doing nothing.
     * @param {HTMLElement} el - Target container
     * @param {string} [prompt] - Optional initial prompt
     * @returns {Promise<void>}
     */
    embedChatInto(el, prompt) {
      var self = this;
      if (this._embedManager) {
        return this._embedManager.embedChatInto(el, prompt);
      }
      return new Promise(function (resolve, reject) {
        var waited = 0;
        var timer = setInterval(function () {
          if (self._embedManager) {
            clearInterval(timer);
            resolve(self._embedManager.embedChatInto(el, prompt));
            return;
          }
          waited += 250;
          if (waited >= 15000) {
            clearInterval(timer);
            reject(new Error('[QuickSuite] Widget not initialized; cannot embed chat.'));
          }
        }, 250);
      });
    }

    /**
     * Show the branded loading/splash screen during initialization, honoring
     * the config's loadingScreen flag (Requirement 11.7). Capped at 5 seconds —
     * it is cleared as soon as the first view finishes loading.
     * @private
     */
    _showLoadingScreen() {
      if (this._config && this._config.loadingScreen === false) return;
      this._errorHandler.showLoading(this._container, 'Loading…');
    }

    /**
     * Load whichever view (dashboard sub-item or chat) is currently active
     * according to the navigation renderer and deep link state.
     * @private
     */
    async _loadActiveView() {
      var tabId = this._navRenderer.getActiveTab();
      if (!tabId) return;
      var tabConfig = this._config.navigation[tabId];
      if (!tabConfig) return;

      if (tabConfig.type === 'chat') {
        var prompt = (this._deepLinkState && this._deepLinkState.view === 'chat') ? this._deepLinkState.prompt : null;
        await this._embedManager.loadChat(prompt);
        return;
      }

      var subItemId = this._navRenderer.getActiveSubItem();
      var subItems = tabConfig.subItems || [];
      var subItem = subItems.filter(function (si) { return si.id === subItemId; })[0] || subItems[0];
      if (!subItem) {
        console.warn('[QuickSuite] Tab "' + tabId + '" has no sub-items to display.');
        return;
      }

      // Render the filter controls immediately (they are config-driven and do
      // not depend on the dashboard iframe), so the filter bar paints with the
      // navigation instead of only after the embed finishes loading.
      if (this._filterBar) this._filterBar.renderFor(subItem);

      await this._embedManager.loadDashboard(subItem.dashboardId, subItem.sheetId);

      // Now that the dashboard frame exists, apply the current selections to it
      // (scoped to this sheet). A no-op initially when nothing is selected.
      if (this._filterBar) this._filterBar.reconcile();

      // If the deep link included a chat prompt for a later chat visit, it is
      // consumed the first time the chat tab actually loads (see _handleTabChange).
    }

    /**
     * Handle a top-level navigation tab change triggered by the user.
     * @private
     */
    async _handleTabChange(tabId) {
      try {
        await this._loadActiveView();
      } catch (err) {
        console.error('[QuickSuite] Failed to load tab "' + tabId + '":', err.message);
      }
    }

    /**
     * Handle a secondary sub-navigation change triggered by the user.
     * @private
     */
    async _handleSubItemChange(itemId) {
      try {
        await this._loadActiveView();
      } catch (err) {
        console.error('[QuickSuite] Failed to load item "' + itemId + '":', err.message);
      }
    }

    /**
     * Handle the viewport crossing the mobile/desktop breakpoint: reload the
     * current view so the appropriate mobile/desktop sheet ID is used (Requirement 7.5).
     * @private
     */
    async _handleBreakpointChange() {
      try {
        await this._loadActiveView();
      } catch (err) {
        console.error('[QuickSuite] Failed to reload view after breakpoint change:', err.message);
      }
    }

    /**
     * Detect the container element. If not present at call time,
     * observe the DOM via MutationObserver for up to 10 seconds.
     * @private
     * @returns {Promise<HTMLElement|null>}
     */
    _detectContainer() {
      var containerId = 'quicksuite-widget-container'; // default

      // Check if container exists immediately
      var element = document.getElementById(containerId);
      if (element) {
        return Promise.resolve(element);
      }

      // Not found — observe DOM for up to 10 seconds
      return new Promise(function (resolve) {
        var timeoutMs = 10000;
        var observer = null;
        var timeoutId = null;

        function cleanup() {
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        }

        observer = new MutationObserver(function () {
          var el = document.getElementById(containerId);
          if (el) {
            cleanup();
            resolve(el);
          }
        });

        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });

        timeoutId = setTimeout(function () {
          cleanup();
          console.warn(
            '[QuickSuite] Container element with ID "' + containerId +
            '" not found within 10 seconds. Widget initialization aborted.'
          );
          resolve(null);
        }, timeoutMs);

        // One more check in case it appeared between getElementById and observer setup
        var recheckEl = document.getElementById(containerId);
        if (recheckEl) {
          cleanup();
          resolve(recheckEl);
        }
      });
    }

    /**
     * Find the first navigation tab of type "chat", if one exists.
     * @private
     * @returns {string|null}
     */
    _findChatTabId() {
      var navigation = this._config.navigation || {};
      var tabIds = Object.keys(navigation);
      for (var i = 0; i < tabIds.length; i++) {
        if (navigation[tabIds[i]].type === 'chat') {
          return tabIds[i];
        }
      }
      return null;
    }

    /**
     * Resolve config.json URL relative to the script's own URL.
     * @private
     * @returns {string}
     */
    _resolveConfigUrl() {
      var scriptUrl = '';
      if (document.currentScript) {
        scriptUrl = document.currentScript.src;
      } else {
        // Fallback: find the script tag by scanning all scripts
        var scripts = document.querySelectorAll('script[src]');
        for (var i = scripts.length - 1; i >= 0; i--) {
          if (scripts[i].src.indexOf('quicksuite-widget') !== -1) {
            scriptUrl = scripts[i].src;
            break;
          }
        }
      }

      var baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
      return baseUrl + 'config.json';
    }

    /**
     * Handle initialization errors by displaying inline messages.
     * @private
     */
    _handleInitError(err) {
      this._errorHandler.clear(this._container);
      if (err instanceof ConfigFetchError) {
        this._showInlineError('Configuration could not be loaded.');
      } else if (err instanceof ConfigValidationError) {
        this._showInlineError('Configuration is invalid. Check the browser console for details.');
      } else {
        console.error('[QuickSuite] Initialization error:', err.message);
        this._showInlineError('Widget initialization failed.');
      }
    }

    /**
     * Display an inline error message within the container div.
     * @private
     */
    _showInlineError(message) {
      if (!this._container) {
        console.error('[QuickSuite] ' + message);
        return;
      }

      var errorDiv = document.createElement('div');
      errorDiv.setAttribute('role', 'alert');
      errorDiv.setAttribute('aria-live', 'assertive');
      errorDiv.style.cssText =
        'padding: 16px; margin: 8px; border: 1px solid #dc2626; ' +
        'border-radius: 4px; background-color: #fef2f2; color: #991b1b; ' +
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; ' +
        'font-size: 14px; line-height: 1.5;';
      errorDiv.textContent = message;
      this._container.appendChild(errorDiv);
    }
  }

  // ---------------------------------------------------------------------------
  // NavigationRenderer — renders navigation tabs and sub-navigation
  // ---------------------------------------------------------------------------

  class NavigationRenderer {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.container - The widget container element
     * @param {Object} options.config - Validated widget configuration
     * @param {Function} options.onTabChange - Callback when a tab is selected
     * @param {Function} options.onSubItemChange - Callback when a sub-item is selected
     */
    constructor({ container, config, onTabChange, onSubItemChange, onBreakpointChange }) {
      this._container = container;
      this._config = config;
      this._onTabChange = onTabChange || function () {};
      this._onSubItemChange = onSubItemChange || function () {};
      this._onBreakpointChange = onBreakpointChange || function () {};
      this._activeTab = null;
      this._activeSubItem = null;
      this._navElement = null;
      this._subNavElement = null;
      this._wasMobile = this._isMobile();

      // Bind resize handler
      this._handleResizeBound = this._handleResize.bind(this);
      window.addEventListener('resize', this._handleResizeBound);
    }

    /**
     * @returns {string|null} The currently active tab ID
     */
    getActiveTab() {
      return this._activeTab;
    }

    /**
     * @returns {string|null} The currently active sub-item ID
     */
    getActiveSubItem() {
      return this._activeSubItem;
    }

    /**
     * Render the full navigation (header + tabs + sub-nav).
     */
    render() {
      // Remove existing nav if re-rendering
      if (this._navElement) {
        this._navElement.remove();
      }
      if (this._subNavElement) {
        this._subNavElement.remove();
      }

      var branding = this._config.branding || {};
      var primaryColor = this._isValidHex(branding.primaryColor) ? branding.primaryColor : '#6B7280';
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';

      // Set CSS custom properties on the container for scoped branding
      this._container.style.setProperty('--qs-primary', primaryColor);
      this._container.style.setProperty('--qs-secondary', secondaryColor);

      // Create navigation wrapper
      this._navElement = document.createElement('div');
      this._navElement.className = 'qs-nav';

      // Inject scoped styles
      var styleEl = document.createElement('style');
      styleEl.textContent = this._getScopedStyles();
      this._navElement.appendChild(styleEl);

      // Render logo + tabs header
      var headerEl = document.createElement('div');
      headerEl.className = 'qs-nav-header';
      headerEl.style.cssText = 'display:flex;align-items:center;background-color:' + primaryColor + ';padding:0 16px;min-height:48px;';

      // Logo
      if (branding.logoUrl) {
        var logoImg = document.createElement('img');
        logoImg.className = 'qs-nav-logo';
        logoImg.src = branding.logoUrl;
        logoImg.alt = 'Logo';
        logoImg.style.cssText = 'max-height:40px;width:auto;margin-right:16px;';
        logoImg.onerror = function () {
          logoImg.style.display = 'none';
        };
        headerEl.appendChild(logoImg);
      }

      // Tabs container
      var tabsContainer = document.createElement('div');
      tabsContainer.className = 'qs-nav-tabs';
      tabsContainer.style.cssText = 'display:flex;flex:1;overflow-x:auto;gap:4px;';

      this._renderTabs(tabsContainer, primaryColor, secondaryColor);
      headerEl.appendChild(tabsContainer);
      this._navElement.appendChild(headerEl);

      // Insert nav at the top of the container
      this._container.insertBefore(this._navElement, this._container.firstChild);

      // Render sub-nav for active tab
      if (this._activeTab) {
        this._renderSubNav(this._activeTab);
      }
    }

    /**
     * Set the active tab and update UI.
     * @param {string} tabId - The tab key to activate
     * @param {string} [initialSubItemId] - Optional sub-item ID to activate instead of the default (used for deep links)
     */
    setActiveTab(tabId, initialSubItemId) {
      if (!this._config.navigation || !this._config.navigation[tabId]) {
        return;
      }
      this._activeTab = tabId;
      this._activeSubItem = null;

      // Update tab active states
      this._updateTabActiveStates();

      // Render sub-nav for new tab
      this._renderSubNav(tabId);

      // Set default (or requested) sub-item if applicable
      var tabConfig = this._config.navigation[tabId];
      if (tabConfig.subItems && tabConfig.subItems.length > 0) {
        var subItemIds = tabConfig.subItems.map(function (si) { return si.id; });
        this._activeSubItem = (initialSubItemId && subItemIds.indexOf(initialSubItemId) !== -1)
          ? initialSubItemId
          : tabConfig.subItems[0].id;
        this._updateSubNavActiveStates();
      }
    }

    /**
     * Set the active sub-item and update UI.
     * @param {string} itemId - The sub-item ID to activate
     */
    setActiveSubItem(itemId) {
      this._activeSubItem = itemId;
      this._updateSubNavActiveStates();
    }

    /**
     * Render tab buttons into the given container.
     * @private
     */
    _renderTabs(tabsContainer, primaryColor, secondaryColor) {
      var self = this;
      var navigation = this._config.navigation || {};
      var tabKeys = Object.keys(navigation);
      var mobile = this._isMobile();

      tabKeys.forEach(function (tabId) {
        var tabConfig = navigation[tabId];

        // Skip hidden tabs
        if (tabConfig.hidden) {
          return;
        }

        // Chat is presented as a floating bubble, not a top-nav tab, so
        // chat-type entries never render in the tab bar.
        if (tabConfig.type === 'chat') {
          return;
        }

        var tabBtn = document.createElement('button');
        tabBtn.className = 'qs-nav-tab';
        tabBtn.setAttribute('data-tab-id', tabId);
        tabBtn.setAttribute('role', 'tab');
        tabBtn.setAttribute('aria-selected', tabId === self._activeTab ? 'true' : 'false');

        // Label (truncate to 40 chars)
        var label = (tabConfig.label || '').substring(0, 40);

        if (mobile) {
          // Mobile: icon-only or abbreviated labels
          if (tabConfig.icon) {
            tabBtn.textContent = tabConfig.icon;
            tabBtn.setAttribute('title', label);
            tabBtn.setAttribute('aria-label', label);
          } else {
            // Abbreviated: first 3 chars
            tabBtn.textContent = label.substring(0, 3);
            tabBtn.setAttribute('title', label);
            tabBtn.setAttribute('aria-label', label);
          }
        } else {
          // Desktop: show icon + full label
          var content = '';
          if (tabConfig.icon) {
            content = tabConfig.icon + ' ';
          }
          content += label;
          tabBtn.textContent = content;
        }

        // Styling
        var isActive = tabId === self._activeTab;
        tabBtn.style.cssText = 'border:none;cursor:pointer;padding:8px 16px;font-size:14px;font-family:inherit;border-radius:4px 4px 0 0;transition:background-color 0.2s;' +
          'background-color:' + (isActive ? secondaryColor : 'transparent') + ';' +
          'color:' + (isActive ? '#ffffff' : 'rgba(255,255,255,0.8)') + ';' +
          'font-weight:' + (isActive ? '600' : '400') + ';white-space:nowrap;';

        tabBtn.addEventListener('click', function () {
          self.setActiveTab(tabId);
          self._onTabChange(tabId);
        });

        tabsContainer.appendChild(tabBtn);
      });
    }

    /**
     * Render secondary sub-navigation for a tab.
     * @param {string} tabId - The tab key to render sub-nav for
     * @private
     */
    _renderSubNav(tabId) {
      // Remove existing sub-nav
      if (this._subNavElement) {
        this._subNavElement.remove();
        this._subNavElement = null;
      }

      var navigation = this._config.navigation || {};
      var tabConfig = navigation[tabId];
      if (!tabConfig || !tabConfig.subItems) {
        return;
      }

      // Only show sub-nav when tab has 2+ sub-items
      if (tabConfig.subItems.length < 2) {
        return;
      }

      // On mobile, respect mobileShowSubNav setting
      if (this._isMobile() && tabConfig.mobileShowSubNav === false) {
        return;
      }

      var branding = this._config.branding || {};
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';

      this._subNavElement = document.createElement('div');
      this._subNavElement.className = 'qs-sub-nav';
      this._subNavElement.style.cssText = 'display:flex;gap:4px;padding:4px 16px;background-color:#f3f4f6;border-bottom:1px solid #e5e7eb;overflow-x:auto;';
      this._subNavElement.setAttribute('role', 'tablist');
      this._subNavElement.setAttribute('aria-label', 'Sub-navigation');

      var self = this;
      tabConfig.subItems.forEach(function (item) {
        var itemBtn = document.createElement('button');
        itemBtn.className = 'qs-sub-nav-item';
        itemBtn.setAttribute('data-item-id', item.id);
        itemBtn.setAttribute('role', 'tab');
        itemBtn.setAttribute('aria-selected', item.id === self._activeSubItem ? 'true' : 'false');

        var itemLabel = (item.label || '').substring(0, 40);
        itemBtn.textContent = itemLabel;

        var isItemActive = item.id === self._activeSubItem;
        itemBtn.style.cssText = 'border:none;cursor:pointer;padding:6px 12px;font-size:13px;font-family:inherit;border-radius:4px;transition:background-color 0.2s;' +
          'background-color:' + (isItemActive ? secondaryColor : 'transparent') + ';' +
          'color:' + (isItemActive ? '#ffffff' : '#374151') + ';' +
          'font-weight:' + (isItemActive ? '600' : '400') + ';white-space:nowrap;';

        itemBtn.addEventListener('click', function () {
          self._activeSubItem = item.id;
          self._updateSubNavActiveStates();
          self._onSubItemChange(item.id);
        });

        self._subNavElement.appendChild(itemBtn);
      });

      // Insert after nav element
      if (this._navElement && this._navElement.nextSibling) {
        this._container.insertBefore(this._subNavElement, this._navElement.nextSibling);
      } else {
        this._container.appendChild(this._subNavElement);
      }
    }

    /**
     * Handle window resize — re-render if crossing the 768px breakpoint.
     * @private
     */
    _handleResize() {
      var isMobileNow = this._isMobile();
      if (isMobileNow !== this._wasMobile) {
        this._wasMobile = isMobileNow;
        this.render();

        // Restore active states after re-render
        if (this._activeTab) {
          this._updateTabActiveStates();
          this._renderSubNav(this._activeTab);
          if (this._activeSubItem) {
            this._updateSubNavActiveStates();
          }
        }

        // Notify caller so it can reload the dashboard using the sheet ID
        // appropriate for the new viewport classification (Requirement 7.5)
        this._onBreakpointChange(isMobileNow ? 'mobile' : 'desktop');
      }
    }

    /**
     * Returns true if viewport width is ≤768px.
     * @returns {boolean}
     * @private
     */
    _isMobile() {
      return window.innerWidth <= 768;
    }

    /**
     * Update visual active states on tab buttons.
     * @private
     */
    _updateTabActiveStates() {
      if (!this._navElement) return;

      var branding = this._config.branding || {};
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';
      var self = this;

      var tabs = this._navElement.querySelectorAll('.qs-nav-tab');
      tabs.forEach(function (tab) {
        var tabId = tab.getAttribute('data-tab-id');
        var isActive = tabId === self._activeTab;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.style.backgroundColor = isActive ? secondaryColor : 'transparent';
        tab.style.color = isActive ? '#ffffff' : 'rgba(255,255,255,0.8)';
        tab.style.fontWeight = isActive ? '600' : '400';
        // On mobile the tab bar scrolls horizontally; keep the active tab in view.
        if (isActive && self._isMobile() && typeof tab.scrollIntoView === 'function') {
          try { tab.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e) { /* non-fatal */ }
        }
      });
    }

    /**
     * Update visual active states on sub-nav buttons.
     * @private
     */
    _updateSubNavActiveStates() {
      if (!this._subNavElement) return;

      var branding = this._config.branding || {};
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';
      var self = this;

      var items = this._subNavElement.querySelectorAll('.qs-sub-nav-item');
      items.forEach(function (item) {
        var itemId = item.getAttribute('data-item-id');
        var isActive = itemId === self._activeSubItem;
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        item.style.backgroundColor = isActive ? secondaryColor : 'transparent';
        item.style.color = isActive ? '#ffffff' : '#374151';
        item.style.fontWeight = isActive ? '600' : '400';
      });
    }

    /**
     * Validate a hex color value.
     * @param {string} color
     * @returns {boolean}
     * @private
     */
    _isValidHex(color) {
      return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);
    }

    /**
     * Generate scoped CSS styles for the navigation.
     * All styles are scoped via class selectors within the container.
     * @returns {string}
     * @private
     */
    _getScopedStyles() {
      return [
        '.qs-nav { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
        '.qs-nav-header { box-sizing: border-box; }',
        '.qs-nav-tabs { scrollbar-width: thin; }',
        '.qs-nav-tabs::-webkit-scrollbar { height: 4px; }',
        '.qs-nav-tabs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }',
        '.qs-nav-tab:hover { opacity: 0.9; }',
        '.qs-nav-tab:focus { outline: 2px solid var(--qs-secondary, #3B82F6); outline-offset: 2px; }',
        '.qs-sub-nav { box-sizing: border-box; }',
        '.qs-sub-nav-item:hover { background-color: #e5e7eb !important; }',
        '.qs-sub-nav-item:focus { outline: 2px solid var(--qs-secondary, #3B82F6); outline-offset: 2px; }',
        '.qs-nav-logo { object-fit: contain; }'
      ].join('\n');
    }

    /**
     * Clean up event listeners.
     */
    destroy() {
      window.removeEventListener('resize', this._handleResizeBound);
      if (this._navElement) {
        this._navElement.remove();
      }
      if (this._subNavElement) {
        this._subNavElement.remove();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // SessionCache — manages embed URL caching in sessionStorage
  // ---------------------------------------------------------------------------

  class SessionCache {
    /**
     * @param {number} expirationMinutes - Max age of cached entries in minutes
     */
    constructor(expirationMinutes) {
      this._expirationMinutes = expirationMinutes || 30;
      this._prefix = 'qs_embed_';
    }

    /**
     * Retrieve a cached embed URL if it exists and is not expired.
     * @param {string} cacheKey - Identifier (e.g., dashboardId)
     * @returns {string|null} The cached URL or null if missing/expired
     */
    get(cacheKey) {
      try {
        var raw = sessionStorage.getItem(this._prefix + cacheKey);
        if (!raw) return null;
        var entry = JSON.parse(raw);
        if (this._isExpired(entry)) {
          sessionStorage.removeItem(this._prefix + cacheKey);
          return null;
        }
        return entry.url;
      } catch (e) {
        // sessionStorage unavailable or corrupt entry
        return null;
      }
    }

    /**
     * Store an embed URL with current timestamp.
     * @param {string} cacheKey - Identifier (e.g., dashboardId)
     * @param {string} url - The embed URL to cache
     */
    set(cacheKey, url) {
      try {
        var entry = {
          url: url,
          timestamp: Date.now()
        };
        sessionStorage.setItem(this._prefix + cacheKey, JSON.stringify(entry));
      } catch (e) {
        // sessionStorage full or unavailable — silently fail
        console.warn('[QuickSuite] SessionCache: unable to write to sessionStorage.');
      }
    }

    /**
     * Remove all qs_embed_ entries from sessionStorage.
     */
    clear() {
      try {
        var keysToRemove = [];
        for (var i = 0; i < sessionStorage.length; i++) {
          var key = sessionStorage.key(i);
          if (key && key.indexOf(this._prefix) === 0) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(function (key) {
          sessionStorage.removeItem(key);
        });
      } catch (e) {
        // sessionStorage unavailable
      }
    }

    /**
     * Check if a cache entry has expired.
     * @private
     * @param {Object} entry - { url, timestamp }
     * @returns {boolean}
     */
    _isExpired(entry) {
      if (!entry || !entry.timestamp) return true;
      var ageMs = Date.now() - entry.timestamp;
      var maxAgeMs = this._expirationMinutes * 60 * 1000;
      return ageMs >= maxAgeMs;
    }
  }

  // ---------------------------------------------------------------------------
  // EmbedManager — orchestrates QuickSight Embedding SDK interactions
  // ---------------------------------------------------------------------------

  class EmbedManager {
    /**
     * @param {Object} config - Validated widget configuration
     * @param {HTMLElement} container - Widget container element
     */
    constructor(config, container, errorHandler, authManager) {
      this._config = config;
      this._container = container;
      this._embeddingContext = null;
      this._dashboardEmbed = null;
      this._chatEmbed = null;
      this._currentDashboardId = null;
      this._currentSheetId = null;
      this._sessionCache = new SessionCache(
        (config.session && config.session.expirationMinutes) || 30
      );
      this._embedContainer = null;
      this._errorHandler = errorHandler || new ErrorHandler();
      this._authManager = authManager || null;
    }

    /**
     * Initialize the QuickSight Embedding SDK context.
     * Must be called before loadDashboard or loadChat.
     * @returns {Promise<void>}
     */
    async init() {
      if (typeof QuickSightEmbedding !== 'undefined' && QuickSightEmbedding.createEmbeddingContext) {
        this._embeddingContext = await QuickSightEmbedding.createEmbeddingContext();
      } else if (typeof window !== 'undefined' && window.QuickSightEmbedding && window.QuickSightEmbedding.createEmbeddingContext) {
        this._embeddingContext = await window.QuickSightEmbedding.createEmbeddingContext();
      } else {
        console.warn('[QuickSuite] QuickSight Embedding SDK not found. Embedding will not be available.');
      }
      this._ensureEmbedContainer();
    }

    /**
     * Load and embed a dashboard.
     * Uses cache when available; for same-dashboard/different-sheet navigation,
     * uses SDK setSelectedSheetId without fetching a new URL.
    /**
     * Get the current dashboard embed frame for host-page SDK interactions
     * (setParameters, setFilterValues, etc.).
     * @returns {object|null} The dashboard experience object, or null if no dashboard is embedded
     */
    getDashboardFrame() {
      return this._dashboardEmbed || null;
    }

    /**
     * @returns {string|null} the currently displayed (resolved) sheet id, used
     * by the widget's FilterBar to scope filter groups to the active sheet.
     */
    getCurrentSheetId() {
      return this._currentSheetId || null;
    }

    /**
     * Load and embed a QuickSight dashboard.
     * @param {string} dashboardId - QuickSight dashboard ID
     * @param {string} sheetId - Sheet ID to display
     * @returns {Promise<void>}
     */
    async loadDashboard(dashboardId, sheetId) {
      var self = this;
      var resolvedDashboardId = this._isMobile()
        ? this._getMobileId('dashboardId', dashboardId) || dashboardId
        : dashboardId;
      var resolvedSheetId = this._isMobile()
        ? this._getMobileId('sheetId', sheetId) || sheetId
        : sheetId;

      // Same dashboard, different sheet — use SDK navigation (no loading UI needed,
      // this is a fast in-place operation via the Embedding SDK)
      if (this._currentDashboardId === resolvedDashboardId && this._dashboardEmbed) {
        await this.navigateToSheet(resolvedSheetId);
        return;
      }

      this._errorHandler.showLoading(this._container, (this._config.loadingScreen === false) ? '' : 'Loading dashboard…');

      try {
        // Different dashboard — always fetch a FRESH embed URL.
        //
        // QuickSight embed URLs are single-use: once the Embedding SDK consumes
        // one to start a session it cannot be replayed (a reused URL fails with
        // "Embedding failed because of invalid URL or authorization code").
        // They are therefore never cached/reused across loads. In-session
        // navigation between sheets of the SAME dashboard uses the SDK's
        // setSelectedSheetId (handled above) and needs no new URL.
        var embedUrl = await this._errorHandler.withRetry(function () {
          return self._fetchEmbedUrl('/dashboard-embed', {
            dashboardId: resolvedDashboardId,
            sheetId: resolvedSheetId,
            sessionLifetimeInMinutes: (self._config.session && self._config.session.expirationMinutes) || 30,
            deviceType: self._isMobile() ? 'mobile' : 'desktop'
          });
        }, 'dashboard embed URL fetch');

        // Embed the dashboard
        this._setContainerHeight();
        this._errorHandler.clear(this._container);
        this._clearEmbedContainer();

        if (this._embeddingContext) {
          // Use an explicit pixel height (not '100%', which collapses when the
          // parent has no fixed height) plus resizeHeightOnSizeChangedEvent so
          // the iframe grows to fit the dashboard's content.
          // Single-sheet mode: hide QuickSight's native sheet tabs so the
          // widget's own sub-navigation is the sole sheet switcher. Sub-nav
          // clicks call setSelectedSheetId to swap the visible sheet in place
          // (no new embed URL — same dashboard).
          // Single-sheet display: render only the active sheet and hide
          // QuickSight's native sheet tab bar. The host page sidebar drives
          // sheet switching via setSelectedSheetId (which works in singleSheet
          // mode — it swaps the displayed sheet in place).
          // emitSizeChangedEventOnSheetChange makes the SDK re-emit SIZE_CHANGED
          // when the active sheet changes, so the iframe re-fits to each sheet's
          // content height (works with resizeHeightOnSizeChangedEvent below).
          var contentOptions = { sheetOptions: { singleSheet: true, emitSizeChangedEventOnSheetChange: true } };
          if (resolvedSheetId) {
            contentOptions.sheetOptions.initialSheetId = resolvedSheetId;
          }
          this._dashboardEmbed = await this._embeddingContext.embedDashboard({
            url: embedUrl,
            container: this._embedContainer,
            height: this._isMobile() ? '600px' : '920px',
            width: '100%',
            withIframePlaceholder: false,
            resizeHeightOnSizeChangedEvent: true
          }, contentOptions);
          this._attachSdkErrorLogging(this._dashboardEmbed);
          // Ensure the requested sheet is shown (also switches the single sheet
          // if the SDK loaded a different default).
          if (resolvedSheetId && typeof this._dashboardEmbed.setSelectedSheetId === 'function') {
            try { await this._dashboardEmbed.setSelectedSheetId(resolvedSheetId); } catch (e) { /* sheet select is best-effort */ }
          }
        } else {
          this._errorHandler.clear(this._container);
        }

        this._currentDashboardId = resolvedDashboardId;
        this._currentSheetId = resolvedSheetId;
      } catch (err) {
        this._handleLoadError(err, function () { self.loadDashboard(dashboardId, sheetId); });
      }
    }

    /**
     * Load and embed the Q&A chat experience.
     * @returns {Promise<void>}
     */
    async loadChat(initialPrompt) {
      var self = this;
      this._errorHandler.showLoading(this._container, (this._config.loadingScreen === false) ? '' : 'Loading chat…');

      try {
        var embedUrl = await this._errorHandler.withRetry(function () {
          return self._fetchEmbedUrl('/chat-embed', {
            sessionLifetimeInMinutes: (self._config.session && self._config.session.expirationMinutes) || 15,
            deviceType: self._isMobile() ? 'mobile' : 'desktop'
          });
        }, 'chat embed URL fetch');

        this._setContainerHeight();
        this._errorHandler.clear(this._container);
        this._clearEmbedContainer();

        if (this._embeddingContext) {
          // QuickChat (agent-based) experience — uses the furniture-operations-assistant agent.
          if (typeof this._embeddingContext.embedQuickChat !== 'function') {
            throw new Error('[QuickSuite] QuickSight Embedding SDK does not support embedQuickChat; upgrade the SDK to 2.11.3+.');
          }
          var chatContentOptions = {
            agentOptions: {
              // Configurable via config.chat.agentId; falls back to the sample agent.
              fixedAgentId: (this._config.chat && this._config.chat.agentId) || 'furniture-operations-assistant'
            },
            promptOptions: {
              showWebSearch: true,
              showChatHistory: true,
              showPromptArea: true,
              allowFileAttachments: true,
              enablePrivateMode: false
            },
            footerOptions: {
              showBrandAttribution: true,
              showUsagePolicy: true
            }
          };
          if (initialPrompt) {
            chatContentOptions.promptOptions.initialPrompt = initialPrompt;
            chatContentOptions.promptOptions.showInitialPromptMessage = true;
          }
          this._chatEmbed = await this._embeddingContext.embedQuickChat({
            url: embedUrl,
            container: this._embedContainer,
            height: this._isMobile() ? '600px' : '920px',
            width: '100%',
            withIframePlaceholder: false,
            resizeHeightOnSizeChangedEvent: true
          }, chatContentOptions);
          this._attachSdkErrorLogging(this._chatEmbed);
        } else {
          this._errorHandler.clear(this._container);
        }

        // Clear dashboard tracking since we switched to chat
        this._currentDashboardId = null;
        this._currentSheetId = null;
      } catch (err) {
        this._handleLoadError(err, function () { self.loadChat(initialPrompt); });
      }
    }

    /**
     * Embed the generative Q&A chat into an arbitrary container element
     * (used by the floating ChatBubble panel). Unlike loadChat, this does NOT
     * touch the main dashboard embed container, so the dashboard stays visible
     * behind the chat panel.
     * @param {HTMLElement} targetEl - element to embed the chat iframe into
     * @param {string} [initialPrompt] - optional prompt to pre-fill (not submitted)
     * @returns {Promise<void>}
     */
    async embedChatInto(targetEl, initialPrompt) {
      if (!targetEl) return;
      var self = this;
      this._errorHandler.showLoading(targetEl, (this._config.loadingScreen === false) ? '' : 'Loading chat…');

      try {
        var embedUrl = await this._errorHandler.withRetry(function () {
          return self._fetchEmbedUrl('/chat-embed', {
            sessionLifetimeInMinutes: (self._config.session && self._config.session.expirationMinutes) || 15,
            deviceType: self._isMobile() ? 'mobile' : 'desktop'
          });
        }, 'chat embed URL fetch');

        this._errorHandler.clear(targetEl);
        targetEl.innerHTML = '';

        if (this._embeddingContext) {
          if (typeof this._embeddingContext.embedQuickChat !== 'function') {
            throw new Error('[QuickSuite] QuickSight Embedding SDK does not support embedQuickChat; upgrade the SDK to 2.11.3+.');
          }
          var chatContentOptions = {
            agentOptions: {
              // Configurable via config.chat.agentId; falls back to the sample agent.
              fixedAgentId: (this._config.chat && this._config.chat.agentId) || 'furniture-operations-assistant'
            },
            promptOptions: {
              showWebSearch: true,
              showChatHistory: true,
              showPromptArea: true,
              allowFileAttachments: true,
              enablePrivateMode: false
            },
            footerOptions: {
              showBrandAttribution: true,
              showUsagePolicy: true
            }
          };
          if (initialPrompt) {
            chatContentOptions.promptOptions.initialPrompt = initialPrompt;
            chatContentOptions.promptOptions.showInitialPromptMessage = true;
          }
          this._chatEmbed = await this._embeddingContext.embedQuickChat({
            url: embedUrl,
            container: targetEl,
            height: '100%',
            width: '100%',
            withIframePlaceholder: false,
            resizeHeightOnSizeChangedEvent: false
          }, chatContentOptions);
          this._attachSdkErrorLogging(this._chatEmbed);
        }
      } catch (err) {
        this._handleChatError(err, targetEl, function () { self.embedChatInto(targetEl, initialPrompt); });
      }
    }

    /**
     * Render a chat load failure into the chat panel container: a busy state
     * with countdown for pool exhaustion (503), otherwise the configured/
     * default error message with a Retry button.
     * @private
     */
    _handleChatError(err, targetEl, retryFn) {
      console.error('[QuickSuite] Chat embed failed:', err && err.message);
      if (err instanceof PoolExhaustedError) {
        var remaining = err.retryAfterSeconds || 60;
        var self = this;
        var render = function () {
          self._errorHandler.showError(targetEl, 'Chat is busy, retrying in ' + remaining + 's…',
            { showRetryButton: true, retryLabel: 'Retry now', onRetry: function () { clearInterval(t); retryFn(); } });
        };
        render();
        var t = setInterval(function () {
          remaining -= 1;
          if (remaining <= 0) { clearInterval(t); retryFn(); return; }
          render();
        }, 1000);
        return;
      }
      var message = this._config.errorMessage || 'The chat service is temporarily unavailable. Please try again later.';
      this._errorHandler.showError(targetEl, message, {
        showRetryButton: this._config.fallbackMode !== false,
        onRetry: retryFn
      });
    }

    /**
     * Translate a load failure into the appropriate user-facing state:
     * pool-busy countdown, auth failure message, or the configured/default
     * error message with an optional Retry button (Requirements 9.2, 9.3, 4.6).
     * @private
     */
    _handleLoadError(err, retryFn) {
      console.error('[QuickSuite] Embed load failed:', err && err.message);

      if (err instanceof PoolExhaustedError) {
        this._showBusyState(err.retryAfterSeconds, retryFn);
        return;
      }

      if (err instanceof EmbedAuthError) {
        // With Cognito auth, an auth failure usually means the id token expired.
        // Send the user back through the Hosted UI to re-authenticate.
        if (this._authManager && this._authManager.isEnabled()) {
          console.log('[QuickSuite] Auth failed (token likely expired); redirecting to login.');
          this._authManager.login();
          return;
        }
        this._errorHandler.showError(this._container, 'Session could not be authenticated.');
        return;
      }

      var message = this._config.errorMessage || 'The service is temporarily unavailable. Please try again later.';
      this._errorHandler.showError(this._container, message, {
        showRetryButton: this._config.fallbackMode !== false,
        onRetry: retryFn
      });
    }

    /**
     * Show a busy state with a countdown, per Requirement 4.6 (503 pool exhausted).
     * @private
     */
    _showBusyState(retryAfterSeconds, retryFn) {
      var self = this;
      var remaining = retryAfterSeconds;
      var render = function () {
        self._errorHandler.showError(
          self._container,
          'Service is busy, retrying in ' + remaining + 's…',
          { showRetryButton: true, onRetry: function () { clearInterval(intervalId); retryFn(); }, retryLabel: 'Retry now' }
        );
      };
      render();
      var intervalId = setInterval(function () {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(intervalId);
          retryFn();
          return;
        }
        render();
      }, 1000);
    }

    /**
     * Navigate to a different sheet within the currently embedded dashboard.
     * Uses SDK's setSelectedSheetId — no new embed URL needed.
     * @param {string} sheetId - Target sheet ID
     * @returns {Promise<void>}
     */
    async navigateToSheet(sheetId) {
      if (this._dashboardEmbed && typeof this._dashboardEmbed.setSelectedSheetId === 'function') {
        await this._dashboardEmbed.setSelectedSheetId(sheetId);
        this._currentSheetId = sheetId;
        // Re-fit the iframe to the new sheet's content height. The SDK's
        // SIZE_CHANGED-on-sheet-change is unreliable cross-origin, so force a
        // few re-measures as the new sheet renders and its height settles.
        this._nudgeResize();
      } else {
        console.warn('[QuickSuite] Cannot navigate to sheet: no active dashboard embed.');
      }
    }

    /**
     * Force the QuickSight iframe to re-measure and re-fit its height.
     * A brief width toggle triggers the embedded app's ResizeObserver, which
     * makes QuickSight re-emit SIZE_CHANGED so resizeHeightOnSizeChangedEvent
     * updates the iframe height. Runs a few times because the new sheet's
     * final height isn't known until it finishes rendering.
     * @private
     */
    _nudgeResize() {
      var self = this;
      var toggle = function () {
        try {
          var frame = self._embedContainer && self._embedContainer.querySelector('iframe');
          if (!frame) return;
          var origW = frame.style.width || '100%';
          frame.style.width = '99.9%';
          requestAnimationFrame(function () { frame.style.width = origW; });
        } catch (e) { /* best-effort */ }
      };
      toggle();
      setTimeout(toggle, 350);
      setTimeout(toggle, 900);
      setTimeout(toggle, 1600);
    }

    /**
     * Fetch an embed URL from the backend.
     * On 401/403: clear cache, retry once. If retry fails, show auth error.
     * @private
     * @param {string} path - API path (e.g., '/dashboard-embed')
     * @param {Object} body - Request body
     * @returns {Promise<string>} The embed URL
     */
    async _fetchEmbedUrl(path, body) {
      var apiEndpoint = this._config.apiEndpoint;
      var url = apiEndpoint.replace(/\/$/, '') + path;
      var self = this;
      var retried = false;

      async function doFetch() {
        var headers = { 'Content-Type': 'application/json' };
        // Attach the Cognito id token so the backend embeds as this user.
        if (self._authManager && self._authManager.getIdToken) {
          var token = self._authManager.getIdToken();
          if (token) {
            headers['Authorization'] = 'Bearer ' + token;
          }
        }

        var response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        });

        if (response.status === 401 || response.status === 403) {
          if (!retried) {
            retried = true;
            self._sessionCache.clear();
            return doFetch();
          }
          throw new EmbedAuthError('Session could not be authenticated.');
        }

        if (response.status === 503) {
          var retryAfterHeader = (response.headers && typeof response.headers.get === 'function')
            ? response.headers.get('Retry-After')
            : null;
          var retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
          throw new PoolExhaustedError('Service is busy.', isNaN(retryAfterSeconds) ? 60 : retryAfterSeconds);
        }

        if (!response.ok) {
          var httpErr = new Error('[QuickSuite] Embed URL fetch failed: HTTP ' + response.status);
          httpErr.statusCode = response.status;
          throw httpErr;
        }

        var data = await response.json();
        return data.embedUrl || data.EmbedUrl || '';
      }

      return doFetch();
    }

    /**
     * Check if the viewport is classified as mobile (≤768px).
     * @returns {boolean}
     */
    _isMobile() {
      if (typeof window === 'undefined') return false;
      return window.innerWidth <= 768;
    }

    /**
     * Resolve mobile-specific IDs from the active navigation item context.
     * Looks through config navigation for matching standard IDs and returns mobile variants.
     * @private
     * @param {string} idType - 'dashboardId' or 'sheetId'
     * @param {string} standardId - The standard (desktop) ID
     * @returns {string|null} Mobile ID if found, null otherwise
     */
    _getMobileId(idType, standardId) {
      var navigation = this._config.navigation;
      if (!navigation) return null;
      var mobileKey = idType === 'dashboardId' ? 'mobileDashboardId' : 'mobileSheetId';
      var tabKeys = Object.keys(navigation);
      for (var i = 0; i < tabKeys.length; i++) {
        var tab = navigation[tabKeys[i]];
        if (!tab.subItems) continue;
        for (var j = 0; j < tab.subItems.length; j++) {
          var item = tab.subItems[j];
          if (item[idType] === standardId && item[mobileKey]) {
            return item[mobileKey];
          }
        }
      }
      return null;
    }

    /**
     * Set minimum container height based on viewport classification.
     * Mobile: 600px, Desktop: 920px.
     * @private
     */
    _setContainerHeight() {
      if (!this._embedContainer) return;
      var minHeight = this._isMobile() ? '600px' : '920px';
      this._embedContainer.style.minHeight = minHeight;
    }

    /**
     * Ensure the embed sub-container exists within the widget container.
     * @private
     */
    _ensureEmbedContainer() {
      if (this._embedContainer) return;
      this._embedContainer = document.createElement('div');
      this._embedContainer.className = 'qs-embed-frame';
      this._embedContainer.style.width = '100%';
      this._embedContainer.style.position = 'relative';
      this._container.appendChild(this._embedContainer);
    }

    /**
     * Clear the embed container's children for re-embedding.
     * @private
     */
    _clearEmbedContainer() {
      if (!this._embedContainer) return;
      this._embedContainer.innerHTML = '';
      this._dashboardEmbed = null;
      this._chatEmbed = null;
    }

    /**
     * Attach an error listener to a QuickSight embed instance, logging
     * SDK rendering errors (error type + message) to the console (Requirement 9.5).
     * @private
     */
    _attachSdkErrorLogging(embedInstance) {
      if (!embedInstance || typeof embedInstance.on !== 'function') return;
      embedInstance.on('error', function (payload) {
        var errorType = (payload && (payload.errorType || payload.eventName)) || 'unknown';
        var message = (payload && (payload.message || JSON.stringify(payload))) || 'No details provided';
        console.error('[QuickSuite] Embedding SDK rendering error — type: ' + errorType + ', message: ' + message);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // EmbedAuthError — thrown when auth retry fails
  // ---------------------------------------------------------------------------

  class EmbedAuthError extends Error {
    constructor(message) {
      super(message);
      this.name = 'EmbedAuthError';
    }
  }

  /**
   * Thrown when an operation exceeds its allotted time budget.
   */
  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = 'TimeoutError';
    }
  }

  /**
   * Thrown when the backend returns HTTP 503 because the chat user pool
   * is exhausted (all registered users have an active session).
   */
  class PoolExhaustedError extends Error {
    constructor(message, retryAfterSeconds) {
      super(message);
      this.name = 'PoolExhaustedError';
      this.retryAfterSeconds = retryAfterSeconds || 60;
    }
  }

  // ---------------------------------------------------------------------------
  // ErrorHandler — loading/error UI and exponential backoff retry logic
  // ---------------------------------------------------------------------------

  class ErrorHandler {
    /**
     * @param {Object} [options]
     * @param {number} [options.maxRetries=3] - Max retry attempts
     * @param {number[]} [options.delays=[1000,2000,4000]] - Delay before each retry (ms)
     * @param {number} [options.attemptTimeoutMs=10000] - Per-attempt timeout (ms)
     */
    constructor(options) {
      options = options || {};
      this._maxRetries = options.maxRetries != null ? options.maxRetries : 3;
      this._delays = options.delays || [1000, 2000, 4000];
      this._attemptTimeoutMs = options.attemptTimeoutMs || 10000;
      this._loadingEl = null;
    }

    /**
     * Display a visible loading indicator within the container.
     * @param {HTMLElement} container
     * @param {string} [message]
     */
    showLoading(container, message) {
      if (!container) return;
      this.clear(container);
      var div = document.createElement('div');
      div.className = 'qs-loading';
      div.setAttribute('role', 'status');
      div.setAttribute('aria-live', 'polite');
      div.style.cssText =
        'display:flex;align-items:center;justify-content:center;padding:32px;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'color:#374151;font-size:14px;min-height:200px;';
      div.textContent = message || 'Loading…';
      container.appendChild(div);
      this._loadingEl = div;
    }

    /**
     * Remove any loading indicator or error message currently shown.
     * @param {HTMLElement} container
     */
    clear(container) {
      if (this._loadingEl && this._loadingEl.parentNode) {
        this._loadingEl.parentNode.removeChild(this._loadingEl);
      }
      this._loadingEl = null;
      if (container && typeof container.querySelectorAll === 'function') {
        var existing = container.querySelectorAll('.qs-loading, .qs-error');
        existing.forEach(function (el) {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      }
    }

    /**
     * Display an error message within the container, optionally with a Retry button.
     * @param {HTMLElement} container
     * @param {string} message
     * @param {Object} [options]
     * @param {boolean} [options.showRetryButton]
     * @param {Function} [options.onRetry]
     * @param {string} [options.retryLabel]
     */
    showError(container, message, options) {
      if (!container) return;
      options = options || {};
      this.clear(container);

      var wrapper = document.createElement('div');
      wrapper.className = 'qs-error';
      wrapper.setAttribute('role', 'alert');
      wrapper.setAttribute('aria-live', 'assertive');
      wrapper.style.cssText =
        'padding:24px;margin:8px;border:1px solid #dc2626;border-radius:4px;' +
        'background-color:#fef2f2;color:#991b1b;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'font-size:14px;line-height:1.5;text-align:center;min-height:200px;' +
        'display:flex;flex-direction:column;align-items:center;justify-content:center;';

      var msgEl = document.createElement('div');
      msgEl.textContent = message;
      wrapper.appendChild(msgEl);

      if (options.showRetryButton && typeof options.onRetry === 'function') {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = options.retryLabel || 'Retry';
        btn.style.cssText =
          'margin-top:12px;padding:8px 20px;border:none;border-radius:4px;' +
          'background-color:#991b1b;color:#ffffff;cursor:pointer;font-size:14px;';
        btn.addEventListener('click', options.onRetry);
        wrapper.appendChild(btn);
      }

      container.appendChild(wrapper);
    }

    /**
     * Run an operation with a per-attempt timeout and exponential backoff retry.
     * Retries on TimeoutError or 5xx HTTP errors. Non-retryable errors
     * (auth failures, pool exhaustion, config errors, 4xx) are rethrown immediately.
     *
     * @param {Function} operation - Function returning a Promise
     * @param {string} [name] - Label used in timeout error messages
     * @param {Object} [options] - Override constructor defaults for this call
     * @returns {Promise<any>}
     */
    async withRetry(operation, name, options) {
      options = options || {};
      var maxRetries = options.maxRetries != null ? options.maxRetries : this._maxRetries;
      var delays = options.delays || this._delays;
      var attemptTimeoutMs = options.attemptTimeoutMs || this._attemptTimeoutMs;

      var attempt = 0;
      var lastError = null;

      while (attempt <= maxRetries) {
        try {
          return await this._withTimeout(operation, attemptTimeoutMs, name);
        } catch (err) {
          lastError = err;
          if (this.isNonRetryableError(err) || attempt === maxRetries) {
            throw err;
          }
          var delay = delays[attempt] != null ? delays[attempt] : delays[delays.length - 1];
          await this._sleep(delay);
          attempt++;
        }
      }

      throw lastError;
    }

    /**
     * Race an operation against a timeout.
     * @private
     */
    _withTimeout(operation, timeoutMs, name) {
      return new Promise(function (resolve, reject) {
        var settled = false;
        var timer = setTimeout(function () {
          if (settled) return;
          settled = true;
          reject(new TimeoutError('[QuickSuite] ' + (name || 'Operation') + ' timed out after ' + timeoutMs + 'ms'));
        }, timeoutMs);

        Promise.resolve()
          .then(operation)
          .then(function (result) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(result);
          })
          .catch(function (err) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            reject(err);
          });
      });
    }

    /** @private */
    _sleep(ms) {
      return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    /**
     * Determine whether an error should NOT be retried.
     * Auth failures, pool exhaustion, config errors, and 4xx responses are
     * non-retryable. Timeouts and 5xx responses (and unknown/network errors) are retryable.
     * @param {Error} error
     * @returns {boolean}
     */
    isNonRetryableError(error) {
      if (!error) return false;
      if (error instanceof EmbedAuthError) return true;
      if (error instanceof PoolExhaustedError) return true;
      if (error instanceof ConfigValidationError) return true;
      if (error instanceof ConfigFetchError) return true;
      if (error instanceof TimeoutError) return false;
      if (typeof error.statusCode === 'number') {
        return error.statusCode < 500;
      }
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // FilterBar — widget-rendered app-level filter controls
  // ---------------------------------------------------------------------------

  /**
   * Renders an app-level filter bar (multi-select + date-range controls) beneath
   * the widget's navigation and applies the selections as QuickSight SDK filter
   * groups scoped to the currently displayed sheet. Selections are preserved
   * across sheets; each sheet shows only the filters listed in its config
   * (subItem.filters, or all filters when unspecified), and a filter's selection
   * carries over to any other sheet that also enables it.
   *
   * This is the WIDGET-DRIVEN filter bar: the widget owns navigation and renders
   * the filters itself (the classic top-nav layout). In host-driven/split-pane
   * layouts (container marked data-no-chat-bubble) the host page renders its own
   * filter bar, so this is not mounted there.
   *
   * All styles are scoped to qs-flt-* classes injected inside the container.
   */
  class FilterBar {
    /**
     * @param {Object} opts
     * @param {HTMLElement} opts.container - widget container element
     * @param {Object} opts.config - validated widget config
     * @param {Function} opts.getFrame - fn() -> current dashboard embed frame (or null)
     * @param {Function} opts.getSheetId - fn() -> currently displayed (resolved) sheet id
     */
    constructor(opts) {
      opts = opts || {};
      this._container = opts.container;
      this._config = opts.config || {};
      this._getFrame = opts.getFrame || function () { return null; };
      this._getSheetId = opts.getSheetId || function () { return null; };
      this._bar = null;
      this._currentSubItem = null;
      this._filtersById = {};
      this._filterState = {};
      this._datasetDefault = this._config.datasetIdentifier || '';
      this._reconciling = false;
      this._reconcilePending = false;
      this._reconcileRetries = 0;

      var self = this;
      (this._config.filters || []).forEach(function (f) {
        var id = f.id || f.column;
        f.__id = id;
        self._filtersById[id] = f;
        self._filterState[id] = { values: [], start: '', end: '', label: '' };
      });

      this._onDocClickBound = this._onDocClick.bind(this);
    }

    /** @returns {boolean} at least one filter is configured. */
    hasFilters() {
      return !!(this._config.filters && this._config.filters.length);
    }

    /** Inject scoped styles + the (initially empty) bar above the embed frame. */
    mount() {
      if (this._bar || !this.hasFilters()) return;

      var style = document.createElement('style');
      style.textContent = this._scopedCss();

      this._bar = document.createElement('div');
      this._bar.className = 'qs-flt-bar';
      this._bar.setAttribute('role', 'group');
      this._bar.setAttribute('aria-label', 'Filters');
      this._bar.appendChild(style);

      // Insert above the embed frame (created by EmbedManager.init()), so the
      // order is nav -> sub-nav -> filter bar -> dashboard.
      var frame = this._container.querySelector('.qs-embed-frame');
      if (frame) {
        this._container.insertBefore(this._bar, frame);
      } else {
        this._container.appendChild(this._bar);
      }

      document.addEventListener('click', this._onDocClickBound);
    }

    /** Filter defs enabled for a sub-item, in config order (all if unspecified). */
    _enabledFiltersFor(subItem) {
      var all = this._config.filters || [];
      if (!subItem || !Array.isArray(subItem.filters)) return all;
      var self = this;
      return subItem.filters.map(function (id) { return self._filtersById[id]; }).filter(Boolean);
    }

    /**
     * (Re)render the controls for a sub-item (sheet), restoring current
     * selections. Only the filters enabled for that sheet are shown.
     * @param {Object} subItem - the active navigation sub-item (sheet) config
     */
    renderFor(subItem) {
      if (!this._bar) return;
      this._currentSubItem = subItem;

      // Clear controls but keep the injected <style>.
      var style = this._bar.querySelector('style');
      this._bar.innerHTML = '';
      if (style) this._bar.appendChild(style);

      var defs = this._enabledFiltersFor(subItem);
      if (!defs.length) { this._bar.style.display = 'none'; return; }
      this._bar.style.display = '';

      var label = document.createElement('span');
      label.className = 'qs-flt-label';
      label.textContent = 'Filters';
      this._bar.appendChild(label);

      var self = this;
      defs.forEach(function (def) {
        var type = def.type || 'multiselect';
        self._bar.appendChild(type === 'daterange' ? self._buildDateControl(def) : self._buildMultiSelectControl(def));
      });
    }

    // ---- Multi-select (category) control ----
    _buildMultiSelectControl(def) {
      var self = this;
      var id = def.__id;
      var group = document.createElement('div');
      group.className = 'qs-flt-group';

      var glabel = document.createElement('span');
      glabel.className = 'qs-flt-glabel';
      glabel.textContent = def.label;
      group.appendChild(glabel);

      var ms = document.createElement('div');
      ms.className = 'qs-flt-ms';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-flt-btn';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      this._updateMsButtonLabel(btn, def);
      btn.onclick = function (e) {
        e.stopPropagation();
        var open = ms.classList.toggle('qs-open');
        btn.setAttribute('aria-expanded', String(open));
        self._closeOthers(ms);
      };
      ms.appendChild(btn);

      var pop = document.createElement('div');
      pop.className = 'qs-flt-pop';

      (def.options || []).forEach(function (opt) {
        var row = document.createElement('label');
        row.className = 'qs-flt-row';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = opt;
        cb.checked = self._filterState[id].values.indexOf(opt) !== -1;
        cb.onchange = function () {
          var vals = self._filterState[id].values;
          if (cb.checked) { if (vals.indexOf(opt) === -1) vals.push(opt); }
          else { var ix = vals.indexOf(opt); if (ix !== -1) vals.splice(ix, 1); }
          self._updateMsButtonLabel(btn, def);
          self.reconcile();
        };
        var txt = document.createElement('span');
        txt.textContent = opt;
        row.appendChild(cb);
        row.appendChild(txt);
        pop.appendChild(row);
      });

      var clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'qs-flt-clear';
      clear.textContent = def.allLabel || 'All';
      clear.onclick = function () {
        self._filterState[id].values = [];
        var boxes = pop.querySelectorAll('input[type=checkbox]');
        for (var i = 0; i < boxes.length; i++) boxes[i].checked = false;
        self._updateMsButtonLabel(btn, def);
        self.reconcile();
      };
      pop.appendChild(clear);

      ms.appendChild(pop);
      group.appendChild(ms);
      return group;
    }

    _updateMsButtonLabel(btn, def) {
      var vals = this._filterState[def.__id].values;
      if (!vals.length) btn.textContent = def.allLabel || 'All';
      else if (vals.length === 1) btn.textContent = vals[0];
      else btn.textContent = vals.length + ' selected';
    }

    // ---- Date-range control (presets + custom From/To in one popover) ----
    _buildDateControl(def) {
      var self = this;
      var id = def.__id;
      var group = document.createElement('div');
      group.className = 'qs-flt-group';
      var glabel = document.createElement('span');
      glabel.className = 'qs-flt-glabel';
      glabel.textContent = def.label;
      group.appendChild(glabel);

      var ms = document.createElement('div');
      ms.className = 'qs-flt-ms';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-flt-btn';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.onclick = function (e) {
        e.stopPropagation();
        var open = ms.classList.toggle('qs-open');
        btn.setAttribute('aria-expanded', String(open));
        self._closeOthers(ms);
      };
      ms.appendChild(btn);

      var pop = document.createElement('div');
      pop.className = 'qs-flt-pop qs-flt-date-pop';

      var from = document.createElement('input');
      from.type = 'date'; from.className = 'qs-flt-date-input';
      from.setAttribute('aria-label', def.label + ' from');
      var to = document.createElement('input');
      to.type = 'date'; to.className = 'qs-flt-date-input';
      to.setAttribute('aria-label', def.label + ' to');
      if (def.min) { from.min = def.min; to.min = def.min; }
      if (def.max) { from.max = def.max; to.max = def.max; }

      function syncInputs() {
        var st = self._filterState[id];
        from.value = st.start || '';
        to.value = st.end || '';
        self._updateDateLabel(btn, def);
      }

      var presets = def.presets || [
        { label: 'Last 7 days', n: 7, unit: 'day' },
        { label: 'Last 30 days', n: 30, unit: 'day' },
        { label: 'Last 3 months', n: 3, unit: 'month' },
        { label: 'Last 12 months', n: 12, unit: 'month' }
      ];
      var presetWrap = document.createElement('div');
      presetWrap.className = 'qs-flt-date-presets';
      presets.forEach(function (p) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'qs-flt-date-preset'; b.textContent = p.label;
        b.onclick = function () {
          var r = self._computeRelativeRange(p.n, p.unit);
          self._applyDateRange(def, r.start, r.end, p.label);
          syncInputs();
        };
        presetWrap.appendChild(b);
      });
      pop.appendChild(presetWrap);

      var rangeWrap = document.createElement('div');
      rangeWrap.className = 'qs-flt-date-range';
      var fromField = document.createElement('label'); fromField.className = 'qs-flt-date-field';
      var fromSpan = document.createElement('span'); fromSpan.textContent = 'From';
      fromField.appendChild(fromSpan); fromField.appendChild(from);
      var toField = document.createElement('label'); toField.className = 'qs-flt-date-field';
      var toSpan = document.createElement('span'); toSpan.textContent = 'To';
      toField.appendChild(toSpan); toField.appendChild(to);
      rangeWrap.appendChild(fromField);
      rangeWrap.appendChild(toField);
      pop.appendChild(rangeWrap);

      from.onchange = function () { self._applyDateRange(def, from.value, self._filterState[id].end, null); self._updateDateLabel(btn, def); };
      to.onchange = function () { self._applyDateRange(def, self._filterState[id].start, to.value, null); self._updateDateLabel(btn, def); };

      var clear = document.createElement('button');
      clear.type = 'button'; clear.className = 'qs-flt-clear';
      clear.textContent = def.allLabel || 'All dates';
      clear.onclick = function () { self._applyDateRange(def, '', '', null); syncInputs(); };
      pop.appendChild(clear);

      ms.appendChild(pop);
      group.appendChild(ms);
      syncInputs();
      return group;
    }

    _computeRelativeRange(n, unit) {
      var end = new Date();
      var start = new Date();
      if (unit === 'week') start.setDate(start.getDate() - n * 7);
      else if (unit === 'month') start.setMonth(start.getMonth() - n);
      else start.setDate(start.getDate() - n);
      return { start: this._toISODate(start), end: this._toISODate(end) };
    }

    _toISODate(d) {
      var m = String(d.getMonth() + 1);
      if (m.length < 2) m = '0' + m;
      var day = String(d.getDate());
      if (day.length < 2) day = '0' + day;
      return d.getFullYear() + '-' + m + '-' + day;
    }

    _applyDateRange(def, start, end, label) {
      var st = this._filterState[def.__id];
      st.start = start || '';
      st.end = end || '';
      st.label = label || '';
      this.reconcile();
    }

    _updateDateLabel(btn, def) {
      var st = this._filterState[def.__id];
      if (st.label) btn.textContent = st.label;
      else if (st.start && st.end) btn.textContent = this._fmtShortDate(st.start) + ' – ' + this._fmtShortDate(st.end);
      else if (st.start) btn.textContent = 'From ' + this._fmtShortDate(st.start);
      else if (st.end) btn.textContent = 'Until ' + this._fmtShortDate(st.end);
      else btn.textContent = def.allLabel || 'All dates';
    }

    _fmtShortDate(iso) {
      var parts = String(iso).split('-');
      if (parts.length !== 3) return iso;
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
    }

    // ---- SDK filter-group reconciliation (scoped to the current sheet) ----
    _filterActive(def) {
      var st = this._filterState[def.__id];
      if ((def.type || 'multiselect') === 'daterange') return !!(st.start || st.end);
      return st.values.length > 0;
    }

    _scopeForSheet(sheetId) {
      return { SelectedSheets: { SheetVisualScopingConfigurations: [{ SheetId: sheetId, Scope: 'ALL_VISUALS' }] } };
    }

    _buildFilterGroup(def, sheetId) {
      var id = def.__id;
      var dataset = def.dataSetIdentifier || this._datasetDefault;
      var fgId = 'appfilter-' + id;
      var filterId = 'appflt-' + id;
      var st = this._filterState[id];

      if ((def.type || 'multiselect') === 'daterange') {
        var trf = {
          FilterId: filterId,
          Column: { DataSetIdentifier: dataset, ColumnName: def.column },
          NullOption: 'NON_NULLS_ONLY',
          IncludeMinimum: true,
          IncludeMaximum: true,
          TimeGranularity: 'DAY'
        };
        if (st.start) trf.RangeMinimumValue = { StaticValue: st.start + 'T00:00:00.000Z' };
        if (st.end) trf.RangeMaximumValue = { StaticValue: st.end + 'T23:59:59.999Z' };
        return {
          FilterGroupId: fgId,
          Filters: [{ TimeRangeFilter: trf }],
          ScopeConfiguration: this._scopeForSheet(sheetId),
          Status: 'ENABLED',
          CrossDataset: 'SINGLE_DATASET'
        };
      }

      return {
        FilterGroupId: fgId,
        Filters: [{
          CategoryFilter: {
            FilterId: filterId,
            Column: { DataSetIdentifier: dataset, ColumnName: def.column },
            Configuration: {
              FilterListConfiguration: {
                MatchOperator: 'CONTAINS',
                CategoryValues: st.values.slice(),
                NullOption: 'NON_NULLS_ONLY'
              }
            }
          }
        }],
        ScopeConfiguration: this._scopeForSheet(sheetId),
        Status: 'ENABLED',
        CrossDataset: 'SINGLE_DATASET'
      };
    }

    /**
     * Reconcile the current sheet's app filter groups to match selection state.
     * Only filters enabled for the current sheet are applied; others removed.
     * If the embed frame/sheet is not ready yet (initial load), retries briefly.
     */
    reconcile() {
      var self = this;
      var frame = this._getFrame();
      var sheetId = this._getSheetId();
      if (!frame || typeof frame.getFilterGroupsForSheet !== 'function' || !sheetId) {
        if (this._reconcileRetries < 20) {
          this._reconcileRetries += 1;
          setTimeout(function () { self.reconcile(); }, 500);
        }
        return;
      }
      this._reconcileRetries = 0;
      if (this._reconciling) { this._reconcilePending = true; return; }
      this._reconciling = true;

      var enabled = {};
      this._enabledFiltersFor(this._currentSubItem).forEach(function (d) { enabled[d.__id] = true; });

      frame.getFilterGroupsForSheet(sheetId).then(function (existing) {
        var existingIds = {};
        (existing || []).forEach(function (g) { existingIds[g.FilterGroupId] = true; });

        var toAdd = [], toUpdate = [], toRemove = [];
        (self._config.filters || []).forEach(function (def) {
          var fgId = 'appfilter-' + def.__id;
          var want = enabled[def.__id] && self._filterActive(def);
          if (want) {
            var fg = self._buildFilterGroup(def, sheetId);
            if (existingIds[fgId]) toUpdate.push(fg); else toAdd.push(fg);
          } else if (existingIds[fgId]) {
            toRemove.push(fgId);
          }
        });

        var chain = Promise.resolve();
        if (toAdd.length) chain = chain.then(function () { return frame.addFilterGroups(toAdd); });
        if (toUpdate.length) chain = chain.then(function () { return frame.updateFilterGroups(toUpdate); });
        if (toRemove.length) chain = chain.then(function () { return frame.removeFilterGroups(toRemove); });
        return chain;
      }).then(function () {
        self._reconciling = false;
        if (self._reconcilePending) { self._reconcilePending = false; self.reconcile(); }
      }).catch(function (err) {
        self._reconciling = false;
        console.warn('[QuickSuite] Filter reconcile failed:', err && err.message);
        if (self._reconcilePending) { self._reconcilePending = false; self.reconcile(); }
      });
    }

    /** Close every open popover except `exceptMs`. @private */
    _closeOthers(exceptMs) {
      if (!this._bar) return;
      var open = this._bar.querySelectorAll('.qs-flt-ms.qs-open');
      for (var i = 0; i < open.length; i++) {
        if (open[i] === exceptMs) continue;
        open[i].classList.remove('qs-open');
        var b = open[i].querySelector('.qs-flt-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    }

    /** Close popovers when clicking outside them. @private */
    _onDocClick(e) {
      if (!this._bar) return;
      var open = this._bar.querySelectorAll('.qs-flt-ms.qs-open');
      for (var i = 0; i < open.length; i++) {
        if (!open[i].contains(e.target)) {
          open[i].classList.remove('qs-open');
          var b = open[i].querySelector('.qs-flt-btn');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      }
    }

    /** @private scoped CSS for the filter bar + controls */
    _scopedCss() {
      return [
        '.qs-flt-bar{display:flex;align-items:center;flex-wrap:wrap;gap:14px;padding:10px 16px;background:#faf9f8;border-bottom:1px solid #e5e7eb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
        '.qs-flt-label{font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;}',
        '.qs-flt-group{position:relative;display:flex;align-items:center;gap:8px;}',
        '.qs-flt-glabel{font-size:12px;color:#6b7280;font-weight:500;}',
        '.qs-flt-ms{position:relative;}',
        '.qs-flt-btn{appearance:none;-webkit-appearance:none;padding:8px 30px 8px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#111827;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;min-width:140px;text-align:left;position:relative;white-space:nowrap;}',
        '.qs-flt-btn::after{content:"\\25BE";position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:10px;color:#6b7280;}',
        '.qs-flt-btn:hover{border-color:var(--qs-secondary,#3B82F6);}',
        '.qs-flt-btn:focus{outline:none;border-color:var(--qs-secondary,#3B82F6);box-shadow:0 0 0 3px rgba(59,130,246,0.15);}',
        '.qs-flt-pop{display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:2147482000;background:#fff;border:1px solid #d1d5db;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.15);padding:6px;min-width:200px;max-height:280px;overflow-y:auto;}',
        '.qs-flt-ms.qs-open .qs-flt-pop{display:block;}',
        '.qs-flt-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;font-size:13px;color:#111827;cursor:pointer;}',
        '.qs-flt-row:hover{background:#f3f4f6;}',
        '.qs-flt-row input{cursor:pointer;}',
        '.qs-flt-clear{width:100%;margin-top:4px;padding:7px 8px;border:none;border-top:1px solid #e5e7eb;background:transparent;color:var(--qs-primary,#374151);font-size:12px;font-weight:600;cursor:pointer;text-align:left;}',
        '.qs-flt-clear:hover{background:#f3f4f6;}',
        '.qs-flt-date-pop{min-width:240px;padding:10px;}',
        '.qs-flt-date-presets{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;}',
        '.qs-flt-date-preset{padding:7px 8px;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#111827;font-size:12px;font-weight:500;cursor:pointer;text-align:center;}',
        '.qs-flt-date-preset:hover{border-color:var(--qs-secondary,#3B82F6);}',
        '.qs-flt-date-range{display:flex;gap:8px;margin-bottom:4px;}',
        '.qs-flt-date-field{display:flex;flex-direction:column;gap:3px;flex:1;font-size:11px;color:#6b7280;}',
        '.qs-flt-date-input{padding:7px 10px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#111827;font-size:13px;width:100%;}',
        '.qs-flt-date-input:focus{outline:none;border-color:var(--qs-secondary,#3B82F6);}',
        // Mobile: tighter spacing and keep popovers within the viewport.
        '@media (max-width:768px){.qs-flt-bar{gap:10px;padding:10px 12px;}.qs-flt-btn{min-width:110px;}.qs-flt-pop{max-width:calc(100vw - 48px);}}'
      ].join('\n');
    }

    /** Remove listeners and the bar from the DOM. */
    destroy() {
      document.removeEventListener('click', this._onDocClickBound);
      if (this._bar) { this._bar.remove(); this._bar = null; }
    }
  }

  // ---------------------------------------------------------------------------
  // ChatBubble — floating chat launcher + slide-up panel
  // ---------------------------------------------------------------------------

  /**
   * Renders a floating circular chat button in the bottom-right corner. Clicking
   * it opens a chat panel (header with maximize/close, embedded generative Q&A
   * body) that overlays the page. The embed is lazy-loaded on first open via the
   * `onFirstOpen` callback. On mobile the panel goes full-screen with a backdrop.
   *
   * All styles are scoped to qs-chat-* classes and injected inside the widget
   * container (no document-level style pollution).
   */
  class ChatBubble {
    /**
     * @param {Object} opts
     * @param {HTMLElement} opts.container - widget container element
     * @param {Object} opts.config - validated widget config
     * @param {Function} opts.onFirstOpen - async fn(panelInner, prompt) invoked once on first open
     * @param {string} [opts.title] - panel/button label
     */
    constructor(opts) {
      opts = opts || {};
      this._container = opts.container;
      this._config = opts.config || {};
      this._onFirstOpen = opts.onFirstOpen || function () {};
      this._title = opts.title || 'Ask Analytics';
      this._loaded = false;
      this._open = false;
      this._maximized = false;
      this._root = null;
      this._btn = null;
      this._panel = null;
      this._panelInner = null;
      this._backdrop = null;
      var b = this._config.branding || {};
      this._brand = (typeof b.secondaryColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(b.secondaryColor)) ? b.secondaryColor : '#3B82F6';
    }

    /** @returns {boolean} viewport is mobile (≤768px) */
    _isMobile() {
      return typeof window !== 'undefined' && window.innerWidth <= 768;
    }

    /** Inject the bubble, panel, and backdrop into the container. */
    mount() {
      if (this._root) return;
      var root = document.createElement('div');
      root.className = 'qs-chat-root';

      var style = document.createElement('style');
      style.textContent = this._scopedCss();
      root.appendChild(style);

      // Backdrop (mobile)
      this._backdrop = document.createElement('div');
      this._backdrop.className = 'qs-chat-backdrop';
      this._backdrop.addEventListener('click', this.close.bind(this));
      root.appendChild(this._backdrop);

      // Floating launcher button
      this._panelId = 'qs-chat-panel-' + Math.random().toString(36).slice(2, 8);
      this._btn = document.createElement('button');
      this._btn.className = 'qs-chat-bubble-btn';
      this._btn.setAttribute('type', 'button');
      this._btn.setAttribute('aria-label', 'Open ' + this._title);
      this._btn.setAttribute('title', this._title);
      this._btn.setAttribute('aria-haspopup', 'dialog');
      this._btn.setAttribute('aria-expanded', 'false');
      this._btn.setAttribute('aria-controls', this._panelId);
      this._btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>';
      this._btn.addEventListener('click', this.toggle.bind(this));
      root.appendChild(this._btn);

      // Panel (modal dialog semantics; Escape closes, Tab is trapped inside)
      this._panel = document.createElement('div');
      this._panel.className = 'qs-chat-panel qs-hidden';
      this._panel.id = this._panelId;
      this._panel.setAttribute('role', 'dialog');
      this._panel.setAttribute('aria-modal', 'true');
      this._panel.setAttribute('aria-label', this._title);
      this._panel.addEventListener('keydown', this._onPanelKeydown.bind(this));

      var header = document.createElement('div');
      header.className = 'qs-chat-header';
      var titleEl = document.createElement('span');
      titleEl.className = 'qs-chat-title';
      titleEl.textContent = this._title;
      header.appendChild(titleEl);

      var maxBtn = document.createElement('button');
      maxBtn.className = 'qs-chat-ctrl';
      maxBtn.setAttribute('type', 'button');
      maxBtn.setAttribute('aria-label', 'Maximize chat');
      maxBtn.setAttribute('title', 'Maximize');
      maxBtn.innerHTML = this._iconExpand();
      maxBtn.addEventListener('click', this.toggleMax.bind(this));
      this._maxBtn = maxBtn;
      header.appendChild(maxBtn);

      var closeBtn = document.createElement('button');
      closeBtn.className = 'qs-chat-ctrl';
      closeBtn.setAttribute('type', 'button');
      closeBtn.setAttribute('aria-label', 'Close chat');
      closeBtn.setAttribute('title', 'Close');
      closeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1 1L9 9"/><path d="M9 1L1 9"/></svg>';
      closeBtn.addEventListener('click', this.close.bind(this));
      this._closeBtn = closeBtn;
      header.appendChild(closeBtn);

      this._panel.appendChild(header);

      var body = document.createElement('div');
      body.className = 'qs-chat-body';
      this._panelInner = document.createElement('div');
      this._panelInner.className = 'qs-chat-frame';
      body.appendChild(this._panelInner);
      this._panel.appendChild(body);

      root.appendChild(this._panel);

      this._container.appendChild(root);
      this._root = root;
    }

    /** @returns {HTMLElement} the inner element the chat iframe embeds into */
    getPanelInner() {
      return this._panelInner;
    }

    /** Open the panel (lazy-load embed on first open). Moves focus into the dialog. */
    open(prompt) {
      if (!this._panel) return;
      this._open = true;
      this._panel.classList.remove('qs-hidden');
      this._btn.classList.add('qs-hidden');
      this._btn.setAttribute('aria-expanded', 'true');
      if (this._isMobile()) this._backdrop.classList.add('qs-show');
      if (!this._loaded) {
        this._loaded = true;
        try { this._onFirstOpen(this._panelInner, prompt || null); } catch (e) { console.error('[QuickSuite] Chat open failed:', e && e.message); }
      }
      // Move focus into the dialog (WCAG 2.4.3) — the close button is the
      // first meaningful, always-present control.
      if (this._closeBtn && typeof this._closeBtn.focus === 'function') {
        try { this._closeBtn.focus(); } catch (e) { /* non-fatal */ }
      }
    }

    /** Close the panel; the launcher button reappears and regains focus. */
    close() {
      if (!this._panel) return;
      this._open = false;
      this._panel.classList.add('qs-hidden');
      this._panel.classList.remove('qs-max');
      this._maximized = false;
      if (this._maxBtn) { this._maxBtn.innerHTML = this._iconExpand(); this._maxBtn.title = 'Maximize'; }
      this._btn.classList.remove('qs-hidden');
      this._btn.setAttribute('aria-expanded', 'false');
      this._backdrop.classList.remove('qs-show');
      // Return focus to the launcher (WCAG 2.4.3)
      if (this._btn && typeof this._btn.focus === 'function') {
        try { this._btn.focus(); } catch (e) { /* non-fatal */ }
      }
    }

    /**
     * Dialog keyboard behavior: Escape closes; Tab cycles within the panel's
     * focusable elements (buttons + embedded iframe) — a lightweight focus trap.
     * @private
     */
    _onPanelKeydown(e) {
      if (!this._open) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        this.close();
        return;
      }
      if (e.key !== 'Tab') return;
      var focusables = this._panel.querySelectorAll('button, iframe, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        try { last.focus(); } catch (err) { /* non-fatal */ }
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        try { first.focus(); } catch (err) { /* non-fatal */ }
      }
    }

    /** Toggle open/closed. */
    toggle() {
      if (this._open) { this.close(); } else { this.open(); }
    }

    /** Toggle maximized (desktop) — panel grows to fill most of the viewport. */
    toggleMax() {
      if (!this._panel) return;
      this._maximized = !this._maximized;
      this._panel.classList.toggle('qs-max', this._maximized);
      if (this._maxBtn) {
        this._maxBtn.innerHTML = this._maximized ? this._iconCollapse() : this._iconExpand();
        this._maxBtn.title = this._maximized ? 'Restore' : 'Maximize';
        this._maxBtn.setAttribute('aria-label', this._maximized ? 'Restore chat' : 'Maximize chat');
      }
    }

    /** @private */
    _iconExpand() {
      return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 1H11V4.5"/><path d="M4.5 11H1V7.5"/><path d="M11 1L7 5"/><path d="M1 11L5 7"/></svg>';
    }

    /** @private */
    _iconCollapse() {
      return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 7.5H1"/><path d="M4.5 7.5V11"/><path d="M7.5 4.5H11"/><path d="M7.5 4.5V1"/></svg>';
    }

    /** @private scoped CSS for the bubble + panel */
    _scopedCss() {
      var brand = this._brand;
      return [
        '.qs-chat-bubble-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;background:' + brand + ';color:#fff;box-shadow:0 4px 14px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;z-index:2147483000;transition:transform .15s ease,box-shadow .15s ease;}',
        '.qs-chat-bubble-btn:hover{transform:scale(1.06);box-shadow:0 6px 18px rgba(0,0,0,0.32);}',
        '.qs-chat-bubble-btn svg{width:26px;height:26px;fill:#fff;}',
        '.qs-chat-bubble-btn.qs-hidden{display:none;}',
        '.qs-chat-panel{position:fixed;bottom:24px;right:24px;width:400px;height:600px;max-height:calc(100vh - 48px);background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.30);display:flex;flex-direction:column;overflow:hidden;z-index:2147483001;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
        '.qs-chat-panel.qs-hidden{display:none;}',
        '.qs-chat-panel.qs-max{width:min(1100px,calc(100vw - 48px));height:calc(100vh - 48px);}',
        '.qs-chat-header{display:flex;align-items:center;gap:6px;padding:10px 12px;background:' + brand + ';color:#fff;flex:0 0 auto;}',
        '.qs-chat-title{flex:1;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.qs-chat-ctrl{background:transparent;border:none;color:#fff;cursor:pointer;padding:5px;border-radius:4px;display:flex;align-items:center;justify-content:center;}',
        '.qs-chat-ctrl:hover{background:rgba(255,255,255,0.22);}',
        '.qs-chat-body{flex:1 1 auto;position:relative;min-height:0;background:#fff;}',
        '.qs-chat-frame{position:absolute;inset:0;width:100%;height:100%;}',
        '.qs-chat-frame iframe{width:100%;height:100%;border:0;}',
        '.qs-chat-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:2147482999;display:none;}',
        '.qs-chat-backdrop.qs-show{display:block;}',
        '@media (max-width:768px){.qs-chat-panel{inset:0;width:100%;height:100%;max-height:none;border-radius:0;}.qs-chat-panel.qs-max{width:100%;height:100%;}.qs-chat-bubble-btn{bottom:20px;right:20px;}}',
        '@media (prefers-reduced-motion: reduce){.qs-chat-bubble-btn{transition:none;}.qs-chat-bubble-btn:hover{transform:none;}}'
      ].join('\n');
    }

    /** Remove the bubble and panel from the DOM. */
    destroy() {
      if (this._root && this._root.parentNode) this._root.parentNode.removeChild(this._root);
      this._root = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Auto-initialization
  // ---------------------------------------------------------------------------

  function startInitialization() {
    var widget = new WidgetInitializer();
    widget.init();
    // Expose globally for host-page integration (filter bars, external nav, etc.)
    window.__quicksuiteWidget = widget;
  }

  // Whether this module is being loaded as a CommonJS module (Node.js / Jest /
  // a bundler's require) rather than executed directly as a browser <script>.
  var _isCommonJsModule = (typeof module !== 'undefined' && module.exports);

  // ---------------------------------------------------------------------------
  // Exports for testing (not exposed to global scope in production)
  // ---------------------------------------------------------------------------
  if (_isCommonJsModule) {
    module.exports = {
      ConfigLoader: ConfigLoader,
      WidgetInitializer: WidgetInitializer,
      ConfigFetchError: ConfigFetchError,
      ConfigValidationError: ConfigValidationError,
      DeepLinkParser: DeepLinkParser,
      NavigationRenderer: NavigationRenderer,
      SessionCache: SessionCache,
      EmbedManager: EmbedManager,
      EmbedAuthError: EmbedAuthError,
      ErrorHandler: ErrorHandler,
      TimeoutError: TimeoutError,
      PoolExhaustedError: PoolExhaustedError,
      AuthManager: AuthManager,
      ChatBubble: ChatBubble,
      startInitialization: startInitialization
    };
  }

  // ---------------------------------------------------------------------------
  // Auto-initialization
  // ---------------------------------------------------------------------------
  // Only auto-initialize when loaded as a real browser <script> (the intended
  // single-script-tag deployment, Requirement 12.2). When the module is
  // require()'d — e.g. in Jest/Node unit tests or via a bundler — we skip
  // auto-init so that importing the module has no side effects. (Auto-init
  // otherwise schedules a MutationObserver + 10s container-detection timeout
  // that can outlive a test and fire after the jsdom environment is torn down.)
  if (!_isCommonJsModule && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startInitialization);
    } else {
      // DOM already loaded
      startInitialization();
    }
  }

})();

/* ===== END QuickSuite Widget ===== */
