const e="lod-widgets";const t={allRenderFn:true,appendChildSlotFix:false,asyncLoading:true,asyncQueue:false,attachStyles:true,cloneNodeFix:false,cmpDidLoad:false,cmpDidRender:false,cmpDidUnload:false,cmpDidUpdate:false,cmpShouldUpdate:false,cmpWillLoad:true,cmpWillRender:false,cmpWillUpdate:false,connectedCallback:false,constructableCSS:true,cssAnnotations:true,devTools:false,disconnectedCallback:false,element:false,event:false,experimentalScopedSlotChanges:false,experimentalSlotFixes:false,formAssociated:false,hasRenderFn:true,hostListener:false,hostListenerTarget:false,hostListenerTargetBody:false,hostListenerTargetDocument:false,hostListenerTargetParent:false,hostListenerTargetWindow:false,hotModuleReplacement:false,hydrateClientSide:false,hydrateServerSide:false,hydratedAttribute:false,hydratedClass:true,hydratedSelectorName:"hydrated",initializeNextTick:false,invisiblePrehydration:true,isDebug:false,isDev:false,isTesting:false,lazyLoad:true,lifecycle:true,lifecycleDOMEvents:false,member:true,method:false,mode:false,observeAttribute:true,profile:false,prop:true,propBoolean:false,propMutable:false,propNumber:false,propString:true,reflect:false,scoped:false,scopedSlotTextContentFix:false,scriptDataOpts:false,shadowDelegatesFocus:false,shadowDom:false,slot:false,slotChildNodesFix:false,slotRelocation:false,state:true,style:true,svg:false,taskQueue:true,transformTagName:false,updatable:true,vdomAttribute:true,vdomClass:true,vdomFunctional:true,vdomKey:true,vdomListener:true,vdomPropOrAttr:true,vdomRef:false,vdomRender:true,vdomStyle:true,vdomText:true,vdomXlink:false,watchCallback:false};var n=Object.defineProperty;var l=(e,t)=>{for(var l in t)n(e,l,{get:t[l],enumerable:true})};var r=new WeakMap;var s=e=>r.get(e);var a=(e,t)=>r.set(t.t=e,t);var i=(e,t)=>{const n={l:0,$hostElement$:e,i:t,o:new Map};{n.u=new Promise((e=>n.v=e));e["s-p"]=[];e["s-rc"]=[]}return r.set(e,n)};var o=(e,t)=>t in e;var f=(e,t)=>(0,console.error)(e,t);var c=new Map;var u=(e,t,n)=>{const l=e.p.replace(/-/g,"_");const r=e.h;if(!r){return void 0}const s=c.get(r);if(s){return s[l]}
/*!__STENCIL_STATIC_IMPORT_SWITCH__*/return import(`./${r}.entry.js${""}`).then((e=>{{c.set(r,e)}return e[l]}),f)};var v=new Map;var d="{visibility:hidden}.hydrated{visibility:inherit}";var p="slot-fb{display:contents}slot-fb[hidden]{display:none}";var h=typeof window!=="undefined"?window:{};var m=h.document||{head:{}};var y={l:0,m:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,l)=>e.addEventListener(t,n,l),rel:(e,t,n,l)=>e.removeEventListener(t,n,l),ce:(e,t)=>new CustomEvent(e,t)};var b=t.shadowDom;var w=e=>Promise.resolve(e);var S=(()=>{try{new CSSStyleSheet;return typeof(new CSSStyleSheet).replaceSync==="function"}catch(e){}return false})();var g=false;var $=[];var k=[];var C=(e,t)=>n=>{e.push(n);if(!g){g=true;if(t&&y.l&4){O(j)}else{y.raf(j)}}};var x=e=>{for(let t=0;t<e.length;t++){try{e[t](performance.now())}catch(e){f(e)}}e.length=0};var j=()=>{x($);{x(k);if(g=$.length>0){y.raf(j)}}};var O=e=>w().then(e);var E=C(k,true);var T={};var D=e=>e!=null;var L=e=>{e=typeof e;return e==="object"||e==="function"};function F(e){var t,n,l;return(l=(n=(t=e.head)==null?void 0:t.querySelector('meta[name="csp-nonce"]'))==null?void 0:n.getAttribute("content"))!=null?l:void 0}var M={};l(M,{err:()=>A,map:()=>P,ok:()=>R,unwrap:()=>N,unwrapErr:()=>U});var R=e=>({isOk:true,isErr:false,value:e});var A=e=>({isOk:false,isErr:true,value:e});function P(e,t){if(e.isOk){const n=t(e.value);if(n instanceof Promise){return n.then((e=>R(e)))}else{return R(n)}}if(e.isErr){const t=e.value;return A(t)}throw"should never get here"}var N=e=>{if(e.isOk){return e.value}else{throw e.value}};var U=e=>{if(e.isErr){return e.value}else{throw e.value}};var W=(e,t="")=>{{return()=>{}}};var H=(e,t)=>{{return()=>{}}};var z=(e,t,...n)=>{let l=null;let r=null;let s=false;let a=false;const i=[];const o=t=>{for(let n=0;n<t.length;n++){l=t[n];if(Array.isArray(l)){o(l)}else if(l!=null&&typeof l!=="boolean"){if(s=typeof e!=="function"&&!L(l)){l=String(l)}if(s&&a){i[i.length-1].S+=l}else{i.push(s?B(null,l):l)}a=s}}};o(n);if(t){if(t.key){r=t.key}{const e=t.className||t.class;if(e){t.class=typeof e!=="object"?e:Object.keys(e).filter((t=>e[t])).join(" ")}}}if(typeof e==="function"){return e(t===null?{}:t,i,G)}const f=B(e,null);f.$=t;if(i.length>0){f.k=i}{f.C=r}return f};var B=(e,t)=>{const n={l:0,j:e,S:t,O:null,k:null};{n.$=null}{n.C=null}return n};var Q={};var q=e=>e&&e.j===Q;var G={forEach:(e,t)=>e.map(I).forEach(t),map:(e,t)=>e.map(I).map(t).map(K)};var I=e=>({vattrs:e.$,vchildren:e.k,vkey:e.C,vname:e.T,vtag:e.j,vtext:e.S});var K=e=>{if(typeof e.vtag==="function"){const t={...e.vattrs};if(e.vkey){t.key=e.vkey}if(e.vname){t.name=e.vname}return z(e.vtag,t,...e.vchildren||[])}const t=B(e.vtag,e.vtext);t.$=e.vattrs;t.k=e.vchildren;t.C=e.vkey;t.T=e.vname;return t};var V=(e,t)=>{if(e!=null&&!L(e)){if(t&1){return String(e)}return e}return e};var X=(e,t,n)=>{const l=y.ce(t,n);e.dispatchEvent(l);return l};var _=new WeakMap;var J=(e,t,n)=>{let l=v.get(e);if(S&&n){l=l||new CSSStyleSheet;if(typeof l==="string"){l=t}else{l.replaceSync(t)}}else{l=t}v.set(e,l)};var Y=(e,t,n)=>{var l;const r=ee(t);const s=v.get(r);e=e.nodeType===11?e:m;if(s){if(typeof s==="string"){e=e.head||e;let n=_.get(e);let a;if(!n){_.set(e,n=new Set)}if(!n.has(r)){{a=m.createElement("style");a.innerHTML=s;const n=(l=y.D)!=null?l:F(m);if(n!=null){a.setAttribute("nonce",n)}if(!(t.l&1)){if(e.nodeName==="HEAD"){const t=e.querySelectorAll("link[rel=preconnect]");const n=t.length>0?t[t.length-1].nextSibling:document.querySelector("style");e.insertBefore(a,n)}else if("host"in e){e.prepend(a)}else{e.append(a)}}if(t.l&1&&e.nodeName!=="HEAD"){e.insertBefore(a,null)}}if(t.l&4){a.innerHTML+=p}if(n){n.add(r)}}}else if(!e.adoptedStyleSheets.includes(s)){e.adoptedStyleSheets=[...e.adoptedStyleSheets,s]}}return r};var Z=e=>{const t=e.i;const n=e.$hostElement$;const l=W("attachStyles",t.p);Y(n.getRootNode(),t);l()};var ee=(e,t)=>"sc-"+e.p;var te=(e,t,n,l,r,s)=>{if(n!==l){let a=o(e,t);let i=t.toLowerCase();if(t==="class"){const t=e.classList;const r=le(n);const s=le(l);t.remove(...r.filter((e=>e&&!s.includes(e))));t.add(...s.filter((e=>e&&!r.includes(e))))}else if(t==="style"){{for(const t in n){if(!l||l[t]==null){if(t.includes("-")){e.style.removeProperty(t)}else{e.style[t]=""}}}}for(const t in l){if(!n||l[t]!==n[t]){if(t.includes("-")){e.style.setProperty(t,l[t])}else{e.style[t]=l[t]}}}}else if(t==="key");else if(!a&&t[0]==="o"&&t[1]==="n"){if(t[2]==="-"){t=t.slice(3)}else if(o(h,i)){t=i.slice(2)}else{t=i[2]+t.slice(3)}if(n||l){const r=t.endsWith(re);t=t.replace(se,"");if(n){y.rel(e,t,n,r)}if(l){y.ael(e,t,l,r)}}}else{const i=L(l);if((a||i&&l!==null)&&!r){try{if(!e.tagName.includes("-")){const r=l==null?"":l;if(t==="list"){a=false}else if(n==null||e[t]!=r){if(typeof e.__lookupSetter__(t)==="function"){e[t]=r}else{e.setAttribute(t,r)}}}else{e[t]=l}}catch(e){}}if(l==null||l===false){if(l!==false||e.getAttribute(t)===""){{e.removeAttribute(t)}}}else if((!a||s&4||r)&&!i){l=l===true?"":l;{e.setAttribute(t,l)}}}}};var ne=/\s/;var le=e=>!e?[]:e.split(ne);var re="Capture";var se=new RegExp(re+"$");var ae=(e,t,n)=>{const l=t.O.nodeType===11&&t.O.host?t.O.host:t.O;const r=e&&e.$||T;const s=t.$||T;{for(const e of ie(Object.keys(r))){if(!(e in s)){te(l,e,r[e],void 0,n,t.l)}}}for(const e of ie(Object.keys(s))){te(l,e,r[e],s[e],n,t.l)}};function ie(e){return e.includes("ref")?[...e.filter((e=>e!=="ref")),"ref"]:e}var oe;var fe;var ce=false;var ue=false;var ve=(e,n,l,r)=>{const s=n.k[l];let a=0;let i;let o;if(s.S!==null){i=s.O=m.createTextNode(s.S)}else{i=s.O=m.createElement(!ce&&t.slotRelocation&&s.l&2?"slot-fb":s.j);{ae(null,s,ue)}const n=i.getRootNode();const l=!n.querySelector("body");if(!l&&t.scoped&&D(oe)&&i["s-si"]!==oe){i.classList.add(i["s-si"]=oe)}if(s.k){for(a=0;a<s.k.length;++a){o=ve(e,s,a);if(o){i.appendChild(o)}}}}i["s-hn"]=fe;return i};var de=(e,t,n,l,r,s)=>{let a=e;let i;for(;r<=s;++r){if(l[r]){i=ve(null,n,r);if(i){l[r].O=i;be(a,i,t)}}}};var pe=(e,t,n)=>{for(let l=t;l<=n;++l){const t=e[l];if(t){const e=t.O;if(e){e.remove()}}}};var he=(e,t,n,l,r=false)=>{let s=0;let a=0;let i=0;let o=0;let f=t.length-1;let c=t[0];let u=t[f];let v=l.length-1;let d=l[0];let p=l[v];let h;let m;while(s<=f&&a<=v){if(c==null){c=t[++s]}else if(u==null){u=t[--f]}else if(d==null){d=l[++a]}else if(p==null){p=l[--v]}else if(me(c,d,r)){ye(c,d,r);c=t[++s];d=l[++a]}else if(me(u,p,r)){ye(u,p,r);u=t[--f];p=l[--v]}else if(me(c,p,r)){ye(c,p,r);be(e,c.O,u.O.nextSibling);c=t[++s];p=l[--v]}else if(me(u,d,r)){ye(u,d,r);be(e,u.O,c.O);u=t[--f];d=l[++a]}else{i=-1;{for(o=s;o<=f;++o){if(t[o]&&t[o].C!==null&&t[o].C===d.C){i=o;break}}}if(i>=0){m=t[i];if(m.j!==d.j){h=ve(t&&t[a],n,i)}else{ye(m,d,r);t[i]=void 0;h=m.O}d=l[++a]}else{h=ve(t&&t[a],n,a);d=l[++a]}if(h){{be(c.O.parentNode,h,c.O)}}}}if(s>f){de(e,l[v+1]==null?null:l[v+1].O,n,l,a,v)}else if(a>v){pe(t,s,f)}};var me=(e,t,n=false)=>{if(e.j===t.j){if(!n){return e.C===t.C}return true}return false};var ye=(e,n,l=false)=>{const r=n.O=e.O;const s=e.k;const a=n.k;const i=n.S;if(i===null){{{ae(e,n,ue)}}if(s!==null&&a!==null){he(r,s,n,a,l)}else if(a!==null){if(e.S!==null){r.textContent=""}de(r,null,n,a,0,a.length-1)}else if(!l&&t.updatable&&s!==null){pe(s,0,s.length-1)}}else if(e.S!==i){r.data=i}};var be=(e,t,n)=>{const l=e==null?void 0:e.insertBefore(t,n);return l};var we=(e,t,n=false)=>{const l=e.$hostElement$;const r=e.L||B(null,null);const s=q(t)?t:z(null,null,t);fe=l.tagName;if(n&&s.$){for(const e of Object.keys(s.$)){if(l.hasAttribute(e)&&!["key","ref","style","class"].includes(e)){s.$[e]=l[e]}}}s.j=null;s.l|=4;e.L=s;s.O=r.O=l;ce=b;ye(r,s,n)};var Se=(e,t)=>{if(t&&!e.F&&t["s-p"]){t["s-p"].push(new Promise((t=>e.F=t)))}};var ge=(e,t)=>{{e.l|=16}if(e.l&4){e.l|=512;return}Se(e,e.M);const n=()=>$e(e,t);return E(n)};var $e=(e,t)=>{const n=e.$hostElement$;const l=W("scheduleUpdate",e.i.p);const r=e.t;if(!r){throw new Error(`Can't render component <${n.tagName.toLowerCase()} /> with invalid Stencil runtime! Make sure this imported component is compiled with a \`externalRuntime: true\` flag. For more information, please refer to https://stenciljs.com/docs/custom-elements#externalruntime`)}let s;if(t){{s=Te(r,"componentWillLoad")}}l();return ke(s,(()=>xe(e,r,t)))};var ke=(e,t)=>Ce(e)?e.then(t).catch((e=>{console.error(e);t()})):t();var Ce=e=>e instanceof Promise||e&&e.then&&typeof e.then==="function";var xe=async(e,t,n)=>{var l;const r=e.$hostElement$;const s=W("update",e.i.p);const a=r["s-rc"];if(n){Z(e)}const i=W("render",e.i.p);{je(e,t,r,n)}if(a){a.map((e=>e()));r["s-rc"]=void 0}i();s();{const t=(l=r["s-p"])!=null?l:[];const n=()=>Oe(e);if(t.length===0){n()}else{Promise.all(t).then(n);e.l|=4;t.length=0}}};var je=(e,t,n,l)=>{try{t=t.render();{e.l&=~16}{e.l|=2}{{{we(e,t,l)}}}}catch(t){f(t,e.$hostElement$)}return null};var Oe=e=>{const t=e.i.p;const n=e.$hostElement$;const l=W("postUpdate",t);const r=e.M;if(!(e.l&64)){e.l|=64;{De(n)}l();{e.v(n);if(!r){Ee()}}}else{l()}{if(e.F){e.F();e.F=void 0}if(e.l&512){O((()=>ge(e,false)))}e.l&=~(4|512)}};var Ee=t=>{{De(m.documentElement)}O((()=>X(h,"appload",{detail:{namespace:e}})))};var Te=(e,t,n)=>{if(e&&e[t]){try{return e[t](n)}catch(e){f(e)}}return void 0};var De=e=>{var n;return e.classList.add((n=t.hydratedSelectorName)!=null?n:"hydrated")};var Le=(e,t)=>s(e).o.get(t);var Fe=(e,t,n,l)=>{const r=s(e);if(!r){throw new Error(`Couldn't find host element for "${l.p}" as it is unknown to this Stencil runtime. This usually happens when integrating a 3rd party Stencil component with another Stencil component or application. Please reach out to the maintainers of the 3rd party Stencil component or report this on the Stencil Discord server (https://chat.stenciljs.com) or comment on this similar [GitHub issue](https://github.com/ionic-team/stencil/issues/5457).`)}const a=r.o.get(t);const i=r.l;const o=r.t;n=V(n,l.R[t][0]);const f=Number.isNaN(a)&&Number.isNaN(n);const c=n!==a&&!f;if((!(i&8)||a===void 0)&&c){r.o.set(t,n);if(o){if((i&(2|16))===2){ge(r,false)}}}};var Me=(e,n,l)=>{var r,a;const i=e.prototype;if(n.R||t.watchCallback){const t=Object.entries((r=n.R)!=null?r:{});t.map((([e,[t]])=>{if(t&31||l&2&&t&32){Object.defineProperty(i,e,{get(){return Le(this,e)},set(t){Fe(this,e,t,n)},configurable:true,enumerable:true})}}));if(l&1){const l=new Map;i.attributeChangedCallback=function(e,t,r){y.jmp((()=>{var a;const o=l.get(e);if(this.hasOwnProperty(o)){r=this[o];delete this[o]}else if(i.hasOwnProperty(o)&&typeof this[o]==="number"&&this[o]==r){return}else if(o==null){const l=s(this);const i=l==null?void 0:l.l;if(i&&!(i&8)&&i&128&&r!==t){const s=l.t;const i=(a=n.A)==null?void 0:a[e];i==null?void 0:i.forEach((n=>{if(s[n]!=null){s[n].call(s,r,t,e)}}))}return}this[o]=r===null&&typeof this[o]==="boolean"?false:r}))};e.observedAttributes=Array.from(new Set([...Object.keys((a=n.A)!=null?a:{}),...t.filter((([e,t])=>t[0]&15)).map((([e,t])=>{const n=t[1]||e;l.set(n,e);return n}))]))}}return e};var Re=async(e,t,n,l)=>{let r;if((t.l&32)===0){t.l|=32;const l=n.h;if(l){const e=u(n);if(e&&"then"in e){const t=H();r=await e;t()}else{r=e}if(!r){throw new Error(`Constructor for "${n.p}#${t.P}" was not found`)}if(!r.isProxied){Me(r,n,2);r.isProxied=true}const l=W("createInstance",n.p);{t.l|=8}try{new r(t)}catch(e){f(e)}{t.l&=~8}l()}else{r=e.constructor;const n=e.localName;customElements.whenDefined(n).then((()=>t.l|=128))}if(r&&r.style){let e;if(typeof r.style==="string"){e=r.style}const t=ee(n);if(!v.has(t)){const l=W("registerStyles",n.p);J(t,e,!!(n.l&1));l()}}}const s=t.M;const a=()=>ge(t,true);if(s&&s["s-rc"]){s["s-rc"].push(a)}else{a()}};var Ae=e=>{};var Pe=e=>{if((y.l&1)===0){const t=s(e);const n=t.i;const l=W("connectedCallback",n.p);if(!(t.l&1)){t.l|=1;{let n=e;while(n=n.parentNode||n.host){if(n["s-p"]){Se(t,t.M=n);break}}}if(n.R){Object.entries(n.R).map((([t,[n]])=>{if(n&31&&e.hasOwnProperty(t)){const n=e[t];delete e[t];e[t]=n}}))}{Re(e,t,n)}}else{if(t==null?void 0:t.t);else if(t==null?void 0:t.u){t.u.then((()=>Ae()))}}l()}};var Ne=e=>{};var Ue=async e=>{if((y.l&1)===0){const t=s(e);if(t==null?void 0:t.t);else if(t==null?void 0:t.u){t.u.then((()=>Ne()))}}};var We=(e,t={})=>{var n;const l=W();const r=[];const a=t.exclude||[];const o=h.customElements;const f=m.head;const c=f.querySelector("meta[charset]");const u=m.createElement("style");const v=[];let b;let w=true;Object.assign(y,t);y.m=new URL(t.resourcesUrl||"./",m.baseURI).href;let S=false;e.map((e=>{e[1].map((t=>{const n={l:t[0],p:t[1],R:t[2],N:t[3]};if(n.l&4){S=true}{n.R=t[2]}const l=n.p;const f=class extends HTMLElement{constructor(e){super(e);this.hasRegisteredEventListeners=false;e=this;i(e,n)}connectedCallback(){s(this);if(!this.hasRegisteredEventListeners){this.hasRegisteredEventListeners=true}if(b){clearTimeout(b);b=null}if(w){v.push(this)}else{y.jmp((()=>Pe(this)))}}disconnectedCallback(){y.jmp((()=>Ue(this)))}componentOnReady(){return s(this).u}};n.h=e[0];if(!a.includes(l)&&!o.get(l)){r.push(l);o.define(l,Me(f,n,1))}}))}));if(r.length>0){if(S){u.textContent+=p}{u.textContent+=r.sort()+d}if(u.innerHTML.length){u.setAttribute("data-styles","");const e=(n=y.D)!=null?n:F(m);if(e!=null){u.setAttribute("nonce",e)}f.insertBefore(u,c?c.nextSibling:f.firstChild)}}w=false;if(v.length){v.map((e=>e.connectedCallback()))}else{{y.jmp((()=>b=setTimeout(Ee,30)))}}l()};var He=(e,t)=>t;var ze=e=>y.D=e;export{He as F,We as b,z as h,w as p,a as r,ze as s};
//# sourceMappingURL=p-23ad6437.js.map