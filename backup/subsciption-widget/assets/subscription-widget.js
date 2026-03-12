// assets/subscription-widget.js

// Library Loading and Initialization (Appstle-style)
(function() {
  var head = document.getElementsByTagName("head")[0];

  // Load jQuery if not present
  if (!window.jQuery) {
    var jqueryScript = document.createElement("script");
    jqueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
    jqueryScript.type = "text/javascript";
    head.appendChild(jqueryScript);
  }

  // Load Mustache if not present
  if (!window.Mustache) {
    var mustacheScript = document.createElement("script");
    mustacheScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.1.0/mustache.js";
    mustacheScript.type = "text/javascript";
    head.appendChild(mustacheScript);
  }

  // Load DOMPurify if not present
  if (!window.DOMPurify) {
    var purifyScript = document.createElement("script");
    purifyScript.src = "https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js";
    purifyScript.type = "text/javascript";
    head.appendChild(purifyScript);
  }

  // Load IonIcons
  var ioniconsScript = document.createElement("script");
  ioniconsScript.src = "https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
  ioniconsScript.type = "module";
  head.appendChild(ioniconsScript);
})();

// Utility functions for variant detection and selling plan processing
function detectVariant(form, config) {
  if (window.self !== window.top) return null;

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const variantParam = urlParams.get("variant");
  if (variantParam && config.detectVariantFromURLParams) {
    return config.variantsById ? config.variantsById[variantParam] : null;
  }

  // Check form inputs
  const variantInputs = form.find('input[name="id"]:checked');
  if (variantInputs.length > 0) {
    const variantId = variantInputs.val();
    return config.variantsById ? config.variantsById[variantId] : null;
  }

  // Check select elements
  const variantSelect = form.find('select[name="id"]');
  if (variantSelect.length > 0 && variantSelect.val()) {
    const variantId = variantSelect.val();
    return config.variantsById ? config.variantsById[variantId] : null;
  }

  return null;
}

function getSellingPlanAllocation(variant, sellingPlanId) {
  if (!variant || !variant.selling_plan_allocations) return null;
  return variant.selling_plan_allocations.find(allocation =>
    allocation.selling_plan_id === sellingPlanId
  );
}

function isSellingPlanVisible(sellingPlanId, config) {
  // Check customer tags and selling plan visibility rules
  const customerTags = config.customerTags || [];
  const memberOnlyPlans = config.memberOnlySellingPlansJson || {};
  const nonMemberOnlyPlans = config.nonMemberOnlySellingPlansJson || {};

  if (!config.customerId && memberOnlyPlans[sellingPlanId]?.enableMemberInclusiveTag) {
    return false;
  }

  if (config.customerId && nonMemberOnlyPlans[sellingPlanId]) {
    return false;
  }

  // Check member inclusive/exclusive tags
  if (config.customerId && memberOnlyPlans[sellingPlanId]) {
    const plan = memberOnlyPlans[sellingPlanId];
    if (plan.memberInclusiveTags) {
      const inclusiveTags = plan.memberInclusiveTags.split(',').map(tag => tag.trim());
      const hasMatchingTag = inclusiveTags.some(tag => customerTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    if (plan.memberExclusiveTags) {
      const exclusiveTags = plan.memberExclusiveTags.split(',').map(tag => tag.trim());
      const hasExclusiveTag = exclusiveTags.some(tag => customerTags.includes(tag));
      if (hasExclusiveTag) return false;
    }
  }

  return true;
}

// Cart integration functions
async function updateCartWithSellingPlan(cartData, sellingPlanId, quantity = 1) {
  const formData = new FormData();
  formData.append('id', cartData.key);
  formData.append('quantity', quantity);
  if (sellingPlanId) {
    formData.append('selling_plan', sellingPlanId);
  }

  return fetch('/cart/change.js', {
    method: 'POST',
    body: formData
  }).then(response => response.json());
}

function listenToCartChanges(callback) {
  // Override XMLHttpRequest to listen for cart changes
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this.addEventListener('load', function() {
      if (url.includes('/cart/') && (url.includes('add') || url.includes('change'))) {
        callback();
      }
    });
    return originalOpen.apply(this, arguments);
  };

  // Also listen to fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).then(response => {
      if (args[0] && typeof args[0] === 'string' &&
          args[0].includes('/cart/') &&
          (args[0].includes('add') || args[0].includes('change'))) {
        callback();
      }
      return response;
    });
  };
}

// Dynamic Widget Configuration Interface
if (typeof window.WidgetConfig === 'undefined') {
  window.WidgetConfig = class WidgetConfig {
    constructor(data) {
      // Read widget style from data-widget-style attribute if available
      this.widgetStyle = data.widgetStyle || data.settings?.widgetStyle || 'luminic';
      this.customizationData = data.customization || {};
      this.labelsData = data.labels || {};
      this.settingsData = data.settings || {};
      this.productData = {
        id: data.productId,
        price: data.productPrice || 29.99,
        options: [
          { id: 'oneTime', price: data.productPrice || 29.99 },
          { id: 'subscribe', price: (data.productPrice || 29.99) * 0.9, discountedPrice: (data.productPrice || 29.99) * 0.9, originalPrice: data.productPrice || 29.99, badge: true }
        ]
      };
      // Ensure frequencyOptions is always an array
      this.frequencyOptions = Array.isArray(data.frequencyOptions) && data.frequencyOptions.length > 0
        ? data.frequencyOptions
        : [
            { value: '30', label: 'Every 30 days', discount: 10 },
            { value: '60', label: 'Every 60 days', discount: 15 },
            { value: '90', label: 'Every 90 days', discount: 20 }
          ];
    }
  };
}

// Metafield Integration Layer - No API calls needed!
window.SubscriptionWidgetMetafields = function(element) {
  this.element = element;
  this.productId = element.dataset.productId;
  this.shopDomain = element.dataset.shopDomain;

  // Read configuration from data attributes (populated by Liquid metafields)
  this.settings = this.parseJsonData(element.dataset.configSettings);
  this.customization = this.parseJsonData(element.dataset.configCustomization);
  this.labels = this.parseJsonData(element.dataset.configLabels);

  // Additional data for enhanced functionality
  this.productVariants = this.parseJsonData(element.dataset.productVariants);
  this.sellingPlanGroups = this.parseJsonData(element.dataset.sellingPlanGroups);
  this.sellingPlansJson = this.parseJsonData(element.dataset.sellingPlansJson);
  this.customerId = element.dataset.customerId;
  this.customerTags = element.dataset.customerTags ? element.dataset.customerTags.split(',') : [];
};

