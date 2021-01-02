import React from "react";
import Rete from "rete";

import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import { ComponentInt, ComponentOutput, ComponentRGB } from "./nodes/NodeComponents";
// import AreaPlugin from "rete-area-plugin";

export class NodeEditor extends React.Component
{
	containerRef: React.RefObject<HTMLDivElement>;

	constructor(props: any)
	{
		super(props);

		this.containerRef = React.createRef();
	}

	async componentDidMount()
	{

		if (this.containerRef.current === null)
			return;

		const components = [new ComponentOutput(), new ComponentInt(), new ComponentRGB()];

		const editor = new Rete.NodeEditor("Wall@0.1.0", this.containerRef.current);
		editor.use(ConnectionPlugin);
		editor.use(ReactRenderPlugin);

		const engine = new Rete.Engine("Wall@0.1.0");

		components.forEach(c =>
		{
			editor.register(c);
			engine.register(c);
		});

		const root = await components[0].createNode({ r: 200, g: 123, b: 10 });

		const n1 = await components[1].createNode({ num: 2 });
		const n2 = await components[1].createNode({ num: 3 });
		const rgb = await components[2].createNode({ r: 200, g: 123, b: 10 });

		n1.position = [80, 200];
		n2.position = [80, 400];
		// add.position = [500, 240];

		editor.addNode(root);

		editor.addNode(n1);
		editor.addNode(n2);
		editor.addNode(rgb);

		// editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
		// editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

		editor.on(
			//@ts-ignore
			"process nodecreated noderemoved connectioncreated connectionremoved",
			async () =>
			{
				console.log("process");
				await engine.abort();
				await engine.process(editor.toJSON());
			}
		);

		editor.view.resize();
		editor.trigger("process");
		// AreaPlugin.zoomAt(editor, editor.nodes);
	}

	render()
	{
		return (
			<div ref={this.containerRef}></div>
		)
	}
}

export default NodeEditor;
