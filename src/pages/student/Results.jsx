import { useEffect, useState } from "react";
import { getMyResults } from "../../api/resultApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await getMyResults();
      setResults(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <h2>My Results</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Course / Class</th>
              <th>Mark</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, index) => (
              <tr key={index}>
                <td>{r.classId}</td>
                <td>{r.mark}</td>
                <td
                  style={{
                    color: r.status === "PASS" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}