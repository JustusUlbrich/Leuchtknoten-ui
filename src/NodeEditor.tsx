import React, { useEffect } from "react";
import Rete from "rete";
import { NodeEditor as ReteNodeEditor } from "rete"
import './NodeEditor.scss'

import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import DockPlugin from 'rete-dock-plugin';

import { clearTimeout, setTimeout } from 'timers';

import { ComponentMath, ComponentGradient, ComponentInt, ComponentLookup, ComponentOutput, ComponentRGB, ComponentTrigo, ComponentMix, ComponentMathAdv, ComponentSetHSV, ComponentBool, ComponentAnimNumber, ComponentMidi } from "./nodes/NodeComponents";
import { Save } from "react-feather";
import AreaPlugin from "rete-area-plugin";
import KeyboardPlugin from 'rete-keyboard-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';

const NodeCategories = [
	{ name: "output", nodes: ["Output"] },
	{ name: "color", nodes: ["Mix", "RGB", "SetHSV", "Gradient"] },
	{ name: "math", nodes: ["Number", "Trigo", "AnimNumber", "Math", "MathAdv"] },
	{ name: "utility", nodes: ["Lookup"] },
	{ name: "trigger", nodes: ["Midi", "Bool"] },
];

interface NodeUpdate
{
	NodeId: string,
	Data: any;
}

export function NodeEditor(props: any)
{
	console.log(props);

	useEffect(() => { }, [props.match?.params?.name]);

	return <NodeEditorComp key={props.match.params.name} {...props} />;
}

export function EditorMenu(props: { editor: ReteNodeEditor })
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

	return (
		<div style={{ display: "flex" }}>
			{NodeCategories.map(nc => NodeSubmenu(nc.name, nc.nodes))}
		</div>
	);
}

class NodeEditorComp extends React.Component
{
	containerRef: React.RefObject<HTMLDivElement>;
	dockRef: React.RefObject<HTMLDivElement>;

	state: { editor?: ReteNodeEditor, networkName: string } = {
		editor: undefined,
		networkName: ""
	}

	saveTimeout?: NodeJS.Timeout;
	updateTimeout?: NodeJS.Timeout;

	constructor(props: any)
	{
		super(props);
		this.setState({ networkName: props.match?.params?.name ?? "" });

		this.containerRef = React.createRef();
		this.dockRef = React.createRef();
	}

	/* 	async componentDidUpdate()
		{
			// this.componentDidMount();
		} */

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
			new ComponentMix(),
			new ComponentRGB(),
			new ComponentSetHSV(),
			new ComponentGradient(),
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

		{
			const url = process.env.REACT_APP_BASE_URL + '/api/nodeload?name=' + this.state.networkName;
			const requestOptions = {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			};

			fetch(url, requestOptions)
				.then(response => response.json())
				.then(data => { console.log(data); return data; })
				.then(data => editor.fromJSON(data));
		}

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

	store()
	{
		if (!this.state.editor)
			return;

		console.log(this.state.editor.toJSON());

		this.setState({ networkName: window.prompt("Name", this.state.networkName)?.toLowerCase().replace(" ", "") ?? "" });

		const url = process.env.REACT_APP_BASE_URL + '/api/nodestore';
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: this.state.networkName, network: this.state.editor.toJSON() })
		};
		fetch(url, requestOptions)
			.then(response => console.log(response));
	}

	render()
	{
		return (
			<div className="node-editor">
				<div className="node-menu">{this.state.editor ? <EditorMenu editor={this.state.editor} /> : ""}</div>
				<div ref={this.containerRef}></div>
				<div className="dock">
					<div ref={this.dockRef}></div>
					<div className="actions">
						<button type="button" className="btn btn-sm btn-primary" onClick={() => this.store()}>
							<Save />
									Speichern
						</button>
					</div>
				</div>

			</div>
		)
	}
}