window.SubscriptionWidgetMetafields.prototype.parseJsonData = function(dataString) {
  if (!dataString || dataString === '{}' || dataString === 'null' || dataString === '') {
    return {};
  }
  try {
    // Handle HTML entity encoding - decode common entities
    const decodedString = dataString
      .replace(/"/g, '"')
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/'/g, "'")
      .replace(/'/g, "'");
    return JSON.parse(decodedString);
  } catch (error) {
    console.warn('Failed to parse metafield data:', error, 'Data:', dataString);
    // Try to provide fallback values
    return {};
  }
};

// Get frequency options from data attribute
window.SubscriptionWidgetMetafields.prototype.getFrequencyOptions = function() {
  const widgetElement = this.element;
  const frequencyOptionsData = widgetElement.dataset.frequencyOptions;
  console.log('🔍 Raw frequency options data:', frequencyOptionsData);

  if (frequencyOptionsData) {
    try {
      const parsed = JSON.parse(frequencyOptionsData);
      console.log('✅ Parsed frequency options:', parsed);

      // Ensure it's an array
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      } else {
        console.warn('Parsed frequency options is not a valid array or is empty');
      }
    } catch (error) {
      console.error('❌ Failed to parse frequency options:', error, 'Data:', frequencyOptionsData);
    }
  } else {
    console.warn('No frequency options data found in dataset');
  }

  // Fallback to default options
  const defaultOptions = [
    { value: '30', label: 'Every 30 days', discount: 10 },
    { value: '60', label: 'Every 60 days', discount: 15 },
    { value: '90', label: 'Every 90 days', discount: 20 }
  ];
  console.log('⚠️ Using fallback frequency options:', defaultOptions);
  return defaultOptions;
};

// Get shop currency from data attribute
window.SubscriptionWidgetMetafields.prototype.getShopCurrency = function() {
  const widgetElement = this.element;
  return widgetElement.dataset.shopCurrency || '$';
};

window.SubscriptionWidgetMetafields.prototype.getWidgetConfig = function(productId) {
  // Get product price from data attribute
  const productPrice = parseFloat(this.element.dataset.productPrice) || 29.99;
  // Get shop currency
  const shopCurrency = this.getShopCurrency();

  // Get dynamic frequency options from data attribute
  const frequencyOptions = this.getFrequencyOptions();

  // Get widget style from data attribute
  const widgetStyle = this.element.dataset.widgetStyle || 'luminic';

  // Create configuration from metafields
  const config = new window.WidgetConfig({
    settings: this.settings,
    customization: this.customization,
    labels: this.labels,
    productId: productId,
    productPrice: productPrice,
    shopCurrency: shopCurrency,
    frequencyOptions: frequencyOptions,
    widgetStyle: widgetStyle
  });

  // Add enhanced data for Appstle-like functionality
  config.productData = {
    id: productId,
    price: productPrice,
    variants: this.productVariants || [],
    selling_plan_groups: this.sellingPlanGroups || []
  };

  config.sellingPlansJson = this.sellingPlansJson || [];
  config.customerId = this.customerId;
  config.customerTags = this.customerTags;
  config.shopCurrency = shopCurrency;
  config.detectVariantFromURLParams = this.settings?.detectVariantFromURLParams || false;
  config.showPrepaidPlanSeparately = this.settings?.showPrepaidPlanSeparately || false;
  config.memberOnlySellingPlansJson = this.settings?.memberOnlySellingPlansJson || {};
  config.nonMemberOnlySellingPlansJson = this.settings?.nonMemberOnlySellingPlansJson || {};

  return config;
};

// Fetch widget data from APIs and log responses
window.SubscriptionWidgetMetafields.prototype.fetchWidgetData = async function() {
  const baseUrl = window.location.origin;

  try {
    console.log('🔄 Fetching subscription widget settings, labels, and customization data...');

    // Fetch settings via app proxy
    const settingsResponse = await fetch(`${baseUrl}/apps/metafields/settings`);
    const settings = await settingsResponse.json();
    console.log('✅ Widget Settings:', settings);

    // Fetch labels via app proxy
    const labelsResponse = await fetch(`${baseUrl}/apps/metafields/labels`);
    const labels = await labelsResponse.json();
    console.log('✅ Widget Labels:', labels);

    // Fetch customization via app proxy
    const customizationResponse = await fetch(`${baseUrl}/apps/metafields/customization`);
    const customization = await customizationResponse.json();
    console.log('✅ Widget Customization:', customization);

    console.log('🎉 All widget data fetched successfully for dynamic configuration');

    return {
      settings,
      labels,
      customization
    };
  } catch (error) {
    console.error('❌ Error fetching widget data:', error);
    return null;
  }
};

// Single Source of Truth Widget Renderer
class DynamicSubscriptionWidget {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.state = {
      purchase: config.settingsData.preselect || 'oneTime',
      frequency: config.frequencyOptions && config.frequencyOptions.length > 0 ? config.frequencyOptions[0].value : '',
      infoActive: false,
      currentVariant: null,
      sellingPlanVariants: []
    };
    this.productForm = this.findProductForm();

    // Ensure product ID is available
    if (!this.config.productData.id) {
      this.config.productData.id = this.findProductId();
    }

    this.init();
  }

  init() {
    // Process product variants and selling plans
    this.processProductData();

    // Detect current variant
    this.detectCurrentVariant();

    // Set up cart change listeners
    this.setupCartListeners();

    // Load selling plan variants
    this.loadSellingPlanVariants();
  }

  findProductForm() {
    // Find the product form (similar to Appstle's approach)
    const $ = window.jQuery || window.appstle_jQuery;
    if (!$) return null;

    return $(this.container).closest('form[action$="/cart/add"]') ||
            $('form[action$="/cart/add"]').first();
  }

  findProductId() {
    // Try multiple sources to find product ID

    // 1. Widget container data attribute
    if (this.container.dataset.productId) {
      return this.container.dataset.productId;
    }

    // 2. Shopify product object
    if (window.Shopify && window.Shopify.product && window.Shopify.product.id) {
      return window.Shopify.product.id.toString();
    }

    // 3. URL parameter (for product pages)
    const urlParams = new URLSearchParams(window.location.search);
    const productHandle = urlParams.get('product');
    if (productHandle) {
      // Try to find product by handle in Shopify data
      if (window.Shopify && window.Shopify.products) {
        const product = Object.values(window.Shopify.products).find(p =>
          p.handle === productHandle
        );
        if (product) {
          return product.id.toString();
        }
      }
    }

    // 4. Product form input
    if (this.productForm) {
      const productIdInput = this.productForm.find('input[name="id"]');
      if (productIdInput.length > 0 && productIdInput.val()) {
        return productIdInput.val();
      }
    }

    // 5. Meta tag
    const productMeta = document.querySelector('meta[property="og:product:id"]') ||
                       document.querySelector('meta[name="product:id"]');
    if (productMeta && productMeta.content) {
      return productMeta.content;
    }

    // 6. Body data attribute (Shopify theme standard)
    if (document.body.dataset.productId) {
      return document.body.dataset.productId;
    }

    // 7. JSON-LD structured data
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      try {
        const jsonLd = JSON.parse(jsonLdScript.textContent);
        if (jsonLd && jsonLd['@type'] === 'Product' && jsonLd.productID) {
          return jsonLd.productID.toString();
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    return null;
  }

  processProductData() {
    // Process variants by title and ID (Appstle-style)
    if (this.config.productData && this.config.productData.variants && Array.isArray(this.config.productData.variants)) {
      const variants = this.config.productData.variants;
      this.config.variantsByTitle = {};
      this.config.variantsById = {};

      variants.forEach(variant => {
        this.config.variantsByTitle[variant.title] = variant;
        this.config.variantsById[variant.id] = variant;
      });
    }
  }

  detectCurrentVariant() {
    if (this.productForm && this.productForm.length > 0) {
      this.state.currentVariant = detectVariant(this.productForm, this.config);
    }
  }

  setupCartListeners() {
    listenToCartChanges(() => {
      this.handleCartChange();
    });
  }

  handleCartChange() {
    // Refresh variant detection and update widget
    this.detectCurrentVariant();
    this.loadSellingPlanVariants();
    this.render();
  }

  loadSellingPlanVariants() {
    if (!this.config.productData || !this.config.productData.selling_plan_groups) {
      return;
    }

    const sellingPlanVariants = [];
    const product = this.config.productData;

    if (product.selling_plan_groups && Array.isArray(product.selling_plan_groups)) {
      product.selling_plan_groups.forEach(group => {
        if (group.app_id === 'appstle') {
          if (group.selling_plans && Array.isArray(group.selling_plans)) {
            group.selling_plans.forEach(plan => {
              if (isSellingPlanVisible(plan.id, this.config)) {
                const allocation = getSellingPlanAllocation(this.state.currentVariant, plan.id);
                if (allocation) {
                  const variant = this.processSellingPlanVariant(plan, allocation);
                  if (variant) {
                    sellingPlanVariants.push(variant);
                  }
                }
              }
            });
          }
        }
      });
    }

    // Sort by frequency sequence
    sellingPlanVariants.sort((a, b) => (a.frequencySequence || 0) - (b.frequencySequence || 0));

    this.state.sellingPlanVariants = sellingPlanVariants;
  }

  processSellingPlanVariant(plan, allocation) {
    const price = allocation.per_delivery_price;
    const totalPrice = allocation.price;
    const formattedPrice = this.formatPrice(price);
    const formattedTotalPrice = this.formatPrice(totalPrice);

    // Get selling plan details from config
    const planDetails = this.getSellingPlanDetails(plan.id);

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      sellingPlanId: plan.id,
      formattedPrice: formattedPrice,
      price: price,
      totalPrice: totalPrice,
      formattedTotalPrice: formattedTotalPrice,
      isFreeTrial: price === 0,
      discountText: this.calculateDiscountText(plan, allocation),
      formattedDiscountText: this.buildDiscountText(this.calculateDiscountText(plan, allocation)),
      ...planDetails
    };
  }

  getSellingPlanDetails(planId) {
    // Get details from sellingPlansJson in config
    if (this.config.sellingPlansJson) {
      return this.config.sellingPlansJson.find(plan =>
        plan.id.split('/').pop() === planId.toString()
      ) || {};
    }
    return {};
  }

  calculateDiscountText(plan, allocation) {
    if (!plan.price_adjustments || plan.price_adjustments.length === 0) {
      return null;
    }

    const adjustment = plan.price_adjustments[0];
    if (adjustment.value_type === 'percentage') {
      return adjustment.value + '%';
    } else {
      return this.formatPrice(adjustment.value);
    }
  }

  buildDiscountText(discountText) {
    if (!discountText) return '';
    return `<span class="discount-text">${discountText} off</span>`;
  }

  formatPrice(price) {
    const currencySymbol = this.config.shopCurrency || '$';
    return `${currencySymbol}${(price / 100).toFixed(2)}`;
  }

  // Main render method - single source of truth
  render() {
    try {
      // Ensure config has required properties
      if (!this.config) {
        console.error('Config is undefined');
        this.showError('Widget configuration is missing');
        return;
      }

      if (!this.config.settingsData) {
        this.config.settingsData = {};
      }

      if (!this.config.labelsData) {
        this.config.labelsData = {};
      }

      if (!this.config.customizationData) {
        this.config.customizationData = {};
      }

      if (!this.config.productData) {
        this.config.productData = { id: 'unknown', price: 29.99 };
      }

      if (!this.config.settingsData.showOnProductPages) {
        this.container.innerHTML = '';
        return;
      }

      // Use Mustache for templating if available
      const templateData = {
        widgetId: this.config.productData.id,
        priceDisplay: this.renderPriceDisplay(),
        purchaseOptionsHeading: this.config.labelsData.purchaseOptionsHeading || 'Purchase Options',
        widgetPadding: this.config.customizationData.widgetPadding || 0,
        purchaseOptions: this.renderPurchaseOptions(),
        tooltip: this.renderTooltip(),
        hasSellingPlans: this.state.sellingPlanVariants.length > 0
      };

    let html;
    if (window.Mustache) {
      const template = `
        <div class="subscription-widget" data-widget-id="{{widgetId}}">
          {{{priceDisplay}}}

          <div style="padding-top: 0.5rem; font-size: 14px;">
            <p>{{purchaseOptionsHeading}}</p>
          </div>

          <div style="padding-top: 0.5rem; padding: {{widgetPadding}}px;">
            {{{purchaseOptions}}}
          </div>

          {{{tooltip}}}
        </div>
      `;
      html = window.Mustache.render(template, templateData);
    } else {
      html = `
        <div class="subscription-widget" data-widget-id="${this.config.productData.id}">
          ${this.renderPriceDisplay()}

          <div style="padding-top: 0.5rem; font-size: 14px;">
            <p>${this.config.labelsData.purchaseOptionsHeading || 'Purchase Options'}</p>
          </div>

          <div style="padding-top: 0.5rem; padding: ${this.config.customizationData.widgetPadding || 0}px;">
            ${this.renderPurchaseOptions()}
          </div>

          ${this.renderTooltip()}
        </div>
      `;
    }

    this.container.innerHTML = html;

    this.attachEventListeners();
    this.applyDynamicStyles();

    } catch (error) {
      console.error('Error rendering widget:', error);
      this.showError('Failed to render subscription widget: ' + error.message);
    }
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="subscription-widget__error" style="padding: 16px; color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px;">${message}</p>
      </div>
    `;
  }

  renderPriceDisplay() {
    const { productData, frequencyOptions, customizationData } = this.config;
    // Ensure frequencyOptions is an array
    const safeFrequencyOptions = Array.isArray(frequencyOptions) ? frequencyOptions : [];
    const selectedFreq = safeFrequencyOptions.find(f => f.value === this.state.frequency);
    const discount = selectedFreq?.discount || 0;
    const basePrice = this.getRealProductPrice();
    const discountedPrice = this.calculateDiscountedPrice(basePrice, discount);
    const currencySymbol = this.config.shopCurrency || '$';

    if (this.state.purchase === 'subscribe' && this.state.frequency) {
      return `
        <div style="padding-top: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.125rem; font-weight: 600; color: black;">
              ${currencySymbol}${discountedPrice}
            </span>

            ${!customizationData.hideDiscountBadge && discount > 0 ? `
              <span style="border-radius: 9999px; background-color: rgb(220 252 231); padding: 0.125rem 0.625rem; font-size: 0.75rem; font-weight: 500; color: rgb(22 101 52);">
                ${discount}% OFF
              </span>
            ` : ''}

            <span style="font-size: 0.875rem; color: rgb(107 114 128); text-decoration: line-through;">
              ${currencySymbol}${basePrice}
            </span>
          </div>
        </div>
      `;
    }

    return `
      <div style="padding-top: 1rem;">
        <div style="font-size: 1.125rem; font-weight: 600; color: black;">
          ${currencySymbol}${basePrice}
        </div>
      </div>
    `;
  }


  renderPurchaseOptions() {
    const { widgetStyle } = this.config;

    try {
      switch (widgetStyle) {
        case 'classic':
          return this.renderClassicStyle();
        case 'luminic':
          return this.renderLuminicStyle();
        case 'compact':
          return this.renderCompactStyle();
        case 'grid':
          return this.renderGridStyle();
        case 'grid-savings':
          return this.renderGridSavingsStyle();
        case 'button':
          return this.renderButtonStyle();
        case 'stacked':
          return this.renderStackedStyle();
        default:
          return this.renderLuminicStyle();
      }
    } catch (error) {
      console.error('Error rendering purchase options:', error);
      // Fallback to basic options
      return this.renderFallbackOptions();
    }
  }

  renderFallbackOptions() {
    const basePrice = this.getRealProductPrice();
    const currencySymbol = this.config.shopCurrency || '$';

    return `
      <div class="subscription-widget__options">
        <div class="subscription-widget__option">
          <label>
            <input type="radio" name="purchase-option" value="oneTime" checked>
            <span>One-time purchase - ${currencySymbol}${basePrice}</span>
          </label>
        </div>
        <div class="subscription-widget__option">
          <label>
            <input type="radio" name="purchase-option" value="subscribe">
            <span>Subscribe & Save - ${currencySymbol}${(basePrice * 0.9).toFixed(2)}</span>
          </label>
        </div>
      </div>
    `;
  }

  renderClassicStyle() {
    try {
      console.log('🎨 Rendering classic style...');

      const { productData, customizationData, labelsData, frequencyOptions } = this.config;

      console.log('📦 Product data in render:', productData);
      console.log('⚙️ Customization data:', customizationData);
      console.log('🏷️ Labels data:', labelsData);
      console.log('📅 Frequency options:', frequencyOptions);

      // Ensure frequencyOptions is an array
      const safeFrequencyOptions = Array.isArray(frequencyOptions) ? frequencyOptions : [];
      console.log('✅ Safe frequency options:', safeFrequencyOptions);

      // Ensure productData.options is an array
      const safeOptions = Array.isArray(productData?.options) ? productData.options : [
        { id: 'oneTime', price: productData?.price || 29.99, label: 'One-time purchase' },
        { id: 'subscribe', price: (productData?.price || 29.99) * 0.9, discountedPrice: (productData?.price || 29.99) * 0.9, originalPrice: productData?.price || 29.99, badge: true, label: 'Subscribe & Save' }
      ];

      console.log('✅ Safe options:', safeOptions);

      const optionsHtml = safeOptions.map(option => {
        console.log('🔄 Processing option:', option);

        const isSelected = this.state.purchase === option.id;
        const optionHtml = `
          <div class="subscription-widget__option ${isSelected ? 'subscription-widget__option--selected' : ''}" data-option="${option.id}">
            <div class="subscription-widget__option-content">
              <label class="subscription-widget__option-label">
                <div class="subscription-widget__option-left">
                  <input type="radio" name="purchase-option" value="${option.id}" ${isSelected ? 'checked' : ''} />
                  <div class="subscription-widget__option-text">
                    <span class="subscription-widget__option-title">
                      ${option.badge ? `
                        <div class="subscription-widget__option-header">
                          <span class="subscription-widget__option-main-label">
                            ${labelsData?.subscriptionPurchaseLabel || option.label || 'Subscribe & Save'}
                          </span>
                          ${!customizationData?.hideDiscountBadge ? `
                            <span class="subscription-widget__badge">
                              ${this.formatLabel(labelsData?.discountBadgeFormat || 'SAVE {{selectedDiscountPercentage}}%', { selectedDiscountPercentage: this.state.frequency ? safeFrequencyOptions.find(f => f.value === this.state.frequency)?.discount || '10' : '10' })}
                            </span>
                          ` : ''}
                        </div>
                      ` : `
                        <span class="subscription-widget__option-main-label">
                          ${labelsData?.oneTimePurchaseLabel || option.label || 'One-time purchase'}
                        </span>
                      `}
                    </span>
                    ${((option.id === "oneTime" && labelsData?.oneTimePurchaseSubtext) || (option.id === "subscribe" && labelsData?.subscriptionPurchaseSubtext)) ? `
                      <span class="subscription-widget__option-subtext">
                        ${option.id === "oneTime" ? labelsData.oneTimePurchaseSubtext : labelsData.subscriptionPurchaseSubtext}
                      </span>
                    ` : ''}
                  </div>
                </div>
                <div class="subscription-widget__option-right">
                  ${option.id === 'subscribe' ? `
                    <div class="subscription-widget__price-container">
                      <span class="subscription-widget__price--original">
                        ${this.formatPrice(option.originalPrice * 100)}
                      </span>
                      <span class="subscription-widget__price">
                        ${this.state.frequency ? this.formatPrice(this.calculateDiscountedPrice(option.originalPrice, safeFrequencyOptions.find(f => f.value === this.state.frequency)?.discount || 10) * 100) : this.formatPrice(option.discountedPrice * 100)}
                      </span>
                    </div>
                  ` : `
                    <div class="subscription-widget__price-container">
                      <span class="subscription-widget__price">
                        ${this.formatLabel(labelsData?.oneTimePriceFormat || '{{price}}', { price: option.price })}
                      </span>
                    </div>
                  `}
                </div>
              </label>
            </div>
            ${option.id === 'subscribe' && (this.state.purchase === 'subscribe' || this.state.frequency) ? `
              <div class="subscription-widget__frequency">
                <label class="subscription-widget__frequency-label">
                  ${labelsData?.deliveryFrequencyLabel || 'Delivery every'}
                </label>
                <div class="subscription-widget__frequency-options">
                  ${safeFrequencyOptions.map(freq => `
                    <label class="subscription-widget__frequency-option">
                      <input type="radio" name="frequency" value="${freq.value}" ${this.state.frequency === freq.value ? 'checked' : ''} />
                      <span>${freq.label}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;

        console.log('✅ Generated option HTML for:', option.id);
        return optionHtml;
      }).join('');

      console.log('✅ Generated all options HTML');

      const result = `
        <div class="subscription-widget__options" role="radiogroup" aria-label="Purchase options">
          ${optionsHtml}
        </div>
      `;

      console.log('✅ Classic style rendered successfully');
      return result;

    } catch (error) {
      console.error('❌ Error in renderClassicStyle:', error);
      return `
        <div class="subscription-widget__options">
          <div class="subscription-widget__option">
            <label>
              <input type="radio" name="purchase-option" value="oneTime" checked>
              <span>One-time purchase - $${this.config?.productData?.price || 29.99}</span>
            </label>
          </div>
          <div class="subscription-widget__option">
            <label>
              <input type="radio" name="purchase-option" value="subscribe">
              <span>Subscribe & Save - $${((this.config?.productData?.price || 29.99) * 0.9).toFixed(2)}</span>
            </label>
          </div>
        </div>
      `;
    }
  }

