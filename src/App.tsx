import { useEffect, useState } from "react";
import "./App.css";

interface quoteItem {
  author: string;
  quote: string;
  id: number;
}

function App() {
  // State for the search input from the user
  const [search, setSearch] = useState("");
  // State for changing style of search bar
  const [searched, setSearched] = useState("off");
  // Data to hold quotes and random quote
  const [quotes, setQuotes] = useState<quoteItem[]>([]);
  const [quoteCount, setQuoteCount] = useState(0);
  const [random, setRandom] = useState<quoteItem>();

  // Function to get quotes based on user input and change styling
  const getData = async () => {
    fetch(`https://usu-quotes-mimic.vercel.app/api/search?query=${search}`)
      .then((resp) => resp.json())
      .then((data) => {
        setQuoteCount(data.count);
        // If there are quote items, add them to quotes
        if (data.count > 0) {
          let quoteItems: quoteItem[] = [];
          for (let i = 0; i < data.count; i++) {
            quoteItems.push({
              author: data.results[i].author,
              quote: data.results[i].content,
              id: i,
            });
          }
          setQuotes(quoteItems);
          // else get random quote and add comment to screen
        } else {
          getRandomQuote();
          setSearched("on");
        }
      });
  };

  // Function to get a random quote
  const getRandomQuote = async () => {
    fetch(`https://usu-quotes-mimic.vercel.app/api/random`)
      .then((resp) => resp.json())
      .then((data) => {
        setRandom({
          author: data.author,
          quote: data.content,
          id: 1,
        });
      });
  };

  // Get random quote when page is first rendered
  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <div className="App">
      {/* If there are quotes, change styling */}
      <div className={quoteCount > 0 ? "with-quotes" : "without-quotes"}>
        <div className="container">
          {/* Remove title if there are search quotes on the screen */}
          <h2 className={quoteCount > 0 ? "off" : "header"}>Quotes Searcher</h2>
          {/* Search bar form and input */}
          <div className="search-bar">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                getData();
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="search-text"
                placeholder="search for a quote"
              ></input>
            </form>
            <button className="search-btn" onClick={getData}>
              Search
            </button>
          </div>
          {/* If there are quotes, then display them all  */}
          {quoteCount > 0 ? (
            <div>
              {quotes.map((item) => (
                <div className="quote-container" key={item.id}>
                  <h4 className="quote">" {item.quote} "</h4>
                  <h5 className="author">-{item.author}</h5>
                </div>
              ))}
            </div>
          ) : (
            // If there are not any quotes, show a random quote for fun
            <div>
              <h4 className={`header ${searched}`}>
                No Quotes Found, here is a random one!
              </h4>
              <div className="quote-container">
                <h4 className="quote">" {random?.quote} "</h4>
                <h5 className="author">-{random?.author}</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
