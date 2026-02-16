import{e as V,R as le,K as we,a as re,l as j,M as xe}from"./monaco-editor-DrfwNogv.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();class ne{maxSize;cache;constructor(e){this.maxSize=e,this.cache=new Map}has(e){return this.cache.has(e)}get(e){const t=this.cache.get(e);return t!==void 0&&(this.cache.delete(e),this.cache.set(e,t)),t}set(e,t){if(this.cache.has(e))this.cache.delete(e);else if(this.cache.size>=this.maxSize){const r=this.cache.keys().next().value;this.cache.delete(r)}this.cache.set(e,t)}clear(){this.cache.clear()}get size(){return this.cache.size}}function se(a){const e=a.lastIndexOf("/");return e>0?a.substring(0,e):a}class ve{baseUrl;rootIndex=null;loadedLibraries=new Map;enabledLibraries=new Set;presetCache;audioCache;_audioContext=null;constructor(e,t){this.baseUrl=e.replace(/\/$/,""),this.presetCache=new ne(t?.presetCacheSize??128),this.audioCache=new ne(t?.audioCacheSize??256)}setAudioContext(e){this._audioContext=e}getAudioContext(){return this._audioContext}async loadRootIndex(){if(this.rootIndex)return this.rootIndex;const e=`${this.baseUrl}/index.json`,t=await fetch(e);if(!t.ok)throw new Error(`Failed to fetch root index: ${t.status} ${e}`);return this.rootIndex=await t.json(),this.rootIndex}async getAvailableLibrariesAsync(){return(await this.loadRootIndex()).entries.filter(t=>t.type==="index")}getAvailableLibraries(){if(!this.rootIndex)return[];const e=this.rootIndex.entries.filter(t=>t.type==="index");if(e.length===0){const t=this.rootIndex.entries.filter(r=>r.type==="preset").length;if(t>0){const r=this.rootIndex.name;return[{name:r,path:"index.json",description:this.rootIndex.description,presetCount:t,loaded:this.loadedLibraries.has(r),enabled:this.enabledLibraries.has(r)}]}return[]}return e.map(t=>({name:t.name,path:t.path,description:t.description,presetCount:t.presetCount,loaded:this.loadedLibraries.has(t.name),enabled:this.enabledLibraries.has(t.name)}))}async loadLibrary(e){if(this.loadedLibraries.has(e))return this.loadedLibraries.get(e);const t=await this.loadRootIndex();if(!t.entries.some(u=>u.type==="index")&&t.name===e){const u={index:t,baseUrl:this.baseUrl};return this.loadedLibraries.set(e,u),u}const n=t.entries.find(u=>u.type==="index"&&u.name===e);if(!n)throw new Error(`Library not found: "${e}"`);const s=`${this.baseUrl}/${n.path}`,o=await fetch(s);if(!o.ok)throw new Error(`Failed to fetch library index: ${o.status} ${s}`);const i=await o.json(),l=se(s),h={index:i,baseUrl:l};return this.loadedLibraries.set(e,h),h}async enableLibrary(e){await this.loadLibrary(e),this.enabledLibraries.add(e)}disableLibrary(e){this.enabledLibraries.delete(e)}getEnabledLibraries(){return Array.from(this.enabledLibraries)}_getEnabledPresets(){const e=[];for(const t of this.enabledLibraries){const r=this.loadedLibraries.get(t);if(r)for(const n of r.index.entries)n.type==="preset"&&e.push({libraryName:t,entry:n})}return e}search(e={}){let t=this._getEnabledPresets();if(e.library&&(t=t.filter(r=>r.libraryName.toLowerCase()===e.library.toLowerCase())),e.category&&(t=t.filter(r=>r.entry.category===e.category)),e.gmProgram!==void 0&&(t=t.filter(r=>r.entry.gmProgram===e.gmProgram)),e.tags&&e.tags.length>0){const r=new Set(e.tags.map(n=>n.toLowerCase()));t=t.filter(n=>n.entry.tags.some(s=>r.has(s.toLowerCase())))}if(e.name){const r=e.name.toLowerCase();t=t.filter(n=>n.entry.name.toLowerCase().includes(r))}return t.map(r=>r.entry)}fuzzySearch(e,t=20){const r=e.toLowerCase();return this._getEnabledPresets().map(({entry:o})=>{const i=o.name.toLowerCase();let l=0;if(i===r)l=100;else if(i.startsWith(r))l=80;else if(i.includes(r))l=60;else if(o.tags.some(h=>h.toLowerCase().includes(r)))l=40;else{const h=r.split(/\s+/);l=h.filter(m=>i.includes(m)||o.tags.some(w=>w.toLowerCase().includes(m))).length/h.length*30}return{entry:o,score:l}}).filter(o=>o.score>0).sort((o,i)=>i.score-o.score).slice(0,t).map(o=>o.entry)}async loadPreset(e){const t=e.indexOf("/");if(t>0){const n=e.substring(0,t),s=e.substring(t+1);this.enabledLibraries.has(n)||await this.enableLibrary(n);const o=this.search({name:s,library:n});if(o.length>0)return this._loadPresetEntry(o[0],n)}const r=this.search({name:e});if(r.length===0)throw new Error(`Preset not found: "${e}"`);return this._loadPresetEntry(r[0])}async loadPresetByPath(e,t){const r=this.resolvePresetUrl(e,t);return this._fetchPreset(r,e)}async loadPresetByProgram(e){const t=this.search({gmProgram:e});if(t.length===0)throw new Error(`No preset found for GM program ${e}`);return this._loadPresetEntry(t[0])}async _loadPresetEntry(e,t){const r=t??this.findLibraryForEntry(e),n=this.resolvePresetUrl(e.path,r);return this._fetchPreset(n,e.path)}findLibraryForEntry(e){for(const[t,{index:r}]of this.loadedLibraries)if(r.entries.some(n=>n.type==="preset"&&n.name===e.name&&n.path===e.path))return t}resolvePresetUrl(e,t){if(t){const r=this.loadedLibraries.get(t);if(r)return`${r.baseUrl}/${e}`}return`${this.baseUrl}/${e}`}async _fetchPreset(e,t){if(this.presetCache.has(t))return this.presetCache.get(t);const r=await fetch(e);if(!r.ok)throw new Error(`Failed to fetch preset: ${r.status} ${e}`);const n=await r.json();return this.presetCache.set(t,n),n}async decodeAudio(e,t){const r=this._audioContext;if(!r)throw new Error("AudioContext not set. Call setAudioContext() first.");let n,s;switch(e.type){case"external":{const i=t?`${se(t)}/${e.path}`:`${this.baseUrl}/${e.path}`;if(n=e.sha256??i,this.audioCache.has(n))return this.audioCache.get(n);const l=await fetch(i);if(!l.ok)throw new Error(`Failed to fetch sample: ${l.status} ${i}`);s=await l.arrayBuffer();break}case"contentAddressed":{if(n=e.sha256,this.audioCache.has(n))return this.audioCache.get(n);const i=`${this.baseUrl}/samples/${e.sha256}.${e.codec}`,l=await fetch(i);if(!l.ok)throw new Error(`Failed to fetch sample: ${l.status} ${i}`);s=await l.arrayBuffer();break}case"inlineFile":{if(n=`inline:${e.data.slice(0,32)}`,this.audioCache.has(n))return this.audioCache.get(n);const i=atob(e.data);s=new ArrayBuffer(i.length);const l=new Uint8Array(s);for(let h=0;h<i.length;h++)l[h]=i.charCodeAt(h);break}case"inlinePcm":{if(n=`pcm:${e.data.slice(0,32)}`,this.audioCache.has(n))return this.audioCache.get(n);const i=atob(e.data),l=new Uint8Array(i.length);for(let m=0;m<i.length;m++)l[m]=i.charCodeAt(m);const h=new Float32Array(l.buffer),u=r.createBuffer(1,h.length,e.sampleRate);return u.copyToChannel(h,0),this.audioCache.set(n,u),u}}const o=await r.decodeAudioData(s);return this.audioCache.set(n,o),o}async decodeSamplerZones(e,t){const r=new Map,n=e.zones.map(async s=>{const o=await this.decodeAudio(s.audio,t);r.set(s,o)});return await Promise.all(n),r}clearCaches(){this.presetCache.clear(),this.audioCache.clear()}get presetCacheSize(){return this.presetCache.size}get audioCacheSize(){return this.audioCache.size}async preloadAll(e){await this.loadRootIndex();const t=new Set;for(const n of e){const s=n.indexOf("/");s>0&&t.add(n.substring(0,s))}await Promise.all(Array.from(t).map(n=>this.enableLibrary(n)));const r=e.map(async n=>{try{const s=await this.loadPreset(n);if(s.node?.type==="sampler"&&s.node.config){const o=this.search({name:n})[0];if(o){const i=this.findLibraryForEntry(o),l=this.resolvePresetUrl(o.path,i);await this.decodeSamplerZones(s.node.config,l)}}}catch(s){console.warn(`[PresetLoader] Failed to preload "${n}":`,s)}});await Promise.all(r)}}function ae(a){const e=S(a,d.__wbindgen_malloc,d.__wbindgen_realloc),t=_,r=d.compile_song(e,t);if(r[2])throw $(r[1]);return $(r[0])}function ke(){let a,e;try{const t=d.core_version();return a=t[0],e=t[1],q(t[0],t[1])}finally{d.__wbindgen_free(a,e,1)}}function Ce(a,e){const t=S(a,d.__wbindgen_malloc,d.__wbindgen_realloc),r=_,n=d.render_song_samples(t,r,e);if(n[3])throw $(n[2]);var s=ce(n[0],n[1]).slice();return d.__wbindgen_free(n[0],n[1]*4,4),s}function _e(a,e,t){const r=S(a,d.__wbindgen_malloc,d.__wbindgen_realloc),n=_,s=S(t,d.__wbindgen_malloc,d.__wbindgen_realloc),o=_,i=d.render_song_samples_with_presets(r,n,e,s,o);if(i[3])throw $(i[2]);var l=ce(i[0],i[1]).slice();return d.__wbindgen_free(i[0],i[1]*4,4),l}function Ee(a,e){const t=S(a,d.__wbindgen_malloc,d.__wbindgen_realloc),r=_,n=d.render_song_wav(t,r,e);if(n[3])throw $(n[2]);var s=de(n[0],n[1]).slice();return d.__wbindgen_free(n[0],n[1]*1,1),s}function Le(a,e,t){const r=S(a,d.__wbindgen_malloc,d.__wbindgen_realloc),n=_,s=S(t,d.__wbindgen_malloc,d.__wbindgen_realloc),o=_,i=d.render_song_wav_with_presets(r,n,e,s,o);if(i[3])throw $(i[2]);var l=de(i[0],i[1]).slice();return d.__wbindgen_free(i[0],i[1]*1,1),l}function Se(){return{__proto__:null,"./songwalker_core_bg.js":{__proto__:null,__wbg_Error_8c4e43fe74559d73:function(e,t){return Error(q(e,t))},__wbg_String_8f0eb39a4a4c2f66:function(e,t){const r=String(t),n=S(r,d.__wbindgen_malloc,d.__wbindgen_realloc),s=_;oe().setInt32(e+4,s,!0),oe().setInt32(e+0,n,!0)},__wbg___wbindgen_throw_be289d5034ed271b:function(e,t){throw new Error(q(e,t))},__wbg_new_361308b2356cecd0:function(){return new Object},__wbg_new_3eb36ae241fe6f44:function(){return new Array},__wbg_set_3f1d0b984ed272ed:function(e,t,r){e[t]=r},__wbg_set_f43e577aea94465b:function(e,t,r){e[t>>>0]=r},__wbindgen_cast_0000000000000001:function(e){return e},__wbindgen_cast_0000000000000002:function(e,t){return q(e,t)},__wbindgen_cast_0000000000000003:function(e){return BigInt.asUintN(64,e)},__wbindgen_init_externref_table:function(){const e=d.__wbindgen_externrefs,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}}}}function ce(a,e){return a=a>>>0,Pe().subarray(a/4,a/4+e)}function de(a,e){return a=a>>>0,F().subarray(a/1,a/1+e)}let B=null;function oe(){return(B===null||B.buffer.detached===!0||B.buffer.detached===void 0&&B.buffer!==d.memory.buffer)&&(B=new DataView(d.memory.buffer)),B}let I=null;function Pe(){return(I===null||I.byteLength===0)&&(I=new Float32Array(d.memory.buffer)),I}function q(a,e){return a=a>>>0,Re(a,e)}let M=null;function F(){return(M===null||M.byteLength===0)&&(M=new Uint8Array(d.memory.buffer)),M}function S(a,e,t){if(t===void 0){const i=U.encode(a),l=e(i.length,1)>>>0;return F().subarray(l,l+i.length).set(i),_=i.length,l}let r=a.length,n=e(r,1)>>>0;const s=F();let o=0;for(;o<r;o++){const i=a.charCodeAt(o);if(i>127)break;s[n+o]=i}if(o!==r){o!==0&&(a=a.slice(o)),n=t(n,r,r=o+a.length*3,1)>>>0;const i=F().subarray(n+o,n+r),l=U.encodeInto(a,i);o+=l.written,n=t(n,r,o,1)>>>0}return _=o,n}function $(a){const e=d.__wbindgen_externrefs.get(a);return d.__externref_table_dealloc(a),e}let H=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});H.decode();const Be=2146435072;let K=0;function Re(a,e){return K+=e,K>=Be&&(H=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}),H.decode(),K=e),H.decode(F().subarray(a,a+e))}const U=new TextEncoder;"encodeInto"in U||(U.encodeInto=function(a,e){const t=U.encode(a);return e.set(t),{read:a.length,written:t.length}});let _=0,d;function Ae(a,e){return d=a.exports,B=null,I=null,M=null,d.__wbindgen_start(),d}async function $e(a,e){if(typeof Response=="function"&&a instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(a,e)}catch(n){if(a.ok&&t(a.type)&&a.headers.get("Content-Type")!=="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",n);else throw n}const r=await a.arrayBuffer();return await WebAssembly.instantiate(r,e)}else{const r=await WebAssembly.instantiate(a,e);return r instanceof WebAssembly.Instance?{instance:r,module:a}:r}function t(r){switch(r){case"basic":case"cors":case"default":return!0}return!1}}async function Te(a){if(d!==void 0)return d;a!==void 0&&(Object.getPrototypeOf(a)===Object.prototype?{module_or_path:a}=a:console.warn("using deprecated parameters for the initialization function; pass a single object instead")),a===void 0&&(a=new URL("/assets/songwalker_core_bg-eEIaOIXB.wasm",import.meta.url));const e=Se();(typeof a=="string"||typeof Request=="function"&&a instanceof Request||typeof URL=="function"&&a instanceof URL)&&(a=fetch(a));const{instance:t,module:r}=await $e(await a,e);return Ae(t)}class Ie{ctx=null;sourceNode=null;analyser=null;gainNode=null;totalBeats=0;bpm=120;startTime=0;stateTimer=null;playing=!1;onStateChange=null;renderedSamples=null;SAMPLE_RATE=44100;constructor(){}onState(e){this.onStateChange=e}getAnalyser(){return this.analyser}get sampleRate(){return this.SAMPLE_RATE}async playSource(e,t){this.stop(),this.ctx||(this.ctx=new AudioContext({sampleRate:this.SAMPLE_RATE}),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.8,this.gainNode=this.ctx.createGain(),this.gainNode.connect(this.analyser),this.analyser.connect(this.ctx.destination)),this.ctx.state==="suspended"&&await this.ctx.resume();const r=t?_e(e,this.SAMPLE_RATE,t):Ce(e,this.SAMPLE_RATE);if(this.renderedSamples=r,r.length===0){this.emitState();return}this.extractMetadata(e);const n=this.ctx.createBuffer(1,r.length,this.SAMPLE_RATE);n.copyToChannel(new Float32Array(r),0),this.sourceNode=this.ctx.createBufferSource(),this.sourceNode.buffer=n,this.sourceNode.connect(this.gainNode),this.playing=!0,this.startTime=this.ctx.currentTime,this.sourceNode.start(0),this.sourceNode.onended=()=>{this.stop()},this.stateTimer=window.setInterval(()=>this.emitState(),50),this.emitState()}stop(){if(this.sourceNode){try{this.sourceNode.stop()}catch{}this.sourceNode.disconnect(),this.sourceNode=null}this.playing=!1,this.stateTimer!==null&&(clearInterval(this.stateTimer),this.stateTimer=null),this.emitState()}exportWav(e,t="song.wav",r){const n=r?Le(e,this.SAMPLE_RATE,r):Ee(e,this.SAMPLE_RATE),s=new Blob([new Uint8Array(n)],{type:"audio/wav"}),o=URL.createObjectURL(s),i=document.createElement("a");i.href=o,i.download=t,i.click(),URL.revokeObjectURL(o)}getCurrentBeat(){return!this.playing||!this.ctx?0:(this.ctx.currentTime-this.startTime)*this.bpm/60}getProgress(){return!this.playing||this.totalBeats<=0?0:Math.min(this.getCurrentBeat()/this.totalBeats,1)}get isPlaying(){return this.playing}get currentBPM(){return this.bpm}get currentTotalBeats(){return this.totalBeats}extractMetadata(e){const t=e.match(/beatsPerMinute\s*=\s*(\d+)/);this.bpm=t?parseInt(t[1],10):120;try{const r=this.sourceNode?.buffer?.duration??0;this.totalBeats=r*this.bpm/60}catch{this.totalBeats=0}}emitState(){this.onStateChange&&this.onStateChange({playing:this.playing,currentBeat:this.getCurrentBeat(),totalBeats:this.totalBeats,bpm:this.bpm})}}const N="songwalker",Me={comments:{lineComment:"//"},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}]},Ne={defaultToken:"",ignoreCase:!1,keywords:["track","const","let","for"],notes:["C","D","E","F","G","A","B"],drums:["Kick","Snare","HiHat","Crash","Ride","Tom","OpenHiHat","ClosedHiHat","Clap","Rimshot"],operators:["=","+","-","*","@","/",".","<",">"],symbols:/[=><!~?:&|+\-*\/\^%@.]+/,tokenizer:{root:[[/\/\/.*$/,"comment"],[/[A-G][b#]?\d+/,"variable.note"],[/\b(Kick|Snare|HiHat|Crash|Ride|Tom|OpenHiHat|ClosedHiHat|Clap|Rimshot)\b/,"variable.drum"],[/\b(track|const|let|for)\b/,"keyword"],[/\b(track)\.([\w.]+)/,["keyword","variable.property"]],[/[a-zA-Z_]\w*(?=\s*[\(*])/,"entity.name.function"],[/[a-zA-Z_]\w*/,"identifier"],[/\d+(\.\d+)?/,"number"],[/"([^"\\]|\\.)*"/,"string"],[/'([^'\\]|\\.)*'/,"string"],[/\/(?![\/\*])([^\/\\]|\\.)*\/[gimsuy]*/,"regexp"],[/\*/,"operator.velocity"],[/@/,"operator.duration"],[/\//,"operator.slash"],[/\.\.?/,"operator.dot"],[/[{}()\[\]]/,"@brackets"],[/[;,]/,"delimiter"]]}},Fe={base:"vs-dark",inherit:!0,rules:[{token:"comment",foreground:"6c7086",fontStyle:"italic"},{token:"keyword",foreground:"cba6f7",fontStyle:"bold"},{token:"variable.note",foreground:"89b4fa",fontStyle:"bold"},{token:"variable.drum",foreground:"fab387",fontStyle:"bold"},{token:"variable.property",foreground:"94e2d5"},{token:"entity.name.function",foreground:"89dceb"},{token:"number",foreground:"fab387"},{token:"string",foreground:"a6e3a1"},{token:"regexp",foreground:"f5c2e7"},{token:"operator.velocity",foreground:"f9e2af"},{token:"operator.duration",foreground:"f9e2af"},{token:"operator.slash",foreground:"6c7086"},{token:"operator.dot",foreground:"f9e2af"},{token:"identifier",foreground:"cdd6f4"},{token:"delimiter",foreground:"6c7086"}],colors:{"editor.background":"#181825","editor.foreground":"#cdd6f4","editor.lineHighlightBackground":"#1e1e2e","editor.selectionBackground":"#45475a","editorCursor.foreground":"#f5e0dc","editorLineNumber.foreground":"#585b70","editorLineNumber.activeForeground":"#a6adc8","editor.inactiveSelectionBackground":"#313244"}},Ue=[{label:"track",kind:1,insertText:"track ${1:name}(${2:params}) {\n	$0\n}",insertTextRules:4,detail:"Define a new track",documentation:"Defines a track that is scheduled when called."},{label:"const",kind:1,insertText:"const ${1:name} = ${0};",insertTextRules:4,detail:"Declare a constant"},{label:"for",kind:1,insertText:"for (let ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n	$0\n}",insertTextRules:4,detail:"For loop"},{label:"loadPreset",kind:3,insertText:'loadPreset("${0}")',insertTextRules:4,detail:"Load an instrument preset by name",documentation:"Loads a preset from the catalog. Preset assets are preloaded at compile time."},{label:"Oscillator",kind:3,insertText:"Oscillator({type: '${1|sine,square,sawtooth,triangle|}'})",insertTextRules:4,detail:"Create an oscillator instrument",documentation:"Built-in oscillator preset. Options: type (waveform), attack, decay, sustain, release, detune, mixer."},{label:"track.beatsPerMinute",kind:9,insertText:"track.beatsPerMinute = ${1:120};",insertTextRules:4,detail:"Set the tempo in BPM"},{label:"track.duration",kind:9,insertText:"track.duration = ${1:1/4};",insertTextRules:4,detail:"Set the default step duration (deprecated, use track.noteLength)"},{label:"track.noteLength",kind:9,insertText:"track.noteLength = ${1:1/4};",insertTextRules:4,detail:"Set the default note length"},{label:"track.instrument",kind:9,insertText:"track.instrument = ${1:inst};",insertTextRules:4,detail:"Set the track instrument"},{label:"track.effects",kind:9,insertText:"track.effects = [${0}];",insertTextRules:4,detail:"Set the track effects chain"},{label:"song.endMode",kind:9,insertText:"song.endMode = '${1|gate,release,tail|}';",insertTextRules:4,detail:"Set song end mode: 'gate', 'release', or 'tail'",documentation:"Controls output length. 'gate' = hard cut at last note-off, 'release' = wait for envelope release, 'tail' = wait for effects tail (default)."}],Oe={synth:"#89b4fa",sampler:"#a6e3a1",effect:"#fab387",composite:"#cba6f7"};class ze{container;loader;filteredEntries=[];onSelect=null;onPlay=null;searchInput;listEl;statusEl;libraryChipsEl;categoryFilter=null;isOpen=!1;libraries=[];constructor(e,t){this.container=document.createElement("div"),this.container.className="preset-browser",this.container.innerHTML=this.buildHTML(),e.appendChild(this.container),this.loader=t,this.searchInput=this.container.querySelector(".pb-search"),this.listEl=this.container.querySelector(".pb-list"),this.statusEl=this.container.querySelector(".pb-status"),this.libraryChipsEl=this.container.querySelector(".pb-libraries"),this.bindEvents(),this.applyStyles()}onPresetSelect(e){this.onSelect=e}onPresetPlay(e){this.onPlay=e}toggle(){this.isOpen=!this.isOpen,this.container.classList.toggle("open",this.isOpen),this.isOpen&&this.libraries.length===0&&this.loadRootIndex()}open(){this.isOpen||this.toggle()}close(){this.isOpen&&this.toggle()}async loadRootIndex(){this.statusEl.textContent="Loading index…",this.statusEl.className="pb-status";try{await this.loader.loadRootIndex(),this.libraries=this.loader.getAvailableLibraries(),this.renderLibraryChips(),this.statusEl.textContent=`${this.libraries.length} libraries available`;const e=this.libraries.find(t=>t.name==="Built-in");e?await this.toggleLibrary(e.name,!0):this.libraries.length>0&&await this.toggleLibrary(this.libraries[0].name,!0)}catch(e){const t=e instanceof Error?e.message:String(e);this.statusEl.textContent=`⚠ ${t}`,this.statusEl.className="pb-status pb-status-error",this.showError(t)}}showError(e){this.listEl.innerHTML=`
            <div class="pb-error">
                <div class="pb-error-icon">⚠</div>
                <div class="pb-error-msg">${ie(e)}</div>
                <button class="pb-error-retry">Retry</button>
            </div>
        `,this.listEl.querySelector(".pb-error-retry")?.addEventListener("click",()=>{this.libraries=[],this.loadRootIndex()})}renderLibraryChips(){const e=document.createDocumentFragment();for(const t of this.libraries){const r=document.createElement("span");r.className=`pb-lib-chip${t.enabled?" active":""}`,r.dataset.library=t.name,r.title=t.description??t.name;const n=t.name,s=t.presetCount?` (${t.presetCount})`:"";r.textContent=`${n}${s}`,r.addEventListener("click",()=>this.toggleLibrary(t.name)),e.appendChild(r)}this.libraryChipsEl.replaceChildren(e)}async toggleLibrary(e,t){const r=this.libraries.find(s=>s.name===e);if(!r)return;if(t??!r.enabled){const s=this.libraryChipsEl.querySelector(`[data-library="${e}"]`);s&&(s.textContent=`${e} ⏳`);try{await this.loader.enableLibrary(e),r.enabled=!0,r.loaded=!0}catch(o){console.warn(`Failed to load library "${e}":`,o),s&&(s.textContent=`${e} ✗`);return}}else this.loader.disableLibrary(e),r.enabled=!1;this.renderLibraryChips(),this.applyFilter()}applyFilter(){const e=this.searchInput.value.trim();e?this.filteredEntries=this.loader.fuzzySearch(e,100):this.filteredEntries=this.loader.search({}),this.categoryFilter&&(this.filteredEntries=this.filteredEntries.filter(t=>t.category===this.categoryFilter)),this.renderList()}renderList(){const e=document.createDocumentFragment();for(const n of this.filteredEntries.slice(0,200)){const s=document.createElement("div");s.className="pb-item",s.dataset.path=n.path;const o=Oe[n.category]??"#cdd6f4";s.innerHTML=`
                <button class="pb-item-play" title="Preview preset">▶</button>
                <span class="pb-item-dot" style="background:${o}"></span>
                <span class="pb-item-name">${ie(n.name)}</span>
                <span class="pb-item-meta">${n.zoneCount?n.zoneCount+"z":n.category}</span>
            `,s.querySelector(".pb-item-play").addEventListener("click",l=>{l.stopPropagation(),this.onPlay&&this.onPlay(n)}),s.addEventListener("click",()=>{this.onSelect&&this.onSelect(n)}),e.appendChild(s)}this.listEl.replaceChildren(e);const t=this.filteredEntries.length,r=Math.min(t,200);this.statusEl.textContent=t===r?`${t} presets`:`${r} / ${t} presets`}bindEvents(){this.searchInput.addEventListener("input",()=>this.applyFilter()),this.container.querySelector(".pb-close")?.addEventListener("click",()=>this.close());const t=this.container.querySelectorAll(".pb-chip");t.forEach(r=>{r.addEventListener("click",()=>{const n=r.dataset.category;n==="all"||this.categoryFilter===n?(this.categoryFilter=null,t.forEach(s=>s.classList.remove("active")),r.classList.add("active")):(this.categoryFilter=n,t.forEach(s=>s.classList.remove("active")),r.classList.add("active")),this.applyFilter()})})}buildHTML(){return`
            <div class="pb-header">
                <span class="pb-title">Presets</span>
                <button class="pb-close" title="Close">&times;</button>
            </div>
            <div class="pb-libraries"></div>
            <input class="pb-search" type="text" placeholder="Search presets…" />
            <div class="pb-filters">
                <span class="pb-chip active" data-category="all">All</span>
                <span class="pb-chip" data-category="sampler">Sampler</span>
                <span class="pb-chip" data-category="synth">Synth</span>
                <span class="pb-chip" data-category="composite">Composite</span>
                <span class="pb-chip" data-category="effect">Effect</span>
            </div>
            <div class="pb-list"></div>
            <div class="pb-status">Click "Presets" to load</div>
        `}applyStyles(){if(document.getElementById("pb-styles"))return;const e=document.createElement("style");e.id="pb-styles",e.textContent=`
