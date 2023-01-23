import { useEffect, useState } from "react";
import "./App.css";

interface quoteItem {
  author: string;
  quote: string;
  id: number;
}

function App() {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState("off");
  const [quotes, setQuotes] = useState<quoteItem[]>([]);
  const [quoteCount, setQuoteCount] = useState(0);
  const [random, setRandom] = useState<quoteItem>();

  const getData = async () => {
    fetch(`https://usu-quotes-mimic.vercel.app/api/search?query=${search}`)
      .then((resp) => resp.json())
      .then((data) => {
        setQuoteCount(data.count);
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
        } else {
          getRandomQuote();
          setSearched("on");
        }
      });
  };

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

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <div className="App">
      {quoteCount > 0 ? (
        <div className="with-quotes">
          <div className="container">
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
            {quotes.map((item) => (
              <div className="quote-container" key={item.id}>
                <h4>" {item.quote} "</h4>
                <h5 className="author">-{item.author}</h5>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="without-quotes">
          <div className="container">
            <h2 className="header">Quotes Searcher</h2>
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
            <h4 className={`header ${searched}`}>
              No Quotes Found, here is a random one!
            </h4>
            <div className="quote-container">
              <h4 className="quote">" {random?.quote} "</h4>
              <h5 className="author">-{random?.author}</h5>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