renderLuminicStyle(){
    // Luminic style is similar to classic but with modern styling
    return this.renderClassicStyle().replace('classic-style', 'luminic-style');
  }

  renderCompactStyle() {
    return this.renderClassicStyle().replace('classic-style', 'compact-style');
  }

  renderGridStyle() {
    const { productData, customizationData, frequencyOptions } = this.config;
    // Ensure frequencyOptions is an array
    const safeFrequencyOptions = Array.isArray(frequencyOptions) ? frequencyOptions : [];
    const basePrice = this.getRealProductPrice();
    const currencySymbol = this.config.shopCurrency || '$';

    return `
      <div class="options-container grid-style grid grid-cols-1 sm:grid-cols-2"
            style="gap: ${customizationData?.optionSpacing || 8}px">

        <!-- One-time purchase -->
        <div class="option-item grid-item ${this.state.purchase === 'oneTime' ? 'selected' : ''}"
              data-option-id="oneTime"
              style="border-width: ${customizationData?.borderWidth || 1}px;
                    border-radius: ${customizationData?.borderRadius || 12}px">
          <span class="option-label">${this.config.labelsData?.oneTimePurchaseLabel || 'One-time purchase'}</span>
          <span class="option-price">${currencySymbol}${basePrice}</span>
        </div>

        <!-- Subscription frequencies -->
        ${safeFrequencyOptions.map(freq => `
          <div class="option-item grid-item ${this.state.purchase === 'subscribe' && this.state.frequency === freq.value ? 'selected' : ''}"
                data-option-id="subscribe"
                data-frequency="${freq.value}"
                style="border-width: ${customizationData.borderWidth || 1}px;
                      border-radius: ${customizationData.borderRadius || 12}px">
            <span class="option-label"
                  style="font-size: ${customizationData.labelTextSize || 14}px">
              ${freq.label}
            </span>
            <span class="option-price">
              ${currencySymbol}${this.calculateDiscountedPrice(basePrice, freq.discount)}
            </span>
            ${freq.discount > 0 ? `<span class="discount-info">(${freq.discount}% off)</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  renderGridSavingsStyle() {
    return this.renderGridStyle().replace('grid-style', 'grid-savings-style');
  }

  renderButtonStyle() {
    return this.renderGridStyle().replace('grid-style', 'button-style');
  }

  renderStackedStyle() {
    return this.renderClassicStyle().replace('classic-style', 'stacked-style');
  }

  renderTooltip() {
    const { labelsData, customizationData, settingsData } = this.config;

    if (!labelsData.tooltipTitle || !settingsData.tooltipIcon) return '';

    const showTooltipOnlyWhenSelected = customizationData.showTooltipsOnlyWhenSelected;
    const shouldShowTooltip = showTooltipOnlyWhenSelected
      ? (this.state.purchase === 'subscribe' || settingsData.preselect)
      : true;

    if (!shouldShowTooltip) return '';

    if (settingsData.alwaysShowInfo) {
      return `
        <div style="max-width: 300px; border-radius: 0.375rem; padding: 0.5rem; font-family: sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.2); font-size: 0.875rem; line-height: 1.25rem; background-color: ${customizationData.tooltipBackgroundColor || 'black'}; color: ${customizationData.tooltipTextColor || 'white'};">
          <div>${labelsData.defaultTooltipDescription || ''}</div>
        </div>
      `;
    }

    return `
      <div style="padding-top: 1rem;">
        <button style="display: flex; align-items: center; font-size: 0.875rem; color: rgb(75 85 99); cursor: pointer;" onclick="this.closest('.subscription-widget').querySelector('.tooltip-content').classList.toggle('active')">
          <svg style="margin-right: 0.25rem; height: 1.5rem; width: 1.5rem; fill: currentColor;" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          ${labelsData.tooltipTitle}
        </button>

        <div class="tooltip-content" style="max-width: 300px; border-radius: 0.375rem; padding: 0.5rem; font-family: sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.2); font-size: 0.875rem; line-height: 1.25rem; background-color: ${customizationData.tooltipBackgroundColor || 'black'}; color: ${customizationData.tooltipTextColor || 'white'};">
          <div>${labelsData.defaultTooltipDescription || ''}</div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Purchase option change - handle radio button clicks
    this.container.querySelectorAll('input[name="purchase-option"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target;
        const optionId = target.value;

        this.state.purchase = optionId;
        if (optionId === 'oneTime') {
          this.state.frequency = '';
        }

        this.render();
        this.onStateChange();
      });
    });

    // Frequency change
    this.container.querySelectorAll('input[name="frequency"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target;
        this.state.frequency = target.value;
        // When frequency is selected, ensure subscription is selected
        if (this.state.purchase !== 'subscribe') {
          this.state.purchase = 'subscribe';
        }
        this.render();
        this.onStateChange();
      });
    });

    // Grid style click handling
    this.container.addEventListener('click', (e) => {
      const gridItem = e.target.closest('.grid-item');
      if (gridItem) {
        const optionId = gridItem.dataset.optionId;
        const frequency = gridItem.dataset.frequency;

        if (optionId === 'oneTime') {
          this.state.purchase = 'oneTime';
          this.state.frequency = '';
        } else if (optionId === 'subscribe' && frequency) {
          this.state.purchase = 'subscribe';
          this.state.frequency = frequency;
        }

        this.render();
        this.onStateChange();
      }
    });

    // Tooltip toggle
    const tooltipButtons = this.container.querySelectorAll('button');
    tooltipButtons.forEach(button => {
      if (button.textContent.includes(this.config.labelsData.tooltipTitle || 'Subscription detail')) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const tooltipContent = this.container.querySelector('.tooltip-content');
          if (tooltipContent) {
            tooltipContent.classList.toggle('active');
          }
        });
      }
    });
  }

  parseJsonData(dataString) {
    if (!dataString || dataString === '{}' || dataString === 'null' || dataString === '') {
      return {};
    }
    try {
      // Handle HTML entity encoding from Liquid's | escape filter
      // First, decode HTML entities properly
      let decodedString = dataString;

      // Create a temporary element to decode HTML entities
      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = dataString;
        decodedString = textarea.value;
      } else {
        // Fallback for server-side or when document is not available
        decodedString = dataString
          .replace(/"/g, '"')
          .replace(/&/g, '&')
          .replace(/</g, '<')
          .replace(/>/g, '>')
          .replace(/'/g, "'")
          .replace(/'/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/&hellip;/g, '…')
          .replace(/&mdash;/g, '—')
          .replace(/&ndash;/g, '–')
          .replace(/&lsquo;/g, "'")
          .replace(/&rsquo;/g, "'")
          .replace(/&ldquo;/g, '"')
          .replace(/&rdquo;/g, '"');
      }

      const parsed = JSON.parse(decodedString);
      console.log('Successfully parsed metafield data:', parsed);
      return parsed;
    } catch (error) {
      console.warn('Failed to parse widget settings data:', error, 'Data:', dataString);
      // Try to provide fallback values
      return {};
    }
  }

  applyDynamicStyles() {
    try {
      console.log('🎨 Applying dynamic styles from metafields...');

      // Get settings from the widget element (using metafield data attributes)
      const widgetElement = this.container.closest('.subscription-widget');

      if (!widgetElement) {
        console.warn('Widget element not found for dynamic styling');
        this.applyFallbackStyles();
        return;
      }

      // Read customization data from data attributes (populated by Liquid metafields)
      const customizationData = this.parseJsonData(widgetElement.dataset.configCustomization) || {};
      console.log('📊 Customization data:', customizationData);

      // Get widget style
      const widgetStyle = this.config.widgetStyle || 'luminic';

      // Set CSS variables based on customization data from metafields
      const cssVars = `
        --sw-primary-color: ${customizationData.primaryColor || customizationData.borderColor || '#e5e5e5'};
        --sw-background-color: ${customizationData.widgetBackgroundColor || '#ffffff'};
        --sw-text-color: ${customizationData.textColor || '#000000'};
        --sw-price-text-color: ${customizationData.priceTextColor || '#000000'};
        --sw-border-color: ${customizationData.borderColor || '#e5e5e5'};
        --sw-border-radius: ${customizationData.borderRadius || 8}px;
        --sw-border-width: ${customizationData.borderWidth || 1}px;
        --sw-label-text-size: ${customizationData.labelTextSize || 14}px;
        --sw-option-spacing: ${customizationData.optionSpacing || 12}px;
        --sw-widget-padding: ${customizationData.widgetPadding || 0}px;
        --sw-badge-color: ${customizationData.discountBadgeColor || '#dcfce7'};
        --sw-badge-text-color: ${customizationData.discountBadgeTextColor || '#166534'};
        --sw-tooltip-background-color: ${customizationData.tooltipBackgroundColor || '#000000'};
        --sw-tooltip-text-color: ${customizationData.tooltipTextColor || '#ffffff'};
        --sw-compare-price-color: ${customizationData.comparePriceColor || '#666666'};
        --sw-radio-accent-color: ${customizationData.radioButtonColor || '#000000'};
      `;

      console.log('🎨 CSS Variables to apply:', cssVars);

      // Build conditional styles based on widget style
      let conditionalStyles = '';

      // Luminic style - modern styling with shadows and transforms
      if (widgetStyle === 'luminic') {
        conditionalStyles += `
          .subscription-widget .subscription-widget__option,
          .subscription-widget__option {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid var(--sw-border-color) !important;
            border-radius: var(--sw-border-radius) !important;
            background-color: var(--sw-background-color) !important;
            color: var(--sw-text-color) !important;
          }

          .subscription-widget .subscription-widget__option:hover,
          .subscription-widget__option:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            transform: translateY(-1px) !important;
          }

          .subscription-widget .subscription-widget__option--selected,
          .subscription-widget__option--selected {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
            background: linear-gradient(135deg, var(--sw-primary-color), var(--sw-primary-color)) !important;
            color: white !important;
          }
        `;
      }

      // Grid styles
      if (widgetStyle === 'grid' || widgetStyle === 'grid-savings') {
        conditionalStyles += `
          .subscription-widget .subscription-widget__options--grid,
          .subscription-widget__options--grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: var(--sw-option-spacing) !important;
          }

          .subscription-widget .subscription-widget__option--grid,
          .subscription-widget__option--grid {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            min-height: 100px !important;
            padding: 20px !important;
            border: var(--sw-border-width) solid var(--sw-border-color) !important;
            border-radius: var(--sw-border-radius) !important;
            background-color: var(--sw-background-color) !important;
            color: var(--sw-text-color) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }

          .subscription-widget .subscription-widget__option--grid:hover,
          .subscription-widget__option--grid:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .subscription-widget .subscription-widget__option--grid.selected,
          .subscription-widget__option--grid.selected {
            background: linear-gradient(135deg, var(--sw-primary-color), var(--sw-primary-color)) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          }
        `;
      }

      // Button styles
      if (widgetStyle === 'button') {
        conditionalStyles += `
          .subscription-widget .subscription-widget__options--button,
          .subscription-widget__options--button {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
            gap: var(--sw-option-spacing) !important;
          }

          .subscription-widget .subscription-widget__option--button,
          .subscription-widget__option--button {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 50px !important;
            font-weight: 500 !important;
            text-align: center !important;
            border: var(--sw-border-width) solid var(--sw-border-color) !important;
            border-radius: var(--sw-border-radius) !important;
            background-color: var(--sw-background-color) !important;
            color: var(--sw-text-color) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }

          .subscription-widget .subscription-widget__option--button:hover,
          .subscription-widget__option--button:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .subscription-widget .subscription-widget__option--button.selected,
          .subscription-widget__option--button.selected {
            background: linear-gradient(135deg, var(--sw-primary-color), var(--sw-primary-color)) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          }
        `;
      }

      // Stacked styles
      if (widgetStyle === 'stacked') {
        conditionalStyles += `
          .subscription-widget .subscription-widget__option--stacked,
          .subscription-widget__option--stacked {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border: var(--sw-border-width) solid var(--sw-border-color) !important;
            border-radius: var(--sw-border-radius) !important;
            background-color: var(--sw-background-color) !important;
            color: var(--sw-text-color) !important;
            padding: 16px !important;
            margin-bottom: var(--sw-option-spacing) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }

          .subscription-widget .subscription-widget__option--stacked:hover,
          .subscription-widget__option--stacked:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .subscription-widget .subscription-widget__option--stacked.selected,
          .subscription-widget__option--stacked.selected {
            background: linear-gradient(135deg, var(--sw-primary-color), var(--sw-primary-color)) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          }
        `;
      }

      // Classic style (default)
      if (widgetStyle === 'classic') {
        conditionalStyles += `
          .subscription-widget .subscription-widget__option,
          .subscription-widget__option {
            border: var(--sw-border-width) solid var(--sw-border-color) !important;
            border-radius: var(--sw-border-radius) !important;
            background-color: var(--sw-background-color) !important;
            color: var(--sw-text-color) !important;
            padding: 16px !important;
            margin-bottom: var(--sw-option-spacing) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }

          .subscription-widget .subscription-widget__option:hover,
          .subscription-widget__option:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .subscription-widget .subscription-widget__option--selected,
          .subscription-widget__option--selected {
            background: linear-gradient(135deg, var(--sw-primary-color), var(--sw-primary-color)) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          }
        `;
      }

      // Compact style
      if (widgetStyle === 'compact') {
        conditionalStyles += `
          .subscription-widget .subscription-widget__option,
          .subscription-widget__option {
            border: var(--sw-border-width) solid var(--sw-border-color) !important;
            border-radius: var(--sw-border-radius) !important;
            background-color: var(--sw-background-color) !important;
            color: var(--sw-text-color) !important;
            padding: 12px !important;
            margin-bottom: calc(var(--sw-option-spacing) / 2) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            font-size: 13px !important;
          }

          .subscription-widget .subscription-widget__option:hover,
          .subscription-widget__option:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .subscription-widget .subscription-widget__option--selected,
          .subscription-widget__option--selected {
            background: linear-gradient(135deg, var(--sw-primary-color), var(--sw-primary-color)) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          }
        `;
      }

      // Responsive design
      conditionalStyles += `
        @media (max-width: 768px) {
          .subscription-widget__options--grid {
            grid-template-columns: 1fr !important;
          }

          .subscription-widget__options--button {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .grid-style {
            grid-template-columns: 1fr !important;
          }
        }
      `;

      const styles = `
        <style data-widget-styles>
          /* CSS variables for customization */
          .subscription-widget {
            ${cssVars}
          }

          /* Conditional styles based on widget style */
          ${conditionalStyles}

          /* Badge styles */
          .subscription-widget__badge {
            display: inline-block;
            background-color: var(--sw-badge-color);
            color: var(--sw-badge-text-color);
            font-size: 11px;
            font-weight: 500;
            padding: 4px 10px;
            border-radius: 12px;
            margin-top: 4px;
          }

          /* Price styles */
          .subscription-widget__price {
            font-weight: 600;
            color: var(--sw-price-text-color);
          }

          .subscription-widget__price--original {
            text-decoration: line-through;
            color: var(--sw-compare-price-color);
            font-size: 0.875rem;
          }

          /* Tooltip styles */
          .tooltip-content {
            max-width: 300px;
            border-radius: 0.375rem;
            padding: 0.5rem;
            font-family: sans-serif;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            font-size: 0.875rem;
            line-height: 1.25rem;
            background-color: var(--sw-tooltip-background-color);
            color: var(--sw-tooltip-text-color);
            display: none;
          }

          .tooltip-content.active {
            display: block;
          }
        </style>
      `;

      // Remove existing styles
      const existingStyles = this.container.querySelector('[data-widget-styles]');
      if (existingStyles) {
        existingStyles.remove();
      }

      // Add new styles
      this.container.insertAdjacentHTML('beforeend', styles);
      console.log('✅ Dynamic styles applied successfully for style:', widgetStyle);

    } catch (error) {
      console.error('❌ Failed to apply dynamic styles:', error);
      // Apply fallback styles if dynamic styles fail
      this.applyFallbackStyles();
    }
  }

  applyFallbackStyles() {
    const fallbackStyles = `
      <style data-fallback-styles>
        .subscription-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          color: #000000;
        }

        .subscription-widget__loading {
          padding: 20px;
          text-align: center;
        }

        .subscription-widget__options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .subscription-widget__option {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 16px;
          background-color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .subscription-widget__option:hover {
          border-color: #000000;
        }

        .subscription-widget__option input[type="radio"] {
          margin-right: 8px;
        }

        .subscription-widget__price {
          font-weight: 600;
          margin-left: auto;
        }

        .subscription-widget__badge {
          display: inline-block;
          background-color: #dcfce7;
          color: #166534;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 12px;
          margin-top: 4px;
        }

        .subscription-widget__error {
          padding: 16px;
          color: #dc2626;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }
      </style>
    `;

    // Remove existing fallback styles
    const existingFallback = this.container.querySelector('[data-fallback-styles]');
    if (existingFallback) {
      existingFallback.remove();
    }

    // Add fallback styles
    this.container.insertAdjacentHTML('beforeend', fallbackStyles);
  }

  getRealProductPrice() {
    console.log('🔍 getRealProductPrice() - Starting price detection...');

    // Try to get price from various sources
    const widgetElement = this.container.closest('.subscription-widget');

    // 1. Data attribute on widget element
    if (widgetElement && widgetElement.dataset.productPrice) {
      const price = parseFloat(widgetElement.dataset.productPrice).toFixed(2);
      console.log('✅ Found price from widget data attribute:', price);
      return price;
    }

    // 2. Shopify product object
    if (window.Shopify && window.Shopify.product) {
      const price = (window.Shopify.product.price / 100).toFixed(2);
      console.log('✅ Found price from Shopify.product:', price);
      return price;
    }

    // 3. Product form price elements
    if (this.productForm && this.productForm.length > 0) {
      const priceElement = this.productForm.find('[data-product-price], .price, .product-price, .product__price, .price__current');
      if (priceElement.length > 0) {
        const priceText = priceElement.first().text().replace(/[^0-9.]/g, '');
        if (priceText && parseFloat(priceText) > 0) {
          const price = parseFloat(priceText).toFixed(2);
          console.log('✅ Found price from form element:', price);
          return price;
        }
      }

      // Try input fields with price values
      const priceInput = this.productForm.find('input[name*="price"], input[data-price]');
      if (priceInput.length > 0 && priceInput.val()) {
        const price = parseFloat(priceInput.val()).toFixed(2);
        console.log('✅ Found price from form input:', price);
        return price;
      }
    }

    // 4. Global price elements on page
    const globalPriceSelectors = [
      '.product-price',
      '.price',
      '.product__price',
      '.price__current',
      '[data-product-price]',
      '.money'
    ];

    for (const selector of globalPriceSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const priceText = element.textContent.replace(/[^0-9.]/g, '');
        if (priceText && parseFloat(priceText) > 0) {
          const price = parseFloat(priceText).toFixed(2);
          console.log('✅ Found price from global selector', selector + ':', price);
          return price;
        }
      }
    }

    // 5. Meta tags
    const priceMeta = document.querySelector('meta[property="product:price"]') ||
                     document.querySelector('meta[name="product:price"]');
    if (priceMeta && priceMeta.content) {
      const price = parseFloat(priceMeta.content.replace(/[^0-9.]/g, '')).toFixed(2);
      console.log('✅ Found price from meta tag:', price);
      return price;
    }

    // 6. JSON-LD structured data
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      try {
        const jsonLd = JSON.parse(jsonLdScript.textContent);
        if (jsonLd && jsonLd['@type'] === 'Product' && jsonLd.offers && jsonLd.offers.price) {
          const price = parseFloat(jsonLd.offers.price).toFixed(2);
          console.log('✅ Found price from JSON-LD:', price);
          return price;
        }
      } catch (e) {
        console.log('⚠️ Error parsing JSON-LD:', e);
      }
    }

    // 7. Variant data from Shopify
    if (window.Shopify && window.Shopify.product && window.Shopify.product.variants) {
      const firstVariant = window.Shopify.product.variants[0];
      if (firstVariant && firstVariant.price) {
        const price = (firstVariant.price / 100).toFixed(2);
        console.log('✅ Found price from variant:', price);
        return price;
      }
    }

    // Fallback to config price
    const fallbackPrice = this.config.productData?.price || '29.99';
    console.log('⚠️ Using fallback price:', fallbackPrice);
    console.log('🔍 Price detection summary:', {
      widgetData: widgetElement?.dataset?.productPrice,
      shopifyProduct: window.Shopify?.product?.price,
      formElements: this.productForm?.find('[data-product-price], .price').length,
      globalElements: document.querySelectorAll('.product-price, .price').length,
      metaTag: priceMeta?.content,
      jsonLd: jsonLdScript ? 'present' : 'missing',
      variants: window.Shopify?.product?.variants?.length
    });

    return fallbackPrice;
  }

  calculateDiscountedPrice(basePrice, discount) {
    return (basePrice - (basePrice * discount / 100)).toFixed(2);
  }

  formatLabel(template, values) {
    if (!template) return "";

    // If the template has an unclosed/malformed placeholder, return empty
    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;
    if (openBraces !== closeBraces) {
      return ""; // malformed -> hide it
    }

    const currencySymbol = this.config.shopCurrency || '$';

    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      let value = values[key];
      if (value == null) return "";

      // Auto-add currency symbol for price-like keys
      if ([
        "price",
        "discountedPrice",
        "originalPrice",
        "sellingPlanPrice",
      ].includes(key)) {
        return `${currencySymbol}${value}`;
      }

      // Auto-add % for discount percentage
      if (["selectedDiscountPercentage", "discount"].includes(key)) {
        return `${value}%`;
      }

      return String(value);
    });
  }

  onStateChange() {
    // Emit custom event for parent components
    const event = new CustomEvent('subscription-widget-change', {
      detail: {
        purchase: this.state.purchase,
        frequency: this.state.frequency,
        productId: this.config.productData.id
      }
    });
    this.container.dispatchEvent(event);
  }

  // Public methods for external control
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.render();
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}

