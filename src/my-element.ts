import { Task } from "@lit/task";
import { Buffer } from "buffer";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import { network, Encryption, sha256 } from "socket:network";

const Z = 9;

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("my-element")
export class MyElement extends LitElement {
  private _peerId: any;
  private _signingKeys: any;
  private _clusterId: any;
  private _sharedKey: any;
  private _socket: any;
  private _subcluster: any;

  constructor() {
    super();
    this._myTask.run();
  }

  private _myTask = new Task(this, {
    task: async () => {
      this._peerId = await Encryption.createId();
      this._signingKeys = await Encryption.createKeyPair(`my-test-keypair${Z}`);

      this._clusterId = await sha256(`my-test-id${Z}`, { bytes: true });
      this._sharedKey = await Encryption.createSharedKey(`my-test-key${Z}`);

      this._socket = await network({
        peerId: this._peerId,
        clusterId: this._clusterId,
        signingKeys: this._signingKeys,
      });

      this._subcluster = await this._socket.subcluster({
        sharedKey: this._sharedKey,
      });

      this._subcluster.on("count", (value: Buffer) => {
        console.log("count", value);
        this.count += JSON.parse(value.toString()).count;
      });
    },
  });

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  render() {
    return html`
      ${this._myTask.render({
        initial: () => html`<p>initializing...</p>`,
        pending: () => html`<p>pending...</p>`,
        complete: () =>
          html`
            <p>${this._peerId}</p>
            <button @click=${this._onClick}>count is ${this.count}</button>
          `,
        error: (error) => {
          console.log({ error });
          return html`<p>error: ${error}</p>`;
        },
      })}
    `;
  }

  private _onClick() {
    const value = Buffer.from(JSON.stringify({ count: 1, now: Date.now() }));
    console.log("click", value);
    this._subcluster.emit("count", value);
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
