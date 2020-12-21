var app=function(){"use strict";function e(){}const t=e=>e;function n(e,t){for(const n in t)e[n]=t[n];return e}function s(e){return e()}function r(){return Object.create(null)}function a(e){e.forEach(s)}function o(e){return"function"==typeof e}function l(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function i(t,n,s){t.$$.on_destroy.push(function(t,...n){if(null==t)return e;const s=t.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}(n,s))}function c(e,t,n,s){if(e){const r=u(e,t,n,s);return e[0](r)}}function u(e,t,s,r){return e[1]&&r?n(s.ctx.slice(),e[1](r(t))):s.ctx}function d(e,t,n,s,r,a,o){const l=function(e,t,n,s){if(e[2]&&s){const r=e[2](s(n));if(void 0===t.dirty)return r;if("object"==typeof r){const e=[],n=Math.max(t.dirty.length,r.length);for(let s=0;s<n;s+=1)e[s]=t.dirty[s]|r[s];return e}return t.dirty|r}return t.dirty}(t,s,r,a);if(l){const r=u(t,n,s,o);e.p(r,l)}}function f(t){return t&&o(t.destroy)?t.destroy:e}const p="undefined"!=typeof window;let m=p?()=>window.performance.now():()=>Date.now(),g=p?e=>requestAnimationFrame(e):e;const h=new Set;function v(e){h.forEach((t=>{t.c(e)||(h.delete(t),t.f())})),0!==h.size&&g(v)}function $(e,t){e.appendChild(t)}function x(e,t,n){e.insertBefore(t,n||null)}function k(e){e.parentNode.removeChild(e)}function b(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function w(e){return document.createElement(e)}function y(e){return document.createTextNode(e)}function _(){return y(" ")}function j(){return y("")}function E(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function R(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function L(e,t,n){e.classList[n?"add":"remove"](t)}const C=new Set;let T,M=0;function z(e,t){const n=(e.style.animation||"").split(", "),s=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),r=n.length-s.length;r&&(e.style.animation=s.join(", "),M-=r,M||g((()=>{M||(C.forEach((e=>{const t=e.__svelte_stylesheet;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.__svelte_rules={}})),C.clear())})))}function q(e){T=e}const A=[],S=[],B=[],N=[],I=Promise.resolve();let O=!1;function V(){O||(O=!0,I.then(K))}function H(e){B.push(e)}let D=!1;const P=new Set;function K(){if(!D){D=!0;do{for(let e=0;e<A.length;e+=1){const t=A[e];q(t),F(t.$$)}for(q(null),A.length=0;S.length;)S.pop()();for(let e=0;e<B.length;e+=1){const t=B[e];P.has(t)||(P.add(t),t())}B.length=0}while(A.length);for(;N.length;)N.pop()();O=!1,D=!1,P.clear()}}function F(e){if(null!==e.fragment){e.update(),a(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(H)}}let U;function X(e,t,n){e.dispatchEvent(function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(`${t?"intro":"outro"}${n}`))}const Y=new Set;let G;function J(){G={r:0,c:[],p:G}}function Q(){G.r||a(G.c),G=G.p}function W(e,t){e&&e.i&&(Y.delete(e),e.i(t))}function Z(e,t,n,s){if(e&&e.o){if(Y.has(e))return;Y.add(e),G.c.push((()=>{Y.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}}const ee={duration:0};function te(n,s,r){let a,l,i=s(n,r),c=!1,u=0;function d(){a&&z(n,a)}function f(){const{delay:s=0,duration:r=300,easing:o=t,tick:f=e,css:p}=i||ee;p&&(a=function(e,t,n,s,r,a,o,l=0){const i=16.666/s;let c="{\n";for(let e=0;e<=1;e+=i){const s=t+(n-t)*a(e);c+=100*e+`%{${o(s,1-s)}}\n`}const u=c+`100% {${o(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${l}`,f=e.ownerDocument;C.add(f);const p=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(w("style")).sheet),m=f.__svelte_rules||(f.__svelte_rules={});m[d]||(m[d]=!0,p.insertRule(`@keyframes ${d} ${u}`,p.cssRules.length));const g=e.style.animation||"";return e.style.animation=`${g?`${g}, `:""}${d} ${s}ms linear ${r}ms 1 both`,M+=1,d}(n,0,1,r,s,o,p,u++)),f(0,1);const $=m()+s,x=$+r;l&&l.abort(),c=!0,H((()=>X(n,!0,"start"))),l=function(e){let t;return 0===h.size&&g(v),{promise:new Promise((n=>{h.add(t={c:e,f:n})})),abort(){h.delete(t)}}}((e=>{if(c){if(e>=x)return f(1,0),X(n,!0,"end"),d(),c=!1;if(e>=$){const t=o((e-$)/r);f(t,1-t)}}return c}))}let p=!1;return{start(){p||(z(n),o(i)?(i=i(),(U||(U=Promise.resolve(),U.then((()=>{U=null}))),U).then(f)):f())},invalidate(){p=!1},end(){c&&(d(),c=!1)}}}const ne="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function se(e,t){e.d(1),t.delete(e.key)}function re(e,t){const n={},s={},r={$$scope:1};let a=e.length;for(;a--;){const o=e[a],l=t[a];if(l){for(const e in o)e in l||(s[e]=1);for(const e in l)r[e]||(n[e]=l[e],r[e]=1);e[a]=l}else for(const e in o)r[e]=1}for(const e in s)e in n||(n[e]=void 0);return n}function ae(e){return"object"==typeof e&&null!==e?e:{}}function oe(e){e&&e.c()}function le(e,t,n){const{fragment:r,on_mount:l,on_destroy:i,after_update:c}=e.$$;r&&r.m(t,n),H((()=>{const t=l.map(s).filter(o);i?i.push(...t):a(t),e.$$.on_mount=[]})),c.forEach(H)}function ie(e,t){const n=e.$$;null!==n.fragment&&(a(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ce(t,n,s,o,l,i,c=[-1]){const u=T;q(t);const d=n.props||{},f=t.$$={fragment:null,ctx:null,props:i,update:e,not_equal:l,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:c,skip_bound:!1};let p=!1;if(f.ctx=s?s(t,d,((e,n,...s)=>{const r=s.length?s[0]:n;return f.ctx&&l(f.ctx[e],f.ctx[e]=r)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](r),p&&function(e,t){-1===e.$$.dirty[0]&&(A.push(e),V(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}(t,e)),n})):[],f.update(),p=!0,a(f.before_update),f.fragment=!!o&&o(f.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);f.fragment&&f.fragment.l(e),e.forEach(k)}else f.fragment&&f.fragment.c();n.intro&&W(t.$$.fragment),le(t,n.target,n.anchor),K()}q(u)}class ue{$destroy(){ie(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function de(e,{delay:n=0,duration:s=400,easing:r=t}){const a=+getComputedStyle(e).opacity;return{delay:n,duration:s,easing:r,css:e=>"opacity: "+e*a}}class fe{constructor(e,t,n,s=[]){Object.assign(this,((e,t)=>{t=(t=`${e="/"+e.replace(/^[\/]+|[\/]+$/g,"")}/${t}`.replace(/[\/]+/g,"/")).replace(/^[\/]+|[\/]+$/g,"");const n=/\*$/.test(t)?(t=t.replace(/[\*]+$/g,""),""):"/?$",s=[];let r=0,a=t.replace(/(:)?([^\\/]+)/g,((e,t,n)=>{const[a,o]=n.split("->");if(t){const t=s.filter((e=>e.identifier==o));if(t.length>0)throw new Error(`Duplicated parameter. [${t.map((e=>e.identifier))}]`);return s.push({index:r++,parameter:e,identifier:a}),o?`(${o})`:"([^/]+)"}return`${e}`}));return a=`^/${a}${n}`,{base:e,route:t,regexpRoute:a,parameters:s}})(e,t)),this.callback=n,this.middlewares=s}}class pe{constructor(...e){this.props=e}use(e){if("function"!=typeof e)throw new Error(`Invalid Middleware use argument. Expecting 'function' got : '${typeof e}'`);return this.execute=(t=>n=>t(e.bind(this,...this.props,n)))(this.execute),this}execute(e){return e.call(null)}}class me{constructor(e){Object.assign(this,{base:"",path:"",route:"",query:{},params:{},state:{}},e)}}class ge{constructor(e){Object.assign(this,e)}}class he extends Error{}class ve extends class{constructor(e){Object.freeze(this.__properties={initial:void 0,base:"",state:{},...e}),this.__subscribing=!1,this.__get=new Map,this.__catch=new Map,this.__use=new Set}_register(e,t,n,s){return e.map((e=>{const r=new fe(this.__properties.base,e,t,n);if(s.has(r.regexpRoute))throw new Error(`Route with same endpoint already exist. [${e}, /${s.get(r.regexpRoute).route}](${r.regexpRoute})`);s.set(r.regexpRoute,r)})),e}_props(...e){let t,n,s=[];if(1==e.length)[n]=e,t="*";else if(2==e.length)[t,n]=e;else{if(!(e.length>2))throw new Error("Invalid number prop arguments.");t=e.shift(),n=e.pop(),s=e}return t=Array.isArray(t)?t:[t],{routes:t,fn:n,middlewares:s}}_storeInList(e,t,...n){const{routes:s,fn:r,middlewares:a}=this._props(...n),o=this._register(s,r,a,t),l={[e]:(...t)=>{const{routes:n,fn:s,middlewares:r}=this._props(...t);return o.map((t=>n.map((e=>t+e)).map((t=>this[e](t,...r,s))))),l}};return l}get(...e){return this._storeInList("get",this.__get,...e)}use(...e){const{routes:t,fn:n}=this._props(e);t.map((e=>this.__use.add(new fe(this.__properties.base,e,...n))))}catch(...e){return this._storeInList("catch",this.__catch,...e)}_findRoute(e,t,n){for(let[s,r]of t){const t=e.match(new RegExp(s,"i"));if(t){t.shift();let s={};t.length>0&&(s=r.parameters.reduce(((e,n,s)=>(e[n.identifier]=t[s],e)),s));const a=new URLSearchParams(window.location.search),o={};for(const[e,t]of a.entries())o[e]?Array.isArray(o[e])?o[e].push(t):o[e]=[o[e],t]:o[e]=t;return{RouteInstance:r,Request:new me({path:e,route:"/"+r.route,base:r.base,query:o,params:s,state:{...n}})}}}}execute(e,t={}){if("string"!=typeof e)throw new Error("Invalid 'execute' argument. Expecting 'string'");if(!this.__subscribing)return;const n=new ge({send:(...e)=>this.__router_callback.call(null,...e),error:s=>{const r=this._findRoute(e,this.__catch,t);r?r.RouteInstance.callback.call(null,r.Request,n,s):console.warn(`No route or catch fallbacks found for [${e}]`)}});let s=this._findRoute(e,this.__get,t);if(!s)return void n.error();let r=[];const a=new pe(s.Request,n);this.__use.forEach((t=>{e.match(new RegExp(t.regexpRoute,"i"))&&r.push(t.callback)})),r=[...r,...s.RouteInstance.middlewares,s.RouteInstance.callback],r.map((e=>a.use(e))),a.execute()}subscribe(e){return this.__subscribing=!0,"function"==typeof e&&(this.__router_callback=e),this.__properties.initial&&this.execute(this.__properties.initial,this.__properties.state),()=>{this.__subscribing=!1}}}{static __linkBase="";static setLinkBase(e){if("string"!=typeof e)throw new he("Invalid 'linkBase'. Expecting value of type 'string'");return ve.__linkBase=e}static set linkBase(e){return ve.setLinkBase(e)}static get linkBase(){return ve.__linkBase}static __scrollReset=!0;static setScrollReset(e){if("boolean"!=typeof e)throw new he("Invalid 'scrollReset'. Expecting value of type 'boolean'");return ve.__scrollReset=e}static set scrollReset(e){return ve.setScrollReset(e)}static get scrollReset(){return ve.__scrollReset}}const $e=[];function xe(t,n=e){let s;const r=[];function a(e){if(l(t,e)&&(t=e,s)){const e=!$e.length;for(let e=0;e<r.length;e+=1){const n=r[e];n[1](),$e.push(n,t)}if(e){for(let e=0;e<$e.length;e+=2)$e[e][0]($e[e+1]);$e.length=0}}}return{set:a,update:function(e){a(e(t))},subscribe:function(o,l=e){const i=[o,l];return r.push(i),1===r.length&&(s=n(a)||e),o(t),()=>{const e=r.indexOf(i);-1!==e&&r.splice(e,1),0===r.length&&(s(),s=null)}}}}let ke={location:{...window.location},firstLoad:!1},be=new Map,we=xe(),ye=!1,_e=!1;const je=e=>{const t=new RegExp(`^${ve.linkBase}`,"i");return"/"+(e=`/${e}/`.replace(/[\/]+/g,"/").replace(t,"").replace(/^\/|\/$/g,""))},Ee=async e=>{let t=!1;const n=ke.location.pathname==window.location.pathname&&ke.location.search==window.location.search;""!=window.location.hash&&n&&ke.firstLoad&&(t=!0),""==window.location.hash&&window.location.hash!=ke.location.hash&&n&&(t=!0,window.scrollTo({top:0})),t||(we.set(je(window.location.pathname)),be.forEach((t=>t.router.execute(window.location.pathname,e.detail)))),ke.location={...window.location}};const Re=e=>({component:1&e,props:1&e}),Le=e=>({component:e[0].context,props:e[0].props});function Ce(e){let t;const s=e[4].default,r=c(s,e,e[3],Le),a=r||function(e){let t,s,r;const a=[e[0].props];var o=e[0].context;function l(e){let t={};for(let e=0;e<a.length;e+=1)t=n(t,a[e]);return{props:t}}o&&(t=new o(l()));return{c(){t&&oe(t.$$.fragment),s=j()},m(e,n){t&&le(t,e,n),x(e,s,n),r=!0},p(e,n){const r=1&n?re(a,[ae(e[0].props)]):{};if(o!==(o=e[0].context)){if(t){J();const e=t;Z(e.$$.fragment,1,0,(()=>{ie(e,1)})),Q()}o?(t=new o(l()),oe(t.$$.fragment),W(t.$$.fragment,1),le(t,s.parentNode,s)):t=null}else o&&t.$set(r)},i(e){r||(t&&W(t.$$.fragment,e),r=!0)},o(e){t&&Z(t.$$.fragment,e),r=!1},d(e){e&&k(s),t&&ie(t,e)}}}(e);return{c(){a&&a.c()},m(e,n){a&&a.m(e,n),t=!0},p(e,t){r?r.p&&9&t&&d(r,s,e,e[3],t,Re,Le):a&&a.p&&1&t&&a.p(e,t)},i(e){t||(W(a,e),t=!0)},o(e){Z(a,e),t=!1},d(e){a&&a.d(e)}}}function Te(e){let t,n,s=e[0]&&Ce(e);return{c(){s&&s.c(),t=j()},m(e,r){s&&s.m(e,r),x(e,t,r),n=!0},p(e,[n]){e[0]?s?(s.p(e,n),1&n&&W(s,1)):(s=Ce(e),s.c(),W(s,1),s.m(t.parentNode,t)):s&&(J(),Z(s,1,1,(()=>{s=null})),Q())},i(e){n||(W(s),n=!0)},o(e){Z(s),n=!1},d(e){s&&s.d(e),e&&k(t)}}}function Me(e,t,n){let s,{$$slots:r={},$$scope:a}=t,{context:o=be.keys().next().value}=t;if(!(o&&o instanceof ve))throw new Error("Invalid Router context. Did you initialize the component with a valid context?");const{component:l}=be.get(o);return i(e,l,(e=>n(0,s=e))),o.subscribe((async(e,t={})=>{if("function"!=typeof e)throw new he("Unable to load component. Did you pass a valid svelte component to the 'send' response?");ve.scrollReset&&window.scrollTo({top:0}),l.set({context:class extends e{},props:t}),await(V(),I);const n=window.location.hash.slice(1);if(n){const e=document.querySelector(`a[name="${n}"], #${n}`);if(e){const t=e.getBoundingClientRect().top+window.pageYOffset;window.scrollTo({top:t})}}ke.firstLoad||(ke.firstLoad=!0)})),e.$$set=e=>{"context"in e&&n(2,o=e.context),"$$scope"in e&&n(3,a=e.$$scope)},[s,l,o,a,r]}class ze extends ue{constructor(e){super(),ce(this,e,Me,Te,l,{context:2})}}const qe=({state:e})=>{dispatchEvent(new CustomEvent("popstate",{detail:{...e}}))},Ae=(e,t={})=>{history.replaceState(t,"",e),qe({url:e,state:t})};var Se=(e,t)=>{t={type:"navigate",state:{},title:"",...t};const n=e=>{const n=t.to||t.href||e.currentTarget.getAttribute("href")||e.currentTarget.getAttribute("data-href");if(!n)return;e.preventDefault();const s=`/${ve.linkBase}/${n}`.replace(/[\/]+/g,"/");if(s)if("navigate"==t.type)((e,t={})=>{history.pushState(t,"",e),qe({url:e,state:t})})(s,t.state,t.title);else{if("redirect"!=t.type)return void console.warn("Invalid 'use:link' type. Expecting 'navigate'(default) or 'redirect'");Ae(s,t.state,t.title)}};return e.addEventListener("click",n),{update(e){},destroy(){e.removeEventListener("click",n)}}};function Be(t){let n;return{c(){n=w("span"),n.textContent="nifa",R(n,"class","svelte-1abs1hq")},m(e,t){x(e,n,t)},p:e,i:e,o:e,d(e){e&&k(n)}}}class Ne extends ue{constructor(e){super(),ce(this,e,null,Be,l,{})}}function Ie(e){let t;return{c(){t=w("i"),R(t,"class","ph-x svelte-1ymj9zx")},m(e,n){x(e,t,n)},d(e){e&&k(t)}}}function Oe(e){let t;return{c(){t=w("i"),R(t,"class","ph-dots-three-outline-fill svelte-1ymj9zx")},m(e,n){x(e,t,n)},d(e){e&&k(t)}}}function Ve(e){let t,n,s,r,o,l,i,c,u,d,p,m,g,h,v,b,y,j,C,T,M,z,q,A,S,B,N,I,O,V;function H(e,t){return e[0]?Ie:Oe}o=new Ne({});let D=H(e),P=D(e);return{c(){t=w("header"),n=w("div"),s=w("div"),r=w("div"),oe(o.$$.fragment),l=_(),i=w("div"),c=w("button"),P.c(),u=_(),d=w("nav"),p=w("a"),p.textContent="Hem",g=_(),h=w("a"),h.textContent="Aktiviteter",b=_(),y=w("a"),y.textContent="Medlem",C=_(),T=w("a"),T.textContent="Om nifa",z=_(),q=w("a"),q.textContent="Upphandling",S=_(),B=w("a"),B.textContent="Kontakt",R(r,"class","branding svelte-1ymj9zx"),R(c,"class","svelte-1ymj9zx"),R(i,"class","burger svelte-1ymj9zx"),R(p,"href","/"),R(p,"class","svelte-1ymj9zx"),L(p,"active","/"==e[1]),R(h,"href","/activities"),R(h,"class","svelte-1ymj9zx"),L(h,"active","/activities"==e[1]),R(y,"href","/members"),R(y,"class","svelte-1ymj9zx"),L(y,"active","/members"==e[1]),R(T,"href","/about"),R(T,"class","svelte-1ymj9zx"),L(T,"active","/about"==e[1]),R(q,"href","/procurement"),R(q,"class","svelte-1ymj9zx"),L(q,"active","/procurement"==e[1]),R(B,"href","/contact"),R(B,"class","svelte-1ymj9zx"),L(B,"active","/contact"==e[1]),R(d,"class","svelte-1ymj9zx"),L(d,"active",e[0]),R(s,"class","inner svelte-1ymj9zx"),R(n,"class","outer svelte-1ymj9zx"),R(t,"id","masthead"),R(t,"class","svelte-1ymj9zx"),L(t,"active",e[0])},m(a,k){x(a,t,k),$(t,n),$(n,s),$(s,r),le(o,r,null),$(s,l),$(s,i),$(i,c),P.m(c,null),$(s,u),$(s,d),$(d,p),$(d,g),$(d,h),$(d,b),$(d,y),$(d,C),$(d,T),$(d,z),$(d,q),$(d,S),$(d,B),I=!0,O||(V=[E(c,"click",e[3]),f(m=Se.call(null,p)),f(v=Se.call(null,h)),f(j=Se.call(null,y)),f(M=Se.call(null,T)),f(A=Se.call(null,q)),f(N=Se.call(null,B)),E(d,"click",e[2])],O=!0)},p(e,[n]){D!==(D=H(e))&&(P.d(1),P=D(e),P&&(P.c(),P.m(c,null))),2&n&&L(p,"active","/"==e[1]),2&n&&L(h,"active","/activities"==e[1]),2&n&&L(y,"active","/members"==e[1]),2&n&&L(T,"active","/about"==e[1]),2&n&&L(q,"active","/procurement"==e[1]),2&n&&L(B,"active","/contact"==e[1]),1&n&&L(d,"active",e[0]),1&n&&L(t,"active",e[0])},i(e){I||(W(o.$$.fragment,e),I=!0)},o(e){Z(o.$$.fragment,e),I=!1},d(e){e&&k(t),ie(o),P.d(),O=!1,a(V)}}}function He(e,t,n){let s;i(e,we,(e=>n(1,s=e)));let r=!1;return[r,s,e=>{"A"==e.target.tagName&&n(0,r=!1)},e=>n(0,r=!r)]}class De extends ue{constructor(e){super(),ce(this,e,He,Ve,l,{})}}function Pe(t){let n,s,r,a,o,l;return r=new Ne({}),{c(){n=w("footer"),s=w("div"),oe(r.$$.fragment),a=_(),o=w("div"),o.innerHTML='<p class="svelte-cjq03y">N. Strandgatan 17<br/>\n        652 24 Karlstad</p> \n      <p class="svelte-cjq03y">Telefon:<br/>\n        072-514 98 59</p> \n      <p class="svelte-cjq03y">info@nifa.se</p>',R(o,"class","content svelte-cjq03y"),R(s,"class","inner svelte-cjq03y"),R(n,"class","svelte-cjq03y")},m(e,t){x(e,n,t),$(n,s),le(r,s,null),$(s,a),$(s,o),l=!0},p:e,i(e){l||(W(r.$$.fragment,e),l=!0)},o(e){Z(r.$$.fragment,e),l=!1},d(e){e&&k(n),ie(r)}}}class Ke extends ue{constructor(e){super(),ce(this,e,null,Pe,l,{})}}function Fe(e){let t,s,r,a;const o=[e[1]];var l=e[0];function i(e){let t={};for(let e=0;e<o.length;e+=1)t=n(t,o[e]);return{props:t}}return l&&(s=new l(i())),{c(){t=w("div"),s&&oe(s.$$.fragment),R(t,"id","router"),R(t,"class","svelte-2dq3i7")},m(e,n){x(e,t,n),s&&le(s,t,null),a=!0},p(e,n){const r=2&n?re(o,[ae(e[1])]):{};if(l!==(l=e[0])){if(s){J();const e=s;Z(e.$$.fragment,1,0,(()=>{ie(e,1)})),Q()}l?(s=new l(i()),oe(s.$$.fragment),W(s.$$.fragment,1),le(s,t,null)):s=null}else l&&s.$set(r)},i(e){a||(s&&W(s.$$.fragment,e),r||H((()=>{r=te(t,de,{duration:450}),r.start()})),a=!0)},o(e){s&&Z(s.$$.fragment,e),a=!1},d(e){e&&k(t),s&&ie(s)}}}function Ue(t){let n,s,r=t[0],a=Fe(t);return{c(){a.c(),n=j()},m(e,t){a.m(e,t),x(e,n,t),s=!0},p(t,s){1&s&&l(r,r=t[0])?(J(),Z(a,1,1,e),Q(),a=Fe(t),a.c(),W(a),a.m(n.parentNode,n)):a.p(t,s)},i(e){s||(W(a),s=!0)},o(e){Z(a),s=!1},d(e){e&&k(n),a.d(e)}}}function Xe(e){let t,n,s,r,a,o,l,i;return n=new De({}),a=new ze({props:{$$slots:{default:[Ue,({component:e,props:t})=>({0:e,1:t}),({component:e,props:t})=>(e?1:0)|(t?2:0)]},$$scope:{ctx:e}}}),l=new Ke({}),{c(){t=w("div"),oe(n.$$.fragment),s=_(),r=w("main"),oe(a.$$.fragment),o=_(),oe(l.$$.fragment),R(r,"class","svelte-2dq3i7"),R(t,"id","app"),R(t,"class","svelte-2dq3i7")},m(e,c){x(e,t,c),le(n,t,null),$(t,s),$(t,r),le(a,r,null),$(t,o),le(l,t,null),i=!0},p(e,[t]){const n={};7&t&&(n.$$scope={dirty:t,ctx:e}),a.$set(n)},i(e){i||(W(n.$$.fragment,e),W(a.$$.fragment,e),W(l.$$.fragment,e),i=!0)},o(e){Z(n.$$.fragment,e),Z(a.$$.fragment,e),Z(l.$$.fragment,e),i=!1},d(e){e&&k(t),ie(n),ie(a),ie(l)}}}function Ye(t){let n;return{c(){n=w("section"),n.innerHTML='<div class="content svelte-1g42sxx"><h2 class="svelte-1g42sxx">Lönsam tillväxt i Matregionen Värmland</h2> \n    <p class="svelte-1g42sxx">Är du mat- eller dryckesföretagare som vill utvecklas, öka din lönsamhet och skaffa nya samarbetspartners? Då är Nifas projekt Lönsam tillväxt i Matregionen Värmland något för dig.</p> \n    <a href="/" class="button green svelte-1g42sxx">Läs mer</a></div>',R(n,"id","hero"),R(n,"class","svelte-1g42sxx")},m(e,t){x(e,n,t)},p:e,i:e,o:e,d(e){e&&k(n)}}}class Ge extends ue{constructor(e){super(),ce(this,e,null,Ye,l,{})}}function Je(t){let n;return{c(){n=w("section"),n.innerHTML='<p class="svelte-ilfydl">Är även du intresserad av ett medlemskap? Klicka på knappen för att få reda på mer hur ditt företag kan bli medlem.</p> \n  <a href="/" class="button green svelte-ilfydl">Bli medlem</a>',R(n,"class","join svelte-ilfydl")},m(e,t){x(e,n,t)},p:e,i:e,o:e,d(e){e&&k(n)}}}class Qe extends ue{constructor(e){super(),ce(this,e,null,Je,l,{})}}function We(t){let n,s,r,a;return r=new Qe({}),{c(){n=w("section"),n.innerHTML='<div class="image-container svelte-1e0y49u"><img src="./assets/images/rawprod.jpg" alt="" class="svelte-1e0y49u"/></div> \n  <div class="content svelte-1e0y49u"><img class="brand svelte-1e0y49u" src="./assets/images/rawcho.jpg" alt=""/> \n    <h3>Månadens medlemsföretag</h3> \n    <p>All mat som serveras på arenan är lokalproducerad i Värmland! Vi kommer att ge de aktiva och publiken en smakupplevelse utöver det vanliga och höjer ribban rejält mot vad som brukar erbjudas på sportarrangemang. Tillsammans hoppas vi att detta ska ge ringar på vattnet och att fler idrottsevenemang runt om i Sverige hänger på.</p> \n    <p>På arenan finns fyra olika matställen, de erbjuder lokalproducerade hamburgare, korv med bröd.</p></div>',s=_(),oe(r.$$.fragment),R(n,"class","svelte-1e0y49u")},m(e,t){x(e,n,t),x(e,s,t),le(r,e,t),a=!0},p:e,i(e){a||(W(r.$$.fragment,e),a=!0)},o(e){Z(r.$$.fragment,e),a=!1},d(e){e&&k(n),e&&k(s),ie(r,e)}}}class Ze extends ue{constructor(e){super(),ce(this,e,null,We,l,{})}}function et(t){let n;return{c(){n=w("section"),n.innerHTML='<h2 class="svelte-1g0nwpx">Vad är <img src="./assets/images/branding_alone.png" alt="" class="svelte-1g0nwpx"/></h2> \n  <div class="grid svelte-1g0nwpx"><div class="image-container svelte-1g0nwpx"><img src="./assets/images/pesto.jpg" alt="" class="svelte-1g0nwpx"/></div> \n    <div class="content svelte-1g0nwpx"><p class="svelte-1g0nwpx">Nifa är en ekonomisk förening med sitt säte i Karlstad, Värmland. Nifa är branschförening för värmländska mat- och dryckesföretag där kompetens samlas och samverkan ska leda till affärsutveckling och ökad lönsamhet. Du som matföretagare kan vända dig till Nifa för att få råd och stöd om vägar för ditt företags framtida utveckling.</p> \n      <p class="svelte-1g0nwpx">Nifa består av ett antal medlemsföretag som förenas kring tanken om att utveckla mat- och dryckesproduktionen i Värmland.</p> \n      <p class="svelte-1g0nwpx">Nifa bedriver verksamhet inom några utpekade områden inom ramen för EU-projektet ”Lönsam tillväxt i Matregionen Värmland 2018-2020.</p> \n      <a href="/" class="button green svelte-1g0nwpx">Mer om nifa</a></div></div>',R(n,"class","svelte-1g0nwpx")},m(e,t){x(e,n,t)},p:e,i:e,o:e,d(e){e&&k(n)}}}class tt extends ue{constructor(e){super(),ce(this,e,null,et,l,{})}}function nt(t){let n;return{c(){n=w("section"),n.innerHTML='<img src="./assets/images/regionv.png" alt=""/> \n  <img src="./assets/images/lansstyr.png" alt=""/> \n  <img src="./assets/images/kkomm.png" alt=""/> \n  <img src="./assets/images/eu.png" alt=""/>',R(n,"class","svelte-qhxkka")},m(e,t){x(e,n,t)},p:e,i:e,o:e,d(e){e&&k(n)}}}class st extends ue{constructor(e){super(),ce(this,e,null,nt,l,{})}}function rt(t){let n;return{c(){n=w("section"),n.innerHTML='<p class="svelte-d3gk2g">Få senaste nytt från Nifa genom att prenumerera på vårt nyhetsbrev</p> \n  <form class="svelte-d3gk2g"><input type="text" placeholder="Ditt name" class="svelte-d3gk2g"/> \n    <input type="text" placeholder="Företag" class="svelte-d3gk2g"/> \n    <input type="text" placeholder="E-postadress" class="svelte-d3gk2g"/> \n    <button class="button orange svelte-d3gk2g">Prenumerera</button></form>',R(n,"class","svelte-d3gk2g")},m(e,t){x(e,n,t)},p:e,i:e,o:e,d(e){e&&k(n)}}}class at extends ue{constructor(e){super(),ce(this,e,null,rt,l,{})}}function ot(e,t,n){const s=e.slice();return s[4]=t[n].title,s[5]=t[n].address,s[7]=n,s}function lt(e){let t;return{c(){t=w("i"),R(t,"class","ph-map-pin-line svelte-axbhk2")},m(e,n){x(e,t,n)},d(e){e&&k(t)}}}function it(e){let t;return{c(){t=w("i"),R(t,"class","ph-map-pin-line-fill svelte-axbhk2")},m(e,n){x(e,t,n)},d(e){e&&k(t)}}}function ct(e,t){let n,s,r,a,o,l,i,c,u,d,f,p,m,g,h,v,b=t[4]+"",j=t[5]+"";function L(e,t){return(null==m||1&t)&&(m=!!e[0].includes(e[7])),m?it:lt}let C=L(t,-1),T=C(t);return{key:e,first:null,c(){n=w("div"),s=w("div"),r=w("h4"),a=y(b),o=_(),l=w("p"),i=y(j),c=_(),u=w("label"),d=w("input"),p=_(),T.c(),g=_(),R(r,"class","svelte-axbhk2"),R(l,"class","svelte-axbhk2"),R(s,"class","meta"),R(d,"type","checkbox"),d.__value=f=t[7],d.value=d.__value,R(d,"class","svelte-axbhk2"),t[3][0].push(d),R(u,"class","icon svelte-axbhk2"),R(n,"class","item svelte-axbhk2"),this.first=n},m(e,f){x(e,n,f),$(n,s),$(s,r),$(r,a),$(s,o),$(s,l),$(l,i),$(n,c),$(n,u),$(u,d),d.checked=~t[0].indexOf(d.__value),$(u,p),T.m(u,null),$(n,g),h||(v=E(d,"change",t[2]),h=!0)},p(e,t){1&t&&(d.checked=~e[0].indexOf(d.__value)),C!==(C=L(e,t))&&(T.d(1),T=C(e),T&&(T.c(),T.m(u,null)))},d(e){e&&k(n),t[3][0].splice(t[3][0].indexOf(d),1),T.d(),h=!1,v()}}}function ut(t){let n,s,r,a,o,l,i,c=[],u=new Map,d=t[1];const f=e=>e[7];for(let e=0;e<d.length;e+=1){let n=ot(t,d,e),s=f(n);u.set(s,c[e]=ct(s,n))}return{c(){n=w("section"),s=w("header"),s.innerHTML='<h3>Hitta till våra medlemsproducenter</h3> \n    <p class="svelte-axbhk2">Klicka på ett företag i listan för att fokusera det på kartan. För att markera flera företag klickar du på ikonen jämte företagets namn och adress.</p>',r=_(),a=w("div"),o=w("div"),l=_(),i=w("div");for(let e=0;e<c.length;e+=1)c[e].c();R(s,"class","svelte-axbhk2"),R(o,"class","map svelte-axbhk2"),R(i,"class","list svelte-axbhk2"),R(a,"class","grid svelte-axbhk2"),R(n,"class","svelte-axbhk2")},m(e,t){x(e,n,t),$(n,s),$(n,r),$(n,a),$(a,o),$(a,l),$(a,i);for(let e=0;e<c.length;e+=1)c[e].m(i,null)},p(e,[t]){if(3&t){const n=e[1];c=function(e,t,n,s,r,a,o,l,i,c,u,d){let f=e.length,p=a.length,m=f;const g={};for(;m--;)g[e[m].key]=m;const h=[],v=new Map,$=new Map;for(m=p;m--;){const e=d(r,a,m),l=n(e);let i=o.get(l);i?s&&i.p(e,t):(i=c(l,e),i.c()),v.set(l,h[m]=i),l in g&&$.set(l,Math.abs(m-g[l]))}const x=new Set,k=new Set;function b(e){W(e,1),e.m(l,u),o.set(e.key,e),u=e.first,p--}for(;f&&p;){const t=h[p-1],n=e[f-1],s=t.key,r=n.key;t===n?(u=t.first,f--,p--):v.has(r)?!o.has(s)||x.has(s)?b(t):k.has(r)?f--:$.get(s)>$.get(r)?(k.add(s),b(t)):(x.add(r),f--):(i(n,o),f--)}for(;f--;){const t=e[f];v.has(t.key)||i(t,o)}for(;p;)b(h[p-1]);return h}(c,t,f,1,e,n,u,i,se,ct,null,ot)}},i:e,o:e,d(e){e&&k(n);for(let e=0;e<c.length;e+=1)c[e].d()}}}function dt(e,t,n){let s=[];const r=new Array(20).fill({title:"rawchokladfabriken",address:"Stadsgatan 34b, Karlstad"}),a=[[]];return[s,r,function(){s=function(e,t,n){const s=new Set;for(let t=0;t<e.length;t+=1)e[t].checked&&s.add(e[t].__value);return n||s.delete(t),Array.from(s)}(a[0],this.__value,this.checked),n(0,s)},a]}class ft extends ue{constructor(e){super(),ce(this,e,dt,ut,l,{})}}function pt(e){let t,n,s,r,a,o,l,i,u,p,m,g,h;const v=e[3].default,b=c(v,e,e[2],null),j=b||function(e){let t,n,s;return{c(){t=w("h3"),t.textContent="Placeholder heading",n=_(),s=w("p"),s.textContent="This is some placeholder content"},m(e,r){x(e,t,r),x(e,n,r),x(e,s,r)},d(e){e&&k(t),e&&k(n),e&&k(s)}}}();return{c(){t=w("div"),n=w("div"),s=w("img"),a=_(),o=w("div"),j&&j.c(),l=_(),i=w("button"),u=y("Läs mer"),s.src!==(r=e[0])&&R(s,"src",r),R(s,"alt",""),R(s,"class","svelte-14t5ws4"),R(n,"class","image-container svelte-14t5ws4"),R(i,"class","button green svelte-14t5ws4"),R(i,"href",e[1]),R(o,"class","content svelte-14t5ws4"),R(t,"class","card svelte-14t5ws4")},m(e,r){x(e,t,r),$(t,n),$(n,s),$(t,a),$(t,o),j&&j.m(o,null),$(o,l),$(o,i),$(i,u),m=!0,g||(h=f(p=Se.call(null,i)),g=!0)},p(e,[t]){(!m||1&t&&s.src!==(r=e[0]))&&R(s,"src",r),b&&b.p&&4&t&&d(b,v,e,e[2],t,null,null),(!m||2&t)&&R(i,"href",e[1])},i(e){m||(W(j,e),m=!0)},o(e){Z(j,e),m=!1},d(e){e&&k(t),j&&j.d(e),g=!1,h()}}}function mt(e,t,n){let{$$slots:s={},$$scope:r}=t,{image:a=""}=t,{href:o=""}=t;return e.$$set=e=>{"image"in e&&n(0,a=e.image),"href"in e&&n(1,o=e.href),"$$scope"in e&&n(2,r=e.$$scope)},[a,o,r,s]}class gt extends ue{constructor(e){super(),ce(this,e,mt,pt,l,{image:0,href:1})}}function ht(e,t,n){const s=e.slice();return s[0]=t[n],s[2]=n,s}function vt(e){let t,n,s,r;return{c(){t=w("h3"),t.textContent="Inbjudan till en inspirationskväll!",n=_(),s=w("p"),s.textContent="Varmt välkommen till en inspirationskväll med och om lokalt företagande i Kil med fokus på den...",r=_()},m(e,a){x(e,t,a),x(e,n,a),x(e,s,a),x(e,r,a)},d(e){e&&k(t),e&&k(n),e&&k(s),e&&k(r)}}}function $t(e){let t,n;return t=new gt({props:{image:"./assets/images/n"+(e[2]+1)+".jpg",href:"/",$$slots:{default:[vt]},$$scope:{ctx:e}}}),{c(){oe(t.$$.fragment)},m(e,s){le(t,e,s),n=!0},p(e,n){const s={};8&n&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){n||(W(t.$$.fragment,e),n=!0)},o(e){Z(t.$$.fragment,e),n=!1},d(e){ie(t,e)}}}function xt(t){let n,s,r,a,o,l={length:3},i=[];for(let e=0;e<l.length;e+=1)i[e]=$t(ht(t,l,e));return{c(){n=w("section"),s=w("div");for(let e=0;e<i.length;e+=1)i[e].c();r=_(),a=w("a"),a.textContent="Fler nyheter",R(s,"class","grid svelte-7aasdx"),R(a,"href","/"),R(a,"class","button orange svelte-7aasdx"),R(n,"class","news svelte-7aasdx")},m(e,t){x(e,n,t),$(n,s);for(let e=0;e<i.length;e+=1)i[e].m(s,null);$(n,r),$(n,a),o=!0},p:e,i(e){if(!o){for(let e=0;e<l.length;e+=1)W(i[e]);o=!0}},o(e){i=i.filter(Boolean);for(let e=0;e<i.length;e+=1)Z(i[e]);o=!1},d(e){e&&k(n),b(i,e)}}}class kt extends ue{constructor(e){super(),ce(this,e,null,xt,l,{})}}function bt(t){let n,s,r;return{c(){n=w("span"),n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="55" height="61" viewBox="-0.924 -0.056 55 61" enable-background="new -0.924 -0.056 55 61" xml:space="preserve" class="svelte-7ipwpq"><path d="M0,57.562C0,54.749,0,5.376,0,3.437C0,0.919,2.603-0.953,5.176,0.52c2.062,1.179,43.267,24.974,46.783,27.008\n    c2.31,1.337,2.271,4.525,0,5.863C49.428,34.884,8.066,58.8,5.07,60.461C2.877,61.68,0,60.333,0,57.562z"></path></svg>',R(n,"class","play svelte-7ipwpq")},m(e,a){x(e,n,a),s||(r=E(n,"click",t[0]),s=!0)},p:e,i:e,o:e,d(e){e&&k(n),s=!1,r()}}}function wt(e){return[function(t){!function(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach((e=>e(t)))}(e,t)}]}class yt extends ue{constructor(e){super(),ce(this,e,wt,bt,l,{})}}const{isNaN:_t}=ne;function jt(t){let n,s;return n=new yt({}),n.$on("click",t[13]),{c(){oe(n.$$.fragment)},m(e,t){le(n,e,t),s=!0},p:e,i(e){s||(W(n.$$.fragment,e),s=!0)},o(e){Z(n.$$.fragment,e),s=!1},d(e){ie(n,e)}}}function Et(e){let t,n,s,r,o,l,i,u,f,p,m,h,v,b,y,j,C=!1,T=!0;function M(){cancelAnimationFrame(l),s.paused||(l=g(M),C=!0),e[10].call(s)}let z=e[5]&&jt(e);const q=e[9].default,A=c(q,e,e[8],null),S=A||function(e){let t,n,s;return{c(){t=w("h3"),t.textContent="Placeholder heading",n=_(),s=w("p"),s.textContent="Placeholder content"},m(e,r){x(e,t,r),x(e,n,r),x(e,s,r)},d(e){e&&k(t),e&&k(n),e&&k(s)}}}();return{c(){t=w("div"),n=w("div"),s=w("video"),r=w("track"),i=_(),z&&z.c(),u=_(),f=w("div"),p=w("progress"),h=_(),v=w("div"),S&&S.c(),R(r,"kind","captions"),R(s,"poster",e[1]),s.src!==(o=e[0])&&R(s,"src",o),R(s,"class","svelte-u4tz3j"),void 0===e[4]&&H((()=>e[11].call(s))),p.value=m=e[3]/e[4]||0,R(p,"class","svelte-u4tz3j"),R(f,"class","controls svelte-u4tz3j"),R(n,"class","video-container svelte-u4tz3j"),R(v,"class","content svelte-u4tz3j"),R(t,"class","video svelte-u4tz3j"),L(t,"reverse",e[2])},m(a,o){x(a,t,o),$(t,n),$(n,s),$(s,r),$(n,i),z&&z.m(n,null),$(n,u),$(n,f),$(f,p),$(t,h),$(t,v),S&&S.m(v,null),b=!0,y||(j=[E(s,"mousemove",e[6]),E(s,"mousedown",e[7]),E(s,"timeupdate",M),E(s,"durationchange",e[11]),E(s,"play",e[12]),E(s,"pause",e[12])],y=!0)},p(e,[r]){(!b||2&r)&&R(s,"poster",e[1]),(!b||1&r&&s.src!==(o=e[0]))&&R(s,"src",o),!C&&8&r&&!_t(e[3])&&(s.currentTime=e[3]),C=!1,32&r&&T!==(T=e[5])&&s[T?"pause":"play"](),e[5]?z?(z.p(e,r),32&r&&W(z,1)):(z=jt(e),z.c(),W(z,1),z.m(n,u)):z&&(J(),Z(z,1,1,(()=>{z=null})),Q()),(!b||24&r&&m!==(m=e[3]/e[4]||0))&&(p.value=m),A&&A.p&&256&r&&d(A,q,e,e[8],r,null,null),4&r&&L(t,"reverse",e[2])},i(e){b||(W(z),W(S,e),b=!0)},o(e){Z(z),Z(S,e),b=!1},d(e){e&&k(t),z&&z.d(),S&&S.d(e),y=!1,a(j)}}}function Rt(e,t,n){let s,r,{$$slots:a={},$$scope:o}=t,{video:l=""}=t,{poster:i=""}=t,{reverse:c=!1}=t,u=0,d=!0,f=!0;return e.$$set=e=>{"video"in e&&n(0,l=e.video),"poster"in e&&n(1,i=e.poster),"reverse"in e&&n(2,c=e.reverse),"$$scope"in e&&n(8,o=e.$$scope)},[l,i,c,u,s,d,function(e){if(clearTimeout(r),r=setTimeout((()=>f=!1),2500),f=!0,!(1&e.buttons))return;if(!s)return;const{left:t,right:a}=this.getBoundingClientRect();n(3,u=s*(e.clientX-t)/(a-t))},function(e){function t(){d?e.target.play():e.target.pause(),n()}function n(){e.target.removeEventListener("mouseup",t)}e.target.addEventListener("mouseup",t),setTimeout(n,200)},o,a,function(){u=this.currentTime,n(3,u)},function(){s=this.duration,n(4,s)},function(){d=this.paused,n(5,d)},e=>n(5,d=!d)]}class Lt extends ue{constructor(e){super(),ce(this,e,Rt,Et,l,{video:0,poster:1,reverse:2})}}function Ct(e,t,n){const s=e.slice();return s[1]=t[n].poster,s[2]=t[n].video,s[3]=t[n].heading,s[4]=t[n].content,s[6]=n,s}function Tt(e,t,n){const s=e.slice();return s[7]=t[n],s}function Mt(t){let n,s,r=t[7]+"";return{c(){n=w("p"),s=y(r)},m(e,t){x(e,n,t),$(n,s)},p:e,d(e){e&&k(n)}}}function zt(e){let t,n,s,r,a=e[3]+"",o=e[4],l=[];for(let t=0;t<o.length;t+=1)l[t]=Mt(Tt(e,o,t));return{c(){t=w("h3"),n=y(a),s=_();for(let e=0;e<l.length;e+=1)l[e].c();r=j()},m(e,a){x(e,t,a),$(t,n),x(e,s,a);for(let t=0;t<l.length;t+=1)l[t].m(e,a);x(e,r,a)},p(e,t){if(1&t){let n;for(o=e[4],n=0;n<o.length;n+=1){const s=Tt(e,o,n);l[n]?l[n].p(s,t):(l[n]=Mt(s),l[n].c(),l[n].m(r.parentNode,r))}for(;n<l.length;n+=1)l[n].d(1);l.length=o.length}},d(e){e&&k(t),e&&k(s),b(l,e),e&&k(r)}}}function qt(e){let t,n,s,r;return n=new Lt({props:{poster:e[1],video:e[2],reverse:e[6]%2==1,$$slots:{default:[zt]},$$scope:{ctx:e}}}),{c(){t=w("div"),oe(n.$$.fragment),s=_(),R(t,"class","video-pod svelte-jmb6je")},m(e,a){x(e,t,a),le(n,t,null),$(t,s),r=!0},p(e,t){const s={};1024&t&&(s.$$scope={dirty:t,ctx:e}),n.$set(s)},i(e){r||(W(n.$$.fragment,e),r=!0)},o(e){Z(n.$$.fragment,e),r=!1},d(e){e&&k(t),ie(n)}}}function At(e){let t,n,s=e[0],r=[];for(let t=0;t<s.length;t+=1)r[t]=qt(Ct(e,s,t));const a=e=>Z(r[e],1,1,(()=>{r[e]=null}));return{c(){t=w("section");for(let e=0;e<r.length;e+=1)r[e].c();R(t,"class","videos svelte-jmb6je")},m(e,s){x(e,t,s);for(let e=0;e<r.length;e+=1)r[e].m(t,null);n=!0},p(e,[n]){if(1&n){let o;for(s=e[0],o=0;o<s.length;o+=1){const a=Ct(e,s,o);r[o]?(r[o].p(a,n),W(r[o],1)):(r[o]=qt(a),r[o].c(),W(r[o],1),r[o].m(t,null))}for(J(),o=s.length;o<r.length;o+=1)a(o);Q()}},i(e){if(!n){for(let e=0;e<s.length;e+=1)W(r[e]);n=!0}},o(e){r=r.filter(Boolean);for(let e=0;e<r.length;e+=1)Z(r[e]);n=!1},d(e){e&&k(t),b(r,e)}}}function St(e){return[[{poster:"./assets/images/cake.jpg",video:"./assets/videos/cake.mp4",heading:"Inbjudan till en inspirationskväll!",content:["\n        All mat som serveras på arenan är lokalproducerad i Värmland! Vi kommer att ge de aktiva och publiken en smakupplevelse utöver det vanliga och höjer ribban \n        rejält mot vad som brukar erbjudas på sportarrangemang. ","Tillsammans hoppas vi att detta ska ge ringar på vattnet och att fler idrottsevenemang runt om i \n        Sverige hänger på. På arenan finns fyra olika matställen, de erbjuder lokalproducerade hamburgare, korv med bröd."]},{poster:"./assets/images/advent.jpg",video:"./assets/videos/outside_eating.mp4",heading:"Inbjudan till en inspirationskväll!",content:["\n        All mat som serveras på arenan är lokalproducerad i Värmland! Vi kommer att ge de aktiva och publiken en smakupplevelse utöver det vanliga och höjer ribban \n        rejält mot vad som brukar erbjudas på sportarrangemang. ","Tillsammans hoppas vi att detta ska ge ringar på vattnet och att fler idrottsevenemang runt om i \n        Sverige hänger på. På arenan finns fyra olika matställen, de erbjuder lokalproducerade hamburgare, korv med bröd."]}]]}class Bt extends ue{constructor(e){super(),ce(this,e,St,At,l,{})}}function Nt(t){let n,s,r,a,o,l,i,c,u,d,f,p,m,g,h,v;return n=new Ge({}),r=new kt({}),o=new Bt({}),i=new Ze({}),u=new ft({}),f=new tt({}),m=new st({}),h=new at({}),{c(){oe(n.$$.fragment),s=_(),oe(r.$$.fragment),a=_(),oe(o.$$.fragment),l=_(),oe(i.$$.fragment),c=_(),oe(u.$$.fragment),d=_(),oe(f.$$.fragment),p=_(),oe(m.$$.fragment),g=_(),oe(h.$$.fragment)},m(e,t){le(n,e,t),x(e,s,t),le(r,e,t),x(e,a,t),le(o,e,t),x(e,l,t),le(i,e,t),x(e,c,t),le(u,e,t),x(e,d,t),le(f,e,t),x(e,p,t),le(m,e,t),x(e,g,t),le(h,e,t),v=!0},p:e,i(e){v||(W(n.$$.fragment,e),W(r.$$.fragment,e),W(o.$$.fragment,e),W(i.$$.fragment,e),W(u.$$.fragment,e),W(f.$$.fragment,e),W(m.$$.fragment,e),W(h.$$.fragment,e),v=!0)},o(e){Z(n.$$.fragment,e),Z(r.$$.fragment,e),Z(o.$$.fragment,e),Z(i.$$.fragment,e),Z(u.$$.fragment,e),Z(f.$$.fragment,e),Z(m.$$.fragment,e),Z(h.$$.fragment,e),v=!1},d(e){ie(n,e),e&&k(s),ie(r,e),e&&k(a),ie(o,e),e&&k(l),ie(i,e),e&&k(c),ie(u,e),e&&k(d),ie(f,e),e&&k(p),ie(m,e),e&&k(g),ie(h,e)}}}class It extends ue{constructor(e){super(),ce(this,e,null,Nt,l,{})}}function Ot(t){let n;return{c(){n=w("section"),n.innerHTML='<h2 class="svelte-op6vp4">Detta är en förhandsvisning</h2> \n  <p>Detta är menat att ge en känsla av den färdiga produkten och är således inte fullständig.</p>',R(n,"class","svelte-op6vp4")},m(e,t){x(e,n,t)},p:e,i:e,o:e,d(e){e&&k(n)}}}class Vt extends ue{constructor(e){super(),ce(this,e,null,Ot,l,{})}}const Ht=document.querySelector("base");ve.linkBase=Ht?Ht.getAttribute("href"):"";const Dt=(e=>{(async()=>{ye||(ye=!0,_e||(_e=!0,we.set(je(window.location.pathname))),window.addEventListener("popstate",Ee))})();const t=new ve(e);return be.set(t,{component:xe(),router:t}),t})({initial:location.pathname,base:ve.linkBase});return Dt.catch(((e,t)=>Ae(ve.linkBase))),Dt.get("/",((e,t)=>t.send(It))),Dt.get("/:subpage",((e,t)=>t.send(Vt))),new class extends ue{constructor(e){super(),ce(this,e,null,Xe,l,{})}}({target:document.body})}();
