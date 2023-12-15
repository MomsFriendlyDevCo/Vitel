import{F as b}from"./number-4f3234f8.js";import{c as _,j as e,a as c,t as o,o as B}from"./vue.esm-bundler-265ab2d6.js";import{_ as N}from"./_plugin-vue_export-helper-c27b6911.js";const v={props:{value:Number,locale:String,currency:{type:[Boolean,String],default:!1}},computed:{options(){return{locale:this.locale,currency:this.currency}}},methods:{number:b}};function h(x,D,s,F,V,n){return B(),_("div",null,[e("p",null,[c(" Given value: "),e("pre",null,o(s.value),1)]),e("p",null,[c(" Given options: "),e("pre",null,o(n.options),1)]),e("p",null," Output: "+o(n.number(s.value,n.options)),1)])}const S=N(v,[["render",h]]);v.__docgenInfo={description:"Demo for the Number filter function",tags:{params:[{title:"param",type:{name:"Array<String>"},name:"value",description:"The value to format"},{title:"param",type:{name:"String"},description:"[locale=Intl.DateTimeFormat().resolvedOptions().locale] Locale to format to"},{title:"param",type:{name:"union",elements:[{name:"Boolean"},{name:"String"}]},description:"[currency=false] Either enable currency mode (defaults to `'AUD'`) or specify a three letter upper-case currency format to use"}]},exportName:"default",displayName:"number.demo",props:[{name:"value",type:{name:"number"}},{name:"locale",type:{name:"string"}},{name:"currency",type:{name:"boolean|string"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/Vitel/Vitel/filters/number.demo.vue"]};const E={title:"Filters/Number",component:S,tags:["autodocs"]},r={args:{value:123456789}},a={args:{value:123456789,currency:!0}},t={args:{value:123456789,locale:"en-UK",currency:"GBP"}};var l,u,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    value: 123456789
  }
}`,...(m=(u=r.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var i,p,d;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    value: 123456789,
    currency: true
  }
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var f,y,g;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    value: 123456789,
    locale: 'en-UK',
    currency: 'GBP'
  }
}`,...(g=(y=t.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};const L=["BasicNumber","BasicCurrency","CurrencyLocale"];export{a as BasicCurrency,r as BasicNumber,t as CurrencyLocale,L as __namedExportsOrder,E as default};
//# sourceMappingURL=number.stories-7a75b19d.js.map
