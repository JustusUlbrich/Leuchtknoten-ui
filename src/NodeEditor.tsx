import React from "react";
import Rete from "rete";
import { NodeEditor as ReteNodeEditor } from "rete"
import './NodeEditor.scss'

import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import DockPlugin from 'rete-dock-plugin';

import { clearTimeout, setTimeout } from 'timers';

import { ComponentMath, ComponentGradient, ComponentInt, ComponentLookup, ComponentOutput, ComponentRGB, ComponentTrigo, ComponentMix, ComponentMathAdv, ComponentSetHSV, ComponentBool, ComponentAnimNumber, ComponentMidi, ComponentNoise, ComponentSwitch, ComponentArray } from "./nodes/NodeComponents";
import { Save } from "react-feather";
import AreaPlugin from "rete-area-plugin";
import KeyboardPlugin from 'rete-keyboard-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { useLocation } from "react-router-dom";

const NodeCategories = [
	{ name: "output", nodes: ["Output"] },
	{ name: "color", nodes: ["Mix", "RGB", "SetHSV", "Gradient"] },
	{ name: "math", nodes: ["Number", "Trigo", "AnimNumber", "Math", "MathAdv"] },
	{ name: "random", nodes: ["Noise"] },
	{ name: "utility", nodes: ["Lookup"] },
	{ name: "trigger", nodes: ["Midi", "Bool"] },
];

interface NodeUpdate
{
	NodeId: string,
	Data: any;
}

export interface EditorProps
{
	search?: string;
}

export function NodeEditor(props: EditorProps)
{
	let location = useLocation();
	// useEffect(() => { }, [props.location]);
	console.log(location);

	return <NodeEditorComp
		key={location?.search || ""}
		search={location.search}
	/>;
}

export function EditorMenu(props: { editor: ReteNodeEditor, handleImport: () => void, handleExport: () => void })
{
	const onNodeClick = (node: string) => props.editor.getComponent(node)?.createNode().then(n =>
	{
		props.editor.addNode(n);
	});

	const NodeSubmenu = (category: string, nodes: string[]) =>
	(
		<div className={"dropdown " + category}>
			<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				{category}
			</button>
			<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
				{nodes.map(n =>
					<button key={n} onClick={() => onNodeClick(n)} className="dropdown-item btn btn-secondary">{n}</button>
				)}
			</div>
		</div>
	);

	const ShareSubmenu = () =>
	(
		<div className={"dropdown share"}>
			<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				Share
			</button>
			<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
				<button onClick={props.handleImport} className="dropdown-item btn btn-secondary">Import</button>
				<button onClick={props.handleExport} className="dropdown-item btn btn-secondary">Export</button>
			</div>
		</div>
	);

	return (
		<div style={{ display: "flex" }}>
			<ShareSubmenu />
			{NodeCategories.map(nc => NodeSubmenu(nc.name, nc.nodes))}
		</div>
	);
}

class NodeEditorComp extends React.Component<EditorProps>
{
	containerRef: React.RefObject<HTMLDivElement>;
	dockRef: React.RefObject<HTMLDivElement>;
	hiddenImportInput: React.RefObject<HTMLInputElement>;

	state: { editor?: ReteNodeEditor, networkName: string } = {
		editor: undefined,
		networkName: ""
	}

	saveTimeout?: NodeJS.Timeout;
	updateTimeout?: NodeJS.Timeout;

	constructor(props: EditorProps)
	{
		super(props);

		const name = this.getNetworkNameFromUrl(props.search || "");
		this.state = { editor: undefined, networkName: name };

		console.log("Name: " + this.state.networkName);

		this.containerRef = React.createRef();
		this.dockRef = React.createRef();
		this.hiddenImportInput = React.createRef();
	}

	getNetworkNameFromUrl(url: string): string
	{
		const matches = url.match(/name=([^&]*)/);
		return matches?.[1] || "";
	}

