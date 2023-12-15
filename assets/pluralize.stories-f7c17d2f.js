import{F as O}from"./pluralize-14c68d66.js";import{c as b,j as e,a as p,t as i,o as z}from"./vue.esm-bundler-265ab2d6.js";import{_ as N}from"./_plugin-vue_export-helper-c27b6911.js";const _={props:{value:{type:[Number,String],required:!0},prefix:{type:[String,Object]},suffix:{type:[String,Object]},valueIfZero:{type:String}},computed:{options(){return{prefix:this.prefix,suffix:this.suffix,valueIfZero:this.valueIfZero}}},methods:{pluralize:O}};function j(T,Z,n,V,B,s){return z(),b("div",null,[e("p",null,[p(" Given value: "),e("pre",null,i(n.value),1)]),e("p",null,[p(" Given options: "),e("pre",null,i(s.options),1)]),e("p",null," Output: "+i(s.pluralize(n.value,s.options)),1)])}const I=N(_,[["render",j]]);_.__docgenInfo={description:"Demo for the Pluralize filter function",tags:{params:[{title:"param",type:{name:"Array<String>"},name:"value",description:"The value to format"},{title:"param",type:{name:"String"},description:"[prefix=''] Optional prefix to apply to the output or a complex object to pass to @momsfriendlydevco/formatters/pluralize"},{title:"param",type:{name:"String"},description:"[suffix=''] Optional suffix to apply to the output or a complex object to pass to @momsfriendlydevco/formatters/pluralize"},{title:"param",type:{name:"String"},description:"[valueIfZero] Optional overriding return if the numeric value is zero"}]},exportName:"default",displayName:"pluralize.demo",props:[{name:"value",type:{name:"number|string"},required:!0},{name:"prefix",type:{name:"string|object"}},{name:"suffix",type:{name:"string|object"}},{name:"valueIfZero",type:{name:"string"}}],sourceFiles:["/home/runner/work/Vitel/Vitel/filters/pluralize.demo.vue"]};const D={title:"Filters/Pluralize",component:I,tags:["autodocs"]},r={args:{value:123456789}},a={args:{value:1,suffix:"[person|people]"}},t={args:{value:3,prefix:"There are",suffix:{singular:"dog",plural:"dogs"}}},o={args:{value:0,prefix:"There are",suffix:"sad people",valueIfZero:"No-one is sad"}};var u,l,c;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    value: 123456789
  }
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var f,m,d;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    value: 1,
    suffix: '[person|people]'
  }
}`,...(d=(m=a.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var g,x,v;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    value: 3,
    prefix: 'There are',
    suffix: {
      singular: 'dog',
      plural: 'dogs'
    }
  }
}`,...(v=(x=t.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var y,S,h;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    value: 0,
    prefix: 'There are',
    suffix: 'sad people',
    valueIfZero: 'No-one is sad'
  }
}`,...(h=(S=o.parameters)==null?void 0:S.docs)==null?void 0:h.source}}};const q=["BasicNumberOutput","TemplateSuffixes","ObjectSuffixes","NoValueOverrides"];export{r as BasicNumberOutput,o as NoValueOverrides,t as ObjectSuffixes,a as TemplateSuffixes,q as __namedExportsOrder,D as default};
//# sourceMappingURL=pluralize.stories-f7c17d2f.js.map
