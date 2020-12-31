import React from 'react';

class ModeTable extends React.Component
{
	componentDidMount()
	{
		const url = process.env.REACT_APP_BASE_URL + 'api/modes';
		// Simple GET request using fetch
		fetch(url)
			.then(response => response.json())
			.then(data => this.setState({ totalReactPackages: data.total }));
	}

	// MainTable = () =>
	// {
	// 	const operation = (actions: any, rowData: any) =>
	// 	{
	// 		return <Button type="error" auto size="mini" onClick={() => actions.remove()}>Remove</Button>
	// 	}

	// 	const select = (actions: any, rowData: any) =>
	// 	{
	// 		return <Button type="success" auto size="mini" onClick={() => rowData.isSelected = 'true'}>Configure</Button>
	// 	}

	// 	const data = [
	// 		{ property: 'type', description: 'Content type', operation, select, isSelected: false },
	// 		{ property: 'Component', description: 'DOM element to use', operation, select, isSelected: false },
	// 		{ property: <Text b>bold</Text>, description: 'Bold style', operation, select, isSelected: false },
	// 	]
	// 	return (
	// 		<Table data={data}>
	// 			<Table.Column prop="property" label="property" />
	// 			<Table.Column prop="description" label="description" />
	// 			<Table.Column prop="operation" label="" />
	// 			<Table.Column prop="select" label="" />
	// 			<Table.Column prop="selected" label="Selected" />
	// 		</Table>
	// 	)
	// }

	render()
	{
		return <div>ModelTable/List</div>;

		// <Card>{this.MainTable()}</Card>
	}
}

export default ModeTable;