// Legacy SubscriptionWidget for backward compatibility
class SubscriptionWidget {
  constructor(element) {
    this.element = element;
    this.productId = this.findProductId();
    this.shopDomain = element.dataset.shopDomain || window.Shopify?.shop;
    this.loadingElement = element.querySelector('.subscription-widget__loading');
    this.contentElement = element.querySelector('.subscription-widget__content');

    // Listen for configuration updates
    this.setupConfigurationListener();

    this.init();
  }

  findProductId() {
    // Try multiple sources to find product ID

    // 1. Data attribute on widget element
    if (this.element.dataset.productId) {
      return this.element.dataset.productId;
    }

    // 2. Shopify product object
    if (window.Shopify && window.Shopify.product && window.Shopify.product.id) {
      return window.Shopify.product.id.toString();
    }

    // 3. URL parameter (for product pages)
    const urlParams = new URLSearchParams(window.location.search);
    const productHandle = urlParams.get('product');
    if (productHandle) {
      // Try to find product by handle in Shopify data
      if (window.Shopify && window.Shopify.products) {
        const product = Object.values(window.Shopify.products).find(p =>
          p.handle === productHandle
        );
        if (product) {
          return product.id.toString();
        }
      }
    }

    // 4. Product form input
    const productForm = document.querySelector('form[action*="/cart/add"]');
    if (productForm) {
      const productIdInput = productForm.querySelector('input[name="id"]');
      if (productIdInput && productIdInput.value) {
        return productIdInput.value;
      }
    }

    // 5. Meta tag
    const productMeta = document.querySelector('meta[property="og:product:id"]') ||
                       document.querySelector('meta[name="product:id"]');
    if (productMeta && productMeta.content) {
      return productMeta.content;
    }

    // 6. Body data attribute (Shopify theme standard)
    if (document.body.dataset.productId) {
      return document.body.dataset.productId;
    }

    // 7. JSON-LD structured data
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      try {
        const jsonLd = JSON.parse(jsonLdScript.textContent);
        if (jsonLd && jsonLd['@type'] === 'Product' && jsonLd.productID) {
          return jsonLd.productID.toString();
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    return null;
  }

  async init() {
    try {
      if (!this.productId) {
        console.error('Product ID is required for subscription widget. Tried sources:', {
          dataAttribute: this.element.dataset.productId,
          shopifyProduct: window.Shopify?.product?.id,
          urlParam: new URLSearchParams(window.location.search).get('product'),
          formInput: document.querySelector('form[action*="/cart/add"] input[name="id"]')?.value,
          metaTag: document.querySelector('meta[property="og:product:id"]')?.content,
          bodyData: document.body.dataset.productId
        });
        this.showError('Product ID is required for subscription widget');
        return;
      }

      logger('Initializing subscription widget for product: ' + this.productId);

      // Check if content element exists
      if (!this.contentElement) {
        console.error('Content element not found for subscription widget');
        this.showError('Widget container not found');
        return;
      }

      // Use metafields for configuration (no API calls needed!)
      const metafields = new window.SubscriptionWidgetMetafields(this.element);
      const config = metafields.getWidgetConfig(this.productId);

      // Data is already available via Liquid metafields - no API calls needed
      console.log('✅ Widget configuration loaded from metafields:', {
        settings: metafields.settings,
        labels: metafields.labels,
        customization: metafields.customization
      });

      logger('Configuration loaded successfully');

      // Fetch product price from Shopify with fallback
      let productPrice;
      try {
        productPrice = await this.fetchProductPrice();
        logger('Product price fetched: ' + productPrice);
      } catch (priceError) {
        logger('Failed to fetch product price, using fallback');
        productPrice = parseFloat(this.element.dataset.productPrice) || 29.99;
      }

      // Update config with actual product price
      config.productData = config.productData || {};
      config.productData.price = productPrice;
      config.productData.options = config.productData.options || [
        { id: 'oneTime', price: productPrice },
        { id: 'subscribe', price: productPrice * 0.9, discountedPrice: productPrice * 0.9, originalPrice: productPrice, badge: true }
      ];
      config.productData.options[0].price = productPrice;
      config.productData.options[1].price = productPrice * 0.9;
      config.productData.options[1].discountedPrice = productPrice * 0.9;
      config.productData.options[1].originalPrice = productPrice;

      // Set default frequency to first option (monthly)
      if (config.frequencyOptions && config.frequencyOptions.length > 0) {
        config.settingsData = config.settingsData || {};
        config.settingsData.preselect = 'subscribe'; // Pre-select subscription
      }

      // Ensure required config properties exist
      config.settingsData = config.settingsData || {};
      config.customizationData = config.customizationData || {};
      config.labelsData = config.labelsData || {};
      // Frequency options are already set dynamically from metafields above

      logger('Creating dynamic widget');
      // Create dynamic widget
      this.dynamicWidget = new DynamicSubscriptionWidget(this.contentElement, config);
      this.dynamicWidget.render();

      logger('Widget rendered successfully');

      // Hide loading, show content
      if (this.loadingElement) {
        this.loadingElement.style.display = 'none';
      }
      if (this.contentElement) {
        this.contentElement.style.display = 'block';
      }

      // Ensure the main widget container is visible
      this.element.style.display = 'block';

    } catch (error) {
      console.error('Subscription Widget Error:', error);
      logger('Widget initialization failed: ' + error.message);
      this.showError('Failed to initialize subscription widget: ' + error.message);
    }
  }

  setupConfigurationListener() {
    // Listen for configuration updates from parent window (admin panel)
    window.addEventListener('message', (event) => {
      if (event.data.type === 'SUBSCRIPTION_CONFIG_UPDATE' &&
          event.data.productId === this.productId) {
        this.handleConfigurationUpdate(event.data.config);
      }
    });

    // Listen for custom configuration update events
    window.addEventListener('subscription-config-update', (event) => {
      if (event.detail.productId === this.productId) {
        this.handleConfigurationUpdate(event.detail.config);
      }
    });

    // Listen for shop-wide configuration updates
    window.addEventListener('shop-config-update', () => {
      this.refreshConfiguration();
    });
  }

  async handleConfigurationUpdate(newConfig) {
    if (this.dynamicWidget) {
      // Use metafields for updated configuration
      const metafields = new window.SubscriptionWidgetMetafields(this.element);
      const updatedConfig = metafields.getWidgetConfig(this.productId);

      // Update widget with new configuration
      this.dynamicWidget.updateConfig(updatedConfig);
      console.log('Widget configuration updated:', newConfig);
    }
  }

  async refreshConfiguration() {
    try {
      // Use metafields for refreshed configuration
      const metafields = new window.SubscriptionWidgetMetafields(this.element);
      const freshConfig = metafields.getWidgetConfig(this.productId);

      // Fetch updated product price
      const productPrice = await this.fetchProductPrice();
      freshConfig.productData.price = productPrice;
      freshConfig.productData.options[0].price = productPrice;
      freshConfig.productData.options[1].price = productPrice * 0.9;
      freshConfig.productData.options[1].discountedPrice = productPrice * 0.9;
      freshConfig.productData.options[1].originalPrice = productPrice;

      if (this.dynamicWidget) {
        this.dynamicWidget.updateConfig(freshConfig);
        // Force re-render with new styles
        this.dynamicWidget.render();
      }
    } catch (error) {
      console.error('Error refreshing configuration:', error);
    }
  }

  async fetchProductPrice() {
    try {
      // First try to get price from data attribute (passed from Liquid)
      const priceFromData = this.element.dataset.productPrice;
      if (priceFromData) {
        return parseFloat(priceFromData).toFixed(2);
      }

      // Fallback to API call if data attribute is not available
      const response = await fetch(`/products/${this.productId}.js`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const product = await response.json();
      return (product.price / 100).toFixed(2); // Convert from cents
    } catch (error) {
      console.warn('Could not fetch product price from API, using fallback:', error);
      // Use price from data attribute as final fallback
      const fallbackPrice = this.element.dataset.productPrice || '29.99';
      return parseFloat(fallbackPrice).toFixed(2);
    }
  }

  async fetchProductData() {
    try {
      const response = await fetch(`/products/${this.productId}.js`);
      this.state.productData = await response.json();
    } catch (error) {
      console.error('Error fetching product data:', error);
      throw error;
    }
  }

  render() {
    const { widget_style } = this.settings;

    switch (widget_style) {
      case 'classic':
        this.renderClassic();
        break;
      case 'compact':
        this.renderCompact();
        break;
      case 'grid':
        this.renderGrid();
        break;
      case 'grid-savings':
        this.renderGridSavings();
        break;
      case 'button':
        this.renderButton();
        break;
      case 'stacked':
        this.renderStacked();
        break;
      default:
        this.renderClassic();
    }
  }

  renderClassic() {
    const html = `
      <div class="subscription-widget__price-display">
        ${this.renderPriceDisplay()}
      </div>
      <div class="subscription-widget__options">
        ${this.renderOneTimeOption()}
        ${this.renderSubscriptionOption()}
      </div>
    `;

    this.contentElement.innerHTML = html;
  }

  renderCompact() {
    // Similar to classic but with different styling classes
    this.renderClassic();
    this.contentElement.querySelector('.subscription-widget__options').classList.add('subscription-widget__options--compact');
  }

  renderGrid() {
    const safeFrequencyOptions = Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : [];
    const html = `
      <div class="subscription-widget__price-display">
        ${this.renderPriceDisplay()}
      </div>
      <div class="subscription-widget__options subscription-widget__options--grid">
        ${this.renderOneTimeOptionGrid()}
        ${safeFrequencyOptions.map(freq => this.renderFrequencyOptionGrid(freq)).join('')}
      </div>
    `;

    this.contentElement.innerHTML = html;
  }

  renderGridSavings() {
    const safeFrequencyOptions = Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : [];
    const html = `
      <div class="subscription-widget__price-display">
        ${this.renderPriceDisplay()}
      </div>
      <div class="subscription-widget__options subscription-widget__options--grid">
        ${this.renderOneTimeOptionGrid()}
        ${safeFrequencyOptions.map(freq => this.renderFrequencyOptionGridWithSavings(freq)).join('')}
      </div>
    `;

    this.contentElement.innerHTML = html;
  }

  renderButton() {
    const safeFrequencyOptions = Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : [];
    const html = `
      <div class="subscription-widget__options subscription-widget__options--button">
        ${this.renderOneTimeOptionButton()}
        ${safeFrequencyOptions.map(freq => this.renderFrequencyOptionButton(freq)).join('')}
      </div>
    `;

    this.contentElement.innerHTML = html;
  }

  renderStacked() {
    const safeFrequencyOptions = Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : [];
    const html = `
      <div class="subscription-widget__price-display">
        ${this.renderPriceDisplay()}
      </div>
      <div class="subscription-widget__options">
        ${this.renderOneTimeOptionStacked()}
        ${safeFrequencyOptions.map(freq => this.renderFrequencyOptionStacked(freq)).join('')}
      </div>
    `;

    this.contentElement.innerHTML = html;
  }

  renderPriceDisplay() {
    const basePrice = this.getBasePrice();

    if (this.state.selectedOption === 'subscription' && this.state.selectedFrequency) {
      const safeFrequencyOptions = Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : [];
      const frequency = safeFrequencyOptions.find(f => f.value === this.state.selectedFrequency);
      const discountedPrice = this.calculateDiscountedPrice(basePrice, frequency?.discount || 0);
      const currencySymbol = this.config.shopCurrency || '$';

      return `
        <div class="subscription-widget__price-container">
          <span class="subscription-widget__price">${currencySymbol}${discountedPrice}</span>
          ${this.settings.show_discount_badge ? `<span class="subscription-widget__badge">${frequency?.discount || 0}% OFF</span>` : ''}
          <span class="subscription-widget__price--original">${currencySymbol}${basePrice}</span>
        </div>
      `;
    }

    return `<div class="subscription-widget__price">${this.config.shopCurrency || '$'}${basePrice}</div>`;
  }

  renderOneTimeOption() {
    const isSelected = this.state.selectedOption === 'oneTime';
    return `
      <div class="subscription-widget__option ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="oneTime">
        <div class="subscription-widget__option-content">
          <label class="subscription-widget__option-label">
            <input type="radio" name="purchase-option-${this.blockId}" value="oneTime" ${isSelected ? 'checked' : ''}>
            <span>${this.settings.one_time_label || 'One-time purchase'}</span>
          </label>
          <div class="subscription-widget__option-price">${this.config.shopCurrency || '$'}${this.getBasePrice()}</div>
        </div>
      </div>
    `;
  }

  renderSubscriptionOption() {
    const isSelected = this.state.selectedOption === 'subscription';
    // const basePrice = this.getBasePrice();

    return `
      <div class="subscription-widget__option ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="subscription">
        <div class="subscription-widget__option-content">
          <label class="subscription-widget__option-label">
            <input type="radio" name="purchase-option-${this.blockId}" value="subscription" ${isSelected ? 'checked' : ''}>
            <span>${this.settings.subscription_label || 'Subscribe & Save'}</span>
          </label>
          ${this.settings.show_discount_badge ? `<span class="subscription-widget__badge">SAVE ${this.state.frequency ? (Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : []).find(f => f.value === this.state.frequency)?.discount || 10 : 10}%</span>` : ''}
        </div>

        ${(isSelected || this.settings.keep_frequency_visible) ? `
          <div class="subscription-widget__frequency">
            <label class="subscription-widget__frequency-label">${this.settings.frequency_label || 'Delivery frequency'}</label>
            <div class="subscription-widget__frequency-options">
              ${(Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : []).map(freq => `
                <label class="subscription-widget__frequency-option">
                  <input type="radio" name="frequency-${this.blockId}" value="${freq.value}"
                         ${this.state.selectedFrequency === freq.value ? 'checked' : ''}>
                  <span>${freq.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderOneTimeOptionGrid() {
    const isSelected = this.state.selectedOption === 'oneTime';
    return `
      <div class="subscription-widget__option subscription-widget__option--grid ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="oneTime">
        <span>${this.settings.one_time_label || 'One-time purchase'}</span>
        <span class="subscription-widget__price">${this.config.shopCurrency || '$'}${this.getBasePrice()}</span>
      </div>
    `;
  }

  renderFrequencyOptionGrid(frequency) {
    const isSelected = this.state.selectedOption === 'subscription' && this.state.selectedFrequency === frequency.value;
    const basePrice = this.getBasePrice();
    const discountedPrice = this.calculateDiscountedPrice(basePrice, frequency.discount);

    return `
      <div class="subscription-widget__option subscription-widget__option--grid ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="subscription" data-frequency="${frequency.value}">
        <span>${frequency.label}</span>
        <span class="subscription-widget__price">${this.config.shopCurrency || '$'}${discountedPrice}</span>
        <span>(${frequency.discount}% off)</span>
      </div>
    `;
  }

  renderFrequencyOptionGridWithSavings(frequency) {
    const isSelected = this.state.selectedOption === 'subscription' && this.state.selectedFrequency === frequency.value;
    const basePrice = this.getBasePrice();
    const discountedPrice = this.calculateDiscountedPrice(basePrice, frequency.discount);

    return `
      <div class="subscription-widget__option subscription-widget__option--grid ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="subscription" data-frequency="${frequency.value}">
        ${this.settings.show_discount_badge ? `<span class="subscription-widget__badge">SAVE ${frequency.discount}%</span>` : ''}
        <span>${frequency.label}</span>
        <span class="subscription-widget__price">${this.config.shopCurrency || '$'}${discountedPrice}</span>
        <span>(${frequency.discount}% off)</span>
      </div>
    `;
  }

  renderOneTimeOptionButton() {
    const isSelected = this.state.selectedOption === 'oneTime';
    return `
      <div class="subscription-widget__option subscription-widget__option--button ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="oneTime">
        ${this.settings.one_time_label || 'One-time purchase'}
      </div>
    `;
  }

  renderFrequencyOptionButton(frequency) {
    const isSelected = this.state.selectedOption === 'subscription' && this.state.selectedFrequency === frequency.value;

    return `
      <div class="subscription-widget__option subscription-widget__option--button ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="subscription" data-frequency="${frequency.value}">
        ${frequency.label}
      </div>
    `;
  }

  renderOneTimeOptionStacked() {
    const isSelected = this.state.selectedOption === 'oneTime';
    return `
      <div class="subscription-widget__option subscription-widget__option--stacked ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="oneTime">
        <span>${this.settings.one_time_label || 'One-time purchase'}</span>
        <span class="subscription-widget__price">${this.config.shopCurrency || '$'}${this.getBasePrice()}</span>
      </div>
    `;
  }

  renderFrequencyOptionStacked(frequency) {
    const isSelected = this.state.selectedOption === 'subscription' && this.state.selectedFrequency === frequency.value;
    const basePrice = this.getBasePrice();
    const discountedPrice = this.calculateDiscountedPrice(basePrice, frequency.discount);

    return `
      <div class="subscription-widget__option subscription-widget__option--stacked ${isSelected ? 'subscription-widget__option--selected' : ''}"
           data-option="subscription" data-frequency="${frequency.value}">
        <span>${frequency.label}</span>
        <div>
          ${this.settings.show_discount_badge ? `<span class="subscription-widget__badge">${frequency.discount}% OFF</span> ` : ''}
          <span class="subscription-widget__price">${this.config.shopCurrency || '$'}${discountedPrice}</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Handle option selection
    this.contentElement.addEventListener('click', (e) => {
      const option = e.target.closest('.subscription-widget__option');
      if (!option) return;

      const optionType = option.dataset.option;
      const frequency = option.dataset.frequency;

      if (optionType === 'oneTime') {
        this.state.selectedOption = 'oneTime';
        this.state.selectedFrequency = '';
      } else if (optionType === 'subscription') {
        this.state.selectedOption = 'subscription';
        if (frequency) {
          this.state.selectedFrequency = frequency;
        }
      }

      this.render();
      this.updateCartForm();
    });

    // Handle radio button changes for frequency
    this.contentElement.addEventListener('change', (e) => {
      if (e.target.name && e.target.name.startsWith('frequency-')) {
        this.state.selectedFrequency = e.target.value;
        this.render();
        this.updateCartForm();
      }
    });
  }

  updateCartForm() {
    // Update the product form with selected options
    const productForm = document.querySelector('form[action*="/cart/add"]');
    if (!productForm) return;

    // Remove existing subscription inputs
    const existingInputs = productForm.querySelectorAll('input[name^="properties["]');
    existingInputs.forEach(input => {
      if (input.name.includes('subscription') || input.name.includes('frequency')) {
        input.remove();
      }
    });

    if (this.state.selectedOption === 'subscription' && this.state.selectedFrequency) {
      // Add subscription properties
      const subscriptionInput = document.createElement('input');
      subscriptionInput.type = 'hidden';
      subscriptionInput.name = 'properties[_subscription]';
      subscriptionInput.value = 'true';
      productForm.appendChild(subscriptionInput);

      const frequencyInput = document.createElement('input');
      frequencyInput.type = 'hidden';
      frequencyInput.name = 'properties[_subscription_frequency]';
      frequencyInput.value = this.state.selectedFrequency;
      productForm.appendChild(frequencyInput);

      // Update variant if selling plan exists
      const safeFrequencyOptions = Array.isArray(this.config.frequencyOptions) ? this.config.frequencyOptions : [];
      const frequency = safeFrequencyOptions.find(f => f.value === this.state.selectedFrequency);
      if (frequency && frequency.selling_plan_id) {
        let sellingPlanInput = productForm.querySelector('input[name="selling_plan"]');
        if (!sellingPlanInput) {
          sellingPlanInput = document.createElement('input');
          sellingPlanInput.type = 'hidden';
          sellingPlanInput.name = 'selling_plan';
          productForm.appendChild(sellingPlanInput);
        }
        sellingPlanInput.value = frequency.selling_plan_id;
      }
    } else {
      // Remove selling plan for one-time purchase
      const sellingPlanInput = productForm.querySelector('input[name="selling_plan"]');
      if (sellingPlanInput) {
        sellingPlanInput.remove();
      }
    }

    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('subscription-widget:change', {
      detail: {
        option: this.state.selectedOption,
        frequency: this.state.selectedFrequency,
        productId: this.productId
      }
    }));
  }

  getBasePrice() {
    if (!this.state.productData) return '0.00';
    return (this.state.productData.price / 100).toFixed(2);
  }

  calculateDiscountedPrice(basePrice, discountPercentage) {
    const price = parseFloat(basePrice);
    const discounted = price - (price * (discountPercentage / 100));
    return discounted.toFixed(2);
  }

  showError(message = 'Unable to load subscription options. Please try again.') {
    if (this.contentElement) {
      this.contentElement.innerHTML = `
        <div class="subscription-widget__error" style="padding: 16px; color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px;">${message}</p>
        </div>
      `;
      this.contentElement.style.display = 'block';
    }
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
    // Ensure the main widget container is visible even on error
    this.element.style.display = 'block';
  }
}

// Global widget manager for advanced use cases
window.SubscriptionWidgetManager = {
  widgets: new Map(),
  syncManager: null,

  init: function() {
    // Auto-initialize all subscription widgets
    document.querySelectorAll('.subscription-widget').forEach(widgetElement => {
      if (!widgetElement.dataset.initialized) {
        this.initializeWidget(widgetElement);
        widgetElement.dataset.initialized = 'true';
      }
    });

    // Initialize sync manager for real-time updates
    this.initSyncManager();
  },

  initializeWidget: function(widgetElement) {
    try {
      // Get configuration from data attributes (passed from Liquid)
      const config = this.buildConfigFromDataAttributes(widgetElement);

      // Get the content container
      const contentElement = widgetElement.querySelector('.subscription-widget__content');
      if (!contentElement) {
        console.error('Content element not found for subscription widget');
        return;
      }

      // Create dynamic widget
      const widget = new DynamicSubscriptionWidget(contentElement, config);
      widget.render();

      // Store widget reference
      this.widgets.set(config.productData.id, widget);

      // Hide loading, show content
      const loadingElement = widgetElement.querySelector('.subscription-widget__loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      if (contentElement) {
        contentElement.style.display = 'block';
      }

      // Ensure the main widget container is visible
      widgetElement.style.display = 'block';

      logger('Widget initialized successfully for product: ' + config.productData.id);

    } catch (error) {
      console.error('Error initializing widget:', error);
      this.showError(widgetElement, 'Failed to initialize subscription widget: ' + error.message);
    }
  },

  buildConfigFromDataAttributes: function(widgetElement) {
    try {
      console.log('🔧 Building config from data attributes...');

      // Parse data attributes passed from Liquid
      const settings = this.parseJsonData(widgetElement.dataset.configSettings);
      const customization = this.parseJsonData(widgetElement.dataset.configCustomization);
      const labels = this.parseJsonData(widgetElement.dataset.configLabels);
      const frequencyOptions = this.parseJsonData(widgetElement.dataset.frequencyOptions);
      const productVariants = this.parseJsonData(widgetElement.dataset.productVariants);
      const sellingPlanGroups = this.parseJsonData(widgetElement.dataset.sellingPlanGroups);
      const sellingPlansJson = this.parseJsonData(widgetElement.dataset.sellingPlansJson);

      console.log('📊 Parsed data:', {
        settings: !!settings,
        customization: !!customization,
        labels: !!labels,
        frequencyOptions: Array.isArray(frequencyOptions) ? frequencyOptions.length : 'not array',
        productVariants: Array.isArray(productVariants) ? productVariants.length : 'not array',
        sellingPlanGroups: Array.isArray(sellingPlanGroups) ? sellingPlanGroups.length : 'not array',
        sellingPlansJson: Array.isArray(sellingPlansJson) ? sellingPlansJson.length : 'not array'
      });

      // Get basic product data
      const productId = widgetElement.dataset.productId || 'unknown';
      const productPrice = parseFloat(widgetElement.dataset.productPrice) || 29.99;
      const shopCurrency = widgetElement.dataset.shopCurrency || '$';
      const customerId = widgetElement.dataset.customerId;
      const customerTags = widgetElement.dataset.customerTags ? widgetElement.dataset.customerTags.split(',') : [];

      console.log('💰 Product data:', { productId, productPrice, shopCurrency });

      // Ensure frequency options is always an array
      let safeFrequencyOptions = [];
      if (Array.isArray(frequencyOptions) && frequencyOptions.length > 0) {
        safeFrequencyOptions = frequencyOptions;
      } else {
        safeFrequencyOptions = [
          { value: '30', label: 'Every 30 days', discount: 10 },
          { value: '60', label: 'Every 60 days', discount: 15 },
          { value: '90', label: 'Every 90 days', discount: 20 }
        ];
      }

      console.log('📅 Frequency options:', safeFrequencyOptions);

      // Build configuration object with safe defaults
      const config = {
        settingsData: settings || {},
        customizationData: customization || {},
        labelsData: labels || {},
        frequencyOptions: safeFrequencyOptions,
        productData: {
          id: productId,
          price: productPrice,
          variants: Array.isArray(productVariants) ? productVariants : [],
          selling_plan_groups: Array.isArray(sellingPlanGroups) ? sellingPlanGroups : [],
          options: [
            { id: 'oneTime', price: productPrice, label: 'One-time purchase' },
            { id: 'subscribe', price: productPrice * 0.9, discountedPrice: productPrice * 0.9, originalPrice: productPrice, badge: true, label: 'Subscribe & Save' }
          ]
        },
        sellingPlansJson: Array.isArray(sellingPlansJson) ? sellingPlansJson : [],
        customerId: customerId,
        customerTags: customerTags,
        shopCurrency: shopCurrency,
        detectVariantFromURLParams: settings?.detectVariantFromURLParams || false,
        showPrepaidPlanSeparately: settings?.showPrepaidPlanSeparately || false,
        memberOnlySellingPlansJson: settings?.memberOnlySellingPlansJson || {},
        nonMemberOnlySellingPlansJson: settings?.nonMemberOnlySellingPlansJson || {},
        widgetStyle: widgetElement.dataset.widgetStyle || 'luminic'
      };

      console.log('✅ Config built successfully:', {
        productId: config.productData.id,
        optionsCount: config.productData.options.length,
        frequencyOptionsCount: config.frequencyOptions.length,
        widgetStyle: config.widgetStyle
      });

      return config;
    } catch (error) {
      console.error('❌ Error building config from data attributes:', error);
      // Return minimal safe config
      return {
        settingsData: {},
        customizationData: {},
        labelsData: {},
        frequencyOptions: [
          { value: '30', label: 'Every 30 days', discount: 10 }
        ],
        productData: {
          id: 'fallback',
          price: 29.99,
          variants: [],
          selling_plan_groups: [],
          options: [
            { id: 'oneTime', price: 29.99, label: 'One-time purchase' },
            { id: 'subscribe', price: 26.99, discountedPrice: 26.99, originalPrice: 29.99, badge: true, label: 'Subscribe & Save' }
          ]
        },
        sellingPlansJson: [],
        customerId: null,
        customerTags: [],
        shopCurrency: '$',
        widgetStyle: 'luminic'
      };
    }
  },

  parseJsonData: function(dataString) {
    if (!dataString || dataString === '{}' || dataString === 'null' || dataString === '') {
      return {};
    }
    try {
      // Handle HTML entity encoding from Liquid's | escape filter
      let decodedString = dataString;

      // Create a temporary element to decode HTML entities
      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = dataString;
        decodedString = textarea.value;
      } else {
        // Fallback for server-side or when document is not available
        decodedString = dataString
          .replace(/"/g, '"')
          .replace(/&/g, '&')
          .replace(/</g, '<')
          .replace(/>/g, '>')
          .replace(/'/g, "'")
          .replace(/'/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/&hellip;/g, '…')
          .replace(/&mdash;/g, '—')
          .replace(/&ndash;/g, '–')
          .replace(/&lsquo;/g, "'")
          .replace(/&rsquo;/g, "'")
          .replace(/&ldquo;/g, '"')
          .replace(/&rdquo;/g, '"');
      }

      const parsed = JSON.parse(decodedString);
      return parsed;
    } catch (error) {
      console.warn('Failed to parse data attribute:', error, 'Data:', dataString);
      return {};
    }
  },

  showError: function(widgetElement, message) {
    const contentElement = widgetElement.querySelector('.subscription-widget__content');
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="subscription-widget__error" style="padding: 16px; color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px;">${message}</p>
        </div>
      `;
      contentElement.style.display = 'block';
    }
    const loadingElement = widgetElement.querySelector('.subscription-widget__loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    // Ensure the main widget container is visible even on error
    widgetElement.style.display = 'block';
  },

  initSyncManager: function() {
    if (this.syncManager) return;

    this.syncManager = new WidgetSyncManager();
    this.syncManager.start();
  },

  updateAllWidgets: function() {
    // Trigger configuration refresh for all widgets
    this.widgets.forEach(widget => {
      if (widget.refreshConfiguration) {
        widget.refreshConfiguration();
      }
    });
  },

  updateWidget: function(productId, newConfig) {
    const widget = this.widgets.get(productId);
    if (widget && widget.handleConfigurationUpdate) {
      widget.handleConfigurationUpdate(newConfig);
    }
  }
};

// Sync Manager for real-time updates from admin panel
class WidgetSyncManager {
  constructor() {
    this.lastChecked = {};
    this.checkInterval = 30000; // Check every 30 seconds
    this.intervalId = null;
  }

  start() {
    console.log('WidgetSyncManager: Starting sync with admin panel');
    this.setupMessageListener();
    this.checkForUpdates(); // Initial check
    this.intervalId = setInterval(() => this.checkForUpdates(), this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setupMessageListener() {
    // Listen for messages from admin panel
    window.addEventListener('message', (event) => {
      // Only accept messages from the same origin or admin.shopify.com
      if (event.origin !== window.location.origin &&
          !event.origin.includes('admin.shopify.com') &&
          !event.origin.includes('shopify.com')) {
        return;
      }

      if (event.data && event.data.type === 'SUBSCRIPTION_WIDGET_UPDATE') {
        console.log('WidgetSyncManager: Received update notification from admin panel');
        // Force immediate refresh
        this.forceRefresh();
      }
    });
  }

  checkForUpdates() {
    try {
      // Check all widget elements on the page
      const widgets = document.querySelectorAll('.subscription-widget');
      let needsUpdate = false;

      widgets.forEach(widget => {
        if (this.checkWidgetForUpdates(widget)) {
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        console.log('WidgetSyncManager: Updates detected, refreshing all widgets');
        window.SubscriptionWidgetManager.updateAllWidgets();
      }
    } catch (error) {
      console.warn('WidgetSyncManager: Error checking for updates:', error);
    }
  }

  forceRefresh() {
    // Clear cached timestamps to force re-check
    this.lastChecked = {};
    // Immediately refresh all widgets
    window.SubscriptionWidgetManager.updateAllWidgets();
  }

  checkWidgetForUpdates(widgetElement) {
    let hasUpdates = false;

    // Check settings timestamp
    const settingsTimestamp = widgetElement.dataset.settingsTimestamp;
    if (settingsTimestamp && this.hasTimestampChanged('settings', settingsTimestamp)) {
      hasUpdates = true;
    }

    // Check customization timestamp
    const customizationTimestamp = widgetElement.dataset.customizationTimestamp;
    if (customizationTimestamp && this.hasTimestampChanged('customization', customizationTimestamp)) {
      hasUpdates = true;
    }

    // Check labels timestamp
    const labelsTimestamp = widgetElement.dataset.labelsTimestamp;
    if (labelsTimestamp && this.hasTimestampChanged('labels', labelsTimestamp)) {
      hasUpdates = true;
    }

    return hasUpdates;
  }

  hasTimestampChanged(key, currentTimestamp) {
    const lastChecked = this.lastChecked[key];
    if (!lastChecked) {
      // First time checking this key
      this.lastChecked[key] = currentTimestamp;
      return false;
    }

    if (new Date(currentTimestamp) > new Date(lastChecked)) {
      // Timestamp has changed
      this.lastChecked[key] = currentTimestamp;
      return true;
    }

    return false;
  }
}

// Cart Widget for managing subscriptions in cart
class CartWidget {
  constructor(config) {
    this.config = config;
    this.cartItems = [];
    this.init();
  }

  init() {
    this.loadCartData();
    this.setupEventListeners();
  }

  loadCartData() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        this.cartItems = cart.items || [];
        this.renderCartWidgets();
        this.processFreeProducts(cart);
      })
      .catch(error => console.error('Error loading cart data:', error));
  }

  renderCartWidgets() {
    const $ = window.jQuery || window.appstle_jQuery;
    if (!$) return;

    this.cartItems.forEach((item, index) => {
      if (item.selling_plan_allocation) {
        this.renderCartWidgetForItem(item, index);
      }
    });
  }

  renderCartWidgetForItem(item, index) {
    const $ = window.jQuery || window.appstle_jQuery;
    if (!$) return;

    const cartRow = $(`.cart-item:nth-child(${index + 1})`);
    if (cartRow.length === 0) return;

    const sellingPlan = item.selling_plan_allocation.selling_plan;
    const widgetHtml = `
      <div class="appstle_subscription_cart_wrapper" data-item-key="${item.key}">
        <div class="appstle_subscribe_title">
          ${sellingPlan.name}
          <input type="checkbox" checked />
        </div>
        <div class="appstle_radio_section" style="display: none;">
          <div class="appstle_cart_selling_plan_dropdown">
            <select name="selling_plan_cart">
              <option value="">${this.config.labels?.oneTimePurchaseLabel || 'One-time purchase'}</option>
              ${this.getSellingPlanOptions(item)}
            </select>
          </div>
        </div>
      </div>
    `;

    cartRow.find('.cart-item__details').append(widgetHtml);
  }

  getSellingPlanOptions(item) {
    // Get available selling plans for this product
    const product = this.getProductByHandle(item.handle);
    if (!product || !product.selling_plan_groups) return '';

    let options = '';
    product.selling_plan_groups.forEach(group => {
      if (group.app_id === 'appstle') {
        group.selling_plans.forEach(plan => {
          const selected = item.selling_plan_allocation?.selling_plan?.id === plan.id ? 'selected' : '';
          options += `<option value="${plan.id}" ${selected}>${plan.name}</option>`;
        });
      }
    });
    return options;
  }

  getProductByHandle(handle) {
    // This would need to be populated from product data
    return window.products ? window.products[handle] : null;
  }

  setupEventListeners() {
    const $ = window.jQuery || window.appstle_jQuery;
    if (!$) return;

    $(document).on('change', '.appstle_subscription_cart_wrapper select', (e) => {
      const select = $(e.target);
      const itemKey = select.closest('.appstle_subscription_cart_wrapper').data('item-key');
      const sellingPlanId = select.val();

      this.updateCartItemSellingPlan(itemKey, sellingPlanId);
    });
  }

  updateCartItemSellingPlan(itemKey, sellingPlanId) {
    const item = this.cartItems.find(item => item.key === itemKey);
    if (!item) return;

    updateCartWithSellingPlan(item, sellingPlanId).then(() => {
      this.loadCartData(); // Refresh cart data
    });
  }

  processFreeProducts(cart) {
    // Process free products based on subscription purchases
    const freeProductHandler = new FreeProductHandler(this.config);
    freeProductHandler.processCart(cart);
  }
}

// Free Product Handler
class FreeProductHandler {
  constructor(config) {
    this.config = config;
  }

  processCart(cart) {
    const freeProductsToAdd = [];
    const itemsToRemove = [];

    cart.items.forEach(item => {
      if (item.selling_plan_allocation && !item.properties._appstle_free_product) {
        const freeProduct = this.getFreeProductForSellingPlan(item.selling_plan_allocation.selling_plan.id);
        if (freeProduct && !this.hasFreeProductInCart(cart, freeProduct.id, item.key)) {
          freeProductsToAdd.push({
            id: freeProduct.id,
            quantity: 1,
            properties: {
              _appstle_parent_product: item.key,
              _appstle_free_product: true
            }
          });
        }
      }

      // Mark free products for removal if parent subscription is removed
      if (item.properties._appstle_free_product && !this.hasParentSubscription(cart, item.properties._appstle_parent_product)) {
        itemsToRemove.push(item.key);
      }
    });

    // Add free products
    if (freeProductsToAdd.length > 0) {
      this.addFreeProducts(freeProductsToAdd);
    }

    // Remove orphaned free products
    if (itemsToRemove.length > 0) {
      this.removeFreeProducts(itemsToRemove);
    }
  }

  getFreeProductForSellingPlan(sellingPlanId) {
    if (!this.config.sellingPlansJson) return null;

    const plan = this.config.sellingPlansJson.find(p =>
      p.id.split('/').pop() === sellingPlanId.toString()
    );

    if (plan && plan.appstleCycles) {
      const freeProductCycle = plan.appstleCycles.find(cycle =>
        cycle.afterCycle === 0 && cycle.discountType === 'FREE_PRODUCT'
      );
      return freeProductCycle ? { id: freeProductCycle.freeVariantId } : null;
    }

    return null;
  }

  hasFreeProductInCart(cart, variantId, parentKey) {
    return cart.items.some(item =>
      item.variant_id === parseInt(variantId) &&
      item.properties._appstle_parent_product === parentKey
    );
  }

  hasParentSubscription(cart, parentKey) {
    return cart.items.some(item => item.key === parentKey && item.selling_plan_allocation);
  }

  addFreeProducts(products) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: products })
    }).then(() => {
      location.reload(); // Refresh to show free products
    });
  }

  removeFreeProducts(itemKeys) {
    const updates = {};
    itemKeys.forEach(key => updates[key] = 0);

    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    });
  }
}

// Initialize cart widget when on cart page
function initCartWidget() {
  if (window.location.pathname.includes('/cart')) {
    new CartWidget(window.RS?.Config || {});
  }
}

// Global logger function for debugging
function logger(message) {
  // Check if RS (Appstle config) is available
  if (typeof window.RS !== 'undefined' && window.RS && window.RS.Config && window.RS.Config.debugLogsEnabled) {
    console.group(
      "%c Appstle Subscription Widget Log.",
      "display:inline-block; font-size: 14px; padding: 5px; background: linear-gradient(to right, #141B32, #00D9CC); color:#FFFFFF; border-radius: 5px;"
    );
    console.log("%c " + message, "font-size: 13px;");
    console.groupEnd();
  } else {
    // Always log to console for debugging
    console.log("[Subscription Widget] " + message);
  }
}

// Appstle-style initialization with proper dependency checking
function appstleInit() {
  var head = document.getElementsByTagName("head")[0],
      startingTime = new Date().getTime();

  // Load jQuery if not present (Appstle-style)
  if (!window.jQuery) {
    var jqueryScript = document.createElement("script");
    jqueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
    jqueryScript.type = "text/javascript";
    head.appendChild(jqueryScript);
  }

  // Load Mustache if not present
  if (!window.Mustache) {
    var mustacheScript = document.createElement("script");
    mustacheScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.1.0/mustache.js";
    mustacheScript.type = "text/javascript";
    head.appendChild(mustacheScript);
  }

  // Load DOMPurify if not present
  if (!window.DOMPurify) {
    var purifyScript = document.createElement("script");
    purifyScript.src = "https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js";
    purifyScript.type = "text/javascript";
    head.appendChild(purifyScript);
  }

  // Load IonIcons
  var ioniconsScript = document.createElement("script");
  ioniconsScript.src = "https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
  ioniconsScript.type = "module";
  head.appendChild(ioniconsScript);

  // Check if all dependencies are ready
  function checkReady(callback) {
    if ((window.jQuery || window.appstle_jQuery) &&
        window.Mustache &&
        window.DOMPurify &&
        window.Shopify) {
      callback(window.jQuery || window.appstle_jQuery);
    } else {
      window.setTimeout(function () {
        checkReady(callback);
      }, 20);
    }
  }

  // Initialize when ready
  checkReady(function($) {
    var endingTime = new Date().getTime(),
        tookTime = endingTime - startingTime;

    logger("All dependencies loaded in " + tookTime + "ms");

    // Initialize widgets
    window.SubscriptionWidgetManager.init();
    initCartWidget();

    // Re-initialize on theme editor changes
    document.addEventListener('shopify:section:load', () => {
      window.SubscriptionWidgetManager.init();
      initCartWidget();
    });

    // Listen for block selection changes in theme editor
    document.addEventListener('shopify:block:select', (event) => {
      const blockId = event.detail?.blockId || event.target?.dataset?.blockId;
      if (blockId) {
        // Find and update the specific widget
        const widgetElement = document.querySelector(`[data-block-id="${blockId}"]`);
        if (widgetElement && window.SubscriptionWidgetManager.widgets) {
          const productId = widgetElement.dataset.productId;
          if (productId && window.SubscriptionWidgetManager.widgets[productId]) {
            window.SubscriptionWidgetManager.widgets[productId].refreshConfiguration();
          }
        }
      }
    });

    // Listen for configuration updates from admin
    window.addEventListener('message', (event) => {
      if (event.data.type === 'ADMIN_CONFIG_UPDATE') {
        // Refresh all widgets when admin makes changes
        window.SubscriptionWidgetManager.updateAllWidgets();
      }
    });
  });
}

// Prevent double initialization
if (!window.subscriptionWidgetInitialized) {
  window.subscriptionWidgetInitialized = true;

  // Initialize when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appstleInit);
  } else {
    appstleInit();
  }
}