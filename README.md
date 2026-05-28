# Orion C. Riker's Portfolio Website

This is my personal portfolio website built with Astro. It showcases my projects and skills through a clean & modern design crafted using Tailwind CSS.

> [!NOTE]
> **🚀 NEW: 57% Docker Image Size Reduction!**  
> The production Docker image has been optimized, dropping from **330 MB to 141 MB**. By leveraging Vite's `noExternal` SSR bundling and multi-stage Docker builds, we completely eliminated the need to ship the heavy `node_modules` folder into production. The _only_ dependency kept external is **`sharp`**, which is required as a compiled C++ binary for native on-the-fly image processing.  
> 💡 **Fun Fact:** Out of that 141 MB, the hardened Alpine/Bun base image takes up ~132 MB, and the `sharp` binary accounts for ~33 MB. The _entire_ application payload (HTML, CSS, JS, and server logic) is **under 14 MB!**

## 🎨 Tech Stack

- **Bun** [https://bun.sh/](https://bun.sh/)  
  A fast, modern JavaScript runtime, package manager, bundler & test runner for Node.js.
- **Astro** [https://astro.build/](https://astro.build/)  
  A modern static site generator for building websites and apps.
- **Tailwind CSS** [https://tailwindcss.com/](https://tailwindcss.com/)  
  A utility-first CSS framework that provides utility classes for styling.
- **Preact** [https://preactjs.com/](https://preactjs.com/)  
  Fast 3kB alternative to React with the same modern API
- **Framer Motion** [https://motion.dev/](https://motion.dev/)  
  A production-grade animation library for the web.

## 🐋 Docker Image

### Security & Compliance

- **CIS Compliant**  
  The images are built on Docker Hardened Images (DHI), which are CIS Compliant. The final image is security-hardened and evaluated using CIS benchmarks.
- **Signed Images**  
  All tags are signed with **cosign** using the maintainer’s private key, this ensures image integrity and protection against tampering.
- **Docker Hardened Image base**  
  Uses Docker’s officially hardened base images.  
  [Read the announcement](https://www.docker.com/press-release/docker-makes-hardened-images-free-open-and-transparent-for-everyone/)

### Runtime Hardening

- **Runs as non-root user**
- **No shell**
- **No package manager**
- **No unnecessary utilities**  
  Tools such as `ping`, `curl`, `wget`, etc. are intentionally excluded to reduce the attack surface.

### Operability

- **Built-in healthcheck\***  
  \* Please note: the Astro website must provide an /health endpoint for this to work properly!

## 🧞 Special Commands

> [!CAUTION]
> This section is incomplete.

| Command  | Action                                             |
| :------- | :------------------------------------------------- |
| `bun b`  | Builds the astro project using config .env.build   |
| `bun d`  | Deploys the astro project using config .env.deploy |
| `bun up` | One command to build and deploy astro project      |

## 🏗️ Building

> [!CAUTION]
> This section is incomplete.

## 🚀 Deploying

> [!CAUTION]
> This section is incomplete.

## 🚧 TODO

### Website

- [x] Themes (Dark / Light)
- [x] Theme Switching
- [x] Layout
- [x] Hero
- [x] About me
- [x] Skills
- [ ] Showcase projects
- [ ] Blog

## CI/CD

- [x] Script for building
- [x] Script for deploying
- [x] Auto-Sign images using cosign
- [ ] Auto-Scan images for vulnerabilities and display
- [x] Small Docker Image
- [ ] Rolling Releases
- [x] Schemantic version handling
- [x] Kubernetes Support
- [ ] Multi-Host Deployment

## 📜 License

Orion C. Riker's Portfolio Website is licensed under the GNU General Public v3 License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Copyright © 2025 Orion C. Riker <orionriker@proton.me>  
Licensed under the GNU General Public v3 License.

</div>
