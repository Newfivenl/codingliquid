# Reference Theme

The `reference-theme` repository is a foundational part of the [Archetype Devkit preview](https://github.com/archetype-themes/devkit). It provides a real-world theme that showcases a simple, straightforward, online-purchasing experience using the theme components defined in the [`reference-components`](https://github.com/archetype-themes/reference-components) repository.

For lots more information, visit the [Devkit documentation](https://github.com/archetype-themes/devkit/tree/main).

## Getting Started

### Prerequisites

Before working with this theme, ensure you have the following tools installed on your local development machine:

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install)
- [Shopify CLI Theme Component plugin](https://github.com/archetype-themes/plugin-theme-component)

After installation, import the latest changes of your components and locales into your theme by running the following command inside of this Shopify theme directory:

```bash
shopify theme component install
```

### Shopify Theme Store
shopify theme dev --store="nf-comp.myshopify.com"

### To install tailwind
check the [Shopify CLI Theme Component plugin](https://github.com/archetype-themes/plugin-theme-component) for instructions 
1. create a tailwind folder and tailwind.css file inside the plugin-theme-compoent folder
2. create a tailwind.config.js file inside the plugin-theme-compoent folder

### To watch tailwind
npx tailwindcss -i ./tailwind/tailwind.css -o ../assets/tailwind.css --watch

## Contributing

Interested in shaping the future of theme development with us? We welcome you to join our community! Your insights and discussions play a crucial role in our continuous improvement. We encourage you to start [discussions](https://github.com/archetype-themes/devkit/discussions), ask questions, and provide feedback on our component approach.
