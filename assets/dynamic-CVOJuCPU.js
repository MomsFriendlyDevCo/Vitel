import{h as r,b as s}from"./vue.esm-bundler-CIUkA9VC.js";const n={props:{component:{type:[String,Object],required:!0},props:{type:Object},events:{type:Object},refHandle:{type:String}},render(){return r(typeof this.component=="string"?s(this.component):this.component,{...this.refHandle&&{ref:this.refHandle},...this.props,...Object.fromEntries(Object.entries(this.events||{}).map(([e,t])=>["on"+e.substr(0,1).toUpperCase()+e.substr(1),t]))})}},o=n;n.__docgenInfo={exportName:"default",displayName:"dynamic",type:1,props:[{name:"props",global:!1,description:"",tags:[],required:!1,type:"Record<string, any>",declarations:[],schema:"Record<string, any>"},{name:"key",global:!0,description:"",tags:[],required:!1,type:"PropertyKey",declarations:[],schema:{kind:"enum",type:"PropertyKey",schema:["string","number","symbol"]}},{name:"ref",global:!0,description:"",tags:[],required:!1,type:"VNodeRef",declarations:[],schema:{kind:"enum",type:"VNodeRef",schema:["string","Ref<any, any>",{kind:"event",type:"(ref: Element | ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions>, ... 4 more ..., any>, refs: Record<...>): void",schema:[]}]}},{name:"ref_for",global:!0,description:"",tags:[],required:!1,type:"boolean",declarations:[],schema:{kind:"enum",type:"boolean",schema:["false","true"]}},{name:"ref_key",global:!0,description:"",tags:[],required:!1,type:"string",declarations:[],schema:"string"},{name:"class",global:!0,description:"",tags:[],required:!1,type:"unknown",declarations:[],schema:"unknown"},{name:"style",global:!0,description:"",tags:[],required:!1,type:"unknown",declarations:[],schema:"unknown"},{name:"component",global:!1,description:"",tags:[],required:!0,type:"string | Record<string, any>",declarations:[],schema:{kind:"enum",type:"string | Record<string, any>",schema:["string","Record<string, any>"]}},{name:"events",global:!1,description:"",tags:[],required:!1,type:"Record<string, any>",declarations:[],schema:"Record<string, any>"},{name:"refHandle",global:!1,description:"",tags:[],required:!1,type:"string",declarations:[],schema:"string"}],events:[],slots:[],exposed:[{name:"props",type:"Record<string, any>",description:"",declarations:[],schema:"Record<string, any>"},{name:"component",type:"string | Record<string, any>",description:"",declarations:[],schema:{kind:"enum",type:"string | Record<string, any>",schema:["string","Record<string, any>"]}},{name:"events",type:"Record<string, any>",description:"",declarations:[],schema:"Record<string, any>"},{name:"refHandle",type:"string",description:"",declarations:[],schema:"string"}],sourceFiles:"/home/runner/work/Vitel/Vitel/components/dynamic.vue"};export{o as D};