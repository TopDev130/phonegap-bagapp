/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.1
 */

!function(t,e,n){"use strict";function a(t,n){return{restrict:"E",transclude:!0,controller:r,controllerAs:"ctrl",bindToController:!0,scope:{mdSelectedNavItem:"=?",navBarAriaLabel:"@?"},template:'<div class="md-nav-bar"><nav role="navigation"><ul class="_md-nav-bar-list" ng-transclude role="listbox"tabindex="0"ng-focus="ctrl.onFocus()"ng-blur="ctrl.onBlur()"ng-keydown="ctrl.onKeydown($event)"aria-label="{{ctrl.navBarAriaLabel}}"></ul></nav><md-nav-ink-bar></md-nav-ink-bar></div>',link:function(a,r,o,i){n(r),i.navBarAriaLabel||t.expectAsync(r,"aria-label",e.noop)}}}function r(t,e,n,a){this._$timeout=n,this._$scope=e,this._$mdConstant=a,this.mdSelectedNavItem,this.navBarAriaLabel,this._navBarEl=t[0],this._inkbar;var r=this,o=this._$scope.$watch(function(){return r._navBarEl.querySelectorAll("._md-nav-button").length},function(t){t>0&&(r._initTabs(),o())})}function o(t){return{restrict:"E",require:["mdNavItem","^mdNavBar"],controller:i,bindToController:!0,controllerAs:"ctrl",replace:!0,transclude:!0,template:'<li class="md-nav-item" role="option" aria-selected="{{ctrl.isSelected()}}"><md-button ng-if="ctrl.mdNavSref" class="_md-nav-button md-accent"ng-class="ctrl.getNgClassMap()"tabindex="-1"ui-sref="{{ctrl.mdNavSref}}"><span ng-transclude class="_md-nav-button-text"></span></md-button><md-button ng-if="ctrl.mdNavHref" class="_md-nav-button md-accent"ng-class="ctrl.getNgClassMap()"tabindex="-1"ng-href="{{ctrl.mdNavHref}}"><span ng-transclude class="_md-nav-button-text"></span></md-button><md-button ng-if="ctrl.mdNavClick" class="_md-nav-button md-accent"ng-class="ctrl.getNgClassMap()"tabindex="-1"ng-click="ctrl.mdNavClick()"><span ng-transclude class="_md-nav-button-text"></span></md-button></li>',scope:{mdNavClick:"&?",mdNavHref:"@?",mdNavSref:"@?",name:"@"},link:function(n,a,r,o){var i=o[0],s=o[1];t(function(){i.name||(i.name=e.element(a[0].querySelector("._md-nav-button-text")).text().trim());var t=e.element(a[0].querySelector("._md-nav-button"));t.on("click",function(){s.mdSelectedNavItem=i.name,n.$apply()})})}}}function i(t){this._$element=t,this.mdNavClick,this.mdNavHref,this.name,this._selected=!1,this._focused=!1;var e=!!t.attr("md-nav-click"),n=!!t.attr("md-nav-href"),a=!!t.attr("md-nav-sref");if((e?1:0)+(n?1:0)+(a?1:0)>1)throw Error("Must specify exactly one of md-nav-click, md-nav-href, md-nav-sref for nav-item directive")}r.$inject=["$element","$scope","$timeout","$mdConstant"],o.$inject=["$$rAF"],i.$inject=["$element"],a.$inject=["$mdAria","$mdTheming"],e.module("material.components.navBar",["material.core"]).controller("MdNavBarController",r).directive("mdNavBar",a).controller("MdNavItemController",i).directive("mdNavItem",o),r.prototype._initTabs=function(){this._inkbar=e.element(this._navBarEl.getElementsByTagName("md-nav-ink-bar")[0]);var t=this;this._$timeout(function(){t._updateTabs(t.mdSelectedNavItem,n)}),this._$scope.$watch("ctrl.mdSelectedNavItem",function(e,n){t._$timeout(function(){t._updateTabs(e,n)})})},r.prototype._updateTabs=function(t,e){var n=this,a=this._getTabs(),r=-1,o=-1,i=this._getTabByName(t),s=this._getTabByName(e);s&&(s.setSelected(!1),r=a.indexOf(s)),i&&(i.setSelected(!0),o=a.indexOf(i)),this._$timeout(function(){n._updateInkBarStyles(i,o,r)})},r.prototype._updateInkBarStyles=function(t,e,n){if(this._inkbar.toggleClass("_md-left",e<n).toggleClass("_md-right",e>n),this._inkbar.css({display:e<0?"none":""}),t){var a=t.getButtonEl(),r=a.offsetLeft;this._inkbar.css({left:r+"px",width:a.offsetWidth+"px"})}},r.prototype._getTabs=function(){var t=Array.prototype.slice.call(this._navBarEl.querySelectorAll(".md-nav-item"));return t.map(function(t){return e.element(t).controller("mdNavItem")})},r.prototype._getTabByName=function(t){return this._findTab(function(e){return e.getName()==t})},r.prototype._getSelectedTab=function(){return this._findTab(function(t){return t.isSelected()})},r.prototype.getFocusedTab=function(){return this._findTab(function(t){return t.hasFocus()})},r.prototype._findTab=function(t){for(var e=this._getTabs(),n=0;n<e.length;n++)if(t(e[n]))return e[n];return null},r.prototype.onFocus=function(){var t=this._getSelectedTab();t&&t.setFocused(!0)},r.prototype.onBlur=function(){var t=this.getFocusedTab();t&&t.setFocused(!1)},r.prototype._moveFocus=function(t,e){t.setFocused(!1),e.setFocused(!0)},r.prototype.onKeydown=function(t){var e=this._$mdConstant.KEY_CODE,n=this._getTabs(),a=this.getFocusedTab();if(a){var r=n.indexOf(a);switch(t.keyCode){case e.UP_ARROW:case e.LEFT_ARROW:r>0&&this._moveFocus(a,n[r-1]);break;case e.DOWN_ARROW:case e.RIGHT_ARROW:r<n.length-1&&this._moveFocus(a,n[r+1]);break;case e.SPACE:case e.ENTER:this._$timeout(function(){a.getButtonEl().click()})}}},i.prototype.getNgClassMap=function(){return{"md-active":this._selected,"md-primary":this._selected,"md-unselected":!this._selected,"md-focused":this._focused}},i.prototype.getName=function(){return this.name},i.prototype.getButtonEl=function(){return this._$element[0].querySelector("._md-nav-button")},i.prototype.setSelected=function(t){this._selected=t},i.prototype.isSelected=function(){return this._selected},i.prototype.setFocused=function(t){this._focused=t},i.prototype.hasFocus=function(){return this._focused}}(window,window.angular);