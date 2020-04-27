import { writable, readable } from "svelte/store";

import { id } from '../utils/utils'

import gridHelp from "svelte-grid/build/helper/index.mjs";

import ModelEditor from "../components/editors/ModelEditor.svelte";
import GrammarEditor from "../components/editors/GrammarEditor.svelte";
import LiveCodeEditor from "../components/editors/LiveCodeEditor.svelte";
import LiveCodeParseOutput from "../components/widgets/LiveCodeParseOutput.svelte";
import GrammarCompileOutput from "../components/widgets/GrammarCompileOutput.svelte";
import Analyser from "../components/widgets/Analyser.svelte";
import StoreDebugger from "../components/widgets/StoreDebugger.svelte";

let liveCode = "";
let modelCode = "";
let grammarCode = "";

const originalItems = [
	{
		...gridHelp.item({ x: 0, y: 0, w: 6, h: 7, id: id() }),
		...{
			type: "liveCodeEditor",
			name: "hello-world",
			background: "#151515",
			lineNumbers: true,
			hasFocus: false,
			background: "#151515",
			theme: "icecoder",
			component: LiveCodeEditor,
			data: liveCode,
		},
	},

	{
		...gridHelp.item({ x: 6, y: 0, w: 3, h: 2, id: id() }),
		...{
			name: "hello world",
			type: "analyser",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#f0f0f0",
			component: Analyser,
			mode: "both",
		},
	},

	{
		...gridHelp.item({ x: 9, y: 0, w: 18, h: 3, id: id() }),
		...{
			name: "hello world",
			type: "modelEditor",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#f0f0f0",
			component: ModelEditor,
			data: modelCode,
		},
	},

	{
		...gridHelp.item({ x: 6, y: 2, w: 3, h: 5, id: id() }),
		...{
			name: "hello world",
			type: "liveCodeParseOutput",
			lineNumbers: false,
			hasFocus: false,
			theme: "shadowfox",
			background: "#ebdeff",
			component: LiveCodeParseOutput,
			data: "",
		},
	},

	{
		...gridHelp.item({ x: 9, y: 3, w: 15, h: 3, id: id() }),
		...{
			name: "hello world",
			type: "grammarEditor",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#AAAAAA",
			component: GrammarEditor,
			data: grammarCode,
		},
	},

	{
		...gridHelp.item({ x: 7, y: 7, w: 4, h: 30, id: id() }),
		...{
			name: "hello world",
			type: "storeDebugger",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#f0f0f0",
			component: StoreDebugger,
			data: "",
		},
	},

	{
		...gridHelp.item({ x: 9, y: 6, w: 18, h: 1, id: id() }),
		...{
			name: "hello world",
			type: "grammarCompileOutput",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#d1d5ff",
			component: GrammarCompileOutput,
			data: "",
		},
	},
];

const testItems = [
	{
		...gridHelp.item({ x: 7, y: 0, w: 2, h: 1, id: id() }),
		...{
			type: "liveCodeEditor",
			name: "hello-world",
			background: "#151515",
			lineNumbers: true,
			hasFocus: false,
			background: "#151515",
			theme: "icecoder",
			component: LiveCodeEditor,
			data: "#lc-1",
		},
	},

	{
		...gridHelp.item({ x: 10, y: 2, w: 2, h: 1, id: id() }),
		...{
			name: "hello world",
			type: "grammarEditor",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#AAAAAA",
			component: GrammarEditor,
			data: "#g-1",
		},
	},

	{
		...gridHelp.item({ x: 0, y: 4, w: 3, h: 1, id: id() }),
		...{
			name: "hello world",
			type: "modelEditor",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#f0f0f0",
			component: ModelEditor,
			data: "//m-1\nsema.env.saveLocal('1')",
		},
	},

	{
		...gridHelp.item({ x: 0, y: 8, w: 1, h: 1, id: id() }),
		...{
			name: "hello world",
			type: "analyser",
			lineNumbers: true,
			hasFocus: false,
			theme: "monokai",
			background: "#f0f0f0",
			component: Analyser,
			mode: "spectrogram",
			data: "1",
		},
	},
];



export let hydrateJSONcomponent = (item) => {
	if (item != undefined) {
		switch (item.type) {
			case "liveCodeEditor":
				item.component = LiveCodeEditor;
				break;
			case "grammarEditor":
				item.component = GrammarEditor;
				break;
			case "modelEditor":
				item.component = ModelEditor;
				break;
			case "liveCodeParseOutput":
				item.component = LiveCodeParseOutput;
				break;
			case "grammarCompileOutput":
				item.component = GrammarCompileOutput;
				break;
			case "storeDebugger":
				item.component = StoreDebugger;
				break;
			case "analyser":
				item.component = Analyser;
				break;
			default:
				item.component = StoreDebugger;
				break;
		}
		item.id = id();
		item.name = item.name + item.id;
		return item;
	} else {
		createNewItem();
	}
};



/*
 * Wraps writable store a
 */
export function storable(key, initialValue) {

	const store = writable(initialValue); // create an underlying store
	const { subscribe, set, update } = store;

	const json = localStorage.getItem(key); // get the last value from localStorage
	if (json) {
    // set( JSON.parse(json));
		set( JSON.parse(json).map( item => hydrateJSONcomponent(item) ) ); // use the value from localStorage if it exists
	}

	// return an object with the same interface as Svelte's writable() store interface
	return {
		set(value) {
			localStorage.setItem(key, JSON.stringify(value));
			set(value); // capture set and write to localStorage
		},

		update(cb) {
			const value = cb(get(store)); // passes items to callback for invocation e.g items => items.concat(new)
			this.set(value); // capture updates and write to localStore
		},

		get() {
			return localStorage.getItem(key);
		},

		// hydrate(newItems) {
		// 	set( newItems.map( item => hydrateJSONcomponent(item) ) ); 
		// },

		subscribe // punt subscriptions to underlying store
	};
}


export const tutorials = writable([]);

// Store for SELECTED tutorial options in Sidebar component
export const currentTutorial = writable("");

export const items = storable("tutorial", testItems); // localStorageWrapper
