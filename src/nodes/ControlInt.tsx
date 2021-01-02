import React from 'react';
import Rete from "rete";

export class ControlIntReact extends React.Component<any, { value: number }>
{
	constructor(props: any)
	{
		super(props);

		this.state = { value: 0 };

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		this.setState({ value: +event.target.value });
	}

	render()
	{
		return (
			<input
				type="number"
				value={this.state.value} onChange={this.handleChange}
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

	constructor(emitter: any, key: string, name: string)
	{
		super(key);
		(this.data as any).render = 'react';
		//@ts-ignore
		this.component = ControlIntReact;
		this.props = { emitter, name };
	}
}
