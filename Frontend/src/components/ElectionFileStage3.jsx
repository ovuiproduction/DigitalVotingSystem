import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/ElectionFileStage3.css";

import sjLogo from "../Assets/images/satyamev-jayate-logo.png";
import ecLogo from "../Assets/images/Election_Commission_of_India_Logo.png";

export default function ElectionFileStage3() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminId = location.state?.adminId;
  const electionFileId = location.state?.electionFileId;
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [ballotPaper, setBallotPaper] = useState([]);

  const [labelClass, setLabelClass] = useState(
    "election-stage-3-label-input-voterid-before"
  );
  const customSelectWrapperRef = useRef(null);
  const selectItemsRef = useRef(null);
  const selectSelectedRef = useRef(null);

  const handleFocus = () => {
    setLabelClass("election-stage-3-label-input-voterid-after");
  };

  const handleBlur = () => {
    if (!candidateName) {
      setLabelClass("election-stage-3-label-input-voterid-before");
    }
  };

  const handleElectionFileStage3Completion = async () => {
    try {
      navigate("/election-file/stage-4",{state:{electionFileId:electionFileId,adminId:adminId}});
    } catch (error) {}
  };

  const onCandidateAdd = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/election-file/stage-3/candidate-Add",
        {
          electionFileId,
          candidateName: candidateName,
          candidateParty: candidateParty,
        }
      );
      if (response.status == 200) {
        alert("data saved successfully...");
        selectedCandidatesList();
        setCandidateName('');
        setCandidateParty('');
      } else if (response.status == 400) {
        alert("server not responding...");
      }
    } catch (error) {
      alert("Data not saved due to some technical errors\ntry again");
    }
  };

  const selectedCandidatesList = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/election-file/stage-3/selected-candidate-list",
        { electionFileId }
      );
      if (response.status == 200) {
        let ballot = response.data.data;
        console.log(ballot);
        setBallotPaper(ballot);
        console.log("ballot paper", ballotPaper);
      } else if (response.status == 400) {
        alert("server not responding...");
      }
    } catch (error) {
      alert("Data not saved due to some technical errors\ntry again");
    }
  };

  useEffect(() => {
    selectedCandidatesList();
  }, []);

  return (
    <>
      <header className="election-stage-3-voter-details-header">
        <ul>
          <li>
            <div className="election-stage-3-voter-details-header-Logo">
              <img src={ecLogo} alt="" />
            </div>
          </li>
          <li>
            <div className="election-stage-3-voter-details-header-text">
              <h1>Election Commission Of India</h1>
            </div>
          </li>
          <li>
            <div className="election-stage-3-voter-details-header-Logo">
              <img src={sjLogo} alt="" />
            </div>
          </li>
        </ul>
      </header>
      <nav className="election-stage-3-voter-details-nav">
        <ul>
          <li>
            <div className="election-stage-3-voter-details-menu-block">
              <i className="fa-solid fa-bars election-stage-3-voter-details-menu-icon menuBtn"></i>
              <h3 className="election-stage-3-voter-details-nav-text menuBtn">
                Menu
              </h3>
            </div>
          </li>
        </ul>
      </nav>
      <div className="election-stage-3-main-block-voter-details">
        <div className="election-stage-3-voter-details-main-block">
          <h3>Loksabha Election 2024</h3>
          <form className="election-stage-3-voter-details-form">
            <div className="election-stage-3-input-text-field">
              <div className="election-stage-3-input-block-1">
                <label
                  id="loginLabelVoterID"
                  className={labelClass}
                  htmlFor="loginInputVoterId"
                >
                  Enter Candidate Name
                </label>
                <br />
                <input
                  className="election-stage-3-input-voterid"
                  id="loginInputVoterId"
                  name="voterid"
                  placeholder=""
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="election-stage-3-custom-select-wrapper">
              <select
                className="election-stage-3-voter-details-form-select"
                value={candidateParty}
                onChange={(e) => setCandidateParty(e.target.value)}
              >
                <option value="">Please select party</option>
                <option value="BJP">BJP</option>
                <option value="Congress">Congress</option>
              </select>
            </div>
            <div className="election-stage-3-input-text-field election-stage-3-sumbitbtnfield">
              <button
                onClick={onCandidateAdd}
                className="election-stage-3-submitbtn"
                type="button"
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <div className="election-stage-3-Added-candidate-outer-block">
          <ul>
            {ballotPaper &&
              ballotPaper.map((candidate, index) => (
                <li key={index}>
                  <h1>{index + 1}</h1>
                  <h1>{candidate.candidateName}</h1>
                  <img
                    src={sjLogo}
                    alt={candidate.candidateName}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="election-stage-3-proceed-next-btn">
        <button
          onClick={handleElectionFileStage3Completion}
          className="election-stage-3-submitbtn-proceed"
          type="button"
        >
          Submit & Proceed
        </button>
      </div>
    </>
  );
}