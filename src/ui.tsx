import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";



declare function require(path: string): any;


function clipBoard(data){
  const textArea = document.createElement("textarea");
  textArea.value = data;
  
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}


function App() {
  // const inputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);


  const figmaJSON = async () => {
    // const count = Number(inputRef.current?.value || 0);
    setLoading(true);
    setProgress(0);

    const startTime = Date.now(); 

    parent.postMessage( { pluginMessage: { type: "figma-json" } }, "*" );
    clipBoard('ideuduie')
    
    try {
      const jsonGenerationTime = 5000; // Tiempo de generación del JSON en milisegundos
      const progressInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const calculatedProgress = (elapsedTime / jsonGenerationTime) * 100;

        setProgress(Math.min(calculatedProgress, 100));

        if (calculatedProgress >= 100) {
          clearInterval(progressInterval);
          setLoading(false);
        }
      }, 100);

      // Simulación de finalización del proceso después del tiempo de generación del JSON
      await new Promise((resolve) => setTimeout(resolve, jsonGenerationTime));

      clearInterval(progressInterval);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

  };

  // window.addEventListener("message", (event) => {
  //   clipBoard('ideuduie')
  // })

  // parent.onmessage = (msg) => {
  //   if (msg.type === "clipboard") {
  //     clipBoard('hello world1111')
  //   }
  // }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };


  window.addEventListener("message", (event) => {
    // console.log('weddiujeij', event.data)
    if (event.data && event.data.pluginMessage.type === "clipboard") {
      // console.log("Mensaje recibido desde el plugin:", event.data.pluginMessage.data);
      clipBoard(event.data.pluginMessage.data)
    }
  });

  return (
    <main>
      <header>
        <img src={require("./logo.svg")} alt="Aythen Logo" />
        <h2>Aythen Plugin</h2>
      </header>
      <footer>
        <button className="brand" onClick={figmaJSON}>
          Component
        </button>
        <button onClick={onCancel}>
          Cancelar
        </button>
        <div className="loading-bar-container">
        {loading && (
          <div className="loading-bar">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
