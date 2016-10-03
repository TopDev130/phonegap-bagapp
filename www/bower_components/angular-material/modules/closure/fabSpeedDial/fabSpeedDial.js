/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.1
 */

goog.provide("ngmaterial.components.fabShared"),goog.require("ngmaterial.core"),function(){"use strict";function n(n,e,t,a,i,o){function r(){I.direction=I.direction||"down",I.isOpen=I.isOpen||!1,s(),e.addClass("md-animations-waiting")}function c(){var t=["click","focusin","focusout"];angular.forEach(t,function(n){e.on(n,l)}),n.$on("$destroy",function(){angular.forEach(t,function(n){e.off(n,l)}),m()})}function l(n){"click"==n.type&&x(n),"focusout"!=n.type||_||(_=o(function(){I.close()},100,!1)),"focusin"==n.type&&_&&(o.cancel(_),_=null)}function s(){I.currentActionIndex=-1}function u(){n.$watch("vm.direction",function(n,a){t.removeClass(e,"md-"+a),t.addClass(e,"md-"+n),s()});var a,i;n.$watch("vm.isOpen",function(n){s(),a&&i||(a=$(),i=D()),n?f():m();var o=n?"md-is-open":"",r=n?"":"md-is-open";a.attr("aria-haspopup",!0),a.attr("aria-expanded",n),i.attr("aria-hidden",!n),t.setClass(e,o,r)})}function d(){e[0].scrollHeight>0?t.addClass(e,"_md-animations-ready").then(function(){e.removeClass("md-animations-waiting")}):k<10&&(o(d,100),k+=1)}function f(){e.on("keydown",p),a.nextTick(function(){angular.element(document).on("click touchend",g)})}function m(){e.off("keydown",p),angular.element(document).off("click touchend",g)}function g(n){if(n.target){var e=a.getClosest(n.target,"md-fab-trigger"),t=a.getClosest(n.target,"md-fab-actions");e||t||I.close()}}function p(n){switch(n.which){case i.KEY_CODE.ESCAPE:return I.close(),n.preventDefault(),!1;case i.KEY_CODE.LEFT_ARROW:return y(n),!1;case i.KEY_CODE.UP_ARROW:return A(n),!1;case i.KEY_CODE.RIGHT_ARROW:return O(n),!1;case i.KEY_CODE.DOWN_ARROW:return S(n),!1}}function h(n){b(n,-1)}function v(n){b(n,1)}function b(n,e){var t=C();I.currentActionIndex=I.currentActionIndex+e,I.currentActionIndex=Math.min(t.length-1,I.currentActionIndex),I.currentActionIndex=Math.max(0,I.currentActionIndex);var a=angular.element(t[I.currentActionIndex]).children()[0];angular.element(a).attr("tabindex",0),a.focus(),n.preventDefault(),n.stopImmediatePropagation()}function C(){var n=D()[0].querySelectorAll(".md-fab-action-item");return angular.forEach(n,function(n){angular.element(angular.element(n).children()[0]).attr("tabindex",-1)}),n}function y(n){"left"===I.direction?v(n):h(n)}function A(n){"down"===I.direction?h(n):v(n)}function O(n){"left"===I.direction?h(n):v(n)}function S(n){"up"===I.direction?h(n):v(n)}function w(n){return a.getClosest(n,"md-fab-trigger")}function E(n){return a.getClosest(n,"md-fab-actions")}function x(n){w(n.target)&&I.toggle(),E(n.target)&&I.close()}function $(){return e.find("md-fab-trigger")}function D(){return e.find("md-fab-actions")}var I=this;I.open=function(){n.$evalAsync("vm.isOpen = true")},I.close=function(){n.$evalAsync("vm.isOpen = false"),e.find("md-fab-trigger")[0].focus()},I.toggle=function(){n.$evalAsync("vm.isOpen = !vm.isOpen")},r(),c(),u();var k=0;d();var _}n.$inject=["$scope","$element","$animate","$mdUtil","$mdConstant","$timeout"],angular.module("material.components.fabShared",["material.core"]).controller("MdFabController",n)}(),function(){"use strict";function n(){function n(n,e){e.prepend('<div class="_md-css-variables"></div>')}return{restrict:"E",scope:{direction:"@?mdDirection",isOpen:"=?mdOpen"},bindToController:!0,controller:"MdFabController",controllerAs:"vm",link:n}}function e(n){function e(e){n(e,a,!1)}function t(n){if(!n.hasClass("md-animations-waiting")||n.hasClass("_md-animations-ready")){var e=n[0],t=n.controller("mdFabSpeedDial"),a=e.querySelectorAll(".md-fab-action-item"),i=e.querySelector("md-fab-trigger"),o=e.querySelector("._md-css-variables"),r=parseInt(window.getComputedStyle(o).zIndex);angular.forEach(a,function(n,e){var t=n.style;t.transform=t.webkitTransform="",t.transitionDelay="",t.opacity=1,t.zIndex=a.length-e+r}),i.style.zIndex=r+a.length+1,t.isOpen||angular.forEach(a,function(n,e){var a,o,r=n.style,c=(i.clientHeight-n.clientHeight)/2,l=(i.clientWidth-n.clientWidth)/2;switch(t.direction){case"up":a=n.scrollHeight*(e+1)+c,o="Y";break;case"down":a=-(n.scrollHeight*(e+1)+c),o="Y";break;case"left":a=n.scrollWidth*(e+1)+l,o="X";break;case"right":a=-(n.scrollWidth*(e+1)+l),o="X"}var s="translate"+o+"("+a+"px)";r.transform=r.webkitTransform=s})}}return{addClass:function(n,a,i){n.hasClass("md-fling")?(t(n),e(i)):i()},removeClass:function(n,a,i){t(n),e(i)}}}function t(n){function e(e){n(e,a,!1)}function t(n){var e=n[0],t=n.controller("mdFabSpeedDial"),a=e.querySelectorAll(".md-fab-action-item"),o=e.querySelector("._md-css-variables"),r=parseInt(window.getComputedStyle(o).zIndex);angular.forEach(a,function(n,e){var o=n.style,c=e*i;o.opacity=t.isOpen?1:0,o.transform=o.webkitTransform=t.isOpen?"scale(1)":"scale(0)",o.transitionDelay=(t.isOpen?c:a.length-c)+"ms",o.zIndex=a.length-e+r})}var i=65;return{addClass:function(n,a,i){t(n),e(i)},removeClass:function(n,a,i){t(n),e(i)}}}e.$inject=["$timeout"],t.$inject=["$timeout"];var a=300;angular.module("material.components.fabSpeedDial",["material.core","material.components.fabShared","material.components.fabActions"]).directive("mdFabSpeedDial",n).animation(".md-fling",e).animation(".md-scale",t).service("mdFabSpeedDialFlingAnimation",e).service("mdFabSpeedDialScaleAnimation",t)}(),ngmaterial.components.fabShared=angular.module("material.components.fabShared");