/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import './App.scss';
import ModeConfig from './ModeConfig';
import ModeTable from './ModeTable';
import { Switch, Route, Link, BrowserRouter, NavLink } from 'react-router-dom';

import { Grid, Layers, PlusCircle, Settings, XSquare } from 'react-feather';
import { NodeEditor } from './NodeEditor';

function Nav()
{
	return (
		<nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
			<Link className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/">Wall</Link>
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

function PresetList(props: { modes: string[] })
{
	const url = process.env.REACT_APP_BASE_URL + '/api/nodedelete';
	const requestOptions = {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
	};

	const delteNode = (name: string) =>
	{
		if (window.confirm("Delete " + name + " ?"))
		{
			fetch(url + '?name=' + name, requestOptions)
				.then(response => console.log(response));
		}
	}

	return (
		<ul className="nav flex-column mb-2">
			{props.modes.map(m =>
				<li key={m} className="nav-item">
					<Link className="nav-link" to={{ pathname: "/editor", search: "?name=" + m }}>
						<Layers /> {m}
					</Link>
					<button onClick={() => delteNode(m)} className="btn btn-link btn-sm d-flex align-items-center text-muted" aria-label="Delete network">
						<XSquare />
					</button>
				</li>
			)}
		</ul>
	);
}

function Sidebar(props: { modes: string[] })
{
	return (
		<nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
			<div className="sidebar-sticky pt-3">
				<ul className="nav flex-column">
					<li className="nav-item">
						<NavLink className="nav-link" to="/editor" activeClassName="active">
							<Grid /> Editor
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="/settings" activeClassName="active">
							<Settings /> Settings
						</NavLink>
					</li>
				</ul>

				<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
					<span>Stored Modes</span>
					<Link to="/editor" className="d-flex align-items-center text-muted" aria-label="Add a new preset">
						<PlusCircle />
					</Link>
				</h6>
				<PresetList modes={props.modes} />
			</div>
		</nav>
	)
}

function App()
{
	const [modes, setModes] = useState<string[]>([]);

	useEffect(() =>
	{
		const url = process.env.REACT_APP_BASE_URL + '/api/nodelist';
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch(url, requestOptions)
			.then(response => response.json())
			.then(data => { console.log(data); return data; })
			.then(data => setModes(data.nodes));
	}, []);

	return (
		<BrowserRouter>
			<Nav />
			<div className="container-fluid">
				<div className="row">
					<Sidebar modes={modes} />
					<main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
						<Switch>
							<Route exact path="/editor" component={NodeEditor} />
							<Route path="/table">
								<ModeTable />
							</Route>
							<Route path="/settings">
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
		</BrowserRouter>
	);
}

export default App;
