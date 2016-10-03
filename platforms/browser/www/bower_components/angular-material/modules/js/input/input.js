/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.1
 */

!function(e,t,n){"use strict";function i(e,t){function n(t){var n=t[0].querySelector(o),i=t[0].querySelector(a);return n&&t.addClass("md-icon-left"),i&&t.addClass("md-icon-right"),function(t,n){e(n)}}function i(e,n,i,r){var o=this;o.isErrorGetter=i.mdIsError&&t(i.mdIsError),o.delegateClick=function(){o.input.focus()},o.element=n,o.setFocused=function(e){n.toggleClass("md-input-focused",!!e)},o.setHasValue=function(e){n.toggleClass("md-input-has-value",!!e)},o.setHasPlaceholder=function(e){n.toggleClass("md-input-has-placeholder",!!e)},o.setInvalid=function(e){e?r.addClass(n,"md-input-invalid"):r.removeClass(n,"md-input-invalid")},e.$watch(function(){return o.label&&o.input},function(e){e&&!o.label.attr("for")&&o.label.attr("for",o.input.attr("id"))})}i.$inject=["$scope","$element","$attrs","$animate"];var r=["INPUT","TEXTAREA","SELECT","MD-SELECT"],o=r.reduce(function(e,t){return e.concat(["md-icon ~ "+t,".md-icon ~ "+t])},[]).join(","),a=r.reduce(function(e,t){return e.concat([t+" ~ md-icon",t+" ~ .md-icon"])},[]).join(",");return{restrict:"E",compile:n,controller:i}}function r(){return{restrict:"E",require:"^?mdInputContainer",link:function(e,t,n,i){!i||n.mdNoFloat||t.hasClass("md-container-ignore")||(i.label=t,e.$on("$destroy",function(){i.label=null}))}}}function o(e,n,i,r,o){function a(a,s,u,l){function c(e){return p.setHasValue(!v.$isEmpty(e)),e}function d(){p.label&&u.$observe("required",function(e){p.label.toggleClass("md-required",e&&!C)})}function m(){p.setHasValue(s.val().length>0||(s[0].validity||{}).badInput)}function f(){function i(){s.attr("rows",1).css("height","auto").addClass("md-no-flex");var e=l();if(!w){var t=s[0].style.padding||"";w=s.css("padding",0).prop("offsetHeight"),s[0].style.padding=t}if(h&&w&&(e=Math.max(e,w*h)),$&&w){var n=w*$;n<e?(s.attr("md-no-autogrow",""),e=n):s.removeAttr("md-no-autogrow")}w&&s.attr("rows",Math.round(e/w)),s.css("height",e+"px").removeClass("md-no-flex")}function l(){var e=y.offsetHeight,t=y.scrollHeight-e;return e+Math.max(t,0)}function c(t){return e.nextTick(i),t}function d(){if(f&&(f=!1,t.element(n).off("resize",i),C&&C(),s.attr("md-no-autogrow","").off("input",i),g)){var e=v.$formatters.indexOf(c);e>-1&&v.$formatters.splice(e,1)}}function m(){function n(e){e.preventDefault(),m=!0,f=e.clientY,g=parseFloat(s.css("height"))||s.prop("offsetHeight")}function i(e){m&&(e.preventDefault(),d(),v.addClass("md-input-resized"))}function r(t){m&&s.css("height",g+(t.pointer.y-f)-e.scrollTop()+"px")}function l(e){m&&(m=!1,v.removeClass("md-input-resized"))}if(!u.hasOwnProperty("mdNoResize")){var c=t.element('<div class="md-resize-handle"></div>'),m=!1,f=null,g=0,v=p.element,h=o.register(c,"drag",{horizontal:!1});s.wrap('<div class="md-resize-wrapper">').after(c),c.on("mousedown",n),v.on("$md.dragstart",i).on("$md.drag",r).on("$md.dragend",l),a.$on("$destroy",function(){c.off("mousedown",n).remove(),v.off("$md.dragstart",i).off("$md.drag",r).off("$md.dragend",l),h(),c=null,v=null,h=null})}}var f=!u.hasOwnProperty("mdNoAutogrow");if(m(),f){var h=u.hasOwnProperty("rows")?parseInt(u.rows):NaN,$=u.hasOwnProperty("maxRows")?parseInt(u.maxRows):NaN,C=a.$on("md-resize-textarea",i),w=null,y=s[0];if(r(function(){e.nextTick(i)},10,!1),s.on("input",i),g&&v.$formatters.push(c),h||s.attr("rows",1),t.element(n).on("resize",i),a.$on("$destroy",d),u.hasOwnProperty("mdDetectHidden")){var x=function(){var e=!1;return function(){var t=0===y.offsetHeight;t===!1&&e===!0&&i(),e=t}}();a.$watch(function(){return e.nextTick(x,!1),!0})}}}var p=l[0],g=!!l[1],v=l[1]||e.fakeNgModel(),h=l[2],$=t.isDefined(u.readonly),C=e.parseAttributeBoolean(u.mdNoAsterisk),w=s[0].tagName.toLowerCase();if(p){if("hidden"===u.type)return void s.attr("aria-hidden","true");if(p.input){if(p.input[0].contains(s[0]))return;throw new Error("<md-input-container> can only have *one* <input>, <textarea> or <md-select> child element!")}p.input=s,d();var y=t.element('<div class="md-errors-spacer">');s.after(y),p.label||i.expect(s,"aria-label",u.placeholder),s.addClass("md-input"),s.attr("id")||s.attr("id","input_"+e.nextUid()),"input"===w&&"number"===u.type&&u.min&&u.max&&!u.step?s.attr("step","any"):"textarea"===w&&f(),g||m();var x=p.isErrorGetter||function(){return v.$invalid&&(v.$touched||h&&h.$submitted)};a.$watch(x,p.setInvalid),u.ngValue&&u.$observe("value",m),v.$parsers.push(c),v.$formatters.push(c),s.on("input",m),$||s.on("focus",function(t){e.nextTick(function(){p.setFocused(!0)})}).on("blur",function(t){e.nextTick(function(){p.setFocused(!1),m()})}),a.$on("$destroy",function(){p.setFocused(!1),p.setHasValue(!1),p.input=null})}}return{restrict:"E",require:["^?mdInputContainer","?ngModel","?^form"],link:a}}function a(e,n){function i(i,r,o,a){function s(e){return l.parent?(l.text(String(r.val()||e||"").length+" / "+u),e):e}var u,l,c,d=a[0],m=a[1];n.nextTick(function(){c=t.element(m.element[0].querySelector(".md-errors-spacer")),l=t.element('<div class="md-char-counter">'),c.append(l),o.$set("ngTrim","false"),d.$formatters.push(s),d.$viewChangeListeners.push(s),r.on("input keydown keyup",function(){s()}),i.$watch(o.mdMaxlength,function(n){u=n,t.isNumber(n)&&n>0?(l.parent().length||e.enter(l,c),s()):e.leave(l)}),d.$validators["md-maxlength"]=function(e,n){return!t.isNumber(u)||u<0||(e||r.val()||n||"").length<=u}})}return{restrict:"A",require:["ngModel","^mdInputContainer"],link:i}}function s(e){function n(n,i,r,o){if(o){var a=o.element.find("label"),s=o.element.attr("md-no-float");if(a&&a.length||""===s||n.$eval(s))return void o.setHasPlaceholder(!0);if("MD-SELECT"!=i[0].nodeName){var u=t.element('<label ng-click="delegateClick()" tabindex="-1">'+r.placeholder+"</label>");r.$set("placeholder",null),o.element.addClass("md-icon-float").prepend(u),e(u)(n)}}}return{restrict:"A",require:"^^?mdInputContainer",priority:200,link:{pre:n}}}function u(e){function t(t,n,i){function r(){a=!0,e(function(){n[0].select(),a=!1},1,!1)}function o(e){a&&e.preventDefault()}if("INPUT"===n[0].nodeName||"TEXTAREA"===n[0].nodeName){var a=!1;n.on("focus",r).on("mouseup",o),t.$on("$destroy",function(){n.off("focus",r).off("mouseup",o)})}}return{restrict:"A",link:t}}function l(){function e(e,n,i,r){r&&(n.toggleClass("md-input-messages-animation",!0),n.toggleClass("md-auto-hide",!0),("false"==i.mdAutoHide||t(i))&&n.toggleClass("md-auto-hide",!1))}function t(e){return b.some(function(t){return e[t]})}return{restrict:"EA",link:e,require:"^^?mdInputContainer"}}function c(e){function t(t){function n(){for(var e=t[0];e=e.parentNode;)if(e.nodeType===Node.DOCUMENT_FRAGMENT_NODE)return!0;return!1}function i(t){return!!e.getClosest(t,"md-input-container")}function r(e){e.toggleClass("md-input-message-animation",!0)}if(i(t))r(t);else if(n())return function(e,n){i(n)&&r(t)}}return{restrict:"EA",compile:t,priority:100}}function d(e,t,n){return w(e,t,n),{addClass:function(e,t,n){p(e,n)}}}function m(e,t,n){return w(e,t,n),{enter:function(e,t){p(e,t)},leave:function(e,t){g(e,t)},addClass:function(e,t,n){"ng-hide"==t?g(e,n):n()},removeClass:function(e,t,n){"ng-hide"==t?p(e,n):n()}}}function f(e,t,n){return w(e,t,n),{enter:function(e,t){var n=v(e);n.start().done(t)},leave:function(e,t){var n=h(e);n.start().done(t)}}}function p(e,n){var i,r=[],o=C(e);t.forEach(o.children(),function(e){i=v(t.element(e)),r.push(i.start())}),y.all(r,n)}function g(e,n){var i,r=[],o=C(e);t.forEach(o.children(),function(e){i=h(t.element(e)),r.push(i.start())}),y.all(r,n)}function v(t){var n=parseInt(e.getComputedStyle(t[0]).height),i=parseInt(e.getComputedStyle(t[0]).marginTop),r=C(t),o=$(t),a=i>-n;return a||r.hasClass("md-auto-hide")&&!o.hasClass("md-input-invalid")?x(t,{}):x(t,{event:"enter",structural:!0,from:{opacity:0,"margin-top":-n+"px"},to:{opacity:1,"margin-top":"0"},duration:.3})}function h(t){var n=t[0].offsetHeight,i=e.getComputedStyle(t[0]);return 0==i.opacity?x(t,{}):x(t,{event:"leave",structural:!0,from:{opacity:1,"margin-top":0},to:{opacity:0,"margin-top":-n+"px"},duration:.3})}function $(e){var t=e.controller("mdInputContainer");return t.element}function C(e){return e.hasClass("md-input-message-animation")?t.element(E.getClosest(e,function(e){return e.classList.contains("md-input-messages-animation")})):t.element(e[0].querySelector(".md-input-messages-animation"))}function w(e,t,n){y=e,x=t,E=n}i.$inject=["$mdTheming","$parse"],o.$inject=["$mdUtil","$window","$mdAria","$timeout","$mdGesture"],a.$inject=["$animate","$mdUtil"],s.$inject=["$compile"],c.$inject=["$mdUtil"],u.$inject=["$timeout"],d.$inject=["$$AnimateRunner","$animateCss","$mdUtil"],m.$inject=["$$AnimateRunner","$animateCss","$mdUtil"],f.$inject=["$$AnimateRunner","$animateCss","$mdUtil"],t.module("material.components.input",["material.core"]).directive("mdInputContainer",i).directive("label",r).directive("input",o).directive("textarea",o).directive("mdMaxlength",a).directive("placeholder",s).directive("ngMessages",l).directive("ngMessage",c).directive("ngMessageExp",c).directive("mdSelectOnFocus",u).animation(".md-input-invalid",d).animation(".md-input-messages-animation",m).animation(".md-input-message-animation",f).service("mdInputInvalidAnimation",d).service("mdInputMessagesAnimation",m).service("mdInputMessageAnimation",f);var y,x,E,b=["ngIf","ngShow","ngHide","ngSwitchWhen","ngSwitchDefault"]}(window,window.angular);