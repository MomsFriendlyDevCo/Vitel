import{c as j,j as a,a as l,t as m,o as _}from"./vue.esm-bundler-265ab2d6.js";import{_ as B}from"./_plugin-vue_export-helper-c27b6911.js";function S(t,c){var e={formatter:null,pick:null,max:0,maxText:":X items",conjoin:"and",...c};return e.formatter||(e.formatter=new Intl.ListFormat("en",{style:"long",type:e.conjoin=="and"?"conjunction":"disjunction"})),e.max>0&&t.length>e.max?e.maxText.replace(":X",t.length):e.formatter.format(typeof e.pick=="string"&&Array.isArray(t)&&t.every(n=>n[e.pick])?t.map(n=>n[e.pick]):t)}const k={props:{value:Array,pick:String,max:{type:Number,default:0},maxText:{type:String,default:":X items"},conjoin:{type:String,default:"and"},formatter:Function},computed:{options(){return{pick:this.pick,max:this.max,maxText:this.maxText,conjoin:this.conjoin,formatter:this.formater}}},methods:{list:S}};function F(t,c,e,n,b,s){return _(),j("div",null,[a("p",null,[l(" Given value: "),a("pre",null,m(e.value),1)]),a("p",null,[l(" Given options: "),a("pre",null,m(s.options),1)]),a("p",null," Output: "+m(s.list(e.value,s.options)),1)])}const T=B(k,[["render",F]]);k.__docgenInfo={description:"Demo for the List filter function",tags:{params:[{title:"param",type:{name:"Array<String>"},name:"value",description:"The value to format"},{title:"param",type:{name:"String"},description:"[pick] Optional field within a collection to pick the text value from if the input is a collection"},{title:"param",type:{name:"Number"},description:"[max=0] Maximum number of items before truncating"},{title:"param",type:{name:"String"},description:'[maxText=":X items"] Text to use if the number of items is sgreater than `options.max`. Specify `:X` to replace the value array length'},{title:"param",type:{name:"String"},description:"[conjoin='and'] How to conjoin. Either 'and' or 'or'"},{title:"param",type:{name:"Object"},description:"[formatter] Formatter to use, defaults to Intl.ListFormat using the the settings here"}]},exportName:"default",displayName:"list.demo",props:[{name:"value",type:{name:"array"}},{name:"pick",type:{name:"string"}},{name:"max",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"maxText",type:{name:"string"},defaultValue:{func:!1,value:"':X items'"}},{name:"conjoin",type:{name:"string"},defaultValue:{func:!1,value:"'and'"}},{name:"formatter",type:{name:"func"}}],sourceFiles:["/home/runner/work/Vitel/Vitel/filters/list.demo.vue"]};const J={title:"Filters/List",component:T,tags:["autodocs"]},r={args:{value:["Foo","Bar","Baz"]}},o={args:{value:["Foo","Bar","Baz"],conjoin:"or"}},i={args:{value:[{name:"Joe",age:22},{name:"Jane",age:35},{name:"Janet",age:41}],pick:"name"}};var p,u,f;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    value: ['Foo', 'Bar', 'Baz']
  }
}`,...(f=(u=r.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var d,g,x;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    value: ['Foo', 'Bar', 'Baz'],
    conjoin: 'or'
  }
}`,...(x=(g=o.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var y,h,v;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    value: [{
      name: 'Joe',
      age: 22
    }, {
      name: 'Jane',
      age: 35
    }, {
      name: 'Janet',
      age: 41
    }],
    pick: 'name'
  }
}`,...(v=(h=i.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const N=["BasicList","ConjoinOr","CollectionPick"];export{r as BasicList,i as CollectionPick,o as ConjoinOr,N as __namedExportsOrder,J as default};
//# sourceMappingURL=list.stories-81a95f25.js.map
