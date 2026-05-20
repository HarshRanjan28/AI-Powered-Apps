import { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/greet')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching message:', error));
  }, []);

  return (
    <div className="p-4">
      <Chatbot />
    </div>
  );
}

export default App;
