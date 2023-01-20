package com.stanley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.drew.lang.annotations.Nullable;
import com.stanley.core.models.Header;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
  adaptables = SlingHttpServletRequest.class,
  adapters = {Header.class, ComponentExporter.class},
  resourceType = HeaderImpl.RESOURCE_TYPE,
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter( //Exporter annotation that serializes the modoel as JSON
  name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
  extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class HeaderImpl implements Header {
  static final String RESOURCE_TYPE = "stanley/components/header";

  @ValueMapValue
  @Nullable
  private String homePage;

  @Self
  private SlingHttpServletRequest request;

  @Override
  public String getHomePage() {
    PageManager pageManager = this.request.getResourceResolver().adaptTo(PageManager.class);
    if (!StringUtils.isEmpty(homePage) && pageManager != null) {
      Page page = pageManager.getPage(homePage);
      if (page != null) {
        String vanityURL = page.getVanityUrl();
        return StringUtils.isEmpty(vanityURL) ? (request.getContextPath() + page.getPath() + ".html")
          : (request.getContextPath() + vanityURL);
      }
    }
    return homePage;
  }

  @Override
  public String getExportedType() {
    return HeaderImpl.RESOURCE_TYPE;
  }
}
