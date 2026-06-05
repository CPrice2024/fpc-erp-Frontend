
import { useState } from "react";


import {
  DollarSign,
  Users,
  CreditCard,
  Upload,
} from "lucide-react";

import "./Finance.css";

export default function Finance() {
  const [formData,
    setFormData] =
    useState({
      student: "",
      paymentType: "Paid",
      paymentMethod:
        "Cash",
      amount: "",
      transactionId: "",
      slip: null,
    });

  const records = [
    {
      id: 1,
      student:
        "Abebe Kebede",
      type: "Paid",
      amount: 12000,
      method: "Cash",
      status:
        "Completed",
    },
    {
      id: 2,
      student:
        "Tigist Alemu",
      type: "Funded",
      amount: 0,
      method: "-",
      status:
        "Funded",
    },
  ];

  const handleChange =
    (e) => {
      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    (e) => {
      e.preventDefault();

      alert(
        "Payment Saved"
      );
    };

  return (

        <div className="finance-page">

          {/* Cards */}

          <div className="finance-cards">

            <div className="finance-card">
              <Users />
              <h2>520</h2>
              <p>
                Total Students
              </p>
            </div>

            <div className="finance-card">
              <DollarSign />
              <h2>350</h2>
              <p>
                Paid Students
              </p>
            </div>

            <div className="finance-card">
              <CreditCard />
              <h2>170</h2>
              <p>
                Funded Students
              </p>
            </div>

            <div className="finance-card">
              <DollarSign />
              <h2>
                ETB 2.4M
              </h2>
              <p>
                Revenue
              </p>
            </div>

          </div>

          {/* Payment Form */}

          <div className="card">

            <h2>
              Register Payment
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="form-grid">

                <input
                  placeholder="Student ID"
                  name="student"
                  onChange={
                    handleChange
                  }
                />

                <select
                  name="paymentType"
                  value={
                    formData.paymentType
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option>
                    Paid
                  </option>

                  <option>
                    Funded
                  </option>
                </select>

                <select
                  name="paymentMethod"
                  value={
                    formData.paymentMethod
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option>
                    Cash
                  </option>

                  <option>
                    Bank
                  </option>

                  <option>
                    Telebirr
                  </option>

                  <option>
                    CBE Birr
                  </option>
                </select>

                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="transactionId"
                  placeholder="Transaction ID"
                  onChange={
                    handleChange
                  }
                />

                <div className="upload-box">
                  <Upload
                    size={18}
                  />

                  <input
                    type="file"
                  />
                </div>

              </div>

              <button
                className="save-btn"
              >
                Save Payment
              </button>

            </form>

          </div>

          {/* History */}

          <div className="card">

            <h2>
              Payment History
            </h2>

            <table>

              <thead>
                <tr>
                  <th>
                    Student
                  </th>
                  <th>
                    Type
                  </th>
                  <th>
                    Amount
                  </th>
                  <th>
                    Method
                  </th>
                  <th>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {records.map(
                  (item) => (
                    <tr
                      key={
                        item.id
                      }
                    >
                      <td>
                        {
                          item.student
                        }
                      </td>

                      <td>
                        {
                          item.type
                        }
                      </td>

                      <td>
                        ETB{" "}
                        {
                          item.amount
                        }
                      </td>

                      <td>
                        {
                          item.method
                        }
                      </td>

                      <td>
                        <span
                          className={`status ${item.type.toLowerCase()}`}
                        >
                          {
                            item.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
  );
}