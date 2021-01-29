import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ControlGradient } from "./ControlGradient";
import { ControlFloat } from "./ControlFloat";
import { ControlRGB } from "./ControlRGB";

var numSocket = new Rete.Socket("Number");
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
		var ctrl = new ControlFloat(this.editor, "num", node);

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
		var in1 = new Rete.Input("scale", "Scale", numSocket);
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

export class ComponentMath extends Rete.Component
{
	constructor()
	{
		super("Math");
	}

	async builder(node: Node)
	{
		var in1 = new Rete.Input("in1", "In1", numSocket);
		var in2 = new Rete.Input("in2", "In2", numSocket);
		var out1 = new Rete.Output("add", "+", numSocket);
		var out2 = new Rete.Output("sub", "-", numSocket);
		var out3 = new Rete.Output("mul", "*", numSocket);
		var out4 = new Rete.Output("div", "/", numSocket);

		node.addInput(in1).addInput(in2)
			.addOutput(out1).addOutput(out2).addOutput(out3).addOutput(out4);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		//	outputs["out"] = node.data.Z;
	}
}

export class ComponentMathAdv extends Rete.Component
{
	constructor()
	{
		super("MathAdv");
	}

	async builder(node: Node)
	{
		var in1 = new Rete.Input("in1", "In1", numSocket);
		var in2 = new Rete.Input("in2", "In2", numSocket);
		var out1 = new Rete.Output("step", "Step", numSocket);
		var out2 = new Rete.Output("mod", "Modulo", numSocket);

		node.addInput(in1).addInput(in2)
			.addOutput(out1).addOutput(out2);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		//	outputs["out"] = node.data.Z;
	}
}

export class ComponentMix extends Rete.Component
{
	constructor()
	{
		super("Mix");
	}

	async builder(node: Node)
	{
		var c1 = new Rete.Input("c1", "Color1", rgbSocket);
		var c2 = new Rete.Input("c2", "Color2", rgbSocket);
		var scale = new Rete.Input("scale", "Scale", numSocket);
		var out1 = new Rete.Output("mix", "Mix", rgbSocket);

		node.addInput(c1).addInput(c2).addInput(scale)
			.addOutput(out1);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		//	outputs["out"] = node.data.Z;
	}
}

export class ComponentSetHSV extends Rete.Component
{
	constructor()
	{
		super("SetHSV");
	}

	async builder(node: Node)
	{
		var c = new Rete.Input("color", "Color", rgbSocket);
		var h = new Rete.Input("h", "H", numSocket);
		var s = new Rete.Input("s", "S", numSocket);
		var v = new Rete.Input("v", "V", numSocket);
		var out1 = new Rete.Output("rgb", "RGB", rgbSocket);

		node.addInput(c).addInput(h).addInput(s).addInput(v)
			.addOutput(out1);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		//	outputs["out"] = node.data.Z;
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
		var out1 = new Rete.Output("nodeId", "NodeId", numSocket);
		var out2 = new Rete.Output("numLeds", "NumLeds", numSocket);
		var out3 = new Rete.Output("elapsed", "Elapsed (s)", numSocket);

		node.addOutput(out1).addOutput(out2).addOutput(out3);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["rgb"] = node.data.rgb;
	}
}

export class ComponentTrigo extends Rete.Component
{
	constructor()
	{
		super("Trigo");
	}

	async builder(node: Node)
	{
		var input = new Rete.Input("in", "In", numSocket);
		var sin = new Rete.Output("sin", "Sin", numSocket);
		var cos = new Rete.Output("cos", "Cos", numSocket);
		var tan = new Rete.Output("tan", "Tan", numSocket);

		node.addInput(input).addOutput(sin).addOutput(cos).addOutput(tan);

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

