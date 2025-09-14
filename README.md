# AzaPy

**AzaPy** is a simplistic online Python compiler and interactive terminal designed to provide an easy-to-use environment for learning and executing Python code directly in the browser. It features a split view with a full code editor and an interactive console, powered by **Pyodide**.

---

## Features

- **Python in the Browser**: Execute Python code, including popular libraries like Matplotlib, directly in your web browser using Pyodide.  
- **Interactive Console**: A terminal interface that functions as a Python REPL, supports command history, and allows console output to be exported as PDF, HTML, or Markdown.  
- **Syntax Highlighting**: Both the editor and console output feature Python syntax highlighting using PrismJS to improve readability.  
- **Code Editor**: An easy-to-use code editor provided by `react-simple-code-editor`.  
- **File Handling**: Supports saving code editor content as a `.py` file and uploading local `.py` or `.txt` files into the editor.  
- **Autocomplete**: Provides ghost-text suggestions for Python keywords and functions while typing in both the editor and the console.  

---

## Tech Stack

- **Frontend**: React, TypeScript, and Vite  
- **Styling**: TailwindCSS  
- **Python Engine**: Pyodide  
- **Editor**: react-simple-code-editor  
- **Syntax Highlighting**: PrismJS  
- **Icons**: Font Awesome  

---

## Getting Started

### Prerequisites
Make sure you have **Node.js** installed on your machine.

### Installation

```bash
git clone https://github.com/azaken1248/azapy.git
cd azapy
npm install   # or pnpm install
```

### Running the Project

```bash
npm run dev
```

This will run the app in development mode.  
Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) to view it in your browser.

### Building the Project

```bash
npm run build
```

This command builds the app for production to the `dist` folder.

---

## Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.  

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag **enhancement**.

1. Fork the Project  
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the Branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

---

## License

This project is licensed under the [MIT License](LICENSE).
