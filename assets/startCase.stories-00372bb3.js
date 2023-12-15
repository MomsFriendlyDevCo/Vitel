import{s as C}from"./startCase-564f1a8b.js";import{c as f,j as r,a as v,t as o,o as _}from"./vue.esm-bundler-265ab2d6.js";import{_ as g}from"./_plugin-vue_export-helper-c27b6911.js";import"./_createCompounder-2450f8c7.js";import"./toString-ff5f6f12.js";import"./isObjectLike-46b91259.js";import"./isArray-513c67aa.js";import"./isSymbol-506079dd.js";function h(t){return C(t)}const p={props:{value:Number},computed:{options(){return{locale:this.locale,currency:this.currency}}},methods:{startCase:h}};function S(t,x,s,B,N,d){return _(),f("div",null,[r("p",null,[v(" Given value: "),r("pre",null,o(s.value),1)]),r("p",null," Output: "+o(d.startCase(s.value)),1)])}const y=g(p,[["render",S]]);p.__docgenInfo={description:"Demo for the StartCase filter function",tags:{params:[{title:"param",type:{name:"Array<String>"},name:"value",description:"The value to format"}]},exportName:"default",displayName:"startCase.demo",props:[{name:"value",type:{name:"number"}}],sourceFiles:["/home/runner/work/Vitel/Vitel/filters/startCase.demo.vue"]};const W={title:"Filters/StartCase",component:y,tags:["autodocs"]},e={args:{value:"hello"}},a={args:{value:"thisCamelCasedString"}};var n,c,l;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    value: 'hello'
  }
}`,...(l=(c=e.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var i,m,u;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    value: 'thisCamelCasedString'
  }
}`,...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const $=["BasicWord","CamelCased"];export{e as BasicWord,a as CamelCased,$ as __namedExportsOrder,W as default};
//# sourceMappingURL=startCase.stories-00372bb3.js.map
