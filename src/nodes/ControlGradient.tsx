import React from 'react';
import Rete, { Node } from "rete";
import { HexColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";

import { GradientPicker } from "react-linear-gradient-picker";

type PaletteColor = { offset: string, color: string };
type Palette = PaletteColor[];

// const rgbToString = (rgbColor: RgbColor) => 'rgb(' + rgbColor.r + ', ' + rgbColor.g + ', ' + rgbColor.b + ')';

const WrappedColorPicker = ({ onSelect, ...rest }: any) => (
	<HexColorPicker {...rest} color={rest.color} onChange={c => onSelect(c, 1.0)} />
);

export class ControlGradientReact extends React.Component<any, { value: Palette }>
{
	onChange: (value: Palette) => void;


	default = [
		{ offset: '0.00', color: '#FF0000' },
		{ offset: '0.49', color: '#00FF00' },
		{ offset: '1.00', color: '#0000FF' }
	];

	constructor(props: any)
	{
		super(props);

		const init = props.value ?? this.default;
		this.state = { value: init };

		this.setPalette = this.setPalette.bind(this);
		this.onChange = props.onChange;
	}

	setPalette(palette: Palette)
	{
		this.setState({ value: palette });
		this.onChange(palette);
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
				<GradientPicker {...{
					width: 320,
					paletteHeight: 32,
					palette: this.state.value,
					maxStops: 10,
					onPaletteChange: this.setPalette,
				}}>
					<WrappedColorPicker />
				</GradientPicker>
			</div >
		)
	}
}

export class ControlGradient extends Rete.Control
{
	props: any;

	constructor(emitter: any, key: string, node: Node)
	{
		super(key);
		(this.data as any).render = 'react';
		//@ts-ignore
		this.component = ControlGradientReact;

		const onChange = (value: Palette) => { this.putData(key, value); emitter.trigger("process"); };
		this.props = { emitter, name: node.name, value: node.data[key], onChange };
	}
}
