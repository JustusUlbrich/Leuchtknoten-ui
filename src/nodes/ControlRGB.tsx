import React from 'react';
import Rete from "rete";
import { RgbColor, RgbColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";

export class ControlRGBReact extends React.Component<any, { value: RgbColor }>
{
	constructor(props: any)
	{
		super(props);

		this.state = { value: { r: 0, g: 0, b: 0 } };

		this.setColor = this.setColor.bind(this);
	}

	setColor(rgb: RgbColor)
	{
		this.setState({ value: rgb });
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

	constructor(emitter: any, key: string, name: string)
	{
		super(key);
		(this.data as any).render = 'react';
		//@ts-ignore
		this.component = ControlRGBReact;
		this.props = { emitter, name };
	}
}
