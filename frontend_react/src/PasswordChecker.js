import React from "react";
import Image from "./image.svg";
import "./password-checker.css";
function PasswordChecker() {
  const [password, setPassword] = React.useState("");
  const [score, setScore] = React.useState(0);
  const [color, setColor] = React.useState("");
  const [message, setMessage] = React.useState("Enter Password");
  const [apiResponse, setApiResponse] = React.useState(null);

  function handleChange(e) {
    setPassword(e.target.value);
    checkPassword(e.target.value);
  }

  function checkPassword(password) {
    var score = 0;
    if (!password) {
      setScore(null);
      return;
    }
    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i = 0; i < password.length; i++) {
      letters[password[i]] = (letters[password[i]] || 0) + 1;
      score += 5.0 / letters[password[i]];
    }
    // bonus points for mixing it up
    var variations = {
      digits: /\d/.test(password),
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      nonWords: /\W/.test(password),
    };
    var variationCount = 0;
    for (var check in variations) {
      variationCount += variations[check] === true ? 1 : 0;
    }
    score += (variationCount - 1) * 10;
    setScore(parseInt(score));
    if (score > 80) {
      setColor("bg-success");
      setMessage("Strong Password");
    } else if (score > 60) {
      setColor("bg-primary");
      setMessage("Medium Password");
    } else if (score >= 30) {
      setColor("bg-warning");
      setMessage("Weak Password");
    } else {
      setColor("bg-danger");
      setMessage("Very Weak Password");
    }
  }

  //   password check by api
  function checkPasswordByApi(password) {
    fetch("check-password-strength", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "password-checker.p.rapidapi.com",
        "x-rapidapi-key": "your api key",
      },
      body: JSON.stringify({ password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        setApiResponse(data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="row m-0 passowrd-checker">
      <div className="col-12 col-md-6 d-none d-md-block bg-dark d-flex justify-content-center align-items-center">
        <div
          className="text-center position-fixed text-center w-50"
          style={{ top: "20%" }}
        >
          <img src={Image} alt="Password Checker" style={{ width: "300px" }} />
          <h1 className="text-white">
            <b>Password Strength Checker</b>
          </h1>
          <p className="text-white">
            This powerful tool is designed to help you assess the strength of
            your passwords
            <br /> and ensure your online security
          </p>
        </div>
      </div>
      <div className="col-12 col-md-6 pt-5">
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className={`form-control rounded-0 border-0 border-bottom shadow-none`}
            id="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter password"
          />
          <small className="text-muted">Your Password Strength</small>
          <div className="progress">
            <div
              className={`progress-bar ${color}`}
              role="progressbar"
              style={{ width: `${score}%` }}
              aria-valuenow={score}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
            <span className="progress-value">{message}</span>
          </div>
        </div>
        <button
          type="submit"
          onClick={() => checkPasswordByApi(password)}
          className="btn btn-primary mt-2"
        >
          Analysis Password
        </button>

        <div className="password-api-response mt-3">
          {apiResponse && (
            <div className="p-2">
              {console.log(apiResponse)}
              <h4>API Response</h4>
              {/* divider */}
              <hr />
              <p>
                <b>Score:</b> {apiResponse.score}
              </p>
              <p>
                <b>Crack Time:</b>
                <pre>
                  {JSON.stringify(apiResponse.crack_times_display, null, 2)}
                </pre>
              </p>
              <p>
                <b>Feedback:</b>
                <pre>{JSON.stringify(apiResponse.feedback, null, 2)}</pre>
              </p>
              <p>
                <b>Sequence:</b>
                {/* butify json sting */}
                <pre>{JSON.stringify(apiResponse.sequence, null, 2)}</pre>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordChecker;
