import React, { useState } from "react";
import styled from "styled-components";
import { line } from "./Line";
import { getUp, getDown } from "./Fetchdata";

// Main App Component
const App = () => {
  const [selectedLine, setSelectedLine] = useState(null); // Store selected line
  const [upStations, setUpStations] = useState([]); // Store UP station data
  const [downStations, setDownStations] = useState([]); // Store DOWN station data
  const [currTime, setCurrTime] = useState(""); // Store current time

  // Handle line selection
  const handleLineClick = (lineCode) => {
    setSelectedLine(lineCode); // Set the selected line
    fetchStationData(lineCode); // Fetch data for that line
  };

  // Fetch station data
  const fetchStationData = async (lineCode) => {
    const lineStations = line[lineCode].sta;
    const upResults = [];
    const downResults = [];

    // Fetch data for each station
    for (let station of lineStations) {
      const { code, name } = station;

      const result1 = await getUp(lineCode, code); // Get UP direction data
      if (result1) {
        upResults.push({
          name,
          ...result1,
        });
        setCurrTime(result1.currTime); // Set current time
      }

      const result2 = await getDown(lineCode, code); // Get DOWN direction data
      if (result2) {
        downResults.push({
          name,
          ...result2,
        });
      }
    }

    // Update state
    setUpStations(upResults);
    setDownStations(downResults);
  };

  return (
    <Container>
      <Title>MTR Real-time Train Information</Title>

      {/* Line Buttons */}
      <ButtonContainer>
        {Object.keys(line).map((linescode) => (
          <LineButton
            key={linescode}
            onClick={() => handleLineClick(linescode)}
            color={line[linescode].color}
          >
            {line[linescode].text}
          </LineButton>
        ))}
      </ButtonContainer>

      {selectedLine && (
        <div>
          <Subtitle>Selected Lines: {line[selectedLine].text}</Subtitle>
          <TimeUpdate> Last Updated Time: {currTime.split(" ")[1]}</TimeUpdate>

          <StationContainer>
            <Subtitle>Up</Subtitle>
            {upStations.map((station, index) => (
              <StationCard key={index} bgColor={line[selectedLine].color}>
                <h3>{station.name}</h3>
                <p>下班列車: {station.nextTime}</p>
                <p>月台: {station.platform}</p>
              </StationCard>
            ))}
          </StationContainer>

          <StationContainer>
            <Subtitle>Down</Subtitle>
            {downStations.map((station, index) => (
              <StationCard key={index} bgColor={line[selectedLine].color}>
                <h3>{station.name}</h3>
                <p>下班列車: {station.nextTime}</p>
                <p>月台: {station.platform}</p>
              </StationCard>
            ))}
          </StationContainer>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  margin: 0;
  text-align: center;
  font-family: Arial, sans-serif;
`;

const ButtonContainer = styled.div`
  margin: 20px 0;
`;

const LineButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  color: ${({ color }) => color};
  border: 2px solid ${({ color }) => color};
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ color }) => color};
    color: white;
  }
`;

const StationContainer = styled.div`
  margin: 20px 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StationCard = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  color: white;
  text-align: left;
  width: 200px;
`;

const Title = styled.h1`
  color: #333;
`;

const Subtitle = styled.h2`
  margin: 15px 0;
`;

const TimeUpdate = styled.p`
  font-style: italic;
  color: #555;
`;

export default App;
