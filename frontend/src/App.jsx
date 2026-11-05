import { useEffect, useMemo, useState } from "react";
import "./App.css";

const DEFAULT_GOAL =
  "Plan a 3-day trip to Goa for 2 people under ₹20,000 including accommodation.";

const DEMO_ACTIONS = [
  {
    type: "success",
    label: "GOAL PARSED",
    text: "Extracting objective, constraints and preferences",
  },
  {
    type: "success",
    label: "PLAN GENERATED",
    text: "Creating an execution plan aligned with the goal",
  },
  {
    type: "success",
    label: "ACTION",
    text: "Searching accommodation options within the target budget",
  },
  {
    type: "warning",
    label: "DEVIATION",
    text: "Agent considers a ₹34,500 luxury resort",
  },
  {
    type: "danger",
    label: "DRIFT DETECTED",
    text: "Current action violates the original budget constraint",
  },
  {
    type: "correction",
    label: "CORRECTION",
    text: "Rejecting conflicting action and restoring original constraints",
  },
  {
    type: "success",
    label: "RECOVERED",
    text: "Agent resumed execution from the corrected goal state",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function parseGoal(text) {
  const safeText = text || "";
  const lower = safeText.toLowerCase();

  let location = "Not specified";

  const destinations = [
    // States
    ["andhra pradesh", "Andhra Pradesh"],
    ["arunachal pradesh", "Arunachal Pradesh"],
    ["assam", "Assam"],
    ["bihar", "Bihar"],
    ["chhattisgarh", "Chhattisgarh"],
    ["goa", "Goa"],
    ["gujarat", "Gujarat"],
    ["haryana", "Haryana"],
    ["himachal pradesh", "Himachal Pradesh"],
    ["jharkhand", "Jharkhand"],
    ["karnataka", "Karnataka"],
    ["kerala", "Kerala"],
    ["madhya pradesh", "Madhya Pradesh"],
    ["maharashtra", "Maharashtra"],
    ["manipur", "Manipur"],
    ["meghalaya", "Meghalaya"],
    ["mizoram", "Mizoram"],
    ["nagaland", "Nagaland"],
    ["odisha", "Odisha"],
    ["punjab", "Punjab"],
    ["rajasthan", "Rajasthan"],
    ["sikkim", "Sikkim"],
    ["tamil nadu", "Tamil Nadu"],
    ["telangana", "Telangana"],
    ["tripura", "Tripura"],
    ["uttar pradesh", "Uttar Pradesh"],
    ["uttarakhand", "Uttarakhand"],
    ["west bengal", "West Bengal"],

    // Union Territories
    ["andaman and nicobar", "Andaman and Nicobar Islands"],
    ["andaman", "Andaman and Nicobar Islands"],
    ["chandigarh", "Chandigarh"],
    ["dadra and nagar haveli and daman and diu",
      "Dadra and Nagar Haveli and Daman and Diu"],
    ["daman", "Daman and Diu"],
    ["daman and diu", "Daman and Diu"],
    ["delhi", "Delhi"],
    ["national capital territory of delhi", "Delhi"],
    ["jammu and kashmir", "Jammu and Kashmir"],
    ["jammu", "Jammu and Kashmir"],
    ["kashmir", "Jammu and Kashmir"],
    ["ladakh", "Ladakh"],
    ["lakshadweep", "Lakshadweep"],
    ["puducherry", "Puducherry"],
    ["pondicherry", "Puducherry"],

    // Major destinations / cities
    ["visakhapatnam", "Visakhapatnam"],
    ["vijayawada", "Vijayawada"],
    ["tirupati", "Tirupati"],

    ["guwahati", "Guwahati"],
    ["kaziranga", "Kaziranga"],

    ["patna", "Patna"],
    ["bodh gaya", "Bodh Gaya"],

    ["raipur", "Raipur"],
    ["bilaspur", "Bilaspur"],

    ["panaji", "Panaji"],
    ["calangute", "Calangute"],
    ["candolim", "Candolim"],

    ["ahmedabad", "Ahmedabad"],
    ["surat", "Surat"],
    ["vadodara", "Vadodara"],
    ["rajkot", "Rajkot"],
    ["kutch", "Kutch"],
    ["rann of kutch", "Rann of Kutch"],

    ["gurgaon", "Gurgaon"],
    ["gurugram", "Gurugram"],
    ["faridabad", "Faridabad"],

    ["shimla", "Shimla"],
    ["manali", "Manali"],
    ["dharamshala", "Dharamshala"],
    ["kasol", "Kasol"],
    ["spiti", "Spiti Valley"],

    ["ranchi", "Ranchi"],
    ["jamshedpur", "Jamshedpur"],

    ["bengaluru", "Bengaluru"],
    ["bangalore", "Bengaluru"],
    ["mysore", "Mysuru"],
    ["mysuru", "Mysuru"],
    ["coorg", "Coorg"],
    ["kodagu", "Kodagu"],
    ["hampi", "Hampi"],
    ["mangalore", "Mangaluru"],
    ["mangaluru", "Mangaluru"],

    ["kochi", "Kochi"],
    ["cochin", "Kochi"],
    ["munnar", "Munnar"],
    ["alleppey", "Alappuzha"],
    ["alappuzha", "Alappuzha"],
    ["kovalam", "Kovalam"],
    ["wayanad", "Wayanad"],

    ["bhopal", "Bhopal"],
    ["indore", "Indore"],
    ["ujjain", "Ujjain"],
    ["khajuraho", "Khajuraho"],

    ["mumbai", "Mumbai"],
    ["pune", "Pune"],
    ["lonavala", "Lonavala"],
    ["mahabaleshwar", "Mahabaleshwar"],
    ["nashik", "Nashik"],
    ["nagpur", "Nagpur"],

    ["imphal", "Imphal"],

    ["shillong", "Shillong"],
    ["cherrapunji", "Cherrapunji"],
    ["sohra", "Sohra"],

    ["aizawl", "Aizawl"],

    ["kohima", "Kohima"],

    ["bhubaneswar", "Bhubaneswar"],
    ["puri", "Puri"],
    ["konark", "Konark"],

    ["amritsar", "Amritsar"],
    ["ludhiana", "Ludhiana"],

    ["jaipur", "Jaipur"],
    ["udaipur", "Udaipur"],
    ["jodhpur", "Jodhpur"],
    ["jaisalmer", "Jaisalmer"],
    ["pushkar", "Pushkar"],
    ["mount abu", "Mount Abu"],

    ["gangtok", "Gangtok"],

    ["chennai", "Chennai"],
    ["ooty", "Ooty"],
    ["coimbatore", "Coimbatore"],
    ["madurai", "Madurai"],
    ["kodaikanal", "Kodaikanal"],
    ["pondicherry", "Puducherry"],

    ["hyderabad", "Hyderabad"],
    ["warangal", "Warangal"],

    ["agartala", "Agartala"],

    ["lucknow", "Lucknow"],
    ["agra", "Agra"],
    ["varanasi", "Varanasi"],
    ["ayodhya", "Ayodhya"],
    ["prayagraj", "Prayagraj"],
    ["mathura", "Mathura"],
    ["rishikesh", "Rishikesh"],
    ["haridwar", "Haridwar"],

    ["dehradun", "Dehradun"],
    ["nainital", "Nainital"],
    ["mussoorie", "Mussoorie"],
    ["jim corbett", "Jim Corbett"],

    ["kolkata", "Kolkata"],
    ["darjeeling", "Darjeeling"],
    ["kalimpong", "Kalimpong"],
    ["siliguri", "Siliguri"],

    ["srinagar", "Srinagar"],
    ["gulmarg", "Gulmarg"],
    ["pahalgam", "Pahalgam"],

    ["leh", "Leh"],
    ["ladakh", "Ladakh"],
  ];

  /*
   * Check longer destination names first.
   * This prevents "delhi" from being selected
   * before "new delhi", etc.
   */
  destinations.sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [key, value] of destinations) {
    if (lower.includes(key)) {
      location = value;
      break;
    }
  }

  const budgetMatch = safeText.match(
    /(?:under|below|within|upto|up to|max(?:imum)?(?: budget)?(?: of)?|budget(?: is| of)?)\s*[₹rs.]?\s*([\d,]+)/i
  );

  const budget = budgetMatch
    ? Number(
        budgetMatch[1].replace(/,/g, "")
      )
    : null;

  const durationMatch = safeText.match(
    /(\d+)\s*[- ]?\s*day/i
  );

  const duration = durationMatch
    ? Number(durationMatch[1])
    : null;

  const peopleMatch = safeText.match(
    /(\d+)\s*(?:people|persons|travelers|travellers|guests)/i
  );

  const people = peopleMatch
    ? Number(peopleMatch[1])
    : null;

  const includesAccommodation =
    lower.includes("accommodation") ||
    lower.includes("hotel") ||
    lower.includes("stay") ||
    lower.includes("resort");

  return {
    objective: lower.includes("trip") ||
      lower.includes("travel")
      ? "Travel planning"
      : lower.includes("hotel") ||
        lower.includes("accommodation")
        ? "Hotel recommendation"
        : lower.includes("laptop")
          ? "Product recommendation"
          : "General task",

    location,
    budget,
    duration,
    people,
    includesAccommodation,
  };
}

function findDriftCandidate(parsedGoal) {
  const location =
    parsedGoal.location === "Not specified"
      ? "Goa"
      : parsedGoal.location;

  return {
    name: `${location} Luxury Resort`,
    location,
    price: 34500,
  };
}

function Score({ value }) {
  const safeValue =
    typeof value === "number"
      ? Math.max(0, Math.min(100, value))
      : 0;

  return (
    <div className="score-bar">
      <div
        className="score-fill"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function App() {
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [submittedGoal, setSubmittedGoal] = useState("");
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [step, setStep] = useState(-1);

  const [driftDetected, setDriftDetected] = useState(null);
  const [corrected, setCorrected] = useState(false);
  const [alignment, setAlignment] = useState(null);
  const [driftCandidate, setDriftCandidate] = useState(null);

  const [violations, setViolations] = useState([]);
  const [driftScore, setDriftScore] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [recommendedAction, setRecommendedAction] =
    useState(null);

  const [detectionExplanation, setDetectionExplanation] =
    useState("");

  const [backendError, setBackendError] = useState("");

  const [hotelRecommendations, setHotelRecommendations] =
    useState([]);

  const [selectedHotel, setSelectedHotel] =
    useState(null);

  const parsedGoal = useMemo(
    () => parseGoal(submittedGoal),
    [submittedGoal]
  );

  /*
   * DEMO ALIGNMENT METRICS
   */

  const semanticScore =
    step >= 4
      ? step === 4
        ? 61
        : 94
      : 93;

  const constraintScore =
    step >= 4
      ? step === 4
        ? 18
        : 98
      : 96;

  const intentScore =
    step >= 4
      ? step === 4
        ? 67
        : 95
      : 94;

  /*
   * AGENT EXECUTION
   */

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    let cancelled = false;

    async function runAgent() {
      try {
        setBackendError("");

        /*
         * STEP 1 — GOAL PARSING
         */

        setStep(1);
        setAlignment(100);

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        if (cancelled) return;

        /*
         * STEP 2 — PLAN GENERATION
         */

        setStep(2);
        setAlignment(100);

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        if (cancelled) return;

        /*
         * STEP 3 — DRIFTING ACTION
         */

        setStep(3);

        const candidate =
          findDriftCandidate(parsedGoal);

        setDriftCandidate(candidate);

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        if (cancelled) return;

        /*
         * STEP 4 — BACKEND DRIFT DETECTION
         */

        const response = await fetch(
          "http://127.0.0.1:8000/detect-drift",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              original_goal: submittedGoal,
              agent_action: `
Select ${candidate.name}
in ${candidate.location}
for ₹${candidate.price} per night.
              `,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned HTTP ${response.status}`
          );
        }

        const detection = await response.json();

        if (cancelled) return;

        /*
         * STORE BACKEND RESULTS
         */

        const backendDriftScore =
          typeof detection.drift_score === "number"
            ? detection.drift_score
            : 0;

        setDriftScore(backendDriftScore);

        setSeverity(
          detection.severity || null
        );

        setRecommendedAction(
          detection.recommended_action || null
        );

        setDetectionExplanation(
          detection.explanation || ""
        );

        setViolations(
          Array.isArray(detection.violations)
            ? detection.violations
            : []
        );

        setDriftDetected(
          Boolean(detection.drift_detected)
        );

        setHotelRecommendations(
          Array.isArray(
            detection.hotel_recommendations
          )
            ? detection.hotel_recommendations
            : []
        );

        const calculatedAlignment =
          Math.round(
            (1 - backendDriftScore) * 100
          );

        setAlignment(
          Math.max(
            0,
            Math.min(
              100,
              calculatedAlignment
            )
          )
        );

        setStep(4);

        await new Promise((resolve) =>
          setTimeout(resolve, 1200)
        );

        if (cancelled) return;

        /*
         * STEP 5 — AUTONOMOUS CORRECTION
         */

        setStep(5);

        if (detection.drift_detected) {
          setCorrected(true);
        }

        setAlignment(100);

        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );

        if (cancelled) return;

        /*
         * COMPLETE
         */

        setCompleted(true);
        setRunning(false);
      } catch (error) {
        console.error(
          "GoalGuard backend error:",
          error
        );

        if (!cancelled) {
          setBackendError(
            "Unable to connect to the GoalGuard detection engine. Make sure the backend is running on http://127.0.0.1:8000."
          );

          setRunning(false);
          setAlignment(null);
        }
      }
    }

    runAgent();

    return () => {
      cancelled = true;
    };
  }, [running, parsedGoal, submittedGoal]);

  /*
   * START AGENT
   */

  function startAgent() {
    const finalGoal =
      goal.trim() || DEFAULT_GOAL;

    setSubmittedGoal(finalGoal);

    setStep(-1);
    setCompleted(false);
    setRunning(true);

    setDriftDetected(null);
    setCorrected(false);
    setAlignment(null);
    setDriftCandidate(null);

    setViolations([]);
    setDriftScore(null);
    setSeverity(null);
    setRecommendedAction(null);
    setDetectionExplanation("");
    setBackendError("");

    setHotelRecommendations([]);
    setSelectedHotel(null);

    setTimeout(() => {
      document
        .getElementById("dashboard")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  /*
   * RESET
   */

  function reset() {
    setGoal(DEFAULT_GOAL);
    setSubmittedGoal("");

    setRunning(false);
    setStep(-1);
    setCompleted(false);

    setDriftDetected(null);
    setCorrected(false);
    setAlignment(null);
    setDriftCandidate(null);

    setViolations([]);
    setDriftScore(null);
    setSeverity(null);
    setRecommendedAction(null);
    setDetectionExplanation("");
    setBackendError("");

    setHotelRecommendations([]);
    setSelectedHotel(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openHotel(hotel) {
    setSelectedHotel(hotel);
  }

  function closeHotel() {
    setSelectedHotel(null);
  }

  return (
    <div className="app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">

        <div>
          <div className="brand">
            Goal<span>Guard</span>
          </div>

          <div className="tagline">
            AUTONOMOUS GOAL-DRIFT DETECTION & CORRECTION
          </div>
        </div>

        <div className="system-status">
          <span />

          {running
            ? "AGENT ACTIVE"
            : "SYSTEM ONLINE"}
        </div>

      </header>

      <main className="container">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="hero">

          <div className="eyebrow">
            AI AGENT CONTROL LAYER
          </div>

          <h1>
            Keep autonomous agents
            <br />
            <span>
              aligned with their mission.
            </span>
          </h1>

          <p>
            GoalGuard continuously evaluates an
            agent&apos;s actions against its original
            objective, detects goal drift, explains the
            deviation, and autonomously restores
            alignment.
          </p>

          <div className="goal-input-card">

            <label>
              ORIGINAL MISSION
            </label>

            <textarea
              value={goal}
              onChange={(event) =>
                setGoal(event.target.value)
              }
              disabled={running}
              placeholder={DEFAULT_GOAL}
            />

            <div className="input-footer">

              <span>
                Define the objective the agent must
                never lose sight of.
              </span>

              <button
                onClick={startAgent}
                disabled={running}
              >
                {running
                  ? "AGENT RUNNING..."
                  : "START AGENT →"}
              </button>

            </div>

          </div>

        </section>

        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        <section id="dashboard">

          <div className="section-heading">
            <span>01</span>
            LIVE AGENT CONTROL CENTER
          </div>

          {/* ===================================================
              PROTECTED GOAL STATE
          =================================================== */}

          <div className="panel fingerprint-panel">

            <div className="mission-lock-panel">

              <div className="mission-lock-header">

                <div>
                  <small>
                    PROTECTED GOAL STATE
                  </small>

                  <h2>
                    Mission Constraints
                  </h2>
                </div>

                <div className="mission-lock-status">
                  <span>🔒</span>
                  CONSTRAINTS LOCKED
                </div>

              </div>

              <div className="mission-lock-grid">

                <div className="mission-constraint">

                  <div className="constraint-icon">
                    🎯
                  </div>

                  <div>
                    <small>
                      OBJECTIVE
                    </small>

                    <strong>
                      {parsedGoal.objective}
                    </strong>
                  </div>

                </div>

                <div className="mission-constraint">

                  <div className="constraint-icon">
                    📍
                  </div>

                  <div>
                    <small>
                      LOCATION
                    </small>

                    <strong>
                      {parsedGoal.location}
                    </strong>
                  </div>

                </div>

                <div className="mission-constraint">

                  <div className="constraint-icon">
                    ₹
                  </div>

                  <div>
                    <small>
                      MAXIMUM BUDGET
                    </small>

                    <strong>
                      {parsedGoal.budget
                        ? `₹${formatCurrency(
                            parsedGoal.budget
                          )}`
                        : "Not specified"}
                    </strong>
                  </div>

                </div>

                <div className="mission-constraint">

                  <div className="constraint-icon">
                    ◷
                  </div>

                  <div>
                    <small>
                      DURATION
                    </small>

                    <strong>
                      {parsedGoal.duration
                        ? `${parsedGoal.duration} days`
                        : "Not specified"}
                    </strong>
                  </div>

                </div>

                <div className="mission-constraint">

                  <div className="constraint-icon">
                    👥
                  </div>

                  <div>
                    <small>
                      TRAVELERS
                    </small>

                    <strong>
                      {parsedGoal.people ||
                        "Not specified"}
                    </strong>
                  </div>

                </div>

                <div className="mission-constraint">

                  <div className="constraint-icon">
                    🏨
                  </div>

                  <div>
                    <small>
                      REQUIREMENT
                    </small>

                    <strong>
                      {parsedGoal.includesAccommodation
                        ? "Accommodation Required"
                        : "General"}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="mission-lock-footer">

                <span className="lock-pulse" />

                <span>
                  These constraints are protected by
                  GoalGuard and cannot be overridden
                  by the autonomous agent.
                </span>

              </div>

            </div>

            <div className="panel-title">

              <div>
                <small>
                  GOAL STATE
                </small>

                <h2>
                  Goal Fingerprint
                </h2>
              </div>

              <div className="live-pill">
                ●{" "}
                {running
                  ? "MONITORING"
                  : "READY"}
              </div>

            </div>

            <div className="fingerprint">

              <div className="fingerprint-item">
                <small>OBJECTIVE</small>

                <strong>
                  {parsedGoal.objective}
                </strong>
              </div>

              <div className="fingerprint-item">
                <small>LOCATION</small>

                <strong>
                  {parsedGoal.location}
                </strong>
              </div>

              <div className="fingerprint-item">
                <small>BUDGET</small>

                <strong>
                  {parsedGoal.budget
                    ? `₹${formatCurrency(
                        parsedGoal.budget
                      )}`
                    : "Not specified"}
                </strong>
              </div>

              <div className="fingerprint-item">
                <small>DURATION</small>

                <strong>
                  {parsedGoal.duration
                    ? `${parsedGoal.duration} days`
                    : "Not specified"}
                </strong>
              </div>

              <div className="fingerprint-item">
                <small>PEOPLE</small>

                <strong>
                  {parsedGoal.people ||
                    "Not specified"}
                </strong>
              </div>

              <div className="fingerprint-item">
                <small>REQUIREMENT</small>

                <strong>
                  {parsedGoal.includesAccommodation
                    ? "Accommodation"
                    : "General"}
                </strong>
              </div>

            </div>

          </div>

          {/* ===================================================
              MAIN MONITOR
          =================================================== */}

          <div className="monitor-grid">

            <div className="panel trace-panel">

              <div className="panel-title">

                <div>
                  <small>
                    EXECUTION
                  </small>

                  <h2>
                    Agent Activity
                  </h2>
                </div>

                <span className="counter">
                  {Math.max(
                    step + 1,
                    0
                  )}{" "}
                  / {DEMO_ACTIONS.length}
                </span>

              </div>

              <div className="trace">

                {DEMO_ACTIONS.map(
                  (action, index) => {

                    const active =
                      index <= step;

                    return (
                      <div
                        className={`trace-item ${
                          active
                            ? "active"
                            : ""
                        } ${
                          index === step
                            ? "current"
                            : ""
                        } ${
                          action.type ===
                            "danger" &&
                          index <= step
                            ? "danger"
                            : ""
                        }`}
                        key={action.label}
                      >

                        <div className="trace-line">

                          <div className="trace-dot">
                            {index < step
                              ? "✓"
                              : index === step
                                ? "●"
                                : index + 1}
                          </div>

                          {index !==
                            DEMO_ACTIONS.length -
                              1 && (
                            <div className="vertical-line" />
                          )}

                        </div>

                        <div className="trace-content">

                          <small>
                            {action.label}
                          </small>

                          <p>
                            {action.text}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            <div className="panel alignment-panel">

              <div className="panel-title">

                <div>
                  <small>
                    REAL-TIME ANALYSIS
                  </small>

                  <h2>
                    Goal Alignment
                  </h2>
                </div>

              </div>

              <div className="big-score">

                {alignment === null
                  ? "—"
                  : alignment}

                <span>
                  /100
                </span>

              </div>

              {driftScore !== null && (
                <div className="monitor-message">

                  Backend drift score:{" "}

                  <strong>
                    {Math.round(
                      driftScore * 100
                    )}
                    %
                  </strong>

                  {severity &&
                    ` · ${severity}`}

                </div>
              )}

              {backendError && (
                <div className="monitor-message">
                  {backendError}
                </div>
              )}

              <div className="alignment-status">

                {step === 4 ? (
                  <>
                    <span className="warning-dot" />
                    GOAL DRIFT DETECTED
                  </>
                ) : completed ? (
                  <>
                    <span className="success-dot" />
                    GOAL RESTORED
                  </>
                ) : (
                  <>
                    <span className="success-dot" />
                    {running
                      ? "ALIGNED"
                      : "READY"}
                  </>
                )}

              </div>

              <Score value={alignment} />

              <div className="metric-list">

                <div>
                  <span>
                    Semantic Alignment
                  </span>

                  <strong>
                    {semanticScore}%
                  </strong>
                </div>

                <div>
                  <span>
                    Constraint Alignment
                  </span>

                  <strong>
                    {constraintScore}%
                  </strong>
                </div>

                <div>
                  <span>
                    Intent Alignment
                  </span>

                  <strong>
                    {intentScore}%
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* ===================================================
              02 — DRIFT ANALYSIS
          =================================================== */}

          {step >= 3 && (

            <section
              className={`drift-panel ${
                step === 4
                  ? "drift-active"
                  : "drift-recovered"
              }`}
            >

              <div className="drift-header">

                <div>

                  <div className="section-heading">
                    <span>02</span>
                    DRIFT ANALYSIS ENGINE
                  </div>

                  <h2>
                    {step === 4
                      ? "Goal Drift Detected"
                      : "Goal Drift Corrected"}
                  </h2>

                </div>

                <div className="drift-score">

                  <span>
                    DRIFT SCORE
                  </span>

                  <strong>
                    {driftScore !== null
                      ? driftScore.toFixed(2)
                      : "—"}
                  </strong>

                </div>

              </div>

              {step === 4 ? (

                <div className="drift-grid">

                  <div>
                    <label>
                      TRIGGER
                    </label>

                    <p>
                      Agent selected an
                      accommodation that
                      violates the original
                      budget.
                    </p>
                  </div>

                  <div>
                    <label>
                      EXPECTED
                    </label>

                    <p>
                      Budget ≤{" "}
                      {parsedGoal.budget
                        ? `₹${formatCurrency(
                            parsedGoal.budget
                          )}`
                        : "original constraint"}
                    </p>
                  </div>

                  <div>
                    <label>
                      OBSERVED
                    </label>

                    <p>
                      {driftCandidate
                        ? `${driftCandidate.name} — ₹${formatCurrency(
                            driftCandidate.price
                          )}`
                        : "Luxury resort — ₹34,500"}
                    </p>
                  </div>

                  <div>
                    <label>
                      CLASSIFICATION
                    </label>

                    <p className="orange">
                      {severity ||
                        "HIGH-SEVERITY CONSTRAINT VIOLATION"}
                    </p>
                  </div>

                </div>

              ) : (

                <div className="correction-success">

                  <div className="success-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Autonomous recovery
                      successful
                    </strong>

                    <p>
                      The conflicting action
                      was rejected, the
                      original goal state was
                      restored, and the agent
                      resumed execution.
                    </p>

                  </div>

                </div>

              )}

            </section>

          )}

          {/* ===================================================
              AGENT ACTION BLOCKED
          =================================================== */}

          {step === 4 && (

            <section className="blocked-action-panel">

              <div className="blocked-action-glow" />

              <div className="blocked-action-header">

                <div className="blocked-action-title">

                  <div className="blocked-icon">
                    !
                  </div>

                  <div>
                    <small>
                      GOALGUARD INTERVENTION
                    </small>

                    <h2>
                      Agent Action Blocked
                    </h2>
                  </div>

                </div>

                <div className="blocked-status">
                  ACTION REJECTED
                </div>

              </div>

              <div className="blocked-action-grid">

                <div className="blocked-action-info">

                  <label>
                    PROPOSED ACTION
                  </label>

                  <strong>
                    {driftCandidate?.name ||
                      "Luxury Resort"}
                  </strong>

                  <span>
                    {driftCandidate?.location ||
                      "Goa"}
                  </span>

                </div>

                <div className="blocked-action-info">

                  <label>
                    PROPOSED COST
                  </label>

                  <strong className="blocked-price">
                    ₹
                    {formatCurrency(
                      driftCandidate?.price ||
                        34500
                    )}
                    /night
                  </strong>

                  <span>
                    Exceeds protected budget
                  </span>

                </div>

                <div className="blocked-action-info">

                  <label>
                    PROTECTED LIMIT
                  </label>

                  <strong>
                    {parsedGoal.budget
                      ? `₹${formatCurrency(
                          parsedGoal.budget
                        )}`
                      : "Original constraint"}
                  </strong>

                  <span>
                    Maximum allowed mission budget
                  </span>

                </div>

              </div>

              <div className="blocked-reason">

                <div className="blocked-reason-icon">
                  ×
                </div>

                <div>

                  <strong>
                    CONSTRAINT VIOLATION
                  </strong>

                  <p>
                    GoalGuard detected that the
                    proposed action conflicts with
                    a protected mission constraint.
                    The action has been prevented
                    from continuing.
                  </p>

                </div>

              </div>

              <div className="blocked-footer">

                <div className="blocked-processing">

                  <span className="blocked-pulse" />

                  <span>
                    REPLANNING EXECUTION PATH...
                  </span>

                </div>

                <div className="blocked-score">

                  DRIFT{" "}
                  <strong>
                    {driftScore !== null
                      ? Math.round(
                          driftScore * 100
                        )
                      : 0}
                    %
                  </strong>

                </div>

              </div>

            </section>

          )}

          {/* ===================================================
              03 — CONSTRAINT VIOLATION MATRIX
          =================================================== */}

          {step >= 4 && (

            <section className="constraint-matrix-panel">

              <div className="section-heading">
                <span>03</span>
                CONSTRAINT ANALYSIS
              </div>

              <div className="constraint-matrix-header">

                <div>

                  <small>
                    GOALGUARD VALIDATION ENGINE
                  </small>

                  <h2>
                    Constraint Violation Matrix
                  </h2>

                  <p>
                    GoalGuard compares the proposed
                    agent action against every
                    protected constraint extracted
                    from the original mission.
                  </p>

                </div>

                <div className="constraint-summary">

                  <strong>
                    {violations.length}
                  </strong>

                  <span>
                    {violations.length === 1
                      ? "VIOLATION"
                      : "VIOLATIONS"}
                  </span>

                </div>

              </div>

              <div className="constraint-table">

                {/* LOCATION */}

                <div className="constraint-row">

                  <div className="constraint-name">

                    <span className="constraint-icon">
                      ◎
                    </span>

                    <div>
                      <strong>
                        Location
                      </strong>

                      <small>
                        Destination constraint
                      </small>
                    </div>

                  </div>

                  <div className="constraint-expected">

                    <small>
                      EXPECTED
                    </small>

                    <strong>
                      {parsedGoal.location}
                    </strong>

                  </div>

                  <div className="constraint-observed">

                    <small>
                      OBSERVED
                    </small>

                    <strong>
                      {driftCandidate?.location ||
                        parsedGoal.location}
                    </strong>

                  </div>

                  <div className="constraint-status success">
                    <span>✓</span>
                    SATISFIED
                  </div>

                </div>

                {/* BUDGET */}

                <div className="constraint-row">

                  <div className="constraint-name">

                    <span className="constraint-icon">
                      ₹
                    </span>

                    <div>
                      <strong>
                        Budget
                      </strong>

                      <small>
                        Maximum mission budget
                      </small>
                    </div>

                  </div>

                  <div className="constraint-expected">

                    <small>
                      EXPECTED
                    </small>

                    <strong>
                      {parsedGoal.budget
                        ? `≤ ₹${formatCurrency(
                            parsedGoal.budget
                          )}`
                        : "Not specified"}
                    </strong>

                  </div>

                  <div className="constraint-observed">

                    <small>
                      OBSERVED
                    </small>

                    <strong
                      className={
                        step === 4
                          ? "constraint-danger-text"
                          : ""
                      }
                    >
                      ₹
                      {formatCurrency(
                        driftCandidate?.price ||
                          34500
                      )}
                      /night
                    </strong>

                  </div>

                  <div
                    className={`constraint-status ${
                      step === 4
                        ? "danger"
                        : "success"
                    }`}
                  >
                    <span>
                      {step === 4
                        ? "×"
                        : "✓"}
                    </span>

                    {step === 4
                      ? "VIOLATED"
                      : "RESOLVED"}
                  </div>

                </div>

                {/* DURATION */}

                <div className="constraint-row">

                  <div className="constraint-name">

                    <span className="constraint-icon">
                      ◷
                    </span>

                    <div>
                      <strong>
                        Duration
                      </strong>

                      <small>
                        Trip duration
                      </small>
                    </div>

                  </div>

                  <div className="constraint-expected">

                    <small>
                      EXPECTED
                    </small>

                    <strong>
                      {parsedGoal.duration
                        ? `${parsedGoal.duration} days`
                        : "Not specified"}
                    </strong>

                  </div>

                  <div className="constraint-observed">

                    <small>
                      OBSERVED
                    </small>

                    <strong>
                      {parsedGoal.duration
                        ? `${parsedGoal.duration} days`
                        : "Not specified"}
                    </strong>

                  </div>

                  <div className="constraint-status success">

                    <span>✓</span>
                    SATISFIED

                  </div>

                </div>

                {/* PEOPLE */}

                <div className="constraint-row">

                  <div className="constraint-name">

                    <span className="constraint-icon">
                      ◉
                    </span>

                    <div>
                      <strong>
                        Travelers
                      </strong>

                      <small>
                        Number of people
                      </small>
                    </div>

                  </div>

                  <div className="constraint-expected">

                    <small>
                      EXPECTED
                    </small>

                    <strong>
                      {parsedGoal.people ||
                        "Not specified"}
                    </strong>

                  </div>

                  <div className="constraint-observed">

                    <small>
                      OBSERVED
                    </small>

                    <strong>
                      {parsedGoal.people ||
                        "Not specified"}
                    </strong>

                  </div>

                  <div className="constraint-status success">

                    <span>✓</span>
                    SATISFIED

                  </div>

                </div>

                {/* ACCOMMODATION */}

                <div className="constraint-row">

                  <div className="constraint-name">

                    <span className="constraint-icon">
                      ⌂
                    </span>

                    <div>
                      <strong>
                        Accommodation
                      </strong>

                      <small>
                        Required stay
                      </small>
                    </div>

                  </div>

                  <div className="constraint-expected">

                    <small>
                      EXPECTED
                    </small>

                    <strong>
                      {parsedGoal.includesAccommodation
                        ? "Required"
                        : "Not required"}
                    </strong>

                  </div>

                  <div className="constraint-observed">

                    <small>
                      OBSERVED
                    </small>

                    <strong>
                      {driftCandidate
                        ? "Resort proposed"
                        : "Not evaluated"}
                    </strong>

                  </div>

                  <div className="constraint-status success">

                    <span>✓</span>
                    SATISFIED

                  </div>

                </div>

                {/* ACCOMMODATION COST */}

                <div className="constraint-row">

                  <div className="constraint-name">

                    <span className="constraint-icon">
                      ₹
                    </span>

                    <div>
                      <strong>
                        Accommodation Cost
                      </strong>

                      <small>
                        Stay cost impact
                      </small>
                    </div>

                  </div>

                  <div className="constraint-expected">

                    <small>
                      EXPECTED
                    </small>

                    <strong>
                      {parsedGoal.budget
                        ? `≤ ₹${formatCurrency(
                            parsedGoal.budget
                          )}`
                        : "Protected budget"}
                    </strong>

                  </div>

                  <div className="constraint-observed">

                    <small>
                      OBSERVED
                    </small>

                    <strong
                      className={
                        step === 4
                          ? "constraint-danger-text"
                          : "constraint-success-text"
                      }
                    >
                      ₹
                      {formatCurrency(
                        driftCandidate?.price ||
                          34500
                      )}
                      /night
                    </strong>

                  </div>

                  <div
                    className={`constraint-status ${
                      step === 4
                        ? "danger"
                        : "success"
                    }`}
                  >

                    <span>
                      {step === 4
                        ? "×"
                        : "✓"}
                    </span>

                    {step === 4
                      ? "IMPACT"
                      : "RESOLVED"}

                  </div>

                </div>

              </div>

              <div className="constraint-matrix-result">

                <div className="constraint-result-icon">
                  {violations.length > 0
                    ? "!"
                    : "✓"}
                </div>

                <div>

                  <strong>
                    {step === 4
                      ? "Constraint violation detected"
                      : "Constraint violation resolved"}
                  </strong>

                  <p>
                    {step === 4
                      ? `GoalGuard identified ${violations.length} protected ${
                          violations.length === 1
                            ? "constraint"
                            : "constraints"
                        } violation and prevented the agent from continuing along the conflicting execution path.`
                      : "GoalGuard blocked the conflicting action and restored execution using the original protected mission constraints."}
                  </p>

                </div>

              </div>

            </section>

          )}

          {/* ===================================================
              04 — BEFORE / AFTER
          =================================================== */}

          {step >= 5 && (

            <section className="comparison-panel">

              <div className="section-heading">
                <span>04</span>
                GOALGUARD INTERVENTION
              </div>

              <div className="comparison-header">

                <div>

                  <small>
                    EXECUTION COMPARISON
                  </small>

                  <h2>
                    Before vs After GoalGuard
                  </h2>

                  <p>
                    Compare the drifting agent action
                    with the corrected execution path
                    restored from the original mission.
                  </p>

                </div>

                <div className="comparison-status">
                  ✓ MISSION RESTORED
                </div>

              </div>

              <div className="comparison-grid">

                {/* BEFORE */}

                <div className="comparison-card comparison-before">

                  <div className="comparison-card-header">

                    <div>
                      <small>
                        BEFORE GOALGUARD
                      </small>

                      <h3>
                        Drifting Action
                      </h3>
                    </div>

                    <div className="comparison-icon danger-icon">
                      !
                    </div>

                  </div>

                  <div className="comparison-action">

                    <span className="comparison-label">
                      AGENT ACTION
                    </span>

                    <strong>
                      {driftCandidate?.name ||
                        "Luxury Resort"}
                    </strong>

                    <span>
                      {driftCandidate?.location ||
                        "Goa"}
                    </span>

                  </div>

                  <div className="comparison-details">

                    <div>
                      <span>
                        PROPOSED PRICE
                      </span>

                      <strong className="danger-text">
                        ₹
                        {formatCurrency(
                          driftCandidate?.price ||
                            34500
                        )}
                        /night
                      </strong>
                    </div>

                    <div>
                      <span>
                        GOAL LIMIT
                      </span>

                      <strong>
                        {parsedGoal.budget
                          ? `₹${formatCurrency(
                              parsedGoal.budget
                            )}`
                          : "Not specified"}
                      </strong>
                    </div>

                  </div>

                  <div className="comparison-result danger-result">

                    <span className="comparison-result-icon">
                      ×
                    </span>

                    <div>
                      <strong>
                        CONSTRAINT VIOLATED
                      </strong>

                      <p>
                        Proposed accommodation
                        exceeds the protected
                        mission budget.
                      </p>
                    </div>

                  </div>

                </div>

                {/* ARROW */}

                <div className="comparison-arrow">

                  <div className="comparison-arrow-line" />

                  <div className="comparison-arrow-icon">
                    →
                  </div>

                  <span>
                    GOALGUARD
                    <br />
                    REPLANS
                  </span>

                </div>

                {/* AFTER */}

                <div className="comparison-card comparison-after">

                  <div className="comparison-card-header">

                    <div>
                      <small>
                        AFTER GOALGUARD
                      </small>

                      <h3>
                        Corrected Action
                      </h3>
                    </div>

                    <div className="comparison-icon success-icon-small">
                      ✓
                    </div>

                  </div>

                  <div className="comparison-action">

                    <span className="comparison-label">
                      SAFE EXECUTION
                    </span>

                    <strong>
                      Goal-Aligned Accommodation
                    </strong>

                    <span>
                      {parsedGoal.location}
                    </span>

                  </div>

                  <div className="comparison-details">

                    <div>

                      <span>
                        SELECTED RANGE
                      </span>

                      <strong className="success-text">

                        {hotelRecommendations.length >
                        0
                          ? `₹${formatCurrency(
                              Math.min(
                                ...hotelRecommendations.map(
                                  (hotel) =>
                                    Number(
                                      hotel.price_per_night
                                    ) || 0
                                )
                              )
                            )}/night`
                          : "Within budget"}

                      </strong>

                    </div>

                    <div>

                      <span>
                        GOAL LIMIT
                      </span>

                      <strong>
                        {parsedGoal.budget
                          ? `₹${formatCurrency(
                              parsedGoal.budget
                            )}`
                          : "Protected"}
                      </strong>

                    </div>

                  </div>

                  <div className="comparison-result success-result">

                    <span className="comparison-result-icon">
                      ✓
                    </span>

                    <div>

                      <strong>
                        GOAL CONSTRAINT SATISFIED
                      </strong>

                      <p>
                        The conflicting action was
                        rejected and execution was
                        restored to the original
                        mission constraints.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </section>

          )}

          {/* ===================================================
              05 — AGENT DECISION LOG
          =================================================== */}

          {step >= 1 && (

            <section className="decision-log-panel">

              <div className="section-heading">
                <span>05</span>
                AGENT DECISION LOG
              </div>

              <div className="decision-log-header">

                <div>

                  <small>
                    AUTONOMOUS CONTROL TRACE
                  </small>

                  <h2>
                    Decision Timeline
                  </h2>

                  <p>
                    GoalGuard records the critical
                    decisions made while monitoring
                    and correcting the agent execution
                    path.
                  </p>

                </div>

                <div className="decision-log-status">

                  <span className="decision-status-dot" />

                  {step >= 5
                    ? "TRACE COMPLETE"
                    : "TRACE ACTIVE"}

                </div>

              </div>

              <div className="decision-log">

                {/* EVENT 1 */}

                <div className="decision-event completed">

                  <div className="decision-time">
                    00:01
                  </div>

                  <div className="decision-marker">
                    ✓
                  </div>

                  <div className="decision-content">

                    <div className="decision-title">
                      GOAL INITIALIZED
                    </div>

                    <p>
                      Original mission received and
                      converted into a protected goal
                      state.
                    </p>

                  </div>

                </div>

                {/* EVENT 2 */}

                {step >= 2 && (

                  <div className="decision-event completed">

                    <div className="decision-time">
                      00:02
                    </div>

                    <div className="decision-marker">
                      ✓
                    </div>

                    <div className="decision-content">

                      <div className="decision-title">
                        CONSTRAINTS LOCKED
                      </div>

                      <p>
                        Budget{" "}
                        {parsedGoal.budget
                          ? `₹${formatCurrency(
                              parsedGoal.budget
                            )}`
                          : "constraint"}{" "}
                        ·{" "}
                        {parsedGoal.location} ·{" "}
                        {parsedGoal.duration
                          ? `${parsedGoal.duration} days`
                          : "duration"}{" "}
                        ·{" "}
                        {parsedGoal.people
                          ? `${parsedGoal.people} travelers`
                          : "traveler count"}.
                      </p>

                    </div>

                  </div>

                )}

                {/* EVENT 3 */}

                {step >= 2 && (

                  <div className="decision-event completed">

                    <div className="decision-time">
                      00:03
                    </div>

                    <div className="decision-marker">
                      ✓
                    </div>

                    <div className="decision-content">

                      <div className="decision-title">
                        EXECUTION PLAN GENERATED
                      </div>

                      <p>
                        Agent began execution using the
                        protected goal state as its
                        reference.
                      </p>

                    </div>

                  </div>

                )}

                {/* EVENT 4 */}

                {step >= 3 && (

                  <div className="decision-event warning">

                    <div className="decision-time">
                      00:04
                    </div>

                    <div className="decision-marker">
                      !
                    </div>

                    <div className="decision-content">

                      <div className="decision-title">
                        ACTION PROPOSED
                      </div>

                      <p>
                        Agent proposed{" "}
                        <strong>
                          {driftCandidate?.name ||
                            "Luxury Resort"}
                        </strong>{" "}
                        in{" "}
                        <strong>
                          {driftCandidate?.location ||
                            parsedGoal.location}
                        </strong>{" "}
                        at{" "}
                        <strong>
                          ₹
                          {formatCurrency(
                            driftCandidate?.price ||
                              34500
                          )}
                          /night
                        </strong>
                        .
                      </p>

                    </div>

                  </div>

                )}

                {/* EVENT 5 */}

                {step >= 4 && (

                  <div className="decision-event danger-event">

                    <div className="decision-time">
                      00:05
                    </div>

                    <div className="decision-marker">
                      ×
                    </div>

                    <div className="decision-content">

                      <div className="decision-title">
                        CONSTRAINT VIOLATION DETECTED
                      </div>

                      <p>
                        {violations.length > 0
                          ? violations[0]
                          : "The proposed action violates a protected mission constraint."}
                      </p>

                      {driftScore !== null && (

                        <div className="decision-inline-data">

                          DRIFT SCORE{" "}

                          <strong>
                            {Math.round(
                              driftScore * 100
                            )}
                            %
                          </strong>

                          {severity && (
                            <>
                              {" · "}
                              SEVERITY{" "}

                              <strong>
                                {severity}
                              </strong>
                            </>
                          )}

                        </div>

                      )}

                    </div>

                  </div>

                )}

                {/* EVENT 6 */}

                {step >= 5 && (

                  <div className="decision-event blocked-event">

                    <div className="decision-time">
                      00:06
                    </div>

                    <div className="decision-marker">
                      ×
                    </div>

                    <div className="decision-content">

                      <div className="decision-title">
                        ACTION BLOCKED
                      </div>

                      <p>
                        GoalGuard prevented the
                        conflicting action from
                        continuing into execution.
                      </p>

                      <div className="decision-inline-data">

                        RECOMMENDED ACTION{" "}

                        <strong>
                          {recommendedAction ||
                            "REPLAN"}
                        </strong>

                      </div>

                    </div>

                  </div>

                )}

                {/* EVENT 7 */}

                {step >= 5 && (

                  <div className="decision-event correction-event">

                    <div className="decision-time">
                      00:07
                    </div>

                    <div className="decision-marker">
                      ↻
                    </div>

                    <div className="decision-content">

                      <div className="decision-title">
                        REPLAN TRIGGERED
                      </div>

                      <p>
                        GoalGuard restored the original
                        goal state and generated a
                        corrected execution path.
                      </p>

                      {detectionExplanation && (

                        <div className="decision-explanation">
                          {detectionExplanation}
                        </div>

                      )}

                    </div>

                  </div>

                )}

                {/* EVENT 8 */}

                {step >= 5 && (

                  <div className="decision-event recovered-event">

                    <div className="decision-time">
                      00:08
                    </div>

                    <div className="decision-marker">
                      ✓
                    </div>

                    <div className="decision-content">

                      <div className="decision-title">
                        GOAL STATE RESTORED
                      </div>

                      <p>
                        The agent resumed execution
                        with the original mission
                        constraints preserved.
                      </p>

                      <div className="decision-recovery">

                        <span className="success-dot" />

                        <strong>
                          ALIGNMENT RESTORED · 100%
                        </strong>

                      </div>

                    </div>

                  </div>

                )}

              </div>

              <div className="decision-log-footer">

                <div className="decision-log-summary">

                  <span className="success-dot" />

                  <strong>
                    {step >= 5
                      ? "CONTROL LOOP COMPLETED"
                      : "MONITORING AGENT DECISIONS"}
                  </strong>

                </div>

                <span>
                  {step >= 5
                    ? "8 decision events recorded"
                    : `${Math.max(
                        step,
                        1
                      )} decision ${
                        Math.max(step, 1) === 1
                          ? "event"
                          : "events"
                      } recorded`}
                </span>

              </div>

            </section>

          )}

          {/* ===================================================
              06 — HOTEL RECOMMENDATIONS
          =================================================== */}

          {step >= 5 &&
            hotelRecommendations.length > 0 && (

              <section className="hotel-panel">

                <div className="section-heading">
                  <span>06</span>
                  GOAL-ALIGNED RECOMMENDATIONS
                </div>

                <div className="hotel-header">

                  <div>

                    <small>
                      CORRECTED EXECUTION PATH
                    </small>

                    <h2>
                      Recommended Accommodation
                    </h2>

                    <p>
                      The original accommodation
                      constraint has been restored.
                      These options stay within the
                      protected mission budget.
                    </p>

                  </div>

                  <div className="hotel-status">
                    ● GOAL ALIGNED
                  </div>

                </div>

                <div className="hotel-grid">

                  {hotelRecommendations.map(
                    (hotel, index) => {

                      const pricePerNight =
                        Number(
                          hotel.price_per_night
                        ) || 0;

                      const nights =
                        Number(
                          hotel.nights
                        ) || 1;

                      const totalStay =
                        Number(
                          hotel.total_stay
                        ) ||
                        pricePerNight * nights;

                      const withinBudget =
                        Boolean(
                          hotel.within_budget
                        );

                      return (
                        <div
                          className={`hotel-card ${
                            withinBudget
                              ? "hotel-valid"
                              : "hotel-over-budget"
                          }`}
                          key={`${hotel.name}-${index}`}
                          onClick={() =>
                            openHotel(hotel)
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {

                            if (
                              event.key ===
                                "Enter" ||
                              event.key ===
                                " "
                            ) {
                              event.preventDefault();
                              openHotel(hotel);
                            }

                          }}
                        >

                          <div className="hotel-image-wrapper">

                            <img
                              src={
                                hotel.image_url ||
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                              }
                              alt={`${hotel.name} in ${hotel.location}`}
                              className="hotel-image"
                            />

                            <div
                              className={`hotel-badge ${
                                withinBudget
                                  ? "valid"
                                  : "invalid"
                              }`}
                            >
                              {withinBudget
                                ? "WITHIN GOAL"
                                : "OVER BUDGET"}
                            </div>

                          </div>

                          <div className="hotel-card-content">

                            <div className="hotel-card-top">

                              <div>

                                <small>
                                  OPTION{" "}
                                  {index + 1}
                                </small>

                                <h3>
                                  {hotel.name}
                                </h3>

                              </div>

                            </div>

                            <div className="hotel-location">
                              {hotel.location}
                            </div>

                            <div className="hotel-price-row">

                              <div>

                                <small>
                                  PER NIGHT
                                </small>

                                <strong>
                                  ₹
                                  {formatCurrency(
                                    pricePerNight
                                  )}
                                </strong>

                              </div>

                              <div>

                                <small>
                                  {nights}{" "}
                                  {nights === 1
                                    ? "NIGHT"
                                    : "NIGHTS"}
                                </small>

                                <strong>
                                  ₹
                                  {formatCurrency(
                                    totalStay
                                  )}
                                </strong>

                              </div>

                            </div>

                            <div className="hotel-selection">

                              {withinBudget ? (
                                <>
                                  <span className="success-dot" />
                                  Recommended for corrected plan
                                </>
                              ) : (
                                <>
                                  <span className="warning-dot" />
                                  Exceeds accommodation allowance
                                </>
                              )}

                            </div>

                            <div className="hotel-view-label">
                              VIEW HOTEL DETAILS →
                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                <div className="recommendation-message">

                  <div className="success-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      GoalGuard selected a safer
                      execution path
                    </strong>

                    <p>
                      The ₹34,500 conflicting
                      accommodation was rejected.
                      The agent can continue using
                      an accommodation option that
                      respects the original mission
                      constraints.
                    </p>

                  </div>

                </div>

              </section>

            )}

          {/* ===================================================
              HOTEL DETAIL MODAL
          =================================================== */}

          {selectedHotel && (

            <div
              className="hotel-modal-backdrop"
              onClick={closeHotel}
            >

              <div
                className="hotel-modal"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <button
                  className="hotel-modal-close"
                  onClick={closeHotel}
                  aria-label="Close hotel details"
                >
                  ×
                </button>

                <img
                  src={
                    selectedHotel.image_url ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80"
                  }
                  alt={selectedHotel.name}
                  className="hotel-modal-image"
                />

                <div className="hotel-modal-content">

                  <div className="hotel-modal-label">
                    GOAL-ALIGNED ACCOMMODATION
                  </div>

                  <h2>
                    {selectedHotel.name}
                  </h2>

                  <div className="hotel-modal-location">
                    {selectedHotel.location}
                  </div>

                  <p className="hotel-modal-description">
                    {selectedHotel.description ||
                      "Accommodation option selected from the corrected execution path."}
                  </p>

                  <div className="hotel-modal-stats">

                    <div>

                      <small>
                        PER NIGHT
                      </small>

                      <strong>
                        ₹
                        {formatCurrency(
                          Number(
                            selectedHotel.price_per_night
                          ) || 0
                        )}
                      </strong>

                    </div>

                    <div>

                      <small>
                        NIGHTS
                      </small>

                      <strong>
                        {Number(
                          selectedHotel.nights
                        ) || 1}
                      </strong>

                    </div>

                    <div>

                      <small>
                        TOTAL STAY
                      </small>

                      <strong>
                        ₹
                        {formatCurrency(
                          Number(
                            selectedHotel.total_stay
                          ) || 0
                        )}
                      </strong>

                    </div>

                  </div>

<div className="hotel-modal-goal">

  <span
    className={
      selectedHotel.within_budget
        ? "success-dot"
        : "warning-dot"
    }
  />

  <div>

    <strong>
      {selectedHotel.within_budget
        ? "Within the protected goal"
        : "Outside the accommodation allowance"}
    </strong>

    <p>
      {selectedHotel.within_budget
        ? "This option respects the accommodation budget selected by GoalGuard during recovery."
        : "This option exceeds the accommodation allowance and should not be selected for the corrected execution path."}
    </p>

  </div>

</div>

                  <div className="hotel-modal-actions">

                    <button
                      className="hotel-primary-button"
                      onClick={() => {

                        if (
                          selectedHotel.hotel_url
                        ) {
                          window.open(
                            selectedHotel.hotel_url,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }

                      }}
                    >
                      VIEW HOTEL ONLINE →
                    </button>

                    <button
                      className="hotel-secondary-button"
                      onClick={closeHotel}
                    >
                      CLOSE
                    </button>

                  </div>

                  <div className="hotel-demo-note">
                    Demo recommendation · Pricing is
                    controlled by the GoalGuard research
                    dataset.
                  </div>

                </div>

              </div>

            </div>

          )}

          {/* ===================================================
              07 — AUTONOMOUS INTERVENTION
          =================================================== */}

          {step >= 5 && (

            <section className="correction-panel">

              <div className="section-heading">
                <span>07</span>
                AUTONOMOUS INTERVENTION
              </div>

              <div className="correction-grid">

                <div className="correction-card">

                  <small>
                    DETECTION
                  </small>

                  <strong>
                    Constraint violation
                  </strong>

                  <p>
                    The current action conflicts
                    with the stored goal fingerprint.
                  </p>

                </div>

                <div className="correction-card">

                  <small>
                    DECISION
                  </small>

                  <strong>
                    Reject current action
                  </strong>

                  <p>
                    The agent is prevented from
                    continuing along the drifting path.
                  </p>

                </div>

                <div className="correction-card">

                  <small>
                    RECOVERY
                  </small>

                  <strong>
                    Re-plan from goal
                  </strong>

                  <p>
                    Original constraints are restored
                    before generating the next action.
                  </p>

                </div>

              </div>

            </section>

          )}

          {/* ===================================================
              08 — FINAL SESSION RESULT
          =================================================== */}

          {completed && (

            <section className="result-panel">

              <div className="section-heading">
                <span>08</span>
                SESSION RESULT
              </div>

              <div className="result-grid">

                <div className="result-card">

                  <small>
                    FINAL ALIGNMENT
                  </small>

                  <strong>
                    100%
                  </strong>

                  <span>
                    Recovered
                  </span>

                </div>

                <div className="result-card">

                  <small>
                    DRIFT EVENTS
                  </small>

                  <strong>
                    1
                  </strong>

                  <span>
                    Detected
                  </span>

                </div>

                <div className="result-card">

                  <small>
                    CORRECTIONS
                  </small>

                  <strong>
                    1
                  </strong>

                  <span>
                    Successful
                  </span>

                </div>

                <div className="result-card">

                  <small>
                    RECOVERY
                  </small>

                  <strong>
                    100%
                  </strong>

                  <span>
                    Goal restored
                  </span>

                </div>

              </div>

              <div className="final-message">

                <div className="final-check">
                  ✓
                </div>

                <div>

                  <h3>
                    Original objective preserved
                  </h3>

                  <p>
                    GoalGuard detected the agent&apos;s
                    deviation, identified the violated
                    constraint, autonomously corrected
                    the execution path, and restored
                    alignment with the original goal.
                  </p>

                </div>

              </div>

              <button
                className="reset-button"
                onClick={reset}
              >
                RUN ANOTHER MISSION
              </button>

            </section>

          )}

        </section>

      </main>

      <footer>

        <span>
          GOALGUARD
        </span>

        <span>
          LLM AGENT ALIGNMENT & CONTROL SYSTEM
        </span>

      </footer>

    </div>
  );
}

export default App;