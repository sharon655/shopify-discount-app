# Subscription Widget Theme App Extension

This theme app extension provides a self-contained subscription widget for product detail pages that allows customers to choose between one-time purchases and subscription options with working functionality.

## 🚀 Key Features

- **Self-Contained Widget**: No external API calls or iframes required
- **Working Functionality**: Radio buttons, frequency selector, and add-to-cart work immediately
- **Polaris Design**: Matches Shopify's design system perfectly
- **Mobile Responsive**: Optimized for all screen sizes
- **Theme Editor Integration**: Full configuration through Shopify's theme editor
- **Simple Deployment**: Works out-of-the-box without complex setup

## 📁 File Structure

```
extensions/subsciption-widget/
├── shopify.extension.toml          # Extension configuration
├── blocks/
│   └── subscription-widget.liquid  # Self-contained working widget
├── locales/
│   └── en.default.json             # Localization strings
└── README.md                       # This documentation
```

**No external API calls or complex setup required!**

## Installation

1. **Generate the Extension**:
   ```bash
   shopify app generate extension
   ```
   Choose "Theme app extension" when prompted.

2. **Replace Generated Files**:
   Replace the generated `star_rating.liquid` block with the `subscription-widget.liquid` file provided.

3. **Deploy**:
   ```bash
   shopify app deploy
   ```

**That's it!** The widget works immediately without any additional configuration.

## Configuration

### Block Settings

The subscription widget block supports the following settings:

- **Product**: Select the product to display subscription options for
- **Widget Style**: Choose from 6 different layout styles
- **Show Discount Badge**: Toggle discount badge visibility
- **Pre-select Subscription**: Automatically select subscription option

### Widget Styles

1. **Classic**: Vertical layout with radio buttons and frequency selector
2. **Compact**: Condensed version of the classic style
3. **Grid**: 2-column grid layout for purchase options
4. **Grid with Savings**: Grid layout with savings highlights
5. **Button**: Button-style layout for modern designs
6. **Stacked**: Horizontal card layout

## Usage in Theme

1. **Add to Product Template**:
   In your theme's product template (usually `templates/product.liquid`), add:
   ```liquid
   {% render 'subscription-widget' %}
   ```

2. **Position the Block**:
   Use the theme editor to position the subscription widget block on your product pages.

3. **Configure Settings**:
   Use the theme editor to configure the widget appearance and behavior.

## Widget Features

### Interactive Elements
- **Purchase Options**: Radio buttons to switch between one-time and subscription
- **Frequency Selector**: Dropdown that appears when subscription is selected
- **Discount Badges**: Shows savings percentage (configurable)
- **Add to Cart**: Functional button with confirmation

### Responsive Design
- **Mobile Optimized**: Adapts to small screens
- **Touch Friendly**: Large touch targets for mobile devices
- **Flexible Layout**: Works on all screen sizes

### Polaris Integration
- **Consistent Styling**: Matches Shopify's design system
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Theme Variables**: Uses Shopify's color and spacing system

## Styling Customization

The widget uses CSS custom properties for easy theming:

```css
.subscription-widget-container {
  --primary-color: #008060;
  --secondary-color: #6d7175;
  --border-color: #e1e5e9;
  --background-color: #fff;
  --border-radius: 6px;
  --spacing-unit: 8px;
}
```

## Localization

Add translations to your locale files:

```json
{
  "subscription": {
    "oneTimePurchaseLabel": "One-time purchase",
    "subscriptionPurchaseLabel": "Subscribe and save",
    "addToCart": "ADD TO CART"
  }
}
```

## Testing

1. **Development Store**:
    - Deploy the extension to your development store
    - Test on various product pages
    - Verify responsive behavior on mobile devices

2. **Functionality Testing**:
    - Test radio button selection
    - Verify frequency selector shows/hides correctly
    - Check add to cart functionality
    - Test mobile responsiveness

3. **Theme Editor Testing**:
    - Verify all settings work in theme editor
    - Test different widget styles
    - Check configuration persistence

## Troubleshooting

### Widget Not Appearing
- Ensure the product is selected in the block settings
- Check that the block is added to the product template
- Verify the extension is deployed and enabled

### Styling Issues
- Check for CSS conflicts with theme styles
- Ensure the widget container has proper spacing
- Verify responsive breakpoints are working

### Functionality Issues
- Check browser console for JavaScript errors
- Ensure all required HTML elements are present
- Verify event listeners are attached correctly

## Best Practices

1. **Performance**:
    - Widget loads instantly (no external requests)
    - Minimal JavaScript for fast execution
    - Optimized CSS for quick rendering

2. **Accessibility**:
    - Proper semantic HTML structure
    - Keyboard navigation support
    - Screen reader compatibility

3. **User Experience**:
    - Clear visual feedback for interactions
    - Intuitive purchase flow
    - Mobile-first responsive design

## Support

For issues or questions:
- Check browser console for errors
- Verify extension deployment status
- Test in multiple browsers
- Ensure theme editor settings are correct

## Version History

- **v1.0.0**: Initial release with working subscription widget
- **v1.1.0**: Added multiple widget styles and improved responsiveness
- **v1.2.0**: Enhanced mobile experience and accessibility features