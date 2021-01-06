import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ControlGradient } from "./ControlGradient";
import { ControlInt } from "./ControlInt";
import { ControlRGB } from "./ControlRGB";

var numSocket = new Rete.Socket("Number");
var floatSocket = new Rete.Socket("Float");
var rgbSocket = new Rete.Socket("RGB");

export class ComponentInt extends Rete.Component
{
	constructor()
	{
		super("Number");
	}

	async builder(node: Node)
	{
		var out1 = new Rete.Output("num", "Number", numSocket);
		var ctrl = new ControlInt(this.editor, "num", node);

		node.addControl(ctrl).addOutput(out1);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		outputs["num"] = node.data.num;
	}
}

export class ComponentRGB extends Rete.Component
{
	constructor()
	{
		super("RGB");
	}

	async builder(node: Node)
	{
		var out1 = new Rete.Output("rgb", "RGB", rgbSocket);
		var ctrl = new ControlRGB(this.editor, "rgb", node);

		node.addControl(ctrl).addOutput(out1);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		outputs["rgb"] = node.data.rgb;
	}
}

export class ComponentGradient extends Rete.Component
{
	constructor()
	{
		super("Gradient");
	}

	async builder(node: Node)
	{
		var in1 = new Rete.Input("f", "scale", floatSocket);
		var out1 = new Rete.Output("rgb", "RGB", rgbSocket);
		var ctrl = new ControlGradient(this.editor, "gradient", node);

		node.addInput(in1).addControl(ctrl).addOutput(out1);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		outputs["rgb"] = node.data.rgb;
	}
}

export class ComponentLookup extends Rete.Component
{
	constructor()
	{
		super("Lookup");
	}

	async builder(node: Node)
	{
		var out1 = new Rete.Output("nodeid", "NodeId", numSocket);
		var out2 = new Rete.Output("numleds", "NumLeds", numSocket);

		node.addOutput(out1).addOutput(out2);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["rgb"] = node.data.rgb;
	}
}
export class ComponentOutput extends Rete.Component
{
	constructor()
	{
		super("Output");
	}

	async builder(node: Node)
	{
		var in1 = new Rete.Input("rgb", "RGB", rgbSocket);

		node.addInput(in1);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["rgb"] = inputs["rgb"];
	}
}

