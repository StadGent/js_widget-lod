import { Component, h } from "@stencil/core";

@Component({
  tag: "lod-processing-register-sidebar-skeleton",
  shadow: false,
})
export class LodProcessingRegisterSidebarSkeleton {
  render() {
    return (
      <div class="skeleton-container" aria-hidden="true">
        <div>
          <div class="skeleton skeleton-h2"></div>
          <div class="skeleton skeleton-h3-short"></div>
          <div class="skeleton skeleton-h2"></div>
        </div>
        <div>
          <div class="skeleton skeleton-h3"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-short"></div>
        </div>
        <div>
          <div class="skeleton skeleton-h3"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-short"></div>
        </div>
        <div>
          <div class="skeleton skeleton-h3"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-short"></div>
        </div>
        <div>
          <div class="skeleton skeleton-h3"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-short"></div>
        </div>
        <div>
          <div class="skeleton skeleton-h3"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-long"></div>
          <div class="skeleton skeleton-h3-short"></div>
        </div>

        <div class="skeleton skeleton-h3-short"></div>
      </div>
    );
  }
}
