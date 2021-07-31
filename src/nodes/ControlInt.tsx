import React, { Dispatch } from 'react';
import Rete, { Node } from "rete";

export class ControlIntReact extends React.Component<any, { value: number }>
{
	onChange: (value: number) => void;

	constructor(props: any)
	{
		super(props);

		const init = props.value ?? 0;
		this.state = { value: init };

		this.handleChange = this.handleChange.bind(this);
		this.onChange = props.onChange;
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		const value = +event.target.value;
		this.setState({ value: value });
		this.onChange(value)
	}

	render()
	{
		return (
			<input
				className="form-control"
				type="number"
				step="1"
				value={Math.round(this.state.value)} onChange={this.handleChange}
				ref={ref =>
				{
					ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
				}}
			/>
		)
	}
}

export class ControlInt extends Rete.Control
{
	props: any;

	constructor(emitter: any, key: string, node: Node, change?: Dispatch<number>)
	{
		super(key);
		(this.data as any).render = 'react';
		//@ts-ignore
		this.component = ControlIntReact;

		const onChange = (value: number) => 
		{
			this.putData(key, value);
			emitter.trigger("process", { NodeId: node.id, Data: node.data });

			// Trigger outside change calback
			change?.(value);
		};
		this.props = { emitter, name: node.name, value: node.data[key], onChange };
	}
}
