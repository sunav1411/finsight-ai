"use client";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

import { useRef, useState } from "react";

import Papa from "papaparse";

import {
  UploadCloud,
  FileSpreadsheet,
  X,
  Loader2,
} from "lucide-react";

export default function ImportModal({
  onClose,
}) {
  const fileRef = useRef(null);

  const [transactions, setTransactions] =
    useState([]);

  const [fileName, setFileName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // HANDLE FILE
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        console.log(results.data);

        setTransactions(results.data);
      },

      error: (error) => {
        console.error(error);

        alert(
          "Failed to parse CSV file"
        );
      },
    });
  };

  // IMPORT TO FIRESTORE
  const handleImport = async () => {
    try {
      setLoading(true);

      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "User not logged in"
        );

        setLoading(false);
        return;
      }

      for (const item of transactions) {
        await addDoc(
          collection(
            db,
            "expenses"
          ),
          {
            title:
              item.title || "",

            amount:
              Number(
                item.amount
              ) || 0,

            category:
              item.category ||
              "Other",

            date:
              item.date || "",

            userId: user.uid,

            createdAt:
              serverTimestamp(),
          }
        );
      }

      alert(
        "Transactions imported successfully-FinSight AI"
      );

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        "Some Problem - Failed to import transactions "
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15,23,42,0.45)",
        backdropFilter:
          "blur(6px)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "520px",
          background: "#FFFFFF",
          borderRadius: "28px",
          padding: "30px",
          border:
            "1px solid #E5E7EB",
          boxShadow:
            "0 25px 50px rgba(0,0,0,0.12)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border:
              "1px solid #E5E7EB",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            cursor: "pointer",
          }}
        >
          <X
            size={18}
            color="#6B7280"
          />
        </button>

        {/* HEADER */}
        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: "10px",
              color: "#16A34A",
              fontSize: "12px",
              fontWeight: 700,
              textTransform:
                "uppercase",
              letterSpacing:
                "0.14em",
            }}
          >
            Financial Import
          </p>

          <h2
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing:
                "-0.04em",
            }}
          >
            Import Statements
          </h2>

          <p
            style={{
              color: "#6B7280",
              marginTop: "12px",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            Upload CSV bank statements
            to automatically track and
            organize expenses.
          </p>
        </div>

        {/* UPLOAD BOX */}
        <div
          onClick={() =>
            fileRef.current.click()
          }
          style={{
            border:
              "2px dashed #CBD5E1",
            borderRadius: "24px",
            padding: "42px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: "#F9FAFB",
            transition:
              "0.2s ease",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              margin:
                "0 auto 20px auto",
            }}
          >
            <UploadCloud
              size={34}
              color="#16A34A"
            />
          </div>

          <h3
            style={{
              margin: 0,
              marginBottom: "10px",
              fontSize: "20px",
              color: "#111827",
              fontWeight: 700,
            }}
          >
            Upload CSV File
          </h3>

          <p
            style={{
              margin: 0,
              color: "#6B7280",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            Drag & drop your statement
            file here or click to browse.
          </p>

          <p
            style={{
              marginTop: "14px",
              color: "#9CA3AF",
              fontSize: "13px",
            }}
          >
            Supported format: .csv
          </p>
        </div>

        {/* HIDDEN INPUT */}
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          hidden
          onChange={handleFile}
        />

        {/* FILE INFO */}
        {fileName && (
          <div
            style={{
              marginTop: "22px",
              padding: "16px",
              border:
                "1px solid #DCFCE7",
              background: "#F0FDF4",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
              }}
            >
              <FileSpreadsheet
                size={24}
                color="#16A34A"
              />
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  color: "#111827",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {fileName}
              </p>

              <p
                style={{
                  margin: 0,
                  marginTop: "4px",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                CSV file ready for
                processing
              </p>
            </div>
          </div>
        )}

        {/* PREVIEW TABLE */}
        {transactions.length > 0 && (
          <div
            style={{
              marginTop: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                Transaction Preview
              </h3>

              <span
                style={{
                  background:
                    "#DCFCE7",
                  color: "#166534",
                  padding:
                    "6px 12px",
                  borderRadius:
                    "999px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {
                  transactions.length
                }{" "}
                Entries
              </span>
            </div>

            <div
              style={{
                maxHeight: "320px",
                overflowY: "auto",
                border:
                  "1px solid #E5E7EB",
                borderRadius: "18px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead
                  style={{
                    background:
                      "#F9FAFB",
                  }}
                >
                  <tr>
                    {Object.keys(
                      transactions[0]
                    ).map((key) => (
                      <th
                        key={key}
                        style={{
                          textAlign:
                            "left",
                          padding:
                            "14px",
                          borderBottom:
                            "1px solid #E5E7EB",
                          color:
                            "#111827",
                          fontSize:
                            "13px",
                          textTransform:
                            "capitalize",
                        }}
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={index}
                      >
                        {Object.values(
                          item
                        ).map(
                          (
                            value,
                            i
                          ) => (
                            <td
                              key={i}
                              style={{
                                padding:
                                  "14px",
                                borderBottom:
                                  "1px solid #FFFFFF",
                                color:
                                  "#374151",
                                fontSize:
                                  "14px",
                              }}
                            >
                              {value}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div
          style={{
            marginTop: "28px",
            display: "flex",
            justifyContent:
              "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              height: "48px",
              padding:
                "0 20px",
              borderRadius:
                "14px",
              border:
                "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#111827",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleImport}
            disabled={
              transactions.length ===
                0 || loading
            }
            style={{
              height: "48px",
              padding:
                "0 22px",
              borderRadius:
                "14px",
              border: "none",
              background:
                transactions.length >
                  0 && !loading
                  ? "#16A34A"
                  : "#CBD5E1",
              color: "#FFFFFF",
              fontWeight: 600,
              cursor:
                transactions.length >
                  0 && !loading
                  ? "pointer"
                  : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}

            {loading
              ? "Importing..."
              : "Import Transactions"}
          </button>
        </div>
      </div>
    </div>
  );
}