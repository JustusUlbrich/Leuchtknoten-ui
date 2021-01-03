import React from 'react';
import Rete, { Node } from "rete";
import { RgbColor, RgbColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";

export class ControlRGBReact extends React.Component<any, { value: RgbColor }>
{
	onChange: (value: RgbColor) => void;

	constructor(props: any)
	{
		super(props);

		const init = props.value ?? { r: 0, g: 0, b: 0 };
		this.state = { value: init };

		this.setColor = this.setColor.bind(this);
		this.onChange = props.onChange;
	}

	setColor(rgb: RgbColor)
	{
		this.setState({ value: rgb });
		this.onChange(rgb);
	}

	render()
	{
		return (
			<div
				ref={ref =>
				{
					ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
				}}
			>
				<RgbColorPicker color={this.state.value} onChange={this.setColor} />
			</div>
		)
	}
}

export class ControlRGB extends Rete.Control
{
	props: any;

	constructor(emitter: any, key: string, node: Node)
	{
		super(key);
		(this.data as any).render = 'react';
		//@ts-ignore
		this.component = ControlRGBReact;

		const onChange = (value: RgbColor) => { this.putData(key, value); emitter.trigger("process"); };
		this.props = { emitter, name: node.name, value: node.data[key], onChange };
	}
}
