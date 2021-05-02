import React from 'react';
import Rete, { Node } from "rete";

export class ControlBoolReact extends React.Component<any, { value: boolean }>
{
	onChange: (value: boolean) => void;

	constructor(props: any)
	{
		super(props);

		const init = props.value ?? false;
		this.state = { value: init };

		this.handleChange = this.handleChange.bind(this);
		this.onChange = props.onChange;
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		console.log(event);
		const value = !!event.target.checked;
		this.setState({ value: value });
		this.onChange(value)
	}

	render()
	{
		return (
			<div className="custom-control custom-switch"
			>
				<input
					id="switch"
					className="custom-control-input"
					type="checkbox"
					checked={this.state.value}
					onChange={this.handleChange}
					ref={ref =>
					{
						ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
					}}
				/>
				<label className="custom-control-label" htmlFor="switch">{this.state.value ? 'On' : 'Off'}</label>
			</div>
		)
	}
}

export class ControlBool extends Rete.Control
{
	props: any;

	constructor(emitter: any, key: string, node: Node)
	{
		super(key);
		(this.data as any).render = 'react';
		//@ts-ignore
		this.component = ControlBoolReact;

		const onChange = (value: number) => 
		{
			this.putData(key, value);
			emitter.trigger("process", { NodeId: node.id, Data: node.data });
		};
		this.props = { emitter, name: node.name, value: node.data[key], onChange };
	}
}
