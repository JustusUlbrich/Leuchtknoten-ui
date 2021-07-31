import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ControlGradient } from "./ControlGradient";
import { ControlFloat } from "./ControlFloat";
import { ControlInt } from "./ControlInt";
import { ControlRGB } from "./ControlRGB";
import { ControlBool } from "./ControlBool";
import { ControlArray } from "./ControlArray";

var numSocket = new Rete.Socket("Number");
var rgbSocket = new Rete.Socket("RGB");
var boolSocket = new Rete.Socket("Bool");
var arraySocket = new Rete.Socket("Array");

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

export class ComponentBool extends Rete.Component
{
	constructor()
	{
		super("Bool");
	}

	async builder(node: Node)
	{
		var out1 = new Rete.Output("bool", "Bool", boolSocket);
		var ctrl = new ControlBool(this.editor, "value", node);

		node.addControl(ctrl).addOutput(out1);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		outputs["bool"] = node.data.num;
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
		var out3 = new Rete.Output("pow", "Pow", numSocket);
		var out4 = new Rete.Output("abs", "Abs (In1)", numSocket);

		node.addInput(in1).addInput(in2)
			.addOutput(out1).addOutput(out2).addOutput(out3).addOutput(out4);

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

export class ComponentArray extends Rete.Component
{
	constructor()
	{
		super("Array");
	}

	async builder(node: Node)
	{
		node.addInput(new Rete.Input("index", "Index", numSocket));
		node.addControl(new ControlArray(this.editor, "entries", node));
		node.addOutput(new Rete.Output("value", "Value", numSocket));
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["num"] = node.data.num;
	}
}

export class ComponentSwitch extends Rete.Component
{
	constructor()
	{
		super("Switch");
	}

	async builder(node: Node)
	{

		const onChange = (i: number) =>
		{
			node.inputs.forEach((input, _) =>
			{
				input.connections.forEach(c => this.editor?.removeConnection(c));
				node.removeInput(input)
			});

			for (let n = 0; n < i; n++)
			{
				node.addInput(new Rete.Input("c" + n, "Color" + n, rgbSocket));
			}
			node.addInput(new Rete.Input("scale", "Scale", numSocket));
			node.update();
		}

		onChange(node.getConnections.length);

		// node.addInput(new Rete.Input("c1", "Color1", rgbSocket));
		// node.addInput(new Rete.Input("c2", "Color2", rgbSocket));
		// node.addInput(new Rete.Input("scale", "Scale", numSocket));

		node.addOutput(new Rete.Output("rgb", "RGB", rgbSocket));
		node.addControl(new ControlInt(this.editor, "count", node, onChange));

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["num"] = node.data.num;
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


export class ComponentAnimNumber extends Rete.Component
{
	constructor()
	{
		super("AnimNumber");
	}

	async builder(node: Node)
	{
		var r = new Rete.Input("reset", "Reset", boolSocket);
		var d = new Rete.Input("delay", "Delay (ms)", numSocket);
		var out1 = new Rete.Output("out", "Output", numSocket);

		node.addInput(r).addInput(d)
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
		var out3 = new Rete.Output("elapsed", "Elapsed (ms)", numSocket);
		var outX = new Rete.Output("posX", "Position X", numSocket);
		var outY = new Rete.Output("posY", "Position Y", numSocket);
		var outZ = new Rete.Output("posZ", "Position Z", numSocket);

		node.addOutput(out1).addOutput(out2).addOutput(out3)
			.addOutput(outX).addOutput(outY).addOutput(outZ);

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

export class ComponentMidi extends Rete.Component
{
	constructor()
	{
		super("Midi");
	}

	async builder(node: Node)
	{
		var noteMin = new Rete.Input("noteMin", "Min Note", numSocket);
		var noteMax = new Rete.Input("noteMax", "Max Note", numSocket);
		var noteOn = new Rete.Output("noteOn", "Note On", boolSocket)
		// TODO: needed?
		// var noteOff = new Rete.Output("noteOff", "Note Off", boolSocket);
		var pitch = new Rete.Output("pitch", "Pitch", numSocket);
		var velocity = new Rete.Output("velo", "Velocity", numSocket);

		node.addInput(noteMin).addInput(noteMax)
			.addOutput(noteOn)
			// .addOutput(noteOff) NEEDED?
			.addOutput(pitch).addOutput(velocity);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["rgb"] = node.data.rgb;
	}
}

export class ComponentNoise extends Rete.Component
{
	constructor()
	{
		super("Noise");
	}

	async builder(node: Node)
	{
		var xin = new Rete.Input("inX", "X (1D)", numSocket);
		var yin = new Rete.Input("inY", "Y (2D)", numSocket);
		var zin = new Rete.Input("inZ", "Z (3D)", numSocket)
		var out1d = new Rete.Output("dim1", "1D Noise", numSocket)
		var out2d = new Rete.Output("dim2", "2D Noise", numSocket)
		var out3d = new Rete.Output("dim3", "3D Noise", numSocket)

		node.addInput(xin).addInput(yin).addInput(zin)
			.addOutput(out1d).addOutput(out2d).addOutput(out3d);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["rgb"] = node.data.rgb;
	}
}

export class ArrayLoop extends Rete.Component
{
	constructor()
	{
		super("ArrayLoop");
	}

	async builder(node: Node)
	{
		var in1 = new Rete.Input("rgb", "RGB", rgbSocket);
		var in2 = new Rete.Input("white", "W", numSocket);

		node.addInput(in1).addInput(in2);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["rgb"] = inputs["rgb"];
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
		var in2 = new Rete.Input("white", "W", numSocket);

		node.addInput(in1).addInput(in2);

		return;
	}

	worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs)
	{
		// outputs["rgb"] = inputs["rgb"];
	}
}

