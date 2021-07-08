export interface Config
{
	general: General;
	leds: Leds;
	wifi: Wifi;
	spotify: Spotify;
	midi: Midi;
}

export interface General
{
	init_mode: string;
}

export interface Leds
{
	count: number;
	brightness: number;
	led_info: LEDInfo[];
}

export interface LEDInfo
{
	pos_x: number;
	pos_y: number;
	pos_z: number;
}

export interface Midi
{
	enabled: boolean;
}

export interface Spotify
{
	enabled: boolean;
	update_rate_ms: number;
	market: string;
	client_id: string;
	client_secret: string;
	refresh_token: string;
}

export interface Wifi
{
	ssid: string;
	key: string;
}
