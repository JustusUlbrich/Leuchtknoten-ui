import React, { ChangeEvent, useEffect, useState } from 'react';
import { General, Wifi, Spotify, Midi, Leds } from './models/Config';
import "./ModeConfig.scss"

export function ModeConfig(props: {})
{
	const [general, setGeneral] = useState<General>()
	const [leds, setLeds] = useState<Leds>()
	const [wifi, setWifi] = useState<Wifi>()
	const [spotify, setSpotify] = useState<Spotify>()
	const [midi, setMidi] = useState<Midi>()

	useEffect(() =>
	{
		const url = process.env.REACT_APP_BASE_URL + '/api/settings';
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch(url, requestOptions)
			.then(response => response.json())
			.then(data => { console.log(data); return data; })
			.then(data =>
			{
				setGeneral(data.general);
				setLeds(data.leds);
				setWifi(data.wifi);
				setSpotify(data.spotify);
				setMidi(data.midi);
			});
	}, [])

	const handleGeneralChange = (event: ChangeEvent<HTMLInputElement>) =>
	{
		if (!general) return;
		const target = event.target;
		const value = target.type === 'checkbox' ?
			target.checked :
			target.type === 'number' ? +target.value : target.value;
		setGeneral({ ...general, [target.name]: value });
	};
	const handleLedsChange = (event: ChangeEvent<HTMLInputElement>) =>
	{
		if (!leds) return;
		const target = event.target;
		const value = target.type === 'checkbox' ?
			target.checked :
			target.type === 'number' ? +target.value : target.value;
		setLeds({ ...leds, [target.name]: value });
	};
	const handleWifiChange = (event: ChangeEvent<HTMLInputElement>) =>
	{
		if (!wifi) return;
		const target = event.target;
		const value = target.type === 'checkbox' ?
			target.checked :
			target.type === 'number' ? +target.value : target.value;
		setWifi({ ...wifi, [target.name]: value });
	};
	const handleSpotifyChange = (event: ChangeEvent<HTMLInputElement>) =>
	{
		if (!spotify) return;
		const target = event.target;
		const value = target.type === 'checkbox' ?
			target.checked :
			target.type === 'number' ? +target.value : target.value;
		setSpotify({ ...spotify, [target.name]: value });
	};
	const handleMidiChange = (event: ChangeEvent<HTMLInputElement>) =>
	{
		if (!midi) return;
		const target = event.target;
		const value = target.type === 'checkbox' ?
			target.checked :
			target.type === 'number' ? +target.value : target.value;
		setMidi({ ...midi, [target.name]: value });
	};

	const storeSettings = () =>
	{
		const url = process.env.REACT_APP_BASE_URL + '/api/settingsstore';
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				general,
				leds,
				wifi,
				spotify,
				midi,
			})
		};
		fetch(url, requestOptions)
			.then(response => console.log(response));
	};

	return (
		<div className="settings-container">
			<form>
				<h2>General</h2>
				<div className="form-group">
					<label htmlFor="initModeInput">Initial Mode</label>
					<input type="text" className="form-control" id="initModeInput"
						aria-describedby="initModeHelp"
						placeholder="Stored Mode Name"
						name={"init_mode"}
						onChange={handleGeneralChange}
						value={general?.init_mode || ""} />
					<small id="initModeHelp" className="form-text text-muted">Use one of the stored modes.</small>
				</div>

				<h2>LEDs</h2>
				<div className="form-group">
					<label htmlFor="ledCountInput">Count</label>
					<input type="number" className="form-control" id="ledCountInput"
						aria-describedby="ledCountHelp"
						name={"count"}
						onChange={handleLedsChange}
						value={leds?.count || 0} />
					<small id="ledCountHelp" className="form-text text-muted">Total number of LEDs.</small>
				</div>
				<div className="form-group">
					<label htmlFor="ledBrightnessInput">Brightness</label>
					<input type="number" className="form-control" id="ledBrightnessInput"
						aria-describedby="ledBrightnessHelp"
						name={"brightness"}
						onChange={handleLedsChange}
						value={leds?.brightness || 0} />
					<small id="ledBrightnessHelp" className="form-text text-muted">Brightness of LEDs (0 low / 255 high).</small>
				</div>
				<div className="form-group">
					TODO: LED INFO
				</div>

				<h2>Wifi</h2>
				<div className="form-group">
					<label htmlFor="wifiSsidInput">SSID</label>
					<input type="text" className="form-control" id="wifiSsidInput"
						name={"ssid"}
						onChange={handleWifiChange}
						value={wifi?.ssid || ""} />
				</div>
				<div className="form-group">
					<label htmlFor="wifiKeyInput">Key</label>
					<input type="text" className="form-control" id="wifiKeyInput"
						name={"key"}
						onChange={handleWifiChange}
						value={wifi?.key || ""} />
				</div>

				<h2>Midi</h2>
				<div className="form-group form-check">
					<input type="checkbox" className="form-check-input" id="midiEnabledInput"
						name={"enabled"}
						onChange={handleMidiChange}
						checked={midi?.enabled || false} />
					<label className="form-check-label" htmlFor="midiEnabledInput">Rtp Midi</label>
				</div>

				<h2>Spotify</h2>
				<div className="form-group form-check">
					<input type="checkbox" className="form-check-input" id="spotifyEnabledInput"
						name={"enabled"}
						onChange={handleSpotifyChange}
						checked={spotify?.enabled || false} />
					<label className="form-check-label" htmlFor="spotifyEnabledInput">Spotify enabled</label>
				</div>
				<div className="form-group">
					<label htmlFor="spotifyUpdateRate">Update Rate [ms]</label>
					<input type="number" className="form-control" id="spotifyUpdateRate"
						aria-describedby="spotifyUpdateRateHelp"
						name={"update_rate_ms"}
						onChange={handleSpotifyChange}
						value={spotify?.update_rate_ms || 0} />
					<small id="spotifyUpdateRateHelp" className="form-text text-muted">Update rate in ms.</small>
				</div>
				<div className="form-group">
					<label htmlFor="spotifyMarket">Market</label>
					<input type="text" className="form-control" id="spotifyMarket"
						aria-describedby="spotifyMarketHelp"
						placeholder="DE / US / CA"
						name={"market"}
						onChange={handleSpotifyChange}
						value={spotify?.market || ""} />
					<small id="spotifyMarketHelp" className="form-text text-muted">e.g. DE / US / etc</small>
				</div>
				<div className="form-group">
					<label htmlFor="spotifyClientID">Client ID</label>
					<input type="text" className="form-control" id="spotifyClientID"
						aria-describedby="spotifyClientIDHelp"
						placeholder=""
						name={"client_id"}
						onChange={handleSpotifyChange}
						value={spotify?.client_id || ""} />
					<small id="spotifyClientIDHelp" className="form-text text-muted">32 character string</small>
				</div>
				<div className="form-group">
					<label htmlFor="spotifyClientSecret">Client Secret</label>
					<input type="text" className="form-control" id="spotifyClientSecret"
						aria-describedby="spotifyClientSecretHelp"
						placeholder=""
						name={"client_secret"}
						onChange={handleSpotifyChange}
						value={spotify?.client_secret || ""} />
					<small id="spotifyClientSecretHelp" className="form-text text-muted">32 character string</small>
				</div>
				<div className="form-group">
					<label htmlFor="spotifyRefreshToken">Refresh Token</label>
					<input type="text" className="form-control" id="spotifyRefreshToken"
						aria-describedby="spotifyRefreshTokenHelp"
						placeholder=""
						name={"refresh_token"}
						onChange={handleSpotifyChange}
						value={spotify?.refresh_token || ""} />
					<small id="spotifyRefreshTokenHelp" className="form-text text-muted">131 character string?</small>
				</div>

			</form>
			<button onClick={() => storeSettings()} className="btn btn-primary">Save</button>
		</div>
	);
}

export default ModeConfig;
