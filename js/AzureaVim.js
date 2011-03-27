// ==AzureaScript==
// @name AzureaVim
// @author http://c4se.sakura.ne.jp/profile.html
// @scriptUrl https://github.com/ne-sachirou/AzureaVim/raw/master/js/
// @date 2011-03-27
// @license MIT License
// ==/AzureaScript==
AzureaUtil={mixin:{},ApiProxy:{},db:{},event:{},time:{},template:{},yank:{},notify:{}};
(function(){function b(a,d,h){var m;if(h==null)h=true;for(m in d)if(h||typeof a[m]==="undefined")a[m]=d[m]}function e(a){if(!(this instanceof e))return new e(a);a=a||"";this.uri=E+a;return this}function c(a,d){System.settings.setValue("user.AzureaVim",a,encodeURIComponent(d));A[a]=d}function f(a){A[a]||(A[a]=decodeURIComponent(System.settings.getValue("user.AzureaVim",a)));return A[a]}function g(a){System.settings.setValue("user.AzureaVim",a,"");delete A[a]}function j(a,d){for(var h=v[a],m=-1;h[++m];)h[m]===
d&&h.splice(m,1);h.push(d)}function i(){var a=(new Date).getTime(),d;for(d in D)if(D[d][0]<=a){D[d][1]();delete D[d]}for(d in F)if(F[d][0]<=a){F[d][0]=a+F[d][2];F[d][1]()}for(d in timeevent_list)if(timeevent_list[d][0]<=a){timeevent_list[d][1]();g("TimeEvent"+timeevent_list[d][2]);delete timeevent_list[d]}}function p(a){System.isActive?System.showNotice(a):System.showMessage(a,a,1048576)}function z(a,d,h,m){a={title:a,text:d,sticky:m?"on":null};a[/^https?:\/\/./.test(h)?"icon_url":"twitter_screen_name"]=
h;G.submit(null,a,function(s){try{var l=JSON.parse(s.body);l.error&&p(l.request.text)}catch(k){p(s.body)}})}JSON={};(function(){function a(o){return o<10?"0"+o:o}function d(o){s.lastIndex=0;return s.test(o)?'"'+o.replace(s,function(x){var r=q[x];return typeof r==="string"?r:"\\u"+("0000"+x.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+o+'"'}function h(o,x){var r,u,y,C,B=l,w,n=x[o];if(n&&typeof n==="object"&&typeof n.toJSON==="function")n=n.toJSON(o);if(typeof t==="function")n=t.call(x,o,n);switch(typeof n){case "string":return d(n);
case "number":return isFinite(n)?String(n):"null";case "boolean":case "null":return String(n);case "object":if(!n)return"null";l+=k;w=[];if(Object.prototype.toString.apply(n)==="[object Array]"){C=n.length;for(r=0;r<C;r+=1)w[r]=h(r,n)||"null";y=w.length===0?"[]":l?"[\n"+l+w.join(",\n"+l)+"\n"+B+"]":"["+w.join(",")+"]";l=B;return y}if(t&&typeof t==="object"){C=t.length;for(r=0;r<C;r+=1)if(typeof t[r]==="string"){u=t[r];if(y=h(u,n))w.push(d(u)+(l?": ":":")+y)}}else for(u in n)if(Object.prototype.hasOwnProperty.call(n,
u))if(y=h(u,n))w.push(d(u)+(l?": ":":")+y);y=w.length===0?"{}":l?"{\n"+l+w.join(",\n"+l)+"\n"+B+"}":"{"+w.join(",")+"}";l=B;return y}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+a(this.getUTCMonth()+1)+"-"+a(this.getUTCDate())+"T"+a(this.getUTCHours())+":"+a(this.getUTCMinutes())+":"+a(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var m=
/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,l,k,q={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;if(typeof JSON.stringify!=="function")JSON.stringify=function(o,x,r){var u;k=l="";if(typeof r==="number")for(u=0;u<r;u+=1)k+=" ";else if(typeof r==="string")k=r;if((t=x)&&typeof x!==
"function"&&(typeof x!=="object"||typeof x.length!=="number"))throw Error("JSON.stringify");return h("",{"":o})};if(typeof JSON.parse!=="function")JSON.parse=function(o,x){function r(y,C){var B,w,n=y[C];if(n&&typeof n==="object")for(B in n)if(Object.prototype.hasOwnProperty.call(n,B)){w=r(n,B);if(w!==undefined)n[B]=w;else delete n[B]}return x.call(y,C,n)}var u;o=String(o);m.lastIndex=0;if(m.test(o))o=o.replace(m,function(y){return"\\u"+("0000"+y.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(o.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){u=eval("("+o+")");return typeof x==="function"?r({"":u},""):u}throw new SyntaxError("JSON.parse");}})();AzureaUtil.mixin=b;var E="http://localhost:80/";e.prototype={submit:function(a,d,h){var m,s=this.uri,l=[],k;for(k in d)d[k]&&l.push(k+"="+d[k]);l=encodeURI(l.join("&"));a=(a=a||"")?/\/$/.test(s)&&a.charAt(0)==="/"?s.substring(1)+a:!/\/$/.test(s)&&a.charAt(0)!=="/"?s+"/"+a:s+
a:s;if(h&&d)Http.postRequestAsync(a,l,false,h);else if(h)Http.sendRequestAsync(a,false,h);else m=d?Http.postRequest(a,l,false):Http.sendRequest(a,false);return m}};AzureaUtil.ApiProxy=e;var A={};b(AzureaUtil.db,{get:f,set:c,del:g,keys:function(){var a,d=[];for(a in A)match.test(a)&&d.push(a);return d}});var v={PreProcessTimelineStatuses:[],PreProcessTimelineStatus:[],PreFilterProcessTimelineStatus:[],PostFilterProcessTimelineStatus:[],PostProcessTimelineStatus:[],PostProcessTimelineStatuses:[],PreSendUpdateStatus:[],
PostSendUpdateStatus:[],ReceiveFavorite:[]};b(AzureaUtil.event,{PreProcessTimelineStatuses:v.PreProcessTimelineStatuses,PreProcessTimelineStatus:v.PreProcessTimelineStatus,PreFilterProcessTimelineStatus:v.PreFilterProcessTimelineStatus,PostFilterProcessTimelineStatus:v.PostFilterProcessTimelineStatus,PostProcessTimelineStatus:v.PostProcessTimelineStatus,PostProcessTimelineStatuses:v.PostProcessTimelineStatuses,PreSendUpdateStatus:v.PreSendUpdateStatus,PostSendUpdateStatus:v.PostSendUpdateStatus,ReceiveFavorite:v.ReceiveFavorite,
addEventListener:j,removeEventListener:function(a,d){for(var h=v[a],m=-1;h[++m];)if(h[m]===d){h.splice(m,1);break}}});var D={},F={};timeevent_list=function(){for(var a={},d,h=-1;d=f("TimeEvent"+ ++h);)a[d.substring(0,d.indexOf(":"))]=[d.substring(d.indexOf(":")+1,d.indexOf("|"))-0,eval("(function(){return "+d.substring(d.indexOf("|")+1)+"})()"),h];return a}();j("PreProcessTimelineStatus",i);j("PostSendUpdateStatus",i);j("ReceiveFavorite",i);b(AzureaUtil.time,{setTimeout:function(a,d){var h=Math.floor(Math.random()*
(new Date).getTime()).toString(36);D[h]=[(new Date).getTime()+d,a];return h},clearTimeout:function(a){delete D[a]},setInterval:function(a,d){var h=Math.floor(Math.random()*(new Date).getTime()).toString(36);timeinterval_list[h]=[(new Date).getTime()+d,a,d];return h},clearInterval:function(a){delete timeinterval_list[a]},setTimeevent:function(a,d){for(var h=Math.floor(Math.random()*(new Date).getTime()).toString(36),m=-1;f("TimeEvent"+ ++m););c("TimeEvent"+m,h+":"+d+"|"+a);timeevent_list[h]=[d,eval("(function(){return "+
a+"})()"),m];return h},clearTimeevent:function(a){g("TimeEvent"+timeevent_list[a][2]);delete timeevent_list[a]}});b(AzureaUtil.template,{expand:function(a,d){function h(k){var q,t,o;if(typeof k==="string"||k instanceof String)q='"'+k.replace('"','\\"')+'"';else if(typeof k==="number"||k instanceof Number)q=k.toString(10);else if(k===true||k===false)q=k;else if(k===null)q="null";else if(typeof k==="undefined")q="void(0)";else if(k instanceof Array){q="[";t=0;for(o=k.length;t<o;++t)q+=h(k[t])+",";q=
q.replace(/,$/,"")+"]"}else{q="{";for(t in k)if(k.hasOwnProperty(t))q+='"'+t+'":'+h(k[t])+",";q=q.replace(/,$/,"")+"}"}return q}var m,s=function(){var k,q="";for(k in d)if(d.hasOwnProperty(k))q+="var "+k+"="+h(d[k])+";";return q}(),l=a.replace(/#{([^}]+?)}/g,function(k,q){return eval("(function(){"+s+"return ("+q+")})()")});l=l.split("#{}");if(l.length===1){m=0;l=l[0]}else{m=l[0].length;l=l.join("")}return{text:l,cursor:m}}});b(AzureaUtil.yank,{get:function(a){if(a){a=a.charAt(0);if(/[0-9A-Za-z]/.test(a))a=
""}else a="";return f("Yank"+a)},set:function(a,d){if(a){a=a.charAt(0);if(/[0-9A-Za-z]/.test(a))a=""}else a="";c("Yank"+a,d);return d}});var G=new e("gntp");f("NotifyUseGrowl")||c("NotifyUseGrowl","0");AzureaUtil.notify=function(a,d,h,m){var s=System.systemInfo<=2&&f("NotifyUseGrowl");try{s?z(d,a,h,m):p(a)}catch(l){p(a)}}})();function PreProcessTimelineStatus(b){for(var e=AzureaUtil.event.PreProcessTimelineStatus,c=-1;e[++c];)e[c](b)}
function PreFilterProcessTimelineStatus(b){for(var e=AzureaUtil.event.PreFilterProcessTimelineStatus,c=-1,f,g=false;e[++c];){f=e[c](b);g=g||f}return g}function PreSendUpdateStatus(b){for(var e=AzureaUtil.event.PreSendUpdateStatus,c=-1,f,g=false;e[++c];){f=e[c](b);g=g||f}return g}function PostSendUpdateStatus(){for(var b=AzureaUtil.event.PostSendUpdateStatus,e=-1;b[++e];)b[e]()}function ReceiveFavorite(b,e,c){for(var f=AzureaUtil.event.ReceiveFavorite,g=-1;f[++g];)f[g](b,e,c)}AzureaVim={};
(function(){function b(c){var f=TwitterService.status,g=c.in_reply_to_status_id,j=f.get(g);c=this.command_text=c.text.slice(1);var i=[],p,z=/[^\s"]+|\s+|"[^\\"]*(?:\\.[^\\"]*)*"/g;for(c=c.replace(/^\s+|\s+$/g,"");p=z.exec(c);)/^\s/.test(p[0])||i.push(p[0].replace(/^"|"$/g,""));this.command=i;this.status_id=g;this.screen_name=j.user.screen_name;this.status_text=j.text;this.status_urls=[];this.status_hashes=[];this.status_users=[];f.getUrls(g,this.status_urls);f.getHashes(g,this.status_hashes);f.getUsers(g,
this.status_users)}var e={};System.addKeyBindingHandler(186,0,function(c){AzureaUtil.yank.set(null,TextArea.text);TextArea.text=":";TextArea.in_reply_to_status_id=c;TextArea.show();TextArea.setFocus();TextArea.setCursor(1)});System.addContextMenuHandler(":vim",0,function(){var c=System.inputBox("command","",true);AzureaUtil.yank.set(null,c);(new b({text:":"+c,in_reply_to_status_id:System.views.selectedStatusId})).run()});AzureaUtil.event.addEventListener("PreSendUpdateStatus",function(c){var f,g=
false;try{if(c.text===":"){g=true;AzureaUtil.time.setTimeout(function(){TextArea.text=AzureaUtil.yank.get(null);TextArea.show()},0)}else if(/^(?::|\uff1a)/.test(c.text)){g=true;AzureaUtil.yank.set(null,c.text);f=new b(c);TextArea.text="";TextArea.in_reply_to_status_id=0;f.run()}else AzureaUtil.yank.set(null,c.text)}catch(j){System.alert(j.name+":\n"+j.message);g=true}return g});AzureaVim=b;AzureaVim.commands_list=e;AzureaVim.prototype={run:function(){var c=this.command,f=e[this.command[0]];if(f){if(f.indexOf(" ")!==
-1){c.shift();c=this.command=f.split(" ").concat(c);f=c[0]}this[f]()}else System.showNotice(":"+c[0]+" command is undefined.")}}})();AzureaUtil.mixin(AzureaVim.commands_list,{eval:"_evaluate"});AzureaVim.prototype._evaluate=function(){this.command[1]=this.command.slice(1).join(" ");System.inputBox(this.command[1],eval(this.command[1]),false)};AzureaUtil.mixin(AzureaVim.commands_list,{unshorten:"unshorten","\u3046\u3093\u3057\u3087\uff52\u3066\uff4e":"unshorten"});
(function(){function b(g){for(var j=AzureaVim.prototype.unshorten.services,i=-1,p=false;j[++i];)if(g.indexOf(j[i])!==-1){p=true;break}return p}function e(g,j){var i=c,p,z=g;if(b(g))if(i[g])z=i[g];else if(j)try{Http.sendRequestAsync("http://untiny.me/api/1.0/extract/?url="+g+"&format=text",false,function(v){AzureaVim.prototype.unshorten.cashe[g]=/^error/.test(v.body)?g:v.body})}catch(E){}else try{p=Http.sendRequest("http://untiny.me/api/1.0/extract/?url="+g+"&format=text",false);z=/^error/.test(p.body)?
g:p.body;i[g]=z}catch(A){}return z}var c={"http://c4se.tk/":"http://c4se.sakura.ne.jp/"};AzureaUtil.event.addEventListener("PreProcessTimelineStatus",function(g){g.text=g.text.replace(/https?:\/\/[0-9A-Za-z._\-^~\/&%?]+/g,function(j){return e(j,true)})});AzureaVim.prototype.unshorten=function(){var g=this.status_urls[this.command[1]||0],j=e(g);System.inputBox(g,j,false);return j};AzureaVim.prototype.unshorten.services=[];AzureaVim.prototype.unshorten.cashe=c;AzureaVim.prototype.unshorten.unshorten=
e;try{Http.sendRequestAsync("http://untiny.me/api/1.0/services/?format=text",true,function(g){AzureaVim.prototype.unshorten.services=g.body.split(", ")})}catch(f){}})();AzureaUtil.mixin(AzureaVim.commands_list,{open:"open",o:"open","\u304a":"open",url:"open url","\u3046\uff52\uff4c":"open url"});
AzureaVim.prototype.open=function(){var b;b=this.unshorten?this.unshorten.unshorten:function(e){return e};switch({status:"status",favstar:"favstar",fav:"favstar",f:"favstar",favotter:"favotter",favlook:"favlook",twistar:"twistar",favolog:"favolog",twilog:"twilog",user:"user",url:"url"}[this.command[1]]){case "status":b="https://twitter.com/"+this.screen_name+"/status/"+this.status_id;break;case "favstar":b="http://favstar.fm/t/"+this.status_id;break;case "favotter":b="http://favotter.net/status.php?id="+
this.status_id;break;case "favlook":b="http://favlook.osa-p.net/status.html?status_id="+this.status_id;break;case "twistar":b="http://twistar.cc/"+this.screen_name+"/status/"+this.status_id;break;case "favolog":b="http://favolog.org/"+(this.command[2]||this.screen_name);break;case "twilog":b="http://twilog.org/"+(this.command[2]||this.screen_name);break;case "user":b="http://twitter.com/"+(this.command[2]||this.screen_name);break;case "url":this.command[2]||(this.command[2]=0);b=b(this.status_urls[this.command[2]],
true);break;default:b=this.status_urls[0]?b(this.status_urls[0],true):"https://twitter.com/"+this.screen_name+"/status/"+this.status_id}System.openUrl(b)};AzureaUtil.mixin(AzureaVim.commands_list,{reply:"reply",r:"reply","\uff52":"reply","@":"reply","\uff20":"reply",quotetweet:"reply quote",qt:"reply quote","\uff51\uff54":"reply quote",mrt:"reply mrt","\uff4d\uff52\uff54":"reply mrt"});
(function(){AzureaVim.prototype.reply=function(){var b;switch({template:"template",all:"all",quote:"quote",qt:"quote",mrt:"mrt",masirosiki:"mrt"}[this.command[1]]){case "template":b=AzureaUtil.template.expand(this.command[2],this);Http.sendRequestAsync("http://google.com/",false,new Function("TextArea.text = '"+b.text.replace("'","\\'")+"';TextArea.in_reply_to_status_id = '"+(this.command[3]==="true"?this.status_id:0)+"';TextArea.show();TextArea.setFocus();TextArea.setCursor("+b.cursor+");"));break;
case "all":this.command=["reply","template","@#{screen_name + (status_users.length ? ' @' +status_users.join(' @') : '')} #{}","true"];this.reply();break;case "quote":this.command=["reply","template","@#{screen_name} #{} RT: #{status_text}","true"];this.reply();break;case "mrt":this.command=this.command[2]==="f"||this.command[2]==="fav"||this.command[2]==="favstar"?["reply","template","#{} MRT: #{'http://favstar.fm/t/' + status_id}","false"]:["reply","template","#{} MRT: #{'http://twitter.com/' + screen_name + '/status/' + status_id}",
"false"];this.reply();break;default:this.command=["reply","template","@#{screen_name} #{}#{status_hashes.length ? ' ' + status_hashes.join(' ') : ''}","true"];this.reply()}};System.addKeyBindingHandler(82,0,function(b){var e=TwitterService.status.get(b).user.screen_name,c=[];TwitterService.status.getHashes(b,c);TextArea.text="@"+e+" "+(c.length?" "+c.join(" "):"");TextArea.in_reply_to_status_id=b;TextArea.show();TextArea.setFocus();TextArea.setCursor(e.length+2)})})();
AzureaUtil.mixin(AzureaVim.commands_list,{retweet:"retweet",rt:"retweet","\uff52\uff54":"retweet"});AzureaVim.prototype.retweet=function(){TwitterService.retweet.create(this.status_id)};AzureaUtil.mixin(AzureaVim.commands_list,{settings:"settings",setting:"settings",set:"settings","\u305b\uff54":"settings",get:"settings","\u3052\uff54":"settings"});
AzureaVim.prototype.settings=function(){var b;b=this.command.slice(1).join("");b=b.split("::");b=[b[0]].concat(b[1].split("="));if(/^(?:get|\u3052\uff54)/.test(this.command[0]))b.length=2;if(b[2]){System.settings.setValue(b[0],b[1],b[2]);System.showNotice("Setting done: "+b[0]+"::"+b[1]+"="+b[2])}else System.showNotice("Getting done: "+b[0]+"::"+b[1]+"="+System.settings.getValue(b[0],b[1]))};AzureaUtil.mixin(AzureaVim.commands_list,{shindan:"shindanmaker","\u3057\u3093\u3060\uff4e":"shindanmaker"});
AzureaVim.prototype.shindanmaker=function(){for(var b,e=-1,c=this.unshorten?this.unshorten.unshorten:function(f){return f};b=c(this.status_urls[++e],true);)if(b.match("^http://shindanmaker.com/[0-9]+"))break;if(b)Http.postRequestAsync(b,"u="+encodeURI(this.command[1]||TwitterService.currentUser().screen_name),false,function(f){f.body.match("<textarea.*?>(.*?)</textarea>");TextArea.text=RegExp.$1;TextArea.in_reply_to_status_id=0;TextArea.show();TextArea.setFocus()})};
AzureaUtil.mixin(AzureaVim.commands_list,{translate:"translate",ja:"translate ja","\u3058\u3083":"translate ja"});
AzureaVim.prototype.translate=function(){this.command[1]||(this.command[1]="ja");Http.sendRequestAsync("https://www.googleapis.com/language/translate/v2?key=AIzaSyCva1yUIFIBRqXOZDJ0nrbGbm0bz3FIksc&q="+encodeURI(this.status_text)+"&target="+this.command[1],false,function(b){if(b.statusCode!==200)throw Error("Google Translate API Error. statusCode is "+b.statusCode+".");System.showMessage(b.body.match(/"translatedText"\s*:\s*"(.*)"/)[1],b.body.match(/"detectedSourceLanguage"\s*:\s*"(.*)"/)[1]+"-> ",
0)})};AzureaUtil.mixin(AzureaVim.commands_list,{view:"view",v:"view",home:"view home","\u307b\u3081":"view home",user:"view user","\u3046\u305b\uff52":"view user"});
AzureaVim.prototype.view=function(){var b=System.apiLevel>=11?System.views:System;switch({home:"home",timeline:"home",h:"home",mention:"mention",reply:"mention",r:"mention",m:"mention","@":"mention",message:"message",dm:"message",d:"message",user:"user",u:"user",search:"search",favorite:"favorite",fav:"favorite",f:"favorite",match:"match",following:"following",follow:"following",followers:"followers",follower:"followers",followed:"followers"}[this.command[1]]){case "home":b.openTimeline();break;case "mention":b.openMention();
break;case "message":b.openMessage();break;case "user":b.openUserTimeline(this.command[2]||this.screen_name,false);break;case "search":b.openSearch(this.command[2],false);break;case "favorite":b.openFavorite();break;case "match":b.openMatch(this.command[2],false);break;case "following":b.openFollwoing();break;case "followers":b.openFollowers()}};AzureaUtil.mixin(AzureaVim.commands_list,{earthquake:"earthquake",jisin:"earthquake","\u3048\u3042\uff52\uff54\uff48\u304f\u3042\u3051":"earthquake","\u3058\u3057\uff4e":"earthquake"});
(function(){function b(c){var f=AzureaUtil.db.get("EarthquakeMessage");if(c!=null)f=AzureaUtil.template.expand(f,c).text;return f}function e(c){c=c||AzureaUtil.db.get("EarthquakeMessage");AzureaUtil.db.set("EarthquakeMessage",c);return c}AzureaUtil.db.get("EarthquakeMessage")||AzureaUtil.db.set("EarthquakeMessage","\u5730\u9707\u306a\u3046 #{Date()}");AzureaVim.prototype.earthquake=function(){var c;switch(this.command[1]){case "set":if(this.command[2])c=e(this.command[2]);else{c=System.inputBox("\u5730\u9707\u306a\u3046\u6295\u7a3f\u6587",
b(),false);e(c);c=c}c=c;break;default:TwitterService.status.update(b(this),0)}return c};System.addKeyBindingHandler(40,2,function(){TwitterService.status.update(":earthquake",0)})})();AzureaUtil.mixin(AzureaVim.commands_list,{delay:"delay","\u3067\u3041\uff59":"delay"});
(function(){function b(e,c,f){Http.postRequestAsync("http://twitdelay.appspot.com/api/post","user_id="+TwitterService.currentUser.id+"&api_key="+AzureaUtil.db.get("DelayTwitDelayApiKey")+"&status="+e+"&at="+c,false,f)}AzureaUtil.db.get("DelayUseTwitDelay")&&AzureaUtil.db.set("DelayUseTwitDelay","0");AzureaVim.prototype.delay=function(){var e,c;if(e=this.command[1].match(/^(?:(?:(\d{4})-)?(\d{1,2})-(\d{1,2}) )?(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/)){c=new Date;e[1]&&c.setFullYear(e[1]);e[2]&&c.setMonth(e[2]-
1);e[3]&&c.setDate(e[3]);c.setHours(e[4]);c.setMinutes(e[5]);c.setSeconds(0);e[6]&&c.setSeconds(e[6]);this.command[1]=c.getTime();e=2}else{this.command[1]=(new Date).getTime()+(this.command[1]-0);e=1}this.command[2]=this.command.slice(2).join(" ");if(AzureaUtil.db.get("DelayUseTwitDelay")){c=new Date(this.command[1]);b(this.command[2],c.getUTCDate()+" "+c.getUTCMonth()+" "+c.getUTCFullYear()+" "+c.getUTCHours()+":"+c.getUTCMinutes()+":"+c.getUTCSeconds()+" +0000",function(){})}else e===1?AzureaUtil.time.setTimeout(function(f){return function(){TwitterService.status.update(f.command[2],
f.status_id)}}(this),this.command[1]-(new Date).getTime()):AzureaUtil.time.setTimeevent('function() {TwitterService.status.update("'+this.command[2]+'", "'+this.status_id+'");}',this.command[1])}})();AzureaUtil.mixin(AzureaVim.codelist,{});System.addKeyBindingHandler(67,2,function(b){b=TwitterService.status.get(b).text;System.clipboard=b;AzureaUtil.yank.set(null,b)});AzureaUtil.mixin(AzureaVim.commands_list,{notify:"notify"});
(function(){function b(j,i){i=i||"";if(j){f=RegExp(j,i);AzureaUtil.db.set("NotifyPattern",j);AzureaUtil.db.set("NotifyPatternOption",i)}else f=null;return f}var e=AzureaUtil.db.get("NotifyPattern"),c=AzureaUtil.db.get("NotifyPatternOption"),f=null,g={faved:AzureaUtil.db.get("NotifyWhenFaved"),mention:AzureaUtil.db.get("NotifyWhenMention"),matched:AzureaUtil.db.get("NotifyWhenMatched")};if(e)f=RegExp(e,c);AzureaVim.prototype.notify=function(){function j(z){var E,A=z.match(/^\/(.*)\/([a-zA-Z]*)$/);
if(A){z=A[1];E=A[2].toLowerCase()}return[z,E]}var i,p;i={faved:"Faved",fav:"Faved",f:"Faved",mention:"Mention",reply:"Mention",r:"Mention","@":"Mention",matched:"Matched",match:"Matched",m:"Matched"};switch({pattern:"pattern",when:"when",growl:"growl",gntp:"growl"}[this.command[1]]){case "pattern":if(i=this.command.slice(2).join(" "))i=j(i);else{i=AzureaUtil.db.get("NotifyPattern");p=AzureaUtil.db.get("NotifyPatternOption");i=j(System.inputBox("tweet\u306b\u30de\u30c3\u30c1\u3055\u305b\u308b\u6b63\u898f\u8868\u73fe",
p?"/"+i+"/"+p:i,false))}p=i[1];i=i[0];b(i,p);break;case "when":i=i[this.command[2]];AzureaUtil.db.set("NotifyWhen"+i,this.command[3]||System.inputBox(i,AzureaUtil.db.get("NotifyWhen"+i),true)?"1":"0");break;case "growl":AzureaUtil.db.set("NotifyUseGrowl",this.command[2]||System.inputBox("NotifyUseGrowl",AzureaUtil.db.get("NotifyUseGrowl"),true)?"1":"0")}};AzureaUtil.event.addEventListener("ReceiveFavorite",function(j,i,p){g.faved&&AzureaUtil.notify("Favs@"+j.screen_name+": "+p.text,"Favs - AzureaVim",
j.screen_name,false)});AzureaUtil.event.addEventListener("PreFilterProcessTimelineStatus",function(j){var i=j.text;j=j.user;g.mention&&i.indexOf(TwitterService.currentUser.screen_name)!==-1&&AzureaUtil.notify("Mention@"+j.screen_name+": "+i,"Mention - AzureaVim",j.screen_name,false);g.matched&&f&&f.test(i)&&AzureaUtil.notify("Matches@"+j.screen_name+": "+i,"Matched - AzureaVim",j.screen_name,false)})})();
