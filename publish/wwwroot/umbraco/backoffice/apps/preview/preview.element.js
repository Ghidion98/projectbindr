var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { manifests as previewApps } from './apps/manifests.js';
import { UmbPreviewContext } from './preview.context.js';
import { css, customElement, html, nothing, state, when } from '@umbraco-cms/backoffice/external/lit';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
const elementName = 'umb-preview';
/**
 * @element umb-preview
 */
let UmbPreviewElement = class UmbPreviewElement extends UmbLitElement {
    #context = new UmbPreviewContext(this);
    constructor() {
        super();
        if (previewApps?.length) {
            umbExtensionsRegistry.registerMany(previewApps);
        }
        this.observe(this.#context.iframeReady, (iframeReady) => (this._iframeReady = iframeReady));
        this.observe(this.#context.previewUrl, (previewUrl) => (this._previewUrl = previewUrl));
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('visibilitychange', this.#onVisibilityChange);
        window.addEventListener('beforeunload', () => this.#context.exitSession());
        this.#context.startSession();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('visibilitychange', this.#onVisibilityChange);
        // NOTE: Unsure how we remove an anonymous function from 'beforeunload' event listener.
        // The reason for the anonymous function is that if we used a named function,
        // `this` would be the `window` and would not have context to the class instance. [LK]
        //window.removeEventListener('beforeunload', () => this.#context.exitSession());
        this.#context.exitSession();
    }
    #onIFrameLoad(event) {
        this.#context.iframeLoaded(event.target);
    }
    #onVisibilityChange() {
        this.#context.checkSession();
    }
    render() {
        if (!this._previewUrl)
            return nothing;
        return html `
			${when(!this._iframeReady, () => html `<div id="loading"><uui-loader-circle></uui-loader-circle></div>`)}
			<div id="wrapper">
				<div id="container">
					<iframe
						src=${this._previewUrl}
						title="Page preview"
						@load=${this.#onIFrameLoad}
						sandbox="allow-scripts"></iframe>
				</div>
			</div>
			<div id="menu">
				<h4>Preview Mode</h4>
				<uui-button-group>
					<umb-extension-slot id="apps" type="previewApp"></umb-extension-slot>
				</uui-button-group>
			</div>
		`;
    }
    static { this.styles = [
        css `
			:host {
				display: flex;
				justify-content: center;
				align-items: center;

				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				padding-bottom: 40px;
			}

			#loading {
				display: flex;
				align-items: center;
				justify-content: center;

				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				font-size: 6rem;
				backdrop-filter: blur(5px);
			}

			#wrapper {
				transition: all 240ms cubic-bezier(0.165, 0.84, 0.44, 1);
				flex-shrink: 0;
				height: 100%;
				width: 100%;
			}

			#wrapper.fullsize {
				margin: 0 auto;
				overflow: hidden;
			}

			#wrapper.shadow {
				margin: 10px auto;
				background-color: white;
				border-radius: 3px;
				overflow: hidden;
				opacity: 1;
				box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.26);
			}

			#container {
				width: 100%;
				height: 100%;
				margin: 0 auto;
				overflow: hidden;
			}

			#menu {
				display: flex;
				justify-content: space-between;
				align-items: center;

				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;

				background-color: var(--uui-color-header-surface);
				height: 40px;

				animation: menu-bar-animation 1.2s;
				animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
			}

			#menu > h4 {
				color: var(--uui-color-header-contrast-emphasis);
				margin: 0;
				padding: 0 15px;
			}

			#menu > uui-button-group {
				height: 100%;
			}

			uui-icon.flip {
				rotate: 90deg;
			}

			iframe {
				border: 0;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
				overflow-x: hidden;
				overflow-y: hidden;
			}

			@keyframes menu-bar-animation {
				0% {
					bottom: -50px;
				}
				40% {
					bottom: -50px;
				}
				80% {
					bottom: 0px;
				}
			}
		`,
    ]; }
};
__decorate([
    state()
], UmbPreviewElement.prototype, "_iframeReady", void 0);
__decorate([
    state()
], UmbPreviewElement.prototype, "_previewUrl", void 0);
UmbPreviewElement = __decorate([
    customElement(elementName)
], UmbPreviewElement);
export { UmbPreviewElement };
export default UmbPreviewElement;
