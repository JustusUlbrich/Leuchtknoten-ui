import React from 'react';
import Rete, { Node } from "rete";

export class ControlArrayReact extends React.Component<any, { value: number[] }>
{
	onChange: (value: number[]) => void;

	constructor(props: any)
	{
		super(props);

		const init = props.value as number[] ?? [];

		this.state = { value: init };

		this.handleChange = this.handleChange.bind(this);
		this.onChange = props.onChange;
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>, idx: number)
	{
		const value = +event.target.value;
		this.setState(state => { state.value[idx] = value; return state });
		this.onChange(this.state.value)
	}

	render()
	{
		return (
			<>
				{this.state.value.map((v, i) =>
					<input
						key={i}
						className="form-control"
						type="number"
						step="0.01"
						value={this.state.value[i]} onChange={ev => this.handleChange(ev, i)}
						ref={ref =>
						{
							ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
						}}
					/>
				)}
				<button onClick={() => this.setState(state =>
				{
					state.value.push(0);
					this.onChange(this.state.value)
					return state;
				})} > + </button>
				<button onClick={() => this.setState(state =>
				{
					state.value.pop();
					this.onChange(this.state.value)
					return state;
				})} > - </button>
			</>
		)
	}
}

export class ControlArray extends Rete.Control
{
	props: any;

	constructor(emitter: any, key: string, node: Node)
	{
		super(key);
		(this.data as any).render = 'react';
		//@ts-ignore
		this.component = ControlArrayReact;

		const onChange = (value: number[]) => 
		{
			this.putData(key, value);
			emitter.trigger("process", { NodeId: node.id, Data: node.data });
		};
		this.props = { emitter, name: node.name, value: node.data[key], onChange };
	}
}
