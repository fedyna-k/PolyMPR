# ✨ PolyMPR ✨

**PolyMPR** (Poly Management Platform for Resources) is a modern, modular framework built on **Deno** and **Fresh**, designed to help organizations transition their HR systems to the cloud. With its **modulith architecture**, PolyMPR simplifies the development, deployment, and maintenance of HR applications, making it the perfect choice for teams looking to modernize their workflows. 🌐

## Features ✨

- **Modular Design**: Easily add, remove, or update features without disrupting the entire system. 🧩
- **Cloud-Native**: Built for the cloud, enabling seamless integration with cloud services (amU DataCenter). ☁️
- **Deno-Powered**: Utilizes Deno's secure runtime for TypeScript. 🦕
- **Fresh Framework**: Delivers fast, edge-ready web applications with minimal overhead. ⚡
- **HR-Focused**: Tailored to meet the unique needs of INFO's HR. 👩‍💼👨‍💼

## Getting Started 🛠️

### Prerequisites
- **Deno**: Install Deno by following the [official guide](https://deno.land/#installation).
- **Docker** (optional): Install Docker for containerized deployments. Follow the [Docker installation guide](https://docs.docker.com/get-docker/).

### Installation
1. Clone the PolyMPR repository:
   ```bash
   git clone https://github.com/fedyna-k/PolyMPR.git
   cd PolyMPR
   ```
2. Start the application:
   ```bash
   deno task start
   ```
3. Access the application at `https://localhost`.

For detailed installation instructions, check out the [Installation Guide](./wiki/installation).

## Modules Overview 🧩

PolyMPR comes with a variety of modules to streamline HR processes.

To learn how to create a module, visit the [Module Overview](./wiki/modules).

## CLI Documentation 📄

The **PolyMPR CLI** simplifies development tasks. Here are some common commands:

- Create a new module:
  ```bash
  pmpr module create <module-name-kebab-case>
  ```

For detailed CLI usage, check out the [CLI Documentation](./wiki/cli).

## Contributing 🤝

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated. Here’s how to get started:

1. Create a new issue.
2. Create a new branch for your changes:
   ```bash
   git checkout -b PMPR-:ISSUE_ID:
   ```
3. Commit your changes and push them to your branch.
4. Submit a pull request.

For more details, read the [Contributing Guide](./contributing).

## Community and Support 🌟

Join the PolyMPR community to connect with other users and developers:

- **GitHub Discussions**: Ask questions and share ideas. 💬
- **Issue Tracker**: Report bugs or request features. 🐛

## License 📜

PolyMPR is open-source and released under the **MIT License**. Feel free to use, modify, and distribute it as per the license terms.