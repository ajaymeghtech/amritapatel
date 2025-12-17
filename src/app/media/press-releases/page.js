"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "@/app/styles/scss/main.scss";
import styles from "@/app/styles/scss/components/press.module.scss";
import Innerbanner from "@/app/components/common/Innerbanner";

import pressBanner from "@/app/assets/images/press-innerbanner.jpg";

import {
  fetchPressReleases,
  getUniquePressYears,
  fetchPressByYear
} from "@/app/services/pressService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PressReleases() {
  const [pressData, setPressData] = useState([]);
  const [years, setYears] = useState(["All"]);
  const [filterYear, setFilterYear] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /*---------------------------------------------------
    LOAD YEARS + DEFAULT PRESS LIST
  ---------------------------------------------------*/
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        const yearList = await getUniquePressYears();
        setYears(yearList);

        const defaultPress = await fetchPressReleases();
        setPressData(defaultPress);

      } catch (err) {
        console.error("Error loading press data:", err);
        setError("Failed to load press releases.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

const handleYearFilter = async (yearItem) => {
  const selectedYear = yearItem.year || "All";
  setFilterYear(selectedYear);
  setIsLoading(true);

  try {
    // CHECK IF YEAR IS "All"
    if (selectedYear === "All") {
      const allPress = await fetchPressReleases();
      setPressData(allPress);
    } else {
      const filtered = await fetchPressByYear(yearItem._id);
      setPressData(filtered);
    }

  } catch (err) {
    console.error("Error filtering press:", err);
    setError("Failed to fetch filtered press releases.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      <Header />
      <Innerbanner title="Press Releases" image={pressBanner} />

      <div className="sectionPadding">
        <div className="container">

          {/* FILTER BUTTONS */}
          <div className="text-center">
            <div className={styles.filterButtons}>
              {years.map((item, index) => (
                <button
                  key={index}
                  className={
                    filterYear === (item.year || "All") ? styles.active : ""
                  }
                  onClick={() => handleYearFilter(item)}
                >
                  {item.year || "All"}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Loading press releases...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={{ textAlign: "center", color: "#d32f2f" }}>
              <p>{error}</p>
            </div>
          )}

          {/* EMPTY */}
          {!isLoading && !error && pressData.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No press releases available.</p>
            </div>
          )}

          {/* PRESS LIST */}
          {!isLoading && !error && pressData.length > 0 && (
            <ul className={styles.pressList}>
              {pressData.map((item) => (
                <li key={item._id}>
                  <div className={styles.pressBox}>
                    {item.image && (
                      <img
                        src={`${API_BASE_URL}${item?.image}`}
                        alt={item.title}
                        className="img-fluid"
                      />
                    )}

                    <div className={styles.title}>
                      <h2>{item.title}</h2>

                      <p>
                        <span>{item.year}</span>{" "}
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}
