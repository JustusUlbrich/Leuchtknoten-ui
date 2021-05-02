import React from "react";
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

interface NodeUpdate
{
	NodeId: string,
	Data: any;
}

export class NodeEditor extends React.Component
{
	containerRef: React.RefObject<HTMLDivElement>;
	dockRef: React.RefObject<HTMLDivElement>;

	editor!: ReteNodeEditor;

	saveTimeout?: NodeJS.Timeout;
	updateTimeout?: NodeJS.Timeout;

	networkName: string;

	constructor(props: any)
	{
		super(props);
		this.networkName = props.match?.params?.name ?? "";

		this.containerRef = React.createRef();
		this.dockRef = React.createRef();
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
			new ComponentMix(),
			new ComponentRGB(),
			new ComponentSetHSV(),
			new ComponentGradient(),
		];

		this.editor = new Rete.NodeEditor("Wall@0.1.0", this.containerRef.current);
		this.editor.use(ConnectionPlugin);
		this.editor.use(ReactRenderPlugin);
		this.editor.use(DockPlugin,
			//@ts-ignore
			{
				container: this.dockRef.current,
				plugins: [ReactRenderPlugin],
			});
		this.editor.use(KeyboardPlugin)
		this.editor.use(ContextMenuPlugin, {
			searchBar: true,
			delay: 100,
		});

		const background = document.createElement('div');
		background.classList.add('background');
		this.editor.use(AreaPlugin, { background })

		const engine = new Rete.Engine("Wall@0.1.0");

		components.forEach(c =>
		{
			this.editor.register(c);
			engine.register(c);
		});

		// Add root node
		const root = await components[0].createNode();
		root.position = [this.containerRef.current.clientWidth - 200, 200];
		this.editor.addNode(root);

		// Handle update events on node network
		this.editor.on(
			//@ts-ignore
			"nodecreated noderemoved connectioncreated connectionremoved",
			async () =>
			{
				await engine.abort();
				await engine.process(this.editor.toJSON());

				if (this.saveTimeout)
					clearTimeout(this.saveTimeout);
				this.saveTimeout = setTimeout(() => this.save(), 500);
			}
		);

		this.editor.on(
			//@ts-ignore
			"process",
			async (args: any) =>
			{
				if (this.updateTimeout)
					clearTimeout(this.updateTimeout);
				this.updateTimeout = setTimeout(() => this.update(args as NodeUpdate), 50);
			}
		);

		this.editor.on('zoom', ({ source }) =>
		{
			return source !== 'dblclick';
		});

		this.editor.view.resize();
		this.editor.trigger("process");
		// AreaPlugin.zoomAt(editor, editor.nodes);

		{
			const url = process.env.REACT_APP_BASE_URL + '/api/nodeload?name=' + this.networkName;
			const requestOptions = {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			};

			fetch(url, requestOptions)
				.then(response => response.json())
				.then(data => { console.log(data); return data; })
				.then(data => this.editor.fromJSON(data));
		}

	}

	save()
	{
		console.log(this.editor.toJSON());

		const url = process.env.REACT_APP_BASE_URL + '/api/node';
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(this.editor.toJSON())
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
		console.log(this.editor.toJSON());

		this.networkName = window.prompt("Name", this.networkName)?.toLowerCase().replace(" ", "") ?? "";

		const url = process.env.REACT_APP_BASE_URL + '/api/nodestore';
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: this.networkName, network: this.editor.toJSON() })
		};
		fetch(url, requestOptions)
			.then(response => console.log(response));
	}

	render()
	{
		return (

			<div className="node-editor">
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

export default NodeEditor;
