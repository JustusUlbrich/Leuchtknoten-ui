import React from 'react';
import './App.scss';
import ModeConfig from './ModeConfig';
import ModeTable from './ModeTable';
import { NodeEditor } from './NodeEditor';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Home, Layers, PlusCircle, Settings } from 'react-feather';

function Nav()
{
	return (
		<nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
			<a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="">Wall</a>
			<button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			{/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
			<ul className="navbar-nav px-3">
				<li className="nav-item text-nowrap">
					<a className="nav-link" href="#">Sign out</a>
				</li>
			</ul>
		</nav>
	)
}

function PresetList()
{
	return (
		<ul className="nav flex-column mb-2">
			<li className="nav-item">
				<a className="nav-link" href="#">
					<Layers />
			Rainbow
			</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="#">
					<Layers />
			Blink
			</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="#">
					<Layers />
			Random
			</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="#">
					<Layers />
			Custom1
			</a>
			</li>
		</ul>
	);
}

function Sidebar()
{
	return (
		<nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
			<div className="sidebar-sticky pt-3">
				<ul className="nav flex-column">
					<li className="nav-item">
						<a className="nav-link active" href="#">
							<Home />
							 Home
							 <span className="sr-only">(current)</span>
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<Settings />
							Settings
						</a>
					</li>
				</ul>

				<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
					<span>Current Modes</span>
					<a className="d-flex align-items-center text-muted" href="/node/new" aria-label="Add a new preset">
						<PlusCircle />
					</a>
				</h6>
				<PresetList />
			</div>
		</nav>
	)
}

function App()
{
	return (
		<Router>
			<div>
				<Nav />
				<div className="container-fluid">
					<div className="row">
						<Sidebar />
						<main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
							<Switch>
								<Route path="/node">
									<NodeEditor />
								</Route>
								<Route path="/table">
									<ModeTable />
								</Route>
								<Route path="/config">
									<ModeConfig />
								</Route>
							</Switch>

							{/*
							<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
								<h1 className="h2">Dashboard</h1>
								<div className="btn-toolbar mb-2 mb-md-0">
								<div className="btn-group mr-2">
									<button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
									<button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
								</div>
								<button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
									<span data-feather="calendar"></span>
									This week
								</button>
								</div>
							</div>
							*/}

						</main>
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
