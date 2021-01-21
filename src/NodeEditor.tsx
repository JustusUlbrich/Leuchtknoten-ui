import React from "react";
import Rete from "rete";
import { NodeEditor as ReteNodeEditor } from "rete"
import './NodeEditor.scss'

import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import DockPlugin from 'rete-dock-plugin';

import { clearTimeout, setTimeout } from 'timers';

import { ComponentMath, ComponentGradient, ComponentInt, ComponentLookup, ComponentOutput, ComponentRGB, ComponentTrigo } from "./nodes/NodeComponents";
import { Save } from "react-feather";
// import AreaPlugin from "rete-area-plugin";

export class NodeEditor extends React.Component
{
	containerRef: React.RefObject<HTMLDivElement>;
	dockRef: React.RefObject<HTMLDivElement>;

	editor!: ReteNodeEditor;

	saveTimeout?: NodeJS.Timeout;

	constructor(props: any)
	{
		super(props);

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
			new ComponentInt(),
			new ComponentMath(),
			new ComponentLookup(),
			new ComponentTrigo(),
			new ComponentRGB(),
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
			"process nodecreated noderemoved connectioncreated connectionremoved",
			async () =>
			{
				await engine.abort();
				await engine.process(this.editor.toJSON());

				if (this.saveTimeout)
					clearTimeout(this.saveTimeout);
				this.saveTimeout = setTimeout(() => this.save(), 500);
			}
		);

		this.editor.view.resize();
		this.editor.trigger("process");
		// AreaPlugin.zoomAt(editor, editor.nodes);
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
			.then(response => console.log(response))
		// .then(data => this.setState({ postId: data.id }));
	}

	render()
	{
		return (

			<div className="node-editor">
				<div ref={this.containerRef}></div>
				<div className="dock">
					<div ref={this.dockRef}></div>
					<div className="actions">
						<button type="button" className="btn btn-sm btn-primary" onClick={() => this.save()}>
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
