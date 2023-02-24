(function(){"use strict";var e={1468:function(e,t,n){var r=n(9242),i=n(967),o=(n(2467),n(3396)),a=n(7139);const s={key:0},c={key:1};function u(e,t,n,r,i,u){const l=(0,o.up)("a-tag"),d=(0,o.up)("AntdvUserIcon"),p=(0,o.up)("SomeContact"),y=(0,o.up)("a-table");return(0,o.wg)(),(0,o.j4)(y,{columns:e.columns,"data-source":e.filteredData,scroll:{x:2e3}},{bodyCell:(0,o.w5)((({column:e,record:t})=>["status_id__name"===e.key?((0,o.wg)(),(0,o.iD)("span",s,[(0,o.Wm)(l,{style:{color:"black"},color:t.status_id__color},{default:(0,o.w5)((()=>[(0,o.Uk)((0,a.zw)(t.status_id__name),1)])),_:2},1032,["color"])])):(0,o.kq)("",!0),"responsible_user_id__name"===e.key?((0,o.wg)(),(0,o.iD)("span",c,[(0,o.Wm)(d),(0,o.Uk)((0,a.zw)(t.responsible_user_id__name),1)])):(0,o.kq)("",!0)])),expandedRowRender:(0,o.w5)((({record:e})=>[(0,o._)("ul",null,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.contactIds,(e=>((0,o.wg)(),(0,o.iD)("li",{key:e},[(0,o.Wm)(p,{contactid:e},null,8,["contactid"])])))),128))])])),_:1},8,["columns","data-source"])}n(7658);function l(e,t,n,r,i,a){const s=(0,o.up)("UserOutlined"),c=(0,o.up)("a-avatar");return(0,o.wg)(),(0,o.j4)(c,{style:{"margin-right":"8px"}},{icon:(0,o.w5)((()=>[(0,o.Wm)(s)])),_:1})}var d=n(8896),p=(0,o.aZ)({components:{UserOutlined:d.Z}}),y=n(89);const _=(0,y.Z)(p,[["render",l]]);var m=_;const f=[],v=[],h=[],g=[],b=[],w=[],k=Object.freeze({isPrimitiveType(e,t){if("number"===typeof e&&isNaN(e))return!1;const n=t.type.endsWith("[]"),r=n?t.type.slice(0,-2):t.type;return n?!!Array.isArray(e)&&e.every((e=>typeof e===r)):typeof e===r},typifyPrimitiveType(e,t){if(!k.isPrimitiveType(e,t))throw new Error("!domainUtil.isPrimitiveType<PrimitiveType>(something, domain)");return e},isDocument(e,t){if("object"!==typeof e||!e)return!1;for(const n in t){const r=e[n],i=t[n];if(!k.isPrimitiveType(r,i))return!1}return Object.keys(e).length===Object.keys(t).length},typifyDocument(e,t){if("object"!==typeof e||!e)throw new Error("typeof something !== object || !something");const n={};for(const r in t){const i=e[r],o=t[r];if(!k.isPrimitiveType(i,o))throw new Error("!domainUtil.isPrimitiveType(prop, domain)");n[r]=i}if(!k.isFullDocument(n,t))throw new Error("!domainUtil.isFullDocument(result, domainSchema)");return n},isDocumentArray(e,t){return!!Array.isArray(e)&&e.every((e=>k.isDocument(e,t)))},typifyDocumentArray(e,t){const n=[];if(!Array.isArray(e))throw new Error("!Array.isArray(something)");for(const r of e)n.push(k.typifyDocument(r,t));return n},isFullDocument(e,t){return Object.keys(e).length===Object.keys(t).length}}),D={id:{type:"number",key:!0},name:{type:"string"},price:{type:"number"},responsible_user_id:{type:"number"},status_id:{type:"number"},pipeline_id:{type:"number"},created_at:{type:"number"}},U={entity_id:{type:"number",key:!0},entity_type:{type:"string",key:!0},to_entity_id:{type:"number",key:!0},to_entity_type:{type:"string",key:!0}},z={id:{type:"number",key:!0},name:{type:"string"},first_name:{type:"string"},last_name:{type:"string"},responsible_user_id:{type:"number"},updated_at:{type:"number"}},S={zz_contact_id:{type:"number",key:!0},zz_field_code1:{type:"string",key:!0},zz_field_code2:{type:"string",key:!0},field_name:{type:"string"},zz_values:{type:"string[]"}},j={id:{type:"number",key:!0},name:{type:"string"},pipeline_id:{type:"number"},color:{type:"string"}},O={id:{type:"number",key:!0},name:{type:"string"}},A=Object.freeze({serverUrl:{NODE_ENV:"production",BASE_URL:"/"}["SERVER_URL"]?{NODE_ENV:"production",BASE_URL:"/"}["SERVER_URL"]:"http://localhost:3000"}),E={async getData(){const e=A.serverUrl+"/api/lead";let t,n;try{const n=await fetch(e);t=await n.json()}catch(r){return void console.error(r)}n=t["amo_lead"],k.isDocumentArray(n,D)&&f.push(...n),n=t["entity_link"],k.isDocumentArray(n,U)&&v.push(...n),n=t["amo_contact"],k.isDocumentArray(n,z)&&h.push(...n),n=t["contact_custom_field"],k.isDocumentArray(n,S)&&g.push(...n),n=t["pipeline_status"],k.isDocumentArray(n,j)&&b.push(...n),n=t["responsible_user"],k.isDocumentArray(n,O)&&w.push(...n)},async getLeadFilter(e){const t=[];if(e.length<3)throw new Error("filterText.length < 3");const n={query:e},r=new URLSearchParams(n).toString(),i=A.serverUrl+`/api/lead?${r}`;let o;try{const e=await fetch(i);o=await e.json()}catch(s){return console.error(s),t}const a={leadIds:{type:"number[]"}};return k.isDocument(o,a)&&t.push(...o.leadIds),t}};var x=n(4870);function P(e,t){const n=(0,o.up)("a-divider");return(0,o.wg)(),(0,o.j4)(n,{type:"vertical",style:{height:"0.9em","background-color":"rgba(0,0,0,.65)"}})}const I={},R=(0,y.Z)(I,[["render",P]]);var W=R,Z=n(4965),T=n(1225);const L=["href"],N=["href"];var F=(0,o.aZ)({__name:"SomeContact",props:{contactid:null},setup(e){const t=e,n={id:0,name:"",first_name:"",last_name:"",responsible_user_id:0,updated_at:0},r=h.find((e=>e.id===t.contactid))||n;let i="";const s=g.find((e=>e.zz_contact_id===t.contactid&&"PHONE"===e.zz_field_code1));s&&(i=s.zz_values[0]||""),i=`tel:${i}`;let c="";const u=g.find((e=>e.zz_contact_id===t.contactid&&"EMAIL"===e.zz_field_code1));u&&(c=u.zz_values[0]||""),c=`mailto:${c}`;const l=r;return(e,t)=>((0,o.wg)(),(0,o.iD)(o.HY,null,[(0,o.Wm)(m),(0,o.Uk)((0,a.zw)(` ${(0,x.SU)(l).name} `)+" ",1),(0,o._)("a",{href:(0,x.SU)(i)},[(0,o.Wm)(W),(0,o.Wm)((0,x.SU)(Z.Z))],8,L),(0,o._)("a",{href:(0,x.SU)(c)},[(0,o.Wm)(W),(0,o.Wm)((0,x.SU)(T.Z))],8,N)],64))}});const C=F;var H=C;const M=[],V=(0,x.iH)([]),$=[{title:"Название",dataIndex:"name",fixed:!0},{title:"Статус",dataIndex:"status_id__name",key:"status_id__name"},{title:"Ответственный",dataIndex:"responsible_user_id__name",key:"responsible_user_id__name"},{title:"Дата создания",dataIndex:"created_at__loc"},{title:"Бюджет",dataIndex:"price__loc",className:"column-money"}];var q=(0,o.aZ)({setup(){return(0,o.bv)((()=>{const e=new Intl.NumberFormat("ru-RU",{style:"currency",currency:"RUB",minimumFractionDigits:0});E.getData().then((()=>{M.push(...f.map((t=>{let n="",r="";const i=b.find((e=>e.pipeline_id===t.pipeline_id&&e.id===t.status_id));i&&(n=i.name,r=i.color);let o="";const a=w.find((e=>e.id===t.responsible_user_id));a&&(o=a.name);const s={...t,key:t.id,created_at__loc:new Date(1e3*t.created_at).toLocaleDateString("ru-RU",{year:"numeric",month:"long",day:"numeric"}).slice(0,-3),price__loc:e.format(t.price),status_id__name:n,status_id__color:r,responsible_user_id__name:o,contactIds:[]};return s.contactIds=v.filter((e=>"leads"===e.entity_type&&"contacts"===e.to_entity_type&&e.entity_id===t.id)).map((e=>e.to_entity_id)),s}))),V.value=M})).catch((e=>console.log(e.message)))})),{data:M,filteredData:V,columns:$}},components:{SomeContact:H,AntdvUserIcon:m}});const B=(0,y.Z)(q,[["render",u]]);var Y=B;function K(e,t,n,r,i,a){const s=(0,o.up)("a-input-search"),c=(0,o.up)("a-space");return(0,o.wg)(),(0,o.j4)(c,{direction:"vertical"},{default:(0,o.w5)((()=>[(0,o.Wm)(s,{value:e.value,"onUpdate:value":t[0]||(t[0]=t=>e.value=t),placeholder:"Поиск сделок",style:{width:"200px"},onSearch:e.onSearch},null,8,["value","onSearch"])])),_:1})}var G=(0,o.aZ)({setup(){const e=(0,x.iH)(""),t=async e=>{if(e.length<3)return void(V.value=M);const t=await E.getLeadFilter(e);t.length<1?V.value=[]:V.value=M.filter((e=>t.includes(e.id)))};return{value:e,onSearch:t}}});const J=(0,y.Z)(G,[["render",K]]);var Q=J;const X={style:{background:"#ececec",padding:"30px"}};var ee=(0,o.aZ)({__name:"AntdvCard",setup(e){return(e,t)=>{const n=(0,o.up)("a-card");return(0,o.wg)(),(0,o.iD)("div",X,[(0,o.Wm)(n,{title:"Пример тестового задания",bordered:!0},{extra:(0,o.w5)((()=>[(0,o.Wm)(Q)])),default:(0,o.w5)((()=>[(0,o.Wm)(Y)])),_:1})])}}});const te=ee;var ne=te,re=(0,o.aZ)({__name:"AppMain",setup(e){return(e,t)=>((0,o.wg)(),(0,o.j4)(ne))}});const ie=re;var oe=ie;const ae=(0,r.ri)(oe);ae.use(i.ZP),ae.mount("#app")}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}n.m=e,function(){var e=[];n.O=function(t,r,i,o){if(!r){var a=1/0;for(l=0;l<e.length;l++){r=e[l][0],i=e[l][1],o=e[l][2];for(var s=!0,c=0;c<r.length;c++)(!1&o||a>=o)&&Object.keys(n.O).every((function(e){return n.O[e](r[c])}))?r.splice(c--,1):(s=!1,o<a&&(a=o));if(s){e.splice(l--,1);var u=i();void 0!==u&&(t=u)}}return t}o=o||0;for(var l=e.length;l>0&&e[l-1][2]>o;l--)e[l]=e[l-1];e[l]=[r,i,o]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};n.O.j=function(t){return 0===e[t]};var t=function(t,r){var i,o,a=r[0],s=r[1],c=r[2],u=0;if(a.some((function(t){return 0!==e[t]}))){for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(c)var l=c(n)}for(t&&t(r);u<a.length;u++)o=a[u],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(l)},r=self["webpackChunktest_folder"]=self["webpackChunktest_folder"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(1468)}));r=n.O(r)})();
//# sourceMappingURL=app.b88a0234.js.map