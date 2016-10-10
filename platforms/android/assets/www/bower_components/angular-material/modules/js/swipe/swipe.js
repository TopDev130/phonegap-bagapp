/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.1
 */

!function(e,i,n){"use strict";function t(e){function i(e){function i(i,r,o){var c=e(o[n]);r.on(t,function(e){i.$applyAsync(function(){c(i,{$event:e})})})}return{restrict:"A",link:i}}i.$inject=["$parse"];var n="md"+e,t="$md."+e.toLowerCase();return i}i.module("material.components.swipe",["material.core"]).directive("mdSwipeLeft",t("SwipeLeft")).directive("mdSwipeRight",t("SwipeRight")).directive("mdSwipeUp",t("SwipeUp")).directive("mdSwipeDown",t("SwipeDown"))}(window,window.angular);