import"./index-BCAj_bCp.js";import{V as c,_ as m}from"./vitel-BdOHhjIm.js";import{F as p}from"./currency-Q2MOGp44.js";import{F as u}from"./number-D-Kw1va3.js";import{F as f}from"./pluralize-B5uYQarM.js";import{c as y,e,t,o as g}from"./vue.esm-bundler-CIUkA9VC.js";import{_ as v}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as b}from"./entry-preview-BsfXFv1X.js";import"./isArrayLike-DYVE1Yub.js";import"./isObjectLike-Dipz0mOK.js";import"./isArray-Dxzbedgu.js";const a={computed:{filtersState(){return{filters:Object.fromEntries(Object.entries(this.$filters.filters).map(([r])=>[r,`[${r} filter]`]))}}}},_={class:"card mb-2"},k={class:"card-body"},$={class:"card mb-2"},h={class:"card-body"},w={class:"row"},F={class:"col-4"},q={class:"row"},V={class:"col-4"},E={class:"row"},N={class:"col-4"},S={class:"row"},x={class:"col-4"};function O(r,s,j,z,B,d){return g(),y("div",null,[e("div",_,[s[1]||(s[1]=e("div",{class:"card-header"},"$filters.filters",-1)),e("div",k,[s[0]||(s[0]=e("p",null,"Access for loaded filters.",-1)),e("pre",null,"$filters: "+t(d.filtersState),1)])]),e("div",$,[s[6]||(s[6]=e("div",{class:"card-header"},"$filters examples",-1)),e("div",h,[e("div",w,[s[2]||(s[2]=e("div",{class:"col-8"},[e("code",null,"{{$filters.number(123456789)}}")],-1)),e("div",F,[e("pre",null,t(r.$filters.number(123456789)),1)])]),e("div",q,[s[3]||(s[3]=e("div",{class:"col-8"},[e("code",null,"{{$filters.pipe(123456789, 'number')}}")],-1)),e("div",V,[e("pre",null,t(r.$filters.pipe(123456789,"number")),1)])]),e("div",E,[s[4]||(s[4]=e("div",{class:"col-8"},[e("code",null,"{{$filters.pipe(123456789, 'currency')}}")],-1)),e("div",N,[e("pre",null,t(r.$filters.pipe(123456789,"currency")),1)])]),e("div",S,[s[5]||(s[5]=e("div",{class:"col-8"},[e("code",null,"{{$filters.pipe(2, 'currency', ['pluralize', '[dollar|dollars]'])}}")],-1)),e("div",x,[e("pre",null,t(r.$filters.pipe(2,"currency",["pluralize","[dollar|dollars]"])),1)])])])])])}const P=v(a,[["render",O]]);a.__docgenInfo={exportName:"default",displayName:"filters.demo",type:1,props:[{name:"key",global:!0,description:"",tags:[],required:!1,type:"PropertyKey",declarations:[],schema:{kind:"enum",type:"PropertyKey",schema:["string","number","symbol"]}},{name:"ref",global:!0,description:"",tags:[],required:!1,type:"VNodeRef",declarations:[],schema:{kind:"enum",type:"VNodeRef",schema:["string","Ref<any, any>",{kind:"event",type:"(ref: Element | ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions>, ... 4 more ..., any>, refs: Record<...>): void",schema:[]}]}},{name:"ref_for",global:!0,description:"",tags:[],required:!1,type:"boolean",declarations:[],schema:{kind:"enum",type:"boolean",schema:["false","true"]}},{name:"ref_key",global:!0,description:"",tags:[],required:!1,type:"string",declarations:[],schema:"string"},{name:"class",global:!0,description:"",tags:[],required:!1,type:"unknown",declarations:[],schema:"unknown"},{name:"style",global:!0,description:"",tags:[],required:!1,type:"unknown",declarations:[],schema:"unknown"}],events:[],slots:[],exposed:[{name:"filtersState",type:"{ filters: { [k: string]: string; }; }",description:"",declarations:[],schema:{kind:"object",type:"{ filters: { [k: string]: string; }; }",schema:{filters:{name:"filters",global:!1,description:"",tags:[],required:!0,type:"{ [k: string]: string; }",declarations:[],schema:{kind:"object",type:"{ [k: string]: string; }",schema:{}}}}}}],sourceFiles:"/home/runner/work/Vitel/Vitel/services/filters.demo.vue"};b(r=>{r.use(c),r.service("$filters",m),r.filter("currency",p),r.filter("number",u),r.filter("pluralize",f)});const M={title:"Services/Filters",component:P,tags:["autodocs"],argTypes:{}},i={};var o,l,n;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(n=(l=i.parameters)==null?void 0:l.docs)==null?void 0:n.source}}};const Q=["Example"];export{i as Example,Q as __namedExportsOrder,M as default};
