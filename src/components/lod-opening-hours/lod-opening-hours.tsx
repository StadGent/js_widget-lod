import { Component, h, Prop, State, Element } from "@stencil/core";
import OpeningHoursWidget from "@digipolis-gent/opening-hours-widget";

@Component({
  tag: "lod-opening-hours",
  shadow: false,
})
export class LodOpeningHours {
  /*
   * Endpoint
   */
  @Prop() endpoint: string = "https://openingsuren.gent.be/api/v1";

  /*
   * Endpoint Key
   */
  @Prop() endpointKey: string;

  /*
   * Opening hours title
   */
  @Prop() hoursTitle: string;

  /*
   * Show all hours
   */
  @Prop() showAllHours: boolean = false;

  /*
   * Service ID
   */
  @Prop() serviceId!: string;

  /*
   * Channel ID
   */
  @Prop() channelId: string | boolean = false;

  /*
   * Language
   */
  @Prop() language: "en" | "nl" = "en";

  @State() hoursInnerHtml: string = "";
  @State() monthInnerHtml: string = "";
  @State() weekInnerHtml: string = "";
  @State() expandedView: "week-from-now" | "month" = "week-from-now";
  @State() allHoursOpened: boolean = false;
  @State() currentSelectedMonthDate: number;
  @State() currentMonth: number = new Date().getMonth();

  @Element() el: HTMLElement;

  async componentWillLoad() {
    const options = {
      endpoint: this.endpoint,
      endpoint_key: this.endpointKey,
      parameters: {
        language: this.language,
      },
    };
    let ohw = new OpeningHoursWidget(options);

    const hours = await ohw.fetchOpeningHoursForDate(
      this.serviceId,
      this.channelId,
      "html",
      options,
    );

    if (this.showAllHours) {
      const week = await ohw.fetchOpeningHoursForWeek(
        this.serviceId,
        this.channelId,
        "html",
        options,
      );

      const month = await ohw.fetchOpeningHoursForMonth(
        this.serviceId,
        this.channelId,
        "html",
        options,
      );

      this.monthInnerHtml = month;
      this.weekInnerHtml = week;
    }

    this.hoursInnerHtml = hours;

    this.currentSelectedMonthDate = new Date().getDate();
  }

  async componentDidLoad() {
    if (this.showAllHours) {
      this.updateWeekInnerHtml();
    }
  }

  private monthClickEvent(position: number) {
    if (position !== this.currentSelectedMonthDate) {
      const oldDateElement: HTMLElement = document.querySelector(
        `[aria-posinset="${this.currentSelectedMonthDate}"]`,
      );

      if (oldDateElement) {
        oldDateElement.tabIndex = -1;
      }

      this.currentSelectedMonthDate = position;

      const newDateElement: HTMLElement = document.querySelector(
        `[aria-posinset="${position}"]`,
      );

      if (newDateElement) {
        newDateElement.tabIndex = 0;
      }
    }
  }

  private removeCurrentDateListeners() {
    const items = document.querySelectorAll("li[aria-posinset]");

    items.forEach((item) => {
      const posinset = parseInt(item.getAttribute("aria-posinset"), 10);

      // Check if the aria-posinset value is between 1 and 31
      if (posinset >= 1 && posinset <= 31) {
        item.removeEventListener("click", () => this.monthClickEvent(posinset));
      }
    });
  }

  private updateMonthInnerHtml(initial: boolean) {
    if (!initial) {
      this.removeNextPrevMonthListeners();
      this.removeCurrentDateListeners();
    }

    const openinghoursExpandedDiv = this.el.querySelector("#openinghours-div");
    openinghoursExpandedDiv.innerHTML = this.monthInnerHtml;

    if (!initial && this.currentMonth !== new Date().getMonth()) {
      this.currentSelectedMonthDate = 1;
    } else if (this.currentMonth === new Date().getMonth()) {
      this.currentSelectedMonthDate = new Date().getDate();
    }

    this.setNextPrevMonthListeners();

    const items = document.querySelectorAll("li[aria-posinset]");

    items.forEach((item) => {
      const posinset = parseInt(item.getAttribute("aria-posinset"), 10);

      // Check if the aria-posinset value is between 1 and 31
      if (posinset >= 1 && posinset <= 31) {
        // Add an event listener (e.g., click event) to the <li> element
        item.addEventListener("click", () => this.monthClickEvent(posinset));
      }
    });
  }

  private updateWeekInnerHtml() {
    const openinghoursExpandedDiv = this.el.querySelector("#openinghours-div");
    openinghoursExpandedDiv.innerHTML = this.weekInnerHtml;
  }

