import{b as o}from"./isObjectLike-Dipz0mOK.js";function c(n){var t=typeof n;return n!=null&&(t=="object"||t=="function")}var i="[object AsyncFunction]",s="[object Function]",e="[object GeneratorFunction]",f="[object Proxy]";function a(n){if(!c(n))return!1;var t=o(n);return t==s||t==e||t==i||t==f}var b=9007199254740991,u=/^(?:0|[1-9]\d*)$/;function j(n,t){var r=typeof n;return t=t??b,!!t&&(r=="number"||r!="symbol"&&u.test(n))&&n>-1&&n%1==0&&n<t}function A(n,t){return n===t||n!==n&&t!==t}var y=9007199254740991;function p(n){return typeof n=="number"&&n>-1&&n%1==0&&n<=y}function E(n){return n!=null&&p(n.length)&&!a(n)}export{E as a,j as b,p as c,a as d,A as e,c as i};
