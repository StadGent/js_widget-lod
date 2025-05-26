import { Component, Prop, State, h, Watch, Element } from '@stencil/core';

@Component({
  tag: "lod-address",
  styleUrl: "lod-address.scss",
  shadow: false,
})
export class LodAddress {

  /**
   * The unique uri of the address.
   */
  @Prop() uri: string;

  /**
   * The name of the address.
   */
  @Prop() name: string;

  /**
   * Show a map or a link to a map.
   */
  @Prop() mode: 'link' | 'map' | 'none' = 'none';

  /**
   * Show a link to JSON-LD for SEO.
   */
  @Prop() includeLd: boolean = false;

  @State() data: any;

  @Element() el: HTMLElement;

  componentWillLoad() {
    if (this.uri) {
      this.fetchAddress(this.uri);
    }
  }

  componentDidLoad() {
    if (this.includeLd && this.data && this.uri) {
      const id = `ld-json-${btoa(this.uri).replace(/[^a-z0-9]/gi, '')}`;
      console.log('ld-json', id);
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.textContent = JSON.stringify(this.data);
        document.head.appendChild(script);
      }
    }
  }

  @Watch('uri')
  async fetchAddress(newUri: string) {
    try {
      const response = await fetch(newUri, {
        headers: { Accept: 'application/ld+json' },
      });
      const json = await response.json();
      this.data = json;
    } catch (err) {
      console.error('Error fetching address:', err);
    }
  }

  // Getters voor afgeleide weergave
  get street(): string {
    const s = this.data?.straatnaam?.straatnaam?.geografischeNaam?.spelling;
    const nr = this.data?.huisnummer;
    return s && nr ? `${s} ${nr}` : s || '';
  }

  get city(): string {
    return this.data?.gemeente?.gemeentenaam?.geografischeNaam?.spelling || '';
  }

  get postcode(): string {
    return this.data?.postinfo?.objectId || '';
  }

  get fullAddress(): string {
    //return `${this.street}, ${this.postcode} ${this.city}`.trim();
    return this.data?.volledigAdres?.geografischeNaam?.spelling || '';
  }

  get googleMapsLink(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.fullAddress)}`;
  }

  render() {
    if (!this.data) {
      return <p>Adres wordt geladen...</p>;
    }

    return (
      <div class="address-card">
        <i class="icon-marker" aria-hidden="true"></i>
        <span>
          <strong>{this.name}</strong>
            —
          {this.fullAddress}
        </span>


        {this.mode === 'link' && (
          <a class="map-link" href={this.googleMapsLink} target="_blank" rel="noopener noreferrer">
            Bekijk op kaart <span aria-hidden="true"></span>
          </a>
        )}

        {this.mode === 'map' && (
          <iframe
            class="map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(this.fullAddress)}&output=embed`}
          ></iframe>
        )}
      </div>
    );
  }
}
