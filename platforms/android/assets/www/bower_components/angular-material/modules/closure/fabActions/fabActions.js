/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.1
 */

goog.provide("ngmaterial.components.fabActions"),goog.require("ngmaterial.core"),function(){"use strict";function a(a){return{restrict:"E",require:["^?mdFabSpeedDial","^?mdFabToolbar"],compile:function(e,t){var i=e.children(),n=a.prefixer().hasAttribute(i,"ng-repeat");n?i.addClass("md-fab-action-item"):i.wrap('<div class="md-fab-action-item">')}}}a.$inject=["$mdUtil"],angular.module("material.components.fabActions",["material.core"]).directive("mdFabActions",a)}(),ngmaterial.components.fabActions=angular.module("material.components.fabActions");