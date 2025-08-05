# Powerloom Documentation

Official documentation for Powerloom - The Decentralized Data Protocol

[View Documentation](https://docs.powerloom.io) | [Discord](https://discord.com/invite/powerloom) | [Twitter](https://twitter.com/PowerLoomHQ)

## About

This repository contains the official documentation for Powerloom, a decentralized data protocol that enables developers to build data-driven applications with verifiable, real-time data.

## Quick Start

### Prerequisites

- Node.js ≥ 20.0.0
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Powerloom/docs.git
cd docs

# Install dependencies
yarn install --frozen-lockfile
```

### Development

```bash
# Start the development server
yarn start

# The site will be available at http://localhost:3000
```

The development server features hot reloading - most changes are reflected immediately without restarting.

### Build

```bash
# Create production build
yarn build

# Test the production build locally
yarn serve
```

## Project Structure

```
docs/
├── docs/                        # Documentation content
│   ├── Protocol/               # Protocol specifications
│   ├── build-with-powerloom/   # Developer guides
│   ├── chain-migration/        # V1 to V2 migration guides
│   └── participate/            # Network participation guides
├── src/                        # Custom React components
├── static/                     # Static assets (images, files)
├── docusaurus.config.js        # Site configuration
└── sidebars.js                # Navigation structure
```

## Key Features

- **Fast Builds**: Powered by Docusaurus 3.8.1 with experimental Rspack bundler
- **Full-Text Search**: Integrated Typesense search for instant results
- **Dark Mode**: Automatic theme switching based on system preferences
- **MDX Support**: Enhanced Markdown with React components

## Contributing

We welcome contributions to improve our documentation!

### Documentation Guidelines

- Use clear, concise language
- Include code examples where applicable
- Add screenshots for UI-related content
- Cross-reference related topics with links
- Follow the existing file structure

### Commit Convention

We use conventional commits:
- `feat:` New documentation or features
- `fix:` Corrections to existing docs
- `chore:` Maintenance tasks
- `docs:` Documentation-only changes

## Configuration

### Environment Variables

Create a `.env` file for local configuration:

```bash
# Typesense Search (optional)
TYPESENSE_API_KEY=your_api_key
TYPESENSE_HOST=your_host
```

## Deployment

The documentation is automatically deployed via GitHub Actions on merges to `main`.

### Manual Deployment

For GitHub Pages deployment:

```bash
# Using SSH
USE_SSH=true yarn deploy

# Using HTTPS
GIT_USER=<Your GitHub username> yarn deploy
```

## Troubleshooting

**Build fails with memory error**
```bash
NODE_OPTIONS="--max-old-space-size=4096" yarn build
```

**Port 3000 already in use**
```bash
yarn start --port 3001
```

## Resources

- **Live Documentation**: https://docs.powerloom.io
- **Powerloom Website**: https://powerloom.io
- **GitHub**: https://github.com/Powerloom
- **Discord Community**: https://discord.com/invite/powerloom

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.