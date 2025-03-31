const IP = "localhost"; // Change this if the IP address if changing wifi // localhost if django is on the same network

export const fetchPowerData = async (timeframe) => {
  // get graph data
  try {
    const url = `http://${IP}:8000/api/power-data/?start=${timeframe}`;
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

// function for fetching appliance names
export const fetchApplianceNames = async () => {
  try {
    const url = `http://${IP}:8000/names/get-names/`;
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
    const response = await fetch(`http://${IP}:8000/names/update-name/`, {
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

// Fetch daily challenges
export const fetchChallenges = async () => {
  try {
    const response = await fetch(`http://${IP}:8000/challenges/?t=${new Date().getTime()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch challenges. Status: ${response.status}`);
    }
    const data = await response.json();

    return data.challenges.map((c) => ({
      ...c,
      claimed: c.claimed || false, // Ensure `claimed` is always defined
      status: c.status || false,   // Ensure `status` is always defined
      points: c.points || 0,       // Ensure `points` always has a value
    }));
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }
};

// Fetch weekly challenges
export const fetchWeeklyChallenges = async () => {
  try {
    const response = await fetch(`http://${IP}:8000/challenges/weekly/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch weekly challenges. Status: ${response.status}`);
    }
    const data = await response.json();

    return data.weekly_challenges.map((c) => ({
      ...c,
      claimed: c.claimed || false,
      status: c.status || false,
      points: c.points || 0,
    }));
  } catch (error) {
    console.error("Error fetching weekly challenges:", error);
    return [];
  }
};

// Complete a daily challenge
export const completeChallenge = async (challengeId) => {
  try {
    const response = await fetch(`http://${IP}:8000/challenges/complete/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challengeId }),
    });

    const result = await response.json();
    console.log("Challenge Completion Response:", result);

    if (!response.ok || !result.success) {
      throw new Error(`Failed to complete challenge: ${result.error || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error completing challenge:", error);
    return false;
  }
};

// Complete a weekly challenge
export const completeWeeklyChallenge = async (challengeId) => {
  try {
    const response = await fetch(`http://${IP}:8000/challenges/weekly/complete/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challengeId }),
    });

    const result = await response.json();
    console.log("Weekly Challenge Completion Response:", result);

    if (!response.ok || !result.success) {
      throw new Error(`Failed to complete weekly challenge: ${result.error || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error completing weekly challenge:", error);
    return false;
  }
};

// Claim points for a daily challenge
export const claimChallengePoints = async (challengeId) => {
  try {
    const response = await fetch(`http://${IP}:8000/challenges/claim-points/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challengeId }),
    });

    const data = await response.json();
    console.log("Challenge Claim Response:", data);

    return data.success || false;
  } catch (error) {
    console.error("Error claiming challenge points:", error);
    return false;
  }
};

// Claim points for a weekly challenge
export const claimWeeklyChallengePoints = async (challengeId) => {
  try {
    const response = await fetch(`http://${IP}:8000/challenges/weekly/claim-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challengeId }),
    });

    const data = await response.json();
    console.log("Weekly Challenge Claim Response:", data);

    return data.success || false;
  } catch (error) {
    console.error("Error claiming weekly challenge points:", error);
    return false;
  }
};

export const fetchTotalPoints = async () => {
  try {
    const response = await fetch(`http://${IP}:8000/achievements/total-points/`); 
    if (!response.ok) {
      throw new Error(`Failed to fetch total points. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.total_points || 0; // Ensure it always returns a number
  } catch (error) {
    console.error("Error fetching total points:", error);
    return 0; // Return 0 if there's an error
  }
};

// badges
export const fetchUnlockedBadges = async () => {
  try {
    const response = await fetch(`http://${IP}:8000/achievements/unlocked-badges/`);
    if (!response.ok) throw new Error("Failed to fetch unlocked badges");
    const data = await response.json();
    return data.unlocked_badges;
  } catch (error) {
    console.error("Error fetching unlocked badges:", error);
    return [];
  }
};
