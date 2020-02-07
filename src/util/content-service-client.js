import { html } from 'lit-element/lit-element.js';
import * as querystring from '@chaitin/querystring';
import { d2lfetch } from 'd2l-fetch/src/index.js';
import auth from 'd2l-fetch-auth/src/unframed/index.js';

d2lfetch.use({ name: 'auth', fn: auth });

export default class ContentServiceClient {
	constructor({ endpoint, tenantId }) {
		this._endpoint = endpoint;
		this._tenantId = tenantId;
	}

	_url(path, queryParams) {
		const qs = queryParams ? `?${querystring.stringify(queryParams)}` : '';
		return `${this._endpoint}/api/${this._tenantId}/${path}${qs}`;
	}

	async _fetch({ path, method = 'GET', queryParams, bodyParams, extractJsonBody = true }) {
		const request = new Request(this._url(path, queryParams), {
			method,
			...bodyParams && { body: JSON.stringify(bodyParams) }
		});

		const response = await d2lfetch.fetch(request);
		if (extractJsonBody) {
			try {
				return await response.json();
			} catch (error) {
				return { error: true };
			}
		}

		return response;
	}

	listContent({ ids = null } = {}) {
		return this._fetch({
			path: 'content',
			...ids && { queryParams: ids.join(',') }
		});
	}

	get dump() {
		return html`<p>Content Service Client: ${this._endpoint} / ${this._tenantId}</p>`;
	}
}
