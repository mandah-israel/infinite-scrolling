import './app.css';
import { useInfiniteQuery } from "react-query"
import { useEffect } from 'react';
import {useRef, useCallback} from 'react'


function App() {
  
  const LIMIT = 10
  const observerElem = useRef(null)
    
  const fetchRepositories = async (page) => {
    const response = await fetch(`https://api.github.com/search/repositories?q=react:react&per_page=${LIMIT}&page=${page}`)
    return response.json()
  }

  const {data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    'repos', 
    ({pageParam = 1}) => fetchRepositories(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1
        return lastPage.items.length !== 0 ? nextPage : undefined
      }
    }
  )
  
  const handleObserver = useCallback((entries) => {
    const [target] = entries
    if(target.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage])

  useEffect(() => {
    const element = observerElem.current
    const option = { threshold: 0 }

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element)
    return () => observer.unobserve(element)
  }, [fetchNextPage, hasNextPage, handleObserver])

  return (
    <div className="app">
      {isSuccess && data.pages.map(page => 
        page.items.map((comment) => (
          <div className='result' key={comment.id}>
            <span>{comment.name}</span>
            <p>{comment.description}</p>
          </div>
        ))
      )}

    <div className='loader' ref={observerElem}>
        {isFetchingNextPage && hasNextPage ? 'Loading...' : 'No search left'}
      </div>
    </div>
  )
}

export default App;
