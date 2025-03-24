export const fetchPowerData = async (timeframe) => {
  // get graph data
  try {
    const url = `http://192.168.254.156:8000/api/power-data/?start=${timeframe}`; // change the IP if changing devices
    console.log("Fetching:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching power data:", error);
    return null;
  }
};

// ✅ New function for fetching appliance names
export const fetchApplianceNames = async () => {
  try {
    const url = "http://192.168.254.156:8000/names/get-names/";
    console.log("Fetching appliance names:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.names || {}; // Return the names object
  } catch (error) {
    console.error("Error fetching appliance names:", error);
    return {};
  }
};

// update appliance name
export const updateApplianceName = async (id, newName) => {
  try {
    const response = await fetch("http://192.168.254.156:8000/names/update-name/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity_id: id, name: newName })
    });

    if (!response.ok) {
      throw new Error("Failed to update appliance name");
    }

    return newName; // Return the updated name
  } catch (error) {
    console.error("Error updating appliance name:", error);
    return null;
  }
};

export const fetchChallenges = async () => {
  try {
    const response = await fetch(`http://192.168.254.156:8000/challenges/?t=${new Date().getTime()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch challenges. Status: ${response.status}`);
    }
    const data = await response.json();

    return data.challenges.map((c) => ({
      ...c,
      claimed: c.claimed || false, // ✅ Ensure `claimed` always exists
      points: c.points || 0,       // ✅ Ensure `points` always has a value
    }));
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }
};

export const fetchWeeklyChallenges = async () => {
  try {
    const response = await fetch("http://192.168.254.156:8000/challenges/weekly/");
    if (!response.ok) {
      throw new Error(`Failed to fetch weekly challenges. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.weekly_challenges || [];
  } catch (error) {
    console.error("Error fetching weekly challenges:", error);
    return [];
  }
};


// ✅ Complete a challenge
export const completeChallenge = async (challengeId) => {
  try {
    const response = await fetch("http://192.168.254.156:8000/challenges/complete/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: challengeId }),
    });

    const result = await response.json();
    console.log("Challenge Completion Response:", result);

    if (!response.ok) {
      throw new Error(`Failed to update challenge: ${result.error || "Unknown error"}`);
    }

    return result.success || false;  // Return true if successful, false otherwise
  } catch (error) {
    console.error("Error completing challenge:", error);
    return false;
  }
};

export const claimChallengePoints = async (challengeId) => {
  try {
    const response = await fetch("http://192.168.254.156:8000/challenges/claim-points/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challengeId }),
    });
    

    const data = await response.json();
    console.log("Challenge Claim Response:", data);

    return data.success; // ✅ Ensure it returns success or failure
  } catch (error) {
    console.error("Error claiming challenge points:", error);
    return false;
  }
};


// ✅ Complete a weekly challenge
export const completeWeeklyChallenge = async (challengeId) => {
  try {
    const response = await fetch("http://192.168.254.156:8000/challenges/weekly/complete/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: challengeId }),
    });

    const result = await response.json();
    console.log("Weekly Challenge Completion Response:", result);

    if (!response.ok) {
      throw new Error(`Failed to complete weekly challenge: ${result.error || "Unknown error"}`);
    }

    return result.success || false;
  } catch (error) {
    console.error("Error completing weekly challenge:", error);
    return false;
  }
};

// ✅ Claim points for a weekly challenge
export const claimWeeklyChallengePoints = async (challengeId) => {
  try {
    const response = await fetch("http://192.168.254.156:8000/challenges/weekly/claim-points/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challengeId }),
    });

    const data = await response.json();
    console.log("Weekly Challenge Claim Response:", data);

    return data.success; // ✅ Return success status
  } catch (error) {
    console.error("Error claiming weekly challenge points:", error);
    return false;
  }
};




