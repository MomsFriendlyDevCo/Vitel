import{b as I,t as s}from"./_baseSlice-BD4yksuF.js";function T(u,r,e){var f=u.length;return e=e===void 0?f:e,!r&&e>=f?u:I(u,r,e)}var W="\\ud800-\\udfff",D="\\u0300-\\u036f",H="\\ufe20-\\ufe2f",N="\\u20d0-\\u20ff",w=D+H+N,y="\\ufe0e\\ufe0f",J="\\u200d",V=RegExp("["+J+W+w+y+"]");function R(u){return V.test(u)}function F(u){return u.split("")}var g="\\ud800-\\udfff",G="\\u0300-\\u036f",P="\\ufe20-\\ufe2f",Y="\\u20d0-\\u20ff",q=G+P+Y,B="\\ufe0e\\ufe0f",_="["+g+"]",n="["+q+"]",d="\\ud83c[\\udffb-\\udfff]",K="(?:"+n+"|"+d+")",l="[^"+g+"]",p="(?:\\ud83c[\\udde6-\\uddff]){2}",$="[\\ud800-\\udbff][\\udc00-\\udfff]",Q="\\u200d",m=K+"?",A="["+B+"]?",X="(?:"+Q+"(?:"+[l,p,$].join("|")+")"+A+m+")*",u0=A+m+X,r0="(?:"+[l+n+"?",n,p,$,_].join("|")+")",e0=RegExp(d+"(?="+d+")|"+r0+u0,"g");function f0(u){return u.match(e0)||[]}function a0(u){return R(u)?f0(u):F(u)}function o0(u){return function(r){r=s(r);var e=R(r)?a0(r):void 0,f=e?e[0]:r.charAt(0),a=e?T(e,1).join(""):r.slice(1);return f[u]()+a}}var _0=o0("toUpperCase");function n0(u,r,e,f){var a=-1,x=u==null?0:u.length;for(f&&x&&(e=u[++a]);++a<x;)e=r(e,u[a],a,u);return e}function d0(u){return function(r){return u==null?void 0:u[r]}}var s0={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"},x0=d0(s0);const c0=x0;var t0=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,i0="\\u0300-\\u036f",b0="\\ufe20-\\ufe2f",R0="\\u20d0-\\u20ff",g0=i0+b0+R0,l0="["+g0+"]",p0=RegExp(l0,"g");function $0(u){return u=s(u),u&&u.replace(t0,c0).replace(p0,"")}var m0=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;function A0(u){return u.match(m0)||[]}var C0=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;function v0(u){return C0.test(u)}var C="\\ud800-\\udfff",O0="\\u0300-\\u036f",U0="\\ufe20-\\ufe2f",h0="\\u20d0-\\u20ff",S0=O0+U0+h0,v="\\u2700-\\u27bf",O="a-z\\xdf-\\xf6\\xf8-\\xff",M0="\\xac\\xb1\\xd7\\xf7",E0="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",L0="\\u2000-\\u206f",k0=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",U="A-Z\\xc0-\\xd6\\xd8-\\xde",Z0="\\ufe0e\\ufe0f",h=M0+E0+L0+k0,S="['’]",c="["+h+"]",z0="["+S0+"]",M="\\d+",j0="["+v+"]",E="["+O+"]",L="[^"+C+h+M+v+O+U+"]",I0="\\ud83c[\\udffb-\\udfff]",T0="(?:"+z0+"|"+I0+")",W0="[^"+C+"]",k="(?:\\ud83c[\\udde6-\\uddff]){2}",Z="[\\ud800-\\udbff][\\udc00-\\udfff]",o="["+U+"]",D0="\\u200d",t="(?:"+E+"|"+L+")",H0="(?:"+o+"|"+L+")",i="(?:"+S+"(?:d|ll|m|re|s|t|ve))?",b="(?:"+S+"(?:D|LL|M|RE|S|T|VE))?",z=T0+"?",j="["+Z0+"]?",N0="(?:"+D0+"(?:"+[W0,k,Z].join("|")+")"+j+z+")*",w0="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",y0="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",J0=j+z+N0,V0="(?:"+[j0,k,Z].join("|")+")"+J0,F0=RegExp([o+"?"+E+"+"+i+"(?="+[c,o,"$"].join("|")+")",H0+"+"+b+"(?="+[c,o+t,"$"].join("|")+")",o+"?"+t+"+"+i,o+"+"+b,y0,w0,M,V0].join("|"),"g");function G0(u){return u.match(F0)||[]}function P0(u,r,e){return u=s(u),r=e?void 0:r,r===void 0?v0(u)?G0(u):A0(u):u.match(r)||[]}var Y0="['’]",q0=RegExp(Y0,"g");function K0(u){return function(r){return n0(P0($0(r).replace(q0,"")),u,"")}}export{K0 as c,_0 as u};
