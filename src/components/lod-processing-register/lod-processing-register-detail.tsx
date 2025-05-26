import { Component, h, Fragment, State, Prop } from "@stencil/core";
import { getPersonalDataProcessingDetail } from "../../services/queries";
import { isString } from "../../utils/utils";

@Component({
  tag: "lod-processing-register-detail",
  shadow: false,
})
export class LodProcessingRegisterDetail {
  @Prop() processingId: string;
  @State() data: ProcessingRegisterDetailItem;

  async componentWillLoad() {
    this.data = await getPersonalDataProcessingDetail(this.processingId);
  }
  render() {
    return this.data ? (
      <article class="detail-layout">
        <div class="content-header-container primary dark-background overlap image">
          <div class="left">
            <button class="readspeaker-button">
              <i class="icon-readspeaker" aria-hidden="true"></i>
              <span>Listen</span>
            </button>

            <h1>{this.data.name.value}</h1>
          </div>
        </div>
        <section class="highlight">
          <div class="highlight__inner">
            <h2 class="visually-hidden">Samenvatting</h2>
            {isString(this.data.type.value) && (
              <dl>
                <dt>Categorie</dt>
                <dd>{this.data.type.value}</dd>
              </dl>
            )}
            {isString(this.data.processor.value) && (
              <dl>
                <dt>Verwerkende dienst</dt>
                <dd>{this.data.processor.value}</dd>
              </dl>
            )}
            {isString(this.data.formal_framework.value) && (
              <dl>
                <dt>Rechtmatigheid</dt>
                <dd>{this.data.formal_framework.value}</dd>
              </dl>
            )}
          </div>
        </section>
        {isString(this.data.description.value) && (
          <>
            <h2>Beschrijving</h2>
            <p>{this.data.description.value}</p>
          </>
        )}
        {(isString(this.data.personalDataDescription.value) ||
          isString(this.data.sensitivePersonalData.value)) && (
          <>
            <h2>Gegevens</h2>
            <h3>Over wie?</h3>
            {isString(this.data.personalDataDescription.value) && (
              <p>{this.data.personalDataDescription.value}</p>
            )}
            {isString(this.data.sensitivePersonalData.value) && (
              <p>{this.data.sensitivePersonalData.value}</p>
            )}
          </>
        )}
        <h3>Welke persoongegevens?</h3>
        {this.data.personalData.value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item).length > 0 ? (
          <ul>
            {this.data.personalData.value
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item)
              .map((item) => (
                <li>{item.trim()}</li>
              ))}
          </ul>
        ) : (
          <p> Er zijn geen persoonsgegevens van toepassing.</p>
        )}

        <h3>Welke gevoelige persoongegevens?</h3>
        {this.data.sensitivePersonalData.value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item).length > 0 ? (
          <ul>
            {this.data.sensitivePersonalData.value
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item)
              .map((item) => (
                <li>{item.trim()}</li>
              ))}
          </ul>
        ) : (
          <p> Er zijn geen gevoelige persoonsgegevens van toepassing.</p>
        )}
        <h2>Rechtmatigheid</h2>
        {isString(this.data.formal_framework.value) && (
          <>
            <h3>Type</h3>
            <p>{this.data.formal_framework.value}</p>
          </>
        )}
        {isString(this.data.formal_framework_clarification.value) && (
          <>
            <h3>Verduidelijking</h3>
            <p>{this.data.formal_framework_clarification.value}</p>
          </>
        )}

        {this.data.grantees.value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item).length > 0 && (
          <>
            <h3>Ontvangers</h3>
            <ul>
              {this.data.grantees.value
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item)
                .map((item) => (
                  <li>{item.trim()}</li>
                ))}
            </ul>
          </>
        )}
        {isString(this.data.storagePeriod.value) && (
          <>
            <h3>Bewaartermijn</h3>
            <p>{this.data.storagePeriod.value}</p>
          </>
        )}
      </article>
    ) : null;
  }
}
