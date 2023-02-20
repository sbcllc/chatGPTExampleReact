import React from "react";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [occasion, setOccasion] = useState('birthday');
  const [gender, setGender] = useState('man');
  const [age, setAge] = useState(30);
  const [priceMin, setPriceMin] = useState(25);
  const [priceMax, setPriceMax] = useState(100);
  const [hobbies, setHobbies] = useState('travel, food, outdoors');


  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [title, setTitle] = useState('OpenAI Gift generator 🎁 💡');

  async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setTitle(`Looking for three gift ideas for a ${occasion} present with prices between ${priceMin} and ${priceMax} dollars for a ${age} year old ${gender} that is into ${hobbies}.`)
      const response = await fetch("/api/generate-gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ occasion, priceMin, priceMax, gender, age, hobbies }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      // console.log(data.result);
      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert('OpenAI is really busy right now, try again later',);
    } finally {
      setLoading(false);
      setTitle('OpenAI Gift generator');
    }
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        {!loading && result.length != 0 && (<div className={styles.result}>
          <h3>Here are some ideas:</h3>
          {result.map((item, key) => {
            return <span key={key}>{item}<br /></span>
          })}

        </div>)}

        <h3>{title}</h3>
        {!loading && (<form onSubmit={onSubmit}>
          <label>For what occassion is the gift?</label>
          <select name="occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            <option value="birthday">birthday</option>
            <option value="christmas">christmas</option>
            <option value="graduation">graduation</option>
            <option value="valentine's day">valentine's day</option>
            <option value="wedding anniversary">wedding anniversary</option>
          </select>
          <label>For who is the gift?</label>
          <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="man">Man</option>
            <option value="woman">Woman</option>
          </select>
          <label>Age</label>
          <input
            type="number"
            min={1}
            max={99}
            name="age"
            placeholder="Enter the age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />
          <label>Price from</label>
          <input
            type="number"
            min={1}
            name="minPrice"
            placeholder="Enter the minimum price"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />
          <label>Price to</label>
          <input
            type="number"
            min={1}
            name="maxPrice"
            placeholder="Enter the maximum price"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />
          <label>Hobbies</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Enter the hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <input type="submit" value="Generate ideas" />
        </form>)}
        {loading && (
          <div>
            <img src="/loading.gif" className={styles.loading} />
          </div>
        )}

      </main>
    </div>
  );
}
