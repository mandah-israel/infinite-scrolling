import './app.css';
import { useQuery } from "react-query";

function App() {

  const fetchRepositories = async () => {
    const response = await fetch(`https://api.github.com/search/repositories?q=topic:react`)
    return response.json()
  }

  const {data, isSuccess} = useQuery("repos",  fetchRepositories)

  return (
    <div className="app">
      {isSuccess && data.items.map((comment) => (
        <div className='result' key={comment.id}>
          <span>{comment.name}</span>
          <p>{comment.description}</p>
        </div>
      ))}
    </div>
  )
}

export default App;
