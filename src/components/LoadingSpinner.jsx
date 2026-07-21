import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>

        <h2>ODS Network</h2>
        <p>Loading, please wait...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;