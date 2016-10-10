/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.1
 */

goog.provide("ngmaterial.components.backdrop"),goog.require("ngmaterial.core"),angular.module("material.components.backdrop",["material.core"]).directive("mdBackdrop",["$mdTheming","$mdUtil","$animate","$rootElement","$window","$log","$$rAF","$document",function(e,o,n,t,r,a,i,c){function d(d,l,m){function s(){var e=parseInt(u.height,10)+Math.abs(parseInt(u.top,10));l.css("height",e+"px")}n.pin&&n.pin(l,t);var u;i(function(){if(u=r.getComputedStyle(c[0].body),"fixed"===u.position){var n=o.debounce(function(){u=r.getComputedStyle(c[0].body),s()},60,null,!1);s(),angular.element(r).on("resize",n),d.$on("$destroy",function(){angular.element(r).off("resize",n)})}var t=l.parent();if(t.length){"BODY"===t[0].nodeName&&l.css("position","fixed");var i=r.getComputedStyle(t[0]);"static"===i.position&&a.warn(p),e.inherit(l,t)}})}var p="<md-backdrop> may not work properly in a scrolled, static-positioned parent container.";return{restrict:"E",link:d}}]),ngmaterial.components.backdrop=angular.module("material.components.backdrop");