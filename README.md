# Job Hunting Browser Extension

A simple, lightweight browser extension to aid your job hunt journey. Save job postings with one click and manage your application status across multiple job platforms.

## Features

- 💾 **One-Click Save** - Save job postings from LinkedIn, Greenhouse, Lever, Workday, Workable, Ashby, and more
- 📋 **Application Tracking** - Track job status (Saved, Applied)
- 🔗 **Quick Access** - Easily open saved job postings
- 🗑️ **Job Management** - Delete jobs you're no longer interested in
- 🚫 **Duplicate Prevention** - Automatically prevents saving the same job twice

## Tech Stack

- **Framework:** [Plasmo](https://docs.plasmo.com/) - Browser Extension Framework
- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Storage:** Browser Storage API via `webextension-polyfill`
- **Package Manager:** pnpm
- **Supported Browsers:** Chrome, Firefox (Manifest V3)

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit Plasmo Documentation](https://docs.plasmo.com/)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 jafarOlamide

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

Made with ❤️ by [jafarOlamide](https://github.com/jafarOlamide)
