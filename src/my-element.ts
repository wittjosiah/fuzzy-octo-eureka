import { Task } from "@lit/task";
import { Buffer } from "buffer";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { network, Encryption } from "socket:network";

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
  private _cats: any;

  constructor() {
    super();
    this._myTask.run();
  }

  private _myTask = new Task(this, {
    task: async () => {
      this._peerId = await Encryption.createId();
      this._signingKeys = await Encryption.createKeyPair("dpunpua");

      // this._clusterId = await Encryption.createClusterId("apunduplldrc");
      const encoder = new TextEncoder();
      this._clusterId = await crypto.subtle.digest(
        "sha-256",
        encoder.encode("dpunapunrtd")
      );
      // this._clusterId = await sha256("dpunapunrtd", { bytes: true });
      // console.log({ clusterId: this._clusterId });
      this._sharedKey = await Encryption.createSharedKey("apunduplldrc");

      this._socket = await network({
        peerId: this._peerId,
        clusterId: this._clusterId,
        signingKeys: this._signingKeys,
      });

      this._cats = await this._socket.subcluster({
        sharedKey: this._sharedKey,
      });

      console.log({
        peerId: this._peerId,
        clusterId: this._clusterId,
        // signingKeys: this._signingKeys,
        // sharedKey: this._sharedKey,
        // socket: this._socket,
        // cats: this._cats,
      });

      this._cats.on("mew", (value: Buffer) => {
        try {
          const string = value.toString();
          console.log({ value, string });
          console.log({ parsed: JSON.parse(string) });
        } catch (err) {
          console.log({ err });
        }
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
    this.count++;
    const value = Buffer.from(JSON.stringify({ volume: 1 }));
    console.log("emit", value, JSON.parse(value.toString()));
    this._cats.emit("mew", value);
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
