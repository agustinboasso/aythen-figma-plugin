import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";
import { log } from "console";

declare function require(path: string): any;


function descargarJSONAutomatically(jsonData: any, filename: string) {
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
  downloadLink.download = filename;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
function App() {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [jsonData, setJsonData] = React.useState<any>(null);

  const figmaJSON = async () => {
    setLoading(true);
    setProgress(0);

    console.log("Comenzando la generación de JSON...");
    const startTime = Date.now();

    parent.postMessage({ pluginMessage: { type: "figma-json" } }, "*");
    //clipBoard('ideuduie');

    try {
      const jsonGenerationTime = 5000; 
      const endTime = startTime + jsonGenerationTime;

      while (Date.now() < endTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const calculatedProgress = (elapsedTime / jsonGenerationTime) * 100;

        //console.log("Progreso calculado:", calculatedProgress);

        setProgress(Math.min(calculatedProgress, 100));

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log("Generación de JSON completada.");
      setLoading(false);
   
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  window.addEventListener("message", (event) => {
    if (event.data && event.data.pluginMessage.type === "json-data") {
      const receivedJsonData = event.data.pluginMessage.data;

      console.log("Esta es la data del JSON:", receivedJsonData);
      setJsonData(receivedJsonData);
      descargarJSONAutomatically(receivedJsonData, 'data.json');
   
     
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
        <button onClick={onCancel}>Cancelar</button>
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