  private getFirstDateOfMonth() {
    const today = new Date();

    // Calculate the first day of the next month
    const nextMonth = new Date(
      Date.UTC(today.getFullYear(), this.currentMonth, 1),
    );

    // Format the date as YYYY-MM-DD
    const formattedDate = nextMonth.toISOString().split("T")[0];

    return formattedDate;
  }

  private setExpandedView(view: "week-from-now" | "month") {
    this.expandedView = view;

    if (view === "week-from-now") {
      this.updateWeekInnerHtml();
    }

    if (view === "month") {
      this.updateMonthInnerHtml(true);
    }
  }

  private async fetchNewMonthData(type: "plus" | "minus") {
    type === "plus" ? (this.currentMonth += 1) : (this.currentMonth -= 1);

    const options = {
      endpoint: this.endpoint,
      endpoint_key: this.endpointKey,
      parameters: {
        date: this.getFirstDateOfMonth(),
        language: this.language,
      },
    };

    let ohw = new OpeningHoursWidget(options);

    const month = await ohw.fetchOpeningHoursForMonth(
      this.serviceId,
      this.channelId,
      "html",
      options,
    );

    this.monthInnerHtml = month;
    this.updateMonthInnerHtml(false);
  }

  private removeNextPrevMonthListeners() {
    const nextButton: HTMLElement = this.el.querySelector(
      ".openinghours--next",
    );
    const prevButton: HTMLElement = this.el.querySelector(
      ".openinghours--prev",
    );

    if (nextButton && prevButton) {
      nextButton.removeEventListener("click", async () => {
        this.fetchNewMonthData("plus");
      });

      prevButton.removeEventListener("click", () => {
        this.fetchNewMonthData("minus");
      });
    }
  }

  private async setNextPrevMonthListeners() {
    const nextButton: HTMLElement = this.el.querySelector(
      ".openinghours--next",
    );
    const prevButton: HTMLElement = this.el.querySelector(
      ".openinghours--prev",
    );

    if (nextButton && prevButton) {
      nextButton.addEventListener("click", async () => {
        this.fetchNewMonthData("plus");
      });

      prevButton.addEventListener("click", () => {
        this.fetchNewMonthData("minus");
      });
    }
  }

  render() {
    return (
      <div class="opening-hours-accordion">
        <div class="opening-hours-accordion__item">
          <div class="openinghours-wrapper">
            <h3
              class="openinghours-channel-title"
              data-service={this.serviceId}
              data-channel={this.channelId}
            >
              Na afspraak
            </h3>
            <div
              innerHTML={this.hoursInnerHtml}
              class="openinghours-widget"
              data-service={this.serviceId}
              data-channel={this.channelId}
              data-type="day"
              data-once="openingHoursWidget"
              tabindex="-1"
            ></div>
            {this.showAllHours && (
              <div class="accordion" data-once="gent_base_accordion">
                <h3>
                  <button
                    aria-controls="accordion-opening-hours--2"
                    aria-expanded={this.allHoursOpened.toString()}
                    onClick={() => {
                      this.allHoursOpened = !this.allHoursOpened;
                    }}
                    class="accordion--button"
                  >
                    {this.language === "en"
                      ? "All opening hours"
                      : "Alle openingsuren"}
                  </button>
                </h3>

                <div
                  id="accordion-opening-hours--2"
                  class="accordion--content accordion--expanded"
                  hidden={!this.allHoursOpened}
                  aria-hidden={(!this.allHoursOpened).toString()}
                >
                  <div class="tabs">
                    <ul class="openinghours-navigation" role="tablist">
                      <li role="presentation">
                        <a
                          href="#"
                          role="tab"
                          aria-controls="opening-hours--1"
                          aria-selected={
                            this.expandedView === "week-from-now"
                              ? "true"
                              : "false"
                          }
                          data-widget="week-from-now"
                          onClick={() => {
                            this.setExpandedView("week-from-now");
                          }}
                        >
                          {this.language === "en" ? "This week" : "Deze week"}
                        </a>
                      </li>
                      <li role="presentation">
                        <a
                          href="#"
                          role="tab"
                          aria-controls="opening-hours--2"
                          aria-selected={
                            this.expandedView !== "week-from-now"
                              ? "true"
                              : "false"
                          }
                          data-widget="month"
                          onClick={() => {
                            this.setExpandedView("month");
                          }}
                        >
                          {this.language === "en" ? "This month" : "Deze maand"}
                        </a>
                      </li>
                    </ul>

                    <div id="opening-hours--2" role="tabpanel">
                      <div
                        id="openinghours-div"
                        class="openinghours openinghours-widget"
                        data-type={this.expandedView}
                        data-service={this.serviceId}
                        data-channel={this.channelId}
                        data-once="openingHoursWidget"
                        tabindex="-1"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
