import{a as I}from"./_commonjsHelpers-_d1bhYXs.js";import{c as g,t as D,o as f}from"./vue.esm-bundler-TYCfHD9-.js";import{_ as F}from"./_plugin-vue_export-helper-DlAUqK2U.js";var y,_;function H(){if(_)return y;_=1;var d="    ";function h(e){var o="";return e&&Object.keys(e).forEach(function(t){o+=t+":"+e[t]+";"}),o}function i(e){function o(a){return'class="'+a+'"'}function t(a){return'style="'+h(e["."+a])+'"'}return e?t:o}function k(e){return e===null?"null":Array.isArray(e)?"array":typeof e=="string"&&/^https?:/.test(e)?"link":typeof e=="object"&&typeof e.toISOString=="function"?"date":typeof e}function s(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}return y=function(e,o){var t="",a=i(o),v=function(n,u,r,j){if(!n.length)return u+" "+r;var w=u+`
`;return t+=d,n.forEach(function(z,M){w+=t+j(z)+(M<n.length-1?",":"")+`
`}),t=t.slice(0,-d.length),w+t+r};function m(n){if(n===void 0)return"";switch(k(n)){case"boolean":return"<span "+a("json-markup-bool")+">"+n+"</span>";case"number":return"<span "+a("json-markup-number")+">"+n+"</span>";case"date":return'<span class="json-markup-string">"'+s(n.toISOString())+'"</span>';case"null":return"<span "+a("json-markup-null")+">null</span>";case"string":return"<span "+a("json-markup-string")+'>"'+s(n.replace(/\n/g,`
`+t))+'"</span>';case"link":return"<span "+a("json-markup-string")+'>"<a href="'+s(n)+'">'+s(n)+'</a>"</span>';case"array":return v(n,"[","]",m);case"object":var u=Object.keys(n).filter(function(r){return n[r]!==void 0});return v(u,"{","}",function(r){return"<span "+a("json-markup-key")+'>"'+s(r)+'":</span> '+m(n[r])})}return""}return"<div "+a("json-markup")+">"+m(e)+"</div>"},y}var P=H();const V=I(P),N={props:{highlight:{type:Boolean,default:!0},value:{type:[Object,Array]}},methods:{markup:V}},A={class:"dump"},T={key:0},J=["innerHTML"];function K(d,h,i,k,s,e){return f(),g("div",A,[i.highlight?(f(),g("div",{key:1,innerHTML:e.markup(i.value)},null,8,J)):(f(),g("pre",T,D(i.value),1))])}const L=F(N,[["render",K]]);N.__docgenInfo={exportName:"default",displayName:"dump",type:1,props:[{name:"highlight",global:!1,description:"",tags:[],required:!1,type:"boolean",declarations:[],schema:{kind:"enum",type:"boolean",schema:["false","true"]},default:"true"},{name:"value",global:!1,description:"",tags:[],required:!1,type:"Record<string, any> | unknown[]",declarations:[],schema:{kind:"enum",type:"Record<string, any> | unknown[]",schema:["Record<string, any>",{kind:"array",type:"unknown[]"}]}},{name:"key",global:!0,description:"",tags:[],required:!1,type:"PropertyKey",declarations:[],schema:{kind:"enum",type:"PropertyKey",schema:["string","number","symbol"]}},{name:"ref",global:!0,description:"",tags:[],required:!1,type:"VNodeRef",declarations:[],schema:{kind:"enum",type:"VNodeRef",schema:["string","Ref<any, any>",{kind:"event",type:"(ref: Element | ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions>, ... 4 more ..., any>, refs: Record<...>): void"}]}},{name:"ref_for",global:!0,description:"",tags:[],required:!1,type:"boolean",declarations:[],schema:{kind:"enum",type:"boolean",schema:["false","true"]}},{name:"ref_key",global:!0,description:"",tags:[],required:!1,type:"string",declarations:[],schema:"string"},{name:"class",global:!0,description:"",tags:[],required:!1,type:"unknown",declarations:[],schema:"unknown"},{name:"style",global:!0,description:"",tags:[],required:!1,type:"unknown",declarations:[],schema:"unknown"}],events:[],slots:[],exposed:[{name:"highlight",type:"boolean",description:"",declarations:[],schema:{kind:"enum",type:"boolean",schema:["false","true"]}},{name:"value",type:"Record<string, any> | unknown[]",description:"",declarations:[],schema:{kind:"enum",type:"Record<string, any> | unknown[]",schema:["Record<string, any>",{kind:"array",type:"unknown[]"}]}}],sourceFiles:"/home/runner/work/Vitel/Vitel/components/dump.vue"};const U={title:"Components/Dump",component:L,tags:["autodocs"]},l={args:{value:{foo:1,bar:2,baz:3}}},c={args:{value:[{title:"Foo widget",value:123},{title:"Bar widget",value:456},{title:"Baz widget",value:789}]}},p={args:{highlight:!1,value:[{title:"Foo widget",value:123},{title:"Bar widget",value:456},{title:"Baz widget",value:789}]}};var b,B,O;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    value: {
      foo: 1,
      bar: 2,
      baz: 3
    }
  }
}`,...(O=(B=l.parameters)==null?void 0:B.docs)==null?void 0:O.source}}};var q,C,R;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    value: [{
      title: 'Foo widget',
      value: 123
    }, {
      title: 'Bar widget',
      value: 456
    }, {
      title: 'Baz widget',
      value: 789
    }]
  }
}`,...(R=(C=c.parameters)==null?void 0:C.docs)==null?void 0:R.source}}};var E,S,x;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    highlight: false,
    value: [{
      title: 'Foo widget',
      value: 123
    }, {
      title: 'Bar widget',
      value: 456
    }, {
      title: 'Baz widget',
      value: 789
    }]
  }
}`,...(x=(S=p.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};const W=["Object","Collection","CollectionNoHighlight"];export{c as Collection,p as CollectionNoHighlight,l as Object,W as __namedExportsOrder,U as default};
