import React from "react";
import Rete from "rete";
import { NodeEditor as ReteNodeEditor } from "rete"
import './NodeEditor.scss'

import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import DockPlugin from 'rete-dock-plugin';

import { ComponentInt, ComponentOutput, ComponentRGB } from "./nodes/NodeComponents";
import { Save } from "react-feather";
// import AreaPlugin from "rete-area-plugin";

export class NodeEditor extends React.Component
{
	containerRef: React.RefObject<HTMLDivElement>;
	dockRef: React.RefObject<HTMLDivElement>;

	editor!: ReteNodeEditor;

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

		const components = [new ComponentOutput(), new ComponentInt(), new ComponentRGB()];

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

		const root = await components[0].createNode();

		const n1 = await components[1].createNode({ num: 2 });
		const n2 = await components[1].createNode({ num: 3 });
		const rgb = await components[2].createNode({ rgb: { r: 200, g: 123, b: 10 } });

		root.position = [this.containerRef.current.clientWidth - 200, 200];

		n1.position = [80, 200];
		n2.position = [80, 400];


		this.editor.addNode(root);

		this.editor.addNode(n1);
		this.editor.addNode(n2);
		this.editor.addNode(rgb);

		// editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
		// editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

		this.editor.on(
			//@ts-ignore
			"process nodecreated noderemoved connectioncreated connectionremoved",
			async () =>
			{
				console.log("process");
				await engine.abort();
				await engine.process(this.editor.toJSON());
			}
		);

		this.editor.view.resize();
		this.editor.trigger("process");
		// AreaPlugin.zoomAt(editor, editor.nodes);
	}

	save()
	{
		console.log(this.editor.toJSON());
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
