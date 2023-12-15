import{g as N}from"./_commonjsHelpers-de833af9.js";import{c as g,t as b,o as d}from"./vue.esm-bundler-265ab2d6.js";import{_ as D}from"./_plugin-vue_export-helper-c27b6911.js";var h="    ";function F(e){var r="";return e&&Object.keys(e).forEach(function(n){r+=n+":"+e[n]+";"}),r}function I(e){function r(a){return'class="'+a+'"'}function n(a){return'style="'+F(e["."+a])+'"'}return e?n:r}function A(e){return e===null?"null":Array.isArray(e)?"array":typeof e=="string"&&/^https?:/.test(e)?"link":typeof e=="object"&&typeof e.toISOString=="function"?"date":typeof e}function u(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var H=function(e,r){var n="",a=I(r),m=function(t,i,s,z){if(!t.length)return i+" "+s;var f=i+`
`;return n+=h,t.forEach(function(C,E){f+=n+z(C)+(E<t.length-1?",":"")+`
`}),n=n.slice(0,-h.length),f+n+s};function o(t){if(t===void 0)return"";switch(A(t)){case"boolean":return"<span "+a("json-markup-bool")+">"+t+"</span>";case"number":return"<span "+a("json-markup-number")+">"+t+"</span>";case"date":return'<span class="json-markup-string">"'+u(t.toISOString())+'"</span>';case"null":return"<span "+a("json-markup-null")+">null</span>";case"string":return"<span "+a("json-markup-string")+'>"'+u(t.replace(/\n/g,`
`+n))+'"</span>';case"link":return"<span "+a("json-markup-string")+'>"<a href="'+u(t)+'">'+u(t)+'</a>"</span>';case"array":return m(t,"[","]",o);case"object":var i=Object.keys(t).filter(function(s){return t[s]!==void 0});return m(i,"{","}",function(s){return"<span "+a("json-markup-key")+'>"'+u(s)+'":</span> '+o(t[s])})}return""}return"<div "+a("json-markup")+">"+o(e)+"</div>"};const M=N(H);const x={props:{highlight:{type:Boolean,default:!0},value:{type:[Object,Array]}},methods:{markup:M}},T={class:"dump"},V={key:0},L=["innerHTML"];function $(e,r,n,a,m,o){return d(),g("div",T,[n.highlight?(d(),g("div",{key:1,innerHTML:o.markup(n.value)},null,8,L)):(d(),g("pre",V,b(n.value),1))])}const J=D(x,[["render",$]]);x.__docgenInfo={description:"Basic data dumping + JSON formatting as a Vue component",tags:{params:[{title:"param",type:{name:"union",elements:[{name:"Object"},{name:"Array"}]},name:"value",description:"The value to output"},{title:"param",type:{name:"Boolean"},description:"[highlight=true] Whether to highlight the output"}]},exportName:"default",displayName:"dump",props:[{name:"highlight",type:{name:"boolean"},defaultValue:{func:!1,value:"true"}},{name:"value",type:{name:"object|array"}}],sourceFiles:["/home/runner/work/Vitel/Vitel/components/dump.vue"]};const K={title:"Components/Dump",component:J,tags:["autodocs"]},l={args:{value:{foo:1,bar:2,baz:3}}},c={args:{value:[{title:"Foo widget",value:123},{title:"Bar widget",value:456},{title:"Baz widget",value:789}]}},p={args:{highlight:!1,value:[{title:"Foo widget",value:123},{title:"Bar widget",value:456},{title:"Baz widget",value:789}]}};var v,y,_;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    value: {
      foo: 1,
      bar: 2,
      baz: 3
    }
  }
}`,...(_=(y=l.parameters)==null?void 0:y.docs)==null?void 0:_.source}}};var k,w,B;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(B=(w=c.parameters)==null?void 0:w.docs)==null?void 0:B.source}}};var O,S,j;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(j=(S=p.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};const P=["Object","Collection","CollectionNoHighlight"];export{c as Collection,p as CollectionNoHighlight,l as Object,P as __namedExportsOrder,K as default};
//# sourceMappingURL=dump.stories-a1e7596f.js.map