	async componentDidMount()
	{
		if (this.containerRef.current === null
			|| this.containerRef.current.parentElement === null
			|| this.dockRef.current === null)
			return;

		const components = [
			new ComponentOutput(),
			new ComponentLookup(),
			new ComponentBool(),
			new ComponentMidi(),
			new ComponentAnimNumber(),
			new ComponentInt(),
			new ComponentMath(),
			new ComponentMathAdv(),
			new ComponentTrigo(),
			new ComponentNoise(),
			new ComponentMix(),
			new ComponentRGB(),
			new ComponentSetHSV(),
			new ComponentGradient(),
			new ComponentSwitch(),
			new ComponentArray(),
		];

		const editor = new Rete.NodeEditor("Wall@0.1.0", this.containerRef.current);
		editor.use(ConnectionPlugin);
		editor.use(ReactRenderPlugin);
		editor.use(DockPlugin,
			//@ts-ignore
			{
				container: this.dockRef.current,
				plugins: [ReactRenderPlugin],
			});
		editor.use(KeyboardPlugin)
		editor.use(ContextMenuPlugin, {
			searchBar: true,
			delay: 100,
		});

		const background = document.createElement('div');
		background.classList.add('background');
		editor.use(AreaPlugin, { background })

		const engine = new Rete.Engine("Wall@0.1.0");

		components.forEach(c =>
		{
			editor.register(c);
			engine.register(c);
		});

		// Add root node
		const root = await components[0].createNode();
		root.position = [this.containerRef.current.clientWidth - 200, 200];
		editor.addNode(root);

		// Handle update events on node network
		editor.on(
			//@ts-ignore
			"nodecreated noderemoved connectioncreated connectionremoved",
			async () =>
			{
				if (!this.state.editor)
					return;

				await engine.abort();
				await engine.process(this.state.editor.toJSON());

				if (this.saveTimeout)
					clearTimeout(this.saveTimeout);
				this.saveTimeout = setTimeout(() => this.updateAll(), 500);
			}
		);

		editor.on(
			//@ts-ignore
			"process",
			async (args: any) =>
			{
				if (this.updateTimeout)
					clearTimeout(this.updateTimeout);
				this.updateTimeout = setTimeout(() => this.update(args as NodeUpdate), 50);
			}
		);

		editor.on('zoom', ({ source }) =>
		{
			return source !== 'dblclick';
		});

		editor.view.resize();
		editor.trigger("process");
		// AreaPlugin.zoomAt(editor, editor.nodes);

		const url = process.env.REACT_APP_BASE_URL + '/api/nodeload?name=' + this.state.networkName;
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch(url, requestOptions)
			.then(response => response.json())
			.then(data => { console.log(data); return data; })
			.then(data => editor.fromJSON(data));


		this.setState({ editor });
	}

	updateAll()
	{
		if (!this.state.editor)
			return;

		console.log(this.state.editor.toJSON());

		const url = process.env.REACT_APP_BASE_URL + '/api/node';
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(this.state.editor.toJSON())
		};
		fetch(url, requestOptions)
			.then(response => console.log(response));
	}

	update(node: NodeUpdate)
	{
		const url = process.env.REACT_APP_BASE_URL + '/api/nodeupdate';
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(node)
		};
		fetch(url, requestOptions)
			.then(response => console.log(response));
	}

	store(): Promise<void>
	{
		if (!this.state.editor)
			return Promise.resolve();

		console.log(this.state.editor.toJSON());

		const name = window.prompt("Name", this.state.networkName)?.toLowerCase().replace(" ", "") ?? "";
		this.setState({ networkName: name });

		const url = process.env.REACT_APP_BASE_URL + '/api/nodestore';
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, network: this.state.editor.toJSON() })
		};

		return fetch(url, requestOptions)
			.then(response => console.log(response));
	}

	handleImport()
	{
		console.log("import");
		this.hiddenImportInput?.current?.click();
	}

	async handleImportFileChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		if (event.target?.files)
		{
			const fileUploaded = event.target?.files[0]

			if (fileUploaded)
			{
				const t = await fileUploaded.text();
				this.state.editor?.fromJSON(JSON.parse(t));
			}
		}
	}

	async handleExport()
	{
		const blob = new Blob([JSON.stringify(this.state.editor?.toJSON())], { type: 'application/json' });
		const href = await URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = this.state.networkName + ".json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	render()
	{
		return (
			<div className="node-editor">
				<input type="file" ref={this.hiddenImportInput} onChange={event => this.handleImportFileChange(event)} style={{ display: 'none' }} />
				<div className="node-menu">{this.state.editor ?
					<EditorMenu
						editor={this.state.editor}
						handleImport={() => this.handleImport()}
						handleExport={() => this.handleExport()}
					/> : ""}
				</div>
				<div ref={this.containerRef}></div>
				<div className="dock">
					<div className="dock-container">
						<div className="dock-items" ref={this.dockRef}></div>
						<div className="actions">
							<button type="button" className="btn btn-sm btn-primary" onClick={() => this.store()}>
								<Save />
									Speichern
						</button>
						</div>
					</div>
				</div>

			</div>
		)
	}
}
