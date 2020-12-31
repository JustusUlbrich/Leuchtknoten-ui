import React from 'react';
import './App.scss';
import ModeConfig from './ModeConfig';
import ModeTable from './ModeTable';

function Nav()
{
	return (
		<nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
			<a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="">Wall</a>
			<button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />
			<ul className="navbar-nav px-3">
				<li className="nav-item text-nowrap">
					<a className="nav-link" href="#">Sign out</a>
				</li>
			</ul>
		</nav>
	)
}

function Sidebar()
{
	return (
		<nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
			<div className="sidebar-sticky pt-3">
				<ul className="nav flex-column">
					<li className="nav-item">
						<a className="nav-link active" href="#">
							<span data-feather="home"></span>
							 Modi
							 <span className="sr-only">(current)</span>
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<span data-feather="file"></span>
							Settings
						</a>
					</li>
				</ul>

				<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
					<span>Current Modes</span>
					<a className="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
						<span data-feather="plus-circle"></span>
					</a>
				</h6>
				<ul className="nav flex-column mb-2">
					<li className="nav-item">
						<a className="nav-link" href="#">
							<span data-feather="file-text"></span>
						Rainbow
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<span data-feather="file-text"></span>
						Blink
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<span data-feather="file-text"></span>
						Random
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<span data-feather="file-text"></span>
						Custom1
						</a>
					</li>
				</ul>
			</div>
		</nav>
	)
}

function App()
{
	return (
		<div>
			<Nav />
			<div className="container-fluid">
				<div className="row">
					<Sidebar />
					<main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
						<ModeTable />
						<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
							<h1 className="h2">Dashboard</h1>
							{/* <div className="btn-toolbar mb-2 mb-md-0">
								<div className="btn-group mr-2">
									<button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
									<button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
								</div>
								<button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
									<span data-feather="calendar"></span>
									This week
								</button>
							</div> */}
						</div>

						<h2>Section title</h2>
						<div className="table-responsive">
							<table className="table table-striped table-sm">
								<thead>
									<tr>
										<th>#</th>
										<th>Header</th>
										<th>Header</th>
										<th>Header</th>
										<th>Header</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>1,001</td>
										<td>Lorem</td>
										<td>ipsum</td>
										<td>dolor</td>
										<td>sit</td>
									</tr>
									<tr>
										<td>1,002</td>
										<td>amet</td>
										<td>consectetur</td>
										<td>adipiscing</td>
										<td>elit</td>
									</tr>
									<tr>
										<td>1,003</td>
										<td>Integer</td>
										<td>nec</td>
										<td>odio</td>
										<td>Praesent</td>
									</tr>
									<tr>
										<td>1,003</td>
										<td>libero</td>
										<td>Sed</td>
										<td>cursus</td>
										<td>ante</td>
									</tr>
									<tr>
										<td>1,004</td>
										<td>dapibus</td>
										<td>diam</td>
										<td>Sed</td>
										<td>nisi</td>
									</tr>
									<tr>
										<td>1,005</td>
										<td>Nulla</td>
										<td>quis</td>
										<td>sem</td>
										<td>at</td>
									</tr>
									<tr>
										<td>1,006</td>
										<td>nibh</td>
										<td>elementum</td>
										<td>imperdiet</td>
										<td>Duis</td>
									</tr>
									<tr>
										<td>1,007</td>
										<td>sagittis</td>
										<td>ipsum</td>
										<td>Praesent</td>
										<td>mauris</td>
									</tr>
									<tr>
										<td>1,008</td>
										<td>Fusce</td>
										<td>nec</td>
										<td>tellus</td>
										<td>sed</td>
									</tr>
									<tr>
										<td>1,009</td>
										<td>augue</td>
										<td>semper</td>
										<td>porta</td>
										<td>Mauris</td>
									</tr>
									<tr>
										<td>1,010</td>
										<td>massa</td>
										<td>Vestibulum</td>
										<td>lacinia</td>
										<td>arcu</td>
									</tr>
									<tr>
										<td>1,011</td>
										<td>eget</td>
										<td>nulla</td>
										<td>className</td>
										<td>aptent</td>
									</tr>
									<tr>
										<td>1,012</td>
										<td>taciti</td>
										<td>sociosqu</td>
										<td>ad</td>
										<td>litora</td>
									</tr>
									<tr>
										<td>1,013</td>
										<td>torquent</td>
										<td>per</td>
										<td>conubia</td>
										<td>nostra</td>
									</tr>
									<tr>
										<td>1,014</td>
										<td>per</td>
										<td>inceptos</td>
										<td>himenaeos</td>
										<td>Curabitur</td>
									</tr>
									<tr>
										<td>1,015</td>
										<td>sodales</td>
										<td>ligula</td>
										<td>in</td>
										<td>libero</td>
									</tr>
								</tbody>
							</table>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

export default App;

{/* <Page>
<Page.Header>
	<h2>Wall</h2>
</Page.Header>
<Page.Content>
	<Row gap={.8}>
		<Col><ModeTable /></Col>
		<Col><ModeConfig /> </Col>
	</Row>
</Page.Content>
<Page.Footer>
	<h2>{process.env.REACT_APP_BASE_URL}</h2>
</Page.Footer>
</Page > */}

