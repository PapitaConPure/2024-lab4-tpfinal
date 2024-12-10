import config from './config.json';

export default function endpoint(endpointWithLeadingSlash: string) {
	return `${config.BACKEND_API_URI}${endpointWithLeadingSlash}`;
}