.preset-browser {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    background: var(--surface, #181825);
    border-left: 1px solid var(--border, #313244);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.2s ease;
    z-index: 50;
    font-size: 0.85rem;
}
.preset-browser.open {
    transform: translateX(0);
}
.pb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--border, #313244);
}
.pb-title {
    font-weight: 600;
    color: var(--accent, #89b4fa);
}
.pb-close {
    background: none;
    border: none;
    color: var(--subtext, #a6adc8);
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 4px;
    line-height: 1;
}
.pb-libraries {
    display: flex;
    gap: 4px;
    padding: 0.5rem 0.75rem 0.25rem;
    flex-wrap: wrap;
}
.pb-lib-chip {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    cursor: pointer;
    background: var(--overlay, #11111b);
    border: 1px solid var(--border, #313244);
    color: var(--subtext, #a6adc8);
    user-select: none;
    transition: background 0.15s, color 0.15s;
}
.pb-lib-chip.active {
    background: #45475a;
    color: var(--text, #cdd6f4);
    border-color: var(--accent, #89b4fa);
    font-weight: 600;
}
.pb-lib-chip:hover {
    border-color: var(--accent, #89b4fa);
}
.pb-search {
    margin: 0.5rem 0.75rem;
    padding: 0.35rem 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--border, #313244);
    background: var(--overlay, #11111b);
    color: var(--text, #cdd6f4);
    font-size: 0.8rem;
    outline: none;
}
.pb-search:focus {
    border-color: var(--accent, #89b4fa);
}
.pb-filters {
    display: flex;
    gap: 4px;
    padding: 0 0.75rem 0.5rem;
    flex-wrap: wrap;
}
.pb-chip {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    cursor: pointer;
    background: var(--overlay, #11111b);
    border: 1px solid var(--border, #313244);
    color: var(--subtext, #a6adc8);
    user-select: none;
}
.pb-chip.active {
    background: var(--accent, #89b4fa);
    color: var(--bg, #1e1e2e);
    border-color: var(--accent, #89b4fa);
    font-weight: 600;
}
.pb-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 0.5rem;
}
.pb-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 6px;
    border-radius: 4px;
    cursor: pointer;
}
.pb-item:hover {
    background: var(--border, #313244);
}
.pb-item-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}
.pb-item-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text, #cdd6f4);
    font-size: 0.8rem;
}
.pb-item-meta {
    font-size: 0.65rem;
    color: var(--subtext, #a6adc8);
    flex-shrink: 0;
}
.pb-item-play {
    background: none;
    border: none;
    color: var(--accent, #89b4fa);
    cursor: pointer;
    font-size: 0.7rem;
    padding: 2px 4px;
    border-radius: 3px;
    opacity: 0.6;
    transition: opacity 0.15s, background 0.15s;
}
.pb-item-play:hover {
    opacity: 1;
    background: var(--border, #313244);
}
.pb-item.playing .pb-item-play {
    color: #a6e3a1;
    opacity: 1;
}
.pb-status {
    padding: 0.4rem 0.75rem;
    font-size: 0.7rem;
    color: var(--subtext, #a6adc8);
    border-top: 1px solid var(--border, #313244);
}
.pb-status-error {
    color: #f38ba8;
}
.pb-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 2rem 1rem;
    text-align: center;
}
.pb-error-icon {
    font-size: 2rem;
}
.pb-error-msg {
    font-size: 0.8rem;
    color: #f38ba8;
    word-break: break-word;
}
.pb-error-retry {
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid var(--accent, #89b4fa);
    background: transparent;
    color: var(--accent, #89b4fa);
    cursor: pointer;
    font-size: 0.75rem;
}
.pb-error-retry:hover {
    background: var(--accent, #89b4fa);
    color: var(--bg, #1e1e2e);
}
        `,document.head.appendChild(e)}}function ie(a){const e=document.createElement("span");return e.textContent=a,e.innerHTML}self.MonacoEnvironment={getWorker(a,e){return e==="json"?new Worker(new URL("/assets/json.worker-C838mOW9.js",import.meta.url),{type:"module"}):e==="css"||e==="scss"||e==="less"?new Worker(new URL("/assets/css.worker-NZNbQL3P.js",import.meta.url),{type:"module"}):e==="html"||e==="handlebars"||e==="razor"?new Worker(new URL("/assets/html.worker-eZJr__P7.js",import.meta.url),{type:"module"}):e==="typescript"||e==="javascript"?new Worker(new URL("/assets/ts.worker-BQK-3bkM.js",import.meta.url),{type:"module"}):new Worker(new URL("/assets/editor.worker-C2_AfrSl.js",import.meta.url),{type:"module"})}};const We=`// SongWalker Example — songwalker.net
const synth = Oscillator({type: 'triangle'});
track.beatsPerMinute = 140;

riff(synth);

track riff(inst) {
    track.instrument = inst;
    track.noteLength = 1/4;

    C4 /4
    E4 /4
    G4 /4
    C5 /2

    B4 /4
    G4 /4
    E4 /4
    C4 /2

    4
}
`,he="songwalker_source";function De(){return localStorage.getItem(he)||We}function X(a){localStorage.setItem(he,a)}function ue(){return"showOpenFilePicker"in window}async function je(){if(ue())try{const[a]=await window.showOpenFilePicker({types:[{description:"SongWalker files",accept:{"text/plain":[".sw"]}}]});return await(await a.getFile()).text()}catch{return null}else return new Promise(a=>{const e=document.createElement("input");e.type="file",e.accept=".sw,.txt",e.onchange=async()=>{const t=e.files?.[0];a(t?await t.text():null)},e.click()})}async function qe(a){if(ue())try{const t=await(await window.showSaveFilePicker({suggestedName:"song.sw",types:[{description:"SongWalker files",accept:{"text/plain":[".sw"]}}]})).createWritable();await t.write(a),await t.close()}catch{}else{const e=new Blob([a],{type:"text/plain"}),t=URL.createObjectURL(e),r=document.createElement("a");r.href=t,r.download="song.sw",r.click(),URL.revokeObjectURL(t)}}function He(a,e){const t=e.match(/\[(\d+):(\d+)\]/);if(!t)return;const r=a.getModel();if(!r)return;const n=parseInt(t[1],10),s=parseInt(t[2],10),o=r.getPositionAt(n),i=r.getPositionAt(s);V.setModelMarkers(r,"songwalker",[{severity:xe.Error,message:e.replace(/\s*\[\d+:\d+\]/,""),startLineNumber:o.lineNumber,startColumn:o.column,endLineNumber:i.lineNumber,endColumn:i.column}]),a.revealPositionInCenter(o)}function Ve(a){const e=a.getModel();e&&V.setModelMarkers(e,"songwalker",[])}function Ge(){j.register({id:N,extensions:[".sw"]}),j.setLanguageConfiguration(N,Me),j.setMonarchTokensProvider(N,Ne),V.defineTheme("songwalker-dark",Fe),j.registerCompletionItemProvider(N,{provideCompletionItems(a,e){const t=a.getWordUntilPosition(e),r={startLineNumber:e.lineNumber,startColumn:t.startColumn,endLineNumber:e.lineNumber,endColumn:t.endColumn};return{suggestions:Ue.map(n=>({...n,range:r}))}}})}class Ze{peakBarL;peakBarR;peakValueEl;spectrumCanvas;waveformCanvas;spectrumCtx;waveformCtx;rafId=null;player;freqData=null;timeData=null;constructor(e){this.player=e,this.peakBarL=document.getElementById("peak-bar-l"),this.peakBarR=document.getElementById("peak-bar-r"),this.peakValueEl=document.getElementById("peak-value"),this.spectrumCanvas=document.getElementById("spectrum-canvas"),this.waveformCanvas=document.getElementById("waveform-canvas"),this.spectrumCtx=this.spectrumCanvas.getContext("2d"),this.waveformCtx=this.waveformCanvas.getContext("2d")}start(){this.rafId===null&&this.tick()}stop(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.peakBarL.style.height="1px",this.peakBarR.style.height="1px",this.peakBarL.className="peak-bar",this.peakBarR.className="peak-bar",this.peakValueEl.textContent="-∞ dB",this.clearCanvas(this.spectrumCtx,this.spectrumCanvas),this.clearCanvas(this.waveformCtx,this.waveformCanvas)}drawWaveformOverview(){const e=this.player.renderedSamples;if(!e||e.length===0)return;const t=this.waveformCanvas,r=this.waveformCtx,n=window.devicePixelRatio||1,s=t.getBoundingClientRect();t.width=s.width*n,t.height=s.height*n,r.scale(n,n);const o=s.width,i=s.height;r.fillStyle="#11111b",r.fillRect(0,0,o,i);const l=Math.max(1,Math.floor(e.length/o));r.beginPath(),r.strokeStyle="#89b4fa",r.lineWidth=1;const h=i/2;for(let u=0;u<o;u++){const m=u*l;let w=0,E=0;for(let x=m;x<m+l&&x<e.length;x++){const v=e[x];v<w&&(w=v),v>E&&(E=v)}r.moveTo(u,h-E*h),r.lineTo(u,h-w*h)}r.stroke(),r.strokeStyle="#313244",r.lineWidth=.5,r.beginPath(),r.moveTo(0,h),r.lineTo(o,h),r.stroke()}tick=()=>{this.rafId=requestAnimationFrame(this.tick);const e=this.player.getAnalyser();!e||!this.player.isPlaying||((!this.freqData||this.freqData.length!==e.frequencyBinCount)&&(this.freqData=new Uint8Array(e.frequencyBinCount),this.timeData=new Uint8Array(e.fftSize)),e.getByteFrequencyData(this.freqData),e.getByteTimeDomainData(this.timeData),this.drawPeak(this.timeData),this.drawSpectrum(this.freqData),this.drawPlayhead())};drawPeak(e){let t=0,r=0;for(let h=0;h<e.length;h++){const u=(e[h]-128)/128;t+=u*u;const m=Math.abs(u);m>r&&(r=m)}const n=Math.sqrt(t/e.length),s=Math.min(n*3*100,100),o=Math.min(r*100,100);this.peakBarL.style.height=`${s}%`,this.peakBarR.style.height=`${o}%`;const i=(h,u)=>{h.className=u>95?"peak-bar clip":u>70?"peak-bar hot":"peak-bar"};i(this.peakBarL,s),i(this.peakBarR,o);const l=r>0?20*Math.log10(r):-1/0;this.peakValueEl.textContent=isFinite(l)?`${l.toFixed(1)} dB`:"-∞ dB"}drawSpectrum(e){const t=this.spectrumCanvas,r=this.spectrumCtx,n=window.devicePixelRatio||1,s=t.getBoundingClientRect();(t.width!==s.width*n||t.height!==s.height*n)&&(t.width=s.width*n,t.height=s.height*n),r.setTransform(n,0,0,n,0,0);const o=s.width,i=s.height;r.fillStyle="#11111b",r.fillRect(0,0,o,i);const l=Math.min(64,e.length),h=o/l;for(let u=0;u<l;u++){const m=Math.floor(Math.pow(e.length,u/l)),w=e[Math.min(m,e.length-1)]/255,E=w*i,x=200+u/l*40;r.fillStyle=`hsl(${x}, 70%, ${50+w*30}%)`,r.fillRect(u*h+.5,i-E,h-1,E)}}drawPlayhead(){const e=this.player.renderedSamples;if(!e||e.length===0)return;const t=this.player.getProgress();if(t<=0)return;const r=this.waveformCanvas,n=this.waveformCtx,s=r.getBoundingClientRect(),o=s.width,i=s.height;this.drawWaveformOverview(),n.fillStyle="rgba(137, 180, 250, 0.08)",n.fillRect(0,0,o*t,i);const l=o*t;n.strokeStyle="#f5e0dc",n.lineWidth=1.5,n.beginPath(),n.moveTo(l,0),n.lineTo(l,i),n.stroke()}clearCanvas(e,t){const r=window.devicePixelRatio||1,n=t.getBoundingClientRect();t.width=n.width*r,t.height=n.height*r,e.setTransform(r,0,0,r,0,0),e.fillStyle="#11111b",e.fillRect(0,0,n.width,n.height)}}class Ke{editor;decorations=[];events=[];player;rafId=null;constructor(e,t){this.editor=e,this.player=t}setEvents(e){this.events=(e?.events??[]).filter(t=>t.kind?.Note&&t.kind.Note.source_start!==void 0)}start(){this.rafId===null&&this.tick()}stop(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.clearDecorations()}tick=()=>{if(this.rafId=requestAnimationFrame(this.tick),!this.player.isPlaying)return;const e=this.player.getCurrentBeat(),t=this.editor.getModel();if(!t)return;const r=[];for(const n of this.events){const s=n.kind.Note,o=n.time,i=n.time+s.gate;if(e>=o&&e<i){const l=t.getPositionAt(s.source_start),h=t.getPositionAt(s.source_end);r.push({range:new le(l.lineNumber,l.column,h.lineNumber,h.column),options:{className:"note-playing",inlineClassName:"note-playing-inline"}})}}this.decorations=this.editor.deltaDecorations(this.decorations,r)};clearDecorations(){this.decorations=this.editor.deltaDecorations(this.decorations,[])}}async function Xe(){await Te();const a=document.getElementById("status-version");a&&(a.textContent=`core v${ke()}`);const e=new Ie;Ge();const t=document.createElement("style");t.textContent=`
        .note-playing {
            background-color: rgba(137, 180, 250, 0.15);
            border-radius: 2px;
        }
        .note-playing-inline {
            color: #f5e0dc !important;
            font-weight: bold;
        }
    `,document.head.appendChild(t);const r=document.getElementById("editor-container"),n=V.create(r,{value:De(),language:N,theme:"songwalker-dark",fontSize:14,fontFamily:"'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",lineNumbers:"on",minimap:{enabled:!1},scrollBeyondLastLine:!1,automaticLayout:!0,tabSize:4,insertSpaces:!0,wordWrap:"off",renderWhitespace:"none",cursorBlinking:"smooth",cursorSmoothCaretAnimation:"on",smoothScrolling:!0,padding:{top:16,bottom:16},bracketPairColorization:{enabled:!0},suggest:{showKeywords:!0,showSnippets:!0}});n.onDidChangeModelContent(()=>{X(n.getValue())});const s=new Ze(e),o=new Ke(n,e),i=document.getElementById("play-btn"),l=document.getElementById("stop-btn"),h=document.getElementById("open-btn"),u=document.getElementById("save-btn"),m=document.getElementById("export-btn"),w=document.getElementById("fullscreen-btn"),E=document.getElementById("preset-btn"),x=document.getElementById("song-select"),v=document.getElementById("status"),J=document.getElementById("status-errors"),Y=document.getElementById("status-warnings");function G(){J.textContent="",Y.textContent="",Ve(n)}function O(c){J.textContent=c,He(n,c)}function R(c){Y.textContent=c}function fe(c){const f=c?.events??[],p=[];for(const k of f)if(k.kind?.PresetRef?.name){const b=k.kind.PresetRef.name;p.includes(b)||p.push(b)}return p}const g=new ve("https://clevertree.github.io/songwalker-library"),pe=document.querySelector(".editor-wrapper"),Z=new ze(pe,g);function me(c){return c.replace(/[^a-zA-Z0-9\s]/g,"").trim().split(/\s+/).map((f,p)=>p===0?f.toLowerCase():f.charAt(0).toUpperCase()+f.slice(1).toLowerCase()).join("")}function Q(c){const f=g.findLibraryForEntry(c);return f?`${f}/${c.name}`:c.name}Z.onPresetSelect(c=>{const f=me(c.name),p=Q(c),k=`const ${f} = loadPreset("${p}");
`;n.getModel()&&(n.executeEdits("preset-browser",[{range:new le(1,1,1,1),text:k}]),n.setPosition({lineNumber:2,column:1}))}),Z.onPresetPlay(async c=>{try{if(R(`Loading ${c.name}…`),!g.getAudioContext()){const y=new AudioContext({sampleRate:44100});g.setAudioContext(y)}const f=Q(c),p=await g.loadPreset(f);let k;if(p.node?.type==="sampler"&&p.node.config){const y=p.node.config,P=g.findLibraryForEntry(c),T=g.resolvePresetUrl(c.path,P),A=await g.decodeSamplerZones(y,T),z=[];for(const C of y.zones){const W=A.get(C);if(!W)continue;const D=W.getChannelData(0);z.push({keyRangeLow:C.keyRange?.low??0,keyRangeHigh:C.keyRange?.high??127,rootNote:C.pitch.rootNote,fineTuneCents:C.pitch.fineTuneCents,sampleRate:C.sampleRate,loopStart:C.loopPoints?.start??null,loopEnd:C.loopPoints?.end??null,samples:Array.from(D)})}k=JSON.stringify([{name:f,isDrumKit:y.oneShot??!1,zones:z}])}const b=`
const inst = loadPreset("${f}");
track.beatsPerMinute = 120;
track.instrument = inst;
track.noteLength = 1/4;
C4 E4 G4 C5 /2
`;R("Playing preview…"),await e.playSource(b.trim(),k),s.start()}catch(f){O(`Preview failed: ${f}`)}});async function ee(){G();try{const c=n.getValue(),f=ae(c);o.setEvents(f);const p=fe(f);let k;if(p.length>0)try{if(R(`Loading ${p.length} preset(s)…`),!g.getAudioContext()){const y=new AudioContext({sampleRate:44100});g.setAudioContext(y)}await g.preloadAll(p);const b=[];for(const y of p)try{const P=await g.loadPreset(y);if(P.node?.type==="sampler"&&P.node.config){const T=P.node.config,A=g.search({name:y})[0],z=A?g.findLibraryForEntry(A):void 0,C=A?g.resolvePresetUrl(A.path,z):void 0,W=await g.decodeSamplerZones(T,C),D=[];for(const L of T.zones){const te=W.get(L);if(!te)continue;const ye=te.getChannelData(0);D.push({keyRangeLow:L.keyRange?.low??0,keyRangeHigh:L.keyRange?.high??127,rootNote:L.pitch.rootNote,fineTuneCents:L.pitch.fineTuneCents,sampleRate:L.sampleRate,loopStart:L.loopPoints?.start??null,loopEnd:L.loopPoints?.end??null,samples:Array.from(ye)})}b.push({name:y,isDrumKit:T.oneShot??!1,zones:D})}}catch(P){console.warn(`[Player] Failed to load preset "${y}":`,P)}b.length>0?(k=JSON.stringify(b),R(`Loaded ${b.length} preset(s)`)):R("")}catch(b){console.warn("[Player] Preset loading failed, falling back to oscillators:",b),R(`⚠ Preset loading failed: ${b}. Using default oscillator.`)}e.playSource(c,k).then(()=>{s.drawWaveformOverview(),s.start(),o.start()})}catch(c){const f=String(c);O(f)}}async function ge(c){try{v.textContent=`Loading ${c}…`;const f=await fetch(`/songs/${c}.sw`);if(!f.ok)throw new Error(`Failed to load ${c}: ${f.status}`);const p=await f.text();n.setValue(p),X(p),v.textContent="Ready",G()}catch(f){v.textContent="Ready",O(String(f))}}x.addEventListener("change",()=>{const c=x.value;c&&(ge(c),x.value="")});function be(){G();try{const c=n.getValue();ae(c),e.exportWav(c)}catch(c){const f=String(c);O(f)}}i.addEventListener("click",ee),l.addEventListener("click",()=>{e.stop(),s.stop(),o.stop()}),h.addEventListener("click",async()=>{const c=await je();c!==null&&(n.setValue(c),X(c))}),u.addEventListener("click",()=>qe(n.getValue())),m.addEventListener("click",be),w.addEventListener("click",()=>{document.documentElement.classList.toggle("fullscreen"),setTimeout(()=>n.layout(),100)}),E.addEventListener("click",()=>{Z.toggle()}),n.addAction({id:"songwalker.play",label:"Play Song",keybindings:[we.CtrlCmd|re.Enter],run:()=>ee()}),n.addAction({id:"songwalker.exitFullscreen",label:"Exit Fullscreen",keybindings:[re.Escape],precondition:void 0,run:()=>{document.documentElement.classList.remove("fullscreen"),setTimeout(()=>n.layout(),100)}}),e.onState(c=>{c.playing?v.textContent=`▶ ${c.currentBeat.toFixed(1)} / ${c.totalBeats.toFixed(1)}  @${c.bpm} BPM`:(v.textContent=c.totalBeats>0?`${c.totalBeats.toFixed(1)} beats  @${c.bpm} BPM`:"Ready",s.stop(),o.stop())}),n.focus()}Xe().catch(console.error);